import Joi from 'joi';

/**
 * مخططات التحقق من صحة بيانات النسخ الاحتياطية للبائعين
 * @module VendorBackupsValidator
 */

/**
 * مخطط التحقق من معرف النسخة الاحتياطية
 */
export const getVendorBackupByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف النسخة الاحتياطية يجب أن يكون نص',
        'string.pattern.base': 'معرف النسخة الاحتياطية يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف النسخة الاحتياطية مطلوب'
      })
  })
};

/**
 * مخطط التحقق من معرف البائع
 */
export const getVendorBackupsSchema = {
  params: Joi.object({
    vendor_id: Joi.number()
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
 * مخطط إنشاء نسخة احتياطية جديدة
 */
export const createVendorBackupSchema = {
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
    backup_name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.base': 'اسم النسخة الاحتياطية يجب أن يكون نص',
        'string.empty': 'اسم النسخة الاحتياطية لا يمكن أن يكون فارغ',
        'string.min': 'اسم النسخة الاحتياطية يجب أن يكون 3 أحرف على الأقل',
        'string.max': 'اسم النسخة الاحتياطية يجب أن يكون أقل من 100 حرف',
        'any.required': 'اسم النسخة الاحتياطية مطلوب'
      }),
    backup_type: Joi.string()
      .valid('auto', 'manual', 'system')
      .default('manual')
      .messages({
        'string.base': 'نوع النسخة الاحتياطية يجب أن يكون نص',
        'any.only': 'نوع النسخة الاحتياطية يجب أن يكون إحدى القيم: auto, manual, system'
      }),
    backup_scope: Joi.string()
      .valid('full', 'partial', 'database', 'files')
      .default('full')
      .messages({
        'string.base': 'نطاق النسخة الاحتياطية يجب أن يكون نص',
        'any.only': 'نطاق النسخة الاحتياطية يجب أن يكون إحدى القيم: full, partial, database, files'
      }),
    file_path: Joi.string()
      .min(5)
      .max(500)
      .required()
      .messages({
        'string.base': 'مسار الملف يجب أن يكون نص',
        'string.empty': 'مسار الملف لا يمكن أن يكون فارغ',
        'string.min': 'مسار الملف يجب أن يكون 5 أحرف على الأقل',
        'string.max': 'مسار الملف يجب أن يكون أقل من 500 حرف',
        'any.required': 'مسار الملف مطلوب'
      }),
    file_size: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'حجم الملف يجب أن يكون رقم',
        'number.integer': 'حجم الملف يجب أن يكون رقم صحيح',
        'number.min': 'حجم الملف يجب أن يكون صفر أو أكثر'
      }),
    compression_type: Joi.string()
      .valid('zip', 'tar', 'gzip', 'none')
      .default('zip')
      .messages({
        'string.base': 'نوع الضغط يجب أن يكون نص',
        'any.only': 'نوع الضغط يجب أن يكون إحدى القيم: zip, tar, gzip, none'
      }),
    encryption: Joi.object({
      enabled: Joi.boolean().default(false),
      method: Joi.string().when('enabled', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional()
      })
    }).default({ enabled: false }),
    included_tables: Joi.array()
      .items(Joi.string())
      .messages({
        'array.base': 'الجداول المضمنة يجب أن تكون مصفوفة من النصوص'
      }),
    excluded_tables: Joi.array()
      .items(Joi.string())
      .messages({
        'array.base': 'الجداول المستبعدة يجب أن تكون مصفوفة من النصوص'
      }),
    metadata: Joi.object().unknown(true)
  }).messages({
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};

/**
 * مخطط تحديث النسخة الاحتياطية
 */
export const updateVendorBackupSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.base': 'معرف النسخة الاحتياطية يجب أن يكون نص',
        'string.pattern.base': 'معرف النسخة الاحتياطية يجب أن يكون معرف MongoDB صحيح',
        'any.required': 'معرف النسخة الاحتياطية مطلوب'
      })
  }),
  body: Joi.object({
    backup_name: Joi.string()
      .min(3)
      .max(100)
      .messages({
        'string.base': 'اسم النسخة الاحتياطية يجب أن يكون نص',
        'string.empty': 'اسم النسخة الاحتياطية لا يمكن أن يكون فارغ',
        'string.min': 'اسم النسخة الاحتياطية يجب أن يكون 3 أحرف على الأقل',
        'string.max': 'اسم النسخة الاحتياطية يجب أن يكون أقل من 100 حرف'
      }),
    status: Joi.string()
      .valid('pending', 'in_progress', 'completed', 'failed', 'deleted')
      .messages({
        'string.base': 'حالة النسخة الاحتياطية يجب أن تكون نص',
        'any.only': 'حالة النسخة الاحتياطية يجب أن تكون إحدى القيم: pending, in_progress, completed, failed, deleted'
      }),
    file_size: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'حجم الملف يجب أن يكون رقم',
        'number.integer': 'حجم الملف يجب أن يكون رقم صحيح',
        'number.min': 'حجم الملف يجب أن يكون صفر أو أكثر'
      }),
    checksum: Joi.string()
      .messages({
        'string.base': 'المجموع التحققي يجب أن يكون نص'
      }),
    error_message: Joi.string()
      .max(1000)
      .allow(null, '')
      .messages({
        'string.base': 'رسالة الخطأ يجب أن تكون نص',
        'string.max': 'رسالة الخطأ يجب أن تكون أقل من 1000 حرف'
      }),
    metadata: Joi.object().unknown(true)
  }).min(1).messages({
    'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
    'object.unknown': 'حقل غير مسموح: {#label}'
  })
};