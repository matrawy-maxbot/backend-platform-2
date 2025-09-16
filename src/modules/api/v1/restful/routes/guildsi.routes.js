import express from 'express';
import GuildsIController from '../controllers/guildsi.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createGuildInfoSchema,
  getGuildInfoByIdSchema,
  updateGuildInfoSchema,
  updateGuildDescriptionSchema,
  deleteGuildInfoSchema,
  searchGuildsByDescriptionSchema,
  checkGuildExistsSchema
} from '../validators/guildsi.validator.js';

const router = express.Router();

/**
 * مسارات API لإدارة معلومات الخوادم (GuildsI)
 */

// إنشاء معلومات خادم جديد
router.post('/', validationMiddlewareFactory(createGuildInfoSchema, 'body'), GuildsIController.createGuildInfo);

// الحصول على جميع معلومات الخوادم
router.get('/', GuildsIController.getAllGuildsInfo);

// الحصول على الخوادم التي لديها وصف
router.get('/with-description', GuildsIController.getGuildsWithDescription);

// الحصول على الخوادم التي ليس لديها وصف
router.get('/without-description', GuildsIController.getGuildsWithoutDescription);

// البحث في الخوادم بواسطة الوصف
router.get('/search/:searchTerm', validationMiddlewareFactory(searchGuildsByDescriptionSchema, 'params'), GuildsIController.searchGuildsByDescription);

// الحصول على معلومات خادم بواسطة المعرف
router.get('/:id', validationMiddlewareFactory(getGuildInfoByIdSchema, 'params'), GuildsIController.getGuildInfoById);

// التحقق من وجود خادم
router.get('/:id/exists', validationMiddlewareFactory(checkGuildExistsSchema, 'params'), GuildsIController.checkGuildExists);

// تحديث معلومات خادم
router.put('/:id', 
  validationMiddlewareFactory(getGuildInfoByIdSchema, 'params'),
  validationMiddlewareFactory(updateGuildInfoSchema, 'body'),
  GuildsIController.updateGuildInfo
);

// تحديث وصف خادم فقط
router.patch('/:id/description', 
  validationMiddlewareFactory(getGuildInfoByIdSchema, 'params'),
  validationMiddlewareFactory(updateGuildDescriptionSchema, 'body'),
  GuildsIController.updateGuildDescription
);

// حذف وصف خادم (تعيينه إلى null)
router.patch('/:id/clear-description', validationMiddlewareFactory(getGuildInfoByIdSchema, 'params'), GuildsIController.clearGuildDescription);

// حذف معلومات خادم
router.delete('/:id', validationMiddlewareFactory(deleteGuildInfoSchema, 'params'), GuildsIController.deleteGuildInfo);

export default router;