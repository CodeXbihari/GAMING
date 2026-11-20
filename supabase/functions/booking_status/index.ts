import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const respond = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return respond({ error: 'Method not allowed' }, 405);

  try {
    const rawBody = await req.text();
    if (rawBody.length > 4096) return respond({ error: 'Request is too large' }, 413);
    const payload = JSON.parse(rawBody);
    const bookingId = typeof payload?.booking_id === 'string' ? payload.booking_id.trim() : '';
    const accessToken = typeof payload?.booking_access_token === 'string' ? payload.booking_access_token.trim() : '';
    if (!bookingId || bookingId.length > 100 || !/^[a-f0-9]{64}$/i.test(accessToken)) {
      return respond({ error: 'Booking credentials are invalid' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) return respond({ error: 'Booking status is unavailable' }, 503);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: booking, error } = await admin
      .from('bookings')
      .select('booking_status, payment_status')
      .eq('id', bookingId)
      .eq('booking_access_token_hash', await sha256Hex(accessToken))
      .maybeSingle();
    if (error) return respond({ error: 'Could not load booking status' }, 503);
    if (!booking) return respond({ error: 'Booking not found' }, 404);

    return respond({ booking_status: booking.booking_status, payment_status: booking.payment_status });
  } catch {
    return respond({ error: 'Could not load booking status' }, 400);
  }
});
