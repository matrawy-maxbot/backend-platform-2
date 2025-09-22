import UserService from '../../../../database/postgreSQL/services/user.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم في عمليات المستخدمين
 * @module UsersController
 */

/**
 * الحصول على جميع المستخدمين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllUsers = async (req, res, next) => {
  try {
    let result = await UserService.getAllUsers();
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم الحصول على جميع المستخدمين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على مستخدم بواسطة id
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user = await UserService.getUserById(id);
    user = resolveDatabaseResult(user);

    let status = 200;
    if (user.length < 1) status = 404;
    
    send(res, {
      success: true,
      data: user
    }, 'تم الحصول على المستخدم بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء مستخدم جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createUser = async (req, res, next) => {
  try {
    let result = await UserService.createUser(req.body);
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم إنشاء المستخدم بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث مستخدم موجود
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await UserService.updateUser(id, req.body);
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم تحديث المستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف مستخدم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await UserService.deleteUser(id);
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم حذف المستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};