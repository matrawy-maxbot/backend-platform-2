import LinksService from '../../../../database/postgreSQL/services/links.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة الروابط - Links Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة قواعد الروابط
 * Contains all operations related to links rules management
 */

/**
 * الحصول على جميع قواعد الروابط
 * Get all link rules
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllLinks = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [links, error] = await LinksService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(links);

    send(res, { success: true, data: result }, 'تم جلب قواعد الروابط بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على قاعدة رابط بواسطة المعرف
 * Get link rule by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getLinkById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [link, error] = await LinksService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(link);
    send(res, { success: true, data: result }, 'تم جلب قاعدة الرابط بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على قواعد الروابط بواسطة معرف الخادم
 * Get link rules by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getLinksByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [links, error] = await LinksService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(links);
    send(res, { success: true, data: result }, 'تم جلب قواعد الروابط بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء قاعدة رابط جديدة
 * Create new link rule
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createLink = async (req, res, next) => {
  try {
    const linkData = req.body;
    
    const [link, error] = await LinksService.create(linkData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(link);
    send(res, { success: true, data: result }, 'تم إنشاء قاعدة الرابط بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث قاعدة الرابط
 * Update link rule
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [link, error] = await LinksService.update(id, updateData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(link);
    send(res, { success: true, data: result }, 'تم تحديث قاعدة الرابط بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف قاعدة الرابط
 * Delete link rule
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await LinksService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف قاعدة الرابط بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};