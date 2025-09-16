import express from 'express';
import {
  createMuteVoice,
  getAllMuteVoices,
  getMuteVoiceById,
  getMuteVoicesWithData,
  getEmptyMuteVoices,
  searchMuteVoices,
  updateMuteVoice,
  updateMuteData,
  deleteMuteVoice,
  clearMuteData,
  checkMuteVoiceExists,
  checkHasMuteData,
  getMuteVoiceStats,
  addOrUpdateMuteData
} from '../controllers/mutevoice.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createMuteVoiceSchema,
  updateMuteVoiceSchema,
  updateMuteDataSchema,
  getMuteVoiceByIdSchema,
  searchMuteVoicesSchema,
  addOrUpdateMuteDataSchema
} from '../validators/mutevoice.validator.js';

const router = express.Router();

// إنشاء سجل كتم صوت جديد
router.post('/', validationMiddlewareFactory(createMuteVoiceSchema, 'body'), createMuteVoice);

// جلب جميع سجلات كتم الصوت
router.get('/', getAllMuteVoices);

// جلب سجل كتم صوت بواسطة المعرف
router.get('/:id', validationMiddlewareFactory(getMuteVoiceByIdSchema, 'params'), getMuteVoiceById);

// جلب سجلات كتم الصوت التي تحتوي على بيانات
router.get('/with-data/all', getMuteVoicesWithData);

// جلب سجلات كتم الصوت الفارغة
router.get('/empty/all', getEmptyMuteVoices);

// البحث في سجلات كتم الصوت
router.get('/search/:searchTerm', validationMiddlewareFactory(searchMuteVoicesSchema, 'params'), searchMuteVoices);

// الحصول على إحصائيات سجلات كتم الصوت
router.get('/stats/all', getMuteVoiceStats);

// التحقق من وجود سجل كتم صوت
router.get('/exists/:id', validationMiddlewareFactory(getMuteVoiceByIdSchema, 'params'), checkMuteVoiceExists);

// التحقق من وجود بيانات كتم صوتي
router.get('/has-data/:id', validationMiddlewareFactory(getMuteVoiceByIdSchema, 'params'), checkHasMuteData);

// تحديث سجل كتم صوت كامل
router.put('/:id', validationMiddlewareFactory(updateMuteVoiceSchema, 'body'), updateMuteVoice);

// تحديث بيانات الكتم الصوتي فقط
router.patch('/data/:id', validationMiddlewareFactory(updateMuteDataSchema, 'body'), updateMuteData);

// إضافة أو تحديث بيانات كتم صوتي
router.patch('/upsert-data/:id', validationMiddlewareFactory(addOrUpdateMuteDataSchema, 'body'), addOrUpdateMuteData);

// مسح بيانات الكتم الصوتي
router.patch('/clear/:id', validationMiddlewareFactory(getMuteVoiceByIdSchema, 'params'), clearMuteData);

// حذف سجل كتم صوت
router.delete('/:id', validationMiddlewareFactory(getMuteVoiceByIdSchema, 'params'), deleteMuteVoice);

export default router;