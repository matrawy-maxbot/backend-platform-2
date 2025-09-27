import { ProductReviewsService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم مراجعات المنتجات
 * @module ProductReviewsController
 */

/**
 * الحصول على جميع مراجعات المنتجات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllProductReviews = async (req, res, next) => {
  try {
    let productReviews = await ProductReviewsService.getProductReviews();
    productReviews = resolveDatabaseResult(productReviews);
    
    send(res, {
      success: true,
      data: productReviews
    }, 'تم جلب جميع مراجعات المنتجات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على مراجعة منتج بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getProductReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let productReview = await ProductReviewsService.getProductReviewById(id);
    productReview = resolveDatabaseResult(productReview);
    
    let status = 200;
    if (productReview.length < 1) status = 404;

    send(res, {
      success: true,
      data: productReview
    }, 'تم جلب مراجعة المنتج بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء مراجعة منتج جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createProductReview = async (req, res, next) => {
  try {
    const productReviewData = req.body;

    let newProductReview = await ProductReviewsService.addReview(productReviewData);
    newProductReview = resolveDatabaseResult(newProductReview);
    
    send(res, {
      success: true,
      data: newProductReview
    }, 'تم إنشاء مراجعة المنتج بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث مراجعة المنتج
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateProductReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedProductReview = await ProductReviewsService.updateReview(id, updateData.userId, updateData);
    updatedProductReview = resolveDatabaseResult(updatedProductReview);
    
    send(res, {
      success: true,
      data: updatedProductReview
    }, 'تم تحديث مراجعة المنتج بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف مراجعة المنتج
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteProductReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    let result = await ProductReviewsService.deleteReview(id, userId);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف مراجعة المنتج بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};