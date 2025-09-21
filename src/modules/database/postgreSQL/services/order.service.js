import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Order, OrderItem } from '../models/index.js';

/**
 * خدمة إدارة الطلبات - Order Service
 * تحتوي على الوظائف الأساسية لإدارة الطلبات
 */
class OrderService {
  
  /**
   * إنشاء طلب جديد
   * @param {Object} orderData - بيانات الطلب
   * @returns {Promise<Object>} الطلب المُنشأ
   */
  static async createOrder(orderData) {
    try {
      // التحقق من البيانات المطلوبة
      if (!orderData.order_number || !orderData.site_id || !orderData.user_id) {
        throw new Error('البيانات المطلوبة مفقودة: order_number, site_id, user_id');
      }

      // التحقق من عدم تكرار رقم الطلب
      const existingOrder = await this.getOrderByNumber(orderData.order_number);
      if (existingOrder) {
        throw new Error('رقم الطلب موجود بالفعل');
      }

      const newOrder = await PGinsert(Order, orderData);
      return newOrder;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع الطلبات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة الطلبات
   */
  static async getAllOrders(options = {}) {
    try {
      const orders = await PGselectAll(Order, {
        include: [
          {
            model: OrderItem,
            as: 'orderItems'
          }
        ],
        ...options
      });
      return orders;
    } catch (error) {
      throw new Error(`خطأ في جلب الطلبات: ${error.message}`);
    }
  }

  /**
   * الحصول على طلب بواسطة المعرف
   * @param {number} orderId - معرف الطلب
   * @returns {Promise<Object|null>} الطلب أو null
   */
  static async getOrderById(orderId) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: OrderItem,
            as: 'orderItems'
          }
        ]
      });
      return order;
    } catch (error) {
      throw new Error(`خطأ في جلب الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على طلب بواسطة رقم الطلب
   * @param {string} orderNumber - رقم الطلب
   * @returns {Promise<Object|null>} الطلب أو null
   */
  static async getOrderByNumber(orderNumber) {
    try {
      const order = await Order.findOne({
        where: { order_number: orderNumber },
        include: [
          {
            model: OrderItem,
            as: 'orderItems'
          }
        ]
      });
      return order;
    } catch (error) {
      throw new Error(`خطأ في جلب الطلب برقم الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على طلبات المستخدم
   * @param {string} userId - معرف المستخدم
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة طلبات المستخدم
   */
  static async getOrdersByUser(userId, options = {}) {
    try {
      const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
          {
            model: OrderItem,
            as: 'orderItems'
          }
        ],
        order: [['created_at', 'DESC']],
        ...options
      });
      return orders;
    } catch (error) {
      throw new Error(`خطأ في جلب طلبات المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على طلبات الموقع
   * @param {number} siteId - معرف الموقع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة طلبات الموقع
   */
  static async getOrdersBySite(siteId, options = {}) {
    try {
      const orders = await Order.findAll({
        where: { site_id: siteId },
        include: [
          {
            model: OrderItem,
            as: 'orderItems'
          }
        ],
        order: [['created_at', 'DESC']],
        ...options
      });
      return orders;
    } catch (error) {
      throw new Error(`خطأ في جلب طلبات الموقع: ${error.message}`);
    }
  }

  /**
   * تحديث حالة الطلب
   * @param {number} orderId - معرف الطلب
   * @param {string} status - الحالة الجديدة
   * @returns {Promise<Object>} الطلب المُحدث
   */
  static async updateOrderStatus(orderId, status) {
    try {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status)) {
        throw new Error('حالة الطلب غير صحيحة');
      }

      const updatedOrder = await PGupdate(Order, orderId, { status });
      return updatedOrder;
    } catch (error) {
      throw new Error(`خطأ في تحديث حالة الطلب: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات الطلب
   * @param {number} orderId - معرف الطلب
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} الطلب المُحدث
   */
  static async updateOrder(orderId, updateData) {
    try {
      const updatedOrder = await PGupdate(Order, orderId, updateData);
      return updatedOrder;
    } catch (error) {
      throw new Error(`خطأ في تحديث الطلب: ${error.message}`);
    }
  }

  /**
   * إلغاء الطلب
   * @param {number} orderId - معرف الطلب
   * @returns {Promise<Object>} الطلب المُلغى
   */
  static async cancelOrder(orderId) {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw new Error('الطلب غير موجود');
      }

      if (!order.canBeCancelled) {
        throw new Error('لا يمكن إلغاء هذا الطلب في حالته الحالية');
      }

      const cancelledOrder = await this.updateOrderStatus(orderId, 'cancelled');
      return cancelledOrder;
    } catch (error) {
      throw new Error(`خطأ في إلغاء الطلب: ${error.message}`);
    }
  }

  /**
   * حذف الطلب
   * @param {number} orderId - معرف الطلب
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteOrder(orderId) {
    try {
      const result = await PGdelete(Order, orderId);
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الطلبات
   * @param {number} siteId - معرف الموقع (اختياري)
   * @returns {Promise<Object>} إحصائيات الطلبات
   */
  static async getOrderStats(siteId = null) {
    try {
      const whereClause = siteId ? { site_id: siteId } : {};
      
      const totalOrders = await Order.count({ where: whereClause });
      const pendingOrders = await Order.count({ where: { ...whereClause, status: 'pending' } });
      const completedOrders = await Order.count({ where: { ...whereClause, status: 'delivered' } });
      const cancelledOrders = await Order.count({ where: { ...whereClause, status: 'cancelled' } });

      return {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات الطلبات: ${error.message}`);
    }
  }
}

export default OrderService;