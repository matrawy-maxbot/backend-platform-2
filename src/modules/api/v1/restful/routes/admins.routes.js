import express from 'express';
import * as adminsController from '../controllers/admins.controller.js';
import * as adminsValidator from '../validators/admins.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة المشرفين
 * @module AdminsRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/admins
 * @desc الحصول على جميع المشرفين
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  adminsController.getAllAdmins
);

/**
 * @route GET /api/v1/restful/admins/:id
 * @desc الحصول على مشرف بواسطة المعرف
 * @access Public
 * @param {number} id - معرف المشرف
 */
router.get(
  '/:id',
  validationMiddlewareFactory(adminsValidator.getAdminByIdSchema.params, 'params'),
  adminsController.getAdminById
);

/**
 * @route GET /api/v1/restful/admins/server/:serverId
 * @desc الحصول على المشرفين بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(adminsValidator.getAdminsByServerIdSchema.params, 'params'),
  adminsController.getAdminsByServerId
);

/**
 * @route POST /api/v1/restful/admins
 * @desc إنشاء مشرف جديد
 * @access Public
 * @body {Object} adminData - بيانات المشرف الجديد
 * @body {string} adminData.server_id - معرف الخادم
 * @body {string} adminData.admin_id - معرف المشرف في Discord
 */
router.post(
  '/',
  validationMiddlewareFactory(adminsValidator.createAdminSchema.body, 'body'),
  adminsController.createAdmin
);

// /**
//  * @route PUT /api/v1/restful/admins/:id
//  * @desc تحديث المشرف
//  * @access Public
//  * @param {number} id - معرف المشرف
//  * @body {Object} updateData - البيانات المحدثة
//  * @note لا يمكن تحديث server_id أو admin_id
//  */
// router.put(
//   '/:id',
//   validationMiddlewareFactory(adminsValidator.updateAdminSchema.params, 'params'),
//   validationMiddlewareFactory(adminsValidator.updateAdminSchema.body, 'body'),
//   adminsController.updateAdmin
// );

/**
 * @route DELETE /api/v1/restful/admins/:id
 * @desc حذف المشرف
 * @access Public
 * @param {number} id - معرف المشرف
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(adminsValidator.deleteAdminSchema.params, 'params'),
  adminsController.deleteAdmin
);

export default router;