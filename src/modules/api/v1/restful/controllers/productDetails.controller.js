import { ProductDetailsService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم تفاصيل المنتجات
 * @module ProductDetailsController
 */

/**
 * الحصول على جميع تفاصيل المنتجات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllProductDetails = async (req, res, next) => {
  try {
    let productDetails = await ProductDetailsService.getAllProductDetails();
    productDetails = resolveDatabaseResult(productDetails);
    
    send(res, {
      success: true,
      data: productDetails
    }, 'تم جلب جميع تفاصيل المنتجات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على تفاصيل منتج بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getProductDetailsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let productDetails = await ProductDetailsService.getProductDetailsById(id);
    productDetails = resolveDatabaseResult(productDetails);
    
    let status = 200;
    if (!productDetails || (Array.isArray(productDetails) && productDetails.length < 1)) status = 404;

    send(res, {
      success: true,
      data: productDetails
    }, 'تم جلب تفاصيل المنتج بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء تفاصيل منتج جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createProductDetails = async (req, res, next) => {
  try {
    const productDetailsData = req.body;

    let newProductDetails = await ProductDetailsService.createProductDetails(productDetailsData);
    newProductDetails = resolveDatabaseResult(newProductDetails);
    
    send(res, {
      success: true,
      data: newProductDetails
    }, 'تم إنشاء تفاصيل المنتج بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث تفاصيل المنتج
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedProductDetails = await ProductDetailsService.updateProductDetails(id, updateData);
    updatedProductDetails = resolveDatabaseResult(updatedProductDetails);
    
    send(res, {
      success: true,
      data: updatedProductDetails
    }, 'تم تحديث تفاصيل المنتج بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف تفاصيل المنتج
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await ProductDetailsService.deleteProductDetails(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف تفاصيل المنتج بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};