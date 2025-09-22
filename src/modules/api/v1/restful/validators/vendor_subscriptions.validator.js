import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات اشتراكات البائعين
 * @module VendorSubscriptionsValidator
 */

/**
 * مخطط التحقق من معرف اشتراك البائع
 */
export const getVendorSubscriptionByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف اشتراك البائع يجب أن يكون رقم',
        'number.integer': 'معرف اشتراك البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف اشتراك البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف اشتراك البائع مطلوب'
      })
  })
};

/**
 * مخطط إنشاء اشتراك بائع جديد
 */
export const createVendorSubscriptionSchema = {
  body: Joi.object({
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
    plan_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الخطة يجب أن يكون رقم',
        'number.integer': 'معرف الخطة يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الخطة يجب أن يكون رقم موجب',
        'any.required': 'معرف الخطة مطلوب'
      }),
    start_date: Joi.date()
      .required()
      .messages({
        'date.base': 'تاريخ البداية يجب أن يكون تاريخ صحيح',
        'any.required': 'تاريخ البداية مطلوب'
      }),
    end_date: Joi.date()
      .greater(Joi.ref('start_date'))
      .required()
      .messages({
        'date.base': 'تاريخ النهاية يجب أن يكون تاريخ صحيح',
        'date.greater': 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
        'any.required': 'تاريخ النهاية مطلوب'
      }),
    status: Joi.string()
      .valid('active', 'inactive', 'expired', 'cancelled')
      .default('active')
      .messages({
        'string.base': 'حالة الاشتراك يجب أن تكون نص',
        'any.only': 'حالة الاشتراك يجب أن تكون إحدى القيم: active, inactive, expired, cancelled'
      }),
    auto_renew: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'التجديد التلقائي يجب أن يكون قيمة منطقية'
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
        'string.base': 'ملاحظات الاشتراك يجب أن تكون نص',
        'string.max': 'ملاحظات الاشتراك يجب أن تكون أقل من 1000 حرف'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث اشتراك البائع
 */
export const updateVendorSubscriptionSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف اشتراك البائع يجب أن يكون رقم',
        'number.integer': 'معرف اشتراك البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف اشتراك البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف اشتراك البائع مطلوب'
      })
  }),
  body: Joi.object({
    plan_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'معرف الخطة يجب أن يكون رقم',
        'number.integer': 'معرف الخطة يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الخطة يجب أن يكون رقم موجب'
      }),
    start_date: Joi.date()
      .messages({
        'date.base': 'تاريخ البداية يجب أن يكون تاريخ صحيح'
      }),
    end_date: Joi.date()
      .when('start_date', {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref('start_date')),
        otherwise: Joi.date()
      })
      .messages({
        'date.base': 'تاريخ النهاية يجب أن يكون تاريخ صحيح',
        'date.greater': 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
      }),
    status: Joi.string()
      .valid('active', 'inactive', 'expired', 'cancelled')
      .messages({
        'string.base': 'حالة الاشتراك يجب أن تكون نص',
        'any.only': 'حالة الاشتراك يجب أن تكون إحدى القيم: active, inactive, expired, cancelled'
      }),
    auto_renew: Joi.boolean()
      .messages({
        'boolean.base': 'التجديد التلقائي يجب أن يكون قيمة منطقية'
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
        'string.base': 'ملاحظات الاشتراك يجب أن تكون نص',
        'string.max': 'ملاحظات الاشتراك يجب أن تكون أقل من 1000 حرف'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};