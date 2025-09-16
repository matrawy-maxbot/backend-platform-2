// تحميل متغيرات البيئة أولاً
import '../../../../config/index.js';

// Import Redis modules
import Redis from 'ioredis';
import { redisClient, UserCacheService } from '../index.js';
import { redis } from '../../../../config/database.config.js';

// Test Redis connection
async function testRedisConnection() {
  console.log('🔄 Starting Redis connection test...');
  
  try {
    // Test connection with bitnami/redis configuration
    const testClient = new Redis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
      db: redis.db,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
    
    // Test ping
    const pong = await testClient.ping();
    console.log('✅ Redis connection successful! Response:', pong);
    
    // Display connection information
    console.log(`📊 Connection Information:`);
    console.log(`   - Host: ${redis.host}`);
    console.log(`   - Port: ${redis.port}`);
    console.log(`   - Database: ${redis.db}`);
    console.log(`   - Status: Connected`);
    
    await testClient.quit();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error.message);
    return false;
  }
}

// Test basic Redis operations
async function testBasicOperations() {
  console.log('\n🔄 Starting basic Redis operations test...');
  
  try {
    const testClient = new Redis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
      db: redis.db
    });
    
    // Test SET operation
    await testClient.set('test:key', 'test_value', 'EX', 60);
    console.log('✅ SET operation successful');
    
    // Test GET operation
    const value = await testClient.get('test:key');
    console.log('✅ GET operation successful. Value:', value);
    
    // Test EXISTS operation
    const exists = await testClient.exists('test:key');
    console.log('✅ EXISTS operation successful. Key exists:', exists === 1);
    
    // Test TTL operation
    const ttl = await testClient.ttl('test:key');
    console.log('✅ TTL operation successful. TTL:', ttl, 'seconds');
    
    // Test DEL operation
    await testClient.del('test:key');
    console.log('✅ DEL operation successful');
    
    // Verify deletion
    const deletedValue = await testClient.get('test:key');
    if (deletedValue === null) {
      console.log('✅ Confirmed: Key deleted successfully');
    } else {
      throw new Error('Key still exists after deletion');
    }
    
    await testClient.quit();
    return true;
  } catch (error) {
    console.error('❌ Failed basic operations test:', error.message);
    return false;
  }
}

// Test UserCache service operations
async function testUserCacheOperations() {
  console.log('\n🔄 Starting UserCache service operations test...');
  
  try {
    // Create test user data
    const testUser = {
      id: `test_user_${Date.now()}`,
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    console.log('📝 Caching user data...');
    await UserCacheService.cacheUser(testUser.id, testUser, 300); // 5 minutes TTL
    console.log('✅ User cached successfully:', {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email
    });
    
    // Read cached user
    console.log('📖 Reading cached user...');
    const cachedUser = await UserCacheService.getCachedUser(testUser.id);
    console.log('✅ User retrieved from cache successfully:', {
      id: cachedUser.id,
      name: cachedUser.name,
      email: cachedUser.email
    });
    
    // Verify data integrity
    if (JSON.stringify(testUser) === JSON.stringify(cachedUser)) {
      console.log('✅ Data integrity verified: Original and cached data match');
    } else {
      throw new Error('Data integrity check failed');
    }
    
    // Remove cached user
    console.log('🗑️ Removing cached user...');
    await UserCacheService.removeCachedUser(testUser.id);
    console.log('✅ User removed from cache successfully!');
    
    // Verify removal
    const removedUser = await UserCacheService.getCachedUser(testUser.id);
    if (removedUser === null) {
      console.log('✅ Confirmed: User not found in cache after removal');
    } else {
      throw new Error('User still exists in cache after removal');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed UserCache operations test:', error.message);
    return false;
  }
}

// Test performance with multiple operations
async function testPerformance() {
  console.log('\n🔄 Starting Redis performance test...');
  
  try {
    const testClient = new Redis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
      db: redis.db
    });
    
    const startTime = Date.now();
    const operations = 100;
    const testData = [];
    
    // Perform multiple SET operations
    console.log(`📊 Performing ${operations} SET operations...`);
    for (let i = 0; i < operations; i++) {
      const key = `perf_test:${i}`;
      const value = {
        id: i,
        data: `test_data_${i}`,
        timestamp: Date.now()
      };
      await testClient.set(key, JSON.stringify(value), 'EX', 300);
      testData.push(key);
    }
    
    const setEndTime = Date.now();
    const setDuration = setEndTime - startTime;
    
    // Perform multiple GET operations
    console.log(`📊 Performing ${operations} GET operations...`);
    for (const key of testData) {
      await testClient.get(key);
    }
    
    const getEndTime = Date.now();
    const getDuration = getEndTime - setEndTime;
    const totalDuration = getEndTime - startTime;
    
    console.log(`✅ Performance test completed:`);
    console.log(`   - SET operations: ${operations} in ${setDuration}ms`);
    console.log(`   - GET operations: ${operations} in ${getDuration}ms`);
    console.log(`   - Total time: ${totalDuration}ms`);
    console.log(`   - Average SET time: ${(setDuration / operations).toFixed(2)}ms`);
    console.log(`   - Average GET time: ${(getDuration / operations).toFixed(2)}ms`);
    console.log(`   - Operations per second: ${((operations * 2) / (totalDuration / 1000)).toFixed(2)}`);
    
    // Clean up test data
    await testClient.del(...testData);
    console.log('🧹 Test data cleaned up');
    
    await testClient.quit();
    return true;
  } catch (error) {
    console.error('❌ Failed performance test:', error.message);
    return false;
  }
}

