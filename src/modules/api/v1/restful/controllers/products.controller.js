import { ProductService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم المنتجات
 * @module ProductsController
 */

/**
 * الحصول على جميع المنتجات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllProducts = async (req, res, next) => {
  try {
    let products = await ProductService.getAllProducts();
    products = resolveDatabaseResult(products);
    
    send(res, {
      success: true,
      data: products
    }, 'تم جلب جميع المنتجات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على منتج بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await ProductService.getProductById(id);
    product = resolveDatabaseResult(product);
    
    let status = 200;
    if (product.length < 1) status = 404;

    send(res, {
      success: true,
      data: product
    }, 'تم جلب المنتج بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء منتج جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;

    let newProduct = await ProductService.createProduct(productData);
    newProduct = resolveDatabaseResult(newProduct);
    
    send(res, {
      success: true,
      data: newProduct
    }, 'تم إنشاء المنتج بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث المنتج
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedProduct = await ProductService.updateProduct(id, updateData);
    updatedProduct = resolveDatabaseResult(updatedProduct);
    
    send(res, {
      success: true,
      data: updatedProduct
    }, 'تم تحديث المنتج بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف المنتج
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await ProductService.deleteProduct(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف المنتج بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};