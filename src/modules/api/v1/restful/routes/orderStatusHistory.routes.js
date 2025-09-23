import express from 'express';
import * as orderStatusHistoryController from '../controllers/orderStatusHistory.controller.js';
import {
  getOrderStatusHistoryByIdSchema,
  createOrderStatusHistorySchema,
  updateOrderStatusHistorySchema
} from '../validators/orderStatusHistory.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات تاريخ حالة الطلبات
 * @module OrderStatusHistoryRoutes
 */

const router = express.Router();

/**
 * @route GET /orderStatusHistory
 * @desc الحصول على جميع سجلات تاريخ حالة الطلبات
 * @access Public
 */
router.get('/', orderStatusHistoryController.getAllOrderStatusHistories);

/**
 * @route GET /orderStatusHistory/:id
 * @desc الحصول على سجل تاريخ حالة الطلب بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getOrderStatusHistoryByIdSchema.params, 'params'), orderStatusHistoryController.getOrderStatusHistoryById);

/**
 * @route POST /orderStatusHistory
 * @desc إنشاء سجل تاريخ حالة طلب جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createOrderStatusHistorySchema.body, 'body'), orderStatusHistoryController.createOrderStatusHistory);

/**
 * @route PUT /orderStatusHistory/:id
 * @desc تحديث سجل تاريخ حالة الطلب
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateOrderStatusHistorySchema.params, 'params'),
  validationMiddlewareFactory(updateOrderStatusHistorySchema.body, 'body'), 
  orderStatusHistoryController.updateOrderStatusHistory
);

/**
 * @route DELETE /orderStatusHistory/:id
 * @desc حذف سجل تاريخ حالة الطلب
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getOrderStatusHistoryByIdSchema.params, 'params'), orderStatusHistoryController.deleteOrderStatusHistory);

export default router;