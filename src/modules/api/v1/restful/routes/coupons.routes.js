import express from 'express';
import * as couponsController from '../controllers/coupons.controller.js';
import {
  getCouponByIdSchema,
  createCouponSchema,
  updateCouponSchema
} from '../validators/coupons.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات الكوبونات
 * @module CouponsRoutes
 */

const router = express.Router();

/**
 * @route GET /coupons
 * @desc الحصول على جميع الكوبونات
 * @access Public
 */
router.get('/', couponsController.getAllCoupons);

/**
 * @route GET /coupons/:id
 * @desc الحصول على كوبون بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getCouponByIdSchema.params, 'params'), couponsController.getCouponById);

/**
 * @route POST /coupons
 * @desc إنشاء كوبون جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createCouponSchema.body, 'body'), couponsController.createCoupon);

/**
 * @route PUT /coupons/:id
 * @desc تحديث الكوبون
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateCouponSchema.params, 'params'),
  validationMiddlewareFactory(updateCouponSchema.body, 'body'), 
  couponsController.updateCoupon
);

/**
 * @route DELETE /coupons/:id
 * @desc حذف الكوبون
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getCouponByIdSchema.params, 'params'), couponsController.deleteCoupon);

export default router;