import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات المشرفين
 * @module AdminsValidator
 */

/**
 * مخطط التحقق من معرف المشرف
 */
const adminIdSchema = {
  params: Joi.object({
    guildId: Joi.string()
      .required()
      .messages({
        'string.base': 'معرف السيرفر يجب أن يكون نص',
        'string.empty': 'معرف السيرفر لا يمكن أن يكون فارغ',
        'any.required': 'معرف السيرفر مطلوب'
      })
  })
}

/**
 * مخطط إنشاء سجل مشرفين جديد
 */
export const createAdminsSchema = {
  body: Joi.object({
    guild_id: Joi.string()
      .required()
      .messages({
        'string.base': 'معرف السيرفر يجب أن يكون نص',
        'string.empty': 'معرف السيرفر لا يمكن أن يكون فارغ',
        'any.required': 'معرف السيرفر مطلوب'
      }),
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
 * مخطط تحديث سجل المشرفين
 */
export const updateAdminsSchema = {
  params: Joi.object({
    guildId: Joi.string()
      .required()
      .messages({
        'string.base': 'معرف السيرفر يجب أن يكون نص',
        'string.empty': 'معرف السيرفر لا يمكن أن يكون فارغ',
        'any.required': 'معرف السيرفر مطلوب'
      })
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
 * مخطط إزالة مشرف
 */
export const removeAdminSchema = {
  params: Joi.object({
    guildId: Joi.string()
      .required()
      .messages({
        'string.base': 'معرف السيرفر يجب أن يكون نص',
        'string.empty': 'معرف السيرفر لا يمكن أن يكون فارغ',
        'any.required': 'معرف السيرفر مطلوب'
      })
  }),
  body: Joi.object({
    adminId: adminIdSchema
  })
};