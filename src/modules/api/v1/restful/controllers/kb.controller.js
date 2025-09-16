import { KbService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

const kbService = new KbService();

/**
 * تحكم KB - إدارة عمليات قاعدة المعرفة
 */

/**
 * الحصول على جميع سجلات قاعدة المعرفة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAllKB = async (req, res) => {
  try {
    const result = await kbService.getAllKB();
    if (result.success) {
      send(res, { data: result?.data }, result.message, 200);
    } else {
      send(res, {}, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في جلب جميع سجلات قاعدة المعرفة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على سجل قاعدة المعرفة بواسطة المعرف
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getKBById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await kbService.getKBById(id);
    if (result.success) {
      send(res, { data: result?.data }, result.message, 200);
    } else {
      send(res, {}, result.message, 404);
    }
  } catch (error) {
    console.error('خطأ في جلب سجل قاعدة المعرفة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على سجلات قاعدة المعرفة بواسطة معرف الخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getKBByGuildId = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await kbService.getKBByGuildId(guildId);
    if (result.success) {
      send(res, { data: result?.data }, result.message, 200);
    } else {
      send(res, {}, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في جلب سجلات قاعدة المعرفة للخادم:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على سجلات قاعدة المعرفة بواسطة معرف المستخدم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getKBByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await kbService.getKBByUserId(userId);
    if (result.success) {
      send(res, { data: result?.data }, result.message, 200);
    } else {
      send(res, {}, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في جلب سجلات قاعدة المعرفة للمستخدم:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على إحصائيات قاعدة المعرفة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getKBStats = async (req, res) => {
  try {
    const result = await kbService.getKBStats();
    if (result.success) {
      send(res, { data: result?.data }, result.message, 200);
    } else {
      send(res, {}, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في جلب إحصائيات قاعدة المعرفة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * البحث في سجلات قاعدة المعرفة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const searchKB = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const { guildId } = req.params;
    const result = await kbService.searchKB(searchTerm, guildId);
    if (result.success) {
      send(res, { data: result?.data }, result.message, 200);
    } else {
      send(res, {}, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في البحث في قاعدة المعرفة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * إنشاء سجل قاعدة معرفة جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createKB = async (req, res) => {
  try {
    const kbData = req.body;
    const result = await kbService.createKB(kbData);
    send(res, { data: result?.data }, 'تم إنشاء سجل قاعدة المعرفة بنجاح', 201);
  } catch (error) {
    console.error('خطأ في إنشاء سجل قاعدة المعرفة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث سجل قاعدة المعرفة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateKB = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await kbService.updateKB(id, updateData);
    send(res, { data: result?.data }, 'تم تحديث سجل قاعدة المعرفة بنجاح', 200);
  } catch (error) {
    console.error('خطأ في تحديث سجل قاعدة المعرفة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث طول قاعدة المعرفة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateKBLength = async (req, res) => {
  try {
    const { id } = req.params;
    const { kbLength } = req.body;
    const result = await kbService.updateKBLength(id, kbLength);
    send(res, { data: result?.data }, 'تم تحديث طول قاعدة المعرفة بنجاح', 200);
  } catch (error) {
    console.error('خطأ في تحديث طول قاعدة المعرفة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف سجل قاعدة المعرفة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteKB = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await kbService.deleteKB(id);
    if (result) {
      send(res, { data: result }, 'تم حذف سجل قاعدة المعرفة بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على سجل قاعدة المعرفة', 404);
    }
  } catch (error) {
    console.error('خطأ في حذف سجل قاعدة المعرفة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف جميع سجلات قاعدة المعرفة لخادم معين
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteKBByGuildId = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await kbService.deleteKBByGuildId(guildId);
    if (result) {
      send(res, { data: result }, 'تم حذف جميع سجلات قاعدة المعرفة للخادم بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على سجلات قاعدة المعرفة للخادم', 404);
    }
  } catch (error) {
    console.error('خطأ في حذف سجلات قاعدة المعرفة للخادم:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * التحقق من وجود سجل قاعدة المعرفة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const checkKBExists = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await kbService.checkKBExists(id);
    if (result.success) {
      send(res, { data: { exists: result.exists } }, result.message, 200);
    } else {
      send(res, {}, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في التحقق من وجود سجل قاعدة المعرفة:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};