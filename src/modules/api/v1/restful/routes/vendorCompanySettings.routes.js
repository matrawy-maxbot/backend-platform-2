import express from 'express';
import * as vendorCompanySettingsController from '../controllers/vendorCompanySettings.controller.js';
import {
  getVendorCompanySettingsByIdSchema,
  createVendorCompanySettingsSchema,
  updateVendorCompanySettingsSchema
} from '../validators/vendorCompanySettings.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إعدادات شركات البائعين
 * @module VendorCompanySettingsRoutes
 */

const router = express.Router();

/**
 * @route GET /vendor-company-settings
 * @desc الحصول على جميع إعدادات الشركات
 * @access Public
 */
router.get('/', vendorCompanySettingsController.getAllVendorCompanySettings);

/**
 * @route GET /vendor-company-settings/:id
 * @desc الحصول على إعدادات شركة بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorCompanySettingsByIdSchema.params, 'params'), vendorCompanySettingsController.getVendorCompanySettingsById);

/**
 * @route POST /vendor-company-settings
 * @desc إنشاء إعدادات شركة جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorCompanySettingsSchema.body, 'body'), vendorCompanySettingsController.createVendorCompanySettings);

/**
 * @route PUT /vendor-company-settings/:id
 * @desc تحديث إعدادات الشركة
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorCompanySettingsSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorCompanySettingsSchema.body, 'body'), 
  vendorCompanySettingsController.updateVendorCompanySettings
);

/**
 * @route DELETE /vendor-company-settings/:id
 * @desc حذف إعدادات الشركة
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorCompanySettingsByIdSchema.params, 'params'), vendorCompanySettingsController.deleteVendorCompanySettings);

export default router;