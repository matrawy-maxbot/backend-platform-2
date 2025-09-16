import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Events } from '../models/index.js';
import sequelize from 'sequelize';
import { Op } from 'sequelize';

class EventsService {
  /**
   * إنشاء حدث جديد
   * @param {Object} eventData - بيانات الحدث
   * @returns {Promise<Object>} - الحدث المنشأ
   */
  static async createEvent(eventData) {
    try {
      const result = await PGinsert(Events, eventData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الحدث: ${error.message}`);
    }
  }

  /**
   * إنشاء حدث للخادم
   * @param {string} guildId - معرف الخادم
   * @param {Object} eventDetails - تفاصيل الحدث
   * @returns {Promise<Object>} - الحدث المنشأ
   */
  static async createGuildEvent(guildId, eventDetails) {
    try {
      const eventData = {
        guild_id: guildId,
        TimeStamp: new Date(),
        ...eventDetails
      };
      return await this.createEvent(eventData);
    } catch (error) {
      throw new Error(`خطأ في إنشاء حدث الخادم: ${error.message}`);
    }
  }

  /**
   * إنشاء حدث مجدول
   * @param {string} guildId - معرف الخادم
   * @param {string} eventName - اسم الحدث
   * @param {string} eventChannel - قناة الحدث
   * @param {string} duration - مدة الحدث
   * @param {string} hour - الساعة
   * @param {string} minute - الدقيقة
   * @param {string} apm - صباحاً/مساءً
   * @param {string} days - الأيام
   * @param {Object} additionalData - بيانات إضافية
   * @returns {Promise<Object>} - الحدث المنشأ
   */
  static async createScheduledEvent(guildId, eventName, eventChannel, duration, hour, minute, apm, days, additionalData = {}) {
    try {
      const eventData = {
        guild_id: guildId,
        event_name: eventName,
        event_channel: eventChannel,
        duration: duration,
        h: hour,
        m: minute,
        apm: apm,
        days: days,
        TimeStamp: new Date(),
        ...additionalData
      };
      return await this.createEvent(eventData);
    } catch (error) {
      throw new Error(`خطأ في إنشاء الحدث المجدول: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع الأحداث
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getAllEvents(options = {}) {
    try {
      const result = await Events.findAll(options);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الأحداث: ${error.message}`);
    }
  }

  /**
   * الحصول على حدث بواسطة معرف الحدث
   * @param {string} eventId - معرف الحدث
   * @returns {Promise<Object|null>} - الحدث أو null
   */
  static async getEventById(eventId) {
    try {
      const result = await PGselectAll(Events, { event_id: eventId });
      return result.find(event => event.event_id === eventId) || null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الحدث: ${error.message}`);
    }
  }

  /**
   * الحصول على أحداث الخادم
   * @param {string} guildId - معرف الخادم
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsByGuildId(guildId, options = {}) {
    try {
      const result = await PGselectAll(Events, { guild_id: guildId });
      return result.filter(event => event.guild_id === guildId);
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحداث الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث بواسطة القناة
   * @param {string} channelId - معرف القناة
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsByChannel(channelId, options = {}) {
    try {
      const result = await PGselectAll(Events, { event_channel: channelId });
      return result.filter(event => event.event_channel === channelId);
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحداث القناة: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث بواسطة الاسم
   * @param {string} eventName - اسم الحدث
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsByName(eventName, options = {}) {
    try {
      const result = await Events.findAll({
        where: { event_name: { [Op.like]: `%${eventName}%` } },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الأحداث بالاسم: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث بواسطة المدينة
   * @param {string} city - المدينة
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsByCity(city, options = {}) {
    try {
      const result = await PGselectAll(Events, { event_city: city });
      return result.filter(event => event.event_city === city);
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحداث المدينة: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث بواسطة المدة
   * @param {string} duration - المدة
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsByDuration(duration, options = {}) {
    try {
      const result = await Events.findAll({
        where: { duration },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الأحداث بالمدة: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث بواسطة الوقت
   * @param {string} hour - الساعة
   * @param {string} minute - الدقيقة
   * @param {string} apm - صباحاً/مساءً
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsByTime(hour, minute, apm, options = {}) {
    try {
      const whereClause = {};
      if (hour) whereClause.h = hour;
      if (minute) whereClause.m = minute;
      if (apm) whereClause.apm = apm;

      const result = await Events.findAll({
        where: whereClause,
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الأحداث بالوقت: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث بواسطة الأيام
   * @param {string} days - الأيام
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsByDays(days, options = {}) {
    try {
      const result = await Events.findAll({
        where: { days: { [Op.like]: `%${days}%` } },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الأحداث بالأيام: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsByDateRange(startDate, endDate, options = {}) {
    try {
      const result = await Events.findAll({
        where: {
          TimeStamp: {
            [Op.between]: [startDate, endDate]
          }
        },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الأحداث بالنطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث الحديثة
   * @param {number} limit - عدد الأحداث
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getRecentEvents(limit = 50, options = {}) {
    try {
      const result = await Events.findAll({
        order: [['TimeStamp', 'DESC']],
        limit,
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الأحداث الحديثة: ${error.message}`);
    }
  }

  /**
   * البحث في الأحداث
   * @param {string} searchTerm - مصطلح البحث
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async searchEvents(searchTerm, options = {}) {
    try {
      const result = await Events.findAll({
        where: {
          [Op.or]: [
            { event_name: { [Op.like]: `%${searchTerm}%` } },
            { event_prizes: { [Op.like]: `%${searchTerm}%` } },
            { event_city: { [Op.like]: `%${searchTerm}%` } },
            { guild_id: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في الأحداث: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث التي تحتوي على جوائز
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsWithPrizes(options = {}) {
    try {
      const result = await Events.findAll({
        where: {
          event_prizes: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.ne]: '' }
            ]
          }
        },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الأحداث مع الجوائز: ${error.message}`);
    }
  }

  /**
   * الحصول على الأحداث بدون جوائز
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة الأحداث
   */
  static async getEventsWithoutPrizes(options = {}) {
    try {
      const result = await Events.findAll({
        where: {
          [Op.or]: [
            { event_prizes: null },
            { event_prizes: '' }
          ]
        },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الأحداث بدون جوائز: ${error.message}`);
    }
  }

  /**
   * تحديث حدث
   * @param {string} eventId - معرف الحدث
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - الحدث المحدث
   */
  static async updateEvent(eventId, updateData) {
    try {
      const result = await PGupdate(Events, updateData, {
        where: { event_id: eventId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الحدث: ${error.message}`);
    }
  }

  /**
   * تحديث اسم الحدث
   * @param {string} eventId - معرف الحدث
   * @param {string} eventName - اسم الحدث الجديد
   * @returns {Promise<Object>} - الحدث المحدث
   */
  static async updateEventName(eventId, eventName) {
    try {
      return await this.updateEvent(eventId, { event_name: eventName });
    } catch (error) {
      throw new Error(`خطأ في تحديث اسم الحدث: ${error.message}`);
    }
  }

  /**
   * تحديث قناة الحدث
   * @param {string} eventId - معرف الحدث
   * @param {string} channelId - معرف القناة الجديد
   * @returns {Promise<Object>} - الحدث المحدث
   */
  static async updateEventChannel(eventId, channelId) {
    try {
      return await this.updateEvent(eventId, { event_channel: channelId });
    } catch (error) {
      throw new Error(`خطأ في تحديث قناة الحدث: ${error.message}`);
    }
  }

  /**
   * تحديث جوائز الحدث
   * @param {string} eventId - معرف الحدث
   * @param {string} prizes - الجوائز الجديدة
   * @returns {Promise<Object>} - الحدث المحدث
   */
  static async updateEventPrizes(eventId, prizes) {
    try {
      return await this.updateEvent(eventId, { event_prizes: prizes });
    } catch (error) {
      throw new Error(`خطأ في تحديث جوائز الحدث: ${error.message}`);
    }
  }

  /**
   * تحديث مدة الحدث
   * @param {string} eventId - معرف الحدث
   * @param {string} duration - المدة الجديدة
   * @returns {Promise<Object>} - الحدث المحدث
   */
  static async updateEventDuration(eventId, duration) {
    try {
      return await this.updateEvent(eventId, { duration });
    } catch (error) {
      throw new Error(`خطأ في تحديث مدة الحدث: ${error.message}`);
    }
  }

  /**
   * تحديث وقت الحدث
   * @param {string} eventId - معرف الحدث
   * @param {string} hour - الساعة
   * @param {string} minute - الدقيقة
   * @param {string} apm - صباحاً/مساءً
   * @returns {Promise<Object>} - الحدث المحدث
   */
  static async updateEventTime(eventId, hour, minute, apm) {
    try {
      const updateData = {};
      if (hour !== undefined) updateData.h = hour;
      if (minute !== undefined) updateData.m = minute;
      if (apm !== undefined) updateData.apm = apm;
      
      return await this.updateEvent(eventId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تحديث وقت الحدث: ${error.message}`);
    }
  }

  /**
   * تحديث أيام الحدث
   * @param {string} eventId - معرف الحدث
   * @param {string} days - الأيام الجديدة
   * @returns {Promise<Object>} - الحدث المحدث
   */
  static async updateEventDays(eventId, days) {
    try {
      return await this.updateEvent(eventId, { days });
    } catch (error) {
      throw new Error(`خطأ في تحديث أيام الحدث: ${error.message}`);
    }
  }

  /**
   * تحديث مدينة الحدث
   * @param {string} eventId - معرف الحدث
   * @param {string} city - المدينة الجديدة
   * @returns {Promise<Object>} - الحدث المحدث
   */
  static async updateEventCity(eventId, city) {
    try {
      return await this.updateEvent(eventId, { event_city: city });
    } catch (error) {
      throw new Error(`خطأ في تحديث مدينة الحدث: ${error.message}`);
    }
  }

  /**
   * تحديث الطابع الزمني للحدث
   * @param {string} eventId - معرف الحدث
   * @param {Date} timestamp - الطابع الزمني الجديد
   * @returns {Promise<Object>} - الحدث المحدث
   */
  static async updateEventTimestamp(eventId, timestamp = new Date()) {
    try {
      return await this.updateEvent(eventId, { TimeStamp: timestamp });
    } catch (error) {
      throw new Error(`خطأ في تحديث الطابع الزمني للحدث: ${error.message}`);
    }
  }

  /**
   * حذف حدث بواسطة معرف الحدث
   * @param {string} eventId - معرف الحدث
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteEvent(eventId) {
    try {
      const result = await PGdelete(Events, {
        where: { event_id: eventId }
      });
      return result > 0;
    } catch (error) {
      throw new Error(`خطأ في حذف الحدث: ${error.message}`);
    }
  }

  /**
   * حذف أحداث الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<number>} - عدد الأحداث المحذوفة
   */
  static async deleteGuildEvents(guildId) {
    try {
      const result = await PGdelete(Events, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف أحداث الخادم: ${error.message}`);
    }
  }

  /**
   * حذف أحداث القناة
   * @param {string} channelId - معرف القناة
   * @returns {Promise<number>} - عدد الأحداث المحذوفة
   */
  static async deleteChannelEvents(channelId) {
    try {
      const result = await PGdelete(Events, {
        where: { event_channel: channelId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف أحداث القناة: ${error.message}`);
    }
  }

  /**
   * حذف الأحداث القديمة
   * @param {number} daysOld - عدد الأيام
   * @returns {Promise<number>} - عدد الأحداث المحذوفة
   */
  static async deleteOldEvents(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await PGdelete(Events, {
        where: {
          TimeStamp: {
            [Op.lt]: cutoffDate
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الأحداث القديمة: ${error.message}`);
    }
  }

  /**
   * حذف الأحداث بدون جوائز
   * @returns {Promise<number>} - عدد الأحداث المحذوفة
   */
  static async deleteEventsWithoutPrizes() {
    try {
      const result = await PGdelete(Events, {
        where: {
          [Op.or]: [
            { event_prizes: null },
            { event_prizes: '' }
          ]
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الأحداث بدون جوائز: ${error.message}`);
    }
  }

  /**
   * حذف الأحداث بواسطة المدينة
   * @param {string} city - المدينة
   * @returns {Promise<number>} - عدد الأحداث المحذوفة
   */
  static async deleteEventsByCity(city) {
    try {
      const result = await PGdelete(Events, {
        where: { event_city: city }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف أحداث المدينة: ${error.message}`);
    }
  }

  /**
   * حذف جميع الأحداث
   * @returns {Promise<number>} - عدد الأحداث المحذوفة
   */
  static async deleteAllEvents() {
    try {
      const result = await PGdelete(Events, {});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع الأحداث: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الأحداث
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getEventStats() {
    try {
      const totalEvents = await this.countAllEvents();
      const eventsWithPrizes = await this.countEventsWithPrizes();
      const eventsWithoutPrizes = await this.countEventsWithoutPrizes();
      const uniqueGuilds = await this.countUniqueGuilds();
      const uniqueChannels = await this.countUniqueChannels();
      const uniqueCities = await this.countUniqueCities();
      const recentEvents = await this.countRecentEvents();
      const averageDuration = await this.getAverageDuration();

      return {
        totalEvents,
        eventsWithPrizes,
        eventsWithoutPrizes,
        uniqueGuilds,
        uniqueChannels,
        uniqueCities,
        recentEvents,
        averageDuration,
        prizesPercentage: totalEvents > 0 ? (eventsWithPrizes / totalEvents * 100).toFixed(2) : 0
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات الأحداث: ${error.message}`);
    }
  }

  /**
   * عد جميع الأحداث
   * @returns {Promise<number>} - عدد الأحداث
   */
  static async countAllEvents() {
    try {
      const count = await Events.count();
      return count || 0;
    } catch (error) {
      throw new Error(`خطأ في عد الأحداث: ${error.message}`);
    }
  }

  /**
   * عد الأحداث مع الجوائز
   * @returns {Promise<number>} - عدد الأحداث
   */
  static async countEventsWithPrizes() {
    try {
      const count = await Events.count({
        where: {
          event_prizes: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.ne]: '' }
            ]
          }
        }
      });
      return count || 0;
    } catch (error) {
      throw new Error(`خطأ في عد الأحداث مع الجوائز: ${error.message}`);
    }
  }

  /**
   * عد الأحداث بدون جوائز
   * @returns {Promise<number>} - عدد الأحداث
   */
  static async countEventsWithoutPrizes() {
    try {
      const count = await Events.count({
        where: {
          [Op.or]: [
            { event_prizes: null },
            { event_prizes: '' }
          ]
        }
      });
      return count || 0;
    } catch (error) {
      throw new Error(`خطأ في عد الأحداث بدون جوائز: ${error.message}`);
    }
  }

  /**
   * عد الخوادم الفريدة
   * @returns {Promise<number>} - عدد الخوادم
   */
  static async countUniqueGuilds() {
    try {
      const count = await Events.count({
        distinct: true,
        col: 'guild_id'
      });
      return count || 0;
    } catch (error) {
      throw new Error(`خطأ في عد الخوادم الفريدة: ${error.message}`);
    }
  }

  /**
   * عد القنوات الفريدة
   * @returns {Promise<number>} - عدد القنوات
   */
  static async countUniqueChannels() {
    try {
      const count = await Events.count({
        distinct: true,
        col: 'event_channel',
        where: {
          event_channel: {
            [Op.ne]: null
          }
        }
      });
      return count || 0;
    } catch (error) {
      throw new Error(`خطأ في عد القنوات الفريدة: ${error.message}`);
    }
  }

  /**
   * عد المدن الفريدة
   * @returns {Promise<number>} - عدد المدن
   */
  static async countUniqueCities() {
    try {
      const count = await Events.count({
        distinct: true,
        col: 'event_city',
        where: {
          event_city: {
            [Op.ne]: null
          }
        }
      });
      return count || 0;
    } catch (error) {
      throw new Error(`خطأ في عد المدن الفريدة: ${error.message}`);
    }
  }

  /**
   * عد الأحداث الحديثة (آخر 24 ساعة)
   * @returns {Promise<number>} - عدد الأحداث
   */
  static async countRecentEvents() {
    try {
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);

      const count = await Events.count({
        where: {
          TimeStamp: {
            [Op.gte]: yesterday
          }
        }
      });
      return count || 0;
    } catch (error) {
      throw new Error(`خطأ في عد الأحداث الحديثة: ${error.message}`);
    }
  }

  /**
   * الحصول على متوسط المدة
   * @returns {Promise<number>} - متوسط المدة
   */
  static async getAverageDuration() {
    try {
      const result = await Events.findAll({
        attributes: [[sequelize.fn('AVG', sequelize.fn('LENGTH', sequelize.col('duration'))), 'avgDuration']],
        where: {
          duration: {
            [Op.ne]: null
          }
        }
      });
      return parseFloat(result[0]?.dataValues?.avgDuration || 0);
    } catch (error) {
      throw new Error(`خطأ في حساب متوسط المدة: ${error.message}`);
    }
  }

  /**
   * عد أحداث الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<number>} - عدد الأحداث
   */
  static async countGuildEvents(guildId) {
    try {
      const count = await Events.count({
        where: { guild_id: guildId }
      });
      return count || 0;
    } catch (error) {
      throw new Error(`خطأ في عد أحداث الخادم: ${error.message}`);
    }
  }

  /**
   * عد أحداث القناة
   * @param {string} channelId - معرف القناة
   * @returns {Promise<number>} - عدد الأحداث
   */
  static async countChannelEvents(channelId) {
    try {
      const count = await Events.count({
        where: { event_channel: channelId }
      });
      return count || 0;
    } catch (error) {
      throw new Error(`خطأ في عد أحداث القناة: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود حدث
   * @param {string} eventId - معرف الحدث
   * @returns {Promise<boolean>} - هل الحدث موجود
   */
  static async eventExists(eventId) {
    try {
      const event = await this.getEventById(eventId);
      return !!event;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود الحدث: ${error.message}`);
    }
  }

  /**
   * التحقق من تضارب الأحداث
   * @param {string} guildId - معرف الخادم
   * @param {string} channelId - معرف القناة
   * @param {string} hour - الساعة
   * @param {string} minute - الدقيقة
   * @param {string} apm - صباحاً/مساءً
   * @param {string} days - الأيام
   * @param {string} excludeEventId - معرف الحدث المستبعد
   * @returns {Promise<boolean>} - هل يوجد تضارب
   */
  static async hasScheduleConflict(guildId, channelId, hour, minute, apm, days, excludeEventId = null) {
    try {
      const whereClause = {
        guild_id: guildId,
        event_channel: channelId,
        h: hour,
        m: minute,
        apm: apm,
        days: { [Op.like]: `%${days}%` }
      };

      if (excludeEventId) {
        whereClause.event_id = { [Op.ne]: excludeEventId };
      }

      const conflicts = await Events.findAll({
        where: whereClause,
        limit: 1
      });
      
      return conflicts.length > 0;
    } catch (error) {
      throw new Error(`خطأ في التحقق من تضارب الأحداث: ${error.message}`);
    }
  }

  /**
   * الحصول على أكثر الخوادم نشاطاً
   * @param {number} limit - عدد النتائج
   * @returns {Promise<Array>} - قائمة الخوادم
   */
  static async getMostActiveGuilds(limit = 10) {
    try {
      const result = await Events.findAll({
        attributes: [
          'guild_id',
          [sequelize.fn('COUNT', sequelize.col('event_id')), 'eventCount']
        ],
        group: ['guild_id'],
        order: [[sequelize.fn('COUNT', sequelize.col('event_id')), 'DESC']],
        limit
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أكثر الخوادم نشاطاً: ${error.message}`);
    }
  }

  /**
   * الحصول على توزيع الأحداث بالمدن
   * @returns {Promise<Array>} - توزيع المدن
   */
  static async getCityDistribution() {
    try {
      const result = await Events.findAll({
        attributes: [
          'event_city',
          [sequelize.fn('COUNT', sequelize.col('event_id')), 'eventCount']
        ],
        where: {
          event_city: {
            [Op.ne]: null
          }
        },
        group: ['event_city'],
        order: [[sequelize.fn('COUNT', sequelize.col('event_id')), 'DESC']]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على توزيع المدن: ${error.message}`);
    }
  }

  /**
   * إنشاء أو تحديث حدث (upsert)
   * @param {string} eventId - معرف الحدث
   * @param {Object} eventData - بيانات الحدث
   * @returns {Promise<Object>} - الحدث المنشأ أو المحدث
   */
  static async upsertEvent(eventId, eventData) {
    try {
      const existingEvent = await this.getEventById(eventId);
      
      if (existingEvent) {
        return await this.updateEvent(eventId, {
          TimeStamp: new Date(),
          ...eventData
        });
      } else {
        return await this.createEvent({
          event_id: eventId,
          TimeStamp: new Date(),
          ...eventData
        });
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث الحدث: ${error.message}`);
    }
  }

  /**
   * نسخ حدث
   * @param {string} sourceEventId - معرف الحدث المصدر
   * @param {string} targetEventId - معرف الحدث الهدف
   * @param {Object} overrideData - بيانات للتجاوز
   * @returns {Promise<Object>} - الحدث المنسوخ
   */
  static async copyEvent(sourceEventId, targetEventId, overrideData = {}) {
    try {
      const sourceEvent = await this.getEventById(sourceEventId);
      if (!sourceEvent) {
        throw new Error('الحدث المصدر غير موجود');
      }

      const eventData = {
        guild_id: sourceEvent.guild_id,
        event_name: sourceEvent.event_name,
        event_channel: sourceEvent.event_channel,
        event_city: sourceEvent.event_city,
        event_prizes: sourceEvent.event_prizes,
        duration: sourceEvent.duration,
        h: sourceEvent.h,
        m: sourceEvent.m,
        apm: sourceEvent.apm,
        days: sourceEvent.days,
        ...overrideData
      };

      return await this.upsertEvent(targetEventId, eventData);
    } catch (error) {
      throw new Error(`خطأ في نسخ الحدث: ${error.message}`);
    }
  }

  /**
   * تصدير أحداث الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Array>} - الأحداث المصدرة
   */
  static async exportGuildEvents(guildId) {
    try {
      const events = await this.getEventsByGuildId(guildId);
      return events.map(event => ({
        event_id: event.event_id,
        event_name: event.event_name,
        event_channel: event.event_channel,
        event_city: event.event_city,
        event_prizes: event.event_prizes,
        duration: event.duration,
        h: event.h,
        m: event.m,
        apm: event.apm,
        days: event.days,
        TimeStamp: event.TimeStamp
      }));
    } catch (error) {
      throw new Error(`خطأ في تصدير أحداث الخادم: ${error.message}`);
    }
  }

  /**
   * استيراد أحداث الخادم
   * @param {string} guildId - معرف الخادم
   * @param {Array} events - الأحداث المستوردة
   * @returns {Promise<Array>} - الأحداث المنشأة
   */
  static async importGuildEvents(guildId, events) {
    try {
      const createdEvents = [];
      for (const eventData of events) {
        const event = await this.createGuildEvent(guildId, {
          event_id: eventData.event_id,
          event_name: eventData.event_name,
          event_channel: eventData.event_channel,
          event_city: eventData.event_city,
          event_prizes: eventData.event_prizes,
          duration: eventData.duration,
          h: eventData.h,
          m: eventData.m,
          apm: eventData.apm,
          days: eventData.days
        });
        createdEvents.push(event);
      }
      return createdEvents;
    } catch (error) {
      throw new Error(`خطأ في استيراد أحداث الخادم: ${error.message}`);
    }
  }
}

export default EventsService;