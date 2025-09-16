import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Areply } from '../models/index.js';
import { Op } from 'sequelize';

class AreplyService {
  /**
   * إنشاء رد تلقائي جديد
   * @param {Object} replyData - بيانات الرد التلقائي
   * @returns {Promise<Object>} - الرد التلقائي المنشأ
   */
  static async createReply(replyData) {
    try {
      const result = await PGinsert(Areply, replyData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الرد التلقائي: ${error.message}`);
    }
  }

  /**
   * إنشاء رد تلقائي جديد مع البيانات الأساسية
   * @param {string} guildId - معرف الخادم
   * @param {string} message - الرسالة المحفزة
   * @param {string} reply - الرد التلقائي
   * @returns {Promise<Object>} - الرد التلقائي المنشأ
   */
  static async createAutoReply(guildId, message, reply) {
    try {
      const data = {
        guild_id: guildId,
        message: message,
        reply: reply
      };
      
      const result = await PGinsert(Areply, data);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الرد التلقائي: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع الردود التلقائية
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async getAllReplies(options = {}) {
    try {
      const defaultOptions = {
        order: [['createdAt', 'DESC']],
        ...options
      };
      
      const result = await Areply.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الردود التلقائية: ${error.message}`);
    }
  }

  /**
   * الحصول على رد تلقائي بواسطة معرف القسم
   * @param {string} divId - معرف القسم
   * @returns {Promise<Object|null>} - الرد التلقائي أو null
   */
  static async getReplyById(divId) {
    try {
      const result = await PGselectAll(Areply, {div_id: divId});
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الرد التلقائي: ${error.message}`);
    }
  }

  /**
   * الحصول على الردود التلقائية للخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async getRepliesByGuildId(guildId) {
    try {
      const result = await PGselectAll(Areply, {guild_id: guildId});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على ردود الخادم التلقائية: ${error.message}`);
    }
  }

  /**
   * البحث في الرسائل المحفزة
   * @param {string} searchText - النص المراد البحث عنه
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async searchByMessage(searchText) {
    try {
      const result = await PGselectAll(Areply, {message: `%${searchText}%`, Op: Op.like});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في الرسائل المحفزة: ${error.message}`);
    }
  }

  /**
   * البحث في الردود
   * @param {string} searchText - النص المراد البحث عنه
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async searchByReply(searchText) {
    try {
      const result = await PGselectAll(Areply, {reply: `%${searchText}%`, Op: Op.like});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في الردود: ${error.message}`);
    }
  }

  /**
   * البحث في الرسائل والردود
   * @param {string} searchText - النص المراد البحث عنه
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async searchInBoth(searchText) {
    try {
      const result = await Areply.findAll({
        where: {
          [Op.or]: [
            {
              message: {
                [Op.like]: `%${searchText}%`
              }
            },
            {
              reply: {
                [Op.like]: `%${searchText}%`
              }
            }
          ]
        },
        order: [['createdAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في الرسائل والردود: ${error.message}`);
    }
  }

  /**
   * البحث عن رد تلقائي بالرسالة المحددة في خادم معين
   * @param {string} guildId - معرف الخادم
   * @param {string} message - الرسالة المحفزة
   * @returns {Promise<Object|null>} - الرد التلقائي أو null
   */
  static async findReplyByMessage(guildId, message) {
    try {
      const result = await Areply.findAll({
        where: {
          guild_id: guildId,
          message: {
            [Op.like]: `%${message}%`
          }
        },
        order: [['createdAt', 'DESC']],
        limit: 1
      });
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في البحث عن الرد التلقائي: ${error.message}`);
    }
  }

  /**
   * البحث عن رد تلقائي بالرسالة المطابقة تماماً
   * @param {string} guildId - معرف الخادم
   * @param {string} message - الرسالة المحفزة
   * @returns {Promise<Object|null>} - الرد التلقائي أو null
   */
  static async findExactReply(guildId, message) {
    try {
      // البحث أولاً بمعرف الخادم
      const guildReplies = await PGselectAll(Areply, {guild_id: guildId});
      
      // ثم البحث في النتائج عن الرسالة المطابقة
      const exactReply = guildReplies.find(reply => reply.message === message);
      
      return exactReply || null;
    } catch (error) {
      throw new Error(`خطأ في البحث عن الرد التلقائي المطابق: ${error.message}`);
    }
  }

  /**
   * الحصول على الردود التلقائية بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async getRepliesByDateRange(startDate, endDate) {
    try {
      const result = await PGselectAll(Areply, {createdAt: [startDate, endDate], Op: Op.between});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الردود التلقائية بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على أحدث الردود التلقائية
   * @param {number} limit - عدد الردود المطلوب إرجاعها
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async getRecentReplies(limit = 10) {
    try {
      const result = await Areply.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحدث الردود التلقائية: ${error.message}`);
    }
  }

  /**
   * الحصول على الردود التلقائية التي تحتوي على رسائل فقط
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async getRepliesWithMessages() {
    try {
      const result = await Areply.findAll({
        where: {
          message: {
            [Op.ne]: null,
            [Op.ne]: ''
          }
        },
        order: [['createdAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الردود التلقائية التي تحتوي على رسائل: ${error.message}`);
    }
  }

  /**
   * الحصول على الردود التلقائية التي تحتوي على ردود فقط
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async getRepliesWithReplies() {
    try {
      const result = await Areply.findAll({
        where: {
          reply: {
            [Op.ne]: null,
            [Op.ne]: ''
          }
        },
        order: [['createdAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الردود التلقائية التي تحتوي على ردود: ${error.message}`);
    }
  }

  /**
   * الحصول على الردود التلقائية الفارغة
   * @returns {Promise<Array>} - قائمة الردود التلقائية
   */
  static async getEmptyReplies() {
    try {
      const result = await Areply.findAll({
        where: {
          [Op.or]: [
            { message: null },
            { message: '' },
            { reply: null },
            { reply: '' }
          ]
        },
        order: [['createdAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على الردود التلقائية الفارغة: ${error.message}`);
    }
  }

  /**
   * تحديث الرد التلقائي
   * @param {string} divId - معرف القسم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - الرد التلقائي المحدث
   */
  static async updateReply(divId, updateData) {
    try {
      const result = await PGupdate(Areply, updateData, {
        where: { div_id: divId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الرد التلقائي: ${error.message}`);
    }
  }

  /**
   * تحديث الرسالة المحفزة
   * @param {string} divId - معرف القسم
   * @param {string} newMessage - الرسالة الجديدة
   * @returns {Promise<Object>} - الرد التلقائي المحدث
   */
  static async updateMessage(divId, newMessage) {
    try {
      const result = await PGupdate(Areply, 
        { message: newMessage },
        { where: { div_id: divId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الرسالة المحفزة: ${error.message}`);
    }
  }

  /**
   * تحديث الرد
   * @param {string} divId - معرف القسم
   * @param {string} newReply - الرد الجديد
   * @returns {Promise<Object>} - الرد التلقائي المحدث
   */
  static async updateReplyText(divId, newReply) {
    try {
      const result = await PGupdate(Areply, 
        { reply: newReply },
        { where: { div_id: divId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الرد: ${error.message}`);
    }
  }

  /**
   * تحديث الرسالة والرد معاً
   * @param {string} divId - معرف القسم
   * @param {string} newMessage - الرسالة الجديدة
   * @param {string} newReply - الرد الجديد
   * @returns {Promise<Object>} - الرد التلقائي المحدث
   */
  static async updateMessageAndReply(divId, newMessage, newReply) {
    try {
      const result = await PGupdate(Areply, 
        { 
          message: newMessage,
          reply: newReply 
        },
        { where: { div_id: divId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث الرسالة والرد: ${error.message}`);
    }
  }

  /**
   * تحديث جميع ردود الخادم
   * @param {string} guildId - معرف الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - نتيجة التحديث
   */
  static async updateGuildReplies(guildId, updateData) {
    try {
      const result = await PGupdate(Areply, updateData, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث ردود الخادم: ${error.message}`);
    }
  }

  /**
   * حذف الرد التلقائي
   * @param {string} divId - معرف القسم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteReply(divId) {
    try {
      const result = await PGdelete(Areply, {
        where: { div_id: divId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الرد التلقائي: ${error.message}`);
    }
  }

  /**
   * حذف جميع ردود الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteGuildReplies(guildId) {
    try {
      const result = await PGdelete(Areply, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف ردود الخادم: ${error.message}`);
    }
  }

  /**
   * حذف الردود التلقائية الفارغة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteEmptyReplies() {
    try {
      const result = await PGdelete(Areply, {
        where: {
          [Op.or]: [
            { message: null },
            { message: '' },
            { reply: null },
            { reply: '' }
          ]
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الردود التلقائية الفارغة: ${error.message}`);
    }
  }

  /**
   * حذف الردود التلقائية القديمة
   * @param {number} daysOld - عدد الأيام (الردود الأقدم من هذا العدد ستحذف)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteOldReplies(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await PGdelete(Areply, {
        where: {
          createdAt: {
            [Op.lt]: cutoffDate
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الردود التلقائية القديمة: ${error.message}`);
    }
  }

  /**
   * حذف الردود التلقائية بواسطة الرسالة
   * @param {string} message - الرسالة المحفزة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteByMessage(message) {
    try {
      const result = await PGdelete(Areply, {
        where: { message: message }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الردود التلقائية بواسطة الرسالة: ${error.message}`);
    }
  }

  /**
   * حذف جميع الردود التلقائية
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAllReplies() {
    try {
      const result = await PGdelete(Areply, {});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع الردود التلقائية: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الردود التلقائية
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getRepliesStats() {
    try {
      const allReplies = await Areply.findAll({});
      const totalReplies = allReplies.length;
      
      // حساب الردود التي تحتوي على رسائل
      const repliesWithMessages = allReplies.filter(reply => 
        reply.message && reply.message.trim() !== ''
      ).length;
      
      // حساب الردود التي تحتوي على ردود
      const repliesWithReplies = allReplies.filter(reply => 
        reply.reply && reply.reply.trim() !== ''
      ).length;
      
      // حساب الردود الفارغة
      const emptyReplies = allReplies.filter(reply => 
        (!reply.message || reply.message.trim() === '') && 
        (!reply.reply || reply.reply.trim() === '')
      ).length;
      
      // حساب عدد الخوادم الفريدة
      const uniqueGuilds = new Set(allReplies.map(reply => reply.guild_id)).size;
      
      // حساب الردود الحديثة (آخر 7 أيام)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentReplies = allReplies.filter(reply => 
        new Date(reply.createdAt) > weekAgo
      ).length;
      
      // حساب متوسط طول الرسائل
      const messagesWithContent = allReplies.filter(reply => 
        reply.message && reply.message.trim() !== ''
      );
      const averageMessageLength = messagesWithContent.length > 0 ? 
        (messagesWithContent.reduce((sum, reply) => sum + reply.message.length, 0) / messagesWithContent.length).toFixed(2) : 0;
      
      // حساب متوسط طول الردود
      const repliesWithContent = allReplies.filter(reply => 
        reply.reply && reply.reply.trim() !== ''
      );
      const averageReplyLength = repliesWithContent.length > 0 ? 
        (repliesWithContent.reduce((sum, reply) => sum + reply.reply.length, 0) / repliesWithContent.length).toFixed(2) : 0;
      
      // حساب توزيع الردود لكل خادم
      const guildDistribution = {};
      allReplies.forEach(reply => {
        guildDistribution[reply.guild_id] = (guildDistribution[reply.guild_id] || 0) + 1;
      });
      
      // حساب متوسط الردود لكل خادم
      const averageRepliesPerGuild = uniqueGuilds > 0 ? 
        (totalReplies / uniqueGuilds).toFixed(2) : 0;

      return {
        totalReplies,
        repliesWithMessages,
        repliesWithReplies,
        emptyReplies,
        uniqueGuilds,
        recentReplies,
        averageMessageLength: parseFloat(averageMessageLength),
        averageReplyLength: parseFloat(averageReplyLength),
        averageRepliesPerGuild: parseFloat(averageRepliesPerGuild),
        guildDistribution,
        completeReplies: allReplies.filter(reply => 
          reply.message && reply.message.trim() !== '' && 
          reply.reply && reply.reply.trim() !== ''
        ).length
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات الردود التلقائية: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود الرد التلقائي
   * @param {string} divId - معرف القسم
   * @returns {Promise<boolean>} - true إذا كان الرد التلقائي موجود
   */
  static async existsReply(divId) {
    try {
      const reply = await this.getReplyById(divId);
      return reply !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود الرد التلقائي: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود رد تلقائي بالرسالة في الخادم
   * @param {string} guildId - معرف الخادم
   * @param {string} message - الرسالة المحفزة
   * @returns {Promise<boolean>} - true إذا كان الرد التلقائي موجود
   */
  static async existsReplyByMessage(guildId, message) {
    try {
      const reply = await this.findExactReply(guildId, message);
      return reply !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود الرد التلقائي بالرسالة: ${error.message}`);
    }
  }

  /**
   * عد ردود الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<number>} - عدد الردود التلقائية
   */
  static async countGuildReplies(guildId) {
    try {
      const replies = await this.getRepliesByGuildId(guildId);
      return replies.length;
    } catch (error) {
      throw new Error(`خطأ في عد ردود الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على أكثر الخوادم استخداماً للردود التلقائية
   * @param {number} limit - عدد الخوادم المطلوب إرجاعها
   * @returns {Promise<Array>} - قائمة الخوادم مع عدد الردود
   */
  static async getMostActiveGuilds(limit = 10) {
    try {
      const allReplies = await Areply.findAll({});
      
      // حساب توزيع الردود لكل خادم
      const guildCounts = {};
      allReplies.forEach(reply => {
        guildCounts[reply.guild_id] = (guildCounts[reply.guild_id] || 0) + 1;
      });
      
      // ترتيب الخوادم حسب عدد الردود
      const sortedGuilds = Object.entries(guildCounts)
        .map(([guildId, count]) => ({ guildId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      
      return sortedGuilds;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أكثر الخوادم استخداماً: ${error.message}`);
    }
  }

  /**
   * إنشاء أو تحديث الرد التلقائي
   * @param {string} guildId - معرف الخادم
   * @param {string} message - الرسالة المحفزة
   * @param {string} reply - الرد التلقائي
   * @returns {Promise<Object>} - الرد التلقائي المنشأ أو المحدث
   */
  static async upsertReply(guildId, message, reply) {
    try {
      const existingReply = await this.findExactReply(guildId, message);
      
      if (existingReply) {
        // تحديث الرد الموجود
        const result = await this.updateReplyText(existingReply.div_id, reply);
        return result;
      } else {
        // إنشاء رد جديد
        const result = await this.createAutoReply(guildId, message, reply);
        return result;
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث الرد التلقائي: ${error.message}`);
    }
  }

  /**
   * نسخ الردود التلقائية من خادم إلى آخر
   * @param {string} sourceGuildId - معرف الخادم المصدر
   * @param {string} targetGuildId - معرف الخادم الهدف
   * @param {boolean} overwrite - هل يتم الكتابة فوق الردود الموجودة
   * @returns {Promise<Array>} - قائمة الردود المنسوخة
   */
  static async copyGuildReplies(sourceGuildId, targetGuildId, overwrite = false) {
    try {
      const sourceReplies = await this.getRepliesByGuildId(sourceGuildId);
      const copiedReplies = [];
      
      for (const sourceReply of sourceReplies) {
        if (!overwrite) {
          // التحقق من وجود رد مماثل في الخادم الهدف
          const existingReply = await this.findExactReply(targetGuildId, sourceReply.message);
          if (existingReply) {
            continue; // تخطي إذا كان الرد موجود
          }
        }
        
        const newReply = await this.createAutoReply(
          targetGuildId,
          sourceReply.message,
          sourceReply.reply
        );
        
        copiedReplies.push(newReply);
      }
      
      return copiedReplies;
    } catch (error) {
      throw new Error(`خطأ في نسخ الردود التلقائية: ${error.message}`);
    }
  }

  /**
   * تصدير الردود التلقائية للخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object>} - بيانات الردود للتصدير
   */
  static async exportGuildReplies(guildId) {
    try {
      const replies = await this.getRepliesByGuildId(guildId);
      
      const exportData = {
        guildId: guildId,
        exportDate: new Date().toISOString(),
        totalReplies: replies.length,
        replies: replies.map(reply => ({
          message: reply.message,
          reply: reply.reply,
          createdAt: reply.createdAt
        }))
      };
      
      return exportData;
    } catch (error) {
      throw new Error(`خطأ في تصدير الردود التلقائية: ${error.message}`);
    }
  }

  /**
   * استيراد الردود التلقائية للخادم
   * @param {string} guildId - معرف الخادم
   * @param {Array} repliesData - بيانات الردود للاستيراد
   * @param {boolean} overwrite - هل يتم الكتابة فوق الردود الموجودة
   * @returns {Promise<Object>} - نتيجة الاستيراد
   */
  static async importGuildReplies(guildId, repliesData, overwrite = false) {
    try {
      const importedReplies = [];
      const skippedReplies = [];
      const errors = [];
      
      for (const replyData of repliesData) {
        try {
          if (!overwrite) {
            // التحقق من وجود رد مماثل
            const existingReply = await this.findExactReply(guildId, replyData.message);
            if (existingReply) {
              skippedReplies.push(replyData);
              continue;
            }
          }
          
          const newReply = await this.createAutoReply(
            guildId,
            replyData.message,
            replyData.reply
          );
          
          importedReplies.push(newReply);
        } catch (error) {
          errors.push({
            replyData: replyData,
            error: error.message
          });
        }
      }
      
      return {
        imported: importedReplies.length,
        skipped: skippedReplies.length,
        errors: errors.length,
        importedReplies,
        skippedReplies,
        errors
      };
    } catch (error) {
      throw new Error(`خطأ في استيراد الردود التلقائية: ${error.message}`);
    }
  }
}

export default AreplyService;