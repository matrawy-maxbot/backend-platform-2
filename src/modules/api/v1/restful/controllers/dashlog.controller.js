import { DashlogService as DashLogService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في سجلات لوحة التحكم
 */
class DashLogController {
  /**
   * إنشاء سجل جديد
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async createLog(req, res) {
    try {
      const result = await DashLogService.createLog(req.body);
      send(res, { data: result }, 'تم إنشاء السجل بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء السجل', 500);
    }
  }

  /**
   * إنشاء سجل للخادم والمستخدم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async createGuildUserLog(req, res) {
    try {
      const { guildId, userId, pageName } = req.body;
      const result = await DashLogService.createGuildUserLog(guildId, userId, pageName);
      send(res, { data: result }, 'تم إنشاء سجل الخادم والمستخدم بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء سجل الخادم والمستخدم', 500);
    }
  }

  /**
   * الحصول على جميع السجلات
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getAllLogs(req, res) {
    try {
      const result = await DashLogService.getAllLogs(req.query);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على السجلات بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على السجلات', 500);
    }
  }

  /**
   * الحصول على سجل بواسطة المعرف
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getLogById(req, res) {
    try {
      const { id } = req.params;
      const result = await DashLogService.getLogById(parseInt(id));
      if (!result) {
        send(res, {}, 'لم يتم العثور على السجل', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على السجل بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على السجل', 500);
    }
  }

  /**
   * الحصول على السجلات بواسطة معرف الخادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getLogsByGuildId(req, res) {
    try {
      const { guildId } = req.params;
      const result = await DashLogService.getLogsByGuildId(guildId, req.query);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات للخادم', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على سجلات الخادم بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات الخادم', 500);
    }
  }

  /**
   * الحصول على السجلات بواسطة معرف المستخدم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getLogsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const result = await DashLogService.getLogsByUserId(userId, req.query);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات للمستخدم', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على سجلات المستخدم بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات المستخدم', 500);
    }
  }

  /**
   * الحصول على السجلات بواسطة اسم الصفحة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getLogsByPageName(req, res) {
    try {
      const { pageName } = req.params;
      const result = await DashLogService.getLogsByPageName(pageName, req.query);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات للصفحة', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على سجلات الصفحة بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات الصفحة', 500);
    }
  }

  /**
   * الحصول على السجلات بواسطة نطاق زمني
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getLogsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await DashLogService.getLogsByDateRange(
        new Date(startDate),
        new Date(endDate),
        req.query
      );
      if (result.length === 0) {
        send(res, {}, 'لا توجد سجلات في النطاق الزمني المحدد', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على السجلات بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على السجلات بالنطاق الزمني', 500);
    }
  }

  /**
   * الحصول على السجلات الحديثة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getRecentLogs(req, res) {
    try {
      const { limit } = req.query;
      const result = await DashLogService.getRecentLogs(
        limit ? parseInt(limit) : 50,
        req.query
      );
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات حديثة', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على السجلات الحديثة بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على السجلات الحديثة', 500);
    }
  }

  /**
   * الحصول على سجلات اليوم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getTodayLogs(req, res) {
    try {
      const result = await DashLogService.getTodayLogs(req.query);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات لليوم', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على سجلات اليوم بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات اليوم', 500);
    }
  }

  /**
   * الحصول على سجلات الخادم والمستخدم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getGuildUserLogs(req, res) {
    try {
      const { guildId, userId } = req.params;
      const result = await DashLogService.getGuildUserLogs(guildId, userId, req.query);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات للخادم والمستخدم', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على سجلات الخادم والمستخدم بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات الخادم والمستخدم', 500);
    }
  }

  /**
   * البحث في السجلات
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async searchLogs(req, res) {
    try {
      const { searchTerm } = req.query;
      const result = await DashLogService.searchLogs(searchTerm, req.query);
      if (result.length === 0) {
        send(res, {}, 'لا توجد نتائج للبحث', 404);
      } else {
        send(res, { data: result }, 'تم البحث بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في البحث', 500);
    }
  }

  /**
   * تحديث سجل
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateLog(req, res) {
    try {
      const { id } = req.params;
      const result = await DashLogService.updateLog(parseInt(id), req.body);
      send(res, { data: result }, 'تم تحديث السجل بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث السجل', 500);
    }
  }

  /**
   * تحديث اسم الصفحة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updatePageName(req, res) {
    try {
      const { id } = req.params;
      const { pageName } = req.body;
      const result = await DashLogService.updatePageName(parseInt(id), pageName);
      send(res, { data: result }, 'تم تحديث اسم الصفحة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث اسم الصفحة', 500);
    }
  }

  /**
   * تحديث وقت الحدث
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateEventTime(req, res) {
    try {
      const { id } = req.params;
      const { eventTime } = req.body;
      const result = await DashLogService.updateEventTime(
        parseInt(id),
        eventTime ? new Date(eventTime) : new Date()
      );
      send(res, { data: result }, 'تم تحديث وقت الحدث بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث وقت الحدث', 500);
    }
  }

  /**
   * حذف سجل
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteLog(req, res) {
    try {
      const { id } = req.params;
      const result = await DashLogService.deleteLog(parseInt(id));
      if (result) {
        send(res, { data: { deleted: true } }, 'تم حذف السجل بنجاح', 200);
      } else {
        send(res, {}, 'لم يتم العثور على السجل', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف السجل', 500);
    }
  }

  /**
   * حذف سجلات الخادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteGuildLogs(req, res) {
    try {
      const { guildId } = req.params;
      const result = await DashLogService.deleteGuildLogs(guildId);
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} سجل للخادم`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف سجلات الخادم', 500);
    }
  }

  /**
   * حذف سجلات المستخدم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteUserLogs(req, res) {
    try {
      const { userId } = req.params;
      const result = await DashLogService.deleteUserLogs(userId);
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} سجل للمستخدم`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف سجلات المستخدم', 500);
    }
  }

  /**
   * حذف السجلات القديمة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteOldLogs(req, res) {
    try {
      const { daysOld } = req.query;
      const result = await DashLogService.deleteOldLogs(
        daysOld ? parseInt(daysOld) : 30
      );
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} سجل قديم`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف السجلات القديمة', 500);
    }
  }

  /**
   * حذف سجلات بواسطة اسم الصفحة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteLogsByPageName(req, res) {
    try {
      const { pageName } = req.params;
      const result = await DashLogService.deleteLogsByPageName(pageName);
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} سجل للصفحة`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف سجلات الصفحة', 500);
    }
  }

  /**
   * حذف سجلات بواسطة نطاق زمني
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteLogsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await DashLogService.deleteLogsByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} سجل في النطاق الزمني`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف السجلات بالنطاق الزمني', 500);
    }
  }

  /**
   * حذف جميع السجلات
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteAllLogs(req, res) {
    try {
      const result = await DashLogService.deleteAllLogs();
      send(res, { data: { deletedCount: result } }, `تم حذف جميع السجلات (${result})`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف جميع السجلات', 500);
    }
  }

  /**
   * الحصول على إحصائيات السجلات
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getLogStats(req, res) {
    try {
      const result = await DashLogService.getLogStats();
      send(res, { data: result }, 'تم الحصول على الإحصائيات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الإحصائيات', 500);
    }
  }

  /**
   * عد جميع السجلات
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countAllLogs(req, res) {
    try {
      const result = await DashLogService.countAllLogs();
      send(res, { data: { count: result } }, 'تم عد السجلات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد السجلات', 500);
    }
  }

  /**
   * عد سجلات اليوم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countTodayLogs(req, res) {
    try {
      const result = await DashLogService.countTodayLogs();
      send(res, { data: { count: result } }, 'تم عد سجلات اليوم بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد سجلات اليوم', 500);
    }
  }

  /**
   * عد الخوادم الفريدة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countUniqueGuilds(req, res) {
    try {
      const result = await DashLogService.countUniqueGuilds();
      send(res, { data: { count: result } }, 'تم عد الخوادم الفريدة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد الخوادم الفريدة', 500);
    }
  }

  /**
   * عد المستخدمين الفريدين
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countUniqueUsers(req, res) {
    try {
      const result = await DashLogService.countUniqueUsers();
      send(res, { data: { count: result } }, 'تم عد المستخدمين الفريدين بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد المستخدمين الفريدين', 500);
    }
  }

  /**
   * عد الصفحات الفريدة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countUniquePages(req, res) {
    try {
      const result = await DashLogService.countUniquePages();
      send(res, { data: { count: result } }, 'تم عد الصفحات الفريدة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد الصفحات الفريدة', 500);
    }
  }

  /**
   * عد السجلات الحديثة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countRecentLogs(req, res) {
    try {
      const result = await DashLogService.countRecentLogs();
      send(res, { data: { count: result } }, 'تم عد السجلات الحديثة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد السجلات الحديثة', 500);
    }
  }

  /**
   * عد سجلات الخادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countGuildLogs(req, res) {
    try {
      const { guildId } = req.params;
      const result = await DashLogService.countGuildLogs(guildId);
      send(res, { data: { count: result } }, 'تم عد سجلات الخادم بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد سجلات الخادم', 500);
    }
  }

  /**
   * عد سجلات المستخدم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countUserLogs(req, res) {
    try {
      const { userId } = req.params;
      const result = await DashLogService.countUserLogs(userId);
      send(res, { data: { count: result } }, 'تم عد سجلات المستخدم بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد سجلات المستخدم', 500);
    }
  }

  /**
   * عد سجلات الصفحة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countPageLogs(req, res) {
    try {
      const { pageName } = req.params;
      const result = await DashLogService.countPageLogs(pageName);
      send(res, { data: { count: result } }, 'تم عد سجلات الصفحة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد سجلات الصفحة', 500);
    }
  }

  /**
   * التحقق من وجود سجل
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async logExists(req, res) {
    try {
      const { id } = req.params;
      const result = await DashLogService.logExists(parseInt(id));
      send(res, { data: { exists: result } }, result ? 'السجل موجود' : 'السجل غير موجود', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من وجود السجل', 500);
    }
  }

  /**
   * الحصول على الصفحات الأكثر زيارة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getMostVisitedPages(req, res) {
    try {
      const { limit } = req.query;
      const result = await DashLogService.getMostVisitedPages(
        limit ? parseInt(limit) : 10
      );
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد صفحات', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على الصفحات الأكثر زيارة بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الصفحات الأكثر زيارة', 500);
    }
  }

  /**
   * الحصول على المستخدمين الأكثر نشاطاً
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getMostActiveUsers(req, res) {
    try {
      const { limit } = req.query;
      const result = await DashLogService.getMostActiveUsers(
        limit ? parseInt(limit) : 10
      );
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد مستخدمين', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على المستخدمين الأكثر نشاطاً بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على المستخدمين الأكثر نشاطاً', 500);
    }
  }

  /**
   * الحصول على الخوادم الأكثر نشاطاً
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getMostActiveGuilds(req, res) {
    try {
      const { limit } = req.query;
      const result = await DashLogService.getMostActiveGuilds(
        limit ? parseInt(limit) : 10
      );
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد خوادم', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على الخوادم الأكثر نشاطاً بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الخوادم الأكثر نشاطاً', 500);
    }
  }

  /**
   * الحصول على توزيع النشاط حسب الساعة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getActivityDistributionByHour(req, res) {
    try {
      const result = await DashLogService.getActivityDistributionByHour();
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد بيانات توزيع النشاط', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على توزيع النشاط بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على توزيع النشاط', 500);
    }
  }

  /**
   * إنشاء أو تحديث سجل
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async upsertLog(req, res) {
    try {
      const { logData, updateData } = req.body;
      const result = await DashLogService.upsertLog(logData, updateData);
      send(res, { data: result }, 'تم إنشاء أو تحديث السجل بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء أو تحديث السجل', 500);
    }
  }

  /**
   * تصدير سجلات الخادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async exportGuildLogs(req, res) {
    try {
      const { guildId } = req.params;
      const result = await DashLogService.exportGuildLogs(guildId);
      if (result.length === 0) {
        send(res, {}, 'لا توجد سجلات للتصدير', 404);
      } else {
        send(res, { data: result }, 'تم تصدير سجلات الخادم بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تصدير سجلات الخادم', 500);
    }
  }

  /**
   * استيراد سجلات الخادم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async importGuildLogs(req, res) {
    try {
      const { guildId } = req.params;
      const { logs } = req.body;
      const result = await DashLogService.importGuildLogs(guildId, logs);
      send(res, { data: result }, `تم استيراد ${result.length} سجل بنجاح`, 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في استيراد سجلات الخادم', 500);
    }
  }
}

export default DashLogController;