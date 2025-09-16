import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات المشرفين
 * @module AdminsValidator
 */

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
 * مخطط التحقق من معرف المشرف
 */
const adminIdSchema = Joi.string()
  .required()
  .messages({
    'string.base': 'معرف المشرف يجب أن يكون نص',
    'string.empty': 'معرف المشرف لا يمكن أن يكون فارغ',
    'any.required': 'معرف المشرف مطلوب'
  });

/**
 * مخطط التحقق من معرف المستخدم
 */
const userIdSchema = Joi.string()
  .required()
  .messages({
    'string.base': 'معرف المستخدم يجب أن يكون نص',
    'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغ',
    'any.required': 'معرف المستخدم مطلوب'
  });

/**
 * مخطط التحقق من إعداد الكيبورد
 */
const keyboardSettingSchema = Joi.boolean()
  .messages({
    'boolean.base': 'إعداد الكيبورد يجب أن يكون قيمة منطقية (true/false)'
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
 * مخطط التحقق من عدد الأيام
 */
const daysSchema = Joi.number()
  .integer()
  .min(1)
  .max(3650)
  .default(365)
  .messages({
    'number.base': 'عدد الأيام يجب أن يكون رقم',
    'number.integer': 'عدد الأيام يجب أن يكون رقم صحيح',
    'number.min': 'عدد الأيام يجب أن يكون أكبر من 0',
    'number.max': 'عدد الأيام يجب أن يكون أقل من أو يساوي 3650'
  });

/**
 * مخطط إنشاء سجل مشرفين جديد
 */
export const createAdminsSchema = {
  body: Joi.object({
    guild_id: guildIdSchema,
    admins_id: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'معرفات المشرفين يجب أن تكون نص'
      }),
    max_kb: keyboardSettingSchema.default(false),
    blacklist_kb: keyboardSettingSchema.default(false)
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط إنشاء سجل مشرفين للخادم مع الإعدادات الافتراضية
 */
export const createGuildAdminsSchema = {
  body: Joi.object({
    guildId: guildIdSchema,
    adminsId: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'معرفات المشرفين يجب أن تكون نص'
      }),
    maxKb: keyboardSettingSchema.default(false),
    blacklistKb: keyboardSettingSchema.default(false)
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط الحصول على سجل المشرفين بواسطة معرف الخادم
 */
export const getAdminsByGuildIdSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

/**
 * مخطط الحصول على الخوادم بواسطة معرف المشرف
 */
export const getGuildsByAdminIdSchema = {
  params: Joi.object({
    adminId: adminIdSchema
  })
};

/**
 * مخطط الحصول على المشرفين بواسطة إعداد الحد الأقصى للكيبورد
 */
export const getAdminsByMaxKbSchema = {
  query: Joi.object({
    maxKb: Joi.string()
      .valid('true', 'false')
      .required()
      .messages({
        'string.base': 'إعداد الحد الأقصى للكيبورد يجب أن يكون نص',
        'any.only': 'إعداد الحد الأقصى للكيبورد يجب أن يكون true أو false',
        'any.required': 'إعداد الحد الأقصى للكيبورد مطلوب'
      })
  })
};

/**
 * مخطط الحصول على المشرفين بواسطة إعداد كيبورد القائمة السوداء
 */
export const getAdminsByBlacklistKbSchema = {
  query: Joi.object({
    blacklistKb: Joi.string()
      .valid('true', 'false')
      .required()
      .messages({
        'string.base': 'إعداد كيبورد القائمة السوداء يجب أن يكون نص',
        'any.only': 'إعداد كيبورد القائمة السوداء يجب أن يكون true أو false',
        'any.required': 'إعداد كيبورد القائمة السوداء مطلوب'
      })
  })
};

/**
 * مخطط الحصول على أحدث سجلات المشرفين
 */
export const getRecentAdminsSchema = {
  query: Joi.object({
    limit: limitSchema
  })
};

/**
 * مخطط تحديث سجل المشرفين
 */
export const updateAdminsSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  }),
  body: Joi.object({
    admins_id: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'معرفات المشرفين يجب أن تكون نص'
      }),
    max_kb: keyboardSettingSchema,
    blacklist_kb: keyboardSettingSchema
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث معرفات المشرفين
 */
export const updateAdminsIdSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  }),
  body: Joi.object({
    adminsId: Joi.string()
      .required()
      .allow('')
      .messages({
        'string.base': 'معرفات المشرفين يجب أن تكون نص',
        'any.required': 'معرفات المشرفين مطلوبة'
      })
  })
};

/**
 * مخطط تحديث إعداد الحد الأقصى للكيبورد
 */
export const updateMaxKbSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  }),
  body: Joi.object({
    maxKb: keyboardSettingSchema.required().messages({
      'any.required': 'إعداد الحد الأقصى للكيبورد مطلوب'
    })
  })
};

/**
 * مخطط تحديث إعداد كيبورد القائمة السوداء
 */
export const updateBlacklistKbSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  }),
  body: Joi.object({
    blacklistKb: keyboardSettingSchema.required().messages({
      'any.required': 'إعداد كيبورد القائمة السوداء مطلوب'
    })
  })
};

/**
 * مخطط إضافة مشرف جديد
 */
export const addAdminSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  }),
  body: Joi.object({
    adminId: adminIdSchema
  })
};

/**
 * مخطط إزالة مشرف
 */
export const removeAdminSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  }),
  body: Joi.object({
    adminId: adminIdSchema
  })
};

/**
 * مخطط تبديل إعداد الحد الأقصى للكيبورد
 */
export const toggleMaxKbSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

/**
 * مخطط تبديل إعداد كيبورد القائمة السوداء
 */
export const toggleBlacklistKbSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

/**
 * مخطط حذف سجل المشرفين
 */
export const deleteAdminsSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

/**
 * مخطط حذف السجلات القديمة
 */
export const deleteOldAdminsSchema = {
  query: Joi.object({
    days: daysSchema
  })
};

/**
 * مخطط التحقق من وجود سجل المشرفين
 */
export const existsAdminsSchema = {
  params: Joi.object({
    guildId: guildIdSchema
  })
};

/**
 * مخطط التحقق من كون المستخدم مشرف
 */
export const isUserAdminSchema = {
  params: Joi.object({
    guildId: guildIdSchema,
    userId: userIdSchema
  })
};

/**
 * دالة مساعدة للتحقق من صحة معرف الخادم
 * @param {string} guildId - معرف الخادم
 * @returns {Object} - نتيجة التحقق
 */
export const validateGuildId = (guildId) => {
  return guildIdSchema.validate(guildId);
};

/**
 * دالة مساعدة للتحقق من صحة معرف المشرف
 * @param {string} adminId - معرف المشرف
 * @returns {Object} - نتيجة التحقق
 */
export const validateAdminId = (adminId) => {
  return adminIdSchema.validate(adminId);
};

/**
 * دالة مساعدة للتحقق من صحة إعدادات الكيبورد
 * @param {boolean} setting - إعداد الكيبورد
 * @returns {Object} - نتيجة التحقق
 */
export const validateKeyboardSetting = (setting) => {
  return keyboardSettingSchema.validate(setting);
};