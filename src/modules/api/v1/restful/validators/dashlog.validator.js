import Joi from 'joi';

/**
 * مخطط التحقق من إنشاء سجل جديد
 */
export const createLogSchema = Joi.object({
  guild_id: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  }),
  userID: Joi.string().required().messages({
    'any.required': 'معرف المستخدم مطلوب',
    'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغاً'
  }),
  pageName: Joi.string().required().messages({
    'any.required': 'اسم الصفحة مطلوب',
    'string.empty': 'اسم الصفحة لا يمكن أن يكون فارغاً'
  }),
  EventTime: Joi.date().optional().default(() => new Date()).messages({
    'date.base': 'وقت الحدث يجب أن يكون تاريخاً صحيحاً'
  })
});

/**
 * مخطط التحقق من إنشاء سجل للخادم والمستخدم
 */
export const createGuildUserLogSchema = Joi.object({
  guildId: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  }),
  userId: Joi.string().required().messages({
    'any.required': 'معرف المستخدم مطلوب',
    'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغاً'
  }),
  pageName: Joi.string().required().messages({
    'any.required': 'اسم الصفحة مطلوب',
    'string.empty': 'اسم الصفحة لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من الحصول على سجل بواسطة المعرف
 */
export const getLogByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'any.required': 'معرف السجل مطلوب',
    'number.base': 'معرف السجل يجب أن يكون رقماً',
    'number.integer': 'معرف السجل يجب أن يكون رقماً صحيحاً',
    'number.positive': 'معرف السجل يجب أن يكون رقماً موجباً'
  })
});

/**
 * مخطط التحقق من الحصول على السجلات بواسطة معرف الخادم
 */
export const getLogsByGuildIdSchema = Joi.object({
  guildId: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من الحصول على السجلات بواسطة معرف المستخدم
 */
export const getLogsByUserIdSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'معرف المستخدم مطلوب',
    'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من الحصول على السجلات بواسطة اسم الصفحة
 */
export const getLogsByPageNameSchema = Joi.object({
  pageName: Joi.string().required().messages({
    'any.required': 'اسم الصفحة مطلوب',
    'string.empty': 'اسم الصفحة لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من الحصول على السجلات بواسطة نطاق زمني
 */
export const getLogsByDateRangeSchema = Joi.object({
  startDate: Joi.date().required().messages({
    'any.required': 'تاريخ البداية مطلوب',
    'date.base': 'تاريخ البداية يجب أن يكون تاريخاً صحيحاً'
  }),
  endDate: Joi.date().required().min(Joi.ref('startDate')).messages({
    'any.required': 'تاريخ النهاية مطلوب',
    'date.base': 'تاريخ النهاية يجب أن يكون تاريخاً صحيحاً',
    'date.min': 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
  })
});

/**
 * مخطط التحقق من الحصول على السجلات الحديثة
 */
export const getRecentLogsSchema = Joi.object({
  limit: Joi.number().integer().positive().max(1000).optional().default(50).messages({
    'number.base': 'الحد الأقصى يجب أن يكون رقماً',
    'number.integer': 'الحد الأقصى يجب أن يكون رقماً صحيحاً',
    'number.positive': 'الحد الأقصى يجب أن يكون رقماً موجباً',
    'number.max': 'الحد الأقصى لا يمكن أن يتجاوز 1000'
  })
});

/**
 * مخطط التحقق من الحصول على سجلات الخادم والمستخدم
 */
export const getGuildUserLogsSchema = Joi.object({
  guildId: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  }),
  userId: Joi.string().required().messages({
    'any.required': 'معرف المستخدم مطلوب',
    'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من البحث في السجلات
 */
export const searchLogsSchema = Joi.object({
  searchTerm: Joi.string().min(1).required().messages({
    'any.required': 'مصطلح البحث مطلوب',
    'string.empty': 'مصطلح البحث لا يمكن أن يكون فارغاً',
    'string.min': 'مصطلح البحث يجب أن يحتوي على حرف واحد على الأقل'
  })
});

/**
 * مخطط التحقق من تحديث سجل
 */
export const updateLogSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'any.required': 'معرف السجل مطلوب',
    'number.base': 'معرف السجل يجب أن يكون رقماً',
    'number.integer': 'معرف السجل يجب أن يكون رقماً صحيحاً',
    'number.positive': 'معرف السجل يجب أن يكون رقماً موجباً'
  }),
  guild_id: Joi.string().optional().messages({
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  }),
  userID: Joi.string().optional().messages({
    'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغاً'
  }),
  pageName: Joi.string().optional().messages({
    'string.empty': 'اسم الصفحة لا يمكن أن يكون فارغاً'
  }),
  EventTime: Joi.date().optional().messages({
    'date.base': 'وقت الحدث يجب أن يكون تاريخاً صحيحاً'
  })
}).min(1);

/**
 * مخطط التحقق من تحديث اسم الصفحة
 */
export const updatePageNameSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'any.required': 'معرف السجل مطلوب',
    'number.base': 'معرف السجل يجب أن يكون رقماً',
    'number.integer': 'معرف السجل يجب أن يكون رقماً صحيحاً',
    'number.positive': 'معرف السجل يجب أن يكون رقماً موجباً'
  }),
  pageName: Joi.string().required().messages({
    'any.required': 'اسم الصفحة مطلوب',
    'string.empty': 'اسم الصفحة لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من تحديث وقت الحدث
 */
export const updateEventTimeSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'any.required': 'معرف السجل مطلوب',
    'number.base': 'معرف السجل يجب أن يكون رقماً',
    'number.integer': 'معرف السجل يجب أن يكون رقماً صحيحاً',
    'number.positive': 'معرف السجل يجب أن يكون رقماً موجباً'
  }),
  eventTime: Joi.date().optional().messages({
    'date.base': 'وقت الحدث يجب أن يكون تاريخاً صحيحاً'
  })
});

