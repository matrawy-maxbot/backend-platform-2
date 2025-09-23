import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات المحتوى الديناميكي للبائعين
 * @module VendorDynamicContentValidator
 */

/**
 * مخطط التحقق من معرف المحتوى الديناميكي للبائع
 */
export const getVendorDynamicContentByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .required()
      .messages({
        'string.base': 'معرف المحتوى الديناميكي يجب أن يكون نص',
        'string.empty': 'معرف المحتوى الديناميكي لا يمكن أن يكون فارغ',
        'any.required': 'معرف المحتوى الديناميكي مطلوب'
      })
  })
};

/**
 * مخطط إنشاء محتوى ديناميكي جديد للبائع
 */
export const createVendorDynamicContentSchema = {
  body: Joi.object({
    vendorId: Joi.string()
      .required()
      .messages({
        'string.base': 'معرف البائع يجب أن يكون نص',
        'string.empty': 'معرف البائع لا يمكن أن يكون فارغ',
        'any.required': 'معرف البائع مطلوب'
      }),
    banners: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().max(200).messages({
            'string.base': 'عنوان البانر يجب أن يكون نص',
            'string.max': 'عنوان البانر يجب أن يكون أقل من 200 حرف'
          }),
          description: Joi.string().max(500).messages({
            'string.base': 'وصف البانر يجب أن يكون نص',
            'string.max': 'وصف البانر يجب أن يكون أقل من 500 حرف'
          }),
          imageUrl: Joi.string().uri().messages({
            'string.base': 'رابط صورة البانر يجب أن يكون نص',
            'string.uri': 'رابط صورة البانر يجب أن يكون رابط صحيح'
          }),
          link: Joi.string().uri().messages({
            'string.base': 'رابط البانر يجب أن يكون نص',
            'string.uri': 'رابط البانر يجب أن يكون رابط صحيح'
          }),
          isActive: Joi.boolean().default(true).messages({
            'boolean.base': 'حالة البانر يجب أن تكون true أو false'
          })
        })
      )
      .default([])
      .messages({
        'array.base': 'البانرات يجب أن تكون مصفوفة'
      }),
    categories: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().max(100).messages({
            'string.base': 'اسم الفئة يجب أن يكون نص',
            'string.max': 'اسم الفئة يجب أن يكون أقل من 100 حرف'
          }),
          description: Joi.string().max(300).messages({
            'string.base': 'وصف الفئة يجب أن يكون نص',
            'string.max': 'وصف الفئة يجب أن يكون أقل من 300 حرف'
          }),
          imageUrl: Joi.string().uri().messages({
            'string.base': 'رابط صورة الفئة يجب أن يكون نص',
            'string.uri': 'رابط صورة الفئة يجب أن يكون رابط صحيح'
          }),
          isActive: Joi.boolean().default(true).messages({
            'boolean.base': 'حالة الفئة يجب أن تكون true أو false'
          })
        })
      )
      .default([])
      .messages({
        'array.base': 'الفئات يجب أن تكون مصفوفة'
      }),
    featuredProducts: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required().messages({
            'string.base': 'معرف المنتج يجب أن يكون نص',
            'string.empty': 'معرف المنتج لا يمكن أن يكون فارغ',
            'any.required': 'معرف المنتج مطلوب'
          }),
          priority: Joi.number().integer().min(1).default(1).messages({
            'number.base': 'أولوية المنتج يجب أن تكون رقم',
            'number.integer': 'أولوية المنتج يجب أن تكون رقم صحيح',
            'number.min': 'أولوية المنتج يجب أن تكون 1 أو أكثر'
          })
        })
      )
      .default([])
      .messages({
        'array.base': 'المنتجات المميزة يجب أن تكون مصفوفة'
      }),
    socialLinks: Joi.object({
      facebook: Joi.string().uri().allow('').messages({
        'string.base': 'رابط فيسبوك يجب أن يكون نص',
        'string.uri': 'رابط فيسبوك يجب أن يكون رابط صحيح'
      }),
      twitter: Joi.string().uri().allow('').messages({
        'string.base': 'رابط تويتر يجب أن يكون نص',
        'string.uri': 'رابط تويتر يجب أن يكون رابط صحيح'
      }),
      instagram: Joi.string().uri().allow('').messages({
        'string.base': 'رابط انستغرام يجب أن يكون نص',
        'string.uri': 'رابط انستغرام يجب أن يكون رابط صحيح'
      }),
      linkedin: Joi.string().uri().allow('').messages({
        'string.base': 'رابط لينكد إن يجب أن يكون نص',
        'string.uri': 'رابط لينكد إن يجب أن يكون رابط صحيح'
      })
    }).default({}).messages({
      'object.base': 'الروابط الاجتماعية يجب أن تكون كائن'
    })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث المحتوى الديناميكي للبائع
 */
