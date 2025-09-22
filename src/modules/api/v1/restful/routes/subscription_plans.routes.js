import express from 'express';
import * as subscriptionPlansController from '../controllers/subscription_plans.controller.js';
import {
  getSubscriptionPlanByIdSchema,
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema
} from '../validators/subscription_plans.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات خطط الاشتراك
 * @module SubscriptionPlansRoutes
 */

const router = express.Router();

/**
 * @route GET /subscription_plans
 * @desc الحصول على جميع خطط الاشتراك
 * @access Public
 */
router.get('/', subscriptionPlansController.getAllSubscriptionPlans);

/**
 * @route GET /subscription_plans/:id
 * @desc الحصول على خطة اشتراك بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getSubscriptionPlanByIdSchema.params, 'params'), subscriptionPlansController.getSubscriptionPlanById);

/**
 * @route POST /subscription_plans
 * @desc إنشاء خطة اشتراك جديدة
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createSubscriptionPlanSchema.body, 'body'), subscriptionPlansController.createSubscriptionPlan);

/**
 * @route PUT /subscription_plans/:id
 * @desc تحديث خطة الاشتراك
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateSubscriptionPlanSchema.params, 'params'),
  validationMiddlewareFactory(updateSubscriptionPlanSchema.body, 'body'), 
  subscriptionPlansController.updateSubscriptionPlan
);

/**
 * @route DELETE /subscription_plans/:id
 * @desc حذف خطة الاشتراك
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getSubscriptionPlanByIdSchema.params, 'params'), subscriptionPlansController.deleteSubscriptionPlan);

export default router;