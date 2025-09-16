import '../../../../config/index.js';
import createDefaultManager from '../config/postgresql-batch.config.js';
import { User } from '../models/index.js';
import sequelize from '../config/db.config.js';
import { Op } from 'sequelize';

// إعداد النظام
const postgresQueueManager = createDefaultManager();

/**
 * اختبار الاتصال بقاعدة البيانات
 */
async function testDatabaseConnection() {
  console.log('\n🔗 Testing PostgreSQL database connection...');
  
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL database:', error.message);
    return false;
  }
}

/**
 * مزامنة النماذج مع قاعدة البيانات
 */
async function syncModels() {
  console.log('\n🔄 Synchronizing models with database...');
  
  try {
    await sequelize.sync({ force: false }); // force: false لعدم حذف البيانات الموجودة
    console.log('✅ Models synchronized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error synchronizing models:', error.message);
    return false;
  }
}

/**
 * تنظيف البيانات الاختبارية
 */
async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    // حذف المستخدمين الاختباريين
    const deletedCount = await User.destroy({
      where: {
        email: {
          [sequelize.Sequelize.Op.like]: '%test%'
        }
      }
    });
    
    console.log(`✅ Cleaned up ${deletedCount} test users`);
    return true;
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error.message);
    return false;
  }
}

/**
 * إنشاء بيانات اختبارية
 */
function generateTestUsers(count, startIndex = 1) {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const userIndex = startIndex + i;
    users.push({
      name: `Test User ${userIndex}`,
      email: `testuser${userIndex}@test.com`,
      password: `password${userIndex}`
    });
  }
  
  return users;
}

/**
 * اختبار عمليات INSERT المجمعة
 */
async function testBatchInserts() {
  console.log('\n📝 Testing batch INSERT operations (1,000,000 records)...');
  
  const totalRecords = 1000000;
  const batchSize = 10000; // دفعات من 10,000 مستخدم
  const startTime = Date.now();
  let totalInserted = 0;
  
  try {
    // تنفيذ العمليات بدفعات لتجنب مشاكل الذاكرة
    for (let i = 0; i < totalRecords; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, totalRecords - i);
      const testUsers = generateTestUsers(currentBatchSize, i + 1); // بدء الترقيم من i+1
      
      console.log(`📝 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(totalRecords / batchSize)} (${currentBatchSize} records)...`);
      
      // تنفيذ عمليات INSERT للدفعة الحالية
      const insertPromises = testUsers.map(userData => 
        postgresQueueManager.queueInsert(User, userData)
      );
      
      const batchResults = await Promise.all(insertPromises);
      totalInserted += batchResults.length;
      
      // تنظيف الذاكرة
      if (global.gc) {
        global.gc();
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Successfully inserted ${totalInserted} users`);
    console.log(`⏱️ Total time: ${duration}ms`);
    console.log(`📊 Average time per insert: ${(duration / totalInserted).toFixed(2)}ms`);
    console.log(`🚀 Operations per second: ${(totalInserted / (duration / 1000)).toFixed(2)}`);
    
    return { totalInserted, duration };
  } catch (error) {
    console.error('❌ Error in batch inserts:', error.message);
    throw error;
  }
}

/**
 * اختبار عمليات SELECT المجمعة
 */
async function testBatchSelects() {
  console.log('\n🔍 Testing batch SELECT operations (1,000,000 operations)...');
  
  const totalOperations = 1000000;
  const batchSize = 5000; // دفعات من 5,000 عملية
  const startTime = Date.now();
  let totalSelects = 0;
  
  try {
    // تنفيذ العمليات بدفعات لتجنب مشاكل الذاكرة
    for (let i = 0; i < totalOperations; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, totalOperations - i);
      const selectPromises = [];
      
      console.log(`🔍 Processing SELECT batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(totalOperations / batchSize)} (${currentBatchSize} operations)...`);
      
      // إضافة عمليات SELECT للدفعة الحالية
      for (let j = 0; j < currentBatchSize; j++) {
        const operationIndex = i + j;
        selectPromises.push(
          postgresQueueManager.queueSelect(User, {
            where: {
              id: {
                [Op.gt]: operationIndex % 1000
              }
            },
            limit: 5
          })
        );
      }
      
      const batchResults = await Promise.all(selectPromises);
      totalSelects += batchResults.length;
      
      // تنظيف الذاكرة
      if (global.gc) {
        global.gc();
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Successfully executed ${totalSelects} SELECT operations`);
    console.log(`⏱️ Total time: ${duration}ms`);
    console.log(`📊 Average time per select: ${(duration / totalSelects).toFixed(2)}ms`);
    console.log(`🚀 Operations per second: ${(totalSelects / (duration / 1000)).toFixed(2)}`);
    
    return { totalSelects, duration };
  } catch (error) {
    console.error('❌ Error in batch selects:', error.message);
    throw error;
  }
}

/**
 * اختبار عمليات UPDATE المجمعة
 */
