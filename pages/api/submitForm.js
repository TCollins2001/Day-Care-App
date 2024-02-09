import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const formData = req.body;

    const childrenData = JSON.parse(formData.childrenData || '[]');

    const appointmentType = formData.appointmentType;

    let zoomLink = '';

    if (appointmentType === 'virtual') {
      
      const pmiLink = generatePMILink(); 

      if (pmiLink) {
        zoomLink = pmiLink;
      } else {
        
        zoomLink = '';
      }
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS, 
      },
    }); 

    

    const childInfoHTML = childrenData.map((child, index) => `
    <p style="background-color: yellow; color: black; font-size: 16px; border-radius: 15px; padding: 7px;">Child ${index + 1} Information:</p>
    <p style="color: black; font-size: 16px; font-weight: bold;">Child First Name:</p>
    <p style="color: black; font-size: 16px;">${child.childFirstName}</p>
    <p style="color: black; font-size: 16px; font-weight: bold;">Child Last Name:</p>
    <p style="color: black; font-size: 16px;">${child.childLastName}</p>
    <p style="color: black; font-size: 16px; font-weight: bold;">Date of Birth:</p>
    <p style="color: black; font-size: 16px;">${child.childDOB}</p>
  `).join('');
  
  const emailTemplateForOwner = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Appointment Request For Anna</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
    
      <div style="background-color: yellow; padding: 20px; text-align: center;">
        <h1 style="color: black;">New Appointment Request!</h1>
      </div>
    
      <div style="padding: 20px;">
        <p style="color: black; font-size: 18px;">Anna,</p>
        
        ${appointmentType === 'in-person' ? `
        <p style="color: black; font-size: 18px;">You have a new IN-PERSON appointment request from, </p>
        ` : ''}

        ${appointmentType === 'virtual' ? `
        <p style="color: black; font-size: 18px;">You have a new VIRTUAL appointment request from, </p>
        ` : ''}
    
        <p style="color: black; font-size: 16px; font-weight: bold; text-decoration: underline; padding-top: 20px;">Parent Information:</p>

    <p style="background-color: red; color: white; font-size: 16px; border-radius: 15px; padding: 7px; padding-left: 5px;">Parent/Guardian 1:</p>
    <p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 1 First Name:</p>
    <p style="color: black; font-size: 16px;">${formData.parent1FirstName}</p>

    <p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 1 Last Name:</p><p style="color: black; font-size: 16px;">${formData.parent1LastName}</p>

    <p style="color: black; font-size: 16px; font-weight: bold;">Email:</p><p style="color: black; font-size: 16px;">${formData.parent1Email}</p>

    <p style="color: black; font-size: 16px; font-weight: bold;">Phone Number:</p><p style="color: black; font-size: 16px;">${formData.parent1PhoneNumber}</p>

    <p style="background-color: red; color: white; font-size: 16px; border-radius: 15px; padding: 7px; padding-left: 5px;">Parent/Guardian 2:</p>
    <p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 2 First Name:</p>
    <p style="color: black; font-size: 16px;">${formData.parent2FirstName || 'N/A'}</p>

  <p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 2 Last Name:</p><p style="color: black; font-size: 16px;">${formData.parent2LastName || 'N/A'}</p>

  <p style="color: black; font-size: 16px; font-weight: bold;">Email:</p><p style="color: black; font-size: 16px;">${formData.parent2Email || 'N/A'}</p>

    <p style="color: black; font-size: 16px; font-weight: bold;">Phone Number:</p><p style="color: black; font-size: 16px;">${formData.parent2PhoneNumber || 'N/A'}</p>

    <div style="border-bottom: 2px solid black; border-bottom-width: 100%; padding:10px;"></div>

    <p style="color: black; font-size: 16px; font-weight: bold; padding-top: 20px;">Preferred Form of Contact:</p><p style="color: black; font-size: 16px;">${formData.contactPreference}</p>

    <div style="border-bottom: 2px solid black; border-bottom-width: 100%; padding:10px;"></div>

