const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Leadership Voice Profile Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #0c3030; padding: 20px; text-align: center;">
          <h1 style="color: #fcb900; margin: 0; font-size: 24px;">The Leadership Voice</h1>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #4c42ff; font-size: 20px; font-weight: bold; margin-bottom: 15px;">Profile Access Verification</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #fcb900; margin: 20px 0;">
            <p style="margin: 0; color: #0c3030; font-weight: bold;">Your Verification Code:</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; letter-spacing: 2px; color: #4c42ff;">
              <strong>${code}</strong>
            </p>
          </div>

          <p style="margin: 20px 0;">Please use this code to verify your profile access. This code will expire in 10 minutes.</p>
          
          <p style="margin: 20px 0;">If you did not request this verification code, please ignore this email or contact our support team.</p>

          <p style="margin: 20px 0;">Warm regards,<br>
          <span style="color: #4c42ff;">The Leadership Voice Team</span></p>
        </div>

        <div style="background-color: #0c3030; padding: 20px; text-align: center; color: #ffffff; font-size: 12px;">
          <p style="margin: 0;">© 2024 The Leadership Voice. All rights reserved.</p>
        </div>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const registerSuccessMessage = async (email, username, programType) => {
  let programMessage = '';

  if (programType === 'PC') {
    programMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #0c3030; padding: 20px; text-align: center;">
          <h1 style="color: #fcb900; margin: 0; font-size: 24px;">The Leadership Voice</h1>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #0c3030; font-size: 18px; margin-bottom: 20px;">Dear ${username},</p>
          
          <p style="color: #4c42ff; font-size: 20px; font-weight: bold; margin-bottom: 15px;">Congratulations on Your Registration!</p>
          
          <p style="margin-bottom: 15px;">You are officially registered for Module 1: Foundations of Leadership Communication, part of The Leadership Voice Masterclass Series—a transformative experience curated for purpose-driven African leaders like you.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #fcb900; margin: 20px 0;">
            <p style="margin: 0; color: #0c3030; font-weight: bold;">Module Overview:</p>
            <p style="margin: 10px 0 0 0;">This foundational module is centered around the theme <strong>Presence. Persuasion. Power.</strong> Through guided instruction, real-time application, and personalized feedback, you will gain the confidence, clarity, and conviction to lead conversations that inspire action and drive results.</p>
          </div>

          <div style="margin: 20px 0;">
            <p style="color: #0c3030; font-weight: bold; margin-bottom: 10px;">Your Schedule:</p>
            <ul style="padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 10px;">
                <strong>Course 1: Executive Presence & Authentic Expression</strong><br>
                Thursday, May 29, 2025 | 2:00 PM - 5:00 PM UTC
              </li>
              <li style="margin-bottom: 10px;">
                <strong>Course 2: Persuasion, Storytelling & Strategic Influence</strong><br>
                Friday, May 30, 2025 | 2:00 PM - 5:00 PM UTC
              </li>
              <li>
                <strong>Course 3: Simulation & Live Feedback</strong><br>
                Saturday, May 31, 2025 | Personalized 60-minute slot
              </li>
            </ul>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0c3030; font-weight: bold;">Power Circle Format:</p>
            <p style="margin: 10px 0 0 0;">You have chosen the Power Circle format, which means you'll be participating in a dynamic group-based learning experience designed to foster community, accountability, and collaboration among peers.</p>
          </div>

          <p style="margin: 20px 0;">One week before the course begins, you will receive your pre-course workbook and simulation briefing pack via email.</p>

          <p style="margin: 20px 0;">We're excited to have you with us for this important journey.</p>

          <p style="margin: 20px 0;">Warm regards,<br>
          <span style="color: #4c42ff;">The Leadership Voice Team</span></p>
        </div>

        <div style="background-color: #0c3030; padding: 20px; text-align: center; color: #ffffff; font-size: 12px;">
          <p style="margin: 0;">© 2024 The Leadership Voice. All rights reserved.</p>
        </div>
      </div>
    `;
  } else if (programType === 'TDE') {
    programMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #0c3030; padding: 20px; text-align: center;">
          <h1 style="color: #fcb900; margin: 0; font-size: 24px;">The Leadership Voice</h1>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #0c3030; font-size: 18px; margin-bottom: 20px;">Dear ${username},</p>
          
          <p style="color: #4c42ff; font-size: 20px; font-weight: bold; margin-bottom: 15px;">Congratulations on Your Registration!</p>
          
          <p style="margin-bottom: 15px;">You are officially registered for Module 1: Foundations of Leadership Communication, part of The Leadership Voice Masterclass Series—a transformative experience curated for purpose-driven African leaders like you.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #fcb900; margin: 20px 0;">
            <p style="margin: 0; color: #0c3030; font-weight: bold;">Tailored Development Experience:</p>
            <p style="margin: 10px 0 0 0;">You have selected the Tailored Experience, an exclusive one-on-one format designed to offer personalized coaching and intensive leadership communication development with Anita Erskine herself.</p>
          </div>

          <div style="margin: 20px 0;">
            <p style="color: #0c3030; font-weight: bold; margin-bottom: 10px;">Your Personalized Schedule:</p>
            <ul style="padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 10px;">
                <strong>Course 1: Executive Presence & Authentic Expression</strong><br>
                Thursday, May 29, 2025
              </li>
              <li style="margin-bottom: 10px;">
                <strong>Course 2: Persuasion, Storytelling & Strategic Influence</strong><br>
                Friday, May 30, 2025
              </li>
              <li>
                <strong>Course 3: Simulation & Live Feedback</strong><br>
                Saturday, May 31, 2025
              </li>
            </ul>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0c3030; font-weight: bold;">Your Facilitator:</p>
            <p style="margin: 10px 0 0 0;">Anita Erskine brings more than 20 years of experience in strategic communications, leadership coaching, and high-level event hosting. Her one-on-one coaching format offers rare access to insight that will support your transformation from a strong communicator to a masterful one.</p>
          </div>

          <p style="margin: 20px 0;">You will receive your pre-course workbook and simulation briefing pack one week before the masterclass begins.</p>

          <p style="margin: 20px 0;">We're honored to walk this journey with you—and even more honored that you've chosen to do it one-on-one with Anita.</p>

          <p style="margin: 20px 0;">Warm regards,<br>
          <span style="color: #4c42ff;">The Leadership Voice Team</span></p>
        </div>

        <div style="background-color: #0c3030; padding: 20px; text-align: center; color: #ffffff; font-size: 12px;">
          <p style="margin: 0;">© 2024 The Leadership Voice. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Leadership Voice Registration Successful',
    html: programMessage
  };
  return await transporter.sendMail(mailOptions);
}

const sendContactFormEmail = async (name, email, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@tlvmasterclass.com',
    subject: 'New Contact Form Submission',
    replyTo: email,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #0c3030; padding: 20px; text-align: center;">
          <h1 style="color: #fcb900; margin: 0; font-size: 24px;">The Leadership Voice</h1>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #4c42ff; font-size: 20px; font-weight: bold; margin-bottom: 15px;">New Contact Form Submission</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0c3030; font-weight: bold;">Sender Information:</p>
            <p style="margin: 10px 0 0 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0 0 0;"><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <p style="color: #0c3030; font-weight: bold; margin-bottom: 10px;">Message:</p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <div style="background-color: #0c3030; padding: 20px; text-align: center; color: #ffffff; font-size: 12px;">
          <p style="margin: 0;">© 2024 The Leadership Voice. All rights reserved.</p>
        </div>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const sendContactConfirmation = async (name, email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thanks for Contacting The Leadership Voice',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #0c3030; padding: 20px; text-align: center;">
          <h1 style="color: #fcb900; margin: 0; font-size: 24px;">The Leadership Voice</h1>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #0c3030; font-size: 18px; margin-bottom: 20px;">Dear ${name},</p>
          
          <p style="margin-bottom: 15px;">Thank you for reaching out to The Leadership Voice. We have received your message and will respond as soon as possible.</p>
          
          <p style="margin: 20px 0;">Warm regards,<br>
          <span style="color: #4c42ff;">The Leadership Voice Team</span></p>
        </div>

        <div style="background-color: #0c3030; padding: 20px; text-align: center; color: #ffffff; font-size: 12px;">
          <p style="margin: 0;">© 2024 The Leadership Voice. All rights reserved.</p>
        </div>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const sendPaymentNotification = async (user, paymentDetails) => {
  const { paymentMethod, paymentReference, amount } = paymentDetails;

  const moduleTypes = {
    1: "Foundations of Leadership Communication",
    2: "Advanced Leadership Communication",
    3: "Leadership Communication Mastery"
  };

  const moduleName = moduleTypes[user.moduleNumber] || `Module ${user.moduleNumber}`;
  const programTypeDisplay = user.programType === 'PC' ? 'Power Circle' :
    user.programType === 'TDE' ? 'Tailored Development Experience' :
      'Standard';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'info@tlvmasterclass.com',
    subject: `New Payment: ${user.firstName} ${user.lastName} - ${moduleName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #0c3030; padding: 20px; text-align: center;">
          <h1 style="color: #fcb900; margin: 0; font-size: 24px;">The Leadership Voice</h1>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #4c42ff; font-size: 20px; font-weight: bold; margin-bottom: 15px;">New Payment Received</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #4c42ff;">
            <p style="margin: 0; color: #0c3030; font-weight: bold;">Payment Details:</p>
            <p style="margin: 10px 0 0 0;"><strong>Amount:</strong> $${(amount / 100).toFixed(2)} USD</p>
            <p style="margin: 5px 0 0 0;"><strong>Method:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
            <p style="margin: 5px 0 0 0;"><strong>Reference:</strong> ${paymentReference}</p>
            <p style="margin: 5px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #fcb900;">
            <p style="margin: 0; color: #0c3030; font-weight: bold;">Program Information:</p>
            <p style="margin: 10px 0 0 0;"><strong>Module:</strong> ${moduleName}</p>
            <p style="margin: 5px 0 0 0;"><strong>Program Type:</strong> ${programTypeDisplay}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #0c3030;">
            <p style="margin: 0; color: #0c3030; font-weight: bold;">Customer Information:</p>
            <p style="margin: 10px 0 0 0;"><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p style="margin: 5px 0 0 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin: 5px 0 0 0;"><strong>Phone:</strong> ${user.phone}</p>
            <p style="margin: 5px 0 0 0;"><strong>Company:</strong> ${user.company}</p>
            <p style="margin: 5px 0 0 0;"><strong>Role:</strong> ${user.role}</p>
            <p style="margin: 5px 0 0 0;"><strong>Country:</strong> ${user.country}</p>
          </div>
        </div>

        <div style="background-color: #0c3030; padding: 20px; text-align: center; color: #ffffff; font-size: 12px;">
          <p style="margin: 0;">© 2024 The Leadership Voice. All rights reserved.</p>
        </div>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationCode,
  registerSuccessMessage,
  sendContactFormEmail,
  sendContactConfirmation,
  sendPaymentNotification
};
