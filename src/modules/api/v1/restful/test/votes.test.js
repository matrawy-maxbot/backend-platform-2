import newman from 'newman';
import fs from 'fs';
import path from 'path';

/**
 * مجموعة اختبارات Postman لواجهة برمجة تطبيقات Votes
 */
const votesTestCollection = {
    "info": {
        "name": "Votes API Tests",
        "description": "اختبارات شاملة لواجهة برمجة تطبيقات التصويتات",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:3000/api/v1/votes"
        },
        {
            "key": "testGuildId",
            "value": "tg_1756128570019"
        },
        {
            "key": "testChannelId",
            "value": "tc_1756128570019"
        },
        {
            "key": "testMessageId",
            "value": "tm_1756128570019"
        },
        {
            "key": "testRankMsgId",
            "value": "tr_1756128570019"
        },
        {
            "key": "createdVoteId",
            "value": ""
        }
    ],
    "item": [
        {
            "name": "Create Vote",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 201', function () {",
                            "    pm.response.to.have.status(201);",
                            "});",
                            "",
                            "pm.test('Response has vote data', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('id');",
                            "    pm.expect(responseJson).to.have.property('guild_id');",
                            "    pm.expect(responseJson).to.have.property('channel_id');",
                            "    pm.expect(responseJson.guild_id).to.eql(pm.collectionVariables.get('testGuildId'));",
                            "    pm.expect(responseJson.channel_id).to.eql(pm.collectionVariables.get('testChannelId'));",
                            "    ",
                            "    // حفظ معرف التصويت المنشأ للاختبارات اللاحقة",
                            "    pm.collectionVariables.set('createdVoteId', responseJson.id);",
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
                    "raw": "{\n    \"guild_id\": \"{{testGuildId}}\",\n    \"channel_id\": \"{{testChannelId}}\",\n    \"message_id\": \"{{testMessageId}}\",\n    \"rank_message_id\": \"{{testRankMsgId}}\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}",
                    "host": ["{{baseUrl}}"]
                }
            }
        },
        {
            "name": "Get All Votes",
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
                    "raw": "{{baseUrl}}",
                    "host": ["{{baseUrl}}"]
                }
            }
        },
        {
            "name": "Get Vote by ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response has correct vote data', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('id');",
                            "    pm.expect(responseJson.id).to.eql(parseInt(pm.collectionVariables.get('createdVoteId')));",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/{{createdVoteId}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["{{createdVoteId}}"]
                }
            }
        },
        {
            "name": "Get Vote by Guild ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response has correct guild_id', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('guild_id');",
                            "    pm.expect(responseJson.guild_id).to.eql(pm.collectionVariables.get('testGuildId'));",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/guild/{{testGuildId}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["guild", "{{testGuildId}}"]
                }
            }
        },
        {
            "name": "Get Vote by Channel ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response has correct channel_id', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('channel_id');",
                            "    pm.expect(responseJson.channel_id).to.eql(pm.collectionVariables.get('testChannelId'));",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/channel/{{testChannelId}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["channel", "{{testChannelId}}"]
                }
            }
        },
        {
            "name": "Get Vote by Message ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response has correct message_id', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('message_id');",
                            "    pm.expect(responseJson.message_id).to.eql(pm.collectionVariables.get('testMessageId'));",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/message/{{testMessageId}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["message", "{{testMessageId}}"]
                }
            }
        },
        {
            "name": "Get Vote by Rank Message ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response has correct rank_message_id', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('rank_message_id');",
                            "    pm.expect(responseJson.rank_message_id).to.eql(pm.collectionVariables.get('testRankMsgId'));",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/rank-message/{{testRankMsgId}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["rank-message", "{{testRankMsgId}}"]
                }
            }
        },
        {
            "name": "Get Vote by Guild and Channel",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response has correct guild_id and channel_id', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('guild_id');",
                            "    pm.expect(responseJson).to.have.property('channel_id');",
                            "    pm.expect(responseJson.guild_id).to.eql(pm.collectionVariables.get('testGuildId'));",
                            "    pm.expect(responseJson.channel_id).to.eql(pm.collectionVariables.get('testChannelId'));",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/guild/{{testGuildId}}/channel/{{testChannelId}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["guild", "{{testGuildId}}", "channel", "{{testChannelId}}"]
                }
            }
        },
        {
            "name": "Search Votes",
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
                    "raw": "{{baseUrl}}/search?searchTerm={{testGuildId}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["search"],
                    "query": [
                        {
                            "key": "searchTerm",
                            "value": "{{testGuildId}}"
                        }
                    ]
                }
            }
        },
        {
            "name": "Get Vote Stats",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response has stats data', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.be.an('object');",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/stats",
                    "host": ["{{baseUrl}}"],
                    "path": ["stats"]
                }
            }
        },
        {
            "name": "Check Vote Exists",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response indicates vote exists', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('exists');",
                            "    pm.expect(responseJson.exists).to.be.true;",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/{{createdVoteId}}/exists",
                    "host": ["{{baseUrl}}"],
                    "path": ["{{createdVoteId}}", "exists"]
                }
            }
        },
        {
            "name": "Check Vote Exists by Guild ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response indicates vote exists', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('exists');",
                            "    pm.expect(responseJson.exists).to.be.true;",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/guild/{{testGuildId}}/exists",
                    "host": ["{{baseUrl}}"],
                    "path": ["guild", "{{testGuildId}}", "exists"]
                }
            }
        },
        {
            "name": "Update Vote",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Response has updated data', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('message_id');",
                            "    pm.expect(responseJson.message_id).to.eql('tm_updated_1756128570019');",
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
                    "raw": "{\n    \"message_id\": \"tm_updated_1756128570019\",\n    \"rank_message_id\": \"tr_updated_1756128570019\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/{{createdVoteId}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["{{createdVoteId}}"]
                }
            }
        },
        {
            "name": "Update Message ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Message ID updated successfully', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('message_id');",
                            "    pm.expect(responseJson.message_id).to.eql('tm_patch_1756128570019');",
                            "});"
                        ]
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
                    "raw": "{\n    \"messageId\": \"tm_patch_1756128570019\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/{{createdVoteId}}/message",
                    "host": ["{{baseUrl}}"],
                    "path": ["{{createdVoteId}}", "message"]
                }
            }
        },
        {
            "name": "Update Rank Message ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Rank Message ID updated successfully', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('rank_message_id');",
                            "    pm.expect(responseJson.rank_message_id).to.eql('tr_patch_1756128570019');",
                            "});"
                        ]
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
                    "raw": "{\n    \"rankMessageId\": \"tr_patch_1756128570019\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/{{createdVoteId}}/rank-message",
                    "host": ["{{baseUrl}}"],
                    "path": ["{{createdVoteId}}", "rank-message"]
                }
            }
        },
        {
            "name": "Update Channel ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Channel ID updated successfully', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('channel_id');",
                            "    pm.expect(responseJson.channel_id).to.eql('tc_patch_1756128570019');",
                            "});"
                        ]
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
                    "raw": "{\n    \"channelId\": \"tc_patch_1756128570019\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/{{createdVoteId}}/channel",
                    "host": ["{{baseUrl}}"],
                    "path": ["{{createdVoteId}}", "channel"]
                }
            }
        },
        {
            "name": "Create or Update Vote (Upsert)",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200 or 201', function () {",
                            "    pm.expect(pm.response.code).to.be.oneOf([200, 201]);",
                            "});",
                            "",
                            "pm.test('Response has vote data', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('guild_id');",
                            "    pm.expect(responseJson).to.have.property('channel_id');",
                            "    pm.expect(responseJson.guild_id).to.eql('tg_upsert_1756128570019');",
                            "    pm.expect(responseJson.channel_id).to.eql('tc_upsert_1756128570019');",
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
                    "raw": "{\n    \"guild_id\": \"tg_upsert_1756128570019\",\n    \"channel_id\": \"tc_upsert_1756128570019\",\n    \"message_id\": \"tm_upsert_1756128570019\",\n    \"rank_message_id\": \"tr_upsert_1756128570019\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/upsert",
                    "host": ["{{baseUrl}}"],
                    "path": ["upsert"]
                }
            }
        },
        {
            "name": "Delete Vote by Guild ID",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Vote deleted successfully', function () {",
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
                    "raw": "{{baseUrl}}/guild/tg_upsert_1756128570019",
                    "host": ["{{baseUrl}}"],
                    "path": ["guild", "tg_upsert_1756128570019"]
                }
            }
        },
        {
            "name": "Delete Vote",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 200', function () {",
                            "    pm.response.to.have.status(200);",
                            "});",
                            "",
                            "pm.test('Vote deleted successfully', function () {",
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
                    "raw": "{{baseUrl}}/{{createdVoteId}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["{{createdVoteId}}"]
                }
            }
        },
        {
            "name": "Test Invalid Vote Creation (Missing Required Fields)",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 400', function () {",
                            "    pm.response.to.have.status(400);",
                            "});",
                            "",
                            "pm.test('Response has validation error', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('error');",
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
                    "raw": "{\n    \"guild_id\": \"\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}",
                    "host": ["{{baseUrl}}"]
                }
            }
        },
        {
            "name": "Test Get Non-existent Vote",
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test('Status code is 404', function () {",
                            "    pm.response.to.have.status(404);",
                            "});",
                            "",
                            "pm.test('Response has not found error', function () {",
                            "    const responseJson = pm.response.json();",
                            "    pm.expect(responseJson).to.have.property('error');",
                            "});"
                        ]
                    }
                }
            ],
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "{{baseUrl}}/999999",
                    "host": ["{{baseUrl}}"],
                    "path": ["999999"]
                }
            }
        }
    ]
};

