import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
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
    const tokenMatch = /^Bearer\s+(.+)$/i.exec(req.headers.get('Authorization') ?? '');
    if (!tokenMatch) return respond({ error: 'Unauthorized' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Payment verification service is missing server configuration');
      return respond({ error: 'Payment verification is not configured' }, 503);
    }
    const contentLength = Number(req.headers.get('content-length') ?? 0);
    if (contentLength > 4096) return respond({ error: 'Request is too large' }, 413);
    const rawBody = await req.text();
    if (rawBody.length > 4096) return respond({ error: 'Request is too large' }, 413);
    const payload = JSON.parse(rawBody);
    const bookingId = typeof payload?.booking_id === 'string' ? payload.booking_id.trim() : '';
    const newStatus = payload?.new_status;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(bookingId)
      || !['Paid', 'Rejected'].includes(newStatus)) {
      return respond({ error: 'A booking ID and valid payment decision are required' }, 400);
    }

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
    if (profile?.role !== 'admin') return respond({ error: 'Admin access required' }, 403);

    const nextBookingStatus = newStatus === 'Paid' ? 'Confirmed' : 'Cancelled';
    const { data: booking, error: updateError } = await admin
      .from('bookings')
      .update({ payment_status: newStatus, booking_status: nextBookingStatus })
      .eq('id', bookingId)
      .eq('payment_status', 'Pending')
      .in('booking_status', ['Confirmed', 'Pending Verification', 'confirmed', 'pending_verification', 'pending_payment'])
      .select('id, booking_reference')
      .maybeSingle();
    if (updateError) {
      console.error('Could not update payment decision:', updateError.code ?? 'unknown');
      return respond({ error: 'Could not update payment status' }, 503);
    }
    if (!booking) return respond({ error: 'Booking not found or payment was already reviewed' }, 409);

    const { error: auditError } = await admin.from('audit_logs').insert({
      admin_id: user.id,
      action: 'verify_payment',
      target_table: 'bookings',
      target_id: booking.id,
      details: { new_status: newStatus },
    });
    if (auditError) console.error('Could not write payment audit event:', auditError.code ?? 'unknown');

    return respond({ message: `Payment ${newStatus.toLowerCase()} successfully`, booking_reference: booking.booking_reference });
  } catch (error) {
    console.error('Payment verification failed:', error instanceof Error ? error.name : 'Unknown error');
    return respond({ error: 'Could not process payment verification' }, 500);
  }
});
