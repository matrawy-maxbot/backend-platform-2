import { VendorService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم في عمليات المتاجر
 * @module VendorsController
 */

/**
 * الحصول على جميع المتاجر
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendors = async (req, res, next) => {
  try {
    let result = await VendorService.getAllVendors();
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم الحصول على جميع المتاجر بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على متجر بواسطة المعرف
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let vendor = await VendorService.getVendorById(id);
    vendor = resolveDatabaseResult(vendor);

    console.log("vendor result : ", vendor);
    
    let status = 200;
    if (vendor.length < 1) status = 404;

    send(res, {
      success: true,
      data: vendor
    }, 'تم الحصول على المتجر بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء متجر جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendor = async (req, res, next) => {
  try {
    let result = await VendorService.createVendor(req.body);
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم إنشاء المتجر بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث متجر موجود
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorService.updateVendor(id, req.body);
    result = resolveDatabaseResult(result);
    send(res, { success: true, data: result }, 'تم تحديث المتجر بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف متجر
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorService.deleteVendor(id);
    result = resolveDatabaseResult(result);

    send(res, { success: true, data: result }, 'تم حذف المتجر بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};