import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll, mDBselectOne } from '../config/mongodb.manager.js';
import { VendorBackupSettings } from '../models/index.js';

/**
 * خدمة إدارة إعدادات النسخ الاحتياطية للبائعين - VendorBackupSettings Service
 * تحتوي على الوظائف الأساسية لإدارة إعدادات النسخ الاحتياطية
 */
class VendorBackupSettingsService {

  /**
   * إنشاء إعدادات النسخ الاحتياطية لبائع جديد
   * @param {Object} settingsData - بيانات الإعدادات
   * @returns {Promise<Object>} الإعدادات المُنشأة
   */
  static async createBackupSettings(settingsData) {
    try {
      if (!settingsData.vendor_id) {
        throw new Error('معرف البائع مطلوب');
      }

      // التحقق من عدم وجود إعدادات مسبقة للبائع
      const existingSettings = await this.getBackupSettings(settingsData.vendor_id);
      if (existingSettings) {
        throw new Error('إعدادات النسخ الاحتياطية للبائع موجودة مسبقاً');
      }

      // إضافة الإعدادات الافتراضية
      const defaultSettings = {
        auto_backup: true,
        backup_frequency: 'daily',
        backup_time: '02:00',
        retention_period: 30,
        max_backups: 10,
        storage: {
          type: 'local'
        },
        performance: {
          compression_level: 6,
          split_files: false
        },
        notifications: {
          on_success: true,
          on_failure: true,
          on_warning: true,
          email_notifications: []
        },
        advanced: {
          include_media: true,
          include_database: true,
          include_logs: false,
          backup_before_update: true
        },
        ...settingsData
      };

      const newSettings = await mDBinsert(VendorBackupSettings, defaultSettings);
      return newSettings;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات النسخ الاحتياطية: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات النسخ الاحتياطية لبائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object|null>} إعدادات النسخ الاحتياطية
   */
  static async getBackupSettings(vendorId) {
    try {
      const settings = await mDBselectOne({
        model: VendorBackupSettings,
        filter: { vendor_id: vendorId }
      });
      return settings;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات النسخ الاحتياطية: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات النسخ الاحتياطية
   * @param {number} vendorId - معرف البائع
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateBackupSettings(vendorId, updateData) {
    try {
      const updatedSettings = await mDBupdate({
        model: VendorBackupSettings,
        filter: { vendor_id: vendorId },
        update: updateData
      });
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات النسخ الاحتياطية: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات التخزين
   * @param {number} vendorId - معرف البائع
   * @param {Object} storageSettings - إعدادات التخزين
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateStorageSettings(vendorId, storageSettings) {
    try {
      const updateData = { storage: storageSettings };
      return await this.updateBackupSettings(vendorId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات التخزين: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الأداء
   * @param {number} vendorId - معرف البائع
   * @param {Object} performanceSettings - إعدادات الأداء
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updatePerformanceSettings(vendorId, performanceSettings) {
    try {
      const updateData = { performance: performanceSettings };
      return await this.updateBackupSettings(vendorId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الأداء: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الإشعارات
   * @param {number} vendorId - معرف البائع
   * @param {Object} notificationSettings - إعدادات الإشعارات
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateNotificationSettings(vendorId, notificationSettings) {
    try {
      const updateData = { notifications: notificationSettings };
      return await this.updateBackupSettings(vendorId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الإشعارات: ${error.message}`);
    }
  }

  /**
   * تحديث الإعدادات المتقدمة
   * @param {number} vendorId - معرف البائع
   * @param {Object} advancedSettings - الإعدادات المتقدمة
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateAdvancedSettings(vendorId, advancedSettings) {
    try {
      const updateData = { advanced: advancedSettings };
      return await this.updateBackupSettings(vendorId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تحديث الإعدادات المتقدمة: ${error.message}`);
    }
  }

  /**
   * تفعيل أو إلغاء تفعيل النسخ التلقائي
   * @param {number} vendorId - معرف البائع
   * @param {boolean} enabled - حالة التفعيل
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async toggleAutoBackup(vendorId, enabled) {
    try {
      const updateData = { auto_backup: enabled };
      return await this.updateBackupSettings(vendorId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تغيير حالة النسخ التلقائي: ${error.message}`);
    }
  }

  /**
   * تحديث معلومات آخر نسخة احتياطية
   * @param {number} vendorId - معرف البائع
   * @param {Object} lastBackupInfo - معلومات آخر نسخة
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateLastBackupInfo(vendorId, lastBackupInfo) {
    try {
      const updateData = { last_backup: lastBackupInfo };
      return await this.updateBackupSettings(vendorId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تحديث معلومات آخر نسخة احتياطية: ${error.message}`);
    }
  }

  /**
   * تحديث موعد النسخة الاحتياطية التالية
   * @param {number} vendorId - معرف البائع
   * @param {Date} nextBackupDate - موعد النسخة التالية
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateNextBackupDate(vendorId, nextBackupDate) {
    try {
      const updateData = { next_backup: nextBackupDate };
      return await this.updateBackupSettings(vendorId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تحديث موعد النسخة التالية: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات النسخ الاحتياطية لبائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object>} نتيجة الحذف
   */
  static async deleteBackupSettings(vendorId) {
    try {
      const result = await mDBdelete({
        model: VendorBackupSettings,
        filter: { vendor_id: vendorId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات النسخ الاحتياطية: ${error.message}`);
    }
  }

  /**
   * الحصول على البائعين الذين لديهم نسخ تلقائي مفعل
   * @returns {Promise<Array>} قائمة البائعين
   */
  static async getVendorsWithAutoBackup() {
    try {
      const vendors = await mDBselectAll({
        model: VendorBackupSettings,
        filter: { auto_backup: true },
        select: 'vendor_id backup_frequency backup_time next_backup'
      });
      return vendors;
    } catch (error) {
      throw new Error(`خطأ في جلب البائعين مع النسخ التلقائي: ${error.message}`);
    }
  }

  /**
   * إعادة تعيين الإعدادات للقيم الافتراضية
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async resetToDefaults(vendorId) {
    try {
      const defaultSettings = {
        auto_backup: true,
        backup_frequency: 'daily',
        backup_time: '02:00',
        retention_period: 30,
        max_backups: 10,
        storage: {
          type: 'local'
        },
        performance: {
          compression_level: 6,
          split_files: false
        },
        notifications: {
          on_success: true,
          on_failure: true,
          on_warning: true,
          email_notifications: []
        },
        advanced: {
          include_media: true,
          include_database: true,
          include_logs: false,
          backup_before_update: true
        }
      };

      return await this.updateBackupSettings(vendorId, defaultSettings);
    } catch (error) {
      throw new Error(`خطأ في إعادة تعيين الإعدادات: ${error.message}`);
    }
  }
}

export default VendorBackupSettingsService;