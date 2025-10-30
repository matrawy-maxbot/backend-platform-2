import express from 'express';
import * as badWordsController from '../controllers/badwords.controller.js';
import * as badWordsValidator from '../validators/badwords.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة الكلمات السيئة
 * @module BadWordsRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/badwords
 * @desc الحصول على جميع إعدادات الكلمات السيئة
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  badWordsController.getAllBadWords
);

/**
 * @route GET /api/v1/restful/badwords/:id
 * @desc الحصول على إعدادات الكلمات السيئة بواسطة المعرف
 * @access Public
 * @param {number} id - معرف إعدادات الكلمات السيئة
 */
router.get(
  '/:id',
  validationMiddlewareFactory(badWordsValidator.getBadWordsByIdSchema.params, 'params'),
  badWordsController.getBadWordsById
);

/**
 * @route GET /api/v1/restful/badwords/server/:serverId
 * @desc الحصول على إعدادات الكلمات السيئة بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(badWordsValidator.getBadWordsByServerIdSchema.params, 'params'),
  badWordsController.getBadWordsByServerId
);

/**
 * @route POST /api/v1/restful/badwords
 * @desc إنشاء إعدادات كلمات سيئة جديدة
 * @access Public
 * @body {Object} badWordsData - بيانات إعدادات الكلمات السيئة الجديدة
 * @body {string} badWordsData.server_id - معرف الخادم
 * @body {Array} [badWordsData.words] - قائمة الكلمات المحظورة
 * @body {string} [badWordsData.punishment_type] - نوع العقوبة (warn/none/mute/kick/ban)
 */
router.post(
  '/',
  validationMiddlewareFactory(badWordsValidator.createBadWordsSchema.body, 'body'),
  badWordsController.createBadWords
);

/**
 * @route PUT /api/v1/restful/badwords/:id
 * @desc تحديث إعدادات الكلمات السيئة
 * @access Public
 * @param {number} id - معرف إعدادات الكلمات السيئة
 * @body {Object} updateData - البيانات المحدثة
 * @body {Array} [updateData.words] - قائمة الكلمات المحظورة
 * @body {string} [updateData.punishment_type] - نوع العقوبة (warn/none/mute/kick/ban)
 */
router.put(
  '/:id',
  validationMiddlewareFactory(badWordsValidator.updateBadWordsSchema.params, 'params'),
  validationMiddlewareFactory(badWordsValidator.updateBadWordsSchema.body, 'body'),
  badWordsController.updateBadWords
);

/**
 * @route PUT /api/v1/restful/badwords/server/:serverId
 * @desc تحديث إعدادات الكلمات السيئة بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 * @body {Object} updateData - البيانات المحدثة
 * @body {Array} [updateData.words] - قائمة الكلمات المحظورة
 * @body {string} [updateData.punishment_type] - نوع العقوبة (warn/none/mute/kick/ban)
 */
router.put(
  '/server/:serverId',
  validationMiddlewareFactory(badWordsValidator.updateBadWordsByServerIdSchema.params, 'params'),
  validationMiddlewareFactory(badWordsValidator.updateBadWordsByServerIdSchema.body, 'body'),
  badWordsController.updateBadWordsByServerId
);

/**
 * @route DELETE /api/v1/restful/badwords/:id
 * @desc حذف إعدادات الكلمات السيئة
 * @access Public
 * @param {number} id - معرف إعدادات الكلمات السيئة
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(badWordsValidator.deleteBadWordsSchema.params, 'params'),
  badWordsController.deleteBadWords
);

/**
 * @route DELETE /api/v1/restful/badwords/server/:serverId
 * @desc حذف إعدادات الكلمات السيئة بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.delete(
  '/server/:serverId',
  validationMiddlewareFactory(badWordsValidator.deleteBadWordsByServerIdSchema.params, 'params'),
  badWordsController.deleteBadWordsByServerId
);

export default router;