import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { ProductDetails } from '../models/index.js';

/**
 * خدمة إدارة تفاصيل المنتجات - ProductDetails Service
 * تحتوي على الوظائف الأساسية لإدارة التفاصيل المتقدمة للمنتجات
 */
class ProductDetailsService {

  /**
   * إنشاء تفاصيل منتج جديد
   * @param {Object} productData - بيانات تفاصيل المنتج
   * @returns {Promise<Object>} التفاصيل المُنشأة
   */
  static async createProductDetails(productData) {
    try {
      if (!productData.product_id || !productData.vendor_id || !productData.description) {
        throw new Error('البيانات المطلوبة مفقودة: product_id, vendor_id, description');
      }

      // التحقق من عدم وجود تفاصيل مسبقة للمنتج
      const existingDetails = await this.getProductDetails(productData.product_id);
      if (existingDetails) {
        throw new Error('تفاصيل المنتج موجودة بالفعل');
      }

      const newDetails = await mDBinsert(ProductDetails, productData);
      return newDetails;
    } catch (error) {
      throw new Error(`خطأ في إنشاء تفاصيل المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على تفاصيل المنتج
   * @param {number} productId - معرف المنتج
   * @returns {Promise<Object|null>} تفاصيل المنتج أو null
   */
  static async getProductDetails(productId) {
    try {
      const details = await mDBselectAll({
        model: ProductDetails,
        filter: { product_id: productId }
      });
      return details && details.length > 0 ? details[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب تفاصيل المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على منتجات البائع
   * @param {number} vendorId - معرف البائع
   * @returns {Promise<Array>} قائمة منتجات البائع
   */
  static async getVendorProducts(vendorId) {
    try {
      const products = await mDBselectAll({
        model: ProductDetails,
        filter: { vendor_id: vendorId }
      });
      return products || [];
    } catch (error) {
      throw new Error(`خطأ في جلب منتجات البائع: ${error.message}`);
    }
  }

  /**
   * تحديث تفاصيل المنتج
   * @param {number} productId - معرف المنتج
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} التفاصيل المُحدثة
   */
  static async updateProductDetails(productId, updateData) {
    try {
      const updatedDetails = await mDBupdate(
        ProductDetails, 
        { product_id: productId }, 
        updateData
      );
      return updatedDetails;
    } catch (error) {
      throw new Error(`خطأ في تحديث تفاصيل المنتج: ${error.message}`);
    }
  }

  /**
   * البحث في المنتجات بالكلمات الدلالية
   * @param {Array<string>} tags - الكلمات الدلالية
   * @returns {Promise<Array>} قائمة المنتجات المطابقة
   */
  static async searchByTags(tags) {
    try {
      const products = await mDBselectAll({
        model: ProductDetails,
        filter: { tags: { $in: tags } }
      });
      return products || [];
    } catch (error) {
      throw new Error(`خطأ في البحث بالكلمات الدلالية: ${error.message}`);
    }
  }

  /**
   * البحث في المنتجات بالمواصفات
   * @param {string} specKey - مفتاح المواصفة (مثل brand)
   * @param {string} specValue - قيمة المواصفة (مثل Samsung)
   * @returns {Promise<Array>} قائمة المنتجات المطابقة
   */
  static async searchBySpecification(specKey, specValue) {
    try {
      const filterKey = `specifications.${specKey}`;
      const products = await mDBselectAll({
        model: ProductDetails,
        filter: { [filterKey]: specValue }
      });
      return products || [];
    } catch (error) {
      throw new Error(`خطأ في البحث بالمواصفات: ${error.message}`);
    }
  }

  /**
   * حذف تفاصيل المنتج
   * @param {number} productId - معرف المنتج
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteProductDetails(productId) {
    try {
      const result = await mDBdelete(ProductDetails, { product_id: productId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف تفاصيل المنتج: ${error.message}`);
    }
  }

  /**
   * إضافة صور إضافية للمنتج
   * @param {number} productId - معرف المنتج
   * @param {Array<string>} images - قائمة الصور الجديدة
   * @returns {Promise<Object>} التفاصيل المُحدثة
   */
  static async addProductImages(productId, images) {
    try {
      const currentDetails = await this.getProductDetails(productId);
      if (!currentDetails) {
        throw new Error('تفاصيل المنتج غير موجودة');
      }

      const existingImages = currentDetails.additional_images || [];
      const updatedImages = [...existingImages, ...images];

      return await this.updateProductDetails(productId, { 
        additional_images: updatedImages 
      });
    } catch (error) {
      throw new Error(`خطأ في إضافة صور المنتج: ${error.message}`);
    }
  }
}

export default ProductDetailsService;