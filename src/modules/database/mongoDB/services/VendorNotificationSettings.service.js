import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { VendorNotificationSettings } from '../models/index.js';

/**
 * خدمة إدارة إعدادات إشعارات البائعين
 * VendorNotificationSettings Service
 */
class VendorNotificationSettingsService {

  /**
   * إنشاء إعدادات إشعارات جديدة للبائع
   * @param {Object} settingsData - بيانات الإعدادات
   * @returns {Promise<Object>} الإعدادات المُنشأة
   */
  static async createSettings(settingsData) {
    try {
      if (!settingsData.vendor_id) {
        throw new Error('معرف البائع مطلوب');
      }

      const newSettings = await mDBinsert(VendorNotificationSettings, settingsData);
      return newSettings;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات الإشعارات: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات إشعارات البائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object|null>} إعدادات الإشعارات أو null
   */
  static async getSettings(vendorId) {
    try {
      const settings = await mDBselectAll(VendorNotificationSettings, { vendor_id: vendorId });
      return settings && settings.length > 0 ? settings[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات الإشعارات: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات إشعارات البائع
   * @param {number} vendorId - معرف البائع
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateSettings(vendorId, updateData) {
    try {
      const updatedSettings = await mDBupdate(
        VendorNotificationSettings, 
        { vendor_id: vendorId }, 
        updateData
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الإشعارات: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات إشعارات البائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteSettings(vendorId) {
    try {
      const result = await mDBdelete(VendorNotificationSettings, { vendor_id: vendorId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات الإشعارات: ${error.message}`);
    }
  }

  /**
   * تحديث طريقة إشعار محددة
   * @param {number} vendorId - معرف البائع
   * @param {string} method - طريقة الإشعار (email, sms, push, in_app)
   * @param {boolean} enabled - تفعيل أو إلغاء تفعيل
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateNotificationMethod(vendorId, method, enabled) {
    try {
      const updateData = {};
      updateData[`notification_methods.${method}`] = enabled;
      
      return await this.updateSettings(vendorId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تحديث طريقة الإشعار: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات إشعارات المخزون
   * @param {number} vendorId - معرف البائع
   * @param {Object} inventorySettings - إعدادات المخزون
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateInventoryNotifications(vendorId, inventorySettings) {
    try {
      return await this.updateSettings(vendorId, { 
        inventory_notifications: inventorySettings 
      });
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات إشعارات المخزون: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات إشعارات الطلبات
   * @param {number} vendorId - معرف البائع
   * @param {Object} orderSettings - إعدادات الطلبات
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateOrderNotifications(vendorId, orderSettings) {
    try {
      return await this.updateSettings(vendorId, { 
        order_notifications: orderSettings 
      });
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات إشعارات الطلبات: ${error.message}`);
    }
  }
}

export default VendorNotificationSettingsService;