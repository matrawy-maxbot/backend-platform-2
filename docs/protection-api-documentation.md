# توثيق APIs إدارة الحماية
# Protection Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة إعدادات الحماية في النظام. جميع المسارات تبدأ بـ `/api/v1/restful/protection`

This documentation covers all API endpoints related to protection settings management in the system. All routes start with `/api/v1/restful/protection`

---

## 1. الحصول على جميع إعدادات الحماية | Get All Protection Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/protection`
- **الوصف | Description:** الحصول على قائمة بجميع إعدادات الحماية في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/protection?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات الحماية بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "bot_management_enabled": true,
      "disallow_bots": false,
      "delete_repeated_messages": true,
      "moderation_controls_enabled": true,
      "max_punishment_type": "kick",
      "max_kick_ban_limit": 3,
      "bad_words": true,
      "links": false,
      "channels_content": true,
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

## 2. الحصول على إعدادات حماية بواسطة المعرف | Get Protection Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/protection/:id`
- **الوصف | Description:** الحصول على إعدادات حماية محددة بواسطة معرفها
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف إعدادات الحماية (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/protection/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات الحماية بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "bot_management_enabled": true,
    "disallow_bots": false,
    "delete_repeated_messages": true,
    "moderation_controls_enabled": true,
    "max_punishment_type": "kick",
    "max_kick_ban_limit": 3,
    "bad_words": true,
    "links": false,
    "channels_content": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - إعدادات الحماية غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف إعدادات الحماية يجب أن يكون رقماً موجباً",
  "errors": [
    {
      "field": "id",
      "message": "معرف إعدادات الحماية يجب أن يكون رقماً موجباً"
    }
  ]
}
```

---

## 3. الحصول على إعدادات الحماية بواسطة معرف الخادم | Get Protection Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/protection/server/:serverId`
- **الوصف | Description:** الحصول على إعدادات الحماية لخادم محدد
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
GET /api/v1/restful/protection/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب إعدادات حماية الخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "bot_management_enabled": true,
    "disallow_bots": false,
    "delete_repeated_messages": true,
    "moderation_controls_enabled": true,
    "max_punishment_type": "kick",
    "max_kick_ban_limit": 3,
    "bad_words": true,
    "links": false,
    "channels_content": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `404 Not Found` - إعدادات الحماية غير موجودة لهذا الخادم
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

## 4. إنشاء إعدادات حماية جديدة | Create New Protection Settings

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/restful/protection`
- **الوصف | Description:** إنشاء إعدادات حماية جديدة لخادم
- **مستوى الوصول | Access Level:** Private

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|-------|------|-------|------------------|-------|
| server_id | string | نعم | - | معرف الخادم (أرقام فقط، 1-50 حرف) |
| bot_management_enabled | boolean | اختياري | false | تفعيل إدارة البوتات |
| disallow_bots | boolean | اختياري | false | منع البوتات |
| delete_repeated_messages | boolean | اختياري | false | حذف الرسائل المكررة |
| moderation_controls_enabled | boolean | اختياري | false | تفعيل ضوابط الإشراف |
| max_punishment_type | string | اختياري | "kick" | نوع العقوبة القصوى (kick, remove_roles, ban) |
| max_kick_ban_limit | number | اختياري | 1 | حد الطرد والحظر (1-100) |
| bad_words | boolean | اختياري | false | فلتر الكلمات السيئة |
| links | boolean | اختياري | false | فلتر الروابط |
| channels_content | boolean | اختياري | false | فلتر محتوى القنوات |

### قواعد التحقق | Validation Rules
- `server_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف
- `max_punishment_type`: يجب أن يكون أحد القيم: kick, remove_roles, ban
- `max_kick_ban_limit`: رقم صحيح بين 1-100
- جميع الحقول المنطقية يجب أن تكون true أو false

