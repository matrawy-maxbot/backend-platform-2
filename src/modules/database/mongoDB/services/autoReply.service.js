import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import AutoReply from '../models/AutoReply.model.js';

/**
 * خدمة إدارة الردود التلقائية - AutoReply Service
 * تحتوي على جميع العمليات المتعلقة بإدارة الردود التلقائية في خوادم Discord
 * Contains all operations related to auto-reply management in Discord servers
 */
class AutoReplyService {
  
  /**
   * الحصول على جميع الردود التلقائية
   * Get all auto-replies
   * 
   * @param {Object} options - خيارات الاستعلام / Query options
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getAll(options = {}) {
    try {
      const autoReplies = await AutoReply.find().limit(options.limit || 0).skip(options.offset || 0).exec();
      
      return [autoReplies, null];
    } catch (error) {
      console.error('خطأ في جلب الردود التلقائية:', error);
      return [null, 'فشل في جلب الردود التلقائية'];
    }
  }

  /**
   * الحصول على رد تلقائي بواسطة المعرف
   * Get auto-reply by ID
   * 
   * @param {string} id - معرف الرد التلقائي / Auto-reply ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف الرد التلقائي مطلوب'];
      }

      const autoReplies = await mDBselectAll(AutoReply, { _id: id });
      console.log("auto reply result : ", autoReplies);

      return [autoReplies[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب الرد التلقائي:', error);
      return [null, 'فشل في جلب الرد التلقائي'];
    }
  }

  /**
   * الحصول على الردود التلقائية بواسطة معرف الخادم
   * Get auto-replies by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const autoReplies = await mDBselectAll(AutoReply, { server_id: serverId });

      return [autoReplies, null];
    } catch (error) {
      console.error('خطأ في جلب الردود التلقائية للخادم:', error);
      return [null, 'فشل في جلب الردود التلقائية للخادم'];
    }
  }

  /**
   * إنشاء رد تلقائي جديد
   * Create new auto-reply
   * 
   * @param {Object} autoReplyData - بيانات الرد التلقائي / Auto-reply data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(autoReplyData) {
    try {
      if (!autoReplyData || !autoReplyData.server_id || !autoReplyData.reply_name) {
        return [null, 'بيانات الرد التلقائي ومعرف الخادم واسم الرد مطلوبة'];
      }

      // التحقق من عدم تجاوز الحد الأقصى من عدد الردود التلقائية
      const LIMIT = 10;
      const existingAutoReplies = await mDBselectAll(AutoReply, { server_id: autoReplyData.server_id });
      if (existingAutoReplies.length >= LIMIT) {
        return [null, `لقد وصلت إلى الحد الأقصى من عدد الردود التلقائية ${LIMIT}`];
      }

      mDBinsert(AutoReply, autoReplyData);
      
      return [autoReplyData, null];
    } catch (error) {
      console.error('خطأ في إنشاء الرد التلقائي:', error);
      return [null, 'فشل في إنشاء الرد التلقائي'];
    }
  }

  /**
   * تحديث الرد التلقائي
   * Update auto-reply
   * 
   * @param {string} id - معرف الرد التلقائي / Auto-reply ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData) {
    try {
      if (!id) {
        return [null, 'معرف الرد التلقائي مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود الرد التلقائي
      const existingAutoReply = await mDBselectAll(AutoReply, { _id: id });
      if (!existingAutoReply || existingAutoReply.length === 0) {
        return [null, 'الرد التلقائي غير موجود'];
      }

      // إزالة المعرف من بيانات التحديث إذا كان موجوداً
      const { _id: _, server_id: __, ...dataToUpdate } = updateData;

      mDBupdate(AutoReply, { _id: id }, dataToUpdate);
      
      return [{ ...existingAutoReply[0], ...dataToUpdate }, null];
    } catch (error) {
      console.error('خطأ في تحديث الرد التلقائي:', error);
      return [null, 'فشل في تحديث الرد التلقائي'];
    }
  }

  /**
   * حذف الرد التلقائي
   * Delete auto-reply
   * 
   * @param {string} id - معرف الرد التلقائي / Auto-reply ID
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id) {
    try {
      if (!id) {
        return [null, 'معرف الرد التلقائي مطلوب'];
      }

      mDBdelete(AutoReply, { _id: id });
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف الرد التلقائي:', error);
      return [null, 'فشل في حذف الرد التلقائي'];
    }
  }

}

export default AutoReplyService;