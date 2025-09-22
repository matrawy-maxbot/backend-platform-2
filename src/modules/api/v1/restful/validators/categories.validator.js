import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات الفئات
 * @module CategoriesValidator
 */

/**
 * مخطط التحقق من معرف الفئة
 */
export const getCategoryByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الفئة يجب أن يكون رقم',
        'number.integer': 'معرف الفئة يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الفئة يجب أن يكون رقم موجب',
        'any.required': 'معرف الفئة مطلوب'
      })
  })
};

/**
 * مخطط إنشاء فئة جديدة
 */
export const createCategorySchema = {
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
    name: Joi.string()
      .max(255)
      .required()
      .messages({
        'string.base': 'اسم الفئة يجب أن يكون نص',
        'string.empty': 'اسم الفئة لا يمكن أن يكون فارغ',
        'string.max': 'اسم الفئة يجب أن يكون أقل من 255 حرف',
        'any.required': 'اسم الفئة مطلوب'
      }),
    slug: Joi.string()
      .max(255)
      .pattern(/^[a-z0-9-]+$/)
      .required()
      .messages({
        'string.base': 'الرابط المختصر يجب أن يكون نص',
        'string.empty': 'الرابط المختصر لا يمكن أن يكون فارغ',
        'string.max': 'الرابط المختصر يجب أن يكون أقل من 255 حرف',
        'string.pattern.base': 'الرابط المختصر يجب أن يحتوي على حروف صغيرة وأرقام وشرطات فقط',
        'any.required': 'الرابط المختصر مطلوب'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف الفئة يجب أن يكون نص'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط صورة الفئة يجب أن يكون نص',
        'string.uri': 'رابط صورة الفئة غير صحيح'
      }),
    sort_order: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'ترتيب الفئة يجب أن يكون رقم',
        'number.integer': 'ترتيب الفئة يجب أن يكون رقم صحيح',
        'number.min': 'ترتيب الفئة يجب أن يكون صفر أو أكثر'
      }),
    is_active: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'حالة تفعيل الفئة يجب أن تكون true أو false'
      }),
    parent_id: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'معرف الفئة الأب يجب أن يكون رقم',
        'number.integer': 'معرف الفئة الأب يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الفئة الأب يجب أن يكون رقم موجب'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث الفئة
 */
export const updateCategorySchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الفئة يجب أن يكون رقم',
        'number.integer': 'معرف الفئة يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الفئة يجب أن يكون رقم موجب',
        'any.required': 'معرف الفئة مطلوب'
      })
  }),
  body: Joi.object({
    name: Joi.string()
      .max(255)
      .messages({
        'string.base': 'اسم الفئة يجب أن يكون نص',
        'string.empty': 'اسم الفئة لا يمكن أن يكون فارغ',
        'string.max': 'اسم الفئة يجب أن يكون أقل من 255 حرف'
      }),
    slug: Joi.string()
      .max(255)
      .pattern(/^[a-z0-9-]+$/)
      .messages({
        'string.base': 'الرابط المختصر يجب أن يكون نص',
        'string.empty': 'الرابط المختصر لا يمكن أن يكون فارغ',
        'string.max': 'الرابط المختصر يجب أن يكون أقل من 255 حرف',
        'string.pattern.base': 'الرابط المختصر يجب أن يحتوي على حروف صغيرة وأرقام وشرطات فقط'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف الفئة يجب أن يكون نص'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط صورة الفئة يجب أن يكون نص',
        'string.uri': 'رابط صورة الفئة غير صحيح'
      }),
    sort_order: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'ترتيب الفئة يجب أن يكون رقم',
        'number.integer': 'ترتيب الفئة يجب أن يكون رقم صحيح',
        'number.min': 'ترتيب الفئة يجب أن يكون صفر أو أكثر'
      }),
    is_active: Joi.boolean()
      .messages({
        'boolean.base': 'حالة تفعيل الفئة يجب أن تكون true أو false'
      }),
    parent_id: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'معرف الفئة الأب يجب أن يكون رقم',
        'number.integer': 'معرف الفئة الأب يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الفئة الأب يجب أن يكون رقم موجب'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};