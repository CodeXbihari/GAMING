-- Set the current hourly price for every existing inventory item by category.
update public.equipment
set price_per_hour = case lower(category)
  when 'controller' then 29
  when 'laptop' then 49
  when 'combo' then 69
  else price_per_hour
end
where lower(category) in ('controller', 'laptop', 'combo');
