import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات إعدادات الترحيب
 * @module WelcomeValidator
 */

/**
 * مخطط إنشاء إعدادات الترحيب
 */
export const createWelcomeSchema = Joi.object({
  guild_id: Joi.string()
    .required()
    .messages({
      'string.empty': 'معرف الخادم مطلوب',
      'any.required': 'معرف الخادم مطلوب'
    }),
  
  b_url: Joi.string()
    .uri()
    .allow(null)
    .messages({
      'string.uri': 'رابط الخلفية يجب أن يكون رابط صحيح'
    }),
  
  b_x: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع X للخلفية يجب أن يكون رقم',
      'number.integer': 'موضع X للخلفية يجب أن يكون رقم صحيح',
      'number.min': 'موضع X للخلفية يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  b_y: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع Y للخلفية يجب أن يكون رقم',
      'number.integer': 'موضع Y للخلفية يجب أن يكون رقم صحيح',
      'number.min': 'موضع Y للخلفية يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  b_width: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'عرض الخلفية يجب أن يكون رقم',
      'number.integer': 'عرض الخلفية يجب أن يكون رقم صحيح',
      'number.min': 'عرض الخلفية يجب أن يكون أكبر من 0'
    }),
  
  b_height: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'ارتفاع الخلفية يجب أن يكون رقم',
      'number.integer': 'ارتفاع الخلفية يجب أن يكون رقم صحيح',
      'number.min': 'ارتفاع الخلفية يجب أن يكون أكبر من 0'
    }),
  
  i_top: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع الصورة من الأعلى يجب أن يكون رقم',
      'number.integer': 'موضع الصورة من الأعلى يجب أن يكون رقم صحيح',
      'number.min': 'موضع الصورة من الأعلى يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  i_left: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع الصورة من اليسار يجب أن يكون رقم',
      'number.integer': 'موضع الصورة من اليسار يجب أن يكون رقم صحيح',
      'number.min': 'موضع الصورة من اليسار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  i_width: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'عرض الصورة يجب أن يكون رقم',
      'number.integer': 'عرض الصورة يجب أن يكون رقم صحيح',
      'number.min': 'عرض الصورة يجب أن يكون أكبر من 0'
    }),
  
  i_height: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'ارتفاع الصورة يجب أن يكون رقم',
      'number.integer': 'ارتفاع الصورة يجب أن يكون رقم صحيح',
      'number.min': 'ارتفاع الصورة يجب أن يكون أكبر من 0'
    }),
  
  a_x: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع X للأفاتار يجب أن يكون رقم',
      'number.integer': 'موضع X للأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'موضع X للأفاتار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  a_y: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع Y للأفاتار يجب أن يكون رقم',
      'number.integer': 'موضع Y للأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'موضع Y للأفاتار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  a_width: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'عرض الأفاتار يجب أن يكون رقم',
      'number.integer': 'عرض الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'عرض الأفاتار يجب أن يكون أكبر من 0'
    }),
  
  a_height: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'ارتفاع الأفاتار يجب أن يكون رقم',
      'number.integer': 'ارتفاع الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'ارتفاع الأفاتار يجب أن يكون أكبر من 0'
    }),
  
  a_style: Joi.string()
    .valid('circle', 'square', 'rounded')
    .allow(null)
    .messages({
      'any.only': 'نمط الأفاتار يجب أن يكون circle أو square أو rounded'
    }),
  
  a_radius: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .default(0)
    .messages({
      'number.base': 'نصف قطر الأفاتار يجب أن يكون رقم',
      'number.integer': 'نصف قطر الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'نصف قطر الأفاتار يجب أن يكون أكبر من أو يساوي 0',
      'number.max': 'نصف قطر الأفاتار يجب أن يكون أقل من أو يساوي 100'
    }),
  
  a_rotate: Joi.number()
    .integer()
    .min(0)
    .max(360)
    .allow(null)
    .messages({
      'number.base': 'دوران الأفاتار يجب أن يكون رقم',
      'number.integer': 'دوران الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'دوران الأفاتار يجب أن يكون أكبر من أو يساوي 0',
      'number.max': 'دوران الأفاتار يجب أن يكون أقل من أو يساوي 360'
    }),
  
  a_border_width: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'عرض حدود الأفاتار يجب أن يكون رقم',
      'number.integer': 'عرض حدود الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'عرض حدود الأفاتار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  a_border_color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'لون حدود الأفاتار يجب أن يكون لون hex صحيح (مثل #FF0000)'
    }),
  
  a_border_style: Joi.string()
    .valid('solid', 'dashed', 'dotted')
    .allow(null)
    .messages({
      'any.only': 'نمط حدود الأفاتار يجب أن يكون solid أو dashed أو dotted'
    }),
  
  text_array: Joi.string()
    .allow(null)
    .messages({
      'string.base': 'مصفوفة النصوص يجب أن تكون نص'
    })
});

