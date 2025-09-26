import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { UserActivityLogs } from '../models/index.js';

/**
 * خدمة إدارة سجلات أنشطة المستخدمين - UserActivityLogs Service
 * تحتوي على الوظائف الأساسية لتسجيل وإدارة سجلات أنشطة المستخدمين
 */
class UserActivityLogsService {

  /**
   * تسجيل نشاط جديد للمستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} activityData - بيانات النشاط
   * @returns {Promise<Object>} النشاط المُسجل
   */
  static async logUserActivity(userId, activityData) {
    try {
      const newActivity = {
        user_id: userId,
        ...activityData
      };

      const result = await mDBinsert(UserActivityLogs, newActivity);
      return result;
    } catch (error) {
      throw new Error(`خطأ في تسجيل نشاط المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على أنشطة المستخدم
   * @param {number} userId - معرف المستخدم
   * @param {number} limit - عدد النتائج المطلوبة (افتراضي: 50)
   * @param {number} skip - عدد النتائج المتجاهلة (افتراضي: 0)
   * @returns {Promise<Array>} قائمة أنشطة المستخدم
   */
  static async getUserActivities(userId, limit = 50, skip = 0) {
    try {
      const filter = { user_id: userId };
      const options = {
        sort: { created_at: -1 },
        limit: limit,
        skip: skip
      };
      
      const result = await mDBselectAll(UserActivityLogs, filter, options);
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب أنشطة المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على أنشطة المستخدم حسب النوع
   * @param {number} userId - معرف المستخدم
   * @param {string} activityType - نوع النشاط
   * @param {number} limit - عدد النتائج المطلوبة (افتراضي: 50)
   * @returns {Promise<Array>} قائمة الأنشطة المفلترة حسب النوع
   */
  static async getUserActivitiesByType(userId, activityType, limit = 50) {
    try {
      const filter = { 
        user_id: userId,
        activity_type: activityType
      };
      const options = {
        sort: { created_at: -1 },
        limit: limit
      };
      
      const result = await mDBselectAll(UserActivityLogs, filter, options);
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب أنشطة المستخدم حسب النوع: ${error.message}`);
    }
  }

