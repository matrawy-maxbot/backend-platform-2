import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لـ Likes API
 */

/**
 * مخطط التحقق من إنشاء سجل إعجابات جديد
 */
export const createLikesSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'معرف المستخدم مطلوب',
    'any.required': 'معرف المستخدم مطلوب'
  }),
  likes: Joi.alternatives().try(
    Joi.object(),
    Joi.string()
  ).optional().messages({
    'alternatives.types': 'بيانات الإعجابات يجب أن تكون كائن أو نص'
  })
});

/**
 * مخطط التحقق من إنشاء سجل إعجابات للمستخدم
 */
export const createUserLikesSchema = Joi.object({
  likes: Joi.alternatives().try(
    Joi.object(),
    Joi.string()
  ).optional().messages({
    'alternatives.types': 'بيانات الإعجابات يجب أن تكون كائن أو نص'
  })
});

/**
 * مخطط التحقق من تحديث سجل الإعجابات
 */
export const updateLikesSchema = Joi.object({
  likes: Joi.alternatives().try(
    Joi.object(),
    Joi.string()
  ).optional().messages({
    'alternatives.types': 'بيانات الإعجابات يجب أن تكون كائن أو نص'
  })
});

/**
 * مخطط التحقق من تحديث بيانات الإعجابات فقط
 */
export const updateLikesDataSchema = Joi.object({
  likes: Joi.alternatives().try(
    Joi.object(),
    Joi.string()
  ).required().messages({
    'alternatives.types': 'بيانات الإعجابات يجب أن تكون كائن أو نص',
    'any.required': 'بيانات الإعجابات مطلوبة'
  })
});

/**
 * مخطط التحقق من إضافة إعجاب جديد
 */
export const addLikeSchema = Joi.object({
  likeKey: Joi.string().required().messages({
    'string.empty': 'مفتاح الإعجاب مطلوب',
    'any.required': 'مفتاح الإعجاب مطلوب'
  }),
  likeValue: Joi.any().required().messages({
    'any.required': 'قيمة الإعجاب مطلوبة'
  })
});

/**
 * مخطط التحقق من إزالة إعجاب
 */
export const removeLikeSchema = Joi.object({
  likeKey: Joi.string().required().messages({
    'string.empty': 'مفتاح الإعجاب مطلوب',
    'any.required': 'مفتاح الإعجاب مطلوب'
  })
});

/**
 * مخطط التحقق من دمج بيانات الإعجابات
 */
export const mergeLikesSchema = Joi.object({
  newLikesData: Joi.object().required().messages({
    'object.base': 'بيانات الإعجابات الجديدة يجب أن تكون كائن',
    'any.required': 'بيانات الإعجابات الجديدة مطلوبة'
  })
});

/**
 * مخطط التحقق من البحث في الإعجابات
 */
export const searchLikesSchema = Joi.object({
  searchTerm: Joi.string().min(1).required().messages({
    'string.empty': 'مصطلح البحث مطلوب',
    'string.min': 'مصطلح البحث يجب أن يحتوي على حرف واحد على الأقل',
    'any.required': 'مصطلح البحث مطلوب'
  })
});

/**
 * مخطط التحقق من النطاق الزمني
 */
export const dateRangeSchema = Joi.object({
  startDate: Joi.date().required().messages({
    'date.base': 'تاريخ البداية يجب أن يكون تاريخ صحيح',
    'any.required': 'تاريخ البداية مطلوب'
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.base': 'تاريخ النهاية يجب أن يكون تاريخ صحيح',
    'date.min': 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
    'any.required': 'تاريخ النهاية مطلوب'
  })
});

/**
 * مخطط التحقق من حد السجلات
 */
export const limitSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'الحد يجب أن يكون رقم',
    'number.integer': 'الحد يجب أن يكون رقم صحيح',
    'number.min': 'الحد يجب أن يكون أكبر من 0',
    'number.max': 'الحد يجب أن يكون أقل من أو يساوي 100'
  })
});

/**
 * مخطط التحقق من عدد الأيام للحذف
 */
export const deleteOldLikesSchema = Joi.object({
  daysOld: Joi.number().integer().min(1).default(90).messages({
    'number.base': 'عدد الأيام يجب أن يكون رقم',
    'number.integer': 'عدد الأيام يجب أن يكون رقم صحيح',
    'number.min': 'عدد الأيام يجب أن يكون أكبر من 0'
  })
});

/**
 * مخطط التحقق من معرف المستخدم أو العنصر
 */
export const idParamSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'المعرف مطلوب',
    'any.required': 'المعرف مطلوب'
  })
});

/**
 * مخطط التحقق من مفتاح الإعجاب
 */
export const likeKeyParamSchema = Joi.object({
  likeKey: Joi.string().required().messages({
    'string.empty': 'مفتاح الإعجاب مطلوب',
    'any.required': 'مفتاح الإعجاب مطلوب'
  })
});