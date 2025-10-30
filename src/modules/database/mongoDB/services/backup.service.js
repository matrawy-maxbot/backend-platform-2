import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import Backup from '../models/Backup.model.js';

/**
 * خدمة إدارة النسخ الاحتياطية - Backup Service
 * تحتوي على جميع العمليات المتعلقة بإدارة النسخ الاحتياطية لخوادم Discord
 * Contains all operations related to backup management for Discord servers
 */
class BackupService {
  
  /**
   * الحصول على جميع النسخ الاحتياطية
   * Get all backups
   * 
   * @param {Object} options - خيارات الاستعلام / Query options
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getAll(options = {}) {
    try {
      const backups = await Backup.find().limit(options.limit || 0).skip(options.offset || 0).exec();
      
      return [backups, null];
    } catch (error) {
      console.error('خطأ في جلب النسخ الاحتياطية:', error);
      return [null, 'فشل في جلب النسخ الاحتياطية'];
    }
  }

  /**
   * الحصول على نسخة احتياطية بواسطة المعرف
   * Get backup by ID
   * 
   * @param {string} id - معرف النسخة الاحتياطية / Backup ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف النسخة الاحتياطية مطلوب'];
      }

      const backups = await mDBselectAll(Backup, { _id: id });

      return [backups[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب النسخة الاحتياطية:', error);
      return [null, 'فشل في جلب النسخة الاحتياطية'];
    }
  }

  /**
   * الحصول على النسخ الاحتياطية بواسطة معرف الخادم
   * Get backups by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const backups = await mDBselectAll(Backup, { server_id: serverId });

      return [backups, null];
    } catch (error) {
      console.error('خطأ في جلب النسخ الاحتياطية للخادم:', error);
      return [null, 'فشل في جلب النسخ الاحتياطية للخادم'];
    }
  }

  /**
   * إنشاء نسخة احتياطية جديدة
   * Create new backup
   * 
   * @param {Object} backupData - بيانات النسخة الاحتياطية / Backup data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(backupData) {
    try {
      if (!backupData || !backupData.server_id) {
        return [null, 'بيانات النسخة الاحتياطية ومعرف الخادم مطلوبان'];
      }

      // التحقق من عدم تجاوز الحد الأقصى من عدد النسخ الاحتياطية
      const LIMIT = 5;
      const existingBackups = await mDBselectAll(Backup, { server_id: backupData.server_id });
      if (existingBackups.length >= LIMIT) {
        return [null, `لقد وصلت إلى الحد الأقصى من عدد النسخ الاحتياطية ${LIMIT}`];
      }

      mDBinsert(Backup, backupData);
      
      return [backupData, null];
    } catch (error) {
      console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
      return [null, 'فشل في إنشاء النسخة الاحتياطية'];
    }
  }

  /**
   * حذف النسخة الاحتياطية
   * Delete backup
   * 
   * @param {string} id - معرف النسخة الاحتياطية / Backup ID
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id) {
    try {
      if (!id) {
        return [null, 'معرف النسخة الاحتياطية مطلوب'];
      }

      const filter = { _id: id };
      mDBdelete(Backup, filter);
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف النسخة الاحتياطية:', error);
      return [null, 'فشل في حذف النسخة الاحتياطية'];
    }
  }

}

export default BackupService;