import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { Notification } from '../models/index.js';

/**
 * خدمة إدارة الإشعارات - Notification Service
 * تحتوي على الوظائف الأساسية لإدارة إشعارات المستخدمين
 */
class NotificationService {

  /**
   * إنشاء إشعار جديد
   * @param {Object} notificationData - بيانات الإشعار
   * @returns {Promise<Object>} الإشعار المُنشأ
   */
  static async createNotification(notificationData) {
    try {
      if (!notificationData.user_id || !notificationData.title || !notificationData.message) {
        throw new Error('البيانات المطلوبة مفقودة: user_id, title, message');
      }

      const newNotification = await mDBinsert(Notification, notificationData);
      return newNotification;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الإشعار: ${error.message}`);
    }
  }

  /**
   * الحصول على إشعارات المستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة الإشعارات
   */
  static async getUserNotifications(userId, options = {}) {
    try {
      const filter = { user_id: userId };
      
      // فلترة حسب حالة القراءة إذا تم تحديدها
      if (options.is_read !== undefined) {
        filter.is_read = options.is_read;
      }

      const notifications = await mDBselectAll({
        model: Notification,
        filter: filter
      });
      return notifications || [];
    } catch (error) {
      throw new Error(`خطأ في جلب إشعارات المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على الإشعارات غير المقروءة للمستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Array>} قائمة الإشعارات غير المقروءة
   */
  static async getUnreadNotifications(userId) {
    try {
      return await this.getUserNotifications(userId, { is_read: false });
    } catch (error) {
      throw new Error(`خطأ في جلب الإشعارات غير المقروءة: ${error.message}`);
    }
  }

  /**
   * عدد الإشعارات غير المقروءة للمستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<number>} عدد الإشعارات غير المقروءة
   */
  static async getUnreadCount(userId) {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId);
      return unreadNotifications.length;
    } catch (error) {
      throw new Error(`خطأ في حساب الإشعارات غير المقروءة: ${error.message}`);
    }
  }

  /**
   * تحديث حالة الإشعار إلى مقروء
   * @param {string} notificationId - معرف الإشعار
   * @returns {Promise<Object>} الإشعار المُحدث
   */
  static async markAsRead(notificationId) {
    try {
      const updatedNotification = await mDBupdate(
        Notification, 
        { _id: notificationId }, 
        { is_read: true }
      );
      return updatedNotification;
    } catch (error) {
      throw new Error(`خطأ في تحديث حالة الإشعار: ${error.message}`);
    }
  }

  /**
   * تحديث جميع إشعارات المستخدم إلى مقروءة
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Object>} نتيجة التحديث
   */
  static async markAllAsRead(userId) {
    try {
      const result = await mDBupdate(
        Notification, 
        { user_id: userId, is_read: false }, 
        { is_read: true }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث جميع الإشعارات: ${error.message}`);
    }
  }

  /**
   * حذف إشعار
   * @param {string} notificationId - معرف الإشعار
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteNotification(notificationId) {
    try {
      const result = await mDBdelete(Notification, { _id: notificationId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الإشعار: ${error.message}`);
    }
  }

  /**
   * حذف جميع إشعارات المستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteUserNotifications(userId) {
    try {
      const result = await mDBdelete(Notification, { user_id: userId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إشعارات المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على إشعارات حسب النوع
   * @param {number} userId - معرف المستخدم
   * @param {string} type - نوع الإشعار
   * @returns {Promise<Array>} قائمة الإشعارات
   */
  static async getNotificationsByType(userId, type) {
    try {
      const notifications = await mDBselectAll({
        model: Notification,
        filter: { user_id: userId, type: type }
      });
      return notifications || [];
    } catch (error) {
      throw new Error(`خطأ في جلب الإشعارات حسب النوع: ${error.message}`);
    }
  }
}

export default NotificationService;