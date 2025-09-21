import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { AuditTrails } from '../models/index.js';

/**
 * خدمة إدارة سجلات التدقيق - AuditTrails Service
 * تحتوي على الوظائف الأساسية لتسجيل ومتابعة العمليات في النظام
 */
class AuditTrailsService {

  /**
   * تسجيل عملية تدقيق جديدة
   * @param {Object} auditData - بيانات عملية التدقيق
   * @returns {Promise<Object>} السجل المُنشأ
   */
  static async createAuditTrail(auditData) {
    try {
      if (!auditData.user_id || !auditData.user_type || !auditData.action || !auditData.entity_type) {
        throw new Error('البيانات المطلوبة مفقودة: user_id, user_type, action, entity_type');
      }

      const newAuditTrail = await mDBinsert(AuditTrails, auditData);
      return newAuditTrail;
    } catch (error) {
      throw new Error(`خطأ في تسجيل عملية التدقيق: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات التدقيق للمستخدم
   * @param {number} userId - معرف المستخدم
   * @param {number} limit - عدد السجلات المطلوبة
   * @returns {Promise<Array>} قائمة سجلات التدقيق
   */
  static async getUserAuditTrails(userId, limit = 50) {
    try {
      const auditTrails = await mDBselectAll({
        model: AuditTrails,
        filter: { user_id: userId }
      });
      return auditTrails || [];
    } catch (error) {
      throw new Error(`خطأ في جلب سجلات التدقيق للمستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات التدقيق لكيان معين
   * @param {string} entityType - نوع الكيان
   * @param {number} entityId - معرف الكيان
   * @returns {Promise<Array>} قائمة سجلات التدقيق
   */
  static async getEntityAuditTrails(entityType, entityId) {
    try {
      const auditTrails = await mDBselectAll({
        model: AuditTrails,
        filter: { entity_type: entityType, entity_id: entityId }
      });
      return auditTrails || [];
    } catch (error) {
      throw new Error(`خطأ في جلب سجلات التدقيق للكيان: ${error.message}`);
    }
  }

  /**
   * الحصول على سجلات التدقيق حسب نوع العملية
   * @param {string} action - نوع العملية
   * @param {number} limit - عدد السجلات المطلوبة
   * @returns {Promise<Array>} قائمة سجلات التدقيق
   */
  static async getAuditTrailsByAction(action, limit = 100) {
    try {
      const auditTrails = await mDBselectAll({
        model: AuditTrails,
        filter: { action: action }
      });
      return auditTrails || [];
    } catch (error) {
      throw new Error(`خطأ في جلب سجلات التدقيق حسب العملية: ${error.message}`);
    }
  }

  /**
   * تسجيل عملية إنشاء
   * @param {number} userId - معرف المستخدم
   * @param {string} userType - نوع المستخدم
   * @param {string} entityType - نوع الكيان
   * @param {number} entityId - معرف الكيان
   * @param {Object} newValue - القيمة الجديدة
   * @param {string} ipAddress - عنوان IP
   * @returns {Promise<Object>} السجل المُنشأ
   */
  static async logCreate(userId, userType, entityType, entityId, newValue, ipAddress) {
    try {
      const auditData = {
        user_id: userId,
        user_type: userType,
        action: 'create',
        entity_type: entityType,
        entity_id: entityId,
        new_value: newValue,
        ip_address: ipAddress
      };

      return await this.createAuditTrail(auditData);
    } catch (error) {
      throw new Error(`خطأ في تسجيل عملية الإنشاء: ${error.message}`);
    }
  }

  /**
   * تسجيل عملية تحديث
   * @param {number} userId - معرف المستخدم
   * @param {string} userType - نوع المستخدم
   * @param {string} entityType - نوع الكيان
   * @param {number} entityId - معرف الكيان
   * @param {Object} oldValue - القيمة القديمة
   * @param {Object} newValue - القيمة الجديدة
   * @param {Array} changes - قائمة التغييرات
   * @param {string} ipAddress - عنوان IP
   * @returns {Promise<Object>} السجل المُنشأ
   */
  static async logUpdate(userId, userType, entityType, entityId, oldValue, newValue, changes, ipAddress) {
    try {
      const auditData = {
        user_id: userId,
        user_type: userType,
        action: 'update',
        entity_type: entityType,
        entity_id: entityId,
        old_value: oldValue,
        new_value: newValue,
        changes: changes,
        ip_address: ipAddress
      };

      return await this.createAuditTrail(auditData);
    } catch (error) {
      throw new Error(`خطأ في تسجيل عملية التحديث: ${error.message}`);
    }
  }

  /**
   * تسجيل عملية حذف
   * @param {number} userId - معرف المستخدم
   * @param {string} userType - نوع المستخدم
   * @param {string} entityType - نوع الكيان
   * @param {number} entityId - معرف الكيان
   * @param {Object} oldValue - القيمة المحذوفة
   * @param {string} ipAddress - عنوان IP
   * @param {string} reason - سبب الحذف
   * @returns {Promise<Object>} السجل المُنشأ
   */
  static async logDelete(userId, userType, entityType, entityId, oldValue, ipAddress, reason = null) {
    try {
      const auditData = {
        user_id: userId,
        user_type: userType,
        action: 'delete',
        entity_type: entityType,
        entity_id: entityId,
        old_value: oldValue,
        ip_address: ipAddress,
        reason: reason
      };

      return await this.createAuditTrail(auditData);
    } catch (error) {
      throw new Error(`خطأ في تسجيل عملية الحذف: ${error.message}`);
    }
  }

  /**
   * حذف سجلات التدقيق القديمة
   * @param {number} daysOld - عدد الأيام للاحتفاظ بالسجلات
   * @returns {Promise<Object>} نتيجة الحذف
   */
  static async deleteOldAuditTrails(daysOld = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await mDBdelete(AuditTrails, {
        created_at: { $lt: cutoffDate }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف سجلات التدقيق القديمة: ${error.message}`);
    }
  }
}

export default AuditTrailsService;