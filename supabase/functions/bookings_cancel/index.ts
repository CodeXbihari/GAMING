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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return respond({ error: 'Method not allowed' }, 405);

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const tokenMatch = /^Bearer\s+(.+)$/i.exec(authHeader);
    if (!tokenMatch) return respond({ error: 'Unauthorized' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Booking cancellation service is missing server configuration');
      return respond({ error: 'Cancellation service is not configured' }, 503);
    }

    const declaredSize = Number(req.headers.get('content-length') ?? 0);
    if (declaredSize > 4096) return respond({ error: 'Request is too large' }, 413);
    const rawBody = await req.text();
    if (rawBody.length > 4096) return respond({ error: 'Request is too large' }, 413);
    const payload = JSON.parse(rawBody);
    const bookingId = typeof payload?.booking_id === 'string' ? payload.booking_id.trim() : '';
    if (!bookingId || bookingId.length > 100) return respond({ error: 'A booking ID is required' }, 400);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: { user }, error: authError } = await admin.auth.getUser(tokenMatch[1]);
    if (authError || !user) return respond({ error: 'Unauthorized' }, 401);

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) return respond({ error: 'Could not verify account permissions' }, 503);
    if (!profile || !['admin', 'student'].includes(profile.role)) {
      return respond({ error: 'Account is not allowed to cancel bookings' }, 403);
    }

    const lookupColumn = /^#?GH\d{8}$/.test(bookingId) ? 'booking_reference' : 'id';
    const { data: booking, error: bookingError } = await admin
      .from('bookings')
      .select('id, student_id, booking_date, start_time, booking_status')
      .eq(lookupColumn, bookingId.replace(/^#/, ''))
      .maybeSingle();
    if (bookingError) return respond({ error: 'Could not load the reservation' }, 503);
    if (!booking) return respond({ error: 'Booking not found' }, 404);

    const isAdmin = profile.role === 'admin';
    if (!isAdmin && booking.student_id !== user.id) {
      return respond({ error: 'You can only cancel your own reservation' }, 403);
    }
    const activeStatuses = ['Confirmed', 'Pending Verification', 'confirmed', 'pending_verification', 'pending_payment'];
    if (!activeStatuses.includes(booking.booking_status)) {
      return respond({ error: 'This reservation can no longer be cancelled' }, 409);
    }

    if (!isAdmin) {
      if (!booking.start_time) return respond({ error: 'Cancellation time could not be verified' }, 409);
      const startsAt = new Date(`${booking.booking_date}T${booking.start_time}+05:30`).getTime();
      if (!Number.isFinite(startsAt) || (startsAt - Date.now()) / 60_000 < 30) {
        return respond({ error: 'Cancellation is available until 30 minutes before the session' }, 400);
      }
    }

    const { data: updated, error: updateError } = await admin
      .from('bookings')
      .update({ booking_status: 'Cancelled' })
      .eq('id', booking.id)
      .eq('booking_status', booking.booking_status)
      .select('id')
      .maybeSingle();
    if (updateError) return respond({ error: 'Could not cancel the reservation' }, 503);
    if (!updated) return respond({ error: 'Reservation status changed; refresh and try again' }, 409);

    if (isAdmin) {
      const { error: auditError } = await admin.from('audit_logs').insert({
        admin_id: user.id,
        action: 'cancel_booking',
        target_table: 'bookings',
        target_id: booking.id,
        details: { cancelledBy: 'admin' },
      });
      if (auditError) console.error('Could not write cancellation audit event:', auditError.code ?? 'unknown');
    }

    return respond({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Booking cancellation failed:', error instanceof Error ? error.name : 'Unknown error');
    return respond({ error: 'Could not process the cancellation' }, 500);
  }
});
