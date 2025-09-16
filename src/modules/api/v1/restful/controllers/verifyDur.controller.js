import { VerifyDurService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * إنشاء سجل مدة تحقق جديد
 */
export const createVerifyDur = async (req, res) => {
  try {
    const result = await VerifyDurService.createVerifyDur(req.value.body);
    send(res, result, 'تم إنشاء سجل مدة التحقق بنجاح', 201);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * إنشاء سجل مدة تحقق للمستخدم
 */
export const createUserVerifyDur = async (req, res) => {
  try {
    const { userId, guildId, duration } = req.value.body;
    const result = await VerifyDurService.createUserVerifyDur(userId, guildId, duration);
    console.log("\n!#############! result : ", result, "\n\n");
    send(res, result, 'تم إنشاء سجل مدة التحقق للمستخدم بنجاح', 201);
  } catch (error) {
    console.log("\n!#############! req.value : ", req.value, "\n, req.value.body : ", req.value.body, "\n\n", ", error.message : ", error);
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على جميع سجلات مدة التحقق
 */
export const getAllVerifyDur = async (req, res) => {
  try {
    const result = await VerifyDurService.getAllVerifyDur();
    send(res, result, 'تم الحصول على جميع سجلات مدة التحقق بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على سجل مدة التحقق بواسطة المعرف
 */
export const getVerifyDurById = async (req, res) => {
  try {
    const { id } = req.value.params;
    const result = await VerifyDurService.getVerifyDurById(id);
    if (!result) {
      return send(res, null, 'سجل مدة التحقق غير موجود', 404);
    }
    send(res, result, 'تم الحصول على سجل مدة التحقق بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على سجل مدة التحقق للمستخدم والخادم
 */
export const getVerifyDurByUserAndGuild = async (req, res) => {
  try {
    const { userId, guildId } = req.value.params;
    const result = await VerifyDurService.getVerifyDurByUserAndGuild(userId, guildId);
    if (!result) {
      return send(res, null, 'سجل مدة التحقق غير موجود', 404);
    }
    send(res, result, 'تم الحصول على سجل مدة التحقق بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على سجلات مدة التحقق للمستخدم
 */
export const getVerifyDurByUserId = async (req, res) => {
  try {
    const { userId } = req.value.params;
    const result = await VerifyDurService.getVerifyDurByUserId(userId);
    send(res, result, 'تم الحصول على سجلات مدة التحقق للمستخدم بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على سجلات مدة التحقق للخادم
 */
export const getVerifyDurByGuildId = async (req, res) => {
  try {
    const { guildId } = req.value.params;
    const result = await VerifyDurService.getVerifyDurByGuildId(guildId);
    send(res, result, 'تم الحصول على سجلات مدة التحقق للخادم بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على سجلات مدة التحقق بواسطة المدة
 */
export const getVerifyDurByDuration = async (req, res) => {
  try {
    const { duration } = req.value.params;
    const result = await VerifyDurService.getVerifyDurByDuration(duration);
    send(res, result, 'تم الحصول على سجلات مدة التحقق بواسطة المدة بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * تحديث سجل مدة التحقق
 */
export const updateVerifyDur = async (req, res) => {
  try {
    const { id } = req.value.params;
    const result = await VerifyDurService.updateVerifyDur(id, req.value.body);
    send(res, result, 'تم تحديث سجل مدة التحقق بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * تحديث مدة التحقق للمستخدم
 */
export const updateUserVerifyDuration = async (req, res) => {
  try {
    const { userId, guildId } = req.value.params;
    const { duration } = req.value.body;
    const result = await VerifyDurService.updateUserVerifyDuration(userId, guildId, duration);
    send(res, result, 'تم تحديث مدة التحقق للمستخدم بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * حذف سجل مدة التحقق
 */
export const deleteVerifyDur = async (req, res) => {
  try {
    const { id } = req.value.params;
    const result = await VerifyDurService.deleteVerifyDur(id);
    send(res, result, 'تم حذف سجل مدة التحقق بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * حذف سجل مدة التحقق للمستخدم
 */
export const deleteUserVerifyDur = async (req, res) => {
  try {
    const { userId, guildId } = req.value.params;
    const result = await VerifyDurService.deleteUserVerifyDur(userId, guildId);
    send(res, result, 'تم حذف سجل مدة التحقق للمستخدم بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على إحصائيات مدة التحقق
 */
export const getVerifyDurStats = async (req, res) => {
  try {
    const result = await VerifyDurService.getVerifyDurStats();
    send(res, result, 'تم الحصول على إحصائيات مدة التحقق بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * التحقق من انتهاء صلاحية مدة التحقق
 */
export const isVerifyDurExpired = async (req, res) => {
  try {
    const { userId, guildId } = req.value.params;
    const result = await VerifyDurService.isVerifyDurExpired(userId, guildId);
    send(res, result, 'تم التحقق من انتهاء صلاحية مدة التحقق بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على الوقت المتبقي لانتهاء مدة التحقق
 */
export const getRemainingVerifyTime = async (req, res) => {
  try {
    const { userId, guildId } = req.value.params;
    const result = await VerifyDurService.getRemainingVerifyTime(userId, guildId);
    send(res, result, 'تم الحصول على الوقت المتبقي بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};