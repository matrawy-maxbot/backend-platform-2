import Joi from 'joi';

// مخططات أساسية
const eventIdSchema = Joi.string().required().messages({
  'string.empty': 'معرف الحدث مطلوب',
  'any.required': 'معرف الحدث مطلوب'
});

const guildIdSchema = Joi.string().required().messages({
  'string.empty': 'معرف الخادم مطلوب',
  'any.required': 'معرف الخادم مطلوب'
});

const channelIdSchema = Joi.string().required().messages({
  'string.empty': 'معرف القناة مطلوب',
  'any.required': 'معرف القناة مطلوب'
});

const eventNameSchema = Joi.string().min(1).max(255).required().messages({
  'string.empty': 'اسم الحدث مطلوب',
  'string.min': 'اسم الحدث يجب أن يكون على الأقل حرف واحد',
  'string.max': 'اسم الحدث يجب أن يكون أقل من 255 حرف',
  'any.required': 'اسم الحدث مطلوب'
});

const eventChannelSchema = Joi.string().required().messages({
  'string.empty': 'قناة الحدث مطلوبة',
  'any.required': 'قناة الحدث مطلوبة'
});

const durationSchema = Joi.string().optional().messages({
  'string.base': 'المدة يجب أن تكون نص'
});

const hourSchema = Joi.string().pattern(/^(0?[1-9]|1[0-2])$/).optional().messages({
  'string.pattern.base': 'الساعة يجب أن تكون بين 1-12'
});

const minuteSchema = Joi.string().pattern(/^[0-5]?[0-9]$/).optional().messages({
  'string.pattern.base': 'الدقيقة يجب أن تكون بين 0-59'
});

const apmSchema = Joi.string().valid('AM', 'PM', 'am', 'pm').optional().messages({
  'any.only': 'يجب أن يكون AM أو PM'
});

const daysSchema = Joi.string().optional().messages({
  'string.base': 'الأيام يجب أن تكون نص'
});

const citySchema = Joi.string().optional().messages({
  'string.base': 'المدينة يجب أن تكون نص'
});

const prizesSchema = Joi.string().optional().allow('').messages({
  'string.base': 'الجوائز يجب أن تكون نص'
});

const limitSchema = Joi.number().integer().min(1).max(1000).optional().messages({
  'number.base': 'الحد الأقصى يجب أن يكون رقم',
  'number.integer': 'الحد الأقصى يجب أن يكون رقم صحيح',
  'number.min': 'الحد الأقصى يجب أن يكون على الأقل 1',
  'number.max': 'الحد الأقصى يجب أن يكون أقل من 1000'
});

const searchTermSchema = Joi.string().min(1).max(255).required().messages({
  'string.empty': 'مصطلح البحث مطلوب',
  'string.min': 'مصطلح البحث يجب أن يكون على الأقل حرف واحد',
  'string.max': 'مصطلح البحث يجب أن يكون أقل من 255 حرف',
  'any.required': 'مصطلح البحث مطلوب'
});

const dateSchema = Joi.date().iso().messages({
  'date.base': 'التاريخ يجب أن يكون تاريخ صحيح',
  'date.format': 'التاريخ يجب أن يكون بصيغة ISO'
});

const daysOldSchema = Joi.number().integer().min(1).max(365).optional().messages({
  'number.base': 'عدد الأيام يجب أن يكون رقم',
  'number.integer': 'عدد الأيام يجب أن يكون رقم صحيح',
  'number.min': 'عدد الأيام يجب أن يكون على الأقل 1',
  'number.max': 'عدد الأيام يجب أن يكون أقل من 365'
});

// مخططات إنشاء الأحداث
export const createEventSchema = {
  body: Joi.object({
    guild_id: guildIdSchema,
    event_name: eventNameSchema.optional(),
    event_channel: eventChannelSchema.optional(),
    event_prizes: prizesSchema,
    event_city: citySchema,
    duration: durationSchema,
    h: hourSchema,
    m: minuteSchema,
    apm: apmSchema,
    days: daysSchema
  }).messages({
    'object.base': 'البيانات يجب أن تكون كائن صحيح'
  })
};

export const createGuildEventSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  }),
  body: Joi.object({
    event_name: eventNameSchema.optional(),
    event_channel: eventChannelSchema.optional(),
    event_prizes: prizesSchema,
    event_city: citySchema,
    duration: durationSchema,
    h: hourSchema,
    m: minuteSchema,
    apm: apmSchema,
    days: daysSchema
  }).messages({
    'object.base': 'البيانات يجب أن تكون كائن صحيح'
  })
};

export const createScheduledEventSchema = {
  body: Joi.object({
    guildId: guildIdSchema,
    eventName: eventNameSchema,
    eventChannel: eventChannelSchema,
    duration: durationSchema.required(),
    hour: hourSchema.required(),
    minute: minuteSchema.required(),
    apm: apmSchema.required(),
    days: daysSchema.required(),
    event_prizes: prizesSchema,
    event_city: citySchema
  }).messages({
    'object.base': 'البيانات يجب أن تكون كائن صحيح'
  })
};

// مخططات الحصول على الأحداث
export const getEventByIdSchema = {
  params: Joi.object({
    eventId: eventIdSchema
  })
};

