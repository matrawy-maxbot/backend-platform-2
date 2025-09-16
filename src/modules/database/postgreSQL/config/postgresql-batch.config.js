import { EventEmitter } from 'events';
import sequelize from './db.config.js';

class PostgreSQLQueueBatchManager extends EventEmitter {
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
    
    console.log(`🚀 PostgreSQL Queue Batch Manager initialized with ${this.batchInterval}ms interval for insert, update, delete operations`);
    console.log(`🚀 PostgreSQL Queue Batch Manager initialized with ${this.selectBatchInterval}ms interval for select operations`);
  }
  
  /**
   * التحقق من جاهزية الاتصال بقاعدة البيانات
   */
  async waitForDatabaseConnection(maxWaitTime = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        await sequelize.authenticate();
        return true;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
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
  queueInsert(model, data) {
    return new Promise((resolve, reject) => {
      // استخراج اسم النموذج
      const modelName = typeof model === 'string' ? model : model.name;
      
      this.insertQueue.push({
        model: modelName,
        modelClass: model,
        data,
        resolve,
        reject,
        timestamp: Date.now()
      });
      console.log("\n!#############! this.insertQueue : ", this.insertQueue, "\n\n");
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
  queueUpdate(model, data, where, options = {}) {
    return new Promise((resolve, reject) => {
      // استخراج اسم النموذج
      const modelName = typeof model === 'string' ? model : model.name;

      // التحقق من وجود where
      if (!where) {
        reject(new Error('Where clause is required for update operation'));
        return;
      }

      console.log('\n\n\nwhere ^^^^^ :', where, "\n\n\n");
      
      this.updateQueue.push({
        model: modelName,
        modelClass: model,
        data,
        options,
        resolve,
        reject,
        timestamp: Date.now(),
        ...(where.where ? { where: where.where } : { where })
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
  queueSelect(model, options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        // التحقق من صحة المعاملات
        if (!model) {
          reject(new Error('Model parameter is required'));
          return;
        }
        
        // استخراج اسم النموذج
        const modelName = typeof model === 'string' ? model : model.name;
        
        if (!modelName) {
          reject(new Error('Unable to determine model name'));
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
          model: modelName,
          modelClass: model,
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
  queueDelete(model, where, options = {}) {
    return new Promise((resolve, reject) => {
      // استخراج اسم النموذج
      const modelName = typeof model === 'string' ? model : model.name;
      
      this.deleteQueue.push({
        model: modelName,
        modelClass: model,
        options,
        resolve,
        reject,
        timestamp: Date.now(),
        ...(where.where ? { where: where.where } : { where })
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
      // إعداد العمليات المتوازية
      const batchPromises = [];
      const batchSizes = {};
      
      // معالجة طابور INSERT
      if (this.insertQueue.length > 0 && operations.includes('insert')) {
        batchSizes.insert = this.insertQueue.length;
        batchPromises.push(this.processInsertBatch());
      }
      
      // معالجة طابور UPDATE
      if (this.updateQueue.length > 0 && operations.includes('update')) {
        batchSizes.update = this.updateQueue.length;
        batchPromises.push(this.processUpdateBatch());
      }
      
      // معالجة طابور SELECT
      if (this.selectQueue.length > 0 && operations.includes('select')) {
        batchSizes.select = this.selectQueue.length;
        batchPromises.push(this.processSelectBatch());
      }
      
      // معالجة طابور DELETE
      if (this.deleteQueue.length > 0 && operations.includes('delete')) {
        batchSizes.delete = this.deleteQueue.length;
        batchPromises.push(this.processDeleteBatch());
      }
      
      // تنفيذ جميع العمليات بشكل متوازي
      if (batchPromises.length > 0) {
        const results = await Promise.allSettled(batchPromises);
        
        // حساب إجمالي العمليات
        totalOperations = Object.values(batchSizes).reduce((sum, size) => sum + size, 0);
        
        // التحقق من النتائج وتسجيل الأخطاء
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`❌ Batch operation ${index} failed:`, result.reason?.message || result.reason);
          }
        });
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
    
    // تجميع العمليات حسب النموذج (Model)
    const modelGroups = {};
    batch.forEach(operation => {
      if (!modelGroups[operation.model]) {
        modelGroups[operation.model] = [];
      }
      modelGroups[operation.model].push(operation);
    });
    
    try {
      // معالجة كل نموذج على حدة
      for (const [modelName, operations] of Object.entries(modelGroups)) {
        const dataArray = operations.map(op => op.data);
        const modelClass = operations[0].modelClass;
        
        try {
          const result = await modelClass.bulkCreate(dataArray, {
            validate: true,
            // returning: true
          });
          
          // إرجاع النتائج للعمليات الناجحة
          operations.forEach((operation, index) => {
            console.log("\n!#############! result : ", result[index], "\n\n");
            if (result[index]) {
              operation.resolve({
                status: 'success',
                message: 'Insert operation successful',
                exist: false,
                data: result[index]
              });
            } else {
              operation.reject(new Error('Insert operation failed'));
            }
          });
          
        } catch (error) {
          // في حالة فشل المجموعة كاملة
          operations.forEach(operation => {
            console.log("\n!#############! error : ", error, "\n\n");
            if (error.name === 'SequelizeUniqueConstraintError') {
              // console.log('the data is exist in unique fields!', " , table : 0", error?.parent?.table, " , detail : ", error?.parent?.detail);
              operation.resolve({
                status: 'success',
                message: 'the data is exist in unique fields!',
                exist: true,
                data: {}
              });
            } else {
              operation.reject(error);
            }
          });
        }
      }
      
      this.metrics.insertBatches++;
      
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
    
    // تجميع العمليات حسب النموذج (Model)
    const modelGroups = {};
    batch.forEach(operation => {
      if (!modelGroups[operation.model]) {
        modelGroups[operation.model] = [];
      }
      modelGroups[operation.model].push(operation);
    });
    
    try {
      // معالجة كل نموذج على حدة
      for (const [modelName, operations] of Object.entries(modelGroups)) {
        const modelClass = operations[0].modelClass;
        const primaryKey = modelClass.primaryKeyAttributes && modelClass.primaryKeyAttributes[0];
        
        // إذا كانت كل العمليات تحتوي على where { [pk]: value } وتحديث نفس الأعمدة، نفذ تحديث مجمع CASE WHEN
        const allHavePk = primaryKey && operations.every(op => op.where && op.where[primaryKey] !== undefined);
        const updatedColumnsSet = new Set();
        operations.forEach(op => Object.keys(op.data || {}).forEach(col => updatedColumnsSet.add(col)));
        const updatedColumns = Array.from(updatedColumnsSet);
        const sameColumnsAcrossAll = operations.every(op => Object.keys(op.data || {}).length === updatedColumns.length && updatedColumns.every(c => c in (op.data || {})));
        
        console.log('operations ::---:: ', operations);
        console.log('operations ::---:: ', operations[0].where);
        console.log('primaryKey ::---:: ', primaryKey);
        console.log('allHavePk ::---:: ', allHavePk);
        console.log('updatedColumnsSet ::---:: ', updatedColumnsSet);
        console.log('updatedColumns ::---:: ', updatedColumns);
        console.log('sameColumnsAcrossAll ::---:: ', sameColumnsAcrossAll);

        if (allHavePk && updatedColumns.length > 0 && sameColumnsAcrossAll) {
          const ids = operations.map(op => op.where[primaryKey]);
          
          // بناء تعبيرات CASE لكل عمود مع معاملات مستبدلة لسلامة الاستعلام
          const cases = {};
          const replacements = [];
          updatedColumns.forEach(col => {
            const whenClauses = operations.map(op => {
              replacements.push(op.where[primaryKey], op.data[col]);
              return `WHEN "${primaryKey}" = ? THEN ?`;
            }).join(' ');
            cases[col] = `CASE ${whenClauses} END`;
          });
          
          const setFragments = updatedColumns.map(col => `"${col}" = ${cases[col]}`).join(', ');
          const inPlaceholders = ids.map(() => '?').join(', ');
          const tableName = modelClass.getTableName();
          const qualifiedTable = typeof tableName === 'object' ? `"${tableName.schema}"."${tableName.tableName}"` : `"${tableName}"`;
          const sql = `UPDATE ${qualifiedTable} SET ${setFragments} WHERE "${primaryKey}" IN (${inPlaceholders});`;
          
          // إضافة معرفات WHERE IN إلى المصفوفة بعد CASE
          replacements.push(...ids);
          
          await sequelize.query(sql, { replacements });
          
          // إرجاع النتائج
          operations.forEach(op => op.resolve({ changedRows: 1 }));
        } else {
          // تنفيذ العمليات بشكل متوازي كحل بديل
          const updatePromises = operations.map(async (operation) => {
            try {
              const result = await modelClass.update(
                operation.data,
                {
                  where: operation.where,
                  ...operation.options
                }
              );
              
              operation.resolve({
                // affectedRows: result[0],
                changedRows: result[0] || 0
              });
              
            } catch (error) {
              operation.reject(error);
            }
          });
          
          await Promise.all(updatePromises);
        }
      }
      
      this.metrics.updateBatches++;
      
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
    const maxChunkSize = this.selectMaxBatchSize; // use configured selectMaxBatchSize without artificial 100 cap
    const batch = this.selectQueue/*.splice(0, maxChunkSize)*/;
    const startTime = Date.now();
    
    try {
      // التأكد من وجود الاتصال بقاعدة البيانات قبل المعالجة
      try {
        await sequelize.authenticate();
      } catch (error) {
        throw new Error('Database connection is not ready');
      }
      
      // تجميع العمليات حسب النموذج والخيارات
      const groupedBatch = this.groupSelectOperations(batch);
      
      // معالجة كل مجموعة بشكل متوازي مع حد أقصى للعمليات المتزامنة
      const modelNames = Object.keys(groupedBatch);
      const concurrencyLimit = Math.min(modelNames.length, 20); // زيادة الحد الأقصى للنماذج المتزامنة لتحسين التوازي
      
      for (let i = 0; i < modelNames.length; i += concurrencyLimit) {
        const chunk = modelNames.slice(i, i + concurrencyLimit);
        const chunkPromises = chunk.map(async (modelName) => {
          return this.processModelSelects(modelName, groupedBatch[modelName]);
        });
        
        await Promise.all(chunkPromises);
      }
      
      // تحديث الإحصائيات
      const processingTime = Date.now() - startTime;
      this.updateSelectMetrics(batch.length, processingTime);
      
      // إذا كان هناك المزيد من العمليات في الطابور، قم بمعالجتها فوراً
      if (this.selectQueue.length > 0) {
        setImmediate(() => this.processSelectBatch());
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
   * تجميع عمليات SELECT حسب النموذج والخيارات
   */
  groupSelectOperations(batch) {
    const grouped = {};
    
    batch.forEach(operation => {
      const { model, modelClass, options, resolve, reject, timestamp } = operation;
      
      // إنشاء مفتاح للتجميع بناءً على النموذج والخيارات
      if (!grouped[model]) {
        grouped[model] = {};
      }
      
      // إنشاء مفتاح فريد للخيارات
      const optionsKey = JSON.stringify({
        where: options.where || {},
        limit: options.limit || null,
        offset: options.offset || null,
        order: options.order || null,
        attributes: options.attributes || null
      });
      
      if (!grouped[model][optionsKey]) {
        grouped[model][optionsKey] = {
          operations: [],
          modelClass,
          options
        };
      }
      
      grouped[model][optionsKey].operations.push({
        resolve,
        reject,
        timestamp
      });
    });
    
    return grouped;
  }
  
  /**
   * معالجة عمليات SELECT لنموذج واحد
   */
  async processModelSelects(modelName, optionsGroups) {
    try {
      // معالجة كل مجموعة خيارات بشكل منفصل
      const optionsPromises = Object.keys(optionsGroups).map(async (optionsKey) => {
        return this.executeSelectQuery(optionsGroups[optionsKey]);
      });
      
      await Promise.all(optionsPromises);
      
    } catch (error) {
      console.error(`❌ Error processing model '${modelName}':`, error.message);
      // رفض جميع العمليات في هذا النموذج
      Object.values(optionsGroups).forEach(group => {
        group.operations.forEach(operation => {
          operation.reject(error);
        });
      });
      throw error;
    }
  }
  
  /**
   * تنفيذ استعلام SELECT محسن
   */
  async executeSelectQuery(operationsGroup) {
    try {
      const { operations, modelClass, options } = operationsGroup;
      
      console.log(" options :: ", options);

      // تنفيذ الاستعلام
      // const results = await modelClass.findAll(options);
      
      // إرجاع النتائج لجميع العمليات في هذه المجموعة
      operations.forEach(operation => {
        operation.resolve(results);
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
   * معالجة دفعة عمليات DELETE
   */
  async processDeleteBatch() {
    if (this.deleteQueue.length === 0) return;
    
    const batch = this.deleteQueue.splice(0); // أخذ جميع العمليات
    
    // تجميع العمليات حسب النموذج (Model)
    const modelGroups = {};
    batch.forEach(operation => {
      if (!modelGroups[operation.model]) {
        modelGroups[operation.model] = [];
      }
      modelGroups[operation.model].push(operation);
    });
    
    try {
      // معالجة كل نموذج على حدة
      for (const [modelName, operations] of Object.entries(modelGroups)) {
        const modelClass = operations[0].modelClass;
        const primaryKey = modelClass.primaryKeyAttributes && modelClass.primaryKeyAttributes[0];
        
        // إذا كانت كل العمليات تحتوي على where { [pk]: value } نفذ حذف مجمع IN
        const pkDeletes = [];
        const otherDeletes = [];
        operations.forEach(op => {
          if (primaryKey && op.where && op.where[primaryKey] !== undefined && Object.keys(op.where).length === 1) {
            pkDeletes.push(op);
          } else {
            otherDeletes.push(op);
          }
        });
        
        // تنفيذ حذف مجمع باستخدام IN لقائمة المعرفات
        if (pkDeletes.length > 0) {
          const ids = pkDeletes.map(op => op.where[primaryKey]);
          console.log("\n\n\n DELETE ids ^^^^^ :", ids, "\n\n\n");
          const where = { [primaryKey]: ids };
          const deletedCount = await modelClass.destroy({ where });
          pkDeletes.forEach(op => op.resolve({ deletedCount: 1 }));
        }
        
        // باقي العمليات تنفذ كما هي بشكل متوازي
        if (otherDeletes.length > 0) {
          const deletePromises = otherDeletes.map(async (operation) => {
            try {
              console.log("\n\n\n DELETE operation ^^^^^ :", operation, "\n\n\n");
              console.log("\n\n\n DELETE operation.where ^^^^^ :", operation.where, "\n\n\n");

              const result = await modelClass.destroy({
                where: operation.where,
                ...operation.options
              });
              
              operation.resolve({
                deletedCount: result
              });
              
            } catch (error) {
              operation.reject(error);
            }
          });
          await Promise.all(deletePromises);
        }
      }
      
      this.metrics.deleteBatches++;
      
    } catch (error) {
      batch.forEach(operation => {
        operation.reject(error);
      });
      throw error;
    }
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
    console.log('🔄 Shutting down PostgreSQL Queue Batch Manager...');
    
    // إيقاف المعالج الدوري
    this.stopBatchProcessor();
    
    // معالجة العمليات المتبقية
    if (this.insertQueue.length > 0 || this.updateQueue.length > 0 || 
        this.selectQueue.length > 0 || this.deleteQueue.length > 0) {
      console.log('🔄 Processing remaining operations...');
      await this.processBatches();
    }
    
    console.log('✅ PostgreSQL Queue Batch Manager shutdown complete');
  }
}

// تصدير الكلاس للاستخدام
export { PostgreSQLQueueBatchManager };

// إنشاء مثيل افتراضي للاستخدام المباشر
const createDefaultManager = () => {
  console.log('🚀 Starting PostgreSQL Queue Batch System - High Performance Mode');
  console.log('=' .repeat(60));
  
  const postgresQueueManager = new PostgreSQLQueueBatchManager({
    batchInterval: 10, // 10ms - تحسين كبير من 1000ms
    selectBatchInterval: 5, // 5ms - تحسين كبير من 100ms
    maxBatchSize: 1000, // تقليل من 10,000 لتحسين الاستجابة
    selectMaxBatchSize: 5000, // تقليل من 5,000 لتحسين الاستجابة
    enableMetrics: true
  });
  
  // مراقبة الأحداث
  postgresQueueManager.on('batchProcessed', (data) => {
    // console.log(`📊 Batch processed: ${data.operations} operations in ${data.processingTime.toFixed(2)}ms`);
  });
  
  postgresQueueManager.on('error', (error) => {
    console.error('❌ PostgreSQL Queue Manager Error:', error.message);
  });
  
  return postgresQueueManager;
};

export default createDefaultManager;

/*
أمثلة على الاستخدام:

try {
  // مثال على INSERT
  const insertResult = await postgresQueueManager.queueInsert(User, {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  });

  // مثال على UPDATE
  const updateResult = await postgresQueueManager.queueUpdate(
    User,
    { name: 'John Updated' },
    { email: 'john@example.com' }
  );

  // مثال على SELECT
  const selectResult = await postgresQueueManager.queueSelect(
    User,
    {
      where: { name: 'John%' },
      limit: 10,
      order: [['name', 'ASC']]
    }
  );

  // مثال على DELETE
  const deleteResult = await postgresQueueManager.queueDelete(
    User,
    { email: 'john@example.com' }
  );

} catch (error) {
  console.error('❌ Operation failed:', error.message);
} finally {
  // إغلاق الاتصال
  await postgresQueueManager.shutdown();
}
*/