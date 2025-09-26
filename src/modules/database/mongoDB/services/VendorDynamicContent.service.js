import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { VendorDynamicContent } from '../models/index.js';

/**
 * خدمة إدارة المحتوى الديناميكي للبائعين - VendorDynamicContent Service
 * تحتوي على الوظائف الأساسية لإدارة المحتوى الديناميكي للبائعين
 */
class VendorDynamicContentService {

  /**
   * إنشاء محتوى ديناميكي جديد للبائع
   * @param {string} vendorId - معرف البائع
   * @param {Object} contentData - بيانات المحتوى
   * @returns {Promise<Object>} المحتوى المُنشأ
   */
  static async createVendorDynamicContent(vendorId, contentData) {
    try {
      if (!vendorId) {
        throw new Error('معرف البائع مطلوب');
      }

      const newContent = {
        vendor_id: vendorId,
        ...contentData
      };

      const result = await mDBinsert(VendorDynamicContent, newContent);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المحتوى الديناميكي للبائع: ${error.message}`);
    }
  }

  /**
   * الحصول على المحتوى الديناميكي للبائع
   * @param {string} vendorId - معرف البائع
   * @returns {Promise<Object|null>} المحتوى أو null
   */
  static async getVendorDynamicContent(vendorId) {
    try {
      if (!vendorId) {
        throw new Error('معرف البائع مطلوب');
      }

      const result = await mDBselectAll({
        model: VendorDynamicContent,
        filter: { vendor_id: vendorId }
      });
      
      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب المحتوى الديناميكي للبائع: ${error.message}`);
    }
  }

  /**
   * تحديث المحتوى الديناميكي للبائع
   * @param {string} vendorId - معرف البائع
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} المحتوى المحدث
   */
  static async updateVendorDynamicContent(vendorId, updateData) {
    try {
      if (!vendorId) {
        throw new Error('معرف البائع مطلوب');
      }

      const updatedContent = await mDBupdate({
        model: VendorDynamicContent,
        filter: { vendor_id: vendorId },
        update: updateData
      });

      if (!updatedContent) {
        throw new Error('المحتوى الديناميكي للبائع غير موجود');
      }

      return updatedContent;
    } catch (error) {
      throw new Error(`خطأ في تحديث المحتوى الديناميكي للبائع: ${error.message}`);
    }
  }

  /**
   * حذف المحتوى الديناميكي للبائع
   * @param {string} vendorId - معرف البائع
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteVendorDynamicContent(vendorId) {
    try {
      if (!vendorId) {
        throw new Error('معرف البائع مطلوب');
      }

      const result = await mDBdelete({
        model: VendorDynamicContent,
        filter: { vendor_id: vendorId }
      });

      return result && result.deletedCount > 0;
    } catch (error) {
      throw new Error(`خطأ في حذف المحتوى الديناميكي للبائع: ${error.message}`);
    }
  }

  /**
   * إضافة بانر جديد للصفحة الرئيسية
   * @param {string} vendorId - معرف البائع
   * @param {Object} bannerData - بيانات البانر
   * @returns {Promise<Object>} نتيجة الإضافة
   */
  static async addHomepageBanner(vendorId, bannerData) {
    try {
      if (!vendorId || !bannerData) {
        throw new Error('معرف البائع وبيانات البانر مطلوبان');
      }

      const result = await mDBupdate({
        model: VendorDynamicContent,
        filter: { vendor_id: vendorId },
        update: {
          $push: { homepage_banners: bannerData }
        }
      });

      return result;
    } catch (error) {
      throw new Error(`خطأ في إضافة بانر الصفحة الرئيسية: ${error.message}`);
    }
  }

  /**
   * إزالة بانر من الصفحة الرئيسية
   * @param {string} vendorId - معرف البائع
   * @param {string} bannerId - معرف البانر
   * @returns {Promise<Object>} نتيجة الإزالة
   */
  static async removeHomepageBanner(vendorId, bannerId) {
    try {
      if (!vendorId || !bannerId) {
        throw new Error('معرف البائع ومعرف البانر مطلوبان');
      }

      const result = await mDBupdate({
        model: VendorDynamicContent,
        filter: { vendor_id: vendorId },
        update: {
          $pull: { homepage_banners: { _id: bannerId } }
        }
      });

      return result;
    } catch (error) {
      throw new Error(`خطأ في إزالة بانر الصفحة الرئيسية: ${error.message}`);
    }
  }

  /**
   * تحديث المنتجات المميزة
   * @param {string} vendorId - معرف البائع
   * @param {Array} productIds - مصفوفة معرفات المنتجات
   * @returns {Promise<Object>} نتيجة التحديث
   */
  static async updateFeaturedProducts(vendorId, productIds) {
    try {
      if (!vendorId || !Array.isArray(productIds)) {
        throw new Error('معرف البائع ومصفوفة معرفات المنتجات مطلوبان');
      }

      const result = await mDBupdate({
        model: VendorDynamicContent,
        filter: { vendor_id: vendorId },
        update: { featured_products: productIds }
      });

      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المنتجات المميزة: ${error.message}`);
    }
  }

  /**
   * تحديث روابط التواصل الاجتماعي
   * @param {string} vendorId - معرف البائع
   * @param {Object} socialLinks - روابط التواصل الاجتماعي
   * @returns {Promise<Object>} نتيجة التحديث
   */
  static async updateSocialLinks(vendorId, socialLinks) {
    try {
      if (!vendorId || !socialLinks) {
        throw new Error('معرف البائع وروابط التواصل الاجتماعي مطلوبان');
      }

      const result = await mDBupdate({
        model: VendorDynamicContent,
        filter: { vendor_id: vendorId },
        update: { social_links: socialLinks }
      });

      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث روابط التواصل الاجتماعي: ${error.message}`);
    }
  }

  /**
   * الحصول على البانرات النشطة للبائع
   * @param {string} vendorId - معرف البائع
   * @returns {Promise<Array>} قائمة البانرات النشطة
   */
  static async getActiveHomepageBanners(vendorId) {
    try {
      if (!vendorId) {
        throw new Error('معرف البائع مطلوب');
      }

      const content = await this.getVendorDynamicContent(vendorId);
      if (!content || !content.homepage_banners) {
        return [];
      }
      
      return content.homepage_banners
        .filter(banner => banner.is_active)
        .sort((a, b) => a.sort_order - b.sort_order);
    } catch (error) {
      throw new Error(`خطأ في جلب البانرات النشطة للصفحة الرئيسية: ${error.message}`);
    }
  }

  /**
   * البحث في المحتوى الديناميكي للبائعين
   * @param {Object} searchCriteria - معايير البحث
   * @returns {Promise<Array>} نتائج البحث
   */
  static async searchVendorDynamicContent(searchCriteria = {}) {
    try {
      const {
        vendor_id = null,
        has_banners = null,
        has_featured_products = null,
        limit = 50,
        skip = 0
      } = searchCriteria;

      let filter = {};

      if (vendor_id) filter.vendor_id = vendor_id;
      if (has_banners !== null) {
        filter.homepage_banners = has_banners ? { $exists: true, $ne: [] } : { $exists: false };
      }
      if (has_featured_products !== null) {
        filter.featured_products = has_featured_products ? { $exists: true, $ne: [] } : { $exists: false };
      }

      const contents = await mDBselectAll({
        model: VendorDynamicContent,
        filter,
        limit,
        skip
      });

      return contents || [];
    } catch (error) {
      throw new Error(`خطأ في البحث عن المحتوى الديناميكي للبائعين: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات المحتوى الديناميكي
   * @param {string} vendorId - معرف البائع (اختياري)
   * @returns {Promise<Object>} إحصائيات المحتوى
   */
  static async getContentStats(vendorId = null) {
    try {
      let matchFilter = {};
      if (vendorId) {
        matchFilter.vendor_id = vendorId;
      }

      const pipeline = [
        { $match: matchFilter },
        {
          $group: {
            _id: null,
            totalVendors: { $sum: 1 },
            totalBanners: { $sum: { $size: { $ifNull: ['$homepage_banners', []] } } },
            totalFeaturedProducts: { $sum: { $size: { $ifNull: ['$featured_products', []] } } },
            vendorsWithBanners: {
              $sum: {
                $cond: [
                  { $gt: [{ $size: { $ifNull: ['$homepage_banners', []] } }, 0] },
                  1,
                  0
                ]
              }
            },
            vendorsWithFeaturedProducts: {
              $sum: {
                $cond: [
                  { $gt: [{ $size: { $ifNull: ['$featured_products', []] } }, 0] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ];

      const stats = await VendorDynamicContent.aggregate(pipeline);
      return stats && stats.length > 0 ? stats[0] : {
        totalVendors: 0,
        totalBanners: 0,
        totalFeaturedProducts: 0,
        vendorsWithBanners: 0,
        vendorsWithFeaturedProducts: 0
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات المحتوى الديناميكي: ${error.message}`);
    }
  }
}

export default VendorDynamicContentService;