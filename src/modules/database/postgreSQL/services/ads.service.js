import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Ads } from '../models/index.js';
import { Op } from 'sequelize';

class AdsService {
  /**
   * إنشاء إعلان جديد
   * @param {Object} adData - بيانات الإعلان
   * @returns {Promise<Object>} - الإعلان المنشأ
   */
  static async createAd(adData) {
    try {
      const result = await PGinsert(Ads, adData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الإعلان: ${error.message}`);
    }
  }

  /**
   * إنشاء إعلان جديد مع البيانات الأساسية
   * @param {string} adId - معرف الإعلان
   * @param {string} guildId - معرف الخادم
   * @param {string} adName - اسم الإعلان
   * @param {string} adChannel - قناة الإعلان
   * @param {string} adText - نص الإعلان
   * @param {Object} scheduleData - بيانات الجدولة (اختياري)
   * @returns {Promise<Object>} - الإعلان المنشأ
   */
  static async createScheduledAd(adId, guildId, adName, adChannel, adText, scheduleData = {}) {
    try {
      const data = {
        ad_id: adId,
        guild_id: guildId,
        ad_name: adName,
        ad_channel: adChannel,
        ad_text: adText,
        ad_timezone: scheduleData.timezone || 0,
        ad_city: scheduleData.city || null,
        ad_time_dir: scheduleData.timeDir || null,
        d: scheduleData.day || null,
        h: scheduleData.hour || null,
        m: scheduleData.minute || null,
        apm: scheduleData.apm || null,
        repeat: scheduleData.repeat || false,
        days: scheduleData.days || null,
        TimeStamp: new Date()
      };
      
      const result = await PGinsert(Ads, data);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الإعلان المجدول: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع الإعلانات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAllAds(options = {}) {
    try {
      const defaultOptions = {
        order: [['TimeStamp', 'DESC']],
        ...options
      };
      
      const result = await Ads.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلانات: ${error.message}`);
    }
  }

