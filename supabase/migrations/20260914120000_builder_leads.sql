-- ============================================================================
-- ELEVATE AI Project Builder — authoritative lead storage
-- ============================================================================
--
-- Contract: docs/builder/DATA_CONTRACT.md. Shapes of the JSON payloads are
-- validated in the application (src/lib/builder/spec.ts, brief.ts) BEFORE they
-- reach these functions; the database re-checks every limit it can express.
--
-- Security model
--   * Every table has RLS enabled and NO policies: the publishable (anon) key
--     and signed-in users can neither read nor write a single row.
--   * All privileges on tables and functions are revoked from public, anon and
--     authenticated; only service_role (used by server functions, never shipped
--     to the browser) may call the builder_* functions.
--   * A browser proves ownership of a lead with a random 256-bit token held in
--     an httpOnly cookie. Only its SHA-256 hash is stored; every function that
--     touches a lead takes the hash and refuses on mismatch.
--   * IDs, revision numbers, generation numbers, lifecycle and timestamps are
--     assigned here, never taken from the client.
--
-- Errors are raised as 'BUILDER:<CODE>' so the server can map them to the
-- codes the UI explains (LEAD_NOT_FOUND, LEAD_LOCKED, GENERATION_LIMIT, ...).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enums — controlled vocabularies, no free status strings
-- ---------------------------------------------------------------------------

create type public.builder_project_type as enum ('web', 'eshop', 'app', 'branding');

-- Where the visitor is in the Builder (set by the application).
create type public.builder_lifecycle as enum ('draft', 'concepts_ready', 'direction_selected', 'submitted');

