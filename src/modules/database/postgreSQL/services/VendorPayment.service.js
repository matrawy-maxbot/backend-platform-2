import { VendorPayment, VendorSubscription, SubscriptionPlan, Vendor } from '../models/index.js';
import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';

/**
 * خدمة إدارة مدفوعات البائعين - VendorPayment Service
 * تحتوي على العمليات الأساسية لإدارة مدفوعات اشتراكات البائعين
 */
class VendorPaymentService {
    
    /**
     * إنشاء دفعة جديدة - Create new payment
     * @param {Object} paymentData - بيانات الدفعة
     * @returns {Promise<Object>} - الدفعة المنشأة
     */
    static async createPayment(paymentData) {
        try {
            // إنشاء معرف معاملة فريد إذا لم يتم توفيره
            if (!paymentData.transaction_id) {
                paymentData.transaction_id = this.generateTransactionId();
            }

            const newPayment = await PGinsert(VendorPayment, paymentData);
            return await this.getPaymentWithDetails(newPayment.id);
        } catch (error) {
            throw new Error(`خطأ في إنشاء الدفعة: ${error.message}`);
        }
    }

    /**
     * الحصول على دفعة مع التفاصيل - Get payment with details
     * @param {number} paymentId - معرف الدفعة
     * @returns {Promise<Object>} - الدفعة مع التفاصيل
     */
    static async getPaymentWithDetails(paymentId) {
        try {
            const payment = await VendorPayment.findOne({
                where: { id: paymentId },
                include: [
                    {
                        model: VendorSubscription,
                        as: 'VendorSubscription',
                        include: [
                            {
                                model: SubscriptionPlan,
                                as: 'SubscriptionPlan'
                            }
                        ]
                    },
                    {
                        model: Vendor,
                        as: 'Vendor'
                    }
                ]
            });

            if (!payment) {
                throw new Error('الدفعة غير موجودة');
            }

            return payment;
        } catch (error) {
            throw new Error(`خطأ في جلب تفاصيل الدفعة: ${error.message}`);
        }
    }

