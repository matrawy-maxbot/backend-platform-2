import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { KB } from '../models/index.js';

/**
 * خدمة KB - إدارة بيانات قاعدة المعرفة
 * تحتوي على العمليات الأساسية: إضافة، حصول، تعديل، حذف
 */
class KBService {
  /**
   * إضافة سجل KB جديد
   * @param {Object} kbData - بيانات KB
   * @param {string} kbData.guild_id - معرف الخادم
   * @param {string} kbData.userId - معرف المستخدم (اختياري)
   * @param {number} kbData.kb_length - طول قاعدة المعرفة (اختياري)
   * @returns {Promise<Object>} السجل المُضاف
   */
  async createKB(kbData) {
    try {
      const result = await PGinsert(KB, kbData);
      return result;
    } catch (error) {
      console.error('خطأ في إضافة سجل KB:', error);
      throw error;
    }
  }

  /**
   * الحصول على جميع بيانات قاعدة المعرفة
   * @param {Object} [conditions] - شروط البحث (اختياري)
   * @returns {Promise<Object>} - نتيجة العملية
   */
  async getAllKB(conditions = {}) {
    try {
      // استخدام النموذج الأصلي للترتيب المعقد
      const result = await KB.findAll({
        where: conditions,
        order: [['created_at', 'DESC']]
      });
      return {
        success: true,
        data: result,
        message: 'تم جلب بيانات قاعدة المعرفة بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب بيانات قاعدة المعرفة'
      };
    }
  }

  /**
   * الحصول على بيانات قاعدة المعرفة بواسطة المعرف
   * @param {number} id - معرف البيانات
   * @returns {Promise<Object>} - نتيجة العملية
   */
  async getKBById(id) {
    try {
      const result = await PGselectAll(KB, { id });
      if (result && result.length > 0) {
        return {
          success: true,
          data: result[0],
          message: 'تم جلب بيانات قاعدة المعرفة بنجاح'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'لم يتم العثور على بيانات قاعدة المعرفة'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب بيانات قاعدة المعرفة'
      };
    }
  }

  /**
   * الحصول على بيانات قاعدة المعرفة بواسطة معرف الخادم
   * @param {string} guild_id - معرف الخادم
   * @returns {Promise<Object>} - نتيجة العملية
   */
  async getKBByGuildId(guild_id) {
    try {
      // استخدام النموذج الأصلي للترتيب المعقد
      const result = await KB.findAll({
        where: { guild_id },
        order: [['created_at', 'DESC']]
      });
      return {
        success: true,
        data: result,
        message: 'تم جلب بيانات قاعدة المعرفة للخادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب بيانات قاعدة المعرفة للخادم'
      };
    }
  }

  /**
   * الحصول على بيانات قاعدة المعرفة بواسطة معرف المستخدم
   * @param {string} user_id - معرف المستخدم
   * @returns {Promise<Object>} - نتيجة العملية
   */
  async getKBByUserId(user_id) {
    try {
      // استخدام النموذج الأصلي للترتيب المعقد
      const result = await KB.findAll({
        where: { user_id },
        order: [['created_at', 'DESC']]
      });
      return {
        success: true,
        data: result,
        message: 'تم جلب بيانات قاعدة المعرفة للمستخدم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب بيانات قاعدة المعرفة للمستخدم'
      };
    }
  }

  /**
   * تحديث سجل KB
   * @param {number} id - معرف السجل
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} السجل المحدث
   */
  async updateKB(id, updateData) {
    try {
      const result = await PGupdate(KB, updateData, { id });
      return result;
    } catch (error) {
      console.error('خطأ في تحديث سجل KB:', error);
      throw error;
    }
  }

  /**
   * تحديث طول قاعدة المعرفة
   * @param {number} id - معرف السجل
   * @param {number} kbLength - طول قاعدة المعرفة الجديد
   * @returns {Promise<Object>} السجل المحدث
   */
  async updateKBLength(id, kbLength) {
    try {
      const result = await PGupdate(KB, { kb_length: kbLength }, { id });
      return result;
    } catch (error) {
      console.error('خطأ في تحديث طول قاعدة المعرفة:', error);
      throw error;
    }
  }

  /**
   * حذف سجل KB
   * @param {number} id - معرف السجل
   * @returns {Promise<boolean>} true إذا تم الحذف بنجاح
   */
  async deleteKB(id) {
    try {
      const result = await PGdelete(KB, { id });
      return result;
    } catch (error) {
      console.error('خطأ في حذف سجل KB:', error);
      throw error;
    }
  }

  /**
   * حذف جميع سجلات KB لخادم معين
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} true إذا تم الحذف بنجاح
   */
  async deleteKBByGuildId(guildId) {
    try {
      const result = await PGdelete(KB, { guild_id: guildId });
      return result;
    } catch (error) {
      console.error('خطأ في حذف سجلات KB للخادم:', error);
      throw error;
    }
  }

  /**
   * الحصول على إحصائيات قاعدة المعرفة
   * @returns {Promise<Object>} - نتيجة العملية
   */
  async getKBStats() {
    try {
      // استخدام النموذج الأصلي للعمليات الإحصائية المعقدة
      const totalCount = await KB.count();
      const guildCount = await KB.count({
        distinct: true,
        col: 'guild_id'
      });
      const userCount = await KB.count({
        distinct: true,
        col: 'user_id'
      });
      
      return {
        success: true,
        data: {
          total_entries: totalCount,
          unique_guilds: guildCount,
          unique_users: userCount
        },
        message: 'تم جلب إحصائيات قاعدة المعرفة بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب إحصائيات قاعدة المعرفة'
      };
    }
  }

  /**
   * البحث في سجلات KB
   * @param {string} searchTerm - مصطلح البحث
   * @param {string} [guildId] - معرف الخادم (اختياري)
   * @returns {Promise<Object>} - نتيجة العملية
   */
  async searchKB(searchTerm, guildId = null) {
    try {
      // استخدام النموذج الأصلي للبحث المعقد
      const whereClause = {
        [KB.sequelize.Op.or]: [
          {
            kb_data: {
              [KB.sequelize.Op.iLike]: `%${searchTerm}%`
            }
          }
        ]
      };
      
      if (guildId) {
        whereClause.guild_id = guildId;
      }
      
      const result = await KB.findAll({
        where: whereClause,
        order: [['created_at', 'DESC']]
      });
      
      return {
        success: true,
        data: result,
        message: 'تم البحث في قاعدة المعرفة بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في البحث في قاعدة المعرفة'
      };
    }
  }

  /**
   * التحقق من وجود سجل KB
   * @param {number} id - معرف السجل
   * @returns {Promise<Object>} - نتيجة العملية
   */
  async checkKBExists(id) {
    try {
      const result = await PGselectAll(KB, { id });
      return {
        success: true,
        exists: result && result.length > 0,
        message: result && result.length > 0 ? 'السجل موجود' : 'السجل غير موجود'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في التحقق من وجود السجل'
      };
    }
  }
}

export default KBService;