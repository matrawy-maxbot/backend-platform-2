# توثيق APIs إدارة صور الترحيب
# Welcome Images Management API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة قوالب صور الترحيب في النظام. جميع المسارات تبدأ بـ `/api/v1/restful/welcome-images`

This documentation covers all API endpoints related to welcome images templates management in the system. All routes start with `/api/v1/restful/welcome-images`

---

## 1. الحصول على جميع قوالب صور الترحيب | Get All Welcome Images

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/welcome-images`
- **الوصف | Description:** الحصول على قائمة بجميع قوالب صور الترحيب في النظام
- **مستوى الوصول | Access Level:** Public

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة |
| offset | number | اختياري | عدد النتائج المتجاوزة |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/welcome-images?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب قوالب صور الترحيب بنجاح",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "server_id": "123456789012345678",
      "enabled": true,
      "backgroundImage": "https://example.com/background.jpg",
      "backgroundColor": "#36393f",
      "textColor": "#ffffff",
      "welcomeText": "مرحباً {username}!",
      "fontSize": 24,
      "fontFamily": "Arial",
      "avatarBorder": true,
      "avatarBorderColor": "#7289da",
      "avatarSize": 100,
      "position": {
        "x": 50,
        "y": 50
      },
      "imageWidth": 800,
      "imageHeight": 300,
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

## 2. الحصول على قالب صورة ترحيب بواسطة المعرف | Get Welcome Image by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/welcome-images/:id`
- **الوصف | Description:** الحصول على قالب صورة ترحيب محدد بواسطة معرفه
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف قالب صورة الترحيب (MongoDB ObjectId) |

### قواعد التحقق | Validation Rules
- `id` يجب أن يكون معرف MongoDB صحيح (24 حرف hex)

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/welcome-images/507f1f77bcf86cd799439011
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب قالب صورة الترحيب بنجاح",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "enabled": true,
    "backgroundImage": "https://example.com/background.jpg",
    "backgroundColor": "#36393f",
    "textColor": "#ffffff",
    "welcomeText": "مرحباً {username}!",
    "fontSize": 24,
    "fontFamily": "Arial",
    "avatarBorder": true,
    "avatarBorderColor": "#7289da",
    "avatarSize": 100,
    "position": {
      "x": 50,
      "y": 50
    },
    "imageWidth": 800,
    "imageHeight": 300,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - قالب صورة الترحيب غير موجود
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة على الأخطاء | Error Examples
```json
{
  "success": false,
  "message": "معرف قالب صورة الترحيب يجب أن يكون معرف MongoDB صحيح",
  "errors": [
    {
      "field": "id",
      "message": "معرف قالب صورة الترحيب يجب أن يكون معرف MongoDB صحيح"
    }
  ]
}
```

---

## 3. الحصول على قالب صورة ترحيب بواسطة معرف الخادم | Get Welcome Image by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/welcome-images/server/:serverId`
- **الوصف | Description:** الحصول على قالب صورة الترحيب لخادم محدد
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
GET /api/v1/restful/welcome-images/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم جلب قالب صورة الترحيب للخادم بنجاح",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "enabled": true,
    "backgroundImage": "https://example.com/background.jpg",
    "backgroundColor": "#36393f",
    "textColor": "#ffffff",
    "welcomeText": "مرحباً {username}!",
    "fontSize": 24,
    "fontFamily": "Arial",
    "avatarBorder": true,
    "avatarBorderColor": "#7289da",
    "avatarSize": 100,
    "position": {
      "x": 50,
      "y": 50
    },
    "imageWidth": 800,
    "imageHeight": 300,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب البيانات بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `404 Not Found` - قالب صورة الترحيب غير موجود للخادم
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

