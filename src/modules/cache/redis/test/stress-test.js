import '../../../../config/index.js';

import { RedisPoolManager } from '../config/redis.config.js';
import '../../../../config/index.js'; // تحميل متغيرات البيئة

console.log('🔥 Redis Stress Test - 1 Million Operations');
console.log('=' .repeat(50));

async function stressTest() {
  let poolManager;
  
  try {
    // إنشاء مدير المجموعة مع إعدادات محسنة للضغط العالي
    poolManager = new RedisPoolManager({
      poolSize: 10 // زيادة عدد الاتصالات للضغط العالي
    });
    
    console.log('⏳ Waiting for pool initialization...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n📊 Initial Stats:');
    console.log(poolManager.getStats());
    
    // اختبار مليون عملية SET
    console.log('\n🚀 Starting 1 Million SET operations...');
    const setStartTime = Date.now();
    
    const batchSize = 100; // تقليل حجم المجموعة لتجنب انتهاء المهلة
    const totalBatches = 10000; // 100 * 10000 = 1,000,000
    let setSuccessCount = 0;
    let setFailureCount = 0;
    
    for (let batch = 0; batch < totalBatches; batch++) {
      const batchPromises = [];
      
      for (let i = 0; i < batchSize; i++) {
        const key = `stress:set:${batch * batchSize + i}`;
        const value = `value_${batch * batchSize + i}_${Date.now()}`;
        batchPromises.push(
          poolManager.executeCommand('set', [key, value])
            .then(() => setSuccessCount++)
            .catch(() => setFailureCount++)
        );
      }
      
      await Promise.all(batchPromises);
      
      // طباعة التقدم كل 1000 مجموعة (100,000 عملية)
      if ((batch + 1) % 1000 === 0) {
        console.log(`📈 SET Progress: ${(batch + 1) * batchSize} operations completed`);
      }
      
      // إضافة تأخير صغير كل 1000 مجموعة لتجنب إرهاق الخادم
      if ((batch + 1) % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    const setEndTime = Date.now();
    const setDuration = setEndTime - setStartTime;
    
    console.log(`\n✅ 1 Million SET operations completed!`);
    console.log(`✅ Successful: ${setSuccessCount}, ❌ Failed: ${setFailureCount}`);
    console.log(`⏱️ Time taken: ${setDuration}ms (${(setDuration / 1000).toFixed(2)}s)`);
    console.log(`🚀 Operations per second: ${Math.round(setSuccessCount / (setDuration / 1000))}`);
    
    // اختبار مليون عملية GET
    console.log('\n🚀 Starting 1 Million GET operations...');
    const getStartTime = Date.now();
    
    let getSuccessCount = 0;
    let getFailureCount = 0;
    const getResults = [];
    
    for (let batch = 0; batch < totalBatches; batch++) {
      const batchPromises = [];
      
      for (let i = 0; i < batchSize; i++) {
        const key = `stress:set:${batch * batchSize + i}`;
        batchPromises.push(
          poolManager.executeCommand('get', [key])
            .then(result => {
              getSuccessCount++;
              return result;
            })
            .catch(error => {
              getFailureCount++;
              return null;
            })
        );
      }
      
      const batchResults = await Promise.all(batchPromises);
      getResults.push(...batchResults);
      
      // طباعة التقدم كل 1000 مجموعة (100,000 عملية)
      if ((batch + 1) % 1000 === 0) {
        console.log(`📈 GET Progress: ${(batch + 1) * batchSize} operations completed`);
      }
      
      // إضافة تأخير صغير كل 1000 مجموعة لتجنب إرهاق الخادم
      if ((batch + 1) % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    const getEndTime = Date.now();
    const getDuration = getEndTime - getStartTime;
    
    console.log(`\n✅ 1 Million GET operations completed!`);
    console.log(`✅ Successful: ${getSuccessCount}, ❌ Failed: ${getFailureCount}`);
    console.log(`⏱️ Time taken: ${getDuration}ms (${(getDuration / 1000).toFixed(2)}s)`);
    console.log(`🚀 Operations per second: ${Math.round(getSuccessCount / (getDuration / 1000))}`);
    
    // التحقق من صحة البيانات
    let validResults = 0;
    getResults.forEach(result => {
      if (result && result.startsWith('value_')) {
        validResults++;
      }
    });
    
    console.log(`\n📊 Data Validation:`);
    console.log(`✅ Valid results: ${validResults} / ${getSuccessCount}`);
    console.log(`📈 GET Success rate: ${(getSuccessCount / 1000000 * 100).toFixed(2)}%`);
    console.log(`📈 Data integrity rate: ${getSuccessCount > 0 ? (validResults / getSuccessCount * 100).toFixed(2) : 0}%`);
    
    // إحصائيات نهائية
    console.log('\n📊 Final Stats:');
    const finalStats = poolManager.getStats();
    console.log(finalStats);
    
    // إحصائيات الأداء الإجمالي
    const totalDuration = setDuration + getDuration;
    const totalSuccessful = setSuccessCount + getSuccessCount;
    const totalFailed = setFailureCount + getFailureCount;
    console.log('\n🏆 Performance Summary:');
    console.log(`📊 Total operations attempted: 2,000,000`);
    console.log(`✅ Total successful: ${totalSuccessful}`);
    console.log(`❌ Total failed: ${totalFailed}`);
    console.log(`📈 Overall success rate: ${(totalSuccessful / 2000000 * 100).toFixed(2)}%`);
    console.log(`⏱️ Total time: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
    console.log(`🚀 Overall operations per second: ${Math.round(totalSuccessful / (totalDuration / 1000))}`);
    console.log(`💾 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    
    // تنظيف البيانات التجريبية
    console.log('\n🧹 Cleaning up test data...');
    const cleanupStartTime = Date.now();
    
    let cleanupSuccessCount = 0;
    let cleanupFailureCount = 0;
    
    for (let batch = 0; batch < totalBatches; batch++) {
      const keys = [];
      for (let i = 0; i < batchSize; i++) {
        keys.push(`stress:set:${batch * batchSize + i}`);
      }
      
      try {
        await poolManager.executeCommand('del', keys);
        cleanupSuccessCount += keys.length;
      } catch (error) {
        cleanupFailureCount += keys.length;
      }
      
      // طباعة التقدم كل 1000 مجموعة
      if ((batch + 1) % 1000 === 0) {
        console.log(`🧹 Cleanup Progress: ${(batch + 1) * batchSize} keys processed`);
      }
    }
    
    const cleanupDuration = Date.now() - cleanupStartTime;
    console.log(`✅ Cleanup completed in ${cleanupDuration}ms`);
    console.log(`🗑️ Keys deleted: ${cleanupSuccessCount}, Failed: ${cleanupFailureCount}`);
    
    console.log('\n🎉 Stress test completed successfully!');
    
  } catch (error) {
    console.error('❌ Stress test failed:', error.message);
    console.error(error.stack);
  } finally {
    if (poolManager) {
      console.log('\n🔄 Shutting down pool manager...');
      await poolManager.shutdown();
    }
  }
}

// تشغيل اختبار الضغط
stressTest();