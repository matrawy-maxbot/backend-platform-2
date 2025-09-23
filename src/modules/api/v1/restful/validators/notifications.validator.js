import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات الإشعارات
 * @module NotificationsValidator
 */

/**
 * مخطط التحقق من معرف الإشعار
 */
export const getNotificationByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف الإشعار يجب أن يكون نص',
        'string.pattern.base': 'معرف الإشعار يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف الإشعار مطلوب'
      })
  })
};

/**
 * مخطط إنشاء إشعار جديد
 */
export const createNotificationSchema = {
  body: Joi.object({
    user_id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف المستخدم يجب أن يكون نص',
        'string.pattern.base': 'معرف المستخدم يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف المستخدم مطلوب'
      }),
    title: Joi.string()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.base': 'عنوان الإشعار يجب أن يكون نص',
        'string.empty': 'عنوان الإشعار لا يمكن أن يكون فارغ',
        'string.min': 'عنوان الإشعار يجب أن يكون حرف واحد على الأقل',
        'string.max': 'عنوان الإشعار يجب أن يكون أقل من 200 حرف',
        'any.required': 'عنوان الإشعار مطلوب'
      }),
    message: Joi.string()
      .min(1)
      .max(1000)
      .required()
      .messages({
        'string.base': 'رسالة الإشعار يجب أن تكون نص',
        'string.empty': 'رسالة الإشعار لا يمكن أن تكون فارغة',
        'string.min': 'رسالة الإشعار يجب أن تكون حرف واحد على الأقل',
        'string.max': 'رسالة الإشعار يجب أن تكون أقل من 1000 حرف',
        'any.required': 'رسالة الإشعار مطلوبة'
      }),
    type: Joi.string()
      .valid('info', 'warning', 'error', 'success', 'reminder')
      .default('info')
      .messages({
        'string.base': 'نوع الإشعار يجب أن يكون نص',
        'any.only': 'نوع الإشعار يجب أن يكون إحدى القيم: info, warning, error, success, reminder'
      }),
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .default('medium')
      .messages({
        'string.base': 'أولوية الإشعار يجب أن تكون نص',
        'any.only': 'أولوية الإشعار يجب أن تكون إحدى القيم: low, medium, high, urgent'
      }),
    is_read: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'حالة القراءة يجب أن تكون قيمة منطقية'
      }),
    action_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الإجراء يجب أن يكون نص',
        'string.uri': 'رابط الإجراء يجب أن يكون رابط صحيح'
      }),
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'البيانات الإضافية يجب أن تكون كائن'
      }),
    expires_at: Joi.date()
      .greater('now')
      .allow(null)
      .messages({
        'date.base': 'تاريخ انتهاء الصلاحية يجب أن يكون تاريخ صحيح',
        'date.greater': 'تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث الإشعار
 */
export const updateNotificationSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف الإشعار يجب أن يكون نص',
        'string.pattern.base': 'معرف الإشعار يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف الإشعار مطلوب'
      })
  }),
  body: Joi.object({
    title: Joi.string()
      .min(1)
      .max(200)
      .messages({
        'string.base': 'عنوان الإشعار يجب أن يكون نص',
        'string.empty': 'عنوان الإشعار لا يمكن أن يكون فارغ',
        'string.min': 'عنوان الإشعار يجب أن يكون حرف واحد على الأقل',
        'string.max': 'عنوان الإشعار يجب أن يكون أقل من 200 حرف'
      }),
    message: Joi.string()
      .min(1)
      .max(1000)
      .messages({
        'string.base': 'رسالة الإشعار يجب أن تكون نص',
        'string.empty': 'رسالة الإشعار لا يمكن أن تكون فارغة',
        'string.min': 'رسالة الإشعار يجب أن تكون حرف واحد على الأقل',
        'string.max': 'رسالة الإشعار يجب أن تكون أقل من 1000 حرف'
      }),
    type: Joi.string()
      .valid('info', 'warning', 'error', 'success', 'reminder')
      .messages({
        'string.base': 'نوع الإشعار يجب أن يكون نص',
        'any.only': 'نوع الإشعار يجب أن يكون إحدى القيم: info, warning, error, success, reminder'
      }),
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .messages({
        'string.base': 'أولوية الإشعار يجب أن تكون نص',
        'any.only': 'أولوية الإشعار يجب أن تكون إحدى القيم: low, medium, high, urgent'
      }),
    is_read: Joi.boolean()
      .messages({
        'boolean.base': 'حالة القراءة يجب أن تكون قيمة منطقية'
      }),
    action_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط الإجراء يجب أن يكون نص',
        'string.uri': 'رابط الإجراء يجب أن يكون رابط صحيح'
      }),
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'البيانات الإضافية يجب أن تكون كائن'
      }),
    expires_at: Joi.date()
      .greater('now')
      .allow(null)
      .messages({
        'date.base': 'تاريخ انتهاء الصلاحية يجب أن يكون تاريخ صحيح',
        'date.greater': 'تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};