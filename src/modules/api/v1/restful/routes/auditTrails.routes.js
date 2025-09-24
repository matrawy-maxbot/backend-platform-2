import express from 'express';
import * as auditTrailsController from '../controllers/auditTrails.controller.js';
import {
  getAuditTrailByIdSchema,
  createAuditTrailSchema,
  updateAuditTrailSchema
} from '../validators/auditTrails.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات سجلات التدقيق
 * @module AuditTrailsRoutes
 */

const router = express.Router();

/**
 * @route GET /audit-trails
 * @desc الحصول على جميع سجلات التدقيق
 * @access Public
 */
router.get('/', auditTrailsController.getAllAuditTrails);

/**
 * @route GET /audit-trails/:id
 * @desc الحصول على سجل تدقيق بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getAuditTrailByIdSchema.params, 'params'), auditTrailsController.getAuditTrailById);

/**
 * @route POST /audit-trails
 * @desc إنشاء سجل تدقيق جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createAuditTrailSchema.body, 'body'), auditTrailsController.createAuditTrail);

/**
 * @route PUT /audit-trails/:id
 * @desc تحديث سجل التدقيق
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateAuditTrailSchema.params, 'params'),
  validationMiddlewareFactory(updateAuditTrailSchema.body, 'body'), 
  auditTrailsController.updateAuditTrail
);

/**
 * @route DELETE /audit-trails/:id
 * @desc حذف سجل التدقيق
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getAuditTrailByIdSchema.params, 'params'), auditTrailsController.deleteAuditTrail);

export default router;