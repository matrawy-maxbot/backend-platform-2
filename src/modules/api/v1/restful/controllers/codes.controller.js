import { CodesService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

class CodesController {
  /**
   * إنشاء رمز جديد
   */
  static async createCode(req, res) {
    try {
      const result = await CodesService.createCode(req.value.body);
      send(res, { data: result }, 'تم إنشاء الرمز بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء الرمز', 500);
    }
  }

  /**
   * إنشاء رمز للخادم
   */
  static async createGuildCode(req, res) {
    try {
      const { code, guildId, users, duration } = req.value.body;
      const result = await CodesService.createGuildCode(code, guildId, users, duration);
      send(res, { data: result }, 'تم إنشاء رمز الخادم بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء رمز الخادم', 500);
    }
  }

  /**
   * إنشاء رمز عشوائي للخادم
   */
  static async createRandomGuildCode(req, res) {
    try {
      const { guildId, users, duration, codeLength } = req.value.body;
      const result = await CodesService.createRandomGuildCode(guildId, users, duration, codeLength);
      send(res, { data: result }, 'تم إنشاء الرمز العشوائي بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء الرمز العشوائي', 500);
    }
  }

  /**
   * الحصول على جميع الرموز
   */
  static async getAllCodes(req, res) {
    try {
      const result = await CodesService.getAllCodes(req.value.query);
      send(res, { data: result }, 'تم الحصول على الرموز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الرموز', 500);
    }
  }

  /**
   * الحصول على رمز بواسطة الرمز
   */
  static async getCodeByCode(req, res) {
    try {
      const { code } = req.value.params;
      const result = await CodesService.getCodeByCode(code);
      
      if (!result) {
        send(res, {}, 'لم يتم العثور على الرمز', 404);
        return;
      }
      
      send(res, { data: result }, 'تم الحصول على الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الرمز', 500);
    }
  }

  /**
   * الحصول على الرموز بواسطة معرف الخادم
   */
  static async getCodesByGuildId(req, res) {
    try {
      const { guildId } = req.value.params;
      const result = await CodesService.getCodesByGuildId(guildId);
      send(res, { data: result }, 'تم الحصول على رموز الخادم بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على رموز الخادم', 500);
    }
  }

  /**
   * الحصول على الرموز بواسطة المدة
   */
  static async getCodesByDuration(req, res) {
    try {
      const { duration } = req.value.params;
      const result = await CodesService.getCodesByDuration(duration);
      send(res, { data: result }, 'تم الحصول على الرموز بواسطة المدة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الرموز بواسطة المدة', 500);
    }
  }

  /**
   * البحث في المستخدمين
   */
  static async searchCodesByUsers(req, res) {
    try {
      const { searchTerm } = req.value.query;
      const result = await CodesService.searchCodesByUsers(searchTerm);
      send(res, { data: result }, 'تم البحث في المستخدمين بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في البحث في المستخدمين', 500);
    }
  }

  /**
   * الحصول على الرموز بواسطة نطاق زمني
   */
  static async getCodesByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.value.query;
      const result = await CodesService.getCodesByDateRange(new Date(startDate), new Date(endDate));
      send(res, { data: result }, 'تم الحصول على الرموز بواسطة النطاق الزمني بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الرموز بواسطة النطاق الزمني', 500);
    }
  }

  /**
   * الحصول على أحدث الرموز
   */
  static async getRecentCodes(req, res) {
    try {
      const { limit } = req.value.query;
      const result = await CodesService.getRecentCodes(limit);
      send(res, { data: result }, 'تم الحصول على أحدث الرموز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على أحدث الرموز', 500);
    }
  }

  /**
   * الحصول على الرموز المنتهية الصلاحية
   */
  static async getExpiredCodes(req, res) {
    try {
      const result = await CodesService.getExpiredCodes();
      send(res, { data: result }, 'تم الحصول على الرموز المنتهية الصلاحية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الرموز المنتهية الصلاحية', 500);
    }
  }

  /**
   * الحصول على الرموز النشطة
   */
  static async getActiveCodes(req, res) {
    try {
      const result = await CodesService.getActiveCodes();
      send(res, { data: result }, 'تم الحصول على الرموز النشطة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الرموز النشطة', 500);
    }
  }

  /**
   * الحصول على الرموز التي تنتهي قريباً
   */
  static async getCodesExpiringSoon(req, res) {
    try {
      const { hours } = req.value.query;
      const result = await CodesService.getCodesExpiringSoon(hours);
      send(res, { data: result }, 'تم الحصول على الرموز التي تنتهي قريباً بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على الرموز التي تنتهي قريباً', 500);
    }
  }

  /**
   * تحديث الرمز
   */
  static async updateCode(req, res) {
    try {
      const { code } = req.value.params;
      const result = await CodesService.updateCode(code, req.value.body);
      send(res, { data: result }, 'تم تحديث الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث الرمز', 500);
    }
  }

  /**
   * تحديث المستخدمين
   */
  static async updateCodeUsers(req, res) {
    try {
      const { code } = req.value.params;
      const { users } = req.value.body;
      const result = await CodesService.updateCodeUsers(code, users);
      send(res, { data: result }, 'تم تحديث مستخدمي الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث مستخدمي الرمز', 500);
    }
  }

  /**
   * إضافة مستخدم إلى الرمز
   */
  static async addUserToCode(req, res) {
    try {
      const { code } = req.value.params;
      const { userId } = req.value.body;
      const result = await CodesService.addUserToCode(code, userId);
      send(res, { data: result }, 'تم إضافة المستخدم إلى الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إضافة المستخدم إلى الرمز', 500);
    }
  }

  /**
   * إزالة مستخدم من الرمز
   */
  static async removeUserFromCode(req, res) {
    try {
      const { code } = req.value.params;
      const { userId } = req.value.body;
      const result = await CodesService.removeUserFromCode(code, userId);
      send(res, { data: result }, 'تم إزالة المستخدم من الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إزالة المستخدم من الرمز', 500);
    }
  }

  /**
   * تحديث مدة الرمز
   */
  static async updateCodeDuration(req, res) {
    try {
      const { code } = req.value.params;
      const { duration } = req.value.body;
      const result = await CodesService.updateCodeDuration(code, duration);
      send(res, { data: result }, 'تم تحديث مدة الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث مدة الرمز', 500);
    }
  }

  /**
   * تمديد مدة الرمز
   */
  static async extendCodeDuration(req, res) {
    try {
      const { code } = req.value.params;
      const { additionalDuration } = req.value.body;
      const result = await CodesService.extendCodeDuration(code, additionalDuration);
      send(res, { data: result }, 'تم تمديد مدة الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تمديد مدة الرمز', 500);
    }
  }

  /**
   * حذف الرمز
   */
  static async deleteCode(req, res) {
    try {
      const { code } = req.value.params;
      const result = await CodesService.deleteCode(code);
      send(res, { data: result }, 'تم حذف الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف الرمز', 500);
    }
  }

  /**
   * حذف رموز الخادم
   */
  static async deleteGuildCodes(req, res) {
    try {
      const { guildId } = req.value.params;
      const result = await CodesService.deleteGuildCodes(guildId);
      send(res, { data: result }, 'تم حذف رموز الخادم بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف رموز الخادم', 500);
    }
  }

  /**
   * حذف الرموز المنتهية الصلاحية
   */
  static async deleteExpiredCodes(req, res) {
    try {
      const result = await CodesService.deleteExpiredCodes();
      send(res, { data: result }, 'تم حذف الرموز المنتهية الصلاحية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف الرموز المنتهية الصلاحية', 500);
    }
  }

  /**
   * حذف الرموز القديمة
   */
  static async deleteOldCodes(req, res) {
    try {
      const { daysOld } = req.value.query;
      const result = await CodesService.deleteOldCodes(daysOld);
      send(res, { data: result }, 'تم حذف الرموز القديمة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف الرموز القديمة', 500);
    }
  }

  /**
   * الحصول على إحصائيات الرموز
   */
  static async getCodesStats(req, res) {
    try {
      const result = await CodesService.getCodesStats();
      send(res, { data: result }, 'تم الحصول على إحصائيات الرموز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على إحصائيات الرموز', 500);
    }
  }

  /**
   * التحقق من وجود الرمز
   */
  static async existsCode(req, res) {
    try {
      const { code } = req.value.params;
      const result = await CodesService.existsCode(code);
      send(res, { data: { exists: result } }, 'تم التحقق من وجود الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من وجود الرمز', 500);
    }
  }

  /**
   * التحقق من صحة الرمز
   */
  static async validateCode(req, res) {
    try {
      const { code } = req.value.params;
      const result = await CodesService.validateCode(code);
      send(res, { data: { valid: result } }, 'تم التحقق من صحة الرمز بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من صحة الرمز', 500);
    }
  }
}

export default CodesController;