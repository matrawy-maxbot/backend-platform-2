import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات تاريخ حالة الطلبات
 * @module OrderStatusHistoryValidator
 */

/**
 * مخطط التحقق من معرف سجل تاريخ حالة الطلب
 */
export const getOrderStatusHistoryByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف سجل تاريخ حالة الطلب يجب أن يكون نص',
        'string.pattern.base': 'معرف سجل تاريخ حالة الطلب يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف سجل تاريخ حالة الطلب مطلوب'
      })
  })
};

/**
 * مخطط إنشاء سجل تاريخ حالة طلب جديد
 */
export const createOrderStatusHistorySchema = {
  body: Joi.object({
    order_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الطلب يجب أن يكون رقم',
        'number.integer': 'معرف الطلب يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الطلب يجب أن يكون رقم موجب',
        'any.required': 'معرف الطلب مطلوب'
      }),
    previous_status: Joi.string()
      .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
      .allow(null)
      .messages({
        'string.base': 'الحالة السابقة يجب أن تكون نص',
        'any.only': 'الحالة السابقة يجب أن تكون إحدى القيم: pending, confirmed, shipped, delivered, cancelled'
      }),
    new_status: Joi.string()
      .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
      .required()
      .messages({
        'string.base': 'الحالة الجديدة يجب أن تكون نص',
        'any.only': 'الحالة الجديدة يجب أن تكون إحدى القيم: pending, confirmed, shipped, delivered, cancelled',
        'any.required': 'الحالة الجديدة مطلوبة'
      }),
    changed_by: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المستخدم الذي غير الحالة يجب أن يكون رقم',
        'number.integer': 'معرف المستخدم الذي غير الحالة يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المستخدم الذي غير الحالة يجب أن يكون رقم موجب',
        'any.required': 'معرف المستخدم الذي غير الحالة مطلوب'
      }),
    change_reason: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'سبب التغيير يجب أن يكون نص',
        'string.max': 'سبب التغيير يجب أن يكون أقل من 500 حرف'
      }),
    notes: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'ملاحظات التغيير يجب أن تكون نص',
        'string.max': 'ملاحظات التغيير يجب أن تكون أقل من 1000 حرف'
      }),
    changed_at: Joi.date()
      .default(() => new Date())
      .messages({
        'date.base': 'تاريخ التغيير يجب أن يكون تاريخ صحيح'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث سجل تاريخ حالة الطلب
 */
export const updateOrderStatusHistorySchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف سجل تاريخ حالة الطلب يجب أن يكون نص',
        'string.pattern.base': 'معرف سجل تاريخ حالة الطلب يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف سجل تاريخ حالة الطلب مطلوب'
      })
  }),
  body: Joi.object({
    previous_status: Joi.string()
      .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
      .allow(null)
      .messages({
        'string.base': 'الحالة السابقة يجب أن تكون نص',
        'any.only': 'الحالة السابقة يجب أن تكون إحدى القيم: pending, confirmed, shipped, delivered, cancelled'
      }),
    new_status: Joi.string()
      .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
      .messages({
        'string.base': 'الحالة الجديدة يجب أن تكون نص',
        'any.only': 'الحالة الجديدة يجب أن تكون إحدى القيم: pending, confirmed, shipped, delivered, cancelled'
      }),
    changed_by: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'معرف المستخدم الذي غير الحالة يجب أن يكون رقم',
        'number.integer': 'معرف المستخدم الذي غير الحالة يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المستخدم الذي غير الحالة يجب أن يكون رقم موجب'
      }),
    change_reason: Joi.string()
      .max(500)
      .allow(null, '')
      .messages({
        'string.base': 'سبب التغيير يجب أن يكون نص',
        'string.max': 'سبب التغيير يجب أن يكون أقل من 500 حرف'
      }),
    notes: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'ملاحظات التغيير يجب أن تكون نص',
        'string.max': 'ملاحظات التغيير يجب أن تكون أقل من 1000 حرف'
      }),
    changed_at: Joi.date()
      .messages({
        'date.base': 'تاريخ التغيير يجب أن يكون تاريخ صحيح'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};