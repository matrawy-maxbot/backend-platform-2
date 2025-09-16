import Joi from 'joi';
import validationMiddlewareFactory from '../../../../../middlewares/validation/validation.middleware.js';

/**
 * مخططات التحقق من صحة بيانات كتم الدردشة
 * @module MuteChatValidator
 */

/**
 * مخطط إنشاء سجل كتم جديد
 */
export const createMuteChatSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.empty': 'معرف المستخدم أو الخادم مطلوب',
      'any.required': 'معرف المستخدم أو الخادم مطلوب'
    }),
  
  mutes: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'بيانات الكتم يجب أن تكون نص'
    })
});

/**
 * مخطط تحديث سجل كتم
 */
export const updateMuteChatSchema = Joi.object({
  mutes: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'بيانات الكتم يجب أن تكون نص'
    })
});

/**
 * مخطط تحديث بيانات الكتم فقط
 */
export const updateMuteDataSchema = Joi.object({
  mutes: Joi.string()
    .required()
    .messages({
      'string.empty': 'بيانات الكتم مطلوبة',
      'any.required': 'بيانات الكتم مطلوبة',
      'string.base': 'بيانات الكتم يجب أن تكون نص'
    })
});

/**
 * مخطط البحث في سجلات الكتم
 */
export const searchMuteChatsSchema = Joi.object({
  searchTerm: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'مصطلح البحث مطلوب',
      'string.min': 'مصطلح البحث يجب أن يحتوي على حرف واحد على الأقل',
      'any.required': 'مصطلح البحث مطلوب'
    })
});

/**
 * مخطط معرف سجل الكتم
 */
export const muteChatIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.empty': 'معرف المستخدم أو الخادم مطلوب',
      'any.required': 'معرف المستخدم أو الخادم مطلوب'
    })
});

/**
 * مخطط إضافة أو تحديث بيانات كتم
 */
export const addOrUpdateMuteDataSchema = Joi.object({
  mutes: Joi.string()
    .required()
    .messages({
      'string.empty': 'بيانات الكتم مطلوبة',
      'any.required': 'بيانات الكتم مطلوبة',
      'string.base': 'بيانات الكتم يجب أن تكون نص'
    })
});

// تصدير middleware للتحقق من صحة البيانات
export const validateCreateMuteChat = validationMiddlewareFactory(createMuteChatSchema, 'body');
export const validateUpdateMuteChat = validationMiddlewareFactory(updateMuteChatSchema, 'body');
export const validateUpdateMuteData = validationMiddlewareFactory(updateMuteDataSchema, 'body');
export const validateSearchMuteChats = validationMiddlewareFactory(searchMuteChatsSchema, 'query');
export const validateMuteChatId = validationMiddlewareFactory(muteChatIdSchema, 'params');
export const validateAddOrUpdateMuteData = validationMiddlewareFactory(addOrUpdateMuteDataSchema, 'body');