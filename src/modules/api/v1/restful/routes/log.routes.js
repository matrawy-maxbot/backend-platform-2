import express from 'express';
import * as logController from '../controllers/log.controller.js';
import * as logValidator from '../validators/log.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة السجلات
 * @module LogRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/log
 * @desc الحصول على جميع السجلات
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  logController.getAllLogs
);

/**
 * @route GET /api/v1/restful/log/:id
 * @desc الحصول على سجل بواسطة المعرف
 * @access Public
 * @param {string} id - معرف السجل (MongoDB ObjectId)
 */
router.get(
  '/:id',
  validationMiddlewareFactory(logValidator.getLogByIdSchema.params, 'params'),
  logController.getLogById
);

/**
 * @route GET /api/v1/restful/log/server/:serverId
 * @desc الحصول على السجلات بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(logValidator.getLogsByServerIdSchema.params, 'params'),
  logController.getLogsByServerId
);

/**
 * @route POST /api/v1/restful/log
 * @desc إنشاء سجل جديد
 * @access Private
 * @body {Object} logData - بيانات السجل الجديد
 * @body {string} logData.server_id - معرف الخادم (مطلوب)
 * @body {string} [logData.member_join_leave] - قناة سجلات انضمام ومغادرة الأعضاء
 * @body {string} [logData.role_changes] - قناة سجلات تغييرات الأدوار
 * @body {string} [logData.kick_ban] - قناة سجلات الطرد والحظر
 * @body {string} [logData.channel_changes] - قناة سجلات تغييرات القنوات
 * @body {string} [logData.member_updates] - قناة سجلات تحديثات الأعضاء
 * @body {string} [logData.message_changes] - قناة سجلات تغييرات الرسائل
 * @body {string} [logData.server_settings] - قناة سجلات إعدادات الخادم
 */
router.post(
  '/',
  validationMiddlewareFactory(logValidator.createLogSchema.body, 'body'),
  logController.createLog
);

/**
 * @route PUT /api/v1/restful/log/:id
 * @desc تحديث السجل بواسطة المعرف
 * @access Private
 * @param {string} id - معرف السجل (MongoDB ObjectId)
 * @body {Object} logData - بيانات السجل المحدثة
 * @body {string} [logData.member_join_leave] - قناة سجلات انضمام ومغادرة الأعضاء
 * @body {string} [logData.role_changes] - قناة سجلات تغييرات الأدوار
 * @body {string} [logData.kick_ban] - قناة سجلات الطرد والحظر
 * @body {string} [logData.channel_changes] - قناة سجلات تغييرات القنوات
 * @body {string} [logData.member_updates] - قناة سجلات تحديثات الأعضاء
 * @body {string} [logData.message_changes] - قناة سجلات تغييرات الرسائل
 * @body {string} [logData.server_settings] - قناة سجلات إعدادات الخادم
 */
router.put(
  '/:id',
  validationMiddlewareFactory(logValidator.updateLogSchema.params, 'params'),
  validationMiddlewareFactory(logValidator.updateLogSchema.body, 'body'),
  logController.updateLog
);

/**
 * @route PUT /api/v1/restful/log/server/:serverId
 * @desc تحديث السجل بواسطة معرف الخادم
 * @access Private
 * @param {string} serverId - معرف الخادم
 * @body {Object} logData - بيانات السجل المحدثة
 * @body {string} [logData.member_join_leave] - قناة سجلات انضمام ومغادرة الأعضاء
 * @body {string} [logData.role_changes] - قناة سجلات تغييرات الأدوار
 * @body {string} [logData.kick_ban] - قناة سجلات الطرد والحظر
 * @body {string} [logData.channel_changes] - قناة سجلات تغييرات القنوات
 * @body {string} [logData.member_updates] - قناة سجلات تحديثات الأعضاء
 * @body {string} [logData.message_changes] - قناة سجلات تغييرات الرسائل
 * @body {string} [logData.server_settings] - قناة سجلات إعدادات الخادم
 */
router.put(
  '/server/:serverId',
  validationMiddlewareFactory(logValidator.updateLogByServerIdSchema.params, 'params'),
  validationMiddlewareFactory(logValidator.updateLogByServerIdSchema.body, 'body'),
  logController.updateLogByServerId
);

/**
 * @route DELETE /api/v1/restful/log/:id
 * @desc حذف السجل بواسطة المعرف
 * @access Private
 * @param {string} id - معرف السجل (MongoDB ObjectId)
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(logValidator.deleteLogSchema.params, 'params'),
  logController.deleteLog
);

/**
 * @route DELETE /api/v1/restful/log/server/:serverId
 * @desc حذف السجل بواسطة معرف الخادم
 * @access Private
 * @param {string} serverId - معرف الخادم
 */
router.delete(
  '/server/:serverId',
  validationMiddlewareFactory(logValidator.deleteLogByServerIdSchema.params, 'params'),
  logController.deleteLogByServerId
);

export default router;