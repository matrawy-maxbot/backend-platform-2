import { MutechatService as MuteChatService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في كتم الدردشة
 * @module MuteChatController
 */

/**
 * إنشاء سجل كتم جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const createMuteChat = async (req, res) => {
  try {
    const result = await MuteChatService.createMuteChat(req.body);
    if (result.success) {
      send(res, { data: result.data }, result.message, 201);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على جميع سجلات الكتم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getAllMuteChats = async (req, res) => {
  try {
    const result = await MuteChatService.getAllMuteChats();
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 500);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على سجل كتم بواسطة المعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getMuteChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteChatService.getMuteChatById(id);
    if (result.success && result.data) {
      send(res, { data: result.data }, result.message, 200);
    } else if (result.success && !result.data) {
      send(res, {}, result.message, 404);
    } else {
      send(res, { error: result.error }, result.message, 500);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على سجلات الكتم التي تحتوي على بيانات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getMuteChatsWithData = async (req, res) => {
  try {
    const result = await MuteChatService.getMuteChatsWithData();
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 500);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على سجلات الكتم الفارغة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getEmptyMuteChats = async (req, res) => {
  try {
    const result = await MuteChatService.getEmptyMuteChats();
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 500);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * البحث في سجلات الكتم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const searchMuteChats = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const result = await MuteChatService.searchMuteChats(searchTerm);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 500);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث سجل كتم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const updateMuteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteChatService.updateMuteChat(id, req.body);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث بيانات الكتم فقط
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const updateMuteData = async (req, res) => {
  try {
    const { id } = req.params;
    const { mutes } = req.body;
    const result = await MuteChatService.updateMuteData(id, mutes);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف سجل كتم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const deleteMuteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteChatService.deleteMuteChat(id);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * مسح بيانات الكتم فقط
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const clearMuteData = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteChatService.clearMuteData(id);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * التحقق من وجود سجل كتم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const checkMuteChatExists = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteChatService.checkMuteChatExists(id);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 500);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * التحقق من وجود بيانات كتم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const checkHasMuteData = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteChatService.checkHasMuteData(id);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 500);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على إحصائيات سجلات الكتم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getMuteChatStats = async (req, res) => {
  try {
    const result = await MuteChatService.getMuteChatStats();
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 500);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * إضافة أو تحديث بيانات كتم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const addOrUpdateMuteData = async (req, res) => {
  try {
    const { id } = req.params;
    const { mutes } = req.body;
    const result = await MuteChatService.addOrUpdateMuteData(id, mutes);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};