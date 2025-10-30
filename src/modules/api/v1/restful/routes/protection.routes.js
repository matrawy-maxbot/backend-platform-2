import express from 'express';
import * as protectionController from '../controllers/protection.controller.js';
import * as protectionValidator from '../validators/protection.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة الحماية
 * @module ProtectionRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/protection
 * @desc الحصول على جميع إعدادات الحماية
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  protectionController.getAllProtections
);

/**
 * @route GET /api/v1/restful/protection/:id
 * @desc الحصول على إعدادات حماية بواسطة المعرف
 * @access Public
 * @param {number} id - معرف إعدادات الحماية
 */
router.get(
  '/:id',
  validationMiddlewareFactory(protectionValidator.getProtectionByIdSchema.params, 'params'),
  protectionController.getProtectionById
);

/**
 * @route GET /api/v1/restful/protection/server/:serverId
 * @desc الحصول على إعدادات حماية بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(protectionValidator.getProtectionByServerIdSchema.params, 'params'),
  protectionController.getProtectionByServerId
);

/**
 * @route POST /api/v1/restful/protection
 * @desc إنشاء إعدادات حماية جديدة
 * @access Private
 * @body {Object} protectionData - بيانات إعدادات الحماية الجديدة
 * @body {string} protectionData.server_id - معرف الخادم (مطلوب)
 * @body {boolean} [protectionData.bot_management_enabled=false] - تفعيل إدارة البوتات
 * @body {boolean} [protectionData.disallow_bots=false] - منع البوتات
 * @body {boolean} [protectionData.delete_repeated_messages=false] - حذف الرسائل المكررة
 * @body {boolean} [protectionData.moderation_controls_enabled=false] - تفعيل ضوابط الإشراف
 * @body {string} [protectionData.max_punishment_type=kick] - نوع العقوبة القصوى
 * @body {number} [protectionData.max_kick_ban_limit=1] - حد الطرد والحظر
 * @body {boolean} [protectionData.bad_words=false] - فلتر الكلمات السيئة
 * @body {boolean} [protectionData.links=false] - فلتر الروابط
 * @body {boolean} [protectionData.channels_content=false] - فلتر محتوى القنوات
 */
router.post(
  '/',
  validationMiddlewareFactory(protectionValidator.createProtectionSchema.body, 'body'),
  protectionController.createProtection
);

/**
 * @route PUT /api/v1/restful/protection/:id
 * @desc تحديث إعدادات الحماية بواسطة المعرف
 * @access Private
 * @param {number} id - معرف إعدادات الحماية
 * @body {Object} protectionData - بيانات إعدادات الحماية المحدثة
 * @body {boolean} [protectionData.bot_management_enabled] - تفعيل إدارة البوتات
 * @body {boolean} [protectionData.disallow_bots] - منع البوتات
 * @body {boolean} [protectionData.delete_repeated_messages] - حذف الرسائل المكررة
 * @body {boolean} [protectionData.moderation_controls_enabled] - تفعيل ضوابط الإشراف
 * @body {string} [protectionData.max_punishment_type] - نوع العقوبة القصوى
 * @body {number} [protectionData.max_kick_ban_limit] - حد الطرد والحظر
 * @body {boolean} [protectionData.bad_words] - فلتر الكلمات السيئة
 * @body {boolean} [protectionData.links] - فلتر الروابط
 * @body {boolean} [protectionData.channels_content] - فلتر محتوى القنوات
 */
router.put(
  '/:id',
  validationMiddlewareFactory(protectionValidator.updateProtectionSchema.params, 'params'),
  validationMiddlewareFactory(protectionValidator.updateProtectionSchema.body, 'body'),
  protectionController.updateProtection
);

/**
 * @route PUT /api/v1/restful/protection/server/:serverId
 * @desc تحديث إعدادات الحماية بواسطة معرف الخادم
 * @access Private
 * @param {string} serverId - معرف الخادم
 * @body {Object} protectionData - بيانات إعدادات الحماية المحدثة
 * @body {boolean} [protectionData.bot_management_enabled] - تفعيل إدارة البوتات
 * @body {boolean} [protectionData.disallow_bots] - منع البوتات
 * @body {boolean} [protectionData.delete_repeated_messages] - حذف الرسائل المكررة
 * @body {boolean} [protectionData.moderation_controls_enabled] - تفعيل ضوابط الإشراف
 * @body {string} [protectionData.max_punishment_type] - نوع العقوبة القصوى
 * @body {number} [protectionData.max_kick_ban_limit] - حد الطرد والحظر
 * @body {boolean} [protectionData.bad_words] - فلتر الكلمات السيئة
 * @body {boolean} [protectionData.links] - فلتر الروابط
 * @body {boolean} [protectionData.channels_content] - فلتر محتوى القنوات
 */
router.put(
  '/server/:serverId',
  validationMiddlewareFactory(protectionValidator.updateProtectionByServerIdSchema.params, 'params'),
  validationMiddlewareFactory(protectionValidator.updateProtectionByServerIdSchema.body, 'body'),
  protectionController.updateProtectionByServerId
);

/**
 * @route DELETE /api/v1/restful/protection/:id
 * @desc حذف إعدادات الحماية بواسطة المعرف
 * @access Private
 * @param {number} id - معرف إعدادات الحماية
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(protectionValidator.deleteProtectionSchema.params, 'params'),
  protectionController.deleteProtection
);

/**
 * @route DELETE /api/v1/restful/protection/server/:serverId
 * @desc حذف إعدادات الحماية بواسطة معرف الخادم
 * @access Private
 * @param {string} serverId - معرف الخادم
 */
router.delete(
  '/server/:serverId',
  validationMiddlewareFactory(protectionValidator.deleteProtectionByServerIdSchema.params, 'params'),
  protectionController.deleteProtectionByServerId
);

export default router;