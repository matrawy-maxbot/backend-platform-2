import express from 'express';
import GTogglesController from '../controllers/gtoggles.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createGuildTogglesSchema,
  getGuildTogglesByIdSchema,
  updateGuildTogglesSchema,
  updateSingleToggleSchema,
  deleteGuildTogglesSchema,
  resetGuildTogglesSchema
} from '../validators/gtoggles.validator.js';

const router = express.Router();

/**
 * مسارات API لإدارة إعدادات الخوادم (GToggles)
 */

// إنشاء إعدادات خادم جديد
router.post('/', validationMiddlewareFactory(createGuildTogglesSchema, 'body'), GTogglesController.createGuildToggles);

// الحصول على جميع إعدادات الخوادم
router.get('/', GTogglesController.getAllGuildToggles);

// الحصول على الخوادم التي لديها ترحيب مفعل
router.get('/welcome-enabled', GTogglesController.getGuildsWithWelcomeEnabled);

// الحصول على الخوادم التي لديها سجل مفعل
router.get('/logging-enabled', GTogglesController.getGuildsWithLoggingEnabled);

// الحصول على إعدادات خادم بواسطة المعرف
router.get('/:guild_id', validationMiddlewareFactory(getGuildTogglesByIdSchema, 'params'), GTogglesController.getGuildTogglesById);

// تحديث إعدادات خادم
router.put('/:guild_id', 
  validationMiddlewareFactory(getGuildTogglesByIdSchema, 'params'),
  validationMiddlewareFactory(updateGuildTogglesSchema, 'body'),
  GTogglesController.updateGuildToggles
);

// تحديث إعداد واحد فقط للخادم
router.patch('/:guild_id/toggle', 
  validationMiddlewareFactory(getGuildTogglesByIdSchema, 'params'),
  validationMiddlewareFactory(updateSingleToggleSchema, 'body'),
  GTogglesController.updateSingleToggle
);

// إعادة تعيين إعدادات خادم إلى القيم الافتراضية
router.patch('/:guild_id/reset', validationMiddlewareFactory(resetGuildTogglesSchema, 'params'), GTogglesController.resetGuildToggles);

// حذف إعدادات خادم
router.delete('/:guild_id', validationMiddlewareFactory(deleteGuildTogglesSchema, 'params'), GTogglesController.deleteGuildToggles);

export default router;