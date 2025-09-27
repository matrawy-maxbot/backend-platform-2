import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { VendorCompanySettings } from '../models/index.js';

/**
 * خدمة إدارة إعدادات شركات البائعين - VendorCompanySettings Service
 * تحتوي على الوظائف الأساسية لإدارة إعدادات الشركات التابعة للبائعين
 */
class VendorCompanySettingsService {

  /**
   * إنشاء إعدادات شركة بائع جديدة
   * @param {Object} companySettingsData - بيانات إعدادات الشركة
   * @returns {Promise<Object>} الإعدادات المُنشأة
   */
  static async createCompanySettings(companySettingsData) {
    try {
      if (!companySettingsData.vendor_id || !companySettingsData.company_name) {
        throw new Error('معرف البائع واسم الشركة مطلوبان');
      }

      const newCompanySettings = await mDBinsert(VendorCompanySettings, companySettingsData);
      return newCompanySettings;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات الشركة: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات شركة بائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object|null>} إعدادات الشركة
   */
  static async getCompanySettings(vendorId) {
    try {
      const settings = await mDBselectAll({
        model: VendorCompanySettings,
        filter: { vendor_id: vendorId }
      });
      return settings;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات الشركة: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات شركة بائع
   * @param {number} vendorId - معرف البائع
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateCompanySettings(vendorId, updateData) {
    try {
      const updatedSettings = await mDBupdate(
        VendorCompanySettings,
        { vendor_id: vendorId },
        updateData
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الشركة: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات شركة بائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Object>} نتيجة الحذف
   */
  static async deleteCompanySettings(vendorId) {
    try {
      const result = await mDBdelete(VendorCompanySettings, { vendor_id: vendorId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات الشركة: ${error.message}`);
    }
  }

  /**
   * تحديث معلومات الشركة الأساسية
   * @param {number} vendorId - معرف البائع
   * @param {Object} companyInfo - معلومات الشركة
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateCompanyInfo(vendorId, companyInfo) {
    try {
      const updateData = {
        company_name: companyInfo.company_name,
        company_description: companyInfo.company_description,
        company_logo: companyInfo.company_logo,
        company_website: companyInfo.company_website
      };

      const updatedSettings = await mDBupdate(
        VendorCompanySettings,
        { vendor_id: vendorId },
        updateData
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث معلومات الشركة: ${error.message}`);
    }
  }

  /**
   * تحديث معلومات الاتصال
   * @param {number} vendorId - معرف البائع
   * @param {Object} contactInfo - معلومات الاتصال
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateContactInfo(vendorId, contactInfo) {
    try {
      const updateData = {
        contact_email: contactInfo.contact_email,
        contact_phone: contactInfo.contact_phone,
        contact_address: contactInfo.contact_address,
        support_email: contactInfo.support_email,
        support_phone: contactInfo.support_phone
      };

      const updatedSettings = await mDBupdate(
        VendorCompanySettings,
        { vendor_id: vendorId },
        updateData
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث معلومات الاتصال: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الأعمال
   * @param {number} vendorId - معرف البائع
   * @param {Object} businessSettings - إعدادات الأعمال
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateBusinessSettings(vendorId, businessSettings) {
    try {
      const updatedSettings = await mDBupdate(
        VendorCompanySettings,
        { vendor_id: vendorId },
        { business_settings: businessSettings }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الأعمال: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الشحن
   * @param {number} vendorId - معرف البائع
   * @param {Object} shippingSettings - إعدادات الشحن
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateShippingSettings(vendorId, shippingSettings) {
    try {
      const updatedSettings = await mDBupdate(
        VendorCompanySettings,
        { vendor_id: vendorId },
        { shipping_settings: shippingSettings }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الشحن: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الدفع
   * @param {number} vendorId - معرف البائع
   * @param {Object} paymentSettings - إعدادات الدفع
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updatePaymentSettings(vendorId, paymentSettings) {
    try {
      const updatedSettings = await mDBupdate(
        VendorCompanySettings,
        { vendor_id: vendorId },
        { payment_settings: paymentSettings }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الدفع: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع الشركات المفعلة
   * @returns {Promise<Array>} قائمة الشركات المفعلة
   */
  static async getActiveCompanies() {
    try {
      const activeCompanies = await mDBselectAll({
        model: VendorCompanySettings,
        filter: { is_active: true }
      });
      return activeCompanies || [];
    } catch (error) {
      throw new Error(`خطأ في جلب الشركات المفعلة: ${error.message}`);
    }
  }

  /**
   * البحث عن الشركات حسب الاسم
   * @param {string} companyName - اسم الشركة
   * @returns {Promise<Array>} قائمة الشركات المطابقة
   */
  static async searchCompaniesByName(companyName) {
    try {
      const companies = await mDBselectAll({
        model: VendorCompanySettings,
        filter: { 
          company_name: { $regex: companyName, $options: 'i' }
        }
      });
      return companies || [];
    } catch (error) {
      throw new Error(`خطأ في البحث عن الشركات: ${error.message}`);
    }
  }

  /**
   * تفعيل أو إلغاء تفعيل شركة
   * @param {number} vendorId - معرف البائع
   * @param {boolean} isActive - حالة التفعيل
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async toggleCompanyStatus(vendorId, isActive) {
    try {
      const updatedSettings = await mDBupdate(
        VendorCompanySettings,
        { vendor_id: vendorId },
        { is_active: isActive }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تغيير حالة الشركة: ${error.message}`);
    }
  }

  /**
   * تحديث حالة التحقق من الشركة
   * @param {number} vendorId - معرف البائع
   * @param {boolean} isVerified - حالة التحقق
   * @returns {Promise<Object>} الإعدادات المحدثة
   */
  static async updateVerificationStatus(vendorId, isVerified) {
    try {
      const updatedSettings = await mDBupdate(
        VendorCompanySettings,
        { vendor_id: vendorId },
        { is_verified: isVerified }
      );
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث حالة التحقق: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الشركات
   * @returns {Promise<Object>} إحصائيات الشركات
   */
  static async getCompanyStatistics() {
    try {
      const totalCompanies = await VendorCompanySettings.countDocuments();
      const activeCompanies = await VendorCompanySettings.countDocuments({ is_active: true });
      const verifiedCompanies = await VendorCompanySettings.countDocuments({ is_verified: true });

      return {
        total_companies: totalCompanies,
        active_companies: activeCompanies,
        verified_companies: verifiedCompanies,
        inactive_companies: totalCompanies - activeCompanies
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات الشركات: ${error.message}`);
    }
  }
}

export default VendorCompanySettingsService;