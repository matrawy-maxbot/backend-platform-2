import express from 'express';
import * as ordersController from '../controllers/orders.controller.js';
import {
  getOrderByIdSchema,
  createOrderSchema,
  updateOrderSchema
} from '../validators/orders.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات الطلبات
 * @module OrdersRoutes
 */

const router = express.Router();

/**
 * @route GET /orders
 * @desc الحصول على جميع الطلبات
 * @access Public
 */
router.get('/', ordersController.getAllOrders);

/**
 * @route GET /orders/:id
 * @desc الحصول على طلب بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getOrderByIdSchema.params, 'params'), ordersController.getOrderById);

/**
 * @route POST /orders
 * @desc إنشاء طلب جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createOrderSchema.body, 'body'), ordersController.createOrder);

/**
 * @route PUT /orders/:id
 * @desc تحديث الطلب
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateOrderSchema.params, 'params'),
  validationMiddlewareFactory(updateOrderSchema.body, 'body'), 
  ordersController.updateOrder
);

/**
 * @route DELETE /orders/:id
 * @desc حذف الطلب
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getOrderByIdSchema.params, 'params'), ordersController.deleteOrder);

export default router;