// تحميل متغيرات البيئة أولاً
import '../../../../config/index.js';

import Redis from 'ioredis';
import { RedisPoolManager } from '../config/redis.config.js';
import { redis } from '../../../../config/database.config.js';

/**
 * اختبار مقارنة الأداء بين RedisPoolManager والإعداد التقليدي
 * Performance Comparison Test between RedisPoolManager and Traditional Setup
 */
class RedisPerformanceComparison {
  constructor() {
    this.results = {
      poolManager: {},
      traditional: {},
      comparison: {}
    };
    
    // إعداد Redis التقليدي للمقارنة
    this.traditionalClient = new Redis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
      db: redis.db,
      maxRetriesPerRequest: 1,
      retryDelayOnFailover: 50,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 10000,
    });
    
    // إعداد Pool Manager الجديد
    this.poolManager = new RedisPoolManager({
      poolSize: 20, // حجم مجموعة محسّن
      enableAutoPipelining: true,
      connectTimeout: 5000,
      commandTimeout: 5000
    });
    
    this.testSizes = [1000, 10000, 100000, 500000, 1000000];
  }
  
  /**
   * تشغيل جميع اختبارات المقارنة
   */
  async runAllTests() {
    console.log('🚀 بدء اختبارات مقارنة الأداء - Starting Performance Comparison Tests');
    console.log('=' .repeat(80));
    
    try {
      // انتظار تهيئة الاتصالات
      await this.waitForConnections();
      
      // تشغيل اختبارات SET
      await this.runSetTests();
      
      // تشغيل اختبارات GET
      await this.runGetTests();
      
      // تشغيل اختبارات Pipeline
      await this.runPipelineTests();
      
      // تشغيل اختبارات الضغط العالي
      await this.runHighLoadTests();
      
      // عرض النتائج النهائية
      this.displayFinalResults();
      
    } catch (error) {
      console.error('❌ خطأ في اختبارات المقارنة:', error);
    } finally {
      await this.cleanup();
    }
  }
  
  /**
   * انتظار تهيئة الاتصالات
   */
  async waitForConnections() {
    console.log('⏳ انتظار تهيئة الاتصالات...');
    
    // انتظار الاتصال التقليدي
    await this.traditionalClient.ping();
    
    // انتظار Pool Manager
    await new Promise(resolve => {
      const checkReady = () => {
        const stats = this.poolManager.getStats();
        if (stats.healthyConnections > 0) {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
    
    console.log('✅ جميع الاتصالات جاهزة');
  }
  
  /**
   * اختبارات عمليات SET
   */
  async runSetTests() {
    console.log('\n📝 اختبارات عمليات SET - SET Operations Tests');
    console.log('-'.repeat(60));
    
    for (const size of this.testSizes) {
      console.log(`\n🔄 اختبار ${size.toLocaleString()} عملية SET...`);
      
      // اختبار Pool Manager
      const poolResult = await this.testSetOperations(size, 'pool');
      this.results.poolManager[`set_${size}`] = poolResult;
      
      // اختبار Traditional
      const traditionalResult = await this.testSetOperations(size, 'traditional');
      this.results.traditional[`set_${size}`] = traditionalResult;
      
      // حساب التحسن
      const improvement = this.calculateImprovement(traditionalResult, poolResult);
      this.results.comparison[`set_${size}`] = improvement;
      
      this.displayTestResult('SET', size, poolResult, traditionalResult, improvement);
    }
  }
  
  /**
   * اختبارات عمليات GET
   */
  async runGetTests() {
    console.log('\n📖 اختبارات عمليات GET - GET Operations Tests');
    console.log('-'.repeat(60));
    
    // تحضير البيانات للاختبار
    await this.prepareTestData();
    
    for (const size of this.testSizes) {
      console.log(`\n🔄 اختبار ${size.toLocaleString()} عملية GET...`);
      
      // اختبار Pool Manager
      const poolResult = await this.testGetOperations(size, 'pool');
      this.results.poolManager[`get_${size}`] = poolResult;
      
      // اختبار Traditional
      const traditionalResult = await this.testGetOperations(size, 'traditional');
      this.results.traditional[`get_${size}`] = traditionalResult;
      
      // حساب التحسن
      const improvement = this.calculateImprovement(traditionalResult, poolResult);
      this.results.comparison[`get_${size}`] = improvement;
      
      this.displayTestResult('GET', size, poolResult, traditionalResult, improvement);
    }
  }
  
  /**
   * اختبارات Pipeline
   */
  async runPipelineTests() {
    console.log('\n🔗 اختبارات Pipeline - Pipeline Tests');
    console.log('-'.repeat(60));
    
    const pipelineSizes = [1000, 10000, 50000];
    
    for (const size of pipelineSizes) {
      console.log(`\n🔄 اختبار Pipeline ${size.toLocaleString()} عملية...`);
      
      // اختبار Pool Manager Pipeline
      const poolResult = await this.testPipelineOperations(size, 'pool');
      this.results.poolManager[`pipeline_${size}`] = poolResult;
      
      // اختبار Traditional Pipeline
      const traditionalResult = await this.testPipelineOperations(size, 'traditional');
      this.results.traditional[`pipeline_${size}`] = traditionalResult;
      
      // حساب التحسن
      const improvement = this.calculateImprovement(traditionalResult, poolResult);
      this.results.comparison[`pipeline_${size}`] = improvement;
      
      this.displayTestResult('PIPELINE', size, poolResult, traditionalResult, improvement);
    }
  }
  
  /**
   * اختبارات الضغط العالي
   */
  async runHighLoadTests() {
    console.log('\n⚡ اختبارات الضغط العالي - High Load Tests');
    console.log('-'.repeat(60));
    
    const concurrentUsers = [10, 50, 100];
    const operationsPerUser = 1000;
    
    for (const users of concurrentUsers) {
      console.log(`\n🔄 اختبار ${users} مستخدم متزامن، ${operationsPerUser} عملية لكل مستخدم...`);
      
      // اختبار Pool Manager
      const poolResult = await this.testConcurrentOperations(users, operationsPerUser, 'pool');
      this.results.poolManager[`concurrent_${users}`] = poolResult;
      
      // اختبار Traditional
      const traditionalResult = await this.testConcurrentOperations(users, operationsPerUser, 'traditional');
      this.results.traditional[`concurrent_${users}`] = traditionalResult;
      
      // حساب التحسن
      const improvement = this.calculateImprovement(traditionalResult, poolResult);
      this.results.comparison[`concurrent_${users}`] = improvement;
      
      this.displayTestResult('CONCURRENT', users * operationsPerUser, poolResult, traditionalResult, improvement);
    }
  }
  
  /**
   * تنفيذ اختبار عمليات SET
   */
  async testSetOperations(count, type) {
    const startTime = process.hrtime.bigint();
    const client = type === 'pool' ? this.poolManager : this.traditionalClient;
    
    const promises = [];
    const batchSize = 1000;
    
    for (let i = 0; i < count; i += batchSize) {
      const batch = Math.min(batchSize, count - i);
      
      const batchPromise = (async () => {
        const batchPromises = [];
        for (let j = 0; j < batch; j++) {
          const key = `test:set:${type}:${i + j}`;
          const value = `value_${i + j}_${Date.now()}`;
          
          if (type === 'pool') {
            batchPromises.push(client.set(key, value));
          } else {
            batchPromises.push(client.set(key, value));
          }
        }
        return Promise.all(batchPromises);
      })();
      
      promises.push(batchPromise);
    }
    
    await Promise.all(promises);
    
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // milliseconds
    
    return {
      operations: count,
      duration: duration,
      opsPerSecond: Math.round((count / duration) * 1000),
      avgTimePerOp: duration / count,
      type: type
    };
  }
  
  /**
   * تنفيذ اختبار عمليات GET
   */
  async testGetOperations(count, type) {
    const startTime = process.hrtime.bigint();
    const client = type === 'pool' ? this.poolManager : this.traditionalClient;
    
    const promises = [];
    const batchSize = 1000;
    
    for (let i = 0; i < count; i += batchSize) {
      const batch = Math.min(batchSize, count - i);
      
      const batchPromise = (async () => {
        const batchPromises = [];
        for (let j = 0; j < batch; j++) {
          const key = `test:data:${(i + j) % 100000}`; // استخدام البيانات المحضرة
          
          if (type === 'pool') {
            batchPromises.push(client.get(key));
          } else {
            batchPromises.push(client.get(key));
          }
        }
        return Promise.all(batchPromises);
      })();
      
      promises.push(batchPromise);
    }
    
    await Promise.all(promises);
    
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // milliseconds
    
    return {
      operations: count,
      duration: duration,
      opsPerSecond: Math.round((count / duration) * 1000),
      avgTimePerOp: duration / count,
      type: type
    };
  }
  
  /**
   * تنفيذ اختبار عمليات Pipeline
   */
  async testPipelineOperations(count, type) {
    const startTime = process.hrtime.bigint();
    
    if (type === 'pool') {
      // استخدام Pipeline المحسّن في Pool Manager
      const commands = [];
      for (let i = 0; i < count; i++) {
        commands.push({
          command: 'set',
          args: [`test:pipeline:pool:${i}`, `value_${i}`]
        });
      }
      
      await this.poolManager.executePipeline(commands);
    } else {
      // استخدام Pipeline التقليدي
      const pipeline = this.traditionalClient.pipeline();
      
      for (let i = 0; i < count; i++) {
        pipeline.set(`test:pipeline:traditional:${i}`, `value_${i}`);
      }
      
      await pipeline.exec();
    }
    
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // milliseconds
    
    return {
      operations: count,
      duration: duration,
      opsPerSecond: Math.round((count / duration) * 1000),
      avgTimePerOp: duration / count,
      type: type
    };
  }
  
  /**
   * تنفيذ اختبار العمليات المتزامنة
   */
  async testConcurrentOperations(users, operationsPerUser, type) {
    const startTime = process.hrtime.bigint();
    const totalOperations = users * operationsPerUser;
    
    const userPromises = [];
    
    for (let user = 0; user < users; user++) {
      const userPromise = (async () => {
        const client = type === 'pool' ? this.poolManager : this.traditionalClient;
        const operations = [];
        
        for (let op = 0; op < operationsPerUser; op++) {
          const key = `test:concurrent:${type}:${user}:${op}`;
          const value = `user_${user}_op_${op}`;
          
          if (type === 'pool') {
            operations.push(client.set(key, value));
          } else {
            operations.push(client.set(key, value));
          }
        }
        
        return Promise.all(operations);
      })();
      
      userPromises.push(userPromise);
    }
    
    await Promise.all(userPromises);
    
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // milliseconds
    
    return {
      operations: totalOperations,
      duration: duration,
      opsPerSecond: Math.round((totalOperations / duration) * 1000),
      avgTimePerOp: duration / totalOperations,
      concurrentUsers: users,
      type: type
    };
  }
  
  /**
   * تحضير البيانات للاختبار
   */
  async prepareTestData() {
    console.log('📋 تحضير البيانات للاختبار...');
    
    const commands = [];
    for (let i = 0; i < 100000; i++) {
      commands.push({
        command: 'set',
        args: [`test:data:${i}`, `prepared_value_${i}_${Date.now()}`]
      });
    }
    
    await this.poolManager.executePipeline(commands);
    console.log('✅ تم تحضير 100,000 مفتاح للاختبار');
  }
  
  /**
   * حساب نسبة التحسن
   */
  calculateImprovement(traditional, pool) {
    const speedImprovement = ((pool.opsPerSecond - traditional.opsPerSecond) / traditional.opsPerSecond) * 100;
    const timeImprovement = ((traditional.duration - pool.duration) / traditional.duration) * 100;
    
    return {
      speedImprovement: Math.round(speedImprovement * 100) / 100,
      timeImprovement: Math.round(timeImprovement * 100) / 100,
      poolFaster: pool.opsPerSecond > traditional.opsPerSecond
    };
  }
  
  /**
   * عرض نتيجة اختبار واحد
   */
  displayTestResult(operation, size, poolResult, traditionalResult, improvement) {
    console.log(`\n📊 نتائج ${operation} - ${size.toLocaleString()} عملية:`);
    console.log(`   Pool Manager:   ${poolResult.opsPerSecond.toLocaleString()} ops/sec (${poolResult.duration.toFixed(2)}ms)`);
    console.log(`   Traditional:    ${traditionalResult.opsPerSecond.toLocaleString()} ops/sec (${traditionalResult.duration.toFixed(2)}ms)`);
    
    if (improvement.poolFaster) {
      console.log(`   🚀 تحسن السرعة:   +${improvement.speedImprovement}%`);
      console.log(`   ⚡ تحسن الوقت:    -${improvement.timeImprovement}%`);
    } else {
      console.log(`   📉 انخفاض السرعة: ${improvement.speedImprovement}%`);
      console.log(`   🐌 زيادة الوقت:   +${Math.abs(improvement.timeImprovement)}%`);
    }
  }
  
  /**
   * عرض النتائج النهائية
   */
  displayFinalResults() {
    console.log('\n' + '='.repeat(80));
    console.log('📈 ملخص النتائج النهائية - Final Results Summary');
    console.log('='.repeat(80));
    
    // حساب المتوسطات
    const poolStats = this.poolManager.getStats();
    
    console.log('\n🏆 إحصائيات Pool Manager:');
    console.log(`   إجمالي الاتصالات:     ${poolStats.totalConnections}`);
    console.log(`   الاتصالات الصحية:     ${poolStats.healthyConnections}`);
    console.log(`   إجمالي الأوامر:       ${poolStats.totalCommands.toLocaleString()}`);
    console.log(`   معدل النجاح:          ${poolStats.successRate}`);
    console.log(`   متوسط وقت الاستجابة:  ${poolStats.averageResponseTime.toFixed(2)}ms`);
    
    // عرض أفضل التحسينات
    console.log('\n🎯 أفضل التحسينات:');
    let bestImprovement = { operation: '', improvement: 0 };
    
    Object.entries(this.results.comparison).forEach(([key, value]) => {
      if (value.speedImprovement > bestImprovement.improvement) {
        bestImprovement = { operation: key, improvement: value.speedImprovement };
      }
      
      console.log(`   ${key}: +${value.speedImprovement}% سرعة، -${value.timeImprovement}% وقت`);
    });
    
    console.log(`\n🥇 أفضل تحسن: ${bestImprovement.operation} بنسبة +${bestImprovement.improvement}%`);
    
    // توصيات الأداء
    console.log('\n💡 توصيات الأداء:');
    if (poolStats.healthyConnections < poolStats.totalConnections) {
      console.log('   ⚠️  يوجد اتصالات غير صحية، يُنصح بمراجعة إعدادات الشبكة');
    }
    
    if (poolStats.averageResponseTime > 10) {
      console.log('   ⚠️  متوسط وقت الاستجابة مرتفع، يُنصح بزيادة حجم المجموعة');
    }
    
    if (poolStats.successRate !== '100.00%') {
      console.log('   ⚠️  معدل النجاح أقل من 100%، يُنصح بمراجعة معالجة الأخطاء');
    }
    
    console.log('\n✅ اكتملت جميع اختبارات المقارنة بنجاح!');
  }
  
  /**
   * تنظيف الموارد
   */
  async cleanup() {
    console.log('\n🧹 تنظيف الموارد...');
    
    try {
      // حذف مفاتيح الاختبار
      const testKeys = await this.traditionalClient.keys('test:*');
      if (testKeys.length > 0) {
        await this.traditionalClient.del(...testKeys);
        console.log(`🗑️  تم حذف ${testKeys.length.toLocaleString()} مفتاح اختبار`);
      }
      
      // إغلاق الاتصالات
      await this.traditionalClient.quit();
      await this.poolManager.shutdown();
      
      console.log('✅ تم تنظيف جميع الموارد');
    } catch (error) {
      console.error('❌ خطأ في تنظيف الموارد:', error.message);
    }
  }
}

/**
 * تشغيل اختبارات المقارنة
 */
async function runPerformanceComparison() {
  const comparison = new RedisPerformanceComparison();
  await comparison.runAllTests();
}

// تشغيل الاختبارات إذا تم استدعاء الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceComparison().catch(console.error);
}

export { RedisPerformanceComparison, runPerformanceComparison };
export default runPerformanceComparison;