async function testBatchUpdates() {
  console.log('\n✏️ Testing batch UPDATE operations (1,000,000 records)...');
  
  const targetUpdates = 1000000;
  const batchSize = 5000; // دفعات من 5,000 تحديث
  const startTime = Date.now();
  let totalUpdated = 0;
  
  try {
    // الحصول على المستخدمين المتاحين للتحديث
    const availableUsers = await User.findAll();
    console.log("availableUsers : ", availableUsers);
    if (availableUsers.length === 0) {
      console.log('⚠️ No test users found for update');
      return { totalUpdated: 0, duration: 0 };
    }
    
    console.log(`📋 Found ${availableUsers.length} users available for update`);
    
    // تنفيذ العمليات بدفعات
    for (let i = 0; i < targetUpdates; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, targetUpdates - i);
      const updatePromises = [];
      
      console.log(`✏️ Processing UPDATE batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(targetUpdates / batchSize)} (${currentBatchSize} operations)...`);
      
      // إنشاء عمليات التحديث للدفعة الحالية
      for (let j = 0; j < currentBatchSize; j++) {
        const userIndex = (i + j) % availableUsers.length;
        const user = availableUsers[userIndex];
        
        updatePromises.push(
          postgresQueueManager.queueUpdate(
            User,
            { name: `Updated User ${i + j + 1}` },
            { id: user.id }
          )
        );
      }
      
      const batchResults = await Promise.all(updatePromises);
      const successfulUpdates = batchResults.filter(result => result.affectedRows > 0).length;
      totalUpdated += successfulUpdates;
      
      // تنظيف الذاكرة
      if (global.gc) {
        global.gc();
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Successfully updated ${totalUpdated} users`);
    console.log(`⏱️ Total time: ${duration}ms`);
    console.log(`📊 Average time per update: ${(duration / totalUpdated).toFixed(2)}ms`);
    console.log(`🚀 Operations per second: ${(totalUpdated / (duration / 1000)).toFixed(2)}`);
    
    return { totalUpdated, duration };
  } catch (error) {
    console.error('❌ Error in batch updates:', error.message);
    throw error;
  }
}

/**
 * اختبار عمليات DELETE المجمعة
 */
async function testBatchDeletes() {
  console.log('\n🗑️ Testing batch DELETE operations (1,000,000 records)...');
  
  const targetDeletes = 1000000;
  const batchSize = 5000; // دفعات من 5,000 حذف
  const startTime = Date.now();
  let totalDeleted = 0;
  
  try {
    // الحصول على المستخدمين المتاحين للحذف
    const availableUsers = await User.findAll({
      where: {
        email: {
          [sequelize.Sequelize.Op.like]: '%test%'
        }
      },
      attributes: ['id'],
      limit: 50000 // نأخذ عينة من المستخدمين
    });
    
    if (availableUsers.length === 0) {
      console.log('⚠️ No test users found for deletion');
      return { totalDeleted: 0, duration: 0 };
    }
    
    console.log(`📋 Found ${availableUsers.length} users available for deletion`);
    
    // تنفيذ العمليات بدفعات
    for (let i = 0; i < targetDeletes; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, targetDeletes - i);
      const deletePromises = [];
      
      console.log(`🗑️ Processing DELETE batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(targetDeletes / batchSize)} (${currentBatchSize} operations)...`);
      
      // إنشاء عمليات الحذف للدفعة الحالية
      for (let j = 0; j < currentBatchSize; j++) {
        const userIndex = (i + j) % availableUsers.length;
        const user = availableUsers[userIndex];
        
        deletePromises.push(
          postgresQueueManager.queueDelete(
            User,
            { id: user.id }
          )
        );
      }
      
      const batchResults = await Promise.all(deletePromises);
       const successfulDeletes = batchResults.filter(result => result.affectedRows > 0).length;
       totalDeleted += successfulDeletes;
      
      // تنظيف الذاكرة
      if (global.gc) {
        global.gc();
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Successfully deleted ${totalDeleted} users`);
    console.log(`⏱️ Total time: ${duration}ms`);
    console.log(`📊 Average time per delete: ${(duration / totalDeleted).toFixed(2)}ms`);
    console.log(`🚀 Operations per second: ${(totalDeleted / (duration / 1000)).toFixed(2)}`);
    
    return { totalDeleted, duration };
  } catch (error) {
    console.error('❌ Error in batch deletes:', error.message);
    throw error;
  }
}

/**
 * اختبار الأداء المختلط
 */
