import express from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import {
  getInventoryByIdSchema,
  createInventorySchema,
  updateInventorySchema
} from '../validators/inventory.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات المخزون
 * @module InventoryRoutes
 */

const router = express.Router();

/**
 * @route GET /inventory
 * @desc الحصول على جميع سجلات المخزون
 * @access Public
 */
router.get('/', inventoryController.getAllInventory);

/**
 * @route GET /inventory/:id
 * @desc الحصول على سجل مخزون بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getInventoryByIdSchema.params, 'params'), inventoryController.getInventoryById);

/**
 * @route POST /inventory
 * @desc إنشاء سجل مخزون جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createInventorySchema.body, 'body'), inventoryController.createInventory);

/**
 * @route PUT /inventory/:id
 * @desc تحديث سجل المخزون
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateInventorySchema.params, 'params'),
  validationMiddlewareFactory(updateInventorySchema.body, 'body'), 
  inventoryController.updateInventory
);

/**
 * @route DELETE /inventory/:id
 * @desc حذف سجل المخزون
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getInventoryByIdSchema.params, 'params'), inventoryController.deleteInventory);

export default router;