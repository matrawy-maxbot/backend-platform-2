import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Welcome } from '../models/index.js';
import { Op } from 'sequelize';

class WelcomeService {
  /**
   * إنشاء إعدادات ترحيب جديدة
   * @param {Object} welcomeData - بيانات الترحيب
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createWelcome(welcomeData) {
    try {
      const result = await PGinsert(Welcome, welcomeData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات الترحيب: ${error.message}`);
    }
  }

  /**
   * إنشاء إعدادات ترحيب للخادم
   * @param {string} guildId - معرف الخادم
   * @param {Object} settings - إعدادات الترحيب
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createGuildWelcome(guildId, settings = {}) {
    try {
      const data = {
        guild_id: guildId,
        ...settings
      };
      
      const result = await PGinsert(Welcome, data);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات ترحيب الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع إعدادات الترحيب
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAllWelcome(options = {}) {
    try {
      const defaultOptions = {
        order: [['updatedAt', 'DESC']],
        ...options
      };
      
      const result = await Welcome.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على إعدادات الترحيب: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات الترحيب بواسطة معرف الخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object|null>} - السجل أو null
   */
  static async getWelcomeByGuildId(guildId) {
    try {
      const result = await PGselectAll(Welcome, { guild_id: guildId });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على إعدادات ترحيب الخادم: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات الترحيب التي تحتوي على خلفية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getWelcomeWithBackground() {
    try {
      const result = await Welcome.findAll({
        where: {
          b_url: {
            [Op.ne]: null
          }
        },
        order: [['updatedAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على إعدادات الترحيب مع الخلفية: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات الترحيب التي تحتوي على نصوص
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getWelcomeWithText() {
    try {
      const result = await Welcome.findAll({
        where: {
          text_array: {
            [Op.ne]: null
          }
        },
        order: [['updatedAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على إعدادات الترحيب مع النصوص: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات الترحيب بواسطة نمط الأفاتار
   * @param {string} avatarStyle - نمط الأفاتار
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getWelcomeByAvatarStyle(avatarStyle) {
    try {
      const result = await PGselectAll(Welcome, { a_style: avatarStyle });
      return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      throw new Error(`خطأ في الحصول على إعدادات الترحيب بواسطة نمط الأفاتار: ${error.message}`);
    }
  }

  /**
   * البحث في إعدادات الترحيب
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async searchWelcome(searchTerm) {
    try {
      const result = await Welcome.findAll({
        where: {
          [Op.or]: [
            {
              guild_id: {
                [Op.like]: `%${searchTerm}%`
              }
            },
            {
              b_url: {
                [Op.like]: `%${searchTerm}%`
              }
            },
            {
              text_array: {
                [Op.like]: `%${searchTerm}%`
              }
            }
          ]
        },
        order: [['updatedAt', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في إعدادات الترحيب: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الترحيب
   * @param {string} guildId - معرف الخادم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateWelcome(guildId, updateData) {
    try {
      const result = await PGupdate(Welcome, updateData, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الترحيب: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الصورة
   * @param {string} guildId - معرف الخادم
   * @param {Object} imageSettings - إعدادات الصورة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateImageSettings(guildId, imageSettings) {
    try {
      const updateData = {};
      
      if (imageSettings.top !== undefined) updateData.i_top = imageSettings.top;
      if (imageSettings.left !== undefined) updateData.i_left = imageSettings.left;
      if (imageSettings.width !== undefined) updateData.i_width = imageSettings.width;
      if (imageSettings.height !== undefined) updateData.i_height = imageSettings.height;
      
      const result = await PGupdate(Welcome, updateData, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الصورة: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الخلفية
   * @param {string} guildId - معرف الخادم
   * @param {Object} backgroundSettings - إعدادات الخلفية
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateBackgroundSettings(guildId, backgroundSettings) {
    try {
      const updateData = {};
      
      if (backgroundSettings.url !== undefined) updateData.b_url = backgroundSettings.url;
      if (backgroundSettings.x !== undefined) updateData.b_x = backgroundSettings.x;
      if (backgroundSettings.y !== undefined) updateData.b_y = backgroundSettings.y;
      if (backgroundSettings.width !== undefined) updateData.b_width = backgroundSettings.width;
      if (backgroundSettings.height !== undefined) updateData.b_height = backgroundSettings.height;
      
      const result = await PGupdate(Welcome, updateData, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الخلفية: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الأفاتار
   * @param {string} guildId - معرف الخادم
   * @param {Object} avatarSettings - إعدادات الأفاتار
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateAvatarSettings(guildId, avatarSettings) {
    try {
      const updateData = {};
      
      if (avatarSettings.x !== undefined) updateData.a_x = avatarSettings.x;
      if (avatarSettings.y !== undefined) updateData.a_y = avatarSettings.y;
      if (avatarSettings.width !== undefined) updateData.a_width = avatarSettings.width;
      if (avatarSettings.height !== undefined) updateData.a_height = avatarSettings.height;
      if (avatarSettings.style !== undefined) updateData.a_style = avatarSettings.style;
      if (avatarSettings.radius !== undefined) updateData.a_radius = avatarSettings.radius;
      if (avatarSettings.rotate !== undefined) updateData.a_rotate = avatarSettings.rotate;
      if (avatarSettings.borderWidth !== undefined) updateData.a_border_width = avatarSettings.borderWidth;
      if (avatarSettings.borderColor !== undefined) updateData.a_border_color = avatarSettings.borderColor;
      if (avatarSettings.borderStyle !== undefined) updateData.a_border_style = avatarSettings.borderStyle;
      
      const result = await PGupdate(Welcome, updateData, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الأفاتار: ${error.message}`);
    }
  }

  /**
   * تحديث النصوص
   * @param {string} guildId - معرف الخادم
   * @param {string} textArray - مصفوفة النصوص
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateTextArray(guildId, textArray) {
    try {
      const result = await PGupdate(Welcome, 
        { text_array: textArray },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث النصوص: ${error.message}`);
    }
  }

  /**
   * مسح رابط الخلفية
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async clearBackgroundUrl(guildId) {
    try {
      const result = await PGupdate(Welcome, 
        { b_url: null },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في مسح رابط الخلفية: ${error.message}`);
    }
  }

  /**
   * مسح النصوص
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async clearTextArray(guildId) {
    try {
      const result = await PGupdate(Welcome, 
        { text_array: null },
        { where: { guild_id: guildId } }
      );
      return result;
    } catch (error) {
      throw new Error(`خطأ في مسح النصوص: ${error.message}`);
    }
  }

  /**
   * إعادة تعيين إعدادات الأفاتار
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async resetAvatarSettings(guildId) {
    try {
      const result = await PGupdate(Welcome, {
        a_x: 0.0,
        a_y: 0.0,
        a_width: 0.0,
        a_height: 0.0,
        a_style: null,
        a_radius: 0,
        a_rotate: 0.0,
        a_border_width: 0,
        a_border_color: null,
        a_border_style: null
      }, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في إعادة تعيين إعدادات الأفاتار: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات الترحيب
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteWelcome(guildId) {
    try {
      const result = await PGdelete(Welcome, {
        where: { guild_id: guildId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات الترحيب: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات الترحيب بدون خلفية
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteWelcomeWithoutBackground() {
    try {
      const result = await PGdelete(Welcome, {
        where: {
          b_url: {
            [Op.is]: null
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات الترحيب بدون خلفية: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات الترحيب بدون نصوص
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteWelcomeWithoutText() {
    try {
      const result = await PGdelete(Welcome, {
        where: {
          text_array: {
            [Op.is]: null
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات الترحيب بدون نصوص: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود إعدادات ترحيب للخادم
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - true إذا كانت الإعدادات موجودة
   */
  static async checkWelcomeExists(guildId) {
    try {
      const welcome = await this.getWelcomeByGuildId(guildId);
      return welcome !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود إعدادات الترحيب: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود خلفية
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - true إذا كانت الخلفية موجودة
   */
  static async hasBackground(guildId) {
    try {
      const welcome = await this.getWelcomeByGuildId(guildId);
      return welcome && welcome.b_url !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود الخلفية: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود نصوص
   * @param {string} guildId - معرف الخادم
   * @returns {Promise<boolean>} - true إذا كانت النصوص موجودة
   */
  static async hasTextArray(guildId) {
    try {
      const welcome = await this.getWelcomeByGuildId(guildId);
      return welcome && welcome.text_array !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود النصوص: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات إعدادات الترحيب
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getWelcomeStats() {
    try {
      const allWelcome = await Welcome.findAll();
      const totalWelcome = allWelcome.length;
      
      // حساب عدد الإعدادات مع الخلفية
      const withBackground = allWelcome.filter(w => w.b_url !== null).length;
      
      // حساب عدد الإعدادات مع النصوص
      const withText = allWelcome.filter(w => w.text_array !== null).length;
      
      // حساب توزيع أنماط الأفاتار
      const avatarStyleDistribution = {};
      allWelcome.forEach(welcome => {
        if (welcome.a_style) {
          avatarStyleDistribution[welcome.a_style] = (avatarStyleDistribution[welcome.a_style] || 0) + 1;
        }
      });
      
      // حساب عدد الإعدادات مع حدود الأفاتار
      const withAvatarBorder = allWelcome.filter(w => w.a_border_width !== null && w.a_border_width > 0).length;
      
      // حساب عدد الإعدادات مع دوران الأفاتار
      const withAvatarRotation = allWelcome.filter(w => w.a_rotate !== null && w.a_rotate !== 0).length;
      
      // حساب الإعدادات الحديثة (آخر 7 أيام)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentWelcome = allWelcome.filter(w => new Date(w.updatedAt) > weekAgo).length;

      return {
        totalWelcome,
        withBackground,
        withText,
        withAvatarBorder,
        withAvatarRotation,
        recentWelcome,
        avatarStyleDistribution
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات إعدادات الترحيب: ${error.message}`);
    }
  }

  /**
   * إنشاء أو تحديث إعدادات الترحيب
   * @param {string} guildId - معرف الخادم
   * @param {Object} welcomeData - بيانات الترحيب
   * @returns {Promise<Object>} - السجل المنشأ أو المحدث
   */
  static async upsertWelcome(guildId, welcomeData) {
    try {
      const existingWelcome = await this.getWelcomeByGuildId(guildId);
      
      if (existingWelcome) {
        // تحديث الإعدادات الموجودة
        return await this.updateWelcome(guildId, welcomeData);
      } else {
        // إنشاء إعدادات جديدة
        const data = {
          guild_id: guildId,
          ...welcomeData
        };
        return await this.createWelcome(data);
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث إعدادات الترحيب: ${error.message}`);
    }
  }

  /**
   * نسخ إعدادات الترحيب من خادم إلى آخر
   * @param {string} sourceGuildId - معرف الخادم المصدر
   * @param {string} targetGuildId - معرف الخادم الهدف
   * @returns {Promise<Object>} - السجل المنسوخ
   */
  static async copyWelcomeSettings(sourceGuildId, targetGuildId) {
    try {
      const sourceWelcome = await this.getWelcomeByGuildId(sourceGuildId);
      
      if (!sourceWelcome) {
        throw new Error('إعدادات الترحيب المصدر غير موجودة');
      }
      
      // نسخ الإعدادات مع تغيير معرف الخادم
      const { guild_id, createdAt, updatedAt, ...settingsToCopy } = sourceWelcome.dataValues || sourceWelcome;
      
      const targetData = {
        guild_id: targetGuildId,
        ...settingsToCopy
      };
      
      return await this.upsertWelcome(targetGuildId, targetData);
    } catch (error) {
      throw new Error(`خطأ في نسخ إعدادات الترحيب: ${error.message}`);
    }
  }
}

export default WelcomeService;