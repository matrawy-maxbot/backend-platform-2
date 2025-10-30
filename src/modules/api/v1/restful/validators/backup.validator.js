import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لإدارة النسخ الاحتياطية
 * Validation schemas for backup management data
 */

/**
 * مخطط التحقق من معرف النسخة الاحتياطية
 * Backup ID validation schema
 */
export const getBackupByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف النسخة الاحتياطية يجب أن يكون نصاً',
        'string.pattern.base': 'معرف النسخة الاحتياطية يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف النسخة الاحتياطية مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getBackupsByServerIdSchema = {
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
 * مخطط التحقق من إنشاء نسخة احتياطية جديدة
 * Create backup validation schema
 */
export const createBackupSchema = {
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

    server_settings: Joi.object()
      .default({})
      .messages({
        'object.base': 'إعدادات الخادم يجب أن تكون كائناً'
      }),

    channels: Joi.array()
      .items(Joi.object())
      .default([])
      .messages({
        'array.base': 'قائمة القنوات يجب أن تكون مصفوفة'
      }),

    roles: Joi.array()
      .items(Joi.object())
      .default([])
      .messages({
        'array.base': 'قائمة الأدوار يجب أن تكون مصفوفة'
      }),

    created_by: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .allow(null)
      .default(null)
      .messages({
        'string.base': 'يجب أن يكون معرف المنشئ نصاً',
        'string.pattern.base': 'معرف المنشئ يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف المنشئ لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف المنشئ يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف المنشئ يجب أن لا يزيد عن 50 حرف'
      })
  })
};

/**
 * مخطط التحقق من حذف النسخة الاحتياطية
 * Delete backup validation schema
 */
export const deleteBackupSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف النسخة الاحتياطية يجب أن يكون نصاً',
        'string.pattern.base': 'معرف النسخة الاحتياطية يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف النسخة الاحتياطية مطلوب'
      })
  }),

  body: Joi.object({
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