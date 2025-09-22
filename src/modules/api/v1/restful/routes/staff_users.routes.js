import express from 'express';
import * as staffUsersController from '../controllers/staff_users.controller.js';
import {
  getStaffUserByIdSchema,
  createStaffUserSchema,
  updateStaffUserSchema
} from '../validators/staff_users.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات موظفي المواقع
 * @module StaffUsersRoutes
 */

const router = express.Router();

/**
 * @route GET /staff-users
 * @desc الحصول على جميع موظفي المواقع
 * @access Public
 */
router.get('/', staffUsersController.getAllStaffUsers);

/**
 * @route GET /staff-users/:id
 * @desc الحصول على موظف موقع بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getStaffUserByIdSchema.params, 'params'), staffUsersController.getStaffUserById);

/**
 * @route POST /staff-users
 * @desc إنشاء موظف موقع جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createStaffUserSchema.body, 'body'), staffUsersController.createStaffUser);

/**
 * @route PUT /staff-users/:id
 * @desc تحديث موظف الموقع
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateStaffUserSchema.params, 'params'),
  validationMiddlewareFactory(updateStaffUserSchema.body, 'body'), 
  staffUsersController.updateStaffUser
);

/**
 * @route DELETE /staff-users/:id
 * @desc حذف موظف الموقع
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getStaffUserByIdSchema.params, 'params'), staffUsersController.deleteStaffUser);

export default router;