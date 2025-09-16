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
 * إنشاء سجل مشرفين للخادم مع الإعدادات الافتراضية
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createGuildAdmins = async (req, res) => {
  try {
    const { guildId, adminsId, maxKb, blacklistKb } = req.body;
    const result = await AdminsService.createGuildAdmins(guildId, adminsId, maxKb, blacklistKb);
    send(res, { data: result }, 'تم إنشاء سجل مشرفين الخادم بنجاح', 201);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في إنشاء سجل مشرفين الخادم', 500);
  }
};

/**
 * الحصول على جميع سجلات المشرفين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAllAdmins = async (req, res) => {
  try {
    const result = await AdminsService.getAllAdmins();
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد سجلات مشرفين', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على سجلات المشرفين بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على سجلات المشرفين', 500);
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
 * الحصول على الخوادم التي لديها مشرفين محددين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getGuildsByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;
    const result = await AdminsService.getGuildsByAdminId(adminId);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لم يتم العثور على خوادم للمشرف', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على خوادم المشرف بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على خوادم المشرف', 500);
  }
};

/**
 * الحصول على الخوادم بواسطة إعداد الحد الأقصى للكيبورد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdminsByMaxKb = async (req, res) => {
  try {
    const { maxKb } = req.query;
    const result = await AdminsService.getAdminsByMaxKb(maxKb === 'true');
    if (result?.length === 0 || !result) {
      send(res, {}, 'لم يتم العثور على مشرفين بهذا الإعداد', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على المشرفين بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على المشرفين', 500);
  }
};

/**
 * الحصول على الخوادم بواسطة إعداد كيبورد القائمة السوداء
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdminsByBlacklistKb = async (req, res) => {
  try {
    const { blacklistKb } = req.query;
    const result = await AdminsService.getAdminsByBlacklistKb(blacklistKb === 'true');
    if (result?.length === 0 || !result) {
      send(res, {}, 'لم يتم العثور على مشرفين بهذا الإعداد', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على المشرفين بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على المشرفين', 500);
  }
};

/**
 * الحصول على الخوادم التي لديها مشرفين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getGuildsWithAdmins = async (req, res) => {
  try {
    const result = await AdminsService.getGuildsWithAdmins();
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد خوادم لديها مشرفين', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على الخوادم التي لديها مشرفين بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على الخوادم', 500);
  }
};

/**
 * الحصول على الخوادم التي ليس لديها مشرفين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getGuildsWithoutAdmins = async (req, res) => {
  try {
    const result = await AdminsService.getGuildsWithoutAdmins();
    if (result?.length === 0 || !result) {
      send(res, {}, 'جميع الخوادم لديها مشرفين', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على الخوادم التي ليس لديها مشرفين بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على الخوادم', 500);
  }
};

/**
 * الحصول على أحدث سجلات المشرفين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getRecentAdmins = async (req, res) => {
  try {
    const { limit } = req.query;
    const result = await AdminsService.getRecentAdmins(limit ? parseInt(limit) : 10);
    if (result?.length === 0 || !result) {
      send(res, {}, 'لا توجد سجلات مشرفين حديثة', 404);
    } else {
      send(res, { data: result }, 'تم الحصول على أحدث سجلات المشرفين بنجاح', 200);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على السجلات الحديثة', 500);
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
 * تحديث معرفات المشرفين للخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateAdminsId = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { adminsId } = req.body;
    const result = await AdminsService.updateAdminsId(guildId, adminsId);
    send(res, { data: result }, 'تم تحديث معرفات المشرفين بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث معرفات المشرفين', 500);
  }
};

/**
 * تحديث إعداد الحد الأقصى للكيبورد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateMaxKb = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { maxKb } = req.body;
    const result = await AdminsService.updateMaxKb(guildId, maxKb);
    send(res, { data: result }, 'تم تحديث إعداد الحد الأقصى للكيبورد بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث إعداد الحد الأقصى للكيبورد', 500);
  }
};

/**
 * تحديث إعداد كيبورد القائمة السوداء
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateBlacklistKb = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { blacklistKb } = req.body;
    const result = await AdminsService.updateBlacklistKb(guildId, blacklistKb);
    send(res, { data: result }, 'تم تحديث إعداد كيبورد القائمة السوداء بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث إعداد كيبورد القائمة السوداء', 500);
  }
};

/**
 * إضافة مشرف جديد إلى قائمة المشرفين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const addAdmin = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { adminId } = req.body;
    const result = await AdminsService.addAdmin(guildId, adminId);
    send(res, { data: result }, 'تم إضافة المشرف بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في إضافة المشرف', 500);
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
 * تبديل إعداد الحد الأقصى للكيبورد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const toggleMaxKb = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await AdminsService.toggleMaxKb(guildId);
    send(res, { data: result }, 'تم تبديل إعداد الحد الأقصى للكيبورد بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تبديل إعداد الحد الأقصى للكيبورد', 500);
  }
};

/**
 * تبديل إعداد كيبورد القائمة السوداء
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const toggleBlacklistKb = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await AdminsService.toggleBlacklistKb(guildId);
    send(res, { data: result }, 'تم تبديل إعداد كيبورد القائمة السوداء بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تبديل إعداد كيبورد القائمة السوداء', 500);
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

/**
 * حذف السجلات القديمة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteOldAdmins = async (req, res) => {
  try {
    const { days } = req.query;
    const result = await AdminsService.deleteOldAdmins(days ? parseInt(days) : 365);
    send(res, { data: result }, 'تم حذف السجلات القديمة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في حذف السجلات القديمة', 500);
  }
};

/**
 * الحصول على إحصائيات المشرفين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAdminsStats = async (req, res) => {
  try {
    const result = await AdminsService.getAdminsStats();
    send(res, { data: result }, 'تم الحصول على إحصائيات المشرفين بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إحصائيات المشرفين', 500);
  }
};

/**
 * التحقق من وجود سجل المشرفين للخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const existsAdmins = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await AdminsService.existsAdmins(guildId);
    send(res, { data: { exists: result } }, result ? 'سجل المشرفين موجود' : 'سجل المشرفين غير موجود', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في التحقق من وجود سجل المشرفين', 500);
  }
};

/**
 * التحقق من كون المستخدم مشرف في الخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const isUserAdmin = async (req, res) => {
  try {
    const { guildId, userId } = req.params;
    const result = await AdminsService.isUserAdmin(guildId, userId);
    send(res, { data: { isAdmin: result } }, result ? 'المستخدم مشرف' : 'المستخدم ليس مشرف', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في التحقق من صلاحيات المشرف', 500);
  }
};