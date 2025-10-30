import AutoReplyService from '../../../../database/mongoDB/services/autoReply.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة الردود التلقائية - AutoReply Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة الردود التلقائية
 * Contains all operations related to auto-reply management
 */

/**
 * الحصول على جميع الردود التلقائية
 * Get all auto-replies
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllAutoReplies = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [autoReplies, error] = await AutoReplyService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(autoReplies);

    send(res, { success: true, data: result }, 'تم جلب الردود التلقائية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على رد تلقائي بواسطة المعرف
 * Get auto-reply by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAutoReplyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [autoReply, error] = await AutoReplyService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(autoReply);
    send(res, { success: true, data: result }, 'تم جلب الرد التلقائي بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على الردود التلقائية بواسطة معرف الخادم
 * Get auto-replies by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAutoRepliesByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [autoReplies, error] = await AutoReplyService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(autoReplies);
    send(res, { success: true, data: result }, 'تم جلب الردود التلقائية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء رد تلقائي جديد
 * Create new auto-reply
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createAutoReply = async (req, res, next) => {
  try {
    const autoReplyData = req.body;
    
    const [autoReply, error] = await AutoReplyService.create(autoReplyData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(autoReply);
    send(res, { success: true, data: result }, 'تم إنشاء الرد التلقائي بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث الرد التلقائي
 * Update auto-reply
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateAutoReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [autoReply, error] = await AutoReplyService.update(id, updateData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(autoReply);
    send(res, { success: true, data: result }, 'تم تحديث الرد التلقائي بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف الرد التلقائي
 * Delete auto-reply
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteAutoReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await AutoReplyService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف الرد التلقائي بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};