import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات المدفوعات
 * @module PaymentsValidator
 */

/**
 * مخطط التحقق من معرف المدفوعة
 */
export const getPaymentByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المدفوعة يجب أن يكون رقم',
        'number.integer': 'معرف المدفوعة يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المدفوعة يجب أن يكون رقم موجب',
        'any.required': 'معرف المدفوعة مطلوب'
      })
  })
};

/**
 * مخطط إنشاء مدفوعة جديدة
 */
export const createPaymentSchema = {
  body: Joi.object({
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
    amount: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'مبلغ الدفع يجب أن يكون رقم',
        'number.positive': 'مبلغ الدفع يجب أن يكون رقم موجب',
        'any.required': 'مبلغ الدفع مطلوب'
      }),
    payment_method: Joi.string()
      .valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery')
      .required()
      .messages({
        'string.base': 'طريقة الدفع يجب أن تكون نص',
        'any.only': 'طريقة الدفع يجب أن تكون إحدى القيم: credit_card, debit_card, paypal, bank_transfer, cash_on_delivery',
        'any.required': 'طريقة الدفع مطلوبة'
      }),
    payment_status: Joi.string()
      .valid('pending', 'processing', 'completed', 'failed', 'refunded')
      .default('pending')
      .messages({
        'string.base': 'حالة الدفع يجب أن تكون نص',
        'any.only': 'حالة الدفع يجب أن تكون إحدى القيم: pending, processing, completed, failed, refunded'
      }),
    transaction_id: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'معرف المعاملة يجب أن يكون نص',
        'string.max': 'معرف المعاملة يجب أن يكون أقل من 100 حرف'
      }),
    gateway_response: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'استجابة بوابة الدفع يجب أن تكون كائن'
      }),
    notes: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'ملاحظات الدفع يجب أن تكون نص',
        'string.max': 'ملاحظات الدفع يجب أن تكون أقل من 1000 حرف'
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
 * مخطط تحديث المدفوعة
 */
export const updatePaymentSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المدفوعة يجب أن يكون رقم',
        'number.integer': 'معرف المدفوعة يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المدفوعة يجب أن يكون رقم موجب',
        'any.required': 'معرف المدفوعة مطلوب'
      })
  }),
  body: Joi.object({
    amount: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'مبلغ الدفع يجب أن يكون رقم',
        'number.positive': 'مبلغ الدفع يجب أن يكون رقم موجب'
      }),
    payment_method: Joi.string()
      .valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery')
      .messages({
        'string.base': 'طريقة الدفع يجب أن تكون نص',
        'any.only': 'طريقة الدفع يجب أن تكون إحدى القيم: credit_card, debit_card, paypal, bank_transfer, cash_on_delivery'
      }),
    payment_status: Joi.string()
      .valid('pending', 'processing', 'completed', 'failed', 'refunded')
      .messages({
        'string.base': 'حالة الدفع يجب أن تكون نص',
        'any.only': 'حالة الدفع يجب أن تكون إحدى القيم: pending, processing, completed, failed, refunded'
      }),
    transaction_id: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'معرف المعاملة يجب أن يكون نص',
        'string.max': 'معرف المعاملة يجب أن يكون أقل من 100 حرف'
      }),
    gateway_response: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'استجابة بوابة الدفع يجب أن تكون كائن'
      }),
    notes: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'ملاحظات الدفع يجب أن تكون نص',
        'string.max': 'ملاحظات الدفع يجب أن تكون أقل من 1000 حرف'
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