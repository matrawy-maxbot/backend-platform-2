import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Backup } from '../models/index.js';
import { Op } from 'sequelize';

class BackupService {
  /**
   * إنشاء نسخة احتياطية جديدة
   * @param {Object} backupData - بيانات النسخة الاحتياطية
   * @returns {Promise<Object>} - النسخة الاحتياطية المنشأة
   */
  static async createBackup(backupData) {
    try {
      const result = await PGinsert(Backup, backupData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * إنشاء نسخة احتياطية للخادم
   * @param {string} guildId - معرف الخادم
   * @param {string} serverName - اسم الخادم
   * @param {Object} serverData - بيانات الخادم
   * @returns {Promise<Object>} - النسخة الاحتياطية المنشأة
   */
  static async createServerBackup(guildId, serverName, serverData = {}) {
    try {
      const data = {
        guild_id: guildId,
        server_name: serverName,
        inactive_ch: serverData.inactiveChannel || null,
        inactive_Timeout: serverData.inactiveTimeout || null,
        system_messages: serverData.systemMessages || null,
        category: serverData.categories ? JSON.stringify(serverData.categories) : null,
        chat: serverData.chatChannels ? JSON.stringify(serverData.chatChannels) : null,
        voice: serverData.voiceChannels ? JSON.stringify(serverData.voiceChannels) : null,
        announcement: serverData.announcementChannels ? JSON.stringify(serverData.announcementChannels) : null,
        stage: serverData.stageChannels ? JSON.stringify(serverData.stageChannels) : null,
        roles: serverData.roles ? JSON.stringify(serverData.roles) : null,
        TimeStamp: new Date()
      };
      
      const result = await PGinsert(Backup, data);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء نسخة احتياطية للخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع النسخ الاحتياطية
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getAllBackups(options = {}) {
    try {
      // للاستعلامات المعقدة مع order وoptions، نستخدم المودل مباشرة
      const result = await Backup.findAll({
        order: [['TimeStamp', 'DESC']],
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية: ${error.message}`);
    }
  }

  /**
   * الحصول على نسخة احتياطية بواسطة معرف الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object|null>} - النسخة الاحتياطية أو null
   */
  static async getBackupByGuildId(guildId) {
    try {
      // استخدام findQueue للفلتر البسيط
      const result = await PGselectAll(Backup, { guild_id: guildId });
      
      return result || null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * البحث في النسخ الاحتياطية بواسطة اسم الخادم
   * @param {string} serverName - اسم الخادم
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getBackupsByServerName(serverName) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Backup.findAll({
        where: {
          server_name: {
            [Op.like]: `%${serverName}%`
          }
        }
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في النسخ الاحتياطية بواسطة اسم الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية بواسطة قناة عدم النشاط
   * @param {string} inactiveChannel - معرف قناة عدم النشاط
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getBackupsByInactiveChannel(inactiveChannel) {
    try {
      // استخدام findQueue للفلتر البسيط
      const result = await PGselectAll(Backup, { inactive_ch: inactiveChannel });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية بواسطة قناة عدم النشاط: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية بواسطة مهلة عدم النشاط
   * @param {string} timeout - مهلة عدم النشاط
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getBackupsByInactiveTimeout(timeout) {
    try {
      // استخدام findQueue للفلتر البسيط
      const result = await PGselectAll(Backup, { inactive_Timeout: timeout });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية بواسطة مهلة عدم النشاط: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية بواسطة قناة رسائل النظام
   * @param {string} systemMessages - معرف قناة رسائل النظام
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getBackupsBySystemMessages(systemMessages) {
    try {
      // استخدام findQueue للفلتر البسيط
      const result = await PGselectAll(Backup, { system_messages: systemMessages });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية بواسطة قناة رسائل النظام: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getBackupsByDateRange(startDate, endDate) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Backup.findAll({
        where: {
          TimeStamp: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على أحدث النسخ الاحتياطية
   * @param {number} limit - عدد النسخ المطلوب إرجاعها
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getRecentBackups(limit = 10) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Backup.findAll({
        order: [['TimeStamp', 'DESC']],
        limit: limit
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحدث النسخ الاحتياطية: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية التي تحتوي على فئات
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getBackupsWithCategories() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Backup.findAll({
        where: {
          category: {
            [Op.ne]: null,
            [Op.ne]: ''
          }
        },
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية التي تحتوي على فئات: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية التي تحتوي على قنوات دردشة
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getBackupsWithChatChannels() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Backup.findAll({
        where: {
          chat: {
            [Op.ne]: null,
            [Op.ne]: ''
          }
        },
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية التي تحتوي على قنوات دردشة: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية التي تحتوي على قنوات صوتية
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getBackupsWithVoiceChannels() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Backup.findAll({
        where: {
          voice: {
            [Op.ne]: null,
            [Op.ne]: ''
          }
        },
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية التي تحتوي على قنوات صوتية: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية التي تحتوي على أدوار
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getBackupsWithRoles() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Backup.findAll({
        where: {
          roles: {
            [Op.ne]: null,
            [Op.ne]: ''
          }
        },
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية التي تحتوي على أدوار: ${error.message}`);
    }
  }

  /**
   * الحصول على النسخ الاحتياطية الكاملة
   * @returns {Promise<Array>} - قائمة النسخ الاحتياطية
   */
  static async getCompleteBackups() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Backup.findAll({
        where: {
          [Op.and]: [
            {
              category: {
                [Op.ne]: null,
                [Op.ne]: ''
              }
            },
            {
              chat: {
                [Op.ne]: null,
                [Op.ne]: ''
              }
            },
            {
              voice: {
                [Op.ne]: null,
                [Op.ne]: ''
              }
            },
            {
              roles: {
                [Op.ne]: null,
                [Op.ne]: ''
              }
            }
          ]
        },
        order: [['TimeStamp', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على النسخ الاحتياطية الكاملة: ${error.message}`);
    }
  }

  /**
   * تحديث النسخة الاحتياطية
   * @param {string} guildId - معرف الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateBackup(guildId, updateData) {
    try {
      const result = await PGupdate(Backup, updateData, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * تحديث اسم الخادم
   * @param {string} guildId - معرف الخادم
   * @param {string} newServerName - اسم الخادم الجديد
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateServerName(guildId, newServerName) {
    try {
      const result = await PGupdate(Backup, 
        { server_name: newServerName },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث اسم الخادم: ${error.message}`);
    }
  }

  /**
   * تحديث قناة عدم النشاط
   * @param {string} guildId - معرف الخادم
   * @param {string} inactiveChannel - معرف قناة عدم النشاط الجديدة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateInactiveChannel(guildId, inactiveChannel) {
    try {
      const result = await PGupdate(Backup, 
        { inactive_ch: inactiveChannel },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث قناة عدم النشاط: ${error.message}`);
    }
  }

  /**
   * تحديث مهلة عدم النشاط
   * @param {string} guildId - معرف الخادم
   * @param {string} timeout - مهلة عدم النشاط الجديدة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateInactiveTimeout(guildId, timeout) {
    try {
      const result = await PGupdate(Backup, 
        { inactive_Timeout: timeout },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث مهلة عدم النشاط: ${error.message}`);
    }
  }

  /**
   * تحديث قناة رسائل النظام
   * @param {string} guildId - معرف الخادم
   * @param {string} systemMessages - معرف قناة رسائل النظام الجديدة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateSystemMessages(guildId, systemMessages) {
    try {
      const result = await PGupdate(Backup, 
        { system_messages: systemMessages },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث قناة رسائل النظام: ${error.message}`);
    }
  }

  /**
   * تحديث الفئات
   * @param {string} guildId - معرف الخادم
   * @param {Array|Object} categories - الفئات الجديدة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateCategories(guildId, categories) {
    try {
      const categoriesData = typeof categories === 'string' ? categories : JSON.stringify(categories);
      const result = await PGupdate(Backup, 
        { category: categoriesData },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الفئات: ${error.message}`);
    }
  }

  /**
   * تحديث قنوات الدردشة
   * @param {string} guildId - معرف الخادم
   * @param {Array|Object} chatChannels - قنوات الدردشة الجديدة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateChatChannels(guildId, chatChannels) {
    try {
      const chatData = typeof chatChannels === 'string' ? chatChannels : JSON.stringify(chatChannels);
      const result = await PGupdate(Backup, 
        { chat: chatData },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث قنوات الدردشة: ${error.message}`);
    }
  }

  /**
   * تحديث القنوات الصوتية
   * @param {string} guildId - معرف الخادم
   * @param {Array|Object} voiceChannels - القنوات الصوتية الجديدة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateVoiceChannels(guildId, voiceChannels) {
    try {
      const voiceData = typeof voiceChannels === 'string' ? voiceChannels : JSON.stringify(voiceChannels);
      const result = await PGupdate(Backup, 
        { voice: voiceData },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث القنوات الصوتية: ${error.message}`);
    }
  }

  /**
   * تحديث قنوات الإعلانات
   * @param {string} guildId - معرف الخادم
   * @param {Array|Object} announcementChannels - قنوات الإعلانات الجديدة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateAnnouncementChannels(guildId, announcementChannels) {
    try {
      const announcementData = typeof announcementChannels === 'string' ? announcementChannels : JSON.stringify(announcementChannels);
      const result = await PGupdate(Backup, 
        { announcement: announcementData },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث قنوات الإعلانات: ${error.message}`);
    }
  }

  /**
   * تحديث قنوات المنصة
   * @param {string} guildId - معرف الخادم
   * @param {Array|Object} stageChannels - قنوات المنصة الجديدة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateStageChannels(guildId, stageChannels) {
    try {
      const stageData = typeof stageChannels === 'string' ? stageChannels : JSON.stringify(stageChannels);
      const result = await PGupdate(Backup, 
        { stage: stageData },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث قنوات المنصة: ${error.message}`);
    }
  }

  /**
   * تحديث الأدوار
   * @param {string} guildId - معرف الخادم
   * @param {Array|Object} roles - الأدوار الجديدة
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateRoles(guildId, roles) {
    try {
      const rolesData = typeof roles === 'string' ? roles : JSON.stringify(roles);
      const result = await PGupdate(Backup, 
        { roles: rolesData },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الأدوار: ${error.message}`);
    }
  }

  /**
   * تحديث الطابع الزمني
   * @param {string} guildId - معرف الخادم
   * @param {Date} newTimeStamp - الطابع الزمني الجديد
   * @returns {Promise<Object>} - النسخة الاحتياطية المحدثة
   */
  static async updateTimeStamp(guildId, newTimeStamp = new Date()) {
    try {
      const result = await PGupdate(Backup, 
        { TimeStamp: newTimeStamp },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الطابع الزمني: ${error.message}`);
    }
  }

  /**
   * حذف النسخة الاحتياطية
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteBackup(guildId) {
    try {
      const result = await PGdelete(Backup, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * حذف النسخ الاحتياطية القديمة
   * @param {number} daysOld - عدد الأيام (النسخ الأقدم من هذا العدد ستحذف)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteOldBackups(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await PGdelete(Backup, {
        where: {
          TimeStamp: {
            [Op.lt]: cutoffDate
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف النسخ الاحتياطية القديمة: ${error.message}`);
    }
  }

  /**
   * حذف النسخ الاحتياطية الفارغة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteEmptyBackups() {
    try {
      const result = await PGdelete(Backup, {
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { category: null },
                { category: '' }
              ]
            },
            {
              [Op.or]: [
                { chat: null },
                { chat: '' }
              ]
            },
            {
              [Op.or]: [
                { voice: null },
                { voice: '' }
              ]
            },
            {
              [Op.or]: [
                { roles: null },
                { roles: '' }
              ]
            }
          ]
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف النسخ الاحتياطية الفارغة: ${error.message}`);
    }
  }

  /**
   * حذف النسخ الاحتياطية بواسطة اسم الخادم
   * @param {string} serverName - اسم الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteBackupsByServerName(serverName) {
    try {
      const result = await PGdelete(Backup, {
        where: { server_name: serverName }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف النسخ الاحتياطية بواسطة اسم الخادم: ${error.message}`);
    }
  }

  /**
   * حذف جميع النسخ الاحتياطية
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAllBackups() {
    try {
      const result = await PGdelete(Backup, {});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع النسخ الاحتياطية: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات النسخ الاحتياطية
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getBackupsStats() {
    try {
      const allBackups = await Backup.findAll();
      const totalBackups = allBackups.length;
      
      // حساب النسخ التي تحتوي على بيانات مختلفة
      const backupsWithCategories = allBackups.filter(backup => 
        backup.category && backup.category.trim() !== ''
      ).length;
      
      const backupsWithChatChannels = allBackups.filter(backup => 
        backup.chat && backup.chat.trim() !== ''
      ).length;
      
      const backupsWithVoiceChannels = allBackups.filter(backup => 
        backup.voice && backup.voice.trim() !== ''
      ).length;
      
      const backupsWithRoles = allBackups.filter(backup => 
        backup.roles && backup.roles.trim() !== ''
      ).length;
      
      const backupsWithAnnouncements = allBackups.filter(backup => 
        backup.announcement && backup.announcement.trim() !== ''
      ).length;
      
      const backupsWithStageChannels = allBackups.filter(backup => 
        backup.stage && backup.stage.trim() !== ''
      ).length;
      
      // حساب النسخ الكاملة
      const completeBackups = allBackups.filter(backup => 
        backup.category && backup.category.trim() !== '' &&
        backup.chat && backup.chat.trim() !== '' &&
        backup.voice && backup.voice.trim() !== '' &&
        backup.roles && backup.roles.trim() !== ''
      ).length;
      
      // حساب النسخ الفارغة
      const emptyBackups = allBackups.filter(backup => 
        (!backup.category || backup.category.trim() === '') &&
        (!backup.chat || backup.chat.trim() === '') &&
        (!backup.voice || backup.voice.trim() === '') &&
        (!backup.roles || backup.roles.trim() === '')
      ).length;
      
      // حساب النسخ الحديثة (آخر 7 أيام)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentBackups = allBackups.filter(backup => 
        new Date(backup.TimeStamp) > weekAgo
      ).length;
      
      // حساب النسخ التي تحتوي على إعدادات عدم النشاط
      const backupsWithInactiveSettings = allBackups.filter(backup => 
        backup.inactive_ch || backup.inactive_Timeout
      ).length;
      
      // حساب النسخ التي تحتوي على رسائل النظام
      const backupsWithSystemMessages = allBackups.filter(backup => 
        backup.system_messages && backup.system_messages.trim() !== ''
      ).length;
      
      // حساب توزيع مهلة عدم النشاط
      const timeoutDistribution = {};
      allBackups.forEach(backup => {
        if (backup.inactive_Timeout) {
          timeoutDistribution[backup.inactive_Timeout] = (timeoutDistribution[backup.inactive_Timeout] || 0) + 1;
        }
      });
      
      // حساب متوسط طول اسم الخادم
      const backupsWithServerNames = allBackups.filter(backup => 
        backup.server_name && backup.server_name.trim() !== ''
      );
      const averageServerNameLength = backupsWithServerNames.length > 0 ? 
        (backupsWithServerNames.reduce((sum, backup) => sum + backup.server_name.length, 0) / backupsWithServerNames.length).toFixed(2) : 0;

      return {
        totalBackups,
        backupsWithCategories,
        backupsWithChatChannels,
        backupsWithVoiceChannels,
        backupsWithRoles,
        backupsWithAnnouncements,
        backupsWithStageChannels,
        completeBackups,
        emptyBackups,
        recentBackups,
        backupsWithInactiveSettings,
        backupsWithSystemMessages,
        averageServerNameLength: parseFloat(averageServerNameLength),
        timeoutDistribution,
        backupsWithServerNames: backupsWithServerNames.length,
        backupsWithoutServerNames: totalBackups - backupsWithServerNames.length
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات النسخ الاحتياطية: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود النسخة الاحتياطية
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - true إذا كانت النسخة الاحتياطية موجودة
   */
  static async existsBackup(guildId) {
    try {
      const backup = await this.getBackupByGuildId(guildId);
      return backup !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * التحقق من اكتمال النسخة الاحتياطية
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - true إذا كانت النسخة الاحتياطية مكتملة
   */
  static async isBackupComplete(guildId) {
    try {
      const backup = await this.getBackupByGuildId(guildId);
      
      if (!backup) {
        return false;
      }
      
      return !!(backup.category && backup.category.trim() !== '' &&
                backup.chat && backup.chat.trim() !== '' &&
                backup.voice && backup.voice.trim() !== '' &&
                backup.roles && backup.roles.trim() !== '');
    } catch (error) {
      throw new Error(`خطأ في التحقق من اكتمال النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * الحصول على حجم النسخة الاحتياطية
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object>} - معلومات حجم النسخة الاحتياطية
   */
  static async getBackupSize(guildId) {
    try {
      const backup = await this.getBackupByGuildId(guildId);
      
      if (!backup) {
        throw new Error('النسخة الاحتياطية غير موجودة');
      }
      
      const sizes = {
        serverName: backup.server_name ? backup.server_name.length : 0,
        categories: backup.category ? backup.category.length : 0,
        chatChannels: backup.chat ? backup.chat.length : 0,
        voiceChannels: backup.voice ? backup.voice.length : 0,
        announcementChannels: backup.announcement ? backup.announcement.length : 0,
        stageChannels: backup.stage ? backup.stage.length : 0,
        roles: backup.roles ? backup.roles.length : 0
      };
      
      const totalSize = Object.values(sizes).reduce((sum, size) => sum + size, 0);
      
      return {
        ...sizes,
        totalSize,
        guildId: backup.guild_id
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على حجم النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * إنشاء أو تحديث النسخة الاحتياطية
   * @param {string} guildId - معرف الخادم
   * @param {Object} backupData - بيانات النسخة الاحتياطية
   * @returns {Promise<Object>} - النسخة الاحتياطية المنشأة أو المحدثة
   */
  static async upsertBackup(guildId, backupData) {
    try {
      const existingBackup = await this.getBackupByGuildId(guildId);
      
      if (existingBackup) {
        // تحديث النسخة الاحتياطية الموجودة
        const result = await this.updateBackup(guildId, backupData);
        return result;
      } else {
        // إنشاء نسخة احتياطية جديدة
        const data = {
          guild_id: guildId,
          ...backupData
        };
        const result = await this.createBackup(data);
        return result;
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * استعادة النسخة الاحتياطية (إرجاع البيانات المحللة)
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object>} - بيانات النسخة الاحتياطية المحللة
   */
  static async restoreBackup(guildId) {
    try {
      const backup = await this.getBackupByGuildId(guildId);
      
      if (!backup) {
        throw new Error('النسخة الاحتياطية غير موجودة');
      }
      
      // تحليل البيانات المخزنة كـ JSON
      const restoredData = {
        guildId: backup.guild_id,
        serverName: backup.server_name,
        inactiveChannel: backup.inactive_ch,
        inactiveTimeout: backup.inactive_Timeout,
        systemMessages: backup.system_messages,
        categories: backup.category ? JSON.parse(backup.category) : null,
        chatChannels: backup.chat ? JSON.parse(backup.chat) : null,
        voiceChannels: backup.voice ? JSON.parse(backup.voice) : null,
        announcementChannels: backup.announcement ? JSON.parse(backup.announcement) : null,
        stageChannels: backup.stage ? JSON.parse(backup.stage) : null,
        roles: backup.roles ? JSON.parse(backup.roles) : null,
        timeStamp: backup.TimeStamp
      };
      
      return restoredData;
    } catch (error) {
      throw new Error(`خطأ في استعادة النسخة الاحتياطية: ${error.message}`);
    }
  }

  /**
   * مقارنة النسخ الاحتياطية
   * @param {string} guildId1 - معرف الخادم الأول
   * @param {string} guildId2 - معرف الخادم الثاني
   * @returns {Promise<Object>} - نتيجة المقارنة
   */
  static async compareBackups(guildId1, guildId2) {
    try {
      const backup1 = await this.getBackupByGuildId(guildId1);
      const backup2 = await this.getBackupByGuildId(guildId2);
      
      if (!backup1 || !backup2) {
        throw new Error('إحدى النسخ الاحتياطية أو كلاهما غير موجود');
      }
      
      const comparison = {
        serverName: {
          guild1: backup1.server_name,
          guild2: backup2.server_name,
          same: backup1.server_name === backup2.server_name
        },
        inactiveChannel: {
          guild1: backup1.inactive_ch,
          guild2: backup2.inactive_ch,
          same: backup1.inactive_ch === backup2.inactive_ch
        },
        inactiveTimeout: {
          guild1: backup1.inactive_Timeout,
          guild2: backup2.inactive_Timeout,
          same: backup1.inactive_Timeout === backup2.inactive_Timeout
        },
        systemMessages: {
          guild1: backup1.system_messages,
          guild2: backup2.system_messages,
          same: backup1.system_messages === backup2.system_messages
        },
        categories: {
          guild1: backup1.category,
          guild2: backup2.category,
          same: backup1.category === backup2.category
        },
        chatChannels: {
          guild1: backup1.chat,
          guild2: backup2.chat,
          same: backup1.chat === backup2.chat
        },
        voiceChannels: {
          guild1: backup1.voice,
          guild2: backup2.voice,
          same: backup1.voice === backup2.voice
        },
        roles: {
          guild1: backup1.roles,
          guild2: backup2.roles,
          same: backup1.roles === backup2.roles
        },
        timeStamp: {
          guild1: backup1.TimeStamp,
          guild2: backup2.TimeStamp,
          same: backup1.TimeStamp.getTime() === backup2.TimeStamp.getTime()
        }
      };
      
      // حساب نسبة التشابه
      const totalFields = Object.keys(comparison).length;
      const sameFields = Object.values(comparison).filter(field => field.same).length;
      const similarityPercentage = ((sameFields / totalFields) * 100).toFixed(2);
      
      return {
        comparison,
        similarityPercentage: parseFloat(similarityPercentage),
        totalFields,
        sameFields,
        differentFields: totalFields - sameFields
      };
    } catch (error) {
      throw new Error(`خطأ في مقارنة النسخ الاحتياطية: ${error.message}`);
    }
  }
}

export default BackupService;