-- Repair a malformed display label while preserving the configured 18:00-19:00 window.
update public.time_slots
set label = '06:00 PM'
where label = '0GJH:00 PM'
  and start_time = '18:00:00'
  and end_time = '19:00:00';
