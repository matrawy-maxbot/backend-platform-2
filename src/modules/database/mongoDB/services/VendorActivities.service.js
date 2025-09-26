import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { VendorActivities } from '../models/index.js';

/**
 * خدمة إدارة أنشطة البائعين - VendorActivities Service
 * تحتوي على الوظائف الأساسية لإدارة وتتبع أنشطة البائعين
 */
class VendorActivitiesService {

  /**
   * إنشاء نشاط جديد للبائع
   * @param {Object} activityData - بيانات النشاط
   * @returns {Promise<Object>} النشاط المُنشأ
   */
  static async createActivity(activityData) {
    try {
      if (!activityData.vendor_id || !activityData.activity_type) {
        throw new Error('معرف البائع ونوع النشاط مطلوبان');
      }

      const newActivity = await mDBinsert(VendorActivities, activityData);
      return newActivity;
    } catch (error) {
      throw new Error(`خطأ في إنشاء النشاط: ${error.message}`);
    }
  }

  /**
   * تسجيل نشاط جديد للبائع (دالة مساعدة)
   * @param {string} vendorId - معرف البائع
   * @param {Object} activityData - بيانات النشاط
   * @returns {Promise<Object>} النشاط المُنشأ
   */
  static async logVendorActivity(vendorId, activityData) {
    try {
      const newActivity = {
        vendor_id: vendorId,
        ...activityData
      };

      return await this.createActivity(newActivity);
    } catch (error) {
      throw new Error(`خطأ في تسجيل نشاط البائع: ${error.message}`);
    }
  }

  /**
   * الحصول على نشاط محدد
   * @param {string} activityId - معرف النشاط
   * @returns {Promise<Object|null>} النشاط أو null
   */
  static async getActivity(activityId) {
    try {
      const activities = await mDBselectAll({
        model: VendorActivities,
        filter: { _id: activityId }
      });
      return activities && activities.length > 0 ? activities[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب النشاط: ${error.message}`);
    }
  }

  /**
   * الحصول على أنشطة البائع
   * @param {string} vendorId - معرف البائع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة الأنشطة
   */
  static async getVendorActivities(vendorId, options = {}) {
    try {
      const {
        limit = 50,
        skip = 0,
        activity_type = null,
        startDate = null,
        endDate = null
      } = options;

      let filter = { vendor_id: vendorId };

      // إضافة فلتر نوع النشاط
      if (activity_type) {
        filter.activity_type = activity_type;
      }

      // إضافة فلتر التاريخ
      if (startDate || endDate) {
        filter.created_at = {};
        if (startDate) filter.created_at.$gte = new Date(startDate);
        if (endDate) filter.created_at.$lte = new Date(endDate);
      }

      const activities = await mDBselectAll({
        model: VendorActivities,
        filter,
        sort: { created_at: -1 },
        limit,
        skip
      });

      return activities || [];
    } catch (error) {
      throw new Error(`خطأ في جلب أنشطة البائع: ${error.message}`);
    }
  }

  /**
   * الحصول على أنشطة البائع حسب النوع
   * @param {string} vendorId - معرف البائع
   * @param {string} activityType - نوع النشاط
   * @param {number} limit - حد النتائج
   * @returns {Promise<Array>} قائمة الأنشطة
   */
  static async getVendorActivitiesByType(vendorId, activityType, limit = 50) {
    try {
      return await this.getVendorActivities(vendorId, {
        activity_type: activityType,
        limit
      });
    } catch (error) {
      throw new Error(`خطأ في جلب أنشطة البائع حسب النوع: ${error.message}`);
    }
  }

  /**
   * الحصول على أنشطة البائع في فترة زمنية محددة
   * @param {string} vendorId - معرف البائع
   * @param {Date|string} startDate - تاريخ البداية
   * @param {Date|string} endDate - تاريخ النهاية
   * @returns {Promise<Array>} قائمة الأنشطة
   */
  static async getVendorActivitiesByDateRange(vendorId, startDate, endDate) {
    try {
      return await this.getVendorActivities(vendorId, {
        startDate,
        endDate
      });
    } catch (error) {
      throw new Error(`خطأ في جلب أنشطة البائع حسب الفترة الزمنية: ${error.message}`);
    }
  }

  /**
   * تحديث نشاط موجود
   * @param {string} activityId - معرف النشاط
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} النشاط المحدث
   */
  static async updateActivity(activityId, updateData) {
    try {
      const updatedActivity = await mDBupdate({
        model: VendorActivities,
        filter: { _id: activityId },
        update: updateData
      });

      if (!updatedActivity) {
        throw new Error('النشاط غير موجود');
      }

      return updatedActivity;
    } catch (error) {
      throw new Error(`خطأ في تحديث النشاط: ${error.message}`);
    }
  }

  /**
   * حذف نشاط
   * @param {string} activityId - معرف النشاط
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteActivity(activityId) {
    try {
      const result = await mDBdelete({
        model: VendorActivities,
        filter: { _id: activityId }
      });

      return result && result.deletedCount > 0;
    } catch (error) {
      throw new Error(`خطأ في حذف النشاط: ${error.message}`);
    }
  }

  /**
   * حذف أنشطة البائع القديمة
   * @param {string} vendorId - معرف البائع
   * @param {number} daysOld - عدد الأيام (افتراضي 90)
   * @returns {Promise<number>} عدد الأنشطة المحذوفة
   */
  static async deleteOldVendorActivities(vendorId, daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await mDBdelete({
        model: VendorActivities,
        filter: {
          vendor_id: vendorId,
          created_at: { $lt: cutoffDate }
        }
      });

      return result ? result.deletedCount : 0;
    } catch (error) {
      throw new Error(`خطأ في حذف الأنشطة القديمة: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات أنشطة البائع
   * @param {string} vendorId - معرف البائع
   * @param {Object} options - خيارات الإحصائيات
   * @returns {Promise<Object>} إحصائيات الأنشطة
   */
  static async getVendorActivityStats(vendorId, options = {}) {
    try {
      const {
        startDate = null,
        endDate = null,
        groupBy = 'activity_type',
        days = 30
      } = options;

      let matchFilter = { vendor_id: vendorId };

      // إضافة فلتر التاريخ
      if (startDate || endDate) {
        matchFilter.created_at = {};
        if (startDate) matchFilter.created_at.$gte = new Date(startDate);
        if (endDate) matchFilter.created_at.$lte = new Date(endDate);
      } else if (days) {
        const startDateCalc = new Date();
        startDateCalc.setDate(startDateCalc.getDate() - days);
        matchFilter.created_at = { $gte: startDateCalc };
      }

      const pipeline = [
        { $match: matchFilter },
        {
          $group: {
            _id: `$${groupBy}`,
            count: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            avgDuration: { $avg: '$duration' },
            lastActivity: { $max: '$created_at' }
          }
        },
        { $sort: { count: -1 } }
      ];

      const stats = await VendorActivities.aggregate(pipeline);
      return stats || [];
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات الأنشطة: ${error.message}`);
    }
  }

  /**
   * إنشاء أنشطة متعددة (عملية مجمعة)
   * @param {Array} activitiesData - مصفوفة بيانات الأنشطة
   * @returns {Promise<Array>} الأنشطة المُنشأة
   */
  static async createBatchActivities(activitiesData) {
    try {
      if (!Array.isArray(activitiesData) || activitiesData.length === 0) {
        throw new Error('يجب توفير مصفوفة من الأنشطة');
      }

      // التحقق من البيانات المطلوبة
      for (const activity of activitiesData) {
        if (!activity.vendor_id || !activity.activity_type) {
          throw new Error('معرف البائع ونوع النشاط مطلوبان لكل نشاط');
        }
      }

      const result = await VendorActivities.insertBatch(activitiesData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الأنشطة المجمعة: ${error.message}`);
    }
  }

  /**
   * البحث في الأنشطة
   * @param {Object} searchCriteria - معايير البحث
   * @returns {Promise<Array>} نتائج البحث
   */
  static async searchActivities(searchCriteria = {}) {
    try {
      const {
        vendor_id = null,
        activity_type = null,
        ip_address = null,
        description = null,
        limit = 100,
        skip = 0
      } = searchCriteria;

      let filter = {};

      if (vendor_id) filter.vendor_id = vendor_id;
      if (activity_type) filter.activity_type = activity_type;
      if (ip_address) filter.ip_address = ip_address;
      if (description) {
        filter.description = { $regex: description, $options: 'i' };
      }

      const activities = await mDBselectAll({
        model: VendorActivities,
        filter,
        sort: { created_at: -1 },
        limit,
        skip
      });

      return activities || [];
    } catch (error) {
      throw new Error(`خطأ في البحث عن الأنشطة: ${error.message}`);
    }
  }

  /**
   * تسجيل نشاط تسجيل الدخول
   * @param {string} vendorId - معرف البائع
   * @param {string} ipAddress - عنوان IP
   * @param {string} userAgent - معلومات المتصفح
   * @returns {Promise<Object>} النشاط المُنشأ
   */
  static async logVendorLogin(vendorId, ipAddress, userAgent) {
    try {
      const activityData = {
        activity_type: 'login',
        description: 'تسجيل دخول البائع',
        ip_address: ipAddress,
        user_agent: userAgent
      };

      return await this.logVendorActivity(vendorId, activityData);
    } catch (error) {
      throw new Error(`خطأ في تسجيل دخول البائع: ${error.message}`);
    }
  }

  /**
   * تسجيل نشاط تسجيل الخروج
   * @param {string} vendorId - معرف البائع
   * @param {string} ipAddress - عنوان IP
   * @returns {Promise<Object>} النشاط المُنشأ
   */
  static async logVendorLogout(vendorId, ipAddress) {
    try {
      const activityData = {
        activity_type: 'logout',
        description: 'تسجيل خروج البائع',
        ip_address: ipAddress
      };

      return await this.logVendorActivity(vendorId, activityData);
    } catch (error) {
      throw new Error(`خطأ في تسجيل خروج البائع: ${error.message}`);
    }
  }

  /**
   * تحديث مدة النشاط
   * @param {string} activityId - معرف النشاط
   * @param {number} additionalDuration - المدة الإضافية
   * @returns {Promise<Object>} نتيجة التحديث
   */
  static async updateActivityDuration(activityId, additionalDuration) {
    try {
      if (typeof additionalDuration !== 'number' || additionalDuration < 0) {
        throw new Error('المدة الإضافية يجب أن تكون رقم موجب');
      }

      const result = await VendorActivities.updateDuration(activityId, additionalDuration);
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث مدة النشاط: ${error.message}`);
    }
  }

  /**
   * الحصول على ملخص أنشطة البائع اليومية
   * @param {string} vendorId - معرف البائع
   * @param {number} days - عدد الأيام (افتراضي 7)
   * @returns {Promise<Object>} ملخص الأنشطة اليومية
   */
  static async getDailyActivitySummary(vendorId, days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const activities = await this.getVendorActivitiesByDateRange(vendorId, startDate, new Date());

      const summary = {
        total_activities: activities.length,
        activity_types: {},
        daily_activities: {}
      };

      activities.forEach(activity => {
        // إحصائيات حسب النوع
        if (!summary.activity_types[activity.activity_type]) {
          summary.activity_types[activity.activity_type] = 0;
        }
        summary.activity_types[activity.activity_type]++;

        // إحصائيات يومية
        const date = activity.created_at.toISOString().split('T')[0];
        if (!summary.daily_activities[date]) {
          summary.daily_activities[date] = 0;
        }
        summary.daily_activities[date]++;
      });

      return summary;
    } catch (error) {
      throw new Error(`خطأ في جلب ملخص الأنشطة اليومية: ${error.message}`);
    }
  }
}

export default VendorActivitiesService;