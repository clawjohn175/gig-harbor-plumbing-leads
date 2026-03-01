export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      urgency,
      issueType,
      issueDetails,
      consent,
      createdAt,
      city,
      state,
    } = req.body || {};

    const required = [
      firstName,
      lastName,
      phone,
      email,
      address,
      urgency,
      issueType,
      issueDetails,
      consent,
    ];

    if (required.some((v) => !v)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const lead = {
      firstName,
      lastName,
      phone,
      email,
      address,
      urgency,
      issueType,
      issueDetails,
      consent,
      createdAt: createdAt || new Date().toISOString(),
      city: city || 'Gig Harbor',
      state: state || 'WA',
    };

    // 1) Email notification via Resend (required for production notifications)
    if (process.env.RESEND_API_KEY && process.env.LEAD_ALERT_EMAIL) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || 'Plumbing Leads <onboarding@resend.dev>',
          to: [process.env.LEAD_ALERT_EMAIL],
          subject: `New Plumbing Lead (${lead.urgency}) - ${lead.city}, ${lead.state}`,
          html: `
            <h2>New Plumbing Lead</h2>
            <p><strong>Name:</strong> ${lead.firstName} ${lead.lastName}</p>
            <p><strong>Phone:</strong> ${lead.phone}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Address:</strong> ${lead.address}</p>
            <p><strong>Urgency:</strong> ${lead.urgency}</p>
            <p><strong>Issue Type:</strong> ${lead.issueType}</p>
            <p><strong>Issue Details:</strong><br/>${String(lead.issueDetails).replace(/\n/g, '<br/>')}</p>
            <p><strong>Submitted:</strong> ${lead.createdAt}</p>
          `,
        }),
      });
    }

    // 2) Optional SMS notification via Twilio (for urgent dispatch)
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER &&
      process.env.PLUMBER_ALERT_NUMBER
    ) {
      const smsBody = [
        'NEW PLUMBING LEAD',
        `${lead.firstName} ${lead.lastName}`,
        `${lead.phone} | ${lead.email}`,
        `${lead.urgency} | ${lead.issueType}`,
        `${lead.address}`,
      ].join('\n');

      const params = new URLSearchParams({
        From: process.env.TWILIO_FROM_NUMBER,
        To: process.env.PLUMBER_ALERT_NUMBER,
        Body: smsBody,
      });

      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64');

      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        }
      );
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Lead API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
