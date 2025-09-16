import newman from 'newman';
import fs from 'fs';
import path from 'path';

/**
 * اختبارات Welcome API
 * يغطي جميع عمليات إدارة إعدادات الترحيب
 */

// إنشاء مجموعة اختبارات Postman لـ Welcome API
const welcomeCollection = {
  info: {
    name: "Welcome API Tests",
    description: "اختبارات شاملة لـ Welcome API - إدارة إعدادات الترحيب",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    {
      key: "baseUrl",
      value: "http://localhost:3000/api/v1/welcome"
    },
    {
      key: "testGuildId",
      value: "tg_1756128570019"
    },
    {
      key: "testGuildId2",
      value: "tg_1756128570020"
    },
    {
      key: "welcomeId",
      value: ""
    }
  ],
  item: [
    {
      name: "Create Welcome Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('Response has welcome data', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('id');",
              "    pm.expect(responseJson.data).to.have.property('guild_id');",
              "    pm.expect(responseJson.data.guild_id).to.eql(pm.variables.get('testGuildId'));",
              "    ",
              "    // حفظ معرف الترحيب للاختبارات اللاحقة",
              "    pm.variables.set('welcomeId', responseJson.data.id);",
              "});",
              "",
              "pm.test('Response has correct structure', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson.data).to.have.property('b_url');",
              "    pm.expect(responseJson.data).to.have.property('a_style');",
              "    pm.expect(responseJson.data).to.have.property('text_array');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "POST",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            guild_id: "{{testGuildId}}",
            b_url: "https://example.com/background.jpg",
            b_x: 0,
            b_y: 0,
            b_width: 800,
            b_height: 600,
            i_top: 50,
            i_left: 50,
            i_width: 700,
            i_height: 500,
            a_x: 100,
            a_y: 100,
            a_width: 150,
            a_height: 150,
            a_style: "circle",
            a_radius: 75,
            a_rotate: 0,
            a_border_width: 5,
            a_border_color: "#FF0000",
            a_border_style: "solid",
            text_array: "Welcome {user} to {guild}!"
          })
        },
        url: {
          raw: "{{baseUrl}}",
          host: ["{{baseUrl}}"]
        }
      }
    },
    {
      name: "Get All Welcome Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response is array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.be.an('array');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}",
          host: ["{{baseUrl}}"]
        }
      }
    },
    {
      name: "Get Welcome by Guild ID",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has correct guild_id', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('guild_id');",
              "    pm.expect(responseJson.data.guild_id).to.eql(pm.variables.get('testGuildId'));",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}"]
        }
      }
    },
    {
      name: "Get Welcome Stats",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has stats data', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('total');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/stats",
          host: ["{{baseUrl}}"],
          path: ["stats"]
        }
      }
    },
    {
      name: "Get Welcome with Background",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response is array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.be.an('array');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/with-background",
          host: ["{{baseUrl}}"],
          path: ["with-background"]
        }
      }
    },
    {
      name: "Get Welcome with Text",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response is array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.be.an('array');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/with-text",
          host: ["{{baseUrl}}"],
          path: ["with-text"]
        }
      }
    },
    {
      name: "Search Welcome Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response is array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.be.an('array');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/search?searchTerm=welcome",
          host: ["{{baseUrl}}"],
          path: ["search"],
          query: [
            {
              key: "searchTerm",
              value: "welcome"
            }
          ]
        }
      }
    },
    {
      name: "Get Welcome by Avatar Style",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response is array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.be.an('array');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/avatar-style/circle",
          host: ["{{baseUrl}}"],
          path: ["avatar-style", "circle"]
        }
      }
    },
    {
      name: "Check Welcome Exists",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has exists property', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('exists');",
              "    pm.expect(responseJson.data.exists).to.be.a('boolean');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/exists",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "exists"]
        }
      }
    },
    {
      name: "Check Has Background",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has hasBackground property', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('hasBackground');",
              "    pm.expect(responseJson.data.hasBackground).to.be.a('boolean');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/has-background",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "has-background"]
        }
      }
    },
    {
      name: "Check Has Text",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has hasText property', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('hasText');",
              "    pm.expect(responseJson.data.hasText).to.be.a('boolean');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/has-text",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "has-text"]
        }
      }
    },
    {
      name: "Create Guild Welcome",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('Response has welcome data', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('guild_id');",
              "    pm.expect(responseJson.data.guild_id).to.eql(pm.variables.get('testGuildId2'));",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "POST",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({})
        },
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId2}}",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId2}}"]
        }
      }
    },
    {
      name: "Copy Welcome Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has success message', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('message');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "POST",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            sourceGuildId: "{{testGuildId}}",
            targetGuildId: "{{testGuildId2}}"
          })
        },
        url: {
          raw: "{{baseUrl}}/copy",
          host: ["{{baseUrl}}"],
          path: ["copy"]
        }
      }
    },
    {
      name: "Update Welcome Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has updated data', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('a_style');",
              "    pm.expect(responseJson.data.a_style).to.eql('square');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "PUT",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            a_style: "square",
            a_radius: 10,
            text_array: "Updated welcome message for {user}!"
          })
        },
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}"]
        }
      }
    },
    {
      name: "Upsert Welcome Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200 or 201', function () {",
              "    pm.expect(pm.response.code).to.be.oneOf([200, 201]);",
              "});",
              "",
              "pm.test('Response has welcome data', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('guild_id');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "PUT",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            b_url: "https://example.com/new-background.jpg",
            a_style: "rounded",
            text_array: "Upserted welcome message!"
          })
        },
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/upsert",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "upsert"]
        }
      }
    },
    {
      name: "Update Image Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has updated image settings', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('i_width');",
              "    pm.expect(responseJson.data.i_width).to.eql(750);",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "PATCH",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            top: 60,
            left: 60,
            width: 750,
            height: 550
          })
        },
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/image",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "image"]
        }
      }
    },
    {
      name: "Update Background Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has updated background settings', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('b_width');",
              "    pm.expect(responseJson.data.b_width).to.eql(900);",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "PATCH",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            url: "https://example.com/updated-background.jpg",
            x: 10,
            y: 10,
            width: 900,
            height: 700
          })
        },
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/background",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "background"]
        }
      }
    },
    {
      name: "Update Avatar Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has updated avatar settings', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('a_width');",
              "    pm.expect(responseJson.data.a_width).to.eql(200);",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "PATCH",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            x: 120,
            y: 120,
            width: 200,
            height: 200,
            style: "circle",
            radius: 100
          })
        },
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/avatar",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "avatar"]
        }
      }
    },
    {
      name: "Update Text Array",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has updated text array', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('text_array');",
              "    pm.expect(responseJson.data.text_array).to.include('Updated text');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "PATCH",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            textArray: "Updated text array for {user} in {guild}!"
          })
        },
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/text",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "text"]
        }
      }
    },
    {
      name: "Clear Background URL",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Background URL is cleared', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data.b_url).to.be.null;",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "PATCH",
        header: [],
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/clear-background",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "clear-background"]
        }
      }
    },
    {
      name: "Clear Text Array",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Text array is cleared', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data.text_array).to.be.null;",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "PATCH",
        header: [],
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/clear-text",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "clear-text"]
        }
      }
    },
    {
      name: "Reset Avatar Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Avatar settings are reset', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('a_style');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "PATCH",
        header: [],
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}/reset-avatar",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}", "reset-avatar"]
        }
      }
    },
    {
      name: "Delete Welcome Without Background",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has deletion count', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('deletedCount');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "DELETE",
        header: [],
        url: {
          raw: "{{baseUrl}}/without-background",
          host: ["{{baseUrl}}"],
          path: ["without-background"]
        }
      }
    },
    {
      name: "Delete Welcome Without Text",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has deletion count', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('data');",
              "    pm.expect(responseJson.data).to.have.property('deletedCount');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "DELETE",
        header: [],
        url: {
          raw: "{{baseUrl}}/without-text",
          host: ["{{baseUrl}}"],
          path: ["without-text"]
        }
      }
    },
    {
      name: "Delete Welcome Settings",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Welcome settings deleted successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('message');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "DELETE",
        header: [],
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId}}",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId}}"]
        }
      }
    },
    {
      name: "Delete Second Guild Welcome",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Welcome settings deleted successfully', function () {",
              "    const responseJson = pm.response.json();",
              "    pm.expect(responseJson).to.have.property('message');",
              "});"
            ]
          }
        }
      ],
      request: {
        method: "DELETE",
        header: [],
        url: {
          raw: "{{baseUrl}}/guild/{{testGuildId2}}",
          host: ["{{baseUrl}}"],
          path: ["guild", "{{testGuildId2}}"]
        }
      }
    }
  ]
};

