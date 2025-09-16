import express from 'express';
import {
  createLikes,
  createUserLikes,
  getAllLikes,
  getLikesById,
  searchLikesByContent,
  getLikesByDateRange,
  getRecentLikes,
  updateLikes,
  updateLikesData,
  addLikeToRecord,
  removeLikeFromRecord,
  mergeLikesData,
  deleteLikes,
  deleteOldLikes,
  deleteEmptyLikes,
  deleteLikesByDateRange,
  getLikesStats,
  hasLike,
  getLikeValue
} from '../controllers/likes.controller.js';
import {
  createLikesSchema,
  createUserLikesSchema,
  updateLikesSchema,
  updateLikesDataSchema,
  addLikeSchema,
  removeLikeSchema,
  mergeLikesSchema,
  searchLikesSchema,
  dateRangeSchema,
  limitSchema,
  deleteOldLikesSchema,
  idParamSchema,
  likeKeyParamSchema
} from '../validators/likes.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js'; 

const router = express.Router();

/**
 * مسارات Likes API - إدارة عمليات الإعجابات
 */

// إنشاء سجل إعجابات جديد
router.post('/', validationMiddlewareFactory(createLikesSchema, 'body'), createLikes);

// إنشاء سجل إعجابات جديد للمستخدم
router.post('/user/:id', validationMiddlewareFactory(idParamSchema, 'params'), createUserLikes);

// الحصول على جميع سجلات الإعجابات
router.get('/', getAllLikes);

// البحث في سجلات الإعجابات
router.get('/search', validationMiddlewareFactory(searchLikesSchema, 'body'), searchLikesByContent);  

// الحصول على سجلات الإعجابات بواسطة نطاق زمني
router.post('/date-range', validationMiddlewareFactory(dateRangeSchema, 'body'), getLikesByDateRange);

// الحصول على أحدث سجلات الإعجابات
router.get('/recent', validationMiddlewareFactory(limitSchema, 'body'), getRecentLikes);

// الحصول على إحصائيات الإعجابات
router.get('/stats', getLikesStats);

// الحصول على سجل الإعجابات بواسطة المعرف
router.get('/:id', validationMiddlewareFactory(idParamSchema, 'params'), getLikesById);

// تحديث سجل الإعجابات
router.put('/:id', validationMiddlewareFactory(idParamSchema, 'params'), validationMiddlewareFactory(updateLikesSchema, 'body'), updateLikes);

// تحديث بيانات الإعجابات فقط
router.patch('/:id/data', validationMiddlewareFactory(idParamSchema, 'params'), validationMiddlewareFactory(updateLikesDataSchema, 'body'), updateLikesData);

// إضافة إعجاب جديد لسجل موجود
router.post('/:id/like', validationMiddlewareFactory(idParamSchema, 'params'), validationMiddlewareFactory(addLikeSchema, 'body'), addLikeToRecord);

// دمج بيانات إعجابات جديدة مع الموجودة
router.patch('/:id/merge', validationMiddlewareFactory(idParamSchema, 'params'), validationMiddlewareFactory(mergeLikesSchema, 'body'), mergeLikesData);

// التحقق من وجود إعجاب معين في السجل
router.get('/:id/has/:likeKey', validationMiddlewareFactory(idParamSchema, 'params'), validationMiddlewareFactory(likeKeyParamSchema, 'params'), hasLike);

// الحصول على قيمة إعجاب معين
router.get('/:id/value/:likeKey', validationMiddlewareFactory(idParamSchema, 'params'), validationMiddlewareFactory(likeKeyParamSchema, 'params'), getLikeValue);

// إزالة إعجاب من سجل موجود
router.delete('/:id/like/:likeKey', validationMiddlewareFactory(idParamSchema, 'params'), validationMiddlewareFactory(likeKeyParamSchema, 'params'), removeLikeFromRecord);

// حذف سجل الإعجابات
router.delete('/:id', validationMiddlewareFactory(idParamSchema, 'params'), deleteLikes);

// حذف سجلات الإعجابات القديمة
router.delete('/cleanup/old', validationMiddlewareFactory(deleteOldLikesSchema, 'body'), deleteOldLikes);

// حذف سجلات الإعجابات الفارغة
router.delete('/cleanup/empty', deleteEmptyLikes);

// حذف سجلات الإعجابات بواسطة نطاق زمني
router.delete('/cleanup/date-range', validationMiddlewareFactory(dateRangeSchema, 'body'), deleteLikesByDateRange);

export default router;