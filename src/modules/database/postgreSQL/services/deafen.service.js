import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Deafen } from '../models/index.js';
import sequelize from 'sequelize';
import { Op } from 'sequelize';

class DeafenService {
  /**
   * إنشاء سجل كتم صوت جديد
   * @param {Object} deafenData - بيانات كتم الصوت
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createDeafen(deafenData) {
    try {
      const result = await PGinsert(Deafen, deafenData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل كتم الصوت: ${error.message}`);
    }
  }

  /**
   * إنشاء سجل كتم صوت للمستخدم
   * @param {string} userId - معرف المستخدم
   * @param {string} deafensData - بيانات كتم الصوت
   * @returns {Promise<Object>} - السجل المنشأ
   */
  static async createUserDeafen(userId, deafensData = '') {
    try {
      const deafenData = {
        id: userId,
        deafens: deafensData
      };
      return await this.createDeafen(deafenData);
    } catch (error) {
      throw new Error(`خطأ في إنشاء سجل كتم صوت المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع سجلات كتم الصوت
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getAllDeafens(options = {}) {
    try {
      const result = await Deafen.findAll(options);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجلات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل كتم الصوت بواسطة المعرف
   * @param {string} id - معرف المستخدم
   * @returns {Promise<Object|null>} - السجل أو null
   */
  static async getDeafenById(id) {
    try {
      const result = await PGselectAll(Deafen, { id });
      return result.find(deafen => deafen.id === id) || null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على سجل كتم الصوت: ${error.message}`);
    }
  }

