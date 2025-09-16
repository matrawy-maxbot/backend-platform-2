import Joi from 'joi';

// Schema أساسي لمعرف الخادم
const guildIdSchema = Joi.string().required().messages({
  'string.empty': 'معرف الخادم مطلوب',
  'any.required': 'معرف الخادم مطلوب'
});

// Schema أساسي لاسم الخادم
const serverNameSchema = Joi.string().min(1).max(100).required().messages({
  'string.empty': 'اسم الخادم مطلوب',
  'string.min': 'اسم الخادم يجب أن يكون على الأقل حرف واحد',
  'string.max': 'اسم الخادم يجب أن يكون أقل من 100 حرف',
  'any.required': 'اسم الخادم مطلوب'
});

// Schema لإنشاء نسخة احتياطية
export const createBackupSchema = Joi.object({
  guild_id: guildIdSchema,
  server_name: serverNameSchema,
  inactive_ch: Joi.string().allow(null, ''),
  inactive_Timeout: Joi.number().integer().min(0).allow(null),
  system_messages: Joi.string().allow(null, ''),
  category: Joi.string().allow(null, ''),
  chat: Joi.string().allow(null, ''),
  voice: Joi.string().allow(null, ''),
  announcement: Joi.string().allow(null, ''),
  stage: Joi.string().allow(null, ''),
  roles: Joi.string().allow(null, ''),
  TimeStamp: Joi.date().default(() => new Date())
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لإنشاء نسخة احتياطية للخادم
export const createServerBackupSchema = Joi.object({
  guildId: guildIdSchema,
  serverName: serverNameSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للحصول على نسخة احتياطية بواسطة معرف الخادم
export const getBackupByGuildIdSchema = Joi.object({
  guildId: guildIdSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للحصول على النسخ الاحتياطية بواسطة اسم الخادم
export const getBackupsByServerNameSchema = Joi.object({
  serverName: serverNameSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للحصول على النسخ الاحتياطية بواسطة القناة غير النشطة
export const getBackupsByInactiveChannelSchema = Joi.object({
  inactiveChannel: Joi.string().required().messages({
    'string.empty': 'القناة غير النشطة مطلوبة',
    'any.required': 'القناة غير النشطة مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للحصول على النسخ الاحتياطية بواسطة مهلة عدم النشاط
export const getBackupsByInactiveTimeoutSchema = Joi.object({
  timeout: Joi.number().integer().min(0).required().messages({
    'number.base': 'مهلة عدم النشاط يجب أن تكون رقم',
    'number.integer': 'مهلة عدم النشاط يجب أن تكون رقم صحيح',
    'number.min': 'مهلة عدم النشاط يجب أن تكون أكبر من أو تساوي 0',
    'any.required': 'مهلة عدم النشاط مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للحصول على النسخ الاحتياطية بواسطة رسائل النظام
export const getBackupsBySystemMessagesSchema = Joi.object({
  systemMessages: Joi.string().required().messages({
    'string.empty': 'رسائل النظام مطلوبة',
    'any.required': 'رسائل النظام مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للحصول على النسخ الاحتياطية بواسطة نطاق التاريخ
export const getBackupsByDateRangeSchema = Joi.object({
  startDate: Joi.date().required().messages({
    'date.base': 'تاريخ البداية يجب أن يكون تاريخ صحيح',
    'any.required': 'تاريخ البداية مطلوب'
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.base': 'تاريخ النهاية يجب أن يكون تاريخ صحيح',
    'date.min': 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
    'any.required': 'تاريخ النهاية مطلوب'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للحصول على النسخ الاحتياطية الحديثة
export const getRecentBackupsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'الحد الأقصى يجب أن يكون رقم',
    'number.integer': 'الحد الأقصى يجب أن يكون رقم صحيح',
    'number.min': 'الحد الأقصى يجب أن يكون على الأقل 1',
    'number.max': 'الحد الأقصى يجب أن يكون أقل من أو يساوي 100'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث نسخة احتياطية
export const updateBackupSchema = Joi.object({
  guildId: guildIdSchema,
  server_name: Joi.string().min(1).max(100).optional(),
  inactive_ch: Joi.string().allow(null, '').optional(),
  inactive_Timeout: Joi.number().integer().min(0).allow(null).optional(),
  system_messages: Joi.string().allow(null, '').optional(),
  category: Joi.string().allow(null, '').optional(),
  chat: Joi.string().allow(null, '').optional(),
  voice: Joi.string().allow(null, '').optional(),
  announcement: Joi.string().allow(null, '').optional(),
  stage: Joi.string().allow(null, '').optional(),
  roles: Joi.string().allow(null, '').optional(),
  TimeStamp: Joi.date().optional()
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث اسم الخادم
export const updateServerNameSchema = Joi.object({
  guildId: guildIdSchema,
  serverName: serverNameSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث القناة غير النشطة
export const updateInactiveChannelSchema = Joi.object({
  guildId: guildIdSchema,
  inactiveChannel: Joi.string().allow(null, '').required().messages({
    'any.required': 'القناة غير النشطة مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث مهلة عدم النشاط
export const updateInactiveTimeoutSchema = Joi.object({
  guildId: guildIdSchema,
  timeout: Joi.number().integer().min(0).allow(null).required().messages({
    'number.base': 'مهلة عدم النشاط يجب أن تكون رقم',
    'number.integer': 'مهلة عدم النشاط يجب أن تكون رقم صحيح',
    'number.min': 'مهلة عدم النشاط يجب أن تكون أكبر من أو تساوي 0',
    'any.required': 'مهلة عدم النشاط مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث رسائل النظام
export const updateSystemMessagesSchema = Joi.object({
  guildId: guildIdSchema,
  systemMessages: Joi.string().allow(null, '').required().messages({
    'any.required': 'رسائل النظام مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث الفئات
export const updateCategoriesSchema = Joi.object({
  guildId: guildIdSchema,
  categories: Joi.alternatives().try(
    Joi.string(),
    Joi.array(),
    Joi.object()
  ).allow(null).required().messages({
    'any.required': 'الفئات مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث قنوات الدردشة
export const updateChatChannelsSchema = Joi.object({
  guildId: guildIdSchema,
  chatChannels: Joi.alternatives().try(
    Joi.string(),
    Joi.array(),
    Joi.object()
  ).allow(null).required().messages({
    'any.required': 'قنوات الدردشة مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث القنوات الصوتية
export const updateVoiceChannelsSchema = Joi.object({
  guildId: guildIdSchema,
  voiceChannels: Joi.alternatives().try(
    Joi.string(),
    Joi.array(),
    Joi.object()
  ).allow(null).required().messages({
    'any.required': 'القنوات الصوتية مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث قنوات الإعلانات
export const updateAnnouncementChannelsSchema = Joi.object({
  guildId: guildIdSchema,
  announcementChannels: Joi.alternatives().try(
    Joi.string(),
    Joi.array(),
    Joi.object()
  ).allow(null).required().messages({
    'any.required': 'قنوات الإعلانات مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث قنوات المسرح
export const updateStageChannelsSchema = Joi.object({
  guildId: guildIdSchema,
  stageChannels: Joi.alternatives().try(
    Joi.string(),
    Joi.array(),
    Joi.object()
  ).allow(null).required().messages({
    'any.required': 'قنوات المسرح مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث الأدوار
export const updateRolesSchema = Joi.object({
  guildId: guildIdSchema,
  roles: Joi.alternatives().try(
    Joi.string(),
    Joi.array(),
    Joi.object()
  ).allow(null).required().messages({
    'any.required': 'الأدوار مطلوبة'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لتحديث الطابع الزمني
export const updateTimeStampSchema = Joi.object({
  guildId: guildIdSchema,
  timeStamp: Joi.date().default(() => new Date()).messages({
    'date.base': 'الطابع الزمني يجب أن يكون تاريخ صحيح'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لحذف نسخة احتياطية
export const deleteBackupSchema = Joi.object({
  guildId: guildIdSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لحذف النسخ الاحتياطية القديمة
export const deleteOldBackupsSchema = Joi.object({
  daysOld: Joi.number().integer().min(1).default(30).messages({
    'number.base': 'عدد الأيام يجب أن يكون رقم',
    'number.integer': 'عدد الأيام يجب أن يكون رقم صحيح',
    'number.min': 'عدد الأيام يجب أن يكون على الأقل 1'
  })
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لحذف النسخ الاحتياطية بواسطة اسم الخادم
export const deleteBackupsByServerNameSchema = Joi.object({
  serverName: serverNameSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للتحقق من وجود نسخة احتياطية
export const existsBackupSchema = Joi.object({
  guildId: guildIdSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للتحقق من اكتمال النسخة الاحتياطية
export const isBackupCompleteSchema = Joi.object({
  guildId: guildIdSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema للحصول على حجم النسخة الاحتياطية
export const getBackupSizeSchema = Joi.object({
  guildId: guildIdSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لإدراج أو تحديث نسخة احتياطية
export const upsertBackupSchema = Joi.object({
  guildId: guildIdSchema,
  server_name: Joi.string().min(1).max(100).optional(),
  inactive_ch: Joi.string().allow(null, '').optional(),
  inactive_Timeout: Joi.number().integer().min(0).allow(null).optional(),
  system_messages: Joi.string().allow(null, '').optional(),
  category: Joi.string().allow(null, '').optional(),
  chat: Joi.string().allow(null, '').optional(),
  voice: Joi.string().allow(null, '').optional(),
  announcement: Joi.string().allow(null, '').optional(),
  stage: Joi.string().allow(null, '').optional(),
  roles: Joi.string().allow(null, '').optional(),
  TimeStamp: Joi.date().optional()
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لاستعادة نسخة احتياطية
export const restoreBackupSchema = Joi.object({
  guildId: guildIdSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

// Schema لمقارنة النسخ الاحتياطية
export const compareBackupsSchema = Joi.object({
  guildId1: guildIdSchema,
  guildId2: guildIdSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});