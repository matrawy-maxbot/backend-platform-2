import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { ProductVariant } from '../models/index.js';
import { Op } from 'sequelize';

class ProductVariantService {
  /**
   * إنشاء متغير منتج جديد
   * @param {Object} variantData - بيانات متغير المنتج
   * @returns {Promise<Object>} - متغير المنتج المنشأ
   */
  static async createProductVariant(variantData) {
    try {
      const result = await PGinsert(ProductVariant, variantData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء متغير المنتج: ${error.message}`);
    }
  }

  /**
   * إنشاء متغير منتج جديد مع التحقق من البيانات
   * @param {string} sku - رمز المنتج الفريد
   * @param {string} variant_name - اسم متغير المنتج
   * @param {string} product_id - معرف المنتج
   * @param {number} site_id - معرف الموقع
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Object>} - متغير المنتج المنشأ
   */
  static async createProductVariantWithValidation(sku, variant_name, product_id, site_id, options = {}) {
    try {
      // التحقق من عدم وجود SKU مكرر
      const existingVariant = await this.getProductVariantBySku(sku);
      if (existingVariant) {
        throw new Error('رمز المنتج مستخدم بالفعل');
      }

      // إذا كان هذا المتغير افتراضي، تأكد من عدم وجود متغير افتراضي آخر للمنتج نفسه
      if (options.is_default) {
        await this.clearDefaultVariantForProduct(product_id);
      }

      const variantData = {
        sku: sku.trim().toUpperCase(),
        variant_name: variant_name.trim(),
        product_id,
        site_id: parseInt(site_id),
        price_adjustment: options.price_adjustment || 0,
        image_url: options.image_url || null,
        is_default: options.is_default || false,
        sort_order: options.sort_order || 0
      };
      
      const result = await PGinsert(ProductVariant, variantData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء متغير المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع متغيرات المنتجات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة متغيرات المنتجات
   */
  static async getAllProductVariants(options = {}) {
    try {
      const defaultOptions = {
        order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
        ...options
      };
      
      const result = await ProductVariant.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على متغيرات المنتجات: ${error.message}`);
    }
  }

