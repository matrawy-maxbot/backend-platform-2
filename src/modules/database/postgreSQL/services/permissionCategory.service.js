import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import PermissionCategory from '../models/PermissionCategory.model.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة فئات الصلاحيات - Permission Category Service
 * تحتوي على الوظائف الأساسية لإدارة فئات الصلاحيات
 */
class PermissionCategoryService {
  
  /**
   * إنشاء فئة صلاحيات جديدة
   * @param {Object} categoryData - بيانات فئة الصلاحيات
   * @returns {Promise<Object>} فئة الصلاحيات المُنشأة
   */
  static async createPermissionCategory(categoryData) {
    try {
      // التحقق من البيانات المطلوبة
      if (!categoryData.name || !categoryData.site_id) {
        throw new Error('البيانات المطلوبة مفقودة: name, site_id');
      }

      // تعيين ترتيب افتراضي إذا لم يتم تحديده
      if (!categoryData.sort_order) {
        const maxOrder = await this.getMaxSortOrder(categoryData.site_id);
        categoryData.sort_order = maxOrder + 1;
      }

      const newCategory = await PGinsert(PermissionCategory, categoryData);
      return newCategory;
    } catch (error) {
      throw new Error(`خطأ في إنشاء فئة الصلاحيات: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع فئات الصلاحيات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة فئات الصلاحيات
   */
  static async getAllPermissionCategories(options = {}) {
    try {
      const categories = await PermissionCategory.findAll({
        order: [['sort_order', 'ASC'], ['name', 'ASC']],
        ...options
      });
      return categories;
    } catch (error) {
      throw new Error(`خطأ في جلب فئات الصلاحيات: ${error.message}`);
    }
  }

  /**
   * الحصول على فئة صلاحيات بواسطة المعرف
   * @param {number} categoryId - معرف فئة الصلاحيات
   * @returns {Promise<Object|null>} فئة الصلاحيات أو null
   */
  static async getPermissionCategoryById(categoryId) {
    try {
      const category = await PermissionCategory.findByPk(categoryId);
      return category;
    } catch (error) {
      throw new Error(`خطأ في جلب فئة الصلاحيات: ${error.message}`);
    }
  }

  /**
   * الحصول على فئات الصلاحيات لموقع معين
   * @param {number} siteId - معرف الموقع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة فئات صلاحيات الموقع
   */
  static async getPermissionCategoriesBySite(siteId, options = {}) {
    try {
      const categories = await PermissionCategory.findAll({
        where: { site_id: siteId },
        order: [['sort_order', 'ASC'], ['name', 'ASC']],
        ...options
      });
      return categories;
    } catch (error) {
      throw new Error(`خطأ في جلب فئات صلاحيات الموقع: ${error.message}`);
    }
  }

  /**
   * البحث في فئات الصلاحيات بالاسم أو الوصف
   * @param {string} searchTerm - مصطلح البحث
   * @param {number} siteId - معرف الموقع (اختياري)
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة فئات الصلاحيات المطابقة
   */
  static async searchPermissionCategories(searchTerm, siteId = null, options = {}) {
    try {
      const whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      };

      if (siteId) {
        whereClause.site_id = siteId;
      }

      const categories = await PermissionCategory.findAll({
        where: whereClause,
        order: [['sort_order', 'ASC'], ['name', 'ASC']],
        ...options
      });
      return categories;
    } catch (error) {
      throw new Error(`خطأ في البحث عن فئات الصلاحيات: ${error.message}`);
    }
  }

  /**
   * تحديث فئة صلاحيات
   * @param {number} categoryId - معرف فئة الصلاحيات
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} فئة الصلاحيات المُحدثة
   */
  static async updatePermissionCategory(categoryId, updateData) {
    try {
      // التحقق من وجود فئة الصلاحيات
      const category = await this.getPermissionCategoryById(categoryId);
      if (!category) {
        throw new Error('فئة الصلاحيات غير موجودة');
      }

      const updatedCategory = await PGupdate(PermissionCategory, categoryId, updateData);
      return updatedCategory;
    } catch (error) {
      throw new Error(`خطأ في تحديث فئة الصلاحيات: ${error.message}`);
    }
  }

  /**
   * حذف فئة صلاحيات
   * @param {number} categoryId - معرف فئة الصلاحيات
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deletePermissionCategory(categoryId) {
    try {
      // التحقق من وجود فئة الصلاحيات
      const category = await this.getPermissionCategoryById(categoryId);
      if (!category) {
        throw new Error('فئة الصلاحيات غير موجودة');
      }

      const result = await PGdelete(PermissionCategory, categoryId);
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف فئة الصلاحيات: ${error.message}`);
    }
  }

