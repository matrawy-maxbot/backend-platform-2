import ChannelsContentService from '../../../../database/postgreSQL/services/channelsContent.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة محتوى القنوات - Channel Content Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة إعدادات حظر المحتوى في القنوات
 * Contains all operations related to channel content blocking settings management
 */

/**
 * الحصول على جميع إعدادات محتوى القنوات
 * Get all channel content settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllChannelContent = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [channelContent, error] = await ChannelsContentService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(channelContent);

    send(res, { success: true, data: result }, 'تم جلب إعدادات محتوى القنوات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات محتوى القنوات بواسطة المعرف
 * Get channel content settings by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getChannelContentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [channelContent, error] = await ChannelsContentService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(channelContent);
    send(res, { success: true, data: result }, 'تم جلب إعدادات محتوى القنوات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات محتوى القنوات بواسطة معرف الخادم
 * Get channel content settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getChannelContentByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [channelContent, error] = await ChannelsContentService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(channelContent);
    send(res, { success: true, data: result }, 'تم جلب إعدادات محتوى القنوات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات محتوى قنوات جديدة
 * Create new channel content settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createChannelContent = async (req, res, next) => {
  try {
    const channelContentData = req.body;
    
    const [channelContent, error] = await ChannelsContentService.create(channelContentData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(channelContent);
    send(res, { success: true, data: result }, 'تم إنشاء إعدادات محتوى القنوات بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات محتوى القنوات
 * Update channel content settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateChannelContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [channelContent, error] = await ChannelsContentService.update(id, updateData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(channelContent);
    send(res, { success: true, data: result }, 'تم تحديث إعدادات محتوى القنوات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات محتوى القنوات بواسطة معرف الخادم
 * Update channel content settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateChannelContentByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const updateData = req.body;
    
    const [channelContent, error] = await ChannelsContentService.update(null, updateData, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(channelContent);
    send(res, { success: true, data: result }, 'تم تحديث إعدادات محتوى القنوات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات محتوى القنوات
 * Delete channel content settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteChannelContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await ChannelsContentService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف إعدادات محتوى القنوات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات محتوى القنوات بواسطة معرف الخادم
 * Delete channel content settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteChannelContentByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [result, error] = await ChannelsContentService.delete(null, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف إعدادات محتوى القنوات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};