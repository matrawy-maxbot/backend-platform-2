import express from 'express';
import * as productDetailsController from '../controllers/productDetails.controller.js';
import {
  getProductDetailsByIdSchema,
  createProductDetailsSchema,
  updateProductDetailsSchema
} from '../validators/productDetails.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات تفاصيل المنتجات
 * @module ProductDetailsRoutes
 */

const router = express.Router();

/**
 * @route GET /productDetails
 * @desc الحصول على جميع تفاصيل المنتجات
 * @access Public
 */
router.get('/', productDetailsController.getAllProductDetails);

/**
 * @route GET /productDetails/:id
 * @desc الحصول على تفاصيل منتج بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getProductDetailsByIdSchema.params, 'params'), productDetailsController.getProductDetailsById);

/**
 * @route POST /productDetails
 * @desc إنشاء تفاصيل منتج جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createProductDetailsSchema.body, 'body'), productDetailsController.createProductDetails);

/**
 * @route PUT /productDetails/:id
 * @desc تحديث تفاصيل المنتج
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateProductDetailsSchema.params, 'params'),
  validationMiddlewareFactory(updateProductDetailsSchema.body, 'body'), 
  productDetailsController.updateProductDetails
);

/**
 * @route DELETE /productDetails/:id
 * @desc حذف تفاصيل المنتج
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getProductDetailsByIdSchema.params, 'params'), productDetailsController.deleteProductDetails);

export default router;