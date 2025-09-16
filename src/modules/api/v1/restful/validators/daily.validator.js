import Joi from 'joi';

// مخططات أساسية قابلة لإعادة الاستخدام
const userId = Joi.string().required().messages({
  'string.empty': 'معرف المستخدم مطلوب',
  'any.required': 'معرف المستخدم مطلوب'
});

const date = Joi.date().iso().messages({
  'date.format': 'تنسيق التاريخ غير صحيح، يجب أن يكون بصيغة ISO',
  'date.base': 'التاريخ يجب أن يكون تاريخاً صحيحاً'
});

const limit = Joi.number().integer().min(1).max(100).default(10).messages({
  'number.base': 'الحد الأقصى يجب أن يكون رقماً',
  'number.integer': 'الحد الأقصى يجب أن يكون رقماً صحيحاً',
  'number.min': 'الحد الأقصى يجب أن يكون أكبر من 0',
  'number.max': 'الحد الأقصى لا يمكن أن يكون أكبر من 100'
});

const daysOld = Joi.number().integer().min(1).max(365).default(30).messages({
  'number.base': 'عدد الأيام يجب أن يكون رقماً',
  'number.integer': 'عدد الأيام يجب أن يكون رقماً صحيحاً',
  'number.min': 'عدد الأيام يجب أن يكون أكبر من 0',
  'number.max': 'عدد الأيام لا يمكن أن يكون أكبر من 365'
});

// مخططات التحقق من صحة البيانات
export const createDailySchema = {
  body: Joi.object({
    id: userId,
    daily: date.default(() => new Date())
  })
};

export const getDailyByIdSchema = {
  params: Joi.object({
    userId
  })
};

export const getDailyByDateSchema = {
  params: Joi.object({
    date: date.required().messages({
      'any.required': 'التاريخ مطلوب'
    })
  })
};

export const getDailyByDateRangeSchema = {
  query: Joi.object({
    startDate: date.required().messages({
      'any.required': 'تاريخ البداية مطلوب'
    }),
    endDate: date.required().messages({
      'any.required': 'تاريخ النهاية مطلوب'
    })
  }).custom((value, helpers) => {
    if (new Date(value.startDate) >= new Date(value.endDate)) {
      return helpers.error('any.invalid', { message: 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية' });
    }
    return value;
  })
};

export const hasUserDailyTodaySchema = {
  params: Joi.object({
    userId
  })
};

export const updateDailySchema = {
  params: Joi.object({
    userId
  }),
  body: Joi.object({
    daily: date.optional()
  }).min(1).messages({
    'object.min': 'يجب تقديم بيانات للتحديث'
  })
};

export const updateUserDailyTimestampSchema = {
  params: Joi.object({
    userId
  })
};

export const deleteDailySchema = {
  params: Joi.object({
    userId
  })
};

export const deleteOldDailySchema = {
  query: Joi.object({
    daysOld: daysOld.optional()
  })
};

export const deleteDailyByDateSchema = {
  params: Joi.object({
    date: date.required().messages({
      'any.required': 'التاريخ مطلوب'
    })
  })
};

export const getMostActiveUsersSchema = {
  query: Joi.object({
    limit: limit.optional()
  })
};

export const createOrUpdateDailySchema = {
  params: Joi.object({
    userId
  })
};

// مخطط فارغ للعمليات التي لا تحتاج تحقق
export const emptySchema = {};

// تصدير جميع المخططات
const dailyValidator = {
  createDailySchema,
  getDailyByIdSchema,
  getDailyByDateSchema,
  getDailyByDateRangeSchema,
  hasUserDailyTodaySchema,
  updateDailySchema,
  updateUserDailyTimestampSchema,
  deleteDailySchema,
  deleteOldDailySchema,
  deleteDailyByDateSchema,
  getMostActiveUsersSchema,
  createOrUpdateDailySchema,
  emptySchema
};

export default dailyValidator;