import Joi from 'joi';

// المخططات الأساسية
const divId = Joi.string().required().messages({
  'string.base': 'معرف القسم يجب أن يكون نص',
  'any.required': 'معرف القسم مطلوب'
});

const guildId = Joi.string().required().messages({
  'string.base': 'معرف الخادم يجب أن يكون نص',
  'any.required': 'معرف الخادم مطلوب'
});

const message = Joi.string().min(1).max(2000).required().messages({
  'string.base': 'الرسالة يجب أن تكون نص',
  'string.min': 'الرسالة يجب أن تحتوي على حرف واحد على الأقل',
  'string.max': 'الرسالة يجب ألا تتجاوز 2000 حرف',
  'any.required': 'الرسالة مطلوبة'
});

const reply = Joi.string().min(1).max(2000).required().messages({
  'string.base': 'الرد يجب أن يكون نص',
  'string.min': 'الرد يجب أن يحتوي على حرف واحد على الأقل',
  'string.max': 'الرد يجب ألا يتجاوز 2000 حرف',
  'any.required': 'الرد مطلوب'
});

const searchText = Joi.string().min(1).max(500).required().messages({
  'string.base': 'نص البحث يجب أن يكون نص',
  'string.min': 'نص البحث يجب أن يحتوي على حرف واحد على الأقل',
  'string.max': 'نص البحث يجب ألا يتجاوز 500 حرف',
  'any.required': 'نص البحث مطلوب'
});

const limit = Joi.number().integer().min(1).max(100).optional().messages({
  'number.base': 'الحد الأقصى يجب أن يكون رقم',
  'number.integer': 'الحد الأقصى يجب أن يكون رقم صحيح',
  'number.min': 'الحد الأقصى يجب أن يكون أكبر من 0',
  'number.max': 'الحد الأقصى يجب ألا يتجاوز 100'
});

const daysOld = Joi.number().integer().min(1).max(365).optional().messages({
  'number.base': 'عدد الأيام يجب أن يكون رقم',
  'number.integer': 'عدد الأيام يجب أن يكون رقم صحيح',
  'number.min': 'عدد الأيام يجب أن يكون أكبر من 0',
  'number.max': 'عدد الأيام يجب ألا يتجاوز 365'
});

const dateString = Joi.string().isoDate().required().messages({
  'string.base': 'التاريخ يجب أن يكون نص',
  'string.isoDate': 'التاريخ يجب أن يكون بصيغة ISO صحيحة',
  'any.required': 'التاريخ مطلوب'
});

// مخططات إنشاء الردود التلقائية
export const createReplySchema = Joi.object({
  body: Joi.object({
    guild_id: guildId,
    message: message,
    reply: reply
  }).required()
});

export const createAutoReplySchema = Joi.object({
  body: Joi.object({
    guildId: guildId,
    message: message,
    reply: reply
  }).required()
});

// مخططات الحصول على الردود التلقائية
export const getReplyByIdSchema = Joi.object({
  params: Joi.object({
    divId: divId
  }).required()
});

export const getRepliesByGuildIdSchema = Joi.object({
  params: Joi.object({
    guildId: guildId
  }).required()
});

// مخططات البحث
export const searchByMessageSchema = Joi.object({
  query: Joi.object({
    searchText: searchText
  }).required()
});

export const searchByReplySchema = Joi.object({
  query: Joi.object({
    searchText: searchText
  }).required()
});

export const searchInBothSchema = Joi.object({
  query: Joi.object({
    searchText: searchText
  }).required()
});

export const findReplyByMessageSchema = Joi.object({
  params: Joi.object({
    guildId: guildId,
    message: Joi.string().required().messages({
      'string.base': 'الرسالة يجب أن تكون نص',
      'any.required': 'الرسالة مطلوبة'
    })
  }).required()
});

export const findExactReplySchema = Joi.object({
  params: Joi.object({
    guildId: guildId,
    message: Joi.string().required().messages({
      'string.base': 'الرسالة يجب أن تكون نص',
      'any.required': 'الرسالة مطلوبة'
    })
  }).required()
});

// مخططات النطاق الزمني
export const getRepliesByDateRangeSchema = Joi.object({
  query: Joi.object({
    startDate: dateString,
    endDate: dateString
  }).required()
});

export const getRecentRepliesSchema = Joi.object({
  query: Joi.object({
    limit: limit
  }).optional()
});

// مخططات التحديث
export const updateReplySchema = Joi.object({
  params: Joi.object({
    divId: divId
  }).required(),
  body: Joi.object({
    guild_id: Joi.string().optional(),
    message: Joi.string().min(1).max(2000).optional(),
    reply: Joi.string().min(1).max(2000).optional()
  }).min(1).required().messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
  })
});

export const updateMessageSchema = Joi.object({
  params: Joi.object({
    divId: divId
  }).required(),
  body: Joi.object({
    message: message
  }).required()
});

export const updateReplyTextSchema = Joi.object({
  params: Joi.object({
    divId: divId
  }).required(),
  body: Joi.object({
    reply: reply
  }).required()
});

// مخططات الحذف
export const deleteReplySchema = Joi.object({
  params: Joi.object({
    divId: divId
  }).required()
});

export const deleteGuildRepliesSchema = Joi.object({
  params: Joi.object({
    guildId: guildId
  }).required()
});

export const deleteOldRepliesSchema = Joi.object({
  query: Joi.object({
    daysOld: daysOld
  }).optional()
});

// مخططات التحقق والإحصائيات
export const existsReplySchema = Joi.object({
  params: Joi.object({
    divId: divId
  }).required()
});

export const countGuildRepliesSchema = Joi.object({
  params: Joi.object({
    guildId: guildId
  }).required()
});

// مخطط فارغ للطرق التي لا تحتاج تحقق
export const noValidationSchema = Joi.object({});

// تصدير جميع المخططات كائن واحد
export default {
  createReplySchema,
  createAutoReplySchema,
  getReplyByIdSchema,
  getRepliesByGuildIdSchema,
  searchByMessageSchema,
  searchByReplySchema,
  searchInBothSchema,
  findReplyByMessageSchema,
  findExactReplySchema,
  getRepliesByDateRangeSchema,
  getRecentRepliesSchema,
  updateReplySchema,
  updateMessageSchema,
  updateReplyTextSchema,
  deleteReplySchema,
  deleteGuildRepliesSchema,
  deleteOldRepliesSchema,
  existsReplySchema,
  countGuildRepliesSchema,
  noValidationSchema
};