## 4. إنشاء قالب صورة ترحيب جديد | Create New Welcome Image

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/restful/welcome-images`
- **الوصف | Description:** إنشاء قالب صورة ترحيب جديد في النظام
- **مستوى الوصول | Access Level:** Public

### بيانات الطلب | Request Body
| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|-------|------|-------|------------------|-------|
| server_id | string | نعم | - | معرف الخادم (أرقام فقط، 1-50 حرف) |
| enabled | boolean | اختياري | true | حالة تفعيل قالب الصورة |
| backgroundImage | string | اختياري | "" | رابط صورة الخلفية (URI صحيح) |
| backgroundColor | string | اختياري | "#36393f" | لون الخلفية (كود hex) |
| textColor | string | اختياري | "#ffffff" | لون النص (كود hex) |
| welcomeText | string | اختياري | "مرحباً {username}!" | نص الترحيب (حد أقصى 200 حرف) |
| fontSize | number | اختياري | 24 | حجم الخط (12-72) |
| fontFamily | string | اختياري | "Arial" | نوع الخط |
| avatarBorder | boolean | اختياري | true | إظهار حدود الصورة الشخصية |
| avatarBorderColor | string | اختياري | "#7289da" | لون حدود الصورة الشخصية |
| avatarSize | number | اختياري | 100 | حجم الصورة الشخصية (50-200) |
| position | object | اختياري | {x: 50, y: 50} | موقع العناصر |
| imageWidth | number | اختياري | 800 | عرض الصورة (400-1200) |
| imageHeight | number | اختياري | 300 | ارتفاع الصورة (200-600) |

### قواعد التحقق | Validation Rules
- `server_id`: نص يحتوي على أرقام فقط، طول 1-50 حرف
- `backgroundColor`, `textColor`, `avatarBorderColor`: كود لون hex صحيح
- `backgroundImage`: رابط URI صحيح أو فارغ
- `welcomeText`: حد أقصى 200 حرف
- `fontSize`: رقم صحيح بين 12-72
- `fontFamily`: من القائمة المدعومة
- `avatarSize`: رقم صحيح بين 50-200
- `position`: كائن يحتوي على x و y (أرقام صحيحة ≥ 0)
- `imageWidth`: رقم صحيح بين 400-1200
- `imageHeight`: رقم صحيح بين 200-600

### الخطوط المدعومة | Supported Fonts
- Arial
- Helvetica
- Times New Roman
- Courier New
- Verdana
- Georgia
- Comic Sans MS
- Impact
- Trebuchet MS
- Tahoma

### مثال على الطلب | Request Example
```http
POST /api/v1/restful/welcome-images
Content-Type: application/json

{
  "server_id": "123456789012345678",
  "enabled": true,
  "backgroundImage": "https://example.com/background.jpg",
  "backgroundColor": "#2c2f33",
  "textColor": "#ffffff",
  "welcomeText": "أهلاً وسهلاً {username} في خادمنا!",
  "fontSize": 28,
  "fontFamily": "Arial",
  "avatarBorder": true,
  "avatarBorderColor": "#7289da",
  "avatarSize": 120,
  "position": {
    "x": 100,
    "y": 80
  },
  "imageWidth": 900,
  "imageHeight": 350
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء قالب صورة الترحيب بنجاح",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "server_id": "123456789012345678",
    "enabled": true,
    "backgroundImage": "https://example.com/background.jpg",
    "backgroundColor": "#2c2f33",
    "textColor": "#ffffff",
    "welcomeText": "أهلاً وسهلاً {username} في خادمنا!",
    "fontSize": 28,
    "fontFamily": "Arial",
    "avatarBorder": true,
    "avatarBorderColor": "#7289da",
    "avatarSize": 120,
    "position": {
      "x": 100,
      "y": 80
    },
    "imageWidth": 900,
    "imageHeight": 350,
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء قالب صورة الترحيب بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `409 Conflict` - قالب صورة الترحيب موجود مسبقاً للخادم
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
      "field": "backgroundColor",
      "message": "لون الخلفية يجب أن يكون كود لون hex صحيح"
    },
    {
      "field": "fontSize",
      "message": "حجم الخط يجب أن يكون بين 12 و 72"
    }
  ]
}
```

---

## 5. تحديث قالب صورة الترحيب بواسطة المعرف | Update Welcome Image by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/restful/welcome-images/:id`
- **الوصف | Description:** تحديث قالب صورة ترحيب موجود بواسطة معرفه
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف قالب صورة الترحيب (MongoDB ObjectId) |

### بيانات الطلب | Request Body
جميع الحقول اختيارية ويمكن تحديث أي منها:

| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| enabled | boolean | اختياري | حالة تفعيل قالب الصورة |
| backgroundImage | string | اختياري | رابط صورة الخلفية (URI صحيح أو فارغ) |
| backgroundColor | string | اختياري | لون الخلفية (كود hex) |
| textColor | string | اختياري | لون النص (كود hex) |
| welcomeText | string | اختياري | نص الترحيب (حد أقصى 200 حرف) |
| fontSize | number | اختياري | حجم الخط (12-72) |
| fontFamily | string | اختياري | نوع الخط |
| avatarBorder | boolean | اختياري | إظهار حدود الصورة الشخصية |
| avatarBorderColor | string | اختياري | لون حدود الصورة الشخصية |
| avatarSize | number | اختياري | حجم الصورة الشخصية (50-200) |
| position | object | اختياري | موقع العناصر |
| imageWidth | number | اختياري | عرض الصورة (400-1200) |
| imageHeight | number | اختياري | ارتفاع الصورة (200-600) |

