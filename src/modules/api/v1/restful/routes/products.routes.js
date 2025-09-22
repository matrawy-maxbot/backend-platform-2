import express from 'express';
import * as productsController from '../controllers/products.controller.js';
import {
  getProductByIdSchema,
  createProductSchema,
  updateProductSchema
} from '../validators/products.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات المنتجات
 * @module ProductsRoutes
 */

const router = express.Router();

/**
 * @route GET /products
 * @desc الحصول على جميع المنتجات
 * @access Public
 */
router.get('/', productsController.getAllProducts);

/**
 * @route GET /products/:id
 * @desc الحصول على منتج بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getProductByIdSchema.params, 'params'), productsController.getProductById);

/**
 * @route POST /products
 * @desc إنشاء منتج جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createProductSchema.body, 'body'), productsController.createProduct);

/**
 * @route PUT /products/:id
 * @desc تحديث المنتج
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateProductSchema.params, 'params'),
  validationMiddlewareFactory(updateProductSchema.body, 'body'), 
  productsController.updateProduct
);

/**
 * @route DELETE /products/:id
 * @desc حذف المنتج
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getProductByIdSchema.params, 'params'), productsController.deleteProduct);

export default router;