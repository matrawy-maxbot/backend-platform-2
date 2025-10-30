# توثيق APIs الردود التلقائية - Auto Reply APIs Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة - Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة الردود التلقائية في خوادم Discord. يتيح النظام للمشرفين إنشاء وإدارة ردود تلقائية تستجيب لكلمات أو عبارات محددة في القنوات المختارة.

This documentation covers all endpoints (APIs) related to managing auto-replies in Discord servers. The system allows administrators to create and manage automatic responses that trigger on specific words or phrases in selected channels.

---

## العمليات المتاحة - Available Operations

1. **GET /api/v1/autoReply** - الحصول على جميع الردود التلقائية
2. **GET /api/v1/autoReply/:id** - الحصول على رد تلقائي بواسطة المعرف
3. **GET /api/v1/autoReply/server/:serverId** - الحصول على الردود التلقائية لخادم معين
4. **POST /api/v1/autoReply** - إنشاء رد تلقائي جديد
5. **PUT /api/v1/autoReply/:id** - تحديث رد تلقائي موجود
6. **DELETE /api/v1/autoReply/:id** - حذف رد تلقائي

---

## هيكل البيانات - Data Structure

### نموذج الرد التلقائي - AutoReply Model

```json
{
  "_id": "string",
  "server_id": "string",
  "reply_name": "string",
  "triggers": ["string"],
  "responses": ["string"],
  "channels": ["string"],
  "created_at": "ISO 8601 date",
  "updated_at": "ISO 8601 date"
}
```

### وصف الحقول - Field Descriptions

| الحقل / Field | النوع / Type | مطلوب / Required | الوصف / Description |
|---------------|--------------|------------------|---------------------|
| `_id` | String | لا / No | معرف الرد التلقائي الفريد (يُنشأ تلقائياً) / Unique auto-reply ID (auto-generated) |
| `server_id` | String | نعم / Yes | معرف خادم Discord / Discord Server ID |
| `reply_name` | String | نعم / Yes | اسم الرد التلقائي / Auto-reply name |
| `triggers` | Array[String] | لا / No | الكلمات أو العبارات المحفزة / Trigger words or phrases |
| `responses` | Array[String] | لا / No | الردود المحتملة / Possible responses |
| `channels` | Array[String] | لا / No | معرفات القنوات المستهدفة / Target channel IDs |
| `created_at` | Date | لا / No | تاريخ الإنشاء / Creation date |
| `updated_at` | Date | لا / No | تاريخ آخر تحديث / Last update date |

---

## 1. الحصول على جميع الردود التلقائية - Get All Auto Replies

### معلومات الطلب - Request Information

- **الطريقة / Method:** `GET`
- **المسار / Path:** `/api/v1/autoReply`
- **المصادقة / Authentication:** مطلوبة / Required

### المعاملات الاختيارية - Optional Parameters

| المعامل / Parameter | النوع / Type | الوصف / Description |
|---------------------|--------------|---------------------|
| `limit` | Number | عدد النتائج المطلوبة / Number of results to return |
| `offset` | Number | عدد النتائج المراد تخطيها / Number of results to skip |

### مثال على الطلب - Request Example

```bash
curl -X GET "http://localhost:3003/api/v1/autoReply" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### مثال على الطلب مع معاملات - Request Example with Parameters

```bash
curl -X GET "http://localhost:3003/api/v1/autoReply?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### الاستجابة الناجحة - Success Response

**رمز الحالة / Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "تم جلب الردود التلقائية بنجاح",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "server_id": "123456789012345678",
      "reply_name": "ترحيب بالأعضاء الجدد",
      "triggers": ["مرحبا", "أهلا", "hello"],
      "responses": ["أهلاً وسهلاً بك!", "مرحباً بك في الخادم"],
      "channels": ["987654321098765432", "876543210987654321"],
      "created_at": "2023-09-06T10:30:00.000Z",
      "updated_at": "2023-09-06T10:30:00.000Z"
    }
  ]
}
```

### استجابة الخطأ - Error Response

**رمز الحالة / Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "فشل في جلب الردود التلقائية",
  "error": "Database connection error"
}
```