  /**
   * البحث في سجلات كتم الصوت
   * @param {string} searchTerm - مصطلح البحث
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async searchDeafens(searchTerm, options = {}) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Deafen.findAll({
        where: {
          [Op.or]: [
            { id: { [Op.like]: `%${searchTerm}%` } },
            { deafens: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث في سجلات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * الحصول على السجلات التي تحتوي على بيانات كتم صوت
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getDeafensWithData(options = {}) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Deafen.findAll({
        where: {
          deafens: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.ne]: '' }
            ]
          }
        },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على السجلات مع البيانات: ${error.message}`);
    }
  }

  /**
   * الحصول على السجلات الفارغة
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getEmptyDeafens(options = {}) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Deafen.findAll({
        where: {
          [Op.or]: [
            { deafens: null },
            { deafens: '' }
          ]
        },
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على السجلات الفارغة: ${error.message}`);
    }
  }

  /**
   * الحصول على السجلات الحديثة
   * @param {number} limit - عدد السجلات
   * @param {Object} options - خيارات إضافية
   * @returns {Promise<Array>} - قائمة السجلات
   */
  static async getRecentDeafens(limit = 50, options = {}) {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Deafen.findAll({
        order: [['id', 'DESC']],
        limit,
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على السجلات الحديثة: ${error.message}`);
    }
  }

  /**
   * تحديث سجل كتم الصوت
   * @param {string} id - معرف المستخدم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateDeafen(id, updateData) {
    try {
      const result = await PGupdate(Deafen, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث سجل كتم الصوت: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات كتم الصوت
   * @param {string} id - معرف المستخدم
   * @param {string} deafensData - بيانات كتم الصوت الجديدة
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async updateDeafensData(id, deafensData) {
    try {
      return await this.updateDeafen(id, { deafens: deafensData });
    } catch (error) {
      throw new Error(`خطأ في تحديث بيانات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * إضافة بيانات إلى كتم الصوت الموجود
   * @param {string} id - معرف المستخدم
   * @param {string} newData - البيانات الجديدة
   * @param {string} separator - الفاصل (افتراضي: فاصلة)
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async appendDeafensData(id, newData, separator = ',') {
    try {
      const existingDeafen = await this.getDeafenById(id);
      if (!existingDeafen) {
        throw new Error('سجل كتم الصوت غير موجود');
      }

      const currentData = existingDeafen.deafens || '';
      const updatedData = currentData ? `${currentData}${separator}${newData}` : newData;
      
      return await this.updateDeafensData(id, updatedData);
    } catch (error) {
      throw new Error(`خطأ في إضافة بيانات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * مسح بيانات كتم الصوت
   * @param {string} id - معرف المستخدم
   * @returns {Promise<Object>} - السجل المحدث
   */
  static async clearDeafensData(id) {
    try {
      return await this.updateDeafensData(id, '');
    } catch (error) {
      throw new Error(`خطأ في مسح بيانات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * حذف سجل كتم الصوت
   * @param {string} id - معرف المستخدم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteDeafen(id) {
    try {
      const result = await PGdelete(Deafen, {
        where: { id }
      });
      return result > 0;
    } catch (error) {
      throw new Error(`خطأ في حذف سجل كتم الصوت: ${error.message}`);
    }
  }

  /**
   * حذف السجلات الفارغة
   * @returns {Promise<number>} - عدد السجلات المحذوفة
   */
  static async deleteEmptyDeafens() {
    try {
      const result = await PGdelete(Deafen, {
        where: {
          [Op.or]: [
            { deafens: null },
            { deafens: '' }
          ]
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف السجلات الفارغة: ${error.message}`);
    }
  }

  /**
   * حذف جميع سجلات كتم الصوت
   * @returns {Promise<number>} - عدد السجلات المحذوفة
   */
  static async deleteAllDeafens() {
    try {
      const result = await PGdelete(Deafen, {});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع سجلات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات سجلات كتم الصوت
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getDeafenStats() {
    try {
      const totalDeafens = await this.countAllDeafens();
      const deafensWithData = await this.countDeafensWithData();
      const emptyDeafens = await this.countEmptyDeafens();
      const averageDataLength = await this.getAverageDataLength();

      return {
        totalDeafens,
        deafensWithData,
        emptyDeafens,
        averageDataLength,
        dataPercentage: totalDeafens > 0 ? (deafensWithData / totalDeafens * 100).toFixed(2) : 0
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * عد جميع سجلات كتم الصوت
   * @returns {Promise<number>} - عدد السجلات
   */
  static async countAllDeafens() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Deafen.count();
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد سجلات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * عد السجلات التي تحتوي على بيانات
   * @returns {Promise<number>} - عدد السجلات
   */
  static async countDeafensWithData() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Deafen.count({
        where: {
          deafens: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.ne]: '' }
            ]
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد السجلات مع البيانات: ${error.message}`);
    }
  }

  /**
   * عد السجلات الفارغة
   * @returns {Promise<number>} - عدد السجلات
   */
  static async countEmptyDeafens() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Deafen.count({
        where: {
          [Op.or]: [
            { deafens: null },
            { deafens: '' }
          ]
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في عد السجلات الفارغة: ${error.message}`);
    }
  }

  /**
   * الحصول على متوسط طول البيانات
   * @returns {Promise<number>} - متوسط الطول
   */
  static async getAverageDataLength() {
    try {
      // استخدام Sequelize مباشرة للعمليات المعقدة
      const result = await Deafen.findAll({
        attributes: [[sequelize.fn('AVG', sequelize.fn('LENGTH', sequelize.col('deafens'))), 'avgLength']],
        where: {
          deafens: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.ne]: '' }
            ]
          }
        }
      });
      return parseFloat(result[0]?.avgLength || 0);
    } catch (error) {
      throw new Error(`خطأ في حساب متوسط طول البيانات: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود سجل كتم الصوت
   * @param {string} id - معرف المستخدم
   * @returns {Promise<boolean>} - هل السجل موجود
   */
  static async deafenExists(id) {
    try {
      const deafen = await this.getDeafenById(id);
      return !!deafen;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود سجل كتم الصوت: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود بيانات كتم الصوت
   * @param {string} id - معرف المستخدم
   * @returns {Promise<boolean>} - هل توجد بيانات
   */
  static async hasDeafensData(id) {
    try {
      const deafen = await this.getDeafenById(id);
      return !!(deafen && deafen.deafens && deafen.deafens.trim() !== '');
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود بيانات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * الحصول على طول بيانات كتم الصوت
   * @param {string} id - معرف المستخدم
   * @returns {Promise<number>} - طول البيانات
   */
  static async getDeafensDataLength(id) {
    try {
      const deafen = await this.getDeafenById(id);
      return deafen && deafen.deafens ? deafen.deafens.length : 0;
    } catch (error) {
      throw new Error(`خطأ في الحصول على طول بيانات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * تحليل بيانات كتم الصوت (تقسيم بالفاصلة)
   * @param {string} id - معرف المستخدم
   * @param {string} separator - الفاصل (افتراضي: فاصلة)
   * @returns {Promise<Array>} - قائمة البيانات المقسمة
   */
  static async parseDeafensData(id, separator = ',') {
    try {
      const deafen = await this.getDeafenById(id);
      if (!deafen || !deafen.deafens) {
        return [];
      }
      
      return deafen.deafens.split(separator).map(item => item.trim()).filter(item => item !== '');
    } catch (error) {
      throw new Error(`خطأ في تحليل بيانات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * إنشاء أو تحديث سجل كتم الصوت (upsert)
   * @param {string} id - معرف المستخدم
   * @param {string} deafensData - بيانات كتم الصوت
   * @returns {Promise<Object>} - السجل المنشأ أو المحدث
   */
  static async upsertDeafen(id, deafensData) {
    try {
      const existingDeafen = await this.getDeafenById(id);
      
      if (existingDeafen) {
        return await this.updateDeafensData(id, deafensData);
      } else {
        return await this.createUserDeafen(id, deafensData);
      }
    } catch (error) {
      throw new Error(`خطأ في إنشاء أو تحديث سجل كتم الصوت: ${error.message}`);
    }
  }

  /**
   * نسخ سجل كتم الصوت
   * @param {string} sourceId - معرف المصدر
   * @param {string} targetId - معرف الهدف
   * @returns {Promise<Object>} - السجل المنسوخ
   */
  static async copyDeafen(sourceId, targetId) {
    try {
      const sourceDeafen = await this.getDeafenById(sourceId);
      if (!sourceDeafen) {
        throw new Error('سجل كتم الصوت المصدر غير موجود');
      }

      return await this.upsertDeafen(targetId, sourceDeafen.deafens || '');
    } catch (error) {
      throw new Error(`خطأ في نسخ سجل كتم الصوت: ${error.message}`);
    }
  }

  /**
   * تصدير جميع سجلات كتم الصوت
   * @returns {Promise<Array>} - السجلات المصدرة
   */
  static async exportAllDeafens() {
    try {
      const deafens = await this.getAllDeafens();
      return deafens.map(deafen => ({
        id: deafen.id,
        deafens: deafen.deafens
      }));
    } catch (error) {
      throw new Error(`خطأ في تصدير سجلات كتم الصوت: ${error.message}`);
    }
  }

  /**
   * استيراد سجلات كتم الصوت
   * @param {Array} deafens - السجلات المستوردة
   * @returns {Promise<Array>} - السجلات المنشأة
   */
  static async importDeafens(deafens) {
    try {
      const createdDeafens = [];
      for (const deafenData of deafens) {
        const deafen = await this.upsertDeafen(deafenData.id, deafenData.deafens || '');
        createdDeafens.push(deafen);
      }
      return createdDeafens;
    } catch (error) {
      throw new Error(`خطأ في استيراد سجلات كتم الصوت: ${error.message}`);
    }
  }
}

export default DeafenService;