import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { User } from '../models/index.js';
import { Op } from 'sequelize';

class UserService {
  /**
   * إنشاء مستخدم جديد
   * @param {Object} userData - بيانات المستخدم
   * @returns {Promise<Object>} - المستخدم المنشأ
   */
  static async createUser(userData) {
    try {
      const result = await PGinsert(User, userData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المستخدم: ${error.message}`);
    }
  }

  /**
   * إنشاء مستخدم جديد مع التحقق من البيانات
   * @param {string} name - اسم المستخدم
   * @param {string} email - البريد الإلكتروني
   * @param {string} password_hash - كلمة المرور المشفرة
   * @param {string} full_name - الاسم الكامل
   * @param {string} birthDate - تاريخ الميلاد (اختياري) بصيغة YYYY-MM-DD
   * @param {string} phone - رقم الهاتف (اختياري)
   * @param {string} avatar_url - رابط الصورة الشخصية (اختياري)
   * @returns {Promise<Object>} - المستخدم المنشأ
   */
  static async createUserWithValidation(name, email, password_hash, full_name, birthDate = null, phone = null, avatar_url = null) {
    try {
      // التحقق من وجود البريد الإلكتروني مسبقاً
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }

      // التحقق من وجود رقم الهاتف إذا تم تمريره
      if (phone) {
        const existingPhoneUser = await this.getUserByPhone(phone);
        if (existingPhoneUser) {
          throw new Error('رقم الهاتف مستخدم بالفعل');
        }
      }

      const userData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: password_hash,
        full_name: full_name.trim(),
        birthDate: birthDate,
        phone: phone ? phone.trim() : null,
        avatar_url: avatar_url,
        is_email_verified: false,
        is_phone_verified: false
      };
      
      const result = await PGinsert(User, userData);
      return result;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع المستخدمين
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} - قائمة المستخدمين
   */
  static async getAllUsers(options = {}) {
    try {
      const defaultOptions = {
        order: [['created_at', 'DESC']],
        ...options
      };
      
      const result = await User.findAll(defaultOptions);
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المستخدمين: ${error.message}`);
    }
  }

  /**
   * الحصول على مستخدم بواسطة المعرف
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<Object|null>} - المستخدم أو null
   */
  static async getUserById(userId) {
    try {
      const result = await PGselectAll(User, {id: userId});
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على مستخدم بواسطة البريد الإلكتروني
   * @param {string} email - البريد الإلكتروني
   * @returns {Promise<Object|null>} - المستخدم أو null
   */
  static async getUserByEmail(email) {
    try {
      const result = await PGselectAll(User, {email: email.toLowerCase().trim()});
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المستخدم بواسطة البريد الإلكتروني: ${error.message}`);
    }
  }

  /**
   * البحث عن المستخدمين بواسطة الاسم
   * @param {string} name - اسم المستخدم للبحث
   * @returns {Promise<Array>} - قائمة المستخدمين
   */
  static async getUsersByName(name) {
    try {
      const result = await PGselectAll(User, {name: `%${name}%`, Op: Op.like});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث عن المستخدمين بواسطة الاسم: ${error.message}`);
    }
  }

  /**
   * الحصول على مستخدم بواسطة رقم الهاتف
   * @param {string} phone - رقم الهاتف
   * @returns {Promise<Object|null>} - المستخدم أو null
   */
  static async getUserByPhone(phone) {
    try {
      const result = await PGselectAll(User, {phone: phone.trim()});
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المستخدم بواسطة رقم الهاتف: ${error.message}`);
    }
  }

  /**
   * البحث عن المستخدمين بواسطة الاسم الكامل
   * @param {string} fullName - الاسم الكامل للبحث
   * @returns {Promise<Array>} - قائمة المستخدمين
   */
  static async getUsersByFullName(fullName) {
    try {
      const result = await PGselectAll(User, {full_name: `%${fullName}%`, Op: Op.like});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في البحث عن المستخدمين بواسطة الاسم الكامل: ${error.message}`);
    }
  }

  /**
   * تحديث حالة التحقق من البريد الإلكتروني
   * @param {string} userId - معرف المستخدم
   * @param {boolean} isVerified - حالة التحقق
   * @returns {Promise<Object>} - المستخدم المحدث
   */
  static async updateEmailVerificationStatus(userId, isVerified = true) {
    try {
      const result = await PGupdate(User, {is_email_verified: isVerified}, {id: userId});
      
      if (result.length === 0) {
        throw new Error('المستخدم غير موجود');
      }
      
      return result[0];
    } catch (error) {
      throw new Error(`خطأ في تحديث حالة التحقق من البريد الإلكتروني: ${error.message}`);
    }
  }

