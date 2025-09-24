import express from 'express';
import * as userActivityController from '../controllers/userActivity.controller.js';
import {
  getUserActivityByIdSchema,
  createUserActivitySchema,
  updateUserActivitySchema
} from '../validators/userActivity.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات أنشطة المستخدمين
 * @module UserActivityRoutes
 */

const router = express.Router();

/**
 * @route GET /user-activities
 * @desc الحصول على جميع أنشطة المستخدمين
 * @access Public
 */
router.get('/', userActivityController.getAllUserActivities);

/**
 * @route GET /user-activities/:id
 * @desc الحصول على نشاط مستخدم بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getUserActivityByIdSchema.params, 'params'), userActivityController.getUserActivityById);

/**
 * @route POST /user-activities
 * @desc إنشاء نشاط مستخدم جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createUserActivitySchema.body, 'body'), userActivityController.createUserActivity);

/**
 * @route PUT /user-activities/:id
 * @desc تحديث نشاط المستخدم
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateUserActivitySchema.params, 'params'),
  validationMiddlewareFactory(updateUserActivitySchema.body, 'body'), 
  userActivityController.updateUserActivity
);

/**
 * @route DELETE /user-activities/:id
 * @desc حذف نشاط المستخدم
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getUserActivityByIdSchema.params, 'params'), userActivityController.deleteUserActivity);

export default router;