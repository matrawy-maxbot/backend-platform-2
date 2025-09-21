import { SubscriptionPlan } from '../models/index.js';
import { findAll, findById, create, update, deleteById } from '../config/postgre.manager.js';

/**
 * خدمة إدارة خطط الاشتراك - SubscriptionPlan Service
 * تحتوي على العمليات الأساسية لإدارة خطط الاشتراك
 */
class SubscriptionPlanService {
    
    /**
     * إنشاء خطة اشتراك جديدة - Create new subscription plan
     * @param {Object} planData - بيانات خطة الاشتراك
     * @returns {Promise<Object>} - خطة الاشتراك المنشأة
     */
    static async createPlan(planData) {
        try {
            // التحقق من عدم وجود خطة بنفس الاسم
            const existingPlan = await findAll(SubscriptionPlan, {
                where: { name: planData.name }
            });

            if (existingPlan && existingPlan.length > 0) {
                throw new Error('خطة اشتراك بهذا الاسم موجودة بالفعل');
            }

            const newPlan = await create(SubscriptionPlan, planData);
            return newPlan;
        } catch (error) {
            throw new Error(`خطأ في إنشاء خطة الاشتراك: ${error.message}`);
        }
    }

    /**
     * الحصول على جميع خطط الاشتراك - Get all subscription plans
     * @param {Object} options - خيارات البحث
     * @returns {Promise<Array>} - قائمة خطط الاشتراك
     */
    static async getAllPlans(options = {}) {
        try {
            const whereClause = {};
            
            // فلترة حسب حالة التفعيل
            if (options.isActive !== undefined) {
                whereClause.is_active = options.isActive;
            }

            const plans = await findAll(SubscriptionPlan, {
                where: whereClause,
                order: [['price', 'ASC']]
            });

            return plans;
        } catch (error) {
            throw new Error(`خطأ في جلب خطط الاشتراك: ${error.message}`);
        }
    }

    /**
     * الحصول على خطة اشتراك بالمعرف - Get subscription plan by ID
     * @param {number} planId - معرف خطة الاشتراك
     * @returns {Promise<Object>} - خطة الاشتراك
     */
    static async getPlanById(planId) {
        try {
            const plan = await findById(SubscriptionPlan, planId);
            
            if (!plan) {
                throw new Error('خطة الاشتراك غير موجودة');
            }

            return plan;
        } catch (error) {
            throw new Error(`خطأ في جلب خطة الاشتراك: ${error.message}`);
        }
    }

    /**
     * الحصول على الخطط النشطة - Get active subscription plans
     * @returns {Promise<Array>} - قائمة الخطط النشطة
     */
    static async getActivePlans() {
        try {
            return await this.getAllPlans({ isActive: true });
        } catch (error) {
            throw new Error(`خطأ في جلب الخطط النشطة: ${error.message}`);
        }
    }

    /**
     * تحديث خطة اشتراك - Update subscription plan
     * @param {number} planId - معرف خطة الاشتراك
     * @param {Object} updateData - البيانات المحدثة
     * @returns {Promise<Object>} - خطة الاشتراك المحدثة
     */
    static async updatePlan(planId, updateData) {
        try {
            // التحقق من وجود الخطة
            const existingPlan = await this.getPlanById(planId);

            // التحقق من عدم تكرار الاسم إذا تم تحديثه
            if (updateData.name && updateData.name !== existingPlan.name) {
                const duplicatePlan = await findAll(SubscriptionPlan, {
                    where: { name: updateData.name }
                });

                if (duplicatePlan && duplicatePlan.length > 0) {
                    throw new Error('خطة اشتراك بهذا الاسم موجودة بالفعل');
                }
            }

            const updatedPlan = await update(SubscriptionPlan, planId, updateData);
            return updatedPlan;
        } catch (error) {
            throw new Error(`خطأ في تحديث خطة الاشتراك: ${error.message}`);
        }
    }

    /**
     * تفعيل أو إلغاء تفعيل خطة اشتراك - Activate or deactivate subscription plan
     * @param {number} planId - معرف خطة الاشتراك
     * @param {boolean} isActive - حالة التفعيل
     * @returns {Promise<Object>} - خطة الاشتراك المحدثة
     */
    static async togglePlanStatus(planId, isActive) {
        try {
            return await this.updatePlan(planId, { is_active: isActive });
        } catch (error) {
            throw new Error(`خطأ في تغيير حالة خطة الاشتراك: ${error.message}`);
        }
    }

    /**
     * حذف خطة اشتراك - Delete subscription plan
     * @param {number} planId - معرف خطة الاشتراك
     * @returns {Promise<boolean>} - نتيجة الحذف
     */
    static async deletePlan(planId) {
        try {
            // التحقق من وجود الخطة
            await this.getPlanById(planId);

            const result = await deleteById(SubscriptionPlan, planId);
            return result;
        } catch (error) {
            throw new Error(`خطأ في حذف خطة الاشتراك: ${error.message}`);
        }
    }

    /**
     * البحث في خطط الاشتراك - Search subscription plans
     * @param {string} searchTerm - مصطلح البحث
     * @returns {Promise<Array>} - نتائج البحث
     */
    static async searchPlans(searchTerm) {
        try {
            const { Op } = await import('sequelize');
            
            const plans = await findAll(SubscriptionPlan, {
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${searchTerm}%` } },
                        { description: { [Op.iLike]: `%${searchTerm}%` } }
                    ]
                },
                order: [['name', 'ASC']]
            });

            return plans;
        } catch (error) {
            throw new Error(`خطأ في البحث عن خطط الاشتراك: ${error.message}`);
        }
    }

    /**
     * الحصول على خطط الاشتراك حسب نطاق السعر - Get plans by price range
     * @param {number} minPrice - أقل سعر
     * @param {number} maxPrice - أعلى سعر
     * @returns {Promise<Array>} - خطط الاشتراك في النطاق المحدد
     */
    static async getPlansByPriceRange(minPrice, maxPrice) {
        try {
            const { Op } = await import('sequelize');
            
            const plans = await findAll(SubscriptionPlan, {
                where: {
                    price: {
                        [Op.between]: [minPrice, maxPrice]
                    },
                    is_active: true
                },
                order: [['price', 'ASC']]
            });

            return plans;
        } catch (error) {
            throw new Error(`خطأ في جلب خطط الاشتراك حسب السعر: ${error.message}`);
        }
    }
}

export default SubscriptionPlanService;