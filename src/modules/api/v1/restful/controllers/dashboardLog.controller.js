import DashboardLogService from '../../../../database/mongoDB/services/dashboardLog.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة سجلات لوحة التحكم - DashboardLog Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة سجلات أنشطة لوحة التحكم
 * Contains all operations related to dashboard activity logs management
 */

/**
 * الحصول على جميع سجلات لوحة التحكم
 * Get all dashboard logs
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllDashboardLogs = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [dashboardLogs, error] = await DashboardLogService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(dashboardLogs);

    send(res, { success: true, data: result }, 'تم جلب سجلات لوحة التحكم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجل لوحة التحكم بواسطة المعرف
 * Get dashboard log by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getDashboardLogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [dashboardLog, error] = await DashboardLogService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(dashboardLog);
    send(res, { success: true, data: result }, 'تم جلب سجل لوحة التحكم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجلات لوحة التحكم بواسطة معرف الخادم
 * Get dashboard logs by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getDashboardLogsByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [dashboardLogs, error] = await DashboardLogService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(dashboardLogs);
    send(res, { success: true, data: result }, 'تم جلب سجلات لوحة التحكم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجلات لوحة التحكم بواسطة معرف المستخدم
 * Get dashboard logs by user ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getDashboardLogsByUserId = async (req, res, next) => {
  try {
    const { userId, serverId } = req.params;
    
    const [dashboardLogs, error] = await DashboardLogService.getByUserId(userId, serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(dashboardLogs);
    send(res, { success: true, data: result }, 'تم جلب سجلات لوحة التحكم للمستخدم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجلات لوحة التحكم بواسطة الميزة
 * Get dashboard logs by feature
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getDashboardLogsByFeature = async (req, res, next) => {
  try {
    const { feature, serverId } = req.params;
    
    const [dashboardLogs, error] = await DashboardLogService.getByFeature(feature, serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(dashboardLogs);
    send(res, { success: true, data: result }, 'تم جلب سجلات لوحة التحكم للميزة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على سجلات لوحة التحكم بواسطة الإجراء
 * Get dashboard logs by action
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getDashboardLogsByAction = async (req, res, next) => {
  try {
    const { action, serverId } = req.params;
    
    const [dashboardLogs, error] = await DashboardLogService.getByAction(action, serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(dashboardLogs);
    send(res, { success: true, data: result }, 'تم جلب سجلات لوحة التحكم للإجراء بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء سجل لوحة تحكم جديد
 * Create new dashboard log
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createDashboardLog = async (req, res, next) => {
  try {
    const dashboardLogData = req.body;
    
    const [dashboardLog, error] = await DashboardLogService.create(dashboardLogData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(dashboardLog);
    send(res, { success: true, data: result }, 'تم إنشاء سجل لوحة التحكم بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف سجل لوحة التحكم
 * Delete dashboard log
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteDashboardLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await DashboardLogService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف سجل لوحة التحكم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف سجلات لوحة التحكم بواسطة معرف الخادم
 * Delete dashboard logs by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteDashboardLogByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [result, error] = await DashboardLogService.delete(null, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف سجلات لوحة التحكم للخادم بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};