import { GuildsiService as GuildsIService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في عمليات معلومات الخوادم (GuildsI)
 * يحتوي على جميع العمليات المتعلقة بإدارة معلومات الخوادم
 */
class GuildsIController {
  /**
   * إنشاء معلومات خادم جديد
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async createGuildInfo(req, res) {
    try {
      const result = await GuildsIService.createGuildInfo(req.body);
      
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
   * الحصول على جميع معلومات الخوادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getAllGuildsInfo(req, res) {
    try {
      const result = await GuildsIService.getAllGuildsInfo();
      
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
   * الحصول على معلومات خادم بواسطة المعرف
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getGuildInfoById(req, res) {
    try {
      const result = await GuildsIService.getGuildInfoById(req.params.id);
      
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
   * البحث في الخوادم بواسطة الوصف
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async searchGuildsByDescription(req, res) {
    try {
      const result = await GuildsIService.searchGuildsByDescription(req.params.searchTerm);
      
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
   * الحصول على الخوادم التي لديها وصف
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getGuildsWithDescription(req, res) {
    try {
      const result = await GuildsIService.getGuildsWithDescription();
      
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
   * الحصول على الخوادم التي ليس لديها وصف
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getGuildsWithoutDescription(req, res) {
    try {
      const result = await GuildsIService.getGuildsWithoutDescription();
      
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
   * تحديث معلومات خادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateGuildInfo(req, res) {
    try {
      const result = await GuildsIService.updateGuildInfo(req.params.id, req.body);
      
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
   * تحديث وصف خادم فقط
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateGuildDescription(req, res) {
    try {
      const result = await GuildsIService.updateGuildDescription(req.params.id, req.body.description);
      
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
   * حذف معلومات خادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteGuildInfo(req, res) {
    try {
      const result = await GuildsIService.deleteGuildInfo(req.params.id);
      
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
   * حذف وصف خادم (تعيينه إلى null)
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async clearGuildDescription(req, res) {
    try {
      const result = await GuildsIService.clearGuildDescription(req.params.id);
      
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
   * التحقق من وجود خادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async checkGuildExists(req, res) {
    try {
      const result = await GuildsIService.checkGuildExists(req.params.id);
      
      if (result.success) {
        send(res, { data: result.data }, result.message, 200);
      } else {
        send(res, { error: result.error }, result.message, 500);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }
}

export default GuildsIController;