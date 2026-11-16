import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    // ── Auth: read JWT from Authorization header ──────────────────────────
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify the JWT and get the user
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(jwt);
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Check role from profiles table
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'student') {
      return new Response(JSON.stringify({ error: 'Only students can create bookings' }), { status: 403 });
    }

    // ── Parse payload ─────────────────────────────────────────────────────
    const payload = await req.json();
    const {
      equipment_id,
      date_iso,
      slot,
      payment_method = 'UPI',
      student_name,
      room_no,
      pin,
    } = payload;

    if (!equipment_id || !date_iso || !slot) {
      return new Response(JSON.stringify({ error: 'Missing required fields: equipment_id, date_iso, slot' }), { status: 400 });
    }

    // ── Get equipment (price & name) ──────────────────────────────────────
    const { data: equip, error: equipErr } = await supabaseAdmin
      .from('equipment')
      .select('name, price, status')
      .eq('id', equipment_id)
      .single();

    if (equipErr || !equip) {
      return new Response(JSON.stringify({ error: 'Equipment not found' }), { status: 400 });
    }

    if (equip.status === 'Maintenance') {
      return new Response(JSON.stringify({ error: 'Equipment is under maintenance' }), { status: 400 });
    }

    // ── Prevent double-booking ────────────────────────────────────────────
    const { data: existing } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('equipment_id', equipment_id)
      .eq('date_iso', date_iso)
      .eq('slot', slot)
      .eq('status', 'Confirmed')
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: 'This slot is already booked' }), { status: 409 });
    }

    // ── Create booking ────────────────────────────────────────────────────
    const bookingId = crypto.randomUUID();
    const booking = {
      id: bookingId,
      equipment_id,
      equipment_name: equip.name,
      date: new Date(date_iso).toDateString(),
      date_iso,
      time: slot,
      slot,
      price: equip.price,
      duration: '1 Hour',
      status: 'Confirmed',
      payment_status: 'Pending',
      payment_method,
      utr: null,
      submitted_at: new Date().toISOString(),
      student_name: student_name ?? user.email,
      room_no: room_no ?? '',
      pin: pin ?? '',
      proof: null,
    };

    const { data, error } = await supabaseAdmin.from('bookings').insert([booking]).select().single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    // ── Audit log ─────────────────────────────────────────────────────────
    await supabaseAdmin.from('audit_logs').insert({
      admin_id: null,
      action: 'create_booking',
      target_table: 'bookings',
      target_id: bookingId,
      details: { equipment_id, date_iso, slot, payment_method },
    });

    return new Response(JSON.stringify({ booking: data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? 'Internal error' }), { status: 500 });
  }
});
