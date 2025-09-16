import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Votes } from '../models/index.js';

/**
 * خدمة التصويتات (Votes Service)
 * تحتوي على جميع العمليات المتعلقة بإدارة بيانات التصويتات
 */
class VotesService {
  /**
   * إنشاء تصويت جديد
   * @param {Object} voteData - بيانات التصويت
   * @returns {Promise<Object>} - التصويت المُنشأ
   */
  static async createVote(voteData) {
  try {
    const result = await PGinsert(Votes, voteData);
    return result;
  } catch (error) {
    console.error('خطأ في إنشاء التصويت:', error);
    throw error;
  }
};

  /**
   * جلب جميع التصويتات
   * @returns {Promise<Array>} - قائمة بجميع التصويتات
   */
  static async getAllVotes() {
  try {
    const result = await Votes.findAll();
    return result;
  } catch (error) {
    console.error('خطأ في جلب التصويتات:', error);
    throw error;
  }
};

  /**
   * جلب تصويت بواسطة المعرف
   * @param {number} id - معرف التصويت
   * @returns {Promise<Object|null>} - التصويت أو null
   */
  static async getVoteById(id) {
  try {
    const result = await PGselectAll(Votes, { id });
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('خطأ في جلب التصويت بالمعرف:', error);
    throw error;
  }
};

  /**
   * تحديث تصويت
   * @param {number} id - معرف التصويت
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - التصويت المحدث
   */
  static async updateVote(id, updateData) {
  try {
    const result = await PGupdate(Votes, updateData, { id });
    return result;
  } catch (error) {
    console.error('خطأ في تحديث التصويت:', error);
    throw error;
  }
};

/**
   * حذف تصويت
   * @param {number} id - معرف التصويت
   * @returns {Promise<boolean>} - true إذا تم الحذف بنجاح
   */
  static async deleteVote(id) {
  try {
    const result = await PGdelete(Votes, { id });
    return result;
  } catch (error) {
    console.error('خطأ في حذف التصويت:', error);
    throw error;
  }
};

  /**
   * جلب تصويت بواسطة معرف الخادم
   * @param {string} guildID - معرف الخادم
   * @returns {Promise<Object|null>} - التصويت أو null
   */
  static async getVoteByGuildId(guildID) {
  try {
    const result = await PGselectAll(Votes, { guildID });
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('خطأ في جلب التصويت بمعرف الخادم:', error);
    throw error;
  }
};

  /**
   * جلب تصويت بواسطة معرف القناة
   * @param {string} channelID - معرف القناة
   * @returns {Promise<Object|null>} - التصويت أو null
   */
  static async getVoteByChannelId(channelID) {
  try {
    const result = await PGselectAll(Votes, { channelID });
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('خطأ في جلب التصويت بمعرف القناة:', error);
    throw error;
  }
};

  /**
   * جلب تصويت بواسطة معرف الرسالة
   * @param {string} messageID - معرف الرسالة
   * @returns {Promise<Object|null>} - التصويت أو null
   */
  static async getVoteByMessageId(messageID) {
  try {
    const result = await PGselectAll(Votes, { messageID });
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('خطأ في جلب التصويت بمعرف الرسالة:', error);
    throw error;
  }
};

  /**
   * جلب تصويت بواسطة معرف رسالة الترتيب
   * @param {string} rankmessageID - معرف رسالة الترتيب
   * @returns {Promise<Object|null>} - التصويت أو null
   */
  static async getVoteByRankMessageId(rankmessageID) {
  try {
    const result = await PGselectAll(Votes, { rankmessageID });
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('خطأ في جلب التصويت بمعرف رسالة الترتيب:', error);
    throw error;
  }
};