### مثال على الطلب | Request Example
```http
PUT /api/v1/restful/welcome-images/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "enabled": false,
  "backgroundColor": "#23272a",
  "welcomeText": "مرحباً {username} في مجتمعنا الرائع!",
  "fontSize": 30,
  "avatarSize": 150
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث قالب صورة الترحيب بنجاح",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "enabled": false,
    "backgroundImage": "https://example.com/background.jpg",
    "backgroundColor": "#23272a",
    "textColor": "#ffffff",
    "welcomeText": "مرحباً {username} في مجتمعنا الرائع!",
    "fontSize": 30,
    "fontFamily": "Arial",
    "avatarBorder": true,
    "avatarBorderColor": "#7289da",
    "avatarSize": 150,
    "position": {
      "x": 50,
      "y": 50
    },
    "imageWidth": 800,
    "imageHeight": 300,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T14:20:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث قالب صورة الترحيب بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `404 Not Found` - قالب صورة الترحيب غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 6. تحديث قالب صورة الترحيب بواسطة معرف الخادم | Update Welcome Image by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/restful/welcome-images/server/:serverId`
- **الوصف | Description:** تحديث قالب صورة الترحيب لخادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### بيانات الطلب | Request Body
نفس بيانات الطلب في التحديث بواسطة المعرف

### مثال على الطلب | Request Example
```http
PUT /api/v1/restful/welcome-images/server/123456789012345678
Content-Type: application/json

{
  "enabled": true,
  "welcomeText": "أهلاً وسهلاً {username}!",
  "textColor": "#00ff00",
  "position": {
    "x": 200,
    "y": 100
  }
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم تحديث قالب صورة الترحيب للخادم بنجاح",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "enabled": true,
    "backgroundImage": "https://example.com/background.jpg",
    "backgroundColor": "#36393f",
    "textColor": "#00ff00",
    "welcomeText": "أهلاً وسهلاً {username}!",
    "fontSize": 24,
    "fontFamily": "Arial",
    "avatarBorder": true,
    "avatarBorderColor": "#7289da",
    "avatarSize": 100,
    "position": {
      "x": 200,
      "y": 100
    },
    "imageWidth": 800,
    "imageHeight": 300,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T16:45:00Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث قالب صورة الترحيب بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `404 Not Found` - قالب صورة الترحيب غير موجود للخادم
- `500 Internal Server Error` - خطأ في الخادم

---

## 7. حذف قالب صورة الترحيب بواسطة المعرف | Delete Welcome Image by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/welcome-images/:id`
- **الوصف | Description:** حذف قالب صورة ترحيب من النظام بواسطة معرفه
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string | نعم | معرف قالب صورة الترحيب (MongoDB ObjectId) |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/welcome-images/507f1f77bcf86cd799439011
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف قالب صورة الترحيب بنجاح",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف قالب صورة الترحيب بنجاح
- `400 Bad Request` - معرف غير صحيح
- `404 Not Found` - قالب صورة الترحيب غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 8. حذف قالب صورة الترحيب بواسطة معرف الخادم | Delete Welcome Image by Server ID

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/welcome-images/server/:serverId`
- **الوصف | Description:** حذف قالب صورة الترحيب لخادم محدد
- **مستوى الوصول | Access Level:** Public

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| serverId | string | نعم | معرف الخادم (أرقام فقط، 1-50 حرف) |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/welcome-images/server/123456789012345678
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "message": "تم حذف قالب صورة الترحيب للخادم بنجاح",
  "data": {
    "serverId": "123456789012345678",
    "deleted": true
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف قالب صورة الترحيب بنجاح
- `400 Bad Request` - معرف الخادم غير صحيح
- `404 Not Found` - قالب صورة الترحيب غير موجود للخادم
- `500 Internal Server Error` - خطأ في الخادم

---

## ملاحظات مهمة | Important Notes

### خصائص قوالب صور الترحيب | Welcome Image Template Features

#### النصوص الديناميكية | Dynamic Text
- يمكن استخدام `{username}` في نص الترحيب ليتم استبداله باسم المستخدم
- مثال: "مرحباً {username} في خادمنا!" سيصبح "مرحباً أحمد في خادمنا!"

#### الألوان المدعومة | Supported Colors
- جميع ألوان hex بتنسيق `#RRGGBB` أو `#RGB`
- أمثلة صحيحة: `#ffffff`, `#000`, `#7289da`, `#36393f`

#### أحجام الصور | Image Dimensions
- العرض: 400-1200 بكسل
- الارتفاع: 200-600 بكسل
- النسبة المثلى: 8:3 (مثل 800x300)

#### مواقع العناصر | Element Positioning
- النظام يستخدم إحداثيات X,Y
- X: المسافة من اليسار
- Y: المسافة من الأعلى
- القيم بالبكسل

