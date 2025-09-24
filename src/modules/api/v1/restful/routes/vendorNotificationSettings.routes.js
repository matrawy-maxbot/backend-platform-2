import express from 'express';
import * as vendorNotificationSettingsController from '../controllers/vendorNotificationSettings.controller.js';
import {
  getVendorNotificationSettingsByIdSchema,
  createVendorNotificationSettingsSchema,
  updateVendorNotificationSettingsSchema
} from '../validators/vendorNotificationSettings.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إعدادات إشعارات البائع
 * @module VendorNotificationSettingsRoutes
 */

const router = express.Router();

/**
 * @route GET /vendorNotificationSettings
 * @desc الحصول على جميع إعدادات إشعارات البائع
 * @access Public
 */
router.get('/', vendorNotificationSettingsController.getAllVendorNotificationSettings);

/**
 * @route GET /vendorNotificationSettings/:id
 * @desc الحصول على إعدادات إشعارات البائع بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorNotificationSettingsByIdSchema.params, 'params'), vendorNotificationSettingsController.getVendorNotificationSettingsById);

/**
 * @route POST /vendorNotificationSettings
 * @desc إنشاء إعدادات إشعارات بائع جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorNotificationSettingsSchema.body, 'body'), vendorNotificationSettingsController.createVendorNotificationSettings);

/**
 * @route PUT /vendorNotificationSettings/:id
 * @desc تحديث إعدادات إشعارات البائع
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorNotificationSettingsSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorNotificationSettingsSchema.body, 'body'), 
  vendorNotificationSettingsController.updateVendorNotificationSettings
);

/**
 * @route DELETE /vendorNotificationSettings/:id
 * @desc حذف إعدادات إشعارات البائع
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorNotificationSettingsByIdSchema.params, 'params'), vendorNotificationSettingsController.deleteVendorNotificationSettings);

export default router;