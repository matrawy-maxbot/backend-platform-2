// ملف اختبارات ProfileTasks API
import newman from 'newman';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مجموعة Postman لاختبارات ProfileTasks
const profileTasksCollection = {
  "info": {
    "_postman_id": "profiletasks-api-tests",
    "name": "ProfileTasks API Tests",
    "description": "Comprehensive tests for ProfileTasks API endpoints",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create ProfileTask",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('ProfileTask created successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('id');",
              "    pm.expect(responseJson).to.have.property('guild_id');",
              "    pm.expect(responseJson).to.have.property('profile_id');",
              "    pm.expect(responseJson).to.have.property('profile_ch_id');",
              "    pm.expect(responseJson).to.have.property('tasks_ch_id');",
              "    pm.expect(responseJson).to.have.property('bot_dur');",
              "    pm.expect(responseJson).to.have.property('s_members');",
              "    pm.expect(responseJson).to.have.property('s_online');",
              "    pm.expect(responseJson).to.have.property('s_boosts');",
              "    pm.expect(responseJson).to.have.property('s_votes');",
              "    pm.expect(responseJson).to.have.property('s_chat');",
              "    pm.expect(responseJson).to.have.property('bd_shard');",
              "    pm.expect(responseJson).to.have.property('sm_shard');",
              "    pm.expect(responseJson).to.have.property('so_shard');",
              "    pm.expect(responseJson).to.have.property('sb_shard');",
              "    pm.expect(responseJson).to.have.property('sv_shard');",
              "    pm.expect(responseJson).to.have.property('si_shard');",
              "    ",
              "    // Store the created ProfileTask ID for later tests",
              "    pm.environment.set('profiletask_id', responseJson.id);",
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
            "guild_id": "{{guild_id}}",
            "profile_ch_id": "{{profile_ch_id}}",
            "tasks_ch_id": "{{tasks_ch_id}}",
            "profile_id": "{{profile_id}}",
            "bot_dur": "{{bot_dur}}",
            "s_members": "{{s_members}}",
            "s_online": "{{s_online}}",
            "s_boosts": "{{s_boosts}}",
            "s_votes": "{{s_votes}}",
            "s_chat": "{{s_chat}}",
            "bd_shard": 1,
            "sm_shard": 1,
            "so_shard": 1,
            "sb_shard": 1,
            "sv_shard": 1,
            "si_shard": 1
          }),
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/profileTasks",
          "host": ["{{base_url}}"],
          "path": ["profileTasks"]
        }
      }
    },
    {
      "name": "Get All ProfileTasks",
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
          "raw": "{{base_url}}/profileTasks",
          "host": ["{{base_url}}"],
          "path": ["profileTasks"]
        }
      }
    },
    {
      "name": "Get ProfileTask by ID",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('ProfileTask retrieved successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('id');",
              "    pm.expect(responseJson.id).to.equal(parseInt(pm.environment.get('profiletask_id')));",
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
          "raw": "{{base_url}}/profileTasks/{{profiletask_id}}",
          "host": ["{{base_url}}"],
          "path": ["profileTasks", "{{profiletask_id}}"]
        }
      }
    },
    {
      "name": "Get ProfileTasks by Profile ID",
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
          "raw": "{{base_url}}/profileTasks/profile/{{profile_id}}",
          "host": ["{{base_url}}"],
          "path": ["profileTasks", "profile", "{{profile_id}}"]
        }
      }
    },
    {
      "name": "Get ProfileTasks by Guild ID",
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
          "raw": "{{base_url}}/profileTasks/guild/{{guild_id}}",
          "host": ["{{base_url}}"],
          "path": ["profileTasks", "guild", "{{guild_id}}"]
        }
      }
    },
    {
      "name": "Update ProfileTask",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('ProfileTask updated successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('id');",
              "    pm.expect(responseJson.bd_shard).to.equal(2);",
              "    pm.expect(responseJson.sm_shard).to.equal(2);",
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
            "profile_ch_id": "{{updated_profile_ch_id}}",
            "tasks_ch_id": "{{updated_tasks_ch_id}}",
            "bot_dur": "{{updated_bot_dur}}",
            "s_members": "{{updated_s_members}}",
            "s_online": "{{updated_s_online}}",
            "s_boosts": "{{updated_s_boosts}}",
            "s_votes": "{{updated_s_votes}}",
            "s_chat": "{{updated_s_chat}}",
            "bd_shard": 2,
            "sm_shard": 2,
            "so_shard": 2,
            "sb_shard": 2,
            "sv_shard": 2,
            "si_shard": 2
          }),
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/profileTasks/{{profiletask_id}}",
          "host": ["{{base_url}}"],
          "path": ["profileTasks", "{{profiletask_id}}"]
        }
      }
    },
    {
      "name": "Delete ProfileTask",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200 or 204', function () {",
              "    pm.expect(pm.response.code).to.be.oneOf([200, 204]);",
              "});",
              "",
              "pm.test('ProfileTask deleted successfully', function () {",
              "    // Check if response has a success message or is empty",
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
          "raw": "{{base_url}}/profileTasks/{{profiletask_id}}",
          "host": ["{{base_url}}"],
          "path": ["profileTasks", "{{profiletask_id}}"]
        }
      }
    },
    {
      "name": "Create ProfileTask with Invalid Data",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 400', function () {",
              "    pm.response.to.have.status(400);",
              "});",
              "",
              "pm.test('Error message present', function () {",
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
            "guild_id": "",
            "profile_ch_id": "",
            "tasks_ch_id": "",
            "profile_id": "",
            "bot_dur": "",
            "invalid_field": "invalid_value"
          }),
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/profileTasks",
          "host": ["{{base_url}}"],
          "path": ["profileTasks"]
        }
      }
    },
    {
      "name": "Get Deleted ProfileTask (Should Fail)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 404', function () {",
              "    pm.response.to.have.status(404);",
              "});",
              "",
              "pm.test('Error message indicates ProfileTask not found', function () {",
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
          "raw": "{{base_url}}/profileTasks/{{profiletask_id}}",
          "host": ["{{base_url}}"],
          "path": ["profileTasks", "{{profiletask_id}}"]
        }
      }
    }
  ]
};

