import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { VendorSiteSetting, Vendor } from '../models/index.js';
import { Op } from 'sequelize';

class VendorSiteSettingService {
  /**
   * إنشاء إعدادات موقع متجر جديدة
   * @param {Object} settingData - بيانات إعدادات الموقع
   * @returns {Promise<Object>} - إعدادات الموقع المنشأة
   */
  static async createVendorSiteSetting(settingData) {
    try {
      const result = await PGinsert(VendorSiteSetting, settingData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات الموقع: ${error.message}`);
    }
  }

  /**
   * إنشاء إعدادات موقع متجر جديدة مع التحقق من البيانات
   * @param {string} vendorId - معرف المتجر
   * @param {string} siteName - اسم الموقع
   * @param {string} siteUrl - رابط الموقع
   * @param {string} siteDescription - وصف الموقع (اختياري)
   * @param {string} siteLogoUrl - رابط شعار الموقع (اختياري)
   * @param {string} siteFaviconUrl - رابط أيقونة الموقع (اختياري)
   * @param {Object} siteTheme - إعدادات تصميم الموقع (اختياري)
   * @param {Object} siteConfig - إعدادات الموقع العامة (اختياري)
   * @param {boolean} isActive - حالة تفعيل الموقع (افتراضي: true)
   * @returns {Promise<Object>} - إعدادات الموقع المنشأة
   */
  static async createVendorSiteSettingWithValidation(
    vendorId,
    siteName,
    siteUrl,
    siteDescription = null,
    siteLogoUrl = null,
    siteFaviconUrl = null,
    siteTheme = null,
    siteConfig = null,
    isActive = true
  ) {
    try {
      // التحقق من وجود المتجر
      const vendor = await Vendor.findByPk(vendorId);
      if (!vendor) {
        throw new Error('المتجر غير موجود');
      }

      // التحقق من وجود إعدادات موقع للمتجر مسبقاً
      const existingSetting = await this.getVendorSiteSettingByVendorId(vendorId);
      if (existingSetting) {
        throw new Error('المتجر لديه إعدادات موقع بالفعل');
      }

      // التحقق من عدم تكرار رابط الموقع
      const existingUrl = await this.getVendorSiteSettingBySiteUrl(siteUrl);
      if (existingUrl) {
        throw new Error('رابط الموقع مستخدم بالفعل');
      }

      const settingData = {
        vendor_id: vendorId,
        site_name: siteName,
        site_url: siteUrl,
        site_description: siteDescription,
        site_logo_url: siteLogoUrl,
        site_favicon_url: siteFaviconUrl,
        site_theme: siteTheme,
        site_config: siteConfig,
        is_active: isActive
      };

      const result = await this.createVendorSiteSetting(settingData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات الموقع: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع إعدادات المواقع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة إعدادات المواقع
   */
  static async getAllVendorSiteSettings(options = {}) {
    try {
      // استخدام VendorSiteSetting.findAll بدلاً من PGselectAll لأنها تحتوي على include وخيارات معقدة
      const result = await VendorSiteSetting.findAll({
        include: options.include || [
          {
            model: Vendor,
            as: 'vendor'
          }
        ],
        where: options.where || {},
        order: options.order || [['created_at', 'DESC']],
        limit: options.limit,
        offset: options.offset
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات المواقع: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات موقع بالمعرف
   * @param {string} settingId - معرف إعدادات الموقع
   * @returns {Promise<Object|null>} - إعدادات الموقع أو null
   */
  static async getVendorSiteSettingById(settingId) {
    try {
      const result = await VendorSiteSetting.findByPk(settingId, {
        include: [
          {
            model: Vendor,
            as: 'vendor'
          }
        ]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات الموقع: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات موقع بمعرف المتجر
   * @param {string} vendorId - معرف المتجر
   * @returns {Promise<Object|null>} - إعدادات الموقع أو null
   */
  static async getVendorSiteSettingByVendorId(vendorId) {
    try {
      const result = await VendorSiteSetting.findOne({
        where: { vendor_id: vendorId },
        include: [
          {
            model: Vendor,
            as: 'vendor'
          }
        ]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات الموقع: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات موقع برابط الموقع
   * @param {string} siteUrl - رابط الموقع
   * @returns {Promise<Object|null>} - إعدادات الموقع أو null
   */
  static async getVendorSiteSettingBySiteUrl(siteUrl) {
    try {
      const result = await VendorSiteSetting.findOne({
        where: { site_url: siteUrl }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات الموقع: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات المواقع النشطة
   * @returns {Promise<Array>} - قائمة إعدادات المواقع النشطة
   */
  static async getActiveVendorSiteSettings() {
    try {
      const result = await this.getAllVendorSiteSettings({
        where: { is_active: true }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات المواقع النشطة: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات المواقع غير النشطة
   * @returns {Promise<Array>} - قائمة إعدادات المواقع غير النشطة
   */
  static async getInactiveVendorSiteSettings() {
    try {
      const result = await this.getAllVendorSiteSettings({
        where: { is_active: false }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات المواقع غير النشطة: ${error.message}`);
    }
  }

