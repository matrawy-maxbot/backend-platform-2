import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات المنتجات
 * @module ProductsValidator
 */

/**
 * مخطط التحقق من معرف المنتج
 */
export const getProductByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المنتج يجب أن يكون رقم',
        'number.integer': 'معرف المنتج يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المنتج يجب أن يكون رقم موجب',
        'any.required': 'معرف المنتج مطلوب'
      })
  })
};

/**
 * مخطط إنشاء منتج جديد
 */
export const createProductSchema = {
  body: Joi.object({
    vendor_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المتجر يجب أن يكون رقم',
        'number.integer': 'معرف المتجر يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المتجر يجب أن يكون رقم موجب',
        'any.required': 'معرف المتجر مطلوب'
      }),
    name: Joi.string()
      .max(255)
      .required()
      .messages({
        'string.base': 'اسم المنتج يجب أن يكون نص',
        'string.empty': 'اسم المنتج لا يمكن أن يكون فارغ',
        'string.max': 'اسم المنتج يجب أن يكون أقل من 255 حرف',
        'any.required': 'اسم المنتج مطلوب'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف المنتج يجب أن يكون نص'
      }),
    price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'سعر المنتج يجب أن يكون رقم',
        'number.positive': 'سعر المنتج يجب أن يكون رقم موجب',
        'any.required': 'سعر المنتج مطلوب'
      }),
    category: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'فئة المنتج يجب أن تكون نص',
        'string.max': 'فئة المنتج يجب أن تكون أقل من 100 حرف'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط صورة المنتج يجب أن يكون نص',
        'string.uri': 'رابط صورة المنتج غير صحيح'
      }),
    stock_quantity: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'كمية المخزون يجب أن تكون رقم',
        'number.integer': 'كمية المخزون يجب أن تكون رقم صحيح',
        'number.min': 'كمية المخزون يجب أن تكون صفر أو أكثر'
      }),
    sku: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'رمز المنتج يجب أن يكون نص',
        'string.max': 'رمز المنتج يجب أن يكون أقل من 100 حرف'
      }),
    is_active: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'حالة تفعيل المنتج يجب أن تكون true أو false'
      }),
    weight: Joi.number()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'وزن المنتج يجب أن يكون رقم',
        'number.positive': 'وزن المنتج يجب أن يكون رقم موجب'
      }),
    dimensions: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'أبعاد المنتج يجب أن تكون نص',
        'string.max': 'أبعاد المنتج يجب أن تكون أقل من 100 حرف'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث المنتج
 */
export const updateProductSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المنتج يجب أن يكون رقم',
        'number.integer': 'معرف المنتج يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المنتج يجب أن يكون رقم موجب',
        'any.required': 'معرف المنتج مطلوب'
      })
  }),
  body: Joi.object({
    name: Joi.string()
      .max(255)
      .messages({
        'string.base': 'اسم المنتج يجب أن يكون نص',
        'string.empty': 'اسم المنتج لا يمكن أن يكون فارغ',
        'string.max': 'اسم المنتج يجب أن يكون أقل من 255 حرف'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف المنتج يجب أن يكون نص'
      }),
    price: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'سعر المنتج يجب أن يكون رقم',
        'number.positive': 'سعر المنتج يجب أن يكون رقم موجب'
      }),
    category: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'فئة المنتج يجب أن تكون نص',
        'string.max': 'فئة المنتج يجب أن تكون أقل من 100 حرف'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط صورة المنتج يجب أن يكون نص',
        'string.uri': 'رابط صورة المنتج غير صحيح'
      }),
    stock_quantity: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'كمية المخزون يجب أن تكون رقم',
        'number.integer': 'كمية المخزون يجب أن تكون رقم صحيح',
        'number.min': 'كمية المخزون يجب أن تكون صفر أو أكثر'
      }),
    sku: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'رمز المنتج يجب أن يكون نص',
        'string.max': 'رمز المنتج يجب أن يكون أقل من 100 حرف'
      }),
    is_active: Joi.boolean()
      .messages({
        'boolean.base': 'حالة تفعيل المنتج يجب أن تكون true أو false'
      }),
    weight: Joi.number()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'وزن المنتج يجب أن يكون رقم',
        'number.positive': 'وزن المنتج يجب أن يكون رقم موجب'
      }),
    dimensions: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'أبعاد المنتج يجب أن تكون نص',
        'string.max': 'أبعاد المنتج يجب أن تكون أقل من 100 حرف'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};