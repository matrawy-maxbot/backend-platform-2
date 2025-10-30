import ScheduleMessagesService from '../../../../database/postgreSQL/services/scheduleMessages.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة الرسائل المجدولة - ScheduleMessages Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة الرسائل والإعلانات المجدولة
 * Contains all operations related to scheduled messages and advertisements management
 */

/**
 * الحصول على جميع الرسائل المجدولة
 * Get all scheduled messages
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllScheduleMessages = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [scheduleMessages, error] = await ScheduleMessagesService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(scheduleMessages);

    send(res, { success: true, data: result }, 'تم جلب الرسائل المجدولة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على رسالة مجدولة بواسطة المعرف
 * Get scheduled message by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getScheduleMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [scheduleMessage, error] = await ScheduleMessagesService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(scheduleMessage);
    send(res, { success: true, data: result }, 'تم جلب الرسالة المجدولة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على الرسائل المجدولة بواسطة معرف الخادم
 * Get scheduled messages by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getScheduleMessagesByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [scheduleMessages, error] = await ScheduleMessagesService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(scheduleMessages);
    send(res, { success: true, data: result }, 'تم جلب الرسائل المجدولة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء رسالة مجدولة جديدة
 * Create new scheduled message
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createScheduleMessage = async (req, res, next) => {
  try {
    const scheduleMessageData = req.body;
    
    const [scheduleMessage, error] = await ScheduleMessagesService.create(scheduleMessageData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(scheduleMessage);
    send(res, { success: true, data: result }, 'تم إنشاء الرسالة المجدولة بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث الرسالة المجدولة
 * Update scheduled message
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateScheduleMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [scheduleMessage, error] = await ScheduleMessagesService.update(id, updateData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(scheduleMessage);
    send(res, { success: true, data: result }, 'تم تحديث الرسالة المجدولة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف الرسالة المجدولة
 * Delete scheduled message
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteScheduleMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await ScheduleMessagesService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف الرسالة المجدولة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};