import express from 'express';
import * as productReviewsController from '../controllers/productReviews.controller.js';
import {
  getProductReviewByIdSchema,
  createProductReviewSchema,
  updateProductReviewSchema
} from '../validators/productReviews.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات مراجعات المنتجات
 * @module ProductReviewsRoutes
 */

const router = express.Router();

/**
 * @route GET /productReviews
 * @desc الحصول على جميع مراجعات المنتجات
 * @access Public
 */
router.get('/', productReviewsController.getAllProductReviews);

/**
 * @route GET /productReviews/:id
 * @desc الحصول على مراجعة منتج بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getProductReviewByIdSchema.params, 'params'), productReviewsController.getProductReviewById);

/**
 * @route POST /productReviews
 * @desc إنشاء مراجعة منتج جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createProductReviewSchema.body, 'body'), productReviewsController.createProductReview);

/**
 * @route PUT /productReviews/:id
 * @desc تحديث مراجعة المنتج
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateProductReviewSchema.params, 'params'),
  validationMiddlewareFactory(updateProductReviewSchema.body, 'body'), 
  productReviewsController.updateProductReview
);

/**
 * @route DELETE /productReviews/:id
 * @desc حذف مراجعة المنتج
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getProductReviewByIdSchema.params, 'params'), productReviewsController.deleteProductReview);

export default router;