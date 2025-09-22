import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات الكوبونات
 * @module CouponsValidator
 */

/**
 * مخطط التحقق من معرف الكوبون
 */
export const getCouponByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الكوبون يجب أن يكون رقم',
        'number.integer': 'معرف الكوبون يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الكوبون يجب أن يكون رقم موجب',
        'any.required': 'معرف الكوبون مطلوب'
      })
  })
};

/**
 * مخطط إنشاء كوبون جديد
 */
export const createCouponSchema = {
  body: Joi.object({
    code: Joi.string()
      .max(50)
      .uppercase()
      .required()
      .messages({
        'string.base': 'كود الكوبون يجب أن يكون نص',
        'string.empty': 'كود الكوبون لا يمكن أن يكون فارغ',
        'string.max': 'كود الكوبون يجب أن يكون أقل من 50 حرف',
        'string.uppercase': 'كود الكوبون يجب أن يكون بأحرف كبيرة',
        'any.required': 'كود الكوبون مطلوب'
      }),
    discount_type: Joi.string()
      .valid('percentage', 'fixed')
      .required()
      .messages({
        'string.base': 'نوع الخصم يجب أن يكون نص',
        'any.only': 'نوع الخصم يجب أن يكون إحدى القيم: percentage, fixed',
        'any.required': 'نوع الخصم مطلوب'
      }),
    discount_value: Joi.number()
      .positive()
      .precision(2)
      .min(0.01)
      .required()
      .messages({
        'number.base': 'قيمة الخصم يجب أن تكون رقم',
        'number.positive': 'قيمة الخصم يجب أن تكون رقم موجب',
        'number.min': 'قيمة الخصم يجب أن تكون أكبر من 0.01',
        'any.required': 'قيمة الخصم مطلوبة'
      }),
    min_order_amount: Joi.number()
      .min(0)
      .precision(2)
      .default(0)
      .messages({
        'number.base': 'الحد الأدنى لمبلغ الطلب يجب أن يكون رقم',
        'number.min': 'الحد الأدنى لمبلغ الطلب يجب أن يكون صفر أو أكثر'
      }),
    max_discount_amount: Joi.number()
      .min(0)
      .precision(2)
      .allow(null)
      .messages({
        'number.base': 'الحد الأقصى لمبلغ الخصم يجب أن يكون رقم',
        'number.min': 'الحد الأقصى لمبلغ الخصم يجب أن يكون صفر أو أكثر'
      }),
    usage_limit: Joi.number()
      .integer()
      .min(1)
      .allow(null)
      .messages({
        'number.base': 'حد الاستخدام يجب أن يكون رقم',
        'number.integer': 'حد الاستخدام يجب أن يكون رقم صحيح',
        'number.min': 'حد الاستخدام يجب أن يكون 1 أو أكثر'
      }),
    valid_from: Joi.date()
      .required()
      .messages({
        'date.base': 'تاريخ بداية الصلاحية يجب أن يكون تاريخ صحيح',
        'any.required': 'تاريخ بداية الصلاحية مطلوب'
      }),
    valid_until: Joi.date()
      .greater(Joi.ref('valid_from'))
      .required()
      .messages({
        'date.base': 'تاريخ انتهاء الصلاحية يجب أن يكون تاريخ صحيح',
        'date.greater': 'تاريخ انتهاء الصلاحية يجب أن يكون بعد تاريخ بداية الصلاحية',
        'any.required': 'تاريخ انتهاء الصلاحية مطلوب'
      }),
    is_active: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'حالة النشاط يجب أن تكون true أو false'
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
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث الكوبون
 */
export const updateCouponSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الكوبون يجب أن يكون رقم',
        'number.integer': 'معرف الكوبون يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الكوبون يجب أن يكون رقم موجب',
        'any.required': 'معرف الكوبون مطلوب'
      })
  }),
  body: Joi.object({
    code: Joi.string()
      .max(50)
      .uppercase()
      .messages({
        'string.base': 'كود الكوبون يجب أن يكون نص',
        'string.empty': 'كود الكوبون لا يمكن أن يكون فارغ',
        'string.max': 'كود الكوبون يجب أن يكون أقل من 50 حرف',
        'string.uppercase': 'كود الكوبون يجب أن يكون بأحرف كبيرة'
      }),
    discount_type: Joi.string()
      .valid('percentage', 'fixed')
      .messages({
        'string.base': 'نوع الخصم يجب أن يكون نص',
        'any.only': 'نوع الخصم يجب أن يكون إحدى القيم: percentage, fixed'
      }),
    discount_value: Joi.number()
      .positive()
      .precision(2)
      .min(0.01)
      .messages({
        'number.base': 'قيمة الخصم يجب أن تكون رقم',
        'number.positive': 'قيمة الخصم يجب أن تكون رقم موجب',
        'number.min': 'قيمة الخصم يجب أن تكون أكبر من 0.01'
      }),
    min_order_amount: Joi.number()
      .min(0)
      .precision(2)
      .messages({
        'number.base': 'الحد الأدنى لمبلغ الطلب يجب أن يكون رقم',
        'number.min': 'الحد الأدنى لمبلغ الطلب يجب أن يكون صفر أو أكثر'
      }),
    max_discount_amount: Joi.number()
      .min(0)
      .precision(2)
      .allow(null)
      .messages({
        'number.base': 'الحد الأقصى لمبلغ الخصم يجب أن يكون رقم',
        'number.min': 'الحد الأقصى لمبلغ الخصم يجب أن يكون صفر أو أكثر'
      }),
    usage_limit: Joi.number()
      .integer()
      .min(1)
      .allow(null)
      .messages({
        'number.base': 'حد الاستخدام يجب أن يكون رقم',
        'number.integer': 'حد الاستخدام يجب أن يكون رقم صحيح',
        'number.min': 'حد الاستخدام يجب أن يكون 1 أو أكثر'
      }),
    valid_from: Joi.date()
      .messages({
        'date.base': 'تاريخ بداية الصلاحية يجب أن يكون تاريخ صحيح'
      }),
    valid_until: Joi.date()
      .when('valid_from', {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref('valid_from')),
        otherwise: Joi.date()
      })
      .messages({
        'date.base': 'تاريخ انتهاء الصلاحية يجب أن يكون تاريخ صحيح',
        'date.greater': 'تاريخ انتهاء الصلاحية يجب أن يكون بعد تاريخ بداية الصلاحية'
      }),
    is_active: Joi.boolean()
      .messages({
        'boolean.base': 'حالة النشاط يجب أن تكون true أو false'
      }),
    site_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'معرف الموقع يجب أن يكون رقم',
        'number.integer': 'معرف الموقع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الموقع يجب أن يكون رقم موجب'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};