  /**
   * الحصول على أنشطة المستخدم في فترة زمنية محددة
   * @param {number} userId - معرف المستخدم
   * @param {Date|string} startDate - تاريخ البداية
   * @param {Date|string} endDate - تاريخ النهاية
   * @returns {Promise<Array>} قائمة الأنشطة في الفترة المحددة
   */
  static async getUserActivitiesByDateRange(userId, startDate, endDate) {
    try {
      const filter = {
        user_id: userId,
        created_at: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
      const options = {
        sort: { created_at: -1 }
      };
      
      const result = await mDBselectAll(UserActivityLogs, filter, options);
      return result;
    } catch (error) {
      throw new Error(`خطأ في جلب أنشطة المستخدم حسب الفترة الزمنية: ${error.message}`);
    }
  }

  /**
   * حذف سجلات أنشطة المستخدم القديمة
   * @param {number} userId - معرف المستخدم
   * @param {number} daysOld - عدد الأيام القديمة (افتراضي: 90)
   * @returns {Promise<Object>} نتيجة عملية الحذف
   */
  static async deleteOldUserActivities(userId, daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const filter = {
        user_id: userId,
        created_at: { $lt: cutoffDate }
      };
      
      const result = await mDBdelete(UserActivityLogs, filter);
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف أنشطة المستخدم القديمة: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات أنشطة المستخدم
   * @param {number} userId - معرف المستخدم
   * @param {number} days - عدد الأيام للإحصائيات (افتراضي: 30)
   * @returns {Promise<Object>} إحصائيات مفصلة عن أنشطة المستخدم
   */
  static async getUserActivityStats(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const activities = await this.getUserActivitiesByDateRange(userId, startDate, new Date());
      
      const stats = {
        total_activities: activities.length,
        activity_types: {},
        daily_activities: {},
        device_types: {},
        browsers: {},
        locations: {}
      };
      
      activities.forEach(activity => {
        // إحصائيات حسب النوع
        if (!stats.activity_types[activity.activity_type]) {
          stats.activity_types[activity.activity_type] = 0;
        }
        stats.activity_types[activity.activity_type]++;
        
        // إحصائيات يومية
        const date = activity.created_at.toISOString().split('T')[0];
        if (!stats.daily_activities[date]) {
          stats.daily_activities[date] = 0;
        }
        stats.daily_activities[date]++;
        
        // إحصائيات الأجهزة
        if (activity.device_type) {
          if (!stats.device_types[activity.device_type]) {
            stats.device_types[activity.device_type] = 0;
          }
          stats.device_types[activity.device_type]++;
        }
        
        // إحصائيات المتصفحات
        if (activity.browser) {
          if (!stats.browsers[activity.browser]) {
            stats.browsers[activity.browser] = 0;
          }
          stats.browsers[activity.browser]++;
        }
        
        // إحصائيات المواقع
        if (activity.location && activity.location.country) {
          if (!stats.locations[activity.location.country]) {
            stats.locations[activity.location.country] = 0;
          }
          stats.locations[activity.location.country]++;
        }
      });
      
      return stats;
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات أنشطة المستخدم: ${error.message}`);
    }
  }

  /**
   * تسجيل نشاط تسجيل الدخول
   * @param {number} userId - معرف المستخدم
   * @param {Object} deviceInfo - معلومات الجهاز
   * @param {string} deviceInfo.ip_address - عنوان IP
   * @param {string} deviceInfo.user_agent - معلومات المتصفح
   * @param {string} deviceInfo.device_type - نوع الجهاز
   * @param {string} deviceInfo.browser - المتصفح
   * @param {string} deviceInfo.os - نظام التشغيل
   * @param {Object} deviceInfo.location - الموقع الجغرافي
   * @returns {Promise<Object>} نتيجة تسجيل النشاط
   */
  static async logUserLogin(userId, deviceInfo) {
    try {
      const activityData = {
        activity_type: 'login',
        ip_address: deviceInfo.ip_address,
        user_agent: deviceInfo.user_agent,
        device_type: deviceInfo.device_type,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        location: deviceInfo.location
      };
      
      return await this.logUserActivity(userId, activityData);
    } catch (error) {
      throw new Error(`خطأ في تسجيل نشاط تسجيل الدخول: ${error.message}`);
    }
  }

  /**
   * تسجيل نشاط تسجيل الخروج
   * @param {number} userId - معرف المستخدم
   * @param {string} ipAddress - عنوان IP
   * @returns {Promise<Object>} نتيجة تسجيل النشاط
   */
  static async logUserLogout(userId, ipAddress) {
    try {
      const activityData = {
        activity_type: 'logout',
        ip_address: ipAddress
      };
      
      return await this.logUserActivity(userId, activityData);
    } catch (error) {
      throw new Error(`خطأ في تسجيل نشاط تسجيل الخروج: ${error.message}`);
    }
  }

  /**
   * تسجيل نشاط عرض المنتج
   * @param {number} userId - معرف المستخدم
   * @param {string} productId - معرف المنتج
   * @param {Object} deviceInfo - معلومات الجهاز
   * @param {string} deviceInfo.ip_address - عنوان IP
   * @param {string} deviceInfo.device_type - نوع الجهاز
   * @param {string} deviceInfo.browser - المتصفح
   * @returns {Promise<Object>} نتيجة تسجيل النشاط
   */
  static async logProductView(userId, productId, deviceInfo) {
    try {
      const activityData = {
        activity_type: 'view_product',
        related_entity: 'product',
        related_entity_id: productId,
        ip_address: deviceInfo.ip_address,
        device_type: deviceInfo.device_type,
        browser: deviceInfo.browser
      };
      
      return await this.logUserActivity(userId, activityData);
    } catch (error) {
      throw new Error(`خطأ في تسجيل نشاط عرض المنتج: ${error.message}`);
    }
  }

  /**
   * تسجيل نشاط إضافة إلى السلة
   * @param {number} userId - معرف المستخدم
   * @param {string} productId - معرف المنتج
   * @param {Object} deviceInfo - معلومات الجهاز
   * @param {string} deviceInfo.ip_address - عنوان IP
   * @param {string} deviceInfo.device_type - نوع الجهاز
   * @returns {Promise<Object>} نتيجة تسجيل النشاط
   */
  static async logAddToCart(userId, productId, deviceInfo) {
    try {
      const activityData = {
        activity_type: 'add_to_cart',
        related_entity: 'product',
        related_entity_id: productId,
        ip_address: deviceInfo.ip_address,
        device_type: deviceInfo.device_type
      };
      
      return await this.logUserActivity(userId, activityData);
    } catch (error) {
      throw new Error(`خطأ في تسجيل نشاط إضافة إلى السلة: ${error.message}`);
    }
  }
}

export default UserActivityLogsService;