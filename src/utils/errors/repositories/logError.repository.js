// file : logError.repository.js

/**
 * دالة تسجيل الأخطاء في وحدة التحكم (Console)
 * تعرض معلومات مفصلة عن الخطأ بتنسيق واضح ومنظم
 * @param {CustomError} error - كائن الخطأ المراد تسجيله
 * @param {Request} req - كائن الطلب (اختياري) لعرض معلومات إضافية
 */
export const logError = (error, req) => {
     try {
          // التأكد من وجود خاصية data في الخطأ
          error.data = error.data || {};
          
          // عرض معلومات أساسية عن الخطأ مع timestamp
          console.error("\n--------------------------------------------\n",
          `[${new Date().toISOString()}] Error status : ${error.status} - ${error.message}`,
          "\n--------------------------------------------\n");

          // عرض معلومات الطلب إذا كانت متاحة
          if (req) console.error(`Request URL: ${req.originalUrl}, Method: ${req.method}, IP: ${req.ip}`);
          
          // عرض البيانات الإضافية إذا كانت موجودة
          if (Object.keys(error.data).length > 0) console.error('Additional Data:', JSON.stringify(error.data, null, 2), "\n");

          // عرض stack trace للمساعدة في التتبع
          console.error(error.stack);
     } catch (err) {
          console.error("Error in logError function: ", err);
     }
};