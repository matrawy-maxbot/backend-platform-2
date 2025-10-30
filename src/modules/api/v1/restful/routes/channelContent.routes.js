import express from 'express';
import * as channelContentController from '../controllers/channelContent.controller.js';
import * as channelContentValidator from '../validators/channelContent.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة محتوى القنوات
 * @module ChannelContentRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/channel-content
 * @desc الحصول على جميع إعدادات محتوى القنوات
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  channelContentController.getAllChannelContent
);

/**
 * @route GET /api/v1/restful/channel-content/:id
 * @desc الحصول على إعدادات محتوى القنوات بواسطة المعرف
 * @access Public
 * @param {number} id - معرف إعدادات محتوى القنوات
 */
router.get(
  '/:id',
  validationMiddlewareFactory(channelContentValidator.getChannelContentByIdSchema.params, 'params'),
  channelContentController.getChannelContentById
);

/**
 * @route GET /api/v1/restful/channel-content/server/:serverId
 * @desc الحصول على إعدادات محتوى القنوات بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(channelContentValidator.getChannelContentByServerIdSchema.params, 'params'),
  channelContentController.getChannelContentByServerId
);

/**
 * @route POST /api/v1/restful/channel-content
 * @desc إنشاء إعدادات محتوى قنوات جديدة
 * @access Public
 * @body {Object} channelContentData - بيانات إعدادات محتوى القنوات الجديدة
 * @body {string} channelContentData.server_id - معرف الخادم
 * @body {Array} [channelContentData.block_images] - قائمة القنوات المحظور فيها الصور
 * @body {Array} [channelContentData.block_text_messages] - قائمة القنوات المحظور فيها الرسائل النصية
 * @body {Array} [channelContentData.block_file_attachments] - قائمة القنوات المحظور فيها مرفقات الملفات
 * @body {Array} [channelContentData.block_bot_commands] - قائمة القنوات المحظور فيها أوامر البوت
 */
router.post(
  '/',
  validationMiddlewareFactory(channelContentValidator.createChannelContentSchema.body, 'body'),
  channelContentController.createChannelContent
);

/**
 * @route PUT /api/v1/restful/channel-content/:id
 * @desc تحديث إعدادات محتوى القنوات
 * @access Public
 * @param {number} id - معرف إعدادات محتوى القنوات
 * @body {Object} updateData - البيانات المحدثة
 * @body {Array} [updateData.block_images] - قائمة القنوات المحظور فيها الصور
 * @body {Array} [updateData.block_text_messages] - قائمة القنوات المحظور فيها الرسائل النصية
 * @body {Array} [updateData.block_file_attachments] - قائمة القنوات المحظور فيها مرفقات الملفات
 * @body {Array} [updateData.block_bot_commands] - قائمة القنوات المحظور فيها أوامر البوت
 */
router.put(
  '/:id',
  validationMiddlewareFactory(channelContentValidator.updateChannelContentSchema.params, 'params'),
  validationMiddlewareFactory(channelContentValidator.updateChannelContentSchema.body, 'body'),
  channelContentController.updateChannelContent
);

/**
 * @route PUT /api/v1/restful/channel-content/server/:serverId
 * @desc تحديث إعدادات محتوى القنوات بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 * @body {Object} updateData - البيانات المحدثة
 * @body {Array} [updateData.block_images] - قائمة القنوات المحظور فيها الصور
 * @body {Array} [updateData.block_text_messages] - قائمة القنوات المحظور فيها الرسائل النصية
 * @body {Array} [updateData.block_file_attachments] - قائمة القنوات المحظور فيها مرفقات الملفات
 * @body {Array} [updateData.block_bot_commands] - قائمة القنوات المحظور فيها أوامر البوت
 */
router.put(
  '/server/:serverId',
  validationMiddlewareFactory(channelContentValidator.updateChannelContentByServerIdSchema.params, 'params'),
  validationMiddlewareFactory(channelContentValidator.updateChannelContentByServerIdSchema.body, 'body'),
  channelContentController.updateChannelContentByServerId
);

/**
 * @route DELETE /api/v1/restful/channel-content/:id
 * @desc حذف إعدادات محتوى القنوات
 * @access Public
 * @param {number} id - معرف إعدادات محتوى القنوات
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(channelContentValidator.deleteChannelContentSchema.params, 'params'),
  channelContentController.deleteChannelContent
);

/**
 * @route DELETE /api/v1/restful/channel-content/server/:serverId
 * @desc حذف إعدادات محتوى القنوات بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.delete(
  '/server/:serverId',
  validationMiddlewareFactory(channelContentValidator.deleteChannelContentByServerIdSchema.params, 'params'),
  channelContentController.deleteChannelContentByServerId
);

export default router;