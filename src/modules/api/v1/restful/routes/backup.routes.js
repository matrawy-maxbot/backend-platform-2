import express from 'express';
import * as backupController from '../controllers/backup.controller.js';
import * as backupValidator from '../validators/backup.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إدارة النسخ الاحتياطية
 * @module BackupRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/restful/backup
 * @desc الحصول على جميع النسخ الاحتياطية
 * @access Public
 * @query {number} [limit] - عدد النتائج المطلوبة
 * @query {number} [offset] - عدد النتائج المتجاوزة
 * @query {string} [order] - ترتيب النتائج
 */
router.get(
  '/',
  backupController.getAllBackups
);

/**
 * @route GET /api/v1/restful/backup/:id
 * @desc الحصول على نسخة احتياطية بواسطة المعرف
 * @access Public
 * @param {string} id - معرف النسخة الاحتياطية (MongoDB ObjectId)
 */
router.get(
  '/:id',
  validationMiddlewareFactory(backupValidator.getBackupByIdSchema.params, 'params'),
  backupController.getBackupById
);

/**
 * @route GET /api/v1/restful/backup/server/:serverId
 * @desc الحصول على النسخ الاحتياطية بواسطة معرف الخادم
 * @access Public
 * @param {string} serverId - معرف الخادم
 */
router.get(
  '/server/:serverId',
  validationMiddlewareFactory(backupValidator.getBackupsByServerIdSchema.params, 'params'),
  backupController.getBackupsByServerId
);

/**
 * @route POST /api/v1/restful/backup
 * @desc إنشاء نسخة احتياطية جديدة
 * @access Public
 * @body {Object} backupData - بيانات النسخة الاحتياطية الجديدة
 * @body {string} backupData.server_id - معرف الخادم
 * @body {Object} [backupData.server_settings] - إعدادات الخادم
 * @body {Array} [backupData.channels] - قائمة القنوات
 * @body {Array} [backupData.roles] - قائمة الأدوار
 * @body {string} [backupData.created_by] - معرف المنشئ
 */
router.post(
  '/',
  validationMiddlewareFactory(backupValidator.createBackupSchema.body, 'body'),
  backupController.createBackup
);

/**
 * @route DELETE /api/v1/restful/backup/:id
 * @desc حذف النسخة الاحتياطية
 * @access Public
 * @param {string} id - معرف النسخة الاحتياطية (MongoDB ObjectId)
 * @body {Object} deleteData - بيانات الحذف
 * @body {string} deleteData.serverId - معرف الخادم
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(backupValidator.deleteBackupSchema.params, 'params'),
  validationMiddlewareFactory(backupValidator.deleteBackupSchema.body, 'body'),
  backupController.deleteBackup
);

export default router;