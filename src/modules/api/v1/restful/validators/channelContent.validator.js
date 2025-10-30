import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لإدارة محتوى القنوات
 * Validation schemas for channel content management data
 */

/**
 * مخطط التحقق من معرف إعدادات محتوى القنوات
 * Channel content settings ID validation schema
 */
export const getChannelContentByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف إعدادات محتوى القنوات يجب أن يكون رقماً',
        'number.integer': 'معرف إعدادات محتوى القنوات يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف إعدادات محتوى القنوات يجب أن يكون رقماً موجباً',
        'any.required': 'معرف إعدادات محتوى القنوات مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getChannelContentByServerIdSchema = {
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
 * مخطط التحقق من إنشاء إعدادات محتوى قنوات جديدة
 * Create channel content settings validation schema
 */
export const createChannelContentSchema = {
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

    block_images: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .default([])
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها الصور يجب أن تكون مصفوفة'
      }),

    block_text_messages: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .default([])
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها الرسائل النصية يجب أن تكون مصفوفة'
      }),

    block_file_attachments: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .default([])
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها مرفقات الملفات يجب أن تكون مصفوفة'
      }),

    block_bot_commands: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .default([])
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها أوامر البوت يجب أن تكون مصفوفة'
      })
  })
};

/**
 * مخطط التحقق من تحديث إعدادات محتوى القنوات
 * Update channel content settings validation schema
 */
export const updateChannelContentSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف إعدادات محتوى القنوات يجب أن يكون رقماً',
        'number.integer': 'معرف إعدادات محتوى القنوات يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف إعدادات محتوى القنوات يجب أن يكون رقماً موجباً',
        'any.required': 'معرف إعدادات محتوى القنوات مطلوب'
      })
  }),

  body: Joi.object({
    block_images: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها الصور يجب أن تكون مصفوفة'
      }),

    block_text_messages: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها الرسائل النصية يجب أن تكون مصفوفة'
      }),

    block_file_attachments: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها مرفقات الملفات يجب أن تكون مصفوفة'
      }),

    block_bot_commands: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها أوامر البوت يجب أن تكون مصفوفة'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
  })
};

/**
 * مخطط التحقق من صحة تحديث إعدادات محتوى القنوات بواسطة معرف الخادم
 * Validation schema for updating channel content settings by server ID
 */
export const updateChannelContentByServerIdSchema = {
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

  body: Joi.object({
    block_images: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها الصور يجب أن تكون مصفوفة'
      }),

    block_text_messages: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها الرسائل النصية يجب أن تكون مصفوفة'
      }),

    block_file_attachments: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها مرفقات الملفات يجب أن تكون مصفوفة'
      }),

    block_bot_commands: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.pattern.base': 'معرف القناة يجب أن يحتوي على أرقام فقط',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات المحظور فيها أوامر البوت يجب أن تكون مصفوفة'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
  })
};

/**
 * مخطط التحقق من صحة حذف إعدادات محتوى القنوات
 * Validation schema for deleting channel content settings
 */
export const deleteChannelContentSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف إعدادات محتوى القنوات يجب أن يكون رقماً',
        'number.integer': 'معرف إعدادات محتوى القنوات يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف إعدادات محتوى القنوات يجب أن يكون رقماً موجباً',
        'any.required': 'معرف إعدادات محتوى القنوات مطلوب'
      })
  })
};

/**
 * مخطط التحقق من حذف إعدادات محتوى القنوات بواسطة معرف الخادم
 * Delete channel content settings by server ID validation schema
 */
export const deleteChannelContentByServerIdSchema = {
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