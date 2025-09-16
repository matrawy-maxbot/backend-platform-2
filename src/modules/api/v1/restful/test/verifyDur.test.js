// ملف اختبارات VerifyDur API
import newman from 'newman';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مجموعة Postman لاختبارات VerifyDur
const verifyDurCollection = {
  "info": {
    "_postman_id": "verifydur-api-tests",
    "name": "VerifyDur API Tests",
    "description": "اختبارات شاملة لواجهة برمجة تطبيقات مدة التحقق",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create VerifyDur",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('VerifyDur created successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('id');",
              "    pm.expect(responseJson).to.have.property('userId');",
              "    pm.expect(responseJson).to.have.property('guild_id');",
              "    pm.expect(responseJson).to.have.property('duration');",
              "    pm.expect(responseJson).to.have.property('TimeStamp');",
              "    ",
              "    // Store the created ID for later tests",
              "    pm.environment.set('verifyDurId', responseJson.id);",
              "});",
              "",
              "pm.test('Default values are correct', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson.duration).to.eql('1h');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "userId": "{{test_user_id}}",
            "guild_id": "{{test_guild_id}}",
            "duration": "1h"
          })
        },
        "url": {
          "raw": "{{base_url}}",
          "host": ["{{base_url}}"]
        }
      }
    },
    {
      "name": "Create User VerifyDur",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('User VerifyDur created successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('id');",
              "    pm.expect(responseJson).to.have.property('userId');",
              "    pm.expect(responseJson).to.have.property('guild_id');",
              "    pm.expect(responseJson).to.have.property('duration');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "userId": "{{test_user_id_2}}",
            "guildId": "{{test_guild_id_2}}",
            "duration": "2h"
          })
        },
        "url": {
          "raw": "{{base_url}}/user",
          "host": ["{{base_url}}"],
          "path": ["user"]
        }
      }
    },
    {
      "name": "Get All VerifyDur",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response is an array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.be.an('array');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}",
          "host": ["{{base_url}}"]
        }
      }
    },
    {
      "name": "Get VerifyDur Stats",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Stats response has required properties', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('totalRecords');",
              "    pm.expect(responseJson).to.have.property('activeRecords');",
              "    pm.expect(responseJson).to.have.property('expiredRecords');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/stats",
          "host": ["{{base_url}}"],
          "path": ["stats"]
        }
      }
    },
    {
      "name": "Get VerifyDur by ID",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('VerifyDur found successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('id');",
              "    pm.expect(responseJson).to.have.property('userId');",
              "    pm.expect(responseJson).to.have.property('guild_id');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/{{verifyDurId}}",
          "host": ["{{base_url}}"],
          "path": ["{{verifyDurId}}"]
        }
      }
    },
    {
      "name": "Get VerifyDur by User and Guild",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('VerifyDur found for user and guild', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('userId');",
              "    pm.expect(responseJson).to.have.property('guild_id');",
              "    pm.expect(responseJson.userId).to.eql(pm.environment.get('test_user_id'));",
              "    pm.expect(responseJson.guild_id).to.eql(pm.environment.get('test_guild_id'));",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/user/{{test_user_id}}/guild/{{test_guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["user", "{{test_user_id}}", "guild", "{{test_guild_id}}"]
        }
      }
    },
    {
      "name": "Get VerifyDur by User ID",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response is an array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.be.an('array');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/user/{{test_user_id}}",
          "host": ["{{base_url}}"],
          "path": ["user", "{{test_user_id}}"]
        }
      }
    },
    {
      "name": "Get VerifyDur by Guild ID",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response is an array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.be.an('array');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/guild/{{test_guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["guild", "{{test_guild_id}}"]
        }
      }
    },
    {
      "name": "Get VerifyDur by Duration",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response is an array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.be.an('array');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/duration/1h",
          "host": ["{{base_url}}"],
          "path": ["duration", "1h"]
        }
      }
    },
    {
      "name": "Check if VerifyDur Expired",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has expired status', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('expired');",
              "    pm.expect(responseJson.expired).to.be.a('boolean');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/expired/{{test_user_id}}/{{test_guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["expired", "{{test_user_id}}", "{{test_guild_id}}"]
        }
      }
    },
    {
      "name": "Get Remaining Verify Time",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has remaining time info', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('remainingTime');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/remaining/{{test_user_id}}/{{test_guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["remaining", "{{test_user_id}}", "{{test_guild_id}}"]
        }
      }
    },
    {
      "name": "Update VerifyDur",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('VerifyDur updated successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('duration');",
              "    pm.expect(responseJson.duration).to.eql('3h');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "duration": "3h"
          })
        },
        "url": {
          "raw": "{{base_url}}/{{verifyDurId}}",
          "host": ["{{base_url}}"],
          "path": ["{{verifyDurId}}"]
        }
      }
    },
    {
      "name": "Update User VerifyDur Duration",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('User VerifyDur duration updated successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('duration');",
              "    pm.expect(responseJson.duration).to.eql('4h');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "duration": "4h"
          })
        },
        "url": {
          "raw": "{{base_url}}/user/{{test_user_id_2}}/guild/{{test_guild_id_2}}",
          "host": ["{{base_url}}"],
          "path": ["user", "{{test_user_id_2}}", "guild", "{{test_guild_id_2}}"]
        }
      }
    },
    {
      "name": "Create VerifyDur with Invalid Data",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 400', function () {",
              "    pm.response.to.have.status(400);",
              "});",
              "",
              "pm.test('Error message is present', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('message');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "userId": "",
            "guild_id": "",
            "duration": "invalid_duration"
          })
        },
        "url": {
          "raw": "{{base_url}}",
          "host": ["{{base_url}}"]
        }
      }
    },
    {
      "name": "Delete VerifyDur",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('VerifyDur deleted successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('message');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{base_url}}/{{verifyDurId}}",
          "host": ["{{base_url}}"],
          "path": ["{{verifyDurId}}"]
        }
      }
    },
    {
      "name": "Delete User VerifyDur",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('User VerifyDur deleted successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('message');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{base_url}}/user/{{test_user_id_2}}/guild/{{test_guild_id_2}}",
          "host": ["{{base_url}}"],
          "path": ["user", "{{test_user_id_2}}", "guild", "{{test_guild_id_2}}"]
        }
      }
    },
    {
      "name": "Get Deleted VerifyDur (Should Fail)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 404', function () {",
              "    pm.response.to.have.status(404);",
              "});",
              "",
              "pm.test('Error message indicates not found', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('message');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/{{verifyDurId}}",
          "host": ["{{base_url}}"],
          "path": ["{{verifyDurId}}"]
        }
      }
    }
  ]
};

