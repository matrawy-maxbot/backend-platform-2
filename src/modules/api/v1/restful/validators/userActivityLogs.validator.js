// import Joi from 'joi';

// /**
//  * مخططات التحقق من صحة بيانات سجلات نشاط المستخدمين
//  * @module UserActivityLogsValidator
//  */

// /**
//  * مخطط التحقق من معرف سجل نشاط المستخدم
//  */
// export const getUserActivityLogByIdSchema = {
//   params: Joi.object({
//     id: Joi.string()
//       .pattern(/^[0-9a-fA-F]{24}$/)
//       .required()
//       .messages({
//         'string.base': 'معرف سجل نشاط المستخدم يجب أن يكون نص',
//         'string.pattern.base': 'معرف سجل نشاط المستخدم يجب أن يكون معرف MongoDB صحيح',
//         'any.required': 'معرف سجل نشاط المستخدم مطلوب'
//       })
//   })
// };

// /**
//  * مخطط إنشاء سجل نشاط مستخدم جديد
//  */
// export const createUserActivityLogSchema = {
//   body: Joi.object({
//     user_id: Joi.string()
//       .pattern(/^[0-9a-fA-F]{24}$/)
//       .required()
//       .messages({
//         'string.base': 'معرف المستخدم يجب أن يكون نص',
//         'string.pattern.base': 'معرف المستخدم يجب أن يكون معرف MongoDB صحيح',
//         'any.required': 'معرف المستخدم مطلوب'
//       }),
//     activity_type: Joi.string()
//       .valid('login', 'logout', 'create', 'update', 'delete', 'view', 'search', 'download', 'upload', 'other')
//       .required()
//       .messages({
//         'string.base': 'نوع النشاط يجب أن يكون نص',
//         'any.only': 'نوع النشاط يجب أن يكون إحدى القيم: login, logout, create, update, delete, view, search, download, upload, other',
//         'any.required': 'نوع النشاط مطلوب'
//       }),
//     description: Joi.string()
//       .max(1000)
//       .required()
//       .messages({
//         'string.base': 'وصف النشاط يجب أن يكون نص',
//         'string.empty': 'وصف النشاط لا يمكن أن يكون فارغ',
//         'string.max': 'وصف النشاط يجب أن يكون أقل من 1000 حرف',
//         'any.required': 'وصف النشاط مطلوب'
//       }),
//     ip_address: Joi.string()
//       .ip()
//       .allow(null, '')
//       .messages({
//         'string.base': 'عنوان IP يجب أن يكون نص',
//         'string.ip': 'عنوان IP يجب أن يكون عنوان IP صحيح'
//       }),
//     user_agent: Joi.string()
//       .max(500)
//       .allow(null, '')
//       .messages({
//         'string.base': 'معلومات المتصفح يجب أن تكون نص',
//         'string.max': 'معلومات المتصفح يجب أن تكون أقل من 500 حرف'
//       }),
//     related_entity: Joi.string()
//       .max(100)
//       .allow(null, '')
//       .messages({
//         'string.base': 'الكيان المرتبط يجب أن يكون نص',
//         'string.max': 'الكيان المرتبط يجب أن يكون أقل من 100 حرف'
//       }),
//     related_entity_id: Joi.string()
//       .max(100)
//       .allow(null, '')
//       .messages({
//         'string.base': 'معرف الكيان المرتبط يجب أن يكون نص',
//         'string.max': 'معرف الكيان المرتبط يجب أن يكون أقل من 100 حرف'
//       }),
//     metadata: Joi.object()
//       .allow(null)
//       .messages({
//         'object.base': 'البيانات الإضافية يجب أن تكون كائن'
//       })
//   }).messages({
//     'object.unknown': 'حقل غير مسموح: {#label}'
//   })
// };

// /**
//  * مخطط تحديث سجل نشاط المستخدم
//  */
// export const updateUserActivityLogSchema = {
//   params: Joi.object({
//     id: Joi.string()
//       .pattern(/^[0-9a-fA-F]{24}$/)
//       .required()
//       .messages({
//         'string.base': 'معرف سجل نشاط المستخدم يجب أن يكون نص',
//         'string.pattern.base': 'معرف سجل نشاط المستخدم يجب أن يكون معرف MongoDB صحيح',
//         'any.required': 'معرف سجل نشاط المستخدم مطلوب'
//       })
//   }),
//   body: Joi.object({
//     activity_type: Joi.string()
//       .valid('login', 'logout', 'create', 'update', 'delete', 'view', 'search', 'download', 'upload', 'other')
//       .messages({
//         'string.base': 'نوع النشاط يجب أن يكون نص',
//         'any.only': 'نوع النشاط يجب أن يكون إحدى القيم: login, logout, create, update, delete, view, search, download, upload, other'
//       }),
//     description: Joi.string()
//       .max(1000)
//       .messages({
//         'string.base': 'وصف النشاط يجب أن يكون نص',
//         'string.empty': 'وصف النشاط لا يمكن أن يكون فارغ',
//         'string.max': 'وصف النشاط يجب أن يكون أقل من 1000 حرف'
//       }),
//     ip_address: Joi.string()
//       .ip()
//       .allow(null, '')
//       .messages({
//         'string.base': 'عنوان IP يجب أن يكون نص',
//         'string.ip': 'عنوان IP يجب أن يكون عنوان IP صحيح'
//       }),
//     user_agent: Joi.string()
//       .max(500)
//       .allow(null, '')
//       .messages({
//         'string.base': 'معلومات المتصفح يجب أن تكون نص',
//         'string.max': 'معلومات المتصفح يجب أن تكون أقل من 500 حرف'
//       }),
//     related_entity: Joi.string()
//       .max(100)
//       .allow(null, '')
//       .messages({
//         'string.base': 'الكيان المرتبط يجب أن يكون نص',
//         'string.max': 'الكيان المرتبط يجب أن يكون أقل من 100 حرف'
//       }),
//     related_entity_id: Joi.string()
//       .max(100)
//       .allow(null, '')
//       .messages({
//         'string.base': 'معرف الكيان المرتبط يجب أن يكون نص',
//         'string.max': 'معرف الكيان المرتبط يجب أن يكون أقل من 100 حرف'
//       }),
//     metadata: Joi.object()
//       .allow(null)
//       .messages({
//         'object.base': 'البيانات الإضافية يجب أن تكون كائن'
//       })
//   }).min(1).messages({
//     'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث',
//     'object.unknown': 'حقل غير مسموح: {#label}'
//   })
// };