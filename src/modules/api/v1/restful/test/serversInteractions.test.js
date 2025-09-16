// ملف اختبارات ServersInteractions API
import newman from 'newman';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مجموعة Postman لاختبارات ServersInteractions
const serversInteractionsCollection = {
  "info": {
    "_postman_id": "serversinteractions-api-tests",
    "name": "ServersInteractions API Tests",
    "description": "اختبارات شاملة لواجهة برمجة تطبيقات تفاعلات الخوادم",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Interaction",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('Interaction created successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('user_id');",
              "    pm.expect(responseJson).to.have.property('guild_id');",
              "    pm.expect(responseJson).to.have.property('chat_points');",
              "    pm.expect(responseJson).to.have.property('voice_points');",
              "    pm.expect(responseJson).to.have.property('chat_level');",
              "    pm.expect(responseJson).to.have.property('voice_level');",
              "});",
              "",
              "pm.test('Default values are correct', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson.chat_points).to.equal(0);",
              "    pm.expect(responseJson.voice_points).to.equal(0);",
              "    pm.expect(responseJson.chat_level).to.equal(1);",
              "    pm.expect(responseJson.voice_level).to.equal(1);",
              "});"
            ],
            "type": "text/javascript"
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
            "user_id": "{{test_user_id}}",
            "guild_id": "{{test_guild_id}}",
            "chat_points": 0,
            "voice_points": 0,
            "chat_level": 1,
            "voice_level": 1
          })
        },
        "url": {
          "raw": "{{base_url}}/serversInteractions",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions"]
        }
      }
    },
    {
      "name": "Get All Interactions",
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
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions"]
        }
      }
    },
    {
      "name": "Get Interaction Stats",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Stats data is returned', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('totalInteractions');",
              "    pm.expect(responseJson).to.have.property('totalChatPoints');",
              "    pm.expect(responseJson).to.have.property('totalVoicePoints');",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/stats",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "stats"]
        }
      }
    },
    {
      "name": "Get Interaction by User and Guild",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Interaction data is returned', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('user_id');",
              "    pm.expect(responseJson).to.have.property('guild_id');",
              "    pm.expect(responseJson.user_id).to.equal(pm.variables.get('test_user_id'));",
              "    pm.expect(responseJson.guild_id).to.equal(pm.variables.get('test_guild_id'));",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id}}/guild/{{test_guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id}}", "guild", "{{test_guild_id}}"]
        }
      }
    },
    {
      "name": "Get Interactions by User",
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
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id}}"]
        }
      }
    },
    {
      "name": "Get Interactions by Guild",
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
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/guild/{{test_guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "guild", "{{test_guild_id}}"]
        }
      }
    },
    {
      "name": "Get Interactions by Chat Level",
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
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/chat-level/{{min_chat_level}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "chat-level", "{{min_chat_level}}"]
        }
      }
    },
    {
      "name": "Get Interactions by Voice Level",
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
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/voice-level/{{min_voice_level}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "voice-level", "{{min_voice_level}}"]
        }
      }
    },
    {
      "name": "Update Interaction",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Interaction updated successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('chat_points');",
              "    pm.expect(responseJson).to.have.property('voice_points');",
              "    pm.expect(responseJson.chat_points).to.equal(100);",
              "    pm.expect(responseJson.voice_points).to.equal(50);",
              "});"
            ],
            "type": "text/javascript"
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
            "chat_points": 100,
            "voice_points": 50,
            "chat_level": 2,
            "voice_level": 2
          })
        },
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id}}/guild/{{test_guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id}}", "guild", "{{test_guild_id}}"]
        }
      }
    },
    {
      "name": "Update Chat Points",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Chat points updated successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('chat_points');",
              "    pm.expect(responseJson.chat_points).to.equal(150);",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "points": 150
          })
        },
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id}}/guild/{{test_guild_id}}/chat-points",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id}}", "guild", "{{test_guild_id}}", "chat-points"]
        }
      }
    },
    {
      "name": "Update Voice Points",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Voice points updated successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('voice_points');",
              "    pm.expect(responseJson.voice_points).to.equal(75);",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "points": 75
          })
        },
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id}}/guild/{{test_guild_id}}/voice-points",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id}}", "guild", "{{test_guild_id}}", "voice-points"]
        }
      }
    },
    {
      "name": "Increment Chat Points",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Chat points incremented successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('chat_points');",
              "    pm.expect(responseJson.chat_points).to.be.above(150);",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "increment": 10
          })
        },
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id}}/guild/{{test_guild_id}}/increment-chat",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id}}", "guild", "{{test_guild_id}}", "increment-chat"]
        }
      }
    },
    {
      "name": "Increment Voice Points",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Voice points incremented successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('voice_points');",
              "    pm.expect(responseJson.voice_points).to.be.above(75);",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "increment": 5
          })
        },
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id}}/guild/{{test_guild_id}}/increment-voice",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id}}", "guild", "{{test_guild_id}}", "increment-voice"]
        }
      }
    },
    {
      "name": "Create Interaction with Invalid Data",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 400', function () {",
              "    pm.response.to.have.status(400);",
              "});",
              "",
              "pm.test('Validation error is returned', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('error');",
              "});"
            ],
            "type": "text/javascript"
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
            "user_id": "",
            "guild_id": "",
            "chat_points": -10,
            "voice_points": -5,
            "chat_level": 0,
            "voice_level": 0
          })
        },
        "url": {
          "raw": "{{base_url}}/serversInteractions",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions"]
        }
      }
    },
    {
      "name": "Delete Interaction",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200 or 204', function () {",
              "    pm.expect(pm.response.code).to.be.oneOf([200, 204]);",
              "});",
              "",
              "pm.test('Interaction deleted successfully', function () {",
              "    if (pm.response.code === 200) {",
              "        const responseJson = pm.response.json();",
              "        pm.expect(responseJson).to.have.property('message');",
              "    }",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id}}/guild/{{test_guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id}}", "guild", "{{test_guild_id}}"]
        }
      }
    },
    {
      "name": "Delete All User Interactions",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200 or 204', function () {",
              "    pm.expect(pm.response.code).to.be.oneOf([200, 204]);",
              "});",
              "",
              "pm.test('User interactions deleted successfully', function () {",
              "    if (pm.response.code === 200) {",
              "        const responseJson = pm.response.json();",
              "        pm.expect(responseJson).to.have.property('message');",
              "    }",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id_2}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id_2}}"]
        }
      }
    },
    {
      "name": "Delete All Guild Interactions",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200 or 204', function () {",
              "    pm.expect(pm.response.code).to.be.oneOf([200, 204]);",
              "});",
              "",
              "pm.test('Guild interactions deleted successfully', function () {",
              "    if (pm.response.code === 200) {",
              "        const responseJson = pm.response.json();",
              "        pm.expect(responseJson).to.have.property('message');",
              "    }",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/guild/{{test_guild_id_2}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "guild", "{{test_guild_id_2}}"]
        }
      }
    },
    {
      "name": "Get Deleted Interaction (Should Fail)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 404', function () {",
              "    pm.response.to.have.status(404);",
              "});",
              "",
              "pm.test('Error message is returned', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('error');",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/serversInteractions/user/{{test_user_id}}/guild/{{test_guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["serversInteractions", "user", "{{test_user_id}}", "guild", "{{test_guild_id}}"]
        }
      }
    }
  ]
};

