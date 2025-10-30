# كيفية تفعيل الرتبة التلقائية - How to Enable Auto Role

## المشكلة الحالية - Current Issue
الرتبة التلقائية معطلة حالياً في إعدادات السيرفر. لتفعيلها، اتبع الخطوات التالية:

## خطوات التفعيل - Activation Steps

### 1. الدخول إلى لوحة التحكم - Access Dashboard
1. افتح المتصفح واذهب إلى: `http://localhost:3002`
2. سجل دخولك باستخدام حساب Discord
3. اختر السيرفر الذي تريد تفعيل الرتبة التلقائية فيه

### 2. الذهاب إلى صفحة الأعضاء - Go to Members Page
1. من القائمة الجانبية، اضغط على "Members" أو "الأعضاء"
2. ستجد قسم "Auto Role Assignment" في الصفحة

### 3. تفعيل الرتبة التلقائية - Enable Auto Role
1. **تفعيل الخاصية**: اضغط على المفتاح (Switch) بجانب "Auto Role Assignment"
2. **اختيار الرتبة**: من القائمة المنسدلة "Select Role"، اختر الرتبة التي تريد منحها للأعضاء الجدد
3. **حفظ الإعدادات**: الإعدادات تُحفظ تلقائياً

### 4. التحقق من صلاحيات البوت - Check Bot Permissions

#### أ) صلاحية "Manage Roles"
1. اذهب إلى إعدادات السيرفر في Discord
2. اختر "Roles" من القائمة
3. ابحث عن رتبة البوت (TestCode أو اسم البوت)
4. تأكد من تفعيل صلاحية "Manage Roles" ✅

#### ب) ترتيب هرمية الرتب (مهم جداً!)
**رتبة البوت يجب أن تكون أعلى من الرتبة التلقائية**

**الترتيب الصحيح:**
```
1. Admin (الأعلى)
2. TestCode (رتبة البوت) ← يجب أن تكون هنا
3. Moderator
4. Member (الرتبة التلقائية) ← أقل من رتبة البوت
5. @everyone (الأقل)
```

**كيفية ترتيب الرتب:**
1. Server Settings → Roles
2. اسحب رتبة البوت إلى الأعلى
3. تأكد أن رتبة البوت أعلى من الرتبة التلقائية

## اختبار الوظيفة - Test the Feature

### 1. اختبار سريع
1. قم بإزالة عضو من السيرفر (أو استخدم حساب تجريبي)
2. أعد دعوة العضو
3. يجب أن يحصل على الرتبة تلقائياً عند الانضمام

### 2. مراقبة السجلات
راقب سجلات البوت في Terminal لرؤية:
```
🎭 Auto role assignment enabled for server [اسم السيرفر]
🔍 Bot permissions check:
   - Manage Roles permission: true
   - Bot highest role: [اسم رتبة البوت] (position: [رقم])
   - Target role: [اسم الرتبة التلقائية] (position: [رقم])
   - Can assign this role: true
✅ Auto role "[اسم الرتبة]" assigned to [اسم العضو]
```

## رسائل الخطأ الشائعة - Common Error Messages

### "Auto role assignment disabled or no role specified"
**الحل**: تأكد من تفعيل الخاصية واختيار رتبة من لوحة التحكم

### "Bot missing 'Manage Roles' permission"
**الحل**: أعط البوت صلاحية "Manage Roles" في إعدادات السيرفر

### "Bot role hierarchy insufficient"
**الحل**: ارفع رتبة البوت أعلى من الرتبة التلقائية في إعدادات السيرفر

### "Auto role not found"
**الحل**: الرتبة المحددة تم حذفها، اختر رتبة جديدة من لوحة التحكم

## الحالة الحالية - Current Status
حسب ملف `servers.json`، الإعدادات الحالية:
```json
"autoRole": {
  "enabled": false,  ← معطلة
  "roleId": ""        ← لا يوجد رتبة محددة
}
```

**لحل المشكلة**: اتبع الخطوات أعلاه لتفعيل الخاصية واختيار رتبة.

---

## Quick English Summary
1. Go to `http://localhost:3002`
2. Login with Discord
3. Select your server
4. Go to "Members" page
5. Enable "Auto Role Assignment" switch
6. Select a role from dropdown
7. Ensure bot has "Manage Roles" permission
8. Ensure bot role is higher than auto-assign role
9. Test by inviting a new member

**Current Issue**: Auto role is disabled (`enabled: false`) and no role selected (`roleId: ""`) in server settings.