import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات عناصر الطلبات
 * @module OrderItemsValidator
 */

/**
 * مخطط التحقق من معرف عنصر الطلب
 */
export const getOrderItemByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف عنصر الطلب يجب أن يكون رقم',
        'number.integer': 'معرف عنصر الطلب يجب أن يكون رقم صحيح',
        'number.positive': 'معرف عنصر الطلب يجب أن يكون رقم موجب',
        'any.required': 'معرف عنصر الطلب مطلوب'
      })
  })
};

/**
 * مخطط إنشاء عنصر طلب جديد
 */
export const createOrderItemSchema = {
  body: Joi.object({
    product_name: Joi.string()
      .max(255)
      .required()
      .messages({
        'string.base': 'اسم المنتج يجب أن يكون نص',
        'string.empty': 'اسم المنتج لا يمكن أن يكون فارغ',
        'string.max': 'اسم المنتج يجب أن يكون أقل من 255 حرف',
        'any.required': 'اسم المنتج مطلوب'
      }),
    variant_name: Joi.string()
      .max(255)
      .allow(null, '')
      .messages({
        'string.base': 'اسم متغير المنتج يجب أن يكون نص',
        'string.max': 'اسم متغير المنتج يجب أن يكون أقل من 255 حرف'
      }),
    quantity: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'الكمية يجب أن تكون رقم',
        'number.integer': 'الكمية يجب أن تكون رقم صحيح',
        'number.min': 'الكمية يجب أن تكون 1 أو أكثر',
        'any.required': 'الكمية مطلوبة'
      }),
    unit_price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'سعر الوحدة يجب أن يكون رقم',
        'number.positive': 'سعر الوحدة يجب أن يكون رقم موجب',
        'any.required': 'سعر الوحدة مطلوب'
      }),
    discount_amount: Joi.number()
      .min(0)
      .precision(2)
      .default(0)
      .messages({
        'number.base': 'مبلغ الخصم يجب أن يكون رقم',
        'number.min': 'مبلغ الخصم يجب أن يكون صفر أو أكثر'
      }),
    total_price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'السعر الإجمالي يجب أن يكون رقم',
        'number.positive': 'السعر الإجمالي يجب أن يكون رقم موجب',
        'any.required': 'السعر الإجمالي مطلوب'
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
    order_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الطلب يجب أن يكون رقم',
        'number.integer': 'معرف الطلب يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الطلب يجب أن يكون رقم موجب',
        'any.required': 'معرف الطلب مطلوب'
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
    product_variant_id: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'معرف متغير المنتج يجب أن يكون رقم',
        'number.integer': 'معرف متغير المنتج يجب أن يكون رقم صحيح',
        'number.positive': 'معرف متغير المنتج يجب أن يكون رقم موجب'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث عنصر الطلب
 */
export const updateOrderItemSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف عنصر الطلب يجب أن يكون رقم',
        'number.integer': 'معرف عنصر الطلب يجب أن يكون رقم صحيح',
        'number.positive': 'معرف عنصر الطلب يجب أن يكون رقم موجب',
        'any.required': 'معرف عنصر الطلب مطلوب'
      })
  }),
  body: Joi.object({
    product_name: Joi.string()
      .max(255)
      .messages({
        'string.base': 'اسم المنتج يجب أن يكون نص',
        'string.empty': 'اسم المنتج لا يمكن أن يكون فارغ',
        'string.max': 'اسم المنتج يجب أن يكون أقل من 255 حرف'
      }),
    variant_name: Joi.string()
      .max(255)
      .allow(null, '')
      .messages({
        'string.base': 'اسم متغير المنتج يجب أن يكون نص',
        'string.max': 'اسم متغير المنتج يجب أن يكون أقل من 255 حرف'
      }),
    quantity: Joi.number()
      .integer()
      .min(1)
      .messages({
        'number.base': 'الكمية يجب أن تكون رقم',
        'number.integer': 'الكمية يجب أن تكون رقم صحيح',
        'number.min': 'الكمية يجب أن تكون 1 أو أكثر'
      }),
    unit_price: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'سعر الوحدة يجب أن يكون رقم',
        'number.positive': 'سعر الوحدة يجب أن يكون رقم موجب'
      }),
    discount_amount: Joi.number()
      .min(0)
      .precision(2)
      .messages({
        'number.base': 'مبلغ الخصم يجب أن يكون رقم',
        'number.min': 'مبلغ الخصم يجب أن يكون صفر أو أكثر'
      }),
    total_price: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'السعر الإجمالي يجب أن يكون رقم',
        'number.positive': 'السعر الإجمالي يجب أن يكون رقم موجب'
      }),
    product_variant_id: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'معرف متغير المنتج يجب أن يكون رقم',
        'number.integer': 'معرف متغير المنتج يجب أن يكون رقم صحيح',
        'number.positive': 'معرف متغير المنتج يجب أن يكون رقم موجب'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};