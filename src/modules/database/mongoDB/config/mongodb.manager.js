// import '../../../config/index.js';
import { MongoDBQueueBatchManager } from './mongodb-batch.config.js';

const mongodbQueueManager = new MongoDBQueueBatchManager({
    insertInterval: 500,
    updateInterval: 300,
    selectInterval: 3000,
    deleteInterval: 400,
    insertBatchSize: 1000,
    updateBatchSize: 500,
    selectBatchSize: 20000,
    deleteBatchSize: 800
});

/**
 * @param {string} model - اسم الجدول
 * @param {Object} data - البيانات المراد إدخالها
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * mDBinsert(User, {
 *     name: 'Mohamed',
 *     age: 25,
 *     email: 'mohamed@example.com'
 * });

 */
function mDBinsert(...args) {
    mongodbQueueManager.queueInsert(...args);
}

/**
 * @param {string} model - اسم الجدول
 * @param {Object} filter - شرط التحديث
 * @param {Object} data - البيانات المراد إدخالها
 * @param {Object} options - خيارات التحديث
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * mDBupdate(User, {
 *     id: 1
 * }, {
 *     name: 'Mohamed',
 *     age: 25,
 *     email: 'mohamed@example.com'
 * });
 */
function mDBupdate(...args) {
    mongodbQueueManager.queueUpdate(...args);
}

/**
 * @param {string} model - اسم الجدول
 * @param {Object} filter - شرط التحديث
 * @param {Object} options - خيارات التحديث
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * mDBdelete(User, {
 *     id: 1
 * });
 */
function mDBdelete(...args) {
    mongodbQueueManager.queueDelete(...args);
}

/**
 * @param {Model} model - اسم الجدول
 * @param {Object} filter - شرط التحديث
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * mDBselectAll({
 *      model: User,
 *      filter: {name: `Test User ${0 + i}`}
 * });
 */

async function mDBselectAll(...args) {
    return await mongodbQueueManager.queueSelect(...args);
}

export {
    mDBinsert,
    mDBupdate,
    mDBdelete,
    mDBselectAll,
};
