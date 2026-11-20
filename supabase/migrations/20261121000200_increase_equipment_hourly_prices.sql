-- Apply the ₹10 hourly increase to existing equipment so server-side booking
-- totals match the prices shown in the customer UI.
update public.equipment
set price_per_hour = price_per_hour + 10
where price_per_hour is not null;
