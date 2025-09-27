import { CouponService } from '../../../../database/postgreSQL/index.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم الكوبونات
 * @module CouponsController
 */

/**
 * الحصول على جميع الكوبونات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllCoupons = async (req, res, next) => {
  try {
    let coupons = await CouponService.getAllCoupons();
    coupons = resolveDatabaseResult(coupons);
    
    send(res, {
      success: true,
      data: coupons
    }, 'تم جلب جميع الكوبونات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على كوبون بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getCouponById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let coupon = await CouponService.getCouponById(id);
    coupon = resolveDatabaseResult(coupon);
    
    let status = 200;
    if (coupon.length < 1) status = 404;

    send(res, {
      success: true,
      data: coupon
    }, 'تم جلب الكوبون بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء كوبون جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createCoupon = async (req, res, next) => {
  try {
    const couponData = req.body;

    let newCoupon = await CouponService.createCoupon(couponData);
    newCoupon = resolveDatabaseResult(newCoupon);
    
    send(res, {
      success: true,
      data: newCoupon
    }, 'تم إنشاء الكوبون بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث الكوبون
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedCoupon = await CouponService.updateCoupon(id, updateData);
    updatedCoupon = resolveDatabaseResult(updatedCoupon);
    
    send(res, {
      success: true,
      data: updatedCoupon
    }, 'تم تحديث الكوبون بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف الكوبون
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await CouponService.deleteCoupon(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف الكوبون بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};