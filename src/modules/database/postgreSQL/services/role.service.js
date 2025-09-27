import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Role } from '../models/index.js';

/**
 * خدمة إدارة الأدوار - Role Service
 * تحتوي على الوظائف الأساسية لإدارة الأدوار والصلاحيات
 */
class RoleService {
  
  /**
   * إنشاء دور جديد
   * @param {Object} roleData - بيانات الدور
   * @returns {Promise<Object>} الدور المُنشأ
   */
  static async createRole(roleData) {
    try {
      // التحقق من البيانات المطلوبة
      if (!roleData.name || !roleData.site_id) {
        throw new Error('البيانات المطلوبة مفقودة: name, site_id');
      }

      // التحقق من عدم تكرار اسم الدور في نفس الموقع
      const existingRole = await this.getRoleByNameAndSite(roleData.name, roleData.site_id);
      if (existingRole) {
        throw new Error('اسم الدور موجود بالفعل في هذا الموقع');
      }

      const newRole = await PGinsert(Role, roleData);
      return newRole;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الدور: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع الأدوار
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة الأدوار
   */
  static async getAllRoles(options = {}) {
    try {
      const roles = await Role.findAll({
        order: [['created_at', 'DESC']],
        ...options
      });
      return roles;
    } catch (error) {
      throw new Error(`خطأ في جلب الأدوار: ${error.message}`);
    }
  }

  /**
   * الحصول على دور بواسطة المعرف
   * @param {number} roleId - معرف الدور
   * @returns {Promise<Object|null>} الدور أو null
   */
  static async getRoleById(roleId) {
    try {
      const role = await Role.findByPk(roleId);
      return role;
    } catch (error) {
      throw new Error(`خطأ في جلب الدور: ${error.message}`);
    }
  }

  /**
   * الحصول على دور بواسطة الاسم والموقع
   * @param {string} name - اسم الدور
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<Object|null>} الدور أو null
   */
  static async getRoleByNameAndSite(name, siteId) {
    try {
      const role = await Role.findOne({
        where: { 
          name: name,
          site_id: siteId 
        }
      });
      return role;
    } catch (error) {
      throw new Error(`خطأ في جلب الدور: ${error.message}`);
    }
  }

  /**
   * الحصول على أدوار الموقع
   * @param {number} siteId - معرف الموقع
   * @param {boolean} activeOnly - جلب الأدوار النشطة فقط
   * @returns {Promise<Array>} قائمة أدوار الموقع
   */
  static async getRolesBySite(siteId, activeOnly = false) {
    try {
      const whereClause = { site_id: siteId };
      if (activeOnly) {
        whereClause.is_active = true;
      }

      const roles = await Role.findAll({
        where: whereClause,
        order: [['name', 'ASC']]
      });
      return roles;
    } catch (error) {
      throw new Error(`خطأ في جلب أدوار الموقع: ${error.message}`);
    }
  }

  /**
   * الحصول على الدور الافتراضي للموقع
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<Object|null>} الدور الافتراضي أو null
   */
  static async getDefaultRole(siteId) {
    try {
      const role = await Role.findOne({
        where: { 
          site_id: siteId,
          is_default: true,
          is_active: true
        }
      });
      return role;
    } catch (error) {
      throw new Error(`خطأ في جلب الدور الافتراضي: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات الدور
   * @param {number} roleId - معرف الدور
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} الدور المُحدث
   */
  static async updateRole(roleId, updateData) {
    try {
      // التحقق من وجود الدور
      const role = await this.getRoleById(roleId);
      if (!role) {
        throw new Error('الدور غير موجود');
      }

      // التحقق من تكرار الاسم إذا تم تحديثه
      if (updateData.name && updateData.name !== role.name) {
        const existingRole = await this.getRoleByNameAndSite(updateData.name, role.site_id);
        if (existingRole && existingRole.id !== roleId) {
          throw new Error('اسم الدور موجود بالفعل في هذا الموقع');
        }
      }

      const updatedRole = await PGupdate(Role, updateData, { id: roleId });
      return updatedRole;
    } catch (error) {
      throw new Error(`خطأ في تحديث الدور: ${error.message}`);
    }
  }

  /**
   * تحديث صلاحيات الدور
   * @param {number} roleId - معرف الدور
   * @param {Object} permissions - الصلاحيات الجديدة
   * @returns {Promise<Object>} الدور المُحدث
   */
  static async updateRolePermissions(roleId, permissions) {
    try {
      const updatedRole = await this.updateRole(roleId, { permissions });
      return updatedRole;
    } catch (error) {
      throw new Error(`خطأ في تحديث صلاحيات الدور: ${error.message}`);
    }
  }

  /**
   * تفعيل أو إلغاء تفعيل الدور
   * @param {number} roleId - معرف الدور
   * @param {boolean} isActive - حالة التفعيل
   * @returns {Promise<Object>} الدور المُحدث
   */
  static async toggleRoleStatus(roleId, isActive) {
    try {
      const updatedRole = await this.updateRole(roleId, { is_active: isActive });
      return updatedRole;
    } catch (error) {
      throw new Error(`خطأ في تغيير حالة الدور: ${error.message}`);
    }
  }

  /**
   * حذف الدور
   * @param {number} roleId - معرف الدور
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteRole(roleId) {
    try {
      // التحقق من وجود الدور
      const role = await this.getRoleById(roleId);
      if (!role) {
        throw new Error('الدور غير موجود');
      }

      // منع حذف الدور الافتراضي
      if (role.is_default) {
        throw new Error('لا يمكن حذف الدور الافتراضي');
      }

      const result = await PGdelete(Role, {id: roleId});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الدور: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود صلاحية في الدور
   * @param {number} roleId - معرف الدور
   * @param {string} permissionCode - كود الصلاحية
   * @returns {Promise<boolean>} نتيجة التحقق
   */
  static async hasPermission(roleId, permissionCode) {
    try {
      const role = await this.getRoleById(roleId);
      if (!role || !role.is_active) {
        return false;
      }

      return role.permissions && role.permissions[permissionCode] === true;
    } catch (error) {
      throw new Error(`خطأ في التحقق من الصلاحية: ${error.message}`);
    }
  }
}

export default RoleService;