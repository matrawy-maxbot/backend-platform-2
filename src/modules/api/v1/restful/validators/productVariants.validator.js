import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات متغيرات المنتجات
 * @module ProductVariantsValidator
 */

/**
 * مخطط التحقق من معرف متغير المنتج
 */
export const getProductVariantByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .length(12)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.base': 'معرف متغير المنتج يجب أن يكون نص',
        'string.length': 'معرف متغير المنتج يجب أن يكون 12 رقم',
        'string.pattern.base': 'معرف متغير المنتج يجب أن يحتوي على أرقام فقط',
        'any.required': 'معرف متغير المنتج مطلوب'
      })
  })
};

/**
 * مخطط إنشاء متغير منتج جديد
 */
export const createProductVariantSchema = {
  body: Joi.object({
    sku: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.base': 'رمز المنتج يجب أن يكون نص',
        'string.empty': 'رمز المنتج لا يمكن أن يكون فارغ',
        'string.max': 'رمز المنتج يجب أن يكون أقل من 100 حرف',
        'any.required': 'رمز المنتج مطلوب'
      }),
    variant_name: Joi.string()
      .max(255)
      .required()
      .messages({
        'string.base': 'اسم متغير المنتج يجب أن يكون نص',
        'string.empty': 'اسم متغير المنتج لا يمكن أن يكون فارغ',
        'string.max': 'اسم متغير المنتج يجب أن يكون أقل من 255 حرف',
        'any.required': 'اسم متغير المنتج مطلوب'
      }),
    price_adjustment: Joi.number()
      .precision(2)
      .default(0)
      .messages({
        'number.base': 'تعديل السعر يجب أن يكون رقم'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط صورة المتغير يجب أن يكون نص',
        'string.uri': 'رابط صورة المتغير غير صحيح'
      }),
    is_default: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'حالة المتغير الافتراضي يجب أن تكون true أو false'
      }),
    sort_order: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'ترتيب المتغير يجب أن يكون رقم',
        'number.integer': 'ترتيب المتغير يجب أن يكون رقم صحيح',
        'number.min': 'ترتيب المتغير يجب أن يكون صفر أو أكثر'
      }),
    site_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الموقع يجب أن يكون رقم',
        'number.integer': 'معرف الموقع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الموقع يجب أن يكون رقم موجب',
        'any.required': 'معرف الموقع مطلوب'
      }),
    product_id: Joi.string()
      .length(12)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.base': 'معرف المنتج يجب أن يكون نص',
        'string.length': 'معرف المنتج يجب أن يكون 12 رقم',
        'string.pattern.base': 'معرف المنتج يجب أن يحتوي على أرقام فقط',
        'any.required': 'معرف المنتج مطلوب'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث متغير المنتج
 */
export const updateProductVariantSchema = {
  params: Joi.object({
    id: Joi.string()
      .length(12)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.base': 'معرف متغير المنتج يجب أن يكون نص',
        'string.length': 'معرف متغير المنتج يجب أن يكون 12 رقم',
        'string.pattern.base': 'معرف متغير المنتج يجب أن يحتوي على أرقام فقط',
        'any.required': 'معرف متغير المنتج مطلوب'
      })
  }),
  body: Joi.object({
    sku: Joi.string()
      .max(100)
      .messages({
        'string.base': 'رمز المنتج يجب أن يكون نص',
        'string.empty': 'رمز المنتج لا يمكن أن يكون فارغ',
        'string.max': 'رمز المنتج يجب أن يكون أقل من 100 حرف'
      }),
    variant_name: Joi.string()
      .max(255)
      .messages({
        'string.base': 'اسم متغير المنتج يجب أن يكون نص',
        'string.empty': 'اسم متغير المنتج لا يمكن أن يكون فارغ',
        'string.max': 'اسم متغير المنتج يجب أن يكون أقل من 255 حرف'
      }),
    price_adjustment: Joi.number()
      .precision(2)
      .messages({
        'number.base': 'تعديل السعر يجب أن يكون رقم'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط صورة المتغير يجب أن يكون نص',
        'string.uri': 'رابط صورة المتغير غير صحيح'
      }),
    is_default: Joi.boolean()
      .messages({
        'boolean.base': 'حالة المتغير الافتراضي يجب أن تكون true أو false'
      }),
    sort_order: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'ترتيب المتغير يجب أن يكون رقم',
        'number.integer': 'ترتيب المتغير يجب أن يكون رقم صحيح',
        'number.min': 'ترتيب المتغير يجب أن يكون صفر أو أكثر'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};