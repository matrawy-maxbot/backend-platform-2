import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { VendorBackups } from '../models/index.js';

/**
 * خدمة إدارة نسخ البائعين الاحتياطية - VendorBackups Service
 * تحتوي على الوظائف الأساسية لإدارة النسخ الاحتياطية للبائعين
 */
class VendorBackupsService {

  /**
   * إنشاء نسخة احتياطية جديدة
   * @param {Object} backupData - بيانات النسخة الاحتياطية
   * @returns {Promise<Object>} النسخة الاحتياطية المُنشأة
   */
  static async createBackup(backupData) {
    try {
      if (!backupData.vendor_id || !backupData.backup_name || !backupData.file_path) {
        throw new Error('معرف البائع واسم النسخة ومسار الملف مطلوبة');
      }

      const newBackup = await mDBinsert(VendorBackups, backupData);
      return newBackup;
    } catch (error) {
      throw new Error(`خطأ في إنشاء النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * الحصول على نسخة احتياطية بالمعرف
   * @param {string} backupId - معرف النسخة الاحتياطية
   * @returns {Promise<Object|null>} النسخة الاحتياطية
   */
  static async getBackupById(backupId) {
    try {
      const backup = await mDBselectAll({
        model: VendorBackups,
        filter: { _id: backupId }
      });
      return backup;
    } catch (error) {
      throw new Error(`خطأ في جلب النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع النسخ الاحتياطية لبائع
   * @param {number} vendorId - معرف البائع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة النسخ الاحتياطية
   */
  static async getVendorBackups(vendorId, options = {}) {
    try {
      const { status, backup_type, limit = 50, sort = { created_at: -1 } } = options;
      
      const filter = { vendor_id: vendorId };
      if (status) filter.status = status;
      if (backup_type) filter.backup_type = backup_type;

      const backups = await mDBselectAll({
        model: VendorBackups,
        filter,
        sort,
        limit
      });
      return backups;
    } catch (error) {
      throw new Error(`خطأ في جلب نسخ البائع الاحتياطية: ${error.message}`);
    }
  }

  /**
   * تحديث حالة النسخة الاحتياطية
   * @param {string} backupId - معرف النسخة الاحتياطية
   * @param {string} status - الحالة الجديدة
   * @param {Object} additionalData - بيانات إضافية للتحديث
   * @returns {Promise<Object>} النسخة المحدثة
   */
  static async updateBackupStatus(backupId, status, additionalData = {}) {
    try {
      const updateData = { status, ...additionalData };
      
      const updatedBackup = await mDBupdate({
        model: VendorBackups,
        filter: { _id: backupId },
        update: updateData
      });
      return updatedBackup;
    } catch (error) {
      throw new Error(`خطأ في تحديث حالة النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * حذف نسخة احتياطية
   * @param {string} backupId - معرف النسخة الاحتياطية
   * @returns {Promise<Object>} نتيجة الحذف
   */
  static async deleteBackup(backupId) {
    try {
      const result = await mDBdelete({
        model: VendorBackups,
        filter: { _id: backupId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية المكتملة لبائع
   * @param {number} vendorId - معرف البائع
   * @param {number} limit - عدد النتائج
   * @returns {Promise<Array>} النسخ المكتملة
   */
  static async getCompletedBackups(vendorId, limit = 10) {
    try {
      return await this.getVendorBackups(vendorId, {
        status: 'completed',
        limit,
        sort: { created_at: -1 }
      });
    } catch (error) {
      throw new Error(`خطأ في جلب النسخ المكتملة: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية الفاشلة لبائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Array>} النسخ الفاشلة
   */
  static async getFailedBackups(vendorId) {
    try {
      return await this.getVendorBackups(vendorId, {
        status: 'failed',
        sort: { created_at: -1 }
      });
    } catch (error) {
      throw new Error(`خطأ في جلب النسخ الفاشلة: ${error.message}`);
    }
  }

  /**
   * حذف النسخ الاحتياطية القديمة لبائع
   * @param {number} vendorId - معرف البائع
   * @param {number} retentionDays - عدد أيام الاحتفاظ
   * @returns {Promise<Object>} نتيجة الحذف
   */
  static async deleteOldBackups(vendorId, retentionDays = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const result = await mDBdelete({
        model: VendorBackups,
        filter: {
          vendor_id: vendorId,
          created_at: { $lt: cutoffDate },
          status: { $in: ['completed', 'failed'] }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف النسخ القديمة: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات النسخ الاحتياطية لبائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object>} إحصائيات النسخ
   */
  static async getBackupStats(vendorId) {
    try {
      const allBackups = await this.getVendorBackups(vendorId, { limit: 1000 });
      
      const stats = {
        total: allBackups.length,
        completed: allBackups.filter(b => b.status === 'completed').length,
        failed: allBackups.filter(b => b.status === 'failed').length,
        pending: allBackups.filter(b => b.status === 'pending').length,
        in_progress: allBackups.filter(b => b.status === 'in_progress').length,
        total_size: allBackups.reduce((sum, b) => sum + (b.file_size || 0), 0),
        last_backup: allBackups.find(b => b.status === 'completed')
      };

      return stats;
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات النسخ: ${error.message}`);
    }
  }
}

export default VendorBackupsService;