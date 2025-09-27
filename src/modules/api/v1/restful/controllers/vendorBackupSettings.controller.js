import { VendorBackupSettingsService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم إعدادات النسخ الاحتياطية للبائعين
 * @module VendorBackupSettingsController
 */

/**
 * الحصول على جميع إعدادات النسخ الاحتياطية للبائعين
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorBackupSettings = async (req, res, next) => {
  try {
    let vendorBackupSettings = await VendorBackupSettingsService.getAllVendorBackupSettings();
    vendorBackupSettings = resolveDatabaseResult(vendorBackupSettings);
    
    send(res, {
      success: true,
      data: vendorBackupSettings
    }, 'تم جلب جميع إعدادات النسخ الاحتياطية للبائعين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات النسخ الاحتياطية للبائع بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorBackupSettingsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let vendorBackupSettings = await VendorBackupSettingsService.getBackupSettings(id);
    vendorBackupSettings = resolveDatabaseResult(vendorBackupSettings);
    
    let status = 200;
    if (!vendorBackupSettings || (Array.isArray(vendorBackupSettings) && vendorBackupSettings.length < 1)) status = 404;

    send(res, {
      success: true,
      data: vendorBackupSettings
    }, 'تم جلب إعدادات النسخ الاحتياطية للبائع بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات نسخ احتياطية جديدة للبائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorBackupSettings = async (req, res, next) => {
  try {
    const vendorBackupSettingsData = req.body;

    let newVendorBackupSettings = await VendorBackupSettingsService.createBackupSettings(vendorBackupSettingsData);
    newVendorBackupSettings = resolveDatabaseResult(newVendorBackupSettings);
    
    send(res, {
      success: true,
      data: newVendorBackupSettings
    }, 'تم إنشاء إعدادات النسخ الاحتياطية للبائع بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات النسخ الاحتياطية للبائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorBackupSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedVendorBackupSettings = await VendorBackupSettingsService.updateBackupSettings(id, updateData);
    updatedVendorBackupSettings = resolveDatabaseResult(updatedVendorBackupSettings);
    
    send(res, {
      success: true,
      data: updatedVendorBackupSettings
    }, 'تم تحديث إعدادات النسخ الاحتياطية للبائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات النسخ الاحتياطية للبائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorBackupSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorBackupSettingsService.deleteBackupSettings(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف إعدادات النسخ الاحتياطية للبائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};