import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { Wishlist } from '../models/index.js';

/**
 * خدمة إدارة قائمة الأمنيات - Wishlist Service
 * تحتوي على الوظائف الأساسية لإدارة قوائم أمنيات المستخدمين
 */
class WishlistService {

  /**
   * إضافة منتج إلى قائمة الأمنيات
   * @param {Object} wishlistData - بيانات المنتج
   * @returns {Promise<Object>} العنصر المُضاف
   */
  static async addToWishlist(wishlistData) {
    try {
      if (!wishlistData.user_id || !wishlistData.product_id) {
        throw new Error('البيانات المطلوبة مفقودة: user_id, product_id');
      }

      // التحقق من عدم وجود المنتج مسبقاً في قائمة الأمنيات
      const existingItem = await this.getWishlistItem(wishlistData.user_id, wishlistData.product_id);
      if (existingItem) {
        throw new Error('المنتج موجود بالفعل في قائمة الأمنيات');
      }

      const newWishlistItem = await mDBinsert(Wishlist, wishlistData);
      return newWishlistItem;
    } catch (error) {
      throw new Error(`خطأ في إضافة المنتج لقائمة الأمنيات: ${error.message}`);
    }
  }

  /**
   * الحصول على قائمة أمنيات المستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Array>} قائمة الأمنيات
   */
  static async getUserWishlist(userId) {
    try {
      const wishlist = await mDBselectAll({
        model: Wishlist,
        filter: { user_id: userId }
      });
      return wishlist || [];
    } catch (error) {
      throw new Error(`خطأ في جلب قائمة الأمنيات: ${error.message}`);
    }
  }

  /**
   * الحصول على عنصر محدد من قائمة الأمنيات
   * @param {number} userId - معرف المستخدم
   * @param {number} productId - معرف المنتج
   * @returns {Promise<Object|null>} العنصر أو null
   */
  static async getWishlistItem(userId, productId) {
    try {
      const items = await mDBselectAll({
        model: Wishlist,
        filter: { user_id: userId, product_id: productId }
      });
      return items && items.length > 0 ? items[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب عنصر قائمة الأمنيات: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود منتج في قائمة الأمنيات
   * @param {number} userId - معرف المستخدم
   * @param {number} productId - معرف المنتج
   * @returns {Promise<boolean>} هل المنتج موجود
   */
  static async isInWishlist(userId, productId) {
    try {
      const item = await this.getWishlistItem(userId, productId);
      return item !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * حذف منتج من قائمة الأمنيات
   * @param {number} userId - معرف المستخدم
   * @param {number} productId - معرف المنتج
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async removeFromWishlist(userId, productId) {
    try {
      const result = await mDBdelete(Wishlist, { 
        user_id: userId, 
        product_id: productId 
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المنتج من قائمة الأمنيات: ${error.message}`);
    }
  }

  /**
   * حذف جميع عناصر قائمة أمنيات المستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async clearUserWishlist(userId) {
    try {
      const result = await mDBdelete(Wishlist, { user_id: userId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في مسح قائمة الأمنيات: ${error.message}`);
    }
  }

  /**
   * عدد عناصر قائمة أمنيات المستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<number>} عدد العناصر
   */
  static async getWishlistCount(userId) {
    try {
      const wishlist = await this.getUserWishlist(userId);
      return wishlist.length;
    } catch (error) {
      throw new Error(`خطأ في حساب عناصر قائمة الأمنيات: ${error.message}`);
    }
  }

  /**
   * الحصول على المنتجات الأكثر إضافة لقوائم الأمنيات
   * @param {number} limit - عدد المنتجات المطلوبة
   * @returns {Promise<Array>} قائمة المنتجات الشائعة
   */
  static async getPopularWishlistProducts(limit = 10) {
    try {
      // هذه الوظيفة تحتاج aggregation pipeline لكن سنبقيها بسيطة
      const allWishlistItems = await mDBselectAll({
        model: Wishlist,
        filter: {}
      });

      // تجميع المنتجات وحساب تكرارها
      const productCounts = {};
      allWishlistItems.forEach(item => {
        productCounts[item.product_id] = (productCounts[item.product_id] || 0) + 1;
      });

      // ترتيب المنتجات حسب التكرار
      const sortedProducts = Object.entries(productCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([product_id, count]) => ({ product_id: parseInt(product_id), count }));

      return sortedProducts;
    } catch (error) {
      throw new Error(`خطأ في جلب المنتجات الشائعة: ${error.message}`);
    }
  }

  /**
   * نقل منتج من قائمة أمنيات مستخدم لآخر (للاستخدام الإداري)
   * @param {number} fromUserId - المستخدم المصدر
   * @param {number} toUserId - المستخدم الهدف
   * @param {number} productId - معرف المنتج
   * @returns {Promise<Object>} العنصر المنقول
   */
  static async transferWishlistItem(fromUserId, toUserId, productId) {
    try {
      // حذف من المستخدم الأول
      await this.removeFromWishlist(fromUserId, productId);
      
      // إضافة للمستخدم الثاني
      const newItem = await this.addToWishlist({
        user_id: toUserId,
        product_id: productId
      });
      
      return newItem;
    } catch (error) {
      throw new Error(`خطأ في نقل عنصر قائمة الأمنيات: ${error.message}`);
    }
  }
}

export default WishlistService;