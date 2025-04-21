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
      <h1>Profile Access Verification</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const registerSuccessMessage = async (email, username, programType) => {
  let programMessage = '';

  if (programType === 'PC') {
    programMessage = `
      <p>Dear ${username},</p>
      <p>Congratulations! You are officially registered for Module 1: Foundations of Leadership Communication, part of The Leadership Voice Masterclass Series—a transformative experience curated for purpose-driven African leaders like you.</p>
      <p>This foundational module is centered around the theme Presence. Persuasion. Power. In today’s world, leadership is defined not just by vision, but by the power of voice. This course equips you with the three core pillars of impactful communication: executive presence, persuasive influence, and strategic delivery in high-stakes scenarios. Through guided instruction, real-time application, and personalized feedback, you will gain the confidence, clarity, and conviction to lead conversations that inspire action and drive results.</p>
      <p>The module is structured into three distinct courses delivered across three days:</p>
      <p>Course 1: Executive Presence & Authentic Expression will take place on Thursday, May 29, 2025, from 2:00 PM to 5:00 PM GMT. In this session, you’ll learn to project confidence and authenticity through your body language, vocal delivery, and emotional intelligence—so your presence speaks even before you do.</p>
      <p>Course 2: Persuasion, Storytelling & Strategic Influence will be held on Friday, May 30, 2025, from 2:00 PM to 5:00 PM GMT. You’ll explore the art of shaping hearts and minds through storytelling and persuasive messaging—tools that help you influence decisions, inspire teams, and secure stakeholder support.</p>
      <p>Course 3: Simulation & Live Feedback takes place on Saturday, May 31, 2025, with participants selecting a personalized 60-minute slot between 8:00 AM and 6:00 PM GMT. This final session brings everything together in a live scenario tailored to your context—such as a keynote, pitch, or media moment—followed by constructive, individualized feedback from your facilitator.</p>
      <p>To make the experience as inclusive as possible, our live sessions are scheduled at a time that accommodates most participants across Africa, Europe, MENA, and North America. Each day concludes with a digital workbook featuring reflection exercises and key takeaways to help you deepen your learning and apply it with confidence.</p>
      <p>You have chosen the Power Circle format, which means you’ll be participating in a dynamic group-based learning experience. The Power Circle (PC) format is designed to foster community, accountability, and collaboration among peers. Throughout the module, you’ll work closely with a curated circle of fellow leaders, engaging in shared reflections, group discussions, and mutual feedback that will elevate your communication journey even further. This format blends expert-led instruction with peer-driven insight to accelerate your growth and sharpen your leadership voice in real-world settings.</p>
      <p>The Lead Facilitator for this module is Anita Erskine, a globally respected Strategic Communications Advisor, Executive Director of Erskine Global Communications. With more than two decades of experience in global broadcasting, leadership development, and live moderation, Anita brings the insight, energy, and vision needed to help leaders unlock the full potential of their voice.</p>
      <p>Participants who complete all sessions and submit their post-simulation reflection will receive a Leadership Voice Certificate of Participation.</p>
      <p>One week before the course begins, you will receive your pre-course workbook and simulation briefing pack via email. In the meantime, feel free to reach out to us at [Insert Email Address] if you have any questions or need to update your registration details.</p>
      <p>We’re excited to have you with us for this important journey.</p>
      <p>Warm regards,</p>
      <p>The Leadership Voice Team</p>
    `;
  } else if (programType === 'TDE') {
    programMessage = `
      <p>Dear ${username},</p>
      <p>Congratulations! You are officially registered for Module 1: Foundations of Leadership Communication, part of The Leadership Voice Masterclass Series—a transformative experience curated for purpose-driven African leaders like you.</p>
      <p>You have selected the Tailored Experience, an exclusive one-on-one format designed to offer personalized coaching and intensive leadership communication development with Anita Erskine herself. This format is ideal for leaders who want to move at their own pace, go deep into their individual communication goals, and receive direct, uninterrupted feedback that speaks precisely to their leadership context.</p>
      <p>Your experience will mirror the structure of Module 1, with all three courses delivered over three days. However, your sessions will be delivered in a private setting that prioritizes depth, clarity, and personalization—ensuring every moment speaks directly to your leadership journey.</p>
      <p>Here’s how your schedule will look:</p>
      <p>Course 1: Executive Presence & Authentic Expression will take place on Thursday, May 29, 2025. Together with Anita, you will explore how to command a room with confidence and authenticity, refining your body language, vocal tone, and emotional intelligence to elevate your leadership presence.</p>
      <p>Course 2: Persuasion, Storytelling & Strategic Influence will be held on Friday, May 30, 2025. In this session, Anita will work with you to sharpen your storytelling skills, align your messaging with your leadership values, and craft compelling communications that mobilize people and drive decisions.</p>
      <p>Course 3: Simulation & Live Feedback will take place on Saturday, May 31, 2025. You will participate in a tailored simulation based on your real-world communication needs—whether that’s a keynote, boardroom pitch, media statement, or negotiation moment. Anita will provide detailed, actionable feedback and walk you through steps for immediate improvement.</p>
      <p>Each day concludes with a customized workbook designed to help you reflect and apply the lessons in your own voice and leadership reality. You will receive these workbooks via email at the end of each session.</p>
      <p>As your Lead Facilitator, Anita Erskine brings more than 20 years of experience in strategic communications, leadership coaching, and high-level event hosting. She has trained, moderated, and coached some of Africa’s most impactful voices and is passionate about helping leaders uncover the power and purpose in their communication. Her one-on-one coaching format offers rare access to insight that will support your transformation from a strong communicator to a masterful one.</p>
      <p>Participants who complete the full module and submit a short post-reflection will receive an official Leadership Voice Certificate of Participation.</p>
      <p>You will receive your pre-course workbook and simulation briefing pack one week before the masterclass begins. In the meantime, if you have any questions or special requests to tailor your session even further, feel free to contact us at: [Insert Email Address].</p>
      <p>We’re honored to walk this journey with you—and even more honored that you’ve chosen to do it one-on-one with Anita.</p>
      <p>Warm regards,</p>
      <p>The Leadership Voice Team</p>
    `;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Leadership Voice Registration Successful',
    html: `
      ${programMessage}
    `
  };
  return await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationCode, registerSuccessMessage };
