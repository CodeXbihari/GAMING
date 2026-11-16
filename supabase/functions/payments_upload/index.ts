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

    if (profile?.role !== 'student') {
      return new Response(JSON.stringify({ error: 'Only students can upload payment proofs' }), { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file') as File;
    const bookingId = form.get('booking_id')?.toString();

    if (!file || !bookingId) {
      return new Response(JSON.stringify({ error: 'file and booking_id are required' }), { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Only image files are allowed (JPEG, PNG, WebP, GIF)' }), { status: 400 });
    }

    // Validate booking belongs to this student
    const { data: booking, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .select('id, student_name')
      .eq('id', bookingId)
      .single();

    if (bookingErr || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404 });
    }

    // Upload to private bucket
    const filePath = `${user.id}/${bookingId}_${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
      .from('payment-proofs')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadErr) {
      return new Response(JSON.stringify({ error: uploadErr.message }), { status: 400 });
    }

    // Update booking with proof path
    const { error: updateErr } = await supabaseAdmin
      .from('bookings')
      .update({ proof: uploadData.path, updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (updateErr) {
      return new Response(JSON.stringify({ error: updateErr.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ path: uploadData.path, message: 'Payment proof uploaded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? 'Internal error' }), { status: 500 });
  }
});
