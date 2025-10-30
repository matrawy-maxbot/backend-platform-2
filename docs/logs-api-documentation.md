# Logs Management API Documentation

## نظرة عامة / Overview

هذا التوثيق يغطي جميع APIs المتعلقة بإدارة السجلات في النظام. يتيح هذا النظام إدارة سجلات الخوادم المختلفة مثل سجلات انضمام ومغادرة الأعضاء، تغييرات الأدوار، تغييرات القنوات، الطرد والحظر، تحديثات الأعضاء، تغييرات الرسائل، وإعدادات الخادم.

This documentation covers all APIs related to logs management in the system. This system allows managing various server logs such as member join/leave logs, role changes, channel changes, kick/ban, member updates, message changes, and server settings.

## Base URL

```
http://localhost:3000/api/v1/logs
```

## أنواع السجلات المدعومة / Supported Log Types

| النوع / Type | الوصف / Description |
|-------------|-------------------|
| `member_join_leave` | سجلات انضمام ومغادرة الأعضاء / Member join/leave logs |
| `role_changes` | سجلات تغييرات الأدوار / Role changes logs |
| `channel_changes` | سجلات تغييرات القنوات / Channel changes logs |
| `kick_ban` | سجلات الطرد والحظر / Kick/ban logs |
| `member_updates` | سجلات تحديثات الأعضاء / Member updates logs |
| `message_changes` | سجلات تغييرات الرسائل / Message changes logs |
| `server_settings` | سجلات إعدادات الخادم / Server settings logs |

## بنية كائن السجل / Log Object Structure

كل نوع سجل يحتوي على الحقول التالية:
Each log type contains the following fields:

```json
{
  "enabled": boolean,     // تفعيل/إلغاء تفعيل نوع السجل / Enable/disable log type
  "channel_id": string|null  // معرف القناة المخصصة للسجل / Channel ID for the log (optional)
}
```

---

## 1. الحصول على جميع السجلات / Get All Logs

### معلومات الطلب / Request Information
- **المسار / Route:** `GET /`
- **الوصف / Description:** الحصول على جميع السجلات مع إمكانية التصفية والترتيب / Get all logs with filtering and sorting options
- **مستوى الوصول / Access Level:** `admin`

### معاملات الاستعلام / Query Parameters
| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|-------------------|-------------|-----------------|-------------------|
| `limit` | number | لا / No | عدد النتائج المطلوبة (افتراضي: 10) / Number of results (default: 10) |
| `offset` | number | لا / No | عدد النتائج المتجاهلة (افتراضي: 0) / Number of results to skip (default: 0) |

