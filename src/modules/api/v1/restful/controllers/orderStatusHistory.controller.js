import { OrderStatusHistoryService } from '../../../../database/mongoDB/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم تاريخ حالة الطلبات
 * @module OrderStatusHistoryController
 */

/**
 * الحصول على جميع سجلات تاريخ حالة الطلبات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllOrderStatusHistories = async (req, res, next) => {
  try {
    let orderStatusHistories = await OrderStatusHistoryService.getAllOrderStatusHistories();
    orderStatusHistories = resolveDatabaseResult(orderStatusHistories);
    
    send(res, {
      success: true,
      data: orderStatusHistories
    }, 'تم جلب جميع سجلات تاريخ حالة الطلبات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجل تاريخ حالة الطلب بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getOrderStatusHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let orderStatusHistory = await OrderStatusHistoryService.getOrderStatusHistoryById(id);
    orderStatusHistory = resolveDatabaseResult(orderStatusHistory);
    
    let status = 200;
    if (orderStatusHistory.length < 1) status = 404;

    send(res, {
      success: true,
      data: orderStatusHistory
    }, 'تم جلب سجل تاريخ حالة الطلب بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء سجل تاريخ حالة طلب جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createOrderStatusHistory = async (req, res, next) => {
  try {
    const orderStatusHistoryData = req.body;

    let newOrderStatusHistory = await OrderStatusHistoryService.createOrderStatusHistory(orderStatusHistoryData);
    newOrderStatusHistory = resolveDatabaseResult(newOrderStatusHistory);
    
    send(res, {
      success: true,
      data: newOrderStatusHistory
    }, 'تم إنشاء سجل تاريخ حالة الطلب بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث سجل تاريخ حالة الطلب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateOrderStatusHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedOrderStatusHistory = await OrderStatusHistoryService.updateOrderStatusHistory(id, updateData);
    updatedOrderStatusHistory = resolveDatabaseResult(updatedOrderStatusHistory);
    
    send(res, {
      success: true,
      data: updatedOrderStatusHistory
    }, 'تم تحديث سجل تاريخ حالة الطلب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف سجل تاريخ حالة الطلب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteOrderStatusHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await OrderStatusHistoryService.deleteOrderStatusHistory(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف سجل تاريخ حالة الطلب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};