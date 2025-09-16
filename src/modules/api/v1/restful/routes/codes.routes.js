import express from 'express';
import CodesController from '../controllers/codes.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import codesValidator from '../validators/codes.validator.js';

const router = express.Router();

// إنشاء رمز جديد
router.post(
  '/',
  validationMiddlewareFactory(codesValidator.createCode, 'body'),
  CodesController.createCode
);

// إنشاء رمز للخادم
router.post(
  '/guild',
  validationMiddlewareFactory(codesValidator.createGuildCode, 'body'),
  CodesController.createGuildCode
);

// إنشاء رمز عشوائي للخادم
router.post(
  '/guild/random',
  validationMiddlewareFactory(codesValidator.createRandomGuildCode, 'body'),
  CodesController.createRandomGuildCode
);

// الحصول على جميع الرموز
router.get(
  '/',
  validationMiddlewareFactory(codesValidator.getAllCodes, 'query'),
  CodesController.getAllCodes
);

// الحصول على رمز بواسطة الرمز
router.get(
  '/code/:code',
  validationMiddlewareFactory(codesValidator.getCodeByCode, 'params'),
  CodesController.getCodeByCode
);

// الحصول على الرموز بواسطة معرف الخادم
router.get(
  '/guild/:guildId',
  validationMiddlewareFactory(codesValidator.getCodesByGuildId, 'params'),
  CodesController.getCodesByGuildId
);

// الحصول على الرموز بواسطة المدة
router.get(
  '/duration/:duration',
  validationMiddlewareFactory(codesValidator.getCodesByDuration, 'params'),
  CodesController.getCodesByDuration
);

// البحث في المستخدمين
router.get(
  '/search/users',
  validationMiddlewareFactory(codesValidator.searchCodesByUsers, 'query'),
  CodesController.searchCodesByUsers
);

// الحصول على الرموز بواسطة نطاق زمني
router.get(
  '/date-range',
  validationMiddlewareFactory(codesValidator.getCodesByDateRange, 'query'),
  CodesController.getCodesByDateRange
);

// الحصول على أحدث الرموز
router.get(
  '/recent',
  validationMiddlewareFactory(codesValidator.getRecentCodes, 'query'),
  CodesController.getRecentCodes
);

// الحصول على الرموز المنتهية الصلاحية
router.get(
  '/expired',
  CodesController.getExpiredCodes
);

// الحصول على الرموز النشطة
router.get(
  '/active',
  CodesController.getActiveCodes
);

// الحصول على الرموز التي تنتهي قريباً
router.get(
  '/expiring-soon',
  validationMiddlewareFactory(codesValidator.getCodesExpiringSoon, 'query'),
  CodesController.getCodesExpiringSoon
);

// الحصول على إحصائيات الرموز
router.get(
  '/stats',
  CodesController.getCodesStats
);

// التحقق من وجود الرمز
router.get(
  '/exists/:code',
  validationMiddlewareFactory(codesValidator.existsCode, 'params'),
  CodesController.existsCode
);

// التحقق من صحة الرمز
router.get(
  '/validate/:code',
  validationMiddlewareFactory(codesValidator.validateCode, 'params'),
  CodesController.validateCode
);

// تحديث الرمز
router.put(
  '/:code',
  validationMiddlewareFactory(codesValidator.updateCode, 'params'),
  validationMiddlewareFactory(codesValidator.updateCodeBody, 'body'),
  CodesController.updateCode
);

// تحديث المستخدمين
router.patch(
  '/:code/users',
  validationMiddlewareFactory(codesValidator.updateCodeUsers, 'params'),
  validationMiddlewareFactory(codesValidator.updateCodeUsersBody, 'body'),
  CodesController.updateCodeUsers
);

// إضافة مستخدم إلى الرمز
router.patch(
  '/:code/users/add',
  validationMiddlewareFactory(codesValidator.addUserToCode, 'params'),
  validationMiddlewareFactory(codesValidator.addUserToCodeBody, 'body'),
  CodesController.addUserToCode
);

// إزالة مستخدم من الرمز
router.patch(
  '/:code/users/remove',
  validationMiddlewareFactory(codesValidator.removeUserFromCode, 'params'),
  validationMiddlewareFactory(codesValidator.removeUserFromCodeBody, 'body'),
  CodesController.removeUserFromCode
);

// تحديث مدة الرمز
router.patch(
  '/:code/duration',
  validationMiddlewareFactory(codesValidator.updateCodeDuration, 'params'),
  validationMiddlewareFactory(codesValidator.updateCodeDurationBody, 'body'),
  CodesController.updateCodeDuration
);

// تمديد مدة الرمز
router.patch(
  '/:code/extend',
  validationMiddlewareFactory(codesValidator.extendCodeDuration, 'params'),
  validationMiddlewareFactory(codesValidator.extendCodeDurationBody, 'body'),
  CodesController.extendCodeDuration
);

// حذف الرمز
router.delete(
  '/:code',
  validationMiddlewareFactory(codesValidator.deleteCode, 'params'),
  CodesController.deleteCode
);

// حذف رموز الخادم
router.delete(
  '/guild/:guildId',
  validationMiddlewareFactory(codesValidator.deleteGuildCodes, 'params'),
  CodesController.deleteGuildCodes
);

// حذف الرموز المنتهية الصلاحية
router.delete(
  '/expired/cleanup',
  CodesController.deleteExpiredCodes
);

// حذف الرموز القديمة
router.delete(
  '/old/cleanup',
  validationMiddlewareFactory(codesValidator.deleteOldCodes, 'query'),
  CodesController.deleteOldCodes
);

export default router;