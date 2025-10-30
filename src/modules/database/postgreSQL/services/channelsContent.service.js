import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { ChannelContent } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة محتوى القنوات - ChannelsContent Service
 * تحتوي على جميع العمليات المتعلقة بإدارة إعدادات حظر المحتوى في القنوات
 * Contains all operations related to channels content blocking settings management
 */
class ChannelsContentService {
  
  /**
   * الحصول على جميع إعدادات محتوى القنوات
   * Get all channels content settings
   * 
   * @param {Object} options - خيارات الاستعلام / Query options
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getAll(options = {}) {
    try {
      const { limit, offset, order = [['created_at', 'DESC']] } = options;
      
      const queryOptions = {
        order,
        ...(limit && { limit }),
        ...(offset && { offset })
      };

      const channelsContent = await ChannelContent.findAll(queryOptions);
      
      return [channelsContent, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات محتوى القنوات:', error);
      return [null, 'فشل في جلب إعدادات محتوى القنوات'];
    }
  }

  /**
   * الحصول على إعدادات محتوى القنوات بواسطة المعرف
   * Get channels content settings by ID
   * 
   * @param {number} id - معرف إعدادات محتوى القنوات / Channels content settings ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف إعدادات محتوى القنوات مطلوب'];
      }

      const channelsContent = await PGselectAll(ChannelContent, { id });

      return [channelsContent[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات محتوى القنوات:', error);
      return [null, 'فشل في جلب إعدادات محتوى القنوات'];
    }
  }

  /**
   * الحصول على إعدادات محتوى القنوات بواسطة معرف الخادم
   * Get channels content settings by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const channelsContent = await PGselectAll(ChannelContent, { server_id: serverId });

      return [channelsContent[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات محتوى القنوات للخادم:', error);
      return [null, 'فشل في جلب إعدادات محتوى القنوات للخادم'];
    }
  }

  /**
   * إنشاء إعدادات محتوى قنوات جديدة
   * Create new channels content settings
   * 
   * @param {Object} channelsContentData - بيانات إعدادات محتوى القنوات / Channels content settings data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(channelsContentData) {
    try {
      if (!channelsContentData || !channelsContentData.server_id) {
        return [null, 'بيانات إعدادات محتوى القنوات ومعرف الخادم مطلوبان'];
      }

      // التحقق من عدم وجود إعدادات محتوى قنوات لنفس الخادم
      const existingChannelsContent = await PGselectAll(ChannelContent, { server_id: channelsContentData.server_id });
      if (existingChannelsContent && existingChannelsContent.length > 0) {
        return [null, 'إعدادات محتوى القنوات موجودة بالفعل لهذا الخادم'];
      }

      const newChannelsContent = await PGinsert(ChannelContent, channelsContentData);
      
      return [newChannelsContent, null];
    } catch (error) {
      console.error('خطأ في إنشاء إعدادات محتوى القنوات:', error);
      return [null, 'فشل في إنشاء إعدادات محتوى القنوات'];
    }
  }

  /**
   * تحديث إعدادات محتوى القنوات
   * Update channels content settings
   * 
   * @param {number} id - معرف إعدادات محتوى القنوات / Channels content settings ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف إعدادات محتوى القنوات أو معرف الخادم مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود إعدادات محتوى القنوات
      const existingChannelsContent = await PGselectAll(ChannelContent, id ? { id } : { server_id: serverId });
      if (!existingChannelsContent || existingChannelsContent.length === 0) {
        return [null, 'إعدادات محتوى القنوات غير موجودة'];
      }

      // إزالة المعرف من بيانات التحديث إذا كان موجوداً
      const { id: _, server_id: __, ...dataToUpdate } = updateData;

      const updatedChannelsContent = await PGupdate(ChannelContent, dataToUpdate, id ? { id } : { server_id: serverId });
      
      return [updatedChannelsContent, null];
    } catch (error) {
      console.error('خطأ في تحديث إعدادات محتوى القنوات:', error);
      return [null, 'فشل في تحديث إعدادات محتوى القنوات'];
    }
  }

  /**
   * حذف إعدادات محتوى القنوات
   * Delete channels content settings
   * 
   * @param {number} id - معرف إعدادات محتوى القنوات / Channels content settings ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف إعدادات محتوى القنوات أو معرف الخادم مطلوب'];
      }

      await PGdelete(ChannelContent, id ? { id } : { server_id: serverId });
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف إعدادات محتوى القنوات:', error);
      return [null, 'فشل في حذف إعدادات محتوى القنوات'];
    }
  }
}

export default ChannelsContentService;