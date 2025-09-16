import Joi from 'joi';

const codesValidator = {
  // مخطط التحقق من إنشاء رمز جديد
  createCode: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      }),
    guild_id: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'معرف الخادم مطلوب',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد',
        'string.max': 'معرف الخادم يجب أن لا يتجاوز 100 حرف',
        'any.required': 'معرف الخادم مطلوب'
      }),
    users: Joi.alternatives()
      .try(
        Joi.string(),
        Joi.array().items(Joi.string())
      )
      .required()
      .messages({
        'any.required': 'المستخدمون مطلوبون'
      }),
    dur: Joi.string()
      .min(1)
      .max(20)
      .required()
      .messages({
        'string.empty': 'المدة مطلوبة',
        'string.min': 'المدة يجب أن تكون على الأقل حرف واحد',
        'string.max': 'المدة يجب أن لا تتجاوز 20 حرف',
        'any.required': 'المدة مطلوبة'
      }),
    timestamp: Joi.date()
      .default(() => new Date())
      .messages({
        'date.base': 'الطابع الزمني يجب أن يكون تاريخ صحيح'
      })
  }),

  // مخطط التحقق من إنشاء رمز للخادم
  createGuildCode: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      }),
    guildId: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'معرف الخادم مطلوب',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد',
        'string.max': 'معرف الخادم يجب أن لا يتجاوز 100 حرف',
        'any.required': 'معرف الخادم مطلوب'
      }),
    users: Joi.alternatives()
      .try(
        Joi.string(),
        Joi.array().items(Joi.string())
      )
      .required()
      .messages({
        'any.required': 'المستخدمون مطلوبون'
      }),
    duration: Joi.string()
      .min(1)
      .max(20)
      .required()
      .messages({
        'string.empty': 'المدة مطلوبة',
        'string.min': 'المدة يجب أن تكون على الأقل حرف واحد',
        'string.max': 'المدة يجب أن لا تتجاوز 20 حرف',
        'any.required': 'المدة مطلوبة'
      })
  }),

  // مخطط التحقق من إنشاء رمز عشوائي للخادم
  createRandomGuildCode: Joi.object({
    guildId: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'معرف الخادم مطلوب',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد',
        'string.max': 'معرف الخادم يجب أن لا يتجاوز 100 حرف',
        'any.required': 'معرف الخادم مطلوب'
      }),
    users: Joi.alternatives()
      .try(
        Joi.string(),
        Joi.array().items(Joi.string())
      )
      .required()
      .messages({
        'any.required': 'المستخدمون مطلوبون'
      }),
    duration: Joi.string()
      .min(1)
      .max(20)
      .required()
      .messages({
        'string.empty': 'المدة مطلوبة',
        'string.min': 'المدة يجب أن تكون على الأقل حرف واحد',
        'string.max': 'المدة يجب أن لا تتجاوز 20 حرف',
        'any.required': 'المدة مطلوبة'
      }),
    codeLength: Joi.number()
      .integer()
      .min(4)
      .max(20)
      .default(8)
      .messages({
        'number.base': 'طول الرمز يجب أن يكون رقم',
        'number.integer': 'طول الرمز يجب أن يكون رقم صحيح',
        'number.min': 'طول الرمز يجب أن يكون على الأقل 4',
        'number.max': 'طول الرمز يجب أن لا يتجاوز 20'
      })
  }),

  // مخطط التحقق من الحصول على جميع الرموز
  getAllCodes: Joi.object({
    limit: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .default(100)
      .messages({
        'number.base': 'الحد الأقصى يجب أن يكون رقم',
        'number.integer': 'الحد الأقصى يجب أن يكون رقم صحيح',
        'number.min': 'الحد الأقصى يجب أن يكون على الأقل 1',
        'number.max': 'الحد الأقصى يجب أن لا يتجاوز 1000'
      }),
    offset: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'الإزاحة يجب أن تكون رقم',
        'number.integer': 'الإزاحة يجب أن تكون رقم صحيح',
        'number.min': 'الإزاحة يجب أن تكون على الأقل 0'
      })
  }),

  // مخطط التحقق من الحصول على رمز بواسطة الرمز
  getCodeByCode: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  }),

  // مخطط التحقق من الحصول على الرموز بواسطة معرف الخادم
  getCodesByGuildId: Joi.object({
    guildId: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'معرف الخادم مطلوب',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد',
        'string.max': 'معرف الخادم يجب أن لا يتجاوز 100 حرف',
        'any.required': 'معرف الخادم مطلوب'
      })
  }),

  // مخطط التحقق من الحصول على الرموز بواسطة المدة
  getCodesByDuration: Joi.object({
    duration: Joi.string()
      .min(1)
      .max(20)
      .required()
      .messages({
        'string.empty': 'المدة مطلوبة',
        'string.min': 'المدة يجب أن تكون على الأقل حرف واحد',
        'string.max': 'المدة يجب أن لا تتجاوز 20 حرف',
        'any.required': 'المدة مطلوبة'
      })
  }),

  // مخطط التحقق من البحث في المستخدمين
  searchCodesByUsers: Joi.object({
    searchTerm: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'مصطلح البحث مطلوب',
        'string.min': 'مصطلح البحث يجب أن يكون على الأقل حرف واحد',
        'string.max': 'مصطلح البحث يجب أن لا يتجاوز 100 حرف',
        'any.required': 'مصطلح البحث مطلوب'
      })
  }),

  // مخطط التحقق من الحصول على الرموز بواسطة نطاق زمني
  getCodesByDateRange: Joi.object({
    startDate: Joi.date()
      .required()
      .messages({
        'date.base': 'تاريخ البداية يجب أن يكون تاريخ صحيح',
        'any.required': 'تاريخ البداية مطلوب'
      }),
    endDate: Joi.date()
      .required()
      .min(Joi.ref('startDate'))
      .messages({
        'date.base': 'تاريخ النهاية يجب أن يكون تاريخ صحيح',
        'date.min': 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
        'any.required': 'تاريخ النهاية مطلوب'
      })
  }),

  // مخطط التحقق من الحصول على أحدث الرموز
  getRecentCodes: Joi.object({
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.base': 'الحد الأقصى يجب أن يكون رقم',
        'number.integer': 'الحد الأقصى يجب أن يكون رقم صحيح',
        'number.min': 'الحد الأقصى يجب أن يكون على الأقل 1',
        'number.max': 'الحد الأقصى يجب أن لا يتجاوز 100'
      })
  }),

  // مخطط التحقق من الحصول على الرموز التي تنتهي قريباً
  getCodesExpiringSoon: Joi.object({
    hours: Joi.number()
      .integer()
      .min(1)
      .max(168) // أسبوع
      .default(24)
      .messages({
        'number.base': 'عدد الساعات يجب أن يكون رقم',
        'number.integer': 'عدد الساعات يجب أن يكون رقم صحيح',
        'number.min': 'عدد الساعات يجب أن يكون على الأقل 1',
        'number.max': 'عدد الساعات يجب أن لا يتجاوز 168 (أسبوع)'
      })
  }),

  // مخطط التحقق من تحديث الرمز (params)
  updateCode: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  }),

  // مخطط التحقق من تحديث الرمز (body)
  updateCodeBody: Joi.object({
    guild_id: Joi.string()
      .min(1)
      .max(100)
      .messages({
        'string.empty': 'معرف الخادم لا يمكن أن يكون فارغ',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد',
        'string.max': 'معرف الخادم يجب أن لا يتجاوز 100 حرف'
      }),
    users: Joi.alternatives()
      .try(
        Joi.string(),
        Joi.array().items(Joi.string())
      )
      .messages({
        'alternatives.match': 'المستخدمون يجب أن يكونوا نص أو مصفوفة من النصوص'
      }),
    dur: Joi.string()
      .min(1)
      .max(20)
      .messages({
        'string.empty': 'المدة لا يمكن أن تكون فارغة',
        'string.min': 'المدة يجب أن تكون على الأقل حرف واحد',
        'string.max': 'المدة يجب أن لا تتجاوز 20 حرف'
      }),
    timestamp: Joi.date()
      .messages({
        'date.base': 'الطابع الزمني يجب أن يكون تاريخ صحيح'
      })
  }).min(1),

  // مخطط التحقق من تحديث المستخدمين (params)
  updateCodeUsers: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  }),

  // مخطط التحقق من تحديث المستخدمين (body)
  updateCodeUsersBody: Joi.object({
    users: Joi.alternatives()
      .try(
        Joi.string(),
        Joi.array().items(Joi.string())
      )
      .required()
      .messages({
        'any.required': 'المستخدمون مطلوبون',
        'alternatives.match': 'المستخدمون يجب أن يكونوا نص أو مصفوفة من النصوص'
      })
  }),

  // مخطط التحقق من إضافة مستخدم إلى الرمز (params)
  addUserToCode: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  }),

  // مخطط التحقق من إضافة مستخدم إلى الرمز (body)
  addUserToCodeBody: Joi.object({
    userId: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'معرف المستخدم مطلوب',
        'string.min': 'معرف المستخدم يجب أن يكون على الأقل حرف واحد',
        'string.max': 'معرف المستخدم يجب أن لا يتجاوز 100 حرف',
        'any.required': 'معرف المستخدم مطلوب'
      })
  }),

  // مخطط التحقق من إزالة مستخدم من الرمز (params)
  removeUserFromCode: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  }),

  // مخطط التحقق من إزالة مستخدم من الرمز (body)
  removeUserFromCodeBody: Joi.object({
    userId: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'معرف المستخدم مطلوب',
        'string.min': 'معرف المستخدم يجب أن يكون على الأقل حرف واحد',
        'string.max': 'معرف المستخدم يجب أن لا يتجاوز 100 حرف',
        'any.required': 'معرف المستخدم مطلوب'
      })
  }),

  // مخطط التحقق من تحديث مدة الرمز (params)
  updateCodeDuration: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  }),

  // مخطط التحقق من تحديث مدة الرمز (body)
  updateCodeDurationBody: Joi.object({
    duration: Joi.string()
      .min(1)
      .max(20)
      .required()
      .messages({
        'string.empty': 'المدة مطلوبة',
        'string.min': 'المدة يجب أن تكون على الأقل حرف واحد',
        'string.max': 'المدة يجب أن لا تتجاوز 20 حرف',
        'any.required': 'المدة مطلوبة'
      })
  }),

  // مخطط التحقق من تمديد مدة الرمز (params)
  extendCodeDuration: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  }),

  // مخطط التحقق من تمديد مدة الرمز (body)
  extendCodeDurationBody: Joi.object({
    additionalDuration: Joi.string()
      .min(1)
      .max(20)
      .required()
      .messages({
        'string.empty': 'المدة الإضافية مطلوبة',
        'string.min': 'المدة الإضافية يجب أن تكون على الأقل حرف واحد',
        'string.max': 'المدة الإضافية يجب أن لا تتجاوز 20 حرف',
        'any.required': 'المدة الإضافية مطلوبة'
      })
  }),

  // مخطط التحقق من حذف الرمز
  deleteCode: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  }),

  // مخطط التحقق من حذف رموز الخادم
  deleteGuildCodes: Joi.object({
    guildId: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'معرف الخادم مطلوب',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد',
        'string.max': 'معرف الخادم يجب أن لا يتجاوز 100 حرف',
        'any.required': 'معرف الخادم مطلوب'
      })
  }),

  // مخطط التحقق من حذف الرموز القديمة
  deleteOldCodes: Joi.object({
    daysOld: Joi.number()
      .integer()
      .min(1)
      .max(365)
      .default(30)
      .messages({
        'number.base': 'عدد الأيام يجب أن يكون رقم',
        'number.integer': 'عدد الأيام يجب أن يكون رقم صحيح',
        'number.min': 'عدد الأيام يجب أن يكون على الأقل 1',
        'number.max': 'عدد الأيام يجب أن لا يتجاوز 365'
      })
  }),

  // مخطط التحقق من وجود الرمز
  existsCode: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  }),

  // مخطط التحقق من صحة الرمز
  validateCode: Joi.object({
    code: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'الرمز مطلوب',
        'string.min': 'الرمز يجب أن يكون على الأقل حرف واحد',
        'string.max': 'الرمز يجب أن لا يتجاوز 50 حرف',
        'any.required': 'الرمز مطلوب'
      })
  })
};

export default codesValidator;