import { GiveawayService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في عمليات الـ Giveaways
 * يحتوي على جميع العمليات المتعلقة بإدارة الـ giveaways
 */
class GiveawayController {
  /**
   * إنشاء giveaway جديد
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async createGiveaway(req, res) {
    try {
      const result = await GiveawayService.createGiveaway(req.body);
      
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
   * الحصول على جميع الـ giveaways
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getAllGiveaways(req, res) {
    try {
      const result = await GiveawayService.getAllGiveaways();
      
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
   * الحصول على giveaway بواسطة المعرف
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getGiveawayById(req, res) {
    try {
      const { id } = req.params;
      const result = await GiveawayService.getGiveawayById(id);
      
      if (result.success) {
        if (result.data) {
          send(res, { data: result.data }, result.message, 200);
        } else {
          send(res, {}, result.message, 404);
        }
      } else {
        send(res, { error: result.error }, result.message, 500);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
    }
  }

  /**
   * الحصول على giveaways بواسطة القناة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getGiveawaysByChannel(req, res) {
    try {
      const { channel } = req.params;
      const result = await GiveawayService.getGiveawaysByChannel(channel);
      
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
   * تحديث giveaway
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateGiveaway(req, res) {
    try {
      const { id } = req.params;
      const result = await GiveawayService.updateGiveaway(id, req.body);
      
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
   * حذف giveaway
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteGiveaway(req, res) {
    try {
      const { id } = req.params;
      const result = await GiveawayService.deleteGiveaway(id);
      
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
   * حذف جميع giveaways قناة معينة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteGiveawaysByChannel(req, res) {
    try {
      const { channel } = req.params;
      const result = await GiveawayService.deleteGiveawaysByChannel(channel);
      
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
   * الحصول على giveaways منتهية الصلاحية
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getExpiredGiveaways(req, res) {
    try {
      const currentTime = req.query.currentTime ? new Date(req.query.currentTime) : new Date();
      const result = await GiveawayService.getExpiredGiveaways(currentTime);
      
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

export default GiveawayController;