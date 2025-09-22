import PermissionCategoryService from '../../../../database/postgreSQL/services/permissionCategory.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم فئات الصلاحيات
 * @module PermissionCategoriesController
 */

/**
 * الحصول على جميع فئات الصلاحيات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllPermissionCategories = async (req, res, next) => {
  try {
    let permissionCategories = await PermissionCategoryService.getAllPermissionCategories();
    permissionCategories = resolveDatabaseResult(permissionCategories);
    
    send(res, {
      success: true,
      data: permissionCategories
    }, 'تم جلب جميع فئات الصلاحيات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على فئة صلاحيات بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getPermissionCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let permissionCategory = await PermissionCategoryService.getPermissionCategoryById(id);
    permissionCategory = resolveDatabaseResult(permissionCategory);
    
    let status = 200;
    if (permissionCategory.length < 1) status = 404;

    send(res, {
      success: true,
      data: permissionCategory
    }, 'تم جلب فئة الصلاحيات بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء فئة صلاحيات جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createPermissionCategory = async (req, res, next) => {
  try {
    const permissionCategoryData = req.body;

    let newPermissionCategory = await PermissionCategoryService.createPermissionCategory(permissionCategoryData);
    newPermissionCategory = resolveDatabaseResult(newPermissionCategory);
    
    send(res, {
      success: true,
      data: newPermissionCategory
    }, 'تم إنشاء فئة الصلاحيات بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث فئة الصلاحيات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updatePermissionCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedPermissionCategory = await PermissionCategoryService.updatePermissionCategory(id, updateData);
    updatedPermissionCategory = resolveDatabaseResult(updatedPermissionCategory);
    
    send(res, {
      success: true,
      data: updatedPermissionCategory
    }, 'تم تحديث فئة الصلاحيات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف فئة الصلاحيات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deletePermissionCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await PermissionCategoryService.deletePermissionCategory(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف فئة الصلاحيات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};