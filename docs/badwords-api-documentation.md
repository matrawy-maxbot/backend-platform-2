# توثيق APIs إدارة الكلمات السيئة
# Bad Words Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة الكلمات السيئة في النظام. جميع المسارات تبدأ بـ `/api/v1/badwords`

This documentation covers all API endpoints related to bad words management in the system. All routes start with `/api/v1/badwords`

---

## 1. الحصول على جميع إعدادات الكلمات السيئة | Get All Bad Words Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/badwords`
- **الوصف | Description:** الحصول على قائمة بجميع إعدادات الكلمات السيئة في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |

### مثال على الطلب | Request Example
```http
GET /api/v1/badwords?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات الكلمات السيئة بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "words": ["كلمة1", "كلمة2", "كلمة3"],
      "punishment_type": "warn",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "server_id": "987654321098765432",
      "words": ["badword1", "badword2"],
      "punishment_type": "mute",
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

## 2. الحصول على إعدادات الكلمات السيئة بواسطة المعرف | Get Bad Words Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/badwords/:id`
- **الوصف | Description:** الحصول على إعدادات كلمات سيئة محددة بواسطة معرفها
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف إعدادات الكلمات السيئة (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
GET /api/v1/badwords/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات الكلمات السيئة بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "words": ["كلمة1", "كلمة2", "كلمة3"],
    "punishment_type": "warn",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - الإعدادات غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "يجب أن يكون المعرف رقماً موجباً",
  "errors": [
    {
      "field": "id",
      "message": "يجب أن يكون المعرف رقماً موجباً"
    }
  ]
}
```

---

## 3. الحصول على إعدادات الكلمات السيئة بواسطة معرف الخادم | Get Bad Words Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/badwords/server/:serverId`
- **الوصف | Description:** الحصول على إعدادات الكلمات السيئة لخادم محدد
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
GET /api/v1/badwords/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات الكلمات السيئة للخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "words": ["كلمة1", "كلمة2", "كلمة3"],
    "punishment_type": "warn",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `404 Not Found` - لا توجد إعدادات لهذا الخادم
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

## 4. إنشاء إعدادات كلمات سيئة جديدة | Create New Bad Words Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/badwords`
- **الوصف | Description:** إنشاء إعدادات كلمات سيئة جديدة لخادم
- **مستوى الوصول | Access Level:** Public

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| server_id | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |
| words | array | اختياري | قائمة الكلمات المحظورة (0-500 كلمة، كل كلمة 1-100 حرف) |
| punishment_type | string | اختياري | نوع العقوبة (warn/none/mute/kick/ban) - افتراضي: warn |

### قواعد التحقق | Validation Rules
- `server_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف
- `words`: مصفوفة من النصوص، كل كلمة 1-100 حرف، الحد الأقصى 500 كلمة
- `punishment_type`: يجب أن يكون أحد القيم: warn, none, mute, kick, ban

### مثال على الطلب | Request Example
```http
POST /api/v1/badwords
Content-Type: application/json

{
  "server_id": "123456789012345678",
  "words": ["كلمة1", "كلمة2", "badword"],
  "punishment_type": "warn"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء إعدادات الكلمات السيئة بنجاح",
  "data": {
    "id": 3,
    "server_id": "123456789012345678",
    "words": ["كلمة1", "كلمة2", "badword"],
    "punishment_type": "warn",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء الإعدادات بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `409 Conflict` - إعدادات موجودة مسبقاً لهذا الخادم
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
      "field": "punishment_type",
      "message": "نوع العقوبة يجب أن يكون أحد القيم التالية: warn, none, mute, kick, ban"
    }
  ]
}
```

---

## 5. تحديث إعدادات الكلمات السيئة | Update Bad Words Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/badwords/:id`
- **الوصف | Description:** تحديث إعدادات الكلمات السيئة بواسطة المعرف
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف إعدادات الكلمات السيئة (رقم صحيح موجب) |

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| words | array | اختياري | قائمة الكلمات المحظورة (0-500 كلمة، كل كلمة 1-100 حرف) |
| punishment_type | string | اختياري | نوع العقوبة (warn/none/mute/kick/ban) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً
- يجب تقديم حقل واحد على الأقل للتحديث
- `words`: مصفوفة من النصوص، كل كلمة 1-100 حرف، الحد الأقصى 500 كلمة
- `punishment_type`: يجب أن يكون أحد القيم: warn, none, mute, kick, ban

### مثال على الطلب | Request Example
```http
PUT /api/v1/badwords/1
Content-Type: application/json

{
  "words": ["كلمة محدثة", "كلمة جديدة"],
  "punishment_type": "mute"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث إعدادات الكلمات السيئة بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "words": ["كلمة محدثة", "كلمة جديدة"],
    "punishment_type": "mute",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T11:45:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث الإعدادات بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `404 Not Found` - الإعدادات غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

---

## 6. تحديث إعدادات الكلمات السيئة بواسطة معرف الخادم | Update Bad Words Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/badwords/server/:serverId`
- **الوصف | Description:** تحديث إعدادات الكلمات السيئة بواسطة معرف الخادم
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| words | array | اختياري | قائمة الكلمات المحظورة (0-500 كلمة، كل كلمة 1-100 حرف) |
| punishment_type | string | اختياري | نوع العقوبة (warn/none/mute/kick/ban) |

