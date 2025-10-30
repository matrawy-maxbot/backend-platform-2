import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لإدارة الردود التلقائية
 * Validation schemas for auto-reply management data
 */

/**
 * مخطط التحقق من معرف الرد التلقائي
 * Auto-reply ID validation schema
 */
export const getAutoReplyByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف الرد التلقائي يجب أن يكون نصاً',
        'string.pattern.base': 'معرف الرد التلقائي يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف الرد التلقائي مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getAutoRepliesByServerIdSchema = {
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
 * مخطط التحقق من إنشاء رد تلقائي جديد
 * Create auto-reply validation schema
 */
export const createAutoReplySchema = {
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

    reply_name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.base': 'اسم الرد التلقائي يجب أن يكون نصاً',
        'string.empty': 'اسم الرد التلقائي لا يمكن أن يكون فارغاً',
        'string.min': 'اسم الرد التلقائي يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'اسم الرد التلقائي لا يمكن أن يتجاوز 100 حرف',
        'any.required': 'اسم الرد التلقائي مطلوب'
      }),

    triggers: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(200)
          .messages({
            'string.base': 'الكلمة المحفزة يجب أن تكون نصاً',
            'string.empty': 'الكلمة المحفزة لا يمكن أن تكون فارغة',
            'string.min': 'الكلمة المحفزة يجب أن تحتوي على حرف واحد على الأقل',
            'string.max': 'الكلمة المحفزة لا يمكن أن تتجاوز 200 حرف'
          })
      )
      .min(1)
      .max(20)
      .default([])
      .messages({
        'array.base': 'قائمة الكلمات المحفزة يجب أن تكون مصفوفة',
        'array.min': 'يجب إضافة كلمة محفزة واحدة على الأقل',
        'array.max': 'لا يمكن إضافة أكثر من 20 كلمة محفزة'
      }),

    responses: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(2000)
          .messages({
            'string.base': 'الرد يجب أن يكون نصاً',
            'string.empty': 'الرد لا يمكن أن يكون فارغاً',
            'string.min': 'الرد يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'الرد لا يمكن أن يتجاوز 2000 حرف'
          })
      )
      .min(1)
      .max(10)
      .default([])
      .messages({
        'array.base': 'قائمة الردود يجب أن تكون مصفوفة',
        'array.min': 'يجب إضافة رد واحد على الأقل',
        'array.max': 'لا يمكن إضافة أكثر من 10 ردود'
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
 * مخطط التحقق من تحديث الرد التلقائي
 * Update auto-reply validation schema
 */
export const updateAutoReplySchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف الرد التلقائي يجب أن يكون نصاً',
        'string.pattern.base': 'معرف الرد التلقائي يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف الرد التلقائي مطلوب'
      })
  }),

  body: Joi.object({
    reply_name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .messages({
        'string.base': 'اسم الرد التلقائي يجب أن يكون نصاً',
        'string.empty': 'اسم الرد التلقائي لا يمكن أن يكون فارغاً',
        'string.min': 'اسم الرد التلقائي يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'اسم الرد التلقائي لا يمكن أن يتجاوز 100 حرف'
      }),

    triggers: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(200)
          .messages({
            'string.base': 'الكلمة المحفزة يجب أن تكون نصاً',
            'string.empty': 'الكلمة المحفزة لا يمكن أن تكون فارغة',
            'string.min': 'الكلمة المحفزة يجب أن تحتوي على حرف واحد على الأقل',
            'string.max': 'الكلمة المحفزة لا يمكن أن تتجاوز 200 حرف'
          })
      )
      .min(1)
      .max(20)
      .messages({
        'array.base': 'قائمة الكلمات المحفزة يجب أن تكون مصفوفة',
        'array.min': 'يجب إضافة كلمة محفزة واحدة على الأقل',
        'array.max': 'لا يمكن إضافة أكثر من 20 كلمة محفزة'
      }),

    responses: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(2000)
          .messages({
            'string.base': 'الرد يجب أن يكون نصاً',
            'string.empty': 'الرد لا يمكن أن يكون فارغاً',
            'string.min': 'الرد يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'الرد لا يمكن أن يتجاوز 2000 حرف'
          })
      )
      .min(1)
      .max(10)
      .messages({
        'array.base': 'قائمة الردود يجب أن تكون مصفوفة',
        'array.min': 'يجب إضافة رد واحد على الأقل',
        'array.max': 'لا يمكن إضافة أكثر من 10 ردود'
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

/**
 * مخطط التحقق من حذف الرد التلقائي
 * Delete auto-reply validation schema
 */
export const deleteAutoReplySchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف الرد التلقائي يجب أن يكون نصاً',
        'string.pattern.base': 'معرف الرد التلقائي يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف الرد التلقائي مطلوب'
      })
  })
};