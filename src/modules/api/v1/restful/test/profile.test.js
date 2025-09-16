import newman from 'newman';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعداد Postman Collection للـ Profile APIs
const profileCollection = {
  "info": {
    "name": "Profile API Tests",
    "description": "اختبارات شاملة لـ Profile APIs",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1/profiles",
      "type": "string"
    },
    {
      "key": "testProfileId",
      "value": "profile123",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Create Profile",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('Response has profile data', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('id');",
              "    pm.expect(responseJson).to.have.property('credits');",
              "    pm.expect(responseJson).to.have.property('xp');",
              "    pm.expect(responseJson).to.have.property('level');",
              "});",
              "",
              "pm.test('Profile has correct default values', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson.credits).to.equal(0);",
              "    pm.expect(responseJson.xp).to.equal(0);",
              "    pm.expect(responseJson.level).to.equal(1);",
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
            "id": "{{testProfileId}}",
            "credits": 0,
            "xp": 0,
            "level": 1,
            "country": "Saudi Arabia",
            "city": "Riyadh",
            "backgrounds": "[]",
            "active_background": null
          })
        },
        "url": {
          "raw": "{{baseUrl}}",
          "host": ["{{baseUrl}}"]
        }
      }
    },
    {
      "name": "Get Profile",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Profile data is returned', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('id');",
              "    pm.expect(responseJson.id).to.equal(pm.variables.get('testProfileId'));",
              "});",
              "",
              "pm.test('Profile has required fields', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('credits');",
              "    pm.expect(responseJson).to.have.property('xp');",
              "    pm.expect(responseJson).to.have.property('level');",
              "    pm.expect(responseJson).to.have.property('country');",
              "    pm.expect(responseJson).to.have.property('city');",
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
          "raw": "{{baseUrl}}/{{testProfileId}}",
          "host": ["{{baseUrl}}"],
          "path": ["{{testProfileId}}"]
        }
      }
    },
    {
      "name": "Update Profile",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Profile updated successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('credits');",
              "    pm.expect(responseJson.credits).to.equal(100);",
              "});",
              "",
              "pm.test('XP and level updated', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson.xp).to.equal(500);",
              "    pm.expect(responseJson.level).to.equal(2);",
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
            "credits": 100,
            "xp": 500,
            "level": 2,
            "country": "Egypt",
            "city": "Cairo",
            "backgrounds": "['bg1', 'bg2']",
            "active_background": "bg1"
          })
        },
        "url": {
          "raw": "{{baseUrl}}/{{testProfileId}}",
          "host": ["{{baseUrl}}"],
          "path": ["{{testProfileId}}"]
        }
      }
    },
    {
      "name": "Delete Profile",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200 or 204', function () {",
              "    pm.expect(pm.response.code).to.be.oneOf([200, 204]);",
              "});",
              "",
              "pm.test('Profile deleted successfully', function () {",
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
          "raw": "{{baseUrl}}/{{testProfileId}}",
          "host": ["{{baseUrl}}"],
          "path": ["{{testProfileId}}"]
        }
      }
    },
    {
      "name": "Get Deleted Profile (Should Fail)",
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
          "raw": "{{baseUrl}}/{{testProfileId}}",
          "host": ["{{baseUrl}}"],
          "path": ["{{testProfileId}}"]
        }
      }
    },
    {
      "name": "Create Profile with Invalid Data",
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
            "credits": -10,
            "xp": -5,
            "level": 0,
            "country": "Egypt",
            "city": "Cairo"
          })
        },
        "url": {
          "raw": "{{baseUrl}}",
          "host": ["{{baseUrl}}"]
        }
      }
    }
  ]
};

// إعداد البيئة للاختبار
const profileEnvironment = {
  "name": "Profile API Test Environment",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1/profiles",
      "enabled": true
    },
    {
      "key": "testProfileId",
      "value": "p_" + Date.now(),
      "enabled": true
    }
  ]
};

// دالة تشغيل اختبارات Profile
export const runProfileTests = () => {
  return new Promise((resolve, reject) => {
    newman.run({
      collection: profileCollection,
      environment: profileEnvironment,
      reporters: ['cli', 'json'],
      reporter: {
        json: {
          export: path.join(__dirname, './exports/profile-test-results.json')
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
        console.error('❌ خطأ في تشغيل اختبارات Profile:', err);
        reject(err);
        return;
      }

      console.log('\n📊 ملخص نتائج اختبار Profile:');
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
};

// دالة تشغيل اختبار محدد للـ Profile
export const runSpecificProfileTest = (testName) => {
  const filteredCollection = {
    ...profileCollection,
    item: profileCollection.item.filter(item => item.name.includes(testName))
  };

  return new Promise((resolve, reject) => {
    newman.run({
      collection: filteredCollection,
      environment: profileEnvironment,
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
};

// تصدير معلومات الاختبار
export const profileTestInfo = {
  name: 'Profile API Tests',
  description: 'اختبارات شاملة لـ Profile APIs',
  testCount: profileCollection.item.length,
  baseUrl: 'http://localhost:3000/api/v1/profiles'
};