// بيئة الاختبار
const profileTasksEnvironment = {
  "id": "profile-tasks-test-env",
  "name": "ProfileTasks Test Environment",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1",
      "enabled": true
    },
    {
      "key": "guild_id",
      "value": "tg_456",
      "enabled": true
    },
    {
      "key": "profile_ch_id",
      "value": "tp_ch_789",
      "enabled": true
    },
    {
      "key": "tasks_ch_id",
      "value": "tt_ch_101",
      "enabled": true
    },
    {
      "key": "profile_id",
      "value": "tp_123",
      "enabled": true
    },
    {
      "key": "bot_dur",
      "value": "tbd_202",
      "enabled": true
    },
    {
      "key": "s_members",
      "value": "tsm_303",
      "enabled": true
    },
    {
      "key": "s_online",
      "value": "tso_404",
      "enabled": true
    },
    {
      "key": "s_boosts",
      "value": "tsb_505",
      "enabled": true
    },
    {
      "key": "s_votes",
      "value": "tsv_606",
      "enabled": true
    },
    {
      "key": "s_chat",
      "value": "tsc_707",
      "enabled": true
    },
    {
      "key": "updated_profile_ch_id",
      "value": "upc_808",
      "enabled": true
    },
    {
      "key": "updated_tasks_ch_id",
      "value": "utc_909",
      "enabled": true
    },
    {
      "key": "updated_bot_dur",
      "value": "ubd_111",
      "enabled": true
    },
    {
      "key": "updated_s_members",
      "value": "usm_222",
      "enabled": true
    },
    {
      "key": "updated_s_online",
      "value": "uso_333",
      "enabled": true
    },
    {
      "key": "updated_s_boosts",
      "value": "usbs_444",
      "enabled": true
    },
    {
      "key": "updated_s_votes",
      "value": "usvs_555",
      "enabled": true
    },
    {
      "key": "updated_s_chat",
      "value": "usc_666",
      "enabled": true
    },
    {
      "key": "profiletask_id",
      "value": 1,
      "enabled": true
    }
  ]
};

