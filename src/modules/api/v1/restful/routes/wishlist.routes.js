import express from 'express';
import * as wishlistController from '../controllers/wishlist.controller.js';
import {
  getWishlistByIdSchema,
  createWishlistSchema,
  updateWishlistSchema
} from '../validators/wishlist.validator.js';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مسارات قائمة الأمنيات
 * @module WishlistRoutes
 */

const router = express.Router();

/**
 * @route GET /wishlist
 * @desc الحصول على جميع عناصر قائمة الأمنيات
 * @access Public
 */
router.get('/', wishlistController.getAllWishlists);

/**
 * @route GET /wishlist/:id
 * @desc الحصول على عنصر قائمة الأمنيات بالمعرف
 * @access Public
 */
router.get('/:id', validationMiddlewareFactory(getWishlistByIdSchema.params, 'params'), wishlistController.getWishlistById);

/**
 * @route POST /wishlist
 * @desc إنشاء عنصر قائمة أمنيات جديد
 * @access Public
 */
router.post('/', validationMiddlewareFactory(createWishlistSchema.body, 'body'), wishlistController.createWishlist);

/**
 * @route PUT /wishlist/:id
 * @desc تحديث عنصر قائمة الأمنيات
 * @access Public
 */
router.put('/:id', 
  validationMiddlewareFactory(updateWishlistSchema.params, 'params'),
  validationMiddlewareFactory(updateWishlistSchema.body, 'body'), 
  wishlistController.updateWishlist
);

/**
 * @route DELETE /wishlist/:id
 * @desc حذف عنصر قائمة الأمنيات
 * @access Public
 */
router.delete('/:id', validationMiddlewareFactory(getWishlistByIdSchema.params, 'params'), wishlistController.deleteWishlist);

export default router;