-- Time Slots table for admin-editable scheduling
-- Run this in your Supabase SQL editor

create table if not exists time_slots (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Seed the 9 default hourly slots
insert into time_slots (label, start_time, end_time, is_active, sort_order) values
  ('09:00 AM', '09:00', '10:00', true, 1),
  ('10:00 AM', '10:00', '11:00', true, 2),
  ('11:00 AM', '11:00', '12:00', true, 3),
  ('12:00 PM', '12:00', '13:00', true, 4),
  ('01:00 PM', '13:00', '14:00', true, 5),
  ('02:00 PM', '14:00', '15:00', true, 6),
  ('03:00 PM', '15:00', '16:00', true, 7),
  ('04:00 PM', '16:00', '17:00', true, 8),
  ('05:00 PM', '17:00', '18:00', true, 9)
on conflict do nothing;

-- RLS policies
alter table time_slots enable row level security;

create policy "anyone_can_read_time_slots"
  on time_slots for select using (true);

create policy "authenticated_can_manage_time_slots"
  on time_slots for all using (true);
