import { VendorSettingsService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم إعدادات البائعين
 * @module VendorSettingsController
 */

/**
 * الحصول على جميع إعدادات البائعين
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorSettings = async (req, res, next) => {
  try {
    let vendorSettings = await VendorSettingsService.getActiveVendors();
    vendorSettings = resolveDatabaseResult(vendorSettings);
    
    send(res, {
      success: true,
      data: vendorSettings
    }, 'تم جلب جميع إعدادات البائعين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات بائع بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorSettingsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let vendorSettings = await VendorSettingsService.getVendorSettings(id);
    vendorSettings = resolveDatabaseResult(vendorSettings);
    
    let status = 200;
    if (!vendorSettings || (Array.isArray(vendorSettings) && vendorSettings.length < 1)) status = 404;

    send(res, {
      success: true,
      data: vendorSettings
    }, 'تم جلب إعدادات البائع بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات بائع جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorSettings = async (req, res, next) => {
  try {
    const vendorSettingsData = req.body;

    let newVendorSettings = await VendorSettingsService.createVendorSettings(vendorSettingsData);
    newVendorSettings = resolveDatabaseResult(newVendorSettings);
    
    send(res, {
      success: true,
      data: newVendorSettings
    }, 'تم إنشاء إعدادات البائع بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات البائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedVendorSettings = await VendorSettingsService.updateVendorSettings(id, updateData);
    updatedVendorSettings = resolveDatabaseResult(updatedVendorSettings);
    
    send(res, {
      success: true,
      data: updatedVendorSettings
    }, 'تم تحديث إعدادات البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات البائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorSettingsService.deleteVendorSettings(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف إعدادات البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};