import { LinksService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

const linksService = new LinksService();

/**
 * تحكم الروابط - إدارة عمليات الروابط
 */

/**
 * إنشاء رابط جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createLink = async (req, res) => {
  try {
    const linkData = req.body;
    const result = await linksService.createLink(linkData);
    if (result.success) {
      send(res, { data: result.data }, result.message, 201);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في إنشاء الرابط:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على جميع الروابط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAllLinks = async (req, res) => {
  try {
    const result = await linksService.getAllLinks();
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في جلب جميع الروابط:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على رابط بواسطة معرف الخادم
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getLinkByGuildId = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await linksService.getLinkByGuildId(guildId);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, {}, result.message, 404);
    }
  } catch (error) {
    console.error('خطأ في جلب الرابط للخادم:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على الروابط التي تحتوي على URL
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getLinksWithURL = async (req, res) => {
  try {
    const result = await linksService.getLinksWithURL();
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في جلب الروابط التي تحتوي على URL:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * الحصول على الروابط التي تحتوي على محادثات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getLinksWithChats = async (req, res) => {
  try {
    const result = await linksService.getLinksWithChats();
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في جلب الروابط التي تحتوي على محادثات:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * البحث في الروابط بواسطة URL
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const searchLinksByURL = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const result = await linksService.searchLinksByURL(searchTerm);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في البحث في الروابط:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث رابط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateLink = async (req, res) => {
  try {
    const { guildId } = req.params;
    const updateData = req.body;
    const result = await linksService.updateLink(guildId, updateData);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في تحديث الرابط:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث رابط URL
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateLinkURL = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { link } = req.body;
    const result = await linksService.updateLinkURL(guildId, link);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في تحديث رابط URL:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث محادثات الرابط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateLinkChats = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { chats } = req.body;
    const result = await linksService.updateLinkChats(guildId, chats);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في تحديث محادثات الرابط:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * تحديث بيانات التحديد للرابط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateLinkSelectData = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { select_d } = req.body;
    const result = await linksService.updateLinkSelectData(guildId, select_d);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في تحديث بيانات التحديد:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * حذف رابط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteLink = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await linksService.deleteLink(guildId);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, {}, result.message, 404);
    }
  } catch (error) {
    console.error('خطأ في حذف الرابط:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * مسح رابط URL فقط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const clearLinkURL = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await linksService.clearLinkURL(guildId);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في مسح رابط URL:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * مسح محادثات الرابط فقط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const clearLinkChats = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await linksService.clearLinkChats(guildId);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في مسح محادثات الرابط:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * التحقق من وجود رابط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const checkLinkExists = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await linksService.checkLinkExists(guildId);
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في التحقق من وجود الرابط:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};

/**
 * إحصائيات الروابط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getLinkStats = async (req, res) => {
  try {
    const result = await linksService.getLinkStats();
    if (result.success) {
      send(res, { data: result.data }, result.message, 200);
    } else {
      send(res, { error: result.error }, result.message, 400);
    }
  } catch (error) {
    console.error('خطأ في جلب إحصائيات الروابط:', error);
    send(res, { error: error.message }, 'خطأ داخلي في الخادم', 500);
  }
};