import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات إعدادات إشعارات البائع
 * @module VendorNotificationSettingsValidator
 */

/**
 * مخطط التحقق من معرف إعدادات إشعارات البائع
 */
export const getVendorNotificationSettingsByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف إعدادات إشعارات البائع يجب أن يكون نص',
        'string.pattern.base': 'معرف إعدادات إشعارات البائع يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف إعدادات إشعارات البائع مطلوب'
      })
  })
};

/**
 * مخطط إنشاء إعدادات إشعارات بائع جديدة
 */
export const createVendorNotificationSettingsSchema = {
  body: Joi.object({
    vendor_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      }),
    inventory_notifications: Joi.object({
      low_stock: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار المخزون المنخفض يجب أن يكون قيمة منطقية'
        }),
      low_stock_threshold: Joi.number()
        .integer()
        .min(0)
        .default(5)
        .messages({
          'number.base': 'حد المخزون المنخفض يجب أن يكون رقم',
          'number.integer': 'حد المخزون المنخفض يجب أن يكون رقم صحيح',
          'number.min': 'حد المخزون المنخفض يجب أن يكون صفر أو أكثر'
        }),
      out_of_stock: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار نفاد المخزون يجب أن يكون قيمة منطقية'
        }),
      stock_replenished: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار تجديد المخزون يجب أن يكون قيمة منطقية'
        })
    }).messages({
      'object.base': 'إشعارات المخزون يجب أن تكون كائن'
    }),
    order_notifications: Joi.object({
      new_order: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار الطلب الجديد يجب أن يكون قيمة منطقية'
        }),
      order_status_change: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار تغيير حالة الطلب يجب أن يكون قيمة منطقية'
        }),
      order_cancelled: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار إلغاء الطلب يجب أن يكون قيمة منطقية'
        }),
      order_refunded: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار استرداد الطلب يجب أن يكون قيمة منطقية'
        })
    }).messages({
      'object.base': 'إشعارات الطلبات يجب أن تكون كائن'
    }),
    customer_notifications: Joi.object({
      new_customer: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار العميل الجديد يجب أن يكون قيمة منطقية'
        }),
      customer_review: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار مراجعة العميل يجب أن يكون قيمة منطقية'
        }),
      customer_support: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'إشعار دعم العميل يجب أن يكون قيمة منطقية'
        })
    }).messages({
      'object.base': 'إشعارات العملاء يجب أن تكون كائن'
    }),
    notification_methods: Joi.object({
      email: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'طريقة إشعار البريد الإلكتروني يجب أن تكون قيمة منطقية'
        }),
      sms: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'طريقة إشعار الرسائل النصية يجب أن تكون قيمة منطقية'
        }),
      push: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'طريقة الإشعار المباشر يجب أن تكون قيمة منطقية'
        }),
      in_app: Joi.boolean()
        .default(true)
        .messages({
          'boolean.base': 'طريقة الإشعار داخل التطبيق يجب أن تكون قيمة منطقية'
        })
    }).messages({
      'object.base': 'طرق الإشعار يجب أن تكون كائن'
    }),
    email_settings: Joi.object({
      sender_name: Joi.string()
        .max(100)
        .allow(null, '')
        .messages({
          'string.base': 'اسم المرسل يجب أن يكون نص',
          'string.max': 'اسم المرسل يجب أن يكون أقل من 100 حرف'
        }),
      sender_email: Joi.string()
        .email()
        .allow(null, '')
        .messages({
          'string.base': 'بريد المرسل يجب أن يكون نص',
          'string.email': 'بريد المرسل يجب أن يكون بريد إلكتروني صحيح'
        }),
      reply_to: Joi.string()
        .email()
        .allow(null, '')
        .messages({
          'string.base': 'بريد الرد يجب أن يكون نص',
          'string.email': 'بريد الرد يجب أن يكون بريد إلكتروني صحيح'
        })
    }).messages({
      'object.base': 'إعدادات البريد الإلكتروني يجب أن تكون كائن'
    }),
    notification_templates: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'قوالب الإشعارات يجب أن تكون كائن'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث إعدادات إشعارات البائع
 */
export const updateVendorNotificationSettingsSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف إعدادات إشعارات البائع يجب أن يكون نص',
        'string.pattern.base': 'معرف إعدادات إشعارات البائع يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف إعدادات إشعارات البائع مطلوب'
      })
  }),
  body: Joi.object({
    inventory_notifications: Joi.object({
      low_stock: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار المخزون المنخفض يجب أن يكون قيمة منطقية'
        }),
      low_stock_threshold: Joi.number()
        .integer()
        .min(0)
        .messages({
          'number.base': 'حد المخزون المنخفض يجب أن يكون رقم',
          'number.integer': 'حد المخزون المنخفض يجب أن يكون رقم صحيح',
          'number.min': 'حد المخزون المنخفض يجب أن يكون صفر أو أكثر'
        }),
      out_of_stock: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار نفاد المخزون يجب أن يكون قيمة منطقية'
        }),
      stock_replenished: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار تجديد المخزون يجب أن يكون قيمة منطقية'
        })
    }).messages({
      'object.base': 'إشعارات المخزون يجب أن تكون كائن'
    }),
    order_notifications: Joi.object({
      new_order: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار الطلب الجديد يجب أن يكون قيمة منطقية'
        }),
      order_status_change: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار تغيير حالة الطلب يجب أن يكون قيمة منطقية'
        }),
      order_cancelled: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار إلغاء الطلب يجب أن يكون قيمة منطقية'
        }),
      order_refunded: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار استرداد الطلب يجب أن يكون قيمة منطقية'
        })
    }).messages({
      'object.base': 'إشعارات الطلبات يجب أن تكون كائن'
    }),
    customer_notifications: Joi.object({
      new_customer: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار العميل الجديد يجب أن يكون قيمة منطقية'
        }),
      customer_review: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار مراجعة العميل يجب أن يكون قيمة منطقية'
        }),
      customer_support: Joi.boolean()
        .messages({
          'boolean.base': 'إشعار دعم العميل يجب أن يكون قيمة منطقية'
        })
    }).messages({
      'object.base': 'إشعارات العملاء يجب أن تكون كائن'
    }),
    notification_methods: Joi.object({
      email: Joi.boolean()
        .messages({
          'boolean.base': 'طريقة إشعار البريد الإلكتروني يجب أن تكون قيمة منطقية'
        }),
      sms: Joi.boolean()
        .messages({
          'boolean.base': 'طريقة إشعار الرسائل النصية يجب أن تكون قيمة منطقية'
        }),
      push: Joi.boolean()
        .messages({
          'boolean.base': 'طريقة الإشعار المباشر يجب أن تكون قيمة منطقية'
        }),
      in_app: Joi.boolean()
        .messages({
          'boolean.base': 'طريقة الإشعار داخل التطبيق يجب أن تكون قيمة منطقية'
        })
    }).messages({
      'object.base': 'طرق الإشعار يجب أن تكون كائن'
    }),
    email_settings: Joi.object({
      sender_name: Joi.string()
        .max(100)
        .allow(null, '')
        .messages({
          'string.base': 'اسم المرسل يجب أن يكون نص',
          'string.max': 'اسم المرسل يجب أن يكون أقل من 100 حرف'
        }),
      sender_email: Joi.string()
        .email()
        .allow(null, '')
        .messages({
          'string.base': 'بريد المرسل يجب أن يكون نص',
          'string.email': 'بريد المرسل يجب أن يكون بريد إلكتروني صحيح'
        }),
      reply_to: Joi.string()
        .email()
        .allow(null, '')
        .messages({
          'string.base': 'بريد الرد يجب أن يكون نص',
          'string.email': 'بريد الرد يجب أن يكون بريد إلكتروني صحيح'
        })
    }).messages({
      'object.base': 'إعدادات البريد الإلكتروني يجب أن تكون كائن'
    }),
    notification_templates: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'قوالب الإشعارات يجب أن تكون كائن'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};