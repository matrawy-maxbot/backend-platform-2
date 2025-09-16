import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات الإعلانات
 * @module AdsValidator
 */

/**
 * مخطط التحقق من معرف الإعلان
 */
const adIdSchema = Joi.string()
  .required()
  .messages({
    'string.base': 'معرف الإعلان يجب أن يكون نص',
    'string.empty': 'معرف الإعلان لا يمكن أن يكون فارغ',
    'any.required': 'معرف الإعلان مطلوب'
  });

/**
 * مخطط التحقق من معرف الخادم
 */
const guildIdSchema = Joi.string()
  .required()
  .messages({
    'string.base': 'معرف الخادم يجب أن يكون نص',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغ',
    'any.required': 'معرف الخادم مطلوب'
  });

/**
 * مخطط التحقق من معرف القناة
 */
const channelIdSchema = Joi.string()
  .required()
  .messages({
    'string.base': 'معرف القناة يجب أن يكون نص',
    'string.empty': 'معرف القناة لا يمكن أن يكون فارغ',
    'any.required': 'معرف القناة مطلوب'
  });

/**
 * مخطط التحقق من اسم الإعلان
 */
const adNameSchema = Joi.string()
  .min(1)
  .max(100)
  .required()
  .messages({
    'string.base': 'اسم الإعلان يجب أن يكون نص',
    'string.empty': 'اسم الإعلان لا يمكن أن يكون فارغ',
    'string.min': 'اسم الإعلان يجب أن يكون أكثر من حرف واحد',
    'string.max': 'اسم الإعلان يجب أن يكون أقل من 100 حرف',
    'any.required': 'اسم الإعلان مطلوب'
  });

/**
 * مخطط التحقق من نص الإعلان
 */
const adTextSchema = Joi.string()
  .min(1)
  .max(2000)
  .required()
  .messages({
    'string.base': 'نص الإعلان يجب أن يكون نص',
    'string.empty': 'نص الإعلان لا يمكن أن يكون فارغ',
    'string.min': 'نص الإعلان يجب أن يكون أكثر من حرف واحد',
    'string.max': 'نص الإعلان يجب أن يكون أقل من 2000 حرف',
    'any.required': 'نص الإعلان مطلوب'
  });

/**
 * مخطط التحقق من المنطقة الزمنية
 */
const timezoneSchema = Joi.number()
  .integer()
  .min(-12)
  .max(14)
  .default(0)
  .messages({
    'number.base': 'المنطقة الزمنية يجب أن تكون رقم',
    'number.integer': 'المنطقة الزمنية يجب أن تكون رقم صحيح',
    'number.min': 'المنطقة الزمنية يجب أن تكون بين -12 و 14',
    'number.max': 'المنطقة الزمنية يجب أن تكون بين -12 و 14'
  });

/**
 * مخطط التحقق من المدينة
 */
const citySchema = Joi.string()
  .max(50)
  .allow(null, '')
  .messages({
    'string.base': 'المدينة يجب أن تكون نص',
    'string.max': 'المدينة يجب أن تكون أقل من 50 حرف'
  });

/**
 * مخطط التحقق من الساعة
 */
const hourSchema = Joi.number()
  .integer()
  .min(0)
  .max(23)
  .allow(null)
  .messages({
    'number.base': 'الساعة يجب أن تكون رقم',
    'number.integer': 'الساعة يجب أن تكون رقم صحيح',
    'number.min': 'الساعة يجب أن تكون بين 0 و 23',
    'number.max': 'الساعة يجب أن تكون بين 0 و 23'
  });

/**
 * مخطط التحقق من الدقيقة
 */
const minuteSchema = Joi.number()
  .integer()
  .min(0)
  .max(59)
  .allow(null)
  .messages({
    'number.base': 'الدقيقة يجب أن تكون رقم',
    'number.integer': 'الدقيقة يجب أن تكون رقم صحيح',
    'number.min': 'الدقيقة يجب أن تكون بين 0 و 59',
    'number.max': 'الدقيقة يجب أن تكون بين 0 و 59'
  });

/**
 * مخطط التحقق من AM/PM
 */
const apmSchema = Joi.string()
  .valid('AM', 'PM')
  .allow(null)
  .messages({
    'string.base': 'AM/PM يجب أن يكون نص',
    'any.only': 'AM/PM يجب أن يكون AM أو PM'
  });

/**
 * مخطط التحقق من اليوم
 */
