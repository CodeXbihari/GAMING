import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(jwt);
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isStudent = profile?.role === 'student';

    if (!isAdmin && !isStudent) {
      return new Response(JSON.stringify({ error: 'Unauthorized role' }), { status: 403 });
    }

    const { booking_id } = await req.json();
    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'booking_id required' }), { status: 400 });
    }

    const { data: booking, error: fetchErr } = await supabaseAdmin
      .from('bookings')
      .select('status, date_iso, slot, student_name')
      .eq('id', booking_id)
      .single();

    if (fetchErr || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404 });
    }

    // Students can only cancel their own bookings, >30 min before slot
    if (isStudent) {
      if (booking.student_name !== user.email) {
        return new Response(JSON.stringify({ error: 'Cannot cancel another student\'s booking' }), { status: 403 });
      }
      const slotDate = new Date(`${booking.date_iso}T${booking.slot}`);
      const diffMins = (slotDate.getTime() - Date.now()) / (1000 * 60);
      if (diffMins < 30) {
        return new Response(JSON.stringify({ error: 'Cancellation window has passed (30 min before slot)' }), { status: 400 });
      }
    }

    const { error: updErr } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'Cancelled', updated_at: new Date().toISOString() })
      .eq('id', booking_id);

    if (updErr) {
      return new Response(JSON.stringify({ error: updErr.message }), { status: 400 });
    }

    if (isAdmin) {
      await supabaseAdmin.from('audit_logs').insert({
        admin_id: user.id,
        action: 'cancel_booking',
        target_table: 'bookings',
        target_id: booking_id,
        details: { cancelledBy: 'admin', adminEmail: user.email },
      });
    }

    return new Response(JSON.stringify({ message: 'Booking cancelled successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? 'Internal error' }), { status: 500 });
  }
});
