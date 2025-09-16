import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Giveaway } from '../models/index.js';

/**
 * خدمة إدارة الـ Giveaways
 * تحتوي على العمليات الأساسية: إضافة، حصول، تعديل، حذف
 */
class GiveawayService {
  /**
   * إضافة giveaway جديد
   * @param {Object} giveawayData - بيانات الـ giveaway
   * @param {string} giveawayData.id - معرف الـ giveaway
   * @param {string} giveawayData.channel - معرف القناة
   * @param {number} giveawayData.number - رقم الـ giveaway
   * @param {number} giveawayData.time - وقت الـ giveaway
   * @param {string} giveawayData.prizes - الجوائز
   * @param {Date} [giveawayData.timestamp] - وقت الإنشاء (اختياري)
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async createGiveaway(giveawayData) {
    try {
      const result = await PGinsert(Giveaway, giveawayData);
      return {
        success: true,
        data: result,
        message: 'تم إنشاء الـ giveaway بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في إنشاء الـ giveaway'
      };
    }
  }

  /**
   * الحصول على جميع الـ giveaways
   * @param {Object} [conditions] - شروط البحث (اختياري)
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getAllGiveaways(conditions = {}) {
    try {
      const result = await Giveaway.findAll(conditions);
      return {
        success: true,
        data: result,
        message: 'تم جلب الـ giveaways بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب الـ giveaways'
      };
    }
  }

  /**
   * الحصول على giveaway بواسطة المعرف
   * @param {string} id - معرف الـ giveaway
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getGiveawayById(id) {
    try {
      const result = await PGselectAll(Giveaway, { id });
      if (result && result.length > 0) {
        return {
          success: true,
          data: result[0],
          message: 'تم جلب الـ giveaway بنجاح'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'لم يتم العثور على الـ giveaway'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب الـ giveaway'
      };
    }
  }

  /**
   * الحصول على giveaways بواسطة القناة
   * @param {string} channel - معرف القناة
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getGiveawaysByChannel(channel) {
    try {
      const result = await PGselectAll(Giveaway, { channel });
      return {
        success: true,
        data: result,
        message: 'تم جلب giveaways القناة بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب giveaways القناة'
      };
    }
  }

  /**
   * تحديث giveaway
   * @param {string} id - معرف الـ giveaway
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async updateGiveaway(id, updateData) {
    try {
      const result = await PGupdate(Giveaway, updateData, { id });
      return {
        success: true,
        data: result,
        message: 'تم تحديث الـ giveaway بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في تحديث الـ giveaway'
      };
    }
  }

  /**
   * حذف giveaway
   * @param {string} id - معرف الـ giveaway
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async deleteGiveaway(id) {
    try {
      const result = await PGdelete(Giveaway, { id });
      return {
        success: true,
        data: result,
        message: 'تم حذف الـ giveaway بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في حذف الـ giveaway'
      };
    }
  }

  /**
   * حذف جميع giveaways قناة معينة
   * @param {string} channel - معرف القناة
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async deleteGiveawaysByChannel(channel) {
    try {
      const result = await PGdelete(Giveaway, { channel });
      return {
        success: true,
        data: result,
        message: 'تم حذف giveaways القناة بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في حذف giveaways القناة'
      };
    }
  }

  /**
   * الحصول على giveaways منتهية الصلاحية
   * @param {Date} currentTime - الوقت الحالي
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getExpiredGiveaways(currentTime = new Date()) {
    try {
      // هنا نحتاج لاستخدام query مخصص للمقارنة مع الوقت
      // يمكن تطوير هذه الدالة حسب احتياجات المشروع
      const result = await Giveaway.findAll({
        where: {
          [timestamp + ' + time * 1000']: {
            [Op.lt]: currentTime
          }
        }
      });
      const expiredGiveaways = result.filter(giveaway => {
        const giveawayEndTime = new Date(giveaway.timestamp.getTime() + (giveaway.time * 1000));
        return giveawayEndTime < currentTime;
      });
      
      return {
        success: true,
        data: expiredGiveaways,
        message: 'تم جلب الـ giveaways المنتهية بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب الـ giveaways المنتهية'
      };
    }
  }
}

export default GiveawayService;