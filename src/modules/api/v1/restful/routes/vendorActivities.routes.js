import express from 'express';
import * as vendorActivitiesController from '../controllers/vendorActivities.controller.js';
import {
  getVendorActivityByIdSchema,
  createVendorActivitySchema,
  updateVendorActivitySchema
} from '../validators/vendorActivities.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات أنشطة البائعين
 * @module VendorActivitiesRoutes
 */

const router = express.Router();

/**
 * @route GET /vendor-activities
 * @desc الحصول على جميع أنشطة البائعين
 * @access Public
 */
router.get('/', vendorActivitiesController.getAllVendorActivities);

/**
 * @route GET /vendor-activities/:id
 * @desc الحصول على نشاط بائع بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getVendorActivityByIdSchema.params, 'params'), vendorActivitiesController.getVendorActivityById);

/**
 * @route POST /vendor-activities
 * @desc إنشاء نشاط بائع جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createVendorActivitySchema.body, 'body'), vendorActivitiesController.createVendorActivity);

/**
 * @route PUT /vendor-activities/:id
 * @desc تحديث نشاط البائع
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateVendorActivitySchema.params, 'params'),
  validationMiddlewareFactory(updateVendorActivitySchema.body, 'body'), 
  vendorActivitiesController.updateVendorActivity
);

/**
 * @route DELETE /vendor-activities/:id
 * @desc حذف نشاط البائع
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getVendorActivityByIdSchema.params, 'params'), vendorActivitiesController.deleteVendorActivity);

export default router;