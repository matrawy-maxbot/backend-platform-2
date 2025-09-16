import Joi from 'joi';

/**
 * مخطط إنشاء سجل مدة التحقق
 */
export const createVerifyDurSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  }),
  guild_id: Joi.string().required().messages({
    'string.empty': 'معرف الخادم مطلوب',
    'any.required': 'معرف الخادم مطلوب'
  }),
  duration: Joi.string().pattern(/^\d+[smhd]$/).default('1h').messages({
    'string.pattern.base': 'تنسيق المدة غير صحيح (مثال: 1h, 30m, 2d)'
  }),
  TimeStamp: Joi.date().default(() => new Date())
});

/**
 * مخطط إنشاء سجل مدة التحقق للمستخدم
 */
export const createUserVerifyDurSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  }),
  guildId: Joi.string().required().messages({
    'string.empty': 'معرف الخادم مطلوب',
    'any.required': 'معرف الخادم مطلوب'
  }),
  duration: Joi.string().pattern(/^\d+[smhd]$/).default('1h').messages({
    'string.pattern.base': 'تنسيق المدة غير صحيح (مثال: 1h, 30m, 2d)'
  })
});

/**
 * مخطط تحديث سجل مدة التحقق
 */
export const updateVerifyDurSchema = Joi.object({
  userId: Joi.string().optional(),
  guild_id: Joi.string().optional(),
  duration: Joi.string().pattern(/^\d+[smhd]$/).optional().messages({
    'string.pattern.base': 'تنسيق المدة غير صحيح (مثال: 1h, 30m, 2d)'
  }),
  TimeStamp: Joi.date().optional()
});

/**
 * مخطط تحديث مدة التحقق للمستخدم
 */
export const updateUserVerifyDurationSchema = Joi.object({
  duration: Joi.string().pattern(/^\d+[smhd]$/).required().messages({
    'string.empty': 'المدة مطلوبة',
    'any.required': 'المدة مطلوبة',
    'string.pattern.base': 'تنسيق المدة غير صحيح (مثال: 1h, 30m, 2d)'
  })
});

/**
 * مخطط الحصول على سجل مدة التحقق بواسطة المعرف
 */
export const getVerifyDurByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'المعرف يجب أن يكون رقم',
    'number.integer': 'المعرف يجب أن يكون رقم صحيح',
    'number.positive': 'المعرف يجب أن يكون رقم موجب',
    'any.required': 'المعرف مطلوب'
  })
});

/**
 * مخطط الحصول على سجل مدة التحقق للمستخدم والخادم
 */
export const getVerifyDurByUserAndGuildSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  }),
  guildId: Joi.string().required().messages({
    'string.empty': 'معرف الخادم مطلوب',
    'any.required': 'معرف الخادم مطلوب'
  })
});

/**
 * مخطط الحصول على سجلات مدة التحقق للمستخدم
 */
export const getVerifyDurByUserIdSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  })
});

/**
 * مخطط الحصول على سجلات مدة التحقق للخادم
 */
export const getVerifyDurByGuildIdSchema = Joi.object({
  guildId: Joi.string().required().messages({
    'string.empty': 'معرف الخادم مطلوب',
    'any.required': 'معرف الخادم مطلوب'
  })
});

/**
 * مخطط الحصول على سجلات مدة التحقق بواسطة المدة
 */
export const getVerifyDurByDurationSchema = Joi.object({
  duration: Joi.string().pattern(/^\d+[smhd]$/).required().messages({
    'string.empty': 'المدة مطلوبة',
    'any.required': 'المدة مطلوبة',
    'string.pattern.base': 'تنسيق المدة غير صحيح (مثال: 1h, 30m, 2d)'
  })
});

/**
 * مخطط الحصول على سجلات مدة التحقق بواسطة النطاق الزمني
 */
export const getVerifyDurByDateRangeSchema = Joi.object({
  startDate: Joi.date().required().messages({
    'date.base': 'تاريخ البداية يجب أن يكون تاريخ صحيح',
    'any.required': 'تاريخ البداية مطلوب'
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.base': 'تاريخ النهاية يجب أن يكون تاريخ صحيح',
    'date.min': 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
    'any.required': 'تاريخ النهاية مطلوب'
  })
});

/**
 * مخطط الحصول على أحدث سجلات مدة التحقق
 */
export const getRecentVerifyDurSchema = Joi.object({
  limit: Joi.number().integer().positive().max(100).default(10).messages({
    'number.base': 'الحد الأقصى يجب أن يكون رقم',
    'number.integer': 'الحد الأقصى يجب أن يكون رقم صحيح',
    'number.positive': 'الحد الأقصى يجب أن يكون رقم موجب',
    'number.max': 'الحد الأقصى لا يمكن أن يتجاوز 100'
  })
});

/**
 * مخطط حذف السجلات القديمة
 */
export const deleteOldVerifyDurSchema = Joi.object({
  daysOld: Joi.number().integer().positive().default(30).messages({
    'number.base': 'عدد الأيام يجب أن يكون رقم',
    'number.integer': 'عدد الأيام يجب أن يكون رقم صحيح',
    'number.positive': 'عدد الأيام يجب أن يكون رقم موجب'
  })
});

/**
 * مخطط تمديد مدة التحقق
 */
export const extendVerifyDurationSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  }),
  guildId: Joi.string().required().messages({
    'string.empty': 'معرف الخادم مطلوب',
    'any.required': 'معرف الخادم مطلوب'
  }),
  extensionHours: Joi.number().integer().positive().required().messages({
    'number.base': 'ساعات التمديد يجب أن تكون رقم',
    'number.integer': 'ساعات التمديد يجب أن تكون رقم صحيح',
    'number.positive': 'ساعات التمديد يجب أن تكون رقم موجب',
    'any.required': 'ساعات التمديد مطلوبة'
  })
});