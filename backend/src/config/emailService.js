const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, name, verificationCode) => {
    const mailOptions = {
        from: `"Notes App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email — Notes App',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: white; padding: 40px; border-radius: 10px;">
        <h1 style="color: #4a90e2; text-align: center;">📝 Notes App</h1>
        <h2 style="text-align: center;">Verify Your Email</h2>
        <p>Hi <strong>${name}</strong>!</p>
        <p>Your verification code is:</p>
        <div style="background: #4a90e2; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <h1 style="letter-spacing: 10px; font-size: 36px; margin: 0;">${verificationCode}</h1>
        </div>
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        <p>If you did not create an account, please ignore this email.</p>
      </div>
    `,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };