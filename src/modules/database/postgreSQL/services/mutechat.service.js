import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { MuteChat } from '../models/index.js';

/**
 * خدمة كتم الدردشة - MuteChat Service
 * تحتوي على جميع العمليات المتعلقة بجدول كتم الدردشة
 */
class MuteChatService {
  /**
   * إنشاء سجل كتم جديد
   * @param {Object} muteChatData - بيانات الكتم
   * @returns {Object} نتيجة العملية
   */
  static async createMuteChat(muteChatData) {
  try {
    const result = await PGinsert(MuteChat, muteChatData);
    return {
      success: true,
      data: result,
      message: 'تم إنشاء سجل الكتم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في إنشاء سجل الكتم'
    };
  }
};

  /**
   * جلب جميع سجلات الكتم
   * @param {Object} conditions - شروط البحث
   * @returns {Object} نتيجة العملية
   */
  static async getAllMuteChats(conditions = {}) {
  try {
    const result = await MuteChat.findAll(conditions);
    return {
      success: true,
      data: result,
      message: 'تم جلب سجلات الكتم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في جلب سجلات الكتم'
    };
  }
};

  /**
   * جلب سجل كتم بواسطة المعرف
   * @param {string} id - معرف المستخدم أو الخادم
   * @returns {Object} نتيجة العملية
   */
  static async getMuteChatById(id) {
  try {
    const result = await PGselectAll(MuteChat, { id });
    if (result && result.length > 0) {
      return {
        success: true,
        data: result[0],
        message: 'تم جلب سجل الكتم بنجاح'
      };
    } else {
      return {
        success: false,
        data: null,
        message: 'لم يتم العثور على سجل الكتم'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في جلب سجل الكتم'
    };
  }
};

  /**
   * جلب سجلات الكتم التي تحتوي على بيانات كتم
   * @returns {Object} نتيجة العملية
   */
  static async getMuteChatsWithData() {
  try {
    const result = await MuteChat.findAll();
    const filteredMutes = result.filter(mute => 
      mute.mutes && mute.mutes.trim() !== ''
    );
    return {
      success: true,
      data: filteredMutes,
      message: 'تم جلب سجلات الكتم التي تحتوي على بيانات بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في جلب سجلات الكتم التي تحتوي على بيانات'
    };
  }
};

  /**
   * جلب سجلات الكتم الفارغة
   * @returns {Object} نتيجة العملية
   */
  static async getEmptyMuteChats() {
  try {
    const result = await MuteChat.findAll();
    const emptyMutes = result.filter(mute => 
      !mute.mutes || mute.mutes.trim() === ''
    );
    return {
      success: true,
      data: emptyMutes,
      message: 'تم جلب سجلات الكتم الفارغة بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في جلب سجلات الكتم الفارغة'
    };
  }
};

  /**
   * البحث في سجلات الكتم
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Object} نتيجة العملية
   */
  static async searchMuteChats(searchTerm) {
  try {
    const result = await MuteChat.findAll();
    const filteredMutes = result.filter(mute => 
      (mute.id && mute.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mute.mutes && mute.mutes.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return {
      success: true,
      data: filteredMutes,
      message: 'تم البحث في سجلات الكتم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في البحث في سجلات الكتم'
    };
  }
};

  /**
   * تحديث سجل كتم
   * @param {string} id - معرف المستخدم أو الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Object} نتيجة العملية
   */
  static async updateMuteChat(id, updateData) {
  try {
    const result = await PGupdate(MuteChat, updateData, { id });
    return {
      success: true,
      data: result,
      message: 'تم تحديث سجل الكتم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في تحديث سجل الكتم'
    };
  }
};

  /**
   * تحديث بيانات الكتم فقط
   * @param {string} id - معرف المستخدم أو الخادم
   * @param {string} mutes - بيانات الكتم الجديدة
   * @returns {Object} نتيجة العملية
   */
  static async updateMuteData(id, mutes) {
  try {
    const result = await PGupdate(MuteChat, { mutes }, { id });
    return {
      success: true,
      data: result,
      message: 'تم تحديث بيانات الكتم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في تحديث بيانات الكتم'
    };
  }
};

  /**
   * حذف سجل كتم
   * @param {string} id - معرف المستخدم أو الخادم
   * @returns {Object} نتيجة العملية
   */
  static async deleteMuteChat(id) {
  try {
    const result = await PGdelete(MuteChat, { id });
    return {
      success: true,
      data: result,
      message: 'تم حذف سجل الكتم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في حذف سجل الكتم'
    };
  }
};

  /**
   * مسح بيانات الكتم فقط
   * @param {string} id - معرف المستخدم أو الخادم
   * @returns {Object} نتيجة العملية
   */
  static async clearMuteData(id) {
  try {
    const result = await PGupdate(MuteChat, { mutes: null }, { id });
    return {
      success: true,
      data: result,
      message: 'تم مسح بيانات الكتم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في مسح بيانات الكتم'
    };
  }
};

  /**
   * التحقق من وجود سجل كتم
   * @param {string} id - معرف المستخدم أو الخادم
   * @returns {Object} نتيجة العملية
   */
  static async checkMuteChatExists(id) {
  try {
    const result = await PGselectAll(MuteChat, { id });
    const exists = result && result.length > 0;
    
    return {
      success: true,
      data: { exists, muteChat: exists ? result[0] : null },
      message: exists ? 'يوجد سجل كتم' : 'لا يوجد سجل كتم'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في التحقق من وجود سجل الكتم'
    };
  }
};

  /**
   * التحقق من وجود بيانات كتم للمعرف
   * @param {string} id - معرف المستخدم أو الخادم
   * @returns {Object} نتيجة العملية
   */
  static async checkHasMuteData(id) {
  try {
    const result = await PGselectAll(MuteChat, { id });
    if (result && result.length > 0) {
      const hasMuteData = result[0].mutes && result[0].mutes.trim() !== '';
      return {
        success: true,
        data: { hasMuteData, muteData: result[0].mutes },
        message: hasMuteData ? 'يوجد بيانات كتم' : 'لا توجد بيانات كتم'
      };
    } else {
      return {
        success: true,
        data: { hasMuteData: false, muteData: null },
        message: 'لا يوجد سجل كتم'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في التحقق من وجود بيانات الكتم'
    };
  }
};

  /**
   * إحصائيات سجلات الكتم
   * @returns {Object} نتيجة العملية
   */
  static async getMuteChatStats() {
  try {
    const allMuteChats = await MuteChat.findAll();
    const totalMuteChats = allMuteChats.length;
    const muteChatsWithData = allMuteChats.filter(mute => mute.mutes && mute.mutes.trim() !== '').length;
    const emptyMuteChats = totalMuteChats - muteChatsWithData;
    
    return {
      success: true,
      data: {
        totalMuteChats,
        muteChatsWithData,
        emptyMuteChats,
        percentageWithData: totalMuteChats > 0 ? ((muteChatsWithData / totalMuteChats) * 100).toFixed(2) : 0
      },
      message: 'تم جلب إحصائيات سجلات الكتم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في جلب إحصائيات سجلات الكتم'
    };
  }
};

  /**
   * إضافة أو تحديث بيانات كتم
   * @param {string} id - معرف المستخدم أو الخادم
   * @param {string} mutes - بيانات الكتم
   * @returns {Object} نتيجة العملية
   */
  static async addOrUpdateMuteData(id, mutes) {
  try {
    // التحقق من وجود السجل أولاً
    const existingRecord = await PGselectAll(MuteChat, { id });
    
    if (existingRecord && existingRecord.length > 0) {
      // تحديث السجل الموجود
      const result = await PGupdate(MuteChat, { mutes }, { id });
      return {
        success: true,
        data: result,
        message: 'تم تحديث بيانات الكتم بنجاح'
      };
    } else {
      // إنشاء سجل جديد
      const result = await PGinsert(MuteChat, { id, mutes });
      return {
        success: true,
        data: result,
        message: 'تم إنشاء سجل كتم جديد بنجاح'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في إضافة أو تحديث بيانات الكتم'
    };
  }
  }
}

export default MuteChatService;