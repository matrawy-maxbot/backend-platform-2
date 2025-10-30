import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import Log from '../models/Log.model.js';

/**
 * خدمة إدارة السجلات
 * Log Service
 * 
 * تدير عمليات السجلات في خوادم Discord
 * Manages log operations for Discord servers
 * 
 * البنية الجديدة تدعم حقول منفصلة لكل نوع سجل:
 * New structure supports separate fields for each log type:
 * - member_join_leave: سجلات انضمام ومغادرة الأعضاء
 * - role_changes: سجلات تغييرات الأدوار
 * - kick_ban: سجلات الطرد والحظر
 * - channel_changes: سجلات تغييرات القنوات
 * - member_updates: سجلات تحديثات الأعضاء
 * - message_changes: سجلات تغييرات الرسائل
 * - server_settings: سجلات إعدادات الخادم
 * 
 * @author Your Name
 * @version 2.0.0
 */
class LogService {
  
  /**
   * الحصول على جميع السجلات
   * Get all logs
   * 
   * @param {Object} options - خيارات الاستعلام / Query options
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getAll(options = {}) {
    try {
      const logs = await Log.find().limit(options.limit || 0).skip(options.offset || 0).exec();
      
      return [logs, null];
    } catch (error) {
      console.error('خطأ في جلب السجلات:', error);
      return [null, 'فشل في جلب السجلات'];
    }
  }

  /**
   * الحصول على سجل بواسطة المعرف
   * Get log by ID
   * 
   * @param {string} id - معرف السجل / Log ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف السجل مطلوب'];
      }

      const logs = await mDBselectAll(Log, { _id: id });

      return [logs[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب السجل:', error);
      return [null, 'فشل في جلب السجل'];
    }
  }

  /**
   * الحصول على السجلات بواسطة معرف الخادم
   * Get logs by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const logs = await mDBselectAll(Log, { server_id: serverId });

      return [logs, null];
    } catch (error) {
      console.error('خطأ في جلب السجلات للخادم:', error);
      return [null, 'فشل في جلب السجلات للخادم'];
    }
  }

  /**
   * إنشاء سجل جديد أو تحديث الموجود
   * Create new log or update existing one
   * 
   * @param {Object} logData - بيانات السجل / Log data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(logData) {
    try {
      if (!logData || !logData.server_id) {
        return [null, 'بيانات السجل ومعرف الخادم مطلوبة'];
      }

      // التحقق من وجود سجل للخادم
      const existingLog = await mDBselectAll(Log, { 
        server_id: logData.server_id
      });
      
      if (existingLog && existingLog.length > 0) {
        // تحديث السجل الموجود
        const { server_id, ...updateData } = logData;
        mDBupdate(Log, { server_id: logData.server_id }, updateData);
        return [{ ...existingLog[0], ...updateData }, null];
      } else {
        // إنشاء سجل جديد
        mDBinsert(Log, logData);
        return [logData, null];
      }
    } catch (error) {
      console.error('خطأ في إنشاء السجل:', error);
      return [null, 'فشل في إنشاء السجل'];
    }
  }

  /**
   * تحديث السجل
   * Update log
   * 
   * @param {string} id - معرف السجل / Log ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @param {string} serverId - معرف الخادم / Server ID (optional if id is provided)
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف السجل أو معرف الخادم مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود السجل
      const filter = id ? { _id: id } : { server_id: serverId };
      const existingLog = await mDBselectAll(Log, filter);
      if (!existingLog || existingLog.length === 0) {
        return [null, 'السجل غير موجود'];
      }

      // إزالة المعرفات من بيانات التحديث إذا كانت موجودة
      const { _id: _, server_id: __, ...dataToUpdate } = updateData;

      mDBupdate(Log, filter, dataToUpdate);
      
      return [{ ...existingLog[0], ...dataToUpdate }, null];
    } catch (error) {
      console.error('خطأ في تحديث السجل:', error);
      return [null, 'فشل في تحديث السجل'];
    }
  }

  /**
   * حذف السجل
   * Delete log
   * 
   * @param {string} id - معرف السجل / Log ID
   * @param {string} serverId - معرف الخادم / Server ID (optional if id is provided)
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف السجل أو معرف الخادم مطلوب'];
      }

      const filter = id ? { _id: id } : { server_id: serverId };
      mDBdelete(Log, filter);
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف السجل:', error);
      return [null, 'فشل في حذف السجل'];
    }
  }

}

export default LogService;