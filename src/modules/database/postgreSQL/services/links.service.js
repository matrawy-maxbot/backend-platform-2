import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Link } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة الروابط - Links Service
 * تحتوي على جميع العمليات المتعلقة بإدارة قواعد الروابط والكلمات المفتاحية
 * Contains all operations related to links and keywords rules management
 */
class LinksService {
  
  /**
   * الحصول على جميع قواعد الروابط
   * Get all links rules
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

      const links = await Link.findAll(queryOptions);
      
      return [links, null];
    } catch (error) {
      console.error('خطأ في جلب قواعد الروابط:', error);
      return [null, 'فشل في جلب قواعد الروابط'];
    }
  }

  /**
   * الحصول على قاعدة رابط بواسطة المعرف
   * Get link rule by ID
   * 
   * @param {number} id - معرف قاعدة الرابط / Link rule ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف قاعدة الرابط مطلوب'];
      }

      const links = await PGselectAll(Link, { id });
      
      return [links[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب قاعدة الرابط:', error);
      return [null, 'فشل في جلب قاعدة الرابط'];
    }
  }

  /**
   * الحصول على قواعد الروابط بواسطة معرف الخادم
   * Get links rules by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const links = await PGselectAll(Link, { server_id: serverId });

      return [links, null];
    } catch (error) {
      console.error('خطأ في جلب قواعد الروابط للخادم:', error);
      return [null, 'فشل في جلب قواعد الروابط للخادم'];
    }
  }

  /**
   * إنشاء قاعدة رابط جديدة
   * Create new link rule
   * 
   * @param {Object} linkData - بيانات قاعدة الرابط / Link rule data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(linkData) {
    try {
      if (!linkData || !linkData.server_id) {
        return [null, 'بيانات قاعدة الرابط ومعرف الخادم والرابط أو الكلمة المفتاحية مطلوبة'];
      }

      const LIMIT = 20;
      const existingLinks = await PGselectAll(Link, { server_id: linkData.server_id });
      if (existingLinks.length >= LIMIT) {
        return [null, `لقد وصلت إلى الحد الأقصى من عدد الروابط ${LIMIT}`];
      }

      const newLink = await PGinsert(Link, linkData);
      
      return [newLink, null];
    } catch (error) {
      console.error('خطأ في إنشاء قاعدة الرابط:', error);
      return [null, 'فشل في إنشاء قاعدة الرابط'];
    }
  }

  /**
   * تحديث قاعدة الرابط
   * Update link rule
   * 
   * @param {number} id - معرف قاعدة الرابط / Link rule ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData) {
    try {
      if (!id) {
        return [null, 'معرف قاعدة الرابط مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود قاعدة الرابط
      const existingLink = await PGselectAll(Link, { id });
      if (!existingLink || existingLink.length === 0) {
        return [null, 'قاعدة الرابط غير موجودة'];
      }

      // إزالة المعرف من بيانات التحديث إذا كان موجوداً
      const { id: _, server_id: __, ...dataToUpdate } = updateData;

      const updatedLink = await PGupdate(Link, dataToUpdate, { id });
      
      return [updatedLink, null];
    } catch (error) {
      console.error('خطأ في تحديث قاعدة الرابط:', error);
      return [null, 'فشل في تحديث قاعدة الرابط'];
    }
  }

  /**
   * حذف قاعدة الرابط
   * Delete link rule
   * 
   * @param {number} id - معرف قاعدة الرابط / Link rule ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id) {
    try {
      if (!id) {
        return [null, 'معرف قاعدة الرابط مطلوب'];
      }

      await PGdelete(Link, { id });
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف قاعدة الرابط:', error);
      return [null, 'فشل في حذف قاعدة الرابط'];
    }
  }
}

export default LinksService;