import connectDB from './config/db.config.js';
import { User, VendorBackups, VendorBackupSettings } from './models/index.js';
import UserService from './services/User.service.js';
import VendorBackupsService from './services/VendorBackups.service.js';
import VendorBackupSettingsService from './services/VendorBackupSettings.service.js';

// نبدأ الاتصال بقاعدة البيانات
connectDB();

export { 
  User, 
  VendorBackups, 
  VendorBackupSettings,
  UserService,
  VendorBackupsService,
  VendorBackupSettingsService
};