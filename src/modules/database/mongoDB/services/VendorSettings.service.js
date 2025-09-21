import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll, mDBselectOne } from '../config/mongodb.manager.js';
import { VendorSettings } from '../models/index.js';

/**
 * خدمة إدارة إعدادات البائعين - VendorSettings Service
 * تحتوي على الوظائف الأساسية لإدارة إعدادات البائعين
 */
class VendorSettingsService {

  /**
   * إنشاء إعدادات بائع جديد
   * @param {Object} settingsData - بيانات الإعدادات
   * @returns {Promise<Object>} الإعدادات المُنشأة
   */
  static async createVendorSettings(settingsData) {
    try {
      if (!settingsData.vendor_id) {
        throw new Error('معرف البائع مطلوب');
      }

      // التحقق من عدم وجود إعدادات مسبقة للبائع
      const existingSettings = await this.getVendorSettings(settingsData.vendor_id);
      if (existingSettings) {
        throw new Error('إعدادات البائع موجودة مسبقاً');
      }

      const newSettings = await mDBinsert(VendorSettings, settingsData);
      return newSettings;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات البائع: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات بائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object|null>} إعدادات البائع
   */
  static async getVendorSettings(vendorId) {
    try {
      const settings = await mDBselectOne({
        model: VendorSettings,
        filter: { vendor_id: vendorId }
      });
      return settings;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات البائع: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات بائع
   * @param {number} vendorId - معرف البائع
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateVendorSettings(vendorId, updateData) {
    try {
      const updatedSettings = await mDBupdate(
        VendorSettings,
        { vendor_id: vendorId },
        updateData
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات البائع: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات بائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object>} نتيجة الحذف
   */
  static async deleteVendorSettings(vendorId) {
    try {
      const result = await mDBdelete(VendorSettings, { vendor_id: vendorId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات البائع: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الإشعارات للبائع
   * @param {number} vendorId - معرف البائع
   * @param {Object} notificationSettings - إعدادات الإشعارات
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateNotificationSettings(vendorId, notificationSettings) {
    try {
      const updatedSettings = await mDBupdate(
        VendorSettings,
        { vendor_id: vendorId },
        { notification_settings: notificationSettings }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الإشعارات: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الخصوصية للبائع
   * @param {number} vendorId - معرف البائع
   * @param {Object} privacySettings - إعدادات الخصوصية
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updatePrivacySettings(vendorId, privacySettings) {
    try {
      const updatedSettings = await mDBupdate(
        VendorSettings,
        { vendor_id: vendorId },
        { privacy_settings: privacySettings }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الخصوصية: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الأمان للبائع
   * @param {number} vendorId - معرف البائع
   * @param {Object} securitySettings - إعدادات الأمان
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateSecuritySettings(vendorId, securitySettings) {
    try {
      const updatedSettings = await mDBupdate(
        VendorSettings,
        { vendor_id: vendorId },
        { security_settings: securitySettings }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الأمان: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات العرض للبائع
   * @param {number} vendorId - معرف البائع
   * @param {Object} displaySettings - إعدادات العرض
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateDisplaySettings(vendorId, displaySettings) {
    try {
      const updatedSettings = await mDBupdate(
        VendorSettings,
        { vendor_id: vendorId },
        { display_settings: displaySettings }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات العرض: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع البائعين النشطين
   * @returns {Promise<Array>} قائمة البائعين النشطين
   */
  static async getActiveVendors() {
    try {
      const activeVendors = await mDBselectAll({
        model: VendorSettings,
        filter: { is_active: true }
      });
      return activeVendors || [];
    } catch (error) {
      throw new Error(`خطأ في جلب البائعين النشطين: ${error.message}`);
    }
  }

  /**
   * تفعيل أو إلغاء تفعيل بائع
   * @param {number} vendorId - معرف البائع
   * @param {boolean} isActive - حالة التفعيل
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async toggleVendorStatus(vendorId, isActive) {
    try {
      const updatedSettings = await mDBupdate(
        VendorSettings,
        { vendor_id: vendorId },
        { is_active: isActive }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تغيير حالة البائع: ${error.message}`);
    }
  }

  /**
   * إعادة تعيين إعدادات البائع للافتراضية
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async resetToDefaults(vendorId) {
    try {
      const defaultSettings = {
        notification_settings: {
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true
        },
        privacy_settings: {
          profile_visibility: 'public',
          contact_visibility: 'registered_users'
        },
        security_settings: {
          two_factor_enabled: false,
          login_alerts: true
        },
        display_settings: {
          language: 'ar',
          theme: 'light',
          timezone: 'Asia/Riyadh'
        }
      };

      const updatedSettings = await mDBupdate(
        VendorSettings,
        { vendor_id: vendorId },
        defaultSettings
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في إعادة تعيين الإعدادات: ${error.message}`);
    }
  }
}

export default VendorSettingsService;