<p style="color: black; font-size: 16px; font-weight: bold; text-decoration: underline; padding-top: 20px;">Child Information:</p>${childInfoHTML}

<div style="border-bottom: 2px solid black; border-bottom-width: 100%; padding:10px;"></div>

  <p style="color: black; font-size: 16px; font-weight: bold;">Additional Comments:</p><p style="color: black; font-size: 16px;">${formData.comments || 'N/A'}</p>

  <br>

  ${appointmentType === 'virtual' ? `
  <p style="color: black; font-size: 16px; font-weight: bold; text-decoration: underline; padding-top: 20px;">Your Virtual Appointment Zoom Link:</p>

  <p style="color: black; font-size: 16px;">${zoomLink || ''}</p>
` : ''}


  </div>

  <div style="background-color: red; padding: 20px; text-align: center;">
    <h2 style="color: black; font-weight: bold;">Best Regards,<br><br>Your Website</h2>
  </div>

</body>
</html>
`;

const emailTemplateForUser = `
<!DOCTYPE html>
<html>
<head>
  <title>Appointment Confirmation From Anna's Day Care Center</title>
</head>
<body style="font-family: Arial, sans-serif;">

  <div style="background-color: yellow; padding: 20px; text-align: center;">
    <h1 style="color: black;">Appointment Confirmation From Anna's Day Care Center!</h1>
  </div>

  <div style="padding: 20px;">
    <p style="color: black; font-size: 18px; text-align: center;">Hello, ${formData.parent1FirstName || ''} ${formData.parent2FirstName ? '& ' + formData.parent2FirstName : ''}</p>
    
    ${appointmentType === 'in-person' ? `
    <p style="color: black; font-size: 18px; text-align: center;">Thank you for submitting your in-person appointment request to Anna's Day Care Center. This email is to confirm that an appointment has been requested from this email address and your information will be reviewed shortly. Please ensure that the information below is accurate, if not, feel free to contact Anna's Day Care Center during normal operating hours with the information at the very end of this email.</p>` : ''}

    ${appointmentType === 'virtual' ? `
    <p style="color: black; font-size: 18px; text-align: center;">Thank you for submitting your virtual appointment request to Anna's Day Care Center. This email is to confirm that an appointment has been requested from this email address and your information will be reviewed shortly. Please ensure that the information below is accurate, if not, feel free to contact Anna's Day Care Center during normal operating hours with the information at the very end of this email.</p>
    <br>
    <p style="color: black; font-size: 15px; text-align: center;">Your zoom link is also below the form in wait of your future appointment (so saving this email is recommended).</p>` : ''}

    <br>

    <p style="color: black; font-size: 16px; font-weight: bold; text-decoration: underline; padding-top: 20px;">Parent Information:</p>

<p style="background-color: red; color: white; font-size: 16px; border-radius: 15px; padding: 7px; padding-left: 5px;">Parent/Guardian 1:</p>
<p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 1 First Name:</p>
<p style="color: black; font-size: 16px;">${formData.parent1FirstName}</p>

<p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 1 Last Name:</p><p style="color: black; font-size: 16px;">${formData.parent1LastName}</p>

<p style="color: black; font-size: 16px; font-weight: bold;">Email:</p><p style="color: black; font-size: 16px;">${formData.parent1Email}</p>

<p style="color: black; font-size: 16px; font-weight: bold;">Phone Number:</p><p style="color: black; font-size: 16px;">${formData.parent1PhoneNumber}</p>

<p style="background-color: red; color: white; font-size: 16px; border-radius: 15px; padding: 7px; padding-left: 5px;">Parent/Guardian 2:</p>
<p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 2 First Name:</p>
<p style="color: black; font-size: 16px;">${formData.parent2FirstName || 'N/A'}</p>

<p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 2 Last Name:</p><p style="color: black; font-size: 16px;">${formData.parent2LastName || 'N/A'}</p>

