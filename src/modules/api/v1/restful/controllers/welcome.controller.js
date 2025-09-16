import { WelcomeService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';

/**
 * تحكم في إعدادات الترحيب
 * @module WelcomeController
 */

/**
 * الحصول على جميع إعدادات الترحيب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getAllWelcome = async (req, res) => {
  try {
    const welcome = await WelcomeService.getAllWelcome();
    send(res, welcome, 'تم الحصول على جميع إعدادات الترحيب بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على إعدادات الترحيب بواسطة معرف الخادم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getWelcomeByGuildId = async (req, res) => {
  try {
    const { guildId } = req.params;
    const welcome = await WelcomeService.getWelcomeByGuildId(guildId);
    
    if (!welcome) {
      return send(res, null, 'إعدادات الترحيب غير موجودة', 404);
    }
    
    send(res, welcome, 'تم الحصول على إعدادات الترحيب بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على إعدادات الترحيب التي تحتوي على خلفية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getWelcomeWithBackground = async (req, res) => {
  try {
    const welcome = await WelcomeService.getWelcomeWithBackground();
    send(res, welcome, 'تم الحصول على إعدادات الترحيب مع الخلفية بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على إعدادات الترحيب التي تحتوي على نصوص
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getWelcomeWithText = async (req, res) => {
  try {
    const welcome = await WelcomeService.getWelcomeWithText();
    send(res, welcome, 'تم الحصول على إعدادات الترحيب مع النصوص بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على إعدادات الترحيب بواسطة نمط الأفاتار
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getWelcomeByAvatarStyle = async (req, res) => {
  try {
    const { avatarStyle } = req.params;
    const welcome = await WelcomeService.getWelcomeByAvatarStyle(avatarStyle);
    send(res, welcome, 'تم الحصول على إعدادات الترحيب بواسطة نمط الأفاتار بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * البحث في إعدادات الترحيب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const searchWelcome = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const welcome = await WelcomeService.searchWelcome(searchTerm);
    send(res, welcome, 'تم البحث في إعدادات الترحيب بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * إنشاء إعدادات ترحيب جديدة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const createWelcome = async (req, res) => {
  try {
    const welcomeData = req.body;
    const welcome = await WelcomeService.createWelcome(welcomeData);
    send(res, welcome, 'تم إنشاء إعدادات الترحيب بنجاح', 201);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * إنشاء إعدادات ترحيب للخادم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const createGuildWelcome = async (req, res) => {
  try {
    const { guildId } = req.params;
    const settings = req.body;
    const welcome = await WelcomeService.createGuildWelcome(guildId, settings);
    send(res, welcome, 'تم إنشاء إعدادات ترحيب الخادم بنجاح', 201);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * تحديث إعدادات الترحيب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const updateWelcome = async (req, res) => {
  try {
    const { guildId } = req.params;
    const updateData = req.body;
    const welcome = await WelcomeService.updateWelcome(guildId, updateData);
    send(res, welcome, 'تم تحديث إعدادات الترحيب بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * تحديث إعدادات الصورة
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const updateImageSettings = async (req, res) => {
  try {
    const { guildId } = req.params;
    const imageSettings = req.body;
    const welcome = await WelcomeService.updateImageSettings(guildId, imageSettings);
    send(res, welcome, 'تم تحديث إعدادات الصورة بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * تحديث إعدادات الخلفية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const updateBackgroundSettings = async (req, res) => {
  try {
    const { guildId } = req.params;
    const backgroundSettings = req.body;
    const welcome = await WelcomeService.updateBackgroundSettings(guildId, backgroundSettings);
    send(res, welcome, 'تم تحديث إعدادات الخلفية بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * تحديث إعدادات الأفاتار
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const updateAvatarSettings = async (req, res) => {
  try {
    const { guildId } = req.params;
    const avatarSettings = req.body;
    const welcome = await WelcomeService.updateAvatarSettings(guildId, avatarSettings);
    send(res, welcome, 'تم تحديث إعدادات الأفاتار بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * تحديث النصوص
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const updateTextArray = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { textArray } = req.body;
    const welcome = await WelcomeService.updateTextArray(guildId, textArray);
    send(res, welcome, 'تم تحديث النصوص بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * مسح رابط الخلفية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const clearBackgroundUrl = async (req, res) => {
  try {
    const { guildId } = req.params;
    const welcome = await WelcomeService.clearBackgroundUrl(guildId);
    send(res, welcome, 'تم مسح رابط الخلفية بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * مسح النصوص
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const clearTextArray = async (req, res) => {
  try {
    const { guildId } = req.params;
    const welcome = await WelcomeService.clearTextArray(guildId);
    send(res, welcome, 'تم مسح النصوص بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * إعادة تعيين إعدادات الأفاتار
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const resetAvatarSettings = async (req, res) => {
  try {
    const { guildId } = req.params;
    const welcome = await WelcomeService.resetAvatarSettings(guildId);
    send(res, welcome, 'تم إعادة تعيين إعدادات الأفاتار بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * حذف إعدادات الترحيب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const deleteWelcome = async (req, res) => {
  try {
    const { guildId } = req.params;
    const result = await WelcomeService.deleteWelcome(guildId);
    send(res, result, 'تم حذف إعدادات الترحيب بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * حذف إعدادات الترحيب بدون خلفية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const deleteWelcomeWithoutBackground = async (req, res) => {
  try {
    const result = await WelcomeService.deleteWelcomeWithoutBackground();
    send(res, result, 'تم حذف إعدادات الترحيب بدون خلفية بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * حذف إعدادات الترحيب بدون نصوص
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const deleteWelcomeWithoutText = async (req, res) => {
  try {
    const result = await WelcomeService.deleteWelcomeWithoutText();
    send(res, result, 'تم حذف إعدادات الترحيب بدون نصوص بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * التحقق من وجود إعدادات ترحيب للخادم
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const checkWelcomeExists = async (req, res) => {
  try {
    const { guildId } = req.params;
    const exists = await WelcomeService.checkWelcomeExists(guildId);
    send(res, { exists }, 'تم التحقق من وجود إعدادات الترحيب بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * التحقق من وجود خلفية
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const hasBackground = async (req, res) => {
  try {
    const { guildId } = req.params;
    const hasBackground = await WelcomeService.hasBackground(guildId);
    send(res, { hasBackground }, 'تم التحقق من وجود الخلفية بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * التحقق من وجود نصوص
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const hasTextArray = async (req, res) => {
  try {
    const { guildId } = req.params;
    const hasTextArray = await WelcomeService.hasTextArray(guildId);
    send(res, { hasTextArray }, 'تم التحقق من وجود النصوص بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * الحصول على إحصائيات إعدادات الترحيب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const getWelcomeStats = async (req, res) => {
  try {
    const stats = await WelcomeService.getWelcomeStats();
    send(res, stats, 'تم الحصول على إحصائيات إعدادات الترحيب بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * إنشاء أو تحديث إعدادات الترحيب
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const upsertWelcome = async (req, res) => {
  try {
    const { guildId } = req.params;
    const welcomeData = req.body;
    const welcome = await WelcomeService.upsertWelcome(guildId, welcomeData);
    send(res, welcome, 'تم إنشاء أو تحديث إعدادات الترحيب بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};

/**
 * نسخ إعدادات الترحيب من خادم إلى آخر
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 */
export const copyWelcomeSettings = async (req, res) => {
  try {
    const { sourceGuildId, targetGuildId } = req.body;
    const welcome = await WelcomeService.copyWelcomeSettings(sourceGuildId, targetGuildId);
    send(res, welcome, 'تم نسخ إعدادات الترحيب بنجاح', 200);
  } catch (error) {
    send(res, null, error.message, 500);
  }
};