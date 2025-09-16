import '../../../config/index.js';
import { MongoDBQueueBatchManager } from './config/mongodb-batch.config.js';
import connectDB from './config/db.config.js';
import { User } from './index.js';

/**
 * MongoDB Queue Batch Manager Test Script
 * Tests the performance of batched MongoDB operations
 */

class MongoDBBatchTest {
    constructor() {
        this.batchManager = null;
        this.testResults = {
            insert: { operations: 0, errors: 0, startTime: 0, endTime: 0 },
            update: { operations: 0, errors: 0, startTime: 0, endTime: 0 },
            select: { operations: 0, errors: 0, startTime: 0, endTime: 0 },
            delete: { operations: 0, errors: 0, startTime: 0, endTime: 0 }
        };
        this.testData = [];
    }

    async initialize() {
        console.log('🚀 Initializing MongoDB Batch Test...');
        
        // Connect to MongoDB
        await connectDB();
        console.log('✅ Connected to MongoDB');
        
        // Initialize batch manager
        this.batchManager = new MongoDBQueueBatchManager({
            insertInterval: 500,
            updateInterval: 300,
            selectInterval: 3000,
            deleteInterval: 400,
            insertBatchSize: 1000,
            updateBatchSize: 500,
            selectBatchSize: 20000,
            deleteBatchSize: 800
        });
        
        console.log('✅ MongoDB Batch Manager initialized');
        
        // Generate test data
        this.generateTestData(1000000);
        console.log('✅ Test data generated');
    }

    generateTestData(count) {
        console.log(`📊 Generating ${count} test records...`);
        
        for (let i = 0; i < count; i++) {
            this.testData.push({
                name: `Test User ${i}`,
                email: `testuser${i}@example.com`,
                password: `password${i}`,
            });
        }
    }

