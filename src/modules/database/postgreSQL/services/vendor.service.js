import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Vendor, User } from '../models/index.js';
import { Op } from 'sequelize';

class VendorService {
  /**
   * إنشاء متجر جديد
   * @param {Object} vendorData - بيانات المتجر
   * @returns {Promise<Object>} - المتجر المنشأ
   */
  static async createVendor(vendorData) {
    try {
      const result = await PGinsert(Vendor, vendorData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المتجر: ${error.message}`);
    }
  }

  /**
   * إنشاء متجر جديد مع التحقق من البيانات
   * @param {string} userId - معرف المستخدم
   * @param {string} businessName - اسم النشاط التجاري
   * @param {string} businessEmail - البريد الإلكتروني للنشاط
   * @param {string} businessPhone - رقم هاتف النشاط
   * @param {string} businessLogoUrl - رابط شعار النشاط (اختياري)
   * @param {string} businessDescription - وصف النشاط (اختياري)
   * @returns {Promise<Object>} - المتجر المنشأ
   */
  static async createVendorWithValidation(userId, businessName, businessEmail, businessPhone, businessLogoUrl = null, businessDescription = null) {
    try {
      // التحقق من وجود المستخدم
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      // التحقق من وجود البريد الإلكتروني للنشاط مسبقاً
      const existingVendor = await this.getVendorByBusinessEmail(businessEmail);
      if (existingVendor) {
        throw new Error('البريد الإلكتروني للنشاط مستخدم بالفعل');
      }

      // التحقق من وجود متجر للمستخدم مسبقاً
      const userVendor = await this.getVendorByUserId(userId);
      if (userVendor) {
        throw new Error('المستخدم لديه متجر بالفعل');
      }

      const vendorData = {
        user_id: userId,
        business_name: businessName.trim(),
        business_email: businessEmail.toLowerCase().trim(),
        business_phone: businessPhone.trim(),
        business_logo_url: businessLogoUrl,
        business_description: businessDescription ? businessDescription.trim() : null,
        status: 'pending',
        verification_status: 'unverified'
      };
      
      const result = await PGinsert(Vendor, vendorData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المتجر: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع المتاجر
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة المتاجر
   */
  static async getAllVendors(options = {}) {
    try {
      const defaultOptions = {
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email']
          },
          {
            model: User,
            as: 'ApprovedBy',
            attributes: ['id', 'full_name', 'email'],
            required: false
          }
        ],
        ...options
      };
      
      const result = await Vendor.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتاجر: ${error.message}`);
    }
  }

