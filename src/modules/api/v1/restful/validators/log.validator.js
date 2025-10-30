import Joi from 'joi';

/**
 * مدقق السجلات - Log Validator
 * 
 * يحتوي على مخططات التحقق من صحة البيانات لعمليات السجلات
 * Contains validation schemas for log operations
 * 
 * @version 3.0.0
 * @author Genius Bot
 * @created 2024
 * @updated 2024 - تم تحديث البنية لتتوافق مع نموذج قاعدة البيانات الجديد
 *                 Updated structure to match new database model
 * 
 * المخططات المتاحة / Available Schemas:
 * - createLogSchema: التحقق من إنشاء سجل جديد
 * - getLogByIdSchema: التحقق من الحصول على سجل بواسطة المعرف
 * - getLogsByServerIdSchema: التحقق من الحصول على جميع السجلات بواسطة معرف الخادم
 * - getLogByServerIdSchema: التحقق من الحصول على سجل بواسطة معرف الخادم
 * - updateLogSchema: التحقق من تحديث سجل موجود
 * - updateLogByServerIdSchema: التحقق من تحديث سجل بواسطة معرف الخادم
 * - deleteLogSchema: التحقق من حذف سجل
 * - deleteLogByServerIdSchema: التحقق من حذف سجل بواسطة معرف الخادم
 * 
 * بنية حقول السجلات / Log Fields Structure:
 * =====================================
 * تم تحديث جميع حقول السجلات لتستخدم بنية كائن موحدة بدلاً من النص البسيط
 * All log fields have been updated to use a unified object structure instead of simple strings
 * 
 * البنية الجديدة لكل حقل / New structure for each field:
 * {
 *   enabled: Boolean - تفعيل/إلغاء تفعيل نوع السجل (مطلوب)
 *                     Enable/disable log type (required)
 *   channel_id: String|null - معرف القناة المخصصة للسجل (اختياري، يمكن أن يكون null)
 *                            Channel ID for the log (optional, can be null)
 * }
 * 
 * أنواع السجلات المدعومة / Supported Log Types:
 * ============================================
 * - member_join_leave: سجلات انضمام ومغادرة الأعضاء
 *                     Member join/leave logs
 * - role_changes: سجلات تغييرات الأدوار
 *                Role changes logs
 * - channel_changes: سجلات تغييرات القنوات
 *                   Channel changes logs
 * - kick_ban: سجلات الطرد والحظر
 *            Kick/ban logs
 * - member_updates: سجلات تحديثات الأعضاء
 *                  Member updates logs
 * - message_changes: سجلات تغييرات الرسائل
 *                   Message changes logs
 * - server_settings: سجلات إعدادات الخادم
 *                   Server settings logs
 * 
 * مثال على البيانات المتوقعة / Expected data example:
 * ================================================
 * {
 *   "server_id": "123456789",
 *   "member_join_leave": {
 *     "enabled": true,
 *     "channel_id": "987654321"
 *   },
 *   "role_changes": {
 *     "enabled": false,
 *     "channel_id": null
 *   }
 * }
 */

/**
 * مخطط التحقق من معرف السجل
 * Log ID validation schema
 */
export const getLogByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف السجل يجب أن يكون نصاً',
        'string.pattern.base': 'معرف السجل يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف السجل مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getLogsByServerIdSchema = {
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
 * مخطط التحقق من الحصول على سجل بواسطة معرف الخادم
 * Get log by server ID validation schema
 */
export const getLogByServerIdSchema = {
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
 * مخطط التحقق من إنشاء سجل جديد
 * Create log validation schema
 */
export const createLogSchema = {
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

    member_join_leave: Joi.object({
      enabled: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'تفعيل سجلات انضمام ومغادرة الأعضاء يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .default(null)
        .messages({
          'string.base': 'معرف قناة سجلات انضمام ومغادرة الأعضاء يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات انضمام ومغادرة الأعضاء يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات انضمام ومغادرة الأعضاء لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات انضمام ومغادرة الأعضاء يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات انضمام ومغادرة الأعضاء يجب أن لا يزيد عن 50 حرف'
        })
    }).optional(),

    role_changes: Joi.object({
      enabled: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'تفعيل سجلات تغييرات الأدوار يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .default(null)
        .messages({
          'string.base': 'معرف قناة سجلات تغييرات الأدوار يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات تغييرات الأدوار يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات تغييرات الأدوار لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات تغييرات الأدوار يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات تغييرات الأدوار يجب أن لا يزيد عن 50 حرف'
        })
    }).optional(),

    channel_changes: Joi.object({
      enabled: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'تفعيل سجلات تغييرات القنوات يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .default(null)
        .messages({
          'string.base': 'معرف قناة سجلات تغييرات القنوات يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات تغييرات القنوات يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات تغييرات القنوات لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات تغييرات القنوات يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات تغييرات القنوات يجب أن لا يزيد عن 50 حرف'
        })
    }).optional(),

    kick_ban: Joi.object({
      enabled: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'تفعيل سجلات الطرد والحظر يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .default(null)
        .messages({
          'string.base': 'معرف قناة سجلات الطرد والحظر يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات الطرد والحظر يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات الطرد والحظر لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات الطرد والحظر يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات الطرد والحظر يجب أن لا يزيد عن 50 حرف'
        })
    }).optional(),

    member_updates: Joi.object({
      enabled: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'تفعيل سجلات تحديثات الأعضاء يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .default(null)
        .messages({
          'string.base': 'معرف قناة سجلات تحديثات الأعضاء يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات تحديثات الأعضاء يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات تحديثات الأعضاء لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات تحديثات الأعضاء يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات تحديثات الأعضاء يجب أن لا يزيد عن 50 حرف'
        })
    }).optional(),

    message_changes: Joi.object({
      enabled: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'تفعيل سجلات تغييرات الرسائل يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .default(null)
        .messages({
          'string.base': 'معرف قناة سجلات تغييرات الرسائل يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات تغييرات الرسائل يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات تغييرات الرسائل لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات تغييرات الرسائل يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات تغييرات الرسائل يجب أن لا يزيد عن 50 حرف'
        })
    }).optional(),

    server_settings: Joi.object({
      enabled: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'تفعيل سجلات إعدادات الخادم يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .default(null)
        .messages({
          'string.base': 'معرف قناة سجلات إعدادات الخادم يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات إعدادات الخادم يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات إعدادات الخادم لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات إعدادات الخادم يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات إعدادات الخادم يجب أن لا يزيد عن 50 حرف'
        })
    }).optional()
  })
};

