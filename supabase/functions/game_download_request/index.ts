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

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const declaredSize = Number(req.headers.get('content-length') ?? 0);
    if (declaredSize > 4096) return jsonResponse({ error: 'Request is too large' }, 413);

    const rawBody = await req.text();
    if (rawBody.length > 4096) return jsonResponse({ error: 'Request is too large' }, 413);

    const body = JSON.parse(rawBody);
    const bookingReference = String(body.booking_reference ?? '').trim();
    const bookingAccessToken = typeof body.booking_access_token === 'string' ? body.booking_access_token : '';
    const wantsDownload = body.wants_download;
    const gameName = typeof body.game_name === 'string' ? body.game_name.trim() : '';

    if (!/^#?GH\d{8}$/.test(bookingReference)) {
      return jsonResponse({ error: 'A valid booking reference is required' }, 400);
    }
    if (!/^[a-f0-9]{64}$/.test(bookingAccessToken)) {
      return jsonResponse({ error: 'Reservation access could not be verified' }, 403);
    }
    if (typeof wantsDownload !== 'boolean') {
      return jsonResponse({ error: 'Choose whether a game download is requested' }, 400);
    }
    if (wantsDownload && (!gameName || gameName.length > 100)) {
      return jsonResponse({ error: 'Enter a game name between 1 and 100 characters' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Game request storage is missing Supabase server configuration');
      return jsonResponse({ error: 'Game request service is not configured' }, 503);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const tokenHash = await sha256Hex(bookingAccessToken);
    const { data: booking, error: bookingError } = await admin
      .from('bookings')
      .select('booking_reference')
      .eq('booking_reference', bookingReference)
      .eq('booking_access_token_hash', tokenHash)
      .maybeSingle();

    if (bookingError) {
      console.error('Could not validate game request booking:', bookingError.message);
      return jsonResponse({ error: 'Could not validate the reservation' }, 503);
    }
    if (!booking) return jsonResponse({ error: 'Reservation access could not be verified' }, 403);

    const requestRow = {
      booking_reference: bookingReference,
      wants_download: wantsDownload,
      game_name: wantsDownload ? gameName : null,
    };
    const { data: savedRequest, error: saveError } = await admin
      .from('game_download_requests')
      .insert(requestRow)
      .select('id, notification_sent')
      .single();

    if (saveError || !savedRequest) {
      if (saveError?.code === '23505') {
        const { data: existingRequest, error: existingError } = await admin
          .from('game_download_requests')
          .select('wants_download, game_name, notification_sent')
          .eq('booking_reference', bookingReference)
          .single();
        if (existingError || !existingRequest) {
          return jsonResponse({ error: 'A game download preference already exists for this reservation' }, 409);
        }
        return jsonResponse({
          saved: true,
          already_saved: true,
          wants_download: existingRequest.wants_download,
          game_name: existingRequest.game_name,
          notification_sent: existingRequest.notification_sent,
        });
      }
      console.error('Could not save game download request:', saveError?.message);
      return jsonResponse({ error: 'Could not save the game download request' }, 503);
    }

    if (!wantsDownload) {
      return jsonResponse({ saved: true, wants_download: false, game_name: null, notification_sent: false });
    }

    const adminEmails = (Deno.env.get('ADMIN_NOTIFICATION_EMAILS') ?? '')
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');

    if (!adminEmails.length || !smtpUser || !smtpPassword) {
      console.warn('Game request saved, but admin email notification is not configured');
      return jsonResponse({ saved: true, wants_download: true, game_name: gameName, notification_sent: false });
    }

    try {
      const nodemailer = (await import('npm:nodemailer')).default;
      const transporter = nodemailer.createTransport({
        host: Deno.env.get('SMTP_HOST') ?? 'smtp.gmail.com',
        port: Number(Deno.env.get('SMTP_PORT') ?? 587),
        secure: Number(Deno.env.get('SMTP_PORT') ?? 587) === 465,
        auth: { user: smtpUser, pass: smtpPassword },
      });

      await transporter.sendMail({
        from: `"Hostel Gaming Hub" <${smtpUser}>`,
        to: adminEmails,
        subject: `Game download request for ${bookingReference}`,
        text: `A game download was requested for reservation ${bookingReference}.\n\nRequested game: ${gameName}\n\nReview it in the Admin Bookings & Dispatch Log.`,
      });

      await admin
        .from('game_download_requests')
        .update({ notification_sent: true })
        .eq('id', savedRequest.id);

      return jsonResponse({ saved: true, wants_download: true, game_name: gameName, notification_sent: true });
    } catch (emailError) {
      console.error('Game request email notification failed:', emailError instanceof Error ? emailError.message : 'Unknown email error');
      return jsonResponse({ saved: true, wants_download: true, game_name: gameName, notification_sent: false });
    }
  } catch (error) {
    console.error('Game download request failed:', error instanceof Error ? error.message : 'Unknown request error');
    return jsonResponse({ error: 'Could not process the game download request' }, 500);
  }
});
