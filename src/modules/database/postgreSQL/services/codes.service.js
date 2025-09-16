import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Codes } from '../models/index.js';
import { Op } from 'sequelize';

class CodesService {
  /**
   * إنشاء رمز جديد
   * @param {Object} codeData - بيانات الرمز
   * @returns {Promise<Object>} - الرمز المنشأ
   */
  static async createCode(codeData) {
    try {
      const result = await PGinsert(Codes, codeData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الرمز: ${error.message}`);
    }
  }

  /**
   * إنشاء رمز للخادم
   * @param {string} code - الرمز
   * @param {string} guildId - معرف الخادم
   * @param {Array|string} users - المستخدمون
   * @param {string} duration - المدة
   * @returns {Promise<Object>} - الرمز المنشأ
   */
  static async createGuildCode(code, guildId, users, duration) {
    try {
      const usersData = typeof users === 'string' ? users : JSON.stringify(users);
      
      const data = {
        code,
        guild_id: guildId,
        users: usersData,
        dur: duration,
        timestamp: new Date()
      };
      
      const result = await PGinsert(Codes, data);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء رمز الخادم: ${error.message}`);
    }
  }

  /**
   * توليد رمز عشوائي
   * @param {number} length - طول الرمز (افتراضي 8)
   * @returns {string} - الرمز المولد
   */
  static generateRandomCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * إنشاء رمز عشوائي للخادم
   * @param {string} guildId - معرف الخادم
   * @param {Array|string} users - المستخدمون
   * @param {string} duration - المدة
   * @param {number} codeLength - طول الرمز
   * @returns {Promise<Object>} - الرمز المنشأ
   */
  static async createRandomGuildCode(guildId, users, duration, codeLength = 8) {
    try {
      let code;
      let attempts = 0;
      const maxAttempts = 10;
      
      // محاولة توليد رمز فريد
      do {
        code = this.generateRandomCode(codeLength);
        attempts++;
        
        if (attempts > maxAttempts) {
          throw new Error('فشل في توليد رمز فريد بعد عدة محاولات');
        }
      } while (await this.existsCode(code));
      
      const result = await this.createGuildCode(code, guildId, users, duration);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء رمز عشوائي للخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع الرموز
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة الرموز
   */
  static async getAllCodes(options = {}) {
    try {
      const defaultOptions = {
        order: [['timestamp', 'DESC']],
        ...options
      };
      
      const result = await Codes.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الرموز: ${error.message}`);
    }
  }

  /**
   * الحصول على رمز بواسطة الرمز
   * @param {string} code - الرمز
   * @returns {Promise<Object|null>} - الرمز أو null
   */
  static async getCodeByCode(code) {
    try {
      const result = await PGselectAll(Codes, { code });
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الرمز: ${error.message}`);
    }
  }

  /**
   * الحصول على الرموز بواسطة معرف الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Array>} - قائمة الرموز
   */
  static async getCodesByGuildId(guildId) {
    try {
      const result = await PGselectAll(Codes, { guild_id: guildId });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على رموز الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على الرموز بواسطة المدة
   * @param {string} duration - المدة
   * @returns {Promise<Array>} - قائمة الرموز
   */
  static async getCodesByDuration(duration) {
    try {
      const result = await PGselectAll(Codes, { dur: duration });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الرموز بواسطة المدة: ${error.message}`);
    }
  }

  /**
   * البحث في المستخدمين
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Promise<Array>} - قائمة الرموز
   */
  static async searchCodesByUsers(searchTerm) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Codes.findAll({
        where: {
          users: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        order: [['timestamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في المستخدمين: ${error.message}`);
    }
  }

  /**
   * الحصول على الرموز بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة الرموز
   */
  static async getCodesByDateRange(startDate, endDate) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Codes.findAll({
        where: {
          timestamp: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['timestamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الرموز بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على أحدث الرموز
   * @param {number} limit - عدد الرموز المطلوب إرجاعها
   * @returns {Promise<Array>} - قائمة الرموز
   */
  static async getRecentCodes(limit = 10) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Codes.findAll({
        order: [['timestamp', 'DESC']],
        limit: limit
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحدث الرموز: ${error.message}`);
    }
  }

  /**
   * الحصول على الرموز المنتهية الصلاحية
   * @param {Date} currentDate - التاريخ الحالي (افتراضي الآن)
   * @returns {Promise<Array>} - قائمة الرموز المنتهية الصلاحية
   */
  static async getExpiredCodes(currentDate = new Date()) {
    try {
      const result = await Codes.findAll();
      
      const expiredCodes = result.filter(code => {
        const expirationDate = this.calculateExpirationDate(code.timestamp, code.dur);
        return expirationDate < currentDate;
      });
      
      return expiredCodes;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الرموز المنتهية الصلاحية: ${error.message}`);
    }
  }

  /**
   * الحصول على الرموز النشطة
   * @param {Date} currentDate - التاريخ الحالي (افتراضي الآن)
   * @returns {Promise<Array>} - قائمة الرموز النشطة
   */
  static async getActiveCodes(currentDate = new Date()) {
    try {
      const result = await Codes.findAll();
      
      const activeCodes = result.filter(code => {
        const expirationDate = this.calculateExpirationDate(code.timestamp, code.dur);
        return expirationDate >= currentDate;
      });
      
      return activeCodes;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الرموز النشطة: ${error.message}`);
    }
  }

  /**
   * الحصول على الرموز التي تنتهي قريباً
   * @param {number} hoursFromNow - عدد الساعات من الآن (افتراضي 24)
   * @returns {Promise<Array>} - قائمة الرموز التي تنتهي قريباً
   */
  static async getCodesExpiringSoon(hoursFromNow = 24) {
    try {
      const currentDate = new Date();
      const futureDate = new Date(currentDate.getTime() + (hoursFromNow * 60 * 60 * 1000));
      
      const result = await Codes.findAll();
      
      const expiringSoonCodes = result.filter(code => {
        const expirationDate = this.calculateExpirationDate(code.timestamp, code.dur);
        return expirationDate >= currentDate && expirationDate <= futureDate;
      });
      
      return expiringSoonCodes;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الرموز التي تنتهي قريباً: ${error.message}`);
    }
  }

  /**
   * تحديث الرمز
   * @param {string} code - الرمز
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - الرمز المحدث
   */
  static async updateCode(code, updateData) {
    try {
      const result = await PGupdate(Codes, updateData, {
        where: { code }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الرمز: ${error.message}`);
    }
  }

  /**
   * تحديث المستخدمين
   * @param {string} code - الرمز
   * @param {Array|string} users - المستخدمون الجدد
   * @returns {Promise<Object>} - الرمز المحدث
   */
  static async updateCodeUsers(code, users) {
    try {
      const usersData = typeof users === 'string' ? users : JSON.stringify(users);
      const result = await PGupdate(Codes, 
        { users: usersData },
        { where: { code } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث مستخدمي الرمز: ${error.message}`);
    }
  }

  /**
   * إضافة مستخدم إلى الرمز
   * @param {string} code - الرمز
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Object>} - الرمز المحدث
   */
  static async addUserToCode(code, userId) {
    try {
      const codeData = await this.getCodeByCode(code);
      
      if (!codeData) {
        throw new Error('الرمز غير موجود');
      }
      
      let users = [];
      try {
        users = JSON.parse(codeData.users || '[]');
      } catch {
        users = [];
      }
      
      if (!users.includes(userId)) {
        users.push(userId);
      }
      
      const result = await this.updateCodeUsers(code, users);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إضافة المستخدم إلى الرمز: ${error.message}`);
    }
  }

  /**
   * إزالة مستخدم من الرمز
   * @param {string} code - الرمز
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Object>} - الرمز المحدث
   */
  static async removeUserFromCode(code, userId) {
    try {
      const codeData = await this.getCodeByCode(code);
      
      if (!codeData) {
        throw new Error('الرمز غير موجود');
      }
      
      let users = [];
      try {
        users = JSON.parse(codeData.users || '[]');
      } catch {
        users = [];
      }
      
      users = users.filter(user => user !== userId);
      
      const result = await this.updateCodeUsers(code, users);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إزالة المستخدم من الرمز: ${error.message}`);
    }
  }

  /**
   * تحديث مدة الرمز
   * @param {string} code - الرمز
   * @param {string} duration - المدة الجديدة
   * @returns {Promise<Object>} - الرمز المحدث
   */
  static async updateCodeDuration(code, duration) {
    try {
      const result = await PGupdate(Codes, 
        { dur: duration },
        { where: { code } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث مدة الرمز: ${error.message}`);
    }
  }

  /**
   * تحديث معرف الخادم
   * @param {string} code - الرمز
   * @param {string} guildId - معرف الخادم الجديد
   * @returns {Promise<Object>} - الرمز المحدث
   */
  static async updateCodeGuildId(code, guildId) {
    try {
      const result = await PGupdate(Codes, 
        { guild_id: guildId },
        { where: { code } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث معرف خادم الرمز: ${error.message}`);
    }
  }

  /**
   * تحديث الطابع الزمني
   * @param {string} code - الرمز
   * @param {Date} timestamp - الطابع الزمني الجديد
   * @returns {Promise<Object>} - الرمز المحدث
   */
  static async updateCodeTimestamp(code, timestamp = new Date()) {
    try {
      const result = await PGupdate(Codes, 
        { timestamp },
        { where: { code } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الطابع الزمني للرمز: ${error.message}`);
    }
  }

  /**
   * تمديد مدة الرمز
   * @param {string} code - الرمز
   * @param {string} additionalDuration - المدة الإضافية
   * @returns {Promise<Object>} - الرمز المحدث
   */
  static async extendCodeDuration(code, additionalDuration) {
    try {
      const codeData = await this.getCodeByCode(code);
      
      if (!codeData) {
        throw new Error('الرمز غير موجود');
      }
      
      const currentDurationMs = this.parseDurationToMs(codeData.dur);
      const additionalDurationMs = this.parseDurationToMs(additionalDuration);
      const newDurationMs = currentDurationMs + additionalDurationMs;
      
      const newDuration = this.formatMsToDuration(newDurationMs);
      
      const result = await this.updateCodeDuration(code, newDuration);
      return result;
    } catch (error) {
      throw new Error(`خطأ في تمديد مدة الرمز: ${error.message}`);
    }
  }

  /**
   * حذف الرمز
   * @param {string} code - الرمز
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteCode(code) {
    try {
      const result = await PGdelete(Codes, {
        where: { code }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الرمز: ${error.message}`);
    }
  }

  /**
   * حذف رموز الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteGuildCodes(guildId) {
    try {
      const result = await PGdelete(Codes, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف رموز الخادم: ${error.message}`);
    }
  }

  /**
   * حذف الرموز المنتهية الصلاحية
   * @param {Date} currentDate - التاريخ الحالي (افتراضي الآن)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteExpiredCodes(currentDate = new Date()) {
    try {
      const expiredCodes = await this.getExpiredCodes(currentDate);
      
      if (expiredCodes.length === 0) {
        return true;
      }
      
      const expiredCodesList = expiredCodes.map(code => code.code);
      
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Codes.destroy({
        where: {
          code: {
            [Op.in]: expiredCodesList
          }
        }
      });
      return result > 0;
    } catch (error) {
      throw new Error(`خطأ في حذف الرموز المنتهية الصلاحية: ${error.message}`);
    }
  }

  /**
   * حذف الرموز القديمة
   * @param {number} daysOld - عدد الأيام (الرموز الأقدم من هذا العدد ستحذف)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteOldCodes(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Codes.destroy({
        where: {
          timestamp: {
            [Op.lt]: cutoffDate
          }
        }
      });
      return result > 0;
    } catch (error) {
      throw new Error(`خطأ في حذف الرموز القديمة: ${error.message}`);
    }
  }

  /**
   * حذف الرموز بواسطة المدة
   * @param {string} duration - المدة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteCodesByDuration(duration) {
    try {
      const result = await PGdelete(Codes, {
        where: { dur: duration }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الرموز بواسطة المدة: ${error.message}`);
    }
  }

  /**
   * حذف جميع الرموز
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAllCodes() {
    try {
      const result = await PGdelete(Codes, {});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع الرموز: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الرموز
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getCodesStats() {
    try {
      const allCodes = await Codes.findAll();
      const totalCodes = allCodes.length;
      
      // حساب الرموز النشطة والمنتهية الصلاحية
      const currentDate = new Date();
      let activeCodes = 0;
      let expiredCodes = 0;
      
      allCodes.forEach(code => {
        const expirationDate = this.calculateExpirationDate(code.timestamp, code.dur);
        if (expirationDate >= currentDate) {
          activeCodes++;
        } else {
          expiredCodes++;
        }
      });
      
      // حساب الخوادم الفريدة
      const uniqueGuilds = new Set(allCodes.map(code => code.guild_id)).size;
      
      // حساب الرموز الحديثة (آخر 7 أيام)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentCodes = allCodes.filter(code => 
        new Date(code.timestamp) > weekAgo
      ).length;
      
      // حساب توزيع المدد
      const durationDistribution = {};
      allCodes.forEach(code => {
        const duration = code.dur;
        durationDistribution[duration] = (durationDistribution[duration] || 0) + 1;
      });
      
      // حساب متوسط عدد المستخدمين لكل رمز
      let totalUsers = 0;
      allCodes.forEach(code => {
        try {
          const users = JSON.parse(code.users || '[]');
          totalUsers += users.length;
        } catch {
          // تجاهل الأخطاء
        }
      });
      const averageUsersPerCode = totalCodes > 0 ? (totalUsers / totalCodes).toFixed(2) : 0;
      
      // حساب متوسط طول الرمز
      const totalCodeLength = allCodes.reduce((sum, code) => sum + code.code.length, 0);
      const averageCodeLength = totalCodes > 0 ? (totalCodeLength / totalCodes).toFixed(2) : 0;
      
      // حساب الرموز التي تنتهي قريباً (خلال 24 ساعة)
      const expiringSoonCodes = await this.getCodesExpiringSoon(24);
      
      return {
        totalCodes,
        activeCodes,
        expiredCodes,
        uniqueGuilds,
        recentCodes,
        expiringSoonCount: expiringSoonCodes.length,
        averageUsersPerCode: parseFloat(averageUsersPerCode),
        averageCodeLength: parseFloat(averageCodeLength),
        totalUsers,
        durationDistribution
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات الرموز: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود الرمز
   * @param {string} code - الرمز
   * @returns {Promise<boolean>} - true إذا كان الرمز موجود
   */
  static async existsCode(code) {
    try {
      const codeData = await this.getCodeByCode(code);
      return codeData !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود الرمز: ${error.message}`);
    }
  }

  /**
   * التحقق من انتهاء صلاحية الرمز
   * @param {string} code - الرمز
   * @param {Date} currentDate - التاريخ الحالي (افتراضي الآن)
   * @returns {Promise<boolean>} - true إذا كان الرمز منتهي الصلاحية
   */
  static async isCodeExpired(code, currentDate = new Date()) {
    try {
      const codeData = await this.getCodeByCode(code);
      
      if (!codeData) {
        throw new Error('الرمز غير موجود');
      }
      
      const expirationDate = this.calculateExpirationDate(codeData.timestamp, codeData.dur);
      return expirationDate < currentDate;
    } catch (error) {
      throw new Error(`خطأ في التحقق من انتهاء صلاحية الرمز: ${error.message}`);
    }
  }

  /**
   * التحقق من نشاط الرمز
   * @param {string} code - الرمز
   * @param {Date} currentDate - التاريخ الحالي (افتراضي الآن)
   * @returns {Promise<boolean>} - true إذا كان الرمز نشط
   */
  static async isCodeActive(code, currentDate = new Date()) {
    try {
      const isExpired = await this.isCodeExpired(code, currentDate);
      return !isExpired;
    } catch (error) {
      throw new Error(`خطأ في التحقق من نشاط الرمز: ${error.message}`);
    }
  }

  /**
   * الحصول على الوقت المتبقي للرمز
   * @param {string} code - الرمز
   * @param {Date} currentDate - التاريخ الحالي (افتراضي الآن)
   * @returns {Promise<number>} - الوقت المتبقي بالميلي ثانية (0 إذا انتهت الصلاحية)
   */
  static async getCodeRemainingTime(code, currentDate = new Date()) {
    try {
      const codeData = await this.getCodeByCode(code);
      
      if (!codeData) {
        throw new Error('الرمز غير موجود');
      }
      
      const expirationDate = this.calculateExpirationDate(codeData.timestamp, codeData.dur);
      const remainingTime = expirationDate.getTime() - currentDate.getTime();
      
      return Math.max(0, remainingTime);
    } catch (error) {
      throw new Error(`خطأ في الحصول على الوقت المتبقي للرمز: ${error.message}`);
    }
  }

  /**
   * عد رموز الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<number>} - عدد الرموز
   */
  static async countGuildCodes(guildId) {
    try {
      const codes = await this.getCodesByGuildId(guildId);
      return codes.length;
    } catch (error) {
      throw new Error(`خطأ في عد رموز الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على قائمة المستخدمين للرمز
   * @param {string} code - الرمز
   * @returns {Promise<Array>} - قائمة المستخدمين
   */
  static async getCodeUsers(code) {
    try {
      const codeData = await this.getCodeByCode(code);
      
      if (!codeData) {
        throw new Error('الرمز غير موجود');
      }
      
      try {
        const users = JSON.parse(codeData.users || '[]');
        return users;
      } catch {
        return [];
      }
    } catch (error) {
      throw new Error(`خطأ في الحصول على مستخدمي الرمز: ${error.message}`);
    }
  }

  /**
   * عد مستخدمي الرمز
   * @param {string} code - الرمز
   * @returns {Promise<number>} - عدد المستخدمين
   */
  static async countCodeUsers(code) {
    try {
      const users = await this.getCodeUsers(code);
      return users.length;
    } catch (error) {
      throw new Error(`خطأ في عد مستخدمي الرمز: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود المستخدم في الرمز
   * @param {string} code - الرمز
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<boolean>} - true إذا كان المستخدم موجود
   */
  static async isUserInCode(code, userId) {
    try {
      const users = await this.getCodeUsers(code);
      return users.includes(userId);
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود المستخدم في الرمز: ${error.message}`);
    }
  }

  /**
   * حساب تاريخ انتهاء الصلاحية
   * @param {Date} timestamp - الطابع الزمني
   * @param {string} duration - المدة
   * @returns {Date} - تاريخ انتهاء الصلاحية
   */
  static calculateExpirationDate(timestamp, duration) {
    const durationMs = this.parseDurationToMs(duration);
    return new Date(new Date(timestamp).getTime() + durationMs);
  }

  /**
   * تحويل المدة إلى ميلي ثانية
   * @param {string} duration - المدة (مثل: 1h, 30m, 1d)
   * @returns {number} - المدة بالميلي ثانية
   */
  static parseDurationToMs(duration) {
    const match = duration.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      throw new Error('تنسيق المدة غير صحيح');
    }
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: throw new Error('وحدة المدة غير مدعومة');
    }
  }

  /**
   * تحويل الميلي ثانية إلى تنسيق المدة
   * @param {number} ms - الميلي ثانية
   * @returns {string} - المدة بالتنسيق المطلوب
   */
  static formatMsToDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * إنشاء أو تحديث الرمز
   * @param {string} code - الرمز
   * @param {Object} codeData - بيانات الرمز
   * @returns {Promise<Object>} - الرمز المنشأ أو المحدث
   */
  static async upsertCode(code, codeData) {
    try {
      const existingCode = await this.getCodeByCode(code);
      
      if (existingCode) {
        // تحديث الرمز الموجود
        const result = await this.updateCode(code, codeData);
        return result;
      } else {
        // إنشاء رمز جديد
        const data = {
          code,
          ...codeData
        };
        const result = await this.createCode(data);
        return result;
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث الرمز: ${error.message}`);
    }
  }

  /**
   * نسخ الرمز
   * @param {string} sourceCode - الرمز المصدر
   * @param {string} targetCode - الرمز الهدف
   * @returns {Promise<Object>} - الرمز المنسوخ
   */
  static async copyCode(sourceCode, targetCode) {
    try {
      const sourceCodeData = await this.getCodeByCode(sourceCode);
      
      if (!sourceCodeData) {
        throw new Error('الرمز المصدر غير موجود');
      }
      
      const codeData = {
        guild_id: sourceCodeData.guild_id,
        users: sourceCodeData.users,
        dur: sourceCodeData.dur,
        timestamp: new Date()
      };
      
      const result = await this.upsertCode(targetCode, codeData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في نسخ الرمز: ${error.message}`);
    }
  }

  /**
   * تصدير رموز الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Array>} - قائمة الرموز المصدرة
   */
  static async exportGuildCodes(guildId) {
    try {
      const codes = await this.getCodesByGuildId(guildId);
      
      const exportedCodes = codes.map(code => ({
        code: code.code,
        users: code.users,
        duration: code.dur,
        timestamp: code.timestamp,
        isActive: this.calculateExpirationDate(code.timestamp, code.dur) >= new Date()
      }));
      
      return exportedCodes;
    } catch (error) {
      throw new Error(`خطأ في تصدير رموز الخادم: ${error.message}`);
    }
  }

  /**
   * استيراد رموز الخادم
   * @param {string} guildId - معرف الخادم
   * @param {Array} codesData - بيانات الرموز المراد استيرادها
   * @returns {Promise<Array>} - قائمة الرموز المستوردة
   */
  static async importGuildCodes(guildId, codesData) {
    try {
      const importedCodes = [];
      
      for (const codeData of codesData) {
        try {
          const data = {
            code: codeData.code,
            guild_id: guildId,
            users: codeData.users,
            dur: codeData.duration,
            timestamp: codeData.timestamp || new Date()
          };
          
          const result = await this.upsertCode(codeData.code, data);
          importedCodes.push(result);
        } catch (error) {
          console.error(`خطأ في استيراد الرمز ${codeData.code}:`, error.message);
        }
      }
      
      return importedCodes;
    } catch (error) {
      throw new Error(`خطأ في استيراد رموز الخادم: ${error.message}`);
    }
  }
}

export default CodesService;