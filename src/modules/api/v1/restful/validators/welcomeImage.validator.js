import Joi from 'joi';

/**
 * مدقق صحة بيانات صور الترحيب - WelcomeImage Validator
 * يحتوي على جميع مخططات التحقق من صحة البيانات المتعلقة بقوالب صور الترحيب
 * Contains all validation schemas for welcome images templates data
 */

/**
 * مخطط التحقق من صحة معرف قالب صورة الترحيب
 * Welcome image template ID validation schema
 */
export const getWelcomeImageByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'معرف قالب صورة الترحيب يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف قالب صورة الترحيب مطلوب'
      })
  }).required()
};

/**
 * مخطط التحقق من صحة معرف الخادم
 * Server ID validation schema
 */
export const getWelcomeImageByServerIdSchema = {
  params: Joi.object({
    serverId: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.base': 'يجب أن يكون معرف الخادم نصاً',
        'string.pattern.base': 'معرف الخادم يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف الخادم لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف الخادم يجب أن لا يزيد عن 50 حرف',
        'any.required': 'معرف الخادم مطلوب'
      })
  }).required()
};

/**
 * مخطط التحقق من صحة بيانات إنشاء قالب صورة الترحيب
 * Create welcome image template validation schema
 */
export const createWelcomeImageSchema = {
  body: Joi.object({
    server_id: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.base': 'يجب أن يكون معرف الخادم نصاً',
        'string.pattern.base': 'معرف الخادم يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف الخادم لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف الخادم يجب أن لا يزيد عن 50 حرف',
        'any.required': 'معرف الخادم مطلوب'
      }),
    
    enabled: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'حالة التفعيل يجب أن تكون قيمة منطقية'
      }),
    
    backgroundImage: Joi.string()
      .uri()
      .allow('')
      .optional()
      .messages({
        'string.uri': 'رابط صورة الخلفية يجب أن يكون رابط صحيح'
      }),
    
    backgroundColor: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .default('#36393f')
      .messages({
        'string.pattern.base': 'لون الخلفية يجب أن يكون كود لون hex صحيح'
      }),
    
    textColor: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .default('#ffffff')
      .messages({
        'string.pattern.base': 'لون النص يجب أن يكون كود لون hex صحيح'
      }),
    
    welcomeText: Joi.string()
      .max(200)
      .default('مرحباً {username}!')
      .messages({
        'string.max': 'نص الترحيب يجب ألا يتجاوز 200 حرف'
      }),
    
    fontSize: Joi.number()
      .integer()
      .min(12)
      .max(72)
      .default(24)
      .messages({
        'number.base': 'حجم الخط يجب أن يكون رقم',
        'number.integer': 'حجم الخط يجب أن يكون رقم صحيح',
        'number.min': 'حجم الخط يجب أن يكون على الأقل 12',
        'number.max': 'حجم الخط يجب ألا يتجاوز 72'
      }),
    
    fontFamily: Joi.string()
      .valid('Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Tahoma')
      .default('Arial')
      .messages({
        'any.only': 'نوع الخط يجب أن يكون من الأنواع المدعومة'
      }),
    
    avatarBorder: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'إعداد حدود الصورة الشخصية يجب أن يكون قيمة منطقية'
      }),
    
    avatarBorderColor: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .default('#7289da')
      .messages({
        'string.pattern.base': 'لون حدود الصورة الشخصية يجب أن يكون كود لون hex صحيح'
      }),
    
    avatarSize: Joi.number()
      .integer()
      .min(50)
      .max(200)
      .default(100)
      .messages({
        'number.base': 'حجم الصورة الشخصية يجب أن يكون رقم',
        'number.integer': 'حجم الصورة الشخصية يجب أن يكون رقم صحيح',
        'number.min': 'حجم الصورة الشخصية يجب أن يكون على الأقل 50',
        'number.max': 'حجم الصورة الشخصية يجب ألا يتجاوز 200'
      }),
    
    position: Joi.object({
      x: Joi.number()
        .integer()
        .min(0)
        .default(50)
        .messages({
          'number.base': 'موقع X يجب أن يكون رقم',
          'number.integer': 'موقع X يجب أن يكون رقم صحيح',
          'number.min': 'موقع X يجب أن يكون على الأقل 0'
        }),
      y: Joi.number()
        .integer()
        .min(0)
        .default(50)
        .messages({
          'number.base': 'موقع Y يجب أن يكون رقم',
          'number.integer': 'موقع Y يجب أن يكون رقم صحيح',
          'number.min': 'موقع Y يجب أن يكون على الأقل 0'
        })
    }).default({ x: 50, y: 50 }),
    
    imageWidth: Joi.number()
      .integer()
      .min(400)
      .max(1200)
      .default(800)
      .messages({
        'number.base': 'عرض الصورة يجب أن يكون رقم',
        'number.integer': 'عرض الصورة يجب أن يكون رقم صحيح',
        'number.min': 'عرض الصورة يجب أن يكون على الأقل 400',
        'number.max': 'عرض الصورة يجب ألا يتجاوز 1200'
      }),
    
    imageHeight: Joi.number()
      .integer()
      .min(200)
      .max(600)
      .default(300)
      .messages({
        'number.base': 'ارتفاع الصورة يجب أن يكون رقم',
        'number.integer': 'ارتفاع الصورة يجب أن يكون رقم صحيح',
        'number.min': 'ارتفاع الصورة يجب أن يكون على الأقل 200',
        'number.max': 'ارتفاع الصورة يجب ألا يتجاوز 600'
      })
    }).min(1).messages({
    'object.min': 'يجب توفير إحداثيات موقع الصورة'
  })
};



/**
 * مخطط التحقق من صحة بيانات تحديث قالب صورة الترحيب
 * Update welcome image template validation schema
 */
export const updateWelcomeImageSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'معرف قالب صورة الترحيب يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف قالب صورة الترحيب مطلوب'
      })
  }).required(),
  
  body: Joi.object({
    enabled: Joi.boolean()
      .messages({
        'boolean.base': 'حالة التفعيل يجب أن تكون قيمة منطقية'
      }),
    
    backgroundImage: Joi.string()
      .uri()
      .allow('')
      .messages({
        'string.uri': 'رابط صورة الخلفية يجب أن يكون رابط صحيح'
      }),
    
    backgroundColor: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .messages({
      'string.pattern.base': 'لون الخلفية يجب أن يكون كود لون hex صحيح'
    }),
    
    textColor: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .messages({
        'string.pattern.base': 'لون النص يجب أن يكون كود لون hex صحيح'
      }),
    
    welcomeText: Joi.string()
      .max(200)
      .messages({
        'string.max': 'نص الترحيب يجب ألا يتجاوز 200 حرف'
      }),
    
    fontSize: Joi.number()
      .integer()
      .min(12)
      .max(72)
      .messages({
        'number.base': 'حجم الخط يجب أن يكون رقم',
        'number.integer': 'حجم الخط يجب أن يكون رقم صحيح',
        'number.min': 'حجم الخط يجب أن يكون على الأقل 12',
        'number.max': 'حجم الخط يجب ألا يتجاوز 72'
      }),
    
    fontFamily: Joi.string()
      .valid('Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Tahoma')
      .messages({
        'any.only': 'نوع الخط يجب أن يكون من الأنواع المدعومة'
      }),
    
    avatarBorder: Joi.boolean()
      .messages({
        'boolean.base': 'إعداد حدود الصورة الشخصية يجب أن يكون قيمة منطقية'
      }),
    
    avatarBorderColor: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .messages({
        'string.pattern.base': 'لون حدود الصورة الشخصية يجب أن يكون كود لون hex صحيح'
      }),
    
    avatarSize: Joi.number()
      .integer()
      .min(50)
      .max(200)
      .messages({
        'number.base': 'حجم الصورة الشخصية يجب أن يكون رقم',
        'number.integer': 'حجم الصورة الشخصية يجب أن يكون رقم صحيح',
        'number.min': 'حجم الصورة الشخصية يجب أن يكون على الأقل 50',
        'number.max': 'حجم الصورة الشخصية يجب ألا يتجاوز 200'
      }),
    
    position: Joi.object({
      x: Joi.number()
        .integer()
        .min(0)
        .messages({
          'number.base': 'موقع X يجب أن يكون رقم',
          'number.integer': 'موقع X يجب أن يكون رقم صحيح',
          'number.min': 'موقع X يجب أن يكون على الأقل 0'
        }),
      y: Joi.number()
        .integer()
        .min(0)
        .messages({
          'number.base': 'موقع Y يجب أن يكون رقم',
          'number.integer': 'موقع Y يجب أن يكون رقم صحيح',
          'number.min': 'موقع Y يجب أن يكون على الأقل 0'
        })
    }),
    
    imageWidth: Joi.number()
      .integer()
      .min(400)
      .max(1200)
      .messages({
        'number.base': 'عرض الصورة يجب أن يكون رقم',
        'number.integer': 'عرض الصورة يجب أن يكون رقم صحيح',
        'number.min': 'عرض الصورة يجب أن يكون على الأقل 400',
        'number.max': 'عرض الصورة يجب ألا يتجاوز 1200'
      }),
    
    imageHeight: Joi.number()
      .integer()
      .min(200)
      .max(600)
      .messages({
        'number.base': 'ارتفاع الصورة يجب أن يكون رقم',
        'number.integer': 'ارتفاع الصورة يجب أن يكون رقم صحيح',
        'number.min': 'ارتفاع الصورة يجب أن يكون على الأقل 200',
        'number.max': 'ارتفاع الصورة يجب ألا يتجاوز 600'
      })
    }).min(1).messages({
      'object.min': 'يجب توفير إحداثيات موقع الصورة'
    })
};

/**
 * مخطط التحقق من صحة بيانات حذف قالب صورة الترحيب
 * Delete welcome image template validation schema
 */
export const deleteWelcomeImageSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'معرف قالب صورة الترحيب يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف قالب صورة الترحيب مطلوب'
      })
  }).required()
};

/**
 * مخطط التحقق من صحة بيانات حذف قالب صورة الترحيب بواسطة معرف الخادم
 * Delete welcome image template by server ID validation schema
 */
export const deleteWelcomeImageByServerIdSchema = {
  params: Joi.object({
    serverId: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.base': 'يجب أن يكون معرف الخادم نصاً',
        'string.pattern.base': 'معرف الخادم يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف الخادم لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف الخادم يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف الخادم يجب أن لا يزيد عن 50 حرف',
        'any.required': 'معرف الخادم مطلوب'
      })
  }).required()
};
