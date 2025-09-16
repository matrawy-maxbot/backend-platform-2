import joi from 'joi';

/**
 * مخططات التحقق من صحة البيانات لوحدة كتم الصوت
 * @module DeafenValidator
 */

// مخطط التحقق من المعرف
const idSchema = joi.string().required().messages({
  'string.base': 'المعرف يجب أن يكون نص',
  'string.empty': 'المعرف مطلوب',
  'any.required': 'المعرف مطلوب'
});

// مخطط التحقق من بيانات كتم الصوت
const deafensDataSchema = joi.string().allow('', null).messages({
  'string.base': 'بيانات كتم الصوت يجب أن تكون نص'
});

// مخطط التحقق من معرف المستخدم
const userIdSchema = joi.string().required().messages({
  'string.base': 'معرف المستخدم يجب أن يكون نص',
  'string.empty': 'معرف المستخدم مطلوب',
  'any.required': 'معرف المستخدم مطلوب'
});

// مخطط التحقق من الحد الأقصى
const limitSchema = joi.number().integer().min(1).max(1000).default(10).messages({
  'number.base': 'الحد الأقصى يجب أن يكون رقم',
  'number.integer': 'الحد الأقصى يجب أن يكون رقم صحيح',
  'number.min': 'الحد الأقصى يجب أن يكون أكبر من 0',
  'number.max': 'الحد الأقصى يجب أن يكون أقل من أو يساوي 1000'
});

// مخطط التحقق من الإزاحة
const offsetSchema = joi.number().integer().min(0).default(0).messages({
  'number.base': 'الإزاحة يجب أن تكون رقم',
  'number.integer': 'الإزاحة يجب أن تكون رقم صحيح',
  'number.min': 'الإزاحة يجب أن تكون أكبر من أو تساوي 0'
});

// مخطط التحقق من مصطلح البحث
const searchTermSchema = joi.string().min(1).max(255).required().messages({
  'string.base': 'مصطلح البحث يجب أن يكون نص',
  'string.empty': 'مصطلح البحث مطلوب',
  'string.min': 'مصطلح البحث يجب أن يكون على الأقل حرف واحد',
  'string.max': 'مصطلح البحث يجب أن يكون أقل من 255 حرف',
  'any.required': 'مصطلح البحث مطلوب'
});

// مخطط التحقق من الفاصل
const separatorSchema = joi.string().max(10).default(',').messages({
  'string.base': 'الفاصل يجب أن يكون نص',
  'string.max': 'الفاصل يجب أن يكون أقل من 10 أحرف'
});

// مخطط التحقق من البيانات الجديدة
const newDataSchema = joi.string().required().messages({
  'string.base': 'البيانات الجديدة يجب أن تكون نص',
  'string.empty': 'البيانات الجديدة مطلوبة',
  'any.required': 'البيانات الجديدة مطلوبة'
});

// مخطط التحقق من معرف المصدر
const sourceIdSchema = joi.string().required().messages({
  'string.base': 'معرف المصدر يجب أن يكون نص',
  'string.empty': 'معرف المصدر مطلوب',
  'any.required': 'معرف المصدر مطلوب'
});

// مخطط التحقق من معرف الهدف
const targetIdSchema = joi.string().required().messages({
  'string.base': 'معرف الهدف يجب أن يكون نص',
  'string.empty': 'معرف الهدف مطلوب',
  'any.required': 'معرف الهدف مطلوب'
});

// مخطط التحقق من مصفوفة السجلات للاستيراد
const deafensArraySchema = joi.array().items(
  joi.object({
    id: idSchema,
    deafens_data: deafensDataSchema
  })
).min(1).required().messages({
  'array.base': 'السجلات يجب أن تكون مصفوفة',
  'array.min': 'يجب أن تحتوي على سجل واحد على الأقل',
  'any.required': 'السجلات مطلوبة'
});

/**
 * مخطط إنشاء سجل كتم صوت جديد
 */
export const createDeafenSchema = joi.object({
  id: idSchema,
  deafens_data: deafensDataSchema
}).messages({
  'object.base': 'البيانات يجب أن تكون كائن صالح'
});

/**
 * مخطط إنشاء سجل كتم صوت للمستخدم
 */
export const createUserDeafenSchema = joi.object({
  userId: userIdSchema,
  deafensData: deafensDataSchema
}).messages({
  'object.base': 'البيانات يجب أن تكون كائن صالح'
});

/**
 * مخطط الحصول على جميع السجلات
 */
export const getAllDeafensSchema = joi.object({
  limit: limitSchema,
  offset: offsetSchema
}).messages({
  'object.base': 'معاملات الاستعلام يجب أن تكون صالحة'
});

/**
 * مخطط الحصول على سجل بواسطة المعرف
 */
export const getDeafenByIdSchema = joi.object({
  id: idSchema
}).messages({
  'object.base': 'المعرف يجب أن يكون صالح'
});

/**
 * مخطط البحث في السجلات
 */
export const searchDeafensSchema = joi.object({
  searchTerm: searchTermSchema,
  limit: limitSchema,
  offset: offsetSchema
}).messages({
  'object.base': 'معاملات البحث يجب أن تكون صالحة'
});

