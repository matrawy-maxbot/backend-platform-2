// تحميل متغيرات البيئة أولاً
import '../../../../config/index.js';

// Import required modules
import Redis from 'ioredis';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { redis } from '../../../../config/database.config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Worker function to perform Redis operations
async function workerRedisOperations(workerId, startIndex, endIndex) {
  console.log(`🔄 Worker ${workerId}: Starting operations from ${startIndex} to ${endIndex}`);
  
  try {
    // Create Redis client for this worker
    const client = new Redis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
      db: redis.db,
      maxRetriesPerRequest: 1,
      retryDelayOnFailover: 50
    });

    const operationsCount = endIndex - startIndex;
    let successCount = 0;
    let failureCount = 0;
    
    // === SET Operations ===
    console.log(`📝 Worker ${workerId}: Starting ${operationsCount} SET operations...`);
    const setStartTime = process.hrtime.bigint();
    
    const pipeline = client.pipeline();
    for (let i = startIndex; i < endIndex; i++) {
      const key = `worker_test:${i}`;
      const value = JSON.stringify({
        id: i,
        workerId: workerId,
        data: `worker_data_${i}`,
        timestamp: Date.now(),
        randomData: Math.random().toString(36).substring(7)
      });
      pipeline.set(key, value, 'EX', 600); // 10 minutes TTL
    }
    
    const setResults = await pipeline.exec();
    const setEndTime = process.hrtime.bigint();
    const setDuration = Number(setEndTime - setStartTime) / 1000000; // Convert to milliseconds
    
    // Count SET successes/failures
    setResults.forEach(result => {
      if (result[0] === null) {
        successCount++;
      } else {
        failureCount++;
      }
    });
    
    console.log(`✅ Worker ${workerId}: SET operations completed in ${setDuration.toFixed(2)}ms`);
    console.log(`   - Success: ${successCount}, Failures: ${failureCount}`);
    
    // === GET Operations ===
    console.log(`📖 Worker ${workerId}: Starting ${operationsCount} GET operations...`);
    const getStartTime = process.hrtime.bigint();
    
    const getPipeline = client.pipeline();
    for (let i = startIndex; i < endIndex; i++) {
      const key = `worker_test:${i}`;
      getPipeline.get(key);
    }
    
    const getResults = await getPipeline.exec();
    const getEndTime = process.hrtime.bigint();
    const getDuration = Number(getEndTime - getStartTime) / 1000000; // Convert to milliseconds
    
    // Count GET successes/failures and verify data integrity
    let getSuccessCount = 0;
    let getFailureCount = 0;
    let dataIntegrityCount = 0;
    
    getResults.forEach((result, index) => {
      if (result[0] === null && result[1] !== null) {
        getSuccessCount++;
        try {
          const data = JSON.parse(result[1]);
          if (data.id === startIndex + index && data.workerId === workerId) {
            dataIntegrityCount++;
          }
        } catch (e) {
          // JSON parse error
        }
      } else {
        getFailureCount++;
      }
    });
    
    console.log(`✅ Worker ${workerId}: GET operations completed in ${getDuration.toFixed(2)}ms`);
    console.log(`   - Success: ${getSuccessCount}, Failures: ${getFailureCount}`);
    console.log(`   - Data Integrity: ${dataIntegrityCount}/${operationsCount} (${((dataIntegrityCount/operationsCount)*100).toFixed(1)}%)`);
    
    // Calculate performance metrics
    const totalDuration = setDuration + getDuration;
    const setOpsPerSecond = (operationsCount / (setDuration / 1000)).toFixed(0);
    const getOpsPerSecond = (operationsCount / (getDuration / 1000)).toFixed(0);
    const totalOpsPerSecond = ((operationsCount * 2) / (totalDuration / 1000)).toFixed(0);
    
    const results = {
      workerId,
      operationsCount,
      setDuration: setDuration.toFixed(2),
      getDuration: getDuration.toFixed(2),
      totalDuration: totalDuration.toFixed(2),
      setOpsPerSecond,
      getOpsPerSecond,
      totalOpsPerSecond,
      setSuccessCount: successCount,
      setFailureCount: failureCount,
      getSuccessCount,
      getFailureCount,
      dataIntegrityCount
    };
    
    console.log(`📊 Worker ${workerId} Results:`);
    console.log(`   - SET: ${results.setDuration}ms (${setOpsPerSecond} ops/sec)`);
    console.log(`   - GET: ${results.getDuration}ms (${getOpsPerSecond} ops/sec)`);
    console.log(`   - Total: ${results.totalDuration}ms (${totalOpsPerSecond} ops/sec)`);
    
    await client.quit();
    return results;
    
  } catch (error) {
    console.error(`❌ Worker ${workerId} failed:`, error.message);
    throw error;
  }
}

