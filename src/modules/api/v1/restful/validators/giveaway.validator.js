import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لـ Giveaway API
 */

/**
 * مخطط التحقق من معرف الـ giveaway
 */
const giveawayIdSchema = Joi.string()
  .required()
  .messages({
    'string.base': 'معرف الـ giveaway يجب أن يكون نص',
    'string.empty': 'معرف الـ giveaway لا يمكن أن يكون فارغ',
    'any.required': 'معرف الـ giveaway مطلوب'
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
 * مخطط التحقق من رقم الـ giveaway
 */
const numberSchema = Joi.number()
  .integer()
  .min(1)
  .required()
  .messages({
    'number.base': 'رقم الـ giveaway يجب أن يكون رقم',
    'number.integer': 'رقم الـ giveaway يجب أن يكون رقم صحيح',
    'number.min': 'رقم الـ giveaway يجب أن يكون أكبر من 0',
    'any.required': 'رقم الـ giveaway مطلوب'
  });

/**
 * مخطط التحقق من وقت الـ giveaway
 */
const timeSchema = Joi.number()
  .integer()
  .min(1)
  .required()
  .messages({
    'number.base': 'وقت الـ giveaway يجب أن يكون رقم',
    'number.integer': 'وقت الـ giveaway يجب أن يكون رقم صحيح',
    'number.min': 'وقت الـ giveaway يجب أن يكون أكبر من 0',
    'any.required': 'وقت الـ giveaway مطلوب'
  });

/**
 * مخطط التحقق من الجوائز
 */
const prizesSchema = Joi.string()
  .min(1)
  .max(1000)
  .required()
  .messages({
    'string.base': 'الجوائز يجب أن تكون نص',
    'string.empty': 'الجوائز لا يمكن أن تكون فارغة',
    'string.min': 'الجوائز يجب أن تحتوي على حرف واحد على الأقل',
    'string.max': 'الجوائز يجب أن تكون أقل من 1000 حرف',
    'any.required': 'الجوائز مطلوبة'
  });

/**
 * مخطط التحقق من الوقت الزمني
 */
const timestampSchema = Joi.date()
  .optional()
  .messages({
    'date.base': 'الوقت الزمني يجب أن يكون تاريخ صحيح'
  });

/**
 * مخطط إنشاء giveaway جديد
 */
export const createGiveawaySchema = Joi.object({
  id: giveawayIdSchema,
  channel: channelIdSchema,
  number: numberSchema,
  time: timeSchema,
  prizes: prizesSchema,
  timestamp: timestampSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

/**
 * مخطط الحصول على giveaway بالمعرف
 */
export const getGiveawayByIdSchema = Joi.object({
  id: giveawayIdSchema
});

/**
 * مخطط الحصول على giveaways بالقناة
 */
export const getGiveawaysByChannelSchema = Joi.object({
  channel: channelIdSchema
});

/**
 * مخطط تحديث giveaway
 */
export const updateGiveawaySchema = Joi.object({
  channel: channelIdSchema.optional(),
  number: numberSchema.optional(),
  time: timeSchema.optional(),
  prizes: prizesSchema.optional(),
  timestamp: timestampSchema
}).min(1).messages({
  'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
  'object.unknown': 'حقل غير مسموح: {#label}'
});

/**
 * مخطط حذف giveaway
 */
export const deleteGiveawaySchema = Joi.object({
  id: giveawayIdSchema
});

/**
 * مخطط حذف giveaways بالقناة
 */
export const deleteGiveawaysByChannelSchema = Joi.object({
  channel: channelIdSchema
});

/**
 * مخطط الحصول على giveaways منتهية الصلاحية
 */
export const getExpiredGiveawaysSchema = Joi.object({
  currentTime: Joi.date().optional().messages({
    'date.base': 'الوقت الحالي يجب أن يكون تاريخ صحيح'
  })
});

/**
 * دوال مساعدة للتحقق من صحة البيانات
 */

/**
 * دالة التحقق من صحة معرف الـ giveaway
 * @param {string} id - معرف الـ giveaway
 * @returns {Object} - نتيجة التحقق
 */
export const validateGiveawayId = (id) => {
  return giveawayIdSchema.validate(id);
};

/**
 * دالة التحقق من صحة معرف القناة
 * @param {string} channel - معرف القناة
 * @returns {Object} - نتيجة التحقق
 */
export const validateChannelId = (channel) => {
  return channelIdSchema.validate(channel);
};

/**
 * دالة التحقق من صحة رقم الـ giveaway
 * @param {number} number - رقم الـ giveaway
 * @returns {Object} - نتيجة التحقق
 */
export const validateNumber = (number) => {
  return numberSchema.validate(number);
};

/**
 * دالة التحقق من صحة وقت الـ giveaway
 * @param {number} time - وقت الـ giveaway
 * @returns {Object} - نتيجة التحقق
 */
export const validateTime = (time) => {
  return timeSchema.validate(time);
};