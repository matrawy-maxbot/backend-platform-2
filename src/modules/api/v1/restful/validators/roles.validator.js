import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات الأدوار
 * @module RolesValidator
 */

/**
 * مخطط التحقق من معرف الدور
 */
export const getRoleByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الدور يجب أن يكون رقم',
        'number.integer': 'معرف الدور يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الدور يجب أن يكون رقم موجب',
        'any.required': 'معرف الدور مطلوب'
      })
  })
};

/**
 * مخطط إنشاء دور جديد
 */
export const createRoleSchema = {
  body: Joi.object({
    name: Joi.string()
      .max(50)
      .required()
      .messages({
        'string.base': 'اسم الدور يجب أن يكون نص',
        'string.empty': 'اسم الدور لا يمكن أن يكون فارغ',
        'string.max': 'اسم الدور يجب أن يكون أقل من 50 حرف',
        'any.required': 'اسم الدور مطلوب'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف الدور يجب أن يكون نص'
      }),
    permissions: Joi.object()
      .default({})
      .messages({
        'object.base': 'صلاحيات الدور يجب أن تكون كائن JSON'
      }),
    is_default: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'حقل الدور الافتراضي يجب أن يكون قيمة منطقية'
      }),
    is_active: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'حالة تفعيل الدور يجب أن تكون قيمة منطقية'
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
 * مخطط تحديث الدور
 */
export const updateRoleSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الدور يجب أن يكون رقم',
        'number.integer': 'معرف الدور يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الدور يجب أن يكون رقم موجب',
        'any.required': 'معرف الدور مطلوب'
      })
  }),
  body: Joi.object({
    name: Joi.string()
      .max(50)
      .messages({
        'string.base': 'اسم الدور يجب أن يكون نص',
        'string.empty': 'اسم الدور لا يمكن أن يكون فارغ',
        'string.max': 'اسم الدور يجب أن يكون أقل من 50 حرف'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف الدور يجب أن يكون نص'
      }),
    permissions: Joi.object()
      .messages({
        'object.base': 'صلاحيات الدور يجب أن تكون كائن JSON'
      }),
    is_default: Joi.boolean()
      .messages({
        'boolean.base': 'حقل الدور الافتراضي يجب أن يكون قيمة منطقية'
      }),
    is_active: Joi.boolean()
      .messages({
        'boolean.base': 'حالة تفعيل الدور يجب أن تكون قيمة منطقية'
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