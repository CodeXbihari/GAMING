create table public.student_guest_profiles (
  browser_key_hash bytea primary key,
  student_name text not null check (char_length(student_name) between 1 and 120),
  room_no text not null check (char_length(room_no) between 1 and 40),
  mobile_number text not null check (mobile_number ~ '^[+]?[0-9]{7,15}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_guest_profiles enable row level security;
revoke all on public.student_guest_profiles from public, anon, authenticated;

create function public.save_student_guest_profile(
  browser_key text,
  full_name text,
  room_number text,
  mobile text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_name text := btrim(full_name);
  clean_room text := btrim(room_number);
  clean_mobile text := regexp_replace(btrim(mobile), '[ ()-]', '', 'g');
begin
  if browser_key is null or browser_key !~ '^[0-9a-f]{64}$'
    or clean_name is null or char_length(clean_name) not between 1 and 120
    or clean_room is null or char_length(clean_room) not between 1 and 40
    or clean_name ~ '[[:cntrl:]]' or clean_room ~ '[[:cntrl:]]'
    or mobile is null or char_length(mobile) > 40
    or clean_mobile !~ '^[+]?[0-9]{7,15}$' then
    raise exception using errcode = '22023', message = 'Enter a valid student name, room number, and mobile number.';
  end if;

  insert into public.student_guest_profiles (browser_key_hash, student_name, room_no, mobile_number)
  values (sha256(convert_to(browser_key, 'UTF8')), clean_name, clean_room, clean_mobile)
  on conflict (browser_key_hash) do update
  set student_name = excluded.student_name,
      room_no = excluded.room_no,
      mobile_number = excluded.mobile_number,
      updated_at = now();
end;
$$;

create function public.clear_student_guest_profile(browser_key text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if browser_key is null or browser_key !~ '^[0-9a-f]{64}$' then
    raise exception using errcode = '22023', message = 'Invalid browser profile key.';
  end if;

  delete from public.student_guest_profiles
  where browser_key_hash = sha256(convert_to(browser_key, 'UTF8'));
end;
$$;

revoke all on function public.save_student_guest_profile(text, text, text, text) from public;
revoke all on function public.clear_student_guest_profile(text) from public;
grant execute on function public.save_student_guest_profile(text, text, text, text) to anon, authenticated;
grant execute on function public.clear_student_guest_profile(text) to anon, authenticated;
