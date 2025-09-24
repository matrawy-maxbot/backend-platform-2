import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات أنشطة المستخدمين
 * @module UserActivityValidator
 */

/**
 * مخطط التحقق من معرف نشاط المستخدم
 */
export const getUserActivityByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .length(18)
      .required()
      .messages({
        'string.base': 'معرف نشاط المستخدم يجب أن يكون نص',
        'string.length': 'معرف نشاط المستخدم يجب أن يكون 18 حرف',
        'any.required': 'معرف نشاط المستخدم مطلوب'
      })
  })
};

/**
 * مخطط إنشاء نشاط مستخدم جديد
 */
export const createUserActivitySchema = {
  body: Joi.object({
    user_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المستخدم يجب أن يكون رقم',
        'number.integer': 'معرف المستخدم يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المستخدم يجب أن يكون رقم موجب',
        'any.required': 'معرف المستخدم مطلوب'
      }),
    user_type: Joi.string()
      .valid('customer', 'vendor', 'admin', 'guest')
      .default('customer')
      .messages({
        'string.base': 'نوع المستخدم يجب أن يكون نص',
        'any.only': 'نوع المستخدم يجب أن يكون إحدى القيم: customer, vendor, admin, guest'
      }),
    activity_type: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.base': 'نوع النشاط يجب أن يكون نص',
        'string.empty': 'نوع النشاط لا يمكن أن يكون فارغ',
        'string.max': 'نوع النشاط يجب أن يكون أقل من 100 حرف',
        'any.required': 'نوع النشاط مطلوب'
      }),
    activity_description: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'وصف النشاط يجب أن يكون نص',
        'string.max': 'وصف النشاط يجب أن يكون أقل من 500 حرف'
      }),
    ip_address: Joi.string()
      .ip()
      .allow(null, '')
      .messages({
        'string.base': 'عنوان IP يجب أن يكون نص',
        'string.ip': 'عنوان IP غير صحيح'
      }),
    duration: Joi.number()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'مدة النشاط يجب أن تكون رقم',
        'number.min': 'مدة النشاط يجب أن تكون صفر أو أكثر'
      }),
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'البيانات الإضافية يجب أن تكون كائن'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث نشاط المستخدم
 */
export const updateUserActivitySchema = {
  params: Joi.object({
    id: Joi.string()
      .length(18)
      .required()
      .messages({
        'string.base': 'معرف نشاط المستخدم يجب أن يكون نص',
        'string.length': 'معرف نشاط المستخدم يجب أن يكون 18 حرف',
        'any.required': 'معرف نشاط المستخدم مطلوب'
      })
  }),
  body: Joi.object({
    user_type: Joi.string()
      .valid('customer', 'vendor', 'admin', 'guest')
      .messages({
        'string.base': 'نوع المستخدم يجب أن يكون نص',
        'any.only': 'نوع المستخدم يجب أن يكون إحدى القيم: customer, vendor, admin, guest'
      }),
    activity_type: Joi.string()
      .max(100)
      .messages({
        'string.base': 'نوع النشاط يجب أن يكون نص',
        'string.empty': 'نوع النشاط لا يمكن أن يكون فارغ',
        'string.max': 'نوع النشاط يجب أن يكون أقل من 100 حرف'
      }),
    activity_description: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'وصف النشاط يجب أن يكون نص',
        'string.max': 'وصف النشاط يجب أن يكون أقل من 500 حرف'
      }),
    ip_address: Joi.string()
      .ip()
      .allow(null, '')
      .messages({
        'string.base': 'عنوان IP يجب أن يكون نص',
        'string.ip': 'عنوان IP غير صحيح'
      }),
    duration: Joi.number()
      .min(0)
      .messages({
        'number.base': 'مدة النشاط يجب أن تكون رقم',
        'number.min': 'مدة النشاط يجب أن تكون صفر أو أكثر'
      }),
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'البيانات الإضافية يجب أن تكون كائن'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};