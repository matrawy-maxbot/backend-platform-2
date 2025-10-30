# توثيق APIs إدارة الأعضاء
# Members Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة إعدادات الأعضاء في النظام. جميع المسارات تبدأ بـ `/api/v1/restful/members`

This documentation covers all API endpoints related to members settings management in the system. All routes start with `/api/v1/restful/members`

---

## 1. الحصول على جميع إعدادات الأعضاء | Get All Members Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/members`
- **الوصف | Description:** الحصول على قائمة بجميع إعدادات الأعضاء في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/members?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات الأعضاء بنجاح",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "server_id": "123456789012345678",
      "welcome_message": true,
      "welcome_message_content": "Welcome (user) to (server)! 🌬",
      "welcome_message_channel": "987654321098765432",
      "welcome_image": false,
      "leave_message": true,
      "leave_message_content": "Goodbye (user), hope to see you soon!",
      "leave_message_channel": "987654321098765432",
      "auto_role": false,
      "auto_role_channel": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `500 Internal Server Error` - خطأ في الخادم

---

## 2. الحصول على إعدادات الأعضاء بواسطة المعرف | Get Members Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/members/:id`
- **الوصف | Description:** الحصول على إعدادات أعضاء محددة بواسطة معرفها
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف إعدادات الأعضاء (MongoDB ObjectId) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون معرف MongoDB صحيح (24 حرف hex)

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/members/507f1f77bcf86cd799439011
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات الأعضاء بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "welcome_message": true,
    "welcome_message_content": "Welcome (user) to (server)! 🌬",
    "welcome_message_channel": "987654321098765432",
    "welcome_image": false,
    "leave_message": true,
    "leave_message_content": "Goodbye (user), hope to see you soon!",
    "leave_message_channel": "987654321098765432",
    "auto_role": false,
    "auto_role_channel": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - إعدادات الأعضاء غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف إعدادات الأعضاء يجب أن يكون معرف MongoDB صحيح",
  "errors": [
    {
      "field": "id",
      "message": "معرف إعدادات الأعضاء يجب أن يكون معرف MongoDB صحيح"
    }
  ]
}
```

---

## 3. الحصول على إعدادات الأعضاء بواسطة معرف الخادم | Get Members Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/members/server/:serverId`
- **الوصف | Description:** الحصول على إعدادات الأعضاء لخادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `serverId` يجب أن يحتوي على أرقام فقط
- الطول بين 1-50 حرف
- لا يمكن أن يحتوي على مسافات إضافية

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/members/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات أعضاء الخادم بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "welcome_message": true,
    "welcome_message_content": "Welcome (user) to (server)! 🌬",
    "welcome_message_channel": "987654321098765432",
    "welcome_image": false,
    "leave_message": true,
    "leave_message_content": "Goodbye (user), hope to see you soon!",
    "leave_message_channel": "987654321098765432",
    "auto_role": false,
    "auto_role_channel": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `404 Not Found` - إعدادات الأعضاء غير موجودة لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف الخادم يجب أن يحتوي على أرقام فقط",
  "errors": [
    {
      "field": "serverId",
      "message": "معرف الخادم يجب أن يحتوي على أرقام فقط"
    }
  ]
}
```

---

## 4. إنشاء إعدادات أعضاء جديدة | Create New Members Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/restful/members`
- **الوصف | Description:** إنشاء إعدادات أعضاء جديدة في النظام
- **مستوى الوصول | Access Level:** Private

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|-------|------|-------|------------------|-------|
| server_id | string | نعم | - | معرف الخادم (أرقام فقط، 1-50 حرف) |
| welcome_message | boolean | اختياري | false | تفعيل رسالة الترحيب |
| welcome_message_content | string | اختياري | "Welcome (user) to (server)! 🌬" | محتوى رسالة الترحيب (حد أقصى 500 حرف) |
| welcome_message_channel | string | اختياري | null | قناة رسالة الترحيب (أرقام فقط، حد أقصى 50 حرف) |
| welcome_image | boolean | اختياري | false | تفعيل صورة الترحيب |
| leave_message | boolean | اختياري | false | تفعيل رسالة المغادرة |
| leave_message_content | string | اختياري | "Goodbye (user), hope to see you soon!" | محتوى رسالة المغادرة (حد أقصى 500 حرف) |
| leave_message_channel | string | اختياري | null | قناة رسالة المغادرة (أرقام فقط، حد أقصى 50 حرف) |
| auto_role | boolean | اختياري | false | تفعيل الدور التلقائي |
| auto_role_channel | string | اختياري | null | قناة الدور التلقائي (أرقام فقط، حد أقصى 50 حرف) |

