import express from 'express';
import * as vendorsController from '../controllers/vendors.controller.js';
import { 
  getVendorByIdSchema, 
  createVendorSchema, 
  updateVendorSchema 
} from '../validators/vendors.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات API للمتاجر
 * @module VendorsRoutes
 */

const router = express.Router();

/**
 * @route GET /api/v1/vendors
 * @desc الحصول على جميع المتاجر
 * @access Public
 */
router.get('/', vendorsController.getAllVendors);

/**
 * @route GET /api/v1/vendors/:id
 * @desc الحصول على متجر بواسطة المعرف
 * @access Public
 * @param {number} id - معرف المتجر
 */
router.get('/:id', 
  validationMiddlewareFactory(getVendorByIdSchema.params, 'params'), 
  vendorsController.getVendorById
);

/**
 * @route POST /api/v1/vendors
 * @desc إنشاء متجر جديد
 * @access Private
 * @body {Object} vendorData - بيانات المتجر الجديد
 */
router.post('/', 
  validationMiddlewareFactory(createVendorSchema.body, 'body'), 
  vendorsController.createVendor
);

/**
 * @route PUT /api/v1/vendors/:id
 * @desc تحديث متجر موجود
 * @access Private
 * @param {number} id - معرف المتجر
 * @body {Object} vendorData - بيانات المتجر المحدثة
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorSchema.body, 'body'), 
  vendorsController.updateVendor
);

/**
 * @route DELETE /api/v1/vendors/:id
 * @desc حذف متجر
 * @access Private
 * @param {number} id - معرف المتجر
 */
router.delete('/:id', 
  validationMiddlewareFactory(getVendorByIdSchema.params, 'params'), 
  vendorsController.deleteVendor
);

export default router;