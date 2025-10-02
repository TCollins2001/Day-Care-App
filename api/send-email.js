import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      parent1FirstName,
      parent1LastName,
      parent1Email,
      parent1PhoneNumber,
      parent2FirstName,
      parent2LastName,
      parent2Email,
      parent2PhoneNumber,
      contactPreference,
      childrenData,
      appointmentType,
      comments,
    } = req.body;

    await resend.emails.send({
      from: "ANNA'S DAY CARE CENTER <postmaster@tc-web-designs.com", 
      to: "annasdaycarecenter@gmail.com",
      subject: "New Appointment Request - ${appointmentType}",
      html: `
        <h2>New Appointment Request</h2>
        <p><b>Parent 1:</b> ${parent1FirstName} ${parent1LastName}</p>
        <p><b>Email:</b> ${parent1Email}</p>
        <p><b>Phone:</b> ${parent1PhoneNumber}</p>
        <p><b>Parent 2:</b> ${parent2FirstName || 'N/A'} ${parent2LastName || ''}</p>
        <p><b>Email:</b> ${parent2Email || 'N/A'}</p>
        <p><b>Phone:</b> ${parent2PhoneNumber || 'N/A'}</p>
        <p><b>Preferred Contact:</b> ${contactPreference}</p>
        <p><b>Appointment Type:</b> ${appointmentType}</p>
        <p><b>Children:</b> ${childrenData}</p>
        <p><b>Comments:</b> ${comments || 'N/A'}</p>
      `,
    });

    await resend.emails.send({
      from: "ANNA'S DAY CARE CENTER <postmaster@tc-web-designs.com>",
      to: parent1Email,
      subject: 'Your Appointment Request Confirmation',
      html: `
        <h2>Thank you, ${parent1FirstName}!</h2>
        <p>Your appointment request has been received. We’ll contact you via ${contactPreference} shortly to confirm.</p>
        <p><b>Appointment Type:</b> ${appointmentType}</p>
        <p>If you need to cancel or update, please reply to this email.</p>
        <br>
        <p>Anna’s Day Care Center</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send emails' });
  }
}
