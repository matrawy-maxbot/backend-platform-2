// import '../../../config/index.js';
import createDefaultManager from './postgresql-batch.config.js';
import pgSQLManager from './pgSelect.enhancement.js';

const postgresQueueManager = createDefaultManager();
const pgSQLM = new pgSQLManager();

/**
 * @param {string} tableName - اسم الجدول
 * @param {Object} data - البيانات المراد إدخالها
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * PGinsert(User, {
 *     name: 'Mohamed',
 *     age: 25,
 *     email: 'mohamed@example.com'
 * });

 */
async function PGinsert(tableName, data, ...args) {
    console.log("\n!#############! tableName : ", tableName, "\n\n");
    console.log("\n!#############! data : ", data, "\n\n");
    console.log("\n!#############! args : ", args, "\n\n");
    return await postgresQueueManager.queueInsert(tableName, data, ...args);
}

/**
 * @param {string} tableName - اسم الجدول
 * @param {Object} data - البيانات المراد إدخالها
 * @param {Object} where - شرط التحديث
 * @param {Object} options - خيارات التحديث
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * PGupdate(User, {
 *     name: 'Mohamed',
 *     age: 25,
 *     email: 'mohamed@example.com'
 * }, {
 *     id: 1
 * });
 */
async function PGupdate(tableName, data, ...args) {
    console.log("\n!#############! tableName : ", tableName, "\n\n");
    console.log("\n!#############! data : ", data, "\n\n");
    console.log("\n!#############! args : ", args, "\n\n");
    return await postgresQueueManager.queueUpdate(tableName, data, ...args);
}

/**
 * @param {string} tableName - اسم الجدول
 * @param {Object} where - شرط التحديث
 * @param {Object} options - خيارات التحديث
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * PGdelete(User, {
 *     id: 1
 * });
 */
async function PGdelete(...args) {
    console.log("\n!#############! args : ", args, "\n\n");
    return await postgresQueueManager.queueDelete(...args);
}

/**
 * @param {Model} model - اسم الجدول
 * @param {Object} filter - شرط التحديث
 * @returns {Promise} - إرجاع الحقل المُضاف
 * @example
 * PGselectAll({
 *      model: User,
 *      filter: {name: `Test User ${0 + i}`}
 * });
 */
async function PGselectAll(model, filter, ...args) {
    return await pgSQLM.findQueue({model, filter: filter, ...args});
}

export {
    PGinsert,
    PGupdate,
    PGdelete,
    PGselectAll,
};
