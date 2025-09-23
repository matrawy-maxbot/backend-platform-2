import Joi from 'joi';

/**
 * مخطط التحقق من معرف نشاط البائع
 */
export const getVendorActivityByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .required()
      .messages({
        'string.empty': 'معرف نشاط البائع مطلوب',
        'any.required': 'معرف نشاط البائع مطلوب'
      })
  })
};

/**
 * مخطط التحقق من إنشاء نشاط بائع جديد
 */
export const createVendorActivitySchema = {
  body: Joi.object({
    vendor_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقماً',
        'number.integer': 'معرف البائع يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف البائع يجب أن يكون رقماً موجباً',
        'any.required': 'معرف البائع مطلوب'
      }),
    activity_type: Joi.string()
      .required()
      .messages({
        'string.empty': 'نوع النشاط مطلوب',
        'any.required': 'نوع النشاط مطلوب'
      }),
    description: Joi.string()
      .allow('')
      .messages({
        'string.base': 'الوصف يجب أن يكون نصاً'
      }),
    ip_address: Joi.string()
      .ip()
      .allow('')
      .messages({
        'string.ip': 'عنوان IP غير صحيح'
      }),
    user_agent: Joi.string()
      .allow('')
      .messages({
        'string.base': 'معلومات المتصفح يجب أن تكون نصاً'
      }),
    related_entity: Joi.string()
      .allow('')
      .messages({
        'string.base': 'الكيان المرتبط يجب أن يكون نصاً'
      }),
    related_entity_id: Joi.number()
      .integer()
      .allow(null)
      .messages({
        'number.base': 'معرف الكيان المرتبط يجب أن يكون رقماً',
        'number.integer': 'معرف الكيان المرتبط يجب أن يكون رقماً صحيحاً'
      }),
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'البيانات الوصفية يجب أن تكون كائناً'
      })
  })
};

/**
 * مخطط التحقق من تحديث نشاط البائع
 */
export const updateVendorActivitySchema = {
  params: Joi.object({
    id: Joi.string()
      .required()
      .messages({
        'string.empty': 'معرف نشاط البائع مطلوب',
        'any.required': 'معرف نشاط البائع مطلوب'
      })
  }),
  body: Joi.object({
    vendor_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقماً',
        'number.integer': 'معرف البائع يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف البائع يجب أن يكون رقماً موجباً'
      }),
    activity_type: Joi.string()
      .messages({
        'string.empty': 'نوع النشاط لا يمكن أن يكون فارغاً'
      }),
    description: Joi.string()
      .allow('')
      .messages({
        'string.base': 'الوصف يجب أن يكون نصاً'
      }),
    ip_address: Joi.string()
      .ip()
      .allow('')
      .messages({
        'string.ip': 'عنوان IP غير صحيح'
      }),
    user_agent: Joi.string()
      .allow('')
      .messages({
        'string.base': 'معلومات المتصفح يجب أن تكون نصاً'
      }),
    related_entity: Joi.string()
      .allow('')
      .messages({
        'string.base': 'الكيان المرتبط يجب أن يكون نصاً'
      }),
    related_entity_id: Joi.number()
      .integer()
      .allow(null)
      .messages({
        'number.base': 'معرف الكيان المرتبط يجب أن يكون رقماً',
        'number.integer': 'معرف الكيان المرتبط يجب أن يكون رقماً صحيحاً'
      }),
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'البيانات الوصفية يجب أن تكون كائناً'
      })
  })
};