    /**
     * الحصول على دفعات البائع - Get vendor payments
     * @param {number} vendorId - معرف البائع
     * @param {number} siteId - معرف الموقع
     * @param {Object} options - خيارات البحث
     * @returns {Promise<Array>} - قائمة الدفعات
     */
    static async getVendorPayments(vendorId, siteId, options = {}) {
        try {
            const whereClause = { 
                vendor_id: vendorId,
                site_id: siteId
            };

            // فلترة حسب حالة الدفعة
            if (options.status) {
                whereClause.payment_status = options.status;
            }

            // فلترة حسب طريقة الدفع
            if (options.paymentMethod) {
                whereClause.payment_method = options.paymentMethod;
            }

            const payments = await VendorPayment.findAll({
                where: whereClause,
                include: [
                    {
                        model: VendorSubscription,
                        as: 'VendorSubscription',
                        include: [
                            {
                                model: SubscriptionPlan,
                                as: 'SubscriptionPlan'
                            }
                        ]
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return payments;
        } catch (error) {
            throw new Error(`خطأ في جلب دفعات البائع: ${error.message}`);
        }
    }

    /**
     * الحصول على دفعات الاشتراك - Get subscription payments
     * @param {number} subscriptionId - معرف الاشتراك
     * @returns {Promise<Array>} - قائمة دفعات الاشتراك
     */
    static async getSubscriptionPayments(subscriptionId) {
        try {
            const payments = await PGselectAll(VendorPayment, {
                where: { subscription_id: subscriptionId }
            });

            return payments;
        } catch (error) {
            throw new Error(`خطأ في جلب دفعات الاشتراك: ${error.message}`);
        }
    }

    /**
     * تحديث حالة الدفعة - Update payment status
     * @param {number} paymentId - معرف الدفعة
     * @param {string} status - الحالة الجديدة
     * @param {Object} additionalData - بيانات إضافية
     * @returns {Promise<Object>} - الدفعة المحدثة
     */
    static async updatePaymentStatus(paymentId, status, additionalData = {}) {
        try {
            const updateData = { payment_status: status };

            // إضافة تاريخ الدفع إذا تم إتمام الدفعة
            if (status === 'completed' && !additionalData.paid_at) {
                updateData.paid_at = new Date();
            }

            // إضافة استجابة بوابة الدفع إذا توفرت
            if (additionalData.gateway_response) {
                updateData.gateway_response = additionalData.gateway_response;
            }

            const updatedPayment = await PGupdate(VendorPayment, updateData, { id: paymentId });
            return await this.getPaymentWithDetails(paymentId);
        } catch (error) {
            throw new Error(`خطأ في تحديث حالة الدفعة: ${error.message}`);
        }
    }

    /**
     * معالجة الدفعة الناجحة - Process successful payment
     * @param {number} paymentId - معرف الدفعة
     * @param {Object} gatewayResponse - استجابة بوابة الدفع
     * @returns {Promise<Object>} - الدفعة المحدثة
     */
    static async processSuccessfulPayment(paymentId, gatewayResponse = {}) {
        try {
            return await this.updatePaymentStatus(paymentId, 'completed', {
                gateway_response: gatewayResponse,
                paid_at: new Date()
            });
        } catch (error) {
            throw new Error(`خطأ في معالجة الدفعة الناجحة: ${error.message}`);
        }
    }

    /**
     * معالجة الدفعة الفاشلة - Process failed payment
     * @param {number} paymentId - معرف الدفعة
     * @param {Object} gatewayResponse - استجابة بوابة الدفع
     * @returns {Promise<Object>} - الدفعة المحدثة
     */
    static async processFailedPayment(paymentId, gatewayResponse = {}) {
        try {
            return await this.updatePaymentStatus(paymentId, 'failed', {
                gateway_response: gatewayResponse
            });
        } catch (error) {
            throw new Error(`خطأ في معالجة الدفعة الفاشلة: ${error.message}`);
        }
    }

    /**
     * استرداد الدفعة - Refund payment
     * @param {number} paymentId - معرف الدفعة
     * @param {Object} refundData - بيانات الاسترداد
     * @returns {Promise<Object>} - الدفعة المحدثة
     */
    static async refundPayment(paymentId, refundData = {}) {
        try {
            const payment = await this.getPaymentWithDetails(paymentId);
            
            if (!payment.isSuccessful || !payment.isSuccessful()) {
                throw new Error('لا يمكن استرداد دفعة غير مكتملة');
            }

            return await this.updatePaymentStatus(paymentId, 'refunded', {
                gateway_response: refundData.gateway_response || {}
            });
        } catch (error) {
            throw new Error(`خطأ في استرداد الدفعة: ${error.message}`);
        }
    }

    /**
     * الحصول على الدفعات حسب الحالة - Get payments by status
     * @param {string} status - حالة الدفعة
     * @param {number} siteId - معرف الموقع
     * @returns {Promise<Array>} - قائمة الدفعات
     */
    static async getPaymentsByStatus(status, siteId) {
        try {
            const payments = await VendorPayment.findAll({
                where: { 
                    payment_status: status,
                    site_id: siteId
                },
                include: [
                    {
                        model: VendorSubscription,
                        as: 'VendorSubscription',
                        include: [
                            {
                                model: SubscriptionPlan,
                                as: 'SubscriptionPlan'
                            }
                        ]
                    },
                    {
                        model: Vendor,
                        as: 'Vendor'
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return payments;
        } catch (error) {
            throw new Error(`خطأ في جلب الدفعات حسب الحالة: ${error.message}`);
        }
    }

    /**
     * الحصول على إحصائيات الدفعات - Get payment statistics
     * @param {number} siteId - معرف الموقع
     * @param {Object} dateRange - نطاق التاريخ
     * @returns {Promise<Object>} - إحصائيات الدفعات
     */
    static async getPaymentStats(siteId, dateRange = {}) {
        try {
            const { Op } = await import('sequelize');
            const whereClause = { site_id: siteId };

            // إضافة فلتر التاريخ إذا توفر
            if (dateRange.startDate && dateRange.endDate) {
                whereClause.created_at = {
                    [Op.between]: [dateRange.startDate, dateRange.endDate]
                };
            }

            const payments = await VendorPayment.findAll({
                where: whereClause
            });

            const stats = {
                total_payments: payments.length,
                completed: 0,
                pending: 0,
                failed: 0,
                refunded: 0,
                total_amount: 0,
                completed_amount: 0
            };

            payments.forEach(payment => {
                stats[payment.payment_status]++;
                stats.total_amount += parseFloat(payment.amount);
                
                if (payment.payment_status === 'completed') {
                    stats.completed_amount += parseFloat(payment.amount);
                }
            });

            return stats;
        } catch (error) {
            throw new Error(`خطأ في جلب إحصائيات الدفعات: ${error.message}`);
        }
    }

    /**
     * البحث في الدفعات - Search payments
     * @param {string} searchTerm - مصطلح البحث
     * @param {number} siteId - معرف الموقع
     * @returns {Promise<Array>} - نتائج البحث
     */
    static async searchPayments(searchTerm, siteId) {
        try {
            const { Op } = await import('sequelize');
            
            const payments = await VendorPayment.findAll({
                where: {
                    site_id: siteId,
                    [Op.or]: [
                        { transaction_id: { [Op.iLike]: `%${searchTerm}%` } },
                        { '$Vendor.name$': { [Op.iLike]: `%${searchTerm}%` } }
                    ]
                },
                include: [
                    {
                        model: Vendor,
                        as: 'Vendor'
                    },
                    {
                        model: VendorSubscription,
                        as: 'VendorSubscription'
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return payments;
        } catch (error) {
            throw new Error(`خطأ في البحث عن الدفعات: ${error.message}`);
        }
    }

    /**
     * حذف الدفعة - Delete payment
     * @param {number} paymentId - معرف الدفعة
     * @returns {Promise<boolean>} - نتيجة الحذف
     */
    static async deletePayment(paymentId) {
        try {
            // التحقق من وجود الدفعة
            await this.getPaymentWithDetails(paymentId);

            const result = await PGdelete(VendorPayment, { id: paymentId });
            return result;
        } catch (error) {
            throw new Error(`خطأ في حذف الدفعة: ${error.message}`);
        }
    }

    /**
     * توليد معرف معاملة فريد - Generate unique transaction ID
     * @returns {string} - معرف المعاملة
     */
    static generateTransactionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `TXN_${timestamp}_${random}`.toUpperCase();
    }
}

export default VendorPaymentService;