<p style="color: black; font-size: 16px; font-weight: bold;">Email:</p><p style="color: black; font-size: 16px;">${formData.parent2Email || 'N/A'}</p>

<p style="color: black; font-size: 16px; font-weight: bold;">Phone Number:</p><p style="color: black; font-size: 16px;">${formData.parent2PhoneNumber || 'N/A'}</p>

<div style="border-bottom: 2px solid black; border-bottom-width: 100%; padding:10px;"></div>

<p style="color: black; font-size: 16px; font-weight: bold; padding-top: 20px;">Preferred Form of Contact:</p><p style="color: black; font-size: 16px;">${formData.contactPreference}</p>

<div style="border-bottom: 2px solid black; border-bottom-width: 100%; padding:10px;"></div>

<p style="color: black; font-size: 16px; font-weight: bold; text-decoration: underline; padding-top: 20px;">Child Information:</p>${childInfoHTML}

<div style="border-bottom: 2px solid black; border-bottom-width: 100%; padding:10px;"></div>

<p style="color: black; font-size: 16px; font-weight: bold;">Additional Comments:</p><p style="color: black; font-size: 16px;">${formData.comments || 'N/A'}</p>

<br>
<br>

${appointmentType === 'virtual' ? `
  <p style="color: black; font-size: 16px; font-weight: bold; text-decoration: underline; padding-top: 20px;">Your Virtual Appointment Zoom Link:</p>

  <p style="color: black; font-size: 16px;">${zoomLink || ''}</p>
  <p style="color: black; font-size: 13px; font-weight: bold;">Please use ONLY upon the scheduled date and time that will be discussed following Anna's Day Care Center's acceptance of your request.</p>
  ` : ''}
  

  <br>

  <h3><a style="text-align: center; color: red;" class="thank-cancel-click" href="cancel.html">Need to cancel a previously requested appointment? Click here.</a></h3>

  <br>

</div>

<div style="background-color: red; padding: 20px; text-align: center;">
<h2 style="color: green; font-weight: bold;">Best Regards,</h2>
<br>
<h2 style="color: blue; font-weight: bold;">Anna's Day Care Center Will Be In Contact With You Soon!</h2>

<br>

<h2><a style="color: green;" href="https://maps.app.goo.gl/zXBD4SDD2U26jfXt8">1344 Stone Boundary Rd, Cambridge, MD 21613</a></h2>
<h2><a style="color: yellow;" href="tel:4102284937">(410) 228-4937</a></h2>
<h2><a style="color: yellow;" href="mailto:annasdaycarecenter@gmail.com">annasdaycarecenter@gmail.com</a></h2>
<h2 style="color: yellow;">Operating Hours: M-F, 7-4</h2>
</div>

</body>
</html>
`;

if (!formData.cancelAppointment) { 
const mailOptionsForOwner = {
  from: 'annasdaycarecenter@gmail.com',
  to: 'annasdaycarecenter@gmail.com',
  subject: 'New Appointment Request',
  html: emailTemplateForOwner,
};

const mailOptionsForUser = {
  from: 'annasdaycarecenter@gmail.com',
  to: formData.parent1Email || formData.parent2Email,
  subject: 'Your Appointment Request Confirmation',
  html: emailTemplateForUser,
};

try {
  await transporter.sendMail(mailOptionsForOwner);
  await transporter.sendMail(mailOptionsForUser);
  res.status(200).json({ message: 'Emails sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending emails' });
      }
    } else {
const emailForOwnerCancel = `
<!DOCTYPE html>
<html>
<head>
  <title>Appointment Cancellation Request</title>
