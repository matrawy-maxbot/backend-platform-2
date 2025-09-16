import Joi from 'joi';

/**
 * مخطط إنشاء رابط جديد
 */
export const createLinkSchema = Joi.object({
  guild_id: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  }),
  link: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'يجب أن يكون الرابط صالحاً'
  }),
  chats: Joi.string().optional().allow(null, '').messages({
    'string.base': 'المحادثات يجب أن تكون نص'
  }),
  select_d: Joi.string().optional().allow(null, '').messages({
    'string.base': 'بيانات التحديد يجب أن تكون نص'
  })
});

/**
 * مخطط تحديث رابط
 */
export const updateLinkSchema = Joi.object({
  link: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'يجب أن يكون الرابط صالحاً'
  }),
  chats: Joi.string().optional().allow(null, '').messages({
    'string.base': 'المحادثات يجب أن تكون نص'
  }),
  select_d: Joi.string().optional().allow(null, '').messages({
    'string.base': 'بيانات التحديد يجب أن تكون نص'
  })
}).min(1).messages({
  'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
});

/**
 * مخطط تحديث رابط URL
 */
export const updateLinkURLSchema = Joi.object({
  link: Joi.string().uri().required().messages({
    'any.required': 'الرابط مطلوب',
    'string.empty': 'الرابط لا يمكن أن يكون فارغاً',
    'string.uri': 'يجب أن يكون الرابط صالحاً'
  })
});

/**
 * مخطط تحديث محادثات الرابط
 */
export const updateLinkChatsSchema = Joi.object({
  chats: Joi.string().required().messages({
    'any.required': 'المحادثات مطلوبة',
    'string.empty': 'المحادثات لا يمكن أن تكون فارغة',
    'string.base': 'المحادثات يجب أن تكون نص'
  })
});

/**
 * مخطط تحديث بيانات التحديد للرابط
 */
export const updateLinkSelectDataSchema = Joi.object({
  select_d: Joi.string().required().messages({
    'any.required': 'بيانات التحديد مطلوبة',
    'string.empty': 'بيانات التحديد لا يمكن أن تكون فارغة',
    'string.base': 'بيانات التحديد يجب أن تكون نص'
  })
});

/**
 * مخطط الحصول على رابط بواسطة معرف الخادم
 */
export const getLinkByGuildIdSchema = Joi.object({
  guildId: Joi.string().required().messages({
    'any.required': 'معرف الخادم مطلوب',
    'string.empty': 'معرف الخادم لا يمكن أن يكون فارغاً'
  })
});

/**
 * مخطط البحث في الروابط بواسطة URL
 */
export const searchLinksByURLSchema = Joi.object({
  searchTerm: Joi.string().required().min(1).messages({
    'any.required': 'مصطلح البحث مطلوب',
    'string.empty': 'مصطلح البحث لا يمكن أن يكون فارغاً',
    'string.min': 'مصطلح البحث يجب أن يحتوي على حرف واحد على الأقل'
  })
});

/**
 * مخطط خيارات الاستعلام العامة
 */
export const queryOptionsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'الحد الأقصى يجب أن يكون رقماً',
    'number.integer': 'الحد الأقصى يجب أن يكون رقماً صحيحاً',
    'number.min': 'الحد الأقصى يجب أن يكون أكبر من 0',
    'number.max': 'الحد الأقصى لا يمكن أن يكون أكثر من 100'
  }),
  offset: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'الإزاحة يجب أن تكون رقماً',
    'number.integer': 'الإزاحة يجب أن تكون رقماً صحيحاً',
    'number.min': 'الإزاحة يجب أن تكون 0 أو أكثر'
  }),
  order: Joi.string().valid('ASC', 'DESC').default('DESC').messages({
    'any.only': 'الترتيب يجب أن يكون ASC أو DESC'
  }),
  orderBy: Joi.string().valid('id', 'guild_id', 'created_at', 'updated_at').default('created_at').messages({
    'any.only': 'ترتيب حسب يجب أن يكون id أو guild_id أو created_at أو updated_at'
  })
});