### مثال على الطلب | Request Example
```http
POST /api/v1/restful/protection
Content-Type: application/json

{
  "server_id": "123456789012345678",
  "bot_management_enabled": true,
  "disallow_bots": false,
  "delete_repeated_messages": true,
  "moderation_controls_enabled": true,
  "max_punishment_type": "kick",
  "max_kick_ban_limit": 3,
  "bad_words": true,
  "links": false,
  "channels_content": true
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء إعدادات الحماية بنجاح",
  "data": {
    "id": 2,
    "server_id": "123456789012345678",
    "bot_management_enabled": true,
    "disallow_bots": false,
    "delete_repeated_messages": true,
    "moderation_controls_enabled": true,
    "max_punishment_type": "kick",
    "max_kick_ban_limit": 3,
    "bad_words": true,
    "links": false,
    "channels_content": true,
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء إعدادات الحماية بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `409 Conflict` - إعدادات الحماية موجودة مسبقاً لهذا الخادم
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
      "field": "max_punishment_type",
      "message": "نوع العقوبة يجب أن يكون أحد القيم التالية: kick, remove_roles, ban"
    }
  ]
}
```

---

## 5. تحديث إعدادات الحماية بواسطة المعرف | Update Protection Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/restful/protection/:id`
- **الوصف | Description:** تحديث إعدادات حماية موجودة بواسطة معرفها
- **مستوى الوصول | Access Level:** Private

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف إعدادات الحماية (رقم صحيح موجب) |

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| bot_management_enabled | boolean | اختياري | تفعيل إدارة البوتات |
| disallow_bots | boolean | اختياري | منع البوتات |
| delete_repeated_messages | boolean | اختياري | حذف الرسائل المكررة |
| moderation_controls_enabled | boolean | اختياري | تفعيل ضوابط الإشراف |
| max_punishment_type | string | اختياري | نوع العقوبة القصوى (kick, remove_roles, ban) |
| max_kick_ban_limit | number | اختياري | حد الطرد والحظر (1-100) |
| bad_words | boolean | اختياري | فلتر الكلمات السيئة |
| links | boolean | اختياري | فلتر الروابط |
| channels_content | boolean | اختياري | فلتر محتوى القنوات |

### قواعد التحقق | Validation Rules
- يجب تقديم حقل واحد على الأقل للتحديث
- `max_punishment_type`: يجب أن يكون أحد القيم: kick, remove_roles, ban
- `max_kick_ban_limit`: رقم صحيح بين 1-100

### مثال على الطلب | Request Example
```http
PUT /api/v1/restful/protection/1
Content-Type: application/json

{
  "bot_management_enabled": false,
  "max_punishment_type": "ban",
  "max_kick_ban_limit": 5,
  "bad_words": true
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث إعدادات الحماية بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "bot_management_enabled": false,
    "disallow_bots": false,
    "delete_repeated_messages": true,
    "moderation_controls_enabled": true,
    "max_punishment_type": "ban",
    "max_kick_ban_limit": 5,
    "bad_words": true,
    "links": false,
    "channels_content": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T11:45:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث إعدادات الحماية بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `404 Not Found` - إعدادات الحماية غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

---

## 6. تحديث إعدادات الحماية بواسطة معرف الخادم | Update Protection Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/restful/protection/server/:serverId`
- **الوصف | Description:** تحديث إعدادات حماية موجودة بواسطة معرف الخادم
- **مستوى الوصول | Access Level:** Private

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### بيانات الطلب | Request Body
نفس بيانات الطلب في التحديث بواسطة المعرف