/**
 * تشغيل جميع اختبارات ProfileTasks
 * @returns {Promise<Object>} نتائج الاختبارات
 */
export async function runProfileTasksTests() {
  return new Promise((resolve, reject) => {
    newman.run({
      collection: profileTasksCollection,
      environment: profileTasksEnvironment,
      reporters: ['json'],
      reporter: {
        json: {
          export: path.join(__dirname, 'exports', 'profileTasks-test-results.json')
        }
      }
    }, (err, summary) => {
      if (err) {
        console.error('خطأ في تشغيل اختبارات ProfileTasks:', err);
        reject(err);
        return;
      }

      const results = {
        totalTests: summary.run.stats.tests.total,
        passedTests: summary.run.stats.tests.passed,
        failedTests: summary.run.stats.tests.failed,
        totalRequests: summary.run.stats.requests.total,
        duration: summary.run.timings.completed
      };

      console.log('\n=== نتائج اختبارات ProfileTasks ===');
      console.log(`إجمالي الاختبارات: ${results.totalTests}`);
      console.log(`الاختبارات الناجحة: ${results.passedTests}`);
      console.log(`الاختبارات الفاشلة: ${results.failedTests}`);
      console.log(`إجمالي الطلبات: ${results.totalRequests}`);
      console.log(`المدة الإجمالية: ${results.duration}ms`);
      console.log('=====================================\n');

      resolve(results);
    });
  });
}

/**
 * تشغيل اختبار محدد من اختبارات ProfileTasks
 * @param {string} testName اسم الاختبار المراد تشغيله
 * @returns {Promise<Object>} نتائج الاختبار
 */
export async function runSpecificProfileTasksTest(testName) {
  // تصفية المجموعة لتشمل الاختبار المحدد فقط
  const filteredCollection = {
    ...profileTasksCollection,
    item: profileTasksCollection.item.filter(item => item.name === testName)
  };

  if (filteredCollection.item.length === 0) {
    throw new Error(`الاختبار '${testName}' غير موجود`);
  }

  return new Promise((resolve, reject) => {
    newman.run({
      collection: filteredCollection,
      environment: profileTasksEnvironment,
      reporters: ['json'],
      reporter: {
        json: {
          export: path.join(__dirname, 'exports', `profileTasks-${testName.replace(/\s+/g, '-').toLowerCase()}-test-results.json`)
        }
      }
    }, (err, summary) => {
      if (err) {
        console.error(`خطأ في تشغيل اختبار ProfileTasks '${testName}':`, err);
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

      console.log(`\n=== نتائج اختبار ProfileTasks: ${testName} ===`);
      console.log(`إجمالي الاختبارات: ${results.totalTests}`);
      console.log(`الاختبارات الناجحة: ${results.passedTests}`);
      console.log(`الاختبارات الفاشلة: ${results.failedTests}`);
      console.log(`المدة: ${results.duration}ms`);
      console.log('=====================================\n');

      resolve(results);
    });
  });
}

/**
 * معلومات اختبارات ProfileTasks
 */
export const profileTasksTestInfo = {
  name: 'ProfileTasks API Tests',
  description: 'اختبارات شاملة لواجهة برمجة تطبيقات ProfileTasks',
  totalTests: profileTasksCollection.item.length,
  testNames: profileTasksCollection.item.map(item => item.name),
  endpoints: [
    'POST /profileTasks',
    'GET /profileTasks',
    'GET /profileTasks/:id',
    'GET /profileTasks/guild/:guildId',
    'PUT /profileTasks/:id',
    'DELETE /profileTasks/:id'
  ]
};

// تصدير المجموعة والبيئة للاستخدام الخارجي
export { profileTasksCollection, profileTasksEnvironment };