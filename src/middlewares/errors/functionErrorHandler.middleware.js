import status from '../../config/status.config.js';
import CustomError from '../../utils/errors/errorHandler.util.js';

/**
 * دالة مساعدة لالتقاط الأخطاء في الدوال غير المتزامنة (async functions)
 * تتولى معالجة الأخطاء تلقائياً وتمريرها إلى middleware معالجة الأخطاء
 * 
 * @param {Function} callback - الدالة المراد تنفيذها
 * @param {...any} args - معاملات إضافية للدالة
 * @returns {Function} دالة middleware محسنة بمعالجة الأخطاء
 * 
 * @example
 * // استخدام بسيط
 * app.get('/users', call(async (req, res) => {
 *     const users = await User.findAll();
 *     res.json(users);
 * }));
 * 
 * @example
 * // مع معاملات إضافية
 * const validateUser = (requiredRole) => call(async (req, res, next, role) => {
 *     if (req.user.role !== role) {
 *         throw new CustomError(403, 'Insufficient permissions');
 *     }
 *     next();
 * }, requiredRole);
 * 
 * @example
 * // معالجة خطأ مخصص
 * app.post('/users', call(async (req, res) => {
 *     const existingUser = await User.findByEmail(req.body.email);
 *     if (existingUser) {
 *         throw new CustomError(409, 'Email already exists', 'DUPLICATE_EMAIL', {
 *             email: req.body.email
 *         });
 *     }
 *     const user = await User.create(req.body);
 *     res.status(201).json(user);
 * }));
 */
const call = (callback, ...args) => {
     return async (req, res, next) => {
          try {
               // تنفيذ الدالة المطلوبة مع معالجة الأخطاء
               await callback(req, res, next, ...args);
          } catch (error) {
               // الحفاظ على CustomError objects كما هي
               if (error instanceof CustomError) {
                    return next(error);
               }
               
               // الحفاظ على الأخطاء التي تحتوي على status
               if (error instanceof Error && error.status) {
                    return next(error);
               }
               
               // تحديد رمز الحالة المناسب للخطأ بطريقة محسنة
               let statusCode = status.INTERNAL_SERVER_ERROR;
               
               if (error.status) {
                    statusCode = error.status;
               } else if (res.statusCode >= status.BAD_REQUEST) {
                    statusCode = res.statusCode;
               }
               
               res.status(statusCode);
               
               // إنشاء CustomError للأخطاء العادية
               if (error instanceof Error) {
                    error.status = statusCode;
                    next(error);
               } else {
                    // تحويل non-Error objects إلى CustomError
                    const customError = new CustomError(
                         statusCode,
                         error.message || error.toString() || 'Unknown error',
                         'FUNCTION_ERROR',
                         { originalError: error }
                    );
                    next(customError);
               }
          }
     };
};
export { call };