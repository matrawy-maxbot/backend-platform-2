// ملف الاختبارات الرئيسي - يستدعي جميع ملفات الاختبار
import { runProfileTests, runSpecificProfileTest, profileTestInfo } from './profile.test.js';
import { runProfileTasksTests, runSpecificProfileTasksTest, profileTasksTestInfo } from './profileTasks.test.js';
import { runServersInteractionsTests, runSpecificServersInteractionsTest, serversInteractionsTestInfo } from './serversInteractions.test.js';
import { runVerifyDurTests, runSpecificVerifyDurTest, verifyDurTestInfo } from './verifyDur.test.js';
import { runVotesTests } from './votes.test.js';
import { runWelcomeTests } from './welcome.test.js';

// قائمة جميع ملفات الاختبار المتاحة
const availableTests = {
  profile: {
    runner: runProfileTests,
    specificRunner: runSpecificProfileTest,
    info: profileTestInfo
  },
  profileTasks: {
    runner: runProfileTasksTests,
    specificRunner: runSpecificProfileTasksTest,
    info: profileTasksTestInfo
  },
  serversInteractions: {
    runner: runServersInteractionsTests,
    specificRunner: runSpecificServersInteractionsTest,
    info: serversInteractionsTestInfo
  },
  verifyDur: {
    runner: runVerifyDurTests,
    specificRunner: runSpecificVerifyDurTest,
    info: verifyDurTestInfo
  },
  votes: {
    runner: runVotesTests,
    specificRunner: null,
    info: {
      name: 'Votes API Tests',
      description: 'اختبارات شاملة لواجهة برمجة تطبيقات التصويتات',
      endpoints: [
        'GET /',
        'GET /search',
        'GET /stats',
        'GET /:id',
        'GET /guild/:guildId',
        'GET /channel/:channelId',
        'GET /message/:messageId',
        'GET /rank-message/:rankMessageId',
        'GET /guild/:guildId/channel/:channelId',
        'GET /:id/exists',
        'GET /guild/:guildId/exists',
        'POST /',
        'POST /upsert',
        'PUT /:id',
        'PATCH /:id/guild',
        'PATCH /:id/message',
        'PATCH /:id/rank-message',
        'PATCH /:id/channel',
        'DELETE /:id',
        'DELETE /guild/:guildId'
      ]
    }
  },
  welcome: {
    runner: runWelcomeTests,
    specificRunner: null,
    info: {
      name: 'Welcome API Tests',
      description: 'اختبارات شاملة لواجهة برمجة تطبيقات إعدادات الترحيب',
      endpoints: [
        'GET /',
        'GET /stats',
        'GET /with-background',
        'GET /with-text',
        'GET /search',
        'GET /avatar-style/:avatarStyle',
        'GET /guild/:guildId',
        'GET /guild/:guildId/exists',
        'GET /guild/:guildId/has-background',
        'GET /guild/:guildId/has-text',
        'POST /',
        'POST /guild/:guildId',
        'POST /copy',
        'PUT /guild/:guildId',
        'PUT /guild/:guildId/upsert',
        'PATCH /guild/:guildId/image',
        'PATCH /guild/:guildId/background',
        'PATCH /guild/:guildId/avatar',
        'PATCH /guild/:guildId/text',
        'PATCH /guild/:guildId/clear-background',
        'PATCH /guild/:guildId/clear-text',
        'PATCH /guild/:guildId/reset-avatar',
        'DELETE /without-background',
        'DELETE /without-text',
        'DELETE /guild/:guildId'
      ]
    }
  }
};

// دالة تشغيل جميع الاختبارات
export const runAllTests = async () => {
  console.log('🚀 بدء تشغيل جميع الاختبارات...');
  const results = {};
  
  for (const [testName, testModule] of Object.entries(availableTests)) {
    try {
      console.log(`\n📋 تشغيل اختبارات ${testModule.info.name}...`);
      const result = await testModule.runner();
      results[testName] = {
        success: true,
        summary: result,
        info: testModule.info
      };
    } catch (error) {
      console.error(`❌ فشل في تشغيل اختبارات ${testName}:`, error.message);
      results[testName] = {
        success: false,
        error: error.message,
        info: testModule.info
      };
    }
  }
  
  // طباعة ملخص شامل
  console.log('\n📊 ملخص شامل لجميع الاختبارات:');
  console.log('=' .repeat(50));
  
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const [testName, result] of Object.entries(results)) {
    if (result.success) {
      const stats = result.summary.run.stats;
      totalTests += stats.tests.total;
      totalPassed += stats.tests.passed;
      totalFailed += stats.tests.failed;
      
      console.log(`✅ ${result.info.name}: ${stats.tests.passed}/${stats.tests.total} نجح`);
    } else {
      console.log(`❌ ${result.info.name}: فشل في التشغيل`);
    }
  }
  
  console.log('=' .repeat(50));
  console.log(`📈 المجموع الكلي: ${totalPassed}/${totalTests} اختبار نجح`);
  console.log(`📉 الاختبارات الفاشلة: ${totalFailed}`);
  
  return results;
};

// دالة تشغيل اختبارات محددة حسب النوع
export const runTestsByType = async (testType) => {
  if (!availableTests[testType]) {
    throw new Error(`نوع الاختبار '${testType}' غير موجود. الأنواع المتاحة: ${Object.keys(availableTests).join(', ')}`);
  }
  
  console.log(`🎯 تشغيل اختبارات ${availableTests[testType].info.name}...`);
  return await availableTests[testType].runner();
};

// دالة تشغيل اختبار محدد
export const runSpecificTest = async (testType, testName) => {
  if (!availableTests[testType]) {
    throw new Error(`نوع الاختبار '${testType}' غير موجود. الأنواع المتاحة: ${Object.keys(availableTests).join(', ')}`);
  }
  
  console.log(`🔍 تشغيل اختبار محدد: ${testName} من ${availableTests[testType].info.name}...`);
  return await availableTests[testType].specificRunner(testName);
};

// دالة عرض معلومات الاختبارات المتاحة
export const listAvailableTests = () => {
  console.log('📋 الاختبارات المتاحة:');
  console.log('=' .repeat(40));
  
  for (const [testType, testModule] of Object.entries(availableTests)) {
    console.log(`🔹 ${testType}: ${testModule.info.name}`);
    console.log(`   📝 الوصف: ${testModule.info.description}`);
    console.log(`   🔢 عدد الاختبارات: ${testModule.info.testCount}`);
    console.log(`   🌐 الرابط الأساسي: ${testModule.info.baseUrl}`);
    console.log('');
  }
};

// تصدير الوظائف الأساسية للتوافق مع النسخة السابقة
export { runProfileTests, runSpecificProfileTest, runProfileTasksTests, runSpecificProfileTasksTest, runServersInteractionsTests, runSpecificServersInteractionsTest, runVerifyDurTests, runSpecificVerifyDurTest, runVotesTests, runWelcomeTests };