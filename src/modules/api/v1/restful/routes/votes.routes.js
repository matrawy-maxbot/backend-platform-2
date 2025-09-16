import { Router } from 'express';
import {
    getAllVotes,
    getVoteById,
    getVoteByGuildId,
    getVoteByChannelId,
    getVoteByMessageId,
    getVoteByRankMessageId,
    getVoteByGuildAndChannel,
    searchVotes,
    createVote,
    updateVote,
    updateMessageId,
    updateRankMessageId,
    updateChannelId,
    deleteVote,
    deleteVoteByGuildId,
    getVoteStats,
    checkVoteExists,
    checkVoteExistsByGuildId,
    createOrUpdateVote
} from '../controllers/votes.controller.js';
import {
    createVoteSchema,
    updateVoteSchema,
    getVoteByIdSchema,
    getVoteByGuildIdSchema,
    getVoteByChannelIdSchema,
    getVoteByMessageIdSchema,
    getVoteByRankMessageIdSchema,
    getVoteByGuildAndChannelSchema,
    searchVotesSchema,
    updateMessageIdSchema,
    updateRankMessageIdSchema,
    updateChannelIdSchema,
    createOrUpdateVoteSchema
} from '../validators/votes.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = Router();

// الحصول على جميع التصويتات
router.get('/', getAllVotes);

// البحث في التصويتات
router.get('/search', validationMiddlewareFactory(searchVotesSchema, 'query'), searchVotes);

// الحصول على إحصائيات التصويتات
router.get('/stats', getVoteStats);

// الحصول على تصويت بواسطة المعرف
router.get('/:id', validationMiddlewareFactory(getVoteByIdSchema, 'params'), getVoteById);

// الحصول على تصويت بواسطة معرف الخادم
router.get('/guild/:guildId', validationMiddlewareFactory(getVoteByGuildIdSchema, 'params'), getVoteByGuildId);

// الحصول على تصويت بواسطة معرف القناة
router.get('/channel/:channelId', validationMiddlewareFactory(getVoteByChannelIdSchema, 'params'), getVoteByChannelId);

// الحصول على تصويت بواسطة معرف الرسالة
router.get('/message/:messageId', validationMiddlewareFactory(getVoteByMessageIdSchema, 'params'), getVoteByMessageId);

// الحصول على تصويت بواسطة معرف رسالة الترتيب
router.get('/rank-message/:rankMessageId', validationMiddlewareFactory(getVoteByRankMessageIdSchema, 'params'), getVoteByRankMessageId);

// الحصول على تصويت بواسطة معرف الخادم والقناة
router.get('/guild/:guildId/channel/:channelId', validationMiddlewareFactory(getVoteByGuildAndChannelSchema, 'params'), getVoteByGuildAndChannel);

// التحقق من وجود تصويت
router.get('/:id/exists', validationMiddlewareFactory(getVoteByIdSchema, 'params'), checkVoteExists);

// التحقق من وجود تصويت بواسطة معرف الخادم
router.get('/guild/:guildId/exists', validationMiddlewareFactory(getVoteByGuildIdSchema, 'params'), checkVoteExistsByGuildId);

// إنشاء تصويت جديد
router.post('/', validationMiddlewareFactory(createVoteSchema, 'body'), createVote);

// إنشاء أو تحديث تصويت
router.post('/upsert', validationMiddlewareFactory(createOrUpdateVoteSchema, 'body'), createOrUpdateVote);

// تحديث تصويت
router.put('/:id', validationMiddlewareFactory(getVoteByIdSchema, 'params'), validationMiddlewareFactory(updateVoteSchema, 'body'), updateVote);

// تحديث معرف الرسالة
router.patch('/:id/message', validationMiddlewareFactory(getVoteByIdSchema, 'params'), validationMiddlewareFactory(updateMessageIdSchema, 'body'), updateMessageId);

// تحديث معرف رسالة الترتيب
router.patch('/:id/rank-message', validationMiddlewareFactory(getVoteByIdSchema, 'params'), validationMiddlewareFactory(updateRankMessageIdSchema, 'body'), updateRankMessageId);

// تحديث معرف القناة
router.patch('/:id/channel', validationMiddlewareFactory(getVoteByIdSchema, 'params'), validationMiddlewareFactory(updateChannelIdSchema, 'body'), updateChannelId);

// حذف تصويت
router.delete('/:id', validationMiddlewareFactory(getVoteByIdSchema, 'params'), deleteVote);

// حذف تصويت بواسطة معرف الخادم
router.delete('/guild/:guildId', validationMiddlewareFactory(getVoteByGuildIdSchema, 'params'), deleteVoteByGuildId);

export default router;