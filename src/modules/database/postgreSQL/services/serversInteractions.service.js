import { ServersInteractions } from '../models/index.js';
import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة تفاعلات الخوادم
 * توفر عمليات CRUD لجدول servers_interactions
 */
class ServersInteractionsService {

  /**
   * إنشاء تفاعل جديد في الخادم
   * @param {Object} data - بيانات التفاعل
   * @returns {Promise<Object>} - التفاعل المُنشأ
   */
  static async createInteraction(data) {
    return await PGinsert(ServersInteractions, data);
  }

  /**
   * الحصول على جميع التفاعلات
   * @returns {Promise<Array>} - قائمة جميع التفاعلات
   */
  static async getAllInteractions() {
    return await ServersInteractions.findAll();
  }

  /**
   * الحصول على تفاعل بواسطة معرف المستخدم ومعرف الخادم
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object|null>} - التفاعل أو null
   */
  static async getInteractionByUserAndGuild(userId, guildId) {
    const results = await PGselectAll(ServersInteractions, {user_id: userId});
    return results.filter(item => item.guild_id === guildId);
  }

  /**
   * الحصول على جميع تفاعلات مستخدم معين
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Array>} - قائمة تفاعلات المستخدم
   */
  static async getInteractionsByUser(userId) {
    return await PGselectAll(ServersInteractions, {user_id: userId});
  }

  /**
   * الحصول على جميع تفاعلات خادم معين
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Array>} - قائمة تفاعلات الخادم
   */
  static async getInteractionsByGuild(guildId) {
    return await PGselectAll(ServersInteractions, {guild_id: guildId});
  }

  /**
   * الحصول على التفاعلات بناءً على مستوى الدردشة
   * @param {number} minLevel - الحد الأدنى للمستوى
   * @param {number} maxLevel - الحد الأقصى للمستوى (اختياري)
   * @returns {Promise<Array>} - قائمة التفاعلات
   */
  static async getInteractionsByChatLevel(minLevel, maxLevel = null) {
    const results = await PGselectAll(ServersInteractions, {chat_level: minLevel, Op: Op.gte});
    if (maxLevel !== null) {
      return results.filter(item => item.chat_level <= maxLevel);
    }
    return results;
  }

  /**
   * الحصول على التفاعلات بناءً على مستوى الصوت
   * @param {number} minLevel - الحد الأدنى للمستوى
   * @param {number} maxLevel - الحد الأقصى للمستوى (اختياري)
   * @returns {Promise<Array>} - قائمة التفاعلات
   */
  static async getInteractionsByVoiceLevel(minLevel, maxLevel = null) {
    const results = await PGselectAll(ServersInteractions, {voice_level: minLevel, Op: Op.gte});
    if (maxLevel !== null) {
      return results.filter(item => item.voice_level <= maxLevel);
    }
    return results;
  }

  /**
   * تحديث تفاعل موجود
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - التفاعل المحدث
   */
  static async updateInteraction(userId, guildId, updateData) {
    return await PGupdate(ServersInteractions, updateData, {
      user_id: userId,
      guild_id: guildId
    });
  }

  /**
   * تحديث نقاط الدردشة
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {number} points - النقاط الجديدة
   * @returns {Promise<Object>} - التفاعل المحدث
   */
  static async updateChatPoints(userId, guildId, points) {
    return await this.updateInteraction(userId, guildId, { chat_points: points });
  }

  /**
   * تحديث نقاط الصوت
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {number} points - النقاط الجديدة
   * @returns {Promise<Object>} - التفاعل المحدث
   */
  static async updateVoicePoints(userId, guildId, points) {
    return await this.updateInteraction(userId, guildId, { voice_points: points });
  }

  /**
   * تحديث مستوى الدردشة
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {number} level - المستوى الجديد
   * @returns {Promise<Object>} - التفاعل المحدث
   */
  static async updateChatLevel(userId, guildId, level) {
    return await this.updateInteraction(userId, guildId, { chat_level: level });
  }

  /**
   * تحديث مستوى الصوت
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {number} level - المستوى الجديد
   * @returns {Promise<Object>} - التفاعل المحدث
   */
  static async updateVoiceLevel(userId, guildId, level) {
    return await this.updateInteraction(userId, guildId, { voice_level: level });
  }

