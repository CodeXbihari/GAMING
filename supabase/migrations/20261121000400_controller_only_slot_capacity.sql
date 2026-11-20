-- Reservations are currently offered only for controller rigs. Controller
-- sessions can share a time window up to the configured controller inventory.
create or replace function public.prevent_overlapping_active_booking_slot()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  target_category text;
  target_capacity integer;
  controller_capacity integer;
  total_overlapping integer;
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

  select lower(category), greatest(coalesce(inventory_count, 1), 1)
    into target_category, target_capacity
    from public.equipment
   where id = new.equipment_id;

  -- Non-controller booking requests are rejected by the booking Edge Function;
  -- this trigger leaves historic/admin-managed non-controller rows intact.
  if target_category is distinct from 'controller' then
    return new;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('controller-booking-slot|' || new.booking_date::text, 1)
  );

  select coalesce(sum(greatest(coalesce(inventory_count, 1), 1)), 0)::integer
    into controller_capacity
    from public.equipment
   where lower(category) = 'controller'
     and lower(status) = 'available';

  select count(*)::integer,
         count(*) filter (where b.equipment_id = new.equipment_id)::integer
    into total_overlapping, target_overlapping
    from public.bookings b
    join public.equipment e on e.id = b.equipment_id
   where b.id <> new.id
     and b.booking_date = new.booking_date
     and lower(e.category) = 'controller'
     and b.booking_status in ('Confirmed', 'Pending Verification', 'Pending Payment', 'confirmed', 'pending_verification', 'pending_payment')
     and (
       b.slot = new.slot
       or (b.start_time < new.end_time and b.end_time > new.start_time)
     );

  if controller_capacity <= 0
     or total_overlapping >= controller_capacity
     or target_overlapping >= target_capacity then
    raise exception using
      errcode = '23505',
      constraint = 'bookings_controller_slot_capacity',
      message = 'All controller units are booked for this time slot';
  end if;

  return new;
end;
$$;
