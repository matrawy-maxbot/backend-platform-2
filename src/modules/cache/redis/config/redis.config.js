import Redis from 'ioredis';
import { redis } from '../../../../config/database.config.js';
import { EventEmitter } from 'events';

class RedisQueueBatchManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    // إعدادات النظام
    this.batchInterval = options.batchInterval || 500; // 500ms for set & del operations
    this.getBatchInterval = options.getBatchInterval || 50; // 50ms for get operations
    this.maxBatchSize = options.maxBatchSize || 100000; // max of batch size for set & del operations
    this.getMaxBatchSize = options.getMaxBatchSize || 10000; // max of batch size for get operations
    this.enableMetrics = options.enableMetrics || true;
    
    // طوابير العمليات
    this.setQueue = [];
    this.getQueue = [];
    this.delQueue = [];
    
    // إحصائيات الأداء
    this.metrics = {
      totalSetOperations: 0,
      totalGetOperations: 0,
      totalDelOperations: 0,
      totalBatches: 0,
      averageBatchSize: 0,
      lastBatchTime: 0,
      totalProcessingTime: 0
    };
    
    // إنشاء اتصال Redis
    this.client = new Redis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
      db: redis.db,
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      lazyConnect: true
    });
    
    // بدء المعالج الدوري
    this.isRunning = false;
    this.processingInterval = null;
    this.startBatchProcessor();
    
    console.log(`🚀 Redis Queue Batch Manager initialized with ${this.batchInterval}ms interval for set & del operations`);
    console.log(`🚀 Redis Queue Batch Manager initialized with ${this.getBatchInterval}ms interval for get operations`);
  }
  
  /**
   * بدء المعالج الدوري للطوابير
   */
  startBatchProcessor() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.setDelProcessingInterval = setInterval(async () => {
      await this.processBatches(['set', 'del']);
    }, this.batchInterval);
    
    this.getProcessingInterval = setInterval(async () => {
      await this.processBatches(['get']);
    }, this.getBatchInterval);
    
    console.log(`⏰ Batch processor started with ${this.batchInterval}ms interval for set & del operations`);
    console.log(`⏰ Batch processor started with ${this.getBatchInterval}ms interval for get operations`);
  }
  
  /**
   * إيقاف المعالج الدوري
   */
  stopBatchProcessor() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.setDelProcessingInterval) {
      clearInterval(this.setDelProcessingInterval);
      this.setDelProcessingInterval = null;
    }
    if (this.getProcessingInterval) {
      clearInterval(this.getProcessingInterval);
      this.getProcessingInterval = null;
    }
    
    console.log('⏹️ Batch processor stopped');
  }
  
  /**
   * إضافة عملية SET إلى الطابور
   */
  queueSet(key, value, ttl = 3600) {
    return new Promise((resolve, reject) => {
      this.setQueue.push({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        ttl,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this.metrics.totalSetOperations++;
      
      // إذا وصل الطابور للحد الأقصى، نفذ فوراً
      if (this.setQueue.length >= this.maxBatchSize) {
        this.processBatches(['set']);
      }
    });
  }
  
  /**
   * إضافة عملية GET إلى الطابور
   */
  queueGet(key) {
    return new Promise((resolve, reject) => {
      this.getQueue.push({
        key,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this.metrics.totalGetOperations++;
      
      // إذا وصل الطابور للحد الأقصى، نفذ فوراً
      if (this.getQueue.length >= this.getMaxBatchSize) {
        this.processBatches(['get']);
      }
    });
  }
  
  /**
   * إضافة عملية DELETE إلى الطابور
   */
  queueDel(key) {
    return new Promise((resolve, reject) => {
      this.delQueue.push({
        key,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this.metrics.totalDelOperations++;
      
      // إذا وصل الطابور للحد الأقصى، نفذ فوراً
      if (this.delQueue.length >= this.maxBatchSize) {
        this.processBatches(['del']);
      }
    });
  }
  
  /**
   * معالجة جميع الطوابير
   */
  async processBatches(operations = ['set', 'del', 'get']) {
    if (!this.isRunning) return;
    
    const startTime = process.hrtime.bigint();
    let totalOperations = 0;
    
    try {
      // معالجة طابور SET
      if (this.setQueue.length > 0 && operations.includes('set')) {
        await this.processSetBatch();
        totalOperations += this.setQueue.length;
      }
      
      // معالجة طابور GET
      if (this.getQueue.length > 0 && operations.includes('get')) {
        await this.processGetBatch();
        totalOperations += this.getQueue.length;
      }
      
      // معالجة طابور DELETE
      if (this.delQueue.length > 0 && operations.includes('del')) {
        await this.processDelBatch();
        totalOperations += this.delQueue.length;
      }
      
      // تحديث الإحصائيات
      if (totalOperations > 0) {
        const endTime = process.hrtime.bigint();
        const processingTime = Number(endTime - startTime) / 1000000; // تحويل إلى ميلي ثانية
        
        this.updateMetrics(totalOperations, processingTime);
        this.emit('batchProcessed', {
          operations: totalOperations,
          processingTime,
          timestamp: Date.now()
        });
      }
      
    } catch (error) {
      console.error('❌ Error processing batches:', error.message);
      this.emit('error', error);
    }
  }
  
  /**
   * معالجة دفعة عمليات SET
   */
  async processSetBatch() {
    if (this.setQueue.length === 0) return;
    
    const batch = this.setQueue.splice(0); // أخذ جميع العمليات
    const pipeline = this.client.pipeline();
    
    // إضافة العمليات إلى pipeline
    batch.forEach(operation => {
      pipeline.set(operation.key, operation.value, 'EX', operation.ttl);
    });
    
    try {
      const results = await pipeline.exec();
      
      // معالجة النتائج
      results.forEach((result, index) => {
        const operation = batch[index];
        if (result[0] === null) {
          operation.resolve('OK');
        } else {
          operation.reject(new Error(result[0].message));
        }
      });
      
      // console.log(`✅ Processed ${batch.length} SET operations`);
      
    } catch (error) {
      // في حالة فشل الدفعة كاملة
      batch.forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
  }
  
  /**
   * معالجة دفعة عمليات GET
   */
  async processGetBatch() {
    if (this.getQueue.length === 0) return;
    
    const batch = this.getQueue.splice(0); // أخذ جميع العمليات
    const pipeline = this.client.pipeline();
    
    // إضافة العمليات إلى pipeline
    batch.forEach(operation => {
      pipeline.get(operation.key);
    });
    
    try {
      const results = await pipeline.exec();
      
      // معالجة النتائج
      results.forEach((result, index) => {
        const operation = batch[index];
        if (result[0] === null) {
          let value = result[1];
          // محاولة تحويل JSON إذا كان ممكناً
          try {
            value = JSON.parse(value);
          } catch (e) {
            // إبقاء القيمة كما هي إذا لم تكن JSON
          }
          operation.resolve(value);
        } else {
          operation.reject(new Error(result[0].message));
        }
      });
      
      // console.log(`✅ Processed ${batch.length} GET operations`);
      
    } catch (error) {
      // في حالة فشل الدفعة كاملة
      batch.forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
  }
  
  /**
   * معالجة دفعة عمليات DELETE
   */
  async processDelBatch() {
    if (this.delQueue.length === 0) return;
    
    const batch = this.delQueue.splice(0); // أخذ جميع العمليات
    const keys = batch.map(op => op.key);
    
    try {
      const result = await this.client.del(...keys);
      
      // جميع العمليات نجحت
      batch.forEach(operation => {
        operation.resolve(result);
      });
      
      // console.log(`✅ Processed ${batch.length} DELETE operations`);
      
    } catch (error) {
      // في حالة فشل الدفعة كاملة
      batch.forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
  }
  
  /**
   * تحديث إحصائيات الأداء
   */
  updateMetrics(operationsCount, processingTime) {
    this.metrics.totalBatches++;
    this.metrics.lastBatchTime = processingTime;
    this.metrics.totalProcessingTime += processingTime;
    
    // حساب متوسط حجم الدفعة
    const totalOps = this.metrics.totalSetOperations + 
                    this.metrics.totalGetOperations + 
                    this.metrics.totalDelOperations;
    this.metrics.averageBatchSize = totalOps / this.metrics.totalBatches;
  }
  
  /**
   * الحصول على إحصائيات الأداء
   */
  getMetrics() {
    return {
      ...this.metrics,
      queueSizes: {
        setQueue: this.setQueue.length,
        getQueue: this.getQueue.length,
        delQueue: this.delQueue.length
      },
      averageProcessingTime: this.metrics.totalProcessingTime / this.metrics.totalBatches || 0,
      operationsPerSecond: {
        set: (this.metrics.totalSetOperations / (this.metrics.totalProcessingTime / 1000)) || 0,
        get: (this.metrics.totalGetOperations / (this.metrics.totalProcessingTime / 1000)) || 0,
        del: (this.metrics.totalDelOperations / (this.metrics.totalProcessingTime / 1000)) || 0
      }
    };
  }
  
  /**
   * إغلاق النظام وتنظيف الموارد
   */
  async shutdown() {
    console.log('🔄 Shutting down Redis Queue Batch Manager...');
    
    // إيقاف المعالج الدوري
    this.stopBatchProcessor();
    
    // معالجة العمليات المتبقية
    if (this.setQueue.length > 0 || this.getQueue.length > 0 || this.delQueue.length > 0) {
      console.log('🔄 Processing remaining operations...');
      await this.processBatches();
    }
    
    // إغلاق اتصال Redis
    await this.client.quit();
    
    console.log('✅ Redis Queue Batch Manager shutdown complete');
  }
}

console.log('🚀 Starting Redis Queue Batch System Test');
console.log('=' .repeat(60));

export default RedisQueueBatchManager;

/*
try {

  // set example 
  const promise = await queueManager.queueSet(
    `test_key_${i}`,
    {
      id: i,
      data: `test_data_${i}`,
      timestamp: Date.now(),
      random: Math.random()
    },
    300 // 5 minutes TTL
  );

  // get example
  const value = await queueManager.queueGet(`test_key_${i}`);

  // del example
  const promise = await queueManager.queueDel(`test_key_${i}`);

} catch (error) {

  console.error('❌ Test failed:', error.message);

} finally {

  // close connection
  await queueManager.shutdown();

}
*/