# توثيق APIs إدارة سجلات لوحة التحكم
# Dashboard Logs Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة سجلات لوحة التحكم في النظام. جميع المسارات تبدأ بـ `/api/v1/restful/dashboard-logs`

This documentation covers all API endpoints related to dashboard logs management in the system. All routes start with `/api/v1/restful/dashboard-logs`

---

## 1. الحصول على جميع سجلات لوحة التحكم | Get All Dashboard Logs

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/dashboard-logs`
- **الوصف | Description:** الحصول على قائمة بجميع سجلات لوحة التحكم في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/dashboard-logs?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب سجلات لوحة التحكم بنجاح",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "إنشاء قناة جديدة",
      "description": "تم إنشاء قناة نصية جديدة باسم 'عام'",
      "feature": "channels",
      "action": "create",
      "server_id": "123456789012345678",
      "user_id": "987654321098765432",
      "date": "2024-01-15T10:30:00Z",
      "additional_data": {
        "channel_name": "عام",
        "channel_type": "text"
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `500 Internal Server Error` - خطأ في الخادم

---

## 2. الحصول على سجل لوحة التحكم بواسطة المعرف | Get Dashboard Log by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/dashboard-logs/:id`
- **الوصف | Description:** الحصول على سجل لوحة تحكم محدد بواسطة معرفه
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف سجل لوحة التحكم (MongoDB ObjectId) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون معرف MongoDB صحيح (24 حرف hex)

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/dashboard-logs/507f1f77bcf86cd799439011
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب سجل لوحة التحكم بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "إنشاء قناة جديدة",
    "description": "تم إنشاء قناة نصية جديدة باسم 'عام'",
    "feature": "channels",
    "action": "create",
    "server_id": "123456789012345678",
    "user_id": "987654321098765432",
    "date": "2024-01-15T10:30:00Z",
    "additional_data": {
      "channel_name": "عام",
      "channel_type": "text"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - السجل غير موجود
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف سجل لوحة التحكم يجب أن يكون معرف MongoDB صحيح",
  "errors": [
    {
      "field": "id",
      "message": "معرف سجل لوحة التحكم يجب أن يكون معرف MongoDB صحيح"
    }
  ]
}
```

---

## 3. الحصول على سجلات لوحة التحكم بواسطة معرف الخادم | Get Dashboard Logs by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/dashboard-logs/server/:serverId`
- **الوصف | Description:** الحصول على جميع سجلات لوحة التحكم لخادم محدد
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
GET /api/v1/restful/dashboard-logs/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب سجلات لوحة التحكم للخادم بنجاح",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "إنشاء قناة جديدة",
      "description": "تم إنشاء قناة نصية جديدة باسم 'عام'",
      "feature": "channels",
      "action": "create",
      "server_id": "123456789012345678",
      "user_id": "987654321098765432",
      "date": "2024-01-15T10:30:00Z",
      "additional_data": {
        "channel_name": "عام"
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `500 Internal Server Error` - خطأ في الخادم

---

## 4. الحصول على سجلات لوحة التحكم بواسطة معرف المستخدم | Get Dashboard Logs by User ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/dashboard-logs/user/:userId/server/:serverId`
- **الوصف | Description:** الحصول على جميع سجلات لوحة التحكم لمستخدم محدد في خادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| userId | string | نعم | معرف المستخدم (أرقام فقط، 1-50 حرف) |
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `userId` يجب أن يحتوي على أرقام فقط، طول 1-50 حرف
- `serverId` يجب أن يحتوي على أرقام فقط، طول 1-50 حرف
- لا يمكن أن تحتوي الحقول على مسافات إضافية

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/dashboard-logs/user/987654321098765432/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب سجلات لوحة التحكم للمستخدم بنجاح",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "تحديث إعدادات القناة",
      "description": "تم تحديث إعدادات قناة 'عام'",
      "feature": "channels",
      "action": "update",
      "server_id": "123456789012345678",
      "user_id": "987654321098765432",
      "date": "2024-01-15T10:30:00Z",
      "additional_data": {
        "channel_name": "عام",
        "updated_settings": ["permissions"]
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف المستخدم أو الخادم غير صحيح
- `500 Internal Server Error` - خطأ في الخادم

---

## 5. الحصول على سجلات لوحة التحكم بواسطة الميزة | Get Dashboard Logs by Feature

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/dashboard-logs/feature/:feature/server/:serverId`
- **الوصف | Description:** الحصول على جميع سجلات لوحة التحكم لميزة محددة في خادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| feature | string | نعم | اسم الميزة (1-100 حرف) |
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `feature` يجب أن يكون نصاً بطول 1-100 حرف
- `serverId` يجب أن يحتوي على أرقام فقط، طول 1-50 حرف

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/dashboard-logs/feature/channels/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب سجلات لوحة التحكم للميزة بنجاح",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "إنشاء قناة جديدة",
      "description": "تم إنشاء قناة نصية جديدة باسم 'عام'",
      "feature": "channels",
      "action": "create",
      "server_id": "123456789012345678",
      "user_id": "987654321098765432",
      "date": "2024-01-15T10:30:00Z",
      "additional_data": {
        "channel_name": "عام",
        "channel_type": "text"
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - اسم الميزة أو معرف الخادم غير صحيح
- `500 Internal Server Error` - خطأ في الخادم

---

## 6. الحصول على سجلات لوحة التحكم بواسطة الإجراء | Get Dashboard Logs by Action

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/dashboard-logs/action/:action/server/:serverId`
- **الوصف | Description:** الحصول على جميع سجلات لوحة التحكم لإجراء محدد في خادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| action | string | نعم | نوع الإجراء (create/update/delete/enable/disable/activate/deactivate/configure/reset) |
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `action` يجب أن يكون أحد القيم: create, update, delete, enable, disable, activate, deactivate, configure, reset
- `serverId` يجب أن يحتوي على أرقام فقط، طول 1-50 حرف

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/dashboard-logs/action/create/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب سجلات لوحة التحكم للإجراء بنجاح",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "إنشاء قناة جديدة",
      "description": "تم إنشاء قناة نصية جديدة باسم 'عام'",
      "feature": "channels",
      "action": "create",
      "server_id": "123456789012345678",
      "user_id": "987654321098765432",
      "date": "2024-01-15T10:30:00Z",
      "additional_data": {
        "channel_name": "عام",
        "channel_type": "text"
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - نوع الإجراء أو معرف الخادم غير صحيح
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "نوع الإجراء يجب أن يكون أحد القيم التالية: create, update, delete, enable, disable, activate, deactivate, configure, reset",
  "errors": [
    {
      "field": "action",
      "message": "نوع الإجراء يجب أن يكون أحد القيم التالية: create, update, delete, enable, disable, activate, deactivate, configure, reset"
    }
  ]
}
```

---

## 7. إنشاء سجل لوحة تحكم جديد | Create New Dashboard Log

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/restful/dashboard-logs`
- **الوصف | Description:** إنشاء سجل لوحة تحكم جديد في النظام
- **مستوى الوصول | Access Level:** Public

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| title | string | نعم | عنوان السجل (1-200 حرف) |
| description | string | نعم | وصف السجل (1-1000 حرف) |
| feature | string | نعم | اسم الميزة (1-100 حرف) |
| action | string | نعم | نوع الإجراء (create/update/delete/enable/disable/activate/deactivate/configure/reset) |
| server_id | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |
| user_id | string | اختياري | معرف المستخدم (أرقام فقط، 1-50 حرف) |
| date | Date | اختياري | تاريخ السجل (افتراضي: الوقت الحالي) |
| additional_data | Object | اختياري | بيانات إضافية (افتراضي: {}) |

### قواعد التحقق | Validation Rules
- `title`: نص مطلوب، طول 1-200 حرف
- `description`: نص مطلوب، طول 1-1000 حرف
- `feature`: نص مطلوب، طول 1-100 حرف
- `action`: يجب أن يكون أحد القيم المحددة
- `server_id`: نص مطلوب يحتوي على أرقام فقط، طول 1-50 حرف
- `user_id`: نص اختياري يحتوي على أرقام فقط، طول 1-50 حرف
- `date`: تاريخ صحيح (افتراضي: الوقت الحالي)
- `additional_data`: كائن (افتراضي: {})

### مثال على الطلب | Request Example
```http
POST /api/v1/restful/dashboard-logs
Content-Type: application/json

{
  "title": "إنشاء قناة جديدة",
  "description": "تم إنشاء قناة نصية جديدة باسم 'عام' في الخادم",
  "feature": "channels",
  "action": "create",
  "server_id": "123456789012345678",
  "user_id": "987654321098765432",
  "additional_data": {
    "channel_name": "عام",
    "channel_type": "text",
    "permissions": ["read", "write"]
  }
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء سجل لوحة التحكم بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "إنشاء قناة جديدة",
    "description": "تم إنشاء قناة نصية جديدة باسم 'عام' في الخادم",
    "feature": "channels",
    "action": "create",
    "server_id": "123456789012345678",
    "user_id": "987654321098765432",
    "date": "2024-01-17T09:15:00Z",
    "additional_data": {
      "channel_name": "عام",
      "channel_type": "text",
      "permissions": ["read", "write"]
    },
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء السجل بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "errors": [
    {
      "field": "title",
      "message": "عنوان السجل مطلوب"
    },
    {
      "field": "action",
      "message": "نوع الإجراء يجب أن يكون أحد القيم التالية: create, update, delete, enable, disable, activate, deactivate, configure, reset"
    }
  ]
}
```

---

## 8. حذف سجل لوحة التحكم | Delete Dashboard Log

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/dashboard-logs/:id`
- **الوصف | Description:** حذف سجل لوحة تحكم من النظام
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف سجل لوحة التحكم (MongoDB ObjectId) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون معرف MongoDB صحيح (24 حرف hex)

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/dashboard-logs/507f1f77bcf86cd799439011
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف سجل لوحة التحكم بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف السجل بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - السجل غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 9. حذف جميع سجلات لوحة التحكم للخادم | Delete All Dashboard Logs for Server

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/dashboard-logs/server/:serverId`
- **الوصف | Description:** حذف جميع سجلات لوحة التحكم لخادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `serverId` يجب أن يحتوي على أرقام فقط، طول 1-50 حرف

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/dashboard-logs/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف جميع سجلات لوحة التحكم للخادم بنجاح",
  "data": {
    "server_id": "123456789012345678",
    "deleted_count": 15,
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف السجلات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `500 Internal Server Error` - خطأ في الخادم

---

## ملاحظات مهمة | Important Notes

### أنواع الإجراءات المدعومة | Supported Action Types
- `create` - إنشاء عنصر جديد
- `update` - تحديث عنصر موجود
- `delete` - حذف عنصر
- `enable` - تفعيل ميزة
- `disable` - إلغاء تفعيل ميزة
- `activate` - تنشيط عنصر
- `deactivate` - إلغاء تنشيط عنصر
- `configure` - تكوين إعدادات
- `reset` - إعادة تعيين

### أمان البيانات | Data Security
- جميع معرفات Discord يجب أن تحتوي على أرقام فقط
- يتم التحقق من صحة البيانات قبل المعالجة
- رسائل الخطأ متوفرة باللغة العربية
- البيانات الإضافية يمكن أن تحتوي على أي كائن JSON صحيح

### تنسيق التواريخ | Date Format
- جميع التواريخ بتنسيق ISO 8601 (UTC)
- مثال: `2024-01-15T10:30:00Z`
- إذا لم يتم تحديد التاريخ، سيتم استخدام الوقت الحالي

### معالجة الأخطاء | Error Handling
- جميع الأخطاء تُرجع بتنسيق JSON موحد
- تتضمن رسائل خطأ واضحة باللغة العربية
- تحديد الحقل المسبب للخطأ عند الإمكان

### البيانات الإضافية | Additional Data
- حقل `additional_data` يمكن أن يحتوي على أي بيانات إضافية مفيدة
- يجب أن يكون كائن JSON صحيح
- مفيد لتخزين تفاصيل محددة للإجراء المنفذ

---

## أمثلة شاملة | Complete Examples

### مثال كامل لإنشاء سجل لوحة تحكم | Complete Dashboard Log Creation Example

```bash
# طلب إنشاء سجل لوحة تحكم جديد
curl -X POST http://localhost:3003/api/v1/restful/dashboard-logs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تحديث صلاحيات القناة",
    "description": "تم تحديث صلاحيات قناة عام لإضافة دور المشرفين",
    "feature": "channels",
    "action": "update",
    "server_id": "123456789012345678",
    "user_id": "987654321098765432",
    "additional_data": {
      "channel_id": "111222333444555666",
      "channel_name": "عام",
      "updated_permissions": {
        "role_id": "777888999000111222",
        "role_name": "مشرفين",
        "permissions": ["manage_messages", "kick_members"]
      }
    }
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء سجل لوحة التحكم بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "تحديث صلاحيات القناة",
    "description": "تم تحديث صلاحيات قناة عام لإضافة دور المشرفين",
    "feature": "channels",
    "action": "update",
    "server_id": "123456789012345678",
    "user_id": "987654321098765432",
    "date": "2024-01-17T09:15:00Z",
    "additional_data": {
      "channel_id": "111222333444555666",
      "channel_name": "عام",
      "updated_permissions": {
        "role_id": "777888999000111222",
        "role_name": "مشرفين",
        "permissions": ["manage_messages", "kick_members"]
      }
    },
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل للحصول على سجلات خادم محدد | Complete Server Logs Retrieval Example

```bash
# طلب الحصول على سجلات خادم محدد
curl -X GET http://localhost:3003/api/v1/restful/dashboard-logs/server/123456789012345678 \
  -H "Content-Type: application/json"

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم جلب سجلات لوحة التحكم للخادم بنجاح",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "إنشاء قناة جديدة",
      "description": "تم إنشاء قناة نصية جديدة باسم 'عام'",
      "feature": "channels",
      "action": "create",
      "server_id": "123456789012345678",
      "user_id": "987654321098765432",
      "date": "2024-01-15T10:30:00Z",
      "additional_data": {
        "channel_name": "عام",
        "channel_type": "text"
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "تحديث صلاحيات القناة",
      "description": "تم تحديث صلاحيات قناة عام لإضافة دور المشرفين",
      "feature": "channels",
      "action": "update",
      "server_id": "123456789012345678",
      "user_id": "987654321098765432",
      "date": "2024-01-17T09:15:00Z",
      "additional_data": {
        "channel_id": "111222333444555666",
        "updated_permissions": {
          "role_name": "مشرفين"
        }
      },
      "created_at": "2024-01-17T09:15:00Z",
      "updated_at": "2024-01-17T09:15:00Z"
    }
  ],
  "count": 2
}
```

### مثال كامل للبحث بالميزة والإجراء | Complete Feature and Action Search Example

```bash
# طلب الحصول على سجلات ميزة محددة
curl -X GET http://localhost:3003/api/v1/restful/dashboard-logs/feature/channels/server/123456789012345678 \
  -H "Content-Type: application/json"

# طلب الحصول على سجلات إجراء محدد
curl -X GET http://localhost:3003/api/v1/restful/dashboard-logs/action/create/server/123456789012345678 \
  -H "Content-Type: application/json"
```

---

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.