import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لإدارة الرسائل المجدولة
 * Validation schemas for scheduled messages management data
 */

/**
 * مخطط التحقق من معرف الرسالة المجدولة
 * Scheduled message ID validation schema
 */
export const getScheduleMessageByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الرسالة المجدولة يجب أن يكون رقماً',
        'number.integer': 'معرف الرسالة المجدولة يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف الرسالة المجدولة يجب أن يكون رقماً موجباً',
        'any.required': 'معرف الرسالة المجدولة مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getScheduleMessagesByServerIdSchema = {
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
  })
};

/**
 * مخطط التحقق من إنشاء رسالة مجدولة جديدة
 * Create scheduled message validation schema
 */
export const createScheduleMessageSchema = {
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

    title: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required()
      .messages({
        'string.base': 'عنوان الإعلان يجب أن يكون نصاً',
        'string.empty': 'عنوان الإعلان لا يمكن أن يكون فارغاً',
        'string.min': 'عنوان الإعلان يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'عنوان الإعلان لا يمكن أن يتجاوز 255 حرف',
        'any.required': 'عنوان الإعلان مطلوب'
      }),

    content: Joi.string()
      .trim()
      .min(1)
      .required()
      .messages({
        'string.base': 'محتوى الإعلان يجب أن يكون نصاً',
        'string.empty': 'محتوى الإعلان لا يمكن أن يكون فارغاً',
        'string.min': 'محتوى الإعلان يجب أن يحتوي على حرف واحد على الأقل',
        'any.required': 'محتوى الإعلان مطلوب'
      }),

    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الصورة يجب أن يكون نصاً',
        'string.uri': 'رابط الصورة يجب أن يكون رابطاً صحيحاً'
      }),

    link_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الإعلان يجب أن يكون نصاً',
        'string.uri': 'رابط الإعلان يجب أن يكون رابطاً صحيحاً'
      }),

    channels: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .default([])
      .messages({
        'array.base': 'قائمة القنوات يجب أن تكون مصفوفة'
      }),

    roles: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف الدور يجب أن يكون نصاً',
            'string.empty': 'معرف الدور لا يمكن أن يكون فارغاً',
            'string.min': 'معرف الدور يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف الدور لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .default([])
      .messages({
        'array.base': 'قائمة الأدوار يجب أن تكون مصفوفة'
      }),

    publish_type: Joi.string()
      .valid('immediate', 'scheduled')
      .default('immediate')
      .messages({
        'string.base': 'نوع النشر يجب أن يكون نصاً',
        'any.only': 'نوع النشر يجب أن يكون أحد القيم التالية: immediate, scheduled'
      }),

    schedule_mode: Joi.string()
      .valid('specific_time', 'delay_from_now')
      .default('specific_time')
      .messages({
        'string.base': 'وضع الجدولة يجب أن يكون نصاً',
        'any.only': 'وضع الجدولة يجب أن يكون أحد القيم التالية: specific_time, delay_from_now'
      }),

    scheduled_time: Joi.date()
      .iso()
      .allow(null)
      .messages({
        'date.base': 'الوقت المجدول يجب أن يكون تاريخاً صحيحاً',
        'date.format': 'الوقت المجدول يجب أن يكون بصيغة ISO صحيحة'
      }),

    delay_amount: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'مقدار التأخير يجب أن يكون رقماً',
        'number.integer': 'مقدار التأخير يجب أن يكون رقماً صحيحاً',
        'number.min': 'مقدار التأخير يجب أن يكون صفراً أو أكثر'
      }),

    delay_unit: Joi.string()
      .valid('minutes', 'hours', 'days')
      .default('minutes')
      .messages({
        'string.base': 'وحدة التأخير يجب أن تكون نصاً',
        'any.only': 'وحدة التأخير يجب أن تكون أحد القيم التالية: minutes, hours, days'
      }),

    schedule_type: Joi.string()
      .valid('one_time', 'recurring')
      .default('one_time')
      .messages({
        'string.base': 'نوع الجدولة يجب أن يكون نصاً',
        'any.only': 'نوع الجدولة يجب أن يكون أحد القيم التالية: one_time, recurring'
      }),

    recurring_type: Joi.string()
      .valid('daily', 'weekly', 'monthly')
      .allow(null)
      .messages({
        'string.base': 'نوع التكرار يجب أن يكون نصاً',
        'any.only': 'نوع التكرار يجب أن يكون أحد القيم التالية: daily, weekly, monthly'
      }),

    priority_level: Joi.string()
      .valid('low', 'normal', 'high')
      .default('normal')
      .messages({
        'string.base': 'مستوى الأولوية يجب أن يكون نصاً',
        'any.only': 'مستوى الأولوية يجب أن يكون أحد القيم التالية: low, normal, high'
      })
  })
};

/**
 * مخطط التحقق من تحديث الرسالة المجدولة
 * Update scheduled message validation schema
 */
