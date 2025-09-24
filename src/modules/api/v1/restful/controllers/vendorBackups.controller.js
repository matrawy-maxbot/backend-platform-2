import VendorBackupsService from '../../../../database/mongoDB/services/VendorBackups.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم النسخ الاحتياطية للبائعين
 * @module VendorBackupsController
 */

/**
 * الحصول على جميع النسخ الاحتياطية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorBackups = async (req, res, next) => {
  try {
    const { vendor_id } = req.params;
    let backups = await VendorBackupsService.getVendorBackups(vendor_id);
    backups = resolveDatabaseResult(backups);
    
    send(res, {
      success: true,
      data: backups
    }, 'تم جلب جميع النسخ الاحتياطية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على نسخة احتياطية بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorBackupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let backup = await VendorBackupsService.getBackupById(id);
    backup = resolveDatabaseResult(backup);
    
    let status = 200;
    if (!backup) status = 404;

    send(res, {
      success: true,
      data: backup
    }, 'تم جلب النسخة الاحتياطية بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء نسخة احتياطية جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorBackup = async (req, res, next) => {
  try {
    const backupData = req.body;

    let newBackup = await VendorBackupsService.createBackup(backupData);
    newBackup = resolveDatabaseResult(newBackup);
    
    send(res, {
      success: true,
      data: newBackup
    }, 'تم إنشاء النسخة الاحتياطية بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث النسخة الاحتياطية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorBackup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedBackup = await VendorBackupsService.updateBackupStatus(id, updateData.status, updateData);
    updatedBackup = resolveDatabaseResult(updatedBackup);
    
    send(res, {
      success: true,
      data: updatedBackup
    }, 'تم تحديث النسخة الاحتياطية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف النسخة الاحتياطية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorBackup = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorBackupsService.deleteBackup(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف النسخة الاحتياطية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};