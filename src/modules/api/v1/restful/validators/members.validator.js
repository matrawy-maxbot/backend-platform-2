import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لإعدادات الأعضاء
 * Validation schemas for members settings data
 */

/**
 * مخطط التحقق من معرف إعدادات الأعضاء
 * Members settings ID validation schema
 */
export const getMembersByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف إعدادات الأعضاء يجب أن يكون نصاً',
        'string.pattern.base': 'معرف إعدادات الأعضاء يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف إعدادات الأعضاء مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getMembersByServerIdSchema = {
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
 * مخطط التحقق من إنشاء إعدادات أعضاء جديدة
 * Create members settings validation schema
 */
export const createMembersSchema = {
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

    // إعدادات رسالة الترحيب - Welcome Message Settings
    welcome_message: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'تفعيل رسالة الترحيب يجب أن يكون قيمة منطقية (true/false)'
      }),

    welcome_message_content: Joi.string()
      .trim()
      .max(500)
      .default('Welcome (user) to (server)! 🌬')
      .messages({
        'string.base': 'محتوى رسالة الترحيب يجب أن يكون نصاً',
        'string.max': 'محتوى رسالة الترحيب يجب أن لا يزيد عن 500 حرف'
      }),

    welcome_message_channel: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .max(50)
      .allow(null)
      .default(null)
      .messages({
        'string.base': 'قناة رسالة الترحيب يجب أن تكون نصاً',
        'string.pattern.base': 'قناة رسالة الترحيب يجب أن تحتوي على أرقام فقط',
        'string.max': 'قناة رسالة الترحيب يجب أن لا تزيد عن 50 حرف'
      }),

    welcome_image: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'تفعيل صورة الترحيب يجب أن يكون قيمة منطقية (true/false)'
      }),

    // إعدادات رسالة المغادرة - Leave Message Settings
    leave_message: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'تفعيل رسالة المغادرة يجب أن يكون قيمة منطقية (true/false)'
      }),

    leave_message_content: Joi.string()
      .trim()
      .max(500)
      .default('Goodbye (user), hope to see you soon!')
      .messages({
        'string.base': 'محتوى رسالة المغادرة يجب أن يكون نصاً',
        'string.max': 'محتوى رسالة المغادرة يجب أن لا يزيد عن 500 حرف'
      }),

    leave_message_channel: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .max(50)
      .allow(null)
      .default(null)
      .messages({
        'string.base': 'قناة رسالة المغادرة يجب أن تكون نصاً',
        'string.pattern.base': 'قناة رسالة المغادرة يجب أن تحتوي على أرقام فقط',
        'string.max': 'قناة رسالة المغادرة يجب أن لا تزيد عن 50 حرف'
      }),

    // إعدادات الدور التلقائي - Auto Role Settings
    auto_role: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'تفعيل الدور التلقائي يجب أن يكون قيمة منطقية (true/false)'
      }),

    auto_role_channel: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .max(50)
      .allow(null)
      .default(null)
      .messages({
        'string.base': 'قناة الدور التلقائي يجب أن تكون نصاً',
        'string.pattern.base': 'قناة الدور التلقائي يجب أن تحتوي على أرقام فقط',
        'string.max': 'قناة الدور التلقائي يجب أن لا تزيد عن 50 حرف'
      })
  })
};

/**
 * مخطط التحقق من تحديث إعدادات الأعضاء
 * Update members settings validation schema
 */
export const updateMembersSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف إعدادات الأعضاء يجب أن يكون نصاً',
        'string.pattern.base': 'معرف إعدادات الأعضاء يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف إعدادات الأعضاء مطلوب'
      })
  }),

  body: Joi.object({
    // إعدادات رسالة الترحيب - Welcome Message Settings
    welcome_message: Joi.boolean()
      .messages({
        'boolean.base': 'تفعيل رسالة الترحيب يجب أن يكون قيمة منطقية (true/false)'
      }),

    welcome_message_content: Joi.string()
      .trim()
      .max(500)
      .messages({
        'string.base': 'محتوى رسالة الترحيب يجب أن يكون نصاً',
        'string.max': 'محتوى رسالة الترحيب يجب أن لا يزيد عن 500 حرف'
      }),

    welcome_message_channel: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .max(50)
      .allow(null)
      .messages({
        'string.base': 'قناة رسالة الترحيب يجب أن تكون نصاً',
        'string.pattern.base': 'قناة رسالة الترحيب يجب أن تحتوي على أرقام فقط',
        'string.max': 'قناة رسالة الترحيب يجب أن لا تزيد عن 50 حرف'
      }),

    welcome_image: Joi.boolean()
      .messages({
        'boolean.base': 'تفعيل صورة الترحيب يجب أن يكون قيمة منطقية (true/false)'
      }),

    // إعدادات رسالة المغادرة - Leave Message Settings
    leave_message: Joi.boolean()
      .messages({
        'boolean.base': 'تفعيل رسالة المغادرة يجب أن يكون قيمة منطقية (true/false)'
      }),

    leave_message_content: Joi.string()
      .trim()
      .max(500)
      .messages({
        'string.base': 'محتوى رسالة المغادرة يجب أن يكون نصاً',
        'string.max': 'محتوى رسالة المغادرة يجب أن لا يزيد عن 500 حرف'
      }),

    leave_message_channel: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .max(50)
      .allow(null)
      .messages({
        'string.base': 'قناة رسالة المغادرة يجب أن تكون نصاً',
        'string.pattern.base': 'قناة رسالة المغادرة يجب أن تحتوي على أرقام فقط',
        'string.max': 'قناة رسالة المغادرة يجب أن لا تزيد عن 50 حرف'
      }),

    // إعدادات الدور التلقائي - Auto Role Settings
    auto_role: Joi.boolean()
      .messages({
        'boolean.base': 'تفعيل الدور التلقائي يجب أن يكون قيمة منطقية (true/false)'
      }),

    auto_role_channel: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .max(50)
      .allow(null)
      .messages({
        'string.base': 'قناة الدور التلقائي يجب أن تكون نصاً',
        'string.pattern.base': 'قناة الدور التلقائي يجب أن تحتوي على أرقام فقط',
        'string.max': 'قناة الدور التلقائي يجب أن لا تزيد عن 50 حرف'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
  })
};

/**
 * مخطط التحقق من تحديث إعدادات الأعضاء بواسطة معرف الخادم
 * Update members settings by server ID validation schema
 */
export const updateMembersByServerIdSchema = {
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

  body: updateMembersSchema.body
};

export const deleteMembersSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف إعدادات الأعضاء يجب أن يكون نصاً',
        'string.pattern.base': 'معرف إعدادات الأعضاء يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف إعدادات الأعضاء مطلوب'
      })
  })
};

export const deleteMembersByServerIdSchema = {
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