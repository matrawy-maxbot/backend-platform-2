import WishlistService from '../../../../database/mongoDB/services/Wishlist.service.js';
import send from '../../../../../utils/responseHandler.util.js';
import { resolveDatabaseResult } from '../../../../../utils/object.util.js';

/**
 * تحكم قائمة الأمنيات
 * @module WishlistController
 */

/**
 * الحصول على جميع عناصر قائمة الأمنيات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getAllWishlists = async (req, res, next) => {
  try {
    let wishlists = await WishlistService.getAllWishlists();
    wishlists = resolveDatabaseResult(wishlists);
    
    send(res, {
      success: true,
      data: wishlists
    }, 'تم جلب جميع عناصر قائمة الأمنيات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * الحصول على عنصر قائمة الأمنيات بالمعرف
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const getWishlistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let wishlist = await WishlistService.getWishlistById(id);
    wishlist = resolveDatabaseResult(wishlist);
    
    let status = 200;
    if (wishlist.length < 1) status = 404;

    send(res, {
      success: true,
      data: wishlist
    }, 'تم جلب عنصر قائمة الأمنيات بنجاح', status);

  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * إنشاء عنصر قائمة أمنيات جديد
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const createWishlist = async (req, res, next) => {
  try {
    const wishlistData = req.body;

    let newWishlist = await WishlistService.createWishlist(wishlistData);
    newWishlist = resolveDatabaseResult(newWishlist);
    
    send(res, {
      success: true,
      data: newWishlist
    }, 'تم إنشاء عنصر قائمة الأمنيات بنجاح', 201);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * تحديث عنصر قائمة الأمنيات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const updateWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
  
    let updatedWishlist = await WishlistService.updateWishlist(id, updateData);
    updatedWishlist = resolveDatabaseResult(updatedWishlist);
    
    send(res, {
      success: true,
      data: updatedWishlist
    }, 'تم تحديث عنصر قائمة الأمنيات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

/**
 * حذف عنصر قائمة الأمنيات
 * @param {Object} req - طلب Express
 * @param {Object} res - استجابة Express
 * @param {Function} next - دالة الانتقال للـ middleware التالي
 */
export const deleteWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    let result = await WishlistService.deleteWishlist(id);
    result = resolveDatabaseResult(result);

    send(res, {
      success: true,
      data: result
    }, 'تم حذف عنصر قائمة الأمنيات بنجاح', 200);
  } catch (error) {
    res.status(500);
    next(error);
  }
};