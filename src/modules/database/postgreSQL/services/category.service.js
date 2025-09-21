import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Op } from 'sequelize';
import { Category, VendorSiteSetting } from '../models/index.js';

/**
 * خدمة إدارة الفئات - Category Service
 * تحتوي على الوظائف الأساسية لإدارة فئات المنتجات
 */
class CategoryService {
  
  /**
   * إنشاء فئة جديدة - Create new category
   * @param {Object} categoryData - بيانات الفئة
   * @returns {Promise<Object>} - الفئة المُنشأة
   */
  static async createCategory(categoryData) {
    try {
      // التحقق من وجود الموقع
      const site = await VendorSiteSetting.findByPk(categoryData.site_id);
      if (!site) {
        throw new Error('الموقع غير موجود - Site not found');
      }

      // التحقق من عدم تكرار الـ slug
      const existingCategory = await Category.findOne({
        where: { 
          slug: categoryData.slug,
          site_id: categoryData.site_id 
        }
      });

      if (existingCategory) {
        throw new Error('الرابط المختصر (slug) موجود بالفعل في هذا الموقع - Slug already exists in this site');
      }

      // التحقق من وجود الفئة الأب إذا تم تحديدها
      if (categoryData.parent_id) {
        const parentCategory = await Category.findOne({
          where: { 
            id: categoryData.parent_id,
            site_id: categoryData.site_id 
          }
        });
        
        if (!parentCategory) {
          throw new Error('الفئة الأب غير موجودة في نفس الموقع - Parent category not found in the same site');
        }
      }

      const result = await PGinsert(Category, categoryData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الفئة: ${error.message}`);
    }
  }

  /**
   * تحديث الفئة - Update category
   * @param {number} categoryId - معرف الفئة
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - الفئة المحدثة
   */
  static async updateCategory(categoryId, updateData) {
    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw new Error('الفئة غير موجودة - Category not found');
      }

      // التحقق من عدم تكرار الـ slug إذا تم تحديثه
      if (updateData.slug && updateData.slug !== category.slug) {
        const existingCategory = await Category.findOne({
          where: { 
            slug: updateData.slug,
            site_id: category.site_id,
            id: { [Op.ne]: categoryId }
          }
        });

        if (existingCategory) {
          throw new Error('الرابط المختصر (slug) موجود بالفعل - Slug already exists');
        }
      }

      // التحقق من الفئة الأب إذا تم تحديثها
      if (updateData.parent_id) {
        if (updateData.parent_id === categoryId) {
          throw new Error('لا يمكن أن تكون الفئة أب لنفسها - Category cannot be parent of itself');
        }

        const parentCategory = await Category.findOne({
          where: { 
            id: updateData.parent_id,
            site_id: category.site_id 
          }
        });
        
        if (!parentCategory) {
          throw new Error('الفئة الأب غير موجودة في نفس الموقع - Parent category not found in the same site');
        }
      }

      const result = await PGupdate(Category, updateData, { id: categoryId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الفئة: ${error.message}`);
    }
  }

