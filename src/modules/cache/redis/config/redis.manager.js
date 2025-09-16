// import '../../../config/index.js';
import RedisQueueBatchManager from './redis.config.js';

const queueManager = new RedisQueueBatchManager({
  batchInterval: 500, // 5ms
  getBatchInterval:25, // 5ms
  maxBatchSize: 100_000,
  getMaxBatchSize: 20_000,
  enableMetrics: true
});

// مراقبة الأحداث
queueManager.on('batchProcessed', (data) => {
  console.log(`📊 Batch processed: ${data.operations} operations in ${data.processingTime.toFixed(2)}ms`);
});

queueManager.on('error', (error) => {
  console.error('❌ Queue Manager Error:', error.message);
});

/**
 * @param {string} key - اسم المفتاح
 * @param {string | number | object} value - القيمة المراد إدخالها
 * @param {number} ttl - مدة الحياة (بالثواني)
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * cacheSet(
 *     `test_key_${i}`,
 *     {
 *       id: i,
 *       data: `test_data_${i}`,
 *       timestamp: Date.now(),
 *       random: Math.random()
 *     },
 *     300 // 5 minutes TTL
 *   );
 *   setPromises.push(promise);
    }

 */
function cacheSet(...args) {
    queueManager.queueSet(...args);
}

/**
 * @param {string} key - اسم المفتاح
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * cacheDelete(`test_key_${i}`).then(() => {
 *     console.log(`Deleted key: test_key_${i}`);
 * });

 */
function cacheDelete(...args) {
    queueManager.queueDel(...args);
}

/**
 * @param {string} key - اسم المفتاح
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * cacheGet(`test_key_${i}`).then((data) => {
 *     console.log(`Data for key ${i}:`, data);
 * });
 */

async function cacheGet(...args) {
    return await queueManager.queueGet(...args);
}

export {
    cacheSet,
    cacheDelete,
    cacheGet,
};
