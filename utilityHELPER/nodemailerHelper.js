// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: "berneice40@ethereal.email",
//     pass: "ftqmsdnPHW3eFZsZax",
//   },
// });

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (emailFormat) => {
  try {
    const result = await transporter.sendMail(emailFormat);
  } catch (error) {
    console.log("Email error:", error);
  }
};

export const sendVerificationLinkEmail = (user, verificationUrl) => {
  const { email, firstName, lastName } = user;
  console.log(user);

  const emailFormat = {
    from: `Ecom Den<${process.env.SMTP_USER}>`,
    to: email,
    subject: "Email Verification For Your Accoiunt",
    html: `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border-collapse: collapse;">
        <tr>
            <td style="text-align: center;">
                <h1>Account Verification</h1>
            </td>
        </tr>
        <tr>
            <td>
                <p>Dear ${firstName + " " + lastName},</p>
                <p>Thank you for signing up with us. To complete your registration, please click the link below to verify your email address:</p>
                <p><a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Verify Email</a></p>
                <p>If you did not sign up for an account, please ignore this email.</p>
                <p>Thank you,<br> ECO DEN</p>
            </td>
        </tr>
    </table>
    `,
  };
  sendEmail(emailFormat);
};
