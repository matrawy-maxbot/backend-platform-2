import express from 'express';
import * as usersController from '../controllers/users.controller.js';
import {
  createUserSchema,
  updateUserSchema,
  getUserByIdSchema,
} from '../validators/users.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = express.Router();

/**
 * مسارات إدارة المستخدمين
 * @module UsersRoutes
 */

/**
 * الحصول على جميع المستخدمين
 * GET /api/v1/restful/users
 */
router.get(
  '/',
  usersController.getAllUsers
);

/**
 * الحصول على مستخدم بواسطة المعرف
 * GET /api/v1/restful/users/:id
 */
router.get(
  '/:id',
  validationMiddlewareFactory(getUserByIdSchema.params, 'params'),
  usersController.getUserById
);

/**
 * إنشاء مستخدم جديد
 * POST /api/v1/restful/users
 */
router.post(
  '/',
  validationMiddlewareFactory(createUserSchema.body, 'body'),
  usersController.createUser
);

/**
 * تحديث مستخدم موجود
 * PUT /api/v1/restful/users/:id
 */
router.put(
  '/:id',
  validationMiddlewareFactory(updateUserSchema.params, 'params'),
  validationMiddlewareFactory(updateUserSchema.body, 'body'),
  usersController.updateUser
);

/**
 * حذف مستخدم
 * DELETE /api/v1/restful/users/:id
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(getUserByIdSchema.params, 'params'),
  usersController.deleteUser
);

export default router;