import BadWordsService from '../../../../database/postgreSQL/services/badwords.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة الكلمات السيئة - BadWords Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة الكلمات المحظورة
 * Contains all operations related to bad words management
 */

/**
 * الحصول على جميع إعدادات الكلمات السيئة
 * Get all bad words settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllBadWords = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [badWords, error] = await BadWordsService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(badWords);

    send(res, { success: true, data: result }, 'تم جلب إعدادات الكلمات السيئة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات الكلمات السيئة بواسطة المعرف
 * Get bad words settings by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getBadWordsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [badWords, error] = await BadWordsService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(badWords);
    send(res, { success: true, data: result }, 'تم جلب إعدادات الكلمات السيئة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات الكلمات السيئة بواسطة معرف الخادم
 * Get bad words settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getBadWordsByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [badWords, error] = await BadWordsService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(badWords);
    send(res, { success: true, data: result }, 'تم جلب إعدادات الكلمات السيئة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات كلمات سيئة جديدة
 * Create new bad words settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createBadWords = async (req, res, next) => {
  try {
    const badWordsData = req.body;
    
    const [badWords, error] = await BadWordsService.create(badWordsData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(badWords);
    send(res, { success: true, data: result }, 'تم إنشاء إعدادات الكلمات السيئة بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات الكلمات السيئة
 * Update bad words settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateBadWords = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [badWords, error] = await BadWordsService.update(id, updateData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(badWords);
    send(res, { success: true, data: result }, 'تم تحديث إعدادات الكلمات السيئة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات الكلمات السيئة بواسطة معرف الخادم
 * Update bad words settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateBadWordsByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const updateData = req.body;
    
    const [badWords, error] = await BadWordsService.update(null, updateData, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(badWords);
    send(res, { success: true, data: result }, 'تم تحديث إعدادات الكلمات السيئة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات الكلمات السيئة
 * Delete bad words settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteBadWords = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await BadWordsService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف إعدادات الكلمات السيئة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات الكلمات السيئة بواسطة معرف الخادم
 * Delete bad words settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteBadWordsByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [result, error] = await BadWordsService.delete(null, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف إعدادات الكلمات السيئة بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};