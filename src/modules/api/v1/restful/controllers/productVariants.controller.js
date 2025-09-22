import ProductVariantService from '../../../../database/postgreSQL/services/productVariant.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم متغيرات المنتجات
 * @module ProductVariantsController
 */

/**
 * الحصول على جميع متغيرات المنتجات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllProductVariants = async (req, res, next) => {
  try {
    let productVariants = await ProductVariantService.getAllProductVariants();
    productVariants = resolveDatabaseResult(productVariants);
    
    send(res, {
      success: true,
      data: productVariants
    }, 'تم جلب جميع متغيرات المنتجات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على متغير منتج بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getProductVariantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let productVariant = await ProductVariantService.getProductVariantById(id);
    productVariant = resolveDatabaseResult(productVariant);
    
    let status = 200;
    if (!productVariant) status = 404;

    send(res, {
      success: true,
      data: productVariant
    }, 'تم جلب متغير المنتج بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء متغير منتج جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createProductVariant = async (req, res, next) => {
  try {
    const productVariantData = req.body;

    let newProductVariant = await ProductVariantService.createProductVariant(productVariantData);
    newProductVariant = resolveDatabaseResult(newProductVariant);
    
    send(res, {
      success: true,
      data: newProductVariant
    }, 'تم إنشاء متغير المنتج بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث متغير المنتج
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateProductVariant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedProductVariant = await ProductVariantService.updateProductVariant(id, updateData);
    updatedProductVariant = resolveDatabaseResult(updatedProductVariant);
    
    send(res, {
      success: true,
      data: updatedProductVariant
    }, 'تم تحديث متغير المنتج بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف متغير المنتج
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteProductVariant = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await ProductVariantService.deleteProductVariant(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف متغير المنتج بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};