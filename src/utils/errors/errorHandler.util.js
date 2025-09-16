// file : errorHandler.util.js

/**
 * فئة مخصصة للأخطاء مع معلومات إضافية
 * توفر هيكلة موحدة للأخطاء في التطبيق مع إمكانية إضافة بيانات مخصصة
 * 
 * @example
 * // إنشاء خطأ بسيط
 * const error = new CustomError(404, 'User not found');
 * 
 * @example
 * // إنشاء خطأ مع بيانات إضافية
 * const error = new CustomError(400, 'Validation failed', 'VALIDATION_ERROR', {
 *     field: 'email',
 *     value: 'invalid-email'
 * });
 * 
 * @example
 * // استخدام في middleware
 * const { call } = require('./middlewares/errors/functionErrorHandler.middleware.js');
 * app.get('/users/:id', call(async (req, res) => {
 *     const user = await User.findById(req.params.id);
 *     if (!user) {
 *         throw new CustomError(404, 'User not found', 'USER_NOT_FOUND', { userId: req.params.id });
 *     }
 *     res.json(user);
 * }));
 */
class CustomError extends Error {
     /**
      * إنشاء خطأ مخصص جديد
      * @param {number} status - رمز حالة HTTP
      * @param {string} message - رسالة الخطأ
      * @param {string} code - رمز الخطأ للتصنيف (اختياري)
      * @param {object} data - بيانات إضافية مرتبطة بالخطأ (محدودة بـ 1KB)
      * @param {string} stack - stack trace مخصص (اختياري)
      */
     constructor(status, message, code = null, data = {}, stack = null) {
          super(message);
          this.status = status; // رمز حالة HTTP
          this.code = code; // رمز الخطأ للتصنيف
          this.data = this._validateDataSize(data); // بيانات إضافية مع التحقق من الحجم
          this.name = this.constructor.name; // اسم فئة الخطأ
          this.timestamp = new Date().toISOString(); // وقت حدوث الخطأ
          
          // إنشاء stack trace تلقائياً أو استخدام المخصص
          if (!stack) {
               Error.captureStackTrace(this, this.constructor);
          } else {
               this.stack = stack;
          }
     }

     /**
      * التحقق من حجم البيانات وتقليمها إذا لزم الأمر
      * @param {object} data - البيانات المراد فحصها
      * @returns {object} البيانات المفحوصة والمحدودة الحجم
      * @private
      */
     _validateDataSize(data) {
          if (typeof data !== 'object' || data === null) {
               return {};
          }
          
          const dataString = JSON.stringify(data);
          const maxSize = 1024; // 1KB
          
          if (dataString.length > maxSize) {
               console.warn(`Error data size (${dataString.length} bytes) exceeds limit (${maxSize} bytes). Data will be truncated.`);
               return {
                    _truncated: true,
                    _originalSize: dataString.length,
                    _message: 'Data truncated due to size limit',
                    preview: dataString.substring(0, maxSize - 100) + '...'
               };
          }
          
          return data;
     }

     /**
      * تحويل الخطأ إلى كائن JSON للتسجيل أو الإرسال
      * @returns {object} كائن يحتوي على جميع معلومات الخطأ
      */
     toJSON() {
          return {
               name: this.name,
               message: this.message,
               status: this.status,
               code: this.code,
               data: this.data,
               timestamp: this.timestamp,
               stack: this.stack
          };
     }
}
export default CustomError;