# توثيق APIs إدارة المشرفين
# Admins Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة المشرفين في النظام. جميع المسارات تبدأ بـ `/api/v1/admins`

This documentation covers all API endpoints related to admins management in the system. All routes start with `/api/v1/admins`

---

## 1. الحصول على جميع المشرفين | Get All Admins

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/admins`
- **الوصف | Description:** الحصول على قائمة بجميع المشرفين في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |

### مثال على الطلب | Request Example
```http
GET /api/v1/admins?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب المشرفين بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "admin_id": "987654321098765432",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "server_id": "123456789012345678",
      "admin_id": "876543210987654321",
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

## 2. الحصول على مشرف بواسطة المعرف | Get Admin by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/admins/:id`
- **الوصف | Description:** الحصول على مشرف محدد بواسطة معرفه
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف المشرف (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
GET /api/v1/admins/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب المشرف بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "admin_id": "987654321098765432",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - المشرف غير موجود
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف المشرف يجب أن يكون رقماً موجباً",
  "errors": [
    {
      "field": "id",
      "message": "معرف المشرف يجب أن يكون رقماً موجباً"
    }
  ]
}
```

---

## 3. الحصول على المشرفين بواسطة معرف الخادم | Get Admins by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/admins/server/:serverId`
- **الوصف | Description:** الحصول على جميع المشرفين لخادم محدد
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
GET /api/v1/admins/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب مشرفي الخادم بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "admin_id": "987654321098765432",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "server_id": "123456789012345678",
      "admin_id": "876543210987654321",
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

## 4. إنشاء مشرف جديد | Create New Admin

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/admins`
- **الوصف | Description:** إنشاء مشرف جديد في النظام
- **مستوى الوصول | Access Level:** Public

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| server_id | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |
| admin_id | string | نعم | معرف المشرف في Discord (أرقام فقط، 1-50 حرف) |

### قواعد التحقق | Validation Rules
- `server_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف
- `admin_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف
- لا يمكن أن تحتوي الحقول على مسافات إضافية

### مثال على الطلب | Request Example
```http
POST /api/v1/admins
Content-Type: application/json

{
  "server_id": "123456789012345678",
  "admin_id": "987654321098765432"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء المشرف بنجاح",
  "data": {
    "id": 3,
    "server_id": "123456789012345678",
    "admin_id": "987654321098765432",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء المشرف بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `409 Conflict` - المشرف موجود مسبقاً
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
      "field": "admin_id",
      "message": "معرف المشرف في Discord مطلوب"
    }
  ]
}
```

```json
{
  "success": false,
  "message": "المشرف موجود مسبقاً في هذا الخادم",
  "error": "ADMIN_ALREADY_EXISTS"
}
```

---

## 5. حذف المشرف | Delete Admin

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/admins/:id`
- **الوصف | Description:** حذف مشرف من النظام
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف المشرف (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
DELETE /api/v1/admins/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف المشرف بنجاح",
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف المشرف بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - المشرف غير موجود
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "المشرف غير موجود",
  "error": "ADMIN_NOT_FOUND"
}
```

---

## ملاحظات مهمة | Important Notes

### العمليات المعطلة | Disabled Operations
- **تحديث المشرف (PUT)**: هذه العملية معطلة حالياً حسب منطق الخدمة
- لا يمكن تحديث `server_id` أو `admin_id` بعد الإنشاء

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

### مثال كامل لإنشاء مشرف | Complete Admin Creation Example

```bash
# طلب إنشاء مشرف جديد
curl -X POST http://localhost:3003/api/v1/admins \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "admin_id": "987654321098765432"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء المشرف بنجاح",
  "data": {
    "id": 3,
    "server_id": "123456789012345678",
    "admin_id": "987654321098765432",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل للحصول على مشرفي خادم | Complete Server Admins Retrieval Example

```bash
# طلب الحصول على مشرفي خادم محدد
curl -X GET http://localhost:3003/api/v1/admins/server/123456789012345678 \
  -H "Content-Type: application/json"

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم جلب مشرفي الخادم بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "admin_id": "987654321098765432",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.