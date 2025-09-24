import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات إعدادات شركات البائعين
 * @module VendorCompanySettingsValidator
 */

/**
 * مخطط التحقق من معرف البائع
 */
export const getVendorCompanySettingsByIdSchema = {
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
 * مخطط إنشاء إعدادات شركة جديدة
 */
export const createVendorCompanySettingsSchema = {
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
    company_name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        'string.base': 'اسم الشركة يجب أن يكون نص',
        'string.empty': 'اسم الشركة لا يمكن أن يكون فارغ',
        'string.min': 'اسم الشركة يجب أن يكون على الأقل حرفين',
        'string.max': 'اسم الشركة يجب أن يكون أقل من 255 حرف',
        'any.required': 'اسم الشركة مطلوب'
      }),
    tax_number: Joi.string()
      .max(50)
      .allow(null, '')
      .messages({
        'string.base': 'الرقم الضريبي يجب أن يكون نص',
        'string.max': 'الرقم الضريبي يجب أن يكون أقل من 50 حرف'
      }),
    commercial_registration: Joi.string()
      .max(50)
      .allow(null, '')
      .messages({
        'string.base': 'السجل التجاري يجب أن يكون نص',
        'string.max': 'السجل التجاري يجب أن يكون أقل من 50 حرف'
      }),
    phone: Joi.string()
      .pattern(/^[+]?[0-9\s\-\(\)]+$/)
      .max(20)
      .allow(null, '')
      .messages({
        'string.base': 'رقم الهاتف يجب أن يكون نص',
        'string.pattern.base': 'رقم الهاتف غير صحيح',
        'string.max': 'رقم الهاتف يجب أن يكون أقل من 20 حرف'
      }),
    email: Joi.string()
      .email()
      .max(255)
      .allow(null, '')
      .messages({
        'string.base': 'البريد الإلكتروني يجب أن يكون نص',
        'string.email': 'البريد الإلكتروني غير صحيح',
        'string.max': 'البريد الإلكتروني يجب أن يكون أقل من 255 حرف'
      }),
    address: Joi.object({
      country: Joi.string().max(100).allow(null, ''),
      city: Joi.string().max(100).allow(null, ''),
      street: Joi.string().max(255).allow(null, ''),
      building: Joi.string().max(50).allow(null, ''),
      apartment: Joi.string().max(50).allow(null, ''),
      postal_code: Joi.string().max(20).allow(null, '')
    }).allow(null),
    invoice_settings: Joi.object({
      prefix: Joi.string().max(10).default('INV-'),
      next_number: Joi.number().integer().min(1).default(1),
      terms: Joi.string().max(1000).allow(null, ''),
      due_days: Joi.number().integer().min(0).default(30)
    }).allow(null),
    order_settings: Joi.object({
      prefix: Joi.string().max(10).default('ORD-'),
      next_number: Joi.number().integer().min(1).default(1)
    }).allow(null),
    tax_settings: Joi.object({
      enabled: Joi.boolean().default(true),
      percentage: Joi.number().min(0).max(100).default(14),
      tax_number: Joi.string().max(50).allow(null, '')
    }).allow(null),
    currency_settings: Joi.object({
      code: Joi.string().length(3).default('EGP'),
      symbol: Joi.string().max(5).default('ج.م'),
      position: Joi.string().valid('left', 'right').default('right')
    }).allow(null)
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث إعدادات الشركة
 */
export const updateVendorCompanySettingsSchema = {
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
    company_name: Joi.string()
      .min(2)
      .max(255)
      .messages({
        'string.base': 'اسم الشركة يجب أن يكون نص',
        'string.empty': 'اسم الشركة لا يمكن أن يكون فارغ',
        'string.min': 'اسم الشركة يجب أن يكون على الأقل حرفين',
        'string.max': 'اسم الشركة يجب أن يكون أقل من 255 حرف'
      }),
    tax_number: Joi.string()
      .max(50)
      .allow(null, '')
      .messages({
        'string.base': 'الرقم الضريبي يجب أن يكون نص',
        'string.max': 'الرقم الضريبي يجب أن يكون أقل من 50 حرف'
      }),
    commercial_registration: Joi.string()
      .max(50)
      .allow(null, '')
      .messages({
        'string.base': 'السجل التجاري يجب أن يكون نص',
        'string.max': 'السجل التجاري يجب أن يكون أقل من 50 حرف'
      }),
    phone: Joi.string()
      .pattern(/^[+]?[0-9\s\-\(\)]+$/)
      .max(20)
      .allow(null, '')
      .messages({
        'string.base': 'رقم الهاتف يجب أن يكون نص',
        'string.pattern.base': 'رقم الهاتف غير صحيح',
        'string.max': 'رقم الهاتف يجب أن يكون أقل من 20 حرف'
      }),
    email: Joi.string()
      .email()
      .max(255)
      .allow(null, '')
      .messages({
        'string.base': 'البريد الإلكتروني يجب أن يكون نص',
        'string.email': 'البريد الإلكتروني غير صحيح',
        'string.max': 'البريد الإلكتروني يجب أن يكون أقل من 255 حرف'
      }),
    address: Joi.object({
      country: Joi.string().max(100).allow(null, ''),
      city: Joi.string().max(100).allow(null, ''),
      street: Joi.string().max(255).allow(null, ''),
      building: Joi.string().max(50).allow(null, ''),
      apartment: Joi.string().max(50).allow(null, ''),
      postal_code: Joi.string().max(20).allow(null, '')
    }).allow(null),
    invoice_settings: Joi.object({
      prefix: Joi.string().max(10),
      next_number: Joi.number().integer().min(1),
      terms: Joi.string().max(1000).allow(null, ''),
      due_days: Joi.number().integer().min(0)
    }).allow(null),
    order_settings: Joi.object({
      prefix: Joi.string().max(10),
      next_number: Joi.number().integer().min(1)
    }).allow(null),
    tax_settings: Joi.object({
      enabled: Joi.boolean(),
      percentage: Joi.number().min(0).max(100),
      tax_number: Joi.string().max(50).allow(null, '')
    }).allow(null),
    currency_settings: Joi.object({
      code: Joi.string().length(3),
      symbol: Joi.string().max(5),
      position: Joi.string().valid('left', 'right')
    }).allow(null)
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};