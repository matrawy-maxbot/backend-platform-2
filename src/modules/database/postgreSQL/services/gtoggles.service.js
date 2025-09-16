import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { GToggles } from '../models/index.js';

/**
 * خدمة إدارة إعدادات الخادم (GToggles)
 * تحتوي على العمليات الأساسية: إضافة، حصول، تعديل، حذف
 */
class GTogglesService {
  /**
   * إضافة إعدادات خادم جديد
   * @param {Object} togglesData - بيانات إعدادات الخادم
   * @param {string} togglesData.guild_id - معرف الخادم
   * @param {boolean} [togglesData.welcome_image] - تفعيل صورة الترحيب
   * @param {string} [togglesData.wi_channel] - قناة صورة الترحيب
   * @param {boolean} [togglesData.welcome_message] - تفعيل رسالة الترحيب
   * @param {string} [togglesData.wm_channel] - قناة رسالة الترحيب
   * @param {string} [togglesData.wm_message] - نص رسالة الترحيب
   * @param {boolean} [togglesData.departure_message] - تفعيل رسالة المغادرة
   * @param {string} [togglesData.dm_channel] - قناة رسالة المغادرة
   * @param {string} [togglesData.dm_message] - نص رسالة المغادرة
   * @param {boolean} [togglesData.auto_role] - تفعيل الرتبة التلقائية
   * @param {string} [togglesData.ar_role] - معرف الرتبة التلقائية
   * @param {boolean} [togglesData.activate_members] - تفعيل الأعضاء
   * @param {boolean} [togglesData.auto_log] - تفعيل السجل التلقائي
   * @param {boolean} [togglesData.manual_log] - تفعيل السجل اليدوي
   * @param {string} [togglesData.ml_jl] - قناة سجل الدخول والخروج
   * @param {string} [togglesData.ml_kb] - قناة سجل الطرد والحظر
   * @param {string} [togglesData.ml_members] - قناة سجل الأعضاء
   * @param {string} [togglesData.ml_message] - قناة سجل الرسائل
   * @param {string} [togglesData.ml_ss] - قناة سجل لقطات الشاشة
   * @param {string} [togglesData.ml_channels] - قناة سجل القنوات
   * @param {string} [togglesData.ml_roles] - قناة سجل الرتب
   * @param {boolean} [togglesData.drm] - تفعيل حذف الرسائل المباشرة
   * @param {boolean} [togglesData.ab] - تفعيل مكافحة البوتات
   * @param {boolean} [togglesData.kick_ban] - تفعيل حماية الطرد والحظر
   * @param {string} [togglesData.kb_max] - الحد الأقصى للطرد والحظر
   * @param {string} [togglesData.kb_punish] - عقوبة الطرد والحظر
   * @param {boolean} [togglesData.bad_words] - تفعيل فلتر الكلمات السيئة
   * @param {string} [togglesData.bw_words] - قائمة الكلمات السيئة
   * @param {string} [togglesData.bw_punish] - عقوبة الكلمات السيئة
   * @param {boolean} [togglesData.servers_links] - تفعيل فلتر روابط الخوادم
   * @param {string} [togglesData.pic_channels] - قنوات الصور
   * @param {string} [togglesData.bot_commands_chs] - قنوات أوامر البوت
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async createGuildToggles(togglesData) {
    try {
      const result = await PGinsert(GToggles, togglesData);
      return {
        success: true,
        data: result,
        message: 'تم إنشاء إعدادات الخادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في إنشاء إعدادات الخادم'
      };
    }
  }

  /**
   * الحصول على جميع إعدادات الخوادم
   * @param {Object} [conditions] - شروط البحث (اختياري)
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getAllGuildToggles(conditions = {}) {
    try {
      // استخدام النموذج الأصلي للحصول على جميع السجلات
      const result = await GToggles.findAll(Object.keys(conditions).length > 0 ? { where: conditions } : {});
      return {
        success: true,
        data: result,
        message: 'تم جلب إعدادات الخوادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب إعدادات الخوادم'
      };
    }
  }

  /**
   * الحصول على إعدادات خادم بواسطة المعرف
   * @param {string} guild_id - معرف الخادم
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getGuildTogglesById(guild_id) {
    try {
      const result = await PGselectAll(GToggles, { guild_id });
      if (result && result.length > 0) {
        return {
          success: true,
          data: result[0],
          message: 'تم جلب إعدادات الخادم بنجاح'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'لم يتم العثور على إعدادات الخادم'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب إعدادات الخادم'
      };
    }
  }

  /**
   * الحصول على الخوادم التي لديها ترحيب مفعل
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getGuildsWithWelcomeEnabled() {
    try {
      const result = await PGselectAll(GToggles, { welcome_message: true });
      return {
        success: true,
        data: result,
        message: 'تم جلب الخوادم التي لديها ترحيب مفعل بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب الخوادم التي لديها ترحيب مفعل'
      };
    }
  }

  /**
   * الحصول على الخوادم التي لديها سجل مفعل
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async getGuildsWithLoggingEnabled() {
    try {
      const result = await PGselectAll(GToggles, { auto_log: true });
      return {
        success: true,
        data: result,
        message: 'تم جلب الخوادم التي لديها سجل مفعل بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب الخوادم التي لديها سجل مفعل'
      };
    }
  }

  /**
   * تحديث إعدادات خادم
   * @param {string} guild_id - معرف الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async updateGuildToggles(guild_id, updateData) {
    try {
      const result = await PGupdate(GToggles, updateData, { guild_id });
      return {
        success: true,
        data: result,
        message: 'تم تحديث إعدادات الخادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في تحديث إعدادات الخادم'
      };
    }
  }

  /**
   * تحديث إعداد واحد فقط للخادم
   * @param {string} guild_id - معرف الخادم
   * @param {string} setting - اسم الإعداد
   * @param {any} value - قيمة الإعداد
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async updateSingleToggle(guild_id, setting, value) {
    try {
      const updateData = { [setting]: value };
      const result = await PGupdate(GToggles, updateData, { guild_id });
      return {
        success: true,
        data: result,
        message: `تم تحديث إعداد ${setting} بنجاح`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `فشل في تحديث إعداد ${setting}`
      };
    }
  }

  /**
   * حذف إعدادات خادم
   * @param {string} guild_id - معرف الخادم
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async deleteGuildToggles(guild_id) {
    try {
      const result = await PGdelete(GToggles, { guild_id });
      return {
        success: true,
        data: result,
        message: 'تم حذف إعدادات الخادم بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في حذف إعدادات الخادم'
      };
    }
  }

  /**
   * إعادة تعيين إعدادات خادم إلى القيم الافتراضية
   * @param {string} guild_id - معرف الخادم
   * @returns {Promise<Object>} - نتيجة العملية
   */
  static async resetGuildToggles(guild_id) {
    try {
      // القيم الافتراضية
      const defaultToggles = {
        welcome_image: false,
        wi_channel: null,
        welcome_message: false,
        wm_channel: null,
        wm_message: null,
        departure_message: false,
        dm_channel: null,
        dm_message: null,
        auto_role: false,
        ar_role: null,
        activate_members: false,
        auto_log: false,
        manual_log: false,
        ml_jl: null,
        ml_kb: null,
        ml_members: null,
        ml_message: null,
        ml_ss: null,
        ml_channels: null,
        ml_roles: null,
        drm: false,
        ab: false,
        kick_ban: false,
        kb_max: null,
        kb_punish: null,
        bad_words: false,
        bw_words: null,
        bw_punish: null,
        servers_links: false,
        pic_channels: null,
        bot_commands_chs: null
      };

      const result = await PGupdate(GToggles, defaultToggles, { guild_id });
      return {
        success: true,
        data: result,
        message: 'تم إعادة تعيين إعدادات الخادم إلى القيم الافتراضية بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في إعادة تعيين إعدادات الخادم'
      };
    }
  }
}

export default GTogglesService;