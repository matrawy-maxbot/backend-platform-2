import express from 'express';
import * as addressesController from '../controllers/addresses.controller.js';
import {
  getAddressByIdSchema,
  createAddressSchema,
  updateAddressSchema
} from '../validators/addresses.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات العناوين
 * @module AddressesRoutes
 */

const router = express.Router();

/**
 * @route GET /addresses
 * @desc الحصول على جميع العناوين
 * @access Public
 */
router.get('/', addressesController.getAllAddresses);

/**
 * @route GET /addresses/:id
 * @desc الحصول على عنوان بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getAddressByIdSchema.params, 'params'), addressesController.getAddressById);

/**
 * @route POST /addresses
 * @desc إنشاء عنوان جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createAddressSchema.body, 'body'), addressesController.createAddress);

/**
 * @route PUT /addresses/:id
 * @desc تحديث العنوان
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateAddressSchema.params, 'params'),
  validationMiddlewareFactory(updateAddressSchema.body, 'body'), 
  addressesController.updateAddress
);

/**
 * @route DELETE /addresses/:id
 * @desc حذف العنوان
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getAddressByIdSchema.params, 'params'), addressesController.deleteAddress);

export default router;