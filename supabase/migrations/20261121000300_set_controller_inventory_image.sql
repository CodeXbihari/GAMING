-- Use the supplied optimized-in-repo controller image for the second
-- controller rig instead of its embedded database image.
update public.equipment
set image_url = '/images/controller-evofox-neon.png'
where asset_code = 'CON-002'
  and category = 'controller';
