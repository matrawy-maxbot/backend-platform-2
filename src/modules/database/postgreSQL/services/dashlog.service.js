import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { DashLog } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from 'sequelize';

class DashLogService {
  /**
   * إنشاء سجل جديد في لوحة التحكم
   * @param {Object} logData - بيانات السجل
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createLog(logData) {
    try {
      const result = await PGinsert(DashLog, logData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل لوحة التحكم: ${error.message}`);
    }
  }

  /**
   * إنشاء سجل لوحة تحكم للخادم والمستخدم
   * @param {string} guildId - معرف الخادم
   * @param {string} userId - معرف المستخدم
   * @param {string} pageName - اسم الصفحة
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createGuildUserLog(guildId, userId, pageName) {
    try {
      const logData = {
        guild_id: guildId,
        userID: userId,
        pageName: pageName,
        EventTime: new Date()
      };
      return await this.createLog(logData);
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل الخادم والمستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع السجلات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAllLogs(options = {}) {
    try {
      const result = await DashLog.findAll(options);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على السجلات: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل بواسطة المعرف
   * @param {number} id - معرف السجل
   * @returns {Promise<Object|null>} - السجل أو null
   */
  static async getLogById(id) {
    try {
      const result = await PGselectAll(DashLog, { id });
      return result.find(log => log.id === id) || null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على السجل: ${error.message}`);
    }
  }

  /**
   * الحصول على السجلات بواسطة معرف الخادم
   * @param {string} guildId - معرف الخادم
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getLogsByGuildId(guildId, options = {}) {
    try {
      const result = await PGselectAll(DashLog, { guild_id: guildId });
      return result.filter(log => log.guild_id === guildId);
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على السجلات بواسطة معرف المستخدم
   * @param {string} userId - معرف المستخدم
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getLogsByUserId(userId, options = {}) {
    try {
      const result = await PGselectAll(DashLog, { userID: userId });
      return result.filter(log => log.userID === userId);
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على السجلات بواسطة اسم الصفحة
   * @param {string} pageName - اسم الصفحة
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getLogsByPageName(pageName, options = {}) {
    try {
      const result = await PGselectAll(DashLog, { pageName });
      return result.filter(log => log.pageName === pageName);
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات الصفحة: ${error.message}`);
    }
  }

  /**
   * الحصول على السجلات بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getLogsByDateRange(startDate, endDate, options = {}) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.findAll({
        where: {
          EventTime: {
            [Op.between]: [startDate, endDate]
          }
        },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على السجلات بالنطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على السجلات الحديثة
   * @param {number} limit - عدد السجلات
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getRecentLogs(limit = 50, options = {}) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.findAll({
        order: [['EventTime', 'DESC']],
        limit,
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على السجلات الحديثة: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات اليوم
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getTodayLogs(options = {}) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return await this.getLogsByDateRange(today, tomorrow, options);
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات اليوم: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات الخادم والمستخدم
   * @param {string} guildId - معرف الخادم
   * @param {string} userId - معرف المستخدم
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getGuildUserLogs(guildId, userId, options = {}) {
    try {
      const guildLogs = await PGselectAll(DashLog, { guild_id: guildId });
      const result = guildLogs.filter(log => log.userID === userId);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات الخادم والمستخدم: ${error.message}`);
    }
  }

  /**
   * البحث في السجلات
   * @param {string} searchTerm - مصطلح البحث
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async searchLogs(searchTerm, options = {}) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.findAll({
        where: {
          [Op.or]: [
            { guild_id: { [Op.like]: `%${searchTerm}%` } },
            { userID: { [Op.like]: `%${searchTerm}%` } },
            { pageName: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في السجلات: ${error.message}`);
    }
  }

  /**
   * تحديث سجل
   * @param {number} id - معرف السجل
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateLog(id, updateData) {
    try {
      const result = await PGupdate(DashLog, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث السجل: ${error.message}`);
    }
  }

  /**
   * تحديث اسم الصفحة
   * @param {number} id - معرف السجل
   * @param {string} pageName - اسم الصفحة الجديد
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updatePageName(id, pageName) {
    try {
      return await this.updateLog(id, { pageName });
    } catch (error) {
      throw new Error(`خطأ في تحديث اسم الصفحة: ${error.message}`);
    }
  }

  /**
   * تحديث وقت الحدث
   * @param {number} id - معرف السجل
   * @param {Date} eventTime - وقت الحدث الجديد
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateEventTime(id, eventTime = new Date()) {
    try {
      return await this.updateLog(id, { EventTime: eventTime });
    } catch (error) {
      throw new Error(`خطأ في تحديث وقت الحدث: ${error.message}`);
    }
  }

  /**
   * حذف سجل بواسطة المعرف
   * @param {number} id - معرف السجل
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteLog(id) {
    try {
      const result = await PGdelete(DashLog, {
        where: { id }
      });
      return result > 0;
    } catch (error) {
      throw new Error(`خطأ في حذف السجل: ${error.message}`);
    }
  }

  /**
   * حذف سجلات الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<number>} - عدد السجلات المحذوفة
   */
  static async deleteGuildLogs(guildId) {
    try {
      const result = await PGdelete(DashLog, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات الخادم: ${error.message}`);
    }
  }

  /**
   * حذف سجلات المستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<number>} - عدد السجلات المحذوفة
   */
  static async deleteUserLogs(userId) {
    try {
      const result = await PGdelete(DashLog, {
        where: { userID: userId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات المستخدم: ${error.message}`);
    }
  }

  /**
   * حذف السجلات القديمة
   * @param {number} daysOld - عدد الأيام
   * @returns {Promise<number>} - عدد السجلات المحذوفة
   */
  static async deleteOldLogs(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await PGdelete(DashLog, {
        where: {
          EventTime: {
            [Op.lt]: cutoffDate
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف السجلات القديمة: ${error.message}`);
    }
  }

  /**
   * حذف سجلات بواسطة اسم الصفحة
   * @param {string} pageName - اسم الصفحة
   * @returns {Promise<number>} - عدد السجلات المحذوفة
   */
  static async deleteLogsByPageName(pageName) {
    try {
      const result = await PGdelete(DashLog, {
        where: { pageName }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات الصفحة: ${error.message}`);
    }
  }

  /**
   * حذف سجلات بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<number>} - عدد السجلات المحذوفة
   */
  static async deleteLogsByDateRange(startDate, endDate) {
    try {
      const result = await PGdelete(DashLog, {
        where: {
          EventTime: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف السجلات بالنطاق الزمني: ${error.message}`);
    }
  }

  /**
   * حذف جميع السجلات
   * @returns {Promise<number>} - عدد السجلات المحذوفة
   */
  static async deleteAllLogs() {
    try {
      const result = await PGdelete(DashLog, {});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع السجلات: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات السجلات
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getLogStats() {
    try {
      const totalLogs = await this.countAllLogs();
      const todayLogs = await this.countTodayLogs();
      const uniqueGuilds = await this.countUniqueGuilds();
      const uniqueUsers = await this.countUniqueUsers();
      const uniquePages = await this.countUniquePages();
      const recentLogs = await this.countRecentLogs();

      return {
        totalLogs,
        todayLogs,
        uniqueGuilds,
        uniqueUsers,
        uniquePages,
        recentLogs
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات السجلات: ${error.message}`);
    }
  }

  /**
   * عد جميع السجلات
   * @returns {Promise<number>} - عدد السجلات
   */
  static async countAllLogs() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.count();
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد السجلات: ${error.message}`);
    }
  }

  /**
   * عد سجلات اليوم
   * @returns {Promise<number>} - عدد السجلات
   */
  static async countTodayLogs() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.count({
        where: {
          EventTime: {
            [Op.between]: [today, tomorrow]
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد سجلات اليوم: ${error.message}`);
    }
  }

  /**
   * عد الخوادم الفريدة
   * @returns {Promise<number>} - عدد الخوادم
   */
  static async countUniqueGuilds() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.count({
        distinct: true,
        col: 'guild_id'
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد الخوادم الفريدة: ${error.message}`);
    }
  }

  /**
   * عد المستخدمين الفريدين
   * @returns {Promise<number>} - عدد المستخدمين
   */
  static async countUniqueUsers() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.count({
        distinct: true,
        col: 'userID'
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد المستخدمين الفريدين: ${error.message}`);
    }
  }

  /**
   * عد الصفحات الفريدة
   * @returns {Promise<number>} - عدد الصفحات
   */
  static async countUniquePages() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.count({
        distinct: true,
        col: 'pageName'
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد الصفحات الفريدة: ${error.message}`);
    }
  }

  /**
   * عد السجلات الحديثة (آخر 24 ساعة)
   * @returns {Promise<number>} - عدد السجلات
   */
  static async countRecentLogs() {
    try {
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);

      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.count({
        where: {
          EventTime: {
            [Op.gte]: yesterday
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد السجلات الحديثة: ${error.message}`);
    }
  }

  /**
   * عد سجلات الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<number>} - عدد السجلات
   */
  static async countGuildLogs(guildId) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.count({
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد سجلات الخادم: ${error.message}`);
    }
  }

  /**
   * عد سجلات المستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<number>} - عدد السجلات
   */
  static async countUserLogs(userId) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.count({
        where: { userID: userId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد سجلات المستخدم: ${error.message}`);
    }
  }

  /**
   * عد سجلات الصفحة
   * @param {string} pageName - اسم الصفحة
   * @returns {Promise<number>} - عدد السجلات
   */
  static async countPageLogs(pageName) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.count({
        where: { pageName }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد سجلات الصفحة: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود سجل
   * @param {number} id - معرف السجل
   * @returns {Promise<boolean>} - هل السجل موجود
   */
  static async logExists(id) {
    try {
      const log = await this.getLogById(id);
      return !!log;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود السجل: ${error.message}`);
    }
  }

  /**
   * الحصول على الصفحات الأكثر زيارة
   * @param {number} limit - عدد النتائج
   * @returns {Promise<Array>} - قائمة الصفحات
   */
  static async getMostVisitedPages(limit = 10) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.findAll({
        attributes: [
          'pageName',
          [sequelize.fn('COUNT', sequelize.col('id')), 'visitCount']
        ],
        group: ['pageName'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الصفحات الأكثر زيارة: ${error.message}`);
    }
  }

  /**
   * الحصول على المستخدمين الأكثر نشاطاً
   * @param {number} limit - عدد النتائج
   * @returns {Promise<Array>} - قائمة المستخدمين
   */
  static async getMostActiveUsers(limit = 10) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.findAll({
        attributes: [
          'userID',
          [sequelize.fn('COUNT', sequelize.col('id')), 'activityCount']
        ],
        group: ['userID'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المستخدمين الأكثر نشاطاً: ${error.message}`);
    }
  }

  /**
   * الحصول على الخوادم الأكثر نشاطاً
   * @param {number} limit - عدد النتائج
   * @returns {Promise<Array>} - قائمة الخوادم
   */
  static async getMostActiveGuilds(limit = 10) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.findAll({
        attributes: [
          'guild_id',
          [sequelize.fn('COUNT', sequelize.col('id')), 'activityCount']
        ],
        group: ['guild_id'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الخوادم الأكثر نشاطاً: ${error.message}`);
    }
  }

  /**
   * الحصول على توزيع النشاط حسب الساعة
   * @returns {Promise<Array>} - توزيع النشاط
   */
  static async getActivityDistributionByHour() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await DashLog.findAll({
        attributes: [
          [sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "EventTime"')), 'hour'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "EventTime"'))],
        order: [[sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "EventTime"')), 'ASC']]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على توزيع النشاط: ${error.message}`);
    }
  }

  /**
   * إنشاء أو تحديث سجل (upsert)
   * @param {Object} logData - بيانات السجل
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المنشأ أو المحدث
   */
  static async upsertLog(logData, updateData = {}) {
    try {
      const existingLog = await this.getGuildUserLogs(
        logData.guild_id,
        logData.userID,
        {
          where: { pageName: logData.pageName },
          limit: 1
        }
      );

      if (existingLog.length > 0) {
        return await this.updateLog(existingLog[0].id, {
          EventTime: new Date(),
          ...updateData
        });
      } else {
        return await this.createLog(logData);
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث السجل: ${error.message}`);
    }
  }

  /**
   * تصدير سجلات الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Array>} - السجلات المصدرة
   */
  static async exportGuildLogs(guildId) {
    try {
      const logs = await this.getLogsByGuildId(guildId);
      return logs.map(log => ({
        id: log.id,
        userID: log.userID,
        pageName: log.pageName,
        EventTime: log.EventTime
      }));
    } catch (error) {
      throw new Error(`خطأ في تصدير سجلات الخادم: ${error.message}`);
    }
  }

  /**
   * استيراد سجلات الخادم
   * @param {string} guildId - معرف الخادم
   * @param {Array} logs - السجلات المستوردة
   * @returns {Promise<Array>} - السجلات المنشأة
   */
  static async importGuildLogs(guildId, logs) {
    try {
      const createdLogs = [];
      for (const logData of logs) {
        const log = await this.createLog({
          guild_id: guildId,
          userID: logData.userID,
          pageName: logData.pageName,
          EventTime: logData.EventTime || new Date()
        });
        createdLogs.push(log);
      }
      return createdLogs;
    } catch (error) {
      throw new Error(`خطأ في استيراد سجلات الخادم: ${error.message}`);
    }
  }
}

export default DashLogService;