### قواعد التحقق | Validation Rules
- `serverId` يجب أن يحتوي على أرقام فقط، طول 1-50 حرف
- يجب تقديم حقل واحد على الأقل للتحديث
- `words`: مصفوفة من النصوص، كل كلمة 1-100 حرف، الحد الأقصى 500 كلمة
- `punishment_type`: يجب أن يكون أحد القيم: warn, none, mute, kick, ban

### مثال على الطلب | Request Example
```http
PUT /api/v1/badwords/server/123456789012345678
Content-Type: application/json

{
  "punishment_type": "kick"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث إعدادات الكلمات السيئة للخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "words": ["كلمة1", "كلمة2", "كلمة3"],
    "punishment_type": "kick",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T12:00:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث الإعدادات بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `404 Not Found` - لا توجد إعدادات لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

---

## 7. حذف إعدادات الكلمات السيئة | Delete Bad Words Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/badwords/:id`
- **الوصف | Description:** حذف إعدادات الكلمات السيئة من النظام
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف إعدادات الكلمات السيئة (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
DELETE /api/v1/badwords/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف إعدادات الكلمات السيئة بنجاح",
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف الإعدادات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - الإعدادات غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

---

## 8. حذف إعدادات الكلمات السيئة بواسطة معرف الخادم | Delete Bad Words Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/badwords/server/:serverId`
- **الوصف | Description:** حذف إعدادات الكلمات السيئة بواسطة معرف الخادم
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `serverId` يجب أن يحتوي على أرقام فقط، طول 1-50 حرف

### مثال على الطلب | Request Example
```http
DELETE /api/v1/badwords/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف إعدادات الكلمات السيئة للخادم بنجاح",
  "data": {
    "server_id": "123456789012345678",
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف الإعدادات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `404 Not Found` - لا توجد إعدادات لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

---

## ملاحظات مهمة | Important Notes

### أنواع العقوبات | Punishment Types
- **warn**: تحذير المستخدم
- **none**: عدم اتخاذ أي إجراء
- **mute**: كتم المستخدم
- **kick**: طرد المستخدم من الخادم
- **ban**: حظر المستخدم من الخادم

### قيود الكلمات | Word Limitations
- الحد الأقصى: 500 كلمة لكل خادم
- طول الكلمة: 1-100 حرف
- يتم حفظ الكلمات كما هي (حساسة لحالة الأحرف)

### أمان البيانات | Data Security
- جميع معرفات Discord يجب أن تحتوي على أرقام فقط
- يتم التحقق من صحة البيانات قبل المعالجة
- رسائل الخطأ متوفرة باللغة العربية

### تنسيق التواريخ | Date Format
- جميع التواريخ بتنسيق ISO 8601 (UTC)
- مثال: `2024-01-15T10:30:00Z`

### معالجة الأخطاء | Error Handling
- جميع الأخطاء تُرجع بتنسيق JSON موحد
- تتضمن رسائل خطأ واضحة باللغة العربية
- تحديد الحقل المسبب للخطأ عند الإمكان

---

## أمثلة شاملة | Complete Examples

### مثال كامل لإنشاء إعدادات كلمات سيئة | Complete Bad Words Settings Creation Example

```bash
# طلب إنشاء إعدادات كلمات سيئة جديدة
curl -X POST http://localhost:3003/api/v1/badwords \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "words": ["كلمة سيئة", "badword", "inappropriate"],
    "punishment_type": "warn"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء إعدادات الكلمات السيئة بنجاح",
  "data": {
    "id": 3,
    "server_id": "123456789012345678",
    "words": ["كلمة سيئة", "badword", "inappropriate"],
    "punishment_type": "warn",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل لتحديث إعدادات بواسطة معرف الخادم | Complete Server Settings Update Example

```bash
# طلب تحديث إعدادات الكلمات السيئة لخادم محدد
curl -X PUT http://localhost:3003/api/v1/badwords/server/123456789012345678 \
  -H "Content-Type: application/json" \
  -d '{
    "words": ["كلمة محدثة", "updated word"],
    "punishment_type": "mute"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم تحديث إعدادات الكلمات السيئة للخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "words": ["كلمة محدثة", "updated word"],
    "punishment_type": "mute",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T12:00:00Z"
  }
}
```

### مثال كامل للحصول على إعدادات خادم | Complete Server Settings Retrieval Example

```bash
# طلب الحصول على إعدادات الكلمات السيئة لخادم محدد
curl -X GET http://localhost:3003/api/v1/badwords/server/123456789012345678 \
  -H "Content-Type: application/json"

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم جلب إعدادات الكلمات السيئة للخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "words": ["كلمة1", "كلمة2", "كلمة3"],
    "punishment_type": "warn",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.