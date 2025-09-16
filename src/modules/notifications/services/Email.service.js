import { sendEmail } from '../providers/email.provider.js';
import fs from 'fs';
import path from 'path';

class EmailService {
  async sendWelcomeEmail(to, name) {
    const templatePath = path.join(__dirname, '../templates/email/welcome.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    const html = template.replace('{{name}}', name);

    await sendEmail(to, 'Welcome to Our App', html);
  }

  async sendResetPasswordEmail(to, token) {
    const templatePath = path.join(__dirname, '../templates/email/reset-password.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    const html = template.replace('{{token}}', token);

    await sendEmail(to, 'Reset Your Password', html);
  }
}

export default new EmailService();