  /**
   * إعادة ترتيب فئات الصلاحيات
   * @param {number} siteId - معرف الموقع
   * @param {Array} categoryOrders - مصفوفة من {id, sort_order}
   * @returns {Promise<boolean>} نتيجة إعادة الترتيب
   */
  static async reorderPermissionCategories(siteId, categoryOrders) {
    try {
      for (const item of categoryOrders) {
        await this.updatePermissionCategory(item.id, { sort_order: item.sort_order });
      }
      return true;
    } catch (error) {
      throw new Error(`خطأ في إعادة ترتيب فئات الصلاحيات: ${error.message}`);
    }
  }

  /**
   * نقل فئة صلاحيات لأعلى في الترتيب
   * @param {number} categoryId - معرف فئة الصلاحيات
   * @returns {Promise<Object>} فئة الصلاحيات المُحدثة
   */
  static async movePermissionCategoryUp(categoryId) {
    try {
      const category = await this.getPermissionCategoryById(categoryId);
      if (!category) {
        throw new Error('فئة الصلاحيات غير موجودة');
      }

      // البحث عن الفئة التي قبلها في الترتيب
      const previousCategory = await PermissionCategory.findOne({
        where: {
          site_id: category.site_id,
          sort_order: { [Op.lt]: category.sort_order }
        },
        order: [['sort_order', 'DESC']]
      });

      if (previousCategory) {
        // تبديل الترتيب
        const tempOrder = category.sort_order;
        await this.updatePermissionCategory(category.id, { sort_order: previousCategory.sort_order });
        await this.updatePermissionCategory(previousCategory.id, { sort_order: tempOrder });
      }

      return await this.getPermissionCategoryById(categoryId);
    } catch (error) {
      throw new Error(`خطأ في نقل فئة الصلاحيات لأعلى: ${error.message}`);
    }
  }

  /**
   * نقل فئة صلاحيات لأسفل في الترتيب
   * @param {number} categoryId - معرف فئة الصلاحيات
   * @returns {Promise<Object>} فئة الصلاحيات المُحدثة
   */
  static async movePermissionCategoryDown(categoryId) {
    try {
      const category = await this.getPermissionCategoryById(categoryId);
      if (!category) {
        throw new Error('فئة الصلاحيات غير موجودة');
      }

      // البحث عن الفئة التي بعدها في الترتيب
      const nextCategory = await PermissionCategory.findOne({
        where: {
          site_id: category.site_id,
          sort_order: { [Op.gt]: category.sort_order }
        },
        order: [['sort_order', 'ASC']]
      });

      if (nextCategory) {
        // تبديل الترتيب
        const tempOrder = category.sort_order;
        await this.updatePermissionCategory(category.id, { sort_order: nextCategory.sort_order });
        await this.updatePermissionCategory(nextCategory.id, { sort_order: tempOrder });
      }

      return await this.getPermissionCategoryById(categoryId);
    } catch (error) {
      throw new Error(`خطأ في نقل فئة الصلاحيات لأسفل: ${error.message}`);
    }
  }

  /**
   * الحصول على أعلى رقم ترتيب لموقع معين
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<number>} أعلى رقم ترتيب
   */
  static async getMaxSortOrder(siteId) {
    try {
      const result = await PermissionCategory.max('sort_order', {
        where: { site_id: siteId }
      });
      return result || 0;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أعلى رقم ترتيب: ${error.message}`);
    }
  }

  /**
   * عدد فئات الصلاحيات
   * @param {Object} whereClause - شروط العد
   * @returns {Promise<number>} عدد فئات الصلاحيات
   */
  static async countPermissionCategories(whereClause = {}) {
    try {
      const count = await PermissionCategory.count({ where: whereClause });
      return count;
    } catch (error) {
      throw new Error(`خطأ في عد فئات الصلاحيات: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات فئات الصلاحيات
   * @param {number} siteId - معرف الموقع (اختياري)
   * @returns {Promise<Object>} إحصائيات فئات الصلاحيات
   */
  static async getPermissionCategoryStats(siteId = null) {
    try {
      const whereClause = siteId ? { site_id: siteId } : {};
      
      const totalCategories = await this.countPermissionCategories(whereClause);

      return {
        total: totalCategories
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات فئات الصلاحيات: ${error.message}`);
    }
  }
}

export default PermissionCategoryService;