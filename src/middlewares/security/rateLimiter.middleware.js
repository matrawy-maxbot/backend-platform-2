import { cacheGet, cacheSet } from '../../modules/cache/redis/config/redis.manager.js';
import status from '../../config/status.config.js';

/**
 * Rate Limiter Middleware للحماية من brute force attacks
 * @param {Object} options - خيارات التحكم في المعدل
 * @param {number} options.windowMs - النافزة الزمنية بالميلي ثانية (افتراضي: 15 دقيقة)
 * @param {number} options.max - الحد الأقصى للطلبات (افتراضي: 100)
 * @param {string} options.message - رسالة الخطأ
 * @returns {Function} middleware function
 */
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 دقيقة
    max = 100, // 100 طلب كحد أقصى
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => req.ip // مولد المفتاح (افتراضي: IP)
  } = options;

  return async (req, res, next) => {
    try {
      const key = `rate_limit:${keyGenerator(req)}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      // الحصول على البيانات الحالية من الكاش
      const currentData = await cacheGet(key);
      let requests = [];

      if (currentData) {
        try {
          const parsedData = JSON.parse(currentData);
          // التأكد من أن البيانات المحفوظة هي مصفوفة
          requests = Array.isArray(parsedData) ? parsedData : [];
        } catch (parseError) {
          console.warn('Failed to parse rate limit data, resetting:', parseError);
          requests = [];
        }
        // إزالة الطلبات القديمة خارج النافزة الزمنية
        requests = requests.filter(timestamp => timestamp > windowStart);
      }

      // التحقق من تجاوز الحد الأقصى
      if (requests.length >= max) {
        const oldestRequest = Math.min(...requests);
        const resetTime = oldestRequest + windowMs;
        const retryAfter = Math.ceil((resetTime - now) / 1000);

        res.set({
          'X-RateLimit-Limit': max,
          'X-RateLimit-Remaining': 0,
          'X-RateLimit-Reset': new Date(resetTime).toISOString(),
          'Retry-After': retryAfter
        });

        return res.status(status.TOO_MANY_REQUESTS).json({
          error: message,
          retryAfter: retryAfter
        });
      }

      // إضافة الطلب الحالي
      requests.push(now);

      // حفظ البيانات المحدثة في الكاش
      const ttl = Math.ceil(windowMs / 1000);
      await cacheSet(key, JSON.stringify(requests), ttl);

      // إضافة headers للمعلومات
      const remaining = max - requests.length;
      const resetTime = Math.min(...requests) + windowMs;

      res.set({
        'X-RateLimit-Limit': max,
        'X-RateLimit-Remaining': remaining,
        'X-RateLimit-Reset': new Date(resetTime).toISOString()
      });

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // في حالة خطأ، السماح بالمرور لتجنب تعطيل الخدمة
      next();
    }
  };
};

// Rate limiters محددة مسبقاً
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // 5 محاولات تسجيل دخول كحد أقصى
  message: 'Too many login attempts, please try again after 15 minutes.'
});

export const generalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب كحد أقصى
  message: 'Too many requests, please try again later.'
});

export const strictRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 دقائق
  max: 10, // 10 طلبات كحد أقصى
  message: 'Rate limit exceeded, please slow down.'
});