</head>
<body style="font-family: Arial, sans-serif;">

  <div style="background-color: yellow; padding: 20px; text-align: center;">
    <h1 style="color: black;">Appointment Cancellation Requested</h1>
  </div>

  <div style="padding: 20px;">
  <br>


  <p style="color: black; font-size: 18px;">Anna,</p>
  <p style="color: black; font-size: 18px;">This email is to inform you that you have an appointment cancellation request from ${formData.parent1FirstName} ${formData.parent1LastName} in order to remove them from your planned schedule.</p>

  <br>

  <p style="color: black; font-size: 16px; font-weight: bold; text-decoration: underline; padding-top: 20px;">Parent Information:</p>

    <p style="background-color: red; color: white; font-size: 16px; border-radius: 15px; padding: 7px; padding-left: 5px;">Parent/Guardian 1:</p>
    <p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 1 First Name:</p>
    <p style="color: black; font-size: 16px;">${formData.parent1FirstName}</p>

    <p style="color: black; font-size: 16px; font-weight: bold;">Parent/Guardian 1 Last Name:</p><p style="color: black; font-size: 16px;">${formData.parent1LastName}</p>

    <p style="color: black; font-size: 16px; font-weight: bold;">Email:</p><p style="color: black; font-size: 16px;">${formData.parent1Email}</p>

    <p style="color: black; font-size: 16px; font-weight: bold;">Phone Number:</p><p style="color: black; font-size: 16px;">${formData.parent1PhoneNumber}</p>

  <br>

  <br>

  <br>

  <div style="background-color: red; padding: 20px; text-align: center;">
  <h2 style="color: black; font-weight: bold;">Best Regards,<br><br>Your Website</h2>
</div>

    </body>
    </html>
`;

const emailForUserCancel = `
<!DOCTYPE html>
<html>
<head>
  <title>Appointment Confirmation From Anna's Day Care Center</title>
</head>
<body style="font-family: Arial, sans-serif;">

  <div style="background-color: yellow; padding: 20px; text-align: center;">
    <h1 style="color: black;">Cancellation Confirmation From Anna's Day Care Center</h1>
  </div>

  <div style="padding: 20px;">
  <br>

  <br>

  <br>

  <br>

  <br>

  <br>
  <p style="color: black; font-size: 18px; text-align: center;">Hello, ${formData.parent1FirstName}</p>

  <p style="color: black; font-size: 18px; text-align: center;">Your appointment cancellation request has been received and processed. If you have any questions or need further assistance, please don't hesitate to contact the center.</p>


  <br>

  <br>

  <br>

  <br>

  <br>

  <br>

  <br>

  <br>

  <br>

  <br>

  <br>

  <div style="background-color: red; padding: 20px; text-align: center;">
<h2 style="color: green; font-weight: bold;">Best Regards,</h2>
<br>
<h2 style="color: blue; font-weight: bold;">Anna's Day Care Center</h2>

<br>

<h2><a style="color: green;" href="https://maps.app.goo.gl/zXBD4SDD2U26jfXt8">1344 Stone Boundary Rd, Cambridge, MD 21613</a></h2>
<h2><a style="color: yellow;" href="tel:4102284937">(410) 228-4937</a></h2>
<h2><a style="color: yellow;" href="mailto:annasdaycarecenter@gmail.com">annasdaycarecenter@gmail.com</a></h2>
<h2 style="color: yellow;">Operating Hours: M-F, 7-4</h2>
</div>

    </body>
    </html>
`;

const mailOptionsForOwnerCancel = {
  from: 'annasdaycarecenter@gmail.com',
  to: 'annasdaycarecenter@gmail.com',
  subject: 'Appointment Cancellation Request',
  html: emailForOwnerCancel,
};

const mailOptionsForUserCancel = {
  from: 'annasdaycarecenter@gmail.com',
  to: formData.parent1Email,
  subject: 'Your Appointment Cancellation Confirmation',
  html: emailForUserCancel,
};

try {
  await transporter.sendMail(mailOptionsForUserCancel);
  await transporter.sendMail(mailOptionsForOwnerCancel);
  res.status(200).json({ message: 'Cancellation emails sent successfully' });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Error sending cancellation emails' });
}
}
} else {
res.status(405).json({ message: 'Method Not Allowed' });
}
}

function generatePMILink() {
  return process.env.ZOOM_PMI_LINK;
}
