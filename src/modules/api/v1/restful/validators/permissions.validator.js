import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات الصلاحيات
 * @module PermissionsValidator
 */

/**
 * مخطط التحقق من معرف الصلاحية
 */
export const getPermissionByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الصلاحية يجب أن يكون رقم',
        'number.integer': 'معرف الصلاحية يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الصلاحية يجب أن يكون رقم موجب',
        'any.required': 'معرف الصلاحية مطلوب'
      })
  })
};

/**
 * مخطط إنشاء صلاحية جديدة
 */
export const createPermissionSchema = {
  body: Joi.object({
    code: Joi.string()
      .max(100)
      .pattern(/^[a-z_]+$/)
      .required()
      .messages({
        'string.base': 'كود الصلاحية يجب أن يكون نص',
        'string.empty': 'كود الصلاحية لا يمكن أن يكون فارغ',
        'string.max': 'كود الصلاحية يجب أن يكون أقل من 100 حرف',
        'string.pattern.base': 'كود الصلاحية يجب أن يحتوي على حروف صغيرة وشرطات سفلية فقط',
        'any.required': 'كود الصلاحية مطلوب'
      }),
    name: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.base': 'اسم الصلاحية يجب أن يكون نص',
        'string.empty': 'اسم الصلاحية لا يمكن أن يكون فارغ',
        'string.max': 'اسم الصلاحية يجب أن يكون أقل من 100 حرف',
        'any.required': 'اسم الصلاحية مطلوب'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف الصلاحية يجب أن يكون نص'
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
    category_id: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'معرف فئة الصلاحية يجب أن يكون رقم',
        'number.integer': 'معرف فئة الصلاحية يجب أن يكون رقم صحيح',
        'number.positive': 'معرف فئة الصلاحية يجب أن يكون رقم موجب'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث الصلاحية
 */
export const updatePermissionSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الصلاحية يجب أن يكون رقم',
        'number.integer': 'معرف الصلاحية يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الصلاحية يجب أن يكون رقم موجب',
        'any.required': 'معرف الصلاحية مطلوب'
      })
  }),
  body: Joi.object({
    code: Joi.string()
      .max(100)
      .pattern(/^[a-z_]+$/)
      .messages({
        'string.base': 'كود الصلاحية يجب أن يكون نص',
        'string.empty': 'كود الصلاحية لا يمكن أن يكون فارغ',
        'string.max': 'كود الصلاحية يجب أن يكون أقل من 100 حرف',
        'string.pattern.base': 'كود الصلاحية يجب أن يحتوي على حروف صغيرة وشرطات سفلية فقط'
      }),
    name: Joi.string()
      .max(100)
      .messages({
        'string.base': 'اسم الصلاحية يجب أن يكون نص',
        'string.empty': 'اسم الصلاحية لا يمكن أن يكون فارغ',
        'string.max': 'اسم الصلاحية يجب أن يكون أقل من 100 حرف'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف الصلاحية يجب أن يكون نص'
      }),
    site_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'معرف الموقع يجب أن يكون رقم',
        'number.integer': 'معرف الموقع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الموقع يجب أن يكون رقم موجب'
      }),
    category_id: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'معرف فئة الصلاحية يجب أن يكون رقم',
        'number.integer': 'معرف فئة الصلاحية يجب أن يكون رقم صحيح',
        'number.positive': 'معرف فئة الصلاحية يجب أن يكون رقم موجب'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};