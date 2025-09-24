import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات إعدادات الطباعة للبائعين
 * @module VendorPrintSettingsValidator
 */

/**
 * مخطط التحقق من معرف البائع
 */
export const getVendorPrintSettingsByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      })
  })
};

/**
 * مخطط إنشاء إعدادات طباعة جديدة
 */
export const createVendorPrintSettingsSchema = {
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
    general: Joi.object({
      paper_size: Joi.string()
        .valid('A4', 'A5', 'Letter', 'Legal')
        .default('A4')
        .messages({
          'string.base': 'حجم الورق يجب أن يكون نص',
          'any.only': 'حجم الورق يجب أن يكون إحدى القيم: A4, A5, Letter, Legal'
        }),
      orientation: Joi.string()
        .valid('portrait', 'landscape')
        .default('portrait')
        .messages({
          'string.base': 'اتجاه الورق يجب أن يكون نص',
          'any.only': 'اتجاه الورق يجب أن يكون إحدى القيم: portrait, landscape'
        }),
      margin: Joi.object({
        top: Joi.number().min(0).default(10).messages({
          'number.base': 'الهامش العلوي يجب أن يكون رقم',
          'number.min': 'الهامش العلوي يجب أن يكون صفر أو أكثر'
        }),
        right: Joi.number().min(0).default(10).messages({
          'number.base': 'الهامش الأيمن يجب أن يكون رقم',
          'number.min': 'الهامش الأيمن يجب أن يكون صفر أو أكثر'
        }),
        bottom: Joi.number().min(0).default(10).messages({
          'number.base': 'الهامش السفلي يجب أن يكون رقم',
          'number.min': 'الهامش السفلي يجب أن يكون صفر أو أكثر'
        }),
        left: Joi.number().min(0).default(10).messages({
          'number.base': 'الهامش الأيسر يجب أن يكون رقم',
          'number.min': 'الهامش الأيسر يجب أن يكون صفر أو أكثر'
        })
      })
    }),
    invoice: Joi.object({
      print_logo: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة الشعار يجب أن تكون قيمة منطقية'
      }),
      print_company_info: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة معلومات الشركة يجب أن تكون قيمة منطقية'
      }),
      print_customer_info: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة معلومات العميل يجب أن تكون قيمة منطقية'
      }),
      print_item_details: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة تفاصيل الأصناف يجب أن تكون قيمة منطقية'
      }),
      print_tax_details: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة تفاصيل الضريبة يجب أن تكون قيمة منطقية'
      }),
      print_payment_info: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة معلومات الدفع يجب أن تكون قيمة منطقية'
      }),
      print_signature: Joi.boolean().default(false).messages({
        'boolean.base': 'طباعة التوقيع يجب أن تكون قيمة منطقية'
      }),
      footer_text: Joi.string().max(500).allow(null, '').messages({
        'string.base': 'نص التذييل يجب أن يكون نص',
        'string.max': 'نص التذييل يجب أن يكون أقل من 500 حرف'
      })
    }),
    order: Joi.object({
      print_barcode: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة الباركود يجب أن تكون قيمة منطقية'
      }),
      print_shipping_label: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة ملصق الشحن يجب أن تكون قيمة منطقية'
      }),
      print_packing_slip: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة قسيمة التعبئة يجب أن تكون قيمة منطقية'
      })
    }),
    report: Joi.object({
      print_page_numbers: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة أرقام الصفحات يجب أن تكون قيمة منطقية'
      }),
      print_date: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة التاريخ يجب أن تكون قيمة منطقية'
      }),
      print_header: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة الرأس يجب أن تكون قيمة منطقية'
      }),
      print_footer: Joi.boolean().default(true).messages({
        'boolean.base': 'طباعة التذييل يجب أن تكون قيمة منطقية'
      })
    }),
    custom_content: Joi.object({
      header: Joi.string().max(1000).allow(null, '').messages({
        'string.base': 'رأس مخصص يجب أن يكون نص',
        'string.max': 'رأس مخصص يجب أن يكون أقل من 1000 حرف'
      }),
      footer: Joi.string().max(1000).allow(null, '').messages({
        'string.base': 'تذييل مخصص يجب أن يكون نص',
        'string.max': 'تذييل مخصص يجب أن يكون أقل من 1000 حرف'
      }),
      terms: Joi.string().max(2000).allow(null, '').messages({
        'string.base': 'الشروط والأحكام يجب أن تكون نص',
        'string.max': 'الشروط والأحكام يجب أن تكون أقل من 2000 حرف'
      }),
      notes: Joi.string().max(1000).allow(null, '').messages({
        'string.base': 'الملاحظات يجب أن تكون نص',
        'string.max': 'الملاحظات يجب أن تكون أقل من 1000 حرف'
      })
    })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث إعدادات الطباعة
 */
export const updateVendorPrintSettingsSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف البائع يجب أن يكون رقم',
        'number.integer': 'معرف البائع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف البائع يجب أن يكون رقم موجب',
        'any.required': 'معرف البائع مطلوب'
      })
  }),
  body: Joi.object({
    general: Joi.object({
      paper_size: Joi.string()
        .valid('A4', 'A5', 'Letter', 'Legal')
        .messages({
          'string.base': 'حجم الورق يجب أن يكون نص',
          'any.only': 'حجم الورق يجب أن يكون إحدى القيم: A4, A5, Letter, Legal'
        }),
      orientation: Joi.string()
        .valid('portrait', 'landscape')
        .messages({
          'string.base': 'اتجاه الورق يجب أن يكون نص',
          'any.only': 'اتجاه الورق يجب أن يكون إحدى القيم: portrait, landscape'
        }),
      margin: Joi.object({
        top: Joi.number().min(0).messages({
          'number.base': 'الهامش العلوي يجب أن يكون رقم',
          'number.min': 'الهامش العلوي يجب أن يكون صفر أو أكثر'
        }),
        right: Joi.number().min(0).messages({
          'number.base': 'الهامش الأيمن يجب أن يكون رقم',
          'number.min': 'الهامش الأيمن يجب أن يكون صفر أو أكثر'
        }),
        bottom: Joi.number().min(0).messages({
          'number.base': 'الهامش السفلي يجب أن يكون رقم',
          'number.min': 'الهامش السفلي يجب أن يكون صفر أو أكثر'
        }),
        left: Joi.number().min(0).messages({
          'number.base': 'الهامش الأيسر يجب أن يكون رقم',
          'number.min': 'الهامش الأيسر يجب أن يكون صفر أو أكثر'
        })
      })
    }),
    invoice: Joi.object({
      print_logo: Joi.boolean().messages({
        'boolean.base': 'طباعة الشعار يجب أن تكون قيمة منطقية'
      }),
      print_company_info: Joi.boolean().messages({
        'boolean.base': 'طباعة معلومات الشركة يجب أن تكون قيمة منطقية'
      }),
      print_customer_info: Joi.boolean().messages({
        'boolean.base': 'طباعة معلومات العميل يجب أن تكون قيمة منطقية'
      }),
      print_item_details: Joi.boolean().messages({
        'boolean.base': 'طباعة تفاصيل الأصناف يجب أن تكون قيمة منطقية'
      }),
      print_tax_details: Joi.boolean().messages({
        'boolean.base': 'طباعة تفاصيل الضريبة يجب أن تكون قيمة منطقية'
      }),
      print_payment_info: Joi.boolean().messages({
        'boolean.base': 'طباعة معلومات الدفع يجب أن تكون قيمة منطقية'
      }),
      print_signature: Joi.boolean().messages({
        'boolean.base': 'طباعة التوقيع يجب أن تكون قيمة منطقية'
      }),
      footer_text: Joi.string().max(500).allow(null, '').messages({
        'string.base': 'نص التذييل يجب أن يكون نص',
        'string.max': 'نص التذييل يجب أن يكون أقل من 500 حرف'
      })
    }),
    order: Joi.object({
      print_barcode: Joi.boolean().messages({
        'boolean.base': 'طباعة الباركود يجب أن تكون قيمة منطقية'
      }),
      print_shipping_label: Joi.boolean().messages({
        'boolean.base': 'طباعة ملصق الشحن يجب أن تكون قيمة منطقية'
      }),
      print_packing_slip: Joi.boolean().messages({
        'boolean.base': 'طباعة قسيمة التعبئة يجب أن تكون قيمة منطقية'
      })
    }),
    report: Joi.object({
      print_page_numbers: Joi.boolean().messages({
        'boolean.base': 'طباعة أرقام الصفحات يجب أن تكون قيمة منطقية'
      }),
      print_date: Joi.boolean().messages({
        'boolean.base': 'طباعة التاريخ يجب أن تكون قيمة منطقية'
      }),
      print_header: Joi.boolean().messages({
        'boolean.base': 'طباعة الرأس يجب أن تكون قيمة منطقية'
      }),
      print_footer: Joi.boolean().messages({
        'boolean.base': 'طباعة التذييل يجب أن تكون قيمة منطقية'
      })
    }),
    custom_content: Joi.object({
      header: Joi.string().max(1000).allow(null, '').messages({
        'string.base': 'رأس مخصص يجب أن يكون نص',
        'string.max': 'رأس مخصص يجب أن يكون أقل من 1000 حرف'
      }),
      footer: Joi.string().max(1000).allow(null, '').messages({
        'string.base': 'تذييل مخصص يجب أن يكون نص',
        'string.max': 'تذييل مخصص يجب أن يكون أقل من 1000 حرف'
      }),
      terms: Joi.string().max(2000).allow(null, '').messages({
        'string.base': 'الشروط والأحكام يجب أن تكون نص',
        'string.max': 'الشروط والأحكام يجب أن تكون أقل من 2000 حرف'
      }),
      notes: Joi.string().max(1000).allow(null, '').messages({
        'string.base': 'الملاحظات يجب أن تكون نص',
        'string.max': 'الملاحظات يجب أن تكون أقل من 1000 حرف'
      })
    })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};