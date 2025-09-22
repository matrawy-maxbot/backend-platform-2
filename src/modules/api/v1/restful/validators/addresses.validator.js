import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات العناوين
 * @module AddressesValidator
 */

/**
 * مخطط التحقق من معرف العنوان
 */
export const getAddressByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف العنوان يجب أن يكون رقم',
        'number.integer': 'معرف العنوان يجب أن يكون رقم صحيح',
        'number.positive': 'معرف العنوان يجب أن يكون رقم موجب',
        'any.required': 'معرف العنوان مطلوب'
      })
  })
};

/**
 * مخطط إنشاء عنوان جديد
 */
export const createAddressSchema = {
  body: Joi.object({
    title: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.base': 'عنوان العنوان يجب أن يكون نص',
        'string.empty': 'عنوان العنوان لا يمكن أن يكون فارغ',
        'string.max': 'عنوان العنوان يجب أن يكون أقل من 100 حرف',
        'any.required': 'عنوان العنوان مطلوب'
      }),
    full_name: Joi.string()
      .max(255)
      .required()
      .messages({
        'string.base': 'الاسم الكامل يجب أن يكون نص',
        'string.empty': 'الاسم الكامل لا يمكن أن يكون فارغ',
        'string.max': 'الاسم الكامل يجب أن يكون أقل من 255 حرف',
        'any.required': 'الاسم الكامل مطلوب'
      }),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]{10,20}$/)
      .required()
      .messages({
        'string.base': 'رقم الهاتف يجب أن يكون نص',
        'string.empty': 'رقم الهاتف لا يمكن أن يكون فارغ',
        'string.pattern.base': 'رقم الهاتف غير صحيح',
        'any.required': 'رقم الهاتف مطلوب'
      }),
    country: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.base': 'الدولة يجب أن تكون نص',
        'string.empty': 'الدولة لا يمكن أن تكون فارغة',
        'string.max': 'الدولة يجب أن تكون أقل من 100 حرف',
        'any.required': 'الدولة مطلوبة'
      }),
    city: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.base': 'المدينة يجب أن تكون نص',
        'string.empty': 'المدينة لا يمكن أن تكون فارغة',
        'string.max': 'المدينة يجب أن تكون أقل من 100 حرف',
        'any.required': 'المدينة مطلوبة'
      }),
    district: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'المنطقة يجب أن تكون نص',
        'string.max': 'المنطقة يجب أن تكون أقل من 100 حرف'
      }),
    street_address: Joi.string()
      .required()
      .messages({
        'string.base': 'عنوان الشارع يجب أن يكون نص',
        'string.empty': 'عنوان الشارع لا يمكن أن يكون فارغ',
        'any.required': 'عنوان الشارع مطلوب'
      }),
    postal_code: Joi.string()
      .max(20)
      .allow(null, '')
      .messages({
        'string.base': 'الرمز البريدي يجب أن يكون نص',
        'string.max': 'الرمز البريدي يجب أن يكون أقل من 20 حرف'
      }),
    is_default: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'حالة العنوان الافتراضي يجب أن تكون true أو false'
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
    user_id: Joi.string()
      .max(255)
      .required()
      .messages({
        'string.base': 'معرف المستخدم يجب أن يكون نص',
        'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغ',
        'string.max': 'معرف المستخدم يجب أن يكون أقل من 255 حرف',
        'any.required': 'معرف المستخدم مطلوب'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث العنوان
 */
export const updateAddressSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف العنوان يجب أن يكون رقم',
        'number.integer': 'معرف العنوان يجب أن يكون رقم صحيح',
        'number.positive': 'معرف العنوان يجب أن يكون رقم موجب',
        'any.required': 'معرف العنوان مطلوب'
      })
  }),
  body: Joi.object({
    title: Joi.string()
      .max(100)
      .messages({
        'string.base': 'عنوان العنوان يجب أن يكون نص',
        'string.empty': 'عنوان العنوان لا يمكن أن يكون فارغ',
        'string.max': 'عنوان العنوان يجب أن يكون أقل من 100 حرف'
      }),
    full_name: Joi.string()
      .max(255)
      .messages({
        'string.base': 'الاسم الكامل يجب أن يكون نص',
        'string.empty': 'الاسم الكامل لا يمكن أن يكون فارغ',
        'string.max': 'الاسم الكامل يجب أن يكون أقل من 255 حرف'
      }),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]{10,20}$/)
      .messages({
        'string.base': 'رقم الهاتف يجب أن يكون نص',
        'string.empty': 'رقم الهاتف لا يمكن أن يكون فارغ',
        'string.pattern.base': 'رقم الهاتف غير صحيح'
      }),
    country: Joi.string()
      .max(100)
      .messages({
        'string.base': 'الدولة يجب أن تكون نص',
        'string.empty': 'الدولة لا يمكن أن تكون فارغة',
        'string.max': 'الدولة يجب أن تكون أقل من 100 حرف'
      }),
    city: Joi.string()
      .max(100)
      .messages({
        'string.base': 'المدينة يجب أن تكون نص',
        'string.empty': 'المدينة لا يمكن أن تكون فارغة',
        'string.max': 'المدينة يجب أن تكون أقل من 100 حرف'
      }),
    district: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        'string.base': 'المنطقة يجب أن تكون نص',
        'string.max': 'المنطقة يجب أن تكون أقل من 100 حرف'
      }),
    street_address: Joi.string()
      .messages({
        'string.base': 'عنوان الشارع يجب أن يكون نص',
        'string.empty': 'عنوان الشارع لا يمكن أن يكون فارغ'
      }),
    postal_code: Joi.string()
      .max(20)
      .allow(null, '')
      .messages({
        'string.base': 'الرمز البريدي يجب أن يكون نص',
        'string.max': 'الرمز البريدي يجب أن يكون أقل من 20 حرف'
      }),
    is_default: Joi.boolean()
      .messages({
        'boolean.base': 'حالة العنوان الافتراضي يجب أن تكون true أو false'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};