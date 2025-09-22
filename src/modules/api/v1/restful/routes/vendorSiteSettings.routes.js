import express from 'express';
import * as vendorSiteSettingsController from '../controllers/vendorSiteSettings.controller.js';
import {
  getVendorSiteSettingByIdSchema,
  createVendorSiteSettingSchema,
  updateVendorSiteSettingSchema
} from '../validators/vendorSiteSettings.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إعدادات مواقع المتاجر
 * @module VendorSiteSettingsRoutes
 */

const router = express.Router();

/**
 * @route GET /vendor-site-settings
 * @desc الحصول على جميع إعدادات مواقع المتاجر
 * @access Public
 */
router.get('/', vendorSiteSettingsController.getAllVendorSiteSettings);

/**
 * @route GET /vendor-site-settings/:id
 * @desc الحصول على إعدادات موقع متجر بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorSiteSettingByIdSchema.params, 'params'), vendorSiteSettingsController.getVendorSiteSettingById);

/**
 * @route POST /vendor-site-settings
 * @desc إنشاء إعدادات موقع متجر جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorSiteSettingSchema.body, 'body'), vendorSiteSettingsController.createVendorSiteSetting);

/**
 * @route PUT /vendor-site-settings/:id
 * @desc تحديث إعدادات موقع المتجر
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorSiteSettingSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorSiteSettingSchema.body, 'body'), 
  vendorSiteSettingsController.updateVendorSiteSetting
);

/**
 * @route DELETE /vendor-site-settings/:id
 * @desc حذف إعدادات موقع المتجر
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorSiteSettingByIdSchema.params, 'params'), vendorSiteSettingsController.deleteVendorSiteSetting);

export default router;