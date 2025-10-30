import WelcomeImagesService from '../../../../database/mongoDB/services/welcomeImages.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة صور الترحيب - WelcomeImage Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة قوالب صور الترحيب
 * Contains all operations related to welcome images templates management
 */

/**
 * الحصول على جميع قوالب صور الترحيب
 * Get all welcome images templates
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllWelcomeImages = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [welcomeImages, error] = await WelcomeImagesService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(welcomeImages);

    send(res, { success: true, data: result }, 'تم جلب قوالب صور الترحيب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على قالب صورة ترحيب بواسطة المعرف
 * Get welcome image template by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getWelcomeImageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [welcomeImage, error] = await WelcomeImagesService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(welcomeImage);
    send(res, { success: true, data: result }, 'تم جلب قالب صورة الترحيب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على قالب صورة ترحيب بواسطة معرف الخادم
 * Get welcome image template by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getWelcomeImageByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [welcomeImage, error] = await WelcomeImagesService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(welcomeImage);
    send(res, { success: true, data: result }, 'تم جلب قالب صورة الترحيب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء قالب صورة ترحيب جديد
 * Create new welcome image template
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createWelcomeImage = async (req, res, next) => {
  try {
    const welcomeImageData = req.body;
    
    const [welcomeImage, error] = await WelcomeImagesService.create(welcomeImageData);

    if (error) {
      console.log('error RR :', error);
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(welcomeImage);
    send(res, { success: true, data: result }, 'تم إنشاء قالب صورة الترحيب بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث قالب صورة الترحيب
 * Update welcome image template
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateWelcomeImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [welcomeImage, error] = await WelcomeImagesService.update(id, updateData);

    if (error) {
      console.log('error RR :', error);
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(welcomeImage);
    send(res, { success: true, data: result }, 'تم تحديث قالب صورة الترحيب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث قالب صورة الترحيب بواسطة معرف الخادم
 * Update welcome image template by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateWelcomeImageByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const updateData = req.body;
    
    const [welcomeImage, error] = await WelcomeImagesService.update(null, updateData, serverId);

    if (error) {
      console.log('error RR :', error);
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(welcomeImage);
    send(res, { success: true, data: result }, 'تم تحديث قالب صورة الترحيب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف قالب صورة الترحيب
 * Delete welcome image template
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteWelcomeImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await WelcomeImagesService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف قالب صورة الترحيب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف قالب صورة الترحيب بواسطة معرف الخادم
 * Delete welcome image template by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteWelcomeImageByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [result, error] = await WelcomeImagesService.delete(null, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف قالب صورة الترحيب بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};