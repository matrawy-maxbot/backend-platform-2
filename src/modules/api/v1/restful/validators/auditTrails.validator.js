import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات سجلات التدقيق
 * @module AuditTrailsValidator
 */

/**
 * مخطط التحقق من معرف سجل التدقيق
 */
export const getAuditTrailByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف سجل التدقيق يجب أن يكون نص',
        'string.pattern.base': 'معرف سجل التدقيق يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف سجل التدقيق مطلوب'
      })
  })
};

/**
 * مخطط إنشاء سجل تدقيق جديد
 */
export const createAuditTrailSchema = {
  body: Joi.object({
    user_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المستخدم يجب أن يكون رقم',
        'number.integer': 'معرف المستخدم يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المستخدم يجب أن يكون رقم موجب',
        'any.required': 'معرف المستخدم مطلوب'
      }),
    user_type: Joi.string()
      .valid('admin', 'vendor', 'customer', 'system')
      .required()
      .messages({
        'string.base': 'نوع المستخدم يجب أن يكون نص',
        'any.only': 'نوع المستخدم يجب أن يكون إحدى القيم: admin, vendor, customer, system',
        'any.required': 'نوع المستخدم مطلوب'
      }),
    action: Joi.string()
      .required()
      .messages({
        'string.base': 'العملية يجب أن تكون نص',
        'string.empty': 'العملية لا يمكن أن تكون فارغة',
        'any.required': 'العملية مطلوبة'
      }),
    entity_type: Joi.string()
      .required()
      .messages({
        'string.base': 'نوع الكيان يجب أن يكون نص',
        'string.empty': 'نوع الكيان لا يمكن أن يكون فارغ',
        'any.required': 'نوع الكيان مطلوب'
      }),
    entity_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'معرف الكيان يجب أن يكون رقم',
        'number.integer': 'معرف الكيان يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الكيان يجب أن يكون رقم موجب'
      }),
    entity_name: Joi.string()
      .max(255)
      .messages({
        'string.base': 'اسم الكيان يجب أن يكون نص',
        'string.max': 'اسم الكيان يجب أن يكون أقل من 255 حرف'
      }),
    old_value: Joi.any()
      .messages({
        'any.invalid': 'القيمة القديمة غير صحيحة'
      }),
    new_value: Joi.any()
      .messages({
        'any.invalid': 'القيمة الجديدة غير صحيحة'
      }),
    changes: Joi.array()
      .items(
        Joi.object({
          field: Joi.string().required(),
          old_value: Joi.any(),
          new_value: Joi.any()
        })
      )
      .messages({
        'array.base': 'التغييرات يجب أن تكون مصفوفة'
      }),
    ip_address: Joi.string()
      .ip()
      .messages({
        'string.base': 'عنوان IP يجب أن يكون نص',
        'string.ip': 'عنوان IP غير صحيح'
      }),
    user_agent: Joi.string()
      .max(500)
      .messages({
        'string.base': 'معرف المتصفح يجب أن يكون نص',
        'string.max': 'معرف المتصفح يجب أن يكون أقل من 500 حرف'
      }),
    reason: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'سبب العملية يجب أن يكون نص',
        'string.max': 'سبب العملية يجب أن يكون أقل من 1000 حرف'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث سجل التدقيق
 */
export const updateAuditTrailSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف سجل التدقيق يجب أن يكون نص',
        'string.pattern.base': 'معرف سجل التدقيق يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف سجل التدقيق مطلوب'
      })
  }),
  body: Joi.object({
    user_type: Joi.string()
      .valid('admin', 'vendor', 'customer', 'system')
      .messages({
        'string.base': 'نوع المستخدم يجب أن يكون نص',
        'any.only': 'نوع المستخدم يجب أن يكون إحدى القيم: admin, vendor, customer, system'
      }),
    action: Joi.string()
      .messages({
        'string.base': 'العملية يجب أن تكون نص',
        'string.empty': 'العملية لا يمكن أن تكون فارغة'
      }),
    entity_type: Joi.string()
      .messages({
        'string.base': 'نوع الكيان يجب أن يكون نص',
        'string.empty': 'نوع الكيان لا يمكن أن يكون فارغ'
      }),
    entity_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'معرف الكيان يجب أن يكون رقم',
        'number.integer': 'معرف الكيان يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الكيان يجب أن يكون رقم موجب'
      }),
    entity_name: Joi.string()
      .max(255)
      .messages({
        'string.base': 'اسم الكيان يجب أن يكون نص',
        'string.max': 'اسم الكيان يجب أن يكون أقل من 255 حرف'
      }),
    old_value: Joi.any()
      .messages({
        'any.invalid': 'القيمة القديمة غير صحيحة'
      }),
    new_value: Joi.any()
      .messages({
        'any.invalid': 'القيمة الجديدة غير صحيحة'
      }),
    changes: Joi.array()
      .items(
        Joi.object({
          field: Joi.string().required(),
          old_value: Joi.any(),
          new_value: Joi.any()
        })
      )
      .messages({
        'array.base': 'التغييرات يجب أن تكون مصفوفة'
      }),
    ip_address: Joi.string()
      .ip()
      .messages({
        'string.base': 'عنوان IP يجب أن يكون نص',
        'string.ip': 'عنوان IP غير صحيح'
      }),
    user_agent: Joi.string()
      .max(500)
      .messages({
        'string.base': 'معرف المتصفح يجب أن يكون نص',
        'string.max': 'معرف المتصفح يجب أن يكون أقل من 500 حرف'
      }),
    reason: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'سبب العملية يجب أن يكون نص',
        'string.max': 'سبب العملية يجب أن يكون أقل من 1000 حرف'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};