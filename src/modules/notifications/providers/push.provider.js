import admin from 'firebase-admin';
import notificationsConfig from '../config/notifications.config.js';

admin.initializeApp({
  credential: admin.credential.cert(notificationsConfig.push.apiKey),
});

export const sendPushNotification = async (token, title, body) => {
  await admin.messaging().send({
    token,
    notification: { title, body },
  });
};