/**
 * تشغيل اختبارات Welcome API
 * @returns {Promise<Object>} نتائج الاختبارات
 */
export async function runWelcomeTests() {
  return new Promise((resolve, reject) => {
    newman.run({
      collection: welcomeCollection,
      reporters: ['cli', 'json'],
      reporter: {
        json: {
          export: path.join(process.cwd(), 'src/modules/api/v1/restful/test/exports/welcome-test-results.json')
        }
      }
    }, (err, summary) => {
      if (err) {
        console.error('خطأ في تشغيل اختبارات Welcome:', err);
        reject(err);
        return;
      }

      const results = {
        testName: 'Welcome API Tests',
        totalTests: summary.run.stats.tests.total,
        passedTests: summary.run.stats.tests.passed,
        failedTests: summary.run.stats.tests.failed,
        assertions: {
          total: summary.run.stats.assertions.total,
          passed: summary.run.stats.assertions.passed,
          failed: summary.run.stats.assertions.failed
        },
        executionTime: summary.run.timings.completed - summary.run.timings.started,
        timestamp: new Date().toISOString(),
        endpoints: [
          'GET /welcome',
          'GET /welcome/stats',
          'GET /welcome/with-background',
          'GET /welcome/with-text',
          'GET /welcome/search',
          'GET /welcome/avatar-style/:avatarStyle',
          'GET /welcome/guild/:guildId',
          'GET /welcome/guild/:guildId/exists',
          'GET /welcome/guild/:guildId/has-background',
          'GET /welcome/guild/:guildId/has-text',
          'POST /welcome',
          'POST /welcome/guild/:guildId',
          'POST /welcome/copy',
          'PUT /welcome/guild/:guildId',
          'PUT /welcome/guild/:guildId/upsert',
          'PATCH /welcome/guild/:guildId/image',
          'PATCH /welcome/guild/:guildId/background',
          'PATCH /welcome/guild/:guildId/avatar',
          'PATCH /welcome/guild/:guildId/text',
          'PATCH /welcome/guild/:guildId/clear-background',
          'PATCH /welcome/guild/:guildId/clear-text',
          'PATCH /welcome/guild/:guildId/reset-avatar',
          'DELETE /welcome/without-background',
          'DELETE /welcome/without-text',
          'DELETE /welcome/guild/:guildId'
        ]
      };

      console.log(`\n=== نتائج اختبارات Welcome API ===`);
      console.log(`إجمالي الاختبارات: ${results.totalTests}`);
      console.log(`الاختبارات الناجحة: ${results.passedTests}`);
      console.log(`الاختبارات الفاشلة: ${results.failedTests}`);
      console.log(`وقت التنفيذ: ${results.executionTime}ms`);
      console.log(`عدد نقاط النهاية المختبرة: ${results.endpoints.length}`);

      resolve(results);
    });
  });
}

export default runWelcomeTests;