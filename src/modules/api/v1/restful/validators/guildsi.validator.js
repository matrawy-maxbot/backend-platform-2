import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لـ GuildsI API
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
 * مخطط التحقق من وصف الخادم
 */
const descriptionSchema = Joi.string()
  .min(1)
  .max(1000)
  .allow(null)
  .messages({
    'string.base': 'الوصف يجب أن يكون نص',
    'string.min': 'الوصف يجب أن يحتوي على حرف واحد على الأقل',
    'string.max': 'الوصف يجب أن يكون أقل من 1000 حرف'
  });

/**
 * مخطط التحقق من مصطلح البحث
 */
const searchTermSchema = Joi.string()
  .min(1)
  .max(100)
  .required()
  .messages({
    'string.base': 'مصطلح البحث يجب أن يكون نص',
    'string.empty': 'مصطلح البحث لا يمكن أن يكون فارغ',
    'string.min': 'مصطلح البحث يجب أن يحتوي على حرف واحد على الأقل',
    'string.max': 'مصطلح البحث يجب أن يكون أقل من 100 حرف',
    'any.required': 'مصطلح البحث مطلوب'
  });

/**
 * مخطط إنشاء معلومات خادم جديد
 */
export const createGuildInfoSchema = Joi.object({
  id: guildIdSchema,
  description: descriptionSchema
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

/**
 * مخطط الحصول على معلومات خادم بواسطة المعرف
 */
export const getGuildInfoByIdSchema = Joi.object({
  id: guildIdSchema
});

/**
 * مخطط تحديث معلومات خادم
 */
export const updateGuildInfoSchema = Joi.object({
  description: descriptionSchema
}).min(1).messages({
  'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
  'object.unknown': 'حقل غير مسموح: {#label}'
});

/**
 * مخطط تحديث وصف خادم فقط
 */
export const updateGuildDescriptionSchema = Joi.object({
  description: descriptionSchema.required()
}).messages({
  'object.unknown': 'حقل غير مسموح: {#label}'
});

/**
 * مخطط حذف معلومات خادم
 */
export const deleteGuildInfoSchema = Joi.object({
  id: guildIdSchema
});

/**
 * مخطط البحث في الخوادم بواسطة الوصف
 */
export const searchGuildsByDescriptionSchema = Joi.object({
  searchTerm: searchTermSchema
});

/**
 * مخطط التحقق من وجود خادم
 */
export const checkGuildExistsSchema = Joi.object({
  id: guildIdSchema
});

/**
 * دوال التحقق المساعدة
 */

/**
 * التحقق من صحة معرف الخادم
 */
export const validateGuildId = (id) => {
  return guildIdSchema.validate(id);
};

/**
 * التحقق من صحة الوصف
 */
export const validateDescription = (description) => {
  return descriptionSchema.validate(description);
};

/**
 * التحقق من صحة مصطلح البحث
 */
export const validateSearchTerm = (searchTerm) => {
  return searchTermSchema.validate(searchTerm);
};