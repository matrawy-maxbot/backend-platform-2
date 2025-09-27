import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Address } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة العناوين - Address Service
 * تحتوي على الوظائف الأساسية لإدارة عناوين المستخدمين
 */
class AddressService {
  
  /**
   * إنشاء عنوان جديد
   * @param {Object} addressData - بيانات العنوان
   * @returns {Promise<Object>} العنوان المُنشأ
   */
  static async createAddress(addressData) {
    try {
      // التحقق من البيانات المطلوبة
      if (!addressData.user_id || !addressData.street || !addressData.city || !addressData.country) {
        throw new Error('البيانات المطلوبة مفقودة: user_id, street, city, country');
      }

      // تعيين القيم الافتراضية
      const defaultData = {
        is_default: false,
        is_active: true,
        created_at: new Date(),
        ...addressData
      };

      // إذا كان هذا العنوان الافتراضي، قم بإلغاء تفعيل العناوين الافتراضية الأخرى
      if (defaultData.is_default) {
        await this.unsetDefaultAddresses(defaultData.user_id);
      }

      const newAddress = await PGinsert(Address, defaultData);
      return newAddress;
    } catch (error) {
      throw new Error(`خطأ في إنشاء العنوان: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع العناوين
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة العناوين
   */
  static async getAllAddresses(options = {}) {
    try {
      const addresses = await Address.findAll({
        order: [['is_default', 'DESC'], ['created_at', 'DESC']],
        ...options
      });
      return addresses;
    } catch (error) {
      throw new Error(`خطأ في جلب العناوين: ${error.message}`);
    }
  }

  /**
   * الحصول على عنوان بواسطة المعرف
   * @param {number} addressId - معرف العنوان
   * @returns {Promise<Object|null>} العنوان أو null
   */
  static async getAddressById(addressId) {
    try {
      const addresses = await PGselectAll(Address, { id: addressId });
      return addresses.length > 0 ? addresses[0] : null;
    } catch (error) {
      throw new Error(`خطأ في جلب العنوان: ${error.message}`);
    }
  }

  /**
   * الحصول على عناوين المستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة عناوين المستخدم
   */
  static async getUserAddresses(userId, options = {}) {
    try {
      const addresses = await Address.findAll({
        where: { 
          user_id: userId,
          is_active: true
        },
        order: [['is_default', 'DESC'], ['created_at', 'DESC']],
        ...options
      });
      return addresses;
    } catch (error) {
      throw new Error(`خطأ في جلب عناوين المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على العنوان الافتراضي للمستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Object|null>} العنوان الافتراضي أو null
   */
  static async getDefaultAddress(userId) {
    try {
      const address = await Address.findOne({
        where: { 
          user_id: userId,
          is_default: true,
          is_active: true
        }
      });
      return address;
    } catch (error) {
      throw new Error(`خطأ في جلب العنوان الافتراضي: ${error.message}`);
    }
  }

  /**
   * الحصول على العناوين حسب المدينة
   * @param {string} city - اسم المدينة
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة العناوين
   */
  static async getAddressesByCity(city, options = {}) {
    try {
      const addresses = await Address.findAll({
        where: { 
          city: city,
          is_active: true
        },
        order: [['created_at', 'DESC']],
        ...options
      });
      return addresses;
    } catch (error) {
      throw new Error(`خطأ في جلب العناوين بالمدينة: ${error.message}`);
    }
  }

  /**
   * الحصول على العناوين حسب الدولة
   * @param {string} country - اسم الدولة
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة العناوين
   */
  static async getAddressesByCountry(country, options = {}) {
    try {
      const addresses = await Address.findAll({
        where: { 
          country: country,
          is_active: true
        },
        order: [['created_at', 'DESC']],
        ...options
      });
      return addresses;
    } catch (error) {
      throw new Error(`خطأ في جلب العناوين بالدولة: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات العنوان
   * @param {number} addressId - معرف العنوان
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} العنوان المُحدث
   */
  static async updateAddress(addressId, updateData) {
    try {
      const address = await this.getAddressById(addressId);
      if (!address) {
        throw new Error('العنوان غير موجود');
      }

      // إذا تم تعيين العنوان كافتراضي، قم بإلغاء تفعيل العناوين الافتراضية الأخرى
      if (updateData.is_default === true) {
        await this.unsetDefaultAddresses(address.user_id, addressId);
      }

      updateData.updated_at = new Date();
      const updatedAddress = await PGupdate(Address, updateData, { id: addressId });
      return updatedAddress;
    } catch (error) {
      throw new Error(`خطأ في تحديث العنوان: ${error.message}`);
    }
  }

  /**
   * تعيين العنوان كافتراضي
   * @param {number} addressId - معرف العنوان
   * @returns {Promise<Object>} العنوان المُحدث
   */
  static async setDefaultAddress(addressId) {
    try {
      const address = await this.getAddressById(addressId);
      if (!address) {
        throw new Error('العنوان غير موجود');
      }

      // إلغاء تفعيل العناوين الافتراضية الأخرى للمستخدم
      await this.unsetDefaultAddresses(address.user_id, addressId);

      // تعيين العنوان الحالي كافتراضي
      const updatedAddress = await this.updateAddress(addressId, { is_default: true });
      return updatedAddress;
    } catch (error) {
      throw new Error(`خطأ في تعيين العنوان الافتراضي: ${error.message}`);
    }
  }

  /**
   * إلغاء تفعيل العناوين الافتراضية للمستخدم
   * @param {number} userId - معرف المستخدم
   * @param {number} excludeAddressId - معرف العنوان المستثنى (اختياري)
   * @returns {Promise<void>}
   */
  static async unsetDefaultAddresses(userId, excludeAddressId = null) {
    try {
      const whereClause = {
        user_id: userId,
        is_default: true
      };

      if (excludeAddressId) {
        whereClause.id = { [Op.ne]: excludeAddressId };
      }

      await Address.update(
        { is_default: false, updated_at: new Date() },
        { where: whereClause }
      );
    } catch (error) {
      throw new Error(`خطأ في إلغاء تفعيل العناوين الافتراضية: ${error.message}`);
    }
  }

  /**
   * تفعيل أو إلغاء تفعيل العنوان
   * @param {number} addressId - معرف العنوان
   * @param {boolean} isActive - حالة التفعيل
   * @returns {Promise<Object>} العنوان المُحدث
   */
  static async toggleAddressStatus(addressId, isActive = true) {
    try {
      const address = await this.getAddressById(addressId);
      if (!address) {
        throw new Error('العنوان غير موجود');
      }

      // إذا تم إلغاء تفعيل العنوان الافتراضي، قم بتعيين عنوان آخر كافتراضي
      if (!isActive && address.is_default) {
        const userAddresses = await this.getUserAddresses(address.user_id);
        const otherAddresses = userAddresses.filter(addr => addr.id !== addressId);
        
        if (otherAddresses.length > 0) {
          await this.setDefaultAddress(otherAddresses[0].id);
        }
      }

      const updatedAddress = await this.updateAddress(addressId, { is_active: isActive });
      return updatedAddress;
    } catch (error) {
      throw new Error(`خطأ في تغيير حالة العنوان: ${error.message}`);
    }
  }

  /**
   * حذف العنوان (حذف ناعم)
   * @param {number} addressId - معرف العنوان
   * @returns {Promise<Object>} العنوان المُحدث
   */
  static async softDeleteAddress(addressId) {
    try {
      const updatedAddress = await this.toggleAddressStatus(addressId, false);
      return updatedAddress;
    } catch (error) {
      throw new Error(`خطأ في حذف العنوان: ${error.message}`);
    }
  }

  /**
   * حذف العنوان نهائياً
   * @param {number} addressId - معرف العنوان
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteAddress(addressId) {
    try {
      const address = await this.getAddressById(addressId);
      if (!address) {
        throw new Error('العنوان غير موجود');
      }

      // إذا كان العنوان افتراضياً، قم بتعيين عنوان آخر كافتراضي
      if (address.is_default) {
        const userAddresses = await this.getUserAddresses(address.user_id);
        const otherAddresses = userAddresses.filter(addr => addr.id !== addressId);
        
        if (otherAddresses.length > 0) {
          await this.setDefaultAddress(otherAddresses[0].id);
        }
      }

      const result = await PGdelete(Address, { id: addressId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف العنوان نهائياً: ${error.message}`);
    }
  }

  /**
   * البحث في العناوين
   * @param {Object} searchCriteria - معايير البحث
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} نتائج البحث
   */
  static async searchAddresses(searchCriteria, options = {}) {
    try {
      const whereClause = { is_active: true };

      // البحث بالشارع
      if (searchCriteria.street) {
        whereClause.street = {
          [Op.iLike]: `%${searchCriteria.street}%`
        };
      }

      // البحث بالمدينة
      if (searchCriteria.city) {
        whereClause.city = {
          [Op.iLike]: `%${searchCriteria.city}%`
        };
      }

      // البحث بالدولة
      if (searchCriteria.country) {
        whereClause.country = {
          [Op.iLike]: `%${searchCriteria.country}%`
        };
      }

      // البحث بالرمز البريدي
      if (searchCriteria.postal_code) {
        whereClause.postal_code = {
          [Op.iLike]: `%${searchCriteria.postal_code}%`
        };
      }

      // البحث بمعرف المستخدم
      if (searchCriteria.user_id) {
        whereClause.user_id = searchCriteria.user_id;
      }

      const addresses = await Address.findAll({
        where: whereClause,
        order: [['is_default', 'DESC'], ['created_at', 'DESC']],
        ...options
      });

      return addresses;
    } catch (error) {
      throw new Error(`خطأ في البحث في العناوين: ${error.message}`);
    }
  }

  /**
   * التحقق من صحة العنوان
   * @param {Object} addressData - بيانات العنوان
   * @returns {Object} نتيجة التحقق
   */
  static validateAddress(addressData) {
    try {
      const errors = [];

      // التحقق من الحقول المطلوبة
      if (!addressData.street || addressData.street.trim().length < 5) {
        errors.push('الشارع مطلوب ويجب أن يكون 5 أحرف على الأقل');
      }

      if (!addressData.city || addressData.city.trim().length < 2) {
        errors.push('المدينة مطلوبة ويجب أن تكون حرفين على الأقل');
      }

      if (!addressData.country || addressData.country.trim().length < 2) {
        errors.push('الدولة مطلوبة ويجب أن تكون حرفين على الأقل');
      }

      // التحقق من الرمز البريدي إذا كان موجوداً
      if (addressData.postal_code && !/^\d{5}(-\d{4})?$/.test(addressData.postal_code)) {
        errors.push('الرمز البريدي غير صحيح');
      }

      // التحقق من رقم الهاتف إذا كان موجوداً
      if (addressData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(addressData.phone)) {
        errors.push('رقم الهاتف غير صحيح');
      }

      return {
        valid: errors.length === 0,
        errors: errors
      };
    } catch (error) {
      throw new Error(`خطأ في التحقق من العنوان: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات العناوين
   * @param {number} userId - معرف المستخدم (اختياري)
   * @returns {Promise<Object>} إحصائيات العناوين
   */
  static async getAddressStats(userId = null) {
    try {
      const whereClause = userId ? { user_id: userId } : {};
      
      const totalAddresses = await Address.count({ where: whereClause });
      const activeAddresses = await Address.count({ 
        where: { ...whereClause, is_active: true } 
      });
      const defaultAddresses = await Address.count({ 
        where: { ...whereClause, is_default: true, is_active: true } 
      });

      return {
        total: totalAddresses,
        active: activeAddresses,
        inactive: totalAddresses - activeAddresses,
        default: defaultAddresses
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات العناوين: ${error.message}`);
    }
  }

  /**
   * تنسيق العنوان للعرض
   * @param {Object} address - بيانات العنوان
   * @returns {string} العنوان المنسق
   */
  static formatAddress(address) {
    try {
      const parts = [];
      
      if (address.street) parts.push(address.street);
      if (address.district) parts.push(address.district);
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.country) parts.push(address.country);
      if (address.postal_code) parts.push(address.postal_code);

      return parts.join(', ');
    } catch (error) {
      throw new Error(`خطأ في تنسيق العنوان: ${error.message}`);
    }
  }
}

export default AddressService;