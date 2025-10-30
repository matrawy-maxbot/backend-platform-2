import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات للكلمات السيئة - BadWords Validation Schemas
 * يحتوي على جميع مخططات التحقق من صحة البيانات المتعلقة بإدارة الكلمات المحظورة
 * Contains all validation schemas related to bad words management
 */

/**
 * مخطط التحقق من صحة البيانات للحصول على إعدادات الكلمات السيئة بواسطة المعرف
 * Validation schema for getting bad words settings by ID
 */
export const getBadWordsByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'يجب أن يكون المعرف رقماً',
        'number.integer': 'يجب أن يكون المعرف رقماً صحيحاً',
        'number.positive': 'يجب أن يكون المعرف رقماً موجباً',
        'any.required': 'المعرف مطلوب'
      })
  }).required()
};

/**
 * مخطط التحقق من صحة البيانات للحصول على إعدادات الكلمات السيئة بواسطة معرف الخادم
 * Validation schema for getting bad words settings by server ID
 */
export const getBadWordsByServerIdSchema = {
  params: Joi.object({
    serverId: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.base': 'يجب أن يكون معرف الخادم نصاً',
        'string.pattern.base': 'معرف الخادم يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف الخادم لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف الخادم يجب أن لا يزيد عن 50 حرف',
        'any.required': 'معرف الخادم مطلوب'
      })
  }).required()
};

/**
 * مخطط التحقق من صحة البيانات لإنشاء إعدادات كلمات سيئة جديدة
 * Validation schema for creating new bad words settings
 */
export const createBadWordsSchema = {
  body: Joi.object({
    server_id: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.base': 'يجب أن يكون معرف الخادم نصاً',
        'string.pattern.base': 'معرف الخادم يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف الخادم لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف الخادم يجب أن لا يزيد عن 50 حرف',
        'any.required': 'معرف الخادم مطلوب'
      }),

    words: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(100)
          .messages({
            'string.base': 'يجب أن تكون الكلمة نصاً',
            'string.empty': 'الكلمة لا يمكن أن تكون فارغة',
            'string.min': 'الكلمة يجب أن تحتوي على حرف واحد على الأقل',
            'string.max': 'الكلمة يجب أن لا تزيد عن 100 حرف'
          })
      )
      .min(0)
      .max(500)
      .default([])
      .messages({
        'array.base': 'قائمة الكلمات يجب أن تكون مصفوفة',
        'array.min': 'قائمة الكلمات لا يمكن أن تكون أقل من 0 عنصر',
        'array.max': 'قائمة الكلمات لا يمكن أن تزيد عن 500 كلمة'
      }),

    punishment_type: Joi.string()
      .valid('warn', 'none', 'mute', 'kick', 'ban')
      .default('warn')
      .messages({
        'string.base': 'يجب أن يكون نوع العقوبة نصاً',
        'any.only': 'نوع العقوبة يجب أن يكون أحد القيم التالية: warn, none, mute, kick, ban'
      })
  }).required()
};

/**
 * مخطط التحقق من صحة البيانات لتحديث إعدادات الكلمات السيئة
 * Validation schema for updating bad words settings
 */
export const updateBadWordsSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'يجب أن يكون المعرف رقماً',
        'number.integer': 'يجب أن يكون المعرف رقماً صحيحاً',
        'number.positive': 'يجب أن يكون المعرف رقماً موجباً',
        'any.required': 'المعرف مطلوب'
      })
  }).required(),

  body: Joi.object({
    words: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(100)
          .messages({
            'string.base': 'يجب أن تكون الكلمة نصاً',
            'string.empty': 'الكلمة لا يمكن أن تكون فارغة',
            'string.min': 'الكلمة يجب أن تحتوي على حرف واحد على الأقل',
            'string.max': 'الكلمة يجب أن لا تزيد عن 100 حرف'
          })
      )
      .min(0)
      .max(500)
      .messages({
        'array.base': 'قائمة الكلمات يجب أن تكون مصفوفة',
        'array.min': 'قائمة الكلمات لا يمكن أن تكون أقل من 0 عنصر',
        'array.max': 'قائمة الكلمات لا يمكن أن تزيد عن 500 كلمة'
      }),

    punishment_type: Joi.string()
      .valid('warn', 'none', 'mute', 'kick', 'ban')
      .messages({
        'string.base': 'يجب أن يكون نوع العقوبة نصاً',
        'any.only': 'نوع العقوبة يجب أن يكون أحد القيم التالية: warn, none, mute, kick, ban'
      })
  })
    .min(1)
    .required()
    .messages({
      'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
    })
};



/**
 * مخطط التحقق من صحة البيانات لتحديث إعدادات الكلمات السيئة بواسطة معرف الخادم
 * Validation schema for updating bad words settings by server ID
 */
export const updateBadWordsByServerIdSchema = {
  params: Joi.object({
    serverId: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.base': 'يجب أن يكون معرف الخادم نصاً',
        'string.pattern.base': 'معرف الخادم يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف الخادم لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف الخادم يجب أن لا يزيد عن 50 حرف',
        'any.required': 'معرف الخادم مطلوب'
      })
  }).required(),

  body: Joi.object({
    words: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(100)
          .messages({
            'string.base': 'يجب أن تكون الكلمة نصاً',
            'string.empty': 'الكلمة لا يمكن أن تكون فارغة',
            'string.min': 'الكلمة يجب أن تحتوي على حرف واحد على الأقل',
            'string.max': 'الكلمة يجب أن لا تزيد عن 100 حرف'
          })
      )
      .min(0)
      .max(500)
      .messages({
        'array.base': 'قائمة الكلمات يجب أن تكون مصفوفة',
        'array.min': 'قائمة الكلمات لا يمكن أن تكون أقل من 0 عنصر',
        'array.max': 'قائمة الكلمات لا يمكن أن تزيد عن 500 كلمة'
      }),

    punishment_type: Joi.string()
      .valid('warn', 'none', 'mute', 'kick', 'ban')
      .messages({
        'string.base': 'يجب أن يكون نوع العقوبة نصاً',
        'any.only': 'نوع العقوبة يجب أن يكون أحد القيم التالية: warn, none, mute, kick, ban'
      })
  })
    .min(1)
    .required()
    .messages({
      'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
    })
};



/**
 * مخطط التحقق من صحة البيانات لحذف إعدادات الكلمات السيئة
 * Validation schema for deleting bad words settings
 */
export const deleteBadWordsSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'يجب أن يكون المعرف رقماً',
        'number.integer': 'يجب أن يكون المعرف رقماً صحيحاً',
        'number.positive': 'يجب أن يكون المعرف رقماً موجباً',
        'any.required': 'المعرف مطلوب'
      })
  }).required()
};

/**
 * مخطط التحقق من صحة البيانات لحذف إعدادات الكلمات السيئة بواسطة معرف الخادم
 * Validation schema for deleting bad words settings by server ID
 */
export const deleteBadWordsByServerIdSchema = {
  params: Joi.object({
    serverId: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.base': 'يجب أن يكون معرف الخادم نصاً',
        'string.pattern.base': 'معرف الخادم يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف الخادم لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف الخادم يجب أن لا يزيد عن 50 حرف',
        'any.required': 'معرف الخادم مطلوب'
      })
  }).required()
};
