import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { VerifyDur } from '../models/index.js';
import { Op } from 'sequelize';

class VerifyDurService {
  /**
   * إنشاء سجل مدة تحقق جديد
   * @param {Object} verifyDurData - بيانات مدة التحقق
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createVerifyDur(verifyDurData) {
    try {
      const result = await PGinsert(VerifyDur, verifyDurData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل مدة التحقق: ${error.message}`);
    }
  }

  /**
   * إنشاء سجل مدة تحقق للمستخدم في خادم معين
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {string} duration - مدة التحقق (افتراضي: '1h')
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createUserVerifyDur(userId, guildId, duration = '1h') {
    try {
      const data = {
        userId,
        guild_id: guildId,
        duration,
        TimeStamp: new Date()
      };
      
      console.log("\n!#############! data : ", data, "\n\n");
      const result = await PGinsert(VerifyDur, data);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل مدة تحقق المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع سجلات مدة التحقق
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAllVerifyDur(options = {}) {
    try {
      const defaultOptions = {
        order: [['TimeStamp', 'DESC']],
        ...options
      };
      
      const result = await VerifyDur.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات مدة التحقق: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل مدة التحقق بواسطة المعرف
   * @param {number} id - معرف السجل
   * @returns {Promise<Object|null>} - السجل أو null
   */
  static async getVerifyDurById(id) {
    try {
      const result = await PGselectAll(VerifyDur, { id });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجل مدة التحقق: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل مدة التحقق بواسطة معرف المستخدم ومعرف الخادم
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object|null>} - السجل أو null
   */
  static async getVerifyDurByUserAndGuild(userId, guildId) {
    try {
      const results = await PGselectAll(VerifyDur, { userId });
      const filtered = results.find(item => item.guild_id === guildId);
      return filtered || null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجل مدة التحقق للمستخدم والخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع سجلات مدة التحقق للمستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getVerifyDurByUserId(userId) {
    try {
      const result = await PGselectAll(VerifyDur, { userId });
      return result.sort((a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp));
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات مدة التحقق للمستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع سجلات مدة التحقق للخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getVerifyDurByGuildId(guildId) {
    try {
      const result = await PGselectAll(VerifyDur, { guild_id: guildId });
      return result.sort((a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp));
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات مدة التحقق للخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات مدة التحقق بواسطة المدة
   * @param {string} duration - مدة التحقق
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getVerifyDurByDuration(duration) {
    try {
      const result = await PGselectAll(VerifyDur, { duration });
      return result.sort((a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp));
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات مدة التحقق بواسطة المدة: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات مدة التحقق بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getVerifyDurByDateRange(startDate, endDate) {
    try {
      const result = await VerifyDur.findAll({
        where: {
          TimeStamp: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات مدة التحقق بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على أحدث سجلات مدة التحقق
   * @param {number} limit - عدد السجلات المطلوب إرجاعها
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getRecentVerifyDur(limit = 10) {
    try {
      const result = await VerifyDur.findAll({
        order: [['TimeStamp', 'DESC']],
        limit: limit
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحدث سجلات مدة التحقق: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات مدة التحقق المنتهية الصلاحية
   * @param {Date} currentTime - الوقت الحالي (افتراضي: الآن)
   * @returns {Promise<Array>} - قائمة السجلات المنتهية الصلاحية
   */
  static async getExpiredVerifyDur(currentTime = new Date()) {
    try {
      const result = await VerifyDur.findAll({
        where: {
          TimeStamp: {
            [Op.lt]: currentTime
          }
        },
        order: [['TimeStamp', 'ASC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات مدة التحقق المنتهية الصلاحية: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات مدة التحقق النشطة
   * @param {Date} currentTime - الوقت الحالي (افتراضي: الآن)
   * @returns {Promise<Array>} - قائمة السجلات النشطة
   */
  static async getActiveVerifyDur(currentTime = new Date()) {
    try {
      const result = await VerifyDur.findAll({
        where: {
          TimeStamp: {
            [Op.gte]: currentTime
          }
        },
        order: [['TimeStamp', 'ASC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات مدة التحقق النشطة: ${error.message}`);
    }
  }

  /**
   * تحديث سجل مدة التحقق
   * @param {number} id - معرف السجل
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateVerifyDur(id, updateData) {
    try {
      const result = await PGupdate(VerifyDur, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث سجل مدة التحقق: ${error.message}`);
    }
  }

  /**
   * تحديث مدة التحقق للمستخدم في خادم معين
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {string} newDuration - المدة الجديدة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateUserVerifyDuration(userId, guildId, newDuration) {
    try {
      const result = await PGupdate(VerifyDur, 
        { duration: newDuration },
        {
          where: {
            userId,
            guild_id: guildId
          }
        }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث مدة التحقق للمستخدم: ${error.message}`);
    }
  }

  /**
   * تحديث الطابع الزمني لسجل مدة التحقق
   * @param {number} id - معرف السجل
   * @param {Date} newTimeStamp - الطابع الزمني الجديد
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateVerifyDurTimeStamp(id, newTimeStamp = new Date()) {
    try {
      const result = await PGupdate(VerifyDur, 
        { TimeStamp: newTimeStamp },
        { where: { id } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الطابع الزمني لسجل مدة التحقق: ${error.message}`);
    }
  }

  /**
   * تحديث مدة التحقق والطابع الزمني
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {string} newDuration - المدة الجديدة
   * @param {Date} newTimeStamp - الطابع الزمني الجديد
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateUserVerifyDurAndTime(userId, guildId, newDuration, newTimeStamp = new Date()) {
    try {
      const result = await PGupdate(VerifyDur, 
        { 
          duration: newDuration,
          TimeStamp: newTimeStamp
        },
        {
          where: {
            userId,
            guild_id: guildId
          }
        }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث مدة التحقق والطابع الزمني: ${error.message}`);
    }
  }

  /**
   * تمديد مدة التحقق للمستخدم
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {number} extensionHours - عدد الساعات للتمديد
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async extendVerifyDuration(userId, guildId, extensionHours) {
    try {
      const existingRecord = await this.getVerifyDurByUserAndGuild(userId, guildId);
      
      if (!existingRecord) {
        throw new Error('سجل مدة التحقق غير موجود');
      }
      
      const currentTimeStamp = new Date(existingRecord.TimeStamp);
      const newTimeStamp = new Date(currentTimeStamp.getTime() + (extensionHours * 60 * 60 * 1000));
      
      const result = await this.updateVerifyDurTimeStamp(existingRecord.id, newTimeStamp);
      return result;
    } catch (error) {
      throw new Error(`خطأ في تمديد مدة التحقق: ${error.message}`);
    }
  }

  /**
   * حذف سجل مدة التحقق
   * @param {number} id - معرف السجل
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteVerifyDur(id) {
    try {
      const result = await PGdelete(VerifyDur, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجل مدة التحقق: ${error.message}`);
    }
  }

  /**
   * حذف سجل مدة التحقق للمستخدم في خادم معين
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteUserVerifyDur(userId, guildId) {
    try {
      const result = await PGdelete(VerifyDur, {
        where: {
          userId,
          guild_id: guildId
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجل مدة التحقق للمستخدم: ${error.message}`);
    }
  }

  /**
   * حذف جميع سجلات مدة التحقق للمستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAllUserVerifyDur(userId) {
    try {
      const result = await PGdelete(VerifyDur, {
        where: { userId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع سجلات مدة التحقق للمستخدم: ${error.message}`);
    }
  }

  /**
   * حذف جميع سجلات مدة التحقق للخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAllGuildVerifyDur(guildId) {
    try {
      const result = await PGdelete(VerifyDur, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع سجلات مدة التحقق للخادم: ${error.message}`);
    }
  }

  /**
   * حذف السجلات المنتهية الصلاحية
   * @param {Date} currentTime - الوقت الحالي (افتراضي: الآن)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteExpiredVerifyDur(currentTime = new Date()) {
    try {
      const result = await PGdelete(VerifyDur, {
        where: {
          TimeStamp: {
            [Op.lt]: currentTime
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف السجلات المنتهية الصلاحية: ${error.message}`);
    }
  }

  /**
   * حذف السجلات القديمة
   * @param {number} daysOld - عدد الأيام (السجلات الأقدم من هذا العدد ستحذف)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteOldVerifyDur(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await PGdelete(VerifyDur, {
        where: {
          TimeStamp: {
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
   * حذف سجلات مدة التحقق بواسطة المدة
   * @param {string} duration - مدة التحقق
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteVerifyDurByDuration(duration) {
    try {
      const result = await PGdelete(VerifyDur, {
        where: { duration }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات مدة التحقق بواسطة المدة: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات مدة التحقق
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getVerifyDurStats() {
    try {
      const allRecords = await VerifyDur.findAll();
      const totalRecords = allRecords.length;
      
      // حساب توزيع المدد
      const durationDistribution = {};
      allRecords.forEach(record => {
        durationDistribution[record.duration] = (durationDistribution[record.duration] || 0) + 1;
      });
      
      // حساب السجلات النشطة والمنتهية الصلاحية
      const currentTime = new Date();
      const activeRecords = allRecords.filter(record => new Date(record.TimeStamp) >= currentTime).length;
      const expiredRecords = totalRecords - activeRecords;
      
      // حساب عدد المستخدمين والخوادم الفريدة
      const uniqueUsers = new Set(allRecords.map(record => record.userId)).size;
      const uniqueGuilds = new Set(allRecords.map(record => record.guild_id)).size;
      
      // حساب السجلات الحديثة (آخر 24 ساعة)
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      const recentRecords = allRecords.filter(record => new Date(record.TimeStamp) > dayAgo).length;

      return {
        totalRecords,
        activeRecords,
        expiredRecords,
        uniqueUsers,
        uniqueGuilds,
        recentRecords,
        durationDistribution
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات مدة التحقق: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود سجل مدة التحقق
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - true إذا كان السجل موجود
   */
  static async existsVerifyDur(userId, guildId) {
    try {
      const record = await this.getVerifyDurByUserAndGuild(userId, guildId);
      return record !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود سجل مدة التحقق: ${error.message}`);
    }
  }

  /**
   * التحقق من انتهاء صلاحية مدة التحقق
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {Date} currentTime - الوقت الحالي (افتراضي: الآن)
   * @returns {Promise<boolean>} - true إذا كانت منتهية الصلاحية
   */
  static async isVerifyDurExpired(userId, guildId, currentTime = new Date()) {
    try {
      const record = await this.getVerifyDurByUserAndGuild(userId, guildId);
      
      if (!record) {
        return true; // إذا لم يكن هناك سجل، فهو منتهي الصلاحية
      }
      
      return new Date(record.TimeStamp) < currentTime;
    } catch (error) {
      throw new Error(`خطأ في التحقق من انتهاء صلاحية مدة التحقق: ${error.message}`);
    }
  }

  /**
   * الحصول على الوقت المتبقي لانتهاء مدة التحقق
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {Date} currentTime - الوقت الحالي (افتراضي: الآن)
   * @returns {Promise<number|null>} - الوقت المتبقي بالميلي ثانية أو null
   */
  static async getRemainingVerifyTime(userId, guildId, currentTime = new Date()) {
    try {
      const record = await this.getVerifyDurByUserAndGuild(userId, guildId);
      
      if (!record) {
        return null;
      }
      
      const timeStamp = new Date(record.TimeStamp);
      const remainingTime = timeStamp.getTime() - currentTime.getTime();
      
      return remainingTime > 0 ? remainingTime : 0;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الوقت المتبقي لمدة التحقق: ${error.message}`);
    }
  }

  /**
   * تحويل مدة التحقق إلى ميلي ثانية
   * @param {string} duration - مدة التحقق (مثل: '1h', '30m', '2d')
   * @returns {number} - المدة بالميلي ثانية
   * @private
   */
  static parseDurationToMs(duration) {
    const match = duration.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      throw new Error('تنسيق مدة التحقق غير صحيح');
    }
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value * 1000; // ثواني
      case 'm': return value * 60 * 1000; // دقائق
      case 'h': return value * 60 * 60 * 1000; // ساعات
      case 'd': return value * 24 * 60 * 60 * 1000; // أيام
      default: throw new Error('وحدة زمنية غير مدعومة');
    }
  }

  /**
   * إنشاء أو تحديث سجل مدة التحقق
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {string} duration - مدة التحقق
   * @returns {Promise<Object>} - السجل المنشأ أو المحدث
   */
  static async upsertVerifyDur(userId, guildId, duration = '1h') {
    try {
      const existingRecord = await this.getVerifyDurByUserAndGuild(userId, guildId);
      
      if (existingRecord) {
        // تحديث السجل الموجود
        const result = await this.updateUserVerifyDurAndTime(userId, guildId, duration);
        return result;
      } else {
        // إنشاء سجل جديد
        const result = await this.createUserVerifyDur(userId, guildId, duration);
        return result;
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث سجل مدة التحقق: ${error.message}`);
    }
  }
}

export default VerifyDurService;