# توثيق APIs إدارة النسخ الاحتياطية
# Backup Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة النسخ الاحتياطية في النظام. جميع المسارات تبدأ بـ `/api/v1/backup`

This documentation covers all API endpoints related to backup management in the system. All routes start with `/api/v1/backup`

---

## 1. الحصول على جميع النسخ الاحتياطية | Get All Backups

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/backup`
- **الوصف | Description:** الحصول على قائمة بجميع النسخ الاحتياطية في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |

### مثال على الطلب | Request Example
```http
GET /api/v1/backup?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب النسخ الاحتياطية بنجاح",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "server_id": "123456789012345678",
      "server_settings": {
        "name": "My Discord Server",
        "description": "Server description",
        "icon": "server_icon_url"
      },
      "channels": [
        {
          "id": "987654321098765432",
          "name": "general",
          "type": "text"
        }
      ],
      "roles": [
        {
          "id": "876543210987654321",
          "name": "Admin",
          "permissions": ["ADMINISTRATOR"]
        }
      ],
      "created_by": "555666777888999000",
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

## 2. الحصول على نسخة احتياطية بواسطة المعرف | Get Backup by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/backup/:id`
- **الوصف | Description:** الحصول على نسخة احتياطية محددة بواسطة معرفها
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف النسخة الاحتياطية (MongoDB ObjectId) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون معرف MongoDB صحيح (24 حرف hex)
- نمط التحقق: `/^[0-9a-fA-F]{24}$/`

### مثال على الطلب | Request Example
```http
GET /api/v1/backup/64f8a1b2c3d4e5f6a7b8c9d0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب النسخة الاحتياطية بنجاح",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "server_id": "123456789012345678",
    "server_settings": {
      "name": "My Discord Server",
      "description": "Server description",
      "icon": "server_icon_url",
      "verification_level": 2,
      "default_message_notifications": 0
    },
    "channels": [
      {
        "id": "987654321098765432",
        "name": "general",
        "type": "text",
        "position": 0,
        "topic": "General discussion"
      },
      {
        "id": "876543210987654321",
        "name": "voice-channel",
        "type": "voice",
        "position": 1,
        "bitrate": 64000
      }
    ],
    "roles": [
      {
        "id": "765432109876543210",
        "name": "@everyone",
        "permissions": ["VIEW_CHANNEL", "SEND_MESSAGES"],
        "color": 0,
        "position": 0
      },
      {
        "id": "654321098765432109",
        "name": "Admin",
        "permissions": ["ADMINISTRATOR"],
        "color": 16711680,
        "position": 1
      }
    ],
    "created_by": "555666777888999000",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - النسخة الاحتياطية غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف النسخة الاحتياطية يجب أن يكون معرف MongoDB صحيح",
  "errors": [
    {
      "field": "id",
      "message": "معرف النسخة الاحتياطية يجب أن يكون معرف MongoDB صحيح"
    }
  ]
}
```

---

## 3. الحصول على النسخ الاحتياطية بواسطة معرف الخادم | Get Backups by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/backup/server/:serverId`
- **الوصف | Description:** الحصول على جميع النسخ الاحتياطية لخادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `serverId` يجب أن يحتوي على أرقام فقط
- نمط التحقق: `/^\d+$/`
- الطول بين 1-50 حرف
- لا يمكن أن يحتوي على مسافات إضافية

### مثال على الطلب | Request Example
```http
GET /api/v1/backup/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب النسخ الاحتياطية بنجاح",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "server_id": "123456789012345678",
      "server_settings": {
        "name": "My Discord Server",
        "description": "Server backup from January"
      },
      "channels": [
        {
          "id": "987654321098765432",
          "name": "general",
          "type": "text"
        }
      ],
      "roles": [
        {
          "id": "876543210987654321",
          "name": "Admin",
          "permissions": ["ADMINISTRATOR"]
        }
      ],
      "created_by": "555666777888999000",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "server_id": "123456789012345678",
      "server_settings": {
        "name": "My Discord Server",
        "description": "Server backup from February"
      },
      "channels": [
        {
          "id": "987654321098765432",
          "name": "general",
          "type": "text"
        },
        {
          "id": "876543210987654321",
          "name": "announcements",
          "type": "text"
        }
      ],
      "roles": [
        {
          "id": "765432109876543210",
          "name": "Admin",
          "permissions": ["ADMINISTRATOR"]
        },
        {
          "id": "654321098765432109",
          "name": "Moderator",
          "permissions": ["MANAGE_MESSAGES"]
        }
      ],
      "created_by": "555666777888999000",
      "created_at": "2024-02-15T14:20:00Z",
      "updated_at": "2024-02-15T14:20:00Z"
    }
  ]
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

## 4. إنشاء نسخة احتياطية جديدة | Create New Backup

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/backup`
- **الوصف | Description:** إنشاء نسخة احتياطية جديدة للخادم
- **مستوى الوصول | Access Level:** Public

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| server_id | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |
| server_settings | object | اختياري | إعدادات الخادم (افتراضي: {}) |
| channels | array | اختياري | قائمة القنوات (افتراضي: []) |
| roles | array | اختياري | قائمة الأدوار (افتراضي: []) |
| created_by | string | اختياري | معرف المنشئ (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `server_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف، مطلوب
- `server_settings`: كائن، اختياري، افتراضي `{}`
- `channels`: مصفوفة من الكائنات، اختياري، افتراضي `[]`
- `roles`: مصفوفة من الكائنات، اختياري، افتراضي `[]`
- `created_by`: نص يحتوي على أرقام فقط، طول 1-50 حرف، اختياري، افتراضي `null`
- لا يمكن أن تحتوي الحقول النصية على مسافات إضافية

### مثال على الطلب | Request Example
```http
POST /api/v1/backup
Content-Type: application/json

{
  "server_id": "123456789012345678",
  "server_settings": {
    "name": "My Discord Server",
    "description": "A great Discord server for gaming",
    "icon": "https://cdn.discordapp.com/icons/123456789012345678/icon.png",
    "verification_level": 2,
    "default_message_notifications": 0,
    "explicit_content_filter": 1
  },
  "channels": [
    {
      "id": "987654321098765432",
      "name": "general",
      "type": "text",
      "position": 0,
      "topic": "General discussion for all members",
      "nsfw": false,
      "rate_limit_per_user": 0
    },
    {
      "id": "876543210987654321",
      "name": "voice-general",
      "type": "voice",
      "position": 1,
      "bitrate": 64000,
      "user_limit": 0
    },
    {
      "id": "765432109876543210",
      "name": "announcements",
      "type": "text",
      "position": 2,
      "topic": "Important server announcements",
      "nsfw": false
    }
  ],
  "roles": [
    {
      "id": "654321098765432109",
      "name": "@everyone",
      "permissions": ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
      "color": 0,
      "position": 0,
      "mentionable": false,
      "hoist": false
    },
    {
      "id": "543210987654321098",
      "name": "Admin",
      "permissions": ["ADMINISTRATOR"],
      "color": 16711680,
      "position": 2,
      "mentionable": true,
      "hoist": true
    },
    {
      "id": "432109876543210987",
      "name": "Moderator",
      "permissions": ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"],
      "color": 3447003,
      "position": 1,
      "mentionable": true,
      "hoist": true
    }
  ],
  "created_by": "555666777888999000"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء النسخة الاحتياطية بنجاح",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "server_id": "123456789012345678",
    "server_settings": {
      "name": "My Discord Server",
      "description": "A great Discord server for gaming",
      "icon": "https://cdn.discordapp.com/icons/123456789012345678/icon.png",
      "verification_level": 2,
      "default_message_notifications": 0,
      "explicit_content_filter": 1
    },
    "channels": [
      {
        "id": "987654321098765432",
        "name": "general",
        "type": "text",
        "position": 0,
        "topic": "General discussion for all members",
        "nsfw": false,
        "rate_limit_per_user": 0
      },
      {
        "id": "876543210987654321",
        "name": "voice-general",
        "type": "voice",
        "position": 1,
        "bitrate": 64000,
        "user_limit": 0
      },
      {
        "id": "765432109876543210",
        "name": "announcements",
        "type": "text",
        "position": 2,
        "topic": "Important server announcements",
        "nsfw": false
      }
    ],
    "roles": [
      {
        "id": "654321098765432109",
        "name": "@everyone",
        "permissions": ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
        "color": 0,
        "position": 0,
        "mentionable": false,
        "hoist": false
      },
      {
        "id": "543210987654321098",
        "name": "Admin",
        "permissions": ["ADMINISTRATOR"],
        "color": 16711680,
        "position": 2,
        "mentionable": true,
        "hoist": true
      },
      {
        "id": "432109876543210987",
        "name": "Moderator",
        "permissions": ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"],
        "color": 3447003,
        "position": 1,
        "mentionable": true,
        "hoist": true
      }
    ],
    "created_by": "555666777888999000",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء النسخة الاحتياطية بنجاح
- `400 Bad Request` - بيانات غير صحيحة
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
      "field": "server_id",
      "message": "معرف الخادم مطلوب"
    }
  ]
}
```

```json
{
  "success": false,
  "message": "إعدادات الخادم يجب أن تكون كائناً",
  "errors": [
    {
      "field": "server_settings",
      "message": "إعدادات الخادم يجب أن تكون كائناً"
    }
  ]
}
```

---

## 5. حذف النسخة الاحتياطية | Delete Backup

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/backup/:id`
- **الوصف | Description:** حذف نسخة احتياطية من النظام
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف النسخة الاحتياطية (MongoDB ObjectId) |

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `id` (في المسار): يجب أن يكون معرف MongoDB صحيح (24 حرف hex)
- `serverId` (في الجسم): نص يحتوي على أرقام فقط، طول 1-50 حرف، مطلوب
- نمط التحقق للمعرف: `/^[0-9a-fA-F]{24}$/`
- نمط التحقق لمعرف الخادم: `/^\d+$/`

### مثال على الطلب | Request Example
```http
DELETE /api/v1/backup/64f8a1b2c3d4e5f6a7b8c9d0
Content-Type: application/json

{
  "serverId": "123456789012345678"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف النسخة الاحتياطية بنجاح",
  "data": null
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف النسخة الاحتياطية بنجاح
- `400 Bad Request` - معرف غير صحيح أو بيانات غير صحيحة
- `404 Not Found` - النسخة الاحتياطية غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف النسخة الاحتياطية يجب أن يكون معرف MongoDB صحيح",
  "errors": [
    {
      "field": "id",
      "message": "معرف النسخة الاحتياطية يجب أن يكون معرف MongoDB صحيح"
    }
  ]
}
```

```json
{
  "success": false,
  "message": "معرف الخادم مطلوب",
  "errors": [
    {
      "field": "serverId",
      "message": "معرف الخادم مطلوب"
    }
  ]
}
```

```json
{
  "success": false,
  "message": "النسخة الاحتياطية غير موجودة",
  "error": "BACKUP_NOT_FOUND"
}
```

---

## ملاحظات مهمة | Important Notes

### بنية البيانات | Data Structure
- **معرفات MongoDB**: جميع معرفات النسخ الاحتياطية تستخدم تنسيق ObjectId (24 حرف hex)
- **معرفات Discord**: جميع معرفات الخوادم والمستخدمين تحتوي على أرقام فقط
- **إعدادات الخادم**: كائن يحتوي على جميع إعدادات الخادم مثل الاسم والوصف والأيقونة
- **القنوات**: مصفوفة من كائنات القنوات مع تفاصيل كل قناة
- **الأدوار**: مصفوفة من كائنات الأدوار مع الصلاحيات والألوان

### أمان البيانات | Data Security
- جميع معرفات Discord يجب أن تحتوي على أرقام فقط
- يتم التحقق من صحة البيانات قبل المعالجة
- رسائل الخطأ متوفرة باللغة العربية
- لا يتم تخزين معلومات حساسة في النسخ الاحتياطية

### تنسيق التواريخ | Date Format
- جميع التواريخ بتنسيق ISO 8601 (UTC)
- مثال: `2024-01-15T10:30:00Z`
- يتم إنشاء `created_at` و `updated_at` تلقائياً

### معالجة الأخطاء | Error Handling
- جميع الأخطاء تُرجع بتنسيق JSON موحد
- تتضمن رسائل خطأ واضحة باللغة العربية
- تحديد الحقل المسبب للخطأ عند الإمكان
- رموز HTTP مناسبة لكل نوع خطأ

### حدود النظام | System Limits
- معرف الخادم: 1-50 حرف
- معرف المنشئ: 1-50 حرف
- لا توجد حدود على عدد القنوات أو الأدوار في النسخة الاحتياطية
- حجم البيانات محدود بحدود MongoDB

---

## أمثلة شاملة | Complete Examples

### مثال كامل لإنشاء نسخة احتياطية بسيطة | Simple Backup Creation Example

```bash
# طلب إنشاء نسخة احتياطية بسيطة
curl -X POST http://localhost:3003/api/v1/backup \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "server_settings": {
      "name": "My Gaming Server",
      "description": "A server for gaming enthusiasts"
    },
    "created_by": "555666777888999000"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء النسخة الاحتياطية بنجاح",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "server_id": "123456789012345678",
    "server_settings": {
      "name": "My Gaming Server",
      "description": "A server for gaming enthusiasts"
    },
    "channels": [],
    "roles": [],
    "created_by": "555666777888999000",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل للحصول على نسخ احتياطية لخادم | Complete Server Backups Retrieval Example

```bash
# طلب الحصول على نسخ احتياطية لخادم محدد
curl -X GET http://localhost:3003/api/v1/backup/server/123456789012345678 \
  -H "Content-Type: application/json"

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم جلب النسخ الاحتياطية بنجاح",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "server_id": "123456789012345678",
      "server_settings": {
        "name": "My Gaming Server",
        "description": "Backup from January"
      },
      "channels": [
        {
          "id": "987654321098765432",
          "name": "general",
          "type": "text"
        }
      ],
      "roles": [
        {
          "id": "876543210987654321",
          "name": "Admin",
          "permissions": ["ADMINISTRATOR"]
        }
      ],
      "created_by": "555666777888999000",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### مثال كامل لحذف نسخة احتياطية | Complete Backup Deletion Example

```bash
# طلب حذف نسخة احتياطية
curl -X DELETE http://localhost:3003/api/v1/backup/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -d '{
    "serverId": "123456789012345678"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم حذف النسخة الاحتياطية بنجاح",
  "data": null
}
```

---

## استخدامات متقدمة | Advanced Usage

### إنشاء نسخة احتياطية كاملة مع جميع البيانات | Complete Backup with All Data

```bash
curl -X POST http://localhost:3003/api/v1/backup \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "server_settings": {
      "name": "Complete Gaming Server",
      "description": "Full featured gaming server",
      "icon": "https://cdn.discordapp.com/icons/123456789012345678/icon.png",
      "verification_level": 2,
      "default_message_notifications": 0,
      "explicit_content_filter": 1,
      "mfa_level": 1,
      "system_channel_id": "987654321098765432"
    },
    "channels": [
      {
        "id": "987654321098765432",
        "name": "welcome",
        "type": "text",
        "position": 0,
        "topic": "Welcome to our server!",
        "nsfw": false,
        "rate_limit_per_user": 10,
        "parent_id": null
      },
      {
        "id": "876543210987654321",
        "name": "General",
        "type": "category",
        "position": 1,
        "parent_id": null
      },
      {
        "id": "765432109876543210",
        "name": "general-chat",
        "type": "text",
        "position": 2,
        "topic": "General discussion",
        "nsfw": false,
        "rate_limit_per_user": 0,
        "parent_id": "876543210987654321"
      },
      {
        "id": "654321098765432109",
        "name": "voice-general",
        "type": "voice",
        "position": 3,
        "bitrate": 64000,
        "user_limit": 10,
        "parent_id": "876543210987654321"
      }
    ],
    "roles": [
      {
        "id": "543210987654321098",
        "name": "@everyone",
        "permissions": ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "USE_VOICE_ACTIVATION"],
        "color": 0,
        "position": 0,
        "mentionable": false,
        "hoist": false
      },
      {
        "id": "432109876543210987",
        "name": "Server Owner",
        "permissions": ["ADMINISTRATOR"],
        "color": 16711680,
        "position": 3,
        "mentionable": true,
        "hoist": true
      },
      {
        "id": "321098765432109876",
        "name": "Admin",
        "permissions": ["MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES", "KICK_MEMBERS", "BAN_MEMBERS"],
        "color": 15158332,
        "position": 2,
        "mentionable": true,
        "hoist": true
      },
      {
        "id": "210987654321098765",
        "name": "Moderator",
        "permissions": ["MANAGE_MESSAGES", "KICK_MEMBERS", "MUTE_MEMBERS", "DEAFEN_MEMBERS"],
        "color": 3447003,
        "position": 1,
        "mentionable": true,
        "hoist": true
      }
    ],
    "created_by": "555666777888999000"
  }'
```

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.
---

**تاريخ آخر تحديث / Last Updated:** 2024-01-17  
**إصدار التوثيق / Documentation Version:** 1.0.0  
**إصدار API / API Version:** v1
