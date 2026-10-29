const TIME_ZONE = 'Africa/Nairobi';
const RESEND_EMAILS_URL = 'https://api.resend.com/emails';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSessionDate(date) {
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: TIME_ZONE,
  }).format(date);
}

export async function sendAdminBookingEmail(booking, kind) {
  const { ADMIN_EMAIL, RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  if (!ADMIN_EMAIL || !RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error(
      'Admin booking email requires ADMIN_EMAIL, RESEND_API_KEY, and RESEND_FROM_EMAIL.'
    );
  }

  const isReminder = kind === 'reminder';
  const sessionDate = formatSessionDate(new Date(booking.preferredDate));
  const subject = isReminder
    ? `Session reminder: ${booking.fullName} - ${sessionDate}`
    : `New website booking: ${booking.fullName}`;
  const title = isReminder ? 'Upcoming session in 24 hours' : 'New website booking';
  const fields = [
    ['Client', booking.fullName],
    ['Email', booking.email || 'Not provided'],
    ['Phone', booking.phone],
    ['Service', booking.serviceType],
    ['Session', sessionDate],
    ['Status', booking.status],
    ...(booking.notes ? [['Notes', booking.notes]] : []),
  ];
  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  const response = await fetch(RESEND_EMAILS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `booking-${booking._id}-${kind}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject,
      html: `<div style="font-family:Arial,sans-serif;color:#172033"><h2>${title}</h2><table style="border-collapse:collapse">${rows}</table><p>Manage bookings in the <a href="${escapeHtml(process.env.NEXT_PUBLIC_SITE_URL || '')}/admin/bookings">admin portal</a>.</p></div>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend email request failed with status ${response.status}.`);
  }
}
