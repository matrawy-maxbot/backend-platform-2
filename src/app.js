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
    profileRoutes,
    profileTasksRoutes,
    serversInteractionsRoutes,
    verifyDurRoutes,
    votesRoutes,
    welcomeRoutes
} from './modules/api/v1/restful/routes/index.js';

import { 
    runProfileTests,
    runProfileTasksTests,
    runServersInteractionsTests,
    runVerifyDurTests,
    runVotesTests,
    runWelcomeTests
 } from './modules/api/v1/restful/test/index.js';
import votesTest from './modules/api/v1/restful/test/votes.test.js';

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
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/profileTasks', profileTasksRoutes);
app.use('/api/v1/serversInteractions', serversInteractionsRoutes);
app.use('/api/v1/verifyDur', verifyDurRoutes);
app.use('/api/v1/votes', votesRoutes);
app.use('/api/v1/welcome', welcomeRoutes);

runProfileTests()
    .then(() => {
        console.log('✅ تم إنجاز جميع الاختبارات بنجاح!');
        // process.exit(0);
    })
    .catch((error) => {
        console.error('❌ فشل في تشغيل الاختبارات:', error);
        // process.exit(1);
    });

runProfileTasksTests()
    .then(() => {
        console.log('✅ تم إنجاز جميع الاختبارات بنجاح!');
        // process.exit(0);
    })
    .catch((error) => {
        console.error('❌ فشل في تشغيل الاختبارات:', error);
        // process.exit(1);
    });

runServersInteractionsTests()
    .then(() => {
        console.log('✅ تم إنجاز جميع الاختبارات بنجاح!');
        // process.exit(0);
    })
    .catch((error) => {
        console.error('❌ فشل في تشغيل الاختبارات:', error);
        // process.exit(1);
    });

runVerifyDurTests()
    .then(() => {
        console.log('✅ تم إنجاز جميع الاختبارات بنجاح!');
        // process.exit(0);
    })
    .catch((error) => {
        console.error('❌ فشل في تشغيل الاختبارات:', error);
        // process.exit(1);
    });

runVotesTests()
    .then(() => {
        console.log('✅ تم إنجاز جميع الاختبارات بنجاح!');
        // process.exit(0);
    })
    .catch((error) => {
        console.error('❌ فشل في تشغيل الاختبارات:', error);
        // process.exit(1);
    });

runWelcomeTests()
    .then(() => {
        console.log('✅ تم إنجاز جميع الاختبارات بنجاح!');
        // process.exit(0);
    })
    .catch((error) => {
        console.error('❌ فشل في تشغيل الاختبارات:', error);
        // process.exit(1);
    });

// ===== ERROR HANDLING MIDDLEWARES =====
// معالجة الصفحات غير الموجودة (404)
app.use(notFoundMiddleware);

// معالج الأخطاء العام
app.use(errorHandlerMiddleware);

export default app;