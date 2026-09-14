-- ============================================================================
-- ELEVATE Admin — read model and pipeline write (DRAFT, NOT A MIGRATION)
-- ============================================================================
--
-- Status: design artefact for the Admin phase. It is NOT in supabase/migrations
-- and is NOT applied anywhere. It is executed on top of the Builder migration
-- by scripts/check-admin-contract.ts, which proves that every field promised in
-- docs/admin/DATA_CONTRACT.md is derivable from the Builder schema.
--
-- When Admin is built, this file is promoted to a migration (after
-- 20260914120000_builder_leads.sql) unchanged or with reviewed changes.
--
-- Security model (same as the Builder):
--   * RLS on, no policies; everything revoked from public/anon/authenticated;
--     only service_role executes. The public Builder's server functions never
--     call any builder_admin_* function.
--   * The Admin server function verifies the Supabase Auth session, then passes
--     the verified user id as p_actor. Writes re-check the allowlist here, so
--     a bug in the server layer cannot turn a non-admin into an actor.
--   * No function returns access_token_hash.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Allowlist: who is an Admin. Rows are added by the owner (SQL editor), never
-- by sign-up. user_id is auth.users.id (no FK so the file also runs in tests).
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id     uuid primary key,
  email       text not null check (char_length(email) between 3 and 255),
  added_at    timestamptz not null default now(),
  revoked_at  timestamptz
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from public, anon, authenticated;
grant select, insert, update, delete on public.admin_users to service_role;

create function public.builder_admin_is_active(p_user uuid)
returns boolean
language sql stable set search_path = public, pg_temp as $$
  select exists (select 1 from public.admin_users where user_id = p_user and revoked_at is null)
$$;

-- ---------------------------------------------------------------------------
-- Leads list: filters, search, keyset pagination on (created_at desc, id desc)
-- ---------------------------------------------------------------------------
create function public.builder_admin_list_leads(
  p_status         public.builder_lead_status default null,
  p_lifecycle      public.builder_lifecycle default null,
  p_project_type   public.builder_project_type default null,
  p_notification   public.builder_notification_status default null,
  p_search         text default null,
  p_limit          integer default 25,
  p_cursor_created timestamptz default null,
  p_cursor_id      uuid default null)
returns jsonb
language plpgsql stable set search_path = public, pg_temp as $$
declare
  v_limit integer := least(greatest(coalesce(p_limit, 25), 1), 100);
  v_pattern text;
  v_items jsonb;
  v_total integer;
  v_rows integer;