    async testInsertOperations(operationCount = 50000) {
        console.log(`\n🔄 Testing INSERT operations (${operationCount} operations)...`);
        
        this.testResults.insert.startTime = Date.now();
        
        const promises = [];
        
        for (let i = 0; i < operationCount; i++) {
            const testRecord = {
                ...this.testData[i % this.testData.length],
                email: `insert_test_${i}@example.com`
            };
            
            const promise = this.batchManager.queueInsert(User, testRecord)
                .then(() => {
                    this.testResults.insert.operations++;
                })
                .catch((error) => {
                    this.testResults.insert.errors++;
                    console.error(`Insert error ${i}:`, error.message);
                });
            
            promises.push(promise);
            
            // Add small delay every 1000 operations to prevent overwhelming
            if (i % 1000 === 0 && i > 0) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
        
        await Promise.all(promises);
        this.testResults.insert.endTime = Date.now();
        
        console.log(`✅ INSERT test completed`);
        this.printOperationResults('INSERT', this.testResults.insert);
    }

    async testUpdateOperations(operationCount = 30000) {
        console.log(`\n🔄 Testing UPDATE operations (${operationCount} operations)...`);
        
        this.testResults.update.startTime = Date.now();
        
        const promises = [];
        
        for (let i = 0; i < operationCount; i++) {
            const filter = { email: `insert_test_${i % 10000}@example.com` };
            const update = {
                name: `Updated User ${i}`,
                updatedAt: new Date()
            };
            
            const promise = this.batchManager.queueUpdate(User, filter, update)
                .then(() => {
                    this.testResults.update.operations++;
                })
                .catch((error) => {
                    this.testResults.update.errors++;
                    console.error(`Update error ${i}:`, error.message);
                });
            
            promises.push(promise);
            
            if (i % 1000 === 0 && i > 0) {
                await new Promise(resolve => setTimeout(resolve, 5));
            }
        }
        
        await Promise.all(promises);
        this.testResults.update.endTime = Date.now();
        
        console.log(`✅ UPDATE test completed`);
        this.printOperationResults('UPDATE', this.testResults.update);
    }

    async testSelectOperations(operationCount = 100000) {
        console.log(`\n🔄 Testing SELECT operations (${operationCount} operations)...`);
        
        this.testResults.select.startTime = Date.now();
        
        const promises = [];
        
        for (let i = 0; i < operationCount; i++) {
            const query = {
                email: `insert_test_${i % operationCount}@example.com`
            };
            
            const promise = this.batchManager.queueSelect(User, query)
                .then((result) => {
                    this.testResults.select.operations++;
                    if(i == 1_00_000){
                        console.log(`Select result ${i}:`, result);
                    }
                })
                .catch((error) => {
                    this.testResults.select.errors++;
                    console.error(`Select error ${i}:`, error.message);
                });
            
            promises.push(promise);
            
            if (i % 2000 === 0 && i > 0) {
                await new Promise(resolve => setTimeout(resolve, 2));
            }
        }
        
        await Promise.all(promises);
        this.testResults.select.endTime = Date.now();
        
        console.log(`✅ SELECT test completed`);
        this.printOperationResults('SELECT', this.testResults.select);
    }

    async testDeleteOperations(operationCount = 20000) {
        console.log(`\n🔄 Testing DELETE operations (${operationCount} operations)...`);
        
        this.testResults.delete.startTime = Date.now();
        
        const promises = [];
        
        for (let i = 0; i < operationCount; i++) {
            const filter = {
                email: `insert_test_${i}@example.com`
            };
            
            const promise = this.batchManager.queueDelete(User, filter)
                .then(() => {
                    this.testResults.delete.operations++;
                })
                .catch((error) => {
                    this.testResults.delete.errors++;
                    console.error(`Delete error ${i}:`, error.message);
                });
            
            promises.push(promise);
            
            if (i % 1000 === 0 && i > 0) {
                await new Promise(resolve => setTimeout(resolve, 8));
            }
        }
        
        await Promise.all(promises);
        this.testResults.delete.endTime = Date.now();
        
        console.log(`✅ DELETE test completed`);
        this.printOperationResults('DELETE', this.testResults.delete);
    }

    printOperationResults(operationType, results) {
        const duration = results.endTime - results.startTime;
        const throughput = Math.round((results.operations / duration) * 1000);
        const avgLatency = duration / results.operations;
        
        console.log(`\n📊 ${operationType} Operation Results:`);
        console.log(`   Operations: ${results.operations.toLocaleString()}`);
        console.log(`   Errors: ${results.errors.toLocaleString()}`);
        console.log(`   Duration: ${duration.toLocaleString()} ms`);
        console.log(`   Throughput: ${throughput.toLocaleString()} ops/sec`);
        console.log(`   Avg Latency: ${avgLatency.toFixed(2)} ms/op`);
        console.log(`   Success Rate: ${((results.operations / (results.operations + results.errors)) * 100).toFixed(2)}%`);
    }

    async printBatchManagerMetrics() {
        console.log('\n📈 MongoDB Batch Manager Metrics:');
        const metrics = this.batchManager.getMetrics();
        
        console.log('\n🔢 Operation Statistics:');
        console.log(`   Total Insert Operations: ${metrics.operations.insert.toLocaleString()}`);
        console.log(`   Total Update Operations: ${metrics.operations.update.toLocaleString()}`);
        console.log(`   Total Select Operations: ${metrics.operations.select.toLocaleString()}`);
        console.log(`   Total Delete Operations: ${metrics.operations.delete.toLocaleString()}`);
        
        console.log('\n⚡ Performance Metrics:');
        console.log(`   Insert Batches Processed: ${metrics.batches.insert.toLocaleString()}`);
        console.log(`   Update Batches Processed: ${metrics.batches.update.toLocaleString()}`);
        console.log(`   Select Batches Processed: ${metrics.batches.select.toLocaleString()}`);
        console.log(`   Delete Batches Processed: ${metrics.batches.delete.toLocaleString()}`);
        
        console.log('\n📊 Queue Status:');
        console.log(`   Insert Queue Size: ${metrics.queueSizes.insert.toLocaleString()}`);
        console.log(`   Update Queue Size: ${metrics.queueSizes.update.toLocaleString()}`);
        console.log(`   Select Queue Size: ${metrics.queueSizes.select.toLocaleString()}`);
        console.log(`   Delete Queue Size: ${metrics.queueSizes.delete.toLocaleString()}`);
        
        console.log('\n🕒 Timing Information:');
        console.log(`   Total Runtime: ${metrics.timing.totalRuntime.toLocaleString()} ms`);
        console.log(`   Average Insert Batch Time: ${metrics.timing.avgInsertBatchTime.toFixed(2)} ms`);
        console.log(`   Average Update Batch Time: ${metrics.timing.avgUpdateBatchTime.toFixed(2)} ms`);
        console.log(`   Average Select Batch Time: ${metrics.timing.avgSelectBatchTime.toFixed(2)} ms`);
        console.log(`   Average Delete Batch Time: ${metrics.timing.avgDeleteBatchTime.toFixed(2)} ms`);
    }

    async printOverallPerformanceReport() {
        console.log('\n🎯 Overall Performance Report:');
        
        const totalOperations = Object.values(this.testResults)
            .reduce((sum, result) => sum + result.operations, 0);
        const totalErrors = Object.values(this.testResults)
            .reduce((sum, result) => sum + result.errors, 0);
        const totalDuration = Math.max(
            ...Object.values(this.testResults).map(result => result.endTime)
        ) - Math.min(
            ...Object.values(this.testResults).map(result => result.startTime)
        );
        
        console.log(`   Total Operations: ${totalOperations.toLocaleString()}`);
        console.log(`   Total Errors: ${totalErrors.toLocaleString()}`);
        console.log(`   Total Test Duration: ${totalDuration.toLocaleString()} ms`);
        console.log(`   Overall Throughput: ${Math.round((totalOperations / totalDuration) * 1000).toLocaleString()} ops/sec`);
        console.log(`   Overall Success Rate: ${((totalOperations / (totalOperations + totalErrors)) * 100).toFixed(2)}%`);
        
        // Memory usage
        const memUsage = process.memoryUsage();
        console.log('\n💾 Memory Usage:');
        console.log(`   RSS: ${Math.round(memUsage.rss / 1024 / 1024)} MB`);
        console.log(`   Heap Used: ${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`);
        console.log(`   Heap Total: ${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`);
        console.log(`   External: ${Math.round(memUsage.external / 1024 / 1024)} MB`);
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up test environment...');
        
        // Clean up test data
        try {
            await User.deleteMany({ email: { $regex: /^(insert_test_|testuser)/ } });
            console.log('✅ Test data cleaned up');
        } catch (error) {
            console.error('❌ Error cleaning up test data:', error.message);
        }
        
        // Shutdown batch manager
        if (this.batchManager) {
            await this.batchManager.shutdown();
            console.log('✅ Batch manager shutdown');
        }
        
        console.log('✅ Cleanup completed');
    }

    async runFullTest() {
        const startTime = Date.now();
        
        try {
            await this.initialize();
            
            // Run all tests
            await this.testInsertOperations(1_000_000);
            await this.testUpdateOperations(1_000_000);
            await this.testSelectOperations(1_000_000);
            await this.testDeleteOperations(1_000_000);
            
            // Wait for all batches to complete
            console.log('\n⏳ Waiting for all batches to complete...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Print comprehensive results
            await this.printBatchManagerMetrics();
            await this.printOverallPerformanceReport();
            
        } catch (error) {
            console.error('❌ Test failed:', error);
        } finally {
            await this.cleanup();
            
            const totalTime = Date.now() - startTime;
            console.log(`\n🏁 Test completed in ${totalTime.toLocaleString()} ms`);
            process.exit(0);
        }
    }
}

// Run the test if this file is executed directly

const test = new MongoDBBatchTest();
test.runFullTest().catch(console.error);

export { MongoDBBatchTest };