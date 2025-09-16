// تحميل متغيرات البيئة أولاً
import '../../../../config/index.js';

import Redis from 'ioredis';
import { RedisPoolManager } from '../config/redis.config.js';
import { redis } from '../../../../config/database.config.js';

/**
 * اختبار بسيط للتأكد من عمل Redis
 */
async function simpleRedisTest() {
  console.log('🚀 بدء الاختبار البسيط لـ Redis');
  
  let traditionalClient;
  let poolManager;
  
  try {
    // اختبار الاتصال التقليدي
    console.log('📡 اختبار الاتصال التقليدي...');
    traditionalClient = new Redis({
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
    
    const pingResult = await traditionalClient.ping();
    console.log('✅ الاتصال التقليدي يعمل:', pingResult);
    
    // اختبار عملية SET/GET بسيطة
    await traditionalClient.set('test_key', 'test_value');
    const getValue = await traditionalClient.get('test_key');
    console.log('✅ اختبار SET/GET التقليدي نجح:', getValue);
    
    // اختبار Pool Manager
    console.log('🔄 اختبار Pool Manager...');
    poolManager = new RedisPoolManager({
      poolSize: 5,
      enableAutoPipelining: true,
      connectTimeout: 5000,
      commandTimeout: 5000
    });
    
    // انتظار تهيئة Pool Manager
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkReady = () => {
        attempts++;
        const stats = poolManager.getStats();
        console.log(`محاولة ${attempts}: اتصالات صحية = ${stats.healthyConnections}`);
        
        if (stats.healthyConnections > 0) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('فشل في تهيئة Pool Manager'));
        } else {
          setTimeout(checkReady, 200);
        }
      };
      checkReady();
    });
    
    console.log('✅ Pool Manager جاهز');
    
    // اختبار عملية SET/GET مع Pool Manager
    await poolManager.set('pool_test_key', 'pool_test_value');
    const poolGetValue = await poolManager.get('pool_test_key');
    console.log('✅ اختبار SET/GET مع Pool Manager نجح:', poolGetValue);
    
    // عرض إحصائيات Pool Manager
    const finalStats = poolManager.getStats();
    console.log('📊 إحصائيات Pool Manager النهائية:', finalStats);
    
    console.log('🎉 جميع الاختبارات نجحت!');
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    console.error('تفاصيل الخطأ:', error.stack);
    process.exit(1);
  } finally {
    // تنظيف الموارد
    console.log('🧹 تنظيف الموارد...');
    
    if (traditionalClient) {
      try {
        await traditionalClient.quit();
        console.log('✅ تم إغلاق الاتصال التقليدي');
      } catch (error) {
        console.error('❌ خطأ في إغلاق الاتصال التقليدي:', error.message);
      }
    }
    
    if (poolManager) {
      try {
        await poolManager.shutdown();
        console.log('✅ تم إغلاق Pool Manager');
      } catch (error) {
        console.error('❌ خطأ في إغلاق Pool Manager:', error.message);
      }
    }
    
    console.log('✅ تم تنظيف جميع الموارد');
  }
}

// تشغيل الاختبار
simpleRedisTest();