  /**
   * حذف الفئة - Delete category
   * @param {number} categoryId - معرف الفئة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteCategory(categoryId) {
    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw new Error('الفئة غير موجودة - Category not found');
      }

      // التحقق من وجود فئات فرعية
      const subCategories = await Category.findAll({
        where: { parent_id: categoryId }
      });

      if (subCategories.length > 0) {
        throw new Error('لا يمكن حذف الفئة لأنها تحتوي على فئات فرعية - Cannot delete category with subcategories');
      }

      const result = await PGdelete(Category, { id: categoryId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الفئة: ${error.message}`);
    }
  }

  /**
   * البحث في الفئات - Search categories
   * @param {Object} searchCriteria - معايير البحث
   * @returns {Promise<Array>} - قائمة الفئات
   */
  static async searchCategories(searchCriteria = {}) {
    try {
      const result = await PGselectAll(Category, {
        where: searchCriteria,
        include: [
          {
            model: VendorSiteSetting,
            as: 'site'
          },
          {
            model: Category,
            as: 'parentCategory'
          }
        ],
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في الفئات: ${error.message}`);
    }
  }

  /**
   * الحصول على فئة بالمعرف - Get category by ID
   * @param {number} categoryId - معرف الفئة
   * @returns {Promise<Object>} - الفئة
   */
  static async getCategoryById(categoryId) {
    try {
      const category = await Category.findByPk(categoryId, {
        include: [
          {
            model: VendorSiteSetting,
            as: 'site'
          },
          {
            model: Category,
            as: 'parentCategory'
          },
          {
            model: Category,
            as: 'subCategories'
          }
        ]
      });

      if (!category) {
        throw new Error('الفئة غير موجودة - Category not found');
      }

      return category;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الفئة: ${error.message}`);
    }
  }

  /**
   * الحصول على فئة بالـ slug - Get category by slug
   * @param {string} slug - الرابط المختصر
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<Object>} - الفئة
   */
  static async getCategoryBySlug(slug, siteId) {
    try {
      const category = await Category.findOne({
        where: { 
          slug: slug,
          site_id: siteId 
        },
        include: [
          {
            model: Category,
            as: 'parentCategory'
          },
          {
            model: Category,
            as: 'subCategories',
            where: { is_active: true },
            required: false
          }
        ]
      });

      if (!category) {
        throw new Error('الفئة غير موجودة - Category not found');
      }

      return category;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الفئة: ${error.message}`);
    }
  }

  /**
   * الحصول على الفئات الرئيسية - Get main categories
   * @param {number} siteId - معرف الموقع
   * @param {boolean} activeOnly - الفئات النشطة فقط
   * @returns {Promise<Array>} - قائمة الفئات الرئيسية
   */
  static async getMainCategories(siteId, activeOnly = true) {
    try {
      const whereCondition = { 
        site_id: siteId,
        parent_id: null 
      };

      if (activeOnly) {
        whereCondition.is_active = true;
      }

      const result = await PGselectAll(Category, {
        where: whereCondition,
        include: [
          {
            model: Category,
            as: 'subCategories',
            where: activeOnly ? { is_active: true } : {},
            required: false
          }
        ],
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الفئات الرئيسية: ${error.message}`);
    }
  }

  /**
   * الحصول على الفئات الفرعية - Get subcategories
   * @param {number} parentId - معرف الفئة الأب
   * @param {boolean} activeOnly - الفئات النشطة فقط
   * @returns {Promise<Array>} - قائمة الفئات الفرعية
   */
  static async getSubCategories(parentId, activeOnly = true) {
    try {
      const whereCondition = { parent_id: parentId };

      if (activeOnly) {
        whereCondition.is_active = true;
      }

      const result = await PGselectAll(Category, {
        where: whereCondition,
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الفئات الفرعية: ${error.message}`);
    }
  }

  /**
   * تفعيل/إلغاء تفعيل الفئة - Toggle category status
   * @param {number} categoryId - معرف الفئة
   * @returns {Promise<Object>} - الفئة المحدثة
   */
  static async toggleCategoryStatus(categoryId) {
    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw new Error('الفئة غير موجودة - Category not found');
      }

      const result = await this.updateCategory(categoryId, { 
        is_active: !category.is_active 
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تغيير حالة الفئة: ${error.message}`);
    }
  }

  /**
   * إعادة ترتيب الفئات - Reorder categories
   * @param {Array} categoryOrders - قائمة معرفات الفئات مع ترتيبها الجديد
   * @returns {Promise<boolean>} - نتيجة العملية
   */
  static async reorderCategories(categoryOrders) {
    try {
      for (const item of categoryOrders) {
        await this.updateCategory(item.id, { sort_order: item.sort_order });
      }
      return true;
    } catch (error) {
      throw new Error(`خطأ في إعادة ترتيب الفئات: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الفئات - Get category statistics
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<Object>} - إحصائيات الفئات
   */
  static async getCategoryStats(siteId) {
    try {
      const allCategories = await this.searchCategories({ site_id: siteId });
      
      const stats = {
        totalCategories: allCategories.length,
        activeCategories: allCategories.filter(cat => cat.is_active).length,
        inactiveCategories: allCategories.filter(cat => !cat.is_active).length,
        mainCategories: allCategories.filter(cat => !cat.parent_id).length,
        subCategories: allCategories.filter(cat => cat.parent_id).length
      };

      return stats;
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات الفئات: ${error.message}`);
    }
  }
}

export default CategoryService;