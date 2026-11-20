-- A slot is exclusive across the equipment fleet. Serialize by date, then
-- reject equal or overlapping active booking windows on any equipment item.
create or replace function public.prevent_overlapping_active_booking_slot()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.booking_status not in ('Confirmed', 'Pending Verification', 'Pending Payment', 'confirmed', 'pending_verification', 'pending_payment') then
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
      message = 'Active bookings require a valid date and time window';
  end if;

  if tg_op = 'UPDATE'
     and old.booking_status in ('Confirmed', 'Pending Verification', 'Pending Payment', 'confirmed', 'pending_verification', 'pending_payment')
     and old.booking_date is not distinct from new.booking_date
     and old.start_time is not distinct from new.start_time
     and old.end_time is not distinct from new.end_time
     and old.slot is not distinct from new.slot then
    return new;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('global-booking-slot|' || new.booking_date::text, 1)
  );

  if exists (
    select 1
    from public.bookings as existing
    where existing.booking_date = new.booking_date
      and existing.booking_status in ('Confirmed', 'Pending Verification', 'Pending Payment', 'confirmed', 'pending_verification', 'pending_payment')
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
      message = 'This time slot is already booked for another rig';
  end if;

  return new;
end;
$$;