### قواعد التحقق | Validation Rules
- `server_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف
- `welcome_message_content`: نص، حد أقصى 500 حرف
- `welcome_message_channel`: أرقام فقط، حد أقصى 50 حرف أو null
- `leave_message_content`: نص، حد أقصى 500 حرف
- `leave_message_channel`: أرقام فقط، حد أقصى 50 حرف أو null
- `auto_role_channel`: أرقام فقط، حد أقصى 50 حرف أو null

### مثال على الطلب | Request Example
```http
POST /api/v1/restful/members
Content-Type: application/json

{
  "server_id": "123456789012345678",
  "welcome_message": true,
  "welcome_message_content": "مرحباً (user) في خادم (server)! 🎉",
  "welcome_message_channel": "987654321098765432",
  "welcome_image": true,
  "leave_message": true,
  "leave_message_content": "وداعاً (user)، نأمل رؤيتك قريباً!",
  "leave_message_channel": "987654321098765432",
  "auto_role": false,
  "auto_role_channel": null
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء إعدادات الأعضاء بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "server_id": "123456789012345678",
    "welcome_message": true,
    "welcome_message_content": "مرحباً (user) في خادم (server)! 🎉",
    "welcome_message_channel": "987654321098765432",
    "welcome_image": true,
    "leave_message": true,
    "leave_message_content": "وداعاً (user)، نأمل رؤيتك قريباً!",
    "leave_message_channel": "987654321098765432",
    "auto_role": false,
    "auto_role_channel": null,
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء إعدادات الأعضاء بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `409 Conflict` - إعدادات الأعضاء موجودة مسبقاً لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "errors": [
    {
      "field": "server_id",
      "message": "معرف الخادم يجب أن يحتوي على أرقام فقط"
    },
    {
      "field": "welcome_message_content",
      "message": "محتوى رسالة الترحيب يجب أن لا يزيد عن 500 حرف"
    }
  ]
}
```

---

## 5. تحديث إعدادات الأعضاء بواسطة المعرف | Update Members Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/restful/members/:id`
- **الوصف | Description:** تحديث إعدادات الأعضاء بواسطة المعرف
- **مستوى الوصول | Access Level:** Private

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف إعدادات الأعضاء (MongoDB ObjectId) |

### بيانات الطلب | Request Body
جميع الحقول اختيارية، ولكن يجب تقديم حقل واحد على الأقل للتحديث:

| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| welcome_message | boolean | اختياري | تفعيل رسالة الترحيب |
| welcome_message_content | string | اختياري | محتوى رسالة الترحيب (حد أقصى 500 حرف) |
| welcome_message_channel | string | اختياري | قناة رسالة الترحيب (أرقام فقط، حد أقصى 50 حرف) |
| welcome_image | boolean | اختياري | تفعيل صورة الترحيب |
| leave_message | boolean | اختياري | تفعيل رسالة المغادرة |
| leave_message_content | string | اختياري | محتوى رسالة المغادرة (حد أقصى 500 حرف) |
| leave_message_channel | string | اختياري | قناة رسالة المغادرة (أرقام فقط، حد أقصى 50 حرف) |
| auto_role | boolean | اختياري | تفعيل الدور التلقائي |
| auto_role_channel | string | اختياري | قناة الدور التلقائي (أرقام فقط، حد أقصى 50 حرف) |

