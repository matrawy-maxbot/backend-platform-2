import OrderService from '../../../../database/postgreSQL/services/order.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم الطلبات
 * @module OrdersController
 */

/**
 * الحصول على جميع الطلبات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllOrders = async (req, res, next) => {
  try {
    let orders = await OrderService.getAllOrders();
    orders = resolveDatabaseResult(orders);
    
    send(res, {
      success: true,
      data: orders
    }, 'تم جلب جميع الطلبات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على طلب بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = await OrderService.getOrderById(id);
    order = resolveDatabaseResult(order);
    
    let status = 200;
    if (order.length < 1) status = 404;

    send(res, {
      success: true,
      data: order
    }, 'تم جلب الطلب بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء طلب جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;

    let newOrder = await OrderService.createOrder(orderData);
    newOrder = resolveDatabaseResult(newOrder);
    
    send(res, {
      success: true,
      data: newOrder
    }, 'تم إنشاء الطلب بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث الطلب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedOrder = await OrderService.updateOrder(id, updateData);
    updatedOrder = resolveDatabaseResult(updatedOrder);
    
    send(res, {
      success: true,
      data: updatedOrder
    }, 'تم تحديث الطلب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف الطلب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await OrderService.deleteOrder(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف الطلب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};