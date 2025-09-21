import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Payment } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة المدفوعات - Payment Service
 * تحتوي على الوظائف الأساسية لإدارة عمليات الدفع
 */
class PaymentService {
  
  /**
   * إنشاء عملية دفع جديدة
   * @param {Object} paymentData - بيانات الدفع
   * @returns {Promise<Object>} عملية الدفع المُنشأة
   */
  static async createPayment(paymentData) {
    try {
      // التحقق من البيانات المطلوبة
      if (!paymentData.order_id || !paymentData.amount || !paymentData.payment_method) {
        throw new Error('البيانات المطلوبة مفقودة: order_id, amount, payment_method');
      }

      // تعيين القيم الافتراضية
      const defaultData = {
        status: 'pending',
        currency: 'EGP',
        created_at: new Date(),
        ...paymentData
      };

      const newPayment = await PGinsert(Payment, defaultData);
      return newPayment;
    } catch (error) {
      throw new Error(`خطأ في إنشاء عملية الدفع: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع المدفوعات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة المدفوعات
   */
  static async getAllPayments(options = {}) {
    try {
      const payments = await Payment.findAll({
        order: [['created_at', 'DESC']],
        ...options
      });
      return payments;
    } catch (error) {
      throw new Error(`خطأ في جلب المدفوعات: ${error.message}`);
    }
  }

  /**
   * الحصول على عملية دفع بواسطة المعرف
   * @param {number} paymentId - معرف عملية الدفع
   * @returns {Promise<Object|null>} عملية الدفع أو null
   */
  static async getPaymentById(paymentId) {
    try {
      const payment = await Payment.findByPk(paymentId);
      return payment;
    } catch (error) {
      throw new Error(`خطأ في جلب عملية الدفع: ${error.message}`);
    }
  }

  /**
   * الحصول على مدفوعات الطلب
   * @param {number} orderId - معرف الطلب
   * @returns {Promise<Array>} قائمة مدفوعات الطلب
   */
  static async getPaymentsByOrder(orderId) {
    try {
      const payments = await Payment.findAll({
        where: { order_id: orderId },
        order: [['created_at', 'DESC']]
      });
      return payments;
    } catch (error) {
      throw new Error(`خطأ في جلب مدفوعات الطلب: ${error.message}`);
    }
  }

  /**
   * الحصول على عملية دفع بواسطة معرف المعاملة
   * @param {string} transactionId - معرف المعاملة
   * @returns {Promise<Object|null>} عملية الدفع أو null
   */
  static async getPaymentByTransactionId(transactionId) {
    try {
      const payment = await Payment.findOne({
        where: { transaction_id: transactionId }
      });
      return payment;
    } catch (error) {
      throw new Error(`خطأ في جلب عملية الدفع بمعرف المعاملة: ${error.message}`);
    }
  }

  /**
   * الحصول على المدفوعات حسب الحالة
   * @param {string} status - حالة الدفع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة المدفوعات
   */
  static async getPaymentsByStatus(status, options = {}) {
    try {
      const payments = await Payment.findAll({
        where: { status: status },
        order: [['created_at', 'DESC']],
        ...options
      });
      return payments;
    } catch (error) {
      throw new Error(`خطأ في جلب المدفوعات بالحالة: ${error.message}`);
    }
  }

  /**
   * الحصول على المدفوعات حسب طريقة الدفع
   * @param {string} paymentMethod - طريقة الدفع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة المدفوعات
   */
  static async getPaymentsByMethod(paymentMethod, options = {}) {
    try {
      const payments = await Payment.findAll({
        where: { payment_method: paymentMethod },
        order: [['created_at', 'DESC']],
        ...options
      });
      return payments;
    } catch (error) {
      throw new Error(`خطأ في جلب المدفوعات بطريقة الدفع: ${error.message}`);
    }
  }

  /**
   * تحديث حالة الدفع
   * @param {number} paymentId - معرف عملية الدفع
   * @param {string} status - الحالة الجديدة
   * @param {Object} additionalData - بيانات إضافية
   * @returns {Promise<Object>} عملية الدفع المُحدثة
   */
  static async updatePaymentStatus(paymentId, status, additionalData = {}) {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw new Error('عملية الدفع غير موجودة');
      }

      const updateData = {
        status: status,
        updated_at: new Date(),
        ...additionalData
      };

      // إضافة تاريخ الدفع إذا كانت الحالة مكتملة
      if (status === 'completed') {
        updateData.paid_at = new Date();
      }

      const updatedPayment = await PGupdate(Payment, paymentId, updateData);
      return updatedPayment;
    } catch (error) {
      throw new Error(`خطأ في تحديث حالة الدفع: ${error.message}`);
    }
  }

  /**
   * تأكيد الدفع
   * @param {number} paymentId - معرف عملية الدفع
   * @param {string} transactionId - معرف المعاملة
   * @param {Object} additionalData - بيانات إضافية
   * @returns {Promise<Object>} عملية الدفع المُحدثة
   */
  static async confirmPayment(paymentId, transactionId, additionalData = {}) {
    try {
      const updateData = {
        transaction_id: transactionId,
        ...additionalData
      };

      const updatedPayment = await this.updatePaymentStatus(paymentId, 'completed', updateData);
      return updatedPayment;
    } catch (error) {
      throw new Error(`خطأ في تأكيد الدفع: ${error.message}`);
    }
  }

  /**
   * رفض الدفع
   * @param {number} paymentId - معرف عملية الدفع
   * @param {string} reason - سبب الرفض
   * @returns {Promise<Object>} عملية الدفع المُحدثة
   */
  static async rejectPayment(paymentId, reason = null) {
    try {
      const updateData = {};
      if (reason) {
        updateData.failure_reason = reason;
      }

      const updatedPayment = await this.updatePaymentStatus(paymentId, 'failed', updateData);
      return updatedPayment;
    } catch (error) {
      throw new Error(`خطأ في رفض الدفع: ${error.message}`);
    }
  }

  /**
   * إلغاء الدفع
   * @param {number} paymentId - معرف عملية الدفع
   * @param {string} reason - سبب الإلغاء
   * @returns {Promise<Object>} عملية الدفع المُحدثة
   */
  static async cancelPayment(paymentId, reason = null) {
    try {
      const updateData = {};
      if (reason) {
        updateData.failure_reason = reason;
      }

      const updatedPayment = await this.updatePaymentStatus(paymentId, 'cancelled', updateData);
      return updatedPayment;
    } catch (error) {
      throw new Error(`خطأ في إلغاء الدفع: ${error.message}`);
    }
  }

  /**
   * استرداد الدفع
   * @param {number} paymentId - معرف عملية الدفع
   * @param {number} refundAmount - مبلغ الاسترداد (اختياري)
   * @param {string} reason - سبب الاسترداد
   * @returns {Promise<Object>} عملية الدفع المُحدثة
   */
  static async refundPayment(paymentId, refundAmount = null, reason = null) {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw new Error('عملية الدفع غير موجودة');
      }

      if (payment.status !== 'completed') {
        throw new Error('لا يمكن استرداد دفعة غير مكتملة');
      }

      const updateData = {
        refund_amount: refundAmount || payment.amount,
        refunded_at: new Date()
      };

      if (reason) {
        updateData.refund_reason = reason;
      }

      const updatedPayment = await this.updatePaymentStatus(paymentId, 'refunded', updateData);
      return updatedPayment;
    } catch (error) {
      throw new Error(`خطأ في استرداد الدفع: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات الدفع
   * @param {number} paymentId - معرف عملية الدفع
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} عملية الدفع المُحدثة
   */
  static async updatePayment(paymentId, updateData) {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw new Error('عملية الدفع غير موجودة');
      }

      updateData.updated_at = new Date();
      const updatedPayment = await PGupdate(Payment, paymentId, updateData);
      return updatedPayment;
    } catch (error) {
      throw new Error(`خطأ في تحديث عملية الدفع: ${error.message}`);
    }
  }

