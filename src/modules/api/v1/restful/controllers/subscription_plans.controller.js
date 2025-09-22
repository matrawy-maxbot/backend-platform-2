import SubscriptionPlanService from '../../../../database/postgreSQL/services/SubscriptionPlan.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم خطط الاشتراك
 * @module SubscriptionPlansController
 */

/**
 * الحصول على جميع خطط الاشتراك
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllSubscriptionPlans = async (req, res, next) => {
  try {
    let subscriptionPlans = await SubscriptionPlanService.getAllSubscriptionPlans();
    subscriptionPlans = resolveDatabaseResult(subscriptionPlans);
    
    send(res, {
      success: true,
      data: subscriptionPlans
    }, 'تم جلب جميع خطط الاشتراك بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على خطة اشتراك بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getSubscriptionPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let subscriptionPlan = await SubscriptionPlanService.getSubscriptionPlanById(id);
    subscriptionPlan = resolveDatabaseResult(subscriptionPlan);
    
    let status = 200;
    if (subscriptionPlan.length < 1) status = 404;

    send(res, {
      success: true,
      data: subscriptionPlan
    }, 'تم جلب خطة الاشتراك بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء خطة اشتراك جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createSubscriptionPlan = async (req, res, next) => {
  try {
    const subscriptionPlanData = req.body;

    let newSubscriptionPlan = await SubscriptionPlanService.createSubscriptionPlan(subscriptionPlanData);
    newSubscriptionPlan = resolveDatabaseResult(newSubscriptionPlan);
    
    send(res, {
      success: true,
      data: newSubscriptionPlan
    }, 'تم إنشاء خطة الاشتراك بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث خطة الاشتراك
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateSubscriptionPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedSubscriptionPlan = await SubscriptionPlanService.updateSubscriptionPlan(id, updateData);
    updatedSubscriptionPlan = resolveDatabaseResult(updatedSubscriptionPlan);
    
    send(res, {
      success: true,
      data: updatedSubscriptionPlan
    }, 'تم تحديث خطة الاشتراك بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف خطة الاشتراك
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteSubscriptionPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await SubscriptionPlanService.deleteSubscriptionPlan(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف خطة الاشتراك بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};