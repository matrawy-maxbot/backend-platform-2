import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات فئات الصلاحيات
 * @module PermissionCategoriesValidator
 */

/**
 * مخطط التحقق من معرف فئة الصلاحيات
 */
export const getPermissionCategoryByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف فئة الصلاحيات يجب أن يكون رقم',
        'number.integer': 'معرف فئة الصلاحيات يجب أن يكون رقم صحيح',
        'number.positive': 'معرف فئة الصلاحيات يجب أن يكون رقم موجب',
        'any.required': 'معرف فئة الصلاحيات مطلوب'
      })
  })
};

/**
 * مخطط إنشاء فئة صلاحيات جديدة
 */
export const createPermissionCategorySchema = {
  body: Joi.object({
    name: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.base': 'اسم فئة الصلاحيات يجب أن يكون نص',
        'string.empty': 'اسم فئة الصلاحيات لا يمكن أن يكون فارغ',
        'string.max': 'اسم فئة الصلاحيات يجب أن يكون أقل من 100 حرف',
        'any.required': 'اسم فئة الصلاحيات مطلوب'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف فئة الصلاحيات يجب أن يكون نص'
      }),
    sort_order: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'ترتيب العرض يجب أن يكون رقم',
        'number.integer': 'ترتيب العرض يجب أن يكون رقم صحيح',
        'number.min': 'ترتيب العرض يجب أن يكون صفر أو أكثر'
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
 * مخطط تحديث فئة الصلاحيات
 */
export const updatePermissionCategorySchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف فئة الصلاحيات يجب أن يكون رقم',
        'number.integer': 'معرف فئة الصلاحيات يجب أن يكون رقم صحيح',
        'number.positive': 'معرف فئة الصلاحيات يجب أن يكون رقم موجب',
        'any.required': 'معرف فئة الصلاحيات مطلوب'
      })
  }),
  body: Joi.object({
    name: Joi.string()
      .max(100)
      .messages({
        'string.base': 'اسم فئة الصلاحيات يجب أن يكون نص',
        'string.empty': 'اسم فئة الصلاحيات لا يمكن أن يكون فارغ',
        'string.max': 'اسم فئة الصلاحيات يجب أن يكون أقل من 100 حرف'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف فئة الصلاحيات يجب أن يكون نص'
      }),
    sort_order: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'ترتيب العرض يجب أن يكون رقم',
        'number.integer': 'ترتيب العرض يجب أن يكون رقم صحيح',
        'number.min': 'ترتيب العرض يجب أن يكون صفر أو أكثر'
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