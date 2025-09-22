import PaymentService from '../../../../database/postgreSQL/services/payment.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم المدفوعات
 * @module PaymentsController
 */

/**
 * الحصول على جميع المدفوعات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllPayments = async (req, res, next) => {
  try {
    let payments = await PaymentService.getAllPayments();
    payments = resolveDatabaseResult(payments);
    
    send(res, {
      success: true,
      data: payments
    }, 'تم جلب جميع المدفوعات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على مدفوعة بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let payment = await PaymentService.getPaymentById(id);
    payment = resolveDatabaseResult(payment);
    
    let status = 200;
    if (payment.length < 1) status = 404;

    send(res, {
      success: true,
      data: payment
    }, 'تم جلب المدفوعة بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء مدفوعة جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createPayment = async (req, res, next) => {
  try {
    const paymentData = req.body;

    let newPayment = await PaymentService.createPayment(paymentData);
    newPayment = resolveDatabaseResult(newPayment);
    
    send(res, {
      success: true,
      data: newPayment
    }, 'تم إنشاء المدفوعة بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث المدفوعة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedPayment = await PaymentService.updatePayment(id, updateData);
    updatedPayment = resolveDatabaseResult(updatedPayment);
    
    send(res, {
      success: true,
      data: updatedPayment
    }, 'تم تحديث المدفوعة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف المدفوعة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await PaymentService.deletePayment(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف المدفوعة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};