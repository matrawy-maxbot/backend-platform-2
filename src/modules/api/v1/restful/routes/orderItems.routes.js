import express from 'express';
import * as orderItemsController from '../controllers/orderItems.controller.js';
import {
  getOrderItemByIdSchema,
  createOrderItemSchema,
  updateOrderItemSchema
} from '../validators/orderItems.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات عناصر الطلبات
 * @module OrderItemsRoutes
 */

const router = express.Router();

/**
 * @route GET /order-items
 * @desc الحصول على جميع عناصر الطلبات
 * @access Public
 */
router.get('/', orderItemsController.getAllOrderItems);

/**
 * @route GET /order-items/:id
 * @desc الحصول على عنصر طلب بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getOrderItemByIdSchema.params, 'params'), orderItemsController.getOrderItemById);

/**
 * @route POST /order-items
 * @desc إنشاء عنصر طلب جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createOrderItemSchema.body, 'body'), orderItemsController.createOrderItem);

/**
 * @route PUT /order-items/:id
 * @desc تحديث عنصر الطلب
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateOrderItemSchema.params, 'params'),
  validationMiddlewareFactory(updateOrderItemSchema.body, 'body'), 
  orderItemsController.updateOrderItem
);

/**
 * @route DELETE /order-items/:id
 * @desc حذف عنصر الطلب
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getOrderItemByIdSchema.params, 'params'), orderItemsController.deleteOrderItem);

export default router;