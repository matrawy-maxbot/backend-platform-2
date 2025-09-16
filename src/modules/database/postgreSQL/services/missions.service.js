import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Missions } from '../models/index.js';
import { Op } from 'sequelize';

class MissionsService {
  /**
   * إنشاء مهمة جديدة
   * @param {Object} missionData - بيانات المهمة
   * @returns {Promise<Object>} - المهمة المنشأة
   */
  static async createMission(missionData) {
    try {
      const result = await PGinsert(Missions, missionData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المهمة: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع المهام
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة المهام
   */
  static async getAllMissions(options = {}) {
    try {
      const result = await Missions.findAll(options);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المهام: ${error.message}`);
    }
  }

  /**
   * الحصول على مهمة بواسطة المعرف
   * @param {string} id - معرف المهمة
   * @returns {Promise<Object|null>} - المهمة أو null
   */
  static async getMissionById(id) {
    try {
      const result = await PGselectAll(Missions, { id });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المهمة: ${error.message}`);
    }
  }

  /**
   * الحصول على المهام بواسطة نقاط الدردشة
   * @param {number} minChatPoints - الحد الأدنى لنقاط الدردشة
   * @param {number} maxChatPoints - الحد الأقصى لنقاط الدردشة (اختياري)
   * @returns {Promise<Array>} - قائمة المهام
   */
  static async getMissionsByChatPoints(minChatPoints, maxChatPoints = null) {
    try {
      // استخدام النموذج الأصلي للعمليات المعقدة
      const whereCondition = {
        chat_points: {
          [Op.gte]: minChatPoints
        }
      };

      if (maxChatPoints !== null) {
        whereCondition.chat_points[Op.lte] = maxChatPoints;
      }

      const result = await Missions.findAll({
        where: whereCondition
      });
      return result.map(mission => mission.toJSON());
    } catch (error) {
      throw new Error(`خطأ في الحصول على المهام بواسطة نقاط الدردشة: ${error.message}`);
    }
  }

  /**
   * الحصول على المهام بواسطة نقاط الصوت
   * @param {number} minVoicePoints - الحد الأدنى لنقاط الصوت
   * @param {number} maxVoicePoints - الحد الأقصى لنقاط الصوت (اختياري)
   * @returns {Promise<Array>} - قائمة المهام
   */
  static async getMissionsByVoicePoints(minVoicePoints, maxVoicePoints = null) {
    try {
      // استخدام النموذج الأصلي للعمليات المعقدة
      const whereCondition = {
        voice_points: {
          [Op.gte]: minVoicePoints
        }
      };

      if (maxVoicePoints !== null) {
        whereCondition.voice_points[Op.lte] = maxVoicePoints;
      }

      const result = await Missions.findAll({
        where: whereCondition
      });
      return result.map(mission => mission.toJSON());
    } catch (error) {
      throw new Error(`خطأ في الحصول على المهام بواسطة نقاط الصوت: ${error.message}`);
    }
  }

  /**
   * الحصول على المهام بواسطة نوع المكافأة
   * @param {string} rewardType - نوع المكافأة (crown_rewards, diamond_rewards, star_rewards, support_rewards, programmer_rewards, youtube_rewards)
   * @param {boolean} hasReward - هل لديها مكافأة أم لا
   * @returns {Promise<Array>} - قائمة المهام
   */
  static async getMissionsByRewardType(rewardType, hasReward = true) {
    try {
      const validRewardTypes = [
        'crown_rewards', 'diamond_rewards', 'star_rewards', 
        'support_rewards', 'programmer_rewards', 'youtube_rewards'
      ];
      
      if (!validRewardTypes.includes(rewardType)) {
        throw new Error('نوع المكافأة غير صحيح');
      }

      const result = await PGselectAll(Missions, { [rewardType]: hasReward });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المهام بواسطة نوع المكافأة: ${error.message}`);
    }
  }

  /**
   * الحصول على المهام النشطة
   * @returns {Promise<Array>} - قائمة المهام النشطة
   */
  static async getActiveMissions() {
    try {
      // استخدام النموذج الأصلي للعمليات المعقدة
      const result = await Missions.findAll({
        where: {
          active_mission: {
            [Op.ne]: null
          }
        }
      });
      return result.map(mission => mission.toJSON());
    } catch (error) {
      throw new Error(`خطأ في الحصول على المهام النشطة: ${error.message}`);
    }
  }

  /**
   * تحديث مهمة
   * @param {string} id - معرف المهمة
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async updateMission(id, updateData) {
    try {
      const result = await PGupdate(Missions, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المهمة: ${error.message}`);
    }
  }

  /**
   * تحديث نقاط المهمة
   * @param {string} id - معرف المهمة
   * @param {number} chatPoints - نقاط الدردشة الجديدة
   * @param {number} voicePoints - نقاط الصوت الجديدة
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async updateMissionPoints(id, chatPoints, voicePoints) {
    try {
      const updateData = {
        chat_points: chatPoints,
        voice_points: voicePoints
      };
      const result = await PGupdate(Missions, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث نقاط المهمة: ${error.message}`);
    }
  }

  /**
   * تحديث المهام المكتملة
   * @param {string} id - معرف المهمة
   * @param {string} passedMissions - المهام المكتملة
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async updatePassedMissions(id, passedMissions) {
    try {
      const updateData = {
        passed_missions: passedMissions
      };
      const result = await PGupdate(Missions, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المهام المكتملة: ${error.message}`);
    }
  }

  /**
   * تحديث المهمة النشطة
   * @param {string} id - معرف المهمة
   * @param {string} activeMission - المهمة النشطة
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async updateActiveMission(id, activeMission) {
    try {
      const updateData = {
        active_mission: activeMission
      };
      const result = await PGupdate(Missions, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المهمة النشطة: ${error.message}`);
    }
  }

  /**
   * تحديث المكافآت
   * @param {string} id - معرف المهمة
   * @param {Object} rewardsData - بيانات المكافآت
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async updateRewards(id, rewardsData) {
    try {
      const validRewardFields = [
        'crown_rewards', 'diamond_rewards', 'star_rewards', 
        'support_rewards', 'programmer_rewards', 'youtube_rewards'
      ];
      
      const updateData = {};
      for (const [key, value] of Object.entries(rewardsData)) {
        if (validRewardFields.includes(key)) {
          updateData[key] = value;
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error('لا توجد حقول مكافآت صحيحة للتحديث');
      }

      const result = await PGupdate(Missions, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المكافآت: ${error.message}`);
    }
  }

  /**
   * تفعيل مكافأة معينة
   * @param {string} id - معرف المهمة
   * @param {string} rewardType - نوع المكافأة
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async activateReward(id, rewardType) {
    try {
      const validRewardTypes = [
        'crown_rewards', 'diamond_rewards', 'star_rewards', 
        'support_rewards', 'programmer_rewards', 'youtube_rewards'
      ];
      
      if (!validRewardTypes.includes(rewardType)) {
        throw new Error('نوع المكافأة غير صحيح');
      }

      const updateData = { [rewardType]: true };
      const result = await PGupdate(Missions, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تفعيل المكافأة: ${error.message}`);
    }
  }

  /**
   * إلغاء تفعيل مكافأة معينة
   * @param {string} id - معرف المهمة
   * @param {string} rewardType - نوع المكافأة
   * @returns {Promise<Object>} - المهمة المحدثة
   */
  static async deactivateReward(id, rewardType) {
    try {
      const validRewardTypes = [
        'crown_rewards', 'diamond_rewards', 'star_rewards', 
        'support_rewards', 'programmer_rewards', 'youtube_rewards'
      ];
      
      if (!validRewardTypes.includes(rewardType)) {
        throw new Error('نوع المكافأة غير صحيح');
      }

      const updateData = { [rewardType]: false };
      const result = await PGupdate(Missions, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في إلغاء تفعيل المكافأة: ${error.message}`);
    }
  }

  /**
   * حذف مهمة
   * @param {string} id - معرف المهمة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteMission(id) {
    try {
      const result = await PGdelete(Missions, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المهمة: ${error.message}`);
    }
  }

  /**
   * حذف المهام بواسطة نطاق نقاط الدردشة
   * @param {number} minChatPoints - الحد الأدنى لنقاط الدردشة
   * @param {number} maxChatPoints - الحد الأقصى لنقاط الدردشة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteMissionsByChatPointsRange(minChatPoints, maxChatPoints) {
    try {
      const result = await PGdelete(Missions, {
        where: {
          chat_points: {
            [Op.between]: [minChatPoints, maxChatPoints]
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المهام بواسطة نطاق نقاط الدردشة: ${error.message}`);
    }
  }

  /**
   * حذف المهام غير النشطة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteInactiveMissions() {
    try {
      const result = await PGdelete(Missions, {
        where: {
          active_mission: {
            [Op.is]: null
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المهام غير النشطة: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات المهام
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getMissionsStats() {
    try {
      // استخدام النموذج الأصلي للحصول على جميع الصفوف بدون فلتر
      const allMissions = await Missions.findAll();
      const totalMissions = allMissions.length;
      
      // حساب المهام النشطة
      const activeMissions = allMissions.filter(mission => mission.active_mission !== null).length;
      
      // حساب توزيع المكافآت
      const rewardStats = {
        crown_rewards: allMissions.filter(m => m.crown_rewards).length,
        diamond_rewards: allMissions.filter(m => m.diamond_rewards).length,
        star_rewards: allMissions.filter(m => m.star_rewards).length,
        support_rewards: allMissions.filter(m => m.support_rewards).length,
        programmer_rewards: allMissions.filter(m => m.programmer_rewards).length,
        youtube_rewards: allMissions.filter(m => m.youtube_rewards).length
      };

      // حساب متوسط النقاط
      const avgChatPoints = allMissions.reduce((sum, m) => sum + m.chat_points, 0) / totalMissions || 0;
      const avgVoicePoints = allMissions.reduce((sum, m) => sum + m.voice_points, 0) / totalMissions || 0;

      return {
        totalMissions,
        activeMissions,
        inactiveMissions: totalMissions - activeMissions,
        rewardStats,
        avgChatPoints: Math.round(avgChatPoints * 100) / 100,
        avgVoicePoints: Math.round(avgVoicePoints * 100) / 100
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات المهام: ${error.message}`);
    }
  }
}

export default MissionsService;