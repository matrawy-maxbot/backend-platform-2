import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات المتاجر
 * @module VendorsValidator
 */

/**
 * مخطط التحقق من معرف المتجر
 */
export const getVendorByIdSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المتجر يجب أن يكون رقم',
        'number.integer': 'معرف المتجر يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المتجر يجب أن يكون رقم موجب',
        'any.required': 'معرف المتجر مطلوب'
      })
  })
};

/**
 * مخطط إنشاء متجر جديد
 */
export const createVendorSchema = {
  body: Joi.object({
    user_id: Joi.string()
      .min(12)
      .max(15)
      .required()
      .messages({
        'string.base': 'معرف المستخدم يجب أن يكون نص',
        'string.empty': 'معرف المستخدم لا يمكن أن يكون فارغ',
        'string.min': 'معرف المستخدم يجب أن يكون على الأقل 12 حرف',
        'string.max': 'معرف المستخدم يجب أن يكون أقل من 15 حرف',
        'any.required': 'معرف المستخدم مطلوب'
      }),
    business_name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        'string.base': 'اسم النشاط التجاري يجب أن يكون نص',
        'string.empty': 'اسم النشاط التجاري لا يمكن أن يكون فارغ',
        'string.min': 'اسم النشاط التجاري يجب أن يكون على الأقل حرفين',
        'string.max': 'اسم النشاط التجاري يجب أن يكون أقل من 255 حرف',
        'any.required': 'اسم النشاط التجاري مطلوب'
      }),
    business_email: Joi.string()
      .email()
      .max(255)
      .required()
      .messages({
        'string.base': 'البريد الإلكتروني للنشاط يجب أن يكون نص',
        'string.empty': 'البريد الإلكتروني للنشاط لا يمكن أن يكون فارغ',
        'string.email': 'البريد الإلكتروني للنشاط غير صحيح',
        'string.max': 'البريد الإلكتروني للنشاط يجب أن يكون أقل من 255 حرف',
        'any.required': 'البريد الإلكتروني للنشاط مطلوب'
      }),
    business_phone: Joi.string()
      .pattern(/^[0-9+\-\s()]{10,20}$/)
      .required()
      .messages({
        'string.base': 'رقم هاتف النشاط يجب أن يكون نص',
        'string.empty': 'رقم هاتف النشاط لا يمكن أن يكون فارغ',
        'string.pattern.base': 'رقم هاتف النشاط غير صحيح',
        'any.required': 'رقم هاتف النشاط مطلوب'
      }),
    business_logo_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط شعار النشاط يجب أن يكون نص',
        'string.uri': 'رابط شعار النشاط غير صحيح'
      }),
    business_description: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'وصف النشاط يجب أن يكون نص',
        'string.max': 'وصف النشاط يجب أن يكون أقل من 1000 حرف'
      }),
    status: Joi.string()
      .valid('pending', 'active', 'suspended', 'rejected')
      .default('pending')
      .messages({
        'string.base': 'حالة المتجر يجب أن تكون نص',
        'any.only': 'حالة المتجر يجب أن تكون إحدى القيم: pending, active, suspended, rejected'
      }),
    verification_status: Joi.string()
      .valid('unverified', 'verified', 'rejected')
      .default('unverified')
      .messages({
        'string.base': 'حالة التحقق يجب أن تكون نص',
        'any.only': 'حالة التحقق يجب أن تكون إحدى القيم: unverified, verified, rejected'
      }),
    approved_by: Joi.string()
      .min(12)
      .max(15)
      .allow(null, '')
      .messages({
        'string.base': 'معرف الموافق يجب أن يكون نص',
        'string.min': 'معرف الموافق يجب أن يكون على الأقل 12 حرف',
        'string.max': 'معرف الموافق يجب أن يكون أقل من 15 حرف'
      }),
    approved_at: Joi.date()
      .iso()
      .allow(null, '')
      .messages({
        'date.base': 'تاريخ الموافقة يجب أن يكون تاريخ صحيح',
        'date.format': 'تاريخ الموافقة يجب أن يكون بصيغة ISO'
      })
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث المتجر
 */
export const updateVendorSchema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'معرف المتجر يجب أن يكون رقم',
        'number.integer': 'معرف المتجر يجب أن يكون رقم صحيح',
        'number.positive': 'معرف المتجر يجب أن يكون رقم موجب',
        'any.required': 'معرف المتجر مطلوب'
      })
  }),
  body: Joi.object({
    business_name: Joi.string()
      .min(2)
      .max(255)
      .messages({
        'string.base': 'اسم النشاط التجاري يجب أن يكون نص',
        'string.empty': 'اسم النشاط التجاري لا يمكن أن يكون فارغ',
        'string.min': 'اسم النشاط التجاري يجب أن يكون على الأقل حرفين',
        'string.max': 'اسم النشاط التجاري يجب أن يكون أقل من 255 حرف'
      }),
    business_email: Joi.string()
      .email()
      .max(255)
      .messages({
        'string.base': 'البريد الإلكتروني للنشاط يجب أن يكون نص',
        'string.empty': 'البريد الإلكتروني للنشاط لا يمكن أن يكون فارغ',
        'string.email': 'البريد الإلكتروني للنشاط غير صحيح',
        'string.max': 'البريد الإلكتروني للنشاط يجب أن يكون أقل من 255 حرف'
      }),
    business_phone: Joi.string()
      .pattern(/^[0-9+\-\s()]{10,20}$/)
      .messages({
        'string.base': 'رقم هاتف النشاط يجب أن يكون نص',
        'string.empty': 'رقم هاتف النشاط لا يمكن أن يكون فارغ',
        'string.pattern.base': 'رقم هاتف النشاط غير صحيح'
      }),
    business_logo_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.base': 'رابط شعار النشاط يجب أن يكون نص',
        'string.uri': 'رابط شعار النشاط غير صحيح'
      }),
    business_description: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'وصف النشاط يجب أن يكون نص',
        'string.max': 'وصف النشاط يجب أن يكون أقل من 1000 حرف'
      }),
    status: Joi.string()
      .valid('pending', 'active', 'suspended', 'rejected')
      .messages({
        'string.base': 'حالة المتجر يجب أن تكون نص',
        'any.only': 'حالة المتجر يجب أن تكون إحدى القيم: pending, active, suspended, rejected'
      }),
    verification_status: Joi.string()
      .valid('unverified', 'verified', 'rejected')
      .messages({
        'string.base': 'حالة التحقق يجب أن تكون نص',
        'any.only': 'حالة التحقق يجب أن تكون إحدى القيم: unverified, verified, rejected'
      }),
    approved_by: Joi.string()
      .min(12)
      .max(15)
      .allow(null, '')
      .messages({
        'string.base': 'معرف الموافق يجب أن يكون نص',
        'string.min': 'معرف الموافق يجب أن يكون على الأقل 12 حرف',
        'string.max': 'معرف الموافق يجب أن يكون أقل من 15 حرف'
      }),
    approved_at: Joi.date()
      .iso()
      .allow(null, '')
      .messages({
        'date.base': 'تاريخ الموافقة يجب أن يكون تاريخ صحيح',
        'date.format': 'تاريخ الموافقة يجب أن يكون بصيغة ISO'
      })
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};