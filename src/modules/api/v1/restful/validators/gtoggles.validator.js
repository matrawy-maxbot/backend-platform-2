import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لوحدة GToggles
 * تحتوي على جميع مخططات التحقق المطلوبة لعمليات إعدادات الخوادم
 */

// مخطط التحقق من معرف الخادم
const guildIdSchema = Joi.string()
  .pattern(/^\d+$/)
  .min(17)
  .max(19)
  .required()
  .messages({
    'string.pattern.base': 'معرف الخادم يجب أن يحتوي على أرقام فقط',
    'string.min': 'معرف الخادم يجب أن يكون على الأقل 17 رقم',
    'string.max': 'معرف الخادم يجب أن لا يتجاوز 19 رقم',
    'any.required': 'معرف الخادم مطلوب'
  });

// مخطط التحقق من إنشاء إعدادات خادم جديد
export const createGuildTogglesSchema = {
  type: 'object',
  properties: {
    guild_id: guildIdSchema,
    welcome_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة الترحيب يجب أن تكون true أو false'
    }),
    logging_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة السجل يجب أن تكون true أو false'
    }),
    moderation_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة الإشراف يجب أن تكون true أو false'
    }),
    auto_role_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة الدور التلقائي يجب أن تكون true أو false'
    }),
    music_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة الموسيقى يجب أن تكون true أو false'
    }),
    economy_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة الاقتصاد يجب أن تكون true أو false'
    }),
    leveling_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة نظام المستويات يجب أن تكون true أو false'
    }),
    tickets_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة التذاكر يجب أن تكون true أو false'
    }),
    suggestions_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة الاقتراحات يجب أن تكون true أو false'
    }),
    giveaways_enabled: Joi.boolean().default(false).messages({
      'boolean.base': 'حالة المسابقات يجب أن تكون true أو false'
    })
  },
  required: ['guild_id'],
  additionalProperties: false
};

// مخطط التحقق من الحصول على إعدادات خادم بواسطة المعرف
export const getGuildTogglesByIdSchema = {
  type: 'object',
  properties: {
    guild_id: guildIdSchema
  },
  required: ['guild_id'],
  additionalProperties: false
};

// مخطط التحقق من تحديث إعدادات خادم
export const updateGuildTogglesSchema = {
  type: 'object',
  properties: {
    welcome_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة الترحيب يجب أن تكون true أو false'
    }),
    logging_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة السجل يجب أن تكون true أو false'
    }),
    moderation_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة الإشراف يجب أن تكون true أو false'
    }),
    auto_role_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة الدور التلقائي يجب أن تكون true أو false'
    }),
    music_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة الموسيقى يجب أن تكون true أو false'
    }),
    economy_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة الاقتصاد يجب أن تكون true أو false'
    }),
    leveling_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة نظام المستويات يجب أن تكون true أو false'
    }),
    tickets_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة التذاكر يجب أن تكون true أو false'
    }),
    suggestions_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة الاقتراحات يجب أن تكون true أو false'
    }),
    giveaways_enabled: Joi.boolean().messages({
      'boolean.base': 'حالة المسابقات يجب أن تكون true أو false'
    })
  },
  additionalProperties: false,
  minProperties: 1
};

// مخطط التحقق من تحديث إعداد واحد
export const updateSingleToggleSchema = {
  type: 'object',
  properties: {
    setting: Joi.string()
      .valid(
        'welcome_enabled',
        'logging_enabled', 
        'moderation_enabled',
        'auto_role_enabled',
        'music_enabled',
        'economy_enabled',
        'leveling_enabled',
        'tickets_enabled',
        'suggestions_enabled',
        'giveaways_enabled'
      )
      .required()
      .messages({
        'any.only': 'نوع الإعداد غير صحيح',
        'any.required': 'نوع الإعداد مطلوب'
      }),
    value: Joi.boolean().required().messages({
      'boolean.base': 'قيمة الإعداد يجب أن تكون true أو false',
      'any.required': 'قيمة الإعداد مطلوبة'
    })
  },
  required: ['setting', 'value'],
  additionalProperties: false
};

// مخطط التحقق من حذف إعدادات خادم
export const deleteGuildTogglesSchema = {
  type: 'object',
  properties: {
    guild_id: guildIdSchema
  },
  required: ['guild_id'],
  additionalProperties: false
};

// مخطط التحقق من إعادة تعيين إعدادات خادم
export const resetGuildTogglesSchema = {
  type: 'object',
  properties: {
    guild_id: guildIdSchema
  },
  required: ['guild_id'],
  additionalProperties: false
};