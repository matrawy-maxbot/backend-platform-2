// src/modules/api/v1/restful/routes/topThree.routes.js

import express from 'express';
import {
  getAllTopThree,
  getTopThreeById,
  createTopThree,
  updateTopThree,
  deleteTopThree,
  getTopThreeStats,
  searchTopThree,
  resetTopThreeToDefault
} from '../controllers/topThree.controller.js';
import {
  createTopThreeSchema,
  updateTopThreeSchema,
  getTopThreeByIdSchema,
  searchTopThreeSchema
} from '../validators/topThree.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = express.Router();

// الحصول على جميع عناصر أفضل ثلاثة
router.get('/', getAllTopThree);

// البحث في عناصر أفضل ثلاثة
router.get('/search', validationMiddlewareFactory(searchTopThreeSchema, 'query'), searchTopThree);

// الحصول على إحصائيات أفضل ثلاثة
router.get('/stats', getTopThreeStats);

// إعادة تعيين قائمة أفضل ثلاثة للبيانات الافتراضية
router.post('/reset', resetTopThreeToDefault);

// الحصول على عنصر أفضل ثلاثة بواسطة المعرف
router.get('/:id', validationMiddlewareFactory(getTopThreeByIdSchema, 'params'), getTopThreeById);

// إنشاء عنصر جديد في أفضل ثلاثة
router.post('/', validationMiddlewareFactory(createTopThreeSchema, 'body'), createTopThree);

// تحديث عنصر أفضل ثلاثة
router.put('/:id', validationMiddlewareFactory(updateTopThreeSchema, 'body'), updateTopThree);

// حذف عنصر أفضل ثلاثة
router.delete('/:id', validationMiddlewareFactory(getTopThreeByIdSchema, 'params'), deleteTopThree);

export default router;