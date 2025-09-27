import { PGinsert, PGupdate, PGdelete, PGselectAll } from '../config/postgre.manager.js';
import { Coupon } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * خدمة إدارة الكوبونات - Coupon Service
 * تحتوي على الوظائف الأساسية لإدارة كوبونات الخصم
 * 
 * ملاحظات حول استخدام وظائف قاعدة البيانات:
 * - PGselectAll: للاستعلامات البسيطة بشرط واحد (مثل البحث بالكود)
 * - Coupon.findAll: للاستعلامات المعقدة مع multiple conditions أو order/limit
 * - Coupon.count: لعمليات العد والإحصائيات
 */
class CouponService {
  
  /**
   * إنشاء كوبون جديد
   * @param {Object} couponData - بيانات الكوبون
   * @returns {Promise<Object>} الكوبون المُنشأ
   */
  static async createCoupon(couponData) {
    try {
      // التحقق من البيانات المطلوبة
      if (!couponData.code || !couponData.discount_type || !couponData.discount_value || !couponData.site_id) {
        throw new Error('البيانات المطلوبة مفقودة: code, discount_type, discount_value, site_id');
      }

      // التحقق من عدم تكرار كود الكوبون
      const existingCoupon = await this.getCouponByCode(couponData.code);
      if (existingCoupon) {
        throw new Error('كود الكوبون موجود بالفعل');
      }

      // تحويل الكود إلى أحرف كبيرة
      couponData.code = couponData.code.toUpperCase();

      const newCoupon = await PGinsert(Coupon, couponData);
      return newCoupon;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الكوبون: ${error.message}`);
    }
  }

  /**
   * الحصول على جميع الكوبونات
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة الكوبونات
   */
  static async getAllCoupons(options = {}) {
    try {
      const coupons = await Coupon.findAll({
        order: [['created_at', 'DESC']],
        ...options
      });
      return coupons;
    } catch (error) {
      throw new Error(`خطأ في جلب الكوبونات: ${error.message}`);
    }
  }

  /**
   * الحصول على كوبون بواسطة المعرف
   * @param {number} couponId - معرف الكوبون
   * @returns {Promise<Object|null>} الكوبون أو null
   */
  static async getCouponById(couponId) {
    try {
      const coupon = await Coupon.findByPk(couponId);
      return coupon;
    } catch (error) {
      throw new Error(`خطأ في جلب الكوبون: ${error.message}`);
    }
  }

  /**
   * الحصول على كوبون بواسطة الكود
   * @param {string} code - كود الكوبون
   * @returns {Promise<Object|null>} الكوبون أو null
   */
  static async getCouponByCode(code) {
    try {
      // استخدام PGselectAll للاستعلام البسيط بشرط واحد
      const coupons = await PGselectAll(Coupon, {
        code: code.toUpperCase()
      });
      return coupons[0] || null;
    } catch (error) {
      throw new Error(`خطأ في جلب الكوبون بالكود: ${error.message}`);
    }
  }

  /**
   * الحصول على كوبونات الموقع
   * @param {number} siteId - معرف الموقع
   * @param {Object} options - خيارات الاستعلام
   * @returns {Promise<Array>} قائمة كوبونات الموقع
   */
  static async getCouponsBySite(siteId, options = {}) {
    try {
      const coupons = await Coupon.findAll({
        where: { site_id: siteId },
        order: [['created_at', 'DESC']],
        ...options
      });
      return coupons;
    } catch (error) {
      throw new Error(`خطأ في جلب كوبونات الموقع: ${error.message}`);
    }
  }

  /**
   * الحصول على الكوبونات النشطة
   * @param {number} siteId - معرف الموقع (اختياري)
   * @returns {Promise<Array>} قائمة الكوبونات النشطة
   */
  static async getActiveCoupons(siteId = null) {
    try {
      const whereClause = {
        is_active: true,
        valid_from: { [Op.lte]: new Date() },
        valid_until: { [Op.gte]: new Date() }
      };

      if (siteId) {
        whereClause.site_id = siteId;
      }

      const coupons = await Coupon.findAll({
        where: whereClause,
        order: [['created_at', 'DESC']]
      });
      return coupons;
    } catch (error) {
      throw new Error(`خطأ في جلب الكوبونات النشطة: ${error.message}`);
    }
  }

  /**
   * التحقق من صحة الكوبون
   * @param {string} code - كود الكوبون
   * @param {number} orderAmount - مبلغ الطلب
   * @param {number} siteId - معرف الموقع
   * @returns {Promise<Object>} نتيجة التحقق
   */
  static async validateCoupon(code, orderAmount, siteId) {
    try {
      const coupon = await this.getCouponByCode(code);
      
      if (!coupon) {
        return { valid: false, message: 'كود الكوبون غير صحيح' };
      }

      if (coupon.site_id !== siteId) {
        return { valid: false, message: 'الكوبون غير صالح لهذا الموقع' };
      }

      if (!coupon.isValid) {
        return { valid: false, message: 'الكوبون منتهي الصلاحية أو غير نشط' };
      }

      if (orderAmount < coupon.min_order_amount) {
        return { 
          valid: false, 
          message: `الحد الأدنى للطلب ${coupon.min_order_amount} لاستخدام هذا الكوبون` 
        };
      }

      return { valid: true, coupon: coupon };
    } catch (error) {
      throw new Error(`خطأ في التحقق من الكوبون: ${error.message}`);
    }
  }

  /**
   * حساب قيمة الخصم
   * @param {Object} coupon - بيانات الكوبون
   * @param {number} orderAmount - مبلغ الطلب
   * @returns {number} قيمة الخصم
   */
  static calculateDiscount(coupon, orderAmount) {
    try {
      let discountAmount = 0;

      if (coupon.discount_type === 'percentage') {
        discountAmount = (orderAmount * coupon.discount_value) / 100;
      } else if (coupon.discount_type === 'fixed') {
        discountAmount = parseFloat(coupon.discount_value);
      }

      // تطبيق الحد الأقصى للخصم إذا كان محدداً
      if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
        discountAmount = parseFloat(coupon.max_discount_amount);
      }

      // التأكد من أن الخصم لا يتجاوز مبلغ الطلب
      if (discountAmount > orderAmount) {
        discountAmount = orderAmount;
      }

      return Math.round(discountAmount * 100) / 100; // تقريب لأقرب قرشين
    } catch (error) {
      throw new Error(`خطأ في حساب الخصم: ${error.message}`);
    }
  }

  /**
   * استخدام الكوبون (زيادة عداد الاستخدام)
   * @param {number} couponId - معرف الكوبون
   * @returns {Promise<Object>} الكوبون المُحدث
   */
  static async useCoupon(couponId) {
    try {
      const coupon = await this.getCouponById(couponId);
      if (!coupon) {
        throw new Error('الكوبون غير موجود');
      }

      const updatedCoupon = await PGupdate(Coupon, couponId, {
        used_count: coupon.used_count + 1
      });
      return updatedCoupon;
    } catch (error) {
      throw new Error(`خطأ في استخدام الكوبون: ${error.message}`);
    }
  }

  /**
   * تحديث بيانات الكوبون
   * @param {number} couponId - معرف الكوبون
   * @param {Object} updateData - البيانات المُحدثة
   * @returns {Promise<Object>} الكوبون المُحدث
   */
  static async updateCoupon(couponId, updateData) {
    try {
      // التحقق من وجود الكوبون
      const coupon = await this.getCouponById(couponId);
      if (!coupon) {
        throw new Error('الكوبون غير موجود');
      }

      // التحقق من كود الكوبون إذا تم تحديثه
      if (updateData.code && updateData.code !== coupon.code) {
        const existingCoupon = await this.getCouponByCode(updateData.code);
        if (existingCoupon && existingCoupon.id !== couponId) {
          throw new Error('كود الكوبون مستخدم بالفعل');
        }
        updateData.code = updateData.code.toUpperCase();
      }

      const updatedCoupon = await PGupdate(Coupon, updateData, { id: couponId });
      return updatedCoupon;
    } catch (error) {
      throw new Error(`خطأ في تحديث الكوبون: ${error.message}`);
    }
  }

  /**
   * تفعيل أو إلغاء تفعيل الكوبون
   * @param {number} couponId - معرف الكوبون
   * @param {boolean} isActive - حالة التفعيل
   * @returns {Promise<Object>} الكوبون المُحدث
   */
  static async toggleCouponStatus(couponId, isActive = true) {
    try {
      const updatedCoupon = await this.updateCoupon(couponId, { is_active: isActive });
      return updatedCoupon;
    } catch (error) {
      throw new Error(`خطأ في تغيير حالة الكوبون: ${error.message}`);
    }
  }

  /**
   * حذف الكوبون
   * @param {number} couponId - معرف الكوبون
   * @returns {Promise<boolean>} نتيجة الحذف
   */
  static async deleteCoupon(couponId) {
    try {
      const result = await PGdelete(Coupon, { id: couponId });
      return result;
    } catch (error) {
      throw new Error(`خطأ في حذف الكوبون: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصائيات الكوبونات
   * @param {number} siteId - معرف الموقع (اختياري)
   * @returns {Promise<Object>} إحصائيات الكوبونات
   */
  static async getCouponStats(siteId = null) {
    try {
      const whereClause = siteId ? { site_id: siteId } : {};
      
      const totalCoupons = await Coupon.count({ where: whereClause });
      const activeCoupons = await Coupon.count({ 
        where: { ...whereClause, is_active: true } 
      });
      const expiredCoupons = await Coupon.count({ 
        where: { 
          ...whereClause, 
          valid_until: { [Op.lt]: new Date() } 
        } 
      });

      return {
        total: totalCoupons,
        active: activeCoupons,
        expired: expiredCoupons,
        inactive: totalCoupons - activeCoupons
      };
    } catch (error) {
      throw new Error(`خطأ في جلب إحصائيات الكوبونات: ${error.message}`);
    }
  }
}

export default CouponService;