  /**
   * حذف عملية الدفع
   * @param {number} paymentId - معرف عملية الدفع
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deletePayment(paymentId) {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw new Error('عملية الدفع غير موجودة');
      }

      // منع حذف المدفوعات المكتملة
      if (payment.status === 'completed') {
        throw new Error('لا يمكن حذف عملية دفع مكتملة');
      }

      const result = await PGdelete(Payment, paymentId);
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف عملية الدفع: ${error.message}`);
    }
  }

  /**
   * الحصول على إجمالي المدفوعات
   * @param {Object} filters - مرشحات الاستعلام
   * @returns {Promise<Object>} إجمالي المدفوعات
   */
  static async getPaymentTotals(filters = {}) {
    try {
      const whereClause = { ...filters };

      const totalAmount = await Payment.sum('amount', { where: whereClause });
      const completedAmount = await Payment.sum('amount', { 
        where: { ...whereClause, status: 'completed' } 
      });
      const refundedAmount = await Payment.sum('refund_amount', { 
        where: { ...whereClause, status: 'refunded' } 
      });

      return {
        total: totalAmount || 0,
        completed: completedAmount || 0,
        refunded: refundedAmount || 0,
        net: (completedAmount || 0) - (refundedAmount || 0)
      };
    } catch (error) {
      throw new Error(`خطأ في حساب إجمالي المدفوعات: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات المدفوعات
   * @param {Object} filters - مرشحات الاستعلام
   * @returns {Promise<Object>} إحصائيات المدفوعات
   */
  static async getPaymentStats(filters = {}) {
    try {
      const whereClause = { ...filters };

      const totalPayments = await Payment.count({ where: whereClause });
      const completedPayments = await Payment.count({ 
        where: { ...whereClause, status: 'completed' } 
      });
      const pendingPayments = await Payment.count({ 
        where: { ...whereClause, status: 'pending' } 
      });
      const failedPayments = await Payment.count({ 
        where: { ...whereClause, status: 'failed' } 
      });

      const totals = await this.getPaymentTotals(filters);

      return {
        count: {
          total: totalPayments,
          completed: completedPayments,
          pending: pendingPayments,
          failed: failedPayments
        },
        amounts: totals
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات المدفوعات: ${error.message}`);
    }
  }

