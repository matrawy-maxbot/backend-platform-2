import VendorCompanySettingsService from '../../../../database/mongoDB/services/VendorCompanySettings.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم إعدادات شركات البائعين
 * @module VendorCompanySettingsController
 */

/**
 * الحصول على جميع إعدادات الشركات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorCompanySettings = async (req, res, next) => {
  try {
    let settings = await VendorCompanySettingsService.getActiveCompanies();
    settings = resolveDatabaseResult(settings);
    
    send(res, {
      success: true,
      data: settings
    }, 'تم جلب جميع إعدادات الشركات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات شركة بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorCompanySettingsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let settings = await VendorCompanySettingsService.getCompanySettings(id);
    settings = resolveDatabaseResult(settings);
    
    let status = 200;
    if (!settings) status = 404;

    send(res, {
      success: true,
      data: settings
    }, 'تم جلب إعدادات الشركة بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات شركة جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorCompanySettings = async (req, res, next) => {
  try {
    const settingsData = req.body;

    let newSettings = await VendorCompanySettingsService.createCompanySettings(settingsData);
    newSettings = resolveDatabaseResult(newSettings);
    
    send(res, {
      success: true,
      data: newSettings
    }, 'تم إنشاء إعدادات الشركة بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات الشركة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorCompanySettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedSettings = await VendorCompanySettingsService.updateCompanySettings(id, updateData);
    updatedSettings = resolveDatabaseResult(updatedSettings);
    
    send(res, {
      success: true,
      data: updatedSettings
    }, 'تم تحديث إعدادات الشركة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات الشركة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorCompanySettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorCompanySettingsService.deleteCompanySettings(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف إعدادات الشركة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};