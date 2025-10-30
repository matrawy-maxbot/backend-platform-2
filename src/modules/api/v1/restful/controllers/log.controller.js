import LogService from '../../../../database/mongoDB/services/log.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة السجلات - Log Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة سجلات الأحداث
 * Contains all operations related to event logs management
 */

/**
 * الحصول على جميع السجلات
 * Get all logs
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllLogs = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [logs, error] = await LogService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(logs);

    send(res, { success: true, data: result }, 'تم جلب السجلات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجل بواسطة المعرف
 * Get log by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getLogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [log, error] = await LogService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(log);
    send(res, { success: true, data: result }, 'تم جلب السجل بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على السجلات بواسطة معرف الخادم
 * Get logs by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getLogsByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [logs, error] = await LogService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(logs);
    send(res, { success: true, data: result }, 'تم جلب السجلات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء سجل جديد
 * Create new log
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createLog = async (req, res, next) => {
  try {
    const logData = req.body;
    
    const [log, error] = await LogService.create(logData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(log);
    send(res, { success: true, data: result }, 'تم إنشاء السجل بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث السجل بواسطة المعرف
 * Update log by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [log, error] = await LogService.update(id, updateData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(log);
    send(res, { success: true, data: result }, 'تم تحديث السجل بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث السجل بواسطة معرف الخادم
 * Update log by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateLogByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const updateData = req.body;
    
    const [log, error] = await LogService.update(null, updateData, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(log);
    send(res, { success: true, data: result }, 'تم تحديث السجل بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف السجل بواسطة المعرف
 * Delete log by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await LogService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف السجل بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف السجل بواسطة معرف الخادم
 * Delete log by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteLogByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [result, error] = await LogService.delete(null, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف السجل بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};