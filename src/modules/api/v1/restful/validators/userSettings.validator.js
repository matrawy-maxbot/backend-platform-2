import Joi from 'joi';

/**
 * مخطط التحقق من صحة معرف إعدادات المستخدم
 */
export const getUserSettingsByIdSchema = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'معرف إعدادات المستخدم يجب أن يكون رقماً',
      'number.integer': 'معرف إعدادات المستخدم يجب أن يكون رقماً صحيحاً',
      'number.positive': 'معرف إعدادات المستخدم يجب أن يكون رقماً موجباً',
      'any.required': 'معرف إعدادات المستخدم مطلوب'
    })
  })
};

/**
 * مخطط التحقق من صحة إنشاء إعدادات المستخدم
 */
export const createUserSettingsSchema = {
  body: Joi.object({
    userId: Joi.number().integer().positive().required().messages({
      'number.base': 'معرف المستخدم يجب أن يكون رقماً',
      'number.integer': 'معرف المستخدم يجب أن يكون رقماً صحيحاً',
      'number.positive': 'معرف المستخدم يجب أن يكون رقماً موجباً',
      'any.required': 'معرف المستخدم مطلوب'
    }),
    theme: Joi.string().valid('light', 'dark', 'auto').default('light').messages({
      'string.base': 'السمة يجب أن تكون نصاً',
      'any.only': 'السمة يجب أن تكون إما light أو dark أو auto'
    }),
    language: Joi.string().valid('ar', 'en', 'fr', 'es').default('ar').messages({
      'string.base': 'اللغة يجب أن تكون نصاً',
      'any.only': 'اللغة يجب أن تكون إما ar أو en أو fr أو es'
    }),
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      push: Joi.boolean().default(true),
      sms: Joi.boolean().default(false)
    }).default({
      email: true,
      push: true,
      sms: false
    }),
    privacy: Joi.object({
      profileVisibility: Joi.string().valid('public', 'private', 'friends').default('public'),
      showOnlineStatus: Joi.boolean().default(true),
      allowMessagesFromStrangers: Joi.boolean().default(false)
    }).default({
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowMessagesFromStrangers: false
    }),
    preferences: Joi.object({
      timezone: Joi.string().default('Asia/Riyadh'),
      dateFormat: Joi.string().valid('DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD').default('DD/MM/YYYY'),
      currency: Joi.string().valid('SAR', 'USD', 'EUR', 'GBP').default('SAR')
    }).default({
      timezone: 'Asia/Riyadh',
      dateFormat: 'DD/MM/YYYY',
      currency: 'SAR'
    })
  })
};

/**
 * مخطط التحقق من صحة تحديث إعدادات المستخدم
 */
export const updateUserSettingsSchema = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'معرف إعدادات المستخدم يجب أن يكون رقماً',
      'number.integer': 'معرف إعدادات المستخدم يجب أن يكون رقماً صحيحاً',
      'number.positive': 'معرف إعدادات المستخدم يجب أن يكون رقماً موجباً',
      'any.required': 'معرف إعدادات المستخدم مطلوب'
    })
  }),
  body: Joi.object({
    theme: Joi.string().valid('light', 'dark', 'auto').messages({
      'string.base': 'السمة يجب أن تكون نصاً',
      'any.only': 'السمة يجب أن تكون إما light أو dark أو auto'
    }),
    language: Joi.string().valid('ar', 'en', 'fr', 'es').messages({
      'string.base': 'اللغة يجب أن تكون نصاً',
      'any.only': 'اللغة يجب أن تكون إما ar أو en أو fr أو es'
    }),
    notifications: Joi.object({
      email: Joi.boolean(),
      push: Joi.boolean(),
      sms: Joi.boolean()
    }),
    privacy: Joi.object({
      profileVisibility: Joi.string().valid('public', 'private', 'friends'),
      showOnlineStatus: Joi.boolean(),
      allowMessagesFromStrangers: Joi.boolean()
    }),
    preferences: Joi.object({
      timezone: Joi.string(),
      dateFormat: Joi.string().valid('DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'),
      currency: Joi.string().valid('SAR', 'USD', 'EUR', 'GBP')
    })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
  })
};