export const updateVendorDynamicContentSchema = {
  params: Joi.object({
    id: Joi.string()
      .required()
      .messages({
        'string.base': 'معرف المحتوى الديناميكي يجب أن يكون نص',
        'string.empty': 'معرف المحتوى الديناميكي لا يمكن أن يكون فارغ',
        'any.required': 'معرف المحتوى الديناميكي مطلوب'
      })
  }),
  body: Joi.object({
    banners: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().max(200).messages({
            'string.base': 'عنوان البانر يجب أن يكون نص',
            'string.max': 'عنوان البانر يجب أن يكون أقل من 200 حرف'
          }),
          description: Joi.string().max(500).messages({
            'string.base': 'وصف البانر يجب أن يكون نص',
            'string.max': 'وصف البانر يجب أن يكون أقل من 500 حرف'
          }),
          imageUrl: Joi.string().uri().messages({
            'string.base': 'رابط صورة البانر يجب أن يكون نص',
            'string.uri': 'رابط صورة البانر يجب أن يكون رابط صحيح'
          }),
          link: Joi.string().uri().messages({
            'string.base': 'رابط البانر يجب أن يكون نص',
            'string.uri': 'رابط البانر يجب أن يكون رابط صحيح'
          }),
          isActive: Joi.boolean().messages({
            'boolean.base': 'حالة البانر يجب أن تكون true أو false'
          })
        })
      )
      .messages({
        'array.base': 'البانرات يجب أن تكون مصفوفة'
      }),
    categories: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().max(100).messages({
            'string.base': 'اسم الفئة يجب أن يكون نص',
            'string.max': 'اسم الفئة يجب أن يكون أقل من 100 حرف'
          }),
          description: Joi.string().max(300).messages({
            'string.base': 'وصف الفئة يجب أن يكون نص',
            'string.max': 'وصف الفئة يجب أن يكون أقل من 300 حرف'
          }),
          imageUrl: Joi.string().uri().messages({
            'string.base': 'رابط صورة الفئة يجب أن يكون نص',
            'string.uri': 'رابط صورة الفئة يجب أن يكون رابط صحيح'
          }),
          isActive: Joi.boolean().messages({
            'boolean.base': 'حالة الفئة يجب أن تكون true أو false'
          })
        })
      )
      .messages({
        'array.base': 'الفئات يجب أن تكون مصفوفة'
      }),
    featuredProducts: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().messages({
            'string.base': 'معرف المنتج يجب أن يكون نص',
            'string.empty': 'معرف المنتج لا يمكن أن يكون فارغ'
          }),
          priority: Joi.number().integer().min(1).messages({
            'number.base': 'أولوية المنتج يجب أن تكون رقم',
            'number.integer': 'أولوية المنتج يجب أن تكون رقم صحيح',
            'number.min': 'أولوية المنتج يجب أن تكون 1 أو أكثر'
          })
        })
      )
      .messages({
        'array.base': 'المنتجات المميزة يجب أن تكون مصفوفة'
      }),
    socialLinks: Joi.object({
      facebook: Joi.string().uri().allow('').messages({
        'string.base': 'رابط فيسبوك يجب أن يكون نص',
        'string.uri': 'رابط فيسبوك يجب أن يكون رابط صحيح'
      }),
      twitter: Joi.string().uri().allow('').messages({
        'string.base': 'رابط تويتر يجب أن يكون نص',
        'string.uri': 'رابط تويتر يجب أن يكون رابط صحيح'
      }),
      instagram: Joi.string().uri().allow('').messages({
        'string.base': 'رابط انستغرام يجب أن يكون نص',
        'string.uri': 'رابط انستغرام يجب أن يكون رابط صحيح'
      }),
      linkedin: Joi.string().uri().allow('').messages({
        'string.base': 'رابط لينكد إن يجب أن يكون نص',
        'string.uri': 'رابط لينكد إن يجب أن يكون رابط صحيح'
      })
    }).messages({
      'object.base': 'الروابط الاجتماعية يجب أن تكون كائن'
    })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};