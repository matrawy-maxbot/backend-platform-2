import express from 'express';
import './config/index.js';
import { NODE_ENV } from './config/server.config.js';

// استيراد middlewares الأمان
import corsMiddleware from './middlewares/security/cors.middleware.js';
import helmetMiddleware from './middlewares/security/helmet.middleware.js';
import xssProtectionMiddleware from './middlewares/security/xssClean.middleware.js';
import sessionMiddleware from './middlewares/security/session.middleware.js';
import { generalRateLimiter } from './middlewares/security/rateLimiter.middleware.js';

// استيراد middlewares التسجيل
import requestLogger from './middlewares/logging/requestLogger.middleware.js';
import responseTimeMiddleware from './middlewares/logging/responseTime.middleware.js';

// استيراد middlewares معالجة الأخطاء
import errorHandlerMiddleware from './middlewares/errors/errorHandler.middleware.js';
import notFoundMiddleware from './middlewares/errors/notFound.middleware.js';


// استيراد middlewares routes
import {
    addressesRoutes,
    auditTrailsRoutes,
    categoriesRoutes,
    couponsRoutes,
    inventoryRoutes,
    notificationsRoutes,
    orderItemsRoutes,
    orderStatusHistoryRoutes,
    ordersRoutes,
    paymentsRoutes,
    permissionCategoriesRoutes,
    permissionsRoutes,
    productDetailsRoutes,
    productReviewsRoutes,
    ProductVariantsRoutes,
    productsRoutes,
    rolesRoutes,
    sessionRoutes,
    staffUsersRoutes,
    subscriptionPlansRoutes,
    userActivityRoutes,
    userSettingsRoutes,
    usersRoutes,
    vendorActivitiesRoutes,
    vendorBackupSettingsRoutes,
    vendorBackupsRoutes,
    vendorCompanySettingsRoutes,
    vendorDynamicContentRoutes,
    vendorNotificationSettingsRoutes,
    vendorPaymentsRoutes,
    vendorPrintSettingsRoutes,
    vendorsRoutes,
    vendorSettingsRoutes,
    vendorSiteSettingsRoutes,
    vendorSubscriptionsRoutes,
    wishlistRoutes,
} from './modules/api/v1/restful/routes/index.js';

// إنشاء تطبيق Express
const app = express();

// ===== SECURITY MIDDLEWARES =====
// حماية الأمان الأساسية
app.use(helmetMiddleware);

// إعدادات CORS
app.use(corsMiddleware);

// حماية من XSS
app.use(xssProtectionMiddleware);

// Rate limiting للحماية من الهجمات
app.use(generalRateLimiter);

// ===== LOGGING MIDDLEWARES =====
// تسجيل الطلبات (فقط في بيئة التطوير)
if (NODE_ENV === 'development') {
    app.use(requestLogger);
}

// قياس أوقات الاستجابة
app.use(responseTimeMiddleware);

// ===== BODY PARSING MIDDLEWARES =====
// تحليل JSON requests
app.use(express.json({ limit: '10mb' }));

// تحليل URL-encoded requests
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== SESSION MIDDLEWARE =====
// إدارة الجلسات
app.use(sessionMiddleware);

// ===== STATIC FILES =====
// خدمة الملفات الثابتة
app.use('/public', express.static('public'));

// ===== HEALTH CHECK ENDPOINT =====
// نقطة فحص صحة الخادم
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV,
        version: process.env.npm_package_version || '1.0.0'
    });
});

// ===== API ROUTES =====
// هنا سيتم إضافة routes الـ API
app.use('/api/v1/addresses', addressesRoutes);
app.use('/api/v1/audit-trails', auditTrailsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/coupons', couponsRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/order-items', orderItemsRoutes);
app.use('/api/v1/order-status-history', orderStatusHistoryRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/permission-categories', permissionCategoriesRoutes);
app.use('/api/v1/permissions', permissionsRoutes);
app.use('/api/v1/product-details', productDetailsRoutes);
app.use('/api/v1/product-reviews', productReviewsRoutes);
app.use('/api/v1/product-variants', ProductVariantsRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/roles', rolesRoutes);
app.use('/api/v1/session', sessionRoutes);
app.use('/api/v1/staff-users', staffUsersRoutes);
app.use('/api/v1/subscription-plans', subscriptionPlansRoutes);
app.use('/api/v1/user-activity', userActivityRoutes);
app.use('/api/v1/user-settings', userSettingsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/vendor-activities', vendorActivitiesRoutes);
app.use('/api/v1/vendor-backup-settings', vendorBackupSettingsRoutes);
app.use('/api/v1/vendor-backups', vendorBackupsRoutes);
app.use('/api/v1/vendor-company-settings', vendorCompanySettingsRoutes);
app.use('/api/v1/vendor-dynamic-content', vendorDynamicContentRoutes);
app.use('/api/v1/vendor-notification-settings', vendorNotificationSettingsRoutes);
app.use('/api/v1/vendor-payments', vendorPaymentsRoutes);
app.use('/api/v1/vendor-print-settings', vendorPrintSettingsRoutes);
app.use('/api/v1/vendors', vendorsRoutes);
app.use('/api/v1/vendor-settings', vendorSettingsRoutes);
app.use('/api/v1/vendor-site-settings', vendorSiteSettingsRoutes);
app.use('/api/v1/vendor-subscriptions', vendorSubscriptionsRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);

// ===== ERROR HANDLING MIDDLEWARES =====
// معالجة الصفحات غير الموجودة (404)
app.use(notFoundMiddleware);

// معالج الأخطاء العام
app.use(errorHandlerMiddleware);

export default app;