// بيئة الاختبار
const serversInteractionsEnvironment = {
  "id": "servers-interactions-test-env",
  "name": "ServersInteractions Test Environment",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1",
      "enabled": true
    },
    {
      "key": "test_user_id",
      "value": "tu_" + Date.now(),
      "enabled": true
    },
    {
      "key": "test_guild_id",
      "value": "tg_" + Date.now(),
      "enabled": true
    },
    {
      "key": "min_chat_level",
      "value": "2",
      "enabled": true
    },
    {
      "key": "min_voice_level",
      "value": "2",
      "enabled": true
    },
    {
      "key": "test_user_id_2",
      "value": "tu2_" + Date.now(),
      "enabled": true
    },
    {
      "key": "test_guild_id_2",
      "value": "tg2_" + Date.now(),
      "enabled": true
    }
  ]
};

/**
 * تشغيل جميع اختبارات ServersInteractions
 * @returns {Promise<Object>} نتائج الاختبارات
 */
export async function runServersInteractionsTests() {
  return new Promise((resolve, reject) => {
    newman.run({
      collection: serversInteractionsCollection,
      environment: serversInteractionsEnvironment,
      reporters: ['cli', 'json'],
      reporter: {
        json: {
          export: path.join(__dirname, 'exports', 'serversInteractions-test-results.json')
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
        console.error('❌ خطأ في تشغيل اختبارات ServersInteractions:', err);
        reject(err);
        return;
      }

      console.log('\n📊 ملخص نتائج اختبار ServersInteractions:');
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

      resolve(summary);
    });
  });
}

/**
 * تشغيل اختبار محدد من اختبارات ServersInteractions
 * @param {string} testName اسم الاختبار المراد تشغيله
 * @returns {Promise<Object>} نتائج الاختبار
 */
export async function runSpecificServersInteractionsTest(testName) {
  const filteredCollection = {
    ...serversInteractionsCollection,
    item: serversInteractionsCollection.item.filter(item => item.name.includes(testName))
  };

  if (filteredCollection.item.length === 0) {
    throw new Error(`الاختبار '${testName}' غير موجود`);
  }

  return new Promise((resolve, reject) => {
    newman.run({
      collection: filteredCollection,
      environment: serversInteractionsEnvironment,
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
      resolve(summary);
    });
  });
}

/**
 * معلومات اختبارات ServersInteractions
 */
export const serversInteractionsTestInfo = {
  name: 'ServersInteractions API Tests',
  description: 'اختبارات شاملة لواجهة برمجة تطبيقات تفاعلات الخوادم',
  testCount: serversInteractionsCollection.item.length,
  baseUrl: 'http://localhost:3000/api/v1/serversInteractions'
};

// تصدير المجموعة والبيئة للاستخدام الخارجي
export { serversInteractionsCollection, serversInteractionsEnvironment };