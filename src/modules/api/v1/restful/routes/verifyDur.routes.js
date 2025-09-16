import { Router } from 'express';
import {
  createVerifyDur,
  createUserVerifyDur,
  getAllVerifyDur,
  getVerifyDurById,
  getVerifyDurByUserAndGuild,
  getVerifyDurByUserId,
  getVerifyDurByGuildId,
  getVerifyDurByDuration,
  updateVerifyDur,
  updateUserVerifyDuration,
  deleteVerifyDur,
  deleteUserVerifyDur,
  getVerifyDurStats,
  isVerifyDurExpired,
  getRemainingVerifyTime
} from '../controllers/verifyDur.controller.js';
import {
  createVerifyDurSchema,
  createUserVerifyDurSchema,
  updateVerifyDurSchema,
  updateUserVerifyDurationSchema,
  getVerifyDurByIdSchema,
  getVerifyDurByUserAndGuildSchema,
  getVerifyDurByUserIdSchema,
  getVerifyDurByGuildIdSchema,
  getVerifyDurByDurationSchema
} from '../validators/verifyDur.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = Router();

// إنشاء سجل مدة تحقق جديد
router.post('/', validationMiddlewareFactory(createVerifyDurSchema, 'body'), createVerifyDur);

// إنشاء سجل مدة تحقق للمستخدم
router.post('/user', validationMiddlewareFactory(createUserVerifyDurSchema, 'body'), createUserVerifyDur);

// الحصول على جميع سجلات مدة التحقق
router.get('/', getAllVerifyDur);

// الحصول على إحصائيات مدة التحقق
router.get('/stats', getVerifyDurStats);

// الحصول على سجل مدة التحقق بواسطة المعرف
router.get('/:id', validationMiddlewareFactory(getVerifyDurByIdSchema, 'params'), getVerifyDurById);

// الحصول على سجل مدة التحقق للمستخدم والخادم
router.get('/user/:userId/guild/:guildId', 
  validationMiddlewareFactory(getVerifyDurByUserAndGuildSchema, 'params'), 
  getVerifyDurByUserAndGuild
);

// الحصول على سجلات مدة التحقق للمستخدم
router.get('/user/:userId', 
  validationMiddlewareFactory(getVerifyDurByUserIdSchema, 'params'), 
  getVerifyDurByUserId
);

// الحصول على سجلات مدة التحقق للخادم
router.get('/guild/:guildId', 
  validationMiddlewareFactory(getVerifyDurByGuildIdSchema, 'params'), 
  getVerifyDurByGuildId
);

// الحصول على سجلات مدة التحقق بواسطة المدة
router.get('/duration/:duration', 
  validationMiddlewareFactory(getVerifyDurByDurationSchema, 'params'),  
  getVerifyDurByDuration
);

// التحقق من انتهاء صلاحية مدة التحقق
router.get('/expired/:userId/:guildId', 
  validationMiddlewareFactory(getVerifyDurByUserAndGuildSchema, 'params'), 
  isVerifyDurExpired
);

// الحصول على الوقت المتبقي لانتهاء مدة التحقق
router.get('/remaining/:userId/:guildId', 
  validationMiddlewareFactory(getVerifyDurByUserAndGuildSchema, 'params'),  
  getRemainingVerifyTime
);

// تحديث سجل مدة التحقق
router.put('/:id', 
  validationMiddlewareFactory(getVerifyDurByIdSchema, 'params'),
  validationMiddlewareFactory(updateVerifyDurSchema, 'body'), 
  updateVerifyDur
);

// تحديث مدة التحقق للمستخدم
router.put('/user/:userId/guild/:guildId', 
  validationMiddlewareFactory(getVerifyDurByUserAndGuildSchema, 'params'),
  validationMiddlewareFactory(updateUserVerifyDurationSchema, 'body'), 
  updateUserVerifyDuration
);

// حذف سجل مدة التحقق
router.delete('/:id', 
  validationMiddlewareFactory(getVerifyDurByIdSchema, 'params'), 
  deleteVerifyDur
);

// حذف سجل مدة التحقق للمستخدم
router.delete('/user/:userId/guild/:guildId', 
  validationMiddlewareFactory(getVerifyDurByUserAndGuildSchema, 'params'), 
  deleteUserVerifyDur
);

export default router;