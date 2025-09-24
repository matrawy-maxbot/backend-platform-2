import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات إعدادات البائعين
 * @module VendorSettingsValidator
 */

/**
 * مخطط التحقق من معرف إعدادات البائع
 */
export const getVendorSettingsByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      })
  })
};

/**
 * مخطط إنشاء إعدادات بائع جديد
 */
export const createVendorSettingsSchema = {
  body: Joi.object({
    vendor_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      }),
    business_type: Joi.string()
      .valid('clothing', 'electronics', 'food', 'furniture', 'other')
      .required()
      .messages({
        'string.base': 'نوع النشاط التجاري يجب أن يكون نص',
        'any.only': 'نوع النشاط التجاري يجب أن يكون إحدى القيم: clothing, electronics, food, furniture, other',
        'any.required': 'نوع النشاط التجاري مطلوب'
      }),
    shipping_policy: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'سياسة الشحن يجب أن تكون نص',
        'string.max': 'سياسة الشحن يجب أن تكون أقل من 1000 حرف'
      }),
    return_policy: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'سياسة الإرجاع يجب أن تكون نص',
        'string.max': 'سياسة الإرجاع يجب أن تكون أقل من 1000 حرف'
      }),
    theme_color: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .default('#3B82F6')
      .messages({
        'string.base': 'لون الموضوع يجب أن يكون نص',
        'string.pattern.base': 'لون الموضوع يجب أن يكون بصيغة hex صحيحة (مثل #3B82F6)'
      }),
    currency: Joi.string()
      .length(3)
      .uppercase()
      .default('EGP')
      .messages({
        'string.base': 'العملة يجب أن تكون نص',
        'string.length': 'العملة يجب أن تكون 3 أحرف',
        'string.uppercase': 'العملة يجب أن تكون بأحرف كبيرة'
      }),
    timezone: Joi.string()
      .default('Africa/Cairo')
      .messages({
        'string.base': 'المنطقة الزمنية يجب أن تكون نص'
      }),
    business_hours: Joi.object({
      sunday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      monday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      tuesday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      wednesday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      thursday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      friday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      saturday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      })
    }).messages({
      'object.base': 'ساعات العمل يجب أن تكون كائن',
      'string.pattern.base': 'الوقت يجب أن يكون بصيغة HH:MM'
    }),
    social_media: Joi.object({
      facebook: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'رابط فيسبوك يجب أن يكون رابط صحيح'
      }),
      instagram: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'رابط إنستغرام يجب أن يكون رابط صحيح'
      }),
      twitter: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'رابط تويتر يجب أن يكون رابط صحيح'
      }),
      youtube: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'رابط يوتيوب يجب أن يكون رابط صحيح'
      })
    }).messages({
      'object.base': 'وسائل التواصل الاجتماعي يجب أن تكون كائن'
    })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث إعدادات البائع
 */
export const updateVendorSettingsSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      })
  }),
  body: Joi.object({
    business_type: Joi.string()
      .valid('clothing', 'electronics', 'food', 'furniture', 'other')
      .messages({
        'string.base': 'نوع النشاط التجاري يجب أن يكون نص',
        'any.only': 'نوع النشاط التجاري يجب أن يكون إحدى القيم: clothing, electronics, food, furniture, other'
      }),
    shipping_policy: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'سياسة الشحن يجب أن تكون نص',
        'string.max': 'سياسة الشحن يجب أن تكون أقل من 1000 حرف'
      }),
    return_policy: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'سياسة الإرجاع يجب أن تكون نص',
        'string.max': 'سياسة الإرجاع يجب أن تكون أقل من 1000 حرف'
      }),
    theme_color: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .messages({
        'string.base': 'لون الموضوع يجب أن يكون نص',
        'string.pattern.base': 'لون الموضوع يجب أن يكون بصيغة hex صحيحة (مثل #3B82F6)'
      }),
    currency: Joi.string()
      .length(3)
      .uppercase()
      .messages({
        'string.base': 'العملة يجب أن تكون نص',
        'string.length': 'العملة يجب أن تكون 3 أحرف',
        'string.uppercase': 'العملة يجب أن تكون بأحرف كبيرة'
      }),
    timezone: Joi.string()
      .messages({
        'string.base': 'المنطقة الزمنية يجب أن تكون نص'
      }),
    business_hours: Joi.object({
      sunday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      monday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      tuesday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      wednesday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      thursday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      friday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      }),
      saturday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, ''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(null, '')
      })
    }).messages({
      'object.base': 'ساعات العمل يجب أن تكون كائن',
      'string.pattern.base': 'الوقت يجب أن يكون بصيغة HH:MM'
    }),
    social_media: Joi.object({
      facebook: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'رابط فيسبوك يجب أن يكون رابط صحيح'
      }),
      instagram: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'رابط إنستغرام يجب أن يكون رابط صحيح'
      }),
      twitter: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'رابط تويتر يجب أن يكون رابط صحيح'
      }),
      youtube: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'رابط يوتيوب يجب أن يكون رابط صحيح'
      })
    }).messages({
      'object.base': 'وسائل التواصل الاجتماعي يجب أن تكون كائن'
    })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};