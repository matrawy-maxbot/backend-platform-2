import { CategoryService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم الفئات
 * @module CategoriesController
 */

/**
 * الحصول على جميع الفئات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllCategories = async (req, res, next) => {
  try {
    let categories = await CategoryService.searchCategories();
    categories = resolveDatabaseResult(categories);
    
    send(res, {
      success: true,
      data: categories
    }, 'تم جلب جميع الفئات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على فئة بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category = await CategoryService.getCategoryById(id);
    category = resolveDatabaseResult(category);
    
    let status = 200;
    if (category.length < 1) status = 404;

    send(res, {
      success: true,
      data: category
    }, 'تم جلب الفئة بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء فئة جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;

    let newCategory = await CategoryService.createCategory(categoryData);
    newCategory = resolveDatabaseResult(newCategory);
    
    send(res, {
      success: true,
      data: newCategory
    }, 'تم إنشاء الفئة بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث الفئة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedCategory = await CategoryService.updateCategory(id, updateData);
    updatedCategory = resolveDatabaseResult(updatedCategory);
    
    send(res, {
      success: true,
      data: updatedCategory
    }, 'تم تحديث الفئة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف الفئة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await CategoryService.deleteCategory(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف الفئة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};