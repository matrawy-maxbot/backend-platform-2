import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لإعدادات الحماية
 * Validation schemas for protection settings data
 */

/**
 * مخطط التحقق من معرف إعدادات الحماية
 * Protection settings ID validation schema
 */
export const getProtectionByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف إعدادات الحماية يجب أن يكون رقماً',
        'number.integer': 'معرف إعدادات الحماية يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف إعدادات الحماية يجب أن يكون رقماً موجباً',
        'any.required': 'معرف إعدادات الحماية مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getProtectionByServerIdSchema = {
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
  })
};

/**
 * مخطط التحقق من إنشاء إعدادات حماية جديدة
 * Create protection settings validation schema
 */
export const createProtectionSchema = {
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

    // قسم إدارة البوتات - Bot Management Section
    bot_management_enabled: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'تفعيل إدارة البوتات يجب أن يكون قيمة منطقية (true/false)'
      }),

    disallow_bots: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'منع البوتات يجب أن يكون قيمة منطقية (true/false)'
      }),

    delete_repeated_messages: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'حذف الرسائل المكررة يجب أن يكون قيمة منطقية (true/false)'
      }),

    // قسم ضوابط الإشراف - Moderation Controls Section
    moderation_controls_enabled: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'تفعيل ضوابط الإشراف يجب أن يكون قيمة منطقية (true/false)'
      }),

    max_punishment_type: Joi.string()
      .valid('kick', 'remove_roles', 'ban')
      .default('kick')
      .messages({
        'string.base': 'نوع العقوبة يجب أن يكون نصاً',
        'any.only': 'نوع العقوبة يجب أن يكون أحد القيم التالية: kick, remove_roles, ban'
      }),

    max_kick_ban_limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(1)
      .messages({
        'number.base': 'حد الطرد والحظر يجب أن يكون رقماً',
        'number.integer': 'حد الطرد والحظر يجب أن يكون رقماً صحيحاً',
        'number.min': 'حد الطرد والحظر يجب أن يكون 1 على الأقل',
        'number.max': 'حد الطرد والحظر لا يمكن أن يتجاوز 100'
      }),

    // مفاتيح تصفية المحتوى - Content Filtering Toggles
    bad_words: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'فلتر الكلمات السيئة يجب أن يكون قيمة منطقية (true/false)'
      }),

    links: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'فلتر الروابط يجب أن يكون قيمة منطقية (true/false)'
      }),

    channels_content: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'فلتر محتوى القنوات يجب أن يكون قيمة منطقية (true/false)'
      })
  })
};

/**
 * مخطط التحقق من تحديث إعدادات الحماية
 * Update protection settings validation schema
 */
export const updateProtectionSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف إعدادات الحماية يجب أن يكون رقماً',
        'number.integer': 'معرف إعدادات الحماية يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف إعدادات الحماية يجب أن يكون رقماً موجباً',
        'any.required': 'معرف إعدادات الحماية مطلوب'
      })
  }),

  body: Joi.object({
    // قسم إدارة البوتات - Bot Management Section
    bot_management_enabled: Joi.boolean()
      .messages({
        'boolean.base': 'تفعيل إدارة البوتات يجب أن يكون قيمة منطقية (true/false)'
      }),

    disallow_bots: Joi.boolean()
      .messages({
        'boolean.base': 'منع البوتات يجب أن يكون قيمة منطقية (true/false)'
      }),

    delete_repeated_messages: Joi.boolean()
      .messages({
        'boolean.base': 'حذف الرسائل المكررة يجب أن يكون قيمة منطقية (true/false)'
      }),

    // قسم ضوابط الإشراف - Moderation Controls Section
    moderation_controls_enabled: Joi.boolean()
      .messages({
        'boolean.base': 'تفعيل ضوابط الإشراف يجب أن يكون قيمة منطقية (true/false)'
      }),

    max_punishment_type: Joi.string()
      .valid('kick', 'remove_roles', 'ban')
      .messages({
        'string.base': 'نوع العقوبة يجب أن يكون نصاً',
        'any.only': 'نوع العقوبة يجب أن يكون أحد القيم التالية: kick, remove_roles, ban'
      }),

    max_kick_ban_limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .messages({
        'number.base': 'حد الطرد والحظر يجب أن يكون رقماً',
        'number.integer': 'حد الطرد والحظر يجب أن يكون رقماً صحيحاً',
        'number.min': 'حد الطرد والحظر يجب أن يكون 1 على الأقل',
        'number.max': 'حد الطرد والحظر لا يمكن أن يتجاوز 100'
      }),

    // مفاتيح تصفية المحتوى - Content Filtering Toggles
    bad_words: Joi.boolean()
      .messages({
        'boolean.base': 'فلتر الكلمات السيئة يجب أن يكون قيمة منطقية (true/false)'
      }),

    links: Joi.boolean()
      .messages({
        'boolean.base': 'فلتر الروابط يجب أن يكون قيمة منطقية (true/false)'
      }),

    channels_content: Joi.boolean()
      .messages({
        'boolean.base': 'فلتر محتوى القنوات يجب أن يكون قيمة منطقية (true/false)'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
  })
};

/**
 * مخطط التحقق من تحديث إعدادات الحماية بواسطة معرف الخادم
 * Update protection settings by server ID validation schema
 */
export const updateProtectionByServerIdSchema = {
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
  }),

  body: updateProtectionSchema.body
};

export const deleteProtectionSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف إعدادات الحماية يجب أن يكون رقماً',
        'number.integer': 'معرف إعدادات الحماية يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف إعدادات الحماية يجب أن يكون رقماً موجباً',
        'any.required': 'معرف إعدادات الحماية مطلوب'
      })
  })
};

export const deleteProtectionByServerIdSchema = {
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
  })
};