import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { OrderItem, Order } from '../models/index.js';

/**
 * خدمة إدارة عناصر الطلبات - OrderItem Service
 * تحتوي على الوظائف الأساسية لإدارة عناصر الطلبات
 */
class OrderItemService {
  
  /**
   * إنشاء عنصر طلب جديد
   * @param {Object} orderItemData - بيانات عنصر الطلب
   * @returns {Promise<Object>} عنصر الطلب المُنشأ
   */
  static async createOrderItem(orderItemData) {
    try {
      // التحقق من البيانات المطلوبة
      if (!orderItemData.order_id || !orderItemData.product_id || !orderItemData.site_id) {
        throw new Error('البيانات المطلوبة مفقودة: order_id, product_id, site_id');
      }

      if (!orderItemData.quantity || orderItemData.quantity < 1) {
        throw new Error('الكمية يجب أن تكون أكبر من صفر');
      }

      if (!orderItemData.unit_price || orderItemData.unit_price < 0) {
        throw new Error('سعر الوحدة يجب أن يكون أكبر من أو يساوي صفر');
      }

      // حساب السعر الإجمالي إذا لم يتم تمريره
      if (!orderItemData.total_price) {
        orderItemData.total_price = (orderItemData.unit_price * orderItemData.quantity) - (orderItemData.discount_amount || 0);
      }

      const newOrderItem = await PGinsert(OrderItem, orderItemData);
      return newOrderItem;
    } catch (error) {
      throw new Error(`خطأ في إنشاء عنصر الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع عناصر الطلبات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة عناصر الطلبات
   */
  static async getAllOrderItems(options = {}) {
    try {
      const orderItems = await OrderItem.findAll({
        include: [
          {
            model: Order,
            as: 'order'
          }
        ],
        ...options
      });
      return orderItems;
    } catch (error) {
      throw new Error(`خطأ في جلب عناصر الطلبات: ${error.message}`);
    }
  }

  /**
   * الحصول على عنصر طلب بواسطة المعرف
   * @param {number} orderItemId - معرف عنصر الطلب
   * @returns {Promise<Object|null>} عنصر الطلب أو null
   */
  static async getOrderItemById(orderItemId) {
    try {
      const orderItem = await OrderItem.findByPk(orderItemId, {
        include: [
          {
            model: Order,
            as: 'order'
          }
        ]
      });
      return orderItem;
    } catch (error) {
      throw new Error(`خطأ في جلب عنصر الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على عناصر طلب معين
   * @param {number} orderId - معرف الطلب
   * @returns {Promise<Array>} قائمة عناصر الطلب
   */
  static async getOrderItemsByOrder(orderId) {
    try {
      const orderItems = await OrderItem.findAll({
        where: { order_id: orderId },
        order: [['created_at', 'ASC']]
      });
      return orderItems;
    } catch (error) {
      throw new Error(`خطأ في جلب عناصر الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على عناصر الطلبات لمنتج معين
   * @param {string} productId - معرف المنتج
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة عناصر الطلبات للمنتج
   */
  static async getOrderItemsByProduct(productId, options = {}) {
    try {
      const orderItems = await OrderItem.findAll({
        where: { product_id: productId },
        include: [
          {
            model: Order,
            as: 'order'
          }
        ],
        order: [['created_at', 'DESC']],
        ...options
      });
      return orderItems;
    } catch (error) {
      throw new Error(`خطأ في جلب عناصر الطلبات للمنتج: ${error.message}`);
    }
  }

  /**
   * الحصول على عناصر الطلبات للموقع
   * @param {number} siteId - معرف الموقع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة عناصر الطلبات للموقع
   */
  static async getOrderItemsBySite(siteId, options = {}) {
    try {
      const orderItems = await OrderItem.findAll({
        where: { site_id: siteId },
        include: [
          {
            model: Order,
            as: 'order'
          }
        ],
        order: [['created_at', 'DESC']],
        ...options
      });
      return orderItems;
    } catch (error) {
      throw new Error(`خطأ في جلب عناصر الطلبات للموقع: ${error.message}`);
    }
  }

  /**
   * تحديث عنصر الطلب
   * @param {number} orderItemId - معرف عنصر الطلب
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} عنصر الطلب المُحدث
   */
  static async updateOrderItem(orderItemId, updateData) {
    try {
      // إعادة حساب السعر الإجمالي إذا تم تحديث الكمية أو السعر
      if (updateData.quantity || updateData.unit_price || updateData.discount_amount !== undefined) {
        const currentItem = await this.getOrderItemById(orderItemId);
        if (currentItem) {
          const quantity = updateData.quantity || currentItem.quantity;
          const unitPrice = updateData.unit_price || currentItem.unit_price;
          const discountAmount = updateData.discount_amount !== undefined ? updateData.discount_amount : currentItem.discount_amount;
          
          updateData.total_price = (unitPrice * quantity) - discountAmount;
        }
      }

      const updatedOrderItem = await PGupdate(OrderItem, updateData, { id: orderItemId });
      return updatedOrderItem;
    } catch (error) {
      throw new Error(`خطأ في تحديث عنصر الطلب: ${error.message}`);
    }
  }

  /**
   * تحديث كمية عنصر الطلب
   * @param {number} orderItemId - معرف عنصر الطلب
   * @param {number} quantity - الكمية الجديدة
   * @returns {Promise<Object>} عنصر الطلب المُحدث
   */
  static async updateOrderItemQuantity(orderItemId, quantity) {
    try {
      if (quantity < 1) {
        throw new Error('الكمية يجب أن تكون أكبر من صفر');
      }

      const updatedOrderItem = await this.updateOrderItem(orderItemId, { quantity });
      return updatedOrderItem;
    } catch (error) {
      throw new Error(`خطأ في تحديث كمية عنصر الطلب: ${error.message}`);
    }
  }

  /**
   * حذف عنصر الطلب
   * @param {number} orderItemId - معرف عنصر الطلب
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteOrderItem(orderItemId) {
    try {
      const result = await PGdelete(OrderItem, { id: orderItemId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف عنصر الطلب: ${error.message}`);
    }
  }

  /**
   * حذف جميع عناصر طلب معين
   * @param {number} orderId - معرف الطلب
   * @returns {Promise<number>} عدد العناصر المحذوفة
   */
  static async deleteOrderItemsByOrder(orderId) {
    try {
      const deletedCount = await OrderItem.destroy({
        where: { order_id: orderId }
      });
      return deletedCount;
    } catch (error) {
      throw new Error(`خطأ في حذف عناصر الطلب: ${error.message}`);
    }
  }

  /**
   * حساب إجمالي قيمة عناصر طلب معين
   * @param {number} orderId - معرف الطلب
   * @returns {Promise<Object>} إجمالي القيم
   */
  static async calculateOrderItemsTotals(orderId) {
    try {
      const orderItems = await this.getOrderItemsByOrder(orderId);
      
      let subtotal = 0;
      let totalDiscount = 0;
      let totalQuantity = 0;

      orderItems.forEach(item => {
        subtotal += parseFloat(item.unit_price) * parseInt(item.quantity);
        totalDiscount += parseFloat(item.discount_amount || 0);
        totalQuantity += parseInt(item.quantity);
      });

      const total = subtotal - totalDiscount;

      return {
        subtotal: subtotal.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        total: total.toFixed(2),
        totalQuantity,
        itemsCount: orderItems.length
      };
    } catch (error) {
      throw new Error(`خطأ في حساب إجمالي عناصر الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على أكثر المنتجات مبيعاً
   * @param {number} siteId - معرف الموقع (اختياري)
   * @param {number} limit - عدد النتائج (افتراضي: 10)
   * @returns {Promise<Array>} قائمة أكثر المنتجات مبيعاً
   */
  static async getTopSellingProducts(siteId = null, limit = 10) {
    try {
      const whereClause = siteId ? { site_id: siteId } : {};
      
      const topProducts = await OrderItem.findAll({
        attributes: [
          'product_id',
          'product_name',
          [OrderItem.sequelize.fn('SUM', OrderItem.sequelize.col('quantity')), 'total_sold'],
          [OrderItem.sequelize.fn('COUNT', OrderItem.sequelize.col('id')), 'order_count']
        ],
        where: whereClause,
        group: ['product_id', 'product_name'],
        order: [[OrderItem.sequelize.fn('SUM', OrderItem.sequelize.col('quantity')), 'DESC']],
        limit
      });

      return topProducts;
    } catch (error) {
      throw new Error(`خطأ في جلب أكثر المنتجات مبيعاً: ${error.message}`);
    }
  }
}

export default OrderItemService;