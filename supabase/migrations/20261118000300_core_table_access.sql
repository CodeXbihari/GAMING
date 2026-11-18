-- Central admin predicate used by database policies. A locked search_path and
-- qualified references keep the SECURITY DEFINER helper from resolving objects
-- supplied by an untrusted schema.
create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_current_user_admin() from public;
grant execute on function public.is_current_user_admin() to authenticated;

-- Profiles are self-readable and never directly writable by browser roles.
alter table public.profiles enable row level security;
revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
drop policy if exists profiles_self_read_guard on public.profiles;
create policy profiles_self_read_guard
  on public.profiles as restrictive
  for select to authenticated
  using (id = (select auth.uid()));
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read
  on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

-- Guests create bookings only through the validated Edge Function. Browser
-- roles can read and mutate booking rows only after the admin profile check.
alter table public.bookings enable row level security;
revoke all on public.bookings from public, anon, authenticated;
grant select, update, delete on public.bookings to authenticated;
drop policy if exists bookings_admin_scope_guard on public.bookings;
create policy bookings_admin_scope_guard
  on public.bookings as restrictive
  for all to authenticated
  using (auth.role() = 'authenticated' and public.is_current_user_admin())
  with check (auth.role() = 'authenticated' and public.is_current_user_admin());
drop policy if exists bookings_admin_manage on public.bookings;
create policy bookings_admin_manage
  on public.bookings
  for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

-- Equipment is public to browse, but only admins can change inventory/pricing.
alter table public.equipment enable row level security;
revoke all on public.equipment from public, anon, authenticated;
grant select on public.equipment to anon, authenticated;
grant insert, update, delete on public.equipment to authenticated;
drop policy if exists equipment_public_read on public.equipment;
create policy equipment_public_read
  on public.equipment
  for select to anon, authenticated
  using (true);
drop policy if exists equipment_admin_manage on public.equipment;
create policy equipment_admin_manage
  on public.equipment
  for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());
drop policy if exists equipment_insert_admin_guard on public.equipment;
create policy equipment_insert_admin_guard
  on public.equipment as restrictive
  for insert to authenticated
  with check (auth.role() = 'authenticated' and public.is_current_user_admin());
drop policy if exists equipment_update_admin_guard on public.equipment;
create policy equipment_update_admin_guard
  on public.equipment as restrictive
  for update to authenticated
  using (auth.role() = 'authenticated' and public.is_current_user_admin())
  with check (auth.role() = 'authenticated' and public.is_current_user_admin());
drop policy if exists equipment_delete_admin_guard on public.equipment;
create policy equipment_delete_admin_guard
  on public.equipment as restrictive
  for delete to authenticated
  using (auth.role() = 'authenticated' and public.is_current_user_admin());

-- Prevent older permissive policies from granting browser writes to slots.
alter table public.time_slots enable row level security;
revoke all on public.time_slots from public, anon, authenticated;
grant select on public.time_slots to anon, authenticated;
grant insert, update, delete on public.time_slots to authenticated;
drop policy if exists time_slots_public_read on public.time_slots;
create policy time_slots_public_read
  on public.time_slots
  for select to anon, authenticated
  using (true);
drop policy if exists time_slots_admin_manage on public.time_slots;
create policy time_slots_admin_manage
  on public.time_slots
  for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());
drop policy if exists time_slots_insert_admin_guard on public.time_slots;
create policy time_slots_insert_admin_guard
  on public.time_slots as restrictive
  for insert to authenticated
  with check (auth.role() = 'authenticated' and public.is_current_user_admin());
drop policy if exists time_slots_update_admin_guard on public.time_slots;
create policy time_slots_update_admin_guard
  on public.time_slots as restrictive
  for update to authenticated
  using (auth.role() = 'authenticated' and public.is_current_user_admin())
  with check (auth.role() = 'authenticated' and public.is_current_user_admin());
drop policy if exists time_slots_delete_admin_guard on public.time_slots;
create policy time_slots_delete_admin_guard
  on public.time_slots as restrictive
  for delete to authenticated
  using (auth.role() = 'authenticated' and public.is_current_user_admin());

-- Game request rows are only readable by admins. Edge Functions use the
-- service role for the write path after validating a booking capability token.
alter table public.game_download_requests enable row level security;
revoke all on public.game_download_requests from public, anon, authenticated;
grant select on public.game_download_requests to authenticated;
drop policy if exists game_download_requests_admin_scope_guard on public.game_download_requests;
create policy game_download_requests_admin_scope_guard
  on public.game_download_requests as restrictive
  for select to authenticated
  using (auth.role() = 'authenticated' and public.is_current_user_admin());
drop policy if exists admins_can_read_game_download_requests on public.game_download_requests;
create policy admins_can_read_game_download_requests
  on public.game_download_requests
  for select to authenticated
  using (public.is_current_user_admin());

-- Audit records are server-written and admin-readable only.
do $$
begin
  if exists (
    select 1
    from pg_class as c
    join pg_namespace as n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'audit_logs'
      and c.relkind in ('r', 'p')
  ) then
    alter table public.audit_logs enable row level security;
    revoke all on public.audit_logs from public, anon, authenticated;
    grant select on public.audit_logs to authenticated;
    drop policy if exists audit_logs_admin_scope_guard on public.audit_logs;
    create policy audit_logs_admin_scope_guard
      on public.audit_logs as restrictive
      for select to authenticated
      using (auth.role() = 'authenticated' and public.is_current_user_admin());
    drop policy if exists audit_logs_admin_read on public.audit_logs;
    create policy audit_logs_admin_read
      on public.audit_logs
      for select to authenticated
      using (public.is_current_user_admin());
  end if;
end
$$;
