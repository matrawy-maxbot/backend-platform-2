import { GtogglesService as GTogglesService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في عمليات إعدادات الخوادم (GToggles)
 * يحتوي على جميع العمليات المتعلقة بإدارة إعدادات الخوادم
 */
class GTogglesController {
  /**
   * إنشاء إعدادات خادم جديد
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async createGuildToggles(req, res) {
    try {
      const result = await GTogglesService.createGuildToggles(req.body);
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 201);
      } else {
        send(res, { error: result.error }, result.message, 400);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }

  /**
   * الحصول على جميع إعدادات الخوادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getAllGuildToggles(req, res) {
    try {
      const result = await GTogglesService.getAllGuildToggles();
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 200);
      } else {
        send(res, { error: result.error }, result.message, 500);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }

  /**
   * الحصول على إعدادات خادم بواسطة المعرف
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getGuildTogglesById(req, res) {
    try {
      const result = await GTogglesService.getGuildTogglesById(req.params.guild_id);
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 200);
      } else {
        send(res, {}, result.message, 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }

  /**
   * الحصول على الخوادم التي لديها ترحيب مفعل
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getGuildsWithWelcomeEnabled(req, res) {
    try {
      const result = await GTogglesService.getGuildsWithWelcomeEnabled();
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 200);
      } else {
        send(res, { error: result.error }, result.message, 500);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }

  /**
   * الحصول على الخوادم التي لديها سجل مفعل
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getGuildsWithLoggingEnabled(req, res) {
    try {
      const result = await GTogglesService.getGuildsWithLoggingEnabled();
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 200);
      } else {
        send(res, { error: result.error }, result.message, 500);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }

  /**
   * تحديث إعدادات خادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateGuildToggles(req, res) {
    try {
      const result = await GTogglesService.updateGuildToggles(req.params.guild_id, req.body);
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 200);
      } else {
        send(res, { error: result.error }, result.message, 400);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }

  /**
   * تحديث إعداد واحد فقط للخادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateSingleToggle(req, res) {
    try {
      const { setting, value } = req.body;
      const result = await GTogglesService.updateSingleToggle(req.params.guild_id, setting, value);
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 200);
      } else {
        send(res, { error: result.error }, result.message, 400);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }

  /**
   * إعادة تعيين إعدادات خادم إلى القيم الافتراضية
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async resetGuildToggles(req, res) {
    try {
      const result = await GTogglesService.resetGuildToggles(req.params.guild_id);
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 200);
      } else {
        send(res, { error: result.error }, result.message, 400);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }

  /**
   * حذف إعدادات خادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteGuildToggles(req, res) {
    try {
      const result = await GTogglesService.deleteGuildToggles(req.params.guild_id);
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 200);
      } else {
        send(res, { error: result.error }, result.message, 400);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }
}

export default GTogglesController;