### مثال على الطلب | Request Example
```http
PUT /api/v1/restful/protection/server/123456789012345678
Content-Type: application/json

{
  "moderation_controls_enabled": false,
  "links": true,
  "channels_content": false
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث إعدادات حماية الخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "bot_management_enabled": true,
    "disallow_bots": false,
    "delete_repeated_messages": true,
    "moderation_controls_enabled": false,
    "max_punishment_type": "kick",
    "max_kick_ban_limit": 3,
    "bad_words": true,
    "links": true,
    "channels_content": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T12:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث إعدادات الحماية بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `404 Not Found` - إعدادات الحماية غير موجودة لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

---

## 7. حذف إعدادات الحماية بواسطة المعرف | Delete Protection Settings by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/protection/:id`
- **الوصف | Description:** حذف إعدادات حماية من النظام بواسطة معرفها
- **مستوى الوصول | Access Level:** Private

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف إعدادات الحماية (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/protection/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف إعدادات الحماية بنجاح",
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف إعدادات الحماية بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - إعدادات الحماية غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

---

## 8. حذف إعدادات الحماية بواسطة معرف الخادم | Delete Protection Settings by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/protection/server/:serverId`
- **الوصف | Description:** حذف إعدادات حماية من النظام بواسطة معرف الخادم
- **مستوى الوصول | Access Level:** Private

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/protection/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف إعدادات حماية الخادم بنجاح",
  "data": {
    "server_id": "123456789012345678",
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف إعدادات الحماية بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `404 Not Found` - إعدادات الحماية غير موجودة لهذا الخادم
- `500 Internal Server Error` - خطأ في الخادم

---

## ملاحظات مهمة | Important Notes

### أقسام إعدادات الحماية | Protection Settings Sections

#### 1. قسم إدارة البوتات | Bot Management Section
- `bot_management_enabled`: تفعيل أو إلغاء تفعيل إدارة البوتات
- `disallow_bots`: منع البوتات من الدخول للخادم
- `delete_repeated_messages`: حذف الرسائل المكررة تلقائياً

#### 2. قسم ضوابط الإشراف | Moderation Controls Section
- `moderation_controls_enabled`: تفعيل أو إلغاء تفعيل ضوابط الإشراف
- `max_punishment_type`: نوع العقوبة القصوى (kick, remove_roles, ban)
- `max_kick_ban_limit`: عدد المخالفات المسموح بها قبل تطبيق العقوبة القصوى

#### 3. مفاتيح تصفية المحتوى | Content Filtering Toggles
- `bad_words`: تفعيل فلتر الكلمات السيئة
- `links`: تفعيل فلتر الروابط
- `channels_content`: تفعيل فلتر محتوى القنوات

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

### مثال كامل لإنشاء إعدادات حماية | Complete Protection Settings Creation Example

```bash
# طلب إنشاء إعدادات حماية جديدة
curl -X POST http://localhost:3003/api/v1/restful/protection \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "bot_management_enabled": true,
    "disallow_bots": false,
    "delete_repeated_messages": true,
    "moderation_controls_enabled": true,
    "max_punishment_type": "kick",
    "max_kick_ban_limit": 3,
    "bad_words": true,
    "links": false,
    "channels_content": true
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء إعدادات الحماية بنجاح",
  "data": {
    "id": 2,
    "server_id": "123456789012345678",
    "bot_management_enabled": true,
    "disallow_bots": false,
    "delete_repeated_messages": true,
    "moderation_controls_enabled": true,
    "max_punishment_type": "kick",
    "max_kick_ban_limit": 3,
    "bad_words": true,
    "links": false,
    "channels_content": true,
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل لتحديث إعدادات الحماية | Complete Protection Settings Update Example

```bash
# طلب تحديث إعدادات حماية موجودة
curl -X PUT http://localhost:3003/api/v1/restful/protection/server/123456789012345678 \
  -H "Content-Type: application/json" \
  -d '{
    "moderation_controls_enabled": false,
    "max_punishment_type": "ban",
    "links": true
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم تحديث إعدادات حماية الخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "bot_management_enabled": true,
    "disallow_bots": false,
    "delete_repeated_messages": true,
    "moderation_controls_enabled": false,
    "max_punishment_type": "ban",
    "max_kick_ban_limit": 3,
    "bad_words": true,
    "links": true,
    "channels_content": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T12:30:00Z"
  }
}
```

### مثال كامل للحصول على إعدادات حماية خادم | Complete Server Protection Settings Retrieval Example

```bash
# طلب الحصول على إعدادات حماية خادم محدد
curl -X GET http://localhost:3003/api/v1/restful/protection/server/123456789012345678 \
  -H "Content-Type: application/json"

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم جلب إعدادات حماية الخادم بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "bot_management_enabled": true,
    "disallow_bots": false,
    "delete_repeated_messages": true,
    "moderation_controls_enabled": true,
    "max_punishment_type": "kick",
    "max_kick_ban_limit": 3,
    "bad_words": true,
    "links": false,
    "channels_content": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.