  /**
   * الحصول على إعلان بواسطة المعرف
   * @param {string} adId - معرف الإعلان
   * @returns {Promise<Object|null>} - الإعلان أو null
   */
  static async getAdById(adId) {
    try {
      const result = await PGselectAll(Ads, {ad_id: adId});
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلان: ${error.message}`);
    }
  }

  /**
   * الحصول على إعلانات الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAdsByGuildId(guildId) {
    try {
      const result = await PGselectAll(Ads, {guild_id: guildId});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على إعلانات الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات بواسطة القناة
   * @param {string} channelId - معرف القناة
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAdsByChannel(channelId) {
    try {
      const result = await PGselectAll(Ads, {ad_channel: channelId});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على إعلانات القناة: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات بواسطة اسم الإعلان
   * @param {string} adName - اسم الإعلان
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAdsByName(adName) {
    try {
      const result = await PGselectAll(Ads, {ad_name: `%${adName}%`, Op: Op.like});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلانات بواسطة الاسم: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات بواسطة المدينة
   * @param {string} city - المدينة
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAdsByCity(city) {
    try {
      const result = await PGselectAll(Ads, {ad_city: city});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلانات بواسطة المدينة: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات بواسطة المنطقة الزمنية
   * @param {number} timezone - المنطقة الزمنية
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAdsByTimezone(timezone) {
    try {
      const result = await PGselectAll(Ads, {ad_timezone: timezone});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلانات بواسطة المنطقة الزمنية: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات المتكررة
   * @param {boolean} isRepeating - هل الإعلان متكرر
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAdsByRepeat(isRepeating = true) {
    try {
      const result = await PGselectAll(Ads, {repeat: isRepeating});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلانات المتكررة: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات بواسطة الوقت
   * @param {string} hour - الساعة
   * @param {string} minute - الدقيقة
   * @param {string} apm - صباحاً/مساءً
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAdsByTime(hour, minute = null, apm = null) {
    try {
      const whereClause = { h: hour };
      
      if (minute !== null) {
        whereClause.m = minute;
      }
      
      if (apm !== null) {
        whereClause.apm = apm;
      }
      
      const result = await Ads.findAll({
        where: whereClause,
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلانات بواسطة الوقت: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات بواسطة اليوم
   * @param {string} day - اليوم
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAdsByDay(day) {
    try {
      const result = await Ads.findAll({
        where: {
          [Op.or]: [
            { d: day },
            {
              days: {
                [Op.like]: `%${day}%`
              }
            }
          ]
        },
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلانات بواسطة اليوم: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getAdsByDateRange(startDate, endDate) {
    try {
      const result = await PGselectAll(Ads, {TimeStamp: [startDate, endDate], Op: Op.between});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلانات بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * البحث في نص الإعلانات
   * @param {string} searchText - النص المراد البحث عنه
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async searchAdsText(searchText) {
    try {
      const result = await PGselectAll(Ads, {ad_text: `%${searchText}%`, Op: Op.like});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في نص الإعلانات: ${error.message}`);
    }
  }

  /**
   * الحصول على أحدث الإعلانات
   * @param {number} limit - عدد الإعلانات المطلوب إرجاعها
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getRecentAds(limit = 10) {
    try {
      const result = await Ads.findAll({
        order: [['TimeStamp', 'DESC']],
        limit: limit
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحدث الإعلانات: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات المجدولة لليوم الحالي
   * @param {number} timezone - المنطقة الزمنية (افتراضي: 0)
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  static async getTodayScheduledAds(timezone = 0) {
    try {
      const today = new Date();
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      const result = await Ads.findAll({
        where: {
          [Op.and]: [
            { ad_timezone: timezone },
            {
              [Op.or]: [
                { d: dayName },
                {
                  days: {
                    [Op.like]: `%${dayName}%`
                  }
                },
                { repeat: true }
              ]
            }
          ]
        },
        order: [['h', 'ASC'], ['m', 'ASC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الإعلانات المجدولة لليوم: ${error.message}`);
    }
  }

  /**
   * تحديث الإعلان
   * @param {string} adId - معرف الإعلان
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - الإعلان المحدث
   */
  static async updateAd(adId, updateData) {
    try {
      const result = await PGupdate(Ads, updateData, {
        where: { ad_id: adId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الإعلان: ${error.message}`);
    }
  }

  /**
   * تحديث نص الإعلان
   * @param {string} adId - معرف الإعلان
   * @param {string} newText - النص الجديد
   * @returns {Promise<Object>} - الإعلان المحدث
   */
  static async updateAdText(adId, newText) {
    try {
      const result = await PGupdate(Ads, 
        { ad_text: newText },
        { where: { ad_id: adId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث نص الإعلان: ${error.message}`);
    }
  }

  /**
   * تحديث قناة الإعلان
   * @param {string} adId - معرف الإعلان
   * @param {string} newChannel - القناة الجديدة
   * @returns {Promise<Object>} - الإعلان المحدث
   */
  static async updateAdChannel(adId, newChannel) {
    try {
      const result = await PGupdate(Ads, 
        { ad_channel: newChannel },
        { where: { ad_id: adId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث قناة الإعلان: ${error.message}`);
    }
  }

  /**
   * تحديث اسم الإعلان
   * @param {string} adId - معرف الإعلان
   * @param {string} newName - الاسم الجديد
   * @returns {Promise<Object>} - الإعلان المحدث
   */
  static async updateAdName(adId, newName) {
    try {
      const result = await PGupdate(Ads, 
        { ad_name: newName },
        { where: { ad_id: adId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث اسم الإعلان: ${error.message}`);
    }
  }

  /**
   * تحديث جدولة الإعلان
   * @param {string} adId - معرف الإعلان
   * @param {Object} scheduleData - بيانات الجدولة الجديدة
   * @returns {Promise<Object>} - الإعلان المحدث
   */
  static async updateAdSchedule(adId, scheduleData) {
    try {
      const updateData = {
        ad_timezone: scheduleData.timezone,
        ad_city: scheduleData.city,
        ad_time_dir: scheduleData.timeDir,
        d: scheduleData.day,
        h: scheduleData.hour,
        m: scheduleData.minute,
        apm: scheduleData.apm,
        repeat: scheduleData.repeat,
        days: scheduleData.days
      };
      
      // إزالة القيم undefined
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      
      const result = await PGupdate(Ads, updateData, {
        where: { ad_id: adId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث جدولة الإعلان: ${error.message}`);
    }
  }

  /**
   * تحديث المنطقة الزمنية للإعلان
   * @param {string} adId - معرف الإعلان
   * @param {number} timezone - المنطقة الزمنية الجديدة
   * @returns {Promise<Object>} - الإعلان المحدث
   */
  static async updateAdTimezone(adId, timezone) {
    try {
      const result = await PGupdate(Ads, 
        { ad_timezone: timezone },
        { where: { ad_id: adId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المنطقة الزمنية للإعلان: ${error.message}`);
    }
  }

  /**
   * تبديل حالة التكرار للإعلان
   * @param {string} adId - معرف الإعلان
   * @returns {Promise<Object>} - الإعلان المحدث
   */
  static async toggleAdRepeat(adId) {
    try {
      const existingAd = await this.getAdById(adId);
      
      if (!existingAd) {
        throw new Error('الإعلان غير موجود');
      }
      
      const newRepeatStatus = !existingAd.repeat;
      const result = await PGupdate(Ads, 
        { repeat: newRepeatStatus },
        { where: { ad_id: adId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تبديل حالة التكرار للإعلان: ${error.message}`);
    }
  }

  /**
   * تحديث الطابع الزمني للإعلان
   * @param {string} adId - معرف الإعلان
   * @param {Date} newTimeStamp - الطابع الزمني الجديد
   * @returns {Promise<Object>} - الإعلان المحدث
   */
  static async updateAdTimeStamp(adId, newTimeStamp = new Date()) {
    try {
      const result = await PGupdate(Ads, 
        { TimeStamp: newTimeStamp },
        { where: { ad_id: adId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الطابع الزمني للإعلان: ${error.message}`);
    }
  }

  /**
   * حذف الإعلان
   * @param {string} adId - معرف الإعلان
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAd(adId) {
    try {
      const result = await PGdelete(Ads, {
        where: { ad_id: adId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الإعلان: ${error.message}`);
    }
  }

  /**
   * حذف جميع إعلانات الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteGuildAds(guildId) {
    try {
      const result = await PGdelete(Ads, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعلانات الخادم: ${error.message}`);
    }
  }

  /**
   * حذف الإعلانات بواسطة القناة
   * @param {string} channelId - معرف القناة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAdsByChannel(channelId) {
    try {
      const result = await PGdelete(Ads, {
        where: { ad_channel: channelId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعلانات القناة: ${error.message}`);
    }
  }

  /**
   * حذف الإعلانات غير المتكررة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteNonRepeatingAds() {
    try {
      const result = await PGdelete(Ads, {
        where: {
          [Op.or]: [
            { repeat: false },
            { repeat: null }
          ]
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الإعلانات غير المتكررة: ${error.message}`);
    }
  }

  /**
   * حذف الإعلانات القديمة
   * @param {number} daysOld - عدد الأيام (الإعلانات الأقدم من هذا العدد ستحذف)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteOldAds(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await PGdelete(Ads, {
        where: {
          TimeStamp: {
            [Op.lt]: cutoffDate
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الإعلانات القديمة: ${error.message}`);
    }
  }

  /**
   * حذف الإعلانات بواسطة المدينة
   * @param {string} city - المدينة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAdsByCity(city) {
    try {
      const result = await PGdelete(Ads, {
        where: { ad_city: city }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الإعلانات بواسطة المدينة: ${error.message}`);
    }
  }

  /**
   * حذف جميع الإعلانات
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAllAds() {
    try {
      const result = await PGdelete(Ads, {});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع الإعلانات: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الإعلانات
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getAdsStats() {
    try {
      const allAds = await Ads.findAll({});
      const totalAds = allAds.length;
      
      // حساب الإعلانات المتكررة
      const repeatingAds = allAds.filter(ad => ad.repeat).length;
      const nonRepeatingAds = totalAds - repeatingAds;
      
      // حساب توزيع المناطق الزمنية
      const timezoneDistribution = {};
      allAds.forEach(ad => {
        const tz = ad.ad_timezone || 0;
        timezoneDistribution[tz] = (timezoneDistribution[tz] || 0) + 1;
      });
      
      // حساب عدد الخوادم الفريدة
      const uniqueGuilds = new Set(allAds.map(ad => ad.guild_id)).size;
      
      // حساب عدد القنوات الفريدة
      const uniqueChannels = new Set(
        allAds.filter(ad => ad.ad_channel).map(ad => ad.ad_channel)
      ).size;
      
      // حساب الإعلانات الحديثة (آخر 7 أيام)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentAds = allAds.filter(ad => new Date(ad.TimeStamp) > weekAgo).length;
      
      // حساب توزيع المدن
      const cityDistribution = {};
      allAds.forEach(ad => {
        if (ad.ad_city) {
          cityDistribution[ad.ad_city] = (cityDistribution[ad.ad_city] || 0) + 1;
        }
      });
      
      // حساب متوسط طول النص
      const adsWithText = allAds.filter(ad => ad.ad_text);
      const averageTextLength = adsWithText.length > 0 ? 
        (adsWithText.reduce((sum, ad) => sum + ad.ad_text.length, 0) / adsWithText.length).toFixed(2) : 0;

      return {
        totalAds,
        repeatingAds,
        nonRepeatingAds,
        uniqueGuilds,
        uniqueChannels,
        recentAds,
        averageTextLength: parseFloat(averageTextLength),
        timezoneDistribution,
        cityDistribution,
        adsWithText: adsWithText.length,
        adsWithoutText: totalAds - adsWithText.length
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات الإعلانات: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود الإعلان
   * @param {string} adId - معرف الإعلان
   * @returns {Promise<boolean>} - true إذا كان الإعلان موجود
   */
  static async existsAd(adId) {
    try {
      const ad = await this.getAdById(adId);
      return ad !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود الإعلان: ${error.message}`);
    }
  }

  /**
   * عد إعلانات الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<number>} - عدد الإعلانات
   */
  static async countGuildAds(guildId) {
    try {
      const ads = await this.getAdsByGuildId(guildId);
      return ads.length;
    } catch (error) {
      throw new Error(`خطأ في عد إعلانات الخادم: ${error.message}`);
    }
  }

  /**
   * عد إعلانات القناة
   * @param {string} channelId - معرف القناة
   * @returns {Promise<number>} - عدد الإعلانات
   */
  static async countChannelAds(channelId) {
    try {
      const ads = await this.getAdsByChannel(channelId);
      return ads.length;
    } catch (error) {
      throw new Error(`خطأ في عد إعلانات القناة: ${error.message}`);
    }
  }

  /**
   * التحقق من تضارب الجدولة
   * @param {string} guildId - معرف الخادم
   * @param {string} channelId - معرف القناة
   * @param {string} hour - الساعة
   * @param {string} minute - الدقيقة
   * @param {string} day - اليوم (اختياري)
   * @returns {Promise<Array>} - قائمة الإعلانات المتضاربة
   */
  static async checkScheduleConflict(guildId, channelId, hour, minute, day = null) {
    try {
      const whereClause = {
        guild_id: guildId,
        ad_channel: channelId,
        h: hour,
        m: minute
      };
      
      if (day) {
        whereClause[Op.or] = [
          { d: day },
          {
            days: {
              [Op.like]: `%${day}%`
            }
          },
          { repeat: true }
        ];
      }
      
      const result = await Ads.findAll({
        where: whereClause,
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في التحقق من تضارب الجدولة: ${error.message}`);
    }
  }

  /**
   * إنشاء أو تحديث الإعلان
   * @param {string} adId - معرف الإعلان
   * @param {Object} adData - بيانات الإعلان
   * @returns {Promise<Object>} - الإعلان المنشأ أو المحدث
   */
  static async upsertAd(adId, adData) {
    try {
      const existingAd = await this.getAdById(adId);
      
      if (existingAd) {
        // تحديث الإعلان الموجود
        const result = await this.updateAd(adId, adData);
        return result;
      } else {
        // إنشاء إعلان جديد
        const data = {
          ad_id: adId,
          ...adData
        };
        const result = await this.createAd(data);
        return result;
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث الإعلان: ${error.message}`);
    }
  }

  /**
   * نسخ الإعلان
   * @param {string} sourceAdId - معرف الإعلان المصدر
   * @param {string} newAdId - معرف الإعلان الجديد
   * @param {Object} overrideData - بيانات للتعديل (اختياري)
   * @returns {Promise<Object>} - الإعلان المنسوخ
   */
  static async copyAd(sourceAdId, newAdId, overrideData = {}) {
    try {
      const sourceAd = await this.getAdById(sourceAdId);
      
      if (!sourceAd) {
        throw new Error('الإعلان المصدر غير موجود');
      }
      
      // إنشاء بيانات الإعلان الجديد
      const newAdData = {
        ad_id: newAdId,
        guild_id: sourceAd.guild_id,
        ad_name: sourceAd.ad_name,
        ad_channel: sourceAd.ad_channel,
        ad_timezone: sourceAd.ad_timezone,
        ad_city: sourceAd.ad_city,
        ad_text: sourceAd.ad_text,
        ad_time_dir: sourceAd.ad_time_dir,
        d: sourceAd.d,
        h: sourceAd.h,
        m: sourceAd.m,
        apm: sourceAd.apm,
        repeat: sourceAd.repeat,
        days: sourceAd.days,
        TimeStamp: new Date(),
        ...overrideData
      };
      
      const result = await this.createAd(newAdData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في نسخ الإعلان: ${error.message}`);
    }
  }
}

export default AdsService;