import connectDB from './config/db.config.js';
import AuditTrailsService from './services/AuditTrails.service.js';
import NotificationService from './services/Notification.service.js';
import OrderStatusHistoryService from './services/OrderStatusHistory.service.js';
import ProductDetailsService from './services/ProductDetails.service.js';
import ProductReviewsService from './services/ProductReviews.service.js';
import SessionService from './services/Session.service.js';
import UserActivityService from './services/UserActivity.service.js';
// import UserActivityLogsService from './services/UserActivityLogs.service.js';
import UserSettingsService from './services/UserSettings.service.js';
import VendorActivitiesService from './services/VendorActivities.service.js';
import VendorBackupSettingsService from './services/VendorBackupSettings.service.js';
import VendorBackupsService from './services/VendorBackups.service.js';
import VendorCompanySettingsService from './services/VendorCompanySettings.service.js';
import VendorDynamicContentService from './services/VendorDynamicContent.service.js';
import VendorNotificationSettingsService from './services/VendorNotificationSettings.service.js';
import VendorPrintSettingsService from './services/VendorPrintSettings.service.js';
import VendorSettingsService from './services/VendorSettings.service.js';
import WishlistService from './services/Wishlist.service.js';

// نبدأ الاتصال بقاعدة البيانات
connectDB();

export { 
  AuditTrailsService,
  NotificationService,
  OrderStatusHistoryService,
  ProductDetailsService,
  ProductReviewsService,
  SessionService,
  UserActivityService,
  // UserActivityLogsService,
  UserSettingsService,
  VendorActivitiesService,
  VendorBackupSettingsService,
  VendorBackupsService,
  VendorCompanySettingsService,
  VendorDynamicContentService,
  VendorNotificationSettingsService,
  VendorPrintSettingsService,
  VendorSettingsService,
  WishlistService
};