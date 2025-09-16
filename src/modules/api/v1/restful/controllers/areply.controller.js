import { AreplyService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في الردود التلقائية
 */
class AreplyController {
  /**
   * إنشاء رد تلقائي جديد
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async createReply(req, res) {
    try {
      const result = await AreplyService.createReply(req.value.body);
      send(res, { data: result }, 'تم إنشاء الرد التلقائي بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء الرد التلقائي', 500);
    }
  }

  /**
   * إنشاء رد تلقائي جديد مع البيانات الأساسية
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async createAutoReply(req, res) {
    try {
      const { guildId, message, reply } = req.value.body;
      const result = await AreplyService.createAutoReply(guildId, message, reply);
      send(res, { data: result }, 'تم إنشاء الرد التلقائي بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء الرد التلقائي', 500);
    }
  }

  /**
   * الحصول على جميع الردود التلقائية
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getAllReplies(req, res) {
    try {
      const result = await AreplyService.getAllReplies();
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد ردود تلقائية', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على الردود التلقائية بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الردود التلقائية', 500);
    }
  }

  /**
   * الحصول على رد تلقائي بواسطة معرف القسم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getReplyById(req, res) {
    try {
      const { divId } = req.value.params;
      const result = await AreplyService.getReplyById(divId);
      if (!result) {
        send(res, {}, 'لم يتم العثور على الرد التلقائي', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على الرد التلقائي بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الرد التلقائي', 500);
    }
  }

  /**
   * الحصول على الردود التلقائية للخادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getRepliesByGuildId(req, res) {
    try {
      const { guildId } = req.value.params;
      const result = await AreplyService.getRepliesByGuildId(guildId);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد ردود تلقائية لهذا الخادم', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على ردود الخادم بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على ردود الخادم', 500);
    }
  }

  /**
   * البحث في الرسائل المحفزة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async searchByMessage(req, res) {
    try {
      const { searchText } = req.value.query;
      const result = await AreplyService.searchByMessage(searchText);
      if (result.length === 0) {
        send(res, {}, 'لم يتم العثور على نتائج', 404);
      } else {
        send(res, { data: result }, 'تم البحث بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في البحث', 500);
    }
  }

  /**
   * البحث في الردود
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async searchByReply(req, res) {
    try {
      const { searchText } = req.value.query;
      const result = await AreplyService.searchByReply(searchText);
      if (result.length === 0) {
        send(res, {}, 'لم يتم العثور على نتائج', 404);
      } else {
        send(res, { data: result }, 'تم البحث بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في البحث', 500);
    }
  }

  /**
   * البحث في الرسائل والردود
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async searchInBoth(req, res) {
    try {
      const { searchText } = req.value.query;
      const result = await AreplyService.searchInBoth(searchText);
      if (result.length === 0) {
        send(res, {}, 'لم يتم العثور على نتائج', 404);
      } else {
        send(res, { data: result }, 'تم البحث بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في البحث', 500);
    }
  }

  /**
   * البحث عن رد تلقائي بالرسالة المحددة في خادم معين
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async findReplyByMessage(req, res) {
    try {
      const { guildId, message } = req.value.params;
      const result = await AreplyService.findReplyByMessage(guildId, message);
      if (!result) {
        send(res, {}, 'لم يتم العثور على الرد التلقائي', 404);
      } else {
        send(res, { data: result }, 'تم العثور على الرد التلقائي بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في البحث عن الرد التلقائي', 500);
    }
  }

  /**
   * البحث عن رد تلقائي بالرسالة المطابقة تماماً
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async findExactReply(req, res) {
    try {
      const { guildId, message } = req.value.params;
      const result = await AreplyService.findExactReply(guildId, message);
      if (!result) {
        send(res, {}, 'لم يتم العثور على الرد التلقائي المطابق', 404);
      } else {
        send(res, { data: result }, 'تم العثور على الرد التلقائي المطابق بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في البحث عن الرد التلقائي المطابق', 500);
    }
  }

  /**
   * الحصول على الردود التلقائية بواسطة نطاق زمني
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getRepliesByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.value.query;
      const result = await AreplyService.getRepliesByDateRange(new Date(startDate), new Date(endDate));
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد ردود تلقائية في هذا النطاق الزمني', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على الردود التلقائية بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الردود التلقائية', 500);
    }
  }

  /**
   * الحصول على أحدث الردود التلقائية
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getRecentReplies(req, res) {
    try {
      const { limit } = req.value.query;
      const result = await AreplyService.getRecentReplies(limit ? parseInt(limit) : 10);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد ردود تلقائية حديثة', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على أحدث الردود التلقائية بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على أحدث الردود التلقائية', 500);
    }
  }

  /**
   * تحديث الرد التلقائي
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateReply(req, res) {
    try {
      const { divId } = req.value.params;
      const result = await AreplyService.updateReply(divId, req.value.body);
      send(res, { data: result }, 'تم تحديث الرد التلقائي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث الرد التلقائي', 500);
    }
  }

  /**
   * تحديث الرسالة المحفزة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateMessage(req, res) {
    try {
      const { divId } = req.value.params;
      const { message } = req.value.body;
      const result = await AreplyService.updateMessage(divId, message);
      send(res, { data: result }, 'تم تحديث الرسالة المحفزة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث الرسالة المحفزة', 500);
    }
  }

  /**
   * تحديث الرد
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateReplyText(req, res) {
    try {
      const { divId } = req.value.params;
      const { reply } = req.value.body;
      const result = await AreplyService.updateReplyText(divId, reply);
      send(res, { data: result }, 'تم تحديث الرد بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث الرد', 500);
    }
  }

  /**
   * حذف الرد التلقائي
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteReply(req, res) {
    try {
      const { divId } = req.value.params;
      const result = await AreplyService.deleteReply(divId);
      if (result) {
        send(res, { data: result }, 'تم حذف الرد التلقائي بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على الرد التلقائي', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف الرد التلقائي', 500);
    }
  }

  /**
   * حذف جميع ردود الخادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteGuildReplies(req, res) {
    try {
      const { guildId } = req.value.params;
      const result = await AreplyService.deleteGuildReplies(guildId);
      send(res, { data: result }, 'تم حذف ردود الخادم بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف ردود الخادم', 500);
    }
  }

  /**
   * حذف الردود التلقائية القديمة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteOldReplies(req, res) {
    try {
      const { daysOld } = req.value.query;
      const result = await AreplyService.deleteOldReplies(daysOld ? parseInt(daysOld) : 30);
      send(res, { data: result }, 'تم حذف الردود التلقائية القديمة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف الردود التلقائية القديمة', 500);
    }
  }

  /**
   * الحصول على إحصائيات الردود التلقائية
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getRepliesStats(req, res) {
    try {
      const result = await AreplyService.getRepliesStats();
      send(res, { data: result }, 'تم الحصول على إحصائيات الردود التلقائية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على إحصائيات الردود التلقائية', 500);
    }
  }

  /**
   * التحقق من وجود الرد التلقائي
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async existsReply(req, res) {
    try {
      const { divId } = req.value.params;
      const result = await AreplyService.existsReply(divId);
      send(res, { data: { exists: result } }, result ? 'الرد التلقائي موجود' : 'الرد التلقائي غير موجود', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من وجود الرد التلقائي', 500);
    }
  }

  /**
   * عد ردود الخادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countGuildReplies(req, res) {
    try {
      const { guildId } = req.value.params;
      const result = await AreplyService.countGuildReplies(guildId);
      send(res, { data: { count: result } }, 'تم عد ردود الخادم بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد ردود الخادم', 500);
    }
  }
}

export default AreplyController;