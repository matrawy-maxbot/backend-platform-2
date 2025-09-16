import { BackupService } from '../../../../../modules/database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

class BackupController {
  /**
   * إنشاء نسخة احتياطية جديدة
   */
  static async createBackup(req, res) {
    try {
      const result = await BackupService.createBackup(req.body);
      send(res, { data: result }, 'تم إنشاء النسخة الاحتياطية بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء النسخة الاحتياطية', 500);
    }
  }

  /**
   * إنشاء نسخة احتياطية للخادم
   */
  static async createServerBackup(req, res) {
    try {
      const { guildId, serverName } = req.params;
      const result = await BackupService.createServerBackup(guildId, serverName, req.body);
      send(res, { data: result }, 'تم إنشاء نسخة احتياطية للخادم بنجاح', 201);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إنشاء نسخة احتياطية للخادم', 500);
    }
  }

  /**
   * الحصول على جميع النسخ الاحتياطية
   */
  static async getAllBackups(req, res) {
    try {
      const result = await BackupService.getAllBackups(req.query);
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية', 500);
    }
  }

  /**
   * الحصول على نسخة احتياطية بواسطة معرف الخادم
   */
  static async getBackupByGuildId(req, res) {
    try {
      const { guildId } = req.params;
      const result = await BackupService.getBackupByGuildId(guildId);
      if (!result) {
        send(res, {}, 'لم يتم العثور على النسخة الاحتياطية', 404);
        return;
      }
      send(res, { data: result }, 'تم الحصول على النسخة الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخة الاحتياطية', 500);
    }
  }

  /**
   * البحث في النسخ الاحتياطية بواسطة اسم الخادم
   */
  static async getBackupsByServerName(req, res) {
    try {
      const { serverName } = req.params;
      const result = await BackupService.getBackupsByServerName(serverName);
      send(res, { data: result }, 'تم البحث في النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في البحث في النسخ الاحتياطية', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية بواسطة القناة غير النشطة
   */
  static async getBackupsByInactiveChannel(req, res) {
    try {
      const { inactiveChannel } = req.params;
      const result = await BackupService.getBackupsByInactiveChannel(inactiveChannel);
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية بواسطة مهلة عدم النشاط
   */
  static async getBackupsByInactiveTimeout(req, res) {
    try {
      const { timeout } = req.params;
      const result = await BackupService.getBackupsByInactiveTimeout(timeout);
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية بواسطة رسائل النظام
   */
  static async getBackupsBySystemMessages(req, res) {
    try {
      const { systemMessages } = req.params;
      const result = await BackupService.getBackupsBySystemMessages(systemMessages);
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية بواسطة نطاق التاريخ
   */
  static async getBackupsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const result = await BackupService.getBackupsByDateRange(startDate, endDate);
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية الحديثة
   */
  static async getRecentBackups(req, res) {
    try {
      const { limit } = req.query;
      const result = await BackupService.getRecentBackups(limit);
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية الحديثة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية الحديثة', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية مع الفئات
   */
  static async getBackupsWithCategories(req, res) {
    try {
      const result = await BackupService.getBackupsWithCategories();
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية مع الفئات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية مع الفئات', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية مع قنوات الدردشة
   */
  static async getBackupsWithChatChannels(req, res) {
    try {
      const result = await BackupService.getBackupsWithChatChannels();
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية مع قنوات الدردشة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية مع قنوات الدردشة', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية مع القنوات الصوتية
   */
  static async getBackupsWithVoiceChannels(req, res) {
    try {
      const result = await BackupService.getBackupsWithVoiceChannels();
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية مع القنوات الصوتية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية مع القنوات الصوتية', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية مع الأدوار
   */
  static async getBackupsWithRoles(req, res) {
    try {
      const result = await BackupService.getBackupsWithRoles();
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية مع الأدوار بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية مع الأدوار', 500);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية الكاملة
   */
  static async getCompleteBackups(req, res) {
    try {
      const result = await BackupService.getCompleteBackups();
      send(res, { data: result }, 'تم الحصول على النسخ الاحتياطية الكاملة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على النسخ الاحتياطية الكاملة', 500);
    }
  }

  /**
   * تحديث نسخة احتياطية
   */
  static async updateBackup(req, res) {
    try {
      const { guildId } = req.params;
      const result = await BackupService.updateBackup(guildId, req.body);
      send(res, { data: result }, 'تم تحديث النسخة الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث النسخة الاحتياطية', 500);
    }
  }

  /**
   * تحديث اسم الخادم
   */
  static async updateServerName(req, res) {
    try {
      const { guildId } = req.params;
      const { serverName } = req.body;
      const result = await BackupService.updateServerName(guildId, serverName);
      send(res, { data: result }, 'تم تحديث اسم الخادم بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث اسم الخادم', 500);
    }
  }

  /**
   * تحديث القناة غير النشطة
   */
  static async updateInactiveChannel(req, res) {
    try {
      const { guildId } = req.params;
      const { inactiveChannel } = req.body;
      const result = await BackupService.updateInactiveChannel(guildId, inactiveChannel);
      send(res, { data: result }, 'تم تحديث القناة غير النشطة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث القناة غير النشطة', 500);
    }
  }

  /**
   * تحديث مهلة عدم النشاط
   */
  static async updateInactiveTimeout(req, res) {
    try {
      const { guildId } = req.params;
      const { timeout } = req.body;
      const result = await BackupService.updateInactiveTimeout(guildId, timeout);
      send(res, { data: result }, 'تم تحديث مهلة عدم النشاط بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث مهلة عدم النشاط', 500);
    }
  }

  /**
   * تحديث رسائل النظام
   */
  static async updateSystemMessages(req, res) {
    try {
      const { guildId } = req.params;
      const { systemMessages } = req.body;
      const result = await BackupService.updateSystemMessages(guildId, systemMessages);
      send(res, { data: result }, 'تم تحديث رسائل النظام بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث رسائل النظام', 500);
    }
  }

  /**
   * تحديث الفئات
   */
  static async updateCategories(req, res) {
    try {
      const { guildId } = req.params;
      const { categories } = req.body;
      const result = await BackupService.updateCategories(guildId, categories);
      send(res, { data: result }, 'تم تحديث الفئات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث الفئات', 500);
    }
  }

  /**
   * تحديث قنوات الدردشة
   */
  static async updateChatChannels(req, res) {
    try {
      const { guildId } = req.params;
      const { chatChannels } = req.body;
      const result = await BackupService.updateChatChannels(guildId, chatChannels);
      send(res, { data: result }, 'تم تحديث قنوات الدردشة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث قنوات الدردشة', 500);
    }
  }

  /**
   * تحديث القنوات الصوتية
   */
  static async updateVoiceChannels(req, res) {
    try {
      const { guildId } = req.params;
      const { voiceChannels } = req.body;
      const result = await BackupService.updateVoiceChannels(guildId, voiceChannels);
      send(res, { data: result }, 'تم تحديث القنوات الصوتية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث القنوات الصوتية', 500);
    }
  }

  /**
   * تحديث قنوات الإعلانات
   */
  static async updateAnnouncementChannels(req, res) {
    try {
      const { guildId } = req.params;
      const { announcementChannels } = req.body;
      const result = await BackupService.updateAnnouncementChannels(guildId, announcementChannels);
      send(res, { data: result }, 'تم تحديث قنوات الإعلانات بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث قنوات الإعلانات', 500);
    }
  }

  /**
   * تحديث قنوات المسرح
   */
  static async updateStageChannels(req, res) {
    try {
      const { guildId } = req.params;
      const { stageChannels } = req.body;
      const result = await BackupService.updateStageChannels(guildId, stageChannels);
      send(res, { data: result }, 'تم تحديث قنوات المسرح بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث قنوات المسرح', 500);
    }
  }

  /**
   * تحديث الأدوار
   */
  static async updateRoles(req, res) {
    try {
      const { guildId } = req.params;
      const { roles } = req.body;
      const result = await BackupService.updateRoles(guildId, roles);
      send(res, { data: result }, 'تم تحديث الأدوار بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث الأدوار', 500);
    }
  }

  /**
   * تحديث الطابع الزمني
   */
  static async updateTimeStamp(req, res) {
    try {
      const { guildId } = req.params;
      const { timeStamp } = req.body;
      const result = await BackupService.updateTimeStamp(guildId, timeStamp);
      send(res, { data: result }, 'تم تحديث الطابع الزمني بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في تحديث الطابع الزمني', 500);
    }
  }

  /**
   * حذف نسخة احتياطية
   */
  static async deleteBackup(req, res) {
    try {
      const { guildId } = req.params;
      const result = await BackupService.deleteBackup(guildId);
      send(res, { data: result }, 'تم حذف النسخة الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف النسخة الاحتياطية', 500);
    }
  }

  /**
   * حذف النسخ الاحتياطية القديمة
   */
  static async deleteOldBackups(req, res) {
    try {
      const { daysOld } = req.query;
      const result = await BackupService.deleteOldBackups(daysOld);
      send(res, { data: result }, 'تم حذف النسخ الاحتياطية القديمة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف النسخ الاحتياطية القديمة', 500);
    }
  }

  /**
   * حذف النسخ الاحتياطية الفارغة
   */
  static async deleteEmptyBackups(req, res) {
    try {
      const result = await BackupService.deleteEmptyBackups();
      send(res, { data: result }, 'تم حذف النسخ الاحتياطية الفارغة بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف النسخ الاحتياطية الفارغة', 500);
    }
  }

  /**
   * حذف النسخ الاحتياطية بواسطة اسم الخادم
   */
  static async deleteBackupsByServerName(req, res) {
    try {
      const { serverName } = req.params;
      const result = await BackupService.deleteBackupsByServerName(serverName);
      send(res, { data: result }, 'تم حذف النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف النسخ الاحتياطية', 500);
    }
  }

  /**
   * حذف جميع النسخ الاحتياطية
   */
  static async deleteAllBackups(req, res) {
    try {
      const result = await BackupService.deleteAllBackups();
      send(res, { data: result }, 'تم حذف جميع النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في حذف جميع النسخ الاحتياطية', 500);
    }
  }

  /**
   * الحصول على إحصائيات النسخ الاحتياطية
   */
  static async getBackupsStats(req, res) {
    try {
      const result = await BackupService.getBackupsStats();
      send(res, { data: result }, 'تم الحصول على إحصائيات النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على إحصائيات النسخ الاحتياطية', 500);
    }
  }

  /**
   * التحقق من وجود نسخة احتياطية
   */
  static async existsBackup(req, res) {
    try {
      const { guildId } = req.params;
      const result = await BackupService.existsBackup(guildId);
      send(res, { data: result }, 'تم التحقق من وجود النسخة الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من وجود النسخة الاحتياطية', 500);
    }
  }

  /**
   * التحقق من اكتمال النسخة الاحتياطية
   */
  static async isBackupComplete(req, res) {
    try {
      const { guildId } = req.params;
      const result = await BackupService.isBackupComplete(guildId);
      send(res, { data: result }, 'تم التحقق من اكتمال النسخة الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في التحقق من اكتمال النسخة الاحتياطية', 500);
    }
  }

  /**
   * الحصول على حجم النسخة الاحتياطية
   */
  static async getBackupSize(req, res) {
    try {
      const { guildId } = req.params;
      const result = await BackupService.getBackupSize(guildId);
      send(res, { data: result }, 'تم الحصول على حجم النسخة الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في الحصول على حجم النسخة الاحتياطية', 500);
    }
  }

  /**
   * إدراج أو تحديث نسخة احتياطية
   */
  static async upsertBackup(req, res) {
    try {
      const { guildId } = req.params;
      const result = await BackupService.upsertBackup(guildId, req.body);
      send(res, { data: result }, 'تم إدراج أو تحديث النسخة الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في إدراج أو تحديث النسخة الاحتياطية', 500);
    }
  }

  /**
   * استعادة نسخة احتياطية
   */
  static async restoreBackup(req, res) {
    try {
      const { guildId } = req.params;
      const result = await BackupService.restoreBackup(guildId);
      send(res, { data: result }, 'تم استعادة النسخة الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في استعادة النسخة الاحتياطية', 500);
    }
  }

  /**
   * مقارنة النسخ الاحتياطية
   */
  static async compareBackups(req, res) {
    try {
      const { guildId1, guildId2 } = req.params;
      const result = await BackupService.compareBackups(guildId1, guildId2);
      send(res, { data: result }, 'تم مقارنة النسخ الاحتياطية بنجاح', 200);
    } catch (error) {
      send(res, { error: error.message }, 'خطأ في مقارنة النسخ الاحتياطية', 500);
    }
  }
}

export default BackupController;