const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.com',
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
      <h1>Profile Access Verification</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const registerSuccessMessage = async (email, username, programType)  => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Leadership Voice Profile Verification',
    html: `
      <h1>Thank you, <strong>${username}</strong> for completing your Payment.</h1>
      <p>Welcome to the TLV Masterclass. In your profile are all the information you'd need to begin.</p>
      <p>Your registeration is for <strong>${programType}</strong></p>
    `
  };
  return await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationCode, registerSuccessMessage };

