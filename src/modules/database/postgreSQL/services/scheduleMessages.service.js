import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { ScheduleMessage } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة الرسائل المجدولة - ScheduleMessages Service
 * تحتوي على جميع العمليات المتعلقة بإدارة الرسائل والإعلانات المجدولة
 * Contains all operations related to scheduled messages and advertisements management
 */
class ScheduleMessagesService {
  
  /**
   * الحصول على جميع الرسائل المجدولة
   * Get all scheduled messages
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

      const scheduleMessages = await ScheduleMessage.findAll(queryOptions);
      
      return [scheduleMessages, null];
    } catch (error) {
      console.error('خطأ في جلب الرسائل المجدولة:', error);
      return [null, 'فشل في جلب الرسائل المجدولة'];
    }
  }

  /**
   * الحصول على رسالة مجدولة بواسطة المعرف
   * Get scheduled message by ID
   * 
   * @param {number} id - معرف الرسالة المجدولة / Scheduled message ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف الرسالة المجدولة مطلوب'];
      }

      const scheduleMessages = await PGselectAll(ScheduleMessage, { id });
      
      return [scheduleMessages[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب الرسالة المجدولة:', error);
      return [null, 'فشل في جلب الرسالة المجدولة'];
    }
  }

  /**
   * الحصول على الرسائل المجدولة بواسطة معرف الخادم
   * Get scheduled messages by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const scheduleMessages = await PGselectAll(ScheduleMessage, { server_id: serverId });

      return [scheduleMessages, null];
    } catch (error) {
      console.error('خطأ في جلب الرسائل المجدولة للخادم:', error);
      return [null, 'فشل في جلب الرسائل المجدولة للخادم'];
    }
  }

  /**
   * إنشاء رسالة مجدولة جديدة
   * Create new scheduled message
   * 
   * @param {Object} scheduleMessageData - بيانات الرسالة المجدولة / Scheduled message data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(scheduleMessageData) {
    try {
      if (!scheduleMessageData || !scheduleMessageData.server_id) {
        return [null, 'بيانات الرسالة المجدولة ومعرف الخادم والعنوان والمحتوى مطلوبة'];
      }

      const LIMIT = 10;
      const existingScheduleMessages = await PGselectAll(ScheduleMessage, { server_id: scheduleMessageData.server_id });
      if (existingScheduleMessages.length >= LIMIT) {
        return [null, `لقد وصلت إلى الحد الأقصى من عدد الرسائل المجدولة ${LIMIT}`];
      }

      const newScheduleMessage = await PGinsert(ScheduleMessage, scheduleMessageData);
      
      return [newScheduleMessage, null];
    } catch (error) {
      console.error('خطأ في إنشاء الرسالة المجدولة:', error);
      return [null, 'فشل في إنشاء الرسالة المجدولة'];
    }
  }

  /**
   * تحديث الرسالة المجدولة
   * Update scheduled message
   * 
   * @param {number} id - معرف الرسالة المجدولة / Scheduled message ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData) {
    try {
      if (!id) {
        return [null, 'معرف الرسالة المجدولة مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود الرسالة المجدولة
      const existingScheduleMessage = await PGselectAll(ScheduleMessage, { id });
      if (!existingScheduleMessage || existingScheduleMessage.length === 0) {
        return [null, 'الرسالة المجدولة غير موجودة'];
      }

      // إزالة المعرف من بيانات التحديث إذا كان موجوداً
      const { id: _, server_id: __, ...dataToUpdate } = updateData;

      const updatedScheduleMessage = await PGupdate(ScheduleMessage, dataToUpdate, { id });
      
      return [updatedScheduleMessage, null];
    } catch (error) {
      console.error('خطأ في تحديث الرسالة المجدولة:', error);
      return [null, 'فشل في تحديث الرسالة المجدولة'];
    }
  }

  /**
   * حذف الرسالة المجدولة
   * Delete scheduled message
   * 
   * @param {number} id - معرف الرسالة المجدولة / Scheduled message ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id) {
    try {
      if (!id) {
        return [null, 'معرف الرسالة المجدولة مطلوب'];
      }

      await PGdelete(ScheduleMessage, { id });
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف الرسالة المجدولة:', error);
      return [null, 'فشل في حذف الرسالة المجدولة'];
    }
  }
}

export default ScheduleMessagesService;