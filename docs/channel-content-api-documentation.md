# توثيق APIs إدارة محتوى القنوات
# Channel Content Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة محتوى القنوات في النظام. جميع المسارات تبدأ بـ `/api/v1/channel-content`

This documentation covers all API endpoints related to channel content management in the system. All routes start with `/api/v1/channel-content`

---

## 1. الحصول على جميع إعدادات محتوى القنوات | Get All Channel Content Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/channel-content`
- **الوصف | Description:** الحصول على قائمة بجميع إعدادات محتوى القنوات في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |



### مثال على الطلب | Request Example
```http
GET /api/v1/channel-content?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات محتوى القنوات بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "block_images": ["987654321098765432", "876543210987654321"],
      "block_text_messages": ["765432109876543210"],
      "block_file_attachments": ["654321098765432109"],
      "block_bot_commands": ["543210987654321098"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "server_id": "234567890123456789",
      "block_images": [],
      "block_text_messages": ["876543210987654321"],
      "block_file_attachments": [],
      "block_bot_commands": ["543210987654321098", "432109876543210987"],
      "created_at": "2024-01-16T14:20:00Z",
      "updated_at": "2024-01-16T14:20:00Z"
    }
  ]
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `500 Internal Server Error` - خطأ في الخادم

---

## 2. الحصول على إعدادات محتوى القنوات بواسطة المعرف | Get Channel Content Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/channel-content/:id`
- **الوصف | Description:** الحصول على إعدادات محتوى قنوات محددة بواسطة معرفها
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف إعدادات محتوى القنوات (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
GET /api/v1/channel-content/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات محتوى القنوات بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "block_images": ["987654321098765432", "876543210987654321"],
    "block_text_messages": ["765432109876543210"],
    "block_file_attachments": ["654321098765432109"],
    "block_bot_commands": ["543210987654321098"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - إعدادات محتوى القنوات غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف إعدادات محتوى القنوات يجب أن يكون رقماً موجباً",
  "errors": [
    {
      "field": "id",
      "message": "معرف إعدادات محتوى القنوات يجب أن يكون رقماً موجباً"
    }
  ]
}
```

---

## 3. الحصول على إعدادات محتوى القنوات بواسطة معرف الخادم | Get Channel Content Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/channel-content/server/:serverId`
- **الوصف | Description:** الحصول على إعدادات محتوى القنوات لخادم محدد
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
GET /api/v1/channel-content/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات محتوى قنوات الخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "block_images": ["987654321098765432", "876543210987654321"],
    "block_text_messages": ["765432109876543210"],
    "block_file_attachments": ["654321098765432109"],
    "block_bot_commands": ["543210987654321098"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `404 Not Found` - إعدادات محتوى القنوات غير موجودة لهذا الخادم
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

## 4. إنشاء إعدادات محتوى قنوات جديدة | Create New Channel Content Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/channel-content`
- **الوصف | Description:** إنشاء إعدادات محتوى قنوات جديدة في النظام
- **مستوى الوصول | Access Level:** Public

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| server_id | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |
| block_images | array | اختياري | قائمة معرفات القنوات المحظور فيها الصور |
| block_text_messages | array | اختياري | قائمة معرفات القنوات المحظور فيها الرسائل النصية |
| block_file_attachments | array | اختياري | قائمة معرفات القنوات المحظور فيها مرفقات الملفات |
| block_bot_commands | array | اختياري | قائمة معرفات القنوات المحظور فيها أوامر البوت |

### قواعد التحقق | Validation Rules
- `server_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف
- `block_images`: مصفوفة من النصوص (معرفات القنوات)، كل عنصر يحتوي على أرقام فقط، طول 1-50 حرف
- `block_text_messages`: مصفوفة من النصوص (معرفات القنوات)، كل عنصر يحتوي على أرقام فقط، طول 1-50 حرف
- `block_file_attachments`: مصفوفة من النصوص (معرفات القنوات)، كل عنصر يحتوي على أرقام فقط، طول 1-50 حرف
- `block_bot_commands`: مصفوفة من النصوص (معرفات القنوات)، كل عنصر يحتوي على أرقام فقط، طول 1-50 حرف
- لا يمكن أن تحتوي الحقول على مسافات إضافية

### مثال على الطلب | Request Example
```http
POST /api/v1/channel-content
Content-Type: application/json

{
  "server_id": "123456789012345678",
  "block_images": ["987654321098765432", "876543210987654321"],
  "block_text_messages": ["765432109876543210"],
  "block_file_attachments": ["654321098765432109"],
  "block_bot_commands": ["543210987654321098"]
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء إعدادات محتوى القنوات بنجاح",
  "data": {
    "id": 3,
    "server_id": "123456789012345678",
    "block_images": ["987654321098765432", "876543210987654321"],
    "block_text_messages": ["765432109876543210"],
    "block_file_attachments": ["654321098765432109"],
    "block_bot_commands": ["543210987654321098"],
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء إعدادات محتوى القنوات بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `409 Conflict` - إعدادات محتوى القنوات موجودة مسبقاً لهذا الخادم
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
      "field": "block_images",
      "message": "قائمة القنوات المحظور فيها الصور يجب أن تكون مصفوفة"
    }
  ]
}
```

```json
{
  "success": false,
  "message": "إعدادات محتوى القنوات موجودة مسبقاً لهذا الخادم",
  "error": "CHANNEL_CONTENT_ALREADY_EXISTS"
}
```

---

## 5. تحديث إعدادات محتوى القنوات بواسطة المعرف | Update Channel Content Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/channel-content/:id`
- **الوصف | Description:** تحديث إعدادات محتوى قنوات موجودة بواسطة معرفها
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف إعدادات محتوى القنوات (رقم صحيح موجب) |

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| block_images | array | اختياري | قائمة معرفات القنوات المحظور فيها الصور |
| block_text_messages | array | اختياري | قائمة معرفات القنوات المحظور فيها الرسائل النصية |
| block_file_attachments | array | اختياري | قائمة معرفات القنوات المحظور فيها مرفقات الملفات |
| block_bot_commands | array | اختياري | قائمة معرفات القنوات المحظور فيها أوامر البوت |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً
- يجب تقديم حقل واحد على الأقل للتحديث
- جميع معرفات القنوات يجب أن تحتوي على أرقام فقط، طول 1-50 حرف

### مثال على الطلب | Request Example
```http
PUT /api/v1/channel-content/1
Content-Type: application/json

{
  "block_images": ["987654321098765432"],
  "block_text_messages": ["765432109876543210", "654321098765432109"],
  "block_bot_commands": []
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث إعدادات محتوى القنوات بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "block_images": ["987654321098765432"],
    "block_text_messages": ["765432109876543210", "654321098765432109"],
    "block_file_attachments": ["654321098765432109"],
    "block_bot_commands": [],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T11:45:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث إعدادات محتوى القنوات بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `404 Not Found` - إعدادات محتوى القنوات غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "يجب تقديم حقل واحد على الأقل للتحديث",
  "errors": [
    {
      "field": "body",
      "message": "يجب تقديم حقل واحد على الأقل للتحديث"
    }
  ]
}
```

---

## 6. تحديث إعدادات محتوى القنوات بواسطة معرف الخادم | Update Channel Content Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/channel-content/server/:serverId`
- **الوصف | Description:** تحديث إعدادات محتوى القنوات لخادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| block_images | array | اختياري | قائمة معرفات القنوات المحظور فيها الصور |
| block_text_messages | array | اختياري | قائمة معرفات القنوات المحظور فيها الرسائل النصية |
| block_file_attachments | array | اختياري | قائمة معرفات القنوات المحظور فيها مرفقات الملفات |
| block_bot_commands | array | اختياري | قائمة معرفات القنوات المحظور فيها أوامر البوت |

### قواعد التحقق | Validation Rules
- `serverId` يجب أن يحتوي على أرقام فقط، طول 1-50 حرف
- يجب تقديم حقل واحد على الأقل للتحديث
- جميع معرفات القنوات يجب أن تحتوي على أرقام فقط، طول 1-50 حرف

### مثال على الطلب | Request Example
```http
PUT /api/v1/channel-content/server/123456789012345678
Content-Type: application/json

{
  "block_images": ["987654321098765432", "876543210987654321"],
  "block_file_attachments": []
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث إعدادات محتوى قنوات الخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "block_images": ["987654321098765432", "876543210987654321"],
    "block_text_messages": ["765432109876543210"],
    "block_file_attachments": [],
    "block_bot_commands": ["543210987654321098"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T12:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث إعدادات محتوى القنوات بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `404 Not Found` - إعدادات محتوى القنوات غير موجودة لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

---

## 7. حذف إعدادات محتوى القنوات بواسطة المعرف | Delete Channel Content Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/channel-content/:id`
- **الوصف | Description:** حذف إعدادات محتوى قنوات من النظام
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف إعدادات محتوى القنوات (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
DELETE /api/v1/channel-content/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف إعدادات محتوى القنوات بنجاح",
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف إعدادات محتوى القنوات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - إعدادات محتوى القنوات غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "إعدادات محتوى القنوات غير موجودة",
  "error": "CHANNEL_CONTENT_NOT_FOUND"
}
```

---

## 8. حذف إعدادات محتوى القنوات بواسطة معرف الخادم | Delete Channel Content Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/channel-content/server/:serverId`
- **الوصف | Description:** حذف إعدادات محتوى القنوات لخادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `serverId` يجب أن يحتوي على أرقام فقط، طول 1-50 حرف

### مثال على الطلب | Request Example
```http
DELETE /api/v1/channel-content/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف إعدادات محتوى قنوات الخادم بنجاح",
  "data": {
    "server_id": "123456789012345678",
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف إعدادات محتوى القنوات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `404 Not Found` - إعدادات محتوى القنوات غير موجودة لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "إعدادات محتوى القنوات غير موجودة لهذا الخادم",
  "error": "CHANNEL_CONTENT_NOT_FOUND_FOR_SERVER"
}
```

---

## ملاحظات مهمة | Important Notes

### هيكل البيانات | Data Structure
- **block_images**: قائمة معرفات القنوات التي يُمنع فيها نشر الصور
- **block_text_messages**: قائمة معرفات القنوات التي يُمنع فيها إرسال الرسائل النصية
- **block_file_attachments**: قائمة معرفات القنوات التي يُمنع فيها إرفاق الملفات
- **block_bot_commands**: قائمة معرفات القنوات التي يُمنع فيها استخدام أوامر البوت

### أمان البيانات | Data Security
- جميع معرفات Discord (الخوادم والقنوات) يجب أن تحتوي على أرقام فقط
- يتم التحقق من صحة البيانات قبل المعالجة
- رسائل الخطأ متوفرة باللغة العربية

### تنسيق التواريخ | Date Format
- جميع التواريخ بتنسيق ISO 8601 (UTC)
- مثال: `2024-01-15T10:30:00Z`

### معالجة الأخطاء | Error Handling
- جميع الأخطاء تُرجع بتنسيق JSON موحد
- تتضمن رسائل خطأ واضحة باللغة العربية
- تحديد الحقل المسبب للخطأ عند الإمكان

### القيم الافتراضية | Default Values
- جميع المصفوفات (block_images, block_text_messages, block_file_attachments, block_bot_commands) تأخذ قيمة افتراضية فارغة `[]` عند الإنشاء

---

## أمثلة شاملة | Complete Examples

### مثال كامل لإنشاء إعدادات محتوى قنوات | Complete Channel Content Settings Creation Example

```bash
# طلب إنشاء إعدادات محتوى قنوات جديدة
curl -X POST http://localhost:3003/api/v1/channel-content \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "block_images": ["987654321098765432", "876543210987654321"],
    "block_text_messages": ["765432109876543210"],
    "block_file_attachments": ["654321098765432109"],
    "block_bot_commands": ["543210987654321098"]
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء إعدادات محتوى القنوات بنجاح",
  "data": {
    "id": 3,
    "server_id": "123456789012345678",
    "block_images": ["987654321098765432", "876543210987654321"],
    "block_text_messages": ["765432109876543210"],
    "block_file_attachments": ["654321098765432109"],
    "block_bot_commands": ["543210987654321098"],
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل لتحديث إعدادات محتوى القنوات | Complete Channel Content Settings Update Example

```bash
# طلب تحديث إعدادات محتوى القنوات
curl -X PUT http://localhost:3003/api/v1/channel-content/server/123456789012345678 \
  -H "Content-Type: application/json" \
  -d '{
    "block_images": ["987654321098765432"],
    "block_bot_commands": []
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم تحديث إعدادات محتوى قنوات الخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "block_images": ["987654321098765432"],
    "block_text_messages": ["765432109876543210"],
    "block_file_attachments": ["654321098765432109"],
    "block_bot_commands": [],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T12:30:00Z"
  }
}
```

### مثال كامل للحصول على إعدادات محتوى قنوات خادم | Complete Server Channel Content Settings Retrieval Example

```bash
# طلب الحصول على إعدادات محتوى قنوات خادم محدد
curl -X GET http://localhost:3003/api/v1/channel-content/server/123456789012345678 \
  -H "Content-Type: application/json"

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم جلب إعدادات محتوى قنوات الخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "block_images": ["987654321098765432"],
    "block_text_messages": ["765432109876543210"],
    "block_file_attachments": ["654321098765432109"],
    "block_bot_commands": [],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T12:30:00Z"
  }
}
```

---

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.