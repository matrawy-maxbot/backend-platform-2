# توثيق APIs إدارة الروابط
# Links Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة قواعد الروابط في النظام. جميع المسارات تبدأ بـ `/api/v1/restful/links`

This documentation covers all API endpoints related to links management in the system. All routes start with `/api/v1/restful/links`

---

## 1. الحصول على جميع قواعد الروابط | Get All Links

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/links`
- **الوصف | Description:** الحصول على قائمة بجميع قواعد الروابط في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/links?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب قواعد الروابط بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "link_or_keyword": "discord.gg",
      "action_type": "delete",
      "channels": ["987654321098765432", "876543210987654321"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "server_id": "123456789012345678",
      "link_or_keyword": "https://example.com",
      "action_type": "allow",
      "channels": [],
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

## 2. الحصول على قاعدة رابط بواسطة المعرف | Get Link by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/links/:id`
- **الوصف | Description:** الحصول على قاعدة رابط محددة بواسطة معرفها
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف قاعدة الرابط (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/links/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب قاعدة الرابط بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "link_or_keyword": "discord.gg",
    "action_type": "delete",
    "channels": ["987654321098765432", "876543210987654321"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - قاعدة الرابط غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف قاعدة الرابط يجب أن يكون رقماً موجباً",
  "errors": [
    {
      "field": "id",
      "message": "معرف قاعدة الرابط يجب أن يكون رقماً موجباً"
    }
  ]
}
```

---

## 3. الحصول على قواعد الروابط بواسطة معرف الخادم | Get Links by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/links/server/:serverId`
- **الوصف | Description:** الحصول على جميع قواعد الروابط لخادم محدد
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
GET /api/v1/restful/links/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب قواعد روابط الخادم بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "link_or_keyword": "discord.gg",
      "action_type": "delete",
      "channels": ["987654321098765432"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "server_id": "123456789012345678",
      "link_or_keyword": "https://example.com",
      "action_type": "allow",
      "channels": [],
      "created_at": "2024-01-16T14:20:00Z",
      "updated_at": "2024-01-16T14:20:00Z"
    }
  ],
  "count": 2
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
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

## 4. إنشاء قاعدة رابط جديدة | Create New Link Rule

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/restful/links`
- **الوصف | Description:** إنشاء قاعدة رابط جديدة في النظام
- **مستوى الوصول | Access Level:** Public

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| server_id | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |
| link_or_keyword | string | نعم | الرابط أو الكلمة المفتاحية (1-500 حرف) |
| action_type | string | اختياري | نوع الإجراء (allow/delete/kick/ban) - افتراضي: delete |
| channels | array | اختياري | قائمة معرفات القنوات المطبق عليها القاعدة - افتراضي: [] |

### قواعد التحقق | Validation Rules
- `server_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف
- `link_or_keyword`: نص غير فارغ، طول 1-500 حرف
- `action_type`: يجب أن يكون أحد القيم: allow, delete, kick, ban
- `channels`: مصفوفة من النصوص، كل عنصر طوله 1-50 حرف
- لا يمكن أن تحتوي الحقول على مسافات إضافية

### مثال على الطلب | Request Example
```http
POST /api/v1/restful/links
Content-Type: application/json

{
  "server_id": "123456789012345678",
  "link_or_keyword": "discord.gg",
  "action_type": "delete",
  "channels": ["987654321098765432", "876543210987654321"]
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء قاعدة الرابط بنجاح",
  "data": {
    "id": 3,
    "server_id": "123456789012345678",
    "link_or_keyword": "discord.gg",
    "action_type": "delete",
    "channels": ["987654321098765432", "876543210987654321"],
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء قاعدة الرابط بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `409 Conflict` - قاعدة الرابط موجودة مسبقاً
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
      "field": "link_or_keyword",
      "message": "الرابط أو الكلمة المفتاحية مطلوب"
    },
    {
      "field": "action_type",
      "message": "نوع الإجراء يجب أن يكون أحد القيم التالية: allow, delete, kick, ban"
    }
  ]
}
```

---

## 5. تحديث قاعدة الرابط | Update Link Rule

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/restful/links/:id`
- **الوصف | Description:** تحديث قاعدة رابط موجودة في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف قاعدة الرابط (رقم صحيح موجب) |

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| link_or_keyword | string | اختياري | الرابط أو الكلمة المفتاحية (1-500 حرف) |
| action_type | string | اختياري | نوع الإجراء (allow/delete/kick/ban) |
| channels | array | اختياري | قائمة معرفات القنوات المطبق عليها القاعدة |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً
- `link_or_keyword`: نص غير فارغ، طول 1-500 حرف (إذا تم تقديمه)
- `action_type`: يجب أن يكون أحد القيم: allow, delete, kick, ban (إذا تم تقديمه)
- `channels`: مصفوفة من النصوص، كل عنصر طوله 1-50 حرف (إذا تم تقديمها)
- يجب تقديم حقل واحد على الأقل للتحديث

### مثال على الطلب | Request Example
```http
PUT /api/v1/restful/links/1
Content-Type: application/json

