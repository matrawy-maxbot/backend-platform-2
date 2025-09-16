// تحميل متغيرات البيئة أولاً
import '../../../../config/index.js';
import queueManager from '../config/redis.config.js';

// مثال على الاستخدام والاختبار
async function testQueueBatchSystem() {
  console.log('🚀 Starting Redis Queue Batch System Test');
  console.log('=' .repeat(60));
  
  try {
    console.log('\n🔄 Phase 1: Testing SET operations...');
    
    // اختبار عمليات SET
    const setPromises = [];
    const startTime = Date.now();
    
    for (let i = 0; i < 1_000_000; i++) {
      const promise = queueManager.queueSet(
        `test_key_${i}`,
        {
          id: i,
          data: `test_data_${i}`,
          timestamp: Date.now(),
          random: Math.random()
        },
        300 // 5 minutes TTL
      );
      setPromises.push(promise);
    }
    
    await Promise.all(setPromises);
    const setEndTime = Date.now();
    
    console.log(`✅ SET operations completed in ${setEndTime - startTime}ms`);
    
    console.log('\n🔄 Phase 2: Testing GET operations...');
    
    // اختبار عمليات GET
    const getPromises = [];
    const getStartTime = Date.now();
    
    for (let i = 0; i < 1_000_000; i++) {
      const promise = queueManager.queueGet(`test_key_${i}`);
      getPromises.push(promise);
    }
    
    const getResults = await Promise.all(getPromises);
    const getEndTime = Date.now();
    
    console.log(`✅ GET operations completed in ${getEndTime - getStartTime}ms`);
    
    // التحقق من صحة البيانات
    let validData = 0;
    getResults.forEach((result, index) => {
      if (result && result.id === index) {
        validData++;
      }
    });
    
    console.log(`📊 Data integrity: ${validData}/10000 (${((validData/10000)*100).toFixed(1)}%)`);
    
    console.log('\n🔄 Phase 3: Testing DELETE operations...');
    
    // اختبار عمليات DELETE
    const delPromises = [];
    const delStartTime = Date.now();
    
    for (let i = 0; i < 1_000_000; i++) {
      const promise = queueManager.queueDel(`test_key_${i}`);
      delPromises.push(promise);
    }
    
    await Promise.all(delPromises);
    const delEndTime = Date.now();
    
    console.log(`✅ DELETE operations completed in ${delEndTime - delStartTime}ms`);
    
    // عرض الإحصائيات النهائية
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL PERFORMANCE METRICS');
    console.log('='.repeat(60));
    
    const metrics = queueManager.getMetrics();
    
    console.log(`\n🔸 Operations Summary:`);
    console.log(`   - Total SET operations: ${metrics.totalSetOperations.toLocaleString()}`);
    console.log(`   - Total GET operations: ${metrics.totalGetOperations.toLocaleString()}`);
    console.log(`   - Total DELETE operations: ${metrics.totalDelOperations.toLocaleString()}`);
    console.log(`   - Total batches processed: ${metrics.totalBatches}`);
    
    console.log(`\n🔸 Performance Metrics:`);
    console.log(`   - Average batch size: ${metrics.averageBatchSize.toFixed(1)} operations`);
    console.log(`   - Average processing time: ${metrics.averageProcessingTime.toFixed(2)}ms per batch`);
    console.log(`   - SET throughput: ${metrics.operationsPerSecond.set.toFixed(0)} ops/sec`);
    console.log(`   - GET throughput: ${metrics.operationsPerSecond.get.toFixed(0)} ops/sec`);
    console.log(`   - DELETE throughput: ${metrics.operationsPerSecond.del.toFixed(0)} ops/sec`);
    
    console.log(`\n🔸 Queue Status:`);
    console.log(`   - SET queue: ${metrics.queueSizes.setQueue} pending`);
    console.log(`   - GET queue: ${metrics.queueSizes.getQueue} pending`);
    console.log(`   - DELETE queue: ${metrics.queueSizes.delQueue} pending`);
    
    const totalTime = (setEndTime - startTime) + (getEndTime - getStartTime) + (delEndTime - delStartTime);
    const totalOperations = metrics.totalSetOperations + metrics.totalGetOperations + metrics.totalDelOperations;
    
    console.log(`\n🏆 Overall Performance:`);
    console.log(`   - Total time: ${totalTime}ms (${(totalTime/1000).toFixed(2)}s)`);
    console.log(`   - Total operations: ${totalOperations.toLocaleString()}`);
    console.log(`   - Overall throughput: ${(totalOperations / (totalTime/1000)).toFixed(0)} ops/sec`);
    console.log(`   - Average latency: ${(totalTime/totalOperations).toFixed(2)}ms per operation`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await queueManager.shutdown();
  }
}

testQueueBatchSystem().catch(console.error);