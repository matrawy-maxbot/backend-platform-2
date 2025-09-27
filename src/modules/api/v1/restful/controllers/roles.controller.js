import { RoleService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم الأدوار
 * @module RolesController
 */

/**
 * الحصول على جميع الأدوار
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllRoles = async (req, res, next) => {
  try {
    let roles = await RoleService.getAllRoles();
    roles = resolveDatabaseResult(roles);
    
    send(res, {
      success: true,
      data: roles
    }, 'تم جلب جميع الأدوار بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على دور بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let role = await RoleService.getRoleById(id);
    role = resolveDatabaseResult(role);
    
    let status = 200;
    if (role.length < 1) status = 404;

    send(res, {
      success: true,
      data: role
    }, 'تم جلب الدور بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء دور جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createRole = async (req, res, next) => {
  try {
    const roleData = req.body;

    let newRole = await RoleService.createRole(roleData);
    newRole = resolveDatabaseResult(newRole);
    
    send(res, {
      success: true,
      data: newRole
    }, 'تم إنشاء الدور بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث الدور
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedRole = await RoleService.updateRole(id, updateData);
    updatedRole = resolveDatabaseResult(updatedRole);
    
    send(res, {
      success: true,
      data: updatedRole
    }, 'تم تحديث الدور بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف الدور
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await RoleService.deleteRole(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف الدور بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};