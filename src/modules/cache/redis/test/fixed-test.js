// تحميل متغيرات البيئة أولاً
import '../../../../config/index.js';

import Redis from 'ioredis';
import { RedisPoolManager } from '../config/redis.config.js';
import { redis } from '../../../../config/database.config.js';

/**
 * اختبار محسّن مع إصلاح مشاكل RedisPoolManager
 */
async function fixedRedisTest() {
  console.log('🚀 بدء الاختبار المحسّن لـ Redis');
  console.log('=' .repeat(60));
  
  let traditionalClient;
  let poolManager;
  
  try {
    console.log('📋 الخطوة 1: اختبار الاتصال التقليدي');
    traditionalClient = new Redis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
      db: redis.db,
      lazyConnect: true,
      connectTimeout: 5000,
      commandTimeout: 5000,
      maxRetriesPerRequest: 1
    });
    
    await traditionalClient.ping();
    console.log('✅ الاتصال التقليدي يعمل بنجاح');
    
    console.log('📋 الخطوة 2: اختبار Pool Manager مع إعدادات محسّنة');
    console.log('🔧 إنشاء Pool Manager مع 3 اتصالات فقط...');
    
    // إنشاء Pool Manager مع إعدادات محدودة
    poolManager = new RedisPoolManager({
      poolSize: 3, // عدد قليل من الاتصالات
      enableAutoPipelining: false, // تعطيل Auto Pipelining لتجنب التعقيد
      connectTimeout: 5000,
      commandTimeout: 5000,
      maxRetriesPerRequest: 1,
      lazyConnect: true
    });
    
    console.log('⏳ انتظار تهيئة Pool Manager...');
    
    // انتظار تهيئة Pool Manager مع timeout
    const poolReady = await Promise.race([
      new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkReady = () => {
          attempts++;
          console.log(`🔄 فحص ${attempts}/${maxAttempts}...`);
          
          try {
            const stats = poolManager.getStats();
            console.log(`📊 اتصالات صحية: ${stats.healthyConnections}/${stats.totalConnections}`);
            
            if (stats.healthyConnections >= 3) {
              console.log('✅ Pool Manager جاهز');
              resolve(true);
            } else if (attempts >= maxAttempts) {
              reject(new Error('انتهت مهلة انتظار Pool Manager'));
            } else {
              setTimeout(checkReady, 1000);
            }
          } catch (error) {
            console.error(`❌ خطأ في فحص Pool Manager: ${error.message}`);
            if (attempts >= maxAttempts) {
              reject(error);
            } else {
              setTimeout(checkReady, 1000);
            }
          }
        };
        
        checkReady();
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('انتهت مهلة الانتظار (30 ثانية)')), 30000);
      })
    ]);
    
    if (poolReady) {
      console.log('📋 الخطوة 3: اختبار العمليات الأساسية');
      
      // اختبار SET/GET مع Pool Manager
      console.log('📝 اختبار SET مع Pool Manager...');
      await poolManager.set('pool_test', 'pool_value');
      console.log('✅ SET نجح');
      
      console.log('📖 اختبار GET مع Pool Manager...');
      const value = await poolManager.get('pool_test');
      console.log(`✅ GET نجح: ${value}`);
      
      console.log('🧹 تنظيف...');
      await poolManager.del('pool_test');
      console.log('✅ تم التنظيف');
      
      // عرض الإحصائيات النهائية
      const finalStats = poolManager.getStats();
      console.log('\n📊 إحصائيات Pool Manager:');
      console.log(`🔗 إجمالي الاتصالات: ${finalStats.totalConnections}`);
      console.log(`💚 الاتصالات الصحية: ${finalStats.healthyConnections}`);
      console.log(`📈 إجمالي العمليات: ${finalStats.totalCommands}`);
      console.log(`✅ العمليات الناجحة: ${finalStats.successfulCommands}`);
      console.log(`❌ العمليات الفاشلة: ${finalStats.failedCommands}`);
      console.log(`📊 معدل النجاح: ${finalStats.successRate}`);
      
      console.log('\n🎉 جميع الاختبارات نجحت!');
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    console.error('🔍 تفاصيل الخطأ:', error.stack);
    
    // تحليل المشكلة
    console.log('\n🔍 تحليل المشكلة:');
    if (error.message.includes('انتهت مهلة')) {
      console.log('⚠️ المشكلة: Pool Manager يستغرق وقتاً طويلاً في التهيئة');
      console.log('💡 السبب المحتمل: إنشاء اتصالات كثيرة جداً');
      console.log('🔧 الحل المقترح: تقليل عدد الاتصالات في poolSize');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('⚠️ المشكلة: لا يمكن الاتصال بـ Redis');
      console.log('💡 تأكد من تشغيل Redis على localhost:6379');
    }
    
  } finally {
    console.log('\n🧹 تنظيف الموارد...');
    
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
    
    console.log('🏁 انتهى الاختبار');
  }
}

// تشغيل الاختبار
fixedRedisTest();