import express from 'express';
import * as categoriesController from '../controllers/categories.controller.js';
import {
  getCategoryByIdSchema,
  createCategorySchema,
  updateCategorySchema,
  
} from '../validators/categories.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

const router = express.Router();

/**
 * مسارات الفئات
 * @module CategoriesRoutes
 */

/**
 * GET /api/v1/categories
 * الحصول على جميع الفئات
 */
router.get('/', categoriesController.getAllCategories);

/**
 * GET /api/v1/categories/:id
 * الحصول على فئة بالمعرف
 */
router.get(
  '/:id',
  validationMiddlewareFactory(getCategoryByIdSchema.params, 'params'),
  categoriesController.getCategoryById
);

/**
 * POST /api/v1/categories
 * إنشاء فئة جديدة
 */
router.post(
  '/',
  validationMiddlewareFactory(createCategorySchema.body, 'body'),
  categoriesController.createCategory
);

/**
 * PUT /api/v1/categories/:id
 * تحديث الفئة
 */
router.put(
  '/:id',
  validationMiddlewareFactory(updateCategorySchema.params, 'params'),
  validationMiddlewareFactory(updateCategorySchema.body, 'body'),
  categoriesController.updateCategory
);

/**
 * DELETE /api/v1/categories/:id
 * حذف الفئة
 */
router.delete(
  '/:id',
  validationMiddlewareFactory(getCategoryByIdSchema.params, 'params'),
  categoriesController.deleteCategory
);

export default router;