---

## 2. الحصول على رد تلقائي بواسطة المعرف - Get Auto Reply by ID

### معلومات الطلب - Request Information

- **الطريقة / Method:** `GET`
- **المسار / Path:** `/api/v1/autoReply/:id`
- **المصادقة / Authentication:** مطلوبة / Required

### معاملات المسار - Path Parameters

| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|---------------------|--------------|------------------|---------------------|
| `id` | String | نعم / Yes | معرف الرد التلقائي / Auto-reply ID |

### مثال على الطلب - Request Example

```bash
curl -X GET "http://localhost:3003/api/v1/autoReply/64f8a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### الاستجابة الناجحة - Success Response

**رمز الحالة / Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "تم جلب الرد التلقائي بنجاح",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "server_id": "123456789012345678",
    "reply_name": "ترحيب بالأعضاء الجدد",
    "triggers": ["مرحبا", "أهلا", "hello"],
    "responses": ["أهلاً وسهلاً بك!", "مرحباً بك في الخادم"],
    "channels": ["987654321098765432", "876543210987654321"],
    "created_at": "2023-09-06T10:30:00.000Z",
    "updated_at": "2023-09-06T10:30:00.000Z"
  }
}
```

### استجابة الخطأ - Error Responses

**رمز الحالة / Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "معرف الرد التلقائي مطلوب",
  "error": "Missing auto-reply ID"
}
```

**رمز الحالة / Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "الرد التلقائي غير موجود",
  "error": "Auto-reply not found"
}
```

---

## 3. الحصول على الردود التلقائية لخادم معين - Get Auto Replies by Server ID

### معلومات الطلب - Request Information

- **الطريقة / Method:** `GET`
- **المسار / Path:** `/api/v1/autoReply/server/:serverId`
- **المصادقة / Authentication:** مطلوبة / Required

### معاملات المسار - Path Parameters

| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|---------------------|--------------|------------------|---------------------|
| `serverId` | String | نعم / Yes | معرف الخادم / Server ID |

### مثال على الطلب - Request Example

```bash
curl -X GET "http://localhost:3003/api/v1/autoReply/server/123456789012345678" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### الاستجابة الناجحة - Success Response

**رمز الحالة / Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "تم جلب الردود التلقائية للخادم بنجاح",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "server_id": "123456789012345678",
      "reply_name": "ترحيب بالأعضاء الجدد",
      "triggers": ["مرحبا", "أهلا", "hello"],
      "responses": ["أهلاً وسهلاً بك!", "مرحباً بك في الخادم"],
      "channels": ["987654321098765432"],
      "created_at": "2023-09-06T10:30:00.000Z",
      "updated_at": "2023-09-06T10:30:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "server_id": "123456789012345678",
      "reply_name": "رد على الشكر",
      "triggers": ["شكرا", "thanks", "thank you"],
      "responses": ["العفو!", "لا شكر على واجب"],
      "channels": [],
      "created_at": "2023-09-06T11:00:00.000Z",
      "updated_at": "2023-09-06T11:00:00.000Z"
    }
  ]
}
```

### استجابة الخطأ - Error Responses

**رمز الحالة / Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "معرف الخادم مطلوب",
  "error": "Server ID is required"
}
```

---

## 4. إنشاء رد تلقائي جديد - Create New Auto Reply

### معلومات الطلب - Request Information

- **الطريقة / Method:** `POST`
- **المسار / Path:** `/api/v1/autoReply`
- **المصادقة / Authentication:** مطلوبة / Required

### بيانات الطلب - Request Body

```json
{
  "server_id": "string",
  "reply_name": "string",
  "triggers": ["string"],
  "responses": ["string"],
  "channels": ["string"]
}
```

### قواعد التحقق - Validation Rules

| الحقل / Field | القواعد / Rules |
|---------------|-----------------|
| `server_id` | مطلوب، يجب أن يكون نص / Required, must be string |
| `reply_name` | مطلوب، يجب أن يكون نص، الحد الأدنى 1 حرف / Required, must be string, min 1 character |
| `triggers` | اختياري، مصفوفة من النصوص / Optional, array of strings |
| `responses` | اختياري، مصفوفة من النصوص / Optional, array of strings |
| `channels` | اختياري، مصفوفة من النصوص / Optional, array of strings |

### مثال على الطلب - Request Example

```bash
curl -X POST "http://localhost:3003/api/v1/autoReply" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "reply_name": "ترحيب بالأعضاء الجدد",
    "triggers": ["مرحبا", "أهلا", "hello"],
    "responses": ["أهلاً وسهلاً بك!", "مرحباً بك في الخادم"],
    "channels": ["987654321098765432", "876543210987654321"]
  }'
