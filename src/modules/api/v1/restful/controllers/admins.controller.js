import AdminsService from '../../../../database/postgreSQL/services/admins.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * كنترولر إدارة المشرفين - Admins Controller
 * يحتوي على جميع العمليات المتعلقة بإدارة المشرفين
 * Contains all operations related to admins management
 */

/**
 * الحصول على جميع المشرفين
 * Get all admins
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllAdmins = async (req, res, next) => {
  try {
    const { limit, offset, order } = req.query;
    
    const options = {
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
      ...(order && { order: JSON.parse(order) })
    };

    const [admins, error] = await AdminsService.getAll(options);

    if (error) {
        res.status(500);
        return next(error);
    }

    const result = resolveDatabaseResult(admins);

    send(res, { success: true, data: result }, 'تم جلب المشرفين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على مشرف بواسطة المعرف
 * Get admin by ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [admin, error] = await AdminsService.getById(id);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(admin);
    send(res, { success: true, data: result }, 'تم جلب المشرف بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على المشرفين بواسطة معرف الخادم
 * Get admins by server ID
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAdminsByServerId = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    
    const [admins, error] = await AdminsService.getByServerId(serverId);

    if (error) {
      res.status(500);
      return next(error);
    }

    const result = resolveDatabaseResult(admins);
    send(res, { success: true, data: result }, 'تم جلب المشرفين بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء مشرف جديد
 * Create new admin
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createAdmin = async (req, res, next) => {
  try {
    const adminData = req.body;
    
    const [admin, error] = await AdminsService.create(adminData);

    if (error) {
      res.status(400);
      return next(error);
    }

    const result = resolveDatabaseResult(admin);
    send(res, { success: true, data: result }, 'تم إنشاء المشرف بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// /**
//  * تحديث المشرف
//  * Update admin
//  * 
//  * @param {Object} req - طلب HTTP / HTTP request
//  * @param {Object} res - استجابة HTTP / HTTP response
//  * @param {Function} next - دالة الانتقال للـ middleware التالي
//  */
// export const updateAdmin = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;
    
//     const [admin, error] = await AdminsService.update(id, updateData);

//     if (error) {
//       res.status(400);
//       return next(error);
//     }

//     const result = resolveDatabaseResult(admin);
//     send(res, { success: true, data: result }, 'تم تحديث المشرف بنجاح', 200);
//   } catch (error) {
//     res.status(500);
//     next(error);
//   }
// };

/**
 * حذف المشرف
 * Delete admin
 * 
 * @param {Object} req - طلب HTTP / HTTP request
 * @param {Object} res - استجابة HTTP / HTTP response
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [result, error] = await AdminsService.delete(id);

    if (error) {
      console.log(error);
      res.status(400);
      return next(error);
    }

    send(res, { success: true, data: null }, 'تم حذف المشرف بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};