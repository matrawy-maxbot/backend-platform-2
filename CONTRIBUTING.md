# 🤝 المساهمة في المشروع

نرحب بمساهماتكم في تطوير هذا المشروع! هذا الدليل يوضح كيفية المساهمة بفعالية.

## 🚀 البدء السريع للمطورين

### 1. إعداد بيئة التطوير

```bash
# استنساخ المشروع
git clone <repository-url>
cd dashboard-next

# إعداد تلقائي
npm run quick-start
```

### 2. فهم هيكل المشروع

```
dashboard-next/
├── src/
│   ├── app/              # صفحات Next.js (App Router)
│   ├── components/       # مكونات React قابلة لإعادة الاستخدام
│   ├── hooks/           # React Hooks مخصصة
│   ├── lib/             # مكتبات ووظائف مساعدة
│   └── types/           # تعريفات TypeScript
├── bot/                 # Discord Bot (Node.js)
├── data/                # قاعدة البيانات المحلية (JSON)
└── public/              # ملفات عامة (صور، أيقونات)
```

## 📋 أنواع المساهمات المرحب بها

### 🐛 إصلاح الأخطاء
- أخطاء في الواجهة أو الوظائف
- مشاكل في الأداء
- أخطاء في Discord Bot

### ✨ ميزات جديدة
- تحسينات على الواجهة
- وظائف جديدة للبوت
- ألعاب إضافية
- تحسينات الأمان

### 📚 التوثيق
- تحسين الأدلة الموجودة
- إضافة أمثلة جديدة
- ترجمة المحتوى

### 🎨 التصميم
- تحسين UI/UX
- إضافة ثيمات جديدة
- تحسين الاستجابة

## 🔧 معايير التطوير

### كود JavaScript/TypeScript
```javascript
// ✅ جيد
const getUserData = async (userId: string): Promise<UserData> => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// ❌ سيء
function getData(id) {
  return fetch('/api/users/' + id).then(r => r.json());
}
```

### مكونات React
```tsx
// ✅ جيد
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### CSS/Tailwind
```tsx
// ✅ جيد - استخدم Tailwind classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">

// ❌ سيء - تجنب inline styles
<div style={{display: 'flex', padding: '16px'}}>
```

## 🔄 سير العمل (Workflow)

### 1. إنشاء Branch جديد
```bash
# للميزات الجديدة
git checkout -b feature/اسم-الميزة

# لإصلاح الأخطاء
git checkout -b fix/وصف-المشكلة

# للتوثيق
git checkout -b docs/موضوع-التوثيق
```

### 2. التطوير والاختبار
```bash
# تشغيل المشروع
npm run start:all

# اختبار الاتصال
npm run test-connection

# فحص الكود
npm run lint
```

### 3. Commit Messages
```bash
# ✅ جيد
git commit -m "feat: إضافة نظام إشعارات جديد"
git commit -m "fix: إصلاح مشكلة تسجيل الدخول"
git commit -m "docs: تحديث دليل الإعداد"

# ❌ سيء
git commit -m "تحديث"
git commit -m "إصلاح"
```

### 4. إنشاء Pull Request
- وصف واضح للتغييرات
- لقطات شاشة للتغييرات المرئية
- اختبار شامل للوظائف الجديدة

## 🧪 الاختبار

### اختبار الوظائف الأساسية
```bash
# فحص الإعداد
npm run check-setup

# اختبار الاتصال
npm run test-connection

# تشغيل المشروع
npm run start:all
```

### اختبار Discord Bot
1. تأكد من أن البوت متصل
2. اختبر الأوامر الأساسية
3. تحقق من الردود التلقائية
4. اختبر نظام الأدوار

### اختبار الواجهة
1. تسجيل الدخول/الخروج
2. التنقل بين الصفحات
3. الاستجابة على الأجهزة المختلفة
4. الوضع الليلي/النهاري

## 📝 إرشادات الكود

### TypeScript
- استخدم types واضحة
- تجنب `any` قدر الإمكان
- استخدم interfaces للكائنات المعقدة

### React
- استخدم Functional Components
- استخدم Hooks بدلاً من Class Components
- اتبع مبدأ Single Responsibility

### Discord.js
- تعامل مع الأخطاء بشكل صحيح
- استخدم async/await
- اتبع Discord API rate limits

## 🔒 الأمان

### متغيرات البيئة
- لا تضع أسرار في الكود
- استخدم .env.local للتطوير
- تأكد من .gitignore صحيح

### Discord Bot
- تحقق من الصلاحيات قبل العمليات
- تنظيف المدخلات من المستخدمين
- تسجيل العمليات المهمة

## 🐛 الإبلاغ عن الأخطاء

### معلومات مطلوبة
1. وصف المشكلة
2. خطوات إعادة الإنتاج
3. النتيجة المتوقعة vs الفعلية
4. لقطات شاشة (إن أمكن)
5. معلومات البيئة:
   - نظام التشغيل
   - إصدار Node.js
   - إصدار المتصفح

### قالب تقرير الخطأ
```markdown
## وصف المشكلة
[وصف واضح ومختصر للمشكلة]

## خطوات إعادة الإنتاج
1. اذهب إلى '...'
2. اضغط على '...'
3. انتقل إلى '...'
4. شاهد الخطأ

## النتيجة المتوقعة
[ما كان يجب أن يحدث]

## النتيجة الفعلية
[ما حدث فعلاً]

## معلومات البيئة
- OS: [e.g. Windows 11]
- Node.js: [e.g. 18.17.0]
- Browser: [e.g. Chrome 120]
```

## 💡 اقتراح ميزات جديدة

### قالب اقتراح الميزة
```markdown
## الميزة المقترحة
[وصف واضح للميزة]

## المشكلة التي تحلها
[لماذا نحتاج هذه الميزة؟]

## الحل المقترح
[كيف يجب أن تعمل الميزة؟]

## بدائل أخرى
[هل فكرت في حلول أخرى؟]

## معلومات إضافية
[أي معلومات أخرى مفيدة]
```

## 📞 التواصل

- **Issues**: للأخطاء والاقتراحات
- **Discussions**: للأسئلة العامة
- **Pull Requests**: للمساهمات

## 🏆 الاعتراف بالمساهمين

نقدر جميع المساهمات ونعترف بها في:
- ملف CONTRIBUTORS.md
- صفحة About في الموقع
- Release notes

---

**شكراً لمساهمتكم في تطوير هذا المشروع! 🎉**