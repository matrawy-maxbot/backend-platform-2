import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Permission } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة الصلاحيات - Permission Service
 * تحتوي على الوظائف الأساسية لإدارة صلاحيات النظام
 */
class PermissionService {
  
  /**
   * إنشاء صلاحية جديدة
   * @param {Object} permissionData - بيانات الصلاحية
   * @returns {Promise<Object>} الصلاحية المُنشأة
   */
  static async createPermission(permissionData) {
    try {
      // التحقق من البيانات المطلوبة
      if (!permissionData.code || !permissionData.name || !permissionData.site_id) {
        throw new Error('البيانات المطلوبة مفقودة: code, name, site_id');
      }

      // التحقق من عدم تكرار الكود في نفس الموقع
      const existingPermission = await this.getPermissionByCode(permissionData.code, permissionData.site_id);
      if (existingPermission) {
        throw new Error('كود الصلاحية موجود بالفعل في هذا الموقع');
      }

      const newPermission = await PGinsert(Permission, permissionData);
      return newPermission;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الصلاحية: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع الصلاحيات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة الصلاحيات
   */
  static async getAllPermissions(options = {}) {
    try {
      const permissions = await Permission.findAll({
        order: [['name', 'ASC']],
        ...options
      });
      return permissions;
    } catch (error) {
      throw new Error(`خطأ في جلب الصلاحيات: ${error.message}`);
    }
  }

  /**
   * الحصول على صلاحية بواسطة المعرف
   * @param {number} permissionId - معرف الصلاحية
   * @returns {Promise<Object|null>} الصلاحية أو null
   */
  static async getPermissionById(permissionId) {
    try {
      const permission = await Permission.findByPk(permissionId);
      return permission;
    } catch (error) {
      throw new Error(`خطأ في جلب الصلاحية: ${error.message}`);
    }
  }

  /**
   * الحصول على صلاحية بواسطة الكود
   * @param {string} code - كود الصلاحية
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<Object|null>} الصلاحية أو null
   */
  static async getPermissionByCode(code, siteId) {
    try {
      const permission = await Permission.findOne({
        where: { 
          code: code,
          site_id: siteId
        }
      });
      return permission;
    } catch (error) {
      throw new Error(`خطأ في جلب الصلاحية بالكود: ${error.message}`);
    }
  }

  /**
   * الحصول على صلاحيات موقع معين
   * @param {number} siteId - معرف الموقع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة صلاحيات الموقع
   */
  static async getPermissionsBySite(siteId, options = {}) {
    try {
      const permissions = await Permission.findAll({
        where: { site_id: siteId },
        order: [['name', 'ASC']],
        ...options
      });
      return permissions;
    } catch (error) {
      throw new Error(`خطأ في جلب صلاحيات الموقع: ${error.message}`);
    }
  }

  /**
   * الحصول على صلاحيات فئة معينة
   * @param {number} categoryId - معرف الفئة
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة صلاحيات الفئة
   */
  static async getPermissionsByCategory(categoryId, options = {}) {
    try {
      const permissions = await Permission.findAll({
        where: { category_id: categoryId },
        order: [['name', 'ASC']],
        ...options
      });
      return permissions;
    } catch (error) {
      throw new Error(`خطأ في جلب صلاحيات الفئة: ${error.message}`);
    }
  }

  /**
   * البحث في الصلاحيات بالاسم أو الوصف
   * @param {string} searchTerm - مصطلح البحث
   * @param {number} siteId - معرف الموقع (اختياري)
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة الصلاحيات المطابقة
   */
  static async searchPermissions(searchTerm, siteId = null, options = {}) {
    try {
      const whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } },
          { code: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      };

      if (siteId) {
        whereClause.site_id = siteId;
      }

      const permissions = await Permission.findAll({
        where: whereClause,
        order: [['name', 'ASC']],
        ...options
      });
      return permissions;
    } catch (error) {
      throw new Error(`خطأ في البحث عن الصلاحيات: ${error.message}`);
    }
  }

  /**
   * تحديث صلاحية
   * @param {number} permissionId - معرف الصلاحية
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} الصلاحية المُحدثة
   */
  static async updatePermission(permissionId, updateData) {
    try {
      // التحقق من وجود الصلاحية
      const permission = await this.getPermissionById(permissionId);
      if (!permission) {
        throw new Error('الصلاحية غير موجودة');
      }

      // التحقق من الكود إذا تم تحديثه
      if (updateData.code && updateData.code !== permission.code) {
        const existingPermission = await this.getPermissionByCode(updateData.code, permission.site_id);
        if (existingPermission && existingPermission.id !== permissionId) {
          throw new Error('كود الصلاحية مستخدم بالفعل');
        }
      }

      const updatedPermission = await PGupdate(Permission, permissionId, updateData);
      return updatedPermission;
    } catch (error) {
      throw new Error(`خطأ في تحديث الصلاحية: ${error.message}`);
    }
  }

  /**
   * حذف صلاحية
   * @param {number} permissionId - معرف الصلاحية
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deletePermission(permissionId) {
    try {
      // التحقق من وجود الصلاحية
      const permission = await this.getPermissionById(permissionId);
      if (!permission) {
        throw new Error('الصلاحية غير موجودة');
      }

      const result = await PGdelete(Permission, permissionId);
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الصلاحية: ${error.message}`);
    }
  }

  /**
   * عدد الصلاحيات
   * @param {Object} whereClause - شروط العد
   * @returns {Promise<number>} عدد الصلاحيات
   */
  static async countPermissions(whereClause = {}) {
    try {
      const count = await Permission.count({ where: whereClause });
      return count;
    } catch (error) {
      throw new Error(`خطأ في عد الصلاحيات: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الصلاحيات
   * @param {number} siteId - معرف الموقع (اختياري)
   * @returns {Promise<Object>} إحصائيات الصلاحيات
   */
  static async getPermissionStats(siteId = null) {
    try {
      const whereClause = siteId ? { site_id: siteId } : {};
      
      const totalPermissions = await this.countPermissions(whereClause);
      const categorizedPermissions = await this.countPermissions({ 
        ...whereClause, 
        category_id: { [Op.ne]: null } 
      });
      const uncategorizedPermissions = await this.countPermissions({ 
        ...whereClause, 
        category_id: null 
      });

      return {
        total: totalPermissions,
        categorized: categorizedPermissions,
        uncategorized: uncategorizedPermissions
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات الصلاحيات: ${error.message}`);
    }
  }
}

export default PermissionService;