// Test high-load performance with massive operations
async function testHighLoadPerformance() {
  console.log('\n🚀 Starting Redis HIGH-LOAD performance test...');
  console.log('⚠️  This test will perform intensive operations - please wait...');
  
  try {
    // Create multiple Redis connections for parallel operations
    const connectionPool = [];
    const poolSize = 10; // عدد الاتصالات المتوازية
    
    for (let i = 0; i < poolSize; i++) {
      connectionPool.push(new Redis({
        host: redis.host,
        port: redis.port,
        password: redis.password,
        db: redis.db,
        maxRetriesPerRequest: 1,
        retryDelayOnFailover: 50,
        lazyConnect: true
      }));
    }
    
    console.log(`📊 Created ${poolSize} Redis connections for parallel testing`);
    
    // Test configurations
    const testConfigs = [
      { operations: 1000, description: '1K operations' },
      { operations: 10000, description: '10K operations' },
      { operations: 100000, description: '100K operations' },
      { operations: 500000, description: '500K operations' },
      { operations: 1000000, description: '1M operations' }
    ];
    
    const results = [];
    
    for (const config of testConfigs) {
      console.log(`\n🔥 Testing ${config.description}...`);
      
      const batchSize = Math.ceil(config.operations / poolSize);
      const testData = [];
      
      // === SET Operations Test ===
      console.log(`📝 Starting ${config.operations} SET operations...`);
      const setStartTime = process.hrtime.bigint();
      
      const setPromises = [];
      for (let poolIndex = 0; poolIndex < poolSize; poolIndex++) {
        const client = connectionPool[poolIndex];
        const startIdx = poolIndex * batchSize;
        const endIdx = Math.min(startIdx + batchSize, config.operations);
        
        const batchPromise = (async () => {
          const pipeline = client.pipeline();
          for (let i = startIdx; i < endIdx; i++) {
            const key = `highload_test:${i}`;
            const value = JSON.stringify({
              id: i,
              data: `high_load_data_${i}`,
              timestamp: Date.now(),
              randomData: Math.random().toString(36).substring(7)
            });
            pipeline.set(key, value, 'EX', 600); // 10 minutes TTL
            testData.push(key);
          }
          return pipeline.exec();
        })();
        
        setPromises.push(batchPromise);
      }
      
      await Promise.all(setPromises);
      const setEndTime = process.hrtime.bigint();
      const setDuration = Number(setEndTime - setStartTime) / 1000000; // Convert to milliseconds
      
      console.log(`✅ SET operations completed in ${setDuration.toFixed(2)}ms`);
      
      // === GET Operations Test ===
      console.log(`📖 Starting ${config.operations} GET operations...`);
      const getStartTime = process.hrtime.bigint();
      
      const getPromises = [];
      for (let poolIndex = 0; poolIndex < poolSize; poolIndex++) {
        const client = connectionPool[poolIndex];
        const startIdx = poolIndex * batchSize;
        const endIdx = Math.min(startIdx + batchSize, config.operations);
        
        const batchPromise = (async () => {
          const pipeline = client.pipeline();
          for (let i = startIdx; i < endIdx; i++) {
            const key = `highload_test:${i}`;
            pipeline.get(key);
          }
          return pipeline.exec();
        })();
        
        getPromises.push(batchPromise);
      }
      
      await Promise.all(getPromises);
      const getEndTime = process.hrtime.bigint();
      const getDuration = Number(getEndTime - getStartTime) / 1000000; // Convert to milliseconds
      
      console.log(`✅ GET operations completed in ${getDuration.toFixed(2)}ms`);
      
      // Calculate performance metrics
      const totalDuration = setDuration + getDuration;
      const setOpsPerSecond = (config.operations / (setDuration / 1000)).toFixed(0);
      const getOpsPerSecond = (config.operations / (getDuration / 1000)).toFixed(0);
      const totalOpsPerSecond = ((config.operations * 2) / (totalDuration / 1000)).toFixed(0);
      
      const result = {
        operations: config.operations,
        description: config.description,
        setDuration: setDuration.toFixed(2),
        getDuration: getDuration.toFixed(2),
        totalDuration: totalDuration.toFixed(2),
        setOpsPerSecond,
        getOpsPerSecond,
        totalOpsPerSecond,
        avgSetTime: (setDuration / config.operations).toFixed(4),
        avgGetTime: (getDuration / config.operations).toFixed(4)
      };
      
      results.push(result);
      
      console.log(`📊 ${config.description} Results:`);
      console.log(`   - SET: ${result.setDuration}ms (${setOpsPerSecond} ops/sec)`);
      console.log(`   - GET: ${result.getDuration}ms (${getOpsPerSecond} ops/sec)`);
      console.log(`   - Total: ${result.totalDuration}ms (${totalOpsPerSecond} ops/sec)`);
      console.log(`   - Avg SET time: ${result.avgSetTime}ms per operation`);
      console.log(`   - Avg GET time: ${result.avgGetTime}ms per operation`);
      
      // Clean up test data in batches
      console.log('🧹 Cleaning up test data...');
      const cleanupPromises = [];
      for (let poolIndex = 0; poolIndex < poolSize; poolIndex++) {
        const client = connectionPool[poolIndex];
        const startIdx = poolIndex * batchSize;
        const endIdx = Math.min(startIdx + batchSize, config.operations);
        
        const cleanupPromise = (async () => {
          const keysToDelete = [];
          for (let i = startIdx; i < endIdx; i++) {
            keysToDelete.push(`highload_test:${i}`);
          }
          if (keysToDelete.length > 0) {
            return client.del(...keysToDelete);
          }
        })();
        
        cleanupPromises.push(cleanupPromise);
      }
      
      await Promise.all(cleanupPromises);
      console.log('✅ Test data cleaned up successfully');
      
      // Add delay between tests to prevent overwhelming
      if (config.operations < 1000000) {
        console.log('⏳ Waiting 2 seconds before next test...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Display comprehensive results
    console.log('\n' + '='.repeat(80));
    console.log('📊 HIGH-LOAD PERFORMANCE TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    
    console.log('\n📈 Performance Comparison:');
    results.forEach(result => {
      console.log(`\n🔸 ${result.description}:`);
      console.log(`   SET Operations: ${result.setDuration}ms (${result.setOpsPerSecond} ops/sec)`);
      console.log(`   GET Operations: ${result.getDuration}ms (${result.getOpsPerSecond} ops/sec)`);
      console.log(`   Total Operations: ${result.totalDuration}ms (${result.totalOpsPerSecond} ops/sec)`);
      console.log(`   Average SET Time: ${result.avgSetTime}ms`);
      console.log(`   Average GET Time: ${result.avgGetTime}ms`);
    });
    
    // Find best performance
    const bestSetPerformance = results.reduce((best, current) => 
      parseInt(current.setOpsPerSecond) > parseInt(best.setOpsPerSecond) ? current : best
    );
    
    const bestGetPerformance = results.reduce((best, current) => 
      parseInt(current.getOpsPerSecond) > parseInt(best.getOpsPerSecond) ? current : best
    );
    
    console.log('\n🏆 Best Performance Results:');
    console.log(`   Best SET Performance: ${bestSetPerformance.setOpsPerSecond} ops/sec (${bestSetPerformance.description})`);
    console.log(`   Best GET Performance: ${bestGetPerformance.getOpsPerSecond} ops/sec (${bestGetPerformance.description})`);
    
    // Performance analysis for 1M operations
    const millionOpsResult = results.find(r => r.operations === 1000000);
    if (millionOpsResult) {
      console.log('\n🎯 1 Million Operations Analysis:');
      console.log(`   Time to SET 1M records: ${millionOpsResult.setDuration}ms (${(parseFloat(millionOpsResult.setDuration) / 1000).toFixed(2)} seconds)`);
      console.log(`   Time to GET 1M records: ${millionOpsResult.getDuration}ms (${(parseFloat(millionOpsResult.getDuration) / 1000).toFixed(2)} seconds)`);
      console.log(`   Total time for 2M operations: ${millionOpsResult.totalDuration}ms (${(parseFloat(millionOpsResult.totalDuration) / 1000).toFixed(2)} seconds)`);
      console.log(`   Throughput: ${millionOpsResult.totalOpsPerSecond} operations per second`);
    }
    
    // Close all connections
    await Promise.all(connectionPool.map(client => client.quit()));
    console.log('\n✅ All Redis connections closed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Failed high-load performance test:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Test Redis info and statistics
async function testRedisInfo() {
  console.log('\n🔄 Starting Redis info and statistics test...');
  
  try {
    const testClient = new Redis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
      db: redis.db
    });
    
    // Get Redis server info
    const info = await testClient.info('server');
    const memoryInfo = await testClient.info('memory');
    const statsInfo = await testClient.info('stats');
    
    console.log('📊 Redis Server Information:');
    
    // Parse server info
    const serverLines = info.split('\r\n').filter(line => line && !line.startsWith('#'));
    const serverInfo = {};
    serverLines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) serverInfo[key] = value;
    });
    
    console.log(`   - Redis Version: ${serverInfo.redis_version || 'Unknown'}`);
    console.log(`   - OS: ${serverInfo.os || 'Unknown'}`);
    console.log(`   - Uptime: ${serverInfo.uptime_in_seconds || 0} seconds`);
    
    // Parse memory info
    const memoryLines = memoryInfo.split('\r\n').filter(line => line && !line.startsWith('#'));
    const memInfo = {};
    memoryLines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) memInfo[key] = value;
    });
    
    console.log(`   - Used Memory: ${memInfo.used_memory_human || 'Unknown'}`);
    console.log(`   - Max Memory: ${memInfo.maxmemory_human || 'Not set'}`);
    
    // Get database info
    const dbSize = await testClient.dbsize();
    console.log(`   - Database Size: ${dbSize} keys`);
    
    await testClient.quit();
    return true;
  } catch (error) {
    console.error('❌ Failed Redis info test:', error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Redis comprehensive tests...');
  console.log('=' .repeat(50));
  
  const tests = [
    { name: 'Connection Test', func: testRedisConnection },
    { name: 'Basic Operations Test', func: testBasicOperations },
    { name: 'UserCache Operations Test', func: testUserCacheOperations },
    { name: 'Performance Test', func: testPerformance },
    { name: 'High-Load Performance Test', func: testHighLoadPerformance },
    { name: 'Redis Info Test', func: testRedisInfo }
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const test of tests) {
    console.log(`\n📋 ${test.name}:`);
    console.log('-'.repeat(30));
    
    try {
      const result = await test.func();
      if (result) {
        console.log(`✅ ${test.name} - Passed`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name} - Failed`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Failed with error:`, error.message);
      failedTests++;
    }
  }
  
  const totalTests = passedTests + failedTests;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Final Results:');
  console.log(`✅ Passed Tests: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed Tests: ${failedTests}/${totalTests}`);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Redis is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration.');
  }
}

// Run tests if this file is executed directly
const isMainModule = import.meta.url === new URL(process.argv[1], 'file:').href;

if (isMainModule || process.argv[1]?.includes('redis.test.js')) {
  runAllTests().catch(console.error);
}

export {
  testRedisConnection,
  testBasicOperations,
  testUserCacheOperations,
  testPerformance,
  testHighLoadPerformance,
  testRedisInfo,
  runAllTests
};