import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Daily } from '../models/index.js';
import { Op } from 'sequelize';

class DailyService {
  /**
   * إنشاء سجل نشاط يومي جديد
   * @param {Object} dailyData - بيانات النشاط اليومي
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createDaily(dailyData) {
    try {
      const result = await PGinsert(Daily, dailyData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل النشاط اليومي: ${error.message}`);
    }
  }

  /**
   * إنشاء أو تحديث سجل النشاط اليومي للمستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Object>} - السجل المنشأ أو المحدث
   */
  static async createOrUpdateDaily(userId) {
    try {
      const existingDaily = await this.getDailyById(userId);
      
      if (existingDaily) {
        // تحديث الطابع الزمني
        return await this.updateDaily(userId, { daily: new Date() });
      } else {
        // إنشاء سجل جديد
        return await this.createDaily({ id: userId, daily: new Date() });
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث سجل النشاط اليومي: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع سجلات النشاط اليومي
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAllDaily(options = {}) {
    try {
      const result = await Daily.findAll(options);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات النشاط اليومي: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل النشاط اليومي بواسطة معرف المستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Object|null>} - السجل أو null
   */
  static async getDailyById(userId) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Daily.findAll({
        where: { id: userId }
      });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجل النشاط اليومي: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي بواسطة التاريخ
   * @param {Date} date - التاريخ
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getDailyByDate(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Daily.findAll({
        where: {
          daily: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات النشاط اليومي بواسطة التاريخ: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي لليوم الحالي
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getTodayDaily() {
    try {
      const today = new Date();
      return await this.getDailyByDate(today);
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات النشاط اليومي لليوم: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getDailyByDateRange(startDate, endDate) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Daily.findAll({
        where: {
          daily: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['daily', 'DESC']]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات النشاط اليومي بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي للأسبوع الماضي
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getLastWeekDaily() {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      return await this.getDailyByDateRange(startDate, endDate);
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات النشاط اليومي للأسبوع الماضي: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي للشهر الماضي
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getLastMonthDaily() {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      
      return await this.getDailyByDateRange(startDate, endDate);
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات النشاط اليومي للشهر الماضي: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود نشاط يومي للمستخدم اليوم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<boolean>} - true إذا كان هناك نشاط اليوم
   */
  static async hasUserDailyToday(userId) {
    try {
      const userDaily = await this.getDailyById(userId);
      
      if (!userDaily) {
        return false;
      }

      const today = new Date();
      const dailyDate = new Date(userDaily.daily);
      
      return (
        today.getFullYear() === dailyDate.getFullYear() &&
        today.getMonth() === dailyDate.getMonth() &&
        today.getDate() === dailyDate.getDate()
      );
    } catch (error) {
      throw new Error(`خطأ في التحقق من النشاط اليومي للمستخدم: ${error.message}`);
    }
  }

  /**
   * تحديث سجل النشاط اليومي
   * @param {string} userId - معرف المستخدم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateDaily(userId, updateData) {
    try {
      const result = await PGupdate(Daily, updateData, {
        where: { id: userId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث سجل النشاط اليومي: ${error.message}`);
    }
  }

  /**
   * تحديث الطابع الزمني للنشاط اليومي للمستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateUserDailyTimestamp(userId) {
    try {
      const updateData = {
        daily: new Date()
      };
      const result = await PGupdate(Daily, updateData, {
        where: { id: userId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الطابع الزمني للنشاط اليومي: ${error.message}`);
    }
  }

  /**
   * حذف سجل النشاط اليومي
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteDaily(userId) {
    try {
      const result = await PGdelete(Daily, {
        where: { id: userId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجل النشاط اليومي: ${error.message}`);
    }
  }

  /**
   * حذف سجلات النشاط اليومي القديمة
   * @param {number} daysOld - عدد الأيام (السجلات الأقدم من هذا العدد ستحذف)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteOldDaily(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await PGdelete(Daily, {
        where: {
          daily: {
            [Op.lt]: cutoffDate
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات النشاط اليومي القديمة: ${error.message}`);
    }
  }

  /**
   * حذف سجلات النشاط اليومي بواسطة التاريخ
   * @param {Date} date - التاريخ
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteDailyByDate(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const result = await PGdelete(Daily, {
        where: {
          daily: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات النشاط اليومي بواسطة التاريخ: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات النشاط اليومي
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getDailyStats() {
    try {
      const allDaily = await Daily.findAll();
      const totalRecords = allDaily.length;
      
      // حساب النشاط اليومي لليوم الحالي
      const todayRecords = await this.getTodayDaily();
      const todayCount = todayRecords.length;
      
      // حساب النشاط الأسبوعي
      const weekRecords = await this.getLastWeekDaily();
      const weekCount = weekRecords.length;
      
      // حساب النشاط الشهري
      const monthRecords = await this.getLastMonthDaily();
      const monthCount = monthRecords.length;
      
      // حساب متوسط النشاط اليومي
      const dailyAverage = totalRecords > 0 ? Math.round((totalRecords / 30) * 100) / 100 : 0;

      return {
        totalRecords,
        todayCount,
        weekCount,
        monthCount,
        dailyAverage
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات النشاط اليومي: ${error.message}`);
    }
  }

  /**
   * الحصول على أكثر المستخدمين نشاطاً
   * @param {number} limit - عدد المستخدمين المطلوب إرجاعهم
   * @returns {Promise<Array>} - قائمة المستخدمين الأكثر نشاطاً
   */
  static async getMostActiveUsers(limit = 10) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Daily.findAll({
        order: [['daily', 'DESC']],
        limit: limit
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أكثر المستخدمين نشاطاً: ${error.message}`);
    }
  }
}

export default DailyService;