-- ELEVATE's pipeline for the lead (set by Admin; never by the public Builder).
create type public.builder_lead_status as enum ('NEW', 'REVIEW', 'CONTACTED', 'PROPOSAL', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

create type public.builder_lang as enum ('CZ', 'EN', 'RU', 'UA');
create type public.builder_deadline as enum ('asap', '1m', '1-3m', '3m+', 'unsure');
create type public.builder_revision_kind as enum ('refine', 'restore');
create type public.builder_concept_source as enum ('ai', 'resync');
create type public.builder_notification_status as enum ('pending', 'sent', 'failed');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.builder_leads (
  id                   uuid primary key default gen_random_uuid(),
  access_token_hash    text not null check (access_token_hash ~ '^[0-9a-f]{64}$'),

  lifecycle            public.builder_lifecycle   not null default 'draft',
  status               public.builder_lead_status not null default 'NEW',
  lang                 public.builder_lang        not null default 'CZ',

  -- Brief: fixed fields as columns (Admin searches, filters and sorts on them).
  project_type         public.builder_project_type,
  company              text check (char_length(company) <= 80),
  industry             text check (char_length(industry) <= 80),
  offering             text check (char_length(offering) <= 600),
  audience             text check (char_length(audience) <= 300),
  goal                 text check (char_length(goal) <= 300),
  visual_style         text check (char_length(visual_style) <= 300),
  visual_mood          text check (char_length(visual_mood) <= 200),
  visual_colors        text check (char_length(visual_colors) <= 200),
  visual_typography    text check (char_length(visual_typography) <= 200),
  visual_notes         text check (char_length(visual_notes) <= 800),
  -- References: flexible by design (URLs today, image references later).
  brief_references     jsonb not null default '{"urls": [], "notes": ""}'::jsonb
                       check (
                         jsonb_typeof(brief_references) = 'object'
                         and jsonb_typeof(brief_references -> 'urls') = 'array'
                         and jsonb_array_length(brief_references -> 'urls') <= 5
                         and char_length(coalesce(brief_references ->> 'notes', '')) <= 800
                       ),

  selected_concept_id  uuid,
  selected_at          timestamptz,
  generation_count     integer not null default 0 check (generation_count >= 0),

  -- Contact: set only by builder_submit.
  contact_name         text check (char_length(contact_name) between 1 and 100),
  contact_email        text check (char_length(contact_email) between 3 and 255 and contact_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  contact_company      text check (char_length(contact_company) between 1 and 80),
  budget_index         smallint check (budget_index between 0 and 4),
  budget_czk           integer check (budget_czk between 0 and 10000000),
  deadline             public.builder_deadline,
  contact_message      text check (char_length(contact_message) <= 1200),

  -- Team notification (Telegram) — a channel, not the record.
  notification_status  public.builder_notification_status,
  notification_attempts integer not null default 0 check (notification_attempts >= 0),
  notified_at          timestamptz,
  notification_last_attempt_at timestamptz,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  submitted_at         timestamptz,

  constraint builder_leads_submitted_is_complete check (
    lifecycle <> 'submitted'
    or (
      submitted_at is not null and selected_concept_id is not null and selected_at is not null
      and contact_name is not null and contact_email is not null and contact_company is not null
      and budget_index is not null and deadline is not null and project_type is not null
    )
  )
);

comment on table public.builder_leads is 'AI Project Builder leads. Written only through builder_* functions by service_role.';
comment on column public.builder_leads.access_token_hash is 'SHA-256 (hex) of the browser session token. The token itself is never stored.';
comment on column public.builder_leads.status is 'ELEVATE pipeline status (Admin). The public Builder never changes it.';

create table public.builder_concepts (
  id             uuid primary key default gen_random_uuid(),
  lead_id        uuid not null references public.builder_leads (id) on delete cascade,
  generation     integer not null check (generation >= 1),
  position       smallint not null check (position between 1 and 5),
  source         public.builder_concept_source not null default 'ai',
  name           text not null check (char_length(name) between 2 and 40),
  archetype      text not null check (char_length(archetype) between 2 and 40),
  revision       integer not null default 0 check (revision >= 0),
  original_spec  jsonb not null check (jsonb_typeof(original_spec) = 'object'),
  spec           jsonb not null check (jsonb_typeof(spec) = 'object'),
  superseded_at  timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (lead_id, generation, position),
  unique (id, lead_id)
);

comment on column public.builder_concepts.spec is 'Current DesignSpec draft (validated by src/lib/builder/spec.ts). id/revision live in columns.';
comment on column public.builder_concepts.superseded_at is 'Set when a later generation replaced this set. Superseded concepts are kept, never deleted.';

-- The selected concept must belong to the same lead.
alter table public.builder_leads
  add constraint builder_leads_selected_concept_fk
  foreign key (selected_concept_id, id) references public.builder_concepts (id, lead_id)
  on delete set null (selected_concept_id);

create table public.builder_revisions (
  id             uuid primary key default gen_random_uuid(),
  concept_id     uuid not null,
  lead_id        uuid not null,
  revision       integer not null check (revision >= 1),
  kind           public.builder_revision_kind not null,
  feedback       text not null default '' check (char_length(feedback) <= 600),
  restored_from  integer check (restored_from >= 0),
  spec_before    jsonb not null check (jsonb_typeof(spec_before) = 'object'),
  spec_after     jsonb not null check (jsonb_typeof(spec_after) = 'object'),
  created_at     timestamptz not null default now(),
  foreign key (concept_id, lead_id) references public.builder_concepts (id, lead_id) on delete cascade,
  unique (concept_id, revision),
  check (
    (kind = 'refine' and char_length(feedback) >= 3 and restored_from is null)
    or (kind = 'restore' and restored_from is not null and restored_from < revision)
  )
);

-- Admin pipeline audit trail (written by trigger only).
create table public.builder_status_events (
  id           bigint generated always as identity primary key,
  lead_id      uuid not null references public.builder_leads (id) on delete cascade,
  from_status  public.builder_lead_status,
  to_status    public.builder_lead_status not null,
  note         text check (char_length(note) <= 500),
  -- Who made the change: the Admin user id (auth.users.id) passed to
  -- builder_set_status. Null only for the initial NEW written on insert.
  -- No FK: this migration does not depend on the auth schema.
  changed_by   uuid,
  created_at   timestamptz not null default now()
);

-- Shared, persistent rate limiting (fixed windows). Keys are hashed; no raw IPs.
create table public.builder_rate_limits (
  bucket        text not null check (char_length(bucket) between 3 and 200),
  window_start  timestamptz not null,
  hits          integer not null default 0 check (hits >= 0),
  primary key (bucket, window_start)
);

-- ---------------------------------------------------------------------------
-- Indexes (what Admin filters and sorts on, and what the functions look up)
-- ---------------------------------------------------------------------------

create index builder_leads_status_idx         on public.builder_leads (status);
create index builder_leads_lifecycle_idx      on public.builder_leads (lifecycle);
create index builder_leads_created_at_idx     on public.builder_leads (created_at desc);
create index builder_leads_project_type_idx   on public.builder_leads (project_type);
create index builder_leads_selected_idx       on public.builder_leads (selected_concept_id);
create index builder_leads_submitted_at_idx   on public.builder_leads (submitted_at desc) where submitted_at is not null;
create index builder_concepts_lead_current_idx on public.builder_concepts (lead_id, position) where superseded_at is null;
create index builder_concepts_lead_idx        on public.builder_concepts (lead_id);
create index builder_revisions_concept_idx    on public.builder_revisions (concept_id, revision);
create index builder_revisions_lead_idx       on public.builder_revisions (lead_id, created_at);
create index builder_status_events_lead_idx   on public.builder_status_events (lead_id, created_at);
create index builder_rate_limits_window_idx   on public.builder_rate_limits (window_start);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create function public.builder_touch_updated_at() returns trigger
language plpgsql set search_path = public, pg_temp as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger builder_leads_touch before update on public.builder_leads
  for each row execute function public.builder_touch_updated_at();
create trigger builder_concepts_touch before update on public.builder_concepts
  for each row execute function public.builder_touch_updated_at();

create function public.builder_record_status_event() returns trigger
language plpgsql set search_path = public, pg_temp as $$
begin
  if tg_op = 'INSERT' then
    insert into public.builder_status_events (lead_id, from_status, to_status) values (new.id, null, new.status);
  elsif new.status is distinct from old.status then
    insert into public.builder_status_events (lead_id, from_status, to_status, note, changed_by)
    values (new.id, old.status, new.status,
            nullif(current_setting('builder.status_note', true), ''),
            nullif(current_setting('builder.status_actor', true), '')::uuid);
  end if;
  return new;
end $$;

create trigger builder_leads_status_event after insert or update of status on public.builder_leads
  for each row execute function public.builder_record_status_event();

-- ---------------------------------------------------------------------------
-- Row level security: enabled, no policies => no access for anon/authenticated
-- ---------------------------------------------------------------------------

alter table public.builder_leads         enable row level security;
alter table public.builder_concepts      enable row level security;
alter table public.builder_revisions     enable row level security;
alter table public.builder_status_events enable row level security;
alter table public.builder_rate_limits   enable row level security;

revoke all on public.builder_leads, public.builder_concepts, public.builder_revisions,
  public.builder_status_events, public.builder_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.builder_leads, public.builder_concepts,
  public.builder_revisions, public.builder_status_events, public.builder_rate_limits to service_role;

-- ---------------------------------------------------------------------------
-- Internal helpers
-- ---------------------------------------------------------------------------

-- Locks and returns the lead if the token hash matches; otherwise LEAD_NOT_FOUND.
create function public.builder_lead_for_update(p_lead uuid, p_token_hash text)
returns public.builder_leads
language plpgsql set search_path = public, pg_temp as $$
declare
  v_lead public.builder_leads;
begin
  select * into v_lead from public.builder_leads
   where id = p_lead and access_token_hash = p_token_hash
   for update;
  if not found then
    raise exception 'BUILDER:LEAD_NOT_FOUND';
  end if;
  return v_lead;
end $$;

-- The client-facing snapshot: brief, current concepts, their revisions.
-- Excludes the token hash, the Admin status and contact details.
create function public.builder_snapshot(p_lead uuid)
returns jsonb
language sql stable set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'lead', jsonb_build_object(
      'id', l.id,
      'lifecycle', l.lifecycle,
      'lang', l.lang,
      'brief', jsonb_build_object(
        'projectType', l.project_type,
        'project', jsonb_build_object(
          'company', coalesce(l.company, ''), 'industry', coalesce(l.industry, ''),
          'offering', coalesce(l.offering, ''), 'audience', coalesce(l.audience, ''),
          'goal', coalesce(l.goal, '')),
        'visual', jsonb_build_object(
          'style', coalesce(l.visual_style, ''), 'mood', coalesce(l.visual_mood, ''),
          'colors', coalesce(l.visual_colors, ''), 'typography', coalesce(l.visual_typography, ''),
          'notes', coalesce(l.visual_notes, '')),
        'references', l.brief_references),
      'selectedConceptId', l.selected_concept_id,
      'generationCount', l.generation_count,
      'createdAt', l.created_at,
      'updatedAt', l.updated_at,
      'submittedAt', l.submitted_at),
    'concepts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'position', c.position, 'revision', c.revision, 'source', c.source,
        'spec', c.spec, 'createdAt', c.created_at) order by c.position)
      from public.builder_concepts c
      where c.lead_id = l.id and c.superseded_at is null), '[]'::jsonb),
    'revisions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'conceptId', r.concept_id, 'revision', r.revision, 'kind', r.kind,
        'feedback', r.feedback, 'restoredFrom', r.restored_from,
        'before', r.spec_before, 'after', r.spec_after, 'createdAt', r.created_at)
        order by r.created_at, r.revision)
      from public.builder_revisions r
      join public.builder_concepts c on c.id = r.concept_id
      where r.lead_id = l.id and c.superseded_at is null), '[]'::jsonb))
  from public.builder_leads l
  where l.id = p_lead
