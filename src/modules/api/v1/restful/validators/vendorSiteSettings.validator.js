import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات إعدادات مواقع المتاجر
 * @module VendorSiteSettingsValidator
 */

/**
 * مخطط التحقق من معرف إعدادات الموقع
 */
export const getVendorSiteSettingByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف إعدادات الموقع يجب أن يكون رقم',
        'number.integer': 'معرف إعدادات الموقع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف إعدادات الموقع يجب أن يكون رقم موجب',
        'any.required': 'معرف إعدادات الموقع مطلوب'
      })
  })
};

/**
 * مخطط إنشاء إعدادات موقع متجر جديدة
 */
export const createVendorSiteSettingSchema = {
  body: Joi.object({
    vendor_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المتجر يجب أن يكون رقم',
        'number.integer': 'معرف المتجر يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المتجر يجب أن يكون رقم موجب',
        'any.required': 'معرف المتجر مطلوب'
      }),
    site_type: Joi.string()
      .max(50)
      .required()
      .messages({
        'string.base': 'نوع الموقع يجب أن يكون نص',
        'string.empty': 'نوع الموقع لا يمكن أن يكون فارغ',
        'string.max': 'نوع الموقع يجب أن يكون أقل من 50 حرف',
        'any.required': 'نوع الموقع مطلوب'
      }),
    theme_color: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .default('#3B82F6')
      .messages({
        'string.base': 'لون القالب يجب أن يكون نص',
        'string.pattern.base': 'لون القالب يجب أن يكون بصيغة hex صحيحة (مثل #3B82F6)'
      }),
    logo_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الشعار يجب أن يكون نص',
        'string.uri': 'رابط الشعار غير صحيح'
      }),
    banner_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط البانر يجب أن يكون نص',
        'string.uri': 'رابط البانر غير صحيح'
      }),
    custom_domain: Joi.string()
      .max(100)
      .pattern(/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/)
      .allow(null, '')
      .messages({
        'string.base': 'الدومين المخصص يجب أن يكون نص',
        'string.max': 'الدومين المخصص يجب أن يكون أقل من 100 حرف',
        'string.pattern.base': 'الدومين المخصص غير صحيح'
      }),
    is_custom_domain_verified: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'حالة تأكيد الدومين المخصص يجب أن تكون true أو false'
      }),
    site_title: Joi.string()
      .max(255)
      .allow(null, '')
      .messages({
        'string.base': 'عنوان الموقع يجب أن يكون نص',
        'string.max': 'عنوان الموقع يجب أن يكون أقل من 255 حرف'
      }),
    meta_description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف الموقع يجب أن يكون نص'
      }),
    is_active: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'حالة تفعيل الموقع يجب أن تكون true أو false'
      }),
    maintenance_mode: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'وضع الصيانة يجب أن يكون true أو false'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث إعدادات موقع المتجر
 */
export const updateVendorSiteSettingSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف إعدادات الموقع يجب أن يكون رقم',
        'number.integer': 'معرف إعدادات الموقع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف إعدادات الموقع يجب أن يكون رقم موجب',
        'any.required': 'معرف إعدادات الموقع مطلوب'
      })
  }),
  body: Joi.object({
    site_type: Joi.string()
      .max(50)
      .messages({
        'string.base': 'نوع الموقع يجب أن يكون نص',
        'string.empty': 'نوع الموقع لا يمكن أن يكون فارغ',
        'string.max': 'نوع الموقع يجب أن يكون أقل من 50 حرف'
      }),
    theme_color: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .messages({
        'string.base': 'لون القالب يجب أن يكون نص',
        'string.pattern.base': 'لون القالب يجب أن يكون بصيغة hex صحيحة (مثل #3B82F6)'
      }),
    logo_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الشعار يجب أن يكون نص',
        'string.uri': 'رابط الشعار غير صحيح'
      }),
    banner_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط البانر يجب أن يكون نص',
        'string.uri': 'رابط البانر غير صحيح'
      }),
    custom_domain: Joi.string()
      .max(100)
      .pattern(/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/)
      .allow(null, '')
      .messages({
        'string.base': 'الدومين المخصص يجب أن يكون نص',
        'string.max': 'الدومين المخصص يجب أن يكون أقل من 100 حرف',
        'string.pattern.base': 'الدومين المخصص غير صحيح'
      }),
    is_custom_domain_verified: Joi.boolean()
      .messages({
        'boolean.base': 'حالة تأكيد الدومين المخصص يجب أن تكون true أو false'
      }),
    site_title: Joi.string()
      .max(255)
      .allow(null, '')
      .messages({
        'string.base': 'عنوان الموقع يجب أن يكون نص',
        'string.max': 'عنوان الموقع يجب أن يكون أقل من 255 حرف'
      }),
    meta_description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'وصف الموقع يجب أن يكون نص'
      }),
    is_active: Joi.boolean()
      .messages({
        'boolean.base': 'حالة تفعيل الموقع يجب أن تكون true أو false'
      }),
    maintenance_mode: Joi.boolean()
      .messages({
        'boolean.base': 'وضع الصيانة يجب أن يكون true أو false'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};