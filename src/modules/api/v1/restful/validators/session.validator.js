import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات الجلسات
 * @module SessionValidator
 */

/**
 * مخطط التحقق من معرف الجلسة
 */
export const getSessionByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف الجلسة يجب أن يكون نص',
        'string.pattern.base': 'معرف الجلسة يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف الجلسة مطلوب'
      })
  })
};

/**
 * مخطط إنشاء جلسة جديدة
 */
export const createSessionSchema = {
  body: Joi.object({
    user_id: Joi.string()
      .required()
      .messages({
        'string.base': 'معرف المستخدم يجب أن يكون نص',
        'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغ',
        'any.required': 'معرف المستخدم مطلوب'
      }),
    token: Joi.string()
      .required()
      .messages({
        'string.base': 'رمز الجلسة يجب أن يكون نص',
        'string.empty': 'رمز الجلسة لا يمكن أن يكون فارغ',
        'any.required': 'رمز الجلسة مطلوب'
      }),
    device_info: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'معلومات الجهاز يجب أن تكون نص',
        'string.max': 'معلومات الجهاز يجب أن تكون أقل من 500 حرف'
      }),
    ip_address: Joi.string()
      .ip()
      .allow(null, '')
      .messages({
        'string.base': 'عنوان IP يجب أن يكون نص',
        'string.ip': 'عنوان IP يجب أن يكون صحيح'
      }),
    expires_at: Joi.date()
      .iso()
      .required()
      .messages({
        'date.base': 'تاريخ انتهاء الصلاحية يجب أن يكون تاريخ صحيح',
        'date.format': 'تاريخ انتهاء الصلاحية يجب أن يكون بصيغة ISO',
        'any.required': 'تاريخ انتهاء الصلاحية مطلوب'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث الجلسة
 */
export const updateSessionSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف الجلسة يجب أن يكون نص',
        'string.pattern.base': 'معرف الجلسة يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف الجلسة مطلوب'
      })
  }),
  body: Joi.object({
    token: Joi.string()
      .messages({
        'string.base': 'رمز الجلسة يجب أن يكون نص',
        'string.empty': 'رمز الجلسة لا يمكن أن يكون فارغ'
      }),
    device_info: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'معلومات الجهاز يجب أن تكون نص',
        'string.max': 'معلومات الجهاز يجب أن تكون أقل من 500 حرف'
      }),
    ip_address: Joi.string()
      .ip()
      .allow(null, '')
      .messages({
        'string.base': 'عنوان IP يجب أن يكون نص',
        'string.ip': 'عنوان IP يجب أن يكون صحيح'
      }),
    expires_at: Joi.date()
      .iso()
      .messages({
        'date.base': 'تاريخ انتهاء الصلاحية يجب أن يكون تاريخ صحيح',
        'date.format': 'تاريخ انتهاء الصلاحية يجب أن يكون بصيغة ISO'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};