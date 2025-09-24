import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات إعدادات النسخ الاحتياطية للبائعين
 * @module VendorBackupSettingsValidator
 */

/**
 * مخطط التحقق من معرف البائع
 */
export const getVendorBackupSettingsByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      })
  })
};

/**
 * مخطط إنشاء إعدادات نسخ احتياطية جديدة للبائع
 */
export const createVendorBackupSettingsSchema = {
  body: Joi.object({
    vendor_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      }),
    auto_backup: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'النسخ التلقائي يجب أن يكون قيمة منطقية'
      }),
    backup_frequency: Joi.string()
      .valid('daily', 'weekly', 'monthly', 'custom')
      .default('daily')
      .messages({
        'string.base': 'تكرار النسخ يجب أن يكون نص',
        'any.only': 'تكرار النسخ يجب أن يكون إحدى القيم: daily, weekly, monthly, custom'
      }),
    backup_time: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .default('02:00')
      .messages({
        'string.base': 'وقت النسخ يجب أن يكون نص',
        'string.pattern.base': 'وقت النسخ يجب أن يكون بصيغة HH:MM'
      }),
    retention_period: Joi.number()
      .integer()
      .positive()
      .default(30)
      .messages({
        'number.base': 'فترة الاحتفاظ يجب أن تكون رقم',
        'number.integer': 'فترة الاحتفاظ يجب أن تكون رقم صحيح',
        'number.positive': 'فترة الاحتفاظ يجب أن تكون رقم موجب'
      }),
    max_backups: Joi.number()
      .integer()
      .positive()
      .default(10)
      .messages({
        'number.base': 'الحد الأقصى للنسخ يجب أن يكون رقم',
        'number.integer': 'الحد الأقصى للنسخ يجب أن يكون رقم صحيح',
        'number.positive': 'الحد الأقصى للنسخ يجب أن يكون رقم موجب'
      }),
    storage: Joi.object({
      type: Joi.string()
        .valid('local', 's3', 'google_drive', 'dropbox', 'ftp')
        .default('local')
        .messages({
          'string.base': 'نوع التخزين يجب أن يكون نص',
          'any.only': 'نوع التخزين يجب أن يكون إحدى القيم: local, s3, google_drive, dropbox, ftp'
        }),
      path: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'مسار التخزين يجب أن يكون نص'
        }),
      bucket: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'اسم الحاوية يجب أن يكون نص'
        }),
      folder: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'اسم المجلد يجب أن يكون نص'
        }),
      credentials: Joi.any()
        .allow(null)
        .messages({
          'any.base': 'بيانات الاعتماد غير صحيحة'
        })
    }).default({
      type: 'local'
    }),
    performance: Joi.object({
      compression_level: Joi.number()
        .integer()
        .min(1)
        .max(9)
        .default(6)
        .messages({
          'number.base': 'مستوى الضغط يجب أن يكون رقم',
          'number.integer': 'مستوى الضغط يجب أن يكون رقم صحيح',
          'number.min': 'مستوى الضغط يجب أن يكون 1 على الأقل',
          'number.max': 'مستوى الضغط يجب أن يكون 9 على الأكثر'
        }),
      max_file_size: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
          'number.base': 'الحد الأقصى لحجم الملف يجب أن يكون رقم',
          'number.integer': 'الحد الأقصى لحجم الملف يجب أن يكون رقم صحيح',
          'number.positive': 'الحد الأقصى لحجم الملف يجب أن يكون رقم موجب'
        }),
      split_files: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'تقسيم الملفات يجب أن يكون قيمة منطقية'
        })
    }).default({
      compression_level: 6,
      split_files: false
    }),
    notifications: Joi.object({
      on_success: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار النجاح يجب أن يكون قيمة منطقية'
        }),
      on_failure: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار الفشل يجب أن يكون قيمة منطقية'
        }),
      on_warning: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار التحذير يجب أن يكون قيمة منطقية'
        }),
      email_notifications: Joi.array()
        .items(Joi.string().email())
        .default([])
        .messages({
          'array.base': 'قائمة البريد الإلكتروني يجب أن تكون مصفوفة',
          'string.email': 'عنوان البريد الإلكتروني غير صحيح'
        })
    }).default({
      on_success: true,
      on_failure: true,
      on_warning: true,
      email_notifications: []
    }),
    advanced: Joi.object({
      include_media: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'تضمين الوسائط يجب أن يكون قيمة منطقية'
        }),
      include_database: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'تضمين قاعدة البيانات يجب أن يكون قيمة منطقية'
        }),
      include_logs: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'تضمين السجلات يجب أن يكون قيمة منطقية'
        }),
      backup_before_update: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'النسخ قبل التحديث يجب أن يكون قيمة منطقية'
        })
    }).default({
      include_media: true,
      include_database: true,
      include_logs: false,
      backup_before_update: true
    }),
    last_backup: Joi.object({
      date: Joi.date()
        .allow(null)
        .messages({
          'date.base': 'تاريخ آخر نسخة يجب أن يكون تاريخ صحيح'
        }),
      status: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'حالة آخر نسخة يجب أن تكون نص'
        }),
      size: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
          'number.base': 'حجم آخر نسخة يجب أن يكون رقم',
          'number.integer': 'حجم آخر نسخة يجب أن يكون رقم صحيح',
          'number.positive': 'حجم آخر نسخة يجب أن يكون رقم موجب'
        }),
      duration: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
          'number.base': 'مدة آخر نسخة يجب أن تكون رقم',
          'number.integer': 'مدة آخر نسخة يجب أن تكون رقم صحيح',
          'number.positive': 'مدة آخر نسخة يجب أن تكون رقم موجب'
        })
    }).allow(null),
    next_backup: Joi.date()
      .allow(null)
      .messages({
        'date.base': 'تاريخ النسخة التالية يجب أن يكون تاريخ صحيح'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث إعدادات النسخ الاحتياطية للبائع
 */
export const updateVendorBackupSettingsSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      })
  }),
  body: Joi.object({
    auto_backup: Joi.boolean()
      .messages({
        'boolean.base': 'النسخ التلقائي يجب أن يكون قيمة منطقية'
      }),
    backup_frequency: Joi.string()
      .valid('daily', 'weekly', 'monthly', 'custom')
      .messages({
        'string.base': 'تكرار النسخ يجب أن يكون نص',
        'any.only': 'تكرار النسخ يجب أن يكون إحدى القيم: daily, weekly, monthly, custom'
      }),
    backup_time: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        'string.base': 'وقت النسخ يجب أن يكون نص',
        'string.pattern.base': 'وقت النسخ يجب أن يكون بصيغة HH:MM'
      }),
    retention_period: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'فترة الاحتفاظ يجب أن تكون رقم',
        'number.integer': 'فترة الاحتفاظ يجب أن تكون رقم صحيح',
        'number.positive': 'فترة الاحتفاظ يجب أن تكون رقم موجب'
      }),
    max_backups: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'الحد الأقصى للنسخ يجب أن يكون رقم',
        'number.integer': 'الحد الأقصى للنسخ يجب أن يكون رقم صحيح',
        'number.positive': 'الحد الأقصى للنسخ يجب أن يكون رقم موجب'
      }),
    storage: Joi.object({
      type: Joi.string()
        .valid('local', 's3', 'google_drive', 'dropbox', 'ftp')
        .messages({
          'string.base': 'نوع التخزين يجب أن يكون نص',
          'any.only': 'نوع التخزين يجب أن يكون إحدى القيم: local, s3, google_drive, dropbox, ftp'
        }),
      path: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'مسار التخزين يجب أن يكون نص'
        }),
      bucket: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'اسم الحاوية يجب أن يكون نص'
        }),
      folder: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'اسم المجلد يجب أن يكون نص'
        }),
      credentials: Joi.any()
        .allow(null)
        .messages({
          'any.base': 'بيانات الاعتماد غير صحيحة'
        })
    }),
    performance: Joi.object({
      compression_level: Joi.number()
        .integer()
        .min(1)
        .max(9)
        .messages({
          'number.base': 'مستوى الضغط يجب أن يكون رقم',
          'number.integer': 'مستوى الضغط يجب أن يكون رقم صحيح',
          'number.min': 'مستوى الضغط يجب أن يكون 1 على الأقل',
          'number.max': 'مستوى الضغط يجب أن يكون 9 على الأكثر'
        }),
      max_file_size: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
          'number.base': 'الحد الأقصى لحجم الملف يجب أن يكون رقم',
          'number.integer': 'الحد الأقصى لحجم الملف يجب أن يكون رقم صحيح',
          'number.positive': 'الحد الأقصى لحجم الملف يجب أن يكون رقم موجب'
        }),
      split_files: Joi.boolean()
        .messages({
          'boolean.base': 'تقسيم الملفات يجب أن يكون قيمة منطقية'
        })
    }),
    notifications: Joi.object({
      on_success: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار النجاح يجب أن يكون قيمة منطقية'
        }),
      on_failure: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار الفشل يجب أن يكون قيمة منطقية'
        }),
      on_warning: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار التحذير يجب أن يكون قيمة منطقية'
        }),
      email_notifications: Joi.array()
        .items(Joi.string().email())
        .messages({
          'array.base': 'قائمة البريد الإلكتروني يجب أن تكون مصفوفة',
          'string.email': 'عنوان البريد الإلكتروني غير صحيح'
        })
    }),
    advanced: Joi.object({
      include_media: Joi.boolean()
        .messages({
          'boolean.base': 'تضمين الوسائط يجب أن يكون قيمة منطقية'
        }),
      include_database: Joi.boolean()
        .messages({
          'boolean.base': 'تضمين قاعدة البيانات يجب أن يكون قيمة منطقية'
        }),
      include_logs: Joi.boolean()
        .messages({
          'boolean.base': 'تضمين السجلات يجب أن يكون قيمة منطقية'
        }),
      backup_before_update: Joi.boolean()
        .messages({
          'boolean.base': 'النسخ قبل التحديث يجب أن يكون قيمة منطقية'
        })
    }),
    last_backup: Joi.object({
      date: Joi.date()
        .allow(null)
        .messages({
          'date.base': 'تاريخ آخر نسخة يجب أن يكون تاريخ صحيح'
        }),
      status: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'حالة آخر نسخة يجب أن تكون نص'
        }),
      size: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
          'number.base': 'حجم آخر نسخة يجب أن يكون رقم',
          'number.integer': 'حجم آخر نسخة يجب أن يكون رقم صحيح',
          'number.positive': 'حجم آخر نسخة يجب أن يكون رقم موجب'
        }),
      duration: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
          'number.base': 'مدة آخر نسخة يجب أن تكون رقم',
          'number.integer': 'مدة آخر نسخة يجب أن تكون رقم صحيح',
          'number.positive': 'مدة آخر نسخة يجب أن تكون رقم موجب'
        })
    }).allow(null),
    next_backup: Joi.date()
      .allow(null)
      .messages({
        'date.base': 'تاريخ النسخة التالية يجب أن يكون تاريخ صحيح'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};