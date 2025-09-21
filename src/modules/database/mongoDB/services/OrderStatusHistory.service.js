import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { OrderStatusHistory } from '../models/index.js';

/**
 * خدمة إدارة تاريخ حالة الطلبات - OrderStatusHistory Service
 * تحتوي على الوظائف الأساسية لتتبع تغييرات حالة الطلبات
 */
class OrderStatusHistoryService {

  /**
   * إضافة حالة جديدة للطلب
   * @param {Object} statusData - بيانات الحالة
   * @returns {Promise<Object>} الحالة المُضافة
   */
  static async addOrderStatus(statusData) {
    try {
      if (!statusData.order_id || !statusData.status) {
        throw new Error('البيانات المطلوبة مفقودة: order_id, status');
      }

      const newStatus = await mDBinsert(OrderStatusHistory, statusData);
      return newStatus;
    } catch (error) {
      throw new Error(`خطأ في إضافة حالة الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على تاريخ حالات الطلب
   * @param {number} orderId - معرف الطلب
   * @returns {Promise<Array>} قائمة تاريخ الحالات
   */
  static async getOrderStatusHistory(orderId) {
    try {
      const history = await mDBselectAll({
        model: OrderStatusHistory,
        filter: { order_id: orderId }
      });
      return history || [];
    } catch (error) {
      throw new Error(`خطأ في جلب تاريخ حالات الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على آخر حالة للطلب
   * @param {number} orderId - معرف الطلب
   * @returns {Promise<Object|null>} آخر حالة أو null
   */
  static async getLatestOrderStatus(orderId) {
    try {
      const history = await this.getOrderStatusHistory(orderId);
      return history.length > 0 ? history[history.length - 1] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب آخر حالة للطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على الطلبات حسب الحالة
   * @param {string} status - الحالة المطلوبة
   * @returns {Promise<Array>} قائمة الطلبات
   */
  static async getOrdersByStatus(status) {
    try {
      const orders = await mDBselectAll({
        model: OrderStatusHistory,
        filter: { status: status }
      });
      return orders || [];
    } catch (error) {
      throw new Error(`خطأ في جلب الطلبات حسب الحالة: ${error.message}`);
    }
  }

  /**
   * تحديث ملاحظات حالة معينة
   * @param {string} statusId - معرف الحالة
   * @param {string} notes - الملاحظات الجديدة
   * @returns {Promise<Object>} الحالة المُحدثة
   */
  static async updateStatusNotes(statusId, notes) {
    try {
      const updatedStatus = await mDBupdate(
        OrderStatusHistory, 
        { _id: statusId }, 
        { notes: notes }
      );
      return updatedStatus;
    } catch (error) {
      throw new Error(`خطأ في تحديث ملاحظات الحالة: ${error.message}`);
    }
  }

  /**
   * حذف حالة معينة (للاستخدام الإداري فقط)
   * @param {string} statusId - معرف الحالة
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteOrderStatus(statusId) {
    try {
      const result = await mDBdelete(OrderStatusHistory, { _id: statusId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف حالة الطلب: ${error.message}`);
    }
  }
}

export default OrderStatusHistoryService;