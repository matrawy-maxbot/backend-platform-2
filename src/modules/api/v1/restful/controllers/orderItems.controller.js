import OrderItemService from '../../../../database/postgreSQL/services/OrderItem.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم عناصر الطلبات
 * @module OrderItemsController
 */

/**
 * الحصول على جميع عناصر الطلبات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllOrderItems = async (req, res, next) => {
  try {
    let orderItems = await OrderItemService.getAllOrderItems();
    orderItems = resolveDatabaseResult(orderItems);
    
    send(res, {
      success: true,
      data: orderItems
    }, 'تم جلب جميع عناصر الطلبات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على عنصر طلب بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getOrderItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let orderItem = await OrderItemService.getOrderItemById(id);
    orderItem = resolveDatabaseResult(orderItem);
    
    let status = 200;
    if (!orderItem || (Array.isArray(orderItem) && orderItem.length < 1)) status = 404;

    send(res, {
      success: true,
      data: orderItem
    }, 'تم جلب عنصر الطلب بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء عنصر طلب جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createOrderItem = async (req, res, next) => {
  try {
    const orderItemData = req.body;

    let newOrderItem = await OrderItemService.createOrderItem(orderItemData);
    newOrderItem = resolveDatabaseResult(newOrderItem);
    
    send(res, {
      success: true,
      data: newOrderItem
    }, 'تم إنشاء عنصر الطلب بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث عنصر الطلب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedOrderItem = await OrderItemService.updateOrderItem(id, updateData);
    updatedOrderItem = resolveDatabaseResult(updatedOrderItem);
    
    send(res, {
      success: true,
      data: updatedOrderItem
    }, 'تم تحديث عنصر الطلب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف عنصر الطلب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await OrderItemService.deleteOrderItem(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف عنصر الطلب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};