import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import WelcomeImage from '../models/WelcomeImage.model.js';

/**
 * خدمة إدارة صور الترحيب - WelcomeImages Service
 * تحتوي على جميع العمليات المتعلقة بإدارة قوالب صور الترحيب في خوادم Discord
 * Contains all operations related to welcome images templates management in Discord servers
 */
class WelcomeImagesService {
  
  /**
   * الحصول على جميع قوالب صور الترحيب
   * Get all welcome images templates
   * 
   * @param {Object} options - خيارات الاستعلام / Query options
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getAll(options = {}) {
    try {
      const welcomeImages = await WelcomeImage.find().limit(options.limit || 0).skip(options.offset || 0).exec();
      
      return [welcomeImages, null];
    } catch (error) {
      console.error('خطأ في جلب قوالب صور الترحيب:', error);
      return [null, 'فشل في جلب قوالب صور الترحيب'];
    }
  }

  /**
   * الحصول على قالب صورة ترحيب بواسطة المعرف
   * Get welcome image template by ID
   * 
   * @param {string} id - معرف قالب صورة الترحيب / Welcome image template ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف قالب صورة الترحيب مطلوب'];
      }
      console.log('id %%%%% ', id);

      const welcomeImages = await mDBselectAll(WelcomeImage, { _id: id });
      
      return [welcomeImages[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب قالب صورة الترحيب:', error);
      return [null, 'فشل في جلب قالب صورة الترحيب'];
    }
  }

  /**
   * الحصول على قوالب صور الترحيب بواسطة معرف الخادم
   * Get welcome images templates by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const welcomeImages = await mDBselectAll(WelcomeImage, { server_id: serverId });
      
      return [welcomeImages[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب قوالب صور الترحيب للخادم:', error);
      return [null, 'فشل في جلب قوالب صور الترحيب للخادم'];
    }
  }

  /**
   * إنشاء قالب صورة ترحيب جديد
   * Create new welcome image template
   * 
   * @param {Object} welcomeImageData - بيانات قالب صورة الترحيب / Welcome image template data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(welcomeImageData) {
    try {
      if (!welcomeImageData || !welcomeImageData.server_id) {
        return [null, 'بيانات قالب صورة الترحيب ومعرف الخادم مطلوبة'];
      }

      // التحقق من عدم وجود قالب بنفس المعرف
      const existingById = await mDBselectAll(WelcomeImage, { server_id: welcomeImageData.server_id });
      if (existingById && existingById.length > 0) {
        return [null, 'قالب صورة الترحيب بهذا المعرف موجود بالفعل'];
      }

      console.log(' welcomeImageData', welcomeImageData);

      mDBinsert(WelcomeImage, welcomeImageData);
      
      return [welcomeImageData, null];
    } catch (error) {
      console.error('خطأ في إنشاء قالب صورة الترحيب:', error);
      return [null, 'فشل في إنشاء قالب صورة الترحيب'];
    }
  }

  /**
   * تحديث قالب صورة الترحيب
   * Update welcome image template
   * 
   * @param {string} id - معرف قالب صورة الترحيب / Welcome image template ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف قالب صورة الترحيب أو معرف الخادم مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود قالب صورة الترحيب
      const filter = id ? { _id: id } : { server_id: serverId };
      
      const existingWelcomeImage = await mDBselectAll(WelcomeImage, filter);
      if (!existingWelcomeImage || existingWelcomeImage.length === 0) {
        return [null, 'قالب صورة الترحيب غير موجود'];
      }

      // إزالة المعرفات من بيانات التحديث إذا كانت موجودة
      const { _id: _, server_id: __, ...dataToUpdate } = updateData;
      mDBupdate(WelcomeImage, filter, dataToUpdate);
      
      return [{ ...existingWelcomeImage[0], ...dataToUpdate }, null];
    } catch (error) {
      console.error('خطأ في تحديث قالب صورة الترحيب:', error);
      return [null, 'فشل في تحديث قالب صورة الترحيب'];
    }
  }

  /**
   * حذف قالب صورة الترحيب
   * Delete welcome image template
   * 
   * @param {string} id - معرف قالب صورة الترحيب / Welcome image template ID
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف قالب صورة الترحيب أو معرف الخادم مطلوب'];
      }

      const filter = id ? { _id: id } : { server_id: serverId };
      mDBdelete(WelcomeImage, filter);
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف قالب صورة الترحيب:', error);
      return [null, 'فشل في حذف قالب صورة الترحيب'];
    }
  }

}

export default WelcomeImagesService;