/**
 * مخطط التحقق من تحديث سجل موجود
 * Update log validation schema
 */
export const updateLogSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف السجل يجب أن يكون نصاً',
        'string.pattern.base': 'معرف السجل يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف السجل مطلوب'
      })
  }),

  body: Joi.object({
    member_join_leave: Joi.object({
      enabled: Joi.boolean()
        .messages({
          'boolean.base': 'تفعيل سجلات انضمام ومغادرة الأعضاء يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .messages({
          'string.base': 'معرف قناة سجلات انضمام ومغادرة الأعضاء يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات انضمام ومغادرة الأعضاء يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات انضمام ومغادرة الأعضاء لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات انضمام ومغادرة الأعضاء يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات انضمام ومغادرة الأعضاء يجب أن لا يزيد عن 50 حرف'
        })
    }),

    role_changes: Joi.object({
      enabled: Joi.boolean()
        .messages({
          'boolean.base': 'تفعيل سجلات تغييرات الأدوار يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .messages({
          'string.base': 'معرف قناة سجلات تغييرات الأدوار يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات تغييرات الأدوار يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات تغييرات الأدوار لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات تغييرات الأدوار يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات تغييرات الأدوار يجب أن لا يزيد عن 50 حرف'
        })
    }),

    channel_changes: Joi.object({
      enabled: Joi.boolean()
        .messages({
          'boolean.base': 'تفعيل سجلات تغييرات القنوات يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .messages({
          'string.base': 'معرف قناة سجلات تغييرات القنوات يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات تغييرات القنوات يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات تغييرات القنوات لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات تغييرات القنوات يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات تغييرات القنوات يجب أن لا يزيد عن 50 حرف'
        })
    }),

    kick_ban: Joi.object({
      enabled: Joi.boolean()
        .messages({
          'boolean.base': 'تفعيل سجلات الطرد والحظر يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .messages({
          'string.base': 'معرف قناة سجلات الطرد والحظر يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات الطرد والحظر يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات الطرد والحظر لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات الطرد والحظر يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات الطرد والحظر يجب أن لا يزيد عن 50 حرف'
        })
    }),

    member_updates: Joi.object({
      enabled: Joi.boolean()
        .messages({
          'boolean.base': 'تفعيل سجلات تحديثات الأعضاء يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .messages({
          'string.base': 'معرف قناة سجلات تحديثات الأعضاء يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات تحديثات الأعضاء يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات تحديثات الأعضاء لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات تحديثات الأعضاء يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات تحديثات الأعضاء يجب أن لا يزيد عن 50 حرف'
        })
    }),

    message_changes: Joi.object({
      enabled: Joi.boolean()
        .messages({
          'boolean.base': 'تفعيل سجلات تغييرات الرسائل يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .messages({
          'string.base': 'معرف قناة سجلات تغييرات الرسائل يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات تغييرات الرسائل يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات تغييرات الرسائل لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات تغييرات الرسائل يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات تغييرات الرسائل يجب أن لا يزيد عن 50 حرف'
        })
    }),

    server_settings: Joi.object({
      enabled: Joi.boolean()
        .messages({
          'boolean.base': 'تفعيل سجلات إعدادات الخادم يجب أن يكون قيمة منطقية'
        }),
      channel_id: Joi.string()
        .pattern(/^\d+$/)
        .trim()
        .min(1)
        .max(50)
        .allow(null)
        .messages({
          'string.base': 'معرف قناة سجلات إعدادات الخادم يجب أن يكون نصاً',
          'string.pattern.base': 'معرف قناة سجلات إعدادات الخادم يجب أن يحتوي على أرقام فقط',
          'string.trim': 'معرف قناة سجلات إعدادات الخادم لا يمكن أن يحتوي على أحرف إضافية',
          'string.min': 'معرف قناة سجلات إعدادات الخادم يجب أن يكون على الأقل حرف واحد',
          'string.max': 'معرف قناة سجلات إعدادات الخادم يجب أن لا يزيد عن 50 حرف'
        })
    })
  }).min(1)
};

/**
 * مخطط التحقق من تحديث سجل بواسطة معرف الخادم
 * Update log by server ID validation schema
 */
export const updateLogByServerIdSchema = {
  params: getLogByServerIdSchema.params,
  body: updateLogSchema.body
};

/**
 * مخطط التحقق من حذف السجل بواسطة المعرف
 * Delete log by ID validation schema
 */
export const deleteLogSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف السجل يجب أن يكون نصاً',
        'string.pattern.base': 'معرف السجل يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف السجل مطلوب'
      })
  })
};

/**
 * مخطط التحقق من حذف سجل بواسطة معرف الخادم
 * Delete log by server ID validation schema
 */
export const deleteLogByServerIdSchema = {
  params: getLogByServerIdSchema.params
};