### مثال على الطلب / Request Example
```bash
curl -X GET "http://localhost:3000/api/v1/logs?limit=5&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### الاستجابة المتوقعة / Expected Response
```json
{
  "success": true,
  "message": "تم الحصول على السجلات بنجاح",
  "data": {
    "logs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "server_id": "123456789012345678",
        "member_join_leave": {
          "enabled": true,
          "channel_id": "987654321098765432"
        },
        "role_changes": {
          "enabled": false,
          "channel_id": null
        },
        "channel_changes": {
          "enabled": true,
          "channel_id": "876543210987654321"
        },
        "kick_ban": {
          "enabled": true,
          "channel_id": "765432109876543210"
        },
        "member_updates": {
          "enabled": false,
          "channel_id": null
        },
        "message_changes": {
          "enabled": true,
          "channel_id": "654321098765432109"
        },
        "server_settings": {
          "enabled": false,
          "channel_id": null
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 5,
      "offset": 0,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### رموز الاستجابة / Response Codes
- `200` - نجح الطلب / Success
- `400` - خطأ في معاملات الطلب / Bad request parameters
- `401` - غير مصرح / Unauthorized
- `500` - خطأ في الخادم / Server error

---

## 2. الحصول على سجل بواسطة المعرف / Get Log by ID

### معلومات الطلب / Request Information
- **المسار / Route:** `GET /:id`
- **الوصف / Description:** الحصول على سجل محدد بواسطة معرفه / Get a specific log by its ID
- **مستوى الوصول / Access Level:** `admin`

### معاملات المسار / Path Parameters
| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|-------------------|-------------|-----------------|-------------------|
| `id` | string | نعم / Yes | معرف السجل (MongoDB ObjectId) / Log ID (MongoDB ObjectId) |

### قواعد التحقق / Validation Rules
- `id`: يجب أن يكون معرف MongoDB صحيح (24 حرف hex) / Must be a valid MongoDB ObjectId (24 hex characters)

### مثال على الطلب / Request Example
```bash
curl -X GET "http://localhost:3000/api/v1/logs/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### الاستجابة المتوقعة / Expected Response
```json
{
  "success": true,
  "message": "تم الحصول على السجل بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "member_join_leave": {
      "enabled": true,
      "channel_id": "987654321098765432"
    },
    "role_changes": {
      "enabled": false,
      "channel_id": null
    },
    "channel_changes": {
      "enabled": true,
      "channel_id": "876543210987654321"
    },
    "kick_ban": {
      "enabled": true,
      "channel_id": "765432109876543210"
    },
    "member_updates": {
      "enabled": false,
      "channel_id": null
    },
    "message_changes": {
      "enabled": true,
      "channel_id": "654321098765432109"
    },
    "server_settings": {
      "enabled": false,
      "channel_id": null
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### رموز الاستجابة / Response Codes
- `200` - نجح الطلب / Success
- `400` - معرف غير صحيح / Invalid ID format
- `401` - غير مصرح / Unauthorized
- `404` - السجل غير موجود / Log not found
- `500` - خطأ في الخادم / Server error

### مثال على خطأ / Error Example
```json
{
  "success": false,
  "message": "معرف السجل يجب أن يكون معرف MongoDB صحيح",
  "errors": [
    {
      "field": "id",
      "message": "معرف السجل يجب أن يكون معرف MongoDB صحيح"
    }
  ]
}
```

---

## 3. الحصول على السجلات بواسطة معرف الخادم / Get Logs by Server ID

### معلومات الطلب / Request Information
- **المسار / Route:** `GET /server/:serverId`
- **الوصف / Description:** الحصول على جميع السجلات لخادم محدد / Get all logs for a specific server
- **مستوى الوصول / Access Level:** `admin`

### معاملات المسار / Path Parameters
| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|-------------------|-------------|-----------------|-------------------|
| `serverId` | string | نعم / Yes | معرف الخادم (أرقام فقط، 1-50 حرف) / Server ID (numbers only, 1-50 characters) |

### قواعد التحقق / Validation Rules
- `serverId`: يجب أن يحتوي على أرقام فقط، طوله بين 1-50 حرف / Must contain only numbers, length 1-50 characters

### مثال على الطلب / Request Example
```bash
curl -X GET "http://localhost:3000/api/v1/logs/server/123456789012345678" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### الاستجابة المتوقعة / Expected Response
```json
{
  "success": true,
  "message": "تم الحصول على سجلات الخادم بنجاح",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "server_id": "123456789012345678",
      "member_join_leave": {
        "enabled": true,
        "channel_id": "987654321098765432"
      },
      "role_changes": {
        "enabled": false,
        "channel_id": null
      },
      "channel_changes": {
        "enabled": true,
        "channel_id": "876543210987654321"
      },
      "kick_ban": {
        "enabled": true,
        "channel_id": "765432109876543210"
      },
      "member_updates": {
        "enabled": false,
        "channel_id": null
      },
      "message_changes": {
        "enabled": true,
        "channel_id": "654321098765432109"
      },
      "server_settings": {
        "enabled": false,
        "channel_id": null
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### رموز الاستجابة / Response Codes
- `200` - نجح الطلب / Success
- `400` - معرف خادم غير صحيح / Invalid server ID format
- `401` - غير مصرح / Unauthorized
- `404` - لا توجد سجلات لهذا الخادم / No logs found for this server
- `500` - خطأ في الخادم / Server error

---

## 4. إنشاء سجل جديد / Create New Log

### معلومات الطلب / Request Information
- **المسار / Route:** `POST /`
- **الوصف / Description:** إنشاء سجل جديد لخادم / Create a new log for a server
- **مستوى الوصول / Access Level:** `admin`

### بيانات الطلب / Request Body
| الحقل / Field | النوع / Type | مطلوب / Required | الوصف / Description |
|-------------|-------------|-----------------|-------------------|
| `server_id` | string | نعم / Yes | معرف الخادم (أرقام فقط، 1-50 حرف) / Server ID (numbers only, 1-50 characters) |
| `member_join_leave` | object | لا / No | إعدادات سجلات انضمام ومغادرة الأعضاء / Member join/leave log settings |
| `role_changes` | object | لا / No | إعدادات سجلات تغييرات الأدوار / Role changes log settings |
| `channel_changes` | object | لا / No | إعدادات سجلات تغييرات القنوات / Channel changes log settings |
| `kick_ban` | object | لا / No | إعدادات سجلات الطرد والحظر / Kick/ban log settings |
| `member_updates` | object | لا / No | إعدادات سجلات تحديثات الأعضاء / Member updates log settings |
| `message_changes` | object | لا / No | إعدادات سجلات تغييرات الرسائل / Message changes log settings |
| `server_settings` | object | لا / No | إعدادات سجلات إعدادات الخادم / Server settings log settings |

### بنية كائن إعدادات السجل / Log Settings Object Structure
```json
{
  "enabled": boolean,        // افتراضي: false / Default: false
  "channel_id": string|null  // معرف القناة أو null، افتراضي: null / Channel ID or null, default: null
}
```

### قواعد التحقق / Validation Rules
- `server_id`: أرقام فقط، طوله 1-50 حرف / Numbers only, length 1-50 characters
- `enabled`: قيمة منطقية / Boolean value
- `channel_id`: أرقام فقط أو null، طوله 1-50 حرف إذا لم يكن null / Numbers only or null, length 1-50 characters if not null

### مثال على الطلب / Request Example
```bash
curl -X POST "http://localhost:3000/api/v1/logs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "member_join_leave": {
      "enabled": true,
      "channel_id": "987654321098765432"
    },
    "role_changes": {
      "enabled": false,
      "channel_id": null
    },
    "channel_changes": {
      "enabled": true,
      "channel_id": "876543210987654321"
    },
    "kick_ban": {
      "enabled": true,
      "channel_id": "765432109876543210"
    },
    "member_updates": {
      "enabled": false,
      "channel_id": null
    },
    "message_changes": {
      "enabled": true,
      "channel_id": "654321098765432109"
    },
    "server_settings": {
      "enabled": false,
      "channel_id": null
    }
  }'
```

### الاستجابة المتوقعة / Expected Response
```json
{
  "success": true,
  "message": "تم إنشاء السجل بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "member_join_leave": {
      "enabled": true,
      "channel_id": "987654321098765432"
    },
    "role_changes": {
      "enabled": false,
      "channel_id": null
    },
    "channel_changes": {
      "enabled": true,
      "channel_id": "876543210987654321"
    },
    "kick_ban": {
      "enabled": true,
      "channel_id": "765432109876543210"
    },
    "member_updates": {
      "enabled": false,
      "channel_id": null
    },
    "message_changes": {
      "enabled": true,
      "channel_id": "654321098765432109"
    },
    "server_settings": {
      "enabled": false,
      "channel_id": null
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### رموز الاستجابة / Response Codes
- `201` - تم الإنشاء بنجاح / Created successfully
- `400` - بيانات غير صحيحة / Invalid data
- `401` - غير مصرح / Unauthorized
- `409` - السجل موجود بالفعل لهذا الخادم / Log already exists for this server
- `500` - خطأ في الخادم / Server error

### مثال على خطأ التحقق / Validation Error Example
```json
{
  "success": false,
  "message": "خطأ في التحقق من البيانات",
  "errors": [
    {
      "field": "server_id",
      "message": "معرف الخادم يجب أن يحتوي على أرقام فقط"
    },
    {
      "field": "member_join_leave.channel_id",
      "message": "معرف قناة سجلات انضمام ومغادرة الأعضاء يجب أن يحتوي على أرقام فقط"
    }
  ]
}
```

---

## 5. تحديث سجل بواسطة المعرف / Update Log by ID

### معلومات الطلب / Request Information
- **المسار / Route:** `PUT /:id`
- **الوصف / Description:** تحديث سجل موجود بواسطة معرفه / Update an existing log by its ID
- **مستوى الوصول / Access Level:** `admin`

### معاملات المسار / Path Parameters
| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|-------------------|-------------|-----------------|-------------------|
| `id` | string | نعم / Yes | معرف السجل (MongoDB ObjectId) / Log ID (MongoDB ObjectId) |

### بيانات الطلب / Request Body
جميع حقول إعدادات السجل اختيارية، يجب تمرير حقل واحد على الأقل:
All log settings fields are optional, at least one field must be provided:

| الحقل / Field | النوع / Type | مطلوب / Required | الوصف / Description |
|-------------|-------------|-----------------|-------------------|
| `member_join_leave` | object | لا / No | إعدادات سجلات انضمام ومغادرة الأعضاء / Member join/leave log settings |
| `role_changes` | object | لا / No | إعدادات سجلات تغييرات الأدوار / Role changes log settings |
| `channel_changes` | object | لا / No | إعدادات سجلات تغييرات القنوات / Channel changes log settings |
| `kick_ban` | object | لا / No | إعدادات سجلات الطرد والحظر / Kick/ban log settings |
| `member_updates` | object | لا / No | إعدادات سجلات تحديثات الأعضاء / Member updates log settings |
| `message_changes` | object | لا / No | إعدادات سجلات تغييرات الرسائل / Message changes log settings |
| `server_settings` | object | لا / No | إعدادات سجلات إعدادات الخادم / Server settings log settings |

### قواعد التحقق / Validation Rules
- `id`: يجب أن يكون معرف MongoDB صحيح / Must be a valid MongoDB ObjectId
- يجب تمرير حقل واحد على الأقل في الطلب / At least one field must be provided in the request
- نفس قواعد التحقق لإعدادات السجل كما في إنشاء السجل / Same validation rules for log settings as in create log

### مثال على الطلب / Request Example
```bash
curl -X PUT "http://localhost:3000/api/v1/logs/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "member_join_leave": {
      "enabled": false,
      "channel_id": null
    },
    "role_changes": {
      "enabled": true,
      "channel_id": "111222333444555666"
    }
  }'
```

### الاستجابة المتوقعة / Expected Response
```json
{
  "success": true,
  "message": "تم تحديث السجل بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "member_join_leave": {
      "enabled": false,
      "channel_id": null
    },
    "role_changes": {
      "enabled": true,
      "channel_id": "111222333444555666"
    },
    "channel_changes": {
      "enabled": true,
      "channel_id": "876543210987654321"
    },
    "kick_ban": {
      "enabled": true,
      "channel_id": "765432109876543210"
    },
    "member_updates": {
      "enabled": false,
      "channel_id": null
    },
    "message_changes": {
      "enabled": true,
      "channel_id": "654321098765432109"
    },
    "server_settings": {
      "enabled": false,
      "channel_id": null
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

### رموز الاستجابة / Response Codes
- `200` - تم التحديث بنجاح / Updated successfully
- `400` - بيانات غير صحيحة أو معرف غير صحيح / Invalid data or ID format
- `401` - غير مصرح / Unauthorized
- `404` - السجل غير موجود / Log not found
- `500` - خطأ في الخادم / Server error

---

## 6. تحديث سجل بواسطة معرف الخادم / Update Log by Server ID

### معلومات الطلب / Request Information
- **المسار / Route:** `PUT /server/:serverId`
- **الوصف / Description:** تحديث سجل بواسطة معرف الخادم / Update log by server ID
- **مستوى الوصول / Access Level:** `admin`

### معاملات المسار / Path Parameters
| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|-------------------|-------------|-----------------|-------------------|
| `serverId` | string | نعم / Yes | معرف الخادم (أرقام فقط، 1-50 حرف) / Server ID (numbers only, 1-50 characters) |

### بيانات الطلب / Request Body
نفس بنية بيانات الطلب كما في تحديث السجل بواسطة المعرف
Same request body structure as update log by ID

### مثال على الطلب / Request Example
```bash
curl -X PUT "http://localhost:3000/api/v1/logs/server/123456789012345678" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "kick_ban": {
      "enabled": false,
      "channel_id": null
    },
    "server_settings": {
      "enabled": true,
      "channel_id": "999888777666555444"
    }
  }'
```

### الاستجابة المتوقعة / Expected Response
```json
{
  "success": true,
  "message": "تم تحديث سجل الخادم بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "server_id": "123456789012345678",
    "member_join_leave": {
      "enabled": false,
      "channel_id": null
    },
    "role_changes": {
      "enabled": true,
      "channel_id": "111222333444555666"
    },
    "channel_changes": {
      "enabled": true,
      "channel_id": "876543210987654321"
    },
    "kick_ban": {
      "enabled": false,
      "channel_id": null
    },
    "member_updates": {
      "enabled": false,
      "channel_id": null
    },
    "message_changes": {
      "enabled": true,
      "channel_id": "654321098765432109"
    },
    "server_settings": {
      "enabled": true,
      "channel_id": "999888777666555444"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:15:00.000Z"
  }
}
```

### رموز الاستجابة / Response Codes
- `200` - تم التحديث بنجاح / Updated successfully
- `400` - معرف خادم غير صحيح أو بيانات غير صحيحة / Invalid server ID or data
- `401` - غير مصرح / Unauthorized
- `404` - السجل غير موجود لهذا الخادم / Log not found for this server
- `500` - خطأ في الخادم / Server error

---

## 7. حذف سجل بواسطة المعرف / Delete Log by ID

### معلومات الطلب / Request Information
- **المسار / Route:** `DELETE /:id`
- **الوصف / Description:** حذف سجل بواسطة معرفه / Delete a log by its ID
- **مستوى الوصول / Access Level:** `admin`

### معاملات المسار / Path Parameters
| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|-------------------|-------------|-----------------|-------------------|
| `id` | string | نعم / Yes | معرف السجل (MongoDB ObjectId) / Log ID (MongoDB ObjectId) |

### قواعد التحقق / Validation Rules
- `id`: يجب أن يكون معرف MongoDB صحيح / Must be a valid MongoDB ObjectId

### مثال على الطلب / Request Example
```bash
curl -X DELETE "http://localhost:3000/api/v1/logs/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### الاستجابة المتوقعة / Expected Response
```json
{
  "success": true,
  "message": "تم حذف السجل بنجاح",
  "data": {
    "deletedId": "507f1f77bcf86cd799439011"
  }
}
```

### رموز الاستجابة / Response Codes
- `200` - تم الحذف بنجاح / Deleted successfully
- `400` - معرف غير صحيح / Invalid ID format
- `401` - غير مصرح / Unauthorized
- `404` - السجل غير موجود / Log not found
- `500` - خطأ في الخادم / Server error

---

## 8. حذف سجل بواسطة معرف الخادم / Delete Log by Server ID

### معلومات الطلب / Request Information
- **المسار / Route:** `DELETE /server/:serverId`
- **الوصف / Description:** حذف سجل بواسطة معرف الخادم / Delete log by server ID
- **مستوى الوصول / Access Level:** `admin`

### معاملات المسار / Path Parameters
| المعامل / Parameter | النوع / Type | مطلوب / Required | الوصف / Description |
|-------------------|-------------|-----------------|-------------------|
| `serverId` | string | نعم / Yes | معرف الخادم (أرقام فقط، 1-50 حرف) / Server ID (numbers only, 1-50 characters) |

### قواعد التحقق / Validation Rules
- `serverId`: يجب أن يحتوي على أرقام فقط، طوله بين 1-50 حرف / Must contain only numbers, length 1-50 characters

### مثال على الطلب / Request Example
```bash
curl -X DELETE "http://localhost:3000/api/v1/logs/server/123456789012345678" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### الاستجابة المتوقعة / Expected Response
```json
{
  "success": true,
  "message": "تم حذف سجل الخادم بنجاح",
  "data": {
    "deletedServerId": "123456789012345678",
    "deletedCount": 1
  }
}
```

### رموز الاستجابة / Response Codes
- `200` - تم الحذف بنجاح / Deleted successfully
- `400` - معرف خادم غير صحيح / Invalid server ID format
- `401` - غير مصرح / Unauthorized
- `404` - لا يوجد سجل لهذا الخادم / No log found for this server
- `500` - خطأ في الخادم / Server error

---

## أمثلة شاملة / Complete Examples

### مثال شامل: إدارة سجلات خادم / Complete Example: Managing Server Logs

#### 1. إنشاء سجل جديد لخادم / Create New Log for Server
```bash
curl -X POST "http://localhost:3000/api/v1/logs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "server_id": "123456789012345678",
    "member_join_leave": {
      "enabled": true,
      "channel_id": "987654321098765432"
    },
    "role_changes": {
      "enabled": true,
      "channel_id": "876543210987654321"
    },
    "channel_changes": {
      "enabled": false,
      "channel_id": null
    },
    "kick_ban": {
      "enabled": true,
      "channel_id": "765432109876543210"
    },
    "member_updates": {
      "enabled": false,
      "channel_id": null
    },
    "message_changes": {
      "enabled": true,
      "channel_id": "654321098765432109"
    },
    "server_settings": {
      "enabled": true,
      "channel_id": "543210987654321098"
    }
  }'
```

#### 2. الحصول على السجل المُنشأ / Get Created Log
```bash
curl -X GET "http://localhost:3000/api/v1/logs/server/123456789012345678" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### 3. تحديث بعض إعدادات السجل / Update Some Log Settings
```bash
curl -X PUT "http://localhost:3000/api/v1/logs/server/123456789012345678" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_changes": {
      "enabled": true,
      "channel_id": "111111111111111111"
    },
    "member_updates": {
      "enabled": true,
      "channel_id": "222222222222222222"
    }
  }'
```

#### 4. حذف السجل / Delete Log
```bash
curl -X DELETE "http://localhost:3000/api/v1/logs/server/123456789012345678" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## ملاحظات مهمة / Important Notes

### الأمان / Security
- جميع APIs تتطلب مصادقة صحيحة / All APIs require valid authentication
- مستوى الوصول المطلوب: `admin` / Required access level: `admin`
- يجب التحقق من صحة جميع المدخلات / All inputs must be validated

### قواعد البيانات / Database Rules
- معرف الخادم يجب أن يكون فريد لكل سجل / Server ID must be unique for each log
- لا يمكن إنشاء أكثر من سجل واحد لنفس الخادم / Cannot create more than one log for the same server
- جميع معرفات القنوات يجب أن تكون صحيحة / All channel IDs must be valid

### أفضل الممارسات / Best Practices
- استخدم معاملات التصفية والترتيب عند الحصول على جميع السجلات / Use filtering and sorting parameters when getting all logs
- تحقق من وجود السجل قبل محاولة تحديثه أو حذفه / Check if log exists before trying to update or delete
- استخدم معرف الخادم بدلاً من معرف السجل عندما يكون ذلك ممكناً / Use server ID instead of log ID when possible
- تأكد من صحة معرفات القنوات قبل الإرسال / Validate channel IDs before sending

### معالجة الأخطاء / Error Handling
- تحقق دائماً من رمز الاستجابة قبل معالجة البيانات / Always check response code before processing data
- اقرأ رسائل الخطأ للحصول على تفاصيل محددة / Read error messages for specific details
- تعامل مع أخطاء الشبكة والخادم بشكل مناسب / Handle network and server errors appropriately

---

## الخلاصة / Summary

هذا التوثيق يغطي جميع APIs المتعلقة بإدارة السجلات في النظام. يمكن استخدام هذه APIs لإنشاء وقراءة وتحديث وحذف سجلات الخوادم المختلفة. تأكد من اتباع قواعد التحقق والأمان المذكورة أعلاه.

This documentation covers all APIs related to logs management in the system. These APIs can be used to create, read, update, and delete logs for different servers. Make sure to follow the validation rules and security guidelines mentioned above.