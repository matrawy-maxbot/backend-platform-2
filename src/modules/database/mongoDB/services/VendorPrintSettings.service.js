import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { VendorPrintSettings } from '../models/index.js';

/**
 * خدمة إدارة إعدادات الطباعة للبائعين
 * VendorPrintSettings Service
 */
class VendorPrintSettingsService {

  /**
   * إنشاء إعدادات طباعة جديدة للبائع
   * @param {Object} settingsData - بيانات الإعدادات
   * @returns {Promise<Object>} الإعدادات المُنشأة
   */
  static async createSettings(settingsData) {
    try {
      if (!settingsData.vendor_id) {
        throw new Error('معرف البائع مطلوب');
      }

      const newSettings = await mDBinsert(VendorPrintSettings, settingsData);
      return newSettings;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات الطباعة: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات طباعة البائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object|null>} إعدادات الطباعة أو null
   */
  static async getSettings(vendorId) {
    try {
      const settings = await mDBselectAll(VendorPrintSettings, { vendor_id: vendorId });
      return settings && settings.length > 0 ? settings[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات الطباعة: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات طباعة البائع
   * @param {number} vendorId - معرف البائع
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateSettings(vendorId, updateData) {
    try {
      const updatedSettings = await mDBupdate(
        VendorPrintSettings, 
        { vendor_id: vendorId }, 
        updateData
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الطباعة: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات طباعة البائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteSettings(vendorId) {
    try {
      const result = await mDBdelete(VendorPrintSettings, { vendor_id: vendorId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات الطباعة: ${error.message}`);
    }
  }

  /**
   * تحديث الإعدادات العامة للطباعة
   * @param {number} vendorId - معرف البائع
   * @param {Object} generalSettings - الإعدادات العامة
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateGeneralSettings(vendorId, generalSettings) {
    try {
      return await this.updateSettings(vendorId, { 
        general: generalSettings 
      });
    } catch (error) {
      throw new Error(`خطأ في تحديث الإعدادات العامة: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات طباعة الفواتير
   * @param {number} vendorId - معرف البائع
   * @param {Object} invoiceSettings - إعدادات الفواتير
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateInvoiceSettings(vendorId, invoiceSettings) {
    try {
      return await this.updateSettings(vendorId, { 
        invoice: invoiceSettings 
      });
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات طباعة الفواتير: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات طباعة الطلبات
   * @param {number} vendorId - معرف البائع
   * @param {Object} orderSettings - إعدادات الطلبات
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateOrderSettings(vendorId, orderSettings) {
    try {
      return await this.updateSettings(vendorId, { 
        order: orderSettings 
      });
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات طباعة الطلبات: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات طباعة التقارير
   * @param {number} vendorId - معرف البائع
   * @param {Object} reportSettings - إعدادات التقارير
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateReportSettings(vendorId, reportSettings) {
    try {
      return await this.updateSettings(vendorId, { 
        report: reportSettings 
      });
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات طباعة التقارير: ${error.message}`);
    }
  }

  /**
   * تحديث المحتوى المخصص
   * @param {number} vendorId - معرف البائع
   * @param {Object} customContent - المحتوى المخصص
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateCustomContent(vendorId, customContent) {
    try {
      return await this.updateSettings(vendorId, { 
        custom_content: customContent 
      });
    } catch (error) {
      throw new Error(`خطأ في تحديث المحتوى المخصص: ${error.message}`);
    }
  }
}

export default VendorPrintSettingsService;