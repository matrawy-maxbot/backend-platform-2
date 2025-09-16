# Backend Platform

🚀 منصة خلفية شاملة ومتقدمة مبنية بـ Node.js و Express.js مع أفضل الممارسات الأمنية والتقنية.

## 📋 المحتويات

- [الميزات](#الميزات)
- [المتطلبات](#المتطلبات)
- [التثبيت](#التثبيت)
- [التكوين](#التكوين)
- [تشغيل المشروع](#تشغيل-المشروع)
- [بنية المشروع](#بنية-المشروع)
- [Middlewares](#middlewares)
- [API Documentation](#api-documentation)
- [الأمان](#الأمان)
- [المساهمة](#المساهمة)

## ✨ الميزات

### 🔒 الأمان
- **Helmet.js**: حماية شاملة للـ HTTP headers
- **CORS**: إدارة متقدمة لـ Cross-Origin Resource Sharing
- **XSS Protection**: حماية من هجمات Cross-Site Scripting
- **Rate Limiting**: حماية من الهجمات والـ brute force
- **Session Management**: إدارة آمنة للجلسات باستخدام Redis

### 📊 المراقبة والتسجيل
- **Morgan**: تسجيل مفصل للطلبات HTTP
- **Response Time**: قياس أوقات الاستجابة
- **Winston**: نظام تسجيل متقدم
- **Health Check**: نقطة فحص صحة الخادم

### ⚡ الأداء
- **Redis Caching**: تخزين مؤقت سريع
- **Connection Pooling**: إدارة فعالة لاتصالات قاعدة البيانات
- **Graceful Shutdown**: إيقاف آمن للخادم

### 🛠️ معالجة الأخطاء
- **Centralized Error Handling**: معالجة مركزية للأخطاء
- **Custom Error Classes**: فئات أخطاء مخصصة
- **Async Error Wrapper**: التقاط تلقائي لأخطاء الدوال غير المتزامنة

## 📋 المتطلبات

- **Node.js**: الإصدار 18.0.0 أو أحدث
- **npm**: الإصدار 8.0.0 أو أحدث
- **Redis**: للتخزين المؤقت وإدارة الجلسات
- **PostgreSQL**: قاعدة البيانات الرئيسية (اختياري)
- **MongoDB**: قاعدة بيانات NoSQL (اختياري)

## 🚀 التثبيت

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd backend-platform
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد متغيرات البيئة
```bash
cp .env.example .env
```

### 4. تحرير ملف .env
قم بتحرير ملف `.env` وإضافة القيم المناسبة لبيئتك.

## ⚙️ التكوين

### متغيرات البيئة الأساسية

```env
# إعدادات الخادم
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# الأمان
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000

# الجلسات
SESSION_SECRET=your-session-secret
SESSION_MAX_AGE=86400000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🏃‍♂️ تشغيل المشروع

### بيئة التطوير
```bash
npm run dev
```

### بيئة الإنتاج
```bash
npm start
```

### فحص الكود
```bash
npm run lint
```

## 📁 بنية المشروع

```
src/
├── app.js                 # تطبيق Express الرئيسي
├── server.js              # خادم HTTP وإدارة الاتصالات
├── config/                # ملفات التكوين
│   ├── server.config.js
│   ├── security.config.js
│   ├── database.config.js
│   └── ...
├── middlewares/           # Middlewares مخصصة
│   ├── errors/           # معالجة الأخطاء
│   ├── logging/          # التسجيل والمراقبة
│   ├── security/         # الأمان
│   └── validation/       # التحقق من البيانات
├── modules/              # وحدات النظام
│   ├── auth/            # المصادقة والتفويض
│   ├── database/        # قواعد البيانات
│   ├── cache/           # التخزين المؤقت
│   └── ...
└── utils/               # أدوات مساعدة
    ├── errors/
    ├── validators/
    └── ...
```

## 🔧 Middlewares

### الأمان
- **CORS**: `corsMiddleware` - إدارة Cross-Origin requests
- **Helmet**: `helmetMiddleware` - حماية HTTP headers
- **XSS Clean**: `xssProtectionMiddleware` - حماية من XSS
- **Rate Limiter**: `rateLimiterMiddleware` - تحديد معدل الطلبات
- **Session**: `sessionMiddleware` - إدارة الجلسات

### التسجيل
- **Request Logger**: `requestLogger` - تسجيل الطلبات
- **Response Time**: `responseTimeMiddleware` - قياس أوقات الاستجابة

### معالجة الأخطاء
- **Error Handler**: `errorHandlerMiddleware` - معالجة الأخطاء العامة
- **Not Found**: `notFoundMiddleware` - معالجة الصفحات غير الموجودة
- **Function Error Handler**: `call()` - التقاط أخطاء الدوال غير المتزامنة

## 📚 API Documentation

### Health Check
```http
GET /health
```

يعيد معلومات حول صحة الخادم:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

### Rate Limiting Headers
جميع الطلبات تتضمن headers للـ rate limiting:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 2024-01-01T01:00:00.000Z
```

## 🔒 الأمان

### الميزات الأمنية المطبقة

1. **HTTP Security Headers**
   - Content Security Policy (CSP)
   - HTTP Strict Transport Security (HSTS)
   - X-Frame-Options
   - X-Content-Type-Options

2. **Rate Limiting**
   - حماية عامة: 100 طلب/15 دقيقة
   - حماية المصادقة: 5 محاولات/15 دقيقة
   - حماية صارمة: 10 طلبات/5 دقائق

3. **Session Security**
   - تخزين آمن في Redis
   - HttpOnly cookies
   - Secure cookies في الإنتاج

4. **Input Validation**
   - XSS protection
   - SQL injection prevention
   - Schema validation

## 🛠️ استخدام Middlewares

### استخدام Rate Limiter مخصص
```javascript
import { createRateLimiter } from './middlewares/security/rateLimiter.middleware.js';

const customLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 دقائق
  max: 50, // 50 طلب
  message: 'رسالة خطأ مخصصة'
});

app.use('/api/sensitive', customLimiter);
```

### استخدام Function Error Handler
```javascript
import { call } from './middlewares/errors/functionErrorHandler.middleware.js';

app.get('/users', call(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));
```

### استخدام Validation Middleware
```javascript
import validationMiddleware from './middlewares/validation/validation.middleware.js';
import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required()
});

app.post('/users', validationMiddleware(userSchema), (req, res) => {
  // req.value.body يحتوي على البيانات المتحقق منها
  console.log(req.value.body);
});
```

## 🔄 Graceful Shutdown

الخادم يدعم الإيقاف الآمن:
- يتوقف عن قبول اتصالات جديدة
- ينتظر انتهاء الطلبات الحالية
- يغلق جميع الاتصالات بأمان
- ينظف الموارد

## 📝 التطوير

### إضافة Route جديد
```javascript
// في app.js
import userRoutes from './routes/user.routes.js';
app.use('/api/v1/users', userRoutes);
```

### إضافة Middleware جديد
```javascript
// إنشاء middleware جديد
const customMiddleware = (req, res, next) => {
  // منطق الـ middleware
  next();
};

// إضافته في app.js
app.use(customMiddleware);
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى البranch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة ISC.

## 👨‍💻 المطور

**Matrawy** - مطور المشروع

---

💡 **نصيحة**: تأكد من قراءة ملف `.env.example` لفهم جميع المتغيرات البيئية المطلوبة قبل تشغيل المشروع.