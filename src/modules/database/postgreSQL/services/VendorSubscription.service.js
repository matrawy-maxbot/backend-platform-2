import { VendorSubscription, SubscriptionPlan, Vendor } from '../models/index.js';
import { PGselectAll, PGinsert, PGupdate, PGdelete } from '../config/postgre.manager.js';

/**
 * خدمة إدارة اشتراكات البائعين - VendorSubscription Service
 * تحتوي على العمليات الأساسية لإدارة اشتراكات البائعين
 */
class VendorSubscriptionService {
    
    /**
     * إنشاء اشتراك جديد للبائع - Create new vendor subscription
     * @param {Object} subscriptionData - بيانات الاشتراك
     * @returns {Promise<Object>} - الاشتراك المنشأ
     */
    static async createSubscription(subscriptionData) {
        try {
            // التحقق من وجود اشتراك نشط للبائع
            const activeSubscription = await this.getActiveSubscriptionByVendor(
                subscriptionData.vendor_id, 
                subscriptionData.site_id
            );

            if (activeSubscription) {
                throw new Error('البائع لديه اشتراك نشط بالفعل');
            }

            const newSubscription = await PGinsert(VendorSubscription, subscriptionData);
            return await this.getSubscriptionWithDetails(newSubscription.id);
        } catch (error) {
            throw new Error(`خطأ في إنشاء الاشتراك: ${error.message}`);
        }
    }

    /**
     * الحصول على اشتراك مع التفاصيل - Get subscription with details
     * @param {number} subscriptionId - معرف الاشتراك
     * @returns {Promise<Object>} - الاشتراك مع التفاصيل
     */
    static async getSubscriptionWithDetails(subscriptionId) {
        try {
            const subscription = await VendorSubscription.findOne({
                where: { id: subscriptionId },
                include: [
                    {
                        model: SubscriptionPlan,
                        as: 'SubscriptionPlan'
                    },
                    {
                        model: Vendor,
                        as: 'Vendor'
                    }
                ]
            });

            if (!subscription) {
                throw new Error('الاشتراك غير موجود');
            }

            return subscription;
        } catch (error) {
            throw new Error(`خطأ في جلب تفاصيل الاشتراك: ${error.message}`);
        }
    }