$$;

-- ---------------------------------------------------------------------------
-- Public API (service_role only)
-- ---------------------------------------------------------------------------

create function public.builder_create_lead(p_token_hash text, p_lang public.builder_lang)
returns jsonb
language plpgsql set search_path = public, pg_temp as $$
declare
  v_id uuid;
begin
  insert into public.builder_leads (access_token_hash, lang) values (p_token_hash, p_lang)
  returning id into v_id;
  return public.builder_snapshot(v_id);
end $$;

create function public.builder_get_lead(p_lead uuid, p_token_hash text)
returns jsonb
language plpgsql stable set search_path = public, pg_temp as $$
begin
  if not exists (select 1 from public.builder_leads where id = p_lead and access_token_hash = p_token_hash) then
    return null;
  end if;
  return public.builder_snapshot(p_lead);
end $$;

-- p_brief: BriefDraft JSON, already validated by the application.
create function public.builder_save_brief(p_lead uuid, p_token_hash text, p_brief jsonb, p_lang public.builder_lang)
returns jsonb
language plpgsql set search_path = public, pg_temp as $$
declare
  v_lead public.builder_leads;
begin
  v_lead := public.builder_lead_for_update(p_lead, p_token_hash);
  if v_lead.lifecycle = 'submitted' then
    raise exception 'BUILDER:LEAD_LOCKED';
  end if;
  update public.builder_leads set
    lang              = p_lang,
    project_type      = nullif(p_brief ->> 'projectType', '')::public.builder_project_type,
    company           = nullif(p_brief #>> '{project,company}', ''),
    industry          = nullif(p_brief #>> '{project,industry}', ''),
    offering          = nullif(p_brief #>> '{project,offering}', ''),
    audience          = nullif(p_brief #>> '{project,audience}', ''),
    goal              = nullif(p_brief #>> '{project,goal}', ''),
    visual_style      = nullif(p_brief #>> '{visual,style}', ''),
    visual_mood       = nullif(p_brief #>> '{visual,mood}', ''),
    visual_colors     = nullif(p_brief #>> '{visual,colors}', ''),
    visual_typography = nullif(p_brief #>> '{visual,typography}', ''),
    visual_notes      = nullif(p_brief #>> '{visual,notes}', ''),
    brief_references  = jsonb_build_object(
                          'urls', coalesce(p_brief #> '{references,urls}', '[]'::jsonb),
                          'notes', coalesce(p_brief #>> '{references,notes}', ''))
  where id = p_lead;
  return public.builder_snapshot(p_lead);
end $$;

-- p_specs: array of exactly five DesignSpec drafts, validated by the application.
create function public.builder_store_concepts(
  p_lead uuid, p_token_hash text, p_specs jsonb,
  p_source public.builder_concept_source, p_max_generations integer)
returns jsonb
language plpgsql set search_path = public, pg_temp as $$
declare
  v_lead public.builder_leads;
  v_generation integer;
begin
  v_lead := public.builder_lead_for_update(p_lead, p_token_hash);
  if v_lead.lifecycle = 'submitted' then
    raise exception 'BUILDER:LEAD_LOCKED';
  end if;
  if jsonb_typeof(p_specs) <> 'array' or jsonb_array_length(p_specs) <> 5 then
    raise exception 'BUILDER:INVALID_INPUT';
  end if;
  if v_lead.generation_count >= p_max_generations then
    raise exception 'BUILDER:GENERATION_LIMIT';
  end if;
  v_generation := v_lead.generation_count + 1;

  update public.builder_leads set selected_concept_id = null, selected_at = null where id = p_lead;
  update public.builder_concepts set superseded_at = now()
   where lead_id = p_lead and superseded_at is null;

  insert into public.builder_concepts (lead_id, generation, position, source, name, archetype, original_spec, spec)
  select p_lead, v_generation, e.ord::smallint, p_source, e.spec ->> 'name', e.spec ->> 'archetype', e.spec, e.spec
    from jsonb_array_elements(p_specs) with ordinality as e(spec, ord);

  update public.builder_leads
     set generation_count = v_generation, lifecycle = 'concepts_ready'
   where id = p_lead;
  return public.builder_snapshot(p_lead);
end $$;

-- The concept's current spec, for a refinement (the client never supplies it).
create function public.builder_get_concept(p_lead uuid, p_token_hash text, p_concept uuid)
returns jsonb
language plpgsql stable set search_path = public, pg_temp as $$
declare
  v_row record;
begin
  select c.id, c.revision, c.spec into v_row
    from public.builder_concepts c
    join public.builder_leads l on l.id = c.lead_id
   where c.id = p_concept and l.id = p_lead and l.access_token_hash = p_token_hash
     and c.superseded_at is null;
  if not found then
    raise exception 'BUILDER:CONCEPT_NOT_FOUND';
  end if;
  return jsonb_build_object('id', v_row.id, 'revision', v_row.revision, 'spec', v_row.spec);
end $$;

-- Refinement: the revision number is assigned here. p_expected_revision is the
-- revision the AI worked from; if the concept moved on meanwhile, the write is refused.
create function public.builder_store_refinement(
  p_lead uuid, p_token_hash text, p_concept uuid, p_feedback text, p_spec jsonb,
  p_expected_revision integer, p_max_revisions integer)
returns jsonb
language plpgsql set search_path = public, pg_temp as $$
declare
  v_lead public.builder_leads;
  v_concept public.builder_concepts;
begin
  v_lead := public.builder_lead_for_update(p_lead, p_token_hash);
  if v_lead.lifecycle = 'submitted' then
    raise exception 'BUILDER:LEAD_LOCKED';
  end if;
  select * into v_concept from public.builder_concepts
   where id = p_concept and lead_id = p_lead and superseded_at is null
   for update;
  if not found then
    raise exception 'BUILDER:CONCEPT_NOT_FOUND';
  end if;
  if v_concept.revision <> p_expected_revision then
    raise exception 'BUILDER:REVISION_CONFLICT';
  end if;
  if (select count(*) from public.builder_revisions where lead_id = p_lead) >= p_max_revisions then
    raise exception 'BUILDER:REVISION_LIMIT';
  end if;
  if jsonb_typeof(p_spec) <> 'object' then
    raise exception 'BUILDER:INVALID_INPUT';
  end if;

  insert into public.builder_revisions (concept_id, lead_id, revision, kind, feedback, spec_before, spec_after)
  values (p_concept, p_lead, v_concept.revision + 1, 'refine', p_feedback, v_concept.spec, p_spec);

  update public.builder_concepts
     set spec = p_spec, revision = v_concept.revision + 1,
         name = p_spec ->> 'name', archetype = p_spec ->> 'archetype'
   where id = p_concept;
  return public.builder_snapshot(p_lead);
end $$;

-- Restore an earlier version (0 = as generated). The spec comes from the
-- database, not from the client.
create function public.builder_restore_revision(
  p_lead uuid, p_token_hash text, p_concept uuid, p_target integer, p_max_revisions integer)
returns jsonb
language plpgsql set search_path = public, pg_temp as $$
declare
  v_lead public.builder_leads;
  v_concept public.builder_concepts;
  v_spec jsonb;
begin
  v_lead := public.builder_lead_for_update(p_lead, p_token_hash);
  if v_lead.lifecycle = 'submitted' then
    raise exception 'BUILDER:LEAD_LOCKED';
  end if;
  select * into v_concept from public.builder_concepts
   where id = p_concept and lead_id = p_lead and superseded_at is null
   for update;
  if not found then
    raise exception 'BUILDER:CONCEPT_NOT_FOUND';
  end if;
  if p_target < 0 or p_target >= v_concept.revision then
    raise exception 'BUILDER:INVALID_INPUT';
  end if;
  if (select count(*) from public.builder_revisions where lead_id = p_lead) >= p_max_revisions then
    raise exception 'BUILDER:REVISION_LIMIT';
  end if;
  if p_target = 0 then
    v_spec := v_concept.original_spec;
  else
    select spec_after into v_spec from public.builder_revisions
     where concept_id = p_concept and revision = p_target;
  end if;

  insert into public.builder_revisions (concept_id, lead_id, revision, kind, restored_from, spec_before, spec_after)
  values (p_concept, p_lead, v_concept.revision + 1, 'restore', p_target, v_concept.spec, v_spec);

  update public.builder_concepts
     set spec = v_spec, revision = v_concept.revision + 1,
         name = v_spec ->> 'name', archetype = v_spec ->> 'archetype'
   where id = p_concept;
  return public.builder_snapshot(p_lead);
end $$;

create function public.builder_select_concept(p_lead uuid, p_token_hash text, p_concept uuid)
returns jsonb
language plpgsql set search_path = public, pg_temp as $$
declare
  v_lead public.builder_leads;
begin
  v_lead := public.builder_lead_for_update(p_lead, p_token_hash);
  if v_lead.lifecycle = 'submitted' then
    raise exception 'BUILDER:LEAD_LOCKED';
  end if;
  if p_concept is not null and not exists (
    select 1 from public.builder_concepts
     where id = p_concept and lead_id = p_lead and superseded_at is null) then
    raise exception 'BUILDER:CONCEPT_NOT_FOUND';
  end if;
  update public.builder_leads
     set selected_concept_id = p_concept,
         selected_at = case when p_concept is not null then now() end,
         lifecycle = case
           when p_concept is not null then 'direction_selected'::public.builder_lifecycle
           when generation_count > 0 then 'concepts_ready'::public.builder_lifecycle
           else 'draft'::public.builder_lifecycle end
   where id = p_lead;
  return public.builder_snapshot(p_lead);
end $$;

-- Final submission. Idempotent: a second call on a submitted lead changes
-- nothing and reports already_submitted.
create function public.builder_submit(
  p_lead uuid, p_token_hash text, p_concept uuid, p_contact jsonb, p_budget_czk integer)
returns jsonb
language plpgsql set search_path = public, pg_temp as $$
declare
  v_lead public.builder_leads;
begin
  v_lead := public.builder_lead_for_update(p_lead, p_token_hash);
  if v_lead.lifecycle = 'submitted' then
    return jsonb_build_object('alreadySubmitted', true, 'snapshot', public.builder_snapshot(p_lead));
  end if;
  if p_concept is null or not exists (
    select 1 from public.builder_concepts
     where id = p_concept and lead_id = p_lead and superseded_at is null) then
    raise exception 'BUILDER:NO_SELECTION';
  end if;
  if v_lead.project_type is null or v_lead.company is null then
    raise exception 'BUILDER:INVALID_INPUT';
  end if;
  update public.builder_leads set
    selected_concept_id = p_concept,
    selected_at         = case when v_lead.selected_concept_id = p_concept
                               then coalesce(v_lead.selected_at, now()) else now() end,
    contact_name        = p_contact ->> 'name',
    contact_email       = p_contact ->> 'email',
    contact_company     = p_contact ->> 'company',
    budget_index        = (p_contact ->> 'budgetIndex')::smallint,
    budget_czk          = p_budget_czk,
    deadline            = (p_contact ->> 'deadline')::public.builder_deadline,
    contact_message     = nullif(p_contact ->> 'message', ''),
    lifecycle           = 'submitted',
    submitted_at        = now(),
    notification_status = 'pending'
  where id = p_lead;
  return jsonb_build_object('alreadySubmitted', false, 'snapshot', public.builder_snapshot(p_lead));
end $$;

create function public.builder_mark_notification(p_lead uuid, p_token_hash text, p_delivered boolean)
returns void
language plpgsql set search_path = public, pg_temp as $$
begin
  perform public.builder_lead_for_update(p_lead, p_token_hash);
  update public.builder_leads
     set notification_status = case when p_delivered then 'sent'::public.builder_notification_status
                                    else 'failed'::public.builder_notification_status end,
         notification_attempts = notification_attempts + 1,
         notification_last_attempt_at = now(),
         notified_at = case when p_delivered then now() else notified_at end
   where id = p_lead;
end $$;

-- Admin (future): the only way to move a lead through the pipeline. p_actor is
-- the signed-in Admin user's id, recorded in the audit trail; the Admin server
-- function supplies it from the verified session, never from the request body.
create function public.builder_set_status(
  p_lead uuid, p_status public.builder_lead_status, p_actor uuid, p_note text default null)
returns void
language plpgsql set search_path = public, pg_temp as $$
begin
  perform set_config('builder.status_note', coalesce(left(p_note, 500), ''), true);
  perform set_config('builder.status_actor', coalesce(p_actor::text, ''), true);
  update public.builder_leads set status = p_status where id = p_lead;
  if not found then
    raise exception 'BUILDER:LEAD_NOT_FOUND';
  end if;
end $$;

-- Fixed-window counter shared by every server instance.
create function public.builder_consume_rate_limit(p_bucket text, p_limit integer, p_window_seconds integer)
returns jsonb
language plpgsql set search_path = public, pg_temp as $$
declare
  v_window timestamptz;
  v_hits integer;
begin
  if p_limit < 1 or p_window_seconds < 1 then
    raise exception 'BUILDER:INVALID_INPUT';
  end if;
  v_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.builder_rate_limits as r (bucket, window_start, hits)
  values (p_bucket, v_window, 1)
  on conflict (bucket, window_start) do update set hits = r.hits + 1
  returning hits into v_hits;
  -- Opportunistic cleanup of old windows (bounded; no scheduler required).
  if random() < 0.02 then
    delete from public.builder_rate_limits where window_start < now() - interval '2 days';
  end if;
  return jsonb_build_object(
    'allowed', v_hits <= p_limit,
    'hits', v_hits,
    'retryAfterSeconds', greatest(1, ceil(extract(epoch from (v_window + make_interval(secs => p_window_seconds) - now())))::integer));
end $$;

-- Housekeeping (not scheduled here): drafts nobody finished.
create function public.builder_purge_stale_drafts(p_older_than interval)
returns integer
language plpgsql set search_path = public, pg_temp as $$
declare
  v_count integer;
begin
  delete from public.builder_leads
   where lifecycle = 'draft' and generation_count = 0 and updated_at < now() - p_older_than;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

-- ---------------------------------------------------------------------------
-- Function privileges: service_role only
-- ---------------------------------------------------------------------------

do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname like 'builder\_%'
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;
