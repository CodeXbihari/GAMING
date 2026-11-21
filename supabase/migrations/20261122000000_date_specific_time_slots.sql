-- Keep the existing rows as the default schedule and allow an override per date.
alter table public.time_slots
  add column if not exists booking_date date;

drop index if exists public.time_slots_label_unique_idx;
create unique index if not exists time_slots_default_label_unique_idx
  on public.time_slots (label)
  where booking_date is null;
create unique index if not exists time_slots_date_label_unique_idx
  on public.time_slots (booking_date, label)
  where booking_date is not null;

create table if not exists public.time_slot_schedules (
  booking_date date primary key,
  created_at timestamptz not null default now()
);

alter table public.time_slot_schedules enable row level security;
revoke all on public.time_slot_schedules from public, anon, authenticated;
grant select on public.time_slot_schedules to anon, authenticated;
grant insert, delete on public.time_slot_schedules to authenticated;

drop policy if exists time_slot_schedules_public_read on public.time_slot_schedules;
create policy time_slot_schedules_public_read
  on public.time_slot_schedules for select to anon, authenticated
  using (true);
drop policy if exists time_slot_schedules_admin_insert on public.time_slot_schedules;
create policy time_slot_schedules_admin_insert
  on public.time_slot_schedules as restrictive for insert to authenticated
  with check (auth.role() = 'authenticated' and public.is_current_user_admin());
drop policy if exists time_slot_schedules_admin_delete on public.time_slot_schedules;
create policy time_slot_schedules_admin_delete
  on public.time_slot_schedules as restrictive for delete to authenticated
  using (auth.role() = 'authenticated' and public.is_current_user_admin());
drop policy if exists time_slot_schedules_admin_manage on public.time_slot_schedules;
create policy time_slot_schedules_admin_manage
  on public.time_slot_schedules for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create or replace function public.create_time_slot_override(target_date date)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_count integer;
begin
  if not public.is_current_user_admin() then
    raise exception using errcode = '42501', message = 'Admin access required';
  end if;

  if target_date is null then
    raise exception using errcode = '22004', message = 'A booking date is required';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('time-slot-override|' || target_date::text, 1));

  insert into public.time_slot_schedules (booking_date)
  values (target_date)
  on conflict (booking_date) do nothing;
  get diagnostics inserted_count = row_count;

  if inserted_count = 1 then
    insert into public.time_slots (label, start_time, end_time, is_active, sort_order, booking_date)
    select label, start_time, end_time, is_active, sort_order, target_date
      from public.time_slots
     where booking_date is null
     order by sort_order;
  end if;

  return true;
end;
$$;

create or replace function public.reset_time_slot_override(target_date date)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_current_user_admin() then
    raise exception using errcode = '42501', message = 'Admin access required';
  end if;

  if target_date is null then
    raise exception using errcode = '22004', message = 'A booking date is required';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('time-slot-override|' || target_date::text, 1));
  delete from public.time_slots where booking_date = target_date;
  delete from public.time_slot_schedules where booking_date = target_date;
  return true;
end;
$$;

revoke all on function public.create_time_slot_override(date) from public, anon;
revoke all on function public.reset_time_slot_override(date) from public, anon;
grant execute on function public.create_time_slot_override(date) to authenticated;
grant execute on function public.reset_time_slot_override(date) to authenticated;

-- Overlap validation is scoped to one schedule: default slots may overlap a
-- date-specific slot because they are never active together on that date.
create or replace function public.prevent_overlapping_active_time_slot()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.end_time <= new.start_time then
    raise exception using
      errcode = '23514',
      constraint = 'time_slots_valid_window',
      message = 'A time slot must end after it starts';
  end if;

  if not new.is_active then
    return new;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('public.time_slots.active_window|' || coalesce(new.booking_date::text, 'default'), 2)
  );

  if exists (
    select 1
      from public.time_slots existing
     where existing.is_active
       and existing.id <> new.id
       and existing.booking_date is not distinct from new.booking_date
       and existing.start_time < new.end_time
       and existing.end_time > new.start_time
  ) then
    raise exception using
      errcode = '23505',
      constraint = 'time_slots_no_overlapping_active_window',
      message = 'Active time slots cannot overlap within the same schedule';
  end if;

  return new;
end;
$$;

drop trigger if exists time_slots_prevent_overlapping_active_window on public.time_slots;
create trigger time_slots_prevent_overlapping_active_window
  before insert or update of start_time, end_time, is_active, booking_date
  on public.time_slots
  for each row
  execute function public.prevent_overlapping_active_time_slot();
