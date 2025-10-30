import express from 'express';
import * as autoReplyController from '../controllers/autoReply.controller.js';
import * as autoReplyValidator from '../validators/autoReply.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة الردود التلقائية
 * @module AutoReplyRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/autoReply
 * @desc الحصول على جميع الردود التلقائية
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  autoReplyController.getAllAutoReplies
);

/**
 * @route GET /api/v1/restful/autoReply/:id
 * @desc الحصول على رد تلقائي بواسطة المعرف
 * @access Public
 * @param {string} id - معرف الرد التلقائي
 */
router.get(
  '/:id',
  validationMiddlewareFactory(autoReplyValidator.getAutoReplyByIdSchema.params, 'params'),
  autoReplyController.getAutoReplyById
);

/**
 * @route GET /api/v1/restful/autoReply/server/:serverId
 * @desc الحصول على الردود التلقائية بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(autoReplyValidator.getAutoRepliesByServerIdSchema.params, 'params'),
  autoReplyController.getAutoRepliesByServerId
);

/**
 * @route POST /api/v1/restful/autoReply
 * @desc إنشاء رد تلقائي جديد
 * @access Public
 * @body {Object} autoReplyData - بيانات الرد التلقائي الجديد
 * @body {string} autoReplyData.server_id - معرف الخادم
 * @body {string} autoReplyData.reply_name - اسم الرد التلقائي
 * @body {Array} autoReplyData.triggers - قائمة الكلمات المحفزة
 * @body {Array} autoReplyData.responses - قائمة الردود
 * @body {Array} [autoReplyData.channels] - قائمة القنوات المطبق عليها الرد
 */
router.post(
  '/',
  validationMiddlewareFactory(autoReplyValidator.createAutoReplySchema.body, 'body'),
  autoReplyController.createAutoReply
);

/**
 * @route PUT /api/v1/restful/autoReply/:id
 * @desc تحديث الرد التلقائي
 * @access Public
 * @param {string} id - معرف الرد التلقائي
 * @body {Object} updateData - البيانات المحدثة
 * @body {string} [updateData.reply_name] - اسم الرد التلقائي
 * @body {Array} [updateData.triggers] - قائمة الكلمات المحفزة
 * @body {Array} [updateData.responses] - قائمة الردود
 * @body {Array} [updateData.channels] - قائمة القنوات المطبق عليها الرد
 */
router.put(
  '/:id',
  validationMiddlewareFactory(autoReplyValidator.updateAutoReplySchema.params, 'params'),
  validationMiddlewareFactory(autoReplyValidator.updateAutoReplySchema.body, 'body'),
  autoReplyController.updateAutoReply
);

/**
 * @route DELETE /api/v1/restful/autoReply/:id
 * @desc حذف الرد التلقائي
 * @access Public
 * @param {string} id - معرف الرد التلقائي
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(autoReplyValidator.deleteAutoReplySchema.params, 'params'),
  autoReplyController.deleteAutoReply
);

export default router;