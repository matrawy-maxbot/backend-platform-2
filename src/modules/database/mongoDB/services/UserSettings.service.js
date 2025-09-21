import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { UserSettings } from '../models/index.js';

/**
 * خدمة إدارة إعدادات المستخدم - UserSettings Service
 * تحتوي على الوظائف الأساسية لإدارة إعدادات المستخدمين
 */
class UserSettingsService {

  /**
   * إنشاء إعدادات جديدة للمستخدم
   * @param {Object} settingsData - بيانات الإعدادات
   * @returns {Promise<Object>} الإعدادات المُنشأة
   */
  static async createUserSettings(settingsData) {
    try {
      if (!settingsData.user_id) {
        throw new Error('معرف المستخدم مطلوب');
      }

      // التحقق من عدم وجود إعدادات مسبقة للمستخدم
      const existingSettings = await this.getUserSettings(settingsData.user_id);
      if (existingSettings) {
        throw new Error('إعدادات المستخدم موجودة بالفعل');
      }

      const newSettings = await mDBinsert(UserSettings, settingsData);
      return newSettings;
    } catch (error) {
      throw new Error(`خطأ في إنشاء إعدادات المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات المستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Object|null>} إعدادات المستخدم أو null
   */
  static async getUserSettings(userId) {
    try {
      const settings = await mDBselectAll({
        model: UserSettings,
        filter: { user_id: userId }
      });
      return settings && settings.length > 0 ? settings[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات المستخدم أو إنشاء إعدادات افتراضية
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Object>} إعدادات المستخدم
   */
  static async getUserSettingsOrCreate(userId) {
    try {
      let settings = await this.getUserSettings(userId);
      
      if (!settings) {
        // إنشاء إعدادات افتراضية
        const defaultSettings = {
          user_id: userId,
          dark_mode: false,
          language: 'ar',
          email_notifications: true,
          sms_notifications: false,
          offer_notifications: true
        };
        settings = await this.createUserSettings(defaultSettings);
      }
      
      return settings;
    } catch (error) {
      throw new Error(`خطأ في جلب أو إنشاء إعدادات المستخدم: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات المستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateUserSettings(userId, updateData) {
    try {
      // التحقق من وجود الإعدادات
      const existingSettings = await this.getUserSettings(userId);
      if (!existingSettings) {
        throw new Error('إعدادات المستخدم غير موجودة');
      }

      const updatedSettings = await mDBupdate(UserSettings, { user_id: userId }, updateData);
      return updatedSettings;
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات المستخدم: ${error.message}`);
    }
  }

  /**
   * تحديث الوضع المظلم
   * @param {number} userId - معرف المستخدم
   * @param {boolean} darkMode - حالة الوضع المظلم
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateDarkMode(userId, darkMode) {
    try {
      return await this.updateUserSettings(userId, { dark_mode: darkMode });
    } catch (error) {
      throw new Error(`خطأ في تحديث الوضع المظلم: ${error.message}`);
    }
  }

  /**
   * تحديث اللغة
   * @param {number} userId - معرف المستخدم
   * @param {string} language - اللغة الجديدة
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateLanguage(userId, language) {
    try {
      return await this.updateUserSettings(userId, { language: language });
    } catch (error) {
      throw new Error(`خطأ في تحديث اللغة: ${error.message}`);
    }
  }

  /**
   * تحديث إعدادات الإشعارات
   * @param {number} userId - معرف المستخدم
   * @param {Object} notificationSettings - إعدادات الإشعارات
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async updateNotificationSettings(userId, notificationSettings) {
    try {
      const allowedFields = ['email_notifications', 'sms_notifications', 'offer_notifications'];
      const updateData = {};
      
      // فلترة الحقول المسموحة فقط
      for (const field of allowedFields) {
        if (notificationSettings.hasOwnProperty(field)) {
          updateData[field] = notificationSettings[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error('لا توجد إعدادات إشعارات صالحة للتحديث');
      }

      return await this.updateUserSettings(userId, updateData);
    } catch (error) {
      throw new Error(`خطأ في تحديث إعدادات الإشعارات: ${error.message}`);
    }
  }

  /**
   * حذف إعدادات المستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteUserSettings(userId) {
    try {
      const result = await mDBdelete(UserSettings, { user_id: userId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف إعدادات المستخدم: ${error.message}`);
    }
  }

  /**
   * إعادة تعيين الإعدادات للقيم الافتراضية
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Object>} الإعدادات المُحدثة
   */
  static async resetToDefaults(userId) {
    try {
      const defaultSettings = {
        dark_mode: false,
        language: 'ar',
        email_notifications: true,
        sms_notifications: false,
        offer_notifications: true
      };

      return await this.updateUserSettings(userId, defaultSettings);
    } catch (error) {
      throw new Error(`خطأ في إعادة تعيين الإعدادات: ${error.message}`);
    }
  }

  /**
   * الحصول على إعدادات متعددة للمستخدمين
   * @param {Array<number>} userIds - قائمة معرفات المستخدمين
   * @returns {Promise<Array>} قائمة إعدادات المستخدمين
   */
  static async getMultipleUserSettings(userIds) {
    try {
      const settings = await mDBselectAll({
        model: UserSettings,
        filter: { user_id: { $in: userIds } }
      });
      return settings || [];
    } catch (error) {
      throw new Error(`خطأ في جلب إعدادات المستخدمين: ${error.message}`);
    }
  }
}

export default UserSettingsService;