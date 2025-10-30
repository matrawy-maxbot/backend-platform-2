import express from 'express';
import * as dashboardLogController from '../controllers/dashboardLog.controller.js';
import * as dashboardLogValidator from '../validators/dashboardLog.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة سجلات لوحة التحكم
 * @module DashboardLogRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/dashboard-logs
 * @desc الحصول على جميع سجلات لوحة التحكم
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  dashboardLogController.getAllDashboardLogs
);

/**
 * @route GET /api/v1/restful/dashboard-logs/:id
 * @desc الحصول على سجل لوحة التحكم بواسطة المعرف
 * @access Public
 * @param {string} id - معرف سجل لوحة التحكم (MongoDB ObjectId)
 */
router.get(
  '/:id',
  validationMiddlewareFactory(dashboardLogValidator.getDashboardLogByIdSchema.params, 'params'),
  dashboardLogController.getDashboardLogById
);

/**
 * @route GET /api/v1/restful/dashboard-logs/server/:serverId
 * @desc الحصول على سجلات لوحة التحكم بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(dashboardLogValidator.getDashboardLogsByServerIdSchema.params, 'params'),
  dashboardLogController.getDashboardLogsByServerId
);

/**
 * @route GET /api/v1/restful/dashboard-logs/user/:userId/server/:serverId
 * @desc الحصول على سجلات لوحة التحكم بواسطة معرف المستخدم ومعرف الخادم
 * @access Public
 * @param {string} userId - معرف المستخدم
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/user/:userId/server/:serverId',
  validationMiddlewareFactory(dashboardLogValidator.getDashboardLogsByUserIdSchema.params, 'params'),
  dashboardLogController.getDashboardLogsByUserId
);

/**
 * @route GET /api/v1/restful/dashboard-logs/feature/:feature/server/:serverId
 * @desc الحصول على سجلات لوحة التحكم بواسطة الميزة ومعرف الخادم
 * @access Public
 * @param {string} feature - اسم الميزة
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/feature/:feature/server/:serverId',
  validationMiddlewareFactory(dashboardLogValidator.getDashboardLogsByFeatureSchema.params, 'params'),
  dashboardLogController.getDashboardLogsByFeature
);

/**
 * @route GET /api/v1/restful/dashboard-logs/action/:action/server/:serverId
 * @desc الحصول على سجلات لوحة التحكم بواسطة الإجراء ومعرف الخادم
 * @access Public
 * @param {string} action - نوع الإجراء (create/update/delete/enable/disable/activate/deactivate/configure/reset)
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/action/:action/server/:serverId',
  validationMiddlewareFactory(dashboardLogValidator.getDashboardLogsByActionSchema.params, 'params'),
  dashboardLogController.getDashboardLogsByAction
);

/**
 * @route POST /api/v1/restful/dashboard-logs
 * @desc إنشاء سجل لوحة تحكم جديد
 * @access Public
 * @body {Object} dashboardLogData - بيانات سجل لوحة التحكم الجديد
 * @body {string} dashboardLogData.title - عنوان السجل
 * @body {string} dashboardLogData.description - وصف السجل
 * @body {string} dashboardLogData.feature - اسم الميزة
 * @body {string} dashboardLogData.action - نوع الإجراء
 * @body {string} dashboardLogData.server_id - معرف الخادم
 * @body {string} [dashboardLogData.user_id] - معرف المستخدم (اختياري)
 * @body {Date} [dashboardLogData.date] - تاريخ السجل (اختياري)
 * @body {Object} [dashboardLogData.additional_data] - بيانات إضافية (اختياري)
 */
router.post(
  '/',
  validationMiddlewareFactory(dashboardLogValidator.createDashboardLogSchema.body, 'body'),
  dashboardLogController.createDashboardLog
);

/**
 * @route DELETE /api/v1/restful/dashboard-logs/:id
 * @desc حذف سجل لوحة التحكم
 * @access Public
 * @param {string} id - معرف سجل لوحة التحكم (MongoDB ObjectId)
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(dashboardLogValidator.deleteDashboardLogSchema.params, 'params'),
  dashboardLogController.deleteDashboardLog
);

/**
 * @route DELETE /api/v1/restful/dashboard-logs/server/:serverId
 * @desc حذف جميع سجلات لوحة التحكم للخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.delete(
  '/server/:serverId',
  validationMiddlewareFactory(dashboardLogValidator.deleteDashboardLogByServerIdSchema.params, 'params'),
  dashboardLogController.deleteDashboardLogByServerId
);

export default router;