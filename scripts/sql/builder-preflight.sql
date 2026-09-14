-- ============================================================================
-- Builder schema preflight — READ-ONLY catalog checks
-- ============================================================================
--
-- Run after applying supabase/migrations/20260914120000_builder_leads.sql, in
-- the Supabase SQL editor (or psql as postgres). It reads pg_catalog only and
-- writes nothing. Every row must have ok = true.
--
-- The same file runs against the migrated test database in
-- scripts/check-builder-db.ts, so the checks themselves are tested.
-- ============================================================================

with
expected_tables(name) as (values
  ('builder_leads'), ('builder_concepts'), ('builder_revisions'),
  ('builder_status_events'), ('builder_rate_limits')),
expected_indexes(name) as (values
  ('builder_leads_status_idx'), ('builder_leads_lifecycle_idx'), ('builder_leads_created_at_idx'),
  ('builder_leads_project_type_idx'), ('builder_leads_selected_idx'), ('builder_leads_submitted_at_idx'),
  ('builder_concepts_lead_current_idx'), ('builder_concepts_lead_idx'),
  ('builder_revisions_concept_idx'), ('builder_revisions_lead_idx'),
  ('builder_status_events_lead_idx'), ('builder_rate_limits_window_idx')),
expected_functions(name) as (values
  ('builder_lead_for_update'), ('builder_snapshot'), ('builder_create_lead'), ('builder_get_lead'),
  ('builder_save_brief'), ('builder_store_concepts'), ('builder_get_concept'),
  ('builder_store_refinement'), ('builder_restore_revision'), ('builder_select_concept'),
  ('builder_submit'), ('builder_mark_notification'), ('builder_set_status'),
  ('builder_consume_rate_limit'), ('builder_purge_stale_drafts'),
  ('builder_touch_updated_at'), ('builder_record_status_event')),
tables as (
  select c.oid, c.relname, c.relrowsecurity
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r' and c.relname like 'builder\_%'),
functions as (
  select p.oid, p.proname
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname like 'builder\_%'),
public_roles(role) as (values ('anon'), ('authenticated'))
select * from (
  select 1 as n, 'postgres >= 15 (FK "on delete set null (column)")' as check,
         current_setting('server_version_num')::int >= 150000 as ok,
         current_setting('server_version') as detail
  union all
  select 2, 'all five builder tables exist',
         (select count(*) from expected_tables e where exists (select 1 from tables t where t.relname = e.name)) = 5,
         coalesce((select string_agg(e.name, ', ') from expected_tables e
                    where not exists (select 1 from tables t where t.relname = e.name)), 'none missing')
  union all
  select 3, 'all expected indexes exist',
         not exists (select 1 from expected_indexes e
                      where to_regclass('public.' || e.name) is null),
         coalesce((select string_agg(e.name, ', ') from expected_indexes e
                    where to_regclass('public.' || e.name) is null), 'none missing')
  union all
  select 4, 'row level security enabled on every builder table',
         (select count(*) from tables) = 5 and (select bool_and(relrowsecurity) from tables),
         coalesce((select string_agg(relname, ', ') from tables where not relrowsecurity), 'all enabled')
  union all
  select 5, 'no RLS policies on builder tables (service role only)',
         not exists (select 1 from pg_policy p join tables t on t.oid = p.polrelid),
         coalesce((select string_agg(t.relname || '.' || p.polname, ', ')
                     from pg_policy p join tables t on t.oid = p.polrelid), 'none')
  union all
  select 6, 'anon/authenticated hold no privilege on any builder table',
         not exists (
           select 1 from tables t cross join public_roles r
            where has_table_privilege(r.role, t.oid, 'select,insert,update,delete,truncate,references,trigger')),
         coalesce((
           select string_agg(r.role || ' on ' || t.relname, ', ')
             from tables t cross join public_roles r
            where has_table_privilege(r.role, t.oid, 'select,insert,update,delete,truncate,references,trigger')),
           'none')
  union all
  select 7, 'anon/authenticated cannot execute any builder function',
         not exists (
           select 1 from functions f cross join public_roles r
            where has_function_privilege(r.role, f.oid, 'execute')),
         coalesce((
           select string_agg(distinct r.role || ' -> ' || f.proname, ', ')
             from functions f cross join public_roles r
            where has_function_privilege(r.role, f.oid, 'execute')),
           'none')
  union all
  select 8, 'service_role can read/write builder tables',
         (select count(*) from tables) = 5
         and (select bool_and(has_table_privilege('service_role', t.oid, 'select,insert,update,delete')) from tables t),
         'select, insert, update, delete'
  union all
  select 9, 'all expected builder functions exist and service_role can execute them',
         not exists (select 1 from expected_functions e where not exists (select 1 from functions f where f.proname = e.name))
         and (select bool_and(has_function_privilege('service_role', f.oid, 'execute')) from functions f),
         coalesce((select string_agg(e.name, ', ') from expected_functions e
                    where not exists (select 1 from functions f where f.proname = e.name)), 'none missing')
  union all
  select 10, 'status enum is exactly NEW, REVIEW, CONTACTED, PROPOSAL, IN_PROGRESS, COMPLETED, ARCHIVED',
         coalesce((select array_agg(e.enumlabel::text order by e.enumsortorder)
                     from pg_enum e join pg_type t on t.oid = e.enumtypid
                    where t.typname = 'builder_lead_status'), '{}')
           = array['NEW','REVIEW','CONTACTED','PROPOSAL','IN_PROGRESS','COMPLETED','ARCHIVED'],
         coalesce((select string_agg(e.enumlabel, ',' order by e.enumsortorder)
                     from pg_enum e join pg_type t on t.oid = e.enumtypid
                    where t.typname = 'builder_lead_status'), 'enum missing')
  union all
  select 11, 'service_role bypasses RLS',
         coalesce((select rolbypassrls from pg_roles where rolname = 'service_role'), false),
         'pg_roles.rolbypassrls'
  union all
  select 12, 'selected concept FK keeps the selection inside its own lead',
         exists (select 1 from pg_constraint where conname = 'builder_leads_selected_concept_fk'),
         'builder_leads (selected_concept_id, id) -> builder_concepts (id, lead_id)'
) checks
order by n;