  /**
   * البحث في المدفوعات
   * @param {Object} searchCriteria - معايير البحث
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} نتائج البحث
   */
  static async searchPayments(searchCriteria, options = {}) {
    try {
      const whereClause = {};

      // البحث بمعرف المعاملة
      if (searchCriteria.transaction_id) {
        whereClause.transaction_id = {
          [Op.iLike]: `%${searchCriteria.transaction_id}%`
        };
      }

      // البحث بالمبلغ
      if (searchCriteria.amount) {
        whereClause.amount = searchCriteria.amount;
      }

      // البحث بالحالة
      if (searchCriteria.status) {
        whereClause.status = searchCriteria.status;
      }

      // البحث بطريقة الدفع
      if (searchCriteria.payment_method) {
        whereClause.payment_method = searchCriteria.payment_method;
      }

      // البحث بالتاريخ
      if (searchCriteria.date_from || searchCriteria.date_to) {
        whereClause.created_at = {};
        if (searchCriteria.date_from) {
          whereClause.created_at[Op.gte] = new Date(searchCriteria.date_from);
        }
        if (searchCriteria.date_to) {
          whereClause.created_at[Op.lte] = new Date(searchCriteria.date_to);
        }
      }

      const payments = await Payment.findAll({
        where: whereClause,
        order: [['created_at', 'DESC']],
        ...options
      });

      return payments;
    } catch (error) {
      throw new Error(`خطأ في البحث في المدفوعات: ${error.message}`);
    }
  }
}

export default PaymentService;