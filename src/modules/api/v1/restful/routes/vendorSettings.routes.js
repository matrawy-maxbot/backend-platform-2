import express from 'express';
import * as vendorSettingsController from '../controllers/vendorSettings.controller.js';
import {
  getVendorSettingsByIdSchema,
  createVendorSettingsSchema,
  updateVendorSettingsSchema
} from '../validators/vendorSettings.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إعدادات البائعين
 * @module VendorSettingsRoutes
 */

const router = express.Router();

/**
 * @route GET /vendor-settings
 * @desc الحصول على جميع إعدادات البائعين
 * @access Public
 */
router.get('/', vendorSettingsController.getAllVendorSettings);

/**
 * @route GET /vendor-settings/:id
 * @desc الحصول على إعدادات بائع بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorSettingsByIdSchema.params, 'params'), vendorSettingsController.getVendorSettingsById);

/**
 * @route POST /vendor-settings
 * @desc إنشاء إعدادات بائع جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorSettingsSchema.body, 'body'), vendorSettingsController.createVendorSettings);

/**
 * @route PUT /vendor-settings/:id
 * @desc تحديث إعدادات البائع
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorSettingsSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorSettingsSchema.body, 'body'), 
  vendorSettingsController.updateVendorSettings
);

/**
 * @route DELETE /vendor-settings/:id
 * @desc حذف إعدادات البائع
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorSettingsByIdSchema.params, 'params'), vendorSettingsController.deleteVendorSettings);

export default router;