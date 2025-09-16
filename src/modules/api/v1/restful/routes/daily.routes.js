import { Router } from 'express';
import DailyController from '../controllers/daily.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import dailyValidator from '../validators/daily.validator.js';

const router = Router();

// إنشاء سجل نشاط يومي جديد
router.post(
  '/',
  validationMiddlewareFactory(dailyValidator.createDailySchema.body, 'body'),
  DailyController.createDaily
);

// إنشاء أو تحديث سجل النشاط اليومي للمستخدم
router.post(
  '/user/:userId',
  validationMiddlewareFactory(dailyValidator.createOrUpdateDailySchema.params, 'params'),
  DailyController.createOrUpdateDaily
);

// الحصول على جميع سجلات النشاط اليومي
router.get(
  '/',
  DailyController.getAllDaily
);

// الحصول على سجل النشاط اليومي بواسطة معرف المستخدم
router.get(
  '/user/:userId',
  validationMiddlewareFactory(dailyValidator.getDailyByIdSchema.params, 'params'),
  DailyController.getDailyById
);

// الحصول على سجلات النشاط اليومي بواسطة التاريخ
router.get(
  '/date/:date',
  validationMiddlewareFactory(dailyValidator.getDailyByDateSchema.params, 'params'),
  DailyController.getDailyByDate
);

// الحصول على سجلات النشاط اليومي لليوم الحالي
router.get(
  '/today',
  DailyController.getTodayDaily
);

// الحصول على سجلات النشاط اليومي بواسطة نطاق زمني
router.get(
  '/range',
  validationMiddlewareFactory(dailyValidator.getDailyByDateRangeSchema.query, 'query'),
  DailyController.getDailyByDateRange
);

// الحصول على سجلات النشاط اليومي للأسبوع الماضي
router.get(
  '/last-week',
  DailyController.getLastWeekDaily
);

// الحصول على سجلات النشاط اليومي للشهر الماضي
router.get(
  '/last-month',
  DailyController.getLastMonthDaily
);

// التحقق من وجود نشاط يومي للمستخدم اليوم
router.get(
  '/user/:userId/today',
  validationMiddlewareFactory(dailyValidator.hasUserDailyTodaySchema.params, 'params'),
  DailyController.hasUserDailyToday
);

// الحصول على إحصائيات النشاط اليومي
router.get(
  '/stats',
  DailyController.getDailyStats
);

// الحصول على أكثر المستخدمين نشاطاً
router.get(
  '/most-active',
  validationMiddlewareFactory(dailyValidator.getMostActiveUsersSchema.query, 'query'),
  DailyController.getMostActiveUsers
);

// تحديث سجل النشاط اليومي
router.put(
  '/user/:userId',
  validationMiddlewareFactory(dailyValidator.updateDailySchema.params, 'params'),
  validationMiddlewareFactory(dailyValidator.updateDailySchema.body, 'body'),
  DailyController.updateDaily
);

// تحديث الطابع الزمني للنشاط اليومي للمستخدم
router.patch(
  '/user/:userId/timestamp',
  validationMiddlewareFactory(dailyValidator.updateUserDailyTimestampSchema.params, 'params'),
  DailyController.updateUserDailyTimestamp
);

// حذف سجل النشاط اليومي
router.delete(
  '/user/:userId',
  validationMiddlewareFactory(dailyValidator.deleteDailySchema.params, 'params'),
  DailyController.deleteDaily
);

// حذف سجلات النشاط اليومي القديمة
router.delete(
  '/old',
  validationMiddlewareFactory(dailyValidator.deleteOldDailySchema.query, 'query'),
  DailyController.deleteOldDaily
);

// حذف سجلات النشاط اليومي بواسطة التاريخ
router.delete(
  '/date/:date',
  validationMiddlewareFactory(dailyValidator.deleteDailyByDateSchema.params, 'params'),
  DailyController.deleteDailyByDate
);

export default router;