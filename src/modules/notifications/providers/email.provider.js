import nodemailer from 'nodemailer';
import notificationsConfig from '../config/notifications.config.js';

const transporter = nodemailer.createTransport({
  service: notificationsConfig.email.service,
  auth: notificationsConfig.email.auth,
});

export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: notificationsConfig.email.auth.user,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};