### أمان البيانات | Data Security
- جميع معرفات الخوادم يجب أن تحتوي على أرقام فقط
- يتم التحقق من صحة جميع الروابط قبل الحفظ
- رسائل الخطأ متوفرة باللغة العربية

### تنسيق التواريخ | Date Format
- جميع التواريخ بتنسيق ISO 8601 (UTC)
- مثال: `2024-01-15T10:30:00Z`

### معالجة الأخطاء | Error Handling
- جميع الأخطاء تُرجع بتنسيق JSON موحد
- تتضمن رسائل خطأ واضحة باللغة العربية
- تحديد الحقل المسبب للخطأ عند الإمكان

### قيود النظام | System Limitations
- خادم واحد يمكن أن يحتوي على قالب صورة ترحيب واحد فقط
- حجم الخط محدود بين 12-72 بكسل
- حجم الصورة الشخصية محدود بين 50-200 بكسل

---

## أمثلة شاملة | Complete Examples

### مثال كامل لإنشاء قالب صورة ترحيب | Complete Welcome Image Creation Example

```bash
# طلب إنشاء قالب صورة ترحيب جديد
curl -X POST http://localhost:3003/api/v1/restful/welcome-images \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "enabled": true,
    "backgroundImage": "https://cdn.discordapp.com/attachments/123/456/background.jpg",
    "backgroundColor": "#2c2f33",
    "textColor": "#ffffff",
    "welcomeText": "أهلاً وسهلاً {username} في خادم الألعاب!",
    "fontSize": 32,
    "fontFamily": "Arial",
    "avatarBorder": true,
    "avatarBorderColor": "#7289da",
    "avatarSize": 120,
    "position": {
      "x": 150,
      "y": 100
    },
    "imageWidth": 1000,
    "imageHeight": 400
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم إنشاء قالب صورة الترحيب بنجاح",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "server_id": "123456789012345678",
    "enabled": true,
    "backgroundImage": "https://cdn.discordapp.com/attachments/123/456/background.jpg",
    "backgroundColor": "#2c2f33",
    "textColor": "#ffffff",
    "welcomeText": "أهلاً وسهلاً {username} في خادم الألعاب!",
    "fontSize": 32,
    "fontFamily": "Arial",
    "avatarBorder": true,
    "avatarBorderColor": "#7289da",
    "avatarSize": 120,
    "position": {
      "x": 150,
      "y": 100
    },
    "imageWidth": 1000,
    "imageHeight": 400,
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z"
  }
}
```

### مثال كامل لتحديث قالب صورة الترحيب | Complete Welcome Image Update Example

```bash
# طلب تحديث قالب صورة الترحيب
curl -X PUT http://localhost:3003/api/v1/restful/welcome-images/server/123456789012345678 \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": false,
    "welcomeText": "مرحباً {username}! نتمنى لك وقتاً ممتعاً",
    "textColor": "#00ff41",
    "fontSize": 28,
    "avatarBorderColor": "#ff6b6b"
  }'

# الاستجابة المتوقعة
{
  "success": true,
  "message": "تم تحديث قالب صورة الترحيب للخادم بنجاح",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "server_id": "123456789012345678",
    "enabled": false,
    "backgroundImage": "https://cdn.discordapp.com/attachments/123/456/background.jpg",
    "backgroundColor": "#2c2f33",
    "textColor": "#00ff41",
    "welcomeText": "مرحباً {username}! نتمنى لك وقتاً ممتعاً",
    "fontSize": 28,
    "fontFamily": "Arial",
    "avatarBorder": true,
    "avatarBorderColor": "#ff6b6b",
    "avatarSize": 120,
    "position": {
      "x": 150,
      "y": 100
    },
    "imageWidth": 1000,
    "imageHeight": 400,
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T14:30:00Z"
  }
}
```

### مثال على خطأ في التحقق | Validation Error Example

```bash
# طلب بمعاملات خاطئة
curl -X POST http://localhost:3003/api/v1/restful/welcome-images \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "invalid_server_id",
    "fontSize": 100,
    "backgroundColor": "invalid_color",
    "avatarSize": 300
  }'

# الاستجابة المتوقعة للخطأ
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "errors": [
    {
      "field": "server_id",
      "message": "معرف الخادم يجب أن يحتوي على أرقام فقط"
    },
    {
      "field": "fontSize",
      "message": "حجم الخط يجب ألا يتجاوز 72"
    },
    {
      "field": "backgroundColor",
      "message": "لون الخلفية يجب أن يكون كود لون hex صحيح"
    },
    {
      "field": "avatarSize",
      "message": "حجم الصورة الشخصية يجب ألا يتجاوز 200"
    }
  ]
}
```

---

## معلومات الاتصال | Contact Information

للمزيد من المعلومات أو الدعم التقني، يرجى الرجوع إلى فريق التطوير.

For more information or technical support, please contact the development team.