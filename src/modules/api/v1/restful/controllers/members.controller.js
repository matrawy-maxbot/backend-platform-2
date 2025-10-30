import MembersService from '../../../../database/mongoDB/services/members.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة الأعضاء - Members Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة إعدادات الأعضاء
 * Contains all operations related to members settings management
 */

/**
 * الحصول على جميع إعدادات الأعضاء
 * Get all members settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllMembers = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [members, error] = await MembersService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(members);

    send(res, { success: true, data: result }, 'تم جلب إعدادات الأعضاء بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات أعضاء بواسطة المعرف
 * Get members settings by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getMembersById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [members, error] = await MembersService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(members);
    send(res, { success: true, data: result }, 'تم جلب إعدادات الأعضاء بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على إعدادات أعضاء بواسطة معرف الخادم
 * Get members settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getMembersByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [members, error] = await MembersService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(members);
    send(res, { success: true, data: result }, 'تم جلب إعدادات الأعضاء بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء إعدادات أعضاء جديدة
 * Create new members settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createMembers = async (req, res, next) => {
  try {
    const membersData = req.body;
    
    const [members, error] = await MembersService.create(membersData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(members);
    send(res, { success: true, data: result }, 'تم إنشاء إعدادات الأعضاء بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات الأعضاء
 * Update members settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [members, error] = await MembersService.update(id, updateData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(members);
    send(res, { success: true, data: result }, 'تم تحديث إعدادات الأعضاء بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث إعدادات الأعضاء بواسطة معرف الخادم
 * Update members settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateMembersByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const updateData = req.body;
    
    const [members, error] = await MembersService.update(null, updateData, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(members);
    send(res, { success: true, data: result }, 'تم تحديث إعدادات الأعضاء بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات الأعضاء
 * Delete members settings
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await MembersService.delete(id);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف إعدادات الأعضاء بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف إعدادات الأعضاء بواسطة معرف الخادم
 * Delete members settings by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteMembersByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [result, error] = await MembersService.delete(null, serverId);

    if (error) {
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف إعدادات الأعضاء بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};