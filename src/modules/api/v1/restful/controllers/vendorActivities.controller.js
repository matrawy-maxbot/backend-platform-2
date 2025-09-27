import { VendorActivitiesService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم في عمليات أنشطة البائعين
 * @module VendorActivitiesController
 */

/**
 * الحصول على جميع أنشطة البائعين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorActivities = async (req, res, next) => {
  try {
    let result = await VendorActivitiesService.getAllVendorActivities();
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم الحصول على جميع أنشطة البائعين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على نشاط بائع بواسطة المعرف
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let vendorActivity = await VendorActivitiesService.getVendorActivityById(id);
    vendorActivity = resolveDatabaseResult(vendorActivity);
    
    let status = 200;
    if (vendorActivity.length < 1) status = 404;

    send(res, {
      success: true,
      data: vendorActivity
    }, 'تم الحصول على نشاط البائع بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء نشاط بائع جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorActivity = async (req, res, next) => {
  try {
    let result = await VendorActivitiesService.createVendorActivity(req.body);
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم إنشاء نشاط البائع بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث نشاط بائع موجود
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorActivitiesService.updateVendorActivity(id, req.body);
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم تحديث نشاط البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف نشاط بائع
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorActivitiesService.deleteVendorActivity(id);
    result = resolveDatabaseResult(result);

    send(res, { success: true, data: result }, 'تم حذف نشاط البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};