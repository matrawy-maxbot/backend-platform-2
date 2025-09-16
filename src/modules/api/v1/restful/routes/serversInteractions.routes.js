// src/modules/api/v1/restful/routes/serversInteractions.routes.js
import { Router } from 'express';
const router = Router();
import { 
    getAllInteractions,
    getInteractionByUserAndGuild,
    getInteractionsByUser,
    getInteractionsByGuild,
    getInteractionsByChatLevel,
    getInteractionsByVoiceLevel,
    createInteraction,
    updateInteraction,
    updateChatPoints,
    updateVoicePoints,
    incrementChatPoints,
    incrementVoicePoints,
    deleteInteraction,
    deleteUserInteractions,
    deleteGuildInteractions,
    getInteractionStats
} from '../controllers/serversInteractions.controller.js';
import { 
    createInteractionSchema,
    updateInteractionSchema,
    getUserGuildInteractionSchema,
    getUserInteractionsSchema,
    getGuildInteractionsSchema,
    getChatLevelInteractionsSchema,
    getVoiceLevelInteractionsSchema,
    updatePointsSchema,
    incrementPointsSchema,
    deleteUserInteractionsSchema,
    deleteGuildInteractionsSchema
} from '../validators/serversInteractions.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

// الحصول على جميع التفاعلات
router.get('/', getAllInteractions);

// الحصول على إحصائيات التفاعلات
router.get('/stats', getInteractionStats);

// الحصول على التفاعلات بناءً على مستوى الدردشة
router.get('/chat-level/:minLevel', validationMiddlewareFactory(getChatLevelInteractionsSchema, 'params'), getInteractionsByChatLevel);

// الحصول على التفاعلات بناءً على مستوى الصوت
router.get('/voice-level/:minLevel', validationMiddlewareFactory(getVoiceLevelInteractionsSchema, 'params'), getInteractionsByVoiceLevel);

// الحصول على جميع تفاعلات مستخدم معين
router.get('/user/:userId', validationMiddlewareFactory(getUserInteractionsSchema, 'params'), getInteractionsByUser);

// الحصول على جميع تفاعلات خادم معين
router.get('/guild/:guildId', validationMiddlewareFactory(getGuildInteractionsSchema, 'params'), getInteractionsByGuild);

// الحصول على تفاعل بواسطة معرف المستخدم ومعرف الخادم
router.get('/user/:userId/guild/:guildId', validationMiddlewareFactory(getUserGuildInteractionSchema, 'params'), getInteractionByUserAndGuild);

// إنشاء تفاعل جديد
router.post('/', validationMiddlewareFactory(createInteractionSchema, 'body'), createInteraction);

// تحديث تفاعل موجود
router.put('/user/:userId/guild/:guildId', validationMiddlewareFactory(updateInteractionSchema, 'body'), updateInteraction);

// تحديث نقاط الدردشة
router.patch('/user/:userId/guild/:guildId/chat-points', validationMiddlewareFactory(updatePointsSchema, 'body'), updateChatPoints);

// تحديث نقاط الصوت
router.patch('/user/:userId/guild/:guildId/voice-points', validationMiddlewareFactory(updatePointsSchema, 'body'), updateVoicePoints);

// زيادة نقاط الدردشة
router.patch('/user/:userId/guild/:guildId/increment-chat', validationMiddlewareFactory(incrementPointsSchema, 'body'), incrementChatPoints);

// زيادة نقاط الصوت
router.patch('/user/:userId/guild/:guildId/increment-voice', validationMiddlewareFactory(incrementPointsSchema, 'body'), incrementVoicePoints);

// حذف تفاعل
router.delete('/user/:userId/guild/:guildId', validationMiddlewareFactory(getUserGuildInteractionSchema, 'params'), deleteInteraction);

// حذف تفاعلات مستخدم معين
router.delete('/user/:userId', validationMiddlewareFactory(deleteUserInteractionsSchema, 'params'), deleteUserInteractions);

// حذف تفاعلات خادم معين
router.delete('/guild/:guildId', validationMiddlewareFactory(deleteGuildInteractionsSchema, 'params'), deleteGuildInteractions);

export default router;