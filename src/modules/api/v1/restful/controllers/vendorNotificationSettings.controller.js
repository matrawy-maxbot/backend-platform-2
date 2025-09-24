import VendorNotificationSettingsService from '../../../../database/mongoDB/services/VendorNotificationSettings.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم إعدادات إشعارات البائع
 * @module VendorNotificationSettingsController
 */

/**
 * الحصول على جميع إعدادات إشعارات البائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorNotificationSettings = async (req, res, next) => {
  try {
    let vendorNotificationSettings = await VendorNotificationSettingsService.getAllVendorNotificationSettings();
    vendorNotificationSettings = resolveDatabaseResult(vendorNotificationSettings);
    
    send(res, {
      success: true,
      data: vendorNotificationSettings
    }, 'تم جلب جميع إعدادات إشعارات البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات إشعارات البائع بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorNotificationSettingsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let vendorNotificationSettings = await VendorNotificationSettingsService.getVendorNotificationSettingsById(id);
    vendorNotificationSettings = resolveDatabaseResult(vendorNotificationSettings);
    
    let status = 200;
    if (vendorNotificationSettings.length < 1) status = 404;

    send(res, {
      success: true,
      data: vendorNotificationSettings
    }, 'تم جلب إعدادات إشعارات البائع بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات إشعارات بائع جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorNotificationSettings = async (req, res, next) => {
  try {
    const vendorNotificationSettingsData = req.body;

    let newVendorNotificationSettings = await VendorNotificationSettingsService.createVendorNotificationSettings(vendorNotificationSettingsData);
    newVendorNotificationSettings = resolveDatabaseResult(newVendorNotificationSettings);
    
    send(res, {
      success: true,
      data: newVendorNotificationSettings
    }, 'تم إنشاء إعدادات إشعارات البائع بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات إشعارات البائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorNotificationSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedVendorNotificationSettings = await VendorNotificationSettingsService.updateVendorNotificationSettings(id, updateData);
    updatedVendorNotificationSettings = resolveDatabaseResult(updatedVendorNotificationSettings);
    
    send(res, {
      success: true,
      data: updatedVendorNotificationSettings
    }, 'تم تحديث إعدادات إشعارات البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات إشعارات البائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorNotificationSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorNotificationSettingsService.deleteVendorNotificationSettings(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف إعدادات إشعارات البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};