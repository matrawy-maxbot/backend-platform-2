import { DeafenService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في عمليات كتم الصوت
 * @module DeafenController
 */
class DeafenController {
  /**
   * إنشاء سجل كتم صوت جديد
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async createDeafen(req, res) {
    try {
      const result = await DeafenService.createDeafen(req.body);
      send(res, { data: result }, 'تم إنشاء سجل كتم الصوت بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء سجل كتم الصوت', 500);
    }
  }

  /**
   * إنشاء سجل كتم صوت للمستخدم
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async createUserDeafen(req, res) {
    try {
      const { userId, deafensData } = req.body;
      const result = await DeafenService.createUserDeafen(userId, deafensData);
      send(res, { data: result }, 'تم إنشاء سجل كتم صوت المستخدم بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء سجل كتم صوت المستخدم', 500);
    }
  }

  /**
   * الحصول على جميع سجلات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getAllDeafens(req, res) {
    try {
      const result = await DeafenService.getAllDeafens(req.query);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات كتم صوت', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على سجلات كتم الصوت بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجلات كتم الصوت', 500);
    }
  }

  /**
   * الحصول على سجل كتم الصوت بواسطة المعرف
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getDeafenById(req, res) {
    try {
      const result = await DeafenService.getDeafenById(req.params.id);
      if (result) {
        send(res, { data: result }, 'تم الحصول على سجل كتم الصوت بنجاح', 200);
      } else {
        send(res, {}, 'سجل كتم الصوت غير موجود', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على سجل كتم الصوت', 500);
    }
  }

  /**
   * البحث في سجلات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async searchDeafens(req, res) {
    try {
      const { searchTerm } = req.query;
      const result = await DeafenService.searchDeafens(searchTerm, req.query);
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
   * الحصول على السجلات التي تحتوي على بيانات كتم صوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getDeafensWithData(req, res) {
    try {
      const result = await DeafenService.getDeafensWithData(req.query);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات تحتوي على بيانات', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على السجلات مع البيانات بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على السجلات مع البيانات', 500);
    }
  }

  /**
   * الحصول على السجلات الفارغة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getEmptyDeafens(req, res) {
    try {
      const result = await DeafenService.getEmptyDeafens(req.query);
      if (result?.length === 0 || !result) {
        send(res, {}, 'لا توجد سجلات فارغة', 404);
      } else {
        send(res, { data: result }, 'تم الحصول على السجلات الفارغة بنجاح', 200);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على السجلات الفارغة', 500);
    }
  }

  /**
   * الحصول على السجلات الحديثة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getRecentDeafens(req, res) {
    try {
      const { limit } = req.query;
      const result = await DeafenService.getRecentDeafens(limit, req.query);
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
   * تحديث سجل كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateDeafen(req, res) {
    try {
      const result = await DeafenService.updateDeafen(req.params.id, req.body);
      send(res, { data: result }, 'تم تحديث سجل كتم الصوت بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث سجل كتم الصوت', 500);
    }
  }

  /**
   * تحديث بيانات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async updateDeafensData(req, res) {
    try {
      const { deafensData } = req.body;
      const result = await DeafenService.updateDeafensData(req.params.id, deafensData);
      send(res, { data: result }, 'تم تحديث بيانات كتم الصوت بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث بيانات كتم الصوت', 500);
    }
  }

  /**
   * إضافة بيانات إلى كتم الصوت الموجود
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async appendDeafensData(req, res) {
    try {
      const { newData, separator } = req.body;
      const result = await DeafenService.appendDeafensData(req.params.id, newData, separator);
      send(res, { data: result }, 'تم إضافة البيانات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إضافة البيانات', 500);
    }
  }

  /**
   * مسح بيانات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async clearDeafensData(req, res) {
    try {
      const result = await DeafenService.clearDeafensData(req.params.id);
      send(res, { data: result }, 'تم مسح بيانات كتم الصوت بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في مسح بيانات كتم الصوت', 500);
    }
  }

  /**
   * حذف سجل كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteDeafen(req, res) {
    try {
      const result = await DeafenService.deleteDeafen(req.params.id);
      if (result) {
        send(res, {}, 'تم حذف سجل كتم الصوت بنجاح', 200);
      } else {
        send(res, {}, 'سجل كتم الصوت غير موجود', 404);
      }
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف سجل كتم الصوت', 500);
    }
  }

  /**
   * حذف السجلات الفارغة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteEmptyDeafens(req, res) {
    try {
      const result = await DeafenService.deleteEmptyDeafens();
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} سجل فارغ بنجاح`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف السجلات الفارغة', 500);
    }
  }

  /**
   * حذف جميع سجلات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deleteAllDeafens(req, res) {
    try {
      const result = await DeafenService.deleteAllDeafens();
      send(res, { data: { deletedCount: result } }, `تم حذف ${result} سجل بنجاح`, 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف جميع السجلات', 500);
    }
  }

  /**
   * الحصول على إحصائيات سجلات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getDeafenStats(req, res) {
    try {
      const result = await DeafenService.getDeafenStats();
      send(res, { data: result }, 'تم الحصول على الإحصائيات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الإحصائيات', 500);
    }
  }

  /**
   * عد جميع سجلات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countAllDeafens(req, res) {
    try {
      const result = await DeafenService.countAllDeafens();
      send(res, { data: { count: result } }, 'تم عد السجلات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد السجلات', 500);
    }
  }

  /**
   * عد السجلات التي تحتوي على بيانات
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countDeafensWithData(req, res) {
    try {
      const result = await DeafenService.countDeafensWithData();
      send(res, { data: { count: result } }, 'تم عد السجلات مع البيانات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد السجلات مع البيانات', 500);
    }
  }

  /**
   * عد السجلات الفارغة
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async countEmptyDeafens(req, res) {
    try {
      const result = await DeafenService.countEmptyDeafens();
      send(res, { data: { count: result } }, 'تم عد السجلات الفارغة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في عد السجلات الفارغة', 500);
    }
  }

  /**
   * الحصول على متوسط طول البيانات
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getAverageDataLength(req, res) {
    try {
      const result = await DeafenService.getAverageDataLength();
      send(res, { data: { averageLength: result } }, 'تم حساب متوسط الطول بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حساب متوسط الطول', 500);
    }
  }

  /**
   * التحقق من وجود سجل كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async deafenExists(req, res) {
    try {
      const result = await DeafenService.deafenExists(req.params.id);
      send(res, { data: { exists: result } }, 'تم التحقق من وجود السجل بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من وجود السجل', 500);
    }
  }

  /**
   * التحقق من وجود بيانات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async hasDeafensData(req, res) {
    try {
      const result = await DeafenService.hasDeafensData(req.params.id);
      send(res, { data: { hasData: result } }, 'تم التحقق من وجود البيانات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من وجود البيانات', 500);
    }
  }

  /**
   * الحصول على طول بيانات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async getDeafensDataLength(req, res) {
    try {
      const result = await DeafenService.getDeafensDataLength(req.params.id);
      send(res, { data: { dataLength: result } }, 'تم الحصول على طول البيانات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على طول البيانات', 500);
    }
  }

  /**
   * تحليل بيانات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async parseDeafensData(req, res) {
    try {
      const { separator } = req.query;
      const result = await DeafenService.parseDeafensData(req.params.id, separator);
      send(res, { data: result }, 'تم تحليل البيانات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحليل البيانات', 500);
    }
  }

  /**
   * إنشاء أو تحديث سجل كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async upsertDeafen(req, res) {
    try {
      const { id, deafensData } = req.body;
      const result = await DeafenService.upsertDeafen(id, deafensData);
      send(res, { data: result }, 'تم إنشاء أو تحديث السجل بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء أو تحديث السجل', 500);
    }
  }

  /**
   * نسخ سجل كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async copyDeafen(req, res) {
    try {
      const { sourceId, targetId } = req.body;
      const result = await DeafenService.copyDeafen(sourceId, targetId);
      send(res, { data: result }, 'تم نسخ السجل بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في نسخ السجل', 500);
    }
  }

  /**
   * تصدير جميع سجلات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async exportAllDeafens(req, res) {
    try {
      const result = await DeafenService.exportAllDeafens();
      send(res, { data: result }, 'تم تصدير السجلات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تصدير السجلات', 500);
    }
  }

  /**
   * استيراد سجلات كتم الصوت
   * @param {Object} req - طلب HTTP
   * @param {Object} res - استجابة HTTP
   */
  static async importDeafens(req, res) {
    try {
      const { deafens } = req.body;
      const result = await DeafenService.importDeafens(deafens);
      send(res, { data: result }, 'تم استيراد السجلات بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في استيراد السجلات', 500);
    }
  }
}

export default DeafenController;