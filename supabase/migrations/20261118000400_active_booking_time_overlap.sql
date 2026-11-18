-- Serialize reservations for an equipment/date pair and reject overlapping
-- active bookings, even if an administrator configures different slot labels
-- whose start/end times overlap.
create or replace function public.prevent_overlapping_active_booking_slot()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.booking_status not in ('Confirmed', 'Pending Verification', 'confirmed', 'pending_verification', 'pending_payment') then
    return new;
  end if;

  if new.equipment_id is null
     or new.booking_date is null
     or new.slot is null
     or new.start_time is null
     or new.end_time is null
     or new.end_time <= new.start_time then
    raise exception using
      errcode = '23514',
      constraint = 'bookings_valid_active_slot_window',
      message = 'Active bookings require a valid equipment, date, and time window';
  end if;

  if tg_op = 'UPDATE'
     and old.booking_status in ('Confirmed', 'Pending Verification', 'confirmed', 'pending_verification', 'pending_payment')
     and old.equipment_id is not distinct from new.equipment_id
     and old.booking_date is not distinct from new.booking_date
     and old.start_time is not distinct from new.start_time
     and old.end_time is not distinct from new.end_time then
    return new;
  end if;

  -- A date-level lock makes checks for different, overlapping labels serial.
  perform pg_advisory_xact_lock(
    hashtextextended(new.equipment_id::text || '|' || new.booking_date::text, 1)
  );

  if exists (
    select 1
    from public.bookings as existing
    where existing.equipment_id = new.equipment_id
      and existing.booking_date = new.booking_date
      and existing.booking_status in ('Confirmed', 'Pending Verification', 'confirmed', 'pending_verification', 'pending_payment')
      and existing.id <> new.id
      and (
        existing.slot = new.slot
        or (
          existing.start_time is not null
          and existing.end_time is not null
          and existing.start_time < new.end_time
          and existing.end_time > new.start_time
        )
      )
  ) then
    raise exception using
      errcode = '23505',
      constraint = 'bookings_no_overlapping_active_time_idx',
      message = 'This equipment time window is already booked';
  end if;

  return new;
end;
$$;

drop trigger if exists bookings_prevent_overlapping_active_slot on public.bookings;
create trigger bookings_prevent_overlapping_active_slot
  before insert or update of equipment_id, booking_date, start_time, end_time, slot, booking_status
  on public.bookings
  for each row
  execute function public.prevent_overlapping_active_booking_slot();

-- Keep the admin-configured schedule internally consistent as well.
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

  perform pg_advisory_xact_lock(hashtextextended('public.time_slots.active_window', 2));

  if exists (
    select 1
    from public.time_slots as existing
    where existing.is_active
      and existing.id <> new.id
      and existing.start_time < new.end_time
      and existing.end_time > new.start_time
  ) then
    raise exception using
      errcode = '23505',
      constraint = 'time_slots_no_overlapping_active_window',
      message = 'Active time slots cannot overlap';
  end if;

  return new;
end;
$$;

drop trigger if exists time_slots_prevent_overlapping_active_window on public.time_slots;
create trigger time_slots_prevent_overlapping_active_window
  before insert or update of start_time, end_time, is_active
  on public.time_slots
  for each row
  execute function public.prevent_overlapping_active_time_slot();
