import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Admin } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة المشرفين - Admins Service
 * تحتوي على جميع العمليات المتعلقة بإدارة المشرفين في خوادم Discord
 * Contains all operations related to admins management in Discord servers
 */
class AdminsService {
  
  /**
   * الحصول على جميع المشرفين
   * Get all admins
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

      const admins = await Admin.findAll(queryOptions);
      
      return [admins, null];
    } catch (error) {
      console.error('خطأ في جلب المشرفين:', error);
      return [null, 'فشل في جلب المشرفين'];
    }
  }

  /**
   * الحصول على مشرف بواسطة المعرف
   * Get admin by ID
   * 
   * @param {number} id - معرف المشرف / Admin ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف المشرف مطلوب'];
      }

      const admins = await PGselectAll(Admin, { id });

      return [admins[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب المشرف:', error);
      return [null, 'فشل في جلب المشرف'];
    }
  }

  /**
   * الحصول على المشرفين بواسطة معرف الخادم
   * Get admins by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const admins = await PGselectAll(Admin, { server_id: serverId });

      return [admins, null];
    } catch (error) {
      console.error('خطأ في جلب المشرفين للخادم:', error);
      return [null, 'فشل في جلب المشرفين للخادم'];
    }
  }

  /**
   * إنشاء مشرف جديد
   * Create new admin
   * 
   * @param {Object} adminData - بيانات المشرف / Admin data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(adminData) {
    try {
      if (!adminData || !adminData.server_id) {
        return [null, 'بيانات المشرف ومعرف الخادم ومعرف المشرف مطلوبة'];
      }

      const existingAdmin = await Admin.findOne({ 
        server_id: adminData.server_id,
        admin_id: adminData.admin_id 
      });
      
      if (existingAdmin) {
        return [null, 'المشرف موجود بالفعل لهذا الخادم'];
      }

      const LIMIT = 5;
      const existingAdmins = await PGselectAll(Admin, { server_id: adminData.server_id });
      if (existingAdmins.length >= LIMIT) {
        return [null, `لقد وصلت إلى الحد الأقصى من عدد المشرفين ${LIMIT}`];
      }

      const newAdmin = await PGinsert(Admin, adminData);
      
      return [newAdmin, null];
    } catch (error) {
      console.error('خطأ في إنشاء المشرف:', error);
      return [null, 'فشل في إنشاء المشرف'];
    }
  }

  /**
   * تحديث المشرف
   * Update admin
   * 
   * @param {number} id - معرف المشرف / Admin ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData) {
    try {
      if (!id) {
        return [null, 'معرف المشرف مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود المشرف
      const existingAdmin = await PGselectAll(Admin, { id });
      if (!existingAdmin || existingAdmin.length === 0) {
        return [null, 'المشرف غير موجود'];
      }

      // إزالة المعرف من بيانات التحديث إذا كان موجوداً
      const { id: _, server_id: __, admin_id: ___, ...dataToUpdate } = updateData;
      if(Object.keys(dataToUpdate).length === 0) {
        return [null, 'لا يوجد بيانات كافية للتحديث لان المعرفات لا يمكن تحديثها'];
      }

      const updatedAdmin = await PGupdate(Admin, dataToUpdate, { id });
      
      return [updatedAdmin, null];
    } catch (error) {
      console.error('خطأ في تحديث المشرف:', error);
      return [null, 'فشل في تحديث المشرف'];
    }
  }

  /**
   * حذف المشرف
   * Delete admin
   * 
   * @param {number} id - معرف المشرف / Admin ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id) {
    try {
      if (!id) {
        return [null, 'معرف المشرف مطلوب'];
      }

      await PGdelete(Admin, { id });
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف المشرف:', error);
      return [null, 'فشل في حذف المشرف'];
    }
  }
}

export default AdminsService;