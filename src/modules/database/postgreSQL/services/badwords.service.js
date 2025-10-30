import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { BadWord } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة الكلمات السيئة - BadWords Service
 * تحتوي على جميع العمليات المتعلقة بإدارة الكلمات المحظورة
 * Contains all operations related to bad words management
 */
class BadWordsService {
  
  /**
   * الحصول على جميع إعدادات الكلمات السيئة
   * Get all bad words settings
   * 
   * @param {Object} options - خيارات الاستعلام / Query options
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getAll(options = {}) {
    try {
      const { limit, offset, order = [['created_at', 'DESC']] } = options;
      
      const queryOptions = {
        order,
        ...(limit && { limit }),
        ...(offset && { offset })
      };

      const badWords = await BadWord.findAll(queryOptions);
      
      return [badWords, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات الكلمات السيئة:', error);
      return [null, 'فشل في جلب إعدادات الكلمات السيئة'];
    }
  }

  /**
   * الحصول على إعدادات الكلمات السيئة بواسطة المعرف
   * Get bad words settings by ID
   * 
   * @param {number} id - معرف إعدادات الكلمات السيئة / Bad words settings ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف إعدادات الكلمات السيئة مطلوب'];
      }

      const badWords = await PGselectAll(BadWord, { id });
      
      return [badWords[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات الكلمات السيئة:', error);
      return [null, 'فشل في جلب إعدادات الكلمات السيئة'];
    }
  }

  /**
   * الحصول على إعدادات الكلمات السيئة بواسطة معرف الخادم
   * Get bad words settings by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const badWords = await PGselectAll(BadWord, { server_id: serverId });

      return [badWords[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات الكلمات السيئة للخادم:', error);
      return [null, 'فشل في جلب إعدادات الكلمات السيئة للخادم'];
    }
  }

  /**
   * إنشاء إعدادات كلمات سيئة جديدة
   * Create new bad words settings
   * 
   * @param {Object} badWordsData - بيانات إعدادات الكلمات السيئة / Bad words settings data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(badWordsData) {
    try {
      if (!badWordsData || !badWordsData.server_id) {
        return [null, 'بيانات إعدادات الكلمات السيئة ومعرف الخادم مطلوبان'];
      }

      // التحقق من عدم وجود إعدادات كلمات سيئة لنفس الخادم
      const existingBadWords = await PGselectAll(BadWord, { server_id: badWordsData.server_id });
      if (existingBadWords && existingBadWords.length > 0) {
        return [null, 'إعدادات الكلمات السيئة موجودة بالفعل لهذا الخادم'];
      }

      const LIMIT = 100;
      if (badWordsData.words.length > LIMIT) {
        return [null, `لقد وصلت إلى الحد الأقصى من عدد الكلمات ${LIMIT}`];
      }

      const newBadWords = await PGinsert(BadWord, badWordsData);
      
      return [newBadWords, null];
    } catch (error) {
      console.error('خطأ في إنشاء إعدادات الكلمات السيئة:', error);
      return [null, 'فشل في إنشاء إعدادات الكلمات السيئة'];
    }
  }

  /**
   * تحديث إعدادات الكلمات السيئة
   * Update bad words settings
   * 
   * @param {number} id - معرف إعدادات الكلمات السيئة / Bad words settings ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف إعدادات الكلمات السيئة أو معرف الخادم مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود إعدادات الكلمات السيئة
      const existingBadWords = await PGselectAll(BadWord, id ? { id } : { server_id: serverId });
      if (!existingBadWords || existingBadWords.length === 0) {
        return [null, 'إعدادات الكلمات السيئة غير موجودة'];
      }

      const LIMIT = 100;
      if (updateData.words && updateData.words.length > LIMIT) {
        return [null, `لقد وصلت إلى الحد الأقصى من عدد الكلمات ${LIMIT}`];
      }

      // إزالة المعرف من بيانات التحديث إذا كان موجوداً
      const { id: _, server_id: __, ...dataToUpdate } = updateData;

      const updatedBadWords = await PGupdate(BadWord, dataToUpdate, id ? { id } : { server_id: serverId });
      
      return [updatedBadWords, null];
    } catch (error) {
      console.error('خطأ في تحديث إعدادات الكلمات السيئة:', error);
      return [null, 'فشل في تحديث إعدادات الكلمات السيئة'];
    }
  }

  /**
   * حذف إعدادات الكلمات السيئة
   * Delete bad words settings
   * 
   * @param {number} id - معرف إعدادات الكلمات السيئة / Bad words settings ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف إعدادات الكلمات السيئة أو معرف الخادم مطلوب'];
      }

      await PGdelete(BadWord, id ? { id } : { server_id: serverId });
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف إعدادات الكلمات السيئة:', error);
      return [null, 'فشل في حذف إعدادات الكلمات السيئة'];
    }
  }
}

export default BadWordsService;