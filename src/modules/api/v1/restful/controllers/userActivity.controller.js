import { UserActivityService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم أنشطة المستخدمين
 * @module UserActivityController
 */

/**
 * الحصول على جميع أنشطة المستخدمين
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllUserActivities = async (req, res, next) => {
  try {
    let userActivities = await UserActivityService.searchActivities();
    userActivities = resolveDatabaseResult(userActivities);
    
    send(res, {
      success: true,
      data: userActivities
    }, 'تم جلب جميع أنشطة المستخدمين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على نشاط مستخدم بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getUserActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let userActivity = await UserActivityService.getActivity(id);
    userActivity = resolveDatabaseResult(userActivity);
    
    let status = 200;
    if (!userActivity) status = 404;

    send(res, {
      success: true,
      data: userActivity
    }, 'تم جلب نشاط المستخدم بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء نشاط مستخدم جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createUserActivity = async (req, res, next) => {
  try {
    const userActivityData = req.body;

    let newUserActivity = await UserActivityService.createActivity(userActivityData);
    newUserActivity = resolveDatabaseResult(newUserActivity);
    
    send(res, {
      success: true,
      data: newUserActivity
    }, 'تم إنشاء نشاط المستخدم بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث نشاط المستخدم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateUserActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedUserActivity = await UserActivityService.updateActivity(id, updateData);
    updatedUserActivity = resolveDatabaseResult(updatedUserActivity);
    
    send(res, {
      success: true,
      data: updatedUserActivity
    }, 'تم تحديث نشاط المستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف نشاط المستخدم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteUserActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await UserActivityService.deleteActivity(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف نشاط المستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};