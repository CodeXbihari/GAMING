Deno.serve(async (req) => {
  try {
    const { to, subject, template, vars } = await req.json();

    if (!to || !subject) {
      return new Response(JSON.stringify({ error: 'to and subject are required' }), { status: 400 });
    }

    // Render email body from template
    const render = (tpl: string, data: Record<string, string>) => {
      switch (tpl) {
        case 'payment_status':
          return `Hi ${data.student_name ?? 'Student'},

Your payment for booking #${data.booking_id} has been ${data.status === 'Paid' ? 'APPROVED ✅' : 'REJECTED ❌'}.

${data.status === 'Paid'
  ? `Equipment: ${data.equipment_name ?? ''}\nDate: ${data.date ?? ''}\nSlot: ${data.slot ?? ''}\n\nEnjoy your session!`
  : 'Please re-upload a valid payment proof or choose Cash payment at the front desk.'}

– Hostel Gaming Hub`;
        case 'booking_confirmation':
          return `Hi ${data.student_name ?? 'Student'},

Your booking #${data.booking_id} is confirmed!

Equipment: ${data.equipment_name ?? ''}
Date: ${data.date ?? ''}
Slot: ${data.slot ?? ''}

Please complete payment using UPI ID: ${Deno.env.get('UPI_ID') ?? 'N/A'}
Then upload your payment proof from the app.

– Hostel Gaming Hub`;
        case 'booking_cancelled':
          return `Hi ${data.student_name ?? 'Student'},

Your booking #${data.booking_id} has been cancelled. The slot is now available for others.

– Hostel Gaming Hub`;
        default:
          return data.message ?? 'You have a new notification from Hostel Gaming Hub.';
      }
    };

    const emailBody = render(template ?? 'default', vars ?? {});

    // Send via Gmail SMTP using nodemailer
    const nodemailer = (await import('npm:nodemailer')).default;

    const transporter = nodemailer.createTransport({
      host: Deno.env.get('SMTP_HOST') ?? 'smtp.gmail.com',
      port: Number(Deno.env.get('SMTP_PORT') ?? 587),
      secure: false,
      auth: {
        user: Deno.env.get('SMTP_USER'),
        pass: Deno.env.get('SMTP_PASSWORD'),
      },
    });

    await transporter.sendMail({
      from: `"Hostel Gaming Hub" <${Deno.env.get('SMTP_USER')}>`,
      to,
      subject,
      text: emailBody,
    });

    return new Response(JSON.stringify({ sent: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Notification error:', err.message);
    return new Response(JSON.stringify({ error: err.message ?? 'Failed to send notification' }), { status: 500 });
  }
});
