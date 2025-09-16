import { Router } from 'express';
import DeafenController from '../controllers/deafen.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createDeafenSchema,
  createUserDeafenSchema,
  getAllDeafensSchema,
  getDeafenByIdSchema,
  searchDeafensSchema,
  getDeafensWithDataSchema,
  getEmptyDeafensSchema,
  getRecentDeafensSchema,
  updateDeafenSchema,
  updateDeafensDataSchema,
  appendDeafensDataSchema,
  clearDeafensDataSchema,
  deleteDeafenSchema,
  deafenExistsSchema,
  hasDeafensDataSchema,
  getDeafensDataLengthSchema,
  parseDeafensDataSchema,
  upsertDeafenSchema,
  copyDeafenSchema,
  importDeafensSchema,
  paramIdSchema,
  queryParamsSchema
} from '../validators/deafen.validator.js';

const router = Router();

/**
 * مسارات إدارة سجلات كتم الصوت
 * @module DeafenRoutes
 */

// إنشاء سجل كتم صوت جديد
router.post(
  '/',
  validationMiddlewareFactory({ schema: createDeafenSchema, type: 'body' }),
  DeafenController.createDeafen
);

// إنشاء سجل كتم صوت للمستخدم
router.post(
  '/user',
  validationMiddlewareFactory({ schema: createUserDeafenSchema, type: 'body' }),
  DeafenController.createUserDeafen
);

// الحصول على جميع سجلات كتم الصوت
router.get(
  '/',
  validationMiddlewareFactory({ schema: getAllDeafensSchema, type: 'query' }),
  DeafenController.getAllDeafens
);

// البحث في سجلات كتم الصوت
router.get(
  '/search',
  validationMiddlewareFactory({ schema: searchDeafensSchema, type: 'query' }),
  DeafenController.searchDeafens
);

// الحصول على السجلات التي تحتوي على بيانات
router.get(
  '/with-data',
  validationMiddlewareFactory({ schema: getDeafensWithDataSchema, type: 'query' }),
  DeafenController.getDeafensWithData
);

// الحصول على السجلات الفارغة
router.get(
  '/empty',
  validationMiddlewareFactory({ schema: getEmptyDeafensSchema, type: 'query' }),
  DeafenController.getEmptyDeafens
);

// الحصول على السجلات الحديثة
router.get(
  '/recent',
  validationMiddlewareFactory({ schema: getRecentDeafensSchema, type: 'query' }),
  DeafenController.getRecentDeafens
);

// الحصول على إحصائيات سجلات كتم الصوت
router.get('/stats', DeafenController.getDeafenStats);

// عد جميع سجلات كتم الصوت
router.get('/count/all', DeafenController.countAllDeafens);

// عد السجلات التي تحتوي على بيانات
router.get('/count/with-data', DeafenController.countDeafensWithData);

// عد السجلات الفارغة
router.get('/count/empty', DeafenController.countEmptyDeafens);

// الحصول على متوسط طول البيانات
router.get('/average-length', DeafenController.getAverageDataLength);

// تصدير جميع سجلات كتم الصوت
router.get('/export', DeafenController.exportAllDeafens);

// استيراد سجلات كتم الصوت
router.post(
  '/import',
  validationMiddlewareFactory({ schema: importDeafensSchema, type: 'body' }),
  DeafenController.importDeafens
);

// إنشاء أو تحديث سجل كتم الصوت
router.put(
  '/upsert',
  validationMiddlewareFactory({ schema: upsertDeafenSchema, type: 'body' }),
  DeafenController.upsertDeafen
);

// نسخ سجل كتم الصوت
router.post(
  '/copy',
  validationMiddlewareFactory({ schema: copyDeafenSchema, type: 'body' }),
  DeafenController.copyDeafen
);

// حذف السجلات الفارغة
router.delete('/empty', DeafenController.deleteEmptyDeafens);

// حذف جميع سجلات كتم الصوت
router.delete('/all', DeafenController.deleteAllDeafens);

// الحصول على سجل كتم الصوت بواسطة المعرف
router.get(
  '/:id',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  DeafenController.getDeafenById
);

// تحديث سجل كتم الصوت
router.put(
  '/:id',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  validationMiddlewareFactory({ schema: updateDeafenSchema, type: 'body' }),
  DeafenController.updateDeafen
);

// تحديث بيانات كتم الصوت
router.patch(
  '/:id/data',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  validationMiddlewareFactory({ schema: updateDeafensDataSchema, type: 'body' }),
  DeafenController.updateDeafensData
);

// إضافة بيانات إلى كتم الصوت الموجود
router.patch(
  '/:id/append',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  validationMiddlewareFactory({ schema: appendDeafensDataSchema, type: 'body' }),
  DeafenController.appendDeafensData
);

// مسح بيانات كتم الصوت
router.patch(
  '/:id/clear',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  DeafenController.clearDeafensData
);

// حذف سجل كتم الصوت
router.delete(
  '/:id',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  DeafenController.deleteDeafen
);

// التحقق من وجود سجل كتم الصوت
router.get(
  '/:id/exists',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  DeafenController.deafenExists
);

// التحقق من وجود بيانات كتم الصوت
router.get(
  '/:id/has-data',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  DeafenController.hasDeafensData
);

// الحصول على طول بيانات كتم الصوت
router.get(
  '/:id/data-length',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  DeafenController.getDeafensDataLength
);

// تحليل بيانات كتم الصوت
router.get(
  '/:id/parse',
  validationMiddlewareFactory({ schema: paramIdSchema, type: 'params' }),
  validationMiddlewareFactory({ schema: parseDeafensDataSchema, type: 'query' }),
  DeafenController.parseDeafensData
);

export default router;