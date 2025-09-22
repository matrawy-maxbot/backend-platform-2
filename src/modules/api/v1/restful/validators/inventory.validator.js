import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات المخزون
 * @module InventoryValidator
 */

/**
 * مخطط التحقق من معرف المخزون
 */
export const getInventoryByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المخزون يجب أن يكون رقم',
        'number.integer': 'معرف المخزون يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المخزون يجب أن يكون رقم موجب',
        'any.required': 'معرف المخزون مطلوب'
      })
  })
};

/**
 * مخطط إنشاء سجل مخزون جديد
 */
export const createInventorySchema = {
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
        'string.base': 'اسم المخزون يجب أن يكون نص',
        'string.empty': 'اسم المخزون لا يمكن أن يكون فارغ',
        'string.max': 'اسم المخزون يجب أن يكون أقل من 255 حرف',
        'any.required': 'اسم المخزون مطلوب'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف المخزون يجب أن يكون نص'
      }),
    price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'سعر المخزون يجب أن يكون رقم',
        'number.positive': 'سعر المخزون يجب أن يكون رقم موجب',
        'any.required': 'سعر المخزون مطلوب'
      }),
    category: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'فئة المخزون يجب أن تكون نص',
        'string.max': 'فئة المخزون يجب أن تكون أقل من 100 حرف'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط صورة المخزون يجب أن يكون نص',
        'string.uri': 'رابط صورة المخزون غير صحيح'
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
        'string.base': 'رمز المخزون يجب أن يكون نص',
        'string.max': 'رمز المخزون يجب أن يكون أقل من 100 حرف'
      }),
    is_active: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'حالة تفعيل المخزون يجب أن تكون true أو false'
      }),
    weight: Joi.number()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'وزن المخزون يجب أن يكون رقم',
        'number.positive': 'وزن المخزون يجب أن يكون رقم موجب'
      }),
    dimensions: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'أبعاد المخزون يجب أن تكون نص',
        'string.max': 'أبعاد المخزون يجب أن تكون أقل من 100 حرف'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث المخزون
 */
export const updateInventorySchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المخزون يجب أن يكون رقم',
        'number.integer': 'معرف المخزون يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المخزون يجب أن يكون رقم موجب',
        'any.required': 'معرف المخزون مطلوب'
      })
  }),
  body: Joi.object({
    name: Joi.string()
      .max(255)
      .messages({
        'string.base': 'اسم المخزون يجب أن يكون نص',
        'string.empty': 'اسم المخزون لا يمكن أن يكون فارغ',
        'string.max': 'اسم المخزون يجب أن يكون أقل من 255 حرف'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف المخزون يجب أن يكون نص'
      }),
    price: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'سعر المخزون يجب أن يكون رقم',
        'number.positive': 'سعر المخزون يجب أن يكون رقم موجب'
      }),
    category: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'فئة المخزون يجب أن تكون نص',
        'string.max': 'فئة المخزون يجب أن تكون أقل من 100 حرف'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط صورة المخزون يجب أن يكون نص',
        'string.uri': 'رابط صورة المخزون غير صحيح'
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
        'string.base': 'رمز المخزون يجب أن يكون نص',
        'string.max': 'رمز المخزون يجب أن يكون أقل من 100 حرف'
      }),
    is_active: Joi.boolean()
      .messages({
        'boolean.base': 'حالة تفعيل المخزون يجب أن تكون true أو false'
      }),
    weight: Joi.number()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'وزن المخزون يجب أن يكون رقم',
        'number.positive': 'وزن المخزون يجب أن يكون رقم موجب'
      }),
    dimensions: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'أبعاد المخزون يجب أن تكون نص',
        'string.max': 'أبعاد المخزون يجب أن تكون أقل من 100 حرف'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};