import express from 'express';
import * as productVariantsController from '../controllers/productVariants.controller.js';
import {
  getProductVariantByIdSchema,
  createProductVariantSchema,
  updateProductVariantSchema
} from '../validators/productVariants.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات متغيرات المنتجات
 * @module ProductVariantsRoutes
 */

const router = express.Router();

/**
 * @route GET /product-variants
 * @desc الحصول على جميع متغيرات المنتجات
 * @access Public
 */
router.get('/', productVariantsController.getAllProductVariants);

/**
 * @route GET /api/v1/product-variants/:id
 * @desc الحصول على متغير منتج بواسطة المعرف
 * @access Public
 * @param {string} id - معرف متغير المنتج
 */
router.get('/:id', 
  validationMiddlewareFactory(getProductVariantByIdSchema.params, 'params'), 
  productVariantsController.getProductVariantById
);

/**
 * @route POST /api/v1/product-variants
 * @desc إنشاء متغير منتج جديد
 * @access Private
 * @body {Object} variantData - بيانات متغير المنتج الجديد
 */
router.post('/', 
  validationMiddlewareFactory(createProductVariantSchema.body, 'body'), 
  productVariantsController.createProductVariant
);

/**
 * @route PUT /api/v1/product-variants/:id
 * @desc تحديث متغير منتج موجود
 * @access Private
 * @param {string} id - معرف متغير المنتج
 * @body {Object} variantData - بيانات متغير المنتج المحدثة
 */
router.put('/:id', 
  validationMiddlewareFactory(updateProductVariantSchema.params, 'params'),
  validationMiddlewareFactory(updateProductVariantSchema.body, 'body'), 
  productVariantsController.updateProductVariant
);

/**
 * @route DELETE /api/v1/product-variants/:id
 * @desc حذف متغير منتج
 * @access Private
 * @param {string} id - معرف متغير المنتج
 */
router.delete('/:id', 
  validationMiddlewareFactory(getProductVariantByIdSchema.params, 'params'), 
  productVariantsController.deleteProductVariant
);

export default router;