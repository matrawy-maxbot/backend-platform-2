import { VendorSubscriptionService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم اشتراكات البائعين
 * @module VendorSubscriptionsController
 */

/**
 * الحصول على جميع اشتراكات البائعين
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorSubscriptions = async (req, res, next) => {
  try {
    let subscriptions = await VendorSubscriptionService.getAllSubscriptions();
    subscriptions = resolveDatabaseResult(subscriptions);
    
    send(res, {
      success: true,
      data: subscriptions
    }, 'تم جلب جميع اشتراكات البائعين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على اشتراك بائع بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorSubscriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let subscription = await VendorSubscriptionService.getSubscriptionById(id);
    subscription = resolveDatabaseResult(subscription);
    
    let status = 200;
    if (subscription.length < 1) status = 404;

    send(res, {
      success: true,
      data: subscription
    }, 'تم جلب اشتراك البائع بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء اشتراك بائع جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorSubscription = async (req, res, next) => {
  try {
    const subscriptionData = req.body;

    let newSubscription = await VendorSubscriptionService.createSubscription(subscriptionData);
    newSubscription = resolveDatabaseResult(newSubscription);
    
    send(res, {
      success: true,
      data: newSubscription
    }, 'تم إنشاء اشتراك البائع بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث اشتراك البائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedSubscription = await VendorSubscriptionService.updateSubscription(id, updateData);
    updatedSubscription = resolveDatabaseResult(updatedSubscription);
    
    send(res, {
      success: true,
      data: updatedSubscription
    }, 'تم تحديث اشتراك البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف اشتراك البائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorSubscriptionService.deleteSubscription(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف اشتراك البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};