// Worker thread code
if (!isMainThread) {
  const { workerId, startIndex, endIndex } = workerData;
  
  workerRedisOperations(workerId, startIndex, endIndex)
    .then(results => {
      parentPort.postMessage({ success: true, results });
    })
    .catch(error => {
      parentPort.postMessage({ success: false, error: error.message });
    });
}

// Main thread code
if (isMainThread) {
  async function runWorkerTest() {
    console.log('🚀 Starting Redis Worker Threads Performance Test');
    console.log('=' .repeat(60));
    
    const totalOperations = 1000000; // 1 million operations
    const numWorkers = 8;
    const operationsPerWorker = totalOperations / numWorkers;
    
    console.log(`📊 Test Configuration:`);
    console.log(`   - Total Operations: ${totalOperations.toLocaleString()}`);
    console.log(`   - Number of Workers: ${numWorkers}`);
    console.log(`   - Operations per Worker: ${operationsPerWorker.toLocaleString()}`);
    console.log('');
    
    // === Single Thread Test ===
    console.log('🔄 Phase 1: Single Thread Test');
    console.log('-'.repeat(40));
    
    const singleThreadStartTime = process.hrtime.bigint();
    const singleThreadResults = await workerRedisOperations('SINGLE', 0, totalOperations);
    const singleThreadEndTime = process.hrtime.bigint();
    const singleThreadTotalTime = Number(singleThreadEndTime - singleThreadStartTime) / 1000000;
    
    console.log(`\n✅ Single Thread Test Completed in ${singleThreadTotalTime.toFixed(2)}ms`);
    
    // === Multi Worker Test ===
    console.log('\n🔄 Phase 2: Multi Worker Test');
    console.log('-'.repeat(40));
    
    const multiWorkerStartTime = process.hrtime.bigint();
    
    const workers = [];
    const workerPromises = [];
    
    for (let i = 0; i < numWorkers; i++) {
      const startIndex = i * operationsPerWorker;
      const endIndex = (i + 1) * operationsPerWorker;
      
      const worker = new Worker(__filename, {
        workerData: {
          workerId: i + 1,
          startIndex,
          endIndex
        }
      });
      
      workers.push(worker);
      
      const workerPromise = new Promise((resolve, reject) => {
        worker.on('message', (message) => {
          if (message.success) {
            resolve(message.results);
          } else {
            reject(new Error(message.error));
          }
        });
        
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
      
      workerPromises.push(workerPromise);
    }
    
    try {
      const workerResults = await Promise.all(workerPromises);
      const multiWorkerEndTime = process.hrtime.bigint();
      const multiWorkerTotalTime = Number(multiWorkerEndTime - multiWorkerStartTime) / 1000000;
      
      console.log(`\n✅ Multi Worker Test Completed in ${multiWorkerTotalTime.toFixed(2)}ms`);
      
      // === Results Analysis ===
      console.log('\n' + '='.repeat(60));
      console.log('📊 PERFORMANCE COMPARISON RESULTS');
      console.log('='.repeat(60));
      
      // Single Thread Results
      console.log('\n🔸 Single Thread Results:');
      console.log(`   - Total Time: ${singleThreadTotalTime.toFixed(2)}ms (${(singleThreadTotalTime/1000).toFixed(2)}s)`);
      console.log(`   - SET Operations: ${singleThreadResults.setDuration}ms (${singleThreadResults.setOpsPerSecond} ops/sec)`);
      console.log(`   - GET Operations: ${singleThreadResults.getDuration}ms (${singleThreadResults.getOpsPerSecond} ops/sec)`);
      console.log(`   - Overall Throughput: ${singleThreadResults.totalOpsPerSecond} ops/sec`);
      console.log(`   - Success Rate: SET ${singleThreadResults.setSuccessCount}/${totalOperations}, GET ${singleThreadResults.getSuccessCount}/${totalOperations}`);
      
      // Multi Worker Results
      console.log('\n🔸 Multi Worker Results:');
      console.log(`   - Total Time: ${multiWorkerTotalTime.toFixed(2)}ms (${(multiWorkerTotalTime/1000).toFixed(2)}s)`);
      
      let totalSetSuccess = 0;
      let totalGetSuccess = 0;
      let totalDataIntegrity = 0;
      
      workerResults.forEach(result => {
        console.log(`   - Worker ${result.workerId}: SET ${result.setDuration}ms (${result.setOpsPerSecond} ops/sec), GET ${result.getDuration}ms (${result.getOpsPerSecond} ops/sec)`);
        totalSetSuccess += result.setSuccessCount;
        totalGetSuccess += result.getSuccessCount;
        totalDataIntegrity += result.dataIntegrityCount;
      });
      
      const multiWorkerThroughput = ((totalOperations * 2) / (multiWorkerTotalTime / 1000)).toFixed(0);
      console.log(`   - Overall Throughput: ${multiWorkerThroughput} ops/sec`);
      console.log(`   - Success Rate: SET ${totalSetSuccess}/${totalOperations}, GET ${totalGetSuccess}/${totalOperations}`);
      console.log(`   - Data Integrity: ${totalDataIntegrity}/${totalOperations} (${((totalDataIntegrity/totalOperations)*100).toFixed(1)}%)`);
      
      // Performance Comparison
      const speedImprovement = ((singleThreadTotalTime - multiWorkerTotalTime) / singleThreadTotalTime * 100).toFixed(1);
      const throughputImprovement = ((parseInt(multiWorkerThroughput) - parseInt(singleThreadResults.totalOpsPerSecond)) / parseInt(singleThreadResults.totalOpsPerSecond) * 100).toFixed(1);
      
      console.log('\n🏆 Performance Improvement:');
      if (multiWorkerTotalTime < singleThreadTotalTime) {
        console.log(`   - Time Reduction: ${speedImprovement}% faster`);
        console.log(`   - Throughput Increase: ${throughputImprovement}% higher`);
      } else {
        console.log(`   - Time Increase: ${Math.abs(speedImprovement)}% slower`);
        console.log(`   - Throughput Decrease: ${Math.abs(throughputImprovement)}% lower`);
      }
      
      console.log('\n📈 Summary:');
      console.log(`   - Single Thread: ${(singleThreadTotalTime/1000).toFixed(2)}s for ${(totalOperations * 2).toLocaleString()} operations`);
      console.log(`   - Multi Worker: ${(multiWorkerTotalTime/1000).toFixed(2)}s for ${(totalOperations * 2).toLocaleString()} operations`);
      console.log(`   - Workers provide ${multiWorkerTotalTime < singleThreadTotalTime ? 'better' : 'worse'} performance for this workload`);
      
      // Cleanup test data
      console.log('\n🧹 Cleaning up test data...');
      const cleanupClient = new Redis({
        host: redis.host,
        port: redis.port,
        password: redis.password,
        db: redis.db
      });
      
      const cleanupStartTime = Date.now();
      const keysToDelete = [];
      for (let i = 0; i < totalOperations; i++) {
        keysToDelete.push(`worker_test:${i}`);
      }
      
      // Delete in batches to avoid memory issues
      const batchSize = 10000;
      for (let i = 0; i < keysToDelete.length; i += batchSize) {
        const batch = keysToDelete.slice(i, i + batchSize);
        await cleanupClient.del(...batch);
      }
      
      const cleanupEndTime = Date.now();
      console.log(`✅ Cleanup completed in ${(cleanupEndTime - cleanupStartTime)}ms`);
      
      await cleanupClient.quit();
      
    } catch (error) {
      console.error('❌ Multi Worker test failed:', error.message);
    } finally {
      // Terminate all workers
      workers.forEach(worker => worker.terminate());
    }
  }
  
  // Run the test
  runWorkerTest().catch(console.error);
}