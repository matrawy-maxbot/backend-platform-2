# توثيق APIs إدارة الرسائل المجدولة
# Schedule Messages Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة الرسائل المجدولة في النظام. جميع المسارات تبدأ بـ `/api/v1/restful/schedule-messages`

This documentation covers all API endpoints related to scheduled messages management in the system. All routes start with `/api/v1/restful/schedule-messages`

---

## 1. الحصول على جميع الرسائل المجدولة | Get All Schedule Messages

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/schedule-messages`
- **الوصف | Description:** الحصول على قائمة بجميع الرسائل المجدولة في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/schedule-messages?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب الرسائل المجدولة بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "title": "إعلان مهم",
      "content": "هذا إعلان مهم للجميع",
      "image_url": "https://example.com/image.jpg",
      "link_url": "https://example.com",
      "channels": ["987654321098765432"],
      "roles": ["876543210987654321"],
      "publish_type": "scheduled",
      "schedule_mode": "specific_time",
      "scheduled_time": "2024-01-20T15:30:00Z",
      "delay_amount": 0,
      "delay_unit": "minutes",
      "schedule_type": "one_time",
      "recurring_type": null,
      "priority_level": "normal",
      "status": "pending",
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

## 2. الحصول على رسالة مجدولة بواسطة المعرف | Get Schedule Message by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/schedule-messages/:id`
- **الوصف | Description:** الحصول على رسالة مجدولة محددة بواسطة معرفها
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف الرسالة المجدولة (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/schedule-messages/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب الرسالة المجدولة بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "title": "إعلان مهم",
    "content": "هذا إعلان مهم للجميع",
    "image_url": "https://example.com/image.jpg",
    "link_url": "https://example.com",
    "channels": ["987654321098765432"],
    "roles": ["876543210987654321"],
    "publish_type": "scheduled",
    "schedule_mode": "specific_time",
    "scheduled_time": "2024-01-20T15:30:00Z",
    "delay_amount": 0,
    "delay_unit": "minutes",
    "schedule_type": "one_time",
    "recurring_type": null,
    "priority_level": "normal",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - الرسالة المجدولة غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف الرسالة المجدولة يجب أن يكون رقماً موجباً",
  "errors": [
    {
      "field": "id",
      "message": "معرف الرسالة المجدولة يجب أن يكون رقماً موجباً"
    }
  ]
}
```

---

## 3. الحصول على الرسائل المجدولة بواسطة معرف الخادم | Get Schedule Messages by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/schedule-messages/server/:serverId`
- **الوصف | Description:** الحصول على جميع الرسائل المجدولة لخادم محدد
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
GET /api/v1/restful/schedule-messages/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب رسائل الخادم المجدولة بنجاح",
  "data": [
    {
      "id": 1,
      "server_id": "123456789012345678",
      "title": "إعلان مهم",
      "content": "هذا إعلان مهم للجميع",
      "image_url": "https://example.com/image.jpg",
      "link_url": "https://example.com",
      "channels": ["987654321098765432"],
      "roles": ["876543210987654321"],
      "publish_type": "scheduled",
      "schedule_mode": "specific_time",
      "scheduled_time": "2024-01-20T15:30:00Z",
      "delay_amount": 0,
      "delay_unit": "minutes",
      "schedule_type": "one_time",
      "recurring_type": null,
      "priority_level": "normal",
      "status": "pending",
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

## 4. إنشاء رسالة مجدولة جديدة | Create New Schedule Message

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/restful/schedule-messages`
- **الوصف | Description:** إنشاء رسالة مجدولة جديدة في النظام
- **مستوى الوصول | Access Level:** Public

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| server_id | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |
| title | string | نعم | عنوان الإعلان (1-255 حرف) |
| content | string | نعم | محتوى الإعلان (حرف واحد على الأقل) |
| image_url | string | اختياري | رابط الصورة (URL صحيح) |
| link_url | string | اختياري | رابط الإعلان (URL صحيح) |
| channels | array | اختياري | قائمة معرفات القنوات المستهدفة |
| roles | array | اختياري | قائمة معرفات الأدوار المستهدفة |
| publish_type | string | اختياري | نوع النشر (immediate/scheduled) - افتراضي: immediate |
| schedule_mode | string | اختياري | وضع الجدولة (specific_time/delay_from_now) - افتراضي: specific_time |
| scheduled_time | string | اختياري | الوقت المجدول بتنسيق ISO |
| delay_amount | number | اختياري | مقدار التأخير (صفر أو أكثر) - افتراضي: 0 |
| delay_unit | string | اختياري | وحدة التأخير (minutes/hours/days) - افتراضي: minutes |
| schedule_type | string | اختياري | نوع الجدولة (one_time/recurring) - افتراضي: one_time |
| recurring_type | string | اختياري | نوع التكرار (daily/weekly/monthly) |
| priority_level | string | اختياري | مستوى الأولوية (low/normal/high) - افتراضي: normal |

### قواعد التحقق | Validation Rules
- `server_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف
- `title`: نص غير فارغ، طول 1-255 حرف
- `content`: نص غير فارغ، حرف واحد على الأقل
- `image_url`: رابط صحيح أو فارغ
- `link_url`: رابط صحيح أو فارغ
- `channels`: مصفوفة من النصوص (معرفات القنوات)
- `roles`: مصفوفة من النصوص (معرفات الأدوار)
- `publish_type`: قيمة من (immediate, scheduled)
- `schedule_mode`: قيمة من (specific_time, delay_from_now)
- `scheduled_time`: تاريخ بتنسيق ISO أو null
- `delay_amount`: رقم صحيح صفر أو أكثر
- `delay_unit`: قيمة من (minutes, hours, days)
- `schedule_type`: قيمة من (one_time, recurring)
- `recurring_type`: قيمة من (daily, weekly, monthly) أو null
- `priority_level`: قيمة من (low, normal, high)

### مثال على الطلب | Request Example
```http
POST /api/v1/restful/schedule-messages
Content-Type: application/json

{
  "server_id": "123456789012345678",
  "title": "إعلان مهم",
  "content": "هذا إعلان مهم للجميع في الخادم",
  "image_url": "https://example.com/image.jpg",
  "link_url": "https://example.com",
  "channels": ["987654321098765432", "876543210987654321"],
  "roles": ["765432109876543210"],
  "publish_type": "scheduled",
  "schedule_mode": "specific_time",
  "scheduled_time": "2024-01-20T15:30:00Z",
  "schedule_type": "one_time",
  "priority_level": "high"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء الرسالة المجدولة بنجاح",
  "data": {
    "id": 2,
    "server_id": "123456789012345678",
    "title": "إعلان مهم",
    "content": "هذا إعلان مهم للجميع في الخادم",
    "image_url": "https://example.com/image.jpg",
    "link_url": "https://example.com",
    "channels": ["987654321098765432", "876543210987654321"],
    "roles": ["765432109876543210"],
    "publish_type": "scheduled",
    "schedule_mode": "specific_time",
    "scheduled_time": "2024-01-20T15:30:00Z",
    "delay_amount": 0,
    "delay_unit": "minutes",
    "schedule_type": "one_time",
    "recurring_type": null,
    "priority_level": "high",
    "status": "pending",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء الرسالة المجدولة بنجاح
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
      "field": "title",
      "message": "عنوان الإعلان مطلوب"
    },
    {
      "field": "content",
      "message": "محتوى الإعلان مطلوب"
    }
  ]
}
```

---

## 5. تحديث الرسالة المجدولة | Update Schedule Message

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/restful/schedule-messages/:id`
- **الوصف | Description:** تحديث رسالة مجدولة موجودة
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف الرسالة المجدولة (رقم صحيح موجب) |

### بيانات الطلب | Request Body
جميع الحقول اختيارية، ولكن يجب تقديم حقل واحد على الأقل للتحديث:

| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| title | string | اختياري | عنوان الإعلان (1-255 حرف) |
| content | string | اختياري | محتوى الإعلان (حرف واحد على الأقل) |
| image_url | string | اختياري | رابط الصورة (URL صحيح) |
| link_url | string | اختياري | رابط الإعلان (URL صحيح) |
| channels | array | اختياري | قائمة معرفات القنوات المستهدفة |
| roles | array | اختياري | قائمة معرفات الأدوار المستهدفة |
| publish_type | string | اختياري | نوع النشر (immediate/scheduled) |
| schedule_mode | string | اختياري | وضع الجدولة (specific_time/delay_from_now) |
| scheduled_time | string | اختياري | الوقت المجدول بتنسيق ISO |
| delay_amount | number | اختياري | مقدار التأخير (صفر أو أكثر) |
| delay_unit | string | اختياري | وحدة التأخير (minutes/hours/days) |
| schedule_type | string | اختياري | نوع الجدولة (one_time/recurring) |
| recurring_type | string | اختياري | نوع التكرار (daily/weekly/monthly) |
| priority_level | string | اختياري | مستوى الأولوية (low/normal/high) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً
- يجب تقديم حقل واحد على الأقل للتحديث
- نفس قواعد التحقق المطبقة في إنشاء الرسالة المجدولة

### مثال على الطلب | Request Example
```http
PUT /api/v1/restful/schedule-messages/1
Content-Type: application/json

{
  "title": "إعلان محدث",
  "content": "هذا محتوى محدث للإعلان",
  "priority_level": "high",
  "scheduled_time": "2024-01-25T10:00:00Z"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث الرسالة المجدولة بنجاح",
  "data": {
    "id": 1,
    "server_id": "123456789012345678",
    "title": "إعلان محدث",
    "content": "هذا محتوى محدث للإعلان",
    "image_url": "https://example.com/image.jpg",
    "link_url": "https://example.com",
    "channels": ["987654321098765432"],
    "roles": ["876543210987654321"],
    "publish_type": "scheduled",
    "schedule_mode": "specific_time",
    "scheduled_time": "2024-01-25T10:00:00Z",
    "delay_amount": 0,
    "delay_unit": "minutes",
    "schedule_type": "one_time",
    "recurring_type": null,
    "priority_level": "high",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T14:20:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث الرسالة المجدولة بنجاح
- `400 Bad Request` - معرف غير صحيح أو بيانات غير صحيحة
- `404 Not Found` - الرسالة المجدولة غير موجودة
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
  "message": "الرسالة المجدولة غير موجودة",
  "error": "SCHEDULE_MESSAGE_NOT_FOUND"
}
```

---

## 6. حذف الرسالة المجدولة | Delete Schedule Message

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/schedule-messages/:id`
- **الوصف | Description:** حذف رسالة مجدولة من النظام
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | number | نعم | معرف الرسالة المجدولة (رقم صحيح موجب) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون رقماً صحيحاً موجباً

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/schedule-messages/1
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف الرسالة المجدولة بنجاح",
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف الرسالة المجدولة بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - الرسالة المجدولة غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "الرسالة المجدولة غير موجودة",
  "error": "SCHEDULE_MESSAGE_NOT_FOUND"
}
```

---

## ملاحظات مهمة | Important Notes

### أنواع النشر | Publish Types
- **immediate**: نشر فوري للرسالة
- **scheduled**: نشر مجدول للرسالة

### أوضاع الجدولة | Schedule Modes
- **specific_time**: تحديد وقت محدد للنشر
- **delay_from_now**: تأخير من الوقت الحالي

### أنواع الجدولة | Schedule Types
- **one_time**: تنفيذ مرة واحدة فقط
- **recurring**: تنفيذ متكرر

### أنواع التكرار | Recurring Types
- **daily**: تكرار يومي
- **weekly**: تكرار أسبوعي
- **monthly**: تكرار شهري

### مستويات الأولوية | Priority Levels
- **low**: أولوية منخفضة
- **normal**: أولوية عادية (افتراضي)
- **high**: أولوية عالية

### وحدات التأخير | Delay Units
- **minutes**: دقائق
- **hours**: ساعات
- **days**: أيام

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

### مثال كامل لإنشاء رسالة مجدولة فورية | Complete Immediate Schedule Message Creation Example

```bash
# طلب إنشاء رسالة مجدولة فورية
curl -X POST http://localhost:3003/api/v1/restful/schedule-messages \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "title": "ترحيب بالأعضاء الجدد",
    "content": "مرحباً بكم في خادمنا الرائع!",
    "image_url": "https://example.com/welcome.jpg",
    "channels": ["987654321098765432"],
    "roles": ["876543210987654321"],
    "publish_type": "immediate",
    "priority_level": "normal"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء الرسالة المجدولة بنجاح",
  "data": {
    "id": 3,
    "server_id": "123456789012345678",
    "title": "ترحيب بالأعضاء الجدد",
    "content": "مرحباً بكم في خادمنا الرائع!",
    "image_url": "https://example.com/welcome.jpg",
    "link_url": null,
    "channels": ["987654321098765432"],
    "roles": ["876543210987654321"],
    "publish_type": "immediate",
    "schedule_mode": "specific_time",
    "scheduled_time": null,
    "delay_amount": 0,
    "delay_unit": "minutes",
    "schedule_type": "one_time",
    "recurring_type": null,
    "priority_level": "normal",
    "status": "published",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل لإنشاء رسالة مجدولة متكررة | Complete Recurring Schedule Message Creation Example

```bash
# طلب إنشاء رسالة مجدولة متكررة
curl -X POST http://localhost:3003/api/v1/restful/schedule-messages \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "title": "تذكير يومي",
    "content": "لا تنسوا المشاركة في الأنشطة اليومية!",
    "channels": ["987654321098765432"],
    "publish_type": "scheduled",
    "schedule_mode": "specific_time",
    "scheduled_time": "2024-01-20T09:00:00Z",
    "schedule_type": "recurring",
    "recurring_type": "daily",
    "priority_level": "low"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء الرسالة المجدولة بنجاح",
  "data": {
    "id": 4,
    "server_id": "123456789012345678",
    "title": "تذكير يومي",
    "content": "لا تنسوا المشاركة في الأنشطة اليومية!",
    "image_url": null,
    "link_url": null,
    "channels": ["987654321098765432"],
    "roles": [],
    "publish_type": "scheduled",
    "schedule_mode": "specific_time",
    "scheduled_time": "2024-01-20T09:00:00Z",
    "delay_amount": 0,
    "delay_unit": "minutes",
    "schedule_type": "recurring",
    "recurring_type": "daily",
    "priority_level": "low",
    "status": "pending",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل لإنشاء رسالة مجدولة بتأخير | Complete Delayed Schedule Message Creation Example

```bash
# طلب إنشاء رسالة مجدولة بتأخير
curl -X POST http://localhost:3003/api/v1/restful/schedule-messages \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "title": "إعلان مهم",
    "content": "سيتم إجراء صيانة على الخادم خلال ساعتين",
    "channels": ["987654321098765432", "876543210987654321"],
    "roles": ["765432109876543210"],
    "publish_type": "scheduled",
    "schedule_mode": "delay_from_now",
    "delay_amount": 2,
    "delay_unit": "hours",
    "schedule_type": "one_time",
    "priority_level": "high"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء الرسالة المجدولة بنجاح",
  "data": {
    "id": 5,
    "server_id": "123456789012345678",
    "title": "إعلان مهم",
    "content": "سيتم إجراء صيانة على الخادم خلال ساعتين",
    "image_url": null,
    "link_url": null,
    "channels": ["987654321098765432", "876543210987654321"],
    "roles": ["765432109876543210"],
    "publish_type": "scheduled",
    "schedule_mode": "delay_from_now",
    "scheduled_time": null,
    "delay_amount": 2,
    "delay_unit": "hours",
    "schedule_type": "one_time",
    "recurring_type": null,
    "priority_level": "high",
    "status": "pending",
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

---

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.