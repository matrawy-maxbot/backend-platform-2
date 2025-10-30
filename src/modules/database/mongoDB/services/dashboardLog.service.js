import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import DashboardLog from '../models/DashboardLog.model.js';

/**
 * خدمة إدارة سجلات لوحة التحكم - DashboardLog Service
 * تحتوي على جميع العمليات المتعلقة بإدارة سجلات أنشطة لوحة التحكم في خوادم Discord
 * Contains all operations related to dashboard activity logs management in Discord servers
 */
class DashboardLogService {
  
  /**
   * الحصول على جميع سجلات لوحة التحكم
   * Get all dashboard logs
   * 
   * @param {Object} options - خيارات الاستعلام / Query options
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getAll(options = {}) {
    try {
      const dashboardLogs = await DashboardLog.find().limit(options.limit || 0).skip(options.offset || 0).exec();
      
      return [dashboardLogs, null];
    } catch (error) {
      console.error('خطأ في جلب سجلات لوحة التحكم:', error);
      return [null, 'فشل في جلب سجلات لوحة التحكم'];
    }
  }

  /**
   * الحصول على سجل لوحة التحكم بواسطة المعرف
   * Get dashboard log by ID
   * 
   * @param {string} id - معرف سجل لوحة التحكم / Dashboard log ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف سجل لوحة التحكم مطلوب'];
      }

      const dashboardLogs = await mDBselectAll(DashboardLog, { _id: id });
      
      return [dashboardLogs[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب سجل لوحة التحكم:', error);
      return [null, 'فشل في جلب سجل لوحة التحكم'];
    }
  }

  /**
   * الحصول على سجلات لوحة التحكم بواسطة معرف الخادم
   * Get dashboard logs by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const dashboardLogs = await mDBselectAll(DashboardLog, { server_id: serverId });

      return [dashboardLogs, null];
    } catch (error) {
      console.error('خطأ في جلب سجلات لوحة التحكم للخادم:', error);
      return [null, 'فشل في جلب سجلات لوحة التحكم للخادم'];
    }
  }

  /**
   * الحصول على سجلات لوحة التحكم بواسطة معرف المستخدم
   * Get dashboard logs by user ID
   * 
   * @param {string} userId - معرف المستخدم / User ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByUserId(userId, serverId) {
    try {
      if (!userId || !serverId) {
        return [null, 'معرف المستخدم و معرف الخادم مطلوب'];
      }

      const dashboardLogs = await mDBselectAll(DashboardLog, { user_id: userId, server_id: serverId });

      return [dashboardLogs, null];
    } catch (error) {
      console.error('خطأ في جلب سجلات لوحة التحكم للمستخدم:', error);
      return [null, 'فشل في جلب سجلات لوحة التحكم للمستخدم'];
    }
  }

  /**
   * الحصول على سجلات لوحة التحكم بواسطة الميزة
   * Get dashboard logs by feature
   * 
   * @param {string} feature - اسم الميزة / Feature name
   * @param {string} serverId - معرف الخادم (اختياري) / Server ID (optional)
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByFeature(feature, serverId) {
    try {
      if (!feature || !serverId) {
        return [null, 'اسم الميزة و معرف الخادم مطلوب'];
      }

      const filter = { feature: feature, server_id: serverId };

      const dashboardLogs = await mDBselectAll(DashboardLog, filter);
      
      return [dashboardLogs, null];
    } catch (error) {
      console.error('خطأ في جلب سجلات لوحة التحكم للميزة:', error);
      return [null, 'فشل في جلب سجلات لوحة التحكم للميزة'];
    }
  }

  /**
   * الحصول على سجلات لوحة التحكم بواسطة الإجراء
   * Get dashboard logs by action
   * 
   * @param {string} action - نوع الإجراء / Action type
   * @param {string} serverId - معرف الخادم (اختياري) / Server ID (optional)
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByAction(action, serverId) {
    try {
      if (!action || !serverId) {
        return [null, 'نوع الإجراء و معرف الخادم مطلوب'];
      }

      const filter = { action: action, server_id: serverId };

      const dashboardLogs = await mDBselectAll(DashboardLog, filter);
      
      return [dashboardLogs, null];
    } catch (error) {
      console.error('خطأ في جلب سجلات لوحة التحكم للإجراء:', error);
      return [null, 'فشل في جلب سجلات لوحة التحكم للإجراء'];
    }
  }

  /**
   * إنشاء سجل لوحة تحكم جديد
   * Create new dashboard log
   * 
   * @param {Object} dashboardLogData - بيانات سجل لوحة التحكم / Dashboard log data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(dashboardLogData) {
    try {
      if (!dashboardLogData || !dashboardLogData.server_id || !dashboardLogData.feature || !dashboardLogData.action) {
        return [null, 'بيانات سجل لوحة التحكم (معرف الخادم، الميزة، الإجراء) مطلوبة'];
      }

      // التحقق من صحة نوع الإجراء
      const validActions = ['create', 'update', 'delete', 'enable', 'disable', 'activate', 'deactivate', 'configure', 'reset'];
      if (!validActions.includes(dashboardLogData.action)) {
        return [null, 'نوع الإجراء غير صحيح'];
      }

      mDBinsert(DashboardLog, dashboardLogData);
      
      return [dashboardLogData, null];
    } catch (error) {
      console.error('خطأ في إنشاء سجل لوحة التحكم:', error);
      return [null, 'فشل في إنشاء سجل لوحة التحكم'];
    }
  }

  /**
   * حذف سجل لوحة التحكم
   * Delete dashboard log
   * 
   * @param {string} id - معرف سجل لوحة التحكم / Dashboard log ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف سجل لوحة التحكم أو معرف الخادم مطلوب'];
      }

      const filter = id ? { _id: id } : { server_id: serverId };
      mDBdelete(DashboardLog, filter);
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف سجل لوحة التحكم:', error);
      return [null, 'فشل في حذف سجل لوحة التحكم'];
    }
  }
}

export default DashboardLogService;