import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const dateInIndia = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
};

const addDays = (dateISO: string, days: number) => {
  const date = new Date(`${dateISO}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const randomNumber = (min: number, max: number) => {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return min + (value[0] % (max - min));
};

const randomHexToken = (length = 32) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const schemaError = (error: { code?: string } | null) =>
  ['PGRST204', 'PGRST205', '42703', '42P01'].includes(error?.code ?? '');

const isUuidShape = (value: string) => /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const declaredSize = Number(req.headers.get('content-length') ?? 0);
    if (declaredSize > 8192) return jsonResponse({ error: 'Request is too large' }, 413);
    const rawBody = await req.text();
    if (rawBody.length > 8192) return jsonResponse({ error: 'Request is too large' }, 413);

    const payload = JSON.parse(rawBody);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return jsonResponse({ error: 'Invalid booking request' }, 400);
    }

    const equipmentId = typeof payload.equipment_id === 'string' ? payload.equipment_id.trim() : '';
    const dateISO = typeof payload.date_iso === 'string' ? payload.date_iso.trim() : '';
    const slot = typeof payload.slot === 'string' ? payload.slot.trim() : '';
    const paymentMethod = payload.payment_method ?? 'UPI';
    const utrLast4 = String(payload.utr_last4 ?? '').trim();
    const studentName = typeof payload.student_name === 'string' ? payload.student_name.trim() : '';
    const roomNo = typeof payload.room_no === 'string' ? payload.room_no.trim() : '';

    if (!equipmentId || equipmentId.length > 100 || !slot || slot.length > 32) {
      return jsonResponse({ error: 'Choose valid equipment and a time slot' }, 400);
    }
    if (!isUuidShape(equipmentId)) {
      return jsonResponse({ error: 'Choose valid equipment and a time slot' }, 400);
    }
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(dateISO)
      ? new Date(`${dateISO}T00:00:00.000Z`)
      : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== dateISO) {
      return jsonResponse({ error: 'Choose a valid booking date' }, 400);
    }
    if (!['UPI', 'Cash'].includes(paymentMethod)) {
      return jsonResponse({ error: 'Choose UPI or cash payment' }, 400);
    }
    if (paymentMethod === 'UPI' && !/^\d{4}$/.test(utrLast4)) {
      return jsonResponse({ error: 'Enter the last 4 digits of the UPI reference' }, 400);
    }
    if (studentName.length > 120 || roomNo.length > 40 || /[\u0000-\u001f\u007f]/.test(`${studentName}${roomNo}`)) {
      return jsonResponse({ error: 'Enter valid booking contact details' }, 400);
    }

    const today = dateInIndia(new Date());
    if (dateISO < today || dateISO > addDays(today, 2)) {
      return jsonResponse({ error: 'Booking date is outside the allowed window' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Booking service is missing server configuration');
      return jsonResponse({ error: 'Booking service is not configured' }, 503);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: configuredSlots, error: slotsError } = await admin
      .from('time_slots')
      .select('label, start_time, end_time')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (slotsError) {
      console.error('Could not load configured time slots:', slotsError.code ?? 'unknown');
      return jsonResponse({
        error: schemaError(slotsError)
          ? 'Booking backend is out of date. Apply the Supabase migrations and redeploy the booking function.'
          : 'Could not verify the selected time slot',
      }, 503);
    }
    const configuredSlot = (configuredSlots ?? []).find((item) => item.label === slot);
    if (!configuredSlot) {
      return jsonResponse({ error: 'This time slot is not available for booking' }, 400);
    }
    const slotStartsAt = new Date(`${dateISO}T${configuredSlot.start_time}+05:30`);
    if (Number.isNaN(slotStartsAt.getTime())) {
      console.error('Configured slot has an invalid start time');
      return jsonResponse({ error: 'Could not verify the selected time slot' }, 503);
    }
    if (slotStartsAt.getTime() <= Date.now()) {
      return jsonResponse({ error: 'This time slot has already started' }, 400);
    }

    const { data: equipment, error: equipmentError } = await admin
      .from('equipment')
      .select('*')
      .eq('id', equipmentId)
      .maybeSingle();
    if (equipmentError || !equipment) {
      return jsonResponse({ error: 'Equipment is unavailable' }, 404);
    }
    if (String(equipment.status ?? '').toLowerCase() !== 'available') {
      return jsonResponse({ error: 'Equipment is unavailable' }, 409);
    }
    if (String(equipment.category ?? equipment.type ?? '').toLowerCase() !== 'controller') {
      return jsonResponse({ error: 'Time slots are currently available only for controller rigs' }, 409);
    }
    const price = Number(equipment.price_per_hour ?? equipment.price);
    if (!Number.isFinite(price) || price < 0) {
      console.error('Equipment has an invalid configured price');
      return jsonResponse({ error: 'Equipment price could not be verified' }, 503);
    }

    const [{ data: controllerRigs, error: controllerRigsError }, { data: existingBookings, error: availabilityError }] = await Promise.all([
      admin.from('equipment').select('id, inventory_count').eq('category', 'controller').eq('status', 'Available'),
      admin
      .from('bookings')
      .select('id, equipment_id, slot, start_time, end_time')
      .eq('booking_date', dateISO)
      .in('booking_status', ['Confirmed', 'Pending Verification', 'Pending Payment', 'confirmed', 'pending_verification', 'pending_payment'])
      .limit(500),
    ]);
    if (controllerRigsError || availabilityError) {
      console.error('Could not check controller availability:', controllerRigsError?.code ?? availabilityError?.code ?? 'unknown');
      return jsonResponse({
        error: schemaError(controllerRigsError || availabilityError)
          ? 'Booking backend is out of date. Apply the Supabase migrations and redeploy the booking function.'
          : 'Could not check slot availability',
      }, 503);
    }
    const controllerIds = new Set((controllerRigs ?? []).map((rig) => rig.id));
    const matchingControllerBookings = (existingBookings ?? []).filter((booking) => (
      controllerIds.has(booking.equipment_id)
      && (booking.slot === slot || Boolean(
        booking.start_time && booking.end_time
        && configuredSlot.start_time < booking.end_time
        && configuredSlot.end_time > booking.start_time
      ))
    ));
    const controllerCapacity = (controllerRigs ?? []).reduce((total, rig) => total + Math.max(1, Number(rig.inventory_count) || 1), 0);
    const selectedRigCapacity = Math.max(1, Number(equipment.inventory_count) || 1);
    const selectedRigBookings = matchingControllerBookings.filter((booking) => booking.equipment_id === equipment.id).length;
    if (matchingControllerBookings.length >= controllerCapacity || selectedRigBookings >= selectedRigCapacity) {
      return jsonResponse({ error: 'All controller units are booked for this time slot' }, 409);
    }

    const bookingAccessToken = randomHexToken();
    const bookingReference = `#GH${randomNumber(10000000, 100000000)}`;
    const booking = {
      id: crypto.randomUUID(),
      booking_reference: bookingReference,
      equipment_id: equipment.id,
      equipment_name: equipment.name,
      booking_date: dateISO,
      start_time: configuredSlot.start_time,
      end_time: configuredSlot.end_time,
      slot,
      time_range: slot,
      total_amount: price,
      duration: '1 Hour',
      booking_status: paymentMethod === 'UPI' ? 'Pending Verification' : 'Confirmed',
      payment_status: 'Pending',
      payment_method: paymentMethod,
      utr: paymentMethod === 'UPI' ? utrLast4 : null,
      created_at: new Date().toISOString(),
      student_name: studentName || 'Student',
      room_no: roomNo,
      pin: String(randomNumber(1000, 10000)),
      proof: null,
      booking_access_token_hash: await sha256Hex(bookingAccessToken),
    };

    const { error: insertError } = await admin.from('bookings').insert(booking);
    if (insertError) {
      if (insertError.code === '23505') return jsonResponse({ error: 'This slot is already booked' }, 409);
      console.error('Could not create booking:', insertError.code ?? 'unknown');
      return jsonResponse({
        error: schemaError(insertError)
          ? 'Booking backend is out of date. Apply the Supabase migrations and redeploy the booking function.'
          : 'Could not save the reservation',
      }, 503);
    }

    const safeBooking = { ...booking };
    delete safeBooking.booking_access_token_hash;
    return jsonResponse({ booking: safeBooking, booking_access_token: bookingAccessToken }, 201);
  } catch (error) {
    console.error('Booking request failed:', error instanceof Error ? error.message : 'Unknown error');
    return jsonResponse({ error: 'Could not process the reservation' }, 500);
  }
});