begin
  if char_length(p_search) > 100 then
    raise exception 'BUILDER:INVALID_INPUT';
  end if;
  if (p_cursor_created is null) <> (p_cursor_id is null) then
    raise exception 'BUILDER:INVALID_INPUT';
  end if;
  -- Search is literal: % and _ typed by the Admin match themselves.
  v_pattern := case when nullif(btrim(p_search), '') is null then null
                    else '%' || replace(replace(replace(btrim(p_search), '\', '\\'), '%', '\%'), '_', '\_') || '%' end;

  with filtered as (
    select l.* from public.builder_leads l
     where (p_status is null or l.status = p_status)
       and (p_lifecycle is null or l.lifecycle = p_lifecycle)
       and (p_project_type is null or l.project_type = p_project_type)
       and (p_notification is null or l.notification_status = p_notification)
       and (v_pattern is null
            or l.company ilike v_pattern or l.industry ilike v_pattern
            or l.contact_name ilike v_pattern or l.contact_email ilike v_pattern
            or l.contact_company ilike v_pattern)
  ),
  page as (
    select * from filtered f
     where p_cursor_created is null or (f.created_at, f.id) < (p_cursor_created, p_cursor_id)
     order by f.created_at desc, f.id desc
     limit v_limit + 1
  )
  select
    (select count(*) from filtered),
    (select count(*) from page),
    coalesce((select jsonb_agg(jsonb_build_object(
        'id', p.id, 'company', p.company, 'industry', p.industry, 'projectType', p.project_type,
        'lifecycle', p.lifecycle, 'status', p.status, 'lang', p.lang,
        'contactName', p.contact_name, 'contactEmail', p.contact_email,
        'budgetCzk', p.budget_czk, 'deadline', p.deadline, 'generationCount', p.generation_count,
        'hasSelection', p.selected_concept_id is not null,
        'notificationStatus', p.notification_status,
        'createdAt', p.created_at, 'updatedAt', p.updated_at, 'submittedAt', p.submitted_at)
        order by p.created_at desc, p.id desc)
       from (select * from page order by created_at desc, id desc limit v_limit) p), '[]'::jsonb)
  into v_total, v_rows, v_items;

  return jsonb_build_object(
    'items', v_items,
    'total', v_total,
    'nextCursor', case when v_rows > v_limit then jsonb_build_object(
                    'createdAt', v_items -> (v_limit - 1) ->> 'createdAt',
                    'id', v_items -> (v_limit - 1) ->> 'id') end);
end $$;

-- ---------------------------------------------------------------------------
-- Lead detail: everything Admin shows for one lead. Null when not found.
-- ---------------------------------------------------------------------------
create function public.builder_admin_get_lead(p_lead uuid)
returns jsonb
language sql stable set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'id', l.id,
    'lifecycle', l.lifecycle,
    'status', l.status,
    'lang', l.lang,
    'projectType', l.project_type,
    'brief', jsonb_build_object(
      'company', l.company, 'industry', l.industry, 'offering', l.offering,
      'audience', l.audience, 'goal', l.goal,
      'visual', jsonb_build_object(
        'style', l.visual_style, 'mood', l.visual_mood, 'colors', l.visual_colors,
        'typography', l.visual_typography, 'notes', l.visual_notes),
      'references', l.brief_references),
    'contact', case when l.contact_email is null then null else jsonb_build_object(
      'name', l.contact_name, 'email', l.contact_email, 'company', l.contact_company,
      'message', l.contact_message) end,
    'budget', jsonb_build_object('index', l.budget_index, 'czk', l.budget_czk),
    'deadline', l.deadline,
    'selectedConceptId', l.selected_concept_id,
    'generationCount', l.generation_count,
    'notification', jsonb_build_object(
      'status', l.notification_status, 'attempts', l.notification_attempts,
      'lastAttemptAt', l.notification_last_attempt_at, 'deliveredAt', l.notified_at),
    'timestamps', jsonb_build_object(
      'createdAt', l.created_at, 'updatedAt', l.updated_at,
      'selectedAt', l.selected_at, 'submittedAt', l.submitted_at),
    'generations', coalesce((
      select jsonb_agg(g.obj order by g.generation desc)
        from (select c.generation, jsonb_build_object(
                'generation', c.generation,
                'createdAt', min(c.created_at),
                'supersededAt', min(c.superseded_at),
                'concepts', jsonb_agg(jsonb_build_object(
                  'id', c.id, 'position', c.position, 'source', c.source,
                  'name', c.name, 'archetype', c.archetype, 'revision', c.revision,
                  'current', c.superseded_at is null,
                  'selected', c.id is not distinct from l.selected_concept_id,
                  'originalSpec', c.original_spec, 'spec', c.spec,
                  'createdAt', c.created_at, 'updatedAt', c.updated_at,
                  'revisions', coalesce((
                    select jsonb_agg(jsonb_build_object(
                      'id', r.id, 'revision', r.revision, 'kind', r.kind, 'feedback', r.feedback,
                      'restoredFrom', r.restored_from, 'specBefore', r.spec_before,
                      'specAfter', r.spec_after, 'createdAt', r.created_at) order by r.revision)
                      from public.builder_revisions r where r.concept_id = c.id), '[]'::jsonb))
                  order by c.position)) as obj
                from public.builder_concepts c
               where c.lead_id = l.id
               group by c.generation) g), '[]'::jsonb),
    'statusHistory', coalesce((
      select jsonb_agg(jsonb_build_object(
               'fromStatus', e.from_status, 'toStatus', e.to_status, 'note', e.note,
               'changedBy', e.changed_by, 'changedByEmail', a.email, 'createdAt', e.created_at)
             order by e.id)
        from public.builder_status_events e
        left join public.admin_users a on a.user_id = e.changed_by
       where e.lead_id = l.id), '[]'::jsonb)
  )
  from public.builder_leads l
  where l.id = p_lead
$$;

-- ---------------------------------------------------------------------------
-- Concepts across leads (gallery). Current spec included for thumbnails.
-- ---------------------------------------------------------------------------
create function public.builder_admin_list_concepts(
  p_current_only   boolean default true,
  p_selected_only  boolean default false,
  p_limit          integer default 24,
  p_cursor_created timestamptz default null,
  p_cursor_id      uuid default null)
returns jsonb
language plpgsql stable set search_path = public, pg_temp as $$
declare
  v_limit integer := least(greatest(coalesce(p_limit, 24), 1), 60);
  v_items jsonb;
  v_rows integer;
begin
  if (p_cursor_created is null) <> (p_cursor_id is null) then
    raise exception 'BUILDER:INVALID_INPUT';
  end if;
  with page as (
    select c.*, l.company, l.selected_concept_id, l.lifecycle as lead_lifecycle
      from public.builder_concepts c join public.builder_leads l on l.id = c.lead_id
     where (not p_current_only or c.superseded_at is null)
       and (not p_selected_only or c.id = l.selected_concept_id)
       and (p_cursor_created is null or (c.created_at, c.id) < (p_cursor_created, p_cursor_id))
     order by c.created_at desc, c.id desc
     limit v_limit + 1
  )
  select (select count(*) from page),
         coalesce((select jsonb_agg(jsonb_build_object(
             'id', p.id, 'leadId', p.lead_id, 'company', p.company, 'leadLifecycle', p.lead_lifecycle,
             'generation', p.generation, 'position', p.position, 'source', p.source,
             'name', p.name, 'archetype', p.archetype, 'revision', p.revision,
             'current', p.superseded_at is null,
             'selected', p.id is not distinct from p.selected_concept_id,
             'spec', p.spec, 'createdAt', p.created_at, 'updatedAt', p.updated_at)
             order by p.created_at desc, p.id desc)
            from (select * from page order by created_at desc, id desc limit v_limit) p), '[]'::jsonb)
    into v_rows, v_items;
  return jsonb_build_object(
    'items', v_items,
    'nextCursor', case when v_rows > v_limit then jsonb_build_object(
                    'createdAt', v_items -> (v_limit - 1) ->> 'createdAt',
                    'id', v_items -> (v_limit - 1) ->> 'id') end);
end $$;

-- ---------------------------------------------------------------------------
-- Activity: derived from timestamps the Builder already records. There is no
-- separate event log; what is not timestamped (brief edits, earlier
-- selections, earlier notification failures) is not reported.
-- ---------------------------------------------------------------------------
create function public.builder_admin_activity(
  p_lead           uuid default null,
  p_limit          integer default 50,
  p_before         timestamptz default null,
  p_submitted_only boolean default false)
returns jsonb
language sql stable set search_path = public, pg_temp as $$
  with scope as (
    select id, company from public.builder_leads
     where (p_lead is null or id = p_lead)
       and (not p_submitted_only or lifecycle = 'submitted')
  ),
  events as (
    select 'lead_created'::text as kind, l.created_at as at, l.id as lead_id,
           null::uuid as concept_id, '{}'::jsonb as detail
      from public.builder_leads l join scope s on s.id = l.id
    union all
    select 'concepts_generated', min(c.created_at), c.lead_id, null::uuid,
           jsonb_build_object('generation', c.generation, 'source', min(c.source::text))
      from public.builder_concepts c join scope s on s.id = c.lead_id
     group by c.lead_id, c.generation
    union all
    select case r.kind when 'refine' then 'concept_refined' else 'concept_restored' end,
           r.created_at, r.lead_id, r.concept_id,
           jsonb_build_object('revision', r.revision, 'feedback', r.feedback, 'restoredFrom', r.restored_from)
      from public.builder_revisions r join scope s on s.id = r.lead_id
    union all
    select 'direction_selected', l.selected_at, l.id, l.selected_concept_id, '{}'::jsonb
      from public.builder_leads l join scope s on s.id = l.id
     where l.selected_at is not null
    union all
    select 'lead_submitted', l.submitted_at, l.id, l.selected_concept_id,
           jsonb_build_object('budgetCzk', l.budget_czk, 'deadline', l.deadline)
      from public.builder_leads l join scope s on s.id = l.id
     where l.submitted_at is not null
    union all
    select 'notification_sent', l.notified_at, l.id, null::uuid,
           jsonb_build_object('attempts', l.notification_attempts)
      from public.builder_leads l join scope s on s.id = l.id
     where l.notified_at is not null
    union all
    select 'notification_failed', l.notification_last_attempt_at, l.id, null::uuid,
           jsonb_build_object('attempts', l.notification_attempts)
      from public.builder_leads l join scope s on s.id = l.id
     where l.notification_status = 'failed' and l.notification_last_attempt_at is not null
    union all
    select 'status_changed', e.created_at, e.lead_id, null::uuid,
           jsonb_build_object('from', e.from_status, 'to', e.to_status, 'note', e.note,
                              'changedBy', e.changed_by)
      from public.builder_status_events e join scope s on s.id = e.lead_id
     where e.from_status is not null
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'kind', x.kind, 'at', x.at, 'leadId', x.lead_id, 'company', x.company,
           'conceptId', x.concept_id, 'detail', x.detail) order by x.at desc, x.kind), '[]'::jsonb)
    from (select e.*, s.company from events e join scope s on s.id = e.lead_id
           where p_before is null or e.at < p_before
           order by e.at desc, e.kind
           limit least(greatest(coalesce(p_limit, 50), 1), 200)) x
