import express from 'express';
import * as rolesController from '../controllers/roles.controller.js';
import {
  getRoleByIdSchema,
  createRoleSchema,
  updateRoleSchema
} from '../validators/roles.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات الأدوار
 * @module RolesRoutes
 */

const router = express.Router();

/**
 * @route GET /roles
 * @desc الحصول على جميع الأدوار
 * @access Public
 */
router.get('/', rolesController.getAllRoles);

/**
 * @route GET /roles/:id
 * @desc الحصول على دور بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getRoleByIdSchema.params, 'params'), rolesController.getRoleById);

/**
 * @route POST /roles
 * @desc إنشاء دور جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createRoleSchema.body, 'body'), rolesController.createRole);

/**
 * @route PUT /roles/:id
 * @desc تحديث الدور
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateRoleSchema.params, 'params'),
  validationMiddlewareFactory(updateRoleSchema.body, 'body'), 
  rolesController.updateRole
);

/**
 * @route DELETE /roles/:id
 * @desc حذف الدور
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getRoleByIdSchema.params, 'params'), rolesController.deleteRole);

export default router;