export const getEventsByGuildIdSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

export const getEventsByChannelSchema = {
  params: Joi.object({
    channelId: channelIdSchema
  })
};

export const getEventsByNameSchema = {
  params: Joi.object({
    eventName: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'اسم الحدث مطلوب',
      'string.min': 'اسم الحدث يجب أن يكون على الأقل حرف واحد',
      'string.max': 'اسم الحدث يجب أن يكون أقل من 255 حرف',
      'any.required': 'اسم الحدث مطلوب'
    })
  })
};

export const getEventsByCitySchema = {
  params: Joi.object({
    city: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'المدينة مطلوبة',
      'string.min': 'المدينة يجب أن تكون على الأقل حرف واحد',
      'string.max': 'المدينة يجب أن تكون أقل من 255 حرف',
      'any.required': 'المدينة مطلوبة'
    })
  })
};

export const getEventsByDurationSchema = {
  params: Joi.object({
    duration: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'المدة مطلوبة',
      'string.min': 'المدة يجب أن تكون على الأقل حرف واحد',
      'string.max': 'المدة يجب أن تكون أقل من 255 حرف',
      'any.required': 'المدة مطلوبة'
    })
  })
};

export const getEventsByTimeSchema = {
  query: Joi.object({
    hour: hourSchema,
    minute: minuteSchema,
    apm: apmSchema
  }).or('hour', 'minute', 'apm').messages({
    'object.missing': 'يجب تحديد على الأقل واحد من: الساعة، الدقيقة، أو AM/PM'
  })
};

export const getEventsByDaysSchema = {
  params: Joi.object({
    days: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'الأيام مطلوبة',
      'string.min': 'الأيام يجب أن تكون على الأقل حرف واحد',
      'string.max': 'الأيام يجب أن تكون أقل من 255 حرف',
      'any.required': 'الأيام مطلوبة'
    })
  })
};

export const getEventsByDateRangeSchema = {
  query: Joi.object({
    startDate: dateSchema.required(),
    endDate: dateSchema.required()
  }).messages({
    'object.base': 'البيانات يجب أن تكون كائن صحيح'
  })
};

export const getRecentEventsSchema = {
  query: Joi.object({
    limit: limitSchema
  })
};

export const searchEventsSchema = {
  query: Joi.object({
    searchTerm: searchTermSchema
  })
};

// مخططات تحديث الأحداث
export const updateEventSchema = {
  params: Joi.object({
    eventId: eventIdSchema
  }),
  body: Joi.object({
    guild_id: guildIdSchema.optional(),
    event_name: eventNameSchema.optional(),
    event_channel: eventChannelSchema.optional(),
    event_prizes: prizesSchema,
    event_city: citySchema,
    duration: durationSchema,
    h: hourSchema,
    m: minuteSchema,
    apm: apmSchema,
    days: daysSchema
  }).min(1).messages({
    'object.base': 'البيانات يجب أن تكون كائن صحيح',
    'object.min': 'يجب تحديد على الأقل حقل واحد للتحديث'
  })
};

export const updateEventNameSchema = {
  params: Joi.object({
    eventId: eventIdSchema
  }),
  body: Joi.object({
    eventName: eventNameSchema
  })
};

export const updateEventChannelSchema = {
  params: Joi.object({
    eventId: eventIdSchema
  }),
  body: Joi.object({
    channelId: channelIdSchema
  })
};

export const updateEventPrizesSchema = {
  params: Joi.object({
    eventId: eventIdSchema
  }),
  body: Joi.object({
    prizes: prizesSchema.required()
  })
};

export const updateEventDurationSchema = {
  params: Joi.object({
    eventId: eventIdSchema
  }),
  body: Joi.object({
    duration: durationSchema.required()
  })
};

export const updateEventTimeSchema = {
  params: Joi.object({
    eventId: eventIdSchema
  }),
  body: Joi.object({
    hour: hourSchema,
    minute: minuteSchema,
    apm: apmSchema
  }).or('hour', 'minute', 'apm').messages({
    'object.missing': 'يجب تحديد على الأقل واحد من: الساعة، الدقيقة، أو AM/PM'
  })
};

export const updateEventDaysSchema = {
  params: Joi.object({
    eventId: eventIdSchema
  }),
  body: Joi.object({
    days: daysSchema.required()
  })
};

export const updateEventCitySchema = {
  params: Joi.object({
    eventId: eventIdSchema
  }),
  body: Joi.object({
    city: citySchema.required()
  })
};

// مخططات حذف الأحداث
export const deleteEventSchema = {
  params: Joi.object({
    eventId: eventIdSchema
  })
};

export const deleteGuildEventsSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

export const deleteChannelEventsSchema = {
  params: Joi.object({
    channelId: channelIdSchema
  })
};

export const deleteEventsByCitySchema = {
  params: Joi.object({
    city: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'المدينة مطلوبة',
      'string.min': 'المدينة يجب أن تكون على الأقل حرف واحد',
      'string.max': 'المدينة يجب أن تكون أقل من 255 حرف',
      'any.required': 'المدينة مطلوبة'
    })
  })
};

export const deleteOldEventsSchema = {
  query: Joi.object({
    daysOld: daysOldSchema
  })
};