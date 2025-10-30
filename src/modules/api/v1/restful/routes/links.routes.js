import express from 'express';
import * as linksController from '../controllers/links.controller.js';
import * as linksValidator from '../validators/links.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة الروابط
 * @module LinksRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/links
 * @desc الحصول على جميع قواعد الروابط
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  linksController.getAllLinks
);

/**
 * @route GET /api/v1/restful/links/:id
 * @desc الحصول على قاعدة رابط بواسطة المعرف
 * @access Public
 * @param {number} id - معرف قاعدة الرابط
 */
router.get(
  '/:id',
  validationMiddlewareFactory(linksValidator.getLinkByIdSchema.params, 'params'),
  linksController.getLinkById
);

/**
 * @route GET /api/v1/restful/links/server/:serverId
 * @desc الحصول على قواعد الروابط بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(linksValidator.getLinksByServerIdSchema.params, 'params'),
  linksController.getLinksByServerId
);

/**
 * @route POST /api/v1/restful/links
 * @desc إنشاء قاعدة رابط جديدة
 * @access Public
 * @body {Object} linkData - بيانات قاعدة الرابط الجديدة
 * @body {string} linkData.server_id - معرف الخادم
 * @body {string} linkData.link_or_keyword - الرابط أو الكلمة المفتاحية
 * @body {string} linkData.action_type - نوع الإجراء (allow/block)
 * @body {Array} [linkData.channels] - قائمة القنوات المطبق عليها القاعدة
 */
router.post(
  '/',
  validationMiddlewareFactory(linksValidator.createLinkSchema.body, 'body'),
  linksController.createLink
);

/**
 * @route PUT /api/v1/restful/links/:id
 * @desc تحديث قاعدة الرابط
 * @access Public
 * @param {number} id - معرف قاعدة الرابط
 * @body {Object} updateData - البيانات المحدثة
 * @body {string} [updateData.link_or_keyword] - الرابط أو الكلمة المفتاحية
 * @body {string} [updateData.action_type] - نوع الإجراء (allow/block)
 * @body {Array} [updateData.channels] - قائمة القنوات المطبق عليها القاعدة
 */
router.put(
  '/:id',
  validationMiddlewareFactory(linksValidator.updateLinkSchema.params, 'params'),
  validationMiddlewareFactory(linksValidator.updateLinkSchema.body, 'body'),
  linksController.updateLink
);

/**
 * @route DELETE /api/v1/restful/links/:id
 * @desc حذف قاعدة الرابط
 * @access Public
 * @param {number} id - معرف قاعدة الرابط
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(linksValidator.deleteLinkSchema.params, 'params'),
  linksController.deleteLink
);

export default router;