/**
 * مخطط تحديث إعدادات الترحيب
 */
export const updateWelcomeSchema = Joi.object({
  b_url: Joi.string()
    .uri()
    .allow(null)
    .messages({
      'string.uri': 'رابط الخلفية يجب أن يكون رابط صحيح'
    }),
  
  b_x: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع X للخلفية يجب أن يكون رقم',
      'number.integer': 'موضع X للخلفية يجب أن يكون رقم صحيح',
      'number.min': 'موضع X للخلفية يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  b_y: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع Y للخلفية يجب أن يكون رقم',
      'number.integer': 'موضع Y للخلفية يجب أن يكون رقم صحيح',
      'number.min': 'موضع Y للخلفية يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  b_width: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'عرض الخلفية يجب أن يكون رقم',
      'number.integer': 'عرض الخلفية يجب أن يكون رقم صحيح',
      'number.min': 'عرض الخلفية يجب أن يكون أكبر من 0'
    }),
  
  b_height: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'ارتفاع الخلفية يجب أن يكون رقم',
      'number.integer': 'ارتفاع الخلفية يجب أن يكون رقم صحيح',
      'number.min': 'ارتفاع الخلفية يجب أن يكون أكبر من 0'
    }),
  
  i_top: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع الصورة من الأعلى يجب أن يكون رقم',
      'number.integer': 'موضع الصورة من الأعلى يجب أن يكون رقم صحيح',
      'number.min': 'موضع الصورة من الأعلى يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  i_left: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع الصورة من اليسار يجب أن يكون رقم',
      'number.integer': 'موضع الصورة من اليسار يجب أن يكون رقم صحيح',
      'number.min': 'موضع الصورة من اليسار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  i_width: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'عرض الصورة يجب أن يكون رقم',
      'number.integer': 'عرض الصورة يجب أن يكون رقم صحيح',
      'number.min': 'عرض الصورة يجب أن يكون أكبر من 0'
    }),
  
  i_height: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'ارتفاع الصورة يجب أن يكون رقم',
      'number.integer': 'ارتفاع الصورة يجب أن يكون رقم صحيح',
      'number.min': 'ارتفاع الصورة يجب أن يكون أكبر من 0'
    }),
  
  a_x: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع X للأفاتار يجب أن يكون رقم',
      'number.integer': 'موضع X للأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'موضع X للأفاتار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  a_y: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'موضع Y للأفاتار يجب أن يكون رقم',
      'number.integer': 'موضع Y للأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'موضع Y للأفاتار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  a_width: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'عرض الأفاتار يجب أن يكون رقم',
      'number.integer': 'عرض الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'عرض الأفاتار يجب أن يكون أكبر من 0'
    }),
  
  a_height: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .messages({
      'number.base': 'ارتفاع الأفاتار يجب أن يكون رقم',
      'number.integer': 'ارتفاع الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'ارتفاع الأفاتار يجب أن يكون أكبر من 0'
    }),
  
  a_style: Joi.string()
    .valid('circle', 'square', 'rounded')
    .allow(null)
    .messages({
      'any.only': 'نمط الأفاتار يجب أن يكون circle أو square أو rounded'
    }),
  
  a_radius: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .messages({
      'number.base': 'نصف قطر الأفاتار يجب أن يكون رقم',
      'number.integer': 'نصف قطر الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'نصف قطر الأفاتار يجب أن يكون أكبر من أو يساوي 0',
      'number.max': 'نصف قطر الأفاتار يجب أن يكون أقل من أو يساوي 100'
    }),
  
  a_rotate: Joi.number()
    .integer()
    .min(0)
    .max(360)
    .allow(null)
    .messages({
      'number.base': 'دوران الأفاتار يجب أن يكون رقم',
      'number.integer': 'دوران الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'دوران الأفاتار يجب أن يكون أكبر من أو يساوي 0',
      'number.max': 'دوران الأفاتار يجب أن يكون أقل من أو يساوي 360'
    }),
  
  a_border_width: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'عرض حدود الأفاتار يجب أن يكون رقم',
      'number.integer': 'عرض حدود الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'عرض حدود الأفاتار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  a_border_color: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'لون حدود الأفاتار يجب أن يكون لون hex صحيح (مثل #FF0000)'
    }),
  
  a_border_style: Joi.string()
    .valid('solid', 'dashed', 'dotted')
    .allow(null)
    .messages({
      'any.only': 'نمط حدود الأفاتار يجب أن يكون solid أو dashed أو dotted'
    }),
  
  text_array: Joi.string()
    .allow(null)
    .messages({
      'string.base': 'مصفوفة النصوص يجب أن تكون نص'
    })
});