    /**
     * الحصول على الاشتراك النشط للبائع - Get active subscription for vendor
     * @param {number} vendorId - معرف البائع
     * @param {number} siteId - معرف الموقع
     * @returns {Promise<Object|null>} - الاشتراك النشط أو null
     */
    static async getActiveSubscriptionByVendor(vendorId, siteId) {
        try {
            const subscriptions = await VendorSubscription.findAll({
                where: { 
                    vendor_id: vendorId,
                    site_id: siteId
                },
                include: [
                    {
                        model: SubscriptionPlan,
                        as: 'SubscriptionPlan'
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            // البحث عن الاشتراك النشط
            for (const subscription of subscriptions) {
                if (subscription.isActive && subscription.isActive()) {
                    return subscription;
                }
            }

            return null;
        } catch (error) {
            throw new Error(`خطأ في جلب الاشتراك النشط: ${error.message}`);
        }
    }

    /**
     * الحصول على جميع اشتراكات البائع - Get all vendor subscriptions
     * @param {number} vendorId - معرف البائع
     * @param {number} siteId - معرف الموقع
     * @returns {Promise<Array>} - قائمة الاشتراكات
     */
    static async getVendorSubscriptions(vendorId, siteId) {
        try {
            const subscriptions = await VendorSubscription.findAll({
                where: { 
                    vendor_id: vendorId,
                    site_id: siteId
                },
                include: [
                    {
                        model: SubscriptionPlan,
                        as: 'SubscriptionPlan'
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return subscriptions;
        } catch (error) {
            throw new Error(`خطأ في جلب اشتراكات البائع: ${error.message}`);
        }
    }

    /**
     * الحصول على الاشتراكات المنتهية الصلاحية قريباً - Get expiring subscriptions
     * @param {number} daysThreshold - عدد الأيام للتحذير
     * @param {number} siteId - معرف الموقع
     * @returns {Promise<Array>} - قائمة الاشتراكات المنتهية قريباً
     */
    static async getExpiringSubscriptions(daysThreshold = 7, siteId) {
        try {
            const subscriptions = await VendorSubscription.findAll({
                where: { site_id: siteId },
                include: [
                    {
                        model: SubscriptionPlan,
                        as: 'SubscriptionPlan'
                    },
                    {
                        model: Vendor,
                        as: 'Vendor'
                    }
                ]
            });

            // فلترة الاشتراكات المنتهية قريباً
            const expiringSubscriptions = subscriptions.filter(subscription => {
                return subscription.isExpiringSoon && subscription.isExpiringSoon(daysThreshold);
            });

            return expiringSubscriptions;
        } catch (error) {
            throw new Error(`خطأ في جلب الاشتراكات المنتهية قريباً: ${error.message}`);
        }
    }

    /**
     * تحديث إعدادات التجديد التلقائي - Update auto renewal settings
     * @param {number} subscriptionId - معرف الاشتراك
     * @param {boolean} autoRenew - حالة التجديد التلقائي
     * @returns {Promise<Object>} - الاشتراك المحدث
     */
    static async updateAutoRenewal(subscriptionId, autoRenew) {
        try {
            const updatedSubscription = await PGupdate(VendorSubscription, {
                auto_renew: autoRenew
            }, { id: subscriptionId });

            return await this.getSubscriptionWithDetails(subscriptionId);
        } catch (error) {
            throw new Error(`خطأ في تحديث التجديد التلقائي: ${error.message}`);
        }
    }

    /**
     * تجديد الاشتراك - Renew subscription
     * @param {number} subscriptionId - معرف الاشتراك
     * @param {Object} renewalData - بيانات التجديد
     * @returns {Promise<Object>} - الاشتراك الجديد
     */
    static async renewSubscription(subscriptionId, renewalData = {}) {
        try {
            const currentSubscription = await this.getSubscriptionWithDetails(subscriptionId);
            
            if (!currentSubscription) {
                throw new Error('الاشتراك غير موجود');
            }

            // إنشاء اشتراك جديد بناءً على الحالي
            const newSubscriptionData = {
                site_id: currentSubscription.site_id,
                vendor_id: currentSubscription.vendor_id,
                plan_id: renewalData.plan_id || currentSubscription.plan_id,
                start_date: new Date(),
                auto_renew: renewalData.auto_renew !== undefined ? renewalData.auto_renew : currentSubscription.auto_renew,
                payment_gateway: renewalData.payment_gateway || currentSubscription.payment_gateway,
                gateway_subscription_id: renewalData.gateway_subscription_id || null
            };

            const newSubscription = await PGinsert(VendorSubscription, newSubscriptionData);
            return await this.getSubscriptionWithDetails(newSubscription.id);
        } catch (error) {
            throw new Error(`خطأ في تجديد الاشتراك: ${error.message}`);
        }
    }

    /**
     * إلغاء الاشتراك - Cancel subscription
     * @param {number} subscriptionId - معرف الاشتراك
     * @returns {Promise<Object>} - الاشتراك المحدث
     */
    static async cancelSubscription(subscriptionId) {
        try {
            // تعطيل التجديد التلقائي
            const updatedSubscription = await PGupdate(VendorSubscription, {
                auto_renew: false
            }, { id: subscriptionId });

            return await this.getSubscriptionWithDetails(subscriptionId);
        } catch (error) {
            throw new Error(`خطأ في إلغاء الاشتراك: ${error.message}`);
        }
    }

    /**
     * الحصول على إحصائيات الاشتراكات - Get subscription statistics
     * @param {number} siteId - معرف الموقع
     * @returns {Promise<Object>} - إحصائيات الاشتراكات
     */
    static async getSubscriptionStats(siteId) {
        try {
            const allSubscriptions = await VendorSubscription.findAll({
                where: { site_id: siteId },
                include: [
                    {
                        model: SubscriptionPlan,
                        as: 'SubscriptionPlan'
                    }
                ]
            });

            let activeCount = 0;
            let expiredCount = 0;
            let expiringCount = 0;

            allSubscriptions.forEach(subscription => {
                if (subscription.isActive && subscription.isActive()) {
                    activeCount++;
                    if (subscription.isExpiringSoon && subscription.isExpiringSoon(7)) {
                        expiringCount++;
                    }
                } else {
                    expiredCount++;
                }
            });

            return {
                total: allSubscriptions.length,
                active: activeCount,
                expired: expiredCount,
                expiring_soon: expiringCount
            };
        } catch (error) {
            throw new Error(`خطأ في جلب إحصائيات الاشتراكات: ${error.message}`);
        }
    }

    /**
     * حذف الاشتراك - Delete subscription
     * @param {number} subscriptionId - معرف الاشتراك
     * @returns {Promise<boolean>} - نتيجة الحذف
     */
    static async deleteSubscription(subscriptionId) {
        try {
            // التحقق من وجود الاشتراك
            await this.getSubscriptionWithDetails(subscriptionId);

            const result = await PGdelete(VendorSubscription, { id: subscriptionId });
            return result;
        } catch (error) {
            throw new Error(`خطأ في حذف الاشتراك: ${error.message}`);
        }
    }
}

export default VendorSubscriptionService;