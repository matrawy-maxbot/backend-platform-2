import express from 'express';
import * as notificationsController from '../controllers/notifications.controller.js';
import {
  getNotificationByIdSchema,
  createNotificationSchema,
  updateNotificationSchema
} from '../validators/notifications.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات الإشعارات
 * @module NotificationsRoutes
 */

const router = express.Router();

/**
 * @route GET /notifications
 * @desc الحصول على جميع الإشعارات
 * @access Public
 */
router.get('/', notificationsController.getAllNotifications);

/**
 * @route GET /notifications/:id
 * @desc الحصول على إشعار بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getNotificationByIdSchema.params, 'params'), notificationsController.getNotificationById);

/**
 * @route POST /notifications
 * @desc إنشاء إشعار جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createNotificationSchema.body, 'body'), notificationsController.createNotification);

/**
 * @route PUT /notifications/:id
 * @desc تحديث الإشعار
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateNotificationSchema.params, 'params'),
  validationMiddlewareFactory(updateNotificationSchema.body, 'body'), 
  notificationsController.updateNotification
);

/**
 * @route DELETE /notifications/:id
 * @desc حذف الإشعار
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getNotificationByIdSchema.params, 'params'), notificationsController.deleteNotification);

export default router;