const daySchema = Joi.string()
  .valid('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
  .allow(null)
  .messages({
    'string.base': 'اليوم يجب أن يكون نص',
    'any.only': 'اليوم يجب أن يكون أحد أيام الأسبوع الصحيحة'
  });

/**
 * مخطط التحقق من التكرار
 */
const repeatSchema = Joi.boolean()
  .default(false)
  .messages({
    'boolean.base': 'التكرار يجب أن يكون قيمة منطقية (true/false)'
  });

/**
 * مخطط التحقق من الأيام
 */
const daysSchema = Joi.string()
  .allow(null, '')
  .messages({
    'string.base': 'الأيام يجب أن تكون نص'
  });

/**
 * مخطط التحقق من الحد الأقصى للنتائج
 */
const limitSchema = Joi.number()
  .integer()
  .min(1)
  .max(100)
  .default(10)
  .messages({
    'number.base': 'الحد الأقصى يجب أن يكون رقم',
    'number.integer': 'الحد الأقصى يجب أن يكون رقم صحيح',
    'number.min': 'الحد الأقصى يجب أن يكون أكبر من 0',
    'number.max': 'الحد الأقصى يجب أن يكون أقل من أو يساوي 100'
  });

/**
 * مخطط التحقق من عدد الأيام القديمة
 */
const daysOldSchema = Joi.number()
  .integer()
  .min(1)
  .max(3650)
  .default(30)
  .messages({
    'number.base': 'عدد الأيام يجب أن يكون رقم',
    'number.integer': 'عدد الأيام يجب أن يكون رقم صحيح',
    'number.min': 'عدد الأيام يجب أن يكون أكبر من 0',
    'number.max': 'عدد الأيام يجب أن يكون أقل من أو يساوي 3650'
  });

/**
 * مخطط بيانات الجدولة
 */
const scheduleDataSchema = Joi.object({
  timezone: timezoneSchema,
  city: citySchema,
  timeDir: Joi.string().allow(null, ''),
  day: daySchema,
  hour: hourSchema,
  minute: minuteSchema,
  apm: apmSchema,
  repeat: repeatSchema,
  days: daysSchema
}).messages({
  'object.unknown': 'حقل غير مسموح في بيانات الجدولة: {#label}'
});

// ===== مخططات إنشاء الإعلانات =====

/**
 * مخطط إنشاء إعلان جديد
 */
export const createAdSchema = {
  body: Joi.object({
    ad_id: adIdSchema,
    guild_id: guildIdSchema,
    ad_name: adNameSchema,
    ad_channel: channelIdSchema,
    ad_text: adTextSchema,
    ad_timezone: timezoneSchema,
    ad_city: citySchema,
    ad_time_dir: Joi.string().allow(null, ''),
    d: daySchema,
    h: hourSchema,
    m: minuteSchema,
    apm: apmSchema,
    repeat: repeatSchema,
    days: daysSchema
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط إنشاء إعلان مجدول
 */
export const createScheduledAdSchema = {
  body: Joi.object({
    adId: adIdSchema,
    guildId: guildIdSchema,
    adName: adNameSchema,
    adChannel: channelIdSchema,
    adText: adTextSchema,
    scheduleData: scheduleDataSchema
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

// ===== مخططات الحصول على الإعلانات =====

/**
 * مخطط الحصول على إعلان بالمعرف
 */
export const getAdByIdSchema = {
  params: Joi.object({
    adId: adIdSchema
  })
};

/**
 * مخطط الحصول على إعلانات الخادم
 */
export const getAdsByGuildIdSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

/**
 * مخطط الحصول على إعلانات القناة
 */
export const getAdsByChannelSchema = {
  params: Joi.object({
    channelId: channelIdSchema
  })
};

/**
 * مخطط الحصول على إعلانات بالاسم
 */
export const getAdsByNameSchema = {
  query: Joi.object({
    adName: Joi.string()
      .required()
      .messages({
        'string.base': 'اسم الإعلان يجب أن يكون نص',
        'any.required': 'اسم الإعلان مطلوب'
      })
  })
};

/**
 * مخطط الحصول على إعلانات بالمدينة
 */
export const getAdsByCitySchema = {
  query: Joi.object({
    city: Joi.string()
      .required()
      .messages({
        'string.base': 'المدينة يجب أن تكون نص',
        'any.required': 'المدينة مطلوبة'
      })
  })
};

/**
 * مخطط الحصول على إعلانات بالمنطقة الزمنية
 */
export const getAdsByTimezoneSchema = {
  query: Joi.object({
    timezone: Joi.string()
      .required()
      .pattern(/^-?\d+$/)
      .messages({
        'string.base': 'المنطقة الزمنية يجب أن تكون نص',
        'string.pattern.base': 'المنطقة الزمنية يجب أن تكون رقم صحيح',
        'any.required': 'المنطقة الزمنية مطلوبة'
      })
  })
};

/**
 * مخطط الحصول على إعلانات بالتكرار
 */
export const getAdsByRepeatSchema = {
  query: Joi.object({
    isRepeating: Joi.string()
      .valid('true', 'false')
      .required()
      .messages({
        'string.base': 'حالة التكرار يجب أن تكون نص',
        'any.only': 'حالة التكرار يجب أن تكون true أو false',
        'any.required': 'حالة التكرار مطلوبة'
      })
  })
};

/**
 * مخطط الحصول على إعلانات بالوقت
 */
export const getAdsByTimeSchema = {
  query: Joi.object({
    hour: Joi.string()
      .required()
      .pattern(/^\d+$/)
      .messages({
        'string.base': 'الساعة يجب أن تكون نص',
        'string.pattern.base': 'الساعة يجب أن تكون رقم صحيح',
        'any.required': 'الساعة مطلوبة'
      }),
    minute: Joi.string()
      .pattern(/^\d+$/)
      .messages({
        'string.base': 'الدقيقة يجب أن تكون نص',
        'string.pattern.base': 'الدقيقة يجب أن تكون رقم صحيح'
      }),
    apm: apmSchema
  })
};

/**
 * مخطط الحصول على إعلانات باليوم
 */
export const getAdsByDaySchema = {
  query: Joi.object({
    day: daySchema.required().messages({
      'any.required': 'اليوم مطلوب'
    })
  })
};

/**
 * مخطط البحث في نصوص الإعلانات
 */
export const searchAdsTextSchema = {
  query: Joi.object({
    searchText: Joi.string()
      .required()
      .min(1)
      .messages({
        'string.base': 'نص البحث يجب أن يكون نص',
        'string.min': 'نص البحث يجب أن يكون أكثر من حرف واحد',
        'any.required': 'نص البحث مطلوب'
      })
  })
};

/**
 * مخطط الحصول على الإعلانات الحديثة
 */
export const getRecentAdsSchema = {
  query: Joi.object({
    limit: limitSchema
  })
};

/**
 * مخطط الحصول على إعلانات اليوم المجدولة
 */
export const getTodayScheduledAdsSchema = {
  query: Joi.object({
    timezone: Joi.string()
      .pattern(/^-?\d+$/)
      .messages({
        'string.base': 'المنطقة الزمنية يجب أن تكون نص',
        'string.pattern.base': 'المنطقة الزمنية يجب أن تكون رقم صحيح'
      })
  })
};

// ===== مخططات تحديث الإعلانات =====

/**
 * مخطط تحديث إعلان
 */
export const updateAdSchema = {
  params: Joi.object({
    adId: adIdSchema
  }),
  body: Joi.object({
    ad_name: adNameSchema.optional(),
    ad_channel: channelIdSchema.optional(),
    ad_text: adTextSchema.optional(),
    ad_timezone: timezoneSchema.optional(),
    ad_city: citySchema.optional(),
    ad_time_dir: Joi.string().allow(null, '').optional(),
    d: daySchema.optional(),
    h: hourSchema.optional(),
    m: minuteSchema.optional(),
    apm: apmSchema.optional(),
    repeat: repeatSchema.optional(),
    days: daysSchema.optional()
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث نص الإعلان
 */
export const updateAdTextSchema = {
  params: Joi.object({
    adId: adIdSchema
  }),
  body: Joi.object({
    adText: adTextSchema
  })
};

/**
 * مخطط تحديث قناة الإعلان
 */
export const updateAdChannelSchema = {
  params: Joi.object({
    adId: adIdSchema
  }),
  body: Joi.object({
    adChannel: channelIdSchema
  })
};

/**
 * مخطط تحديث اسم الإعلان
 */
export const updateAdNameSchema = {
  params: Joi.object({
    adId: adIdSchema
  }),
  body: Joi.object({
    adName: adNameSchema
  })
};

/**
 * مخطط تحديث جدولة الإعلان
 */
export const updateAdScheduleSchema = {
  params: Joi.object({
    adId: adIdSchema
  }),
  body: scheduleDataSchema.min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
  })
};

/**
 * مخطط تحديث المنطقة الزمنية
 */
export const updateAdTimezoneSchema = {
  params: Joi.object({
    adId: adIdSchema
  }),
  body: Joi.object({
    timezone: timezoneSchema.required().messages({
      'any.required': 'المنطقة الزمنية مطلوبة'
    })
  })
};

/**
 * مخطط تبديل حالة التكرار
 */
export const toggleAdRepeatSchema = {
  params: Joi.object({
    adId: adIdSchema
  })
};

// ===== مخططات حذف الإعلانات =====

/**
 * مخطط حذف إعلان
 */
export const deleteAdSchema = {
  params: Joi.object({
    adId: adIdSchema
  })
};

/**
 * مخطط حذف إعلانات الخادم
 */
export const deleteGuildAdsSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

/**
 * مخطط حذف إعلانات القناة
 */
export const deleteAdsByChannelSchema = {
  params: Joi.object({
    channelId: channelIdSchema
  })
};

/**
 * مخطط حذف الإعلانات القديمة
 */
export const deleteOldAdsSchema = {
  query: Joi.object({
    daysOld: daysOldSchema
  })
};

// ===== مخططات أخرى =====

/**
 * مخطط التحقق من وجود إعلان
 */
export const existsAdSchema = {
  params: Joi.object({
    adId: adIdSchema
  })
};

/**
 * مخطط عد إعلانات الخادم
 */
export const countGuildAdsSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

/**
 * مخطط عد إعلانات القناة
 */
export const countChannelAdsSchema = {
  params: Joi.object({
    channelId: channelIdSchema
  })
};

/**
 * مخطط التحقق من تضارب الجدولة
 */
export const checkScheduleConflictSchema = {
  body: Joi.object({
    guildId: guildIdSchema,
    channelId: channelIdSchema,
    hour: hourSchema.required().messages({
      'any.required': 'الساعة مطلوبة'
    }),
    minute: minuteSchema.required().messages({
      'any.required': 'الدقيقة مطلوبة'
    }),
    day: daySchema
  })
};

/**
 * مخطط إنشاء أو تحديث إعلان
 */
export const upsertAdSchema = {
  params: Joi.object({
    adId: adIdSchema
  }),
  body: Joi.object({
    guild_id: guildIdSchema,
    ad_name: adNameSchema,
    ad_channel: channelIdSchema,
    ad_text: adTextSchema,
    ad_timezone: timezoneSchema,
    ad_city: citySchema,
    ad_time_dir: Joi.string().allow(null, ''),
    d: daySchema,
    h: hourSchema,
    m: minuteSchema,
    apm: apmSchema,
    repeat: repeatSchema,
    days: daysSchema
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط نسخ إعلان
 */
export const copyAdSchema = {
  params: Joi.object({
    sourceAdId: adIdSchema,
    newAdId: adIdSchema
  }),
  body: Joi.object({
    overrideData: Joi.object({
      guild_id: guildIdSchema.optional(),
      ad_name: adNameSchema.optional(),
      ad_channel: channelIdSchema.optional(),
      ad_text: adTextSchema.optional(),
      ad_timezone: timezoneSchema.optional(),
      ad_city: citySchema.optional(),
      ad_time_dir: Joi.string().allow(null, '').optional(),
      d: daySchema.optional(),
      h: hourSchema.optional(),
      m: minuteSchema.optional(),
      apm: apmSchema.optional(),
      repeat: repeatSchema.optional(),
      days: daysSchema.optional()
    }).default({})
  })
};

// ===== دوال التحقق المساعدة =====

/**
 * التحقق من صحة معرف الإعلان
 * @param {string} adId - معرف الإعلان
 * @returns {Object} - نتيجة التحقق
 */
export const validateAdId = (adId) => {
  return adIdSchema.validate(adId);
};

/**
 * التحقق من صحة معرف الخادم
 * @param {string} guildId - معرف الخادم
 * @returns {Object} - نتيجة التحقق
 */
export const validateGuildId = (guildId) => {
  return guildIdSchema.validate(guildId);
};

/**
 * التحقق من صحة معرف القناة
 * @param {string} channelId - معرف القناة
 * @returns {Object} - نتيجة التحقق
 */
export const validateChannelId = (channelId) => {
  return channelIdSchema.validate(channelId);
};

/**
 * التحقق من صحة المنطقة الزمنية
 * @param {number} timezone - المنطقة الزمنية
 * @returns {Object} - نتيجة التحقق
 */
export const validateTimezone = (timezone) => {
  return timezoneSchema.validate(timezone);
};