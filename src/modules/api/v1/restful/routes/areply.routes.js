import express from 'express';
import AreplyController from '../controllers/areply.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createReplySchema,
  createAutoReplySchema,
  getReplyByIdSchema,
  getRepliesByGuildIdSchema,
  searchByMessageSchema,
  searchByReplySchema,
  searchInBothSchema,
  findReplyByMessageSchema,
  findExactReplySchema,
  getRepliesByDateRangeSchema,
  getRecentRepliesSchema,
  updateReplySchema,
  updateMessageSchema,
  updateReplyTextSchema,
  deleteReplySchema,
  deleteGuildRepliesSchema,
  deleteOldRepliesSchema,
  existsReplySchema,
  countGuildRepliesSchema,
  noValidationSchema
} from '../validators/areply.validator.js';

const router = express.Router();

// إنشاء الردود التلقائية
router.post('/', validationMiddlewareFactory(createReplySchema), AreplyController.createReply);
router.post('/auto', validationMiddlewareFactory(createAutoReplySchema), AreplyController.createAutoReply);

// الحصول على الردود التلقائية
router.get('/', validationMiddlewareFactory(noValidationSchema), AreplyController.getAllReplies);
router.get('/stats', validationMiddlewareFactory(noValidationSchema), AreplyController.getRepliesStats);
router.get('/recent', validationMiddlewareFactory(getRecentRepliesSchema), AreplyController.getRecentReplies);
router.get('/date-range', validationMiddlewareFactory(getRepliesByDateRangeSchema), AreplyController.getRepliesByDateRange);
router.get('/:divId', validationMiddlewareFactory(getReplyByIdSchema), AreplyController.getReplyById);
router.get('/guild/:guildId', validationMiddlewareFactory(getRepliesByGuildIdSchema), AreplyController.getRepliesByGuildId);
router.get('/guild/:guildId/count', validationMiddlewareFactory(countGuildRepliesSchema), AreplyController.countGuildReplies);

// البحث في الردود التلقائية
router.get('/search/message', validationMiddlewareFactory(searchByMessageSchema), AreplyController.searchByMessage);
router.get('/search/reply', validationMiddlewareFactory(searchByReplySchema), AreplyController.searchByReply);
router.get('/search/both', validationMiddlewareFactory(searchInBothSchema), AreplyController.searchInBoth);
router.get('/find/:guildId/:message', validationMiddlewareFactory(findReplyByMessageSchema), AreplyController.findReplyByMessage);
router.get('/exact/:guildId/:message', validationMiddlewareFactory(findExactReplySchema), AreplyController.findExactReply);

// التحقق من وجود الردود التلقائية
router.get('/:divId/exists', validationMiddlewareFactory(existsReplySchema), AreplyController.existsReply);

// تحديث الردود التلقائية
router.put('/:divId', validationMiddlewareFactory(updateReplySchema), AreplyController.updateReply);
router.patch('/:divId/message', validationMiddlewareFactory(updateMessageSchema), AreplyController.updateMessage);
router.patch('/:divId/reply', validationMiddlewareFactory(updateReplyTextSchema), AreplyController.updateReplyText);

// حذف الردود التلقائية
router.delete('/:divId', validationMiddlewareFactory(deleteReplySchema), AreplyController.deleteReply);
router.delete('/guild/:guildId', validationMiddlewareFactory(deleteGuildRepliesSchema), AreplyController.deleteGuildReplies);
router.delete('/old/cleanup', validationMiddlewareFactory(deleteOldRepliesSchema), AreplyController.deleteOldReplies);

export default router;