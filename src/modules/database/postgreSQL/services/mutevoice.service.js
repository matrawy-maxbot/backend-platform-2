import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { MuteVoice } from '../models/index.js';

/**
 * خدمة كتم الصوت (MuteVoice Service)
 * تحتوي على جميع العمليات المتعلقة بإدارة بيانات كتم الصوت
 */
class MuteVoiceService {
  /**
   * إنشاء سجل كتم صوت جديد
   * @param {Object} muteVoiceData - بيانات كتم الصوت
   * @returns {Promise<Object>} - السجل المُنشأ
   */
  static async createMuteVoice(muteVoiceData) {
  try {
    const result = await PGinsert(MuteVoice, muteVoiceData);
    return result;
  } catch (error) {
    console.error('خطأ في إنشاء سجل كتم الصوت:', error);
    throw error;
  }
};

  /**
   * جلب جميع سجلات كتم الصوت
   * @returns {Promise<Array>} - قائمة بجميع سجلات كتم الصوت
   */
  static async getAllMuteVoices() {
  try {
    const result = await MuteVoice.findAll();
    return result;
  } catch (error) {
    console.error('خطأ في جلب سجلات كتم الصوت:', error);
    throw error;
  }
};

  /**
   * جلب سجل كتم صوت بواسطة المعرف
   * @param {string} id - معرف السجل
   * @returns {Promise<Object|null>} - سجل كتم الصوت أو null
   */
  static async getMuteVoiceById(id) {
  try {
    const result = await PGselectAll(MuteVoice, { id });
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('خطأ في جلب سجل كتم الصوت بالمعرف:', error);
    throw error;
  }
};

  /**
   * تحديث سجل كتم صوت
   * @param {string} id - معرف السجل
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateMuteVoice(id, updateData) {
  try {
    const result = await PGupdate(MuteVoice, updateData, { id });
    return result;
  } catch (error) {
    console.error('خطأ في تحديث سجل كتم الصوت:', error);
    throw error;
  }
};

  /**
   * حذف سجل كتم صوت
   * @param {string} id - معرف السجل
   * @returns {Promise<boolean>} - نتيجة عملية الحذف
   */
  static async deleteMuteVoice(id) {
  try {
    const result = await PGdelete(MuteVoice, { id });
    return result;
  } catch (error) {
    console.error('خطأ في حذف سجل كتم الصوت:', error);
    throw error;
  }
};

  /**
   * جلب سجلات كتم الصوت التي تحتوي على بيانات كتم
   * @returns {Promise<Array>} - قائمة بسجلات كتم الصوت التي تحتوي على بيانات
   */
  static async getMuteVoicesWithData() {
  try {
    const result = await MuteVoice.findAll();
    return result.filter(voice => voice.mutes !== null);
  } catch (error) {
    console.error('خطأ في جلب سجلات كتم الصوت مع البيانات:', error);
    throw error;
  }
};

  /**
   * جلب سجلات كتم الصوت الفارغة (بدون بيانات كتم)
   * @returns {Promise<Array>} - قائمة بسجلات كتم الصوت الفارغة
   */
  static async getEmptyMuteVoices() {
  try {
    const result = await PGselectAll(MuteVoice, { mutes: null });
    return result;
  } catch (error) {
    console.error('خطأ في جلب سجلات كتم الصوت الفارغة:', error);
    throw error;
  }
};

  /**
   * البحث في سجلات كتم الصوت
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Promise<Array>} - نتائج البحث
   */
  static async searchMuteVoices(searchTerm) {
  try {
    const result = await MuteVoice.findAll();
    return result.filter(voice => 
      (voice.id && voice.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (voice.mutes && voice.mutes.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  } catch (error) {
    console.error('خطأ في البحث في سجلات كتم الصوت:', error);
    throw error;
  }
};

  /**
   * تحديث بيانات الكتم الصوتي فقط
   * @param {string} id - معرف السجل
   * @param {string} muteData - بيانات الكتم الجديدة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateMuteData(id, muteData) {
  try {
    const result = await PGupdate(MuteVoice, { mutes: muteData }, { id });
    return result;
  } catch (error) {
    console.error('خطأ في تحديث بيانات الكتم الصوتي:', error);
    throw error;
  }
};

  /**
   * مسح بيانات الكتم الصوتي
   * @param {string} id - معرف السجل
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async clearMuteData(id) {
  try {
    const result = await PGupdate(MuteVoice, { mutes: null }, { id });
    return result;
  } catch (error) {
    console.error('خطأ في مسح بيانات الكتم الصوتي:', error);
    throw error;
  }
};

  /**
   * التحقق من وجود سجل كتم صوت
   * @param {string} id - معرف السجل
   * @returns {Promise<boolean>} - true إذا كان السجل موجود
   */
  static async checkMuteVoiceExists(id) {
  try {
    const result = await PGselectAll(MuteVoice, { id });
    return result.length > 0;
  } catch (error) {
    console.error('خطأ في التحقق من وجود سجل كتم الصوت:', error);
    throw error;
  }
};

  /**
   * التحقق من وجود بيانات كتم صوتي
   * @param {string} id - معرف السجل
   * @returns {Promise<boolean>} - true إذا كان يحتوي على بيانات كتم
   */
  static async checkHasMuteData(id) {
  try {
    const result = await PGselectAll(MuteVoice, { id });
    return result.length > 0 && result[0].mutes !== null;
  } catch (error) {
    console.error('خطأ في التحقق من وجود بيانات الكتم الصوتي:', error);
    throw error;
  }
};

  /**
   * الحصول على إحصائيات سجلات كتم الصوت
   * @returns {Promise<Object>} - إحصائيات سجلات كتم الصوت
   */
  static async getMuteVoiceStats() {
  try {
    const allRecords = await MuteVoice.findAll();
    const withData = allRecords.filter(voice => voice.mutes !== null);
    const empty = allRecords.filter(voice => voice.mutes === null);
    
    return {
      total: allRecords.length,
      withMuteData: withData.length,
      empty: empty.length
    };
  } catch (error) {
    console.error('خطأ في الحصول على إحصائيات كتم الصوت:', error);
    throw error;
  }
};

  /**
   * إضافة أو تحديث بيانات كتم صوتي
   * @param {string} id - معرف السجل
   * @param {string} muteData - بيانات الكتم
   * @returns {Promise<Object>} - السجل المُنشأ أو المحدث
   */
  static async addOrUpdateMuteData(id, muteData) {
  try {
    const exists = await checkMuteVoiceExists(id);
    
    if (exists) {
      return await updateMuteData(id, muteData);
    } else {
      return await createMuteVoice({ id, mutes: muteData });
    }
  } catch (error) {
    console.error('خطأ في إضافة أو تحديث بيانات الكتم الصوتي:', error);
    throw error;
  }
  }
}

export default MuteVoiceService;