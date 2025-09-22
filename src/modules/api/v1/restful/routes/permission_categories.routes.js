import express from 'express';
import * as permissionCategoriesController from '../controllers/permission_categories.controller.js';
import {
  getPermissionCategoryByIdSchema,
  createPermissionCategorySchema,
  updatePermissionCategorySchema
} from '../validators/permission_categories.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات فئات الصلاحيات
 * @module PermissionCategoriesRoutes
 */

const router = express.Router();

/**
 * @route GET /permission-categories
 * @desc الحصول على جميع فئات الصلاحيات
 * @access Public
 */
router.get('/', permissionCategoriesController.getAllPermissionCategories);

/**
 * @route GET /permission-categories/:id
 * @desc الحصول على فئة صلاحيات بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getPermissionCategoryByIdSchema.params, 'params'), permissionCategoriesController.getPermissionCategoryById);

/**
 * @route POST /permission-categories
 * @desc إنشاء فئة صلاحيات جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createPermissionCategorySchema.body, 'body'), permissionCategoriesController.createPermissionCategory);

/**
 * @route PUT /permission-categories/:id
 * @desc تحديث فئة الصلاحيات
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updatePermissionCategorySchema.params, 'params'),
  validationMiddlewareFactory(updatePermissionCategorySchema.body, 'body'), 
  permissionCategoriesController.updatePermissionCategory
);

/**
 * @route DELETE /permission-categories/:id
 * @desc حذف فئة الصلاحيات
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getPermissionCategoryByIdSchema.params, 'params'), permissionCategoriesController.deletePermissionCategory);

export default router;