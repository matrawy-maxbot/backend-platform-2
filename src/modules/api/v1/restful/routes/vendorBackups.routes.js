import express from 'express';
import * as vendorBackupsController from '../controllers/vendorBackups.controller.js';
import {
  getVendorBackupByIdSchema,
  createVendorBackupSchema,
  updateVendorBackupSchema,
  getVendorBackupsSchema
} from '../validators/vendorBackups.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات النسخ الاحتياطية للبائعين
 * @module VendorBackupsRoutes
 */

const router = express.Router();

/**
 * @route GET /vendor-backups/:vendor_id
 * @desc الحصول على جميع النسخ الاحتياطية لبائع
 * @access Public
 */
router.get('/:vendor_id', validationMiddlewareFactory(getVendorBackupsSchema.params, 'params'), vendorBackupsController.getAllVendorBackups);

/**
 * @route GET /vendor-backups/backup/:id
 * @desc الحصول على نسخة احتياطية بالمعرف
 * @access Public
 */
router.get('/backup/:id', validationMiddlewareFactory(getVendorBackupByIdSchema.params, 'params'), vendorBackupsController.getVendorBackupById);

/**
 * @route POST /vendor-backups
 * @desc إنشاء نسخة احتياطية جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorBackupSchema.body, 'body'), vendorBackupsController.createVendorBackup);

/**
 * @route PUT /vendor-backups/:id
 * @desc تحديث النسخة الاحتياطية
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorBackupSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorBackupSchema.body, 'body'), 
  vendorBackupsController.updateVendorBackup
);

/**
 * @route DELETE /vendor-backups/:id
 * @desc حذف النسخة الاحتياطية
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorBackupByIdSchema.params, 'params'), vendorBackupsController.deleteVendorBackup);

export default router;