import VendorSiteSettingService from '../../../../database/postgreSQL/services/VendorSiteSetting.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم إعدادات مواقع المتاجر
 * @module VendorSiteSettingsController
 */

/**
 * الحصول على جميع إعدادات مواقع المتاجر
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorSiteSettings = async (req, res, next) => {
  try {
    let vendorSiteSettings = await VendorSiteSettingService.getAllVendorSiteSettings();
    vendorSiteSettings = resolveDatabaseResult(vendorSiteSettings);
    
    send(res, {
      success: true,
      data: vendorSiteSettings
    }, 'تم جلب جميع إعدادات مواقع المتاجر بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات موقع متجر بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorSiteSettingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let vendorSiteSetting = await VendorSiteSettingService.getVendorSiteSettingById(id);
    vendorSiteSetting = resolveDatabaseResult(vendorSiteSetting);
    
    let status = 200;
    if (vendorSiteSetting.length < 1) status = 404;

    send(res, {
      success: true,
      data: vendorSiteSetting
    }, 'تم جلب إعدادات موقع المتجر بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات موقع متجر جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorSiteSetting = async (req, res, next) => {
  try {
    const vendorSiteSettingData = req.body;

    let newVendorSiteSetting = await VendorSiteSettingService.createVendorSiteSetting(vendorSiteSettingData);
    newVendorSiteSetting = resolveDatabaseResult(newVendorSiteSetting);
    
    send(res, {
      success: true,
      data: newVendorSiteSetting
    }, 'تم إنشاء إعدادات موقع المتجر بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات موقع المتجر
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorSiteSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedVendorSiteSetting = await VendorSiteSettingService.updateVendorSiteSetting(id, updateData);
    updatedVendorSiteSetting = resolveDatabaseResult(updatedVendorSiteSetting);
    
    send(res, {
      success: true,
      data: updatedVendorSiteSetting
    }, 'تم تحديث إعدادات موقع المتجر بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات موقع المتجر
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorSiteSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorSiteSettingService.deleteVendorSiteSetting(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف إعدادات موقع المتجر بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};