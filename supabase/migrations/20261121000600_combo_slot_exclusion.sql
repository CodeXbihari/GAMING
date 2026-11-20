-- Equipment can be booked independently up to its inventory capacity. A combo
-- shares hardware with the other rigs, so an active booking for any other
-- equipment blocks a combo for the same date and overlapping time window.
create or replace function public.prevent_overlapping_active_booking_slot()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  target_category text;
  target_capacity integer;
  target_overlapping integer;
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
     and old.equipment_id is not distinct from new.equipment_id
     and old.booking_date is not distinct from new.booking_date
     and old.start_time is not distinct from new.start_time
     and old.end_time is not distinct from new.end_time
     and old.slot is not distinct from new.slot then
    return new;
  end if;

  -- Serialize date-level checks so a combo and a normal rig cannot race each
  -- other past the combo exclusion.
  perform pg_advisory_xact_lock(
    hashtextextended('equipment-booking-slot|' || new.booking_date::text, 1)
  );

  select lower(category), greatest(coalesce(inventory_count, 1), 1)
    into target_category, target_capacity
    from public.equipment
   where id = new.equipment_id;

  select count(*)::integer
    into target_overlapping
    from public.bookings b
   where b.id <> new.id
     and b.equipment_id = new.equipment_id
     and b.booking_date = new.booking_date
     and b.booking_status in ('Confirmed', 'Pending Verification', 'Pending Payment', 'confirmed', 'pending_verification', 'pending_payment')
     and (
       b.slot = new.slot
       or (b.start_time < new.end_time and b.end_time > new.start_time)
     );

  if target_overlapping >= coalesce(target_capacity, 1) then
    raise exception using
      errcode = '23505',
      constraint = 'bookings_equipment_slot_capacity',
      message = 'This equipment is fully booked for this time slot';
  end if;

  if target_category = 'combo' and exists (
    select 1
      from public.bookings b
     where b.id <> new.id
       and b.equipment_id <> new.equipment_id
       and b.booking_date = new.booking_date
       and b.booking_status in ('Confirmed', 'Pending Verification', 'Pending Payment', 'confirmed', 'pending_verification', 'pending_payment')
       and (
         b.slot = new.slot
         or (b.start_time < new.end_time and b.end_time > new.start_time)
       )
  ) then
    raise exception using
      errcode = '23505',
      constraint = 'bookings_combo_slot_exclusion',
      message = 'A different equipment is booked for this time slot, so the combo is unavailable';
  end if;

  return new;
end;
$$;
