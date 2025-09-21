import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { StaffUser, Role, User } from '../models/index.js';

/**
 * خدمة إدارة موظفي المواقع - Staff User Service
 * تحتوي على الوظائف الأساسية لإدارة موظفي المواقع وأدوارهم
 */
class StaffUserService {
  
  /**
   * إضافة موظف جديد للموقع
   * @param {Object} staffData - بيانات الموظف
   * @returns {Promise<Object>} الموظف المُضاف
   */
  static async addStaffUser(staffData) {
    try {
      // التحقق من البيانات المطلوبة
      if (!staffData.site_id || !staffData.user_id) {
        throw new Error('البيانات المطلوبة مفقودة: site_id, user_id');
      }

      // التحقق من عدم وجود الموظف مسبقاً في نفس الموقع
      const existingStaff = await this.getStaffUserBySiteAndUser(staffData.site_id, staffData.user_id);
      if (existingStaff) {
        throw new Error('المستخدم موظف بالفعل في هذا الموقع');
      }

      const newStaffUser = await PGinsert(StaffUser, staffData);
      return newStaffUser;
    } catch (error) {
      throw new Error(`خطأ في إضافة الموظف: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع موظفي المواقع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة الموظفين
   */
  static async getAllStaffUsers(options = {}) {
    try {
      const staffUsers = await StaffUser.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email']
          },
          {
            model: Role,
            attributes: ['id', 'name', 'description']
          }
        ],
        order: [['created_at', 'DESC']],
        ...options
      });
      return staffUsers;
    } catch (error) {
      throw new Error(`خطأ في جلب الموظفين: ${error.message}`);
    }
  }

  /**
   * الحصول على موظف بواسطة المعرف
   * @param {number} staffId - معرف الموظف
   * @returns {Promise<Object|null>} الموظف أو null
   */
  static async getStaffUserById(staffId) {
    try {
      const staffUser = await StaffUser.findByPk(staffId, {
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email']
          },
          {
            model: Role,
            attributes: ['id', 'name', 'description', 'permissions']
          }
        ]
      });
      return staffUser;
    } catch (error) {
      throw new Error(`خطأ في جلب الموظف: ${error.message}`);
    }
  }

  /**
   * الحصول على موظف بواسطة الموقع والمستخدم
   * @param {number} siteId - معرف الموقع
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Object|null>} الموظف أو null
   */
  static async getStaffUserBySiteAndUser(siteId, userId) {
    try {
      const staffUser = await StaffUser.findOne({
        where: { 
          site_id: siteId,
          user_id: userId 
        },
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email']
          },
          {
            model: Role,
            attributes: ['id', 'name', 'description', 'permissions']
          }
        ]
      });
      return staffUser;
    } catch (error) {
      throw new Error(`خطأ في جلب الموظف: ${error.message}`);
    }
  }

  /**
   * الحصول على موظفي الموقع
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<Array>} قائمة موظفي الموقع
   */
  static async getStaffUsersBySite(siteId) {
    try {
      const staffUsers = await StaffUser.findAll({
        where: { site_id: siteId },
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email']
          },
          {
            model: Role,
            attributes: ['id', 'name', 'description']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      return staffUsers;
    } catch (error) {
      throw new Error(`خطأ في جلب موظفي الموقع: ${error.message}`);
    }
  }

  /**
   * الحصول على مواقع المستخدم كموظف
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Array>} قائمة المواقع التي يعمل بها المستخدم
   */
  static async getUserSites(userId) {
    try {
      const staffUsers = await StaffUser.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Role,
            attributes: ['id', 'name', 'description', 'permissions']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      return staffUsers;
    } catch (error) {
      throw new Error(`خطأ في جلب مواقع المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على موظفي الدور
   * @param {number} roleId - معرف الدور
   * @returns {Promise<Array>} قائمة الموظفين بهذا الدور
   */
  static async getStaffUsersByRole(roleId) {
    try {
      const staffUsers = await StaffUser.findAll({
        where: { role_id: roleId },
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email']
          },
          {
            model: Role,
            attributes: ['id', 'name', 'description']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      return staffUsers;
    } catch (error) {
      throw new Error(`خطأ في جلب موظفي الدور: ${error.message}`);
    }
  }

  /**
   * تحديث دور الموظف
   * @param {number} staffId - معرف الموظف
   * @param {number} roleId - معرف الدور الجديد
   * @returns {Promise<Object>} الموظف المُحدث
   */
  static async updateStaffRole(staffId, roleId) {
    try {
      // التحقق من وجود الموظف
      const staffUser = await this.getStaffUserById(staffId);
      if (!staffUser) {
        throw new Error('الموظف غير موجود');
      }

      // التحقق من وجود الدور إذا تم تحديده
      if (roleId) {
        const role = await Role.findByPk(roleId);
        if (!role) {
          throw new Error('الدور غير موجود');
        }
        
        // التحقق من أن الدور ينتمي لنفس الموقع
        if (role.site_id !== staffUser.site_id) {
          throw new Error('الدور لا ينتمي لنفس الموقع');
        }
      }

      const updatedStaffUser = await PGupdate(StaffUser, staffId, { role_id: roleId });
      return updatedStaffUser;
    } catch (error) {
      throw new Error(`خطأ في تحديث دور الموظف: ${error.message}`);
    }
  }

  /**
   * إزالة موظف من الموقع
   * @param {number} staffId - معرف الموظف
   * @returns {Promise<boolean>} نتيجة الإزالة
   */
  static async removeStaffUser(staffId) {
    try {
      // التحقق من وجود الموظف
      const staffUser = await this.getStaffUserById(staffId);
      if (!staffUser) {
        throw new Error('الموظف غير موجود');
      }

      const result = await PGdelete(StaffUser, staffId);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إزالة الموظف: ${error.message}`);
    }
  }

  /**
   * إزالة موظف من الموقع بواسطة معرف المستخدم والموقع
   * @param {number} siteId - معرف الموقع
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<boolean>} نتيجة الإزالة
   */
  static async removeStaffUserBySiteAndUser(siteId, userId) {
    try {
      const staffUser = await this.getStaffUserBySiteAndUser(siteId, userId);
      if (!staffUser) {
        throw new Error('الموظف غير موجود في هذا الموقع');
      }

      const result = await this.removeStaffUser(staffUser.id);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إزالة الموظف: ${error.message}`);
    }
  }

  /**
   * التحقق من صلاحية المستخدم في الموقع
   * @param {string} userId - معرف المستخدم
   * @param {number} siteId - معرف الموقع
   * @param {string} permissionCode - كود الصلاحية
   * @returns {Promise<boolean>} نتيجة التحقق
   */
  static async hasPermission(userId, siteId, permissionCode) {
    try {
      const staffUser = await this.getStaffUserBySiteAndUser(siteId, userId);
      if (!staffUser || !staffUser.Role) {
        return false;
      }

      return staffUser.Role.permissions && staffUser.Role.permissions[permissionCode] === true;
    } catch (error) {
      throw new Error(`خطأ في التحقق من الصلاحية: ${error.message}`);
    }
  }

  /**
   * عدد موظفي الموقع
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<number>} عدد الموظفين
   */
  static async countStaffUsers(siteId) {
    try {
      const count = await StaffUser.count({
        where: { site_id: siteId }
      });
      return count;
    } catch (error) {
      throw new Error(`خطأ في عد الموظفين: ${error.message}`);
    }
  }
}

export default StaffUserService;