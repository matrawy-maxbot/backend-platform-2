import Joi from 'joi';

/**
 * مخططات التحقق من صحة مراجعات المنتجات
 * @module ProductReviewsValidator
 */

/**
 * مخطط التحقق من معرف مراجعة المنتج
 */
export const getProductReviewByIdSchema = {
  params: Joi.object({
    id: Joi.string().required().messages({
      'string.empty': 'معرف مراجعة المنتج مطلوب',
      'any.required': 'معرف مراجعة المنتج مطلوب'
    })
  })
};

/**
 * مخطط التحقق من إنشاء مراجعة منتج جديدة
 */
export const createProductReviewSchema = {
  body: Joi.object({
    userId: Joi.string().required().messages({
      'string.empty': 'معرف المستخدم مطلوب',
      'any.required': 'معرف المستخدم مطلوب'
    }),
    productId: Joi.string().required().messages({
      'string.empty': 'معرف المنتج مطلوب',
      'any.required': 'معرف المنتج مطلوب'
    }),
    rating: Joi.number().min(1).max(5).required().messages({
      'number.base': 'التقييم يجب أن يكون رقماً',
      'number.min': 'التقييم يجب أن يكون على الأقل 1',
      'number.max': 'التقييم يجب أن يكون على الأكثر 5',
      'any.required': 'التقييم مطلوب'
    }),
    title: Joi.string().optional().messages({
      'string.base': 'العنوان يجب أن يكون نصاً'
    }),
    comment: Joi.string().optional().messages({
      'string.base': 'التعليق يجب أن يكون نصاً'
    }),
    images: Joi.array().items(Joi.string()).optional().messages({
      'array.base': 'الصور يجب أن تكون مصفوفة من النصوص'
    })
  })
};

/**
 * مخطط التحقق من تحديث مراجعة المنتج
 */
export const updateProductReviewSchema = {
  params: Joi.object({
    id: Joi.string().required().messages({
      'string.empty': 'معرف مراجعة المنتج مطلوب',
      'any.required': 'معرف مراجعة المنتج مطلوب'
    })
  }),
  body: Joi.object({
    userId: Joi.string().required().messages({
      'string.empty': 'معرف المستخدم مطلوب',
      'any.required': 'معرف المستخدم مطلوب'
    }),
    rating: Joi.number().min(1).max(5).optional().messages({
      'number.base': 'التقييم يجب أن يكون رقماً',
      'number.min': 'التقييم يجب أن يكون على الأقل 1',
      'number.max': 'التقييم يجب أن يكون على الأكثر 5'
    }),
    title: Joi.string().optional().messages({
      'string.base': 'العنوان يجب أن يكون نصاً'
    }),
    comment: Joi.string().optional().messages({
      'string.base': 'التعليق يجب أن يكون نصاً'
    }),
    images: Joi.array().items(Joi.string()).optional().messages({
      'array.base': 'الصور يجب أن تكون مصفوفة من النصوص'
    })
  })
};