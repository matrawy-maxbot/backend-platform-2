import UserActivityLogsService from '../../../../database/mongoDB/services/UserActivityLogs.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم سجلات نشاط المستخدمين
 * @module UserActivityLogsController
 */

/**
 * الحصول على جميع سجلات نشاط المستخدمين
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllUserActivityLogs = async (req, res, next) => {
  try {
    let userActivityLogs = await UserActivityLogsService.getAllUserActivityLogs();
    userActivityLogs = resolveDatabaseResult(userActivityLogs);
    
    send(res, {
      success: true,
      data: userActivityLogs
    }, 'تم جلب جميع سجلات نشاط المستخدمين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجل نشاط المستخدم بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getUserActivityLogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let userActivityLog = await UserActivityLogsService.getUserActivityLogById(id);
    userActivityLog = resolveDatabaseResult(userActivityLog);
    
    let status = 200;
    if (userActivityLog.length < 1) status = 404;

    send(res, {
      success: true,
      data: userActivityLog
    }, 'تم جلب سجل نشاط المستخدم بنجاح', status);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء سجل نشاط مستخدم جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createUserActivityLog = async (req, res, next) => {
  try {
    const userActivityLogData = req.body;

    let newUserActivityLog = await UserActivityLogsService.createUserActivityLog(userActivityLogData);
    newUserActivityLog = resolveDatabaseResult(newUserActivityLog);
    
    send(res, {
      success: true,
      data: newUserActivityLog
    }, 'تم إنشاء سجل نشاط المستخدم بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث سجل نشاط المستخدم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateUserActivityLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedUserActivityLog = await UserActivityLogsService.updateUserActivityLog(id, updateData);
    updatedUserActivityLog = resolveDatabaseResult(updatedUserActivityLog);
    
    send(res, {
      success: true,
      data: updatedUserActivityLog
    }, 'تم تحديث سجل نشاط المستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف سجل نشاط المستخدم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteUserActivityLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await UserActivityLogsService.deleteUserActivityLog(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف سجل نشاط المستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};