  /**
   * جلب تصويت بواسطة معرف الخادم والقناة
   * @param {string} guildID - معرف الخادم
   * @param {string} channelID - معرف القناة
   * @returns {Promise<Object|null>} - التصويت أو null
   */
  static async getVoteByGuildAndChannel(guildID, channelID) {
  try {
    const guildResults = await PGselectAll(Votes, { guildID });
    const filtered = guildResults.find(vote => vote.channelID === channelID);
    return filtered || null;
  } catch (error) {
    console.error('خطأ في جلب التصويت بمعرف الخادم والقناة:', error);
    throw error;
  }
};

/**
   * البحث في التصويتات
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Promise<Array>} - قائمة بالتصويتات المطابقة
   */
  static async searchVotes(searchTerm) {
  try {
    const { Op } = await import('sequelize');
    const result = await Votes.findAll({
      where: {
        [Op.or]: [
          { guildID: { [Op.like]: `%${searchTerm}%` } },
          { channelID: { [Op.like]: `%${searchTerm}%` } },
          { messageID: { [Op.like]: `%${searchTerm}%` } },
          { rankmessageID: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });
    return result;
  } catch (error) {
    console.error('خطأ في البحث في التصويتات:', error);
    throw error;
  }
};

  /**
   * تحديث معرف الرسالة
   * @param {number} id - معرف التصويت
   * @param {string} messageID - معرف الرسالة الجديد
   * @returns {Promise<Object>} - التصويت المحدث
   */
  static async updateMessageId(id, messageID) {
  try {
    const result = await PGupdate(Votes, { messageID }, { id });
    return result;
  } catch (error) {
    console.error('خطأ في تحديث معرف الرسالة:', error);
    throw error;
  }
};

  /**
   * تحديث معرف رسالة الترتيب
   * @param {number} id - معرف التصويت
   * @param {string} rankmessageID - معرف رسالة الترتيب الجديد
   * @returns {Promise<Object>} - التصويت المحدث
   */
  static async updateRankMessageId(id, rankmessageID) {
  try {
    const result = await PGupdate(Votes, { rankmessageID }, { id });
    return result;
  } catch (error) {
    console.error('خطأ في تحديث معرف رسالة الترتيب:', error);
    throw error;
  }
};

  /**
   * تحديث معرف القناة
   * @param {number} id - معرف التصويت
   * @param {string} channelID - معرف القناة الجديد
   * @returns {Promise<Object>} - التصويت المحدث
   */
  static async updateChannelId(id, channelID) {
  try {
    const result = await PGupdate(Votes, { channelID }, { id });
    return result;
  } catch (error) {
    console.error('خطأ في تحديث معرف القناة:', error);
    throw error;
  }
};

  /**
   * التحقق من وجود تصويت
   * @param {number} id - معرف التصويت
   * @returns {Promise<boolean>} - true إذا كان التصويت موجود
   */
  static async checkVoteExists(id) {
  try {
    const result = await PGselectAll(Votes, { id });
    return result.length > 0;
  } catch (error) {
    console.error('خطأ في التحقق من وجود التصويت:', error);
    throw error;
  }
};

/**
   * التحقق من وجود تصويت بواسطة معرف الخادم
   * @param {string} guildID - معرف الخادم
   * @returns {Promise<boolean>} - true إذا كان التصويت موجود
   */
  static async checkVoteExistsByGuildId(guildID) {
  try {
    const result = await PGselectAll(Votes, { guildID });
    return result.length > 0;
  } catch (error) {
    console.error('خطأ في التحقق من وجود التصويت بمعرف الخادم:', error);
    throw error;
  }
};

/**
   * حذف تصويت بواسطة معرف الخادم
   * @param {string} guildID - معرف الخادم
   * @returns {Promise<boolean>} - true إذا تم الحذف بنجاح
   */
  static async deleteVoteByGuildId(guildID) {
  try {
    const result = await PGdelete(Votes, { guildID });
    return result;
  } catch (error) {
    console.error('خطأ في حذف التصويت بمعرف الخادم:', error);
    throw error;
  }
};

  /**
   * الحصول على إحصائيات التصويتات
   * @returns {Promise<Object>} - إحصائيات التصويتات
   */
  static async getVoteStats() {
  try {
    const allVotes = await Votes.findAll();
    
    return {
      total: allVotes.length,
      uniqueGuilds: [...new Set(allVotes.map(vote => vote.guildID))].length,
      uniqueChannels: [...new Set(allVotes.map(vote => vote.channelID))].length
    };
  } catch (error) {
    console.error('خطأ في الحصول على إحصائيات التصويتات:', error);
    throw error;
  }
};

  /**
   * إنشاء أو تحديث تصويت
   * @param {Object} voteData - بيانات التصويت
   * @returns {Promise<Object>} - التصويت المُنشأ أو المحدث
   */
  static async createOrUpdateVote(voteData) {
  try {
    const { guildID } = voteData;
    const existingVote = await getVoteByGuildId(guildID);
    
    if (existingVote) {
      return await updateVote(existingVote.id, voteData);
    } else {
      return await createVote(voteData);
    }
  } catch (error) {
    console.error('خطأ في إنشاء أو تحديث التصويت:', error);
    throw error;
  }
  }
}

export default VotesService;