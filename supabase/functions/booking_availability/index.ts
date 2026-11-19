import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const respond = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const dateInIndia = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
};

const addDays = (dateISO: string, days: number) => {
  const date = new Date(`${dateISO}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return respond({ error: 'Method not allowed' }, 405);

  try {
    const contentLength = Number(req.headers.get('content-length') ?? 0);
    if (contentLength > 4096) return respond({ error: 'Request is too large' }, 413);
    const rawBody = await req.text();
    if (rawBody.length > 4096) return respond({ error: 'Request is too large' }, 413);

    const body = JSON.parse(rawBody);
    const equipmentId = typeof body?.equipment_id === 'string' ? body.equipment_id.trim() : '';
    const dateISO = typeof body?.date_iso === 'string' ? body.date_iso.trim() : '';
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(equipmentId)) {
      return respond({ error: 'Choose valid equipment' }, 400);
    }
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(dateISO)
      ? new Date(`${dateISO}T00:00:00.000Z`)
      : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== dateISO) {
      return respond({ error: 'Choose a valid booking date' }, 400);
    }
    const today = dateInIndia(new Date());
    if (dateISO < today || dateISO > addDays(today, 2)) {
      return respond({ error: 'Booking date is outside the allowed window' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Availability service is missing server configuration');
      return respond({ error: 'Availability service is not configured' }, 503);
    }
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const [{ data: slots, error: slotsError }, { data: bookings, error: bookingsError }] = await Promise.all([
      admin.from('time_slots').select('label, start_time, end_time').eq('is_active', true).order('sort_order'),
      admin.from('bookings').select('slot, start_time, end_time')
        .eq('equipment_id', equipmentId)
        .eq('booking_date', dateISO)
        .in('booking_status', ['Confirmed', 'Pending Verification', 'confirmed', 'pending_verification', 'pending_payment']),
    ]);

    if (slotsError || bookingsError) {
      console.error('Could not load booking availability:', slotsError?.code ?? bookingsError?.code ?? 'unknown');
      return respond({ error: 'Could not load booking availability' }, 503);
    }

    const activeBookings = bookings ?? [];
    const unavailableSlots = (slots ?? []).filter((candidate) => activeBookings.some((booking) => {
      if (booking.slot === candidate.label) return true;
      return Boolean(
        booking.start_time && booking.end_time
        && candidate.start_time < booking.end_time
        && candidate.end_time > booking.start_time
      );
    })).map((slot) => slot.label);

    return respond({ unavailable_slots: unavailableSlots, slots: slots ?? [] });
  } catch (error) {
    console.error('Availability request failed:', error instanceof Error ? error.name : 'Unknown error');
    return respond({ error: 'Could not load booking availability' }, 500);
  }
});
