import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Admins } from '../models/index.js';
import { Op } from 'sequelize';

class AdminsService {
  /**
   * إنشاء سجل مشرفين جديد للخادم
   * @param {Object} adminsData - بيانات المشرفين
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createAdmins(adminsData) {
    try {
      const result = await PGinsert(Admins, adminsData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل المشرفين: ${error.message}`);
    }
  }

  /**
   * إنشاء سجل مشرفين للخادم مع الإعدادات الافتراضية
   * @param {string} guildId - معرف الخادم
   * @param {string} adminsId - معرفات المشرفين (اختياري)
   * @param {boolean} maxKb - إعداد الحد الأقصى للكيبورد (افتراضي: false)
   * @param {boolean} blacklistKb - إعداد كيبورد القائمة السوداء (افتراضي: false)
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createGuildAdmins(guildId, adminsId = null, maxKb = false, blacklistKb = false) {
    try {
      const data = {
        guild_id: guildId,
        admins_id: adminsId,
        max_kb: maxKb,
        blacklist_kb: blacklistKb
      };
      
      const result = await PGinsert(Admins, data);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل مشرفين الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع سجلات المشرفين
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAllAdmins(options = {}) {
    try {
      const defaultOptions = {
        order: [['createdAt', 'DESC']],
        ...options
      };
      
      const result = await Admins.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات المشرفين: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل المشرفين بواسطة معرف الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object|null>} - السجل أو null
   */
  static async getAdminsByGuildId(guildId) {
    try {
      const result = await PGselectAll(Admins, {guild_id: guildId});
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجل مشرفين الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على الخوادم التي لديها مشرفين محددين
   * @param {string} adminId - معرف المشرف
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getGuildsByAdminId(adminId) {
    try {
      const result = await PGselectAll(Admins, {admins_id: `%${adminId}%`, Op: Op.like});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على خوادم المشرف: ${error.message}`);
    }
  }

  /**
   * الحصول على الخوادم بواسطة إعداد الحد الأقصى للكيبورد
   * @param {boolean} maxKb - إعداد الحد الأقصى للكيبورد
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAdminsByMaxKb(maxKb) {
    try {
      const result = await PGselectAll(Admins, {max_kb: maxKb});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المشرفين بواسطة إعداد الحد الأقصى للكيبورد: ${error.message}`);
    }
  }

  /**
   * الحصول على الخوادم بواسطة إعداد كيبورد القائمة السوداء
   * @param {boolean} blacklistKb - إعداد كيبورد القائمة السوداء
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAdminsByBlacklistKb(blacklistKb) {
    try {
      const result = await PGselectAll(Admins, {blacklist_kb: blacklistKb});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المشرفين بواسطة إعداد كيبورد القائمة السوداء: ${error.message}`);
    }
  }

  /**
   * الحصول على الخوادم بواسطة إعدادات الكيبورد
   * @param {boolean} maxKb - إعداد الحد الأقصى للكيبورد
   * @param {boolean} blacklistKb - إعداد كيبورد القائمة السوداء
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAdminsByKeyboardSettings(maxKb, blacklistKb) {
    try {
      const result = await Admins.findAll({
        where: {
          max_kb: maxKb,
          blacklist_kb: blacklistKb
        },
        order: [['createdAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المشرفين بواسطة إعدادات الكيبورد: ${error.message}`);
    }
  }

  /**
   * الحصول على الخوادم التي لديها مشرفين
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getGuildsWithAdmins() {
    try {
      const result = await Admins.findAll({
        where: {
          admins_id: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.ne]: '' }
            ]
          }
        },
        order: [['createdAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الخوادم التي لديها مشرفين: ${error.message}`);
    }
  }

  /**
   * الحصول على الخوادم التي ليس لديها مشرفين
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getGuildsWithoutAdmins() {
    try {
      const result = await Admins.findAll({
        where: {
          [Op.or]: [
            { admins_id: null },
            { admins_id: '' }
          ]
        },
        order: [['createdAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الخوادم التي ليس لديها مشرفين: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات المشرفين بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAdminsByDateRange(startDate, endDate) {
    try {
      const result = await PGselectAll(Admins, {createdAt: [startDate, endDate], Op: Op.between});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات المشرفين بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على أحدث سجلات المشرفين
   * @param {number} limit - عدد السجلات المطلوب إرجاعها
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getRecentAdmins(limit = 10) {
    try {
      const result = await Admins.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحدث سجلات المشرفين: ${error.message}`);
    }
  }

  /**
   * تحديث سجل المشرفين
   * @param {string} guildId - معرف الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateAdmins(guildId, updateData) {
    try {
      const result = await PGupdate(Admins, updateData, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث سجل المشرفين: ${error.message}`);
    }
  }

  /**
   * تحديث معرفات المشرفين للخادم
   * @param {string} guildId - معرف الخادم
   * @param {string} adminsId - معرفات المشرفين الجديدة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateAdminsId(guildId, adminsId) {
    try {
      const result = await PGupdate(Admins, 
        { admins_id: adminsId },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث معرفات المشرفين: ${error.message}`);
    }
  }

  /**
   * تحديث إعداد الحد الأقصى للكيبورد
   * @param {string} guildId - معرف الخادم
   * @param {boolean} maxKb - إعداد الحد الأقصى للكيبورد
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateMaxKb(guildId, maxKb) {
    try {
      const result = await PGupdate(Admins, 
        { max_kb: maxKb },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعداد الحد الأقصى للكيبورد: ${error.message}`);
    }
  }

  /**
   * تحديث إعداد كيبورد القائمة السوداء
   * @param {string} guildId - معرف الخادم
   * @param {boolean} blacklistKb - إعداد كيبورد القائمة السوداء
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateBlacklistKb(guildId, blacklistKb) {
    try {
      const result = await PGupdate(Admins, 
        { blacklist_kb: blacklistKb },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعداد كيبورد القائمة السوداء: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الكيبورد
   * @param {string} guildId - معرف الخادم
   * @param {boolean} maxKb - إعداد الحد الأقصى للكيبورد
   * @param {boolean} blacklistKb - إعداد كيبورد القائمة السوداء
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateKeyboardSettings(guildId, maxKb, blacklistKb) {
    try {
      const result = await PGupdate(Admins, 
        { 
          max_kb: maxKb,
          blacklist_kb: blacklistKb
        },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الكيبورد: ${error.message}`);
    }
  }

  /**
   * إضافة مشرف جديد إلى قائمة المشرفين
   * @param {string} guildId - معرف الخادم
   * @param {string} newAdminId - معرف المشرف الجديد
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async addAdmin(guildId, newAdminId) {
    try {
      const existingRecord = await this.getAdminsByGuildId(guildId);
      
      if (!existingRecord) {
        throw new Error('سجل المشرفين غير موجود للخادم');
      }
      
      let currentAdmins = existingRecord.admins_id || '';
      const adminsList = currentAdmins ? currentAdmins.split(',') : [];
      
      // التحقق من عدم وجود المشرف مسبقاً
      if (!adminsList.includes(newAdminId)) {
        adminsList.push(newAdminId);
        const updatedAdmins = adminsList.join(',');
        
        const result = await this.updateAdminsId(guildId, updatedAdmins);
        return result;
      }
      
      return existingRecord; // المشرف موجود مسبقاً
    } catch (error) {
      throw new Error(`خطأ في إضافة المشرف: ${error.message}`);
    }
  }

  /**
   * إزالة مشرف من قائمة المشرفين
   * @param {string} guildId - معرف الخادم
   * @param {string} adminId - معرف المشرف المراد إزالته
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async removeAdmin(guildId, adminId) {
    try {
      const existingRecord = await this.getAdminsByGuildId(guildId);
      
      if (!existingRecord) {
        throw new Error('سجل المشرفين غير موجود للخادم');
      }
      
      let currentAdmins = existingRecord.admins_id || '';
      const adminsList = currentAdmins ? currentAdmins.split(',') : [];
      
      // إزالة المشرف من القائمة
      const filteredAdmins = adminsList.filter(id => id !== adminId);
      const updatedAdmins = filteredAdmins.join(',');
      
      const result = await this.updateAdminsId(guildId, updatedAdmins);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إزالة المشرف: ${error.message}`);
    }
  }

  /**
   * تبديل إعداد الحد الأقصى للكيبورد
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async toggleMaxKb(guildId) {
    try {
      const existingRecord = await this.getAdminsByGuildId(guildId);
      
      if (!existingRecord) {
        throw new Error('سجل المشرفين غير موجود للخادم');
      }
      
      const newMaxKb = !existingRecord.max_kb;
      const result = await this.updateMaxKb(guildId, newMaxKb);
      return result;
    } catch (error) {
      throw new Error(`خطأ في تبديل إعداد الحد الأقصى للكيبورد: ${error.message}`);
    }
  }

  /**
   * تبديل إعداد كيبورد القائمة السوداء
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async toggleBlacklistKb(guildId) {
    try {
      const existingRecord = await this.getAdminsByGuildId(guildId);
      
      if (!existingRecord) {
        throw new Error('سجل المشرفين غير موجود للخادم');
      }
      
      const newBlacklistKb = !existingRecord.blacklist_kb;
      const result = await this.updateBlacklistKb(guildId, newBlacklistKb);
      return result;
    } catch (error) {
      throw new Error(`خطأ في تبديل إعداد كيبورد القائمة السوداء: ${error.message}`);
    }
  }

  /**
   * حذف سجل المشرفين
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAdmins(guildId) {
    try {
      const result = await PGdelete(Admins, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجل المشرفين: ${error.message}`);
    }
  }

  /**
   * حذف جميع سجلات المشرفين
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAllAdmins() {
    try {
      const result = await PGdelete(Admins, {});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع سجلات المشرفين: ${error.message}`);
    }
  }

  /**
   * حذف الخوادم بواسطة إعداد الحد الأقصى للكيبورد
   * @param {boolean} maxKb - إعداد الحد الأقصى للكيبورد
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAdminsByMaxKb(maxKb) {
    try {
      const result = await PGdelete(Admins, {
        where: { max_kb: maxKb }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المشرفين بواسطة إعداد الحد الأقصى للكيبورد: ${error.message}`);
    }
  }

  /**
   * حذف الخوادم بواسطة إعداد كيبورد القائمة السوداء
   * @param {boolean} blacklistKb - إعداد كيبورد القائمة السوداء
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAdminsByBlacklistKb(blacklistKb) {
    try {
      const result = await PGdelete(Admins, {
        where: { blacklist_kb: blacklistKb }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المشرفين بواسطة إعداد كيبورد القائمة السوداء: ${error.message}`);
    }
  }

  /**
   * حذف الخوادم التي ليس لديها مشرفين
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteGuildsWithoutAdmins() {
    try {
      const result = await PGdelete(Admins, {
        where: {
          [Op.or]: [
            { admins_id: null },
            { admins_id: '' }
          ]
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الخوادم التي ليس لديها مشرفين: ${error.message}`);
    }
  }

  /**
   * حذف السجلات القديمة
   * @param {number} daysOld - عدد الأيام (السجلات الأقدم من هذا العدد ستحذف)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteOldAdmins(daysOld = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await PGdelete(Admins, {
        where: {
          createdAt: {
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
   * الحصول على إحصائيات المشرفين
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getAdminsStats() {
    try {
      const allRecords = await Admins.findAll({});
      const totalGuilds = allRecords.length;
      
      // حساب الخوادم التي لديها مشرفين
      const guildsWithAdmins = allRecords.filter(record => 
        record.admins_id && record.admins_id.trim() !== ''
      ).length;
      
      const guildsWithoutAdmins = totalGuilds - guildsWithAdmins;
      
      // حساب إعدادات الكيبورد
      const maxKbEnabled = allRecords.filter(record => record.max_kb).length;
      const blacklistKbEnabled = allRecords.filter(record => record.blacklist_kb).length;
      
      // حساب متوسط عدد المشرفين لكل خادم
      let totalAdminsCount = 0;
      allRecords.forEach(record => {
        if (record.admins_id && record.admins_id.trim() !== '') {
          const adminsList = record.admins_id.split(',');
          totalAdminsCount += adminsList.length;
        }
      });
      
      const averageAdminsPerGuild = guildsWithAdmins > 0 ? 
        (totalAdminsCount / guildsWithAdmins).toFixed(2) : 0;
      
      // حساب السجلات الحديثة (آخر 30 يوم)
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const recentRecords = allRecords.filter(record => 
        new Date(record.createdAt) > monthAgo
      ).length;

      return {
        totalGuilds,
        guildsWithAdmins,
        guildsWithoutAdmins,
        maxKbEnabled,
        blacklistKbEnabled,
        totalAdminsCount,
        averageAdminsPerGuild: parseFloat(averageAdminsPerGuild),
        recentRecords
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات المشرفين: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود سجل المشرفين للخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - true إذا كان السجل موجود
   */
  static async existsAdmins(guildId) {
    try {
      const record = await this.getAdminsByGuildId(guildId);
      return record !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود سجل المشرفين: ${error.message}`);
    }
  }

  /**
   * التحقق من كون المستخدم مشرف في الخادم
   * @param {string} guildId - معرف الخادم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<boolean>} - true إذا كان المستخدم مشرف
   */
  static async isUserAdmin(guildId, userId) {
    try {
      const record = await this.getAdminsByGuildId(guildId);
      
      if (!record || !record.admins_id) {
        return false;
      }
      
      const adminsList = record.admins_id.split(',');
      return adminsList.includes(userId);
    } catch (error) {
      throw new Error(`خطأ في التحقق من كون المستخدم مشرف: ${error.message}`);
    }
  }

  /**
   * الحصول على قائمة معرفات المشرفين للخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Array>} - قائمة معرفات المشرفين
   */
  static async getAdminsList(guildId) {
    try {
      const record = await this.getAdminsByGuildId(guildId);
      
      if (!record || !record.admins_id) {
        return [];
      }
      
      return record.admins_id.split(',').filter(id => id.trim() !== '');
    } catch (error) {
      throw new Error(`خطأ في الحصول على قائمة المشرفين: ${error.message}`);
    }
  }

  /**
   * عد المشرفين في الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<number>} - عدد المشرفين
   */
  static async countAdmins(guildId) {
    try {
      const adminsList = await this.getAdminsList(guildId);
      return adminsList.length;
    } catch (error) {
      throw new Error(`خطأ في عد المشرفين: ${error.message}`);
    }
  }

  /**
   * إنشاء أو تحديث سجل المشرفين
   * @param {string} guildId - معرف الخادم
   * @param {Object} adminsData - بيانات المشرفين
   * @returns {Promise<Object>} - السجل المنشأ أو المحدث
   */
  static async upsertAdmins(guildId, adminsData) {
    try {
      const existingRecord = await this.getAdminsByGuildId(guildId);
      
      if (existingRecord) {
        // تحديث السجل الموجود
        const result = await this.updateAdmins(guildId, adminsData);
        return result;
      } else {
        // إنشاء سجل جديد
        const data = {
          guild_id: guildId,
          ...adminsData
        };
        const result = await this.createAdmins(data);
        return result;
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث سجل المشرفين: ${error.message}`);
    }
  }
}

export default AdminsService;