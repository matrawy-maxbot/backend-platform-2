import express from 'express';
import * as vendorPaymentsController from '../controllers/vendor_payments.controller.js';
import {
  getVendorPaymentByIdSchema,
  createVendorPaymentSchema,
  updateVendorPaymentSchema
} from '../validators/vendor_payments.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات مدفوعات البائعين
 * @module VendorPaymentsRoutes
 */

const router = express.Router();

/**
 * @route GET /vendor-payments
 * @desc الحصول على جميع مدفوعات البائعين
 * @access Public
 */
router.get('/', vendorPaymentsController.getAllVendorPayments);

/**
 * @route GET /vendor-payments/:id
 * @desc الحصول على مدفوعة بائع بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorPaymentByIdSchema.params, 'params'), vendorPaymentsController.getVendorPaymentById);

/**
 * @route POST /vendor-payments
 * @desc إنشاء مدفوعة بائع جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorPaymentSchema.body, 'body'), vendorPaymentsController.createVendorPayment);

/**
 * @route PUT /vendor-payments/:id
 * @desc تحديث مدفوعة البائع
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorPaymentSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorPaymentSchema.body, 'body'), 
  vendorPaymentsController.updateVendorPayment
);

/**
 * @route DELETE /vendor-payments/:id
 * @desc حذف مدفوعة البائع
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorPaymentByIdSchema.params, 'params'), vendorPaymentsController.deleteVendorPayment);

export default router;