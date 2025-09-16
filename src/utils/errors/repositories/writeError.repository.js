// file : writeError.repository.js

import { NODE_ENV } from '../../../config/server.config.js';

/**
 * كتابة استجابة الخطأ إلى العميل
 * تتولى إرسال استجابة JSON منسقة مع معلومات الخطأ المناسبة
 * @param {Object} response - كائن الاستجابة Express
 * @param {number} status - رمز حالة HTTP
 * @param {string} message - رسالة الخطأ
 * @param {Error|CustomError} error - كائن الخطأ
 * @param {Object} req - كائن الطلب Express
 * @returns {Promise<void>}
 */
export const writeError = (response, status, message, error, req) => {
     return new Promise((resolve, reject) => {
          try {
               // التحقق من إرسال headers مسبقاً لتجنب الأخطاء
               if (response.headersSent) {
                    console.warn('Headers already sent, cannot send error response');
                    return resolve();
               }

               const messageBody = {
                    success: false,
                    error: { 
                         message, 
                         stack: NODE_ENV === 'development' ? error.stack : null,
                         ...(NODE_ENV === 'development' && req && {
                              url: req.originalUrl,
                              method: req.method
                         })
                    }
               };

               // استخدام json() بدلاً من write() لإرسال استجابة JSON صحيحة
               response.status(status).json(messageBody);
               resolve();
          } catch (err) {
               console.error("Error in writeError function: ", err);
               reject(err);
          }
     });
};