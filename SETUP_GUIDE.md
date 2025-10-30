# 🚀 دليل الإعداد السريع

هذا الدليل يساعدك على تشغيل المشروع بعد سحبه من GitHub.

## 📋 المتطلبات الأساسية

- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- حساب Discord Developer

## ⚡ خطوات الإعداد السريع

### 1. تثبيت التبعيات

```bash
# تثبيت تبعيات المشروع الرئيسي
npm install

# تثبيت تبعيات البوت
cd bot
npm install
cd ..
```

### 2. إعداد متغيرات البيئة

```bash
# نسخ ملف المثال
cp .env.example .env.local
```

### 3. إعداد تطبيق Discord

1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. أنشئ تطبيق جديد أو استخدم تطبيق موجود
3. احصل على المعلومات التالية:
   - **Client ID** من صفحة General Information
   - **Client Secret** من صفحة OAuth2
   - **Bot Token** من صفحة Bot

### 4. تحديث ملف .env.local

افتح ملف `.env.local` وحدث القيم التالية:

```env
# Discord OAuth Configuration
DISCORD_CLIENT_ID=your-actual-client-id
DISCORD_CLIENT_SECRET=your-actual-client-secret
NEXT_PUBLIC_DISCORD_CLIENT_ID=your-actual-client-id

# Discord Bot Token
DISCORD_BOT_TOKEN=your-actual-bot-token

# NextAuth Secret (أنشئ مفتاح عشوائي قوي)
NEXTAUTH_SECRET=your-random-secret-key
```

### 5. إعداد Redirect URI

في Discord Developer Portal:
1. اذهب إلى OAuth2 > Redirects
2. أضف: `http://localhost:3002/api/auth/callback/discord`

### 6. دعوة البوت للخادم

1. في Discord Developer Portal > OAuth2 > URL Generator
2. اختر Scopes: `bot`
3. اختر Bot Permissions:
   - View Channels
   - Read Message History
   - Send Messages
   - Manage Roles
   - Manage Messages
4. انسخ الرابط وادع البوت لخادمك

### 7. تشغيل المشروع

```bash
# تشغيل الموقع والبوت معاً
npm run start:all

# أو تشغيلهما منفصلين:
# تشغيل الموقع
npm run dev

# تشغيل البوت (في terminal آخر)
cd bot
npm start
```

## 🔧 حل المشاكل الشائعة

### مشكلة: "Invalid Client"
- تأكد من صحة DISCORD_CLIENT_ID و DISCORD_CLIENT_SECRET
- تأكد من إضافة Redirect URI الصحيح

### مشكلة: "Bot Token Invalid"
- تأكد من صحة DISCORD_BOT_TOKEN
- تأكد من أن البوت مدعو للخادم

### مشكلة: "Cannot connect to database"
- تأكد من وجود مجلد `data` في المشروع
- تأكد من صلاحيات الكتابة في المجلد

### مشكلة: "Port already in use"
- غير BOT_API_PORT في .env.local إلى رقم آخر
- أو أوقف العمليات التي تستخدم المنفذ

## 📁 هيكل الملفات المهمة

```
dashboard-next/
├── .env.local          # متغيرات البيئة (لا تشاركها!)
├── .env.example        # مثال على متغيرات البيئة
├── data/               # قاعدة البيانات المحلية
├── bot/                # ملفات Discord Bot
└── src/                # ملفات الموقع
```

## 🆘 الحصول على المساعدة

إذا واجهت مشاكل:
1. تأكد من اتباع جميع الخطوات
2. تحقق من console logs للأخطاء
3. تأكد من أن جميع المتغيرات في .env.local صحيحة

## 🔒 ملاحظات أمنية

- **لا تشارك ملف .env.local أبداً**
- احتفظ بـ Bot Token سرياً
- استخدم NEXTAUTH_SECRET قوي في الإنتاج
- غير BOT_API_SECRET إلى قيمة عشوائية قوية