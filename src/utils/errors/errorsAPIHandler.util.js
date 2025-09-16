// file : errorsAPIHandler.util.js

import statusCodes from "../../config/status.config.js";
import CustomError from "../../utils/errors/errorHandler.util.js";
import { logError } from "./repositories/logError.repository.js";
import { writeError } from "./repositories/writeError.repository.js";
import logger from "../../utils/logger.util.js";

/**
 * معالج مركزي للأخطاء في التطبيق
 * يتولى تسجيل الأخطاء وإرسال الاستجابات المناسبة
 * @param {Object} options - خيارات معالجة الخطأ
 * @param {number} [options.status=500] - رمز حالة HTTP
 * @param {string} [options.message='Internal Server Error'] - رسالة الخطأ
 * @param {string} [options.code=null] - رمز الخطأ للتصنيف
 * @param {Object} [options.data={}] - بيانات إضافية مرتبطة بالخطأ
 * @param {boolean} [options.log=true] - هل يتم تسجيل الخطأ
 * @param {Object} [options.response] - كائن الاستجابة Express
 * @param {Object} [options.req] - كائن الطلب Express
 * @param {string} [options.stack] - stack trace مخصص
 * @returns {Promise<void>}
 */
const handleError = async (options) => {
     try {
          const { status = statusCodes.INTERNAL_SERVER_ERROR, message = 'Internal Server Error', code = null, data = {}, log = true, response, req, stack } = options;
          const error = new CustomError(status, message, code, data, stack);
          
          // تسجيل الخطأ إذا كان مطلوباً
          if (log) {
               logError(error, req);
               logger.error({
                    message: error.message,
                    status: error.status,
                    stack: error.stack,
                    url: req ? req.originalUrl : null,
                    method: req ? req.method : null,
                    ip: req ? req.ip : null,
                    data: error.data,
               });
          }
          
          // إرسال الاستجابة إذا كان response متاحاً
          if (response) {
               await writeError(response, status, message, error, req);
               // إزالة response.end() لأن json() تتولى إنهاء الاستجابة
          }
     } catch (err) {
          // معالجة محسنة للأخطاء المتداخلة
          const errorContext = {
               originalError: err.message || 'Unknown error',
               url: options.req ? options.req.originalUrl : 'Unknown URL',
               method: options.req ? options.req.method : 'Unknown Method',
               ip: options.req ? options.req.ip : 'Unknown IP',
               timestamp: new Date().toISOString()
          };
          
          console.error('! Critical error in handleError function:', errorContext);
          
          // تسجيل الخطأ المتداخل مع معلومات إضافية
          try {
               logger.error({
                    message: `Critical error in handleError: ${err.message}`,
                    status: err.status || statusCodes.INTERNAL_SERVER_ERROR,
                    stack: err.stack,
                    context: errorContext,
                    data: err.data || {},
                    errorType: err?.constructor?.name || 'UnknownError',
                    url: options.req?.originalUrl,
                    method: options.req?.method
               });
          } catch (logErr) {
               console.error('Failed to log critical error:', logErr.message);
          }
          
          // إرسال استجابة طوارئ إذا لم يتم إرسال headers بعد
          if (options.response && !options.response.headersSent) {
               try {
                    options.response.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                         success: false,
                         error: { 
                              message: 'Internal server error occurred',
                              timestamp: new Date().toISOString()
                         }
                    });
               } catch (responseErr) {
                    console.error('Failed to send emergency response:', responseErr.message);
               }
          }
          
          // إرجاع الخطأ للمعالجة في مستوى أعلى إذا كان خطأ حرج
          if (err.name === 'TypeError' || err.name === 'ReferenceError') {
               throw err;
          }
     }
};

export { handleError };