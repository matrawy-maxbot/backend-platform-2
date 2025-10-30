# 🎮 Discord Dashboard - لوحة تحكم Discord متقدمة

لوحة تحكم حديثة ومتطورة لإدارة خوادم Discord مع بوت متكامل وواجهة مستخدم عصرية.

## ✨ المميزات الرئيسية

- 🎯 **إدارة شاملة للخوادم**: تحكم كامل في إعدادات خوادم Discord
- 🤖 **بوت Discord متكامل**: ردود تلقائية، أدوار تلقائية، وإدارة الأعضاء
- 📢 **نظام إعلانات متقدم**: إدارة وجدولة الإعلانات
- 🎨 **واجهة حديثة**: تصميم متجاوب مع دعم الوضع الليلي
- 🔐 **نظام مصادقة آمن**: تسجيل دخول عبر Discord OAuth
- 📊 **إحصائيات مفصلة**: تتبع نشاط الخوادم والأعضاء
- 🎮 **ألعاب تفاعلية**: مجموعة من الألعاب المدمجة

## 🚀 الإعداد السريع

### المتطلبات
- Node.js 18+ 
- npm أو yarn
- حساب Discord Developer

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd dashboard-next
```

2. **فحص الإعداد التلقائي**
```bash
npm run check-setup
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env.local
# ثم حدث القيم في .env.local
```

4. **تثبيت التبعيات وتشغيل المشروع**
```bash
npm run setup
npm run start:all
```

### إعداد Discord Application

1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. أنشئ تطبيق جديد
3. احصل على:
   - Client ID
   - Client Secret  
   - Bot Token
4. أضف Redirect URI: `http://localhost:3002/api/auth/callback/discord`
5. ادع البوت لخادمك

## 📖 الأدلة المفصلة

- 📋 **[دليل الإعداد الشامل](SETUP_GUIDE.md)** - خطوات مفصلة للإعداد
- 🤖 **[دليل البوت](BOT_README.md)** - معلومات عن Discord Bot
- 🔧 **[حل المشاكل](AUTO_ROLE_TROUBLESHOOTING.md)** - حلول للمشاكل الشائعة

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Bot**: Discord.js 14
- **Database**: JSON-based file system
- **UI**: Radix UI, Framer Motion, Lucide Icons

## 📁 هيكل المشروع

```
dashboard-next/
├── src/                 # ملفات الموقع
│   ├── app/            # صفحات Next.js
│   ├── components/     # مكونات React
│   ├── hooks/          # React Hooks
│   └── lib/            # مكتبات مساعدة
├── bot/                # ملفات Discord Bot
├── data/               # قاعدة البيانات المحلية
├── public/             # ملفات عامة
└── .env.local          # متغيرات البيئة
```

## 🔧 الأوامر المتاحة

```bash
npm run dev          # تشغيل الموقع فقط
npm run bot          # تشغيل البوت فقط  
npm run start:all    # تشغيل الموقع والبوت معاً
npm run check-setup  # فحص صحة الإعداد
npm run setup        # إعداد تلقائي شامل
npm run build        # بناء المشروع للإنتاج
```

## 🆘 المساعدة والدعم

إذا واجهت مشاكل:
1. تشغيل `npm run check-setup` للتحقق من الإعداد
2. مراجعة [دليل الإعداد](SETUP_GUIDE.md)
3. التحقق من console logs للأخطاء
4. التأكد من صحة متغيرات البيئة

## 🔒 ملاحظات أمنية

- لا تشارك ملف `.env.local` أبداً
- احتفظ بـ Bot Token سرياً
- استخدم NEXTAUTH_SECRET قوي في الإنتاج
- راجع إعدادات الأمان في Discord Developer Portal

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف LICENSE للتفاصيل.
