import express from 'express';
import * as vendorSubscriptionsController from '../controllers/vendor_subscriptions.controller.js';
import {
  getVendorSubscriptionByIdSchema,
  createVendorSubscriptionSchema,
  updateVendorSubscriptionSchema
} from '../validators/vendor_subscriptions.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات اشتراكات البائعين
 * @module VendorSubscriptionsRoutes
 */

const router = express.Router();

/**
 * @route GET /vendor-subscriptions
 * @desc الحصول على جميع اشتراكات البائعين
 * @access Public
 */
router.get('/', vendorSubscriptionsController.getAllVendorSubscriptions);

/**
 * @route GET /vendor-subscriptions/:id
 * @desc الحصول على اشتراك بائع بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorSubscriptionByIdSchema.params, 'params'), vendorSubscriptionsController.getVendorSubscriptionById);

/**
 * @route POST /vendor-subscriptions
 * @desc إنشاء اشتراك بائع جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorSubscriptionSchema.body, 'body'), vendorSubscriptionsController.createVendorSubscription);

/**
 * @route PUT /vendor-subscriptions/:id
 * @desc تحديث اشتراك البائع
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorSubscriptionSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorSubscriptionSchema.body, 'body'), 
  vendorSubscriptionsController.updateVendorSubscription
);

/**
 * @route DELETE /vendor-subscriptions/:id
 * @desc حذف اشتراك البائع
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorSubscriptionByIdSchema.params, 'params'), vendorSubscriptionsController.deleteVendorSubscription);

export default router;