import express from 'express';
import * as vendorBackupSettingsController from '../controllers/vendorBackupSettings.controller.js';
import {
  getVendorBackupSettingsByIdSchema,
  createVendorBackupSettingsSchema,
  updateVendorBackupSettingsSchema
} from '../validators/vendorBackupSettings.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إعدادات النسخ الاحتياطية للبائعين
 * @module VendorBackupSettingsRoutes
 */

const router = express.Router();

/**
 * @route GET /vendorBackupSettings
 * @desc الحصول على جميع إعدادات النسخ الاحتياطية للبائعين
 * @access Public
 */
router.get('/', vendorBackupSettingsController.getAllVendorBackupSettings);

/**
 * @route GET /vendorBackupSettings/:id
 * @desc الحصول على إعدادات النسخ الاحتياطية للبائع بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorBackupSettingsByIdSchema.params, 'params'), vendorBackupSettingsController.getVendorBackupSettingsById);

/**
 * @route POST /vendorBackupSettings
 * @desc إنشاء إعدادات نسخ احتياطية جديدة للبائع
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorBackupSettingsSchema.body, 'body'), vendorBackupSettingsController.createVendorBackupSettings);

/**
 * @route PUT /vendorBackupSettings/:id
 * @desc تحديث إعدادات النسخ الاحتياطية للبائع
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorBackupSettingsSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorBackupSettingsSchema.body, 'body'), 
  vendorBackupSettingsController.updateVendorBackupSettings
);

/**
 * @route DELETE /vendorBackupSettings/:id
 * @desc حذف إعدادات النسخ الاحتياطية للبائع
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorBackupSettingsByIdSchema.params, 'params'), vendorBackupSettingsController.deleteVendorBackupSettings);

export default router;