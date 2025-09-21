import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import { Session } from '../models/index.js';

/**
 * خدمة إدارة الجلسات - Session Service
 * تحتوي على الوظائف الأساسية لإدارة جلسات المستخدمين
 */
class SessionService {

  /**
   * إنشاء جلسة جديدة
   * @param {Object} sessionData - بيانات الجلسة
   * @returns {Promise<Object>} الجلسة المُنشأة
   */
  static async createSession(sessionData) {
    try {
      if (!sessionData.user_id || !sessionData.token || !sessionData.expires_at) {
        throw new Error('البيانات المطلوبة مفقودة: user_id, token, expires_at');
      }

      const newSession = await mDBinsert(Session, sessionData);
      return newSession;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الجلسة: ${error.message}`);
    }
  }

  /**
   * الحصول على جلسة بواسطة التوكن
   * @param {string} token - توكن الجلسة
   * @returns {Promise<Object|null>} الجلسة أو null
   */
  static async getSessionByToken(token) {
    try {
      const sessions = await mDBselectAll({
        model: Session,
        filter: { token: token }
      });
      return sessions && sessions.length > 0 ? sessions[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب الجلسة: ${error.message}`);
    }
  }

  /**
   * الحصول على جلسات المستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Array>} قائمة جلسات المستخدم
   */
  static async getUserSessions(userId) {
    try {
      const sessions = await mDBselectAll({
        model: Session,
        filter: { user_id: userId }
      });
      return sessions || [];
    } catch (error) {
      throw new Error(`خطأ في جلب جلسات المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على الجلسات النشطة للمستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Array>} قائمة الجلسات النشطة
   */
  static async getActiveSessions(userId) {
    try {
      const sessions = await mDBselectAll({
        model: Session,
        filter: { 
          user_id: userId,
          expires_at: { $gt: new Date() }
        }
      });
      return sessions || [];
    } catch (error) {
      throw new Error(`خطأ في جلب الجلسات النشطة: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات الجلسة
   * @param {string} token - توكن الجلسة
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} الجلسة المُحدثة
   */
  static async updateSession(token, updateData) {
    try {
      const updatedSession = await mDBupdate(Session, { token: token }, updateData);
      return updatedSession;
    } catch (error) {
      throw new Error(`خطأ في تحديث الجلسة: ${error.message}`);
    }
  }

  /**
   * تمديد انتهاء الجلسة
   * @param {string} token - توكن الجلسة
   * @param {Date} newExpiryDate - تاريخ الانتهاء الجديد
   * @returns {Promise<Object>} الجلسة المُحدثة
   */
  static async extendSession(token, newExpiryDate) {
    try {
      return await this.updateSession(token, { expires_at: newExpiryDate });
    } catch (error) {
      throw new Error(`خطأ في تمديد الجلسة: ${error.message}`);
    }
  }

  /**
   * حذف جلسة
   * @param {string} token - توكن الجلسة
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteSession(token) {
    try {
      const result = await mDBdelete(Session, { token: token });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الجلسة: ${error.message}`);
    }
  }

  /**
   * حذف جميع جلسات المستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteUserSessions(userId) {
    try {
      const result = await mDBdelete(Session, { user_id: userId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جلسات المستخدم: ${error.message}`);
    }
  }

  /**
   * حذف الجلسات المنتهية الصلاحية
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteExpiredSessions() {
    try {
      const result = await mDBdelete(Session, { 
        expires_at: { $lt: new Date() }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الجلسات المنتهية: ${error.message}`);
    }
  }

  /**
   * التحقق من صحة الجلسة
   * @param {string} token - توكن الجلسة
   * @returns {Promise<boolean>} صحة الجلسة
   */
  static async isValidSession(token) {
    try {
      const session = await this.getSessionByToken(token);
      if (!session) return false;
      
      return new Date(session.expires_at) > new Date();
    } catch (error) {
      return false;
    }
  }
}

export default SessionService;