  /**
   * الحصول على متجر بواسطة المعرف
   * @param {number} vendorId - معرف المتجر
   * @returns {Promise<Object|null>} - المتجر أو null
   */
  static async getVendorById(vendorId) {
    try {
      const result = await Vendor.findByPk(vendorId, {
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email']
          },
          {
            model: User,
            as: 'ApprovedBy',
            attributes: ['id', 'full_name', 'email'],
            required: false
          }
        ]
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتجر: ${error.message}`);
    }
  }

  /**
   * الحصول على متجر بواسطة معرف المستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Object|null>} - المتجر أو null
   */
  static async getVendorByUserId(userId) {
    try {
      const result = await PGselectAll(Vendor, { user_id: userId });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتجر: ${error.message}`);
    }
  }

  /**
   * الحصول على متجر بواسطة البريد الإلكتروني للنشاط
   * @param {string} businessEmail - البريد الإلكتروني للنشاط
   * @returns {Promise<Object|null>} - المتجر أو null
   */
  static async getVendorByBusinessEmail(businessEmail) {
    try {
      const result = await PGselectAll(Vendor, { business_email: businessEmail.toLowerCase() });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتجر: ${error.message}`);
    }
  }

  /**
   * الحصول على المتاجر بواسطة الحالة
   * @param {string} status - حالة المتجر (pending, active, suspended, rejected)
   * @returns {Promise<Array>} - قائمة المتاجر
   */
  static async getVendorsByStatus(status) {
    try {
      const result = await PGselectAll(Vendor, { status: status });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتاجر: ${error.message}`);
    }
  }

  /**
   * الحصول على المتاجر بواسطة حالة التحقق
   * @param {string} verificationStatus - حالة التحقق (unverified, verified, rejected)
   * @returns {Promise<Array>} - قائمة المتاجر
   */
  static async getVendorsByVerificationStatus(verificationStatus) {
    try {
      const result = await PGselectAll(Vendor, { verification_status: verificationStatus });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتاجر: ${error.message}`);
    }
  }

  /**
   * البحث في المتاجر بواسطة اسم النشاط
   * @param {string} businessName - اسم النشاط
   * @returns {Promise<Array>} - قائمة المتاجر
   */
  static async searchVendorsByBusinessName(businessName) {
    try {
      const result = await Vendor.findAll({
        where: {
          business_name: {
            [Op.iLike]: `%${businessName}%`
          }
        },
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email']
          }
        ]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث عن المتاجر: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات المتجر
   * @param {number} vendorId - معرف المتجر
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Promise<Object>} - المتجر المحدث
   */
  static async updateVendor(vendorId, updateData) {
    try {
      // التحقق من وجود المتجر
      const vendor = await this.getVendorById(vendorId);
      if (!vendor) {
        throw new Error('المتجر غير موجود');
      }

      // التحقق من البريد الإلكتروني إذا تم تحديثه
      if (updateData.business_email && updateData.business_email !== vendor.business_email) {
        const existingVendor = await this.getVendorByBusinessEmail(updateData.business_email);
        if (existingVendor && existingVendor.id !== vendorId) {
          throw new Error('البريد الإلكتروني للنشاط مستخدم بالفعل');
        }
      }

      const result = await PGupdate(Vendor, { id: vendorId }, updateData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المتجر: ${error.message}`);
    }
  }

  /**
   * الموافقة على المتجر
   * @param {number} vendorId - معرف المتجر
   * @param {string} approvedBy - معرف المستخدم الموافق
   * @returns {Promise<Object>} - المتجر المحدث
   */
  static async approveVendor(vendorId, approvedBy) {
    try {
      const updateData = {
        status: 'active',
        verification_status: 'verified',
        approved_by: approvedBy,
        approved_at: new Date()
      };

      const result = await this.updateVendor(vendorId, updateData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الموافقة على المتجر: ${error.message}`);
    }
  }

  /**
   * رفض المتجر
   * @param {number} vendorId - معرف المتجر
   * @param {string} rejectedBy - معرف المستخدم الرافض
   * @returns {Promise<Object>} - المتجر المحدث
   */
  static async rejectVendor(vendorId, rejectedBy) {
    try {
      const updateData = {
        status: 'rejected',
        verification_status: 'rejected',
        approved_by: rejectedBy,
        approved_at: new Date()
      };

      const result = await this.updateVendor(vendorId, updateData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في رفض المتجر: ${error.message}`);
    }
  }

  /**
   * تعليق المتجر
   * @param {number} vendorId - معرف المتجر
   * @returns {Promise<Object>} - المتجر المحدث
   */
  static async suspendVendor(vendorId) {
    try {
      const updateData = {
        status: 'suspended'
      };

      const result = await this.updateVendor(vendorId, updateData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في تعليق المتجر: ${error.message}`);
    }
  }

  /**
   * إعادة تفعيل المتجر
   * @param {number} vendorId - معرف المتجر
   * @returns {Promise<Object>} - المتجر المحدث
   */
  static async reactivateVendor(vendorId) {
    try {
      const updateData = {
        status: 'active'
      };

      const result = await this.updateVendor(vendorId, updateData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إعادة تفعيل المتجر: ${error.message}`);
    }
  }

  /**
   * حذف المتجر
   * @param {number} vendorId - معرف المتجر
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteVendor(vendorId) {
    try {
      // التحقق من وجود المتجر
      const vendor = await this.getVendorById(vendorId);
      if (!vendor) {
        throw new Error('المتجر غير موجود');
      }

      const result = await PGdelete(Vendor, { id: vendorId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المتجر: ${error.message}`);
    }
  }

  /**
   * عد المتاجر
   * @param {Object} whereClause - شروط العد
   * @returns {Promise<number>} - عدد المتاجر
   */
  static async countVendors(whereClause = {}) {
    try {
      const count = await Vendor.count({
        where: whereClause
      });
      return count;
    } catch (error) {
      throw new Error(`خطأ في عد المتاجر: ${error.message}`);
    }
  }

  /**
   * الحصول على المتاجر المعلقة (تحتاج موافقة)
   * @returns {Promise<Array>} - قائمة المتاجر المعلقة
   */
  static async getPendingVendors() {
    try {
      const result = await this.getVendorsByStatus('pending');
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتاجر المعلقة: ${error.message}`);
    }
  }

  /**
   * الحصول على المتاجر النشطة
   * @returns {Promise<Array>} - قائمة المتاجر النشطة
   */
  static async getActiveVendors() {
    try {
      const result = await this.getVendorsByStatus('active');
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتاجر النشطة: ${error.message}`);
    }
  }

  /**
   * الحصول على المتاجر المعلقة
   * @returns {Promise<Array>} - قائمة المتاجر المعلقة
   */
  static async getSuspendedVendors() {
    try {
      const result = await this.getVendorsByStatus('suspended');
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتاجر المعلقة: ${error.message}`);
    }
  }

  /**
   * الحصول على المتاجر المرفوضة
   * @returns {Promise<Array>} - قائمة المتاجر المرفوضة
   */
  static async getRejectedVendors() {
    try {
      const result = await this.getVendorsByStatus('rejected');
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتاجر المرفوضة: ${error.message}`);
    }
  }

  /**
   * الحصول على المتاجر بواسطة نطاق تاريخي
   * @param {string} startDate - تاريخ البداية
   * @param {string} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة المتاجر
   */
  static async getVendorsByDateRange(startDate, endDate) {
    try {
      const result = await Vendor.findAll({
        where: {
          created_at: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'email']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المتاجر بالنطاق التاريخي: ${error.message}`);
    }
  }
}

export default VendorService;