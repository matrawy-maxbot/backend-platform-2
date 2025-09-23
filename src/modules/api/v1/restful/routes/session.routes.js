import express from 'express';
import * as sessionController from '../controllers/session.controller.js';
import {
  getSessionByIdSchema,
  createSessionSchema,
  updateSessionSchema
} from '../validators/session.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات الجلسات
 * @module SessionRoutes
 */

const router = express.Router();

/**
 * @route GET /sessions
 * @desc الحصول على جميع الجلسات
 * @access Public
 */
router.get('/', sessionController.getAllSessions);

/**
 * @route GET /sessions/:id
 * @desc الحصول على جلسة بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getSessionByIdSchema.params, 'params'), sessionController.getSessionById);

/**
 * @route POST /sessions
 * @desc إنشاء جلسة جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createSessionSchema.body, 'body'), sessionController.createSession);

/**
 * @route PUT /sessions/:id
 * @desc تحديث الجلسة
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateSessionSchema.params, 'params'),
  validationMiddlewareFactory(updateSessionSchema.body, 'body'), 
  sessionController.updateSession
);

/**
 * @route DELETE /sessions/:id
 * @desc حذف الجلسة
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getSessionByIdSchema.params, 'params'), sessionController.deleteSession);

export default router;