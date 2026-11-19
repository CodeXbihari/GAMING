-- A verified Supabase phone identity owns its student profile and booking history.
create table if not exists public.student_booking_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone_number text not null unique check (phone_number ~ '^\+[1-9][0-9]{7,14}$'),
  full_name text not null check (char_length(full_name) between 1 and 120),
  room_no text not null check (char_length(room_no) between 1 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_booking_profiles enable row level security;
revoke all on public.student_booking_profiles from public, anon, authenticated;
grant select, insert, update, delete on public.student_booking_profiles to authenticated;
drop policy if exists student_booking_profiles_read_own on public.student_booking_profiles;
create policy student_booking_profiles_read_own
  on public.student_booking_profiles for select to authenticated
  using (id = (select auth.uid()));
drop policy if exists student_booking_profiles_insert_own on public.student_booking_profiles;
create policy student_booking_profiles_insert_own
  on public.student_booking_profiles for insert to authenticated
  with check (id = (select auth.uid()) and phone_number = (select auth.jwt() ->> 'phone'));
drop policy if exists student_booking_profiles_update_own on public.student_booking_profiles;
create policy student_booking_profiles_update_own
  on public.student_booking_profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and phone_number = (select auth.jwt() ->> 'phone'));
drop policy if exists student_booking_profiles_delete_own on public.student_booking_profiles;
create policy student_booking_profiles_delete_own
  on public.student_booking_profiles for delete to authenticated
  using (id = (select auth.uid()));

alter table public.bookings
  add column if not exists student_id uuid references auth.users(id) on delete set null;
create index if not exists bookings_student_history_idx
  on public.bookings (student_id, created_at desc);

-- Keep admin writes private while permitting each authenticated student to
-- read only their own history. Existing unowned guest bookings remain admin-only.
drop policy if exists bookings_admin_scope_guard on public.bookings;
create policy bookings_admin_scope_guard
  on public.bookings as restrictive
  for all to authenticated
  using (
    auth.role() = 'authenticated'
    and (public.is_current_user_admin() or student_id = (select auth.uid()))
  )
  with check (auth.role() = 'authenticated' and public.is_current_user_admin());
drop policy if exists bookings_student_read_own on public.bookings;
create policy bookings_student_read_own
  on public.bookings for select to authenticated
  using (student_id = (select auth.uid()));
