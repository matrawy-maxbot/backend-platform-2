import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { GuildsI } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة معلومات الخوادم (GuildsI)
 * تحتوي على العمليات الأساسية: إضافة، حصول، تعديل، حذف
 */
class GuildsIService {
  /**
   * إضافة معلومات خادم جديد
   * @param {Object} guildData - بيانات الخادم
   * @param {string} guildData.id - معرف الخادم
   * @param {string} [guildData.description] - وصف الخادم (اختياري)
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async createGuildInfo(guildData) {
    try {
      const result = await PGinsert(GuildsI, guildData);
      return {
        success: true,
        data: result,
        message: 'تم إنشاء معلومات الخادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في إنشاء معلومات الخادم'
      };
    }
  }

  /**
   * الحصول على جميع معلومات الخوادم
   * @param {Object} [conditions] - شروط البحث (اختياري)
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getAllGuildsInfo(conditions = {}) {
    try {
      // استخدام النموذج الأصلي للحصول على جميع السجلات
      const result = await GuildsI.findAll(Object.keys(conditions).length > 0 ? { where: conditions } : {});
      return {
        success: true,
        data: result,
        message: 'تم جلب معلومات الخوادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب معلومات الخوادم'
      };
    }
  }

  /**
   * الحصول على معلومات خادم بواسطة المعرف
   * @param {string} guild_id - معرف الخادم
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getGuildInfoById(guild_id) {
    try {
      const result = await PGselectAll(GuildsI, { guild_id });
      if (result && result.length > 0) {
        return {
          success: true,
          data: result[0],
          message: 'تم جلب معلومات الخادم بنجاح'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'لم يتم العثور على معلومات الخادم'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب معلومات الخادم'
      };
    }
  }

  /**
   * البحث في الخوادم بواسطة الوصف
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async searchGuildsByDescription(searchTerm) {
    try {
      // استخدام النموذج الأصلي للبحث المعقد
      const result = await GuildsI.findAll({
        where: {
          description: {
            [Op.iLike]: `%${searchTerm}%`
          }
        }
      });
      return {
        success: true,
        data: result,
        message: 'تم البحث في الخوادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في البحث في الخوادم'
      };
    }
  }

  /**
   * الحصول على الخوادم التي لديها وصف
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getGuildsWithDescription() {
    try {
      // استخدام النموذج الأصلي للعمليات المعقدة
      const result = await GuildsI.findAll({
        where: {
          description: {
            [Op.ne]: null
          }
        }
      });
      return {
        success: true,
        data: result,
        message: 'تم جلب الخوادم التي لديها وصف بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب الخوادم التي لديها وصف'
      };
    }
  }

  /**
   * الحصول على الخوادم التي ليس لديها وصف
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getGuildsWithoutDescription() {
    try {
      // استخدام النموذج الأصلي للعمليات المعقدة
      const result = await GuildsI.findAll({
        where: {
          description: {
            [Op.is]: null
          }
        }
      });
      return {
        success: true,
        data: result,
        message: 'تم جلب الخوادم التي ليس لديها وصف بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب الخوادم التي ليس لديها وصف'
      };
    }
  }

  /**
   * تحديث معلومات خادم
   * @param {string} id - معرف الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @param {string} [updateData.description] - الوصف الجديد
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async updateGuildInfo(id, updateData) {
    try {
      const result = await PGupdate(GuildsI, updateData, { id });
      return {
        success: true,
        data: result,
        message: 'تم تحديث معلومات الخادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في تحديث معلومات الخادم'
      };
    }
  }

  /**
   * تحديث وصف خادم فقط
   * @param {string} id - معرف الخادم
   * @param {string} description - الوصف الجديد
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async updateGuildDescription(id, description) {
    try {
      const result = await PGupdate(GuildsI, { description }, { id });
      return {
        success: true,
        data: result,
        message: 'تم تحديث وصف الخادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في تحديث وصف الخادم'
      };
    }
  }

  /**
   * حذف معلومات خادم
   * @param {string} id - معرف الخادم
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async deleteGuildInfo(id) {
    try {
      const result = await PGdelete(GuildsI, { id });
      return {
        success: true,
        data: result,
        message: 'تم حذف معلومات الخادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في حذف معلومات الخادم'
      };
    }
  }

  /**
   * حذف وصف خادم (تعيينه إلى null)
   * @param {string} id - معرف الخادم
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async clearGuildDescription(id) {
    try {
      const result = await PGupdate(GuildsI, { description: null }, { id });
      return {
        success: true,
        data: result,
        message: 'تم مسح وصف الخادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في مسح وصف الخادم'
      };
    }
  }

  /**
   * التحقق من وجود خادم
   * @param {string} id - معرف الخادم
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async checkGuildExists(id) {
    try {
      const result = await PGselectAll(GuildsI, { id });
      const exists = result && result.length > 0;
      
      return {
        success: true,
        data: { exists, guild: exists ? result[0] : null },
        message: exists ? 'الخادم موجود' : 'الخادم غير موجود'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في التحقق من وجود الخادم'
      };
    }
  }
}

export default GuildsIService;