import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { TopThree } from '../models/index.js';
import { Op } from 'sequelize';

class TopThreeService {
  /**
   * إنشاء عنصر جديد في أفضل ثلاثة
   * @param {Object} topThreeData - بيانات العنصر
   * @returns {Promise<Object>} - العنصر المنشأ
   */
  static async createTopThree(topThreeData) {
    try {
      const result = await PGinsert(TopThree, topThreeData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * إنشاء عنصر جديد مع التحقق من عدم تجاوز الحد الأقصى
   * @param {string} id - معرف العنصر
   * @param {string} name - اسم العنصر
   * @param {string} description - وصف العنصر
   * @returns {Promise<Object>} - العنصر المنشأ
   */
  static async createTopThreeItem(id, name, description) {
    try {
      // التحقق من عدد العناصر الحالية
      const currentCount = await this.getTopThreeCount();
      
      if (currentCount >= 3) {
        throw new Error('لا يمكن إضافة أكثر من 3 عناصر في قائمة أفضل ثلاثة');
      }
      
      const data = { id, name, description };
      const result = await PGinsert(TopThree, data);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع عناصر أفضل ثلاثة
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة العناصر
   */
  static async getAllTopThree(options = {}) {
    try {
      const defaultOptions = {
        order: [['createdAt', 'ASC']],
        ...options
      };
      
      const result = await TopThree.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على عناصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * الحصول على عنصر أفضل ثلاثة بواسطة المعرف
   * @param {string} id - معرف العنصر
   * @returns {Promise<Object|null>} - العنصر أو null
   */
  static async getTopThreeById(id) {
    try {
      const result = await PGselectAll(TopThree, {id: id});
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * الحصول على عنصر أفضل ثلاثة بواسطة الاسم
   * @param {string} name - اسم العنصر
   * @returns {Promise<Object|null>} - العنصر أو null
   */
  static async getTopThreeByName(name) {
    try {
      const result = await PGselectAll(TopThree, {name: name});
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على عنصر أفضل ثلاثة بواسطة الاسم: ${error.message}`);
    }
  }

  /**
   * البحث في عناصر أفضل ثلاثة بواسطة الاسم
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Promise<Array>} - قائمة العناصر المطابقة
   */
  static async searchTopThreeByName(searchTerm) {
    try {
      const result = await PGselectAll(TopThree, {name: `%${searchTerm}%`, Op: Op.like});
      
      return result.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw new Error(`خطأ في البحث في عناصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * البحث في عناصر أفضل ثلاثة بواسطة الوصف
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Promise<Array>} - قائمة العناصر المطابقة
   */
  static async searchTopThreeByDescription(searchTerm) {
    try {
      const result = await PGselectAll(TopThree, {description: `%${searchTerm}%`, Op: Op.like});
      
      return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } catch (error) {
      throw new Error(`خطأ في البحث في أوصاف أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * البحث العام في عناصر أفضل ثلاثة (الاسم والوصف)
   * @param {string} searchTerm - مصطلح البحث
   * @returns {Promise<Array>} - قائمة العناصر المطابقة
   */
  static async searchTopThree(searchTerm) {
    try {
      const result = await TopThree.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${searchTerm}%`
              }
            },
            {
              description: {
                [Op.like]: `%${searchTerm}%`
              }
            }
          ]
        },
        order: [['createdAt', 'ASC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث العام في أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * الحصول على عناصر أفضل ثلاثة بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة العناصر
   */
  static async getTopThreeByDateRange(startDate, endDate) {
    try {
      const result = await TopThree.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['createdAt', 'ASC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على عناصر أفضل ثلاثة بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * الحصول على أحدث عناصر أفضل ثلاثة
   * @param {number} limit - عدد العناصر المطلوب إرجاعها
   * @returns {Promise<Array>} - قائمة العناصر
   */
  static async getRecentTopThree(limit = 3) {
    try {
      const result = await TopThree.findAll({
        order: [['createdAt', 'DESC']],
        limit: Math.min(limit, 3) // التأكد من عدم تجاوز 3 عناصر
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على أحدث عناصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * الحصول على عدد عناصر أفضل ثلاثة
   * @returns {Promise<number>} - عدد العناصر
   */
  static async getTopThreeCount() {
    try {
      const result = await TopThree.findAll();
      return result.length;
    } catch (error) {
      throw new Error(`خطأ في الحصول على عدد عناصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * تحديث عنصر أفضل ثلاثة
   * @param {string} id - معرف العنصر
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - العنصر المحدث
   */
  static async updateTopThree(id, updateData) {
    try {
      const result = await PGupdate(TopThree, updateData, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * تحديث اسم عنصر أفضل ثلاثة
   * @param {string} id - معرف العنصر
   * @param {string} newName - الاسم الجديد
   * @returns {Promise<Object>} - العنصر المحدث
   */
  static async updateTopThreeName(id, newName) {
    try {
      const result = await PGupdate(TopThree, { name: newName }, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث اسم عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * تحديث وصف عنصر أفضل ثلاثة
   * @param {string} id - معرف العنصر
   * @param {string} newDescription - الوصف الجديد
   * @returns {Promise<Object>} - العنصر المحدث
   */
  static async updateTopThreeDescription(id, newDescription) {
    try {
      const result = await PGupdate(TopThree, { description: newDescription }, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث وصف عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * تحديث اسم ووصف عنصر أفضل ثلاثة
   * @param {string} id - معرف العنصر
   * @param {string} newName - الاسم الجديد
   * @param {string} newDescription - الوصف الجديد
   * @returns {Promise<Object>} - العنصر المحدث
   */
  static async updateTopThreeNameAndDescription(id, newName, newDescription) {
    try {
      const result = await PGupdate(TopThree, {
        name: newName,
        description: newDescription
      }, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث اسم ووصف عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * حذف عنصر أفضل ثلاثة
   * @param {string} id - معرف العنصر
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteTopThree(id) {
    try {
      const result = await PGdelete(TopThree, {
        where: { id }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * حذف عنصر أفضل ثلاثة بواسطة الاسم
   * @param {string} name - اسم العنصر
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteTopThreeByName(name) {
    try {
      const result = await PGdelete(TopThree, {
        where: { name }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف عنصر أفضل ثلاثة بواسطة الاسم: ${error.message}`);
    }
  }

  /**
   * حذف جميع عناصر أفضل ثلاثة
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteAllTopThree() {
    try {
      const result = await PGdelete(TopThree, {});
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف جميع عناصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * حذف عناصر أفضل ثلاثة بواسطة نطاق زمني
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteTopThreeByDateRange(startDate, endDate) {
    try {
      const result = await PGdelete(TopThree, {
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف عناصر أفضل ثلاثة بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * استبدال عنصر في أفضل ثلاثة
   * @param {string} oldId - معرف العنصر القديم
   * @param {Object} newItemData - بيانات العنصر الجديد
   * @returns {Promise<Object>} - العنصر الجديد
   */
  static async replaceTopThreeItem(oldId, newItemData) {
    try {
      // حذف العنصر القديم
      await this.deleteTopThree(oldId);
      
      // إضافة العنصر الجديد
      const result = await this.createTopThree(newItemData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في استبدال عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * إعادة تعيين قائمة أفضل ثلاثة بالبيانات الافتراضية
   * @returns {Promise<Array>} - قائمة العناصر الجديدة
   */
  static async resetToDefault() {
    try {
      // حذف جميع العناصر الحالية
      await this.deleteAllTopThree();
      
      // إضافة البيانات الافتراضية
      const defaultItems = [
        {
          id: '423067123225722891',
          name: 'R7 Clan',
          description: 'dsf ssgdsgdsg sd'
        },
        {
          id: '520341040931143692',
          name: 'Wizard',
          description: 'erydrgfd gfddfryfdh fchfdfdhgfd fdhfdhd hdhfdhdghdfrf'
        },
        {
          id: '520346922876141598',
          name: 'Programmers group',
          description: 'rgdrser eryery erertreryer fdg'
        }
      ];
      
      const results = [];
      for (const item of defaultItems) {
        const result = await this.createTopThree(item);
        results.push(result);
      }
      
      return results;
    } catch (error) {
      throw new Error(`خطأ في إعادة تعيين قائمة أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات أفضل ثلاثة
   * @returns {Promise<Object>} - الإحصائيات
   */
  static async getTopThreeStats() {
    try {
      const allItems = await this.getAllTopThree();
      const totalItems = allItems.length;
      
      // حساب متوسط طول الاسم
      const avgNameLength = totalItems > 0 
        ? Math.round((allItems.reduce((sum, item) => sum + item.name.length, 0) / totalItems) * 100) / 100
        : 0;
      
      // حساب متوسط طول الوصف
      const avgDescriptionLength = totalItems > 0
        ? Math.round((allItems.reduce((sum, item) => sum + item.description.length, 0) / totalItems) * 100) / 100
        : 0;
      
      // العنصر الأحدث والأقدم
      const newestItem = allItems.length > 0 ? allItems[allItems.length - 1] : null;
      const oldestItem = allItems.length > 0 ? allItems[0] : null;
      
      return {
        totalItems,
        maxItems: 3,
        availableSlots: Math.max(0, 3 - totalItems),
        avgNameLength,
        avgDescriptionLength,
        newestItem: newestItem ? {
          id: newestItem.id,
          name: newestItem.name,
          createdAt: newestItem.createdAt
        } : null,
        oldestItem: oldestItem ? {
          id: oldestItem.id,
          name: oldestItem.name,
          createdAt: oldestItem.createdAt
        } : null
      };
    } catch (error) {
      throw new Error(`خطأ في الحصول على إحصائيات أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود عنصر في أفضل ثلاثة
   * @param {string} id - معرف العنصر
   * @returns {Promise<boolean>} - true إذا كان العنصر موجود
   */
  static async existsTopThree(id) {
    try {
      const item = await this.getTopThreeById(id);
      return item !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود عنصر أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * التحقق من وجود اسم في أفضل ثلاثة
   * @param {string} name - اسم العنصر
   * @returns {Promise<boolean>} - true إذا كان الاسم موجود
   */
  static async existsTopThreeName(name) {
    try {
      const item = await this.getTopThreeByName(name);
      return item !== null;
    } catch (error) {
      throw new Error(`خطأ في التحقق من وجود اسم في أفضل ثلاثة: ${error.message}`);
    }
  }

  /**
   * التحقق من إمكانية إضافة عنصر جديد
   * @returns {Promise<boolean>} - true إذا كان بالإمكان إضافة عنصر جديد
   */
  static async canAddNewItem() {
    try {
      const currentCount = await this.getTopThreeCount();
      return currentCount < 3;
    } catch (error) {
      throw new Error(`خطأ في التحقق من إمكانية إضافة عنصر جديد: ${error.message}`);
    }
  }
}

export default TopThreeService;