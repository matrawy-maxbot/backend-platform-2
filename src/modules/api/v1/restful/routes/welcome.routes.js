import { Router } from 'express';
import {
  getAllWelcome,
  getWelcomeByGuildId,
  getWelcomeWithBackground,
  getWelcomeWithText,
  getWelcomeByAvatarStyle,
  searchWelcome,
  createWelcome,
  createGuildWelcome,
  updateWelcome,
  updateImageSettings,
  updateBackgroundSettings,
  updateAvatarSettings,
  updateTextArray,
  clearBackgroundUrl,
  clearTextArray,
  resetAvatarSettings,
  deleteWelcome,
  deleteWelcomeWithoutBackground,
  deleteWelcomeWithoutText,
  checkWelcomeExists,
  hasBackground,
  hasTextArray,
  getWelcomeStats,
  upsertWelcome,
  copyWelcomeSettings
} from '../controllers/welcome.controller.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';
import {
  createWelcomeSchema,
  updateWelcomeSchema,
  getWelcomeByGuildIdSchema,
  getWelcomeByAvatarStyleSchema,
  searchWelcomeSchema,
  createGuildWelcomeSchema,
  updateImageSettingsSchema,
  updateBackgroundSettingsSchema,
  updateAvatarSettingsSchema,
  updateTextArraySchema,
  copyWelcomeSettingsSchema
} from '../validators/welcome.validator.js';

const router = Router();

/**
 * مسارات إعدادات الترحيب
 * @module WelcomeRoutes
 */

// مسارات GET - الحصول على البيانات

/**
 * الحصول على جميع إعدادات الترحيب
 * @route GET /welcome
 */
router.get('/', getAllWelcome);

/**
 * الحصول على إحصائيات إعدادات الترحيب
 * @route GET /welcome/stats
 */
router.get('/stats', getWelcomeStats);

/**
 * الحصول على إعدادات الترحيب التي تحتوي على خلفية
 * @route GET /welcome/with-background
 */
router.get('/with-background', getWelcomeWithBackground);

/**
 * الحصول على إعدادات الترحيب التي تحتوي على نصوص
 * @route GET /welcome/with-text
 */
router.get('/with-text', getWelcomeWithText);

/**
 * البحث في إعدادات الترحيب
 * @route GET /welcome/search
 */
router.get('/search', 
  validationMiddlewareFactory(searchWelcomeSchema, 'query'),
  searchWelcome
);

/**
 * الحصول على إعدادات الترحيب بواسطة نمط الأفاتار
 * @route GET /welcome/avatar-style/:avatarStyle
 */
router.get('/avatar-style/:avatarStyle',
  validationMiddlewareFactory(getWelcomeByAvatarStyleSchema, 'params'),
  getWelcomeByAvatarStyle
);

/**
 * الحصول على إعدادات الترحيب بواسطة معرف الخادم
 * @route GET /welcome/guild/:guildId
 */
router.get('/guild/:guildId',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  getWelcomeByGuildId
);

/**
 * التحقق من وجود إعدادات ترحيب للخادم
 * @route GET /welcome/guild/:guildId/exists
 */
router.get('/guild/:guildId/exists',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  checkWelcomeExists
);

/**
 * التحقق من وجود خلفية
 * @route GET /welcome/guild/:guildId/has-background
 */
router.get('/guild/:guildId/has-background',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  hasBackground
);

/**
 * التحقق من وجود نصوص
 * @route GET /welcome/guild/:guildId/has-text
 */
router.get('/guild/:guildId/has-text',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  hasTextArray
);

// مسارات POST - إنشاء البيانات

/**
 * إنشاء إعدادات ترحيب جديدة
 * @route POST /welcome
 */
router.post('/',
  validationMiddlewareFactory(createWelcomeSchema, 'body'),
  createWelcome
);

/**
 * إنشاء إعدادات ترحيب للخادم
 * @route POST /welcome/guild/:guildId
 */
router.post('/guild/:guildId',
  validationMiddlewareFactory(createGuildWelcomeSchema, 'params'),
  createGuildWelcome
);

/**
 * نسخ إعدادات الترحيب من خادم إلى آخر
 * @route POST /welcome/copy
 */
router.post('/copy',
  validationMiddlewareFactory(copyWelcomeSettingsSchema, 'body'),
  copyWelcomeSettings
);

// مسارات PUT - تحديث البيانات

/**
 * تحديث إعدادات الترحيب
 * @route PUT /welcome/guild/:guildId
 */
router.put('/guild/:guildId',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateWelcomeSchema, 'body'),
  updateWelcome
);

/**
 * إنشاء أو تحديث إعدادات الترحيب
 * @route PUT /welcome/guild/:guildId/upsert
 */
router.put('/guild/:guildId/upsert',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateWelcomeSchema, 'body'),
  upsertWelcome
);

// مسارات PATCH - تحديث جزئي للبيانات

/**
 * تحديث إعدادات الصورة
 * @route PATCH /welcome/guild/:guildId/image
 */
router.patch('/guild/:guildId/image',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateImageSettingsSchema, 'body'),
  updateImageSettings
);

/**
 * تحديث إعدادات الخلفية
 * @route PATCH /welcome/guild/:guildId/background
 */
router.patch('/guild/:guildId/background',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateBackgroundSettingsSchema, 'body'),
  updateBackgroundSettings
);

/**
 * تحديث إعدادات الأفاتار
 * @route PATCH /welcome/guild/:guildId/avatar
 */
router.patch('/guild/:guildId/avatar',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateAvatarSettingsSchema, 'body'),
  updateAvatarSettings
);

/**
 * تحديث النصوص
 * @route PATCH /welcome/guild/:guildId/text
 */
router.patch('/guild/:guildId/text',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateTextArraySchema, 'body'),
  updateTextArray
);

/**
 * مسح رابط الخلفية
 * @route PATCH /welcome/guild/:guildId/clear-background
 */
router.patch('/guild/:guildId/clear-background',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  clearBackgroundUrl
);

/**
 * مسح النصوص
 * @route PATCH /welcome/guild/:guildId/clear-text
 */
router.patch('/guild/:guildId/clear-text',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  clearTextArray
);

/**
 * إعادة تعيين إعدادات الأفاتار
 * @route PATCH /welcome/guild/:guildId/reset-avatar
 */
router.patch('/guild/:guildId/reset-avatar',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  resetAvatarSettings
);

// مسارات DELETE - حذف البيانات

/**
 * حذف إعدادات الترحيب بدون خلفية
 * @route DELETE /welcome/without-background
 */
router.delete('/without-background', deleteWelcomeWithoutBackground);

/**
 * حذف إعدادات الترحيب بدون نصوص
 * @route DELETE /welcome/without-text
 */
router.delete('/without-text', deleteWelcomeWithoutText);

/**
 * حذف إعدادات الترحيب
 * @route DELETE /welcome/guild/:guildId
 */
router.delete('/guild/:guildId',
  validationMiddlewareFactory(getWelcomeByGuildIdSchema, 'params'),
  deleteWelcome
);

export default router;