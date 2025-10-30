import { Router } from 'express';
import * as welcomeImageController from '../controllers/welcomeImage.controller.js';
import * as welcomeImageValidator from '../validators/welcomeImage.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة صور الترحيب - WelcomeImage Routes
 * يحتوي على جميع المسارات المتعلقة بإدارة قوالب صور الترحيب
 * Contains all routes related to welcome images templates management
 */

/**
 * مسارات إدارة صور الترحيب
 * @module WelcomeImageRoutes
 */

const router = Router();

/**
 * @route GET /api/v1/restful/welcome-images
 * @desc الحصول على جميع قوالب صور الترحيب
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get('/', welcomeImageController.getAllWelcomeImages);

/**
 * @route GET /api/v1/restful/welcome-images/:id
 * @desc الحصول على قالب صورة ترحيب بواسطة المعرف
 * @access Public
 * @param {string} id - معرف القالب
 */
router.get(
  '/:id',
  validationMiddlewareFactory(welcomeImageValidator.getWelcomeImageByIdSchema.params, 'params'),
  welcomeImageController.getWelcomeImageById
);

/**
 * @route GET /api/v1/restful/welcome-images/server/:serverId
 * @desc الحصول على قالب صورة ترحيب بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(welcomeImageValidator.getWelcomeImageByServerIdSchema.params, 'params'),
  welcomeImageController.getWelcomeImageByServerId
);

/**
 * @route POST /api/v1/restful/welcome-images
 * @desc إنشاء قالب صورة ترحيب جديد
 * @access Public
 * @body {string} server_id - معرف الخادم
 * @body {string} image_url - رابط الصورة
 */
router.post(
  '/',
  validationMiddlewareFactory(welcomeImageValidator.createWelcomeImageSchema.body, 'body'),
  welcomeImageController.createWelcomeImage
);

/**
 * @route PUT /api/v1/restful/welcome-images/:id
 * @desc تحديث قالب صورة الترحيب
 * @access Public
 * @param {string} id - معرف القالب
 * @body {string} [image_url] - رابط الصورة
 */
router.put(
  '/:id',
  validationMiddlewareFactory(welcomeImageValidator.getWelcomeImageByIdSchema.params, 'params'),
  validationMiddlewareFactory(welcomeImageValidator.updateWelcomeImageSchema.body, 'body'),
  welcomeImageController.updateWelcomeImage
);

/**
 * @route PUT /api/v1/restful/welcome-images/server/:serverId
 * @desc تحديث قالب صورة الترحيب بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 * @body {string} [image_url] - رابط الصورة
 */
router.put(
  '/server/:serverId',
  validationMiddlewareFactory(welcomeImageValidator.getWelcomeImageByServerIdSchema.params, 'params'),
  validationMiddlewareFactory(welcomeImageValidator.updateWelcomeImageSchema.body, 'body'),
  welcomeImageController.updateWelcomeImageByServerId
);

/**
 * @route DELETE /api/v1/restful/welcome-images/:id
 * @desc حذف قالب صورة الترحيب
 * @access Public
 * @param {string} id - معرف القالب
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(welcomeImageValidator.deleteWelcomeImageSchema.params, 'params'),
  welcomeImageController.deleteWelcomeImage
);

/**
 * @route DELETE /api/v1/restful/welcome-images/:id
 * @desc حذف قالب صورة الترحيب
 * @access Public
 * @param {string} id - معرف القالب
 */
router.delete(
  '/server/:serverId',
  validationMiddlewareFactory(welcomeImageValidator.deleteWelcomeImageByServerIdSchema.params, 'params'),
  welcomeImageController.deleteWelcomeImageByServerId
);

export default router;