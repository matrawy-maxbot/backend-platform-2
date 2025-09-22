import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات مدفوعات البائعين
 * @module VendorPaymentsValidator
 */

/**
 * مخطط التحقق من معرف مدفوعة البائع
 */
export const getVendorPaymentByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف مدفوعة البائع يجب أن يكون رقم',
        'number.integer': 'معرف مدفوعة البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف مدفوعة البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف مدفوعة البائع مطلوب'
      })
  })
};

/**
 * مخطط إنشاء مدفوعة بائع جديدة
 */
export const createVendorPaymentSchema = {
  body: Joi.object({
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
    vendor_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      }),
    subscription_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الاشتراك يجب أن يكون رقم',
        'number.integer': 'معرف الاشتراك يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الاشتراك يجب أن يكون رقم موجب',
        'any.required': 'معرف الاشتراك مطلوب'
      }),
    amount: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'مبلغ الدفعة يجب أن يكون رقم',
        'number.positive': 'مبلغ الدفعة يجب أن يكون رقم موجب',
        'any.required': 'مبلغ الدفعة مطلوب'
      }),
    payment_method: Joi.string()
      .valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'wallet')
      .required()
      .messages({
        'string.base': 'طريقة الدفع يجب أن تكون نص',
        'any.only': 'طريقة الدفع يجب أن تكون إحدى القيم: credit_card, debit_card, paypal, bank_transfer, wallet',
        'any.required': 'طريقة الدفع مطلوبة'
      }),
    transaction_id: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'معرف المعاملة يجب أن يكون نص',
        'string.max': 'معرف المعاملة يجب أن يكون أقل من 100 حرف'
      }),
    payment_status: Joi.string()
      .valid('pending', 'processing', 'completed', 'failed', 'refunded')
      .default('pending')
      .messages({
        'string.base': 'حالة الدفعة يجب أن تكون نص',
        'any.only': 'حالة الدفعة يجب أن تكون إحدى القيم: pending, processing, completed, failed, refunded'
      }),
    currency: Joi.string()
      .length(3)
      .default('USD')
      .messages({
        'string.base': 'العملة يجب أن تكون نص',
        'string.length': 'العملة يجب أن تكون 3 أحرف'
      }),
    gateway_response: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'استجابة بوابة الدفع يجب أن تكون كائن'
      }),
    paid_at: Joi.date()
      .allow(null)
      .messages({
        'date.base': 'تاريخ الدفع يجب أن يكون تاريخ صحيح'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث مدفوعة البائع
 */
export const updateVendorPaymentSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف مدفوعة البائع يجب أن يكون رقم',
        'number.integer': 'معرف مدفوعة البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف مدفوعة البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف مدفوعة البائع مطلوب'
      })
  }),
  body: Joi.object({
    amount: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'مبلغ الدفعة يجب أن يكون رقم',
        'number.positive': 'مبلغ الدفعة يجب أن يكون رقم موجب'
      }),
    payment_method: Joi.string()
      .valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'wallet')
      .messages({
        'string.base': 'طريقة الدفع يجب أن تكون نص',
        'any.only': 'طريقة الدفع يجب أن تكون إحدى القيم: credit_card, debit_card, paypal, bank_transfer, wallet'
      }),
    transaction_id: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'معرف المعاملة يجب أن يكون نص',
        'string.max': 'معرف المعاملة يجب أن يكون أقل من 100 حرف'
      }),
    payment_status: Joi.string()
      .valid('pending', 'processing', 'completed', 'failed', 'refunded')
      .messages({
        'string.base': 'حالة الدفعة يجب أن تكون نص',
        'any.only': 'حالة الدفعة يجب أن تكون إحدى القيم: pending, processing, completed, failed, refunded'
      }),
    currency: Joi.string()
      .length(3)
      .messages({
        'string.base': 'العملة يجب أن تكون نص',
        'string.length': 'العملة يجب أن تكون 3 أحرف'
      }),
    gateway_response: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'استجابة بوابة الدفع يجب أن تكون كائن'
      }),
    paid_at: Joi.date()
      .allow(null)
      .messages({
        'date.base': 'تاريخ الدفع يجب أن يكون تاريخ صحيح'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};