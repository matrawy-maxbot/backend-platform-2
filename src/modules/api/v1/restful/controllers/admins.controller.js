import { AdminsService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في عمليات المشرفين
 * @module AdminsController
 */

/**
 * إنشاء سجل مشرفين جديد للخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createAdmins = async (req, res) => {
  try {
    const result = await AdminsService.createAdmins(req.body);
    send(res, { data: result }, 'تم إنشاء سجل المشرفين بنجاح', 201);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في إنشاء سجل المشرفين', 500);
  }
};

/**
 * الحصول على سجل المشرفين بواسطة معرف الخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdminsByGuildId = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await AdminsService.getAdminsByGuildId(guildId);
    if (!result) {
      send(res, {}, 'لم يتم العثور على سجل مشرفين الخادم', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على سجل مشرفين الخادم بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على سجل مشرفين الخادم', 500);
  }
};

/**
 * تحديث سجل المشرفين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateAdmins = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await AdminsService.updateAdmins(guildId, req.body);
    send(res, { data: result }, 'تم تحديث سجل المشرفين بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث سجل المشرفين', 500);
  }
};

/**
 * إزالة مشرف من قائمة المشرفين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const removeAdmin = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { adminId } = req.body;
    const result = await AdminsService.removeAdmin(guildId, adminId);
    send(res, { data: result }, 'تم إزالة المشرف بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في إزالة المشرف', 500);
  }
};

/**
 * حذف سجل المشرفين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteAdmins = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await AdminsService.deleteAdmins(guildId);
    if (result) {
      send(res, { data: result }, 'تم حذف سجل المشرفين بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على سجل المشرفين للحذف', 404);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في حذف سجل المشرفين', 500);
  }
};