```

### الاستجابة الناجحة - Success Response

**رمز الحالة / Status Code:** `201 Created`

```json
{
  "success": true,
  "message": "تم إنشاء الرد التلقائي بنجاح",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "server_id": "123456789012345678",
    "reply_name": "ترحيب بالأعضاء الجدد",
    "triggers": ["مرحبا", "أهلا", "hello"],
    "responses": ["أهلاً وسهلاً بك!", "مرحباً بك في الخادم"],
    "channels": ["987654321098765432", "876543210987654321"],
    "created_at": "2023-09-06T10:30:00.000Z",
    "updated_at": "2023-09-06T10:30:00.000Z"
  }
}
```

### استجابة الخطأ - Error Responses

**رمز الحالة / Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "بيانات الرد التلقائي ومعرف الخادم واسم الرد مطلوبة",
  "errors": [
    {
      "field": "server_id",
      "message": "معرف الخادم مطلوب"
    },
    {
      "field": "reply_name",
      "message": "اسم الرد مطلوب"
    }
  ]
}
```

**رمز الحالة / Status Code:** `409 Conflict`

```json
{
  "success": false,
  "message": "لقد وصلت إلى الحد الأقصى من عدد الردود التلقائية 10",
  "error": "Maximum auto-replies limit reached"
}
```

---

## 5. تحديث رد تلقائي موجود - Update Existing Auto Reply

### معلومات الطلب - Request Information

- **الطريقة / Method:** `PUT`
- **المسار / Path:** `/api/v1/autoReply/:id`
- **المصادقة / Authentication:** مطلوبة / Required

### معاملات المسار - Path Parameters

| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|---------------------|--------------|------------------|---------------------|
| `id` | String | نعم / Yes | معرف الرد التلقائي / Auto-reply ID |

### بيانات الطلب - Request Body

```json
{
  "reply_name": "string",
  "triggers": ["string"],
  "responses": ["string"],
  "channels": ["string"]
}
```

### قواعد التحقق - Validation Rules

| الحقل / Field | القواعد / Rules |
|---------------|-----------------|
| `reply_name` | اختياري، يجب أن يكون نص، الحد الأدنى 1 حرف / Optional, must be string, min 1 character |
| `triggers` | اختياري، مصفوفة من النصوص / Optional, array of strings |
| `responses` | اختياري، مصفوفة من النصوص / Optional, array of strings |
| `channels` | اختياري، مصفوفة من النصوص / Optional, array of strings |

### مثال على الطلب - Request Example

```bash
curl -X PUT "http://localhost:3003/api/v1/autoReply/64f8a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reply_name": "ترحيب محدث بالأعضاء الجدد",
    "triggers": ["مرحبا", "أهلا", "hello", "hi"],
    "responses": ["أهلاً وسهلاً بك في خادمنا!", "مرحباً بك، نتمنى لك إقامة ممتعة"],
    "channels": ["987654321098765432"]
  }'
```

### الاستجابة الناجحة - Success Response