// بيئة الاختبار
const verifyDurEnvironment = {
  "id": "verifydur-test-environment",
  "name": "VerifyDur Test Environment",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1/verifyDur",
      "type": "default",
      "enabled": true
    },
    {
      "key": "test_user_id",
      "value": "tu__1756128570019",
      "type": "default",
      "enabled": true
    },
    {
      "key": "test_guild_id",
      "value": "tg__1756128570019",
      "type": "default",
      "enabled": true
    },
    {
      "key": "test_user_id_2",
      "value": "tu2_1756128570020",
      "type": "default",
      "enabled": true
    },
    {
      "key": "test_guild_id_2",
      "value": "tg2_1756128570020",
      "type": "default",
      "enabled": true
    },
    {
      "key": "verifyDurId",
      "value": "",
      "type": "default",
      "enabled": true
    }
  ],
  "_postman_variable_scope": "environment"
};

/**
 * تشغيل جميع اختبارات VerifyDur
 * @returns {Promise<Object>} نتائج الاختبارات
 */
export async function runVerifyDurTests() {
  return new Promise((resolve, reject) => {
    newman.run({
      collection: verifyDurCollection,
      environment: verifyDurEnvironment,
      reporters: ['cli', 'json'],
      reporter: {
        json: {
          export: path.join(__dirname, 'exports', 'verifyDur-test-results.json')
        }
      },
      iterationCount: 1,
      delayRequest: 500, // تأخير 500ms بين الطلبات
      timeout: 30000, // مهلة زمنية 30 ثانية
      timeoutRequest: 10000, // مهلة زمنية للطلب 10 ثواني
      bail: false, // عدم التوقف عند أول خطأ
      color: 'on'
    }, (err, summary) => {
      if (err) {
        console.error('❌ خطأ في تشغيل اختبارات VerifyDur:', err);
        reject(err);
        return;
      }

      console.log('\n📊 ملخص نتائج اختبار VerifyDur:');
      console.log(`✅ الاختبارات المنجزة: ${summary.run.stats.tests.total}`);
      console.log(`✅ الاختبارات الناجحة: ${summary.run.stats.tests.passed}`);
      console.log(`❌ الاختبارات الفاشلة: ${summary.run.stats.tests.failed}`);
      console.log(`📝 الطلبات المرسلة: ${summary.run.stats.requests.total}`);
      console.log(`⏱️  المدة الإجمالية: ${summary.run.timings.completed}ms`);

      if (summary.run.failures.length > 0) {
        console.log('\n❌ الاختبارات الفاشلة:');
        summary.run.failures.forEach((failure, index) => {
          console.log(`${index + 1}. ${failure.error.name}: ${failure.error.message}`);
        });
      }

      const results = {
        totalTests: summary.run.stats.tests.total,
        passedTests: summary.run.stats.tests.passed,
        failedTests: summary.run.stats.tests.failed,
        totalRequests: summary.run.stats.requests.total,
        duration: summary.run.timings.completed
      };

      resolve(results);
    });
  });
}

/**
 * تشغيل اختبار محدد من اختبارات VerifyDur
 * @param {string} testName اسم الاختبار المراد تشغيله
 * @returns {Promise<Object>} نتائج الاختبار
 */
export async function runSpecificVerifyDurTest(testName) {
  const filteredCollection = {
    ...verifyDurCollection,
    item: verifyDurCollection.item.filter(item => item.name.includes(testName))
  };

  if (filteredCollection.item.length === 0) {
    throw new Error(`الاختبار '${testName}' غير موجود`);
  }

  return new Promise((resolve, reject) => {
    newman.run({
      collection: filteredCollection,
      environment: verifyDurEnvironment,
      reporters: ['cli'],
      iterationCount: 1,
      delayRequest: 500,
      timeout: 30000,
      timeoutRequest: 10000
    }, (err, summary) => {
      if (err) {
        reject(err);
        return;
      }
      
      const results = {
        testName,
        totalTests: summary.run.stats.tests.total,
        passedTests: summary.run.stats.tests.passed,
        failedTests: summary.run.stats.tests.failed,
        duration: summary.run.timings.completed
      };
      
      resolve(results);
    });
  });
}

// تصدير معلومات الاختبار
export const verifyDurTestInfo = {
  name: 'VerifyDur API Tests',
  description: 'اختبارات شاملة لواجهة برمجة تطبيقات مدة التحقق',
  testCount: verifyDurCollection.item.length,
  baseUrl: 'http://localhost:3000/api/v1/verifyDur'
};