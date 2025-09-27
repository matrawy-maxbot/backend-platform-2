import { UserSettingsService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم إعدادات المستخدم
 * @module UserSettingsController
 */

/**
 * الحصول على جميع إعدادات المستخدم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllUserSettings = async (req, res, next) => {
  try {
    let userSettings = await UserSettingsService.getAllUserSettings();
    userSettings = resolveDatabaseResult(userSettings);
    
    send(res, {
      success: true,
      data: userSettings
    }, 'تم جلب جميع إعدادات المستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات المستخدم بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getUserSettingsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let userSettings = await UserSettingsService.getUserSettingsById(id);
    userSettings = resolveDatabaseResult(userSettings);
    
    let status = 200;
    if (userSettings.length < 1) status = 404;

    send(res, {
      success: true,
      data: userSettings
    }, 'تم جلب إعدادات المستخدم بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات مستخدم جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createUserSettings = async (req, res, next) => {
  try {
    const userSettingsData = req.body;

    let newUserSettings = await UserSettingsService.createUserSettings(userSettingsData);
    newUserSettings = resolveDatabaseResult(newUserSettings);
    
    send(res, {
      success: true,
      data: newUserSettings
    }, 'تم إنشاء إعدادات المستخدم بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات المستخدم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateUserSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedUserSettings = await UserSettingsService.updateUserSettings(id, updateData);
    updatedUserSettings = resolveDatabaseResult(updatedUserSettings);
    
    send(res, {
      success: true,
      data: updatedUserSettings
    }, 'تم تحديث إعدادات المستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات المستخدم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteUserSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await UserSettingsService.deleteUserSettings(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف إعدادات المستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};