async function testMixedOperations() {
  console.log('\n🔄 Testing mixed operations performance...');
  
  const startTime = Date.now();
  
  try {
    // إنشاء عمليات مختلطة
    const operations = [];
    
    // إضافة عمليات INSERT
    for (let i = 1; i <= 100; i++) {
      operations.push(
        postgresQueueManager.queueInsert(User, {
          name: `Mixed User ${i}`,
          email: `mixeduser${i}@test.com`,
          password: `password${i}`
        })
      );
    }
    
    // إضافة عمليات SELECT
    for (let i = 0; i < 50; i++) {
      operations.push(
        postgresQueueManager.queueSelect(User, {
          limit: 10,
          order: [['name', 'ASC']]
        })
      );
    }
    
    // تنفيذ جميع العمليات بشكل متوازي
    const results = await Promise.all(operations);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Successfully executed ${results.length} mixed operations`);
    console.log(`⏱️ Total time: ${duration}ms`);
    console.log(`📊 Average time per operation: ${(duration / results.length).toFixed(2)}ms`);
    console.log(`🚀 Operations per second: ${(results.length / (duration / 1000)).toFixed(2)}`);
    
    return results;
  } catch (error) {
    console.error('❌ Error in mixed operations:', error.message);
    throw error;
  }
}

/**
 * عرض إحصائيات الأداء
 */
function displayMetrics() {
  console.log('\n📊 Performance Metrics:');
  console.log('=' .repeat(50));
  
  const metrics = postgresQueueManager.getMetrics();
  
  console.log(`📈 Total Operations:`);
  console.log(`   • INSERT: ${metrics.operations.insert}`);
  console.log(`   • UPDATE: ${metrics.operations.update}`);
  console.log(`   • SELECT: ${metrics.operations.select}`);
  console.log(`   • DELETE: ${metrics.operations.delete}`);
  
  console.log(`\n📦 Total Batches:`);
  console.log(`   • INSERT: ${metrics.batches.insert}`);
  console.log(`   • UPDATE: ${metrics.batches.update}`);
  console.log(`   • SELECT: ${metrics.batches.select}`);
  console.log(`   • DELETE: ${metrics.batches.delete}`);
  
  console.log(`\n⏱️ Average Processing Times:`);
  console.log(`   • INSERT: ${metrics.timing.avgInsertBatchTime.toFixed(2)}ms`);
  console.log(`   • UPDATE: ${metrics.timing.avgUpdateBatchTime.toFixed(2)}ms`);
  console.log(`   • SELECT: ${metrics.timing.avgSelectBatchTime.toFixed(2)}ms`);
  console.log(`   • DELETE: ${metrics.timing.avgDeleteBatchTime.toFixed(2)}ms`);
  
  console.log(`\n🚀 Operations Per Second:`);
  console.log(`   • INSERT: ${metrics.operationsPerSecond.insert.toFixed(2)}`);
  console.log(`   • UPDATE: ${metrics.operationsPerSecond.update.toFixed(2)}`);
  console.log(`   • SELECT: ${metrics.operationsPerSecond.select.toFixed(2)}`);
  console.log(`   • DELETE: ${metrics.operationsPerSecond.delete.toFixed(2)}`);
  
  console.log(`\n📋 Queue Sizes:`);
  console.log(`   • INSERT: ${metrics.queueSizes.insert}`);
  console.log(`   • UPDATE: ${metrics.queueSizes.update}`);
  console.log(`   • SELECT: ${metrics.queueSizes.select}`);
  console.log(`   • DELETE: ${metrics.queueSizes.delete}`);
  
  console.log(`\n⚡ Overall Performance:`);
  console.log(`   • Average Batch Size: ${metrics.averageBatchSize.toFixed(2)}`);
  console.log(`   • Total Processing Time: ${metrics.timing.totalRuntime.toFixed(2)}ms`);
  console.log(`   • Average Processing Time: ${metrics.averageProcessingTime.toFixed(2)}ms`);
}

/**
 * تشغيل جميع الاختبارات
 */
async function runAllTests() {
  console.log('🚀 Starting PostgreSQL Batch Testing System');
  console.log('=' .repeat(60));
  
  try {
    // اختبار الاتصال
    const connectionOk = await testDatabaseConnection();
    if (!connectionOk) {
      throw new Error('Database connection failed');
    }
    
    // مزامنة النماذج
    const syncOk = await syncModels();
    if (!syncOk) {
      throw new Error('Model synchronization failed');
    }
    
    // تنظيف البيانات السابقة
    // await cleanupTestData();
    
    // تشغيل الاختبارات
    console.log('\n🧪 Running performance tests...');
    
    // await testBatchInserts();
    // await testBatchSelects();
    // await testBatchUpdates();
    // await testBatchDeletes();
    // await testMixedOperations();
    
    // عرض الإحصائيات
    displayMetrics();
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    console.error(error.stack);
  } finally {
    // تنظيف البيانات الاختبارية
    // await cleanupTestData();
    
    // إغلاق النظام
    await postgresQueueManager.shutdown();
    
    // إغلاق الاتصال بقاعدة البيانات
    await sequelize.close();
    
    console.log('\n🔚 PostgreSQL Batch Testing completed');
  }
}

// تشغيل الاختبارات إذا تم تشغيل الملف مباشرة
// if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
// }

// تصدير الدوال للاستخدام الخارجي
export {
  testDatabaseConnection,
  syncModels,
  cleanupTestData,
  testBatchInserts,
  testBatchSelects,
  testBatchUpdates,
  testBatchDeletes,
  testMixedOperations,
  displayMetrics,
  runAllTests
};

export default runAllTests;