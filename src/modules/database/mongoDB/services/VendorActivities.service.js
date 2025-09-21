import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { VendorActivities } from '../models/index.js';

/**
 * خدمة إدارة أنشطة البائعين
 * VendorActivities Service
 */

// تسجيل نشاط جديد للبائع
export const logVendorActivity = async (vendorId, activityData) => {
  try {
    const newActivity = {
      vendor_id: vendorId,
      ...activityData
    };

    const result = await mDBinsert(VendorActivities, newActivity);
    return result;
  } catch (error) {
    throw new Error(`Error logging vendor activity: ${error.message}`);
  }
};

// الحصول على أنشطة البائع
export const getVendorActivities = async (vendorId, limit = 50, skip = 0) => {
  try {
    const filter = { vendor_id: vendorId };
    const options = {
      sort: { created_at: -1 },
      limit: limit,
      skip: skip
    };
    
    const result = await mDBselectAll(VendorActivities, filter, options);
    return result;
  } catch (error) {
    throw new Error(`Error fetching vendor activities: ${error.message}`);
  }
};

// الحصول على أنشطة البائع حسب النوع
export const getVendorActivitiesByType = async (vendorId, activityType, limit = 50) => {
  try {
    const filter = { 
      vendor_id: vendorId,
      activity_type: activityType
    };
    const options = {
      sort: { created_at: -1 },
      limit: limit
    };
    
    const result = await mDBselectAll(VendorActivities, filter, options);
    return result;
  } catch (error) {
    throw new Error(`Error fetching vendor activities by type: ${error.message}`);
  }
};

// الحصول على أنشطة البائع في فترة زمنية محددة
export const getVendorActivitiesByDateRange = async (vendorId, startDate, endDate) => {
  try {
    const filter = {
      vendor_id: vendorId,
      created_at: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    const options = {
      sort: { created_at: -1 }
    };
    
    const result = await mDBselectAll(VendorActivities, filter, options);
    return result;
  } catch (error) {
    throw new Error(`Error fetching vendor activities by date range: ${error.message}`);
  }
};

// حذف أنشطة البائع القديمة
export const deleteOldVendorActivities = async (vendorId, daysOld = 90) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const filter = {
      vendor_id: vendorId,
      created_at: { $lt: cutoffDate }
    };
    
    const result = await mDBdelete(VendorActivities, filter);
    return result;
  } catch (error) {
    throw new Error(`Error deleting old vendor activities: ${error.message}`);
  }
};

// الحصول على إحصائيات أنشطة البائع
export const getVendorActivityStats = async (vendorId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const activities = await getVendorActivitiesByDateRange(vendorId, startDate, new Date());
    
    const stats = {
      total_activities: activities.length,
      activity_types: {},
      daily_activities: {}
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
    });
    
    return stats;
  } catch (error) {
    throw new Error(`Error getting vendor activity stats: ${error.message}`);
  }
};

// تسجيل نشاط تسجيل الدخول
export const logVendorLogin = async (vendorId, ipAddress, userAgent) => {
  try {
    const activityData = {
      activity_type: 'login',
      description: 'Vendor logged in',
      ip_address: ipAddress,
      user_agent: userAgent
    };
    
    return await logVendorActivity(vendorId, activityData);
  } catch (error) {
    throw new Error(`Error logging vendor login: ${error.message}`);
  }
};

// تسجيل نشاط تسجيل الخروج
export const logVendorLogout = async (vendorId, ipAddress) => {
  try {
    const activityData = {
      activity_type: 'logout',
      description: 'Vendor logged out',
      ip_address: ipAddress
    };
    
    return await logVendorActivity(vendorId, activityData);
  } catch (error) {
    throw new Error(`Error logging vendor logout: ${error.message}`);
  }
};