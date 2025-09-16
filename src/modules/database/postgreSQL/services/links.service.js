import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Links } from '../models/index.js';

/**
 * خدمة الروابط - Links Service
 * تحتوي على جميع العمليات المتعلقة بجدول الروابط
 */
class LinksService {
  /**
   * إنشاء رابط جديد
   * @param {Object} linkData - بيانات الرابط
   * @returns {Object} نتيجة العملية
   */
  async createLink(linkData) {
  try {
    const result = await PGinsert(Links, linkData);
    return {
      success: true,
      data: result,
      message: 'تم إنشاء الرابط بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في إنشاء الرابط'
    };
  }
};

  /**
   * جلب جميع الروابط
   * @param {Object} conditions - شروط البحث
   * @returns {Object} نتيجة العملية
   */
  async getAllLinks(conditions = {}) {
  try {
    const result = await Links.findAll(conditions);
    return {
      success: true,
      data: result,
      message: 'تم جلب الروابط بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في جلب الروابط'
    };
  }
};

  /**
   * جلب رابط بواسطة معرف الخادم
   * @param {string} guild_id - معرف الخادم
   * @returns {Object} نتيجة العملية
   */
  async getLinkByGuildId(guild_id) {
  try {
    const result = await PGselectAll(Links, { guild_id });
    if (result && result.length > 0) {
      return {
        success: true,
        data: result[0],
        message: 'تم جلب الرابط بنجاح'
      };
    } else {
      return {
        success: false,
        data: null,
        message: 'لم يتم العثور على الرابط'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في جلب الرابط'
    };
  }
};

/**
   * جلب الروابط التي تحتوي على URL
   * @returns {Object} نتيجة العملية
   */
  async getLinksWithURL() {
  try {
    // استخدام النموذج الأصلي للحصول على جميع الصفوف بدون فلتر
    const result = await Links.findAll();
    const filteredLinks = result.filter(link => 
      link.link && link.link.trim() !== ''
    ).map(link => link.toJSON());
    return {
      success: true,
      data: filteredLinks,
      message: 'تم جلب الروابط التي تحتوي على رابط بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في جلب الروابط التي تحتوي على رابط'
    };
  }
};

/**
   * جلب الروابط التي تحتوي على محادثات
   * @returns {Object} نتيجة العملية
   */
  async getLinksWithChats() {
  try {
    // استخدام النموذج الأصلي للحصول على جميع الصفوف بدون فلتر
    const result = await Links.findAll();
    const filteredLinks = result.filter(link => 
      link.chats && link.chats.trim() !== ''
    ).map(link => link.toJSON());
    return {
      success: true,
      data: filteredLinks,
      message: 'تم جلب الروابط التي تحتوي على دردشات بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في جلب الروابط التي تحتوي على دردشات'
    };
  }
};

/**
   * البحث في الروابط بواسطة URL
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Object} نتيجة العملية
   */
  async searchLinksByURL(searchTerm) {
  try {
    // استخدام النموذج الأصلي للحصول على جميع الصفوف بدون فلتر
    const result = await Links.findAll();
    const filteredLinks = result.filter(link => 
      link.link && link.link.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(link => link.toJSON());
    return {
      success: true,
      data: filteredLinks,
      message: 'تم البحث في الروابط بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في البحث في الروابط'
    };
  }
};

  /**
   * تحديث رابط
   * @param {string} guild_id - معرف الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Object} نتيجة العملية
   */
  async updateLink(guild_id, updateData) {
  try {
    const result = await PGupdate(Links, updateData, { guild_id });
    return {
      success: true,
      data: result,
      message: 'تم تحديث الرابط بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في تحديث الرابط'
    };
  }
};

/**
   * تحديث رابط URL
   * @param {string} guild_id - معرف الخادم
   * @param {string} link - الرابط الجديد
   * @returns {Object} نتيجة العملية
   */
  async updateLinkURL(guild_id, link) {
  try {
    const result = await PGupdate(Links, { link }, { guild_id });
    return {
      success: true,
      data: result,
      message: 'تم تحديث رابط الخادم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في تحديث رابط الخادم'
    };
  }
};

/**
   * تحديث محادثات الرابط
   * @param {string} guild_id - معرف الخادم
   * @param {Array} chats - المحادثات الجديدة
   * @returns {Object} نتيجة العملية
   */
  async updateLinkChats(guild_id, chats) {
  try {
    const result = await PGupdate(Links, { chats }, { guild_id });
    return {
      success: true,
      data: result,
      message: 'تم تحديث دردشات الخادم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في تحديث دردشات الخادم'
    };
  }
};

/**
   * تحديث بيانات التحديد للرابط
   * @param {string} guild_id - معرف الخادم
   * @param {string} select_d - بيانات التحديد الجديدة
   * @returns {Object} نتيجة العملية
   */
  async updateLinkSelectData(guild_id, select_d) {
  try {
    const result = await PGupdate(Links, { select_d }, { guild_id });
    return {
      success: true,
      data: result,
      message: 'تم تحديث البيانات المحددة بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في تحديث البيانات المحددة'
    };
  }
};

  /**
   * حذف رابط
   * @param {string} guild_id - معرف الخادم
   * @returns {Object} نتيجة العملية
   */
  async deleteLink(guild_id) {
  try {
    const result = await PGdelete(Links, { guild_id });
    return {
      success: true,
      data: result,
      message: 'تم حذف الرابط بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في حذف الرابط'
    };
  }
};

/**
   * مسح رابط URL فقط
   * @param {string} guild_id - معرف الخادم
   * @returns {Object} نتيجة العملية
   */
  async clearLinkURL(guild_id) {
  try {
    const result = await PGupdate(Links, { link: null }, { guild_id });
    return {
      success: true,
      data: result,
      message: 'تم مسح رابط الخادم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في مسح رابط الخادم'
    };
  }
};

/**
   * مسح محادثات الرابط فقط
   * @param {string} guild_id - معرف الخادم
   * @returns {Object} نتيجة العملية
   */
  async clearLinkChats(guild_id) {
  try {
    const result = await PGupdate(Links, { chats: null }, { guild_id });
    return {
      success: true,
      data: result,
      message: 'تم مسح دردشات الخادم بنجاح'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في مسح دردشات الخادم'
    };
  }
};

/**
   * التحقق من وجود رابط
   * @param {string} guild_id - معرف الخادم
   * @returns {Object} نتيجة العملية
   */
  async checkLinkExists(guild_id) {
  try {
    const result = await PGselectAll(Links, { guild_id });
    const exists = result && result.length > 0;
    
    return {
      success: true,
      data: { exists, link: exists ? result[0] : null },
      message: exists ? 'يوجد رابط للخادم' : 'لا يوجد رابط للخادم'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'فشل في التحقق من وجود الرابط'
    };
  }
};

  /**
   * إحصائيات الروابط
   * @returns {Object} نتيجة العملية
   */
  async getLinkStats() {
    try {
      // استخدام النموذج الأصلي للحصول على جميع الصفوف بدون فلتر
      const allLinks = await Links.findAll();
      const totalLinks = allLinks.length;
      const linksWithURL = allLinks.filter(link => link.link && link.link.trim() !== '').length;
      const linksWithChats = allLinks.filter(link => link.chats && link.chats.trim() !== '').length;
      const linksWithSelectData = allLinks.filter(link => link.select_d && link.select_d.trim() !== '').length;
      
      return {
        success: true,
        data: {
          totalLinks,
          linksWithURL,
          linksWithChats,
          linksWithSelectData,
          linksWithoutURL: totalLinks - linksWithURL,
          linksWithoutChats: totalLinks - linksWithChats
        },
        message: 'تم جلب إحصائيات الروابط بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'فشل في جلب إحصائيات الروابط'
      };
    }
  }
}

export default LinksService;