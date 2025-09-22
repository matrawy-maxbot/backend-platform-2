import PermissionService from '../../../../database/postgreSQL/services/permission.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم الصلاحيات
 * @module PermissionsController
 */

/**
 * الحصول على جميع الصلاحيات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllPermissions = async (req, res, next) => {
  try {
    let permissions = await PermissionService.getAllPermissions();
    permissions = resolveDatabaseResult(permissions);
    
    send(res, {
      success: true,
      data: permissions
    }, 'تم جلب جميع الصلاحيات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على صلاحية بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getPermissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let permission = await PermissionService.getPermissionById(id);
    permission = resolveDatabaseResult(permission);
    
    let status = 200;
    if (permission.length < 1) status = 404;

    send(res, {
      success: true,
      data: permission
    }, 'تم جلب الصلاحية بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء صلاحية جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createPermission = async (req, res, next) => {
  try {
    const permissionData = req.body;

    let newPermission = await PermissionService.createPermission(permissionData);
    newPermission = resolveDatabaseResult(newPermission);
    
    send(res, {
      success: true,
      data: newPermission
    }, 'تم إنشاء الصلاحية بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث الصلاحية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedPermission = await PermissionService.updatePermission(id, updateData);
    updatedPermission = resolveDatabaseResult(updatedPermission);
    
    send(res, {
      success: true,
      data: updatedPermission
    }, 'تم تحديث الصلاحية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف الصلاحية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await PermissionService.deletePermission(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف الصلاحية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};