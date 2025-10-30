// نظام إدارة التحذيرات للمستخدمين
// User Warnings Management System

const fs = require('fs').promises;
const path = require('path');

// مسار ملف التحذيرات
const WARNINGS_FILE = path.join(__dirname, '../data/warnings.json');

/**
 * قراءة بيانات التحذيرات
 * Read warnings data
 */
async function readWarningsData() {
  try {
    const data = await fs.readFile(WARNINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // إنشاء ملف جديد إذا لم يكن موجوداً
      const initialData = {};
      await writeWarningsData(initialData);
      return initialData;
    }
    throw error;
  }
}

/**
 * كتابة بيانات التحذيرات
 * Write warnings data
 */
async function writeWarningsData(data) {
  try {
    // التأكد من وجود مجلد البيانات
    const dataDir = path.dirname(WARNINGS_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(WARNINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('❌ [WARNINGS] Error writing warnings data:', error);
    throw error;
  }
}

/**
 * الحصول على تحذيرات المستخدم
 * Get user warnings
 * @param {string} guildId - معرف السيرفر
 * @param {string} userId - معرف المستخدم
 * @param {string} type - نوع التحذير (اختياري - إذا لم يتم تحديده سيتم إرجاع جميع التحذيرات)
 */
async function getUserWarnings(guildId, userId, type = null) {
  try {
    const warningsData = await readWarningsData();
    
    if (!warningsData[guildId]) {
      return [];
    }
    
    if (!warningsData[guildId][userId]) {
      return [];
    }
    
    // إذا تم تحديد نوع معين، إرجاع تحذيرات هذا النوع فقط
    if (type) {
      if (!warningsData[guildId][userId][type]) {
        return [];
      }
      return warningsData[guildId][userId][type];
    }
    
    // إذا لم يتم تحديد نوع، إرجاع جميع التحذيرات
    const allWarnings = [];
    const userWarnings = warningsData[guildId][userId];
    
    for (const warningType in userWarnings) {
      if (Array.isArray(userWarnings[warningType])) {
        userWarnings[warningType].forEach(warning => {
          allWarnings.push({
            ...warning,
            type: warningType
          });
        });
      }
    }
    
    // ترتيب التحذيرات حسب التاريخ (الأحدث أولاً)
    allWarnings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return allWarnings;
  } catch (error) {
    console.error('❌ [WARNINGS] Error getting user warnings:', error);
    return [];
  }
}

/**
 * إضافة تحذير لمستخدم
 * Add warning to user
 * @param {string} guildId - معرف السيرفر
 * @param {string} userId - معرف المستخدم
 * @param {string} type - نوع التحذير
 * @param {Object} warningData - بيانات التحذير
 */
async function addUserWarning(guildId, userId, type, warningData) {
  try {
    const warningsData = await readWarningsData();
    
    // إنشاء هيكل البيانات إذا لم يكن موجوداً
    if (!warningsData[guildId]) {
      warningsData[guildId] = {};
    }
    
    if (!warningsData[guildId][userId]) {
      warningsData[guildId][userId] = {};
    }
    
    if (!warningsData[guildId][userId][type]) {
      warningsData[guildId][userId][type] = [];
    }
    
    // إضافة التحذير الجديد
    const warning = {
      id: generateWarningId(),
      timestamp: new Date().toISOString(),
      ...warningData
    };
    
    warningsData[guildId][userId][type].push(warning);
    
    // حفظ البيانات
    await writeWarningsData(warningsData);
    
    console.log(`⚠️ [WARNINGS] Added ${type} warning for user ${userId} in guild ${guildId}`);
    return warning;
    
  } catch (error) {
    console.error('❌ [WARNINGS] Error adding user warning:', error);
    throw error;
  }
}

/**
 * عد تحذيرات المستخدم
 * Count user warnings
 * @param {string} guildId - معرف السيرفر
 * @param {string} userId - معرف المستخدم
 * @param {string} type - نوع التحذير
 * @param {number} timeWindow - نافذة زمنية بالساعات (اختيارية)
 */
async function countUserWarnings(guildId, userId, type, timeWindow = null) {
  try {
    const warnings = await getUserWarnings(guildId, userId, type);
    
    if (!timeWindow) {
      return warnings.length;
    }
    
    // فلترة التحذيرات حسب النافذة الزمنية
    const cutoffTime = new Date(Date.now() - (timeWindow * 60 * 60 * 1000));
    const recentWarnings = warnings.filter(warning => 
      new Date(warning.timestamp) > cutoffTime
    );
    
    return recentWarnings.length;
    
  } catch (error) {
    console.error('❌ [WARNINGS] Error counting user warnings:', error);
    return 0;
  }
}

/**
 * مسح تحذيرات المستخدم القديمة
 * Clear old user warnings
 * @param {string} guildId - معرف السيرفر
 * @param {string} userId - معرف المستخدم
 * @param {string} type - نوع التحذير
 * @param {number} maxAge - العمر الأقصى بالساعات
 */
async function clearOldWarnings(guildId, userId, type, maxAge = 24) {
  try {
    const warningsData = await readWarningsData();
    
    if (!warningsData[guildId] || !warningsData[guildId][userId] || !warningsData[guildId][userId][type]) {
      return;
    }
    
    const cutoffTime = new Date(Date.now() - (maxAge * 60 * 60 * 1000));
    const recentWarnings = warningsData[guildId][userId][type].filter(warning => 
      new Date(warning.timestamp) > cutoffTime
    );
    
    warningsData[guildId][userId][type] = recentWarnings;
    
    // حذف المستخدم إذا لم تعد لديه تحذيرات
    if (Object.keys(warningsData[guildId][userId]).every(key => 
      warningsData[guildId][userId][key].length === 0
    )) {
      delete warningsData[guildId][userId];
    }
    
    // حذف السيرفر إذا لم يعد لديه مستخدمين
    if (Object.keys(warningsData[guildId]).length === 0) {
      delete warningsData[guildId];
    }
    
    await writeWarningsData(warningsData);
    
  } catch (error) {
    console.error('❌ [WARNINGS] Error clearing old warnings:', error);
  }
}

/**
 * مسح جميع تحذيرات المستخدم
 * Clear all user warnings
 * @param {string} guildId - معرف السيرفر
 * @param {string} userId - معرف المستخدم
 * @param {string} type - نوع التحذير (اختياري)
 */
async function clearUserWarnings(guildId, userId, type = null) {
  try {
    const warningsData = await readWarningsData();
    
    if (!warningsData[guildId] || !warningsData[guildId][userId]) {
      return;
    }
    
    if (type) {
      // مسح نوع معين من التحذيرات
      if (warningsData[guildId][userId][type]) {
        warningsData[guildId][userId][type] = [];
      }
    } else {
      // مسح جميع التحذيرات
      delete warningsData[guildId][userId];
    }
    
    // حذف السيرفر إذا لم يعد لديه مستخدمين
    if (Object.keys(warningsData[guildId]).length === 0) {
      delete warningsData[guildId];
    }
    
    await writeWarningsData(warningsData);
    
    console.log(`🧹 [WARNINGS] Cleared ${type || 'all'} warnings for user ${userId} in guild ${guildId}`);
    
  } catch (error) {
    console.error('❌ [WARNINGS] Error clearing user warnings:', error);
  }
}

/**
 * توليد معرف فريد للتحذير
 * Generate unique warning ID
 */
function generateWarningId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * تنظيف التحذيرات القديمة لجميع المستخدمين
 * Cleanup old warnings for all users
 * @param {number} maxAge - العمر الأقصى بالساعات
 */
async function cleanupOldWarnings(maxAge = 24) {
  try {
    const warningsData = await readWarningsData();
    const cutoffTime = new Date(Date.now() - (maxAge * 60 * 60 * 1000));
    let cleanedCount = 0;
    
    for (const guildId in warningsData) {
      for (const userId in warningsData[guildId]) {
        for (const type in warningsData[guildId][userId]) {
          const originalCount = warningsData[guildId][userId][type].length;
          warningsData[guildId][userId][type] = warningsData[guildId][userId][type].filter(warning => 
            new Date(warning.timestamp) > cutoffTime
          );
          cleanedCount += originalCount - warningsData[guildId][userId][type].length;
        }
        
        // حذف المستخدم إذا لم تعد لديه تحذيرات
        if (Object.keys(warningsData[guildId][userId]).every(key => 
          warningsData[guildId][userId][key].length === 0
        )) {
          delete warningsData[guildId][userId];
        }
      }
      
      // حذف السيرفر إذا لم يعد لديه مستخدمين
      if (Object.keys(warningsData[guildId]).length === 0) {
        delete warningsData[guildId];
      }
    }
    
    await writeWarningsData(warningsData);
    
    if (cleanedCount > 0) {
      console.log(`🧹 [WARNINGS] Cleaned up ${cleanedCount} old warnings`);
    }
    
    return cleanedCount;
    
  } catch (error) {
    console.error('❌ [WARNINGS] Error during cleanup:', error);
    return 0;
  }
}

module.exports = {
  getUserWarnings,
  addUserWarning,
  countUserWarnings,
  clearOldWarnings,
  clearUserWarnings,
  cleanupOldWarnings
};