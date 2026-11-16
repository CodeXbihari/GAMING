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

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403 });
    }

    const { booking_id, new_status } = await req.json();
    if (!booking_id || !['Paid', 'Rejected'].includes(new_status)) {
      return new Response(JSON.stringify({ error: 'booking_id and new_status (Paid|Rejected) required' }), { status: 400 });
    }

    // Update booking payment status
    const { data: booking, error: updateErr } = await supabaseAdmin
      .from('bookings')
      .update({
        payment_status: new_status,
        status: new_status === 'Rejected' ? 'Cancelled' : 'Confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking_id)
      .select('student_name, equipment_name, slot, date')
      .single();

    if (updateErr) {
      return new Response(JSON.stringify({ error: updateErr.message }), { status: 400 });
    }

    // Log admin action
    await supabaseAdmin.from('audit_logs').insert({
      admin_id: user.id,
      action: 'verify_payment',
      target_table: 'bookings',
      target_id: booking_id,
      details: { new_status, adminEmail: user.email },
    });

    // Send email notification (fire and forget – don't block response on it)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    fetch(`${supabaseUrl}/functions/v1/notifications_send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({
        to: booking.student_name, // treated as email here; adjust if separate email field
        subject: new_status === 'Paid'
          ? `Payment confirmed – Booking #${booking_id}`
          : `Payment rejected – Booking #${booking_id}`,
        template: 'payment_status',
        vars: {
          student_name: booking.student_name,
          booking_id,
          status: new_status,
          equipment_name: booking.equipment_name,
          slot: booking.slot,
          date: booking.date,
        },
      }),
    }).catch(() => {/* ignore notification errors */});

    return new Response(JSON.stringify({ message: `Payment ${new_status.toLowerCase()} successfully` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? 'Internal error' }), { status: 500 });
  }
});
