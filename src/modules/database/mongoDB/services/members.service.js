import { mDBinsert, mDBupdate, mDBdelete, mDBselectAll } from '../config/mongodb.manager.js';
import Member from '../models/Member.model.js';

/**
 * خدمة إدارة الأعضاء - Members Service
 * تحتوي على جميع العمليات المتعلقة بإدارة إعدادات الأعضاء في خوادم Discord
 * Contains all operations related to members settings management in Discord servers
 */
class MembersService {
  
  /**
   * الحصول على جميع إعدادات الأعضاء
   * Get all members settings
   * 
   * @param {Object} options - خيارات الاستعلام / Query options
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getAll(options = {}) {
    try {
      const members = await Member.find().limit(options.limit || 0).skip(options.offset || 0).exec();
      
      return [members, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات الأعضاء:', error);
      return [null, 'فشل في جلب إعدادات الأعضاء'];
    }
  }

  /**
   * الحصول على إعدادات عضو بواسطة المعرف
   * Get member settings by ID
   * 
   * @param {string} id - معرف إعدادات العضو / Member settings ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async getById(id) {
    try {
      if (!id) {
        return [null, 'معرف إعدادات العضو مطلوب'];
      }

      const members = await mDBselectAll(Member, { _id: id });
      
      return [members[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات العضو:', error);
      return [null, 'فشل في جلب إعدادات العضو'];
    }
  }

  /**
   * الحصول على إعدادات الأعضاء بواسطة معرف الخادم
   * Get members settings by server ID
   * 
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Array|null, string|null]>} [result, error]
   */
  static async getByServerId(serverId) {
    try {
      if (!serverId) {
        return [null, 'معرف الخادم مطلوب'];
      }

      const members = await mDBselectAll(Member, { server_id: serverId });

      return [members[0] || null, null];
    } catch (error) {
      console.error('خطأ في جلب إعدادات الأعضاء للخادم:', error);
      return [null, 'فشل في جلب إعدادات الأعضاء للخادم'];
    }
  }

  /**
   * إنشاء إعدادات عضو جديدة
   * Create new member settings
   * 
   * @param {Object} memberData - بيانات إعدادات العضو / Member settings data
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async create(memberData) {
    try {
      if (!memberData || !memberData.server_id) {
        return [null, 'بيانات إعدادات العضو ومعرف الخادم مطلوبان'];
      }

      // التحقق من عدم وجود إعدادات عضو لنفس الخادم
      const existingMember = await mDBselectAll(Member, { server_id: memberData.server_id });
      if (existingMember && existingMember.length > 0) {
        return [null, 'إعدادات العضو موجودة بالفعل لهذا الخادم'];
      }

      mDBinsert(Member, memberData);
      
      return [memberData, null];
    } catch (error) {
      console.error('خطأ في إنشاء إعدادات العضو:', error);
      return [null, 'فشل في إنشاء إعدادات العضو'];
    }
  }

  /**
   * تحديث إعدادات العضو
   * Update member settings
   * 
   * @param {string} id - معرف إعدادات العضو / Member settings ID
   * @param {Object} updateData - البيانات المحدثة / Updated data
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[Object|null, string|null]>} [result, error]
   */
  static async update(id, updateData, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف إعدادات العضو أو معرف الخادم مطلوب'];
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return [null, 'بيانات التحديث مطلوبة'];
      }

      // التحقق من وجود إعدادات العضو
      const filter = id ? { _id: id } : { server_id: serverId };
      const existingMember = await mDBselectAll(Member, filter);
      if (!existingMember || existingMember.length === 0) {
        return [null, 'إعدادات العضو غير موجودة'];
      }

      // إزالة المعرف من بيانات التحديث إذا كان موجوداً
      const { _id: _, server_id: __, ...dataToUpdate } = updateData;

      mDBupdate(Member, filter, dataToUpdate);
      
      return [{ ...existingMember[0], ...dataToUpdate }, null];
    } catch (error) {
      console.error('خطأ في تحديث إعدادات العضو:', error);
      return [null, 'فشل في تحديث إعدادات العضو'];
    }
  }

  /**
   * حذف إعدادات العضو
   * Delete member settings
   * 
   * @param {string} id - معرف إعدادات العضو / Member settings ID
   * @param {string} serverId - معرف الخادم / Server ID
   * @returns {Promise<[boolean|null, string|null]>} [result, error]
   */
  static async delete(id, serverId = null) {
    try {
      if (!id && !serverId) {
        return [null, 'معرف إعدادات العضو أو معرف الخادم مطلوب'];
      }

      const filter = id ? { _id: id } : { server_id: serverId };
      mDBdelete(Member, filter);
      
      return [true, null];
    } catch (error) {
      console.error('خطأ في حذف إعدادات العضو:', error);
      return [null, 'فشل في حذف إعدادات العضو'];
    }
  }
}

export default MembersService;