### مثال على الطلب | Request Example
```http
PUT /api/v1/restful/members/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "welcome_message": false,
  "leave_message": true,
  "leave_message_content": "نراك لاحقاً (user)! 👋",
  "auto_role": true,
  "auto_role_channel": "111222333444555666"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث إعدادات الأعضاء بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "welcome_message": false,
    "welcome_message_content": "Welcome (user) to (server)! 🌬",
    "welcome_message_channel": "987654321098765432",
    "welcome_image": false,
    "leave_message": true,
    "leave_message_content": "نراك لاحقاً (user)! 👋",
    "leave_message_channel": "987654321098765432",
    "auto_role": true,
    "auto_role_channel": "111222333444555666",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T14:20:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث إعدادات الأعضاء بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو معرف غير صحيح
- `404 Not Found` - إعدادات الأعضاء غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

---

## 6. تحديث إعدادات الأعضاء بواسطة معرف الخادم | Update Members Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/restful/members/server/:serverId`
- **الوصف | Description:** تحديث إعدادات الأعضاء بواسطة معرف الخادم
- **مستوى الوصول | Access Level:** Private

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### بيانات الطلب | Request Body
نفس بيانات الطلب في التحديث بواسطة المعرف.

### مثال على الطلب | Request Example
```http
PUT /api/v1/restful/members/server/123456789012345678
Content-Type: application/json

{
  "welcome_message": true,
  "welcome_message_content": "أهلاً وسهلاً (user) في (server)! 🌟",
  "welcome_image": true
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث إعدادات أعضاء الخادم بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "welcome_message": true,
    "welcome_message_content": "أهلاً وسهلاً (user) في (server)! 🌟",
    "welcome_message_channel": "987654321098765432",
    "welcome_image": true,
    "leave_message": true,
    "leave_message_content": "Goodbye (user), hope to see you soon!",
    "leave_message_channel": "987654321098765432",
    "auto_role": false,
    "auto_role_channel": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T16:45:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث إعدادات الأعضاء بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو معرف خادم غير صحيح
- `404 Not Found` - إعدادات الأعضاء غير موجودة لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

---

## 7. حذف إعدادات الأعضاء بواسطة المعرف | Delete Members Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/members/:id`
- **الوصف | Description:** حذف إعدادات الأعضاء من النظام
- **مستوى الوصول | Access Level:** Private

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف إعدادات الأعضاء (MongoDB ObjectId) |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/members/507f1f77bcf86cd799439011
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف إعدادات الأعضاء بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف إعدادات الأعضاء بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - إعدادات الأعضاء غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

---