$$;

-- ---------------------------------------------------------------------------
-- Dashboard
-- ---------------------------------------------------------------------------
-- Counts are plain counts of rows — no rates, trends or derived "metrics".
-- p_stale_pending: a submitted lead whose notification is still 'pending' after
-- this long means the server stopped between saving and notifying.
create function public.builder_admin_dashboard(p_stale_pending interval default interval '15 minutes')
returns jsonb
language sql stable set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'submittedByStatus', (
      select jsonb_object_agg(s::text, coalesce(x.n, 0))
        from unnest(enum_range(null::public.builder_lead_status)) s
        left join (select status, count(*) n from public.builder_leads
                    where lifecycle = 'submitted' group by status) x on x.status = s),
    'byLifecycle', (
      select jsonb_object_agg(s::text, coalesce(x.n, 0))
        from unnest(enum_range(null::public.builder_lifecycle)) s
        left join (select lifecycle, count(*) n from public.builder_leads group by lifecycle) x
               on x.lifecycle = s),
    'recentLeads', coalesce((
      select jsonb_agg(t.obj order by t.at desc)
        from (select l.submitted_at as at, jsonb_build_object(
                'id', l.id, 'company', l.company, 'projectType', l.project_type, 'status', l.status,
                'budgetCzk', l.budget_czk, 'deadline', l.deadline, 'submittedAt', l.submitted_at,
                'notificationStatus', l.notification_status) as obj
                from public.builder_leads l
               where l.lifecycle = 'submitted'
               order by l.submitted_at desc limit 10) t), '[]'::jsonb),
    'recentConcepts', coalesce((
      select jsonb_agg(t.obj order by t.at desc, t.pos)
        from (select c.created_at as at, c.position as pos, jsonb_build_object(
                'id', c.id, 'leadId', c.lead_id, 'company', l.company, 'generation', c.generation,
                'position', c.position, 'name', c.name, 'archetype', c.archetype,
                'revision', c.revision, 'source', c.source,
                'current', c.superseded_at is null,
                'selected', c.id is not distinct from l.selected_concept_id,
                'createdAt', c.created_at) as obj
                from public.builder_concepts c join public.builder_leads l on l.id = c.lead_id
               order by c.created_at desc, c.position limit 10) t), '[]'::jsonb),
    'recentActivity', public.builder_admin_activity(null, 20, null, true),
    'notificationProblems', coalesce((
      select jsonb_agg(t.obj order by t.at desc)
        from (select l.submitted_at as at, jsonb_build_object(
                'id', l.id, 'company', l.company, 'submittedAt', l.submitted_at,
                'notificationStatus', l.notification_status,
                'problem', case when l.notification_status = 'failed' then 'failed' else 'stale_pending' end,
                'attempts', l.notification_attempts,
                'lastAttemptAt', l.notification_last_attempt_at) as obj
                from public.builder_leads l
               where l.lifecycle = 'submitted'
                 and (l.notification_status = 'failed'
                      or (l.notification_status = 'pending' and l.submitted_at < now() - p_stale_pending))
               order by l.submitted_at desc limit 50) t), '[]'::jsonb)
  )
$$;

-- ---------------------------------------------------------------------------
-- The one Admin write in this phase: pipeline status, audited with the actor.
-- ---------------------------------------------------------------------------
create function public.builder_admin_set_status(
  p_actor uuid, p_lead uuid, p_status public.builder_lead_status, p_note text default null)
returns jsonb
language plpgsql set search_path = public, pg_temp as $$
begin
  if p_actor is null or not public.builder_admin_is_active(p_actor) then
    raise exception 'BUILDER:FORBIDDEN';
  end if;
  -- Drafts are a visitor's work in progress, not leads in the pipeline yet.
  if not exists (select 1 from public.builder_leads where id = p_lead and lifecycle = 'submitted') then
    raise exception 'BUILDER:LEAD_NOT_FOUND';
  end if;
  perform public.builder_set_status(p_lead, p_status, p_actor, p_note);
  return public.builder_admin_get_lead(p_lead);
end $$;

-- ---------------------------------------------------------------------------
-- Privileges: service_role only
-- ---------------------------------------------------------------------------
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname like 'builder\_admin\_%'
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;