  /**
   * البحث في إعدادات المواقع باسم الموقع
   * @param {string} siteName - اسم الموقع للبحث
   * @returns {Promise<Array>} - قائمة إعدادات المواقع المطابقة
   */
  static async searchVendorSiteSettingsBySiteName(siteName) {
    try {
      const result = await this.getAllVendorSiteSettings({
        where: {
          site_name: {
            [Op.iLike]: `%${siteName}%`
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في إعدادات المواقع: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات موقع متجر
   * @param {string} settingId - معرف إعدادات الموقع
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - إعدادات الموقع المحدثة
   */
  static async updateVendorSiteSetting(settingId, updateData) {
    try {
      // التحقق من وجود إعدادات الموقع
      const existingSetting = await this.getVendorSiteSettingById(settingId);
      if (!existingSetting) {
        throw new Error('إعدادات الموقع غير موجودة');
      }

      // التحقق من عدم تكرار رابط الموقع إذا تم تحديثه
      if (updateData.site_url && updateData.site_url !== existingSetting.site_url) {
        const existingUrl = await this.getVendorSiteSettingBySiteUrl(updateData.site_url);
        if (existingUrl) {
          throw new Error('رابط الموقع مستخدم بالفعل');
        }
      }

      const result = await PGupdate(VendorSiteSetting, updateData, { id: settingId });

      return await this.getVendorSiteSettingById(settingId);
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الموقع: ${error.message}`);
    }
  }

  /**
   * تفعيل موقع متجر
   * @param {string} settingId - معرف إعدادات الموقع
   * @returns {Promise<Object>} - إعدادات الموقع المحدثة
   */
  static async activateVendorSite(settingId) {
    try {
      const result = await this.updateVendorSiteSetting(settingId, {
        is_active: true,
        updated_at: new Date()
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تفعيل الموقع: ${error.message}`);
    }
  }

  /**
   * إلغاء تفعيل موقع متجر
   * @param {string} settingId - معرف إعدادات الموقع
   * @returns {Promise<Object>} - إعدادات الموقع المحدثة
   */
  static async deactivateVendorSite(settingId) {
    try {
      const result = await this.updateVendorSiteSetting(settingId, {
        is_active: false,
        updated_at: new Date()
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في إلغاء تفعيل الموقع: ${error.message}`);
    }
  }

  /**
   * تحديث تصميم الموقع
   * @param {string} settingId - معرف إعدادات الموقع
   * @param {Object} themeData - بيانات التصميم الجديدة
   * @returns {Promise<Object>} - إعدادات الموقع المحدثة
   */
  static async updateVendorSiteTheme(settingId, themeData) {
    try {
      const result = await this.updateVendorSiteSetting(settingId, {
        site_theme: themeData,
        updated_at: new Date()
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث تصميم الموقع: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الموقع العامة
   * @param {string} settingId - معرف إعدادات الموقع
   * @param {Object} configData - بيانات الإعدادات الجديدة
   * @returns {Promise<Object>} - إعدادات الموقع المحدثة
   */
  static async updateVendorSiteConfig(settingId, configData) {
    try {
      const result = await this.updateVendorSiteSetting(settingId, {
        site_config: configData,
        updated_at: new Date()
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الموقع: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات موقع متجر
   * @param {string} settingId - معرف إعدادات الموقع
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteVendorSiteSetting(settingId) {
    try {
      // التحقق من وجود إعدادات الموقع
      const existingSetting = await this.getVendorSiteSettingById(settingId);
      if (!existingSetting) {
        throw new Error('إعدادات الموقع غير موجودة');
      }

      const result = await PGdelete(VendorSiteSetting, { id: settingId });

      return result > 0;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات الموقع: ${error.message}`);
    }
  }

  /**
   * عد إعدادات المواقع
   * @param {Object} whereClause - شروط العد
   * @returns {Promise<number>} - عدد إعدادات المواقع
   */
  static async countVendorSiteSettings(whereClause = {}) {
    try {
      const count = await VendorSiteSetting.count({
        where: whereClause
      });
      return count;
    } catch (error) {
      throw new Error(`خطأ في عد إعدادات المواقع: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات المواقع في نطاق تاريخي
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة إعدادات المواقع في النطاق المحدد
   */
  static async getVendorSiteSettingsByDateRange(startDate, endDate) {
    try {
      const result = await this.getAllVendorSiteSettings({
        where: {
          created_at: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات المواقع بالنطاق التاريخي: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات إعدادات المواقع
   * @returns {Promise<Object>} - إحصائيات إعدادات المواقع
   */
  static async getVendorSiteSettingsStatistics() {
    try {
      const totalSettings = await this.countVendorSiteSettings();
      const activeSettings = await this.countVendorSiteSettings({ is_active: true });
      const inactiveSettings = await this.countVendorSiteSettings({ is_active: false });

      return {
        total: totalSettings,
        active: activeSettings,
        inactive: inactiveSettings,
        activePercentage: totalSettings > 0 ? ((activeSettings / totalSettings) * 100).toFixed(2) : 0
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات إعدادات المواقع: ${error.message}`);
    }
  }
}

export default VendorSiteSettingService;