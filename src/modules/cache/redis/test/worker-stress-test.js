import '../../../../config/index.js';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { RedisPoolManager } from '../config/redis.config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (isMainThread) {
  // Main thread - إدارة العمليات الرئيسية
  console.log('🔥 Redis Worker Stress Test - Multi-threading vs Single-threading');
  console.log('=' .repeat(70));

  async function runSingleThreadTest() {
    console.log('\n🔄 Single Thread Test - 1 Million SET operations');
    console.log('-'.repeat(50));
    
    const poolManager = new RedisPoolManager({ poolSize: 10 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const startTime = Date.now();
    const batchSize = 100;
    const totalBatches = 10000; // 1 million operations
    let successCount = 0;
    let failureCount = 0;
    
    for (let batch = 0; batch < totalBatches; batch++) {
      const batchPromises = [];
      
      for (let i = 0; i < batchSize; i++) {
        const key = `single:${batch * batchSize + i}`;
        const value = `value_${batch * batchSize + i}_${Date.now()}`;
        batchPromises.push(
          poolManager.executeCommand('set', [key, value])
            .then(() => successCount++)
            .catch(() => failureCount++)
        );
      }
      
      await Promise.all(batchPromises);
      
      if ((batch + 1) % 1000 === 0) {
        console.log(`📈 Single Thread Progress: ${(batch + 1) * batchSize} operations`);
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    await poolManager.closeAll();
    
    return {
      duration,
      successCount,
      failureCount,
      opsPerSecond: Math.round(successCount / (duration / 1000))
    };
  }

  async function runWorkerTest() {
    console.log('\n🔄 Multi-Worker Test - 2 Workers × 500K operations each');
    console.log('-'.repeat(50));
    
    const startTime = Date.now();
    
    // إنشاء عاملين
    const worker1Promise = new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { workerId: 1, operations: 500000, keyPrefix: 'worker1' }
      });
      
      worker.on('message', resolve);
      worker.on('error', reject);
    });
    
    const worker2Promise = new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { workerId: 2, operations: 500000, keyPrefix: 'worker2' }
      });
      
      worker.on('message', resolve);
      worker.on('error', reject);
    });
    
    const [result1, result2] = await Promise.all([worker1Promise, worker2Promise]);
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    return {
      duration: totalDuration,
      successCount: result1.successCount + result2.successCount,
      failureCount: result1.failureCount + result2.failureCount,
      opsPerSecond: Math.round((result1.successCount + result2.successCount) / (totalDuration / 1000)),
      worker1: result1,
      worker2: result2
    };
  }

  async function runComparison() {
    try {
      // تشغيل الاختبار الأحادي
      console.log('🚀 Starting performance comparison...');
      const singleResult = await runSingleThreadTest();
      
      console.log('\n✅ Single Thread Results:');
      console.log(`   Duration: ${singleResult.duration}ms (${(singleResult.duration / 1000).toFixed(2)}s)`);
      console.log(`   Success: ${singleResult.successCount}`);
      console.log(`   Failed: ${singleResult.failureCount}`);
      console.log(`   Ops/sec: ${singleResult.opsPerSecond}`);
      
      // انتظار قصير قبل الاختبار التالي
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // تشغيل اختبار العمال المتعددين
      const workerResult = await runWorkerTest();
      
      console.log('\n✅ Multi-Worker Results:');
      console.log(`   Total Duration: ${workerResult.duration}ms (${(workerResult.duration / 1000).toFixed(2)}s)`);
      console.log(`   Total Success: ${workerResult.successCount}`);
      console.log(`   Total Failed: ${workerResult.failureCount}`);
      console.log(`   Total Ops/sec: ${workerResult.opsPerSecond}`);
      console.log(`   Worker 1: ${workerResult.worker1.successCount} ops in ${workerResult.worker1.duration}ms`);
      console.log(`   Worker 2: ${workerResult.worker2.successCount} ops in ${workerResult.worker2.duration}ms`);
      
      // مقارنة النتائج
      console.log('\n📊 Performance Comparison:');
      console.log('=' .repeat(50));
      
      const speedImprovement = ((singleResult.duration - workerResult.duration) / singleResult.duration * 100);
      const throughputImprovement = ((workerResult.opsPerSecond - singleResult.opsPerSecond) / singleResult.opsPerSecond * 100);
      
      console.log(`🏁 Single Thread: ${singleResult.duration}ms`);
      console.log(`🏁 Multi-Worker:  ${workerResult.duration}ms`);
      
      if (speedImprovement > 0) {
        console.log(`🚀 Speed Improvement: ${speedImprovement.toFixed(1)}% faster with workers`);
      } else {
        console.log(`⚠️  Speed Difference: ${Math.abs(speedImprovement).toFixed(1)}% slower with workers`);
      }
      
      if (throughputImprovement > 0) {
        console.log(`📈 Throughput Improvement: ${throughputImprovement.toFixed(1)}% higher with workers`);
      } else {
        console.log(`📉 Throughput Difference: ${Math.abs(throughputImprovement).toFixed(1)}% lower with workers`);
      }
      
      console.log('\n🎯 Analysis:');
      if (speedImprovement > 5) {
        console.log('✅ Multi-threading provides significant performance benefits for Redis operations');
      } else if (speedImprovement > 0) {
        console.log('⚡ Multi-threading provides modest performance benefits');
      } else {
        console.log('⚠️  Single-threading performs better - Redis\'s single-threaded nature limits multi-threading benefits');
      }
      
      console.log('\n💡 Conclusion:');
      console.log('Redis is inherently single-threaded for command processing.');
      console.log('Worker threads may help with network I/O parallelization,');
      console.log('but the Redis server itself processes commands sequentially.');
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
  }

  // تشغيل المقارنة
  runComparison();

} else {
  // Worker thread - تنفيذ العمليات
  const { workerId, operations, keyPrefix } = workerData;
  
  async function workerTask() {
    try {
      console.log(`🔧 Worker ${workerId} starting ${operations} operations...`);
      
      const poolManager = new RedisPoolManager({ poolSize: 5 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const startTime = Date.now();
      const batchSize = 100;
      const totalBatches = operations / batchSize;
      let successCount = 0;
      let failureCount = 0;
      
      for (let batch = 0; batch < totalBatches; batch++) {
        const batchPromises = [];
        
        for (let i = 0; i < batchSize; i++) {
          const key = `${keyPrefix}:${batch * batchSize + i}`;
          const value = `value_${batch * batchSize + i}_${Date.now()}`;
          batchPromises.push(
            poolManager.executeCommand('set', [key, value])
              .then(() => successCount++)
              .catch(() => failureCount++)
          );
        }
        
        await Promise.all(batchPromises);
        
        // تقرير التقدم كل 1000 مجموعة
        if ((batch + 1) % 1000 === 0) {
          console.log(`📈 Worker ${workerId} Progress: ${(batch + 1) * batchSize} operations`);
        }
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      await poolManager.closeAll();
      
      const result = {
        workerId,
        duration,
        successCount,
        failureCount,
        opsPerSecond: Math.round(successCount / (duration / 1000))
      };
      
      console.log(`✅ Worker ${workerId} completed: ${successCount} ops in ${duration}ms`);
      
      // إرسال النتيجة للخيط الرئيسي
      parentPort.postMessage(result);
      
    } catch (error) {
      console.error(`❌ Worker ${workerId} failed:`, error.message);
      parentPort.postMessage({ error: error.message });
    }
  }
  
  workerTask();
}