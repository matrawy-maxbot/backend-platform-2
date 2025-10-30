import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لإدارة الروابط
 * Validation schemas for links management data
 */

/**
 * مخطط التحقق من معرف قاعدة الرابط
 * Link rule ID validation schema
 */
export const getLinkByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف قاعدة الرابط يجب أن يكون رقماً',
        'number.integer': 'معرف قاعدة الرابط يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف قاعدة الرابط يجب أن يكون رقماً موجباً',
        'any.required': 'معرف قاعدة الرابط مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getLinksByServerIdSchema = {
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
 * مخطط التحقق من إنشاء قاعدة رابط جديدة
 * Create link rule validation schema
 */
export const createLinkSchema = {
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

    link_or_keyword: Joi.string()
      .trim()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.base': 'الرابط أو الكلمة المفتاحية يجب أن يكون نصاً',
        'string.empty': 'الرابط أو الكلمة المفتاحية لا يمكن أن يكون فارغاً',
        'string.min': 'الرابط أو الكلمة المفتاحية يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'الرابط أو الكلمة المفتاحية لا يمكن أن يتجاوز 500 حرف',
        'any.required': 'الرابط أو الكلمة المفتاحية مطلوب'
      }),

    action_type: Joi.string()
      .valid('allow', 'delete', 'kick', 'ban')
      .default('delete')
      .messages({
        'string.base': 'نوع الإجراء يجب أن يكون نصاً',
        'any.only': 'نوع الإجراء يجب أن يكون أحد القيم التالية: allow, delete, kick, ban'
      }),

    channels: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .default([])
      .messages({
        'array.base': 'قائمة القنوات يجب أن تكون مصفوفة'
      })
  })
};

/**
 * مخطط التحقق من تحديث قاعدة الرابط
 * Update link rule validation schema
 */
export const updateLinkSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف قاعدة الرابط يجب أن يكون رقماً',
        'number.integer': 'معرف قاعدة الرابط يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف قاعدة الرابط يجب أن يكون رقماً موجباً',
        'any.required': 'معرف قاعدة الرابط مطلوب'
      })
  }),

  body: Joi.object({
    link_or_keyword: Joi.string()
      .trim()
      .min(1)
      .max(500)
      .messages({
        'string.base': 'الرابط أو الكلمة المفتاحية يجب أن يكون نصاً',
        'string.empty': 'الرابط أو الكلمة المفتاحية لا يمكن أن يكون فارغاً',
        'string.min': 'الرابط أو الكلمة المفتاحية يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'الرابط أو الكلمة المفتاحية لا يمكن أن يتجاوز 500 حرف'
      }),

    action_type: Joi.string()
      .valid('allow', 'delete', 'kick', 'ban')
      .messages({
        'string.base': 'نوع الإجراء يجب أن يكون نصاً',
        'any.only': 'نوع الإجراء يجب أن يكون أحد القيم التالية: allow, delete, kick, ban'
      }),

    channels: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات يجب أن تكون مصفوفة'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
  })
};

export const deleteLinkSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف قاعدة الرابط يجب أن يكون رقماً',
        'number.integer': 'معرف قاعدة الرابط يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف قاعدة الرابط يجب أن يكون رقماً موجباً',
        'any.required': 'معرف قاعدة الرابط مطلوب'
      })
  })
};