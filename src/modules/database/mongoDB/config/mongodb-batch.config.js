import mongoose from 'mongoose';
import { EventEmitter } from 'events';

class MongoDBQueueBatchManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    // إعدادات النظام
    this.batchInterval = options.batchInterval || 1000; // 1000ms for insert, update, delete operations
    this.selectBatchInterval = options.selectBatchInterval || 100; // 100ms for select operations
    this.maxBatchSize = options.maxBatchSize || 10000; // max batch size for insert, update, delete
    this.selectMaxBatchSize = options.selectMaxBatchSize || 5000; // max batch size for select
    this.enableMetrics = options.enableMetrics || true;
    
    // طوابير العمليات
    this.insertQueue = [];
    this.updateQueue = [];
    this.selectQueue = [];
    this.deleteQueue = [];
    
    // إحصائيات الأداء
    this.metrics = {
      totalInsertOperations: 0,
      totalUpdateOperations: 0,
      totalSelectOperations: 0,
      totalDeleteOperations: 0,
      totalBatches: 0,
      insertBatches: 0,
      updateBatches: 0,
      selectBatches: 0,
      deleteBatches: 0,
      averageBatchSize: 0,
      lastBatchTime: 0,
      totalProcessingTime: 0,
      avgInsertBatchTime: 0,
      avgUpdateBatchTime: 0,
      avgSelectBatchTime: 0,
      avgDeleteBatchTime: 0
    };
    
    // بدء المعالج الدوري
    this.isRunning = false;
    this.startBatchProcessor();
    
    console.log(`🚀 MongoDB Queue Batch Manager initialized with ${this.batchInterval}ms interval for insert, update, delete operations`);
    console.log(`🚀 MongoDB Queue Batch Manager initialized with ${this.selectBatchInterval}ms interval for select operations`);
  }
  
  /**
   * التحقق من جاهزية الاتصال بقاعدة البيانات
   */
  async waitForDatabaseConnection(maxWaitTime = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Database connection timeout');
  }
  
  /**
   * بدء المعالج الدوري للطوابير
   */
  startBatchProcessor() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // معالج للعمليات الكتابة (Insert, Update, Delete)
    this.writeProcessingInterval = setInterval(async () => {
      try {
        await this.waitForDatabaseConnection(5000);
        await this.processBatches(['insert', 'update', 'delete']);
      } catch (error) {
        console.warn('⚠️ Skipping batch processing - database not ready:', error.message);
      }
    }, this.batchInterval);
    
    // معالج منفصل لعمليات القراءة (Select)
    this.readProcessingInterval = setInterval(async () => {
      try {
        await this.waitForDatabaseConnection(5000);
        await this.processBatches(['select']);
      } catch (error) {
        console.warn('⚠️ Skipping select batch processing - database not ready:', error.message);
      }
    }, this.selectBatchInterval);
    
    console.log(`⏰ Batch processor started with ${this.batchInterval}ms interval for write operations`);
    console.log(`⏰ Batch processor started with ${this.selectBatchInterval}ms interval for read operations`);
  }
  
  /**
   * إيقاف المعالج الدوري
   */
  stopBatchProcessor() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    if (this.writeProcessingInterval) {
      clearInterval(this.writeProcessingInterval);
      this.writeProcessingInterval = null;
    }
    
    if (this.readProcessingInterval) {
      clearInterval(this.readProcessingInterval);
      this.readProcessingInterval = null;
    }
    
    console.log('⏹️ Batch processor stopped');
  }
  
  /**
   * إضافة عملية INSERT إلى الطابور
   */
  queueInsert(collection, document) {
    return new Promise((resolve, reject) => {
      // استخراج اسم المجموعة من نموذج Mongoose
      const collectionName = typeof collection === 'string' ? collection : collection.collection.name;
      
      this.insertQueue.push({
        collection: collectionName,
        document,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this.metrics.totalInsertOperations++;
      
      // إذا وصل الطابور للحد الأقصى، نفذ فوراً
      if (this.insertQueue.length >= this.maxBatchSize) {
        this.processBatches(['insert']);
      }
    });
  }
  
  /**
   * إضافة عملية UPDATE إلى الطابور
   */
  queueUpdate(collection, filter, update, options = {}) {
    return new Promise((resolve, reject) => {
      // استخراج اسم المجموعة من نموذج Mongoose
      const collectionName = typeof collection === 'string' ? collection : collection.collection.name;
      
      this.updateQueue.push({
        collection: collectionName,
        filter,
        update,
        options,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this.metrics.totalUpdateOperations++;
      
      // إذا وصل الطابور للحد الأقصى، نفذ فوراً
      if (this.updateQueue.length >= this.maxBatchSize) {
        this.processBatches(['update']);
      }
    });
  }
  
  /**
   * إضافة عملية SELECT إلى الطابور
   */
  queueSelect(collection, filter = {}, options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        // التحقق من صحة المعاملات
        if (!collection) {
          reject(new Error('Collection parameter is required'));
          return;
        }
        
        // استخراج اسم المجموعة من نموذج Mongoose
        const collectionName = typeof collection === 'string' ? collection : 
          (collection.collection ? collection.collection.name : null);
        
        if (!collectionName) {
          reject(new Error('Unable to determine collection name'));
          return;
        }
        
        // انتظار الاتصال بقاعدة البيانات إذا لم يكن جاهزاً
        try {
          await this.waitForDatabaseConnection(10000); // انتظار حتى 10 ثوانٍ
        } catch (connectionError) {
          reject(new Error('Database connection timeout: ' + connectionError.message));
          return;
        }
        
        this.selectQueue.push({
          collection: collectionName,
          filter,
          options,
          resolve,
          reject,
          timestamp: Date.now()
        });
        
        this.metrics.totalSelectOperations++;
        
        // إذا وصل الطابور للحد الأقصى، نفذ فوراً
        if (this.selectQueue.length >= this.selectMaxBatchSize) {
          // استخدام setImmediate لتجنب الحلقات اللانهائية
          setImmediate(async () => {
            try {
              await this.processBatches(['select']);
            } catch (error) {
              console.error('Error processing immediate batch:', error.message);
            }
          });
        }
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * إضافة عملية DELETE إلى الطابور
   */
  queueDelete(collection, filter) {
    return new Promise((resolve, reject) => {
      // استخراج اسم المجموعة من نموذج Mongoose
      const collectionName = typeof collection === 'string' ? collection : collection.collection.name;
      
      this.deleteQueue.push({
        collection: collectionName,
        filter,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this.metrics.totalDeleteOperations++;
      
      // إذا وصل الطابور للحد الأقصى، نفذ فوراً
      if (this.deleteQueue.length >= this.maxBatchSize) {
        this.processBatches(['delete']);
      }
    });
  }
  
  /**
   * معالجة جميع الطوابير
   */
  async processBatches(operations = ['insert', 'update', 'select', 'delete']) {
    if (!this.isRunning) return;
    
    const startTime = process.hrtime.bigint();
    let totalOperations = 0;
    
    try {
      // معالجة طابور INSERT
      if (this.insertQueue.length > 0 && operations.includes('insert')) {
        const batchSize = this.insertQueue.length;
        await this.processInsertBatch();
        totalOperations += batchSize;
      }
      
      // معالجة طابور UPDATE
      if (this.updateQueue.length > 0 && operations.includes('update')) {
        const batchSize = this.updateQueue.length;
        await this.processUpdateBatch();
        totalOperations += batchSize;
      }
      
      // معالجة طابور SELECT
      if (this.selectQueue.length > 0 && operations.includes('select')) {
        const batchSize = this.selectQueue.length;
        await this.processSelectBatch();
        totalOperations += batchSize;
      }
      
      // معالجة طابور DELETE
      if (this.deleteQueue.length > 0 && operations.includes('delete')) {
        const batchSize = this.deleteQueue.length;
        await this.processDeleteBatch();
        totalOperations += batchSize;
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
   * معالجة دفعة عمليات INSERT
   */
  async processInsertBatch() {
    if (this.insertQueue.length === 0) return;
    
    const batch = this.insertQueue.splice(0); // أخذ جميع العمليات
    
    // تجميع العمليات حسب المجموعة (Collection)
    const collectionGroups = {};
    batch.forEach(operation => {
      if (!collectionGroups[operation.collection]) {
        collectionGroups[operation.collection] = [];
      }
      collectionGroups[operation.collection].push(operation);
    });
    
    try {
      // معالجة كل مجموعة على حدة
      for (const [collectionName, operations] of Object.entries(collectionGroups)) {
        const documents = operations.map(op => op.document);
        
        try {
          const result = await mongoose.connection.db.collection(collectionName).insertMany(documents, {
            ordered: false // السماح بالمتابعة حتى لو فشل بعض المستندات
          });
          
          // إرجاع النتائج للعمليات الناجحة
          operations.forEach((operation, index) => {
            if (result.insertedIds[index]) {
              operation.resolve({
                insertedId: result.insertedIds[index],
                acknowledged: result.acknowledged
              });
            } else {
              operation.reject(new Error('Insert operation failed'));
            }
          });
          
        } catch (error) {
          // في حالة فشل المجموعة كاملة
          operations.forEach(operation => {
            operation.reject(error);
          });
        }
      }
      
      // console.log(`✅ Processed ${batch.length} INSERT operations`);
      
    } catch (error) {
      // في حالة فشل عام
      batch.forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
  }
  
  /**
   * معالجة دفعة عمليات UPDATE
   */
  async processUpdateBatch() {
    if (this.updateQueue.length === 0) return;
    
    const batch = this.updateQueue.splice(0); // أخذ جميع العمليات
    
    // تجميع العمليات حسب المجموعة (Collection)
    const collectionGroups = {};
    batch.forEach(operation => {
      if (!collectionGroups[operation.collection]) {
        collectionGroups[operation.collection] = [];
      }
      collectionGroups[operation.collection].push(operation);
    });
    
    try {
      // معالجة كل مجموعة على حدة
      for (const [collectionName, operations] of Object.entries(collectionGroups)) {
        const bulkOps = operations.map(op => {
          // التأكد من أن التحديث يستخدم عوامل MongoDB الصحيحة
          let updateDoc = op.update;
          if (updateDoc && typeof updateDoc === 'object' && !updateDoc.$set && !updateDoc.$unset && !updateDoc.$inc && !updateDoc.$push && !updateDoc.$pull) {
            // إذا لم يكن التحديث يحتوي على عوامل MongoDB، نضعه في $set
            updateDoc = { $set: updateDoc };
          }
          
          return {
            updateOne: {
              filter: op.filter,
              update: updateDoc,
              ...op.options
            }
          };
        });
        
        try {
          const result = await mongoose.connection.db.collection(collectionName).bulkWrite(bulkOps, {
            ordered: false
          });
          
          // إرجاع النتائج للعمليات
          operations.forEach((operation, index) => {
            operation.resolve({
              matchedCount: result.matchedCount,
              modifiedCount: result.modifiedCount,
              acknowledged: result.acknowledged
            });
          });
          
        } catch (error) {
          operations.forEach(operation => {
            operation.reject(error);
          });
        }
      }
      
      // console.log(`✅ Processed ${batch.length} UPDATE operations`);
      
    } catch (error) {
      batch.forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
  }
  
  /**
   * معالجة دفعة عمليات SELECT
   */
  async processSelectBatch() {
    if (this.selectQueue.length === 0) return;
    
    // تحديد حجم الدفعة المناسب لتجنب مشاكل الذاكرة
    const maxChunkSize = Math.min(this.selectMaxBatchSize, 100); // حد أقصى 100 عملية في المرة الواحدة
    const batch = this.selectQueue.splice(0, maxChunkSize);
    const startTime = Date.now();
    
    try {
      // التأكد من وجود الاتصال بقاعدة البيانات قبل المعالجة
      if (!mongoose.connection || mongoose.connection.readyState !== 1) {
        throw new Error('Database connection is not ready');
      }
      
      // تجميع العمليات حسب المجموعة ونوع الفلتر
      const groupedBatch = this.groupSelectOperations(batch);
      
      // معالجة كل مجموعة بشكل متوازي مع حد أقصى للعمليات المتزامنة
      const collectionNames = Object.keys(groupedBatch);
      const concurrencyLimit = Math.min(collectionNames.length, 5); // حد أقصى 5 مجموعات متزامنة
      
      for (let i = 0; i < collectionNames.length; i += concurrencyLimit) {
        const chunk = collectionNames.slice(i, i + concurrencyLimit);
        const chunkPromises = chunk.map(async (collectionName) => {
          return this.processCollectionSelects(collectionName, groupedBatch[collectionName]);
        });
        
        await Promise.all(chunkPromises);
      }
      
      // تحديث الإحصائيات
      const processingTime = Date.now() - startTime;
      this.updateSelectMetrics(batch.length, processingTime);
      
      // console.log(`✅ Processed ${batch.length} SELECT operations in ${processingTime}ms`);
      
      // إذا كان هناك المزيد من العمليات في الطابور، قم بمعالجتها
      if (this.selectQueue.length > 0) {
        // إضافة تأخير صغير لتجنب الضغط المفرط
        setTimeout(() => this.processSelectBatch(), 10);
      }
      
    } catch (error) {
      console.error(`❌ Error in processSelectBatch:`, error.message);
      // رفض جميع العمليات في حالة الخطأ العام
      batch.forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
  }
  
  /**
   * تجميع عمليات SELECT حسب المجموعة ونوع الفلتر
   */
  groupSelectOperations(batch) {
    const grouped = {};
    
    batch.forEach(operation => {
      const { collection, filter, options, resolve, reject, timestamp } = operation;
      
      // إنشاء مفتاح للتجميع بناءً على المجموعة ونوع الفلتر
      if (!grouped[collection]) {
        grouped[collection] = {};
      }
      
      // استخراج مفتاح الفلتر الأول (مثل email, _id, etc.)
      const filterKey = Object.keys(filter)[0] || '_id';
      const filterValue = filter[filterKey];
      
      if (!grouped[collection][filterKey]) {
        grouped[collection][filterKey] = [];
      }
      
      grouped[collection][filterKey].push({
        filterValue,
        options,
        resolve,
        reject,
        timestamp,
        originalFilter: filter
      });
    });
    
    return grouped;
  }
  
  /**
   * معالجة عمليات SELECT لمجموعة واحدة
   */
  async processCollectionSelects(collectionName, filterGroups) {
    try {
      // التأكد من وجود الاتصال بقاعدة البيانات
      if (!mongoose.connection || !mongoose.connection.db) {
        throw new Error('Database connection is not available');
      }
      
      const collection = mongoose.connection.db.collection(collectionName);
      
      if (!collection) {
        throw new Error(`Collection '${collectionName}' not found`);
      }
      
      // معالجة كل نوع فلتر بشكل منفصل
      const filterPromises = Object.keys(filterGroups).map(async (filterKey) => {
        return this.processFilterGroup(collection, filterKey, filterGroups[filterKey]);
      });
      
      await Promise.all(filterPromises);
      
    } catch (error) {
      console.error(`❌ Error processing collection '${collectionName}':`, error.message);
      // رفض جميع العمليات في هذه المجموعة
      Object.values(filterGroups).flat().forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
  }
  
  /**
   * معالجة مجموعة من العمليات بنفس نوع الفلتر
   */
  async processFilterGroup(collection, filterKey, operations) {
    try {
      // استخراج جميع القيم للبحث عنها
      const filterValues = operations.map(op => op.filterValue);
      
      // تجميع الخيارات المختلفة
      const optionsGroups = this.groupByOptions(operations);
      
      // معالجة كل مجموعة خيارات بشكل منفصل
      for (const [optionsKey, opsGroup] of Object.entries(optionsGroups)) {
        await this.executeSelectQuery(collection, filterKey, opsGroup);
      }
      
    } catch (error) {
      // رفض جميع العمليات في هذه المجموعة
      operations.forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
  }
  
  /**
   * تجميع العمليات حسب الخيارات المتشابهة
   */
  groupByOptions(operations) {
    const groups = {};
    
    operations.forEach(operation => {
      // إنشاء مفتاح فريد للخيارات
      const optionsKey = JSON.stringify({
        limit: operation.options.limit || null,
        skip: operation.options.skip || null,
        sort: operation.options.sort || null,
        projection: operation.options.projection || null
      });
      
      if (!groups[optionsKey]) {
        groups[optionsKey] = {
          operations: [],
          options: operation.options
        };
      }
      
      groups[optionsKey].operations.push(operation);
    });
    
    return groups;
  }
  
  /**
   * تنفيذ استعلام SELECT محسن
   */
  async executeSelectQuery(collection, filterKey, operationsGroup) {
    try {
      const { operations, options } = operationsGroup;
      const filterValues = operations.map(op => op.filterValue);
      
      // بناء الاستعلام
      let cursor = collection.find({ [filterKey]: { $in: filterValues } });
      
      // تطبيق الخيارات
      if (options.projection) {
        cursor = cursor.project(options.projection);
      }
      if (options.sort) {
        cursor = cursor.sort(options.sort);
      }
      if (options.skip) {
        cursor = cursor.skip(options.skip);
      }
      if (options.limit) {
        cursor = cursor.limit(options.limit);
      }
      
      // تنفيذ الاستعلام
      const results = await cursor.toArray();
      
      // توزيع النتائج على العمليات الأصلية
      operations.forEach(operation => {
        const matchingResults = results.filter(result => {
          // مقارنة دقيقة للقيم
          return this.compareValues(result[filterKey], operation.filterValue);
        });
        
        operation.resolve(matchingResults);
      });
      
    } catch (error) {
      // رفض جميع العمليات في هذه المجموعة
      operationsGroup.operations.forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
  }
  
  /**
   * مقارنة دقيقة للقيم (تدعم ObjectId وأنواع البيانات المختلفة)
   */
  compareValues(value1, value2) {
    // التعامل مع ObjectId
    if (value1 && value1.toString && value2 && value2.toString) {
      return value1.toString() === value2.toString();
    }
    
    // المقارنة العادية
    return value1 === value2;
  }
  
  /**
   * تحديث إحصائيات عمليات SELECT
   */
  updateSelectMetrics(operationsCount, processingTime) {
    if (!this.enableMetrics) return;
    
    this.metrics.selectBatches++;
    this.metrics.totalBatches++;
    this.metrics.lastBatchTime = Date.now();
    this.metrics.totalProcessingTime += processingTime;
    
    // حساب متوسط وقت معالجة SELECT
    this.metrics.avgSelectBatchTime = this.metrics.totalProcessingTime / this.metrics.selectBatches;
    
    // حساب متوسط حجم الدفعة
    const totalOperations = this.metrics.totalInsertOperations + 
                           this.metrics.totalUpdateOperations + 
                           this.metrics.totalSelectOperations + 
                           this.metrics.totalDeleteOperations;
    this.metrics.averageBatchSize = totalOperations / this.metrics.totalBatches;
  }
  
  /**
   * معالجة دفعة عمليات DELETE
   */
  async processDeleteBatch() {
    if (this.deleteQueue.length === 0) return;
    
    const batch = this.deleteQueue.splice(0); // أخذ جميع العمليات
    
    // تجميع العمليات حسب المجموعة (Collection)
    const collectionGroups = {};
    batch.forEach(operation => {
      if (!collectionGroups[operation.collection]) {
        collectionGroups[operation.collection] = [];
      }
      collectionGroups[operation.collection].push(operation);
    });
    
    try {
      // معالجة كل مجموعة على حدة
      for (const [collectionName, operations] of Object.entries(collectionGroups)) {
        const bulkOps = operations.map(op => ({
          deleteMany: {
            filter: op.filter
          }
        }));
        
        try {
          const result = await mongoose.connection.db.collection(collectionName).bulkWrite(bulkOps, {
            ordered: false
          });
          
          // إرجاع النتائج للعمليات
          operations.forEach((operation, index) => {
            operation.resolve({
              deletedCount: result.deletedCount,
              acknowledged: result.acknowledged
            });
          });
          
        } catch (error) {
          operations.forEach(operation => {
            operation.reject(error);
          });
        }
      }
      
      // console.log(`✅ Processed ${batch.length} DELETE operations`);
      
    } catch (error) {
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
    const totalOps = this.metrics.totalInsertOperations + 
                    this.metrics.totalUpdateOperations + 
                    this.metrics.totalSelectOperations + 
                    this.metrics.totalDeleteOperations;
    this.metrics.averageBatchSize = totalOps / this.metrics.totalBatches;
  }
  
  /**
   * الحصول على إحصائيات الأداء
   */
  getMetrics() {
    return {
      ...this.metrics,
      operations: {
        insert: this.metrics.totalInsertOperations || 0,
        update: this.metrics.totalUpdateOperations || 0,
        select: this.metrics.totalSelectOperations || 0,
        delete: this.metrics.totalDeleteOperations || 0
      },
      batches: {
        insert: this.metrics.insertBatches || 0,
        update: this.metrics.updateBatches || 0,
        select: this.metrics.selectBatches || 0,
        delete: this.metrics.deleteBatches || 0
      },
      queueSizes: {
        insert: this.insertQueue.length,
        update: this.updateQueue.length,
        select: this.selectQueue.length,
        delete: this.deleteQueue.length
      },
      timing: {
        totalRuntime: this.metrics.totalProcessingTime || 0,
        avgInsertBatchTime: this.metrics.avgInsertBatchTime || 0,
        avgUpdateBatchTime: this.metrics.avgUpdateBatchTime || 0,
        avgSelectBatchTime: this.metrics.avgSelectBatchTime || 0,
        avgDeleteBatchTime: this.metrics.avgDeleteBatchTime || 0
      },
      averageProcessingTime: this.metrics.totalProcessingTime / this.metrics.totalBatches || 0,
      operationsPerSecond: {
        insert: (this.metrics.totalInsertOperations / (this.metrics.totalProcessingTime / 1000)) || 0,
        update: (this.metrics.totalUpdateOperations / (this.metrics.totalProcessingTime / 1000)) || 0,
        select: (this.metrics.totalSelectOperations / (this.metrics.totalProcessingTime / 1000)) || 0,
        delete: (this.metrics.totalDeleteOperations / (this.metrics.totalProcessingTime / 1000)) || 0
      }
    };
  }
  
  /**
   * إغلاق النظام وتنظيف الموارد
   */
  async shutdown() {
    console.log('🔄 Shutting down MongoDB Queue Batch Manager...');
    
    // إيقاف المعالج الدوري
    this.stopBatchProcessor();
    
    // معالجة العمليات المتبقية
    if (this.insertQueue.length > 0 || this.updateQueue.length > 0 || 
        this.selectQueue.length > 0 || this.deleteQueue.length > 0) {
      console.log('🔄 Processing remaining operations...');
      await this.processBatches();
    }
    
    console.log('✅ MongoDB Queue Batch Manager shutdown complete');
  }
}

// تصدير الكلاس للاستخدام
export { MongoDBQueueBatchManager };

// إنشاء مثيل افتراضي للاستخدام المباشر
const createDefaultManager = () => {
  console.log('🚀 Starting MongoDB Queue Batch System');
  console.log('=' .repeat(60));
  
  const mongoQueueManager = new MongoDBQueueBatchManager({
    batchInterval: 1000, // 1000ms
    selectBatchInterval: 100, // 100ms
    maxBatchSize: 10_000,
    selectMaxBatchSize: 5_000,
    enableMetrics: true
  });
  
  // مراقبة الأحداث
  mongoQueueManager.on('batchProcessed', (data) => {
    console.log(`📊 Batch processed: ${data.operations} operations in ${data.processingTime.toFixed(2)}ms`);
  });
  
  mongoQueueManager.on('error', (error) => {
    console.error('❌ MongoDB Queue Manager Error:', error.message);
  });
  
  return mongoQueueManager;
};

export default createDefaultManager;

/*
أمثلة على الاستخدام:

try {
  // مثال على INSERT
  const insertResult = await mongoQueueManager.queueInsert('users', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });

  // مثال على UPDATE
  const updateResult = await mongoQueueManager.queueUpdate(
    'users',
    { email: 'john@example.com' },
    { $set: { age: 31 } }
  );

  // مثال على SELECT
  const selectResult = await mongoQueueManager.queueSelect(
    'users',
    { age: { $gte: 18 } },
    { limit: 10, sort: { name: 1 } }
  );

  // مثال على DELETE
  const deleteResult = await mongoQueueManager.queueDelete(
    'users',
    { age: { $lt: 18 } }
  );

} catch (error) {
  console.error('❌ Operation failed:', error.message);
} finally {
  // إغلاق الاتصال
  await mongoQueueManager.shutdown();
}
*/