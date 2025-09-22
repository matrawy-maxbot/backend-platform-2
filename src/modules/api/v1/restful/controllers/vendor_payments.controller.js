import VendorPaymentService from '../../../../database/postgreSQL/services/VendorPayment.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم مدفوعات البائعين
 * @module VendorPaymentsController
 */

/**
 * الحصول على جميع مدفوعات البائعين
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllVendorPayments = async (req, res, next) => {
  try {
    const { vendor_id, site_id } = req.query;
    let vendorPayments;
    
    if (vendor_id && site_id) {
      vendorPayments = await VendorPaymentService.getVendorPayments(vendor_id, site_id);
    } else {
      vendorPayments = await VendorPaymentService.getPaymentsByStatus('completed', site_id);
    }
    
    vendorPayments = resolveDatabaseResult(vendorPayments);
    
    send(res, {
      success: true,
      data: vendorPayments
    }, 'تم جلب جميع مدفوعات البائعين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على مدفوعة بائع بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getVendorPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let vendorPayment = await VendorPaymentService.getPaymentWithDetails(id);
    vendorPayment = resolveDatabaseResult(vendorPayment);
    
    let status = 200;
    if (!vendorPayment || (Array.isArray(vendorPayment) && vendorPayment.length < 1)) status = 404;

    send(res, {
      success: true,
      data: vendorPayment
    }, 'تم جلب مدفوعة البائع بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء مدفوعة بائع جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createVendorPayment = async (req, res, next) => {
  try {
    let newVendorPayment = await VendorPaymentService.createPayment(req.body);
    newVendorPayment = resolveDatabaseResult(newVendorPayment);
    
    send(res, {
      success: true,
      data: newVendorPayment
    }, 'تم إنشاء مدفوعة البائع بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث مدفوعة بائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateVendorPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updatedVendorPayment = await VendorPaymentService.updatePaymentStatus(id, req.body.payment_status, req.body);
    updatedVendorPayment = resolveDatabaseResult(updatedVendorPayment);
    
    send(res, {
      success: true,
      data: updatedVendorPayment
    }, 'تم تحديث مدفوعة البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف مدفوعة بائع
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteVendorPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deletedVendorPayment = await VendorPaymentService.deletePayment(id);
    deletedVendorPayment = resolveDatabaseResult(deletedVendorPayment);
    
    send(res, {
      success: true,
      data: deletedVendorPayment
    }, 'تم حذف مدفوعة البائع بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};