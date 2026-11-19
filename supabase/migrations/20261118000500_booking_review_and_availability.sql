-- Matches the availability endpoint's equipment/date lookup and legacy active statuses.
create index if not exists bookings_active_equipment_date_lookup_idx
  on public.bookings (equipment_id, booking_date)
  include (slot, start_time, end_time)
  where booking_status in ('Confirmed', 'Pending Verification', 'confirmed', 'pending_verification', 'pending_payment');

create or replace function public.prevent_cancelled_booking_payment_reactivation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if lower(old.booking_status) = 'cancelled'
    and lower(new.booking_status) = 'confirmed'
    and lower(new.payment_status) = 'paid' then
    raise exception using errcode = '23514', message = 'Cancelled bookings cannot be confirmed by payment review';
  end if;
  return new;
end;
$$;

create trigger bookings_prevent_cancelled_payment_reactivation
  before update of booking_status, payment_status on public.bookings
  for each row execute function public.prevent_cancelled_booking_payment_reactivation();
