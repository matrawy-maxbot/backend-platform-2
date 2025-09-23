import express from 'express';
import * as userActivityLogsController from '../controllers/userActivityLogs.controller.js';
import {
  getUserActivityLogByIdSchema,
  createUserActivityLogSchema,
  updateUserActivityLogSchema
} from '../validators/userActivityLogs.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات سجلات نشاط المستخدمين
 * @module UserActivityLogsRoutes
 */

const router = express.Router();

/**
 * @route GET /userActivityLogs
 * @desc الحصول على جميع سجلات نشاط المستخدمين
 * @access Public
 */
router.get('/', userActivityLogsController.getAllUserActivityLogs);

/**
 * @route GET /userActivityLogs/:id
 * @desc الحصول على سجل نشاط المستخدم بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getUserActivityLogByIdSchema.params, 'params'), userActivityLogsController.getUserActivityLogById);

/**
 * @route POST /userActivityLogs
 * @desc إنشاء سجل نشاط مستخدم جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createUserActivityLogSchema.body, 'body'), userActivityLogsController.createUserActivityLog);

/**
 * @route PUT /userActivityLogs/:id
 * @desc تحديث سجل نشاط المستخدم
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateUserActivityLogSchema.params, 'params'),
  validationMiddlewareFactory(updateUserActivityLogSchema.body, 'body'), 
  userActivityLogsController.updateUserActivityLog
);

/**
 * @route DELETE /userActivityLogs/:id
 * @desc حذف سجل نشاط المستخدم
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getUserActivityLogByIdSchema.params, 'params'), userActivityLogsController.deleteUserActivityLog);

export default router;