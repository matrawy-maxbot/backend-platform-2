import StaffUserService from '../../../../database/postgreSQL/services/staffUser.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم موظفي المواقع
 * @module StaffUsersController
 */

/**
 * الحصول على جميع موظفي المواقع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllStaffUsers = async (req, res, next) => {
  try {
    let staffUsers = await StaffUserService.getAllStaffUsers();
    staffUsers = resolveDatabaseResult(staffUsers);
    
    send(res, {
      success: true,
      data: staffUsers
    }, 'تم جلب جميع موظفي المواقع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على موظف موقع بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getStaffUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let staffUser = await StaffUserService.getStaffUserById(id);
    staffUser = resolveDatabaseResult(staffUser);
    
    let status = 200;
    if (staffUser.length < 1) status = 404;

    send(res, {
      success: true,
      data: staffUser
    }, 'تم جلب موظف الموقع بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء موظف موقع جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createStaffUser = async (req, res, next) => {
  try {
    const staffUserData = req.body;

    let newStaffUser = await StaffUserService.addStaffUser(staffUserData);
    newStaffUser = resolveDatabaseResult(newStaffUser);
    
    send(res, {
      success: true,
      data: newStaffUser
    }, 'تم إنشاء موظف الموقع بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث موظف الموقع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateStaffUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedStaffUser = await StaffUserService.updateStaffRole(id, updateData.role_id);
    updatedStaffUser = resolveDatabaseResult(updatedStaffUser);
    
    send(res, {
      success: true,
      data: updatedStaffUser
    }, 'تم تحديث موظف الموقع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف موظف الموقع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteStaffUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await StaffUserService.removeStaffUser(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف موظف الموقع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};