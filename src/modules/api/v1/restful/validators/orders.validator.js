import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات الطلبات
 * @module OrdersValidator
 */

/**
 * مخطط التحقق من معرف الطلب
 */
export const getOrderByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الطلب يجب أن يكون رقم',
        'number.integer': 'معرف الطلب يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الطلب يجب أن يكون رقم موجب',
        'any.required': 'معرف الطلب مطلوب'
      })
  })
};

/**
 * مخطط إنشاء طلب جديد
 */
export const createOrderSchema = {
  body: Joi.object({
    customer_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف العميل يجب أن يكون رقم',
        'number.integer': 'معرف العميل يجب أن يكون رقم صحيح',
        'number.positive': 'معرف العميل يجب أن يكون رقم موجب',
        'any.required': 'معرف العميل مطلوب'
      }),
    total_amount: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'إجمالي المبلغ يجب أن يكون رقم',
        'number.positive': 'إجمالي المبلغ يجب أن يكون رقم موجب',
        'any.required': 'إجمالي المبلغ مطلوب'
      }),
    status: Joi.string()
      .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
      .default('pending')
      .messages({
        'string.base': 'حالة الطلب يجب أن تكون نص',
        'any.only': 'حالة الطلب يجب أن تكون إحدى القيم: pending, confirmed, shipped, delivered, cancelled'
      }),
    shipping_address: Joi.string()
      .max(500)
      .required()
      .messages({
        'string.base': 'عنوان الشحن يجب أن يكون نص',
        'string.empty': 'عنوان الشحن لا يمكن أن يكون فارغ',
        'string.max': 'عنوان الشحن يجب أن يكون أقل من 500 حرف',
        'any.required': 'عنوان الشحن مطلوب'
      }),
    payment_method: Joi.string()
      .valid('cash', 'credit_card', 'debit_card', 'paypal', 'bank_transfer')
      .required()
      .messages({
        'string.base': 'طريقة الدفع يجب أن تكون نص',
        'any.only': 'طريقة الدفع يجب أن تكون إحدى القيم: cash, credit_card, debit_card, paypal, bank_transfer',
        'any.required': 'طريقة الدفع مطلوبة'
      }),
    notes: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'ملاحظات الطلب يجب أن تكون نص',
        'string.max': 'ملاحظات الطلب يجب أن تكون أقل من 1000 حرف'
      }),
    discount_amount: Joi.number()
      .min(0)
      .precision(2)
      .default(0)
      .messages({
        'number.base': 'مبلغ الخصم يجب أن يكون رقم',
        'number.min': 'مبلغ الخصم يجب أن يكون صفر أو أكثر'
      }),
    tax_amount: Joi.number()
      .min(0)
      .precision(2)
      .default(0)
      .messages({
        'number.base': 'مبلغ الضريبة يجب أن يكون رقم',
        'number.min': 'مبلغ الضريبة يجب أن يكون صفر أو أكثر'
      }),
    shipping_cost: Joi.number()
      .min(0)
      .precision(2)
      .default(0)
      .messages({
        'number.base': 'تكلفة الشحن يجب أن تكون رقم',
        'number.min': 'تكلفة الشحن يجب أن تكون صفر أو أكثر'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث الطلب
 */
export const updateOrderSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الطلب يجب أن يكون رقم',
        'number.integer': 'معرف الطلب يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الطلب يجب أن يكون رقم موجب',
        'any.required': 'معرف الطلب مطلوب'
      })
  }),
  body: Joi.object({
    total_amount: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'إجمالي المبلغ يجب أن يكون رقم',
        'number.positive': 'إجمالي المبلغ يجب أن يكون رقم موجب'
      }),
    status: Joi.string()
      .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
      .messages({
        'string.base': 'حالة الطلب يجب أن تكون نص',
        'any.only': 'حالة الطلب يجب أن تكون إحدى القيم: pending, confirmed, shipped, delivered, cancelled'
      }),
    shipping_address: Joi.string()
      .max(500)
      .messages({
        'string.base': 'عنوان الشحن يجب أن يكون نص',
        'string.empty': 'عنوان الشحن لا يمكن أن يكون فارغ',
        'string.max': 'عنوان الشحن يجب أن يكون أقل من 500 حرف'
      }),
    payment_method: Joi.string()
      .valid('cash', 'credit_card', 'debit_card', 'paypal', 'bank_transfer')
      .messages({
        'string.base': 'طريقة الدفع يجب أن تكون نص',
        'any.only': 'طريقة الدفع يجب أن تكون إحدى القيم: cash, credit_card, debit_card, paypal, bank_transfer'
      }),
    notes: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'ملاحظات الطلب يجب أن تكون نص',
        'string.max': 'ملاحظات الطلب يجب أن تكون أقل من 1000 حرف'
      }),
    discount_amount: Joi.number()
      .min(0)
      .precision(2)
      .messages({
        'number.base': 'مبلغ الخصم يجب أن يكون رقم',
        'number.min': 'مبلغ الخصم يجب أن يكون صفر أو أكثر'
      }),
    tax_amount: Joi.number()
      .min(0)
      .precision(2)
      .messages({
        'number.base': 'مبلغ الضريبة يجب أن يكون رقم',
        'number.min': 'مبلغ الضريبة يجب أن يكون صفر أو أكثر'
      }),
    shipping_cost: Joi.number()
      .min(0)
      .precision(2)
      .messages({
        'number.base': 'تكلفة الشحن يجب أن تكون رقم',
        'number.min': 'تكلفة الشحن يجب أن تكون صفر أو أكثر'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};