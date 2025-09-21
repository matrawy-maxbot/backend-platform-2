import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { UserActivityLogs } from '../models/index.js';

/**
 * خدمة إدارة سجلات أنشطة المستخدمين
 * UserActivityLogs Service
 */

// تسجيل نشاط جديد للمستخدم
export const logUserActivity = async (userId, activityData) => {
  try {
    const newActivity = {
      user_id: userId,
      ...activityData
    };

    const result = await mDBinsert(UserActivityLogs, newActivity);
    return result;
  } catch (error) {
    throw new Error(`Error logging user activity: ${error.message}`);
  }
};

// الحصول على أنشطة المستخدم
export const getUserActivities = async (userId, limit = 50, skip = 0) => {
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
    throw new Error(`Error fetching user activities: ${error.message}`);
  }
};

// الحصول على أنشطة المستخدم حسب النوع
export const getUserActivitiesByType = async (userId, activityType, limit = 50) => {
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
    throw new Error(`Error fetching user activities by type: ${error.message}`);
  }
};

// الحصول على أنشطة المستخدم في فترة زمنية محددة
export const getUserActivitiesByDateRange = async (userId, startDate, endDate) => {
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
    throw new Error(`Error fetching user activities by date range: ${error.message}`);
  }
};

// حذف سجلات أنشطة المستخدم القديمة
export const deleteOldUserActivities = async (userId, daysOld = 90) => {
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
    throw new Error(`Error deleting old user activities: ${error.message}`);
  }
};

// الحصول على إحصائيات أنشطة المستخدم
export const getUserActivityStats = async (userId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const activities = await getUserActivitiesByDateRange(userId, startDate, new Date());
    
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
    throw new Error(`Error getting user activity stats: ${error.message}`);
  }
};

// تسجيل نشاط تسجيل الدخول
export const logUserLogin = async (userId, deviceInfo) => {
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
    
    return await logUserActivity(userId, activityData);
  } catch (error) {
    throw new Error(`Error logging user login: ${error.message}`);
  }
};

// تسجيل نشاط تسجيل الخروج
export const logUserLogout = async (userId, ipAddress) => {
  try {
    const activityData = {
      activity_type: 'logout',
      ip_address: ipAddress
    };
    
    return await logUserActivity(userId, activityData);
  } catch (error) {
    throw new Error(`Error logging user logout: ${error.message}`);
  }
};

// تسجيل نشاط عرض المنتج
export const logProductView = async (userId, productId, deviceInfo) => {
  try {
    const activityData = {
      activity_type: 'view_product',
      related_entity: 'product',
      related_entity_id: productId,
      ip_address: deviceInfo.ip_address,
      device_type: deviceInfo.device_type,
      browser: deviceInfo.browser
    };
    
    return await logUserActivity(userId, activityData);
  } catch (error) {
    throw new Error(`Error logging product view: ${error.message}`);
  }
};

// تسجيل نشاط إضافة إلى السلة
export const logAddToCart = async (userId, productId, deviceInfo) => {
  try {
    const activityData = {
      activity_type: 'add_to_cart',
      related_entity: 'product',
      related_entity_id: productId,
      ip_address: deviceInfo.ip_address,
      device_type: deviceInfo.device_type
    };
    
    return await logUserActivity(userId, activityData);
  } catch (error) {
    throw new Error(`Error logging add to cart: ${error.message}`);
  }
};