{
  "action_type": "ban",
  "channels": ["987654321098765432"]
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث قاعدة الرابط بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "link_or_keyword": "discord.gg",
    "action_type": "ban",
    "channels": ["987654321098765432"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث قاعدة الرابط بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو معرف غير صحيح
- `404 Not Found` - قاعدة الرابط غير موجودة
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

```json
{
  "success": false,
  "message": "قاعدة الرابط غير موجودة",
  "error": "LINK_NOT_FOUND"
}
```

---

## 6. حذف قاعدة الرابط | Delete Link Rule

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/links/:id`
- **الوصف | Description:** حذف قاعدة رابط من النظام
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف قاعدة الرابط (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/links/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف قاعدة الرابط بنجاح",
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف قاعدة الرابط بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - قاعدة الرابط غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "قاعدة الرابط غير موجودة",
  "error": "LINK_NOT_FOUND"
}
```

---

## ملاحظات مهمة | Important Notes

### أنواع الإجراءات | Action Types
- **allow**: السماح بالرابط أو الكلمة المفتاحية
- **delete**: حذف الرسالة التي تحتوي على الرابط أو الكلمة المفتاحية
- **kick**: طرد العضو الذي أرسل الرابط أو الكلمة المفتاحية
- **ban**: حظر العضو الذي أرسل الرابط أو الكلمة المفتاحية

### إدارة القنوات | Channel Management
- إذا كانت قائمة `channels` فارغة، فإن القاعدة تطبق على جميع قنوات الخادم
- إذا تم تحديد قنوات معينة، فإن القاعدة تطبق فقط على هذه القنوات
- معرفات القنوات يجب أن تكون صحيحة ومن نفس الخادم

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

### مثال كامل لإنشاء قاعدة رابط | Complete Link Rule Creation Example

```bash
# طلب إنشاء قاعدة رابط جديدة
curl -X POST http://localhost:3003/api/v1/restful/links \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "link_or_keyword": "discord.gg",
    "action_type": "delete",
    "channels": ["987654321098765432", "876543210987654321"]
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء قاعدة الرابط بنجاح",
  "data": {
    "id": 3,
    "server_id": "123456789012345678",
    "link_or_keyword": "discord.gg",
    "action_type": "delete",
    "channels": ["987654321098765432", "876543210987654321"],
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل لتحديث قاعدة رابط | Complete Link Rule Update Example

```bash
# طلب تحديث قاعدة رابط موجودة
curl -X PUT http://localhost:3003/api/v1/restful/links/1 \
  -H "Content-Type: application/json" \
  -d '{
    "action_type": "ban",
    "channels": ["987654321098765432"]
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم تحديث قاعدة الرابط بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "link_or_keyword": "discord.gg",
    "action_type": "ban",
    "channels": ["987654321098765432"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل للحصول على قواعد روابط خادم | Complete Server Links Retrieval Example

```bash
# طلب الحصول على قواعد روابط خادم محدد
curl -X GET http://localhost:3003/api/v1/restful/links/server/123456789012345678 \
  -H "Content-Type: application/json"

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم جلب قواعد روابط الخادم بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "link_or_keyword": "discord.gg",
      "action_type": "ban",
      "channels": ["987654321098765432"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-17T09:15:00Z"
    },
    {
      "id": 2,
      "server_id": "123456789012345678",
      "link_or_keyword": "https://example.com",
      "action_type": "allow",
      "channels": [],
      "created_at": "2024-01-16T14:20:00Z",
      "updated_at": "2024-01-16T14:20:00Z"
    }
  ],
  "count": 2
}
```

### مثال كامل لحذف قاعدة رابط | Complete Link Rule Deletion Example

```bash
# طلب حذف قاعدة رابط
curl -X DELETE http://localhost:3003/api/v1/restful/links/1 \
  -H "Content-Type: application/json"

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم حذف قاعدة الرابط بنجاح",
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

---

## حالات الاستخدام الشائعة | Common Use Cases

### 1. حظر جميع روابط Discord في خادم معين
```json
{
  "server_id": "123456789012345678",
  "link_or_keyword": "discord.gg",
  "action_type": "delete",
  "channels": []
}
```

### 2. السماح برابط معين في قناة محددة فقط
```json
{
  "server_id": "123456789012345678",
  "link_or_keyword": "https://mywebsite.com",
  "action_type": "allow",
  "channels": ["987654321098765432"]
}
```

### 3. حظر كلمة مفتاحية مع طرد العضو
```json
{
  "server_id": "123456789012345678",
  "link_or_keyword": "spam",
  "action_type": "kick",
  "channels": []
}
```

### 4. حظر نطاق معين مع حظر العضو
```json
{
  "server_id": "123456789012345678",
  "link_or_keyword": "malicious-site.com",
  "action_type": "ban",
  "channels": []
}
```

---

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.