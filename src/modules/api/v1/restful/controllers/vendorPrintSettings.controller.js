import VendorPrintSettingsService from '../../../../database/mongoDB/services/VendorPrintSettings.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم إعدادات الطباعة للبائعين
 * @module VendorPrintSettingsController
 */

/**
 * الحصول على جميع إعدادات الطباعة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorPrintSettings = async (req, res, next) => {
  try {
    let settings = await VendorPrintSettingsService.getAllSettings();
    settings = resolveDatabaseResult(settings);
    
    send(res, {
      success: true,
      data: settings
    }, 'تم جلب جميع إعدادات الطباعة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات الطباعة بمعرف البائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorPrintSettingsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let settings = await VendorPrintSettingsService.getSettings(id);
    settings = resolveDatabaseResult(settings);
    
    let status = 200;
    if (!settings || (Array.isArray(settings) && settings.length < 1)) status = 404;

    send(res, {
      success: true,
      data: settings
    }, 'تم جلب إعدادات الطباعة بنجاح', status);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات طباعة جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorPrintSettings = async (req, res, next) => {
  try {
    let newSettings = await VendorPrintSettingsService.createSettings(req.body);
    newSettings = resolveDatabaseResult(newSettings);
    
    send(res, {
      success: true,
      data: newSettings
    }, 'تم إنشاء إعدادات الطباعة بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات الطباعة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorPrintSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updatedSettings = await VendorPrintSettingsService.updateSettings(id, req.body);
    updatedSettings = resolveDatabaseResult(updatedSettings);
    
    send(res, {
      success: true,
      data: updatedSettings
    }, 'تم تحديث إعدادات الطباعة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات الطباعة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorPrintSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorPrintSettingsService.deleteSettings(id);
    result = resolveDatabaseResult(result);
    
    send(res, {
      success: true,
      data: result
    }, 'تم حذف إعدادات الطباعة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};