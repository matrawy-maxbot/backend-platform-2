import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات تفاصيل المنتجات
 * @module ProductDetailsValidator
 */

/**
 * مخطط التحقق من معرف تفاصيل المنتج
 */
export const getProductDetailsByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف تفاصيل المنتج يجب أن يكون نص',
        'string.pattern.base': 'معرف تفاصيل المنتج يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف تفاصيل المنتج مطلوب'
      })
  })
};

/**
 * مخطط إنشاء تفاصيل منتج جديد
 */
export const createProductDetailsSchema = {
  body: Joi.object({
    product_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المنتج يجب أن يكون رقم',
        'number.integer': 'معرف المنتج يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المنتج يجب أن يكون رقم موجب',
        'any.required': 'معرف المنتج مطلوب'
      }),
    name: Joi.string()
      .max(255)
      .required()
      .messages({
        'string.base': 'اسم المنتج يجب أن يكون نص',
        'string.empty': 'اسم المنتج لا يمكن أن يكون فارغ',
        'string.max': 'اسم المنتج يجب أن يكون أقل من 255 حرف',
        'any.required': 'اسم المنتج مطلوب'
      }),
    description: Joi.string()
      .max(2000)
      .allow(null, '')
      .messages({
        'string.base': 'وصف المنتج يجب أن يكون نص',
        'string.max': 'وصف المنتج يجب أن يكون أقل من 2000 حرف'
      }),
    specifications: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'مواصفات المنتج يجب أن تكون كائن'
      }),
    features: Joi.array()
      .items(Joi.string().max(255))
      .allow(null)
      .messages({
        'array.base': 'ميزات المنتج يجب أن تكون مصفوفة',
        'string.max': 'كل ميزة يجب أن تكون أقل من 255 حرف'
      }),
    images: Joi.array()
      .items(Joi.string().uri())
      .allow(null)
      .messages({
        'array.base': 'صور المنتج يجب أن تكون مصفوفة',
        'string.uri': 'كل صورة يجب أن تكون رابط صحيح'
      }),
    category: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'فئة المنتج يجب أن تكون نص',
        'string.max': 'فئة المنتج يجب أن تكون أقل من 100 حرف'
      }),
    brand: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'علامة المنتج التجارية يجب أن تكون نص',
        'string.max': 'علامة المنتج التجارية يجب أن تكون أقل من 100 حرف'
      }),
    tags: Joi.array()
      .items(Joi.string().max(50))
      .allow(null)
      .messages({
        'array.base': 'علامات المنتج يجب أن تكون مصفوفة',
        'string.max': 'كل علامة يجب أن تكون أقل من 50 حرف'
      }),
    warranty_info: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'معلومات الضمان يجب أن تكون نص',
        'string.max': 'معلومات الضمان يجب أن تكون أقل من 500 حرف'
      }),
    care_instructions: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'تعليمات العناية يجب أن تكون نص',
        'string.max': 'تعليمات العناية يجب أن تكون أقل من 1000 حرف'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث تفاصيل المنتج
 */
export const updateProductDetailsSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف تفاصيل المنتج يجب أن يكون نص',
        'string.pattern.base': 'معرف تفاصيل المنتج يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف تفاصيل المنتج مطلوب'
      })
  }),
  body: Joi.object({
    name: Joi.string()
      .max(255)
      .messages({
        'string.base': 'اسم المنتج يجب أن يكون نص',
        'string.empty': 'اسم المنتج لا يمكن أن يكون فارغ',
        'string.max': 'اسم المنتج يجب أن يكون أقل من 255 حرف'
      }),
    description: Joi.string()
      .max(2000)
      .allow(null, '')
      .messages({
        'string.base': 'وصف المنتج يجب أن يكون نص',
        'string.max': 'وصف المنتج يجب أن يكون أقل من 2000 حرف'
      }),
    specifications: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'مواصفات المنتج يجب أن تكون كائن'
      }),
    features: Joi.array()
      .items(Joi.string().max(255))
      .allow(null)
      .messages({
        'array.base': 'ميزات المنتج يجب أن تكون مصفوفة',
        'string.max': 'كل ميزة يجب أن تكون أقل من 255 حرف'
      }),
    images: Joi.array()
      .items(Joi.string().uri())
      .allow(null)
      .messages({
        'array.base': 'صور المنتج يجب أن تكون مصفوفة',
        'string.uri': 'كل صورة يجب أن تكون رابط صحيح'
      }),
    category: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'فئة المنتج يجب أن تكون نص',
        'string.max': 'فئة المنتج يجب أن تكون أقل من 100 حرف'
      }),
    brand: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'علامة المنتج التجارية يجب أن تكون نص',
        'string.max': 'علامة المنتج التجارية يجب أن تكون أقل من 100 حرف'
      }),
    tags: Joi.array()
      .items(Joi.string().max(50))
      .allow(null)
      .messages({
        'array.base': 'علامات المنتج يجب أن تكون مصفوفة',
        'string.max': 'كل علامة يجب أن تكون أقل من 50 حرف'
      }),
    warranty_info: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'معلومات الضمان يجب أن تكون نص',
        'string.max': 'معلومات الضمان يجب أن تكون أقل من 500 حرف'
      }),
    care_instructions: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'تعليمات العناية يجب أن تكون نص',
        'string.max': 'تعليمات العناية يجب أن تكون أقل من 1000 حرف'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};