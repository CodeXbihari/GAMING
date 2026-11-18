-- Preserve existing records while preventing new concurrent duplicates.
create index if not exists bookings_active_equipment_slot_lookup_idx
  on public.bookings (equipment_id, booking_date, slot)
  where booking_status in ('Confirmed', 'Pending Verification');

create or replace function public.prevent_duplicate_active_booking_slot()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.booking_status not in ('Confirmed', 'Pending Verification') then
    return new;
  end if;

  -- Let admins update payment details or confirm an existing active booking.
  -- Recheck only when the reservation key/status becomes active or changes.
  if tg_op = 'UPDATE'
     and old.booking_status in ('Confirmed', 'Pending Verification')
     and old.equipment_id is not distinct from new.equipment_id
     and old.booking_date is not distinct from new.booking_date
     and old.slot is not distinct from new.slot then
    return new;
  end if;

  -- Serialize attempts for the same equipment/date/slot before checking rows.
  perform pg_advisory_xact_lock(
    hashtextextended(new.equipment_id::text || '|' || new.booking_date::text || '|' || new.slot::text, 0)
  );

  if exists (
    select 1
    from public.bookings existing
    where existing.equipment_id = new.equipment_id
      and existing.booking_date = new.booking_date
      and existing.slot = new.slot
      and existing.booking_status in ('Confirmed', 'Pending Verification')
      and existing.id <> new.id
  ) then
    raise exception using
      errcode = '23505',
      constraint = 'bookings_one_active_equipment_slot_idx',
      message = 'This equipment slot is already booked';
  end if;

  return new;
end;
$$;

drop trigger if exists bookings_prevent_duplicate_active_slot on public.bookings;
create trigger bookings_prevent_duplicate_active_slot
  before insert or update of equipment_id, booking_date, slot, booking_status
  on public.bookings
  for each row
  execute function public.prevent_duplicate_active_booking_slot();
