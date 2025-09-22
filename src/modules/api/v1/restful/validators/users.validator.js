import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات المستخدمين
 * @module UsersValidator
 */

/**
 * مخطط التحقق من معرف المستخدم
 */
export const getUserByIdSchema = {
  params: {
    id: {
      type: 'string',
      length: 15,
      required: true,
      messages: {
        'string.base': 'معرف المستخدم يجب أن يكون نص',
        'string.length': 'معرف المستخدم يجب أن يكون 15 حرف بالضبط',
        'any.required': 'معرف المستخدم مطلوب'
      }
    }
  }
};

/**
 * مخطط إنشاء مستخدم جديد
 */
export const createUserSchema = {
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.base': 'اسم المستخدم يجب أن يكون نص',
        'string.empty': 'اسم المستخدم لا يمكن أن يكون فارغ',
        'string.min': 'اسم المستخدم يجب أن يكون على الأقل حرفين',
        'string.max': 'اسم المستخدم يجب أن يكون أقل من 50 حرف',
        'any.required': 'اسم المستخدم مطلوب'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': 'البريد الإلكتروني يجب أن يكون نص',
        'string.empty': 'البريد الإلكتروني لا يمكن أن يكون فارغ',
        'string.email': 'البريد الإلكتروني غير صحيح',
        'any.required': 'البريد الإلكتروني مطلوب'
      }),
    password_hash: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.base': 'كلمة المرور يجب أن تكون نص',
        'string.empty': 'كلمة المرور لا يمكن أن تكون فارغة',
        'string.min': 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
        'any.required': 'كلمة المرور مطلوبة'
      }),
    full_name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.base': 'الاسم الكامل يجب أن يكون نص',
        'string.empty': 'الاسم الكامل لا يمكن أن يكون فارغ',
        'string.min': 'الاسم الكامل يجب أن يكون على الأقل حرفين',
        'string.max': 'الاسم الكامل يجب أن يكون أقل من 100 حرف',
        'any.required': 'الاسم الكامل مطلوب'
      }),
    birthDate: Joi.date()
      .iso()
      .allow(null, '')
      .messages({
        'date.base': 'تاريخ الميلاد يجب أن يكون تاريخ صحيح',
        'date.format': 'تاريخ الميلاد يجب أن يكون بصيغة YYYY-MM-DD'
      }),
    phone: Joi.string()
      .pattern(/^[+]?[1-9][\d\s\-()]{7,15}$/)
      .allow(null, '')
      .messages({
        'string.base': 'رقم الهاتف يجب أن يكون نص',
        'string.pattern.base': 'رقم الهاتف غير صحيح'
      }),
    avatar_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الصورة الشخصية يجب أن يكون نص',
        'string.uri': 'رابط الصورة الشخصية غير صحيح'
      }),
    is_email_verified: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'حالة التحقق من البريد الإلكتروني يجب أن تكون true أو false'
      }),
    is_phone_verified: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'حالة التحقق من رقم الهاتف يجب أن تكون true أو false'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث المستخدم
 */
export const updateUserSchema = {
  params: Joi.object({
    id: Joi.string()
      .required()
      .messages({
        'string.base': 'معرف المستخدم يجب أن يكون نص',
        'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغ',
        'any.required': 'معرف المستخدم مطلوب'
      })
  }),
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .messages({
        'string.base': 'اسم المستخدم يجب أن يكون نص',
        'string.empty': 'اسم المستخدم لا يمكن أن يكون فارغ',
        'string.min': 'اسم المستخدم يجب أن يكون على الأقل حرفين',
        'string.max': 'اسم المستخدم يجب أن يكون أقل من 50 حرف'
      }),
    email: Joi.string()
      .email()
      .messages({
        'string.base': 'البريد الإلكتروني يجب أن يكون نص',
        'string.empty': 'البريد الإلكتروني لا يمكن أن يكون فارغ',
        'string.email': 'البريد الإلكتروني غير صحيح'
      }),
    full_name: Joi.string()
      .min(2)
      .max(100)
      .messages({
        'string.base': 'الاسم الكامل يجب أن يكون نص',
        'string.empty': 'الاسم الكامل لا يمكن أن يكون فارغ',
        'string.min': 'الاسم الكامل يجب أن يكون على الأقل حرفين',
        'string.max': 'الاسم الكامل يجب أن يكون أقل من 100 حرف'
      }),
    birthDate: Joi.date()
      .iso()
      .allow(null, '')
      .messages({
        'date.base': 'تاريخ الميلاد يجب أن يكون تاريخ صحيح',
        'date.format': 'تاريخ الميلاد يجب أن يكون بصيغة YYYY-MM-DD'
      }),
    phone: Joi.string()
      .pattern(/^[+]?[1-9][\d\s\-()]{7,15}$/)
      .allow(null, '')
      .messages({
        'string.base': 'رقم الهاتف يجب أن يكون نص',
        'string.pattern.base': 'رقم الهاتف غير صحيح'
      }),
    avatar_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الصورة الشخصية يجب أن يكون نص',
        'string.uri': 'رابط الصورة الشخصية غير صحيح'
      }),
    is_email_verified: Joi.boolean()
      .messages({
        'boolean.base': 'حالة التحقق من البريد الإلكتروني يجب أن تكون true أو false'
      }),
    is_phone_verified: Joi.boolean()
      .messages({
        'boolean.base': 'حالة التحقق من رقم الهاتف يجب أن تكون true أو false'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};