/**
 * مخطط التحقق من حذف سجل
 */
export const deleteLogSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'any.required': 'معرف السجل مطلوب',
    'number.base': 'معرف السجل يجب أن يكون رقماً',
    'number.integer': 'معرف السجل يجب أن يكون رقماً صحيحاً',
    'number.positive': 'معرف السجل يجب أن يكون رقماً موجباً'
  })
});

/**
 * مخطط التحقق من حذف سجلات الخادم
 */
export const deleteGuildLogsSchema = Joi.object({
  guildId: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من حذف سجلات المستخدم
 */
export const deleteUserLogsSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'معرف المستخدم مطلوب',
    'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من حذف السجلات القديمة
 */
export const deleteOldLogsSchema = Joi.object({
  daysOld: Joi.number().integer().positive().max(365).optional().default(30).messages({
    'number.base': 'عدد الأيام يجب أن يكون رقماً',
    'number.integer': 'عدد الأيام يجب أن يكون رقماً صحيحاً',
    'number.positive': 'عدد الأيام يجب أن يكون رقماً موجباً',
    'number.max': 'عدد الأيام لا يمكن أن يتجاوز 365 يوماً'
  })
});

/**
 * مخطط التحقق من حذف سجلات بواسطة اسم الصفحة
 */
export const deleteLogsByPageNameSchema = Joi.object({
  pageName: Joi.string().required().messages({
    'any.required': 'اسم الصفحة مطلوب',
    'string.empty': 'اسم الصفحة لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من حذف سجلات بواسطة نطاق زمني
 */
export const deleteLogsByDateRangeSchema = Joi.object({
  startDate: Joi.date().required().messages({
    'any.required': 'تاريخ البداية مطلوب',
    'date.base': 'تاريخ البداية يجب أن يكون تاريخاً صحيحاً'
  }),
  endDate: Joi.date().required().min(Joi.ref('startDate')).messages({
    'any.required': 'تاريخ النهاية مطلوب',
    'date.base': 'تاريخ النهاية يجب أن يكون تاريخاً صحيحاً',
    'date.min': 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
  })
});

/**
 * مخطط التحقق من عد سجلات الخادم
 */
export const countGuildLogsSchema = Joi.object({
  guildId: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من عد سجلات المستخدم
 */
export const countUserLogsSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'معرف المستخدم مطلوب',
    'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من عد سجلات الصفحة
 */
export const countPageLogsSchema = Joi.object({
  pageName: Joi.string().required().messages({
    'any.required': 'اسم الصفحة مطلوب',
    'string.empty': 'اسم الصفحة لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من وجود سجل
 */
export const logExistsSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'any.required': 'معرف السجل مطلوب',
    'number.base': 'معرف السجل يجب أن يكون رقماً',
    'number.integer': 'معرف السجل يجب أن يكون رقماً صحيحاً',
    'number.positive': 'معرف السجل يجب أن يكون رقماً موجباً'
  })
});

/**
 * مخطط التحقق من الحصول على الصفحات الأكثر زيارة
 */
export const getMostVisitedPagesSchema = Joi.object({
  limit: Joi.number().integer().positive().max(100).optional().default(10).messages({
    'number.base': 'الحد الأقصى يجب أن يكون رقماً',
    'number.integer': 'الحد الأقصى يجب أن يكون رقماً صحيحاً',
    'number.positive': 'الحد الأقصى يجب أن يكون رقماً موجباً',
    'number.max': 'الحد الأقصى لا يمكن أن يتجاوز 100'
  })
});

/**
 * مخطط التحقق من الحصول على المستخدمين الأكثر نشاطاً
 */
export const getMostActiveUsersSchema = Joi.object({
  limit: Joi.number().integer().positive().max(100).optional().default(10).messages({
    'number.base': 'الحد الأقصى يجب أن يكون رقماً',
    'number.integer': 'الحد الأقصى يجب أن يكون رقماً صحيحاً',
    'number.positive': 'الحد الأقصى يجب أن يكون رقماً موجباً',
    'number.max': 'الحد الأقصى لا يمكن أن يتجاوز 100'
  })
});

/**
 * مخطط التحقق من الحصول على الخوادم الأكثر نشاطاً
 */
export const getMostActiveGuildsSchema = Joi.object({
  limit: Joi.number().integer().positive().max(100).optional().default(10).messages({
    'number.base': 'الحد الأقصى يجب أن يكون رقماً',
    'number.integer': 'الحد الأقصى يجب أن يكون رقماً صحيحاً',
    'number.positive': 'الحد الأقصى يجب أن يكون رقماً موجباً',
    'number.max': 'الحد الأقصى لا يمكن أن يتجاوز 100'
  })
});

/**
 * مخطط التحقق من إنشاء أو تحديث سجل
 */
export const upsertLogSchema = Joi.object({
  logData: Joi.object({
    guild_id: Joi.string().required().messages({
      'any.required': 'معرف الخادم مطلوب',
      'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
    }),
    userID: Joi.string().required().messages({
      'any.required': 'معرف المستخدم مطلوب',
      'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغاً'
    }),
    pageName: Joi.string().required().messages({
      'any.required': 'اسم الصفحة مطلوب',
      'string.empty': 'اسم الصفحة لا يمكن أن يكون فارغاً'
    }),
    EventTime: Joi.date().optional().default(() => new Date()).messages({
      'date.base': 'وقت الحدث يجب أن يكون تاريخاً صحيحاً'
    })
  }).required().messages({
    'any.required': 'بيانات السجل مطلوبة'
  }),
  updateData: Joi.object().optional().default({})
});

/**
 * مخطط التحقق من تصدير سجلات الخادم
 */
export const exportGuildLogsSchema = Joi.object({
  guildId: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط التحقق من استيراد سجلات الخادم
 */
export const importGuildLogsSchema = Joi.object({
  guildId: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  }),
  logs: Joi.array().items(
    Joi.object({
      userID: Joi.string().required().messages({
        'any.required': 'معرف المستخدم مطلوب',
        'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغاً'
      }),
      pageName: Joi.string().required().messages({
        'any.required': 'اسم الصفحة مطلوب',
        'string.empty': 'اسم الصفحة لا يمكن أن يكون فارغاً'
      }),
      EventTime: Joi.date().optional().messages({
        'date.base': 'وقت الحدث يجب أن يكون تاريخاً صحيحاً'
      })
    })
  ).min(1).required().messages({
    'any.required': 'قائمة السجلات مطلوبة',
    'array.min': 'يجب أن تحتوي قائمة السجلات على سجل واحد على الأقل'
  })
});