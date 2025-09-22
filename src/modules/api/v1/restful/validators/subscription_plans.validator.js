import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات خطط الاشتراك
 * @module SubscriptionPlansValidator
 */

/**
 * مخطط التحقق من معرف خطة الاشتراك
 */
export const getSubscriptionPlanByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف خطة الاشتراك يجب أن يكون رقم',
        'number.integer': 'معرف خطة الاشتراك يجب أن يكون رقم صحيح',
        'number.positive': 'معرف خطة الاشتراك يجب أن يكون رقم موجب',
        'any.required': 'معرف خطة الاشتراك مطلوب'
      })
  })
};

/**
 * مخطط إنشاء خطة اشتراك جديدة
 */
export const createSubscriptionPlanSchema = {
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.base': 'اسم خطة الاشتراك يجب أن يكون نص',
        'string.empty': 'اسم خطة الاشتراك لا يمكن أن يكون فارغ',
        'string.min': 'اسم خطة الاشتراك يجب أن يكون على الأقل حرفين',
        'string.max': 'اسم خطة الاشتراك يجب أن يكون أقل من 100 حرف',
        'any.required': 'اسم خطة الاشتراك مطلوب'
      }),
    description: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'وصف خطة الاشتراك يجب أن يكون نص',
        'string.max': 'وصف خطة الاشتراك يجب أن يكون أقل من 500 حرف'
      }),
    price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.base': 'سعر خطة الاشتراك يجب أن يكون رقم',
        'number.positive': 'سعر خطة الاشتراك يجب أن يكون رقم موجب',
        'any.required': 'سعر خطة الاشتراك مطلوب'
      }),
    duration_in_days: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'مدة خطة الاشتراك يجب أن تكون رقم',
        'number.integer': 'مدة خطة الاشتراك يجب أن تكون رقم صحيح',
        'number.positive': 'مدة خطة الاشتراك يجب أن تكون رقم موجب',
        'any.required': 'مدة خطة الاشتراك مطلوبة'
      }),
    features: Joi.array()
      .items(Joi.string().max(200))
      .max(20)
      .allow(null)
      .messages({
        'array.base': 'ميزات خطة الاشتراك يجب أن تكون مصفوفة',
        'array.max': 'ميزات خطة الاشتراك يجب أن تكون أقل من 20 ميزة',
        'string.max': 'كل ميزة يجب أن تكون أقل من 200 حرف'
      }),
    is_active: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'حالة تفعيل خطة الاشتراك يجب أن تكون true أو false'
      }),
    max_users: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'الحد الأقصى للمستخدمين يجب أن يكون رقم',
        'number.integer': 'الحد الأقصى للمستخدمين يجب أن يكون رقم صحيح',
        'number.positive': 'الحد الأقصى للمستخدمين يجب أن يكون رقم موجب'
      }),
    storage_limit_gb: Joi.number()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'حد التخزين يجب أن يكون رقم',
        'number.positive': 'حد التخزين يجب أن يكون رقم موجب'
      }),
    support_level: Joi.string()
      .valid('basic', 'standard', 'premium', 'enterprise')
      .default('basic')
      .messages({
        'string.base': 'مستوى الدعم يجب أن يكون نص',
        'any.only': 'مستوى الدعم يجب أن يكون إحدى القيم: basic, standard, premium, enterprise'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث خطة الاشتراك
 */
export const updateSubscriptionPlanSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف خطة الاشتراك يجب أن يكون رقم',
        'number.integer': 'معرف خطة الاشتراك يجب أن يكون رقم صحيح',
        'number.positive': 'معرف خطة الاشتراك يجب أن يكون رقم موجب',
        'any.required': 'معرف خطة الاشتراك مطلوب'
      })
  }),
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .messages({
        'string.base': 'اسم خطة الاشتراك يجب أن يكون نص',
        'string.empty': 'اسم خطة الاشتراك لا يمكن أن يكون فارغ',
        'string.min': 'اسم خطة الاشتراك يجب أن يكون على الأقل حرفين',
        'string.max': 'اسم خطة الاشتراك يجب أن يكون أقل من 100 حرف'
      }),
    description: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'وصف خطة الاشتراك يجب أن يكون نص',
        'string.max': 'وصف خطة الاشتراك يجب أن يكون أقل من 500 حرف'
      }),
    price: Joi.number()
      .positive()
      .precision(2)
      .messages({
        'number.base': 'سعر خطة الاشتراك يجب أن يكون رقم',
        'number.positive': 'سعر خطة الاشتراك يجب أن يكون رقم موجب'
      }),
    duration_in_days: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'مدة خطة الاشتراك يجب أن تكون رقم',
        'number.integer': 'مدة خطة الاشتراك يجب أن تكون رقم صحيح',
        'number.positive': 'مدة خطة الاشتراك يجب أن تكون رقم موجب'
      }),
    features: Joi.array()
      .items(Joi.string().max(200))
      .max(20)
      .allow(null)
      .messages({
        'array.base': 'ميزات خطة الاشتراك يجب أن تكون مصفوفة',
        'array.max': 'ميزات خطة الاشتراك يجب أن تكون أقل من 20 ميزة',
        'string.max': 'كل ميزة يجب أن تكون أقل من 200 حرف'
      }),
    is_active: Joi.boolean()
      .messages({
        'boolean.base': 'حالة تفعيل خطة الاشتراك يجب أن تكون true أو false'
      }),
    max_users: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'الحد الأقصى للمستخدمين يجب أن يكون رقم',
        'number.integer': 'الحد الأقصى للمستخدمين يجب أن يكون رقم صحيح',
        'number.positive': 'الحد الأقصى للمستخدمين يجب أن يكون رقم موجب'
      }),
    storage_limit_gb: Joi.number()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'حد التخزين يجب أن يكون رقم',
        'number.positive': 'حد التخزين يجب أن يكون رقم موجب'
      }),
    support_level: Joi.string()
      .valid('basic', 'standard', 'premium', 'enterprise')
      .messages({
        'string.base': 'مستوى الدعم يجب أن يكون نص',
        'any.only': 'مستوى الدعم يجب أن يكون إحدى القيم: basic, standard, premium, enterprise'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};