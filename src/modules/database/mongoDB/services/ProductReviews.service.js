import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { ProductReviews } from '../models/index.js';

/**
 * خدمة إدارة مراجعات المنتجات - ProductReviews Service
 * تحتوي على الوظائف الأساسية لإدارة تقييمات ومراجعات المنتجات
 */
class ProductReviewsService {

  /**
   * إضافة مراجعة جديدة للمنتج
   * @param {Object} reviewData - بيانات المراجعة
   * @returns {Promise<Object>} المراجعة المُنشأة
   */
  static async addReview(reviewData) {
    try {
      if (!reviewData.product_id || !reviewData.user_id || !reviewData.rating) {
        throw new Error('البيانات المطلوبة مفقودة: product_id, user_id, rating');
      }

      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('التقييم يجب أن يكون بين 1 و 5');
      }

      // التحقق من عدم وجود مراجعة سابقة من نفس المستخدم للمنتج
      const existingReview = await this.getUserReviewForProduct(
        reviewData.user_id, 
        reviewData.product_id
      );
      
      if (existingReview) {
        throw new Error('لديك مراجعة سابقة لهذا المنتج');
      }

      const newReview = await mDBinsert(ProductReviews, reviewData);
      return newReview;
    } catch (error) {
      throw new Error(`خطأ في إضافة المراجعة: ${error.message}`);
    }
  }

  /**
   * الحصول على مراجعات المنتج
   * @param {number} productId - معرف المنتج
   * @param {Object} options - خيارات الاستعلام (limit, sort)
   * @returns {Promise<Array>} قائمة المراجعات
   */
  static async getProductReviews(productId, options = {}) {
    try {
      const { limit = 20, sortBy = 'created_at', sortOrder = -1 } = options;
      
      const reviews = await mDBselectAll({
        model: ProductReviews,
        filter: { product_id: productId },
        sort: { [sortBy]: sortOrder },
        limit: limit
      });
      
      return reviews || [];
    } catch (error) {
      throw new Error(`خطأ في جلب مراجعات المنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على مراجعة المستخدم للمنتج
   * @param {number} userId - معرف المستخدم
   * @param {number} productId - معرف المنتج
   * @returns {Promise<Object|null>} المراجعة أو null
   */
  static async getUserReviewForProduct(userId, productId) {
    try {
      const reviews = await mDBselectAll({
        model: ProductReviews,
        filter: { user_id: userId, product_id: productId }
      });
      
      return reviews && reviews.length > 0 ? reviews[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب مراجعة المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على مراجعات المستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Array>} قائمة مراجعات المستخدم
   */
  static async getUserReviews(userId) {
    try {
      const reviews = await mDBselectAll({
        model: ProductReviews,
        filter: { user_id: userId },
        sort: { created_at: -1 }
      });
      
      return reviews || [];
    } catch (error) {
      throw new Error(`خطأ في جلب مراجعات المستخدم: ${error.message}`);
    }
  }

  /**
   * تحديث المراجعة
   * @param {string} reviewId - معرف المراجعة
   * @param {number} userId - معرف المستخدم (للتحقق من الصلاحية)
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} المراجعة المُحدثة
   */
  static async updateReview(reviewId, userId, updateData) {
    try {
      // التحقق من ملكية المراجعة
      const existingReview = await mDBselectAll({
        model: ProductReviews,
        filter: { _id: reviewId, user_id: userId }
      });

      if (!existingReview || existingReview.length === 0) {
        throw new Error('المراجعة غير موجودة أو غير مملوكة لك');
      }

      if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
        throw new Error('التقييم يجب أن يكون بين 1 و 5');
      }

      const updatedReview = await mDBupdate(
        ProductReviews,
        { _id: reviewId, user_id: userId },
        { ...updateData, updated_at: new Date() }
      );
      
      return updatedReview;
    } catch (error) {
      throw new Error(`خطأ في تحديث المراجعة: ${error.message}`);
    }
  }

  /**
   * حذف المراجعة
   * @param {string} reviewId - معرف المراجعة
   * @param {number} userId - معرف المستخدم (للتحقق من الصلاحية)
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteReview(reviewId, userId) {
    try {
      const result = await mDBdelete(ProductReviews, { 
        _id: reviewId, 
        user_id: userId 
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المراجعة: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات تقييمات المنتج
   * @param {number} productId - معرف المنتج
   * @returns {Promise<Object>} إحصائيات التقييمات
   */
  static async getProductRatingStats(productId) {
    try {
      const reviews = await mDBselectAll({
        model: ProductReviews,
        filter: { product_id: productId }
      });

      if (!reviews || reviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const totalReviews = reviews.length;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = (totalRating / totalReviews).toFixed(1);

      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
        ratingDistribution[review.rating]++;
      });

      return {
        totalReviews,
        averageRating: parseFloat(averageRating),
        ratingDistribution
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات التقييمات: ${error.message}`);
    }
  }

  /**
   * الحصول على المراجعات حسب التقييم
   * @param {number} productId - معرف المنتج
   * @param {number} rating - التقييم المطلوب (1-5)
   * @returns {Promise<Array>} قائمة المراجعات
   */
  static async getReviewsByRating(productId, rating) {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('التقييم يجب أن يكون بين 1 و 5');
      }

      const reviews = await mDBselectAll({
        model: ProductReviews,
        filter: { product_id: productId, rating: rating },
        sort: { created_at: -1 }
      });
      
      return reviews || [];
    } catch (error) {
      throw new Error(`خطأ في جلب المراجعات حسب التقييم: ${error.message}`);
    }
  }

  /**
   * البحث في المراجعات
   * @param {number} productId - معرف المنتج
   * @param {string} searchText - النص المراد البحث عنه
   * @returns {Promise<Array>} قائمة المراجعات المطابقة
   */
  static async searchReviews(productId, searchText) {
    try {
      const reviews = await mDBselectAll({
        model: ProductReviews,
        filter: { 
          product_id: productId,
          $or: [
            { review_text: { $regex: searchText, $options: 'i' } },
            { title: { $regex: searchText, $options: 'i' } }
          ]
        },
        sort: { created_at: -1 }
      });
      
      return reviews || [];
    } catch (error) {
      throw new Error(`خطأ في البحث في المراجعات: ${error.message}`);
    }
  }
}

export default ProductReviewsService;