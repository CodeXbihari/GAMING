-- Store only a digest of the booking capability used by the guest
-- confirmation flow. The raw token is returned only to the booking browser.
alter table public.bookings
  add column if not exists booking_access_token_hash text;

alter table public.bookings
  drop constraint if exists bookings_access_token_hash_format;

alter table public.bookings
  add constraint bookings_access_token_hash_format
  check (
    booking_access_token_hash is null
    or booking_access_token_hash ~ '^[a-f0-9]{64}$'
  );

-- Storage policies are managed separately; the linked migration role does
-- not own Supabase's managed storage.objects table.
