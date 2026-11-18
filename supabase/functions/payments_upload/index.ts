import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MAX_FILE_BYTES = 5 * 1024 * 1024;
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

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const detectImageType = (bytes: Uint8Array) => {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: 'image/jpeg', extension: 'jpg' };
  }
  if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte)) {
    return { mime: 'image/png', extension: 'png' };
  }
  if (bytes.length >= 6 && ['GIF87a', 'GIF89a'].includes(new TextDecoder().decode(bytes.slice(0, 6)))) {
    return { mime: 'image/gif', extension: 'gif' };
  }
  if (bytes.length >= 12
    && new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF'
    && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP') {
    return { mime: 'image/webp', extension: 'webp' };
  }
  return null;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const contentLength = Number(req.headers.get('content-length') ?? 0);
    if (contentLength > MAX_FILE_BYTES + 32_768) return jsonResponse({ error: 'File is too large' }, 413);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Payment upload service is missing server configuration');
      return jsonResponse({ error: 'Payment upload is not configured' }, 503);
    }

    const form = await req.formData();
    const file = form.get('file');
    const bookingReference = String(form.get('booking_reference') ?? '').trim();
    const bookingToken = String(form.get('booking_access_token') ?? '');
    if (!(file instanceof File) || !bookingReference || !/^[a-f0-9]{64}$/.test(bookingToken)) {
      return jsonResponse({ error: 'A reservation, access token, and image are required' }, 400);
    }
    if (!/^#?GH\d{8}$/.test(bookingReference)) return jsonResponse({ error: 'Invalid booking reference' }, 400);
    if (file.size < 1 || file.size > MAX_FILE_BYTES) return jsonResponse({ error: 'Image must be 5 MB or smaller' }, 413);

    const fileBytes = new Uint8Array(await file.arrayBuffer());
    const detected = detectImageType(fileBytes);
    if (!detected) return jsonResponse({ error: 'Upload a valid JPEG, PNG, WebP, or GIF image' }, 415);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const tokenHash = await sha256Hex(bookingToken);
    const { data: booking, error: bookingError } = await admin
      .from('bookings')
      .select('id')
      .eq('booking_reference', bookingReference)
      .eq('booking_access_token_hash', tokenHash)
      .maybeSingle();
    if (bookingError) {
      console.error('Could not verify payment upload reservation:', bookingError.code ?? 'unknown');
      return jsonResponse({ error: 'Could not verify the reservation' }, 503);
    }
    if (!booking) return jsonResponse({ error: 'Reservation access could not be verified' }, 403);

    const filePath = `${booking.id}/${crypto.randomUUID()}.${detected.extension}`;
    const { data: uploaded, error: uploadError } = await admin.storage
      .from('payment-proofs')
      .upload(filePath, fileBytes, { upsert: false, contentType: detected.mime });
    if (uploadError || !uploaded) {
      console.error('Payment proof upload failed:', uploadError?.statusCode ?? 'unknown');
      return jsonResponse({ error: 'Could not upload the payment proof' }, 503);
    }

    const { error: updateError } = await admin
      .from('bookings')
      .update({ proof: uploaded.path, updated_at: new Date().toISOString() })
      .eq('id', booking.id);
    if (updateError) {
      await admin.storage.from('payment-proofs').remove([uploaded.path]);
      console.error('Could not attach payment proof to reservation:', updateError.code ?? 'unknown');
      return jsonResponse({ error: 'Could not save the payment proof' }, 503);
    }

    return jsonResponse({ path: uploaded.path, message: 'Payment proof uploaded successfully' }, 201);
  } catch (error) {
    console.error('Payment proof request failed:', error instanceof Error ? error.name : 'Unknown error');
    return jsonResponse({ error: 'Could not process the payment proof' }, 500);
  }
});
