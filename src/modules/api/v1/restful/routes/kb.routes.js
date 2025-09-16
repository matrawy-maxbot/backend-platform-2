import { Router } from 'express';
import {
  getAllKB,
  getKBById,
  getKBByGuildId,
  getKBByUserId,
  getKBStats,
  searchKB,
  createKB,
  updateKB,
  updateKBLength,
  deleteKB,
  deleteKBByGuildId,
  checkKBExists
} from '../controllers/kb.controller.js';
import {
  createKBSchema,
  updateKBSchema,
  getKBByIdSchema,
  getKBByGuildIdSchema,
  getKBByUserIdSchema,
  searchKBSchema,
  updateKBLengthSchema,
  deleteKBSchema,
  deleteKBByGuildIdSchema,
  checkKBExistsSchema
} from '../validators/kb.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = Router();

/**
 * مسارات قاعدة المعرفة (KB Routes)
 */

// الحصول على جميع سجلات قاعدة المعرفة
router.get('/', getAllKB);

// الحصول على إحصائيات قاعدة المعرفة
router.get('/stats', getKBStats);

// البحث في سجلات قاعدة المعرفة
router.get('/search', validationMiddlewareFactory(searchKBSchema, 'query'), searchKB);

// البحث في سجلات قاعدة المعرفة لخادم معين
router.get('/search/:guildId', 
  validationMiddlewareFactory(getKBByGuildIdSchema, 'params'),
  validationMiddlewareFactory(searchKBSchema, 'query'),
  searchKB
);

// الحصول على سجل قاعدة المعرفة بواسطة المعرف
router.get('/:id', validationMiddlewareFactory(getKBByIdSchema, 'params'), getKBById);

// التحقق من وجود سجل قاعدة المعرفة
router.get('/:id/exists', validationMiddlewareFactory(checkKBExistsSchema, 'params'), checkKBExists);

// الحصول على سجلات قاعدة المعرفة بواسطة معرف الخادم
router.get('/guild/:guildId', validationMiddlewareFactory(getKBByGuildIdSchema, 'params'), getKBByGuildId);

// الحصول على سجلات قاعدة المعرفة بواسطة معرف المستخدم
router.get('/user/:userId', validationMiddlewareFactory(getKBByUserIdSchema, 'params'), getKBByUserId);

// إنشاء سجل قاعدة معرفة جديد
router.post('/', validationMiddlewareFactory(createKBSchema, 'body'), createKB);

// تحديث سجل قاعدة المعرفة
router.put('/:id', 
  validationMiddlewareFactory(getKBByIdSchema, 'params'),
  validationMiddlewareFactory(updateKBSchema, 'body'),
  updateKB
);

// تحديث طول قاعدة المعرفة
router.put('/:id/length', 
  validationMiddlewareFactory(getKBByIdSchema, 'params'),
  validationMiddlewareFactory(updateKBLengthSchema, 'body'),
  updateKBLength
);

// حذف سجل قاعدة المعرفة
router.delete('/:id', validationMiddlewareFactory(deleteKBSchema, 'params'), deleteKB);

// حذف جميع سجلات قاعدة المعرفة لخادم معين
router.delete('/guild/:guildId', validationMiddlewareFactory(deleteKBByGuildIdSchema, 'params'), deleteKBByGuildId);

export default router;