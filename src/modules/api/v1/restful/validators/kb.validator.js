import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات قاعدة المعرفة
 */

/**
 * مخطط إنشاء سجل قاعدة معرفة جديد
 */
export const createKBSchema = Joi.object({
  guild_id: Joi.string()
    .required()
    .messages({
      'string.base': 'معرف الخادم يجب أن يكون نص',
      'any.required': 'معرف الخادم مطلوب'
    }),
  user_id: Joi.string()
    .optional()
    .allow(null)
    .messages({
      'string.base': 'معرف المستخدم يجب أن يكون نص'
    }),
  kb_length: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'طول قاعدة المعرفة يجب أن يكون رقم',
      'number.integer': 'طول قاعدة المعرفة يجب أن يكون رقم صحيح',
      'number.min': 'طول قاعدة المعرفة يجب أن يكون أكبر من أو يساوي 0'
    }),
  kb_data: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'بيانات قاعدة المعرفة يجب أن تكون نص'
    })
});

/**
 * مخطط تحديث سجل قاعدة المعرفة
 */
export const updateKBSchema = Joi.object({
  guild_id: Joi.string()
    .optional()
    .messages({
      'string.base': 'معرف الخادم يجب أن يكون نص'
    }),
  user_id: Joi.string()
    .optional()
    .allow(null)
    .messages({
      'string.base': 'معرف المستخدم يجب أن يكون نص'
    }),
  kb_length: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'طول قاعدة المعرفة يجب أن يكون رقم',
      'number.integer': 'طول قاعدة المعرفة يجب أن يكون رقم صحيح',
      'number.min': 'طول قاعدة المعرفة يجب أن يكون أكبر من أو يساوي 0'
    }),
  kb_data: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'بيانات قاعدة المعرفة يجب أن تكون نص'
    })
});

/**
 * مخطط الحصول على سجل قاعدة المعرفة بواسطة المعرف
 */
export const getKBByIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'المعرف يجب أن يكون رقم',
      'number.integer': 'المعرف يجب أن يكون رقم صحيح',
      'number.positive': 'المعرف يجب أن يكون رقم موجب',
      'any.required': 'المعرف مطلوب'
    })
});

/**
 * مخطط الحصول على سجلات قاعدة المعرفة بواسطة معرف الخادم
 */
export const getKBByGuildIdSchema = Joi.object({
  guildId: Joi.string()
    .required()
    .messages({
      'string.base': 'معرف الخادم يجب أن يكون نص',
      'any.required': 'معرف الخادم مطلوب'
    })
});

/**
 * مخطط الحصول على سجلات قاعدة المعرفة بواسطة معرف المستخدم
 */
export const getKBByUserIdSchema = Joi.object({
  userId: Joi.string()
    .required()
    .messages({
      'string.base': 'معرف المستخدم يجب أن يكون نص',
      'any.required': 'معرف المستخدم مطلوب'
    })
});

/**
 * مخطط البحث في سجلات قاعدة المعرفة
 */
export const searchKBSchema = Joi.object({
  searchTerm: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.base': 'مصطلح البحث يجب أن يكون نص',
      'string.min': 'مصطلح البحث يجب أن يحتوي على حرف واحد على الأقل',
      'any.required': 'مصطلح البحث مطلوب'
    }),
  guildId: Joi.string()
    .optional()
    .messages({
      'string.base': 'معرف الخادم يجب أن يكون نص'
    })
});

/**
 * مخطط تحديث طول قاعدة المعرفة
 */
export const updateKBLengthSchema = Joi.object({
  kbLength: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'طول قاعدة المعرفة يجب أن يكون رقم',
      'number.integer': 'طول قاعدة المعرفة يجب أن يكون رقم صحيح',
      'number.min': 'طول قاعدة المعرفة يجب أن يكون أكبر من أو يساوي 0',
      'any.required': 'طول قاعدة المعرفة مطلوب'
    })
});

/**
 * مخطط حذف سجل قاعدة المعرفة
 */
export const deleteKBSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'المعرف يجب أن يكون رقم',
      'number.integer': 'المعرف يجب أن يكون رقم صحيح',
      'number.positive': 'المعرف يجب أن يكون رقم موجب',
      'any.required': 'المعرف مطلوب'
    })
});

/**
 * مخطط حذف سجلات قاعدة المعرفة بواسطة معرف الخادم
 */
export const deleteKBByGuildIdSchema = Joi.object({
  guildId: Joi.string()
    .required()
    .messages({
      'string.base': 'معرف الخادم يجب أن يكون نص',
      'any.required': 'معرف الخادم مطلوب'
    })
});

/**
 * مخطط التحقق من وجود سجل قاعدة المعرفة
 */
export const checkKBExistsSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'المعرف يجب أن يكون رقم',
      'number.integer': 'المعرف يجب أن يكون رقم صحيح',
      'number.positive': 'المعرف يجب أن يكون رقم موجب',
      'any.required': 'المعرف مطلوب'
    })
});