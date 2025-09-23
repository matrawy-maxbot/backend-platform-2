import NotificationService from '../../../../database/mongoDB/services/Notification.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم الإشعارات
 * @module NotificationsController
 */

/**
 * الحصول على جميع الإشعارات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllNotifications = async (req, res, next) => {
  try {
    let notifications = await NotificationService.getAllNotifications();
    notifications = resolveDatabaseResult(notifications);
    
    send(res, {
      success: true,
      data: notifications
    }, 'تم جلب جميع الإشعارات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إشعار بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let notification = await NotificationService.getNotificationById(id);
    notification = resolveDatabaseResult(notification);
    
    let status = 200;
    if (notification.length < 1) status = 404;

    send(res, {
      success: true,
      data: notification
    }, 'تم جلب الإشعار بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إشعار جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createNotification = async (req, res, next) => {
  try {
    const notificationData = req.body;

    let newNotification = await NotificationService.createNotification(notificationData);
    newNotification = resolveDatabaseResult(newNotification);
    
    send(res, {
      success: true,
      data: newNotification
    }, 'تم إنشاء الإشعار بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث الإشعار
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedNotification = await NotificationService.updateNotification(id, updateData);
    updatedNotification = resolveDatabaseResult(updatedNotification);
    
    send(res, {
      success: true,
      data: updatedNotification
    }, 'تم تحديث الإشعار بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف الإشعار
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await NotificationService.deleteNotification(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف الإشعار بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};