import express from 'express';
import * as permissionsController from '../controllers/permissions.controller.js';
import {
  getPermissionByIdSchema,
  createPermissionSchema,
  updatePermissionSchema
} from '../validators/permissions.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات الصلاحيات
 * @module PermissionsRoutes
 */

const router = express.Router();

/**
 * @route GET /permissions
 * @desc الحصول على جميع الصلاحيات
 * @access Public
 */
router.get('/', permissionsController.getAllPermissions);

/**
 * @route GET /permissions/:id
 * @desc الحصول على صلاحية بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getPermissionByIdSchema.params, 'params'), permissionsController.getPermissionById);

/**
 * @route POST /permissions
 * @desc إنشاء صلاحية جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createPermissionSchema.body, 'body'), permissionsController.createPermission);

/**
 * @route PUT /permissions/:id
 * @desc تحديث الصلاحية
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updatePermissionSchema.params, 'params'),
  validationMiddlewareFactory(updatePermissionSchema.body, 'body'), 
  permissionsController.updatePermission
);

/**
 * @route DELETE /permissions/:id
 * @desc حذف الصلاحية
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getPermissionByIdSchema.params, 'params'), permissionsController.deletePermission);

export default router;