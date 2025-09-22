import express from 'express';
import * as paymentsController from '../controllers/payments.controller.js';
import {
  getPaymentByIdSchema,
  createPaymentSchema,
  updatePaymentSchema
} from '../validators/payments.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات المدفوعات
 * @module PaymentsRoutes
 */

const router = express.Router();

/**
 * @route GET /payments
 * @desc الحصول على جميع المدفوعات
 * @access Public
 */
router.get('/', paymentsController.getAllPayments);

/**
 * @route GET /payments/:id
 * @desc الحصول على مدفوعة بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getPaymentByIdSchema.params, 'params'), paymentsController.getPaymentById);

/**
 * @route POST /payments
 * @desc إنشاء مدفوعة جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createPaymentSchema.body, 'body'), paymentsController.createPayment);

/**
 * @route PUT /payments/:id
 * @desc تحديث المدفوعة
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updatePaymentSchema.params, 'params'),
  validationMiddlewareFactory(updatePaymentSchema.body, 'body'), 
  paymentsController.updatePayment
);

/**
 * @route DELETE /payments/:id
 * @desc حذف المدفوعة
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getPaymentByIdSchema.params, 'params'), paymentsController.deletePayment);

export default router;