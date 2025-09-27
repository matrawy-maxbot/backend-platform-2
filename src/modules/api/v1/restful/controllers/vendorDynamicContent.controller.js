import { VendorDynamicContentService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم المحتوى الديناميكي للبائعين
 * @module VendorDynamicContentController
 */

/**
 * الحصول على جميع المحتوى الديناميكي للبائعين
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorDynamicContent = async (req, res, next) => {
  try {
    let vendorDynamicContent = await VendorDynamicContentService.getAllVendorDynamicContent();
    vendorDynamicContent = resolveDatabaseResult(vendorDynamicContent);
    
    send(res, {
      success: true,
      data: vendorDynamicContent
    }, 'تم جلب جميع المحتوى الديناميكي للبائعين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على محتوى ديناميكي للبائع بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorDynamicContentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let vendorDynamicContent = await VendorDynamicContentService.getVendorDynamicContentById(id);
    vendorDynamicContent = resolveDatabaseResult(vendorDynamicContent);
    
    let status = 200;
    if (vendorDynamicContent.length < 1) status = 404;

    send(res, {
      success: true,
      data: vendorDynamicContent
    }, 'تم جلب المحتوى الديناميكي للبائع بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء محتوى ديناميكي جديد للبائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorDynamicContent = async (req, res, next) => {
  try {
    const vendorDynamicContentData = req.body;

    let newVendorDynamicContent = await VendorDynamicContentService.createVendorDynamicContent(vendorDynamicContentData);
    newVendorDynamicContent = resolveDatabaseResult(newVendorDynamicContent);
    
    send(res, {
      success: true,
      data: newVendorDynamicContent
    }, 'تم إنشاء المحتوى الديناميكي للبائع بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث المحتوى الديناميكي للبائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorDynamicContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedVendorDynamicContent = await VendorDynamicContentService.updateVendorDynamicContent(id, updateData);
    updatedVendorDynamicContent = resolveDatabaseResult(updatedVendorDynamicContent);
    
    send(res, {
      success: true,
      data: updatedVendorDynamicContent
    }, 'تم تحديث المحتوى الديناميكي للبائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف المحتوى الديناميكي للبائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorDynamicContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await VendorDynamicContentService.deleteVendorDynamicContent(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف المحتوى الديناميكي للبائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};