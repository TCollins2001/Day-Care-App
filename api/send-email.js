import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {

    if (req.body.cancelAppointment) {
  await resend.emails.send({
    from: "ANNA'S DAY CARE CENTER <postmaster@tc-web-designs.com>",
    to: "annasdaycarecenter@gmail.com",
    subject: "Appointment Cancellation Request",
    html: `
      <h2>Appointment Cancellation Notice</h2>
      <p><b>Parent:</b> ${req.body.parent1FirstName} ${req.body.parent1LastName}</p>
      <p><b>Email:</b> ${req.body.parent1Email}</p>
      <p><b>Phone:</b> ${req.body.parent1PhoneNumber}</p>
      <p>This parent has requested to cancel their appointment.</p>
    `,
  });

  await resend.emails.send({
    from: "ANNA'S DAY CARE CENTER <postmaster@tc-web-designs.com>",
    to: req.body.parent1Email,
    subject: "Your Appointment Cancellation Confirmation",
    html: `
      <h2>Dear ${req.body.parent1FirstName},</h2>
      <p>Your appointment cancellation request has been received.</p>
      <p>If you wish to reschedule or have any questions, please contact us anytime.</p>
      <br>
      <p>Anna's Day Care Center</p>
    `,
  });

  return res.status(200).json({ success: true });
}




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
      from: "ANNA'S DAY CARE CENTER <postmaster@tc-web-designs.com>", 
      to: "annasdaycarecenter@gmail.com",
      subject: `New Appointment Request - ${appointmentType}`,
      html: `
       <div style="background: linear-gradient(135deg, #ef4136, #fbb040); color: white; text-align: center; padding: 15px;">
       <h2 style="margin: 0; font-size: 22px; text-align: center;">
        New Appointment Request</h2>
        </h2>
  </div>

  <div style="padding: 20px;">
      <p style="font-size: 16px;">A new appointment request has been submitted.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 2px solid orangered;">
        <tr style="background-color: #f9f9f9;">
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Parent 1:</b>${parent1FirstName} ${parent1LastName}</p></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Email:</b>${parent1Email}</p></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Phone:</b>${parent1PhoneNumber}</p></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Parent 2:</b>${parent2FirstName || 'N/A'} ${parent2LastName || ''}</p></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Email:</b> ${parent2Email || 'N/A'}</p></td>
        </tr>

         <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Phone:</b> ${parent2PhoneNumber || 'N/A'}</p></td>
        </tr>
        
      
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Preferred Contact:</b> ${contactPreference}</p></td>
        </tr>

        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Appointment Type:</b> ${appointmentType}</p></td>
        </tr>

         <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Children:</b> ${childrenData}</p></td>
        </tr>

        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Comments:</b> ${comments || 'N/A'}</p></td>
        </tr>
        </table>

        <div style="background: linear-gradient(135deg, #ef4136, #fbb040); color: white; text-align: center; padding: 10px; font-size: 14px;">
      <p style="margin: 0;">ANNA'S DAY CARE CENTER</p>
      <p style="margin: 0; color: #FFFFFF">Email: annasdaycarecenter@gmail.com</p>
    </div>
  </div>
      `,
    });

    await resend.emails.send({
      from: "ANNA'S DAY CARE CENTER <postmaster@tc-web-designs.com>",
      to: parent1Email,
      subject: 'Your Appointment Request Confirmation',
      html: `
       <div style="background: linear-gradient(135deg, #ef4136, #fbb040); color: white; text-align: center; padding: 15px;">
    <h2 style="margin: 0; font-size: 22px;">
    Appointment Confirmation</h2>
    </div>

    <div style="padding: 20px;">

    <p style="font-size: 16px;">Thank you, ${parent1FirstName}! Your appointment request has been received. We’ll contact you via ${contactPreference} shortly to confirm.</p>

     <p style="font-size: 16px;">Here are your request details: </p>
     <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 2px solid orangered;">
        <tr style="background-color: #f9f9f9;">
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Parent 1:</b>${parent1FirstName} ${parent1LastName}</p></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Email:</b>${parent1Email}</p></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Phone:</b>${parent1PhoneNumber}</p></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Parent 2:</b>${parent2FirstName || 'N/A'} ${parent2LastName || ''}</p></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Email:</b> ${parent2Email || 'N/A'}</p></td>
        </tr>

         <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Phone:</b> ${parent2PhoneNumber || 'N/A'}</p></td>
        </tr>
        
      
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Preferred Contact:</b> ${contactPreference}</p></td>
        </tr>

        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Appointment Type:</b> ${appointmentType}</p></td>
        </tr>

         <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><p><b>Children:</b> ${childrenData}</p></td>
        </tr>
        </table>


        <p>If you need to cancel or update, please reply to this email.</p>
        
        <div style="background: linear-gradient(135deg, #ef4136, #fbb040); color: white; text-align: center; padding: 10px; font-size: 14px;">
      <p style="margin: 0;">ANNA'S DAY CARE CENTER</p>
      <p style="margin: 0; color: #FFFFFF">Email: annasdaycarecenter@gmail.com</p>
    </div>
  </div>
      `,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send emails' });
  }
}