## 8. حذف إعدادات الأعضاء بواسطة معرف الخادم | Delete Members Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/members/server/:serverId`
- **الوصف | Description:** حذف إعدادات الأعضاء بواسطة معرف الخادم
- **مستوى الوصول | Access Level:** Private

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/members/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف إعدادات أعضاء الخادم بنجاح",
  "data": {
    "server_id": "123456789012345678",
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف إعدادات الأعضاء بنجاح
- `400 Bad Request` - معرف خادم غير صحيح
- `404 Not Found` - إعدادات الأعضاء غير موجودة لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

---

## ملاحظات مهمة | Important Notes

### هيكل البيانات | Data Structure
إعدادات الأعضاء تحتوي على ثلاث مجموعات رئيسية من الإعدادات:

1. **إعدادات رسالة الترحيب | Welcome Message Settings**
   - `welcome_message`: تفعيل/إلغاء تفعيل رسالة الترحيب
   - `welcome_message_content`: محتوى الرسالة (يدعم متغيرات مثل (user) و (server))
   - `welcome_message_channel`: القناة التي ستُرسل فيها الرسالة
   - `welcome_image`: تفعيل/إلغاء تفعيل صورة الترحيب

2. **إعدادات رسالة المغادرة | Leave Message Settings**
   - `leave_message`: تفعيل/إلغاء تفعيل رسالة المغادرة
   - `leave_message_content`: محتوى الرسالة (يدعم متغيرات مثل (user))
   - `leave_message_channel`: القناة التي ستُرسل فيها الرسالة

3. **إعدادات الدور التلقائي | Auto Role Settings**
   - `auto_role`: تفعيل/إلغاء تفعيل الدور التلقائي
   - `auto_role_channel`: القناة المخصصة للدور التلقائي

### المتغيرات المدعومة | Supported Variables
- `(user)`: يتم استبداله باسم المستخدم
- `(server)`: يتم استبداله باسم الخادم

### أمان البيانات | Data Security
- جميع معرفات Discord يجب أن تحتوي على أرقام فقط
- يتم التحقق من صحة البيانات قبل المعالجة
- رسائل الخطأ متوفرة باللغة العربية
- حد أقصى 500 حرف لمحتوى الرسائل

### تنسيق التواريخ | Date Format
- جميع التواريخ بتنسيق ISO 8601 (UTC)
- مثال: `2024-01-15T10:30:00Z`

### معالجة الأخطاء | Error Handling
- جميع الأخطاء تُرجع بتنسيق JSON موحد
- تتضمن رسائل خطأ واضحة باللغة العربية
- تحديد الحقل المسبب للخطأ عند الإمكان

---

## أمثلة شاملة | Complete Examples

### مثال كامل لإنشاء إعدادات أعضاء | Complete Members Settings Creation Example

```bash
# طلب إنشاء إعدادات أعضاء جديدة
curl -X POST http://localhost:3003/api/v1/restful/members \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "welcome_message": true,
    "welcome_message_content": "مرحباً (user) في خادم (server)! 🎉 نتمنى لك إقامة ممتعة معنا",
    "welcome_message_channel": "987654321098765432",
    "welcome_image": true,
    "leave_message": true,
    "leave_message_content": "وداعاً (user)، شكراً لك على الوقت الذي قضيته معنا! 👋",
    "leave_message_channel": "987654321098765432",
    "auto_role": true,
    "auto_role_channel": "111222333444555666"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء إعدادات الأعضاء بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "server_id": "123456789012345678",
    "welcome_message": true,
    "welcome_message_content": "مرحباً (user) في خادم (server)! 🎉 نتمنى لك إقامة ممتعة معنا",
    "welcome_message_channel": "987654321098765432",
    "welcome_image": true,
    "leave_message": true,
    "leave_message_content": "وداعاً (user)، شكراً لك على الوقت الذي قضيته معنا! 👋",
    "leave_message_channel": "987654321098765432",
    "auto_role": true,
    "auto_role_channel": "111222333444555666",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل لتحديث إعدادات الأعضاء | Complete Members Settings Update Example

```bash
# طلب تحديث إعدادات أعضاء موجودة
curl -X PUT http://localhost:3003/api/v1/restful/members/server/123456789012345678 \
  -H "Content-Type: application/json" \
  -d '{
    "welcome_message": false,
    "leave_message": true,
    "leave_message_content": "إلى اللقاء (user)! نأمل أن نراك مرة أخرى قريباً 🌟",
    "auto_role": false
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم تحديث إعدادات أعضاء الخادم بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "welcome_message": false,
    "welcome_message_content": "Welcome (user) to (server)! 🌬",
    "welcome_message_channel": "987654321098765432",
    "welcome_image": false,
    "leave_message": true,
    "leave_message_content": "إلى اللقاء (user)! نأمل أن نراك مرة أخرى قريباً 🌟",
    "leave_message_channel": "987654321098765432",
    "auto_role": false,
    "auto_role_channel": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T16:45:00Z"
  }
}
```

### مثال على خطأ في التحقق | Validation Error Example

```bash
# طلب بمعرف خادم غير صحيح
curl -X GET http://localhost:3003/api/v1/restful/members/server/invalid_server_id \
  -H "Content-Type: application/json"

# الاستجابة المتوقعة
{
  "success": false,
  "message": "معرف الخادم يجب أن يحتوي على أرقام فقط",
  "errors": [
    {
      "field": "serverId",
      "message": "معرف الخادم يجب أن يحتوي على أرقام فقط"
    }
  ]
}
```

---

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.