import Joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لإدارة المشرفين
 * Validation schemas for admins management data
 */

/**
 * مخطط التحقق من معرف المشرف
 * Admin ID validation schema
 */
export const getAdminByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المشرف يجب أن يكون رقماً',
        'number.integer': 'معرف المشرف يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف المشرف يجب أن يكون رقماً موجباً',
        'any.required': 'معرف المشرف مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف الخادم
 * Server ID validation schema
 */
export const getAdminsByServerIdSchema = {
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
 * مخطط التحقق من إنشاء مشرف جديد
 * Create admin validation schema
 */
export const createAdminSchema = {
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

    admin_id: Joi.string()
      .pattern(/^\d+$/)
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.base': 'يجب أن يكون معرف المشرف في Discord نصاً',
        'string.pattern.base': 'معرف المشرف في Discord يجب أن يحتوي على أرقام فقط',
        'string.trim': 'معرف المشرف في Discord لا يمكن أن يحتوي على أحرف إضافية',
        'string.min': 'معرف المشرف في Discord يجب أن يكون على الأقل حرف واحد على الأقل',
        'string.max': 'معرف المشرف في Discord يجب أن لا يزيد عن 50 حرف',
        'any.required': 'معرف المشرف في Discord مطلوب'
      })
  })
};

// /**
//  * مخطط التحقق من تحديث المشرف
//  * Update admin validation schema
//  */
// export const updateAdminSchema = {
//   params: Joi.object({
//     id: Joi.number()
//       .integer()
//       .positive()
//       .required()
//       .messages({
//         'number.base': 'معرف المشرف يجب أن يكون رقماً',
//         'number.integer': 'معرف المشرف يجب أن يكون رقماً صحيحاً',
//         'number.positive': 'معرف المشرف يجب أن يكون رقماً موجباً',
//         'any.required': 'معرف المشرف مطلوب'
//       })
//   }),

//   body: Joi.object({
//     // ملاحظة: لا يمكن تحديث server_id أو admin_id حسب منطق الخدمة
//     // Note: server_id and admin_id cannot be updated according to service logic
//   }).min(1).messages({
//     'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
//   })
// };

/**
 * مخطط التحقق من حذف المشرف
 * Delete admin validation schema
 */
export const deleteAdminSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المشرف يجب أن يكون رقماً',
        'number.integer': 'معرف المشرف يجب أن يكون رقماً صحيحاً',
        'number.positive': 'معرف المشرف يجب أن يكون رقماً موجباً',
        'any.required': 'معرف المشرف مطلوب'
      })
  })
};