  /**
   * الحصول على متغير منتج بواسطة المعرف
   * @param {string} variantId - معرف متغير المنتج
   * @returns {Promise<Object|null>} - متغير المنتج أو null
   */
  static async getProductVariantById(variantId) {
    try {
      const result = await PGselectAll(ProductVariant, {id: variantId});
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على متغير المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على متغير منتج بواسطة رمز SKU
   * @param {string} sku - رمز المنتج الفريد
   * @returns {Promise<Object|null>} - متغير المنتج أو null
   */
  static async getProductVariantBySku(sku) {
    try {
      const result = await PGselectAll(ProductVariant, {sku: sku.toUpperCase()});
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على متغير المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على متغيرات منتج معين
   * @param {string} productId - معرف المنتج
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة متغيرات المنتج
   */
  static async getProductVariantsByProduct(productId, options = {}) {
    try {
      const whereClause = { product_id: productId };
      const defaultOptions = {
        where: whereClause,
        order: [['sort_order', 'ASC'], ['created_at', 'ASC']],
        ...options
      };
      
      const result = await ProductVariant.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على متغيرات المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على المتغير الافتراضي لمنتج معين
   * @param {string} productId - معرف المنتج
   * @returns {Promise<Object|null>} - المتغير الافتراضي أو null
   */
  static async getDefaultVariantForProduct(productId) {
    try {
      const whereClause = { 
        product_id: productId,
        is_default: true 
      };
      
      const result = await ProductVariant.findOne({ where: whereClause });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتغير الافتراضي: ${error.message}`);
    }
  }

  /**
   * البحث في متغيرات المنتجات
   * @param {string} searchTerm - مصطلح البحث
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة متغيرات المنتجات المطابقة
   */
  static async searchProductVariants(searchTerm, options = {}) {
    try {
      const whereClause = {
        [Op.or]: [
          { sku: { [Op.iLike]: `%${searchTerm}%` } },
          { variant_name: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      };
      
      const defaultOptions = {
        where: whereClause,
        order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
        ...options
      };
      
      const result = await ProductVariant.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث عن متغيرات المنتجات: ${error.message}`);
    }
  }

  /**
   * تحديث متغير منتج
   * @param {string} variantId - معرف متغير المنتج
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - متغير المنتج المحدث
   */
  static async updateProductVariant(variantId, updateData) {
    try {
      // التحقق من وجود متغير المنتج
      const existingVariant = await this.getProductVariantById(variantId);
      if (!existingVariant) {
        throw new Error('متغير المنتج غير موجود');
      }

      // التحقق من SKU إذا تم تحديثه
      if (updateData.sku && updateData.sku !== existingVariant.sku) {
        const skuExists = await this.getProductVariantBySku(updateData.sku);
        if (skuExists) {
          throw new Error('رمز المنتج مستخدم بالفعل');
        }
      }

      // إذا كان التحديث يجعل هذا المتغير افتراضي، إلغاء الافتراضي من المتغيرات الأخرى
      if (updateData.is_default && !existingVariant.is_default) {
        await this.clearDefaultVariantForProduct(existingVariant.product_id);
      }

      const result = await PGupdate(ProductVariant, updateData, {id: variantId});
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث متغير المنتج: ${error.message}`);
    }
  }

  /**
   * تعيين متغير كافتراضي لمنتج
   * @param {string} variantId - معرف متغير المنتج
   * @returns {Promise<Object>} - متغير المنتج المحدث
   */
  static async setAsDefaultVariant(variantId) {
    try {
      const variant = await this.getProductVariantById(variantId);
      if (!variant) {
        throw new Error('متغير المنتج غير موجود');
      }

      // إلغاء الافتراضي من المتغيرات الأخرى للمنتج نفسه
      await this.clearDefaultVariantForProduct(variant.product_id);

      // تعيين هذا المتغير كافتراضي
      const result = await this.updateProductVariant(variantId, { is_default: true });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تعيين المتغير الافتراضي: ${error.message}`);
    }
  }

  /**
   * إلغاء الافتراضي من جميع متغيرات منتج معين
   * @param {string} productId - معرف المنتج
   * @returns {Promise<boolean>} - نتيجة العملية
   */
  static async clearDefaultVariantForProduct(productId) {
    try {
      await ProductVariant.update(
        { is_default: false },
        { where: { product_id: productId, is_default: true } }
      );
      return true;
    } catch (error) {
      throw new Error(`خطأ في إلغاء المتغير الافتراضي: ${error.message}`);
    }
  }

  /**
   * إعادة ترتيب متغيرات منتج
   * @param {string} productId - معرف المنتج
   * @param {Array} variantOrders - مصفوفة من {variantId, sortOrder}
   * @returns {Promise<boolean>} - نتيجة العملية
   */
  static async reorderProductVariants(productId, variantOrders) {
    try {
      for (const order of variantOrders) {
        await this.updateProductVariant(order.variantId, { sort_order: order.sortOrder });
      }
      return true;
    } catch (error) {
      throw new Error(`خطأ في إعادة ترتيب متغيرات المنتج: ${error.message}`);
    }
  }

  /**
   * حذف متغير منتج
   * @param {string} variantId - معرف متغير المنتج
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteProductVariant(variantId) {
    try {
      // التحقق من وجود متغير المنتج
      const existingVariant = await this.getProductVariantById(variantId);
      if (!existingVariant) {
        throw new Error('متغير المنتج غير موجود');
      }

      const result = await PGdelete(ProductVariant, {id: variantId});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف متغير المنتج: ${error.message}`);
    }
  }

  /**
   * حذف جميع متغيرات منتج معين
   * @param {string} productId - معرف المنتج
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAllProductVariants(productId) {
    try {
      const result = await PGdelete(ProductVariant, {product_id: productId});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف متغيرات المنتج: ${error.message}`);
    }
  }

  /**
   * عد متغيرات المنتجات
   * @param {Object} whereClause - شروط العد
   * @returns {Promise<number>} - عدد متغيرات المنتجات
   */
  static async countProductVariants(whereClause = {}) {
    try {
      const count = await ProductVariant.count({ where: whereClause });
      return count;
    } catch (error) {
      throw new Error(`خطأ في عد متغيرات المنتجات: ${error.message}`);
    }
  }

  /**
   * حساب السعر النهائي لمتغير المنتج
   * @param {Object} variant - بيانات متغير المنتج
   * @param {number} basePrice - السعر الأساسي للمنتج
   * @returns {number} - السعر النهائي
   */
  static calculateVariantFinalPrice(variant, basePrice) {
    const priceAdjustment = parseFloat(variant.price_adjustment) || 0;
    return parseFloat(basePrice) + priceAdjustment;
  }

  /**
   * الحصول على متغيرات المنتجات ضمن نطاق تعديل سعري
   * @param {number} minAdjustment - أقل تعديل سعر
   * @param {number} maxAdjustment - أعلى تعديل سعر
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة متغيرات المنتجات
   */
  static async getVariantsByPriceAdjustmentRange(minAdjustment, maxAdjustment, options = {}) {
    try {
      const whereClause = {
        price_adjustment: {
          [Op.between]: [minAdjustment, maxAdjustment]
        }
      };
      
      const defaultOptions = {
        where: whereClause,
        order: [['price_adjustment', 'ASC']],
        ...options
      };
      
      const result = await ProductVariant.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على متغيرات المنتجات بالنطاق السعري: ${error.message}`);
    }
  }
}

export default ProductVariantService;