import express from 'express';
import {
  createMuteChat,
  getAllMuteChats,
  getMuteChatById,
  getMuteChatsWithData,
  getEmptyMuteChats,
  searchMuteChats,
  updateMuteChat,
  updateMuteData,
  deleteMuteChat,
  clearMuteData,
  checkMuteChatExists,
  checkHasMuteData,
  getMuteChatStats,
  addOrUpdateMuteData
} from '../controllers/mutechat.controller.js';
import {
  validateCreateMuteChat,
  validateUpdateMuteChat,
  validateUpdateMuteData,
  validateSearchMuteChats,
  validateMuteChatId,
  validateAddOrUpdateMuteData
} from '../validators/mutechat.validator.js';

const router = express.Router();

/**
 * مسارات MuteChat API - إدارة عمليات كتم الدردشة
 */

// إنشاء سجل كتم جديد
router.post('/', validateCreateMuteChat, createMuteChat);

// الحصول على جميع سجلات الكتم
router.get('/', getAllMuteChats);

// البحث في سجلات الكتم
router.get('/search', validateSearchMuteChats, searchMuteChats);

// الحصول على سجلات الكتم التي تحتوي على بيانات
router.get('/with-data', getMuteChatsWithData);

// الحصول على سجلات الكتم الفارغة
router.get('/empty', getEmptyMuteChats);

// الحصول على إحصائيات سجلات الكتم
router.get('/stats', getMuteChatStats);

// الحصول على سجل كتم بواسطة المعرف
router.get('/:id', validateMuteChatId, getMuteChatById);

// تحديث سجل كتم
router.put('/:id', validateMuteChatId, validateUpdateMuteChat, updateMuteChat);

// تحديث بيانات الكتم فقط
router.patch('/:id/data', validateMuteChatId, validateUpdateMuteData, updateMuteData);

// إضافة أو تحديث بيانات كتم
router.patch('/:id/upsert', validateMuteChatId, validateAddOrUpdateMuteData, addOrUpdateMuteData);

// مسح بيانات الكتم فقط
router.patch('/:id/clear', validateMuteChatId, clearMuteData);

// التحقق من وجود سجل كتم
router.get('/:id/exists', validateMuteChatId, checkMuteChatExists);

// التحقق من وجود بيانات كتم
router.get('/:id/has-data', validateMuteChatId, checkHasMuteData);

// حذف سجل كتم
router.delete('/:id', validateMuteChatId, deleteMuteChat);

export default router;