/**
 * مخطط الحصول على السجلات مع البيانات
 */
export const getDeafensWithDataSchema = joi.object({
  limit: limitSchema,
  offset: offsetSchema
}).messages({
  'object.base': 'معاملات الاستعلام يجب أن تكون صالحة'
});

/**
 * مخطط الحصول على السجلات الفارغة
 */
export const getEmptyDeafensSchema = joi.object({
  limit: limitSchema,
  offset: offsetSchema
}).messages({
  'object.base': 'معاملات الاستعلام يجب أن تكون صالحة'
});

/**
 * مخطط الحصول على السجلات الحديثة
 */
export const getRecentDeafensSchema = joi.object({
  limit: limitSchema,
  offset: offsetSchema
}).messages({
  'object.base': 'معاملات الاستعلام يجب أن تكون صالحة'
});

/**
 * مخطط تحديث سجل كتم الصوت
 */
export const updateDeafenSchema = joi.object({
  id: idSchema,
  deafens_data: deafensDataSchema
}).messages({
  'object.base': 'البيانات يجب أن تكون كائن صالح'
});

/**
 * مخطط تحديث بيانات كتم الصوت
 */
export const updateDeafensDataSchema = joi.object({
  deafensData: deafensDataSchema
}).messages({
  'object.base': 'البيانات يجب أن تكون كائن صالح'
});

/**
 * مخطط إضافة بيانات إلى كتم الصوت
 */
export const appendDeafensDataSchema = joi.object({
  newData: newDataSchema,
  separator: separatorSchema
}).messages({
  'object.base': 'البيانات يجب أن تكون كائن صالح'
});

/**
 * مخطط مسح بيانات كتم الصوت
 */
export const clearDeafensDataSchema = joi.object({
  id: idSchema
}).messages({
  'object.base': 'المعرف يجب أن يكون صالح'
});

/**
 * مخطط حذف سجل كتم الصوت
 */
export const deleteDeafenSchema = joi.object({
  id: idSchema
}).messages({
  'object.base': 'المعرف يجب أن يكون صالح'
});

/**
 * مخطط التحقق من وجود السجل
 */
export const deafenExistsSchema = joi.object({
  id: idSchema
}).messages({
  'object.base': 'المعرف يجب أن يكون صالح'
});

/**
 * مخطط التحقق من وجود البيانات
 */
export const hasDeafensDataSchema = joi.object({
  id: idSchema
}).messages({
  'object.base': 'المعرف يجب أن يكون صالح'
});

/**
 * مخطط الحصول على طول البيانات
 */
export const getDeafensDataLengthSchema = joi.object({
  id: idSchema
}).messages({
  'object.base': 'المعرف يجب أن يكون صالح'
});

/**
 * مخطط تحليل البيانات
 */
export const parseDeafensDataSchema = joi.object({
  id: idSchema,
  separator: separatorSchema
}).messages({
  'object.base': 'المعاملات يجب أن تكون صالحة'
});

/**
 * مخطط إنشاء أو تحديث السجل
 */
export const upsertDeafenSchema = joi.object({
  id: idSchema,
  deafensData: deafensDataSchema
}).messages({
  'object.base': 'البيانات يجب أن تكون كائن صالح'
});

/**
 * مخطط نسخ السجل
 */
export const copyDeafenSchema = joi.object({
  sourceId: sourceIdSchema,
  targetId: targetIdSchema
}).messages({
  'object.base': 'البيانات يجب أن تكون كائن صالح'
});

/**
 * مخطط استيراد السجلات
 */
export const importDeafensSchema = joi.object({
  deafens: deafensArraySchema
}).messages({
  'object.base': 'البيانات يجب أن تكون كائن صالح'
});

/**
 * مخططات التحقق من معاملات المسار
 */
export const paramIdSchema = joi.object({
  id: idSchema
}).messages({
  'object.base': 'معاملات المسار يجب أن تكون صالحة'
});

/**
 * مخططات التحقق من معاملات الاستعلام العامة
 */
export const queryParamsSchema = joi.object({
  limit: limitSchema,
  offset: offsetSchema,
  searchTerm: joi.string().optional(),
  separator: separatorSchema
}).messages({
  'object.base': 'معاملات الاستعلام يجب أن تكون صالحة'
});

export default {
  createDeafenSchema,
  createUserDeafenSchema,
  getAllDeafensSchema,
  getDeafenByIdSchema,
  searchDeafensSchema,
  getDeafensWithDataSchema,
  getEmptyDeafensSchema,
  getRecentDeafensSchema,
  updateDeafenSchema,
  updateDeafensDataSchema,
  appendDeafensDataSchema,
  clearDeafensDataSchema,
  deleteDeafenSchema,
  deafenExistsSchema,
  hasDeafensDataSchema,
  getDeafensDataLengthSchema,
  parseDeafensDataSchema,
  upsertDeafenSchema,
  copyDeafenSchema,
  importDeafensSchema,
  paramIdSchema,
  queryParamsSchema
};