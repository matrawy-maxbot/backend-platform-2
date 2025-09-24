import express from 'express';
import * as vendorPrintSettingsController from '../controllers/vendorPrintSettings.controller.js';
import {
  getVendorPrintSettingsByIdSchema,
  createVendorPrintSettingsSchema,
  updateVendorPrintSettingsSchema
} from '../validators/vendorPrintSettings.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إعدادات الطباعة للبائعين
 * @module VendorPrintSettingsRoutes
 */

const router = express.Router();

/**
 * @route GET /vendor-print-settings
 * @desc الحصول على جميع إعدادات الطباعة
 * @access Public
 */
router.get('/', vendorPrintSettingsController.getAllVendorPrintSettings);

/**
 * @route GET /vendor-print-settings/:id
 * @desc الحصول على إعدادات الطباعة بمعرف البائع
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorPrintSettingsByIdSchema.params, 'params'), vendorPrintSettingsController.getVendorPrintSettingsById);

/**
 * @route POST /vendor-print-settings
 * @desc إنشاء إعدادات طباعة جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorPrintSettingsSchema.body, 'body'), vendorPrintSettingsController.createVendorPrintSettings);

/**
 * @route PUT /vendor-print-settings/:id
 * @desc تحديث إعدادات الطباعة
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorPrintSettingsSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorPrintSettingsSchema.body, 'body'), 
  vendorPrintSettingsController.updateVendorPrintSettings
);

/**
 * @route DELETE /vendor-print-settings/:id
 * @desc حذف إعدادات الطباعة
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorPrintSettingsByIdSchema.params, 'params'), vendorPrintSettingsController.deleteVendorPrintSettings);

export default router;