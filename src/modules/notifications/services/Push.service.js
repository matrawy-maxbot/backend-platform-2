import { sendPushNotification } from '../providers/push.provider.js';

class PushService {
  async sendWelcomePush(token, name) {
    await sendPushNotification(token, 'Welcome', `Hello ${name}, welcome to our app!`);
  }

  async sendResetPasswordPush(token) {
    await sendPushNotification(token, 'Reset Password', 'Please reset your password.');
  }
}

export default new PushService();