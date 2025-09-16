import twilio from 'twilio';
import notificationsConfig from '../config/notifications.config.js';

const client = twilio(notificationsConfig.sms.accountSid, notificationsConfig.sms.authToken);

export const sendSms = async (to, body) => {
  await client.messages.create({
    body,
    from: notificationsConfig.sms.from,
    to,
  });
};