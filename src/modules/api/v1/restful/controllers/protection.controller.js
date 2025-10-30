import ProtectionService from '../../../../database/postgreSQL/services/protection.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة الحماية - Protection Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة إعدادات الحماية
 * Contains all operations related to protection settings management
 */

/**
 * الحصول على جميع إعدادات الحماية
 * Get all protection settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllProtections = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [protections, error] = await ProtectionService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(protections);

    send(res, { success: true, data: result }, 'تم جلب إعدادات الحماية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات حماية بواسطة المعرف
 * Get protection settings by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getProtectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [protection, error] = await ProtectionService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(protection);
    send(res, { success: true, data: result }, 'تم جلب إعدادات الحماية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات حماية بواسطة معرف الخادم
 * Get protection settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getProtectionByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [protection, error] = await ProtectionService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(protection);
    send(res, { success: true, data: result }, 'تم جلب إعدادات الحماية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات حماية جديدة
 * Create new protection settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createProtection = async (req, res, next) => {
  try {
    const protectionData = req.body;
    
    const [protection, error] = await ProtectionService.create(protectionData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(protection);
    send(res, { success: true, data: result }, 'تم إنشاء إعدادات الحماية بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات الحماية
 * Update protection settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateProtection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [protection, error] = await ProtectionService.update(id, updateData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(protection);
    send(res, { success: true, data: result }, 'تم تحديث إعدادات الحماية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات الحماية بواسطة معرف الخادم
 * Update protection settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateProtectionByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const updateData = req.body;
    
    const [protection, error] = await ProtectionService.update(null, updateData, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(protection);
    send(res, { success: true, data: result }, 'تم تحديث إعدادات الحماية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات الحماية
 * Delete protection settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteProtection = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await ProtectionService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف إعدادات الحماية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات الحماية بواسطة معرف الخادم
 * Delete protection settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteProtectionByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [result, error] = await ProtectionService.delete(null, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف إعدادات الحماية بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};