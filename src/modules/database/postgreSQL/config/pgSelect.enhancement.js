// import '../../../../config/index.js';
// import { User } from "../models/index.js";
// import sequelize from "./db.config.js";
import { Op } from 'sequelize';

class pgSQLManager {

        constructor() {
            this.selectQueue = [];
            this.selectInterval = setInterval(() => {
                // console.log("test selectInterval now !!");
                // console.log("this.selectQueue before clear: ", this.selectQueue.length);
                // تفريغ فوري للـ selectQueue وتمرير القيم
                const currentQueue = [...this.selectQueue];
                this.selectQueue = [];
                // console.log("currentQueue : ", currentQueue.length);
                // console.log("this.selectQueue after clear: ", this.selectQueue.length);
                if(currentQueue.length > 0) {
                    this.findInterval(currentQueue);
                }
                // console.log("this.selectQueue after findInterval: ", this.selectQueue.length);
            }, 500);
        }

        async findQueue(element) {
            return new Promise((resolve, reject) => {
                this.selectQueue.push({resolve, reject, query: element.filter, date: new Date(), ...element});
            });
        }

        parseSelect(queueData = null) {
            return new Promise((resolve, reject) => {
                try {
                    // console.log("queueData : ", queueData, "\n-------------------------\nthis.selectQueue : ", this.selectQueue);
                    const selectQueue = queueData || this.selectQueue;
                    // console.log("data : : : ", selectQueue);
                    const data = {};
                    // console.log("daaaaata : ", selectQueue, [...new Set(selectQueue.map(sq => sq.model.name))]);
                    const modules = [...new Set(selectQueue.map(sq => sq.model.name))];
                    for (let module of modules) {
                        // console.log("module : ", module);
                        data[module] = {};
                        for (let sq of selectQueue) {
                            if(sq.model.name === module){
                                let sqFilter = Object.keys(sq.filter).filter(key => key !== 'Op');
                                let filterKey = sqFilter[0] || sqFilter;
                                let filterValue = sq.filter[filterKey];
                                let operation = sq.filter.Op || Op.in; // Default to Op.in if no operation specified
                                let querySettings = {
                                    resolve: sq.resolve,
                                    reject: sq.reject,
                                    query: sq.query,
                                    operator: operation,
                                    filter: filterKey,
                                    filterVal: filterValue
                                }
                                
                                // Group by filter first, then by operation
                                if(!data[module][filterKey]) {
                                    data[module][filterKey] = {};
                                }
                                
                                if(!data[module][filterKey][operation.toString()]) {
                                    data[module][filterKey][operation.toString()] = {
                                        values: [],
                                        settings: [],
                                        model: sq.model, 
                                        operation: operation,
                                        minValue: null,
                                        maxValue: null
                                    };
                                }
                                
                                const operationData = data[module][filterKey][operation.toString()];
                                operationData.values.push({vals: filterValue, sets: querySettings});
                                // operationData.settings.push(querySettings);
                                
                                // For optimization: track min/max values for range operations
                                if (operation === Op.gt || operation === Op.gte) {
                                    operationData.minValue = operationData.minValue === null ? filterValue : Math.min(operationData.minValue, filterValue);
                                } else if (operation === Op.lt || operation === Op.lte) {
                                    operationData.maxValue = operationData.maxValue === null ? filterValue : Math.max(operationData.maxValue, filterValue);
                                } else if (operation === Op.between) {
                                    operationData.minValue = operationData.minValue === null ? filterValue[0] : Math.min(operationData.minValue, filterValue[0], filterValue[1]);
                                    operationData.maxValue = operationData.maxValue === null ? filterValue[1] : Math.max(operationData.maxValue, filterValue[0], filterValue[1]);

                                }
                            
                            }
                        }
                    }
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });

        }

        async execute(promises) {
            return new Promise(async (resolve, reject) => {
                try {
                    const batchSize = 10;
                    const results = [];

                    // تنفيذ الـ promises على دفعات
                    for (let i = 0; i < promises.length; i += batchSize) {
                        const batch = promises.slice(i, i + batchSize);
                        // console.log("batch : ", batch.length, batch);
                        let batchStart = Date.now();

                        // نستنى تنفيذ كل عناصر الدفعة
                        await Promise.all(
                            batch.map(async (b) => {
                                let batchResults = await b.query;
                                batchResults = batchResults.map((br) => br.dataValues || []);
                                console.log("batchResults : ", batchResults);

                                const settings = b.settings;
                                console.log("settings : ", settings.map(s => s.query));

                                let key = Object.keys(settings[0].query);
                                key = typeof key === 'string' ? key : key.filter(k => !k.Op)[0];
                                console.log("key : ", key);

                                if (settings[0].query.Op == Op.like) {
                                    const resultMap = new Map(batchResults.map(o => [o[key], o]));

                                    settings.forEach(br => {
                                        const pattern = br.query[key];
                                        const regexPattern = pattern
                                            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                                            .replace(/%/g, '.*')
                                            .replace(/_/g, '.');
                                        const regex = new RegExp(`^${regexPattern}$`, 'i');

                                        const matchingResults = [];
                                        for (const [value, result] of resultMap) {
                                            if (value && regex.test(value)) {
                                                matchingResults.push(result);
                                            }
                                        }

                                        const res = matchingResults.length > 0 ? matchingResults : null;
                                        results.push(res);
                                        br.resolve(Array.isArray(res) ? res : [res]);
                                    });

                                } else if (settings[0].query.Op == Op.in || !settings[0].query.Op) {
                                    let index = new Map(batchResults.map(o => { if (o[key]) return [o[key], o]; }));
                                    settings.forEach(br => {
                                        const res = index.get(br.query[key]) || null;
                                        results.push(res);
                                        console.log("res : ", res);
                                        br.resolve(Array.isArray(res) ? res : [res]);
                                    });

                                } else if (settings[0].query.Op == Op.between) {
                                    // 1) جهز البيانات: مصفوفة مرتبة بالقيم
                                    const sortedResults = batchResults
                                        .filter(o => o[key] !== null && o[key] !== undefined)
                                        .sort((a, b) => a[key] - b[key]);

                                    // دالة binary search ترجع أول index >= value
                                    function lowerBound(arr, value) {
                                        let low = 0, high = arr.length;
                                        while (low < high) {
                                            const mid = Math.floor((low + high) / 2);
                                            if (arr[mid][key] < value) low = mid + 1;
                                            else high = mid;
                                        }
                                        return low;
                                    }

                                    // دالة binary search ترجع أول index > value
                                    function upperBound(arr, value) {
                                        let low = 0, high = arr.length;
                                        while (low < high) {
                                            const mid = Math.floor((low + high) / 2);
                                            if (arr[mid][key] <= value) low = mid + 1;
                                            else high = mid;
                                        }
                                        return low;
                                    }

                                    // 2) عالج كل setting باستخدام البحث الثنائي
                                    settings.forEach(br => {
                                        const [minValue, maxValue] = br.query[key];
                                        const start = lowerBound(sortedResults, minValue);
                                        const end = upperBound(sortedResults, maxValue);

                                        const matchingResults = sortedResults.slice(start, end);
                                        const res = matchingResults.length > 0 ? matchingResults : [];

                                        results.push(res);
                                        br.resolve(Array.isArray(res) ? res : [res]);
                                    });
                                } else if (settings[0].query.Op == Op.gt || settings[0].query.Op == Op.gte) {
                                    const sortedResults = batchResults
                                        .filter(o => o[key] !== null && o[key] !== undefined)
                                        .sort((a, b) => a[key] - b[key]);

                                    function lowerBound(arr, value) {
                                        let low = 0, high = arr.length;
                                        while (low < high) {
                                            const mid = Math.floor((low + high) / 2);
                                            if (arr[mid][key] < value) low = mid + 1;
                                            else high = mid;
                                        }
                                        return low;
                                    }

                                    console.log("sortedResults : ", sortedResults);


                                    settings.forEach(br => {
                                        const threshold = br.query[key];
                                        const startIndex = (settings[0].query.Op === Op.gt)
                                            ? lowerBound(sortedResults, threshold + 1) // > threshold
                                            : lowerBound(sortedResults, threshold);    // >= threshold

                                        const matchingResults = sortedResults.slice(startIndex);
                                        const res = matchingResults.length > 0 ? matchingResults : [];
                                        results.push(res);
                                        br.resolve(Array.isArray(res) ? res : [res]);
                                    });

                                } else if (settings[0].query.Op == Op.lt || settings[0].query.Op == Op.lte) {
                                    const sortedResults = batchResults
                                        .filter(o => o[key] !== null && o[key] !== undefined)
                                        .sort((a, b) => a[key] - b[key]);

                                    function upperBound(arr, value) {
                                        let low = 0, high = arr.length;
                                        while (low < high) {
                                            const mid = Math.floor((low + high) / 2);
                                            if (arr[mid][key] <= value) low = mid + 1;
                                            else high = mid;
                                        }
                                        return low;
                                    }

                                    settings.forEach(br => {
                                        const threshold = br.query[key];
                                        const endIndex = (settings[0].query.Op === Op.lt)
                                            ? upperBound(sortedResults, threshold - 1) // < threshold
                                            : upperBound(sortedResults, threshold);    // <= threshold

                                        const matchingResults = sortedResults.slice(0, endIndex);
                                        const res = matchingResults.length > 0 ? matchingResults : [];
                                        results.push(res);
                                        br.resolve(Array.isArray(res) ? res : [res]);
                                    });
                                }




                            })
                        );

                        // console.log("batch time taken : ", Date.now() - batchStart);
                    }

                    resolve(results);
                } catch (error) {
                    reject(error);
                }
            });
        }


        async promisesParse(queueData = null){
            const queueParse = await this.parseSelect(queueData);
            // console.log("queueParse : ", queueParse.User.name[Object.keys(queueParse.User.name)[0]]);
            const promises = [];
            const CHUNK_SIZE = 100000; // Maximum values per chunk
            
            // Helper function to split array into chunks
            const chunkArray = (array, size) => {
                const chunks = [];
                for (let i = 0; i < array.length; i += size) {
                    let slice = array.slice(i, i + size);
                    chunks.push({chunksValues: slice.map(s => s.vals), chunkSettings: slice.map(s => s.sets)});
                }
                return chunks;
            };
            
            Object.keys(queueParse).map((module) => {
                Object.keys(queueParse[module]).map((filterKey) => {
                    Object.keys(queueParse[module][filterKey]).map((operationKey) => {
                        const filterData = queueParse[module][filterKey][operationKey];
                        const operation = filterData.operation;
                        
                        // For operations like Op.in, use array of values with chunking
                        // For range operations like Op.gt, Op.lt, use optimized single query
                        if (operation === Op.in) {
                            // Split values into chunks of CHUNK_SIZE
                            const valueChunks = chunkArray(filterData.values, CHUNK_SIZE);
                            valueChunks.forEach(chunk => {
                                console.log("filter data : ", { where: { [filterKey]: { [operation]: chunk.chunksValues } } }, chunk.chunksValues);
                                promises.push({ query: filterData.model.findAll({ 
                                    where: { [filterKey]: { [operation]: chunk.chunksValues } } 
                                }), settings: chunk.chunkSettings });
                            });

                        } else if (operation === Op.gt || operation === Op.gte) {
                            // Use minimum value to get all records that satisfy any of the conditions
                            console.log("filter data : ", { where: { [filterKey]: { [operation]: filterData.minValue } } });
                            promises.push({ query: filterData.model.findAll({ 
                                where: { [filterKey]: { [operation]: filterData.minValue } } 
                            }), settings: filterData.values.map(v => v.sets) });
                        } else if (operation === Op.lt || operation === Op.lte) {
                            // Use maximum value to get all records that satisfy any of the conditions
                            console.log("filter data : ", { where: { [filterKey]: { [operation]: filterData.maxValue } } });
                            promises.push({ query: filterData.model.findAll({ 
                                where: { [filterKey]: { [operation]: filterData.maxValue } } 
                            }), settings: filterData.values.map(v => v.sets) });
                        } else if (operation === Op.like || operation === Op.iLike) {
                            // For LIKE operations, use Op.or to combine multiple LIKE conditions with chunking
                            const valueChunks = chunkArray(filterData.values, CHUNK_SIZE);
                            valueChunks.forEach(chunk => {
                                const likeConditions = chunk.chunksValues.map(value => ({

                                    [filterKey]: { [operation]: value }
                                }));
                                console.log("filter data : ", { where: { [Op.or]: likeConditions } });
                                promises.push({ query: filterData.model.findAll({ 
                                    where: { [Op.or]: likeConditions }
                                }), settings: chunk.chunkSettings });
                            });

                        } else if (operation === Op.between) {
                            // For BETWEEN operations, use the min and max values
                            console.log("filter data : ", { where: { [filterKey]: { [Op.between]: [filterData.minValue, filterData.maxValue] } }, values: filterData.values, settings: filterData.values.sets });

                            promises.push({ query: filterData.model.findAll({ 
                                where: { [filterKey]: { [Op.between]: [filterData.minValue, filterData.maxValue] } }
                            }), settings: filterData.values.map(v => v.sets) });
                        } else {
                            // For other operations, execute each value separately for maximum flexibility
                            filterData.values.forEach(value => {
                                console.log("filter data : ", { where: { [filterKey]: { [operation]: value } } });
                                promises.push({ query: filterData.model.findAll({ 
                                    where: { [filterKey]: { [operation]: value } } 
                                }), settings: filterData.settings });
                            });
                        }
                    })
                })
            });

            return promises;
        }

        async findInterval(queueData = null) {
            // استخدام البيانات الممررة أو البيانات الحالية
            const currentSelectQueue = queueData || this.selectQueue;
            
            // تحديث this.selectQueue مؤقتاً للمعالجة
            const originalQueue = this.selectQueue;
            // this.selectQueue = currentSelectQueue;
            
            let promises = await this.promisesParse(currentSelectQueue);
            // console.log("promises :::::::::: ", promises.length);
            
            const executionPromises = Array.from({ length: 1 }).map(async (_, i) => {
                const startTime = Date.now();
                this.execute(promises);
                // console.log("time taken : ", (Date.now() - startTime) + "ms");
            });
            
            await Promise.all(executionPromises);
            
        }
    }

// const pgSQLM = new pgSQLManager();

// async function startTest(){
//     sequelize.authenticate();
//     console.log("Connected to database");

//     // for (let i = 0; i < 100000; i++) {
//     Array.from({ length: 100000 }).forEach(async (_, i) => {
//         // Test different operations
//         // if (i % 5 === 0) {
//             // Test Op.in (default)
//             let start = Date.now();
//             let res = await pgSQLM.findQueue(
//                 {model: User, filter: {name: `Test User ${0 + i}`}}
//             );
//             if(i == 10000) {
//                 console.log(`res 'Test User ${0 + i}' : `, res && res[0] || res);
//                 console.log("time taken : ", (Date.now() - start) + "ms");
//             }

//         // } else if (i % 5 === 1) {
//         //     // Test Op.gt
//             // let res = await pgSQLM.findQueue(
//             //     {model: User, filter: {id: 999990 , Op: Op.gt}}
//             // );
//             // if(i == 10000) {
//             //     console.log(`res 999000 + ${i} : `, res);
//             //     console.log("time taken : ", (Date.now() - start) + "ms");
//             // }

//         // } else if (i % 5 === 2) {
//         //     // Test Op.lt
//             // let res = await pgSQLM.findQueue(
//             //     {model: User, filter: {id: 1000, Op: Op.lt}}
//             // );
//             // if(i == 10000) {
//             //     console.log(`res 0 + ${i} : `, res);
//             //     console.log("time taken : ", (Date.now() - start) + "ms");
//             // }

//         //     console.log(`res ${i} : `, res && res[0] || res);
//         // } else if (i % 5 === 3) {
//         //     // Test Op.like
//             // let res = await pgSQLM.findQueue(
//             //     {model: User, filter: {name: `%User 70000%`, Op: Op.like}}
//             // );
//             // if(i == 10000) {
//             //     console.log(`res ${i} : `, res);
//             //     console.log("time taken : ", (Date.now() - start) + "ms");
//             // }
//         // } else {
//         //     // Test Op.between
//             // let res = await pgSQLM.findQueue(
//             //     {model: User, filter: {id: [100 + i, 700 + i], Op: Op.between}}
//             // );
//             // if(i == 100) {
//             //     console.log(`res ${i} : `, res);
//             //     console.log("time taken : ", (Date.now() - start) + "ms");
//             // }
//         // }

//     });

// }

// startTest();

export default pgSQLManager ;