  /**
   * تحديث حالة التحقق من رقم الهاتف
   * @param {string} userId - معرف المستخدم
   * @param {boolean} isVerified - حالة التحقق
   * @returns {Promise<Object>} - المستخدم المحدث
   */
  static async updatePhoneVerificationStatus(userId, isVerified = true) {
    try {
      const result = await PGupdate(User, {is_phone_verified: isVerified}, {id: userId});
      
      if (result.length === 0) {
        throw new Error('المستخدم غير موجود');
      }
      
      return result[0];
    } catch (error) {
      throw new Error(`خطأ في تحديث حالة التحقق من رقم الهاتف: ${error.message}`);
    }
  }

  /**
   * الحصول على المستخدمين المحققين من البريد الإلكتروني
   * @returns {Promise<Array>} - قائمة المستخدمين المحققين
   */
  static async getVerifiedEmailUsers() {
    try {
      const result = await PGselectAll(User, {is_email_verified: true});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المستخدمين المحققين من البريد الإلكتروني: ${error.message}`);
    }
  }

  /**
   * الحصول على المستخدمين المحققين من رقم الهاتف
   * @returns {Promise<Array>} - قائمة المستخدمين المحققين
   */
  static async getVerifiedPhoneUsers() {
    try {
      const result = await PGselectAll(User, {is_phone_verified: true});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المستخدمين المحققين من رقم الهاتف: ${error.message}`);
    }
  }
  /*
   * @param {Date} startDate - تاريخ البداية
   * @param {Date} endDate - تاريخ النهاية
   * @returns {Promise<Array>} - قائمة المستخدمين
   */
  static async getUsersByDateRange(startDate, endDate) {
    try {
      const result = await PGselectAll(User, {created_at: [startDate, endDate], Op: Op.between});
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المستخدمين بواسطة النطاق الزمني: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات المستخدم
   * @param {string} userId - معرف المستخدم
   * @param {Object} updateData - البيانات المحدثة (name, email, full_name, phone, avatar_url, is_email_verified, is_phone_verified)
   * @returns {Promise<Object>} - المستخدم المحدث
   */
  static async updateUser(userId, updateData) {
    try {
      // التحقق من وجود المستخدم
      const existingUser = await this.getUserById(userId);
      if (!existingUser) {
        throw new Error('المستخدم غير موجود');
      }

      // التحقق من البريد الإلكتروني إذا كان يتم تحديثه
      if (updateData.email) {
        const emailUser = await this.getUserByEmail(updateData.email);
        if (emailUser && emailUser.id !== userId) {
          throw new Error('البريد الإلكتروني مستخدم بالفعل من قبل مستخدم آخر');
        }
        updateData.email = updateData.email.toLowerCase().trim();
      }

      // التحقق من رقم الهاتف إذا كان يتم تحديثه
      if (updateData.phone) {
        const phoneUser = await this.getUserByPhone(updateData.phone);
        if (phoneUser && phoneUser.id !== userId) {
          throw new Error('رقم الهاتف مستخدم بالفعل من قبل مستخدم آخر');
        }
        updateData.phone = updateData.phone.trim();
      }

      // تنظيف البيانات النصية
      if (updateData.name) {
        updateData.name = updateData.name.trim();
      }

      if (updateData.full_name) {
        updateData.full_name = updateData.full_name.trim();
      }

      if (updateData.avatar_url) {
        updateData.avatar_url = updateData.avatar_url.trim();
      }

      const result = await PGupdate(User, updateData, {
        where: { id: userId }
      });
      return result;
    } catch (error) {
      throw new Error(`خطأ في تحديث المستخدم: ${error.message}`);
    }
  }

  /**
   * حذف مستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<boolean>} - نتيجة الحذف
   */
  static async deleteUser(userId) {
    try {
      const result = await PGdelete(User, { id: userId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف المستخدم: ${error.message}`);
    }
  }

  /**
   * عدد المستخدمين
   * @param {Object} whereClause - شروط العد (اختياري)
   * @returns {Promise<number>} - عدد المستخدمين
   */
  static async countUsers(whereClause = {}) {
    try {
      const count = await User.count({
        where: whereClause
      });
      return count;
    } catch (error) {
      throw new Error(`خطأ في عد المستخدمين: ${error.message}`);
    }
  }

  /**
   * حساب العمر من تاريخ الميلاد
   * @param {string} birthDate - تاريخ الميلاد بصيغة YYYY-MM-DD
   * @returns {number} - العمر بالسنوات
   */
  static calculateAge(birthDate) {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * الحصول على المستخدمين بواسطة نطاق عمري
   * @param {number} minAge - الحد الأدنى للعمر
   * @param {number} maxAge - الحد الأقصى للعمر
   * @returns {Promise<Array>} - قائمة المستخدمين
   */
  static async getUsersByAgeRange(minAge, maxAge) {
    try {
      const today = new Date();
      const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
      const minBirthDate = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate());
      
      const result = await PGselectAll(User, {
        birthDate: [minBirthDate.toISOString().split('T')[0], maxBirthDate.toISOString().split('T')[0]], 
        Op: Op.between
      });
      
      return result;
    } catch (error) {
      throw new Error(`خطأ في الحصول على المستخدمين بواسطة النطاق العمري: ${error.message}`);
    }
  }
}

export default UserService;