import connectDB from './config/db.config.js';
import MemberService from './services/members.service.js';
import WelcomeMessageService from './services/welcomeImages.service.js';
import AutoReplyService from './services/autoReply.service.js';
import LogService from './services/log.service.js';
import dashboardLogService from './services/dashboardLog.service.js';
import backupService from './services/backup.service.js';

// نبدأ الاتصال بقاعدة البيانات
// console.log('Connecting to MongoDB...');
// connectDB();

export { 
  connectDB,
  MemberService,
  WelcomeMessageService,
  AutoReplyService,
  LogService,
  dashboardLogService,
  backupService,
};