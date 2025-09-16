import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Likes } from '../models/index.js';
import { Op } from 'sequelize';

class LikesService {
  /**
   * إنشاء سجل إعجابات جديد
   * @param {Object} likesData - بيانات الإعجابات
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createLikes(likesData) {
    try {
      // تحويل بيانات الإعجابات إلى JSON إذا كانت object
      if (typeof likesData.likes === 'object') {
        likesData.likes = JSON.stringify(likesData.likes);
      }
      
      const result = await PGinsert(Likes, likesData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل الإعجابات: ${error.message}`);
    }
  }

  /**
   * إنشاء سجل إعجابات جديد للمستخدم
   * @param {string} userId - معرف المستخدم
   * @param {Object|string} likesData - بيانات الإعجابات
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createUserLikes(userId, likesData = {}) {
    try {
      const data = {
        id: userId,
        likes: typeof likesData === 'object' ? JSON.stringify(likesData) : likesData
      };
      
      const result = await PGinsert(Likes, data);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل إعجابات المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع سجلات الإعجابات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAllLikes(options = {}) {
    try {
      const result = await Likes.findAll(options);
      
      // تحويل بيانات الإعجابات من JSON إلى object
      return result.map(like => ({
        ...like,
        likes: this.parseLikesData(like.likes)
      }));
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات الإعجابات: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل الإعجابات بواسطة المعرف
   * @param {string} id - معرف المستخدم أو العنصر
   * @returns {Promise<Object|null>} - السجل أو null
   */
  static async getLikesById(id) {
    try {
      const result = await PGselectAll(Likes, { id });
      
      if (result.length > 0) {
        const like = result[0];
        return {
          ...like,
          likes: this.parseLikesData(like.likes)
        };
      }
      
      return null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجل الإعجابات: ${error.message}`);
    }
  }

  /**
   * البحث في سجلات الإعجابات بواسطة محتوى الإعجابات
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Promise<Array>} - قائمة السجلات المطابقة
   */
  static async searchLikesByContent(searchTerm) {
    try {
      const result = await PGselectAll(Likes, { likes: `%${searchTerm}%`, Op: Op.like });
      
      return result.map(like => ({
        ...like,
        likes: this.parseLikesData(like.likes)
      }));
    } catch (error) {
      throw new Error(`خطأ في البحث في سجلات الإعجابات: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات الإعجابات بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getLikesByDateRange(startDate, endDate) {
    try {
      // استخدام النموذج الأصلي للعمليات المعقدة
      const result = await Likes.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['createdAt', 'DESC']]
      });
      
      return result.map(like => ({
        ...like.toJSON(),
        likes: this.parseLikesData(like.likes)
      }));
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات الإعجابات بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على أحدث سجلات الإعجابات
   * @param {number} limit - عدد السجلات المطلوب إرجاعها
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getRecentLikes(limit = 10) {
    try {
      // استخدام النموذج الأصلي للعمليات المعقدة مع order و limit
      const result = await Likes.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit
      });
      
      return result.map(like => ({
        ...like.toJSON(),
        likes: this.parseLikesData(like.likes)
      }));
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحدث سجلات الإعجابات: ${error.message}`);
    }
  }

  /**
   * تحديث سجل الإعجابات
   * @param {string} id - معرف المستخدم أو العنصر
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateLikes(id, updateData) {
    try {
      // تحويل بيانات الإعجابات إلى JSON إذا كانت object
      if (updateData.likes && typeof updateData.likes === 'object') {
        updateData.likes = JSON.stringify(updateData.likes);
      }
      
      const result = await PGupdate(Likes, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث سجل الإعجابات: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات الإعجابات فقط
   * @param {string} id - معرف المستخدم أو العنصر
   * @param {Object|string} likesData - بيانات الإعجابات الجديدة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateLikesData(id, likesData) {
    try {
      const updateData = {
        likes: typeof likesData === 'object' ? JSON.stringify(likesData) : likesData
      };
      
      const result = await PGupdate(Likes, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث بيانات الإعجابات: ${error.message}`);
    }
  }

  /**
   * إضافة إعجاب جديد لسجل موجود
   * @param {string} id - معرف المستخدم أو العنصر
   * @param {string} likeKey - مفتاح الإعجاب
   * @param {any} likeValue - قيمة الإعجاب
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async addLikeToRecord(id, likeKey, likeValue) {
    try {
      const existingRecord = await this.getLikesById(id);
      
      if (!existingRecord) {
        throw new Error('سجل الإعجابات غير موجود');
      }
      
      const currentLikes = existingRecord.likes || {};
      currentLikes[likeKey] = likeValue;
      
      const result = await this.updateLikesData(id, currentLikes);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إضافة إعجاب للسجل: ${error.message}`);
    }
  }

  /**
   * إزالة إعجاب من سجل موجود
   * @param {string} id - معرف المستخدم أو العنصر
   * @param {string} likeKey - مفتاح الإعجاب المراد إزالته
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async removeLikeFromRecord(id, likeKey) {
    try {
      const existingRecord = await this.getLikesById(id);
      
      if (!existingRecord) {
        throw new Error('سجل الإعجابات غير موجود');
      }
      
      const currentLikes = existingRecord.likes || {};
      delete currentLikes[likeKey];
      
      const result = await this.updateLikesData(id, currentLikes);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إزالة إعجاب من السجل: ${error.message}`);
    }
  }

  /**
   * دمج بيانات إعجابات جديدة مع الموجودة
   * @param {string} id - معرف المستخدم أو العنصر
   * @param {Object} newLikesData - بيانات الإعجابات الجديدة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async mergeLikesData(id, newLikesData) {
    try {
      const existingRecord = await this.getLikesById(id);
      
      if (!existingRecord) {
        throw new Error('سجل الإعجابات غير موجود');
      }
      
      const currentLikes = existingRecord.likes || {};
      const mergedLikes = { ...currentLikes, ...newLikesData };
      
      const result = await this.updateLikesData(id, mergedLikes);
      return result;
    } catch (error) {
      throw new Error(`خطأ في دمج بيانات الإعجابات: ${error.message}`);
    }
  }

  /**
   * حذف سجل الإعجابات
   * @param {string} id - معرف المستخدم أو العنصر
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteLikes(id) {
    try {
      const result = await PGdelete(Likes, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجل الإعجابات: ${error.message}`);
    }
  }

  /**
   * حذف سجلات الإعجابات القديمة
   * @param {number} daysOld - عدد الأيام (السجلات الأقدم من هذا العدد ستحذف)
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteOldLikes(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await PGdelete(Likes, {
        where: {
          createdAt: {
            [Op.lt]: cutoffDate
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات الإعجابات القديمة: ${error.message}`);
    }
  }

  /**
   * حذف سجلات الإعجابات الفارغة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteEmptyLikes() {
    try {
      const result = await PGdelete(Likes, {
        where: {
          [Op.or]: [
            { likes: '' },
            { likes: '{}' },
            { likes: null }
          ]
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات الإعجابات الفارغة: ${error.message}`);
    }
  }

  /**
   * حذف سجلات الإعجابات بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteLikesByDateRange(startDate, endDate) {
    try {
      const result = await PGdelete(Likes, {
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات الإعجابات بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الإعجابات
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getLikesStats() {
    try {
      const allLikes = await Likes.findAll();
      const totalRecords = allLikes.length;
      
      // حساب السجلات الفارغة
      const emptyRecords = allLikes.filter(like => 
        !like.likes || like.likes === '' || like.likes === '{}'
      ).length;
      
      // حساب متوسط حجم بيانات الإعجابات
      const totalSize = allLikes.reduce((sum, like) => sum + (like.likes ? like.likes.length : 0), 0);
      const avgSize = totalRecords > 0 ? Math.round((totalSize / totalRecords) * 100) / 100 : 0;
      
      // حساب السجلات الحديثة (آخر 7 أيام)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentRecords = allLikes.filter(like => new Date(like.createdAt) > weekAgo).length;

      return {
        totalRecords,
        emptyRecords,
        validRecords: totalRecords - emptyRecords,
        avgDataSize: avgSize,
        recentRecords
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات الإعجابات: ${error.message}`);
    }
  }

  /**
   * تحليل بيانات الإعجابات من JSON
   * @param {string} likesData - بيانات الإعجابات كنص
   * @returns {Object} - بيانات الإعجابات كـ object
   * @private
   */
  static parseLikesData(likesData) {
    try {
      if (!likesData || likesData === '') {
        return {};
      }
      
      if (typeof likesData === 'object') {
        return likesData;
      }
      
      return JSON.parse(likesData);
    } catch (error) {
      // في حالة فشل تحليل JSON، إرجاع النص كما هو
      return { raw: likesData };
    }
  }

  /**
   * التحقق من وجود إعجاب معين في السجل
   * @param {string} id - معرف المستخدم أو العنصر
   * @param {string} likeKey - مفتاح الإعجاب
   * @returns {Promise<boolean>} - true إذا كان الإعجاب موجود
   */
  static async hasLike(id, likeKey) {
    try {
      const record = await this.getLikesById(id);
      
      if (!record || !record.likes) {
        return false;
      }
      
      return likeKey in record.likes;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود الإعجاب: ${error.message}`);
    }
  }

  /**
   * الحصول على قيمة إعجاب معين
   * @param {string} id - معرف المستخدم أو العنصر
   * @param {string} likeKey - مفتاح الإعجاب
   * @returns {Promise<any>} - قيمة الإعجاب أو null
   */
  static async getLikeValue(id, likeKey) {
    try {
      const record = await this.getLikesById(id);
      
      if (!record || !record.likes) {
        return null;
      }
      
      return record.likes[likeKey] || null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على قيمة الإعجاب: ${error.message}`);
    }
  }
}

export default LikesService;