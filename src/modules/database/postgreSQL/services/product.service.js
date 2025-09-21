import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Product } from '../models/index.js';
import { Op } from 'sequelize';

class ProductService {
  /**
   * إنشاء منتج جديد
   * @param {Object} productData - بيانات المنتج
   * @returns {Promise<Object>} - المنتج المنشأ
   */
  static async createProduct(productData) {
    try {
      const result = await PGinsert(Product, productData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المنتج: ${error.message}`);
    }
  }

  /**
   * إنشاء منتج جديد مع التحقق من البيانات
   * @param {string} name - اسم المنتج
   * @param {string} slug - الرابط المختصر
   * @param {string} main_image_url - رابط الصورة الرئيسية
   * @param {number} base_price - السعر الأساسي
   * @param {number} site_id - معرف الموقع
   * @param {number} vendor_id - معرف البائع
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Object>} - المنتج المنشأ
   */
  static async createProductWithValidation(name, slug, main_image_url, base_price, site_id, vendor_id, options = {}) {
    try {
      // التحقق من عدم وجود slug مكرر
      const existingProduct = await this.getProductBySlug(slug);
      if (existingProduct) {
        throw new Error('الرابط المختصر مستخدم بالفعل');
      }

      const productData = {
        name: name.trim(),
        slug: slug.toLowerCase().trim(),
        main_image_url,
        base_price: parseFloat(base_price),
        site_id: parseInt(site_id),
        vendor_id: parseInt(vendor_id),
        discount_percentage: options.discount_percentage || 0,
        description: options.description || null,
        category_id: options.category_id || null,
        is_active: options.is_active !== undefined ? options.is_active : true
      };
      
      const result = await PGinsert(Product, productData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع المنتجات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة المنتجات
   */
  static async getAllProducts(options = {}) {
    try {
      const defaultOptions = {
        order: [['created_at', 'DESC']],
        ...options
      };
      
      const result = await Product.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المنتجات: ${error.message}`);
    }
  }

  /**
   * الحصول على المنتجات النشطة فقط
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة المنتجات النشطة
   */
  static async getActiveProducts(options = {}) {
    try {
      const whereClause = { is_active: true };
      const defaultOptions = {
        where: whereClause,
        order: [['created_at', 'DESC']],
        ...options
      };
      
      const result = await Product.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المنتجات النشطة: ${error.message}`);
    }
  }

  /**
   * الحصول على منتج بواسطة المعرف
   * @param {string} productId - معرف المنتج
   * @returns {Promise<Object|null>} - المنتج أو null
   */
  static async getProductById(productId) {
    try {
      const result = await PGselectAll(Product, {id: productId});
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على منتج بواسطة الرابط المختصر
   * @param {string} slug - الرابط المختصر
   * @returns {Promise<Object|null>} - المنتج أو null
   */
  static async getProductBySlug(slug) {
    try {
      const result = await PGselectAll(Product, {slug: slug});
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على منتجات بائع معين
   * @param {number} vendorId - معرف البائع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة منتجات البائع
   */
  static async getProductsByVendor(vendorId, options = {}) {
    try {
      const whereClause = { vendor_id: vendorId };
      const defaultOptions = {
        where: whereClause,
        order: [['created_at', 'DESC']],
        ...options
      };
      
      const result = await Product.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على منتجات البائع: ${error.message}`);
    }
  }

  /**
   * الحصول على منتجات فئة معينة
   * @param {number} categoryId - معرف الفئة
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة منتجات الفئة
   */
  static async getProductsByCategory(categoryId, options = {}) {
    try {
      const whereClause = { category_id: categoryId };
      const defaultOptions = {
        where: whereClause,
        order: [['created_at', 'DESC']],
        ...options
      };
      
      const result = await Product.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على منتجات الفئة: ${error.message}`);
    }
  }

  /**
   * البحث في المنتجات بالاسم
   * @param {string} searchTerm - مصطلح البحث
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة المنتجات المطابقة
   */
  static async searchProducts(searchTerm, options = {}) {
    try {
      const whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      };
      
      const defaultOptions = {
        where: whereClause,
        order: [['created_at', 'DESC']],
        ...options
      };
      
      const result = await Product.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث عن المنتجات: ${error.message}`);
    }
  }

  /**
   * تحديث منتج
   * @param {string} productId - معرف المنتج
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - المنتج المحدث
   */
  static async updateProduct(productId, updateData) {
    try {
      // التحقق من وجود المنتج
      const existingProduct = await this.getProductById(productId);
      if (!existingProduct) {
        throw new Error('المنتج غير موجود');
      }

      // التحقق من slug إذا تم تحديثه
      if (updateData.slug && updateData.slug !== existingProduct.slug) {
        const slugExists = await this.getProductBySlug(updateData.slug);
        if (slugExists) {
          throw new Error('الرابط المختصر مستخدم بالفعل');
        }
      }

      const result = await PGupdate(Product, updateData, {id: productId});
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المنتج: ${error.message}`);
    }
  }

  /**
   * تفعيل أو إلغاء تفعيل منتج
   * @param {string} productId - معرف المنتج
   * @param {boolean} isActive - حالة التفعيل
   * @returns {Promise<Object>} - المنتج المحدث
   */
  static async toggleProductStatus(productId, isActive = true) {
    try {
      const result = await this.updateProduct(productId, { is_active: isActive });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تغيير حالة المنتج: ${error.message}`);
    }
  }

  /**
   * حذف منتج
   * @param {string} productId - معرف المنتج
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteProduct(productId) {
    try {
      // التحقق من وجود المنتج
      const existingProduct = await this.getProductById(productId);
      if (!existingProduct) {
        throw new Error('المنتج غير موجود');
      }

      const result = await PGdelete(Product, {id: productId});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المنتج: ${error.message}`);
    }
  }

  /**
   * عد المنتجات
   * @param {Object} whereClause - شروط العد
   * @returns {Promise<number>} - عدد المنتجات
   */
  static async countProducts(whereClause = {}) {
    try {
      const count = await Product.count({ where: whereClause });
      return count;
    } catch (error) {
      throw new Error(`خطأ في عد المنتجات: ${error.message}`);
    }
  }

  /**
   * حساب السعر النهائي للمنتج (مع الخصم)
   * @param {Object} product - بيانات المنتج
   * @returns {number} - السعر النهائي
   */
  static calculateFinalPrice(product) {
    const basePrice = parseFloat(product.base_price);
    const discountPercentage = parseInt(product.discount_percentage) || 0;
    return basePrice * (1 - discountPercentage / 100);
  }

  /**
   * الحصول على المنتجات ضمن نطاق سعري
   * @param {number} minPrice - أقل سعر
   * @param {number} maxPrice - أعلى سعر
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة المنتجات
   */
  static async getProductsByPriceRange(minPrice, maxPrice, options = {}) {
    try {
      const whereClause = {
        base_price: {
          [Op.between]: [minPrice, maxPrice]
        }
      };
      
      const defaultOptions = {
        where: whereClause,
        order: [['base_price', 'ASC']],
        ...options
      };
      
      const result = await Product.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المنتجات بالنطاق السعري: ${error.message}`);
    }
  }
}

export default ProductService;