import { sendSms } from '../providers/sms.provider.js';
import fs from 'fs';
import path from 'path';

class SmsService {
  async sendWelcomeSms(to, name) {
    const templatePath = path.join(__dirname, '../templates/sms/welcome.txt');
    const template = fs.readFileSync(templatePath, 'utf8');
    const body = template.replace('{{name}}', name);

    await sendSms(to, body);
  }

  async sendResetPasswordSms(to, token) {
    const templatePath = path.join(__dirname, '../templates/sms/reset-password.txt');
    const template = fs.readFileSync(templatePath, 'utf8');
    const body = template.replace('{{token}}', token);

    await sendSms(to, body);
  }
}

export default new SmsService();