import express from 'express';
import * as userSettingsController from '../controllers/userSettings.controller.js';
import {
  getUserSettingsByIdSchema,
  createUserSettingsSchema,
  updateUserSettingsSchema
} from '../validators/userSettings.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات إعدادات المستخدم
 * @module UserSettingsRoutes
 */

const router = express.Router();

/**
 * @route GET /userSettings
 * @desc الحصول على جميع إعدادات المستخدم
 * @access Public
 */
router.get('/', userSettingsController.getAllUserSettings);

/**
 * @route GET /userSettings/:id
 * @desc الحصول على إعدادات المستخدم بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getUserSettingsByIdSchema.params, 'params'), userSettingsController.getUserSettingsById);

/**
 * @route POST /userSettings
 * @desc إنشاء إعدادات مستخدم جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createUserSettingsSchema.body, 'body'), userSettingsController.createUserSettings);

/**
 * @route PUT /userSettings/:id
 * @desc تحديث إعدادات المستخدم
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateUserSettingsSchema.params, 'params'),
  validationMiddlewareFactory(updateUserSettingsSchema.body, 'body'), 
  userSettingsController.updateUserSettings
);

/**
 * @route DELETE /userSettings/:id
 * @desc حذف إعدادات المستخدم
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getUserSettingsByIdSchema.params, 'params'), userSettingsController.deleteUserSettings);

export default router;