import send from '../../../../../utils/responseHandler.util.js';
import { MutevoiceService as MuteVoiceService } from '../../../../database/postgreSQL/index.js';

/**
 * إنشاء سجل كتم صوت جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const createMuteVoice = async (req, res) => {
  try {
    const result = await MuteVoiceService.createMuteVoice(req.body);
    send(res, { data: result }, 'تم إنشاء سجل كتم الصوت بنجاح', 201);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في إنشاء سجل كتم الصوت', 500);
  }
};

/**
 * جلب جميع سجلات كتم الصوت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getAllMuteVoices = async (req, res) => {
  try {
    const result = await MuteVoiceService.getAllMuteVoices();
    send(res, { data: result }, 'تم جلب سجلات كتم الصوت بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في جلب سجلات كتم الصوت', 500);
  }
};

/**
 * جلب سجل كتم صوت بواسطة المعرف
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getMuteVoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteVoiceService.getMuteVoiceById(id);
    
    if (!result) {
      send(res, {}, 'لم يتم العثور على سجل كتم الصوت', 404);
      return;
    }
    
    send(res, { data: result }, 'تم جلب سجل كتم الصوت بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في جلب سجل كتم الصوت', 500);
  }
};

/**
 * جلب سجلات كتم الصوت التي تحتوي على بيانات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getMuteVoicesWithData = async (req, res) => {
  try {
    const result = await MuteVoiceService.getMuteVoicesWithData();
    send(res, { data: result }, 'تم جلب سجلات كتم الصوت مع البيانات بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في جلب سجلات كتم الصوت مع البيانات', 500);
  }
};

/**
 * جلب سجلات كتم الصوت الفارغة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getEmptyMuteVoices = async (req, res) => {
  try {
    const result = await MuteVoiceService.getEmptyMuteVoices();
    send(res, { data: result }, 'تم جلب سجلات كتم الصوت الفارغة بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في جلب سجلات كتم الصوت الفارغة', 500);
  }
};

/**
 * البحث في سجلات كتم الصوت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const searchMuteVoices = async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const result = await MuteVoiceService.searchMuteVoices(searchTerm);
    send(res, { data: result }, 'تم البحث في سجلات كتم الصوت بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في البحث في سجلات كتم الصوت', 500);
  }
};

/**
 * تحديث سجل كتم صوت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateMuteVoice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteVoiceService.updateMuteVoice(id, req.body);
    send(res, { data: result }, 'تم تحديث سجل كتم الصوت بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث سجل كتم الصوت', 500);
  }
};

/**
 * تحديث بيانات الكتم الصوتي فقط
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const updateMuteData = async (req, res) => {
  try {
    const { id } = req.params;
    const { mutes } = req.body;
    const result = await MuteVoiceService.updateMuteData(id, mutes);
    send(res, { data: result }, 'تم تحديث بيانات الكتم الصوتي بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في تحديث بيانات الكتم الصوتي', 500);
  }
};

/**
 * حذف سجل كتم صوت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const deleteMuteVoice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteVoiceService.deleteMuteVoice(id);
    
    if (result) {
      send(res, { data: result }, 'تم حذف سجل كتم الصوت بنجاح', 200);
    } else {
      send(res, {}, 'لم يتم العثور على سجل كتم الصوت للحذف', 404);
    }
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في حذف سجل كتم الصوت', 500);
  }
};

/**
 * مسح بيانات الكتم الصوتي
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const clearMuteData = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteVoiceService.clearMuteData(id);
    send(res, { data: result }, 'تم مسح بيانات الكتم الصوتي بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في مسح بيانات الكتم الصوتي', 500);
  }
};

/**
 * التحقق من وجود سجل كتم صوت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const checkMuteVoiceExists = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteVoiceService.checkMuteVoiceExists(id);
    send(res, { data: { exists: result } }, 'تم التحقق من وجود سجل كتم الصوت', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في التحقق من وجود سجل كتم الصوت', 500);
  }
};

/**
 * التحقق من وجود بيانات كتم صوتي
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const checkHasMuteData = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MuteVoiceService.checkHasMuteData(id);
    send(res, { data: { hasData: result } }, 'تم التحقق من وجود بيانات الكتم الصوتي', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في التحقق من وجود بيانات الكتم الصوتي', 500);
  }
};

/**
 * الحصول على إحصائيات سجلات كتم الصوت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const getMuteVoiceStats = async (req, res) => {
  try {
    const result = await MuteVoiceService.getMuteVoiceStats();
    send(res, { data: result }, 'تم الحصول على إحصائيات كتم الصوت بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في الحصول على إحصائيات كتم الصوت', 500);
  }
};

/**
 * إضافة أو تحديث بيانات كتم صوتي
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
export const addOrUpdateMuteData = async (req, res) => {
  try {
    const { id } = req.params;
    const { mutes } = req.body;
    const result = await MuteVoiceService.addOrUpdateMuteData(id, mutes);
    send(res, { data: result }, 'تم إضافة أو تحديث بيانات الكتم الصوتي بنجاح', 200);
  } catch (error) {
    send(res, { error: error.message }, 'خطأ في إضافة أو تحديث بيانات الكتم الصوتي', 500);
  }
};