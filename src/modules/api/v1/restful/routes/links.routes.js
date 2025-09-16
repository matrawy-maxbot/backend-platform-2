import express from 'express';
import {
  createLink,
  getAllLinks,
  getLinkByGuildId,
  getLinksWithURL,
  getLinksWithChats,
  searchLinksByURL,
  updateLink,
  updateLinkURL,
  updateLinkChats,
  updateLinkSelectData,
  deleteLink,
  clearLinkURL,
  clearLinkChats,
  checkLinkExists,
  getLinkStats
} from '../controllers/links.controller.js';
import {
  createLinkSchema,
  updateLinkSchema,
  updateLinkURLSchema,
  updateLinkChatsSchema,
  updateLinkSelectDataSchema,
  getLinkByGuildIdSchema,
  searchLinksByURLSchema
} from '../validators/links.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = express.Router();

// إنشاء رابط جديد
router.post(
  '/',
  validationMiddlewareFactory(createLinkSchema, 'body'),
  createLink
);

// الحصول على جميع الروابط
router.get('/', getAllLinks);

// الحصول على رابط بواسطة معرف الخادم
router.get(
  '/guild/:guildId',
  validationMiddlewareFactory(getLinkByGuildIdSchema, 'params'),
  getLinkByGuildId
);

// الحصول على الروابط التي تحتوي على URL
router.get('/with-url', getLinksWithURL);

// الحصول على الروابط التي تحتوي على محادثات
router.get('/with-chats', getLinksWithChats);

// البحث في الروابط بواسطة URL
router.get(
  '/search',
  validationMiddlewareFactory(searchLinksByURLSchema, 'query'),
  searchLinksByURL
);

// إحصائيات الروابط
router.get('/stats', getLinkStats);

// التحقق من وجود رابط
router.get(
  '/exists/:guildId',
  validationMiddlewareFactory(getLinkByGuildIdSchema, 'params'),
  checkLinkExists
);

// تحديث رابط
router.put(
  '/:guildId',
  validationMiddlewareFactory(getLinkByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateLinkSchema, 'body'),
  updateLink
);

// تحديث رابط URL
router.patch(
  '/:guildId/url',
  validationMiddlewareFactory(getLinkByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateLinkURLSchema, 'body'),
  updateLinkURL
);

// تحديث محادثات الرابط
router.patch(
  '/:guildId/chats',
  validationMiddlewareFactory(getLinkByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateLinkChatsSchema, 'body'),
  updateLinkChats
);

// تحديث بيانات التحديد للرابط
router.patch(
  '/:guildId/select-data',
  validationMiddlewareFactory(getLinkByGuildIdSchema, 'params'),
  validationMiddlewareFactory(updateLinkSelectDataSchema, 'body'),
  updateLinkSelectData
);

// مسح رابط URL فقط
router.patch(
  '/:guildId/clear-url',
  validationMiddlewareFactory(getLinkByGuildIdSchema, 'params'),
  clearLinkURL
);

// مسح محادثات الرابط فقط
router.patch(
  '/:guildId/clear-chats',
  validationMiddlewareFactory(getLinkByGuildIdSchema, 'params'),
  clearLinkChats
);

// حذف رابط
router.delete(
  '/:guildId',
  validationMiddlewareFactory(getLinkByGuildIdSchema, 'params'),
  deleteLink
);

export default router;