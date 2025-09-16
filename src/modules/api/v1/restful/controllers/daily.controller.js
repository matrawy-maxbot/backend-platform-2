import { DailyService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

class DailyController {
  /**
   * إنشاء سجل نشاط يومي جديد
   */
  static async createDaily(req, res) {
    try {
      const result = await DailyService.createDaily(req.value.body);
      send(res, { data: result }, 'تم إنشاء سجل النشاط اليومي بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء سجل النشاط اليومي', 500);
    }
  }

  /**
   * إنشاء أو تحديث سجل النشاط اليومي للمستخدم
   */
  static async createOrUpdateDaily(req, res) {
    try {
      const { userId } = req.value.params;
      const result = await DailyService.createOrUpdateDaily(userId);
      send(res, { data: result }, 'تم إنشاء أو تحديث سجل النشاط اليومي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء أو تحديث سجل النشاط اليومي', 500);
    }
  }

  /**
   * الحصول على جميع سجلات النشاط اليومي
   */
  static async getAllDaily(req, res) {
    try {
      const options = req.value.query || {};
      const result = await DailyService.getAllDaily(options);
      send(res, { data: result }, 'تم الحصول على سجلات النشاط اليومي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات النشاط اليومي', 500);
    }
  }

  /**
   * الحصول على سجل النشاط اليومي بواسطة معرف المستخدم
   */
  static async getDailyById(req, res) {
    try {
      const { userId } = req.value.params;
      const result = await DailyService.getDailyById(userId);
      
      if (!result) {
        send(res, {}, 'لم يتم العثور على سجل النشاط اليومي', 404);
        return;
      }
      
      send(res, { data: result }, 'تم الحصول على سجل النشاط اليومي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجل النشاط اليومي', 500);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي بواسطة التاريخ
   */
  static async getDailyByDate(req, res) {
    try {
      const { date } = req.value.params;
      const result = await DailyService.getDailyByDate(new Date(date));
      send(res, { data: result }, 'تم الحصول على سجلات النشاط اليومي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات النشاط اليومي', 500);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي لليوم الحالي
   */
  static async getTodayDaily(req, res) {
    try {
      const result = await DailyService.getTodayDaily();
      send(res, { data: result }, 'تم الحصول على سجلات النشاط اليومي لليوم بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات النشاط اليومي لليوم', 500);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي بواسطة نطاق زمني
   */
  static async getDailyByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.value.query;
      const result = await DailyService.getDailyByDateRange(new Date(startDate), new Date(endDate));
      send(res, { data: result }, 'تم الحصول على سجلات النشاط اليومي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات النشاط اليومي', 500);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي للأسبوع الماضي
   */
  static async getLastWeekDaily(req, res) {
    try {
      const result = await DailyService.getLastWeekDaily();
      send(res, { data: result }, 'تم الحصول على سجلات النشاط اليومي للأسبوع الماضي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات النشاط اليومي للأسبوع الماضي', 500);
    }
  }

  /**
   * الحصول على سجلات النشاط اليومي للشهر الماضي
   */
  static async getLastMonthDaily(req, res) {
    try {
      const result = await DailyService.getLastMonthDaily();
      send(res, { data: result }, 'تم الحصول على سجلات النشاط اليومي للشهر الماضي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات النشاط اليومي للشهر الماضي', 500);
    }
  }

  /**
   * التحقق من وجود نشاط يومي للمستخدم اليوم
   */
  static async hasUserDailyToday(req, res) {
    try {
      const { userId } = req.value.params;
      const result = await DailyService.hasUserDailyToday(userId);
      send(res, { data: { hasDaily: result } }, 'تم التحقق من النشاط اليومي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من النشاط اليومي', 500);
    }
  }

  /**
   * تحديث سجل النشاط اليومي
   */
  static async updateDaily(req, res) {
    try {
      const { userId } = req.value.params;
      const result = await DailyService.updateDaily(userId, req.value.body);
      send(res, { data: result }, 'تم تحديث سجل النشاط اليومي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث سجل النشاط اليومي', 500);
    }
  }

  /**
   * تحديث الطابع الزمني للنشاط اليومي للمستخدم
   */
  static async updateUserDailyTimestamp(req, res) {
    try {
      const { userId } = req.value.params;
      const result = await DailyService.updateUserDailyTimestamp(userId);
      send(res, { data: result }, 'تم تحديث الطابع الزمني بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث الطابع الزمني', 500);
    }
  }

  /**
   * حذف سجل النشاط اليومي
   */
  static async deleteDaily(req, res) {
    try {
      const { userId } = req.value.params;
      const result = await DailyService.deleteDaily(userId);
      send(res, { data: result }, 'تم حذف سجل النشاط اليومي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف سجل النشاط اليومي', 500);
    }
  }

  /**
   * حذف سجلات النشاط اليومي القديمة
   */
  static async deleteOldDaily(req, res) {
    try {
      const { daysOld } = req.value.query;
      const result = await DailyService.deleteOldDaily(daysOld ? parseInt(daysOld) : 30);
      send(res, { data: result }, 'تم حذف السجلات القديمة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف السجلات القديمة', 500);
    }
  }

  /**
   * حذف سجلات النشاط اليومي بواسطة التاريخ
   */
  static async deleteDailyByDate(req, res) {
    try {
      const { date } = req.value.params;
      const result = await DailyService.deleteDailyByDate(new Date(date));
      send(res, { data: result }, 'تم حذف سجلات النشاط اليومي بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف سجلات النشاط اليومي', 500);
    }
  }

  /**
   * الحصول على إحصائيات النشاط اليومي
   */
  static async getDailyStats(req, res) {
    try {
      const result = await DailyService.getDailyStats();
      send(res, { data: result }, 'تم الحصول على الإحصائيات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الإحصائيات', 500);
    }
  }

  /**
   * الحصول على أكثر المستخدمين نشاطاً
   */
  static async getMostActiveUsers(req, res) {
    try {
      const { limit } = req.value.query;
      const result = await DailyService.getMostActiveUsers(limit ? parseInt(limit) : 10);
      send(res, { data: result }, 'تم الحصول على أكثر المستخدمين نشاطاً بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على أكثر المستخدمين نشاطاً', 500);
    }
  }
}

export default DailyController;