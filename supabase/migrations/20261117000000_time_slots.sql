-- Persistent admin-configurable booking slots.
create table if not exists public.time_slots (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists time_slots_label_unique_idx
  on public.time_slots (label);

insert into public.time_slots (label, start_time, end_time, is_active, sort_order)
select seed.label, seed.start_time::time, seed.end_time::time, true, seed.sort_order
from (values
  ('09:00 AM', '09:00', '10:00', 1),
  ('10:00 AM', '10:00', '11:00', 2),
  ('11:00 AM', '11:00', '12:00', 3),
  ('12:00 PM', '12:00', '13:00', 4),
  ('01:00 PM', '13:00', '14:00', 5),
  ('02:00 PM', '14:00', '15:00', 6),
  ('03:00 PM', '15:00', '16:00', 7),
  ('04:00 PM', '16:00', '17:00', 8),
  ('05:00 PM', '17:00', '18:00', 9)
) as seed(label, start_time, end_time, sort_order)
where not exists (
  select 1 from public.time_slots existing where existing.label = seed.label
);

alter table public.time_slots enable row level security;

drop policy if exists "anyone_can_read_time_slots" on public.time_slots;
drop policy if exists "authenticated_can_manage_time_slots" on public.time_slots;
drop policy if exists "admins_can_manage_time_slots" on public.time_slots;

create policy "anyone_can_read_time_slots"
  on public.time_slots for select to anon, authenticated using (true);

create policy "admins_can_manage_time_slots"
  on public.time_slots for all to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

grant select on public.time_slots to anon, authenticated;
grant insert, update, delete on public.time_slots to authenticated;
