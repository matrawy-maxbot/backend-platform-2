import BackupService from '../../../../database/mongoDB/services/backup.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة النسخ الاحتياطية - Backup Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة النسخ الاحتياطية
 * Contains all operations related to backup management
 */

/**
 * الحصول على جميع النسخ الاحتياطية
 * Get all backups
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllBackups = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [backups, error] = await BackupService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(backups);

    send(res, { success: true, data: result }, 'تم جلب النسخ الاحتياطية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على نسخة احتياطية بواسطة المعرف
 * Get backup by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getBackupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [backup, error] = await BackupService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(backup);
    send(res, { success: true, data: result }, 'تم جلب النسخة الاحتياطية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على النسخ الاحتياطية بواسطة معرف الخادم
 * Get backups by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getBackupsByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [backups, error] = await BackupService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(backups);
    send(res, { success: true, data: result }, 'تم جلب النسخ الاحتياطية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء نسخة احتياطية جديدة
 * Create new backup
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createBackup = async (req, res, next) => {
  try {
    const backupData = req.body;
    
    const [backup, error] = await BackupService.create(backupData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(backup);
    send(res, { success: true, data: result }, 'تم إنشاء النسخة الاحتياطية بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف النسخة الاحتياطية
 * Delete backup
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteBackup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { serverId } = req.body;
    
    const [result, error] = await BackupService.delete(id, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف النسخة الاحتياطية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};