import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات موظفي المواقع
 * @module StaffUsersValidator
 */

/**
 * مخطط التحقق من معرف موظف الموقع
 */
export const getStaffUserByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف موظف الموقع يجب أن يكون رقم',
        'number.integer': 'معرف موظف الموقع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف موظف الموقع يجب أن يكون رقم موجب',
        'any.required': 'معرف موظف الموقع مطلوب'
      })
  })
};

/**
 * مخطط إنشاء موظف موقع جديد
 */
export const createStaffUserSchema = {
  body: Joi.object({
    site_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف الموقع يجب أن يكون رقم',
        'number.integer': 'معرف الموقع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الموقع يجب أن يكون رقم موجب',
        'any.required': 'معرف الموقع مطلوب'
      }),
    user_id: Joi.string()
      .length(15)
      .required()
      .messages({
        'string.base': 'معرف المستخدم يجب أن يكون نص',
        'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغ',
        'string.length': 'معرف المستخدم يجب أن يكون 15 حرف بالضبط',
        'any.required': 'معرف المستخدم مطلوب'
      }),
    role_id: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'معرف الدور يجب أن يكون رقم',
        'number.integer': 'معرف الدور يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الدور يجب أن يكون رقم موجب'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث موظف الموقع
 */
export const updateStaffUserSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف موظف الموقع يجب أن يكون رقم',
        'number.integer': 'معرف موظف الموقع يجب أن يكون رقم صحيح',
        'number.positive': 'معرف موظف الموقع يجب أن يكون رقم موجب',
        'any.required': 'معرف موظف الموقع مطلوب'
      })
  }),
  body: Joi.object({
    role_id: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'معرف الدور يجب أن يكون رقم',
        'number.integer': 'معرف الدور يجب أن يكون رقم صحيح',
        'number.positive': 'معرف الدور يجب أن يكون رقم موجب'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};