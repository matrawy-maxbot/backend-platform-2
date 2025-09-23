import express from 'express';
import * as vendorDynamicContentController from '../controllers/vendorDynamicContent.controller.js';
import {
  getVendorDynamicContentByIdSchema,
  createVendorDynamicContentSchema,
  updateVendorDynamicContentSchema
} from '../validators/vendorDynamicContent.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات المحتوى الديناميكي للبائعين
 * @module VendorDynamicContentRoutes
 */

const router = express.Router();

/**
 * @route GET /vendorDynamicContent
 * @desc الحصول على جميع المحتوى الديناميكي للبائعين
 * @access Public
 */
router.get('/', vendorDynamicContentController.getAllVendorDynamicContent);

/**
 * @route GET /vendorDynamicContent/:id
 * @desc الحصول على المحتوى الديناميكي للبائع بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorDynamicContentByIdSchema.params, 'params'), vendorDynamicContentController.getVendorDynamicContentById);

/**
 * @route POST /vendorDynamicContent
 * @desc إنشاء محتوى ديناميكي جديد للبائع
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorDynamicContentSchema.body, 'body'), vendorDynamicContentController.createVendorDynamicContent);

/**
 * @route PUT /vendorDynamicContent/:id
 * @desc تحديث المحتوى الديناميكي للبائع
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorDynamicContentSchema.params, 'params'),
  validationMiddlewareFactory(updateVendorDynamicContentSchema.body, 'body'), 
  vendorDynamicContentController.updateVendorDynamicContent
);

/**
 * @route DELETE /vendorDynamicContent/:id
 * @desc حذف المحتوى الديناميكي للبائع
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorDynamicContentByIdSchema.params, 'params'), vendorDynamicContentController.deleteVendorDynamicContent);

export default router;