/**
 * تشغيل اختبارات Votes
 */
export async function runVotesTests() {
    return new Promise((resolve, reject) => {
        newman.run({
            collection: votesTestCollection,
            reporters: ['cli', 'json'],
            reporter: {
                json: {
                    export: path.join(process.cwd(), 'src/modules/api/v1/restful/test/exports/votes-test-results.json')
                }
            }
        }, (err, summary) => {
            if (err) {
                console.error('خطأ في تشغيل اختبارات Votes:', err);
                reject(err);
            } else {
                console.log('\n=== نتائج اختبارات Votes ===');
                console.log(`إجمالي الاختبارات: ${summary.run.stats.tests.total}`);
                console.log(`الاختبارات الناجحة: ${summary.run.stats.tests.passed}`);
                console.log(`الاختبارات الفاشلة: ${summary.run.stats.tests.failed}`);
                console.log(`الطلبات المرسلة: ${summary.run.stats.requests.total}`);
                console.log(`الطلبات الناجحة: ${summary.run.stats.requests.passed}`);
                console.log(`الطلبات الفاشلة: ${summary.run.stats.requests.failed}`);
                
                if (summary.run.failures.length > 0) {
                    console.log('\n=== الأخطاء ===');
                    summary.run.failures.forEach((failure, index) => {
                        console.log(`${index + 1}. ${failure.error.name}: ${failure.error.message}`);
                    });
                }
                
                resolve(summary);
            }
        });
    });
}

export default { runVotesTests };