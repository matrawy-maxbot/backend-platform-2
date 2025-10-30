import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Protection } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة الحماية - Protection Service
 * تحتوي على جميع العمليات المتعلقة بإدارة إعدادات الحماية
 * Contains all operations related to protection settings management
 */
class ProtectionService {
  
  /**
   * الحصول على جميع إعدادات الحماية
   * Get all protection settings
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

      const protections = await Protection.findAll(queryOptions);
      
      return [protections, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات الحماية:', error);
      return [null, 'فشل في جلب إعدادات الحماية'];
    }
  }

  /**
   * الحصول على إعدادات حماية بواسطة المعرف
   * Get protection settings by ID
   * 
   * @param {string} id - معرف إعدادات الحماية / Protection settings ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف إعدادات الحماية مطلوب'];
      }

      const protections = await PGselectAll(Protection, { id });

      return [protections[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات الحماية:', error);
      return [null, 'فشل في جلب إعدادات الحماية'];
    }
  }

  /**
   * الحصول على إعدادات حماية بواسطة معرف الخادم
   * Get protection settings by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const protections = await PGselectAll(Protection, { server_id: serverId });

      return [protections[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات الحماية:', error);
      return [null, 'فشل في جلب إعدادات الحماية'];
    }
  }

  /**
   * إنشاء إعدادات حماية جديدة
   * Create new protection settings
   * 
   * @param {Object} protectionData - بيانات إعدادات الحماية / Protection settings data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(protectionData) {
    try {
      if (!protectionData || !protectionData.server_id) {
        return [null, 'بيانات إعدادات الحماية والمعرف الخادم مطلوبان'];
      }

      // التحقق من عدم وجود إعدادات حماية بنفس المعرف
      const existingProtections = await PGselectAll(Protection, { server_id: protectionData.server_id });
      if (existingProtections && existingProtections.length > 0) {
        return [null, 'إعدادات الحماية موجودة بالفعل لهذا الخادم'];
      }

      const newProtection = await PGinsert(Protection, protectionData);
      
      return [newProtection, null];
    } catch (error) {
      console.error('خطأ في إنشاء إعدادات الحماية:', error);
      return [null, 'فشل في إنشاء إعدادات الحماية'];
    }
  }

  /**
   * تحديث إعدادات الحماية
   * Update protection settings
   * 
   * @param {string} id - معرف إعدادات الحماية / Protection settings ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف إعدادات الحماية أو معرف الخادم مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود إعدادات الحماية
      const existingProtections = await PGselectAll(Protection, id ? { id } : { server_id: serverId });
      if (!existingProtections || existingProtections.length === 0) {
        return [null, 'إعدادات الحماية غير موجودة'];
      }

      // إزالة المعرف من بيانات التحديث إذا كان موجوداً
      const { id: _, server_id: __, ...dataToUpdate } = updateData;

      const updatedProtection = await PGupdate(Protection, dataToUpdate, id ? { id } : { server_id: serverId });
      
      return [updatedProtection, null];
    } catch (error) {
      console.error('خطأ في تحديث إعدادات الحماية:', error);
      return [null, 'فشل في تحديث إعدادات الحماية'];
    }
  }

  /**
   * حذف إعدادات الحماية
   * Delete protection settings
   * 
   * @param {string} id - معرف إعدادات الحماية / Protection settings ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف إعدادات الحماية أو معرف الخادم مطلوب'];
      }

      await PGdelete(Protection, id ? { id } : { server_id: serverId });
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف إعدادات الحماية:', error);
      return [null, 'فشل في حذف إعدادات الحماية'];
    }
  }
}

export default ProtectionService;