  /**
   * زيادة نقاط الدردشة
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {number} increment - مقدار الزيادة
   * @returns {Promise<Object>} - التفاعل المحدث
   */
  static async incrementChatPoints(userId, guildId, increment = 1) {
    const interaction = await this.getInteractionByUserAndGuild(userId, guildId);
    if (interaction && interaction.length > 0) {
      const currentPoints = interaction[0].chat_points || 0;
      return await this.updateChatPoints(userId, guildId, currentPoints + increment);
    }
    return null;
  }

  /**
   * زيادة نقاط الصوت
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @param {number} increment - مقدار الزيادة
   * @returns {Promise<Object>} - التفاعل المحدث
   */
  static async incrementVoicePoints(userId, guildId, increment = 1) {
    const interaction = await this.getInteractionByUserAndGuild(userId, guildId);
    if (interaction && interaction.length > 0) {
      const currentPoints = interaction[0].voice_points || 0;
      return await this.updateVoicePoints(userId, guildId, currentPoints + increment);
    }
    return null;
  }

  /**
   * حذف تفاعل
   * @param {string} userId - معرف المستخدم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteInteraction(userId, guildId) {
    return await PGdelete(ServersInteractions, {
      user_id: userId,
      guild_id: guildId
    });
  }

  /**
   * حذف جميع تفاعلات مستخدم معين
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteUserInteractions(userId) {
    return await PGdelete(ServersInteractions, {
      user_id: userId
    });
  }

  /**
   * حذف جميع تفاعلات خادم معين
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteGuildInteractions(guildId) {
    return await PGdelete(ServersInteractions, {
      guild_id: guildId
    });
  }

  /**
   * الحصول على إحصائيات التفاعلات
   * @param {string} guildId - معرف الخادم (اختياري)
   * @returns {Promise<Object>} - إحصائيات التفاعلات
   */
  static async getInteractionStats(guildId = null) {
    const interactions = guildId 
      ? await PGselectAll(ServersInteractions, {guild_id: guildId})
      : await ServersInteractions.findAll();
    
    const stats = {
      totalInteractions: interactions.length,
      totalChatPoints: 0,
      totalVoicePoints: 0,
      averageChatLevel: 0,
      averageVoiceLevel: 0,
      maxChatLevel: 0,
      maxVoiceLevel: 0
    };
    
    if (interactions.length > 0) {
      stats.totalChatPoints = interactions.reduce((sum, int) => sum + (int.chat_points || 0), 0);
      stats.totalVoicePoints = interactions.reduce((sum, int) => sum + (int.voice_points || 0), 0);
      stats.averageChatLevel = interactions.reduce((sum, int) => sum + (int.chat_level || 1), 0) / interactions.length;
      stats.averageVoiceLevel = interactions.reduce((sum, int) => sum + (int.voice_level || 1), 0) / interactions.length;
      stats.maxChatLevel = Math.max(...interactions.map(int => int.chat_level || 1));
      stats.maxVoiceLevel = Math.max(...interactions.map(int => int.voice_level || 1));
    }
    
    return stats;
  }
}

export default ServersInteractionsService;

// أمثلة على الاستخدام:
/*
// إنشاء تفاعل جديد
const newInteraction = await ServersInteractionsService.createInteraction({
  user_id: '123456789',
  guild_id: '987654321',
  chat_points: 10,
  voice_points: 5,
  chat_level: 2,
  voice_level: 1
});

// الحصول على تفاعل مستخدم في خادم معين
const userInteraction = await ServersInteractionsService.getInteractionByUserAndGuild('123456789', '987654321');

// تحديث نقاط الدردشة
const updatedInteraction = await ServersInteractionsService.updateChatPoints('123456789', '987654321', 15);

// زيادة نقاط الصوت
const incrementedInteraction = await ServersInteractionsService.incrementVoicePoints('123456789', '987654321', 3);

// الحصول على إحصائيات خادم معين
const guildStats = await ServersInteractionsService.getInteractionStats('987654321');
*/