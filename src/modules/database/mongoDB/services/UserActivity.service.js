import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { UserActivity } from '../models/index.js';

/**
 * خدمة إدارة أنشطة المستخدم - UserActivity Service
 * تحتوي على الوظائف الأساسية لإدارة وتتبع أنشطة المستخدمين
 */
class UserActivityService {

  /**
   * إنشاء نشاط جديد للمستخدم
   * @param {Object} activityData - بيانات النشاط
   * @returns {Promise<Object>} النشاط المُنشأ
   */
  static async createActivity(activityData) {
    try {
      if (!activityData.user_id || !activityData.activity_type) {
        throw new Error('معرف المستخدم ونوع النشاط مطلوبان');
      }

      const newActivity = await mDBinsert(UserActivity, activityData);
      return newActivity;
    } catch (error) {
      throw new Error(`خطأ في إنشاء النشاط: ${error.message}`);
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
        model: UserActivity,
        filter: { _id: activityId }
      });
      return activities && activities.length > 0 ? activities[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب النشاط: ${error.message}`);
    }
  }

  /**
   * الحصول على أنشطة المستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة الأنشطة
   */
  static async getUserActivities(userId, options = {}) {
    try {
      const {
        limit = 50,
        skip = 0,
        activity_type = null,
        startDate = null,
        endDate = null
      } = options;

      let filter = { user_id: userId };

      // إضافة فلتر نوع النشاط
      if (activity_type) {
        filter.activity_type = activity_type;
      }

      // إضافة فلتر التاريخ
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
      }

      const activities = await mDBselectAll({
        model: UserActivity,
        filter,
        sort: { timestamp: -1 },
        limit,
        skip
      });

      return activities || [];
    } catch (error) {
      throw new Error(`خطأ في جلب أنشطة المستخدم: ${error.message}`);
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
        model: UserActivity,
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
        model: UserActivity,
        filter: { _id: activityId }
      });

      return result && result.deletedCount > 0;
    } catch (error) {
      throw new Error(`خطأ في حذف النشاط: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات أنشطة المستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} options - خيارات الإحصائيات
   * @returns {Promise<Object>} إحصائيات الأنشطة
   */
  static async getUserActivityStats(userId, options = {}) {
    try {
      const {
        startDate = null,
        endDate = null,
        groupBy = 'activity_type'
      } = options;

      let matchFilter = { user_id: userId };

      // إضافة فلتر التاريخ
      if (startDate || endDate) {
        matchFilter.timestamp = {};
        if (startDate) matchFilter.timestamp.$gte = new Date(startDate);
        if (endDate) matchFilter.timestamp.$lte = new Date(endDate);
      }

      const pipeline = [
        { $match: matchFilter },
        {
          $group: {
            _id: `$${groupBy}`,
            count: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            avgDuration: { $avg: '$duration' },
            lastActivity: { $max: '$timestamp' }
          }
        },
        { $sort: { count: -1 } }
      ];

      const stats = await UserActivity.aggregate(pipeline);
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
        if (!activity.user_id || !activity.activity_type) {
          throw new Error('معرف المستخدم ونوع النشاط مطلوبان لكل نشاط');
        }
      }

      const result = await UserActivity.insertBatch(activitiesData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الأنشطة المجمعة: ${error.message}`);
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

      const result = await UserActivity.updateDuration(activityId, additionalDuration);
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث مدة النشاط: ${error.message}`);
    }
  }

  /**
   * حذف أنشطة المستخدم القديمة
   * @param {number} userId - معرف المستخدم
   * @param {Date} beforeDate - حذف الأنشطة قبل هذا التاريخ
   * @returns {Promise<number>} عدد الأنشطة المحذوفة
   */
  static async deleteOldActivities(userId, beforeDate) {
    try {
      const result = await mDBdelete({
        model: UserActivity,
        filter: {
          user_id: userId,
          timestamp: { $lt: beforeDate }
        }
      });

      return result ? result.deletedCount : 0;
    } catch (error) {
      throw new Error(`خطأ في حذف الأنشطة القديمة: ${error.message}`);
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
        user_id = null,
        activity_type = null,
        ip_address = null,
        description = null,
        limit = 100,
        skip = 0
      } = searchCriteria;

      let filter = {};

      if (user_id) filter.user_id = user_id;
      if (activity_type) filter.activity_type = activity_type;
      if (ip_address) filter.ip_address = ip_address;
      if (description) {
        filter.activity_description = { $regex: description, $options: 'i' };
      }

      const activities = await mDBselectAll({
        model: UserActivity,
        filter,
        sort: { timestamp: -1 },
        limit,
        skip
      });

      return activities || [];
    } catch (error) {
      throw new Error(`خطأ في البحث عن الأنشطة: ${error.message}`);
    }
  }
}

export default UserActivityService;