export const updateScheduleMessageSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الرسالة المجدولة يجب أن يكون رقماً',
        'number.integer': 'معرف الرسالة المجدولة يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف الرسالة المجدولة يجب أن يكون رقماً موجباً',
        'any.required': 'معرف الرسالة المجدولة مطلوب'
      })
  }),

  body: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .messages({
        'string.base': 'عنوان الإعلان يجب أن يكون نصاً',
        'string.empty': 'عنوان الإعلان لا يمكن أن يكون فارغاً',
        'string.min': 'عنوان الإعلان يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'عنوان الإعلان لا يمكن أن يتجاوز 255 حرف'
      }),

    content: Joi.string()
      .trim()
      .min(1)
      .messages({
        'string.base': 'محتوى الإعلان يجب أن يكون نصاً',
        'string.empty': 'محتوى الإعلان لا يمكن أن يكون فارغاً',
        'string.min': 'محتوى الإعلان يجب أن يحتوي على حرف واحد على الأقل'
      }),

    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الصورة يجب أن يكون نصاً',
        'string.uri': 'رابط الصورة يجب أن يكون رابطاً صحيحاً'
      }),

    link_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الإعلان يجب أن يكون نصاً',
        'string.uri': 'رابط الإعلان يجب أن يكون رابطاً صحيحاً'
      }),

    channels: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف القناة يجب أن يكون نصاً',
            'string.empty': 'معرف القناة لا يمكن أن يكون فارغاً',
            'string.min': 'معرف القناة يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف القناة لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة القنوات يجب أن تكون مصفوفة'
      }),

    roles: Joi.array()
      .items(
        Joi.string()
          .trim()
          .min(1)
          .max(50)
          .messages({
            'string.base': 'معرف الدور يجب أن يكون نصاً',
            'string.empty': 'معرف الدور لا يمكن أن يكون فارغاً',
            'string.min': 'معرف الدور يجب أن يحتوي على حرف واحد على الأقل',
            'string.max': 'معرف الدور لا يمكن أن يتجاوز 50 حرفاً'
          })
      )
      .messages({
        'array.base': 'قائمة الأدوار يجب أن تكون مصفوفة'
      }),

    publish_type: Joi.string()
      .valid('immediate', 'scheduled')
      .messages({
        'string.base': 'نوع النشر يجب أن يكون نصاً',
        'any.only': 'نوع النشر يجب أن يكون أحد القيم التالية: immediate, scheduled'
      }),

    schedule_mode: Joi.string()
      .valid('specific_time', 'delay_from_now')
      .messages({
        'string.base': 'وضع الجدولة يجب أن يكون نصاً',
        'any.only': 'وضع الجدولة يجب أن يكون أحد القيم التالية: specific_time, delay_from_now'
      }),

    scheduled_time: Joi.date()
      .iso()
      .allow(null)
      .messages({
        'date.base': 'الوقت المجدول يجب أن يكون تاريخاً صحيحاً',
        'date.format': 'الوقت المجدول يجب أن يكون بصيغة ISO صحيحة'
      }),

    delay_amount: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'مقدار التأخير يجب أن يكون رقماً',
        'number.integer': 'مقدار التأخير يجب أن يكون رقماً صحيحاً',
        'number.min': 'مقدار التأخير يجب أن يكون صفراً أو أكثر'
      }),

    delay_unit: Joi.string()
      .valid('minutes', 'hours', 'days')
      .messages({
        'string.base': 'وحدة التأخير يجب أن تكون نصاً',
        'any.only': 'وحدة التأخير يجب أن تكون أحد القيم التالية: minutes, hours, days'
      }),

    schedule_type: Joi.string()
      .valid('one_time', 'recurring')
      .messages({
        'string.base': 'نوع الجدولة يجب أن يكون نصاً',
        'any.only': 'نوع الجدولة يجب أن يكون أحد القيم التالية: one_time, recurring'
      }),

    recurring_type: Joi.string()
      .valid('daily', 'weekly', 'monthly')
      .allow(null)
      .messages({
        'string.base': 'نوع التكرار يجب أن يكون نصاً',
        'any.only': 'نوع التكرار يجب أن يكون أحد القيم التالية: daily, weekly, monthly'
      }),

    priority_level: Joi.string()
      .valid('low', 'normal', 'high')
      .messages({
        'string.base': 'مستوى الأولوية يجب أن يكون نصاً',
        'any.only': 'مستوى الأولوية يجب أن يكون أحد القيم التالية: low, normal, high'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
  })
};

/**
 * مخطط التحقق من حذف الرسالة المجدولة
 * Delete scheduled message validation schema
 */
export const deleteScheduleMessageSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الرسالة المجدولة يجب أن يكون رقماً',
        'number.integer': 'معرف الرسالة المجدولة يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف الرسالة المجدولة يجب أن يكون رقماً موجباً',
        'any.required': 'معرف الرسالة المجدولة مطلوب'
      })
  })
};