/**
 * مخطط الحصول على إعدادات الترحيب بواسطة معرف الخادم
 */
export const getWelcomeByGuildIdSchema = Joi.object({
  guildId: Joi.string()
    .required()
    .messages({
      'string.empty': 'معرف الخادم مطلوب',
      'any.required': 'معرف الخادم مطلوب'
    })
});

/**
 * مخطط الحصول على إعدادات الترحيب بواسطة نمط الأفاتار
 */
export const getWelcomeByAvatarStyleSchema = Joi.object({
  avatarStyle: Joi.string()
    .valid('circle', 'square', 'rounded')
    .required()
    .messages({
      'any.only': 'نمط الأفاتار يجب أن يكون circle أو square أو rounded',
      'any.required': 'نمط الأفاتار مطلوب'
    })
});

/**
 * مخطط البحث في إعدادات الترحيب
 */
export const searchWelcomeSchema = Joi.object({
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
 * مخطط إنشاء إعدادات ترحيب للخادم
 */
export const createGuildWelcomeSchema = Joi.object({
  guildId: Joi.string()
    .required()
    .messages({
      'string.empty': 'معرف الخادم مطلوب',
      'any.required': 'معرف الخادم مطلوب'
    })
});

/**
 * مخطط تحديث إعدادات الصورة
 */
export const updateImageSettingsSchema = Joi.object({
  top: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'موضع الصورة من الأعلى يجب أن يكون رقم',
      'number.integer': 'موضع الصورة من الأعلى يجب أن يكون رقم صحيح',
      'number.min': 'موضع الصورة من الأعلى يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  left: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'موضع الصورة من اليسار يجب أن يكون رقم',
      'number.integer': 'موضع الصورة من اليسار يجب أن يكون رقم صحيح',
      'number.min': 'موضع الصورة من اليسار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  width: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': 'عرض الصورة يجب أن يكون رقم',
      'number.integer': 'عرض الصورة يجب أن يكون رقم صحيح',
      'number.min': 'عرض الصورة يجب أن يكون أكبر من 0'
    }),
  
  height: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': 'ارتفاع الصورة يجب أن يكون رقم',
      'number.integer': 'ارتفاع الصورة يجب أن يكون رقم صحيح',
      'number.min': 'ارتفاع الصورة يجب أن يكون أكبر من 0'
    })
});

/**
 * مخطط تحديث إعدادات الخلفية
 */
export const updateBackgroundSettingsSchema = Joi.object({
  url: Joi.string()
    .uri()
    .allow(null)
    .messages({
      'string.uri': 'رابط الخلفية يجب أن يكون رابط صحيح'
    }),
  
  x: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'موضع X للخلفية يجب أن يكون رقم',
      'number.integer': 'موضع X للخلفية يجب أن يكون رقم صحيح',
      'number.min': 'موضع X للخلفية يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  y: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'موضع Y للخلفية يجب أن يكون رقم',
      'number.integer': 'موضع Y للخلفية يجب أن يكون رقم صحيح',
      'number.min': 'موضع Y للخلفية يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  width: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': 'عرض الخلفية يجب أن يكون رقم',
      'number.integer': 'عرض الخلفية يجب أن يكون رقم صحيح',
      'number.min': 'عرض الخلفية يجب أن يكون أكبر من 0'
    }),
  
  height: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': 'ارتفاع الخلفية يجب أن يكون رقم',
      'number.integer': 'ارتفاع الخلفية يجب أن يكون رقم صحيح',
      'number.min': 'ارتفاع الخلفية يجب أن يكون أكبر من 0'
    })
});

/**
 * مخطط تحديث إعدادات الأفاتار
 */
export const updateAvatarSettingsSchema = Joi.object({
  x: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'موضع X للأفاتار يجب أن يكون رقم',
      'number.integer': 'موضع X للأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'موضع X للأفاتار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  y: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'موضع Y للأفاتار يجب أن يكون رقم',
      'number.integer': 'موضع Y للأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'موضع Y للأفاتار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  width: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': 'عرض الأفاتار يجب أن يكون رقم',
      'number.integer': 'عرض الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'عرض الأفاتار يجب أن يكون أكبر من 0'
    }),
  
  height: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': 'ارتفاع الأفاتار يجب أن يكون رقم',
      'number.integer': 'ارتفاع الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'ارتفاع الأفاتار يجب أن يكون أكبر من 0'
    }),
  
  style: Joi.string()
    .valid('circle', 'square', 'rounded')
    .messages({
      'any.only': 'نمط الأفاتار يجب أن يكون circle أو square أو rounded'
    }),
  
  radius: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .messages({
      'number.base': 'نصف قطر الأفاتار يجب أن يكون رقم',
      'number.integer': 'نصف قطر الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'نصف قطر الأفاتار يجب أن يكون أكبر من أو يساوي 0',
      'number.max': 'نصف قطر الأفاتار يجب أن يكون أقل من أو يساوي 100'
    }),
  
  rotate: Joi.number()
    .integer()
    .min(0)
    .max(360)
    .messages({
      'number.base': 'دوران الأفاتار يجب أن يكون رقم',
      'number.integer': 'دوران الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'دوران الأفاتار يجب أن يكون أكبر من أو يساوي 0',
      'number.max': 'دوران الأفاتار يجب أن يكون أقل من أو يساوي 360'
    }),
  
  borderWidth: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'عرض حدود الأفاتار يجب أن يكون رقم',
      'number.integer': 'عرض حدود الأفاتار يجب أن يكون رقم صحيح',
      'number.min': 'عرض حدود الأفاتار يجب أن يكون أكبر من أو يساوي 0'
    }),
  
  borderColor: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .messages({
      'string.pattern.base': 'لون حدود الأفاتار يجب أن يكون لون hex صحيح (مثل #FF0000)'
    }),
  
  borderStyle: Joi.string()
    .valid('solid', 'dashed', 'dotted')
    .messages({
      'any.only': 'نمط حدود الأفاتار يجب أن يكون solid أو dashed أو dotted'
    })
});

/**
 * مخطط تحديث النصوص
 */
export const updateTextArraySchema = Joi.object({
  textArray: Joi.string()
    .required()
    .messages({
      'string.empty': 'مصفوفة النصوص مطلوبة',
      'any.required': 'مصفوفة النصوص مطلوبة'
    })
});

/**
 * مخطط نسخ إعدادات الترحيب
 */
export const copyWelcomeSettingsSchema = Joi.object({
  sourceGuildId: Joi.string()
    .required()
    .messages({
      'string.empty': 'معرف الخادم المصدر مطلوب',
      'any.required': 'معرف الخادم المصدر مطلوب'
    }),
  
  targetGuildId: Joi.string()
    .required()
    .messages({
      'string.empty': 'معرف الخادم الهدف مطلوب',
      'any.required': 'معرف الخادم الهدف مطلوب'
    })
});