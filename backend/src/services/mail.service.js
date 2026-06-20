
import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    type:'OAuth2',
    user:process.env.USER,
    clientSecret:process.env.CLIENT_SECRET,
    clientId:process.env.CLIENT_ID,
    refreshToken:process.env.REFRESH_TOKEN
  }
});
console.log({
  GOOGLE_USER: process.env.GOOGLE_USER,
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  REFRESH: process.env.GOOGLE_REFRESH_TOKEN,
});

transporter
  .verify()
  .then(() => {
    console.log('Email transporter is ready to send emails');
  })
  .catch((err) => {
    console.error('Email transporter verification failed', err);
  });

// const defaultFromAddress = process.env.EMAIL || process.env.GOOGLE_USER;

export async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
    text,
  };

  const details = await transporter.sendMail(mailOptions);
  console.log('Email sent:', details);
  return details;
}