**رمز الحالة / Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "تم تحديث الرد التلقائي بنجاح",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "server_id": "123456789012345678",
    "reply_name": "ترحيب محدث بالأعضاء الجدد",
    "triggers": ["مرحبا", "أهلا", "hello", "hi"],
    "responses": ["أهلاً وسهلاً بك في خادمنا!", "مرحباً بك، نتمنى لك إقامة ممتعة"],
    "channels": ["987654321098765432"],
    "created_at": "2023-09-06T10:30:00.000Z",
    "updated_at": "2023-09-06T12:15:00.000Z"
  }
}
```

### استجابة الخطأ - Error Responses

**رمز الحالة / Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "معرف الرد التلقائي مطلوب",
  "error": "Auto-reply ID is required"
}
```

**رمز الحالة / Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "الرد التلقائي غير موجود",
  "error": "Auto-reply not found"
}
```

---

## 6. حذف رد تلقائي - Delete Auto Reply

### معلومات الطلب - Request Information

- **الطريقة / Method:** `DELETE`
- **المسار / Path:** `/api/v1/autoReply/:id`
- **المصادقة / Authentication:** مطلوبة / Required

### معاملات المسار - Path Parameters

| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|---------------------|--------------|------------------|---------------------|
| `id` | String | نعم / Yes | معرف الرد التلقائي / Auto-reply ID |

### مثال على الطلب - Request Example

```bash
curl -X DELETE "http://localhost:3003/api/v1/autoReply/64f8a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### الاستجابة الناجحة - Success Response

**رمز الحالة / Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "تم حذف الرد التلقائي بنجاح",
  "data": true
}
```

### استجابة الخطأ - Error Responses

**رمز الحالة / Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "معرف الرد التلقائي مطلوب",
  "error": "Auto-reply ID is required"
}
```

**رمز الحالة / Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "فشل في حذف الرد التلقائي",
  "error": "Database error occurred"
}
```

---

## رموز الحالة العامة - General Status Codes

| رمز الحالة / Status Code | الوصف / Description |
|---------------------------|---------------------|
| `200 OK` | تم تنفيذ الطلب بنجاح / Request executed successfully |
| `201 Created` | تم إنشاء المورد بنجاح / Resource created successfully |
| `400 Bad Request` | طلب غير صحيح أو بيانات مفقودة / Invalid request or missing data |
| `401 Unauthorized` | غير مصرح بالوصول / Unauthorized access |
| `404 Not Found` | المورد غير موجود / Resource not found |
| `409 Conflict` | تعارض في البيانات / Data conflict |
| `500 Internal Server Error` | خطأ في الخادم / Server error |

---

## ملاحظات مهمة - Important Notes

### الحدود والقيود - Limits and Restrictions

1. **الحد الأقصى للردود التلقائية:** 10 ردود لكل خادم
   **Maximum Auto-Replies:** 10 auto-replies per server

2. **معرفات Discord:** يجب أن تكون أرقام صحيحة
   **Discord IDs:** Must be valid numbers

3. **التواريخ:** تُرجع بصيغة ISO 8601
   **Dates:** Returned in ISO 8601 format

### أمان البيانات - Data Security

- جميع الطلبات تتطلب مصادقة صحيحة
- All requests require valid authentication

- يتم التحقق من صحة البيانات قبل المعالجة
- Data validation is performed before processing

- رسائل الخطأ متوفرة باللغة العربية والإنجليزية
- Error messages are available in Arabic and English

### أمثلة إضافية - Additional Examples

#### إنشاء رد تلقائي بسيط - Create Simple Auto Reply

```bash
curl -X POST "http://localhost:3003/api/v1/autoReply" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "reply_name": "رد بسيط"
  }'
```

#### تحديث الكلمات المحفزة فقط - Update Only Triggers

```bash
curl -X PUT "http://localhost:3003/api/v1/autoReply/64f8a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "triggers": ["كلمة جديدة", "عبارة جديدة"]
  }'
```

---

## الدعم والمساعدة - Support and Help

للحصول على مساعدة إضافية أو الإبلاغ عن مشاكل، يرجى التواصل مع فريق التطوير.

For additional help or to report issues, please contact the development team.

---

**تاريخ آخر تحديث / Last Updated:** 2023-09-06  
**إصدار التوثيق / Documentation Version:** 1.0.0