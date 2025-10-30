import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لإدارة سجلات لوحة التحكم
 * Validation schemas for dashboard logs management data
 */

/**
 * مخطط التحقق من معرف سجل لوحة التحكم
 * Dashboard log ID validation schema
 */
export const getDashboardLogByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف سجل لوحة التحكم يجب أن يكون نصاً',
        'string.pattern.base': 'معرف سجل لوحة التحكم يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف سجل لوحة التحكم مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getDashboardLogsByServerIdSchema = {
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
 * مخطط التحقق من معرف المستخدم ومعرف الخادم
 * User ID and Server ID validation schema
 */
export const getDashboardLogsByUserIdSchema = {
  params: Joi.object({
    userId: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.base': 'يجب أن يكون معرف المستخدم نصاً',
        'string.pattern.base': 'معرف المستخدم يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف المستخدم لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف المستخدم يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف المستخدم يجب أن لا يزيد عن 50 حرف',
        'any.required': 'معرف المستخدم مطلوب'
      }),
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
 * مخطط التحقق من الميزة ومعرف الخادم
 * Feature and Server ID validation schema
 */
export const getDashboardLogsByFeatureSchema = {
  params: Joi.object({
    feature: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.base': 'اسم الميزة يجب أن يكون نصاً',
        'string.empty': 'اسم الميزة لا يمكن أن يكون فارغاً',
        'string.min': 'اسم الميزة يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'اسم الميزة لا يمكن أن يتجاوز 100 حرف',
        'any.required': 'اسم الميزة مطلوب'
      }),
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
 * مخطط التحقق من الإجراء ومعرف الخادم
 * Action and Server ID validation schema
 */
export const getDashboardLogsByActionSchema = {
  params: Joi.object({
    action: Joi.string()
      .valid('create', 'update', 'delete', 'enable', 'disable', 'activate', 'deactivate', 'configure', 'reset')
      .required()
      .messages({
        'string.base': 'نوع الإجراء يجب أن يكون نصاً',
        'any.only': 'نوع الإجراء يجب أن يكون أحد القيم التالية: create, update, delete, enable, disable, activate, deactivate, configure, reset',
        'any.required': 'نوع الإجراء مطلوب'
      }),
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
 * مخطط التحقق من إنشاء سجل لوحة تحكم جديد
 * Create dashboard log validation schema
 */
export const createDashboardLogSchema = {
  body: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.base': 'عنوان السجل يجب أن يكون نصاً',
        'string.empty': 'عنوان السجل لا يمكن أن يكون فارغاً',
        'string.min': 'عنوان السجل يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'عنوان السجل لا يمكن أن يتجاوز 200 حرف',
        'any.required': 'عنوان السجل مطلوب'
      }),

    description: Joi.string()
      .trim()
      .min(1)
      .max(1000)
      .required()
      .messages({
        'string.base': 'وصف السجل يجب أن يكون نصاً',
        'string.empty': 'وصف السجل لا يمكن أن يكون فارغاً',
        'string.min': 'وصف السجل يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'وصف السجل لا يمكن أن يتجاوز 1000 حرف',
        'any.required': 'وصف السجل مطلوب'
      }),

    feature: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.base': 'اسم الميزة يجب أن يكون نصاً',
        'string.empty': 'اسم الميزة لا يمكن أن يكون فارغاً',
        'string.min': 'اسم الميزة يجب أن يحتوي على حرف واحد على الأقل',
        'string.max': 'اسم الميزة لا يمكن أن يتجاوز 100 حرف',
        'any.required': 'اسم الميزة مطلوب'
      }),

    action: Joi.string()
      .valid('create', 'update', 'delete', 'enable', 'disable', 'activate', 'deactivate', 'configure', 'reset')
      .required()
      .messages({
        'string.base': 'نوع الإجراء يجب أن يكون نصاً',
        'any.only': 'نوع الإجراء يجب أن يكون أحد القيم التالية: create, update, delete, enable, disable, activate, deactivate, configure, reset',
        'any.required': 'نوع الإجراء مطلوب'
      }),

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

    user_id: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .allow(null)
      .default(null)
      .messages({
        'string.base': 'يجب أن يكون معرف المستخدم نصاً',
        'string.pattern.base': 'معرف المستخدم يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف المستخدم لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف المستخدم يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف المستخدم يجب أن لا يزيد عن 50 حرف'
      }),

    date: Joi.date()
      .default(Date.now)
      .messages({
        'date.base': 'تاريخ السجل يجب أن يكون تاريخاً صحيحاً'
      }),

    additional_data: Joi.object()
      .default({})
      .messages({
        'object.base': 'البيانات الإضافية يجب أن تكون كائناً'
      })
  })
};

/**
 * مخطط التحقق من حذف سجل لوحة التحكم
 * Delete dashboard log validation schema
 */
export const deleteDashboardLogSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف سجل لوحة التحكم يجب أن يكون نصاً',
        'string.pattern.base': 'معرف سجل لوحة التحكم يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف سجل لوحة التحكم مطلوب'
      })
  })
};

/**
 * مخطط التحقق من حذف سجلات لوحة التحكم بواسطة معرف الخادم
 * Delete dashboard logs by server ID validation schema
 */
export const deleteDashboardLogByServerIdSchema = {
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