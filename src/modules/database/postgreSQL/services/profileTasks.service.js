import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { ProfileTasks } from '../models/index.js';
import { Op } from 'sequelize';

class ProfileTasksService {
  /**
   * إنشاء مهمة ملف شخصي جديدة
   * @param {Object} profileTaskData - بيانات المهمة
   * @returns {Promise<Object>} - المهمة المنشأة
   */
  static async createProfileTask(profileTaskData) {
    try {
      const result = await PGinsert(ProfileTasks, profileTaskData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء مهمة الملف الشخصي: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع مهام الملفات الشخصية
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة المهام
   */
  static async getAllProfileTasks(options = {}) {
    try {
      const result = await ProfileTasks.findAll(options);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على مهام الملفات الشخصية: ${error.message}`);
    }
  }

  /**
   * الحصول على مهمة ملف شخصي بواسطة المعرف
   * @param {number} id - معرف المهمة
   * @returns {Promise<Object|null>} - المهمة أو null
   */
  static async getProfileTaskById(id) {
    try {
      const result = await PGselectAll(ProfileTasks, { id });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على مهمة الملف الشخصي: ${error.message}`);
    }
  }

  /**
   * الحصول على مهمة ملف شخصي بواسطة معرف الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object|null>} - المهمة أو null
   */
  static async getProfileTaskByGuildId(guildId) {
    try {
      const result = await PGselectAll(ProfileTasks, { guild_id: guildId });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على مهمة الملف الشخصي للخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على مهام الملفات الشخصية بواسطة معرف الملف الشخصي
   * @param {string} profileId - معرف الملف الشخصي
   * @returns {Promise<Array>} - قائمة المهام
   */
  static async getProfileTasksByProfileId(profileId) {
    try {
      const result = await PGselectAll(ProfileTasks, { profile_id: profileId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على مهام الملف الشخصي: ${error.message}`);
    }
  }

  /**
   * الحصول على مهام الملفات الشخصية بواسطة Shard
   * @param {number} shardValue - قيمة Shard
   * @param {string} shardType - نوع Shard (bd_shard, sm_shard, so_shard, sb_shard, sv_shard, si_shard)
   * @returns {Promise<Array>} - قائمة المهام
   */
  static async getProfileTasksByShard(shardValue, shardType = 'bd_shard') {
    try {
      const validShardTypes = ['bd_shard', 'sm_shard', 'so_shard', 'sb_shard', 'sv_shard', 'si_shard'];
      if (!validShardTypes.includes(shardType)) {
        throw new Error('نوع Shard غير صحيح');
      }

      const result = await PGselectAll(ProfileTasks, { [shardType]: shardValue });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على مهام الملفات الشخصية بواسطة Shard: ${error.message}`);
    }
  }

  /**
   * تحديث مهمة ملف شخصي
   * @param {number} id - معرف المهمة
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async updateProfileTask(id, updateData) {
    try {
      console.log('updateData ::---:: ', id, updateData);
      const result = await PGupdate(ProfileTasks, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث مهمة الملف الشخصي: ${error.message}`);
    }
  }

  /**
   * تحديث مهمة ملف شخصي بواسطة معرف الخادم
   * @param {string} guildId - معرف الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async updateProfileTaskByGuildId(guildId, updateData) {
    try {
      const result = await PGupdate(ProfileTasks, updateData, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث مهمة الملف الشخصي للخادم: ${error.message}`);
    }
  }

  /**
   * تحديث قنوات المهمة
   * @param {number} id - معرف المهمة
   * @param {string} profileChId - معرف قناة الملف الشخصي
   * @param {string} tasksChId - معرف قناة المهام
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async updateTaskChannels(id, profileChId, tasksChId) {
    try {
      const updateData = {
        profile_ch_id: profileChId,
        tasks_ch_id: tasksChId
      };
      const result = await PGupdate(ProfileTasks, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث قنوات المهمة: ${error.message}`);
    }
  }

  /**
   * تحديث قيم Shard
   * @param {number} id - معرف المهمة
   * @param {Object} shardData - بيانات Shard
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async updateShardValues(id, shardData) {
    try {
      const validShardFields = ['bd_shard', 'sm_shard', 'so_shard', 'sb_shard', 'sv_shard', 'si_shard'];
      const updateData = {};
      
      for (const [key, value] of Object.entries(shardData)) {
        if (validShardFields.includes(key)) {
          updateData[key] = value;
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error('لا توجد حقول Shard صحيحة للتحديث');
      }

      const result = await PGupdate(ProfileTasks, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث قيم Shard: ${error.message}`);
    }
  }

  /**
   * حذف مهمة ملف شخصي
   * @param {number} id - معرف المهمة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteProfileTask(id) {
    try {
      const result = await PGdelete(ProfileTasks, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف مهمة الملف الشخصي: ${error.message}`);
    }
  }

  /**
   * حذف مهمة ملف شخصي بواسطة معرف الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteProfileTaskByGuildId(guildId) {
    try {
      const result = await PGdelete(ProfileTasks, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف مهمة الملف الشخصي للخادم: ${error.message}`);
    }
  }

  /**
   * حذف جميع مهام الملفات الشخصية لملف شخصي معين
   * @param {string} profileId - معرف الملف الشخصي
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteProfileTasksByProfileId(profileId) {
    try {
      const result = await PGdelete(ProfileTasks, {
        where: { profile_id: profileId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف مهام الملف الشخصي: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات مهام الملفات الشخصية
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getProfileTasksStats() {
    try {
      const allTasks = await ProfileTasks.findAll();
      const totalTasks = allTasks.length;
      
      // حساب توزيع Shards
      const shardDistribution = {
        bd_shard: {},
        sm_shard: {},
        so_shard: {},
        sb_shard: {},
        sv_shard: {},
        si_shard: {}
      };

      allTasks.forEach(task => {
        Object.keys(shardDistribution).forEach(shardType => {
          const shardValue = task[shardType];
          if (shardDistribution[shardType][shardValue]) {
            shardDistribution[shardType][shardValue]++;
          } else {
            shardDistribution[shardType][shardValue] = 1;
          }
        });
      });

      return {
        totalTasks,
        shardDistribution
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات مهام الملفات الشخصية: ${error.message}`);
    }
  }
}

export default ProfileTasksService;