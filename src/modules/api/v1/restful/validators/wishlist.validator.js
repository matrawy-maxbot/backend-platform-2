import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات قائمة الأمنيات
 * @module WishlistValidator
 */

/**
 * مخطط التحقق من معرف عنصر قائمة الأمنيات
 */
export const getWishlistByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف عنصر قائمة الأمنيات يجب أن يكون رقم',
        'number.integer': 'معرف عنصر قائمة الأمنيات يجب أن يكون رقم صحيح',
        'number.positive': 'معرف عنصر قائمة الأمنيات يجب أن يكون رقم موجب',
        'any.required': 'معرف عنصر قائمة الأمنيات مطلوب'
      })
  })
};

/**
 * مخطط إنشاء عنصر قائمة أمنيات جديد
 */
export const createWishlistSchema = {
  body: Joi.object({
    user_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المستخدم يجب أن يكون رقم',
        'number.integer': 'معرف المستخدم يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المستخدم يجب أن يكون رقم موجب',
        'any.required': 'معرف المستخدم مطلوب'
      }),
    product_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المنتج يجب أن يكون رقم',
        'number.integer': 'معرف المنتج يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المنتج يجب أن يكون رقم موجب',
        'any.required': 'معرف المنتج مطلوب'
      }),
    notes: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'ملاحظات العنصر يجب أن تكون نص',
        'string.max': 'ملاحظات العنصر يجب أن تكون أقل من 500 حرف'
      }),
    priority: Joi.string()
      .valid('low', 'medium', 'high')
      .default('medium')
      .messages({
        'string.base': 'أولوية العنصر يجب أن تكون نص',
        'any.only': 'أولوية العنصر يجب أن تكون إحدى القيم: low, medium, high'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث عنصر قائمة الأمنيات
 */
export const updateWishlistSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف عنصر قائمة الأمنيات يجب أن يكون رقم',
        'number.integer': 'معرف عنصر قائمة الأمنيات يجب أن يكون رقم صحيح',
        'number.positive': 'معرف عنصر قائمة الأمنيات يجب أن يكون رقم موجب',
        'any.required': 'معرف عنصر قائمة الأمنيات مطلوب'
      })
  }),
  body: Joi.object({
    notes: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'ملاحظات العنصر يجب أن تكون نص',
        'string.max': 'ملاحظات العنصر يجب أن تكون أقل من 500 حرف'
      }),
    priority: Joi.string()
      .valid('low', 'medium', 'high')
      .messages({
        'string.base': 'أولوية العنصر يجب أن تكون نص',
        'any.only': 'أولوية العنصر يجب أن تكون إحدى القيم: low, medium, high'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};