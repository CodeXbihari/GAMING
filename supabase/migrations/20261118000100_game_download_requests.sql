create table if not exists public.game_download_requests (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  wants_download boolean not null,
  game_name text,
  notification_sent boolean not null default false,
  created_at timestamptz not null default now(),
  constraint game_download_requests_name_matches_choice check (
    (wants_download and nullif(btrim(game_name), '') is not null)
    or (not wants_download and game_name is null)
  )
);

alter table public.game_download_requests enable row level security;

revoke all on public.game_download_requests from anon, authenticated;
grant select on public.game_download_requests to authenticated;
grant all on public.game_download_requests to service_role;

drop policy if exists admins_can_read_game_download_requests on public.game_download_requests;
create policy admins_can_read_game_download_requests
  on public.game_download_requests
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
