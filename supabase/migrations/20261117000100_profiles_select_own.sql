-- Authenticated users need to read their own profile role for admin gating.
drop policy if exists "users_can_read_own_profile" on public.profiles;

create policy "users_can_read_own_profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());
