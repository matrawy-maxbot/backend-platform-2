// تحميل متغيرات البيئة أولاً
import '../../../../config/index.js';

import Redis from 'ioredis';
import { redis } from '../../../../config/database.config.js';

/**
 * اختبار تشخيصي لفهم مشكلة Redis
 */
async function diagnosticTest() {
  console.log('🔍 بدء الاختبار التشخيصي لـ Redis');
  console.log('=' .repeat(50));
  
  // طباعة إعدادات Redis
  console.log('📋 إعدادات Redis:');
  console.log(`Host: ${redis.host}`);
  console.log(`Port: ${redis.port}`);
  console.log(`Password: ${redis.password ? '***' : 'لا يوجد'}`);
  console.log(`Database: ${redis.db}`);
  console.log('');
  
  let client;
  
  try {
    console.log('🔌 إنشاء اتصال واحد بسيط...');
    client = new Redis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
      db: redis.db,
      lazyConnect: true,
      connectTimeout: 5000,
      commandTimeout: 5000,
      maxRetriesPerRequest: 1
    });
    
    console.log('🏓 اختبار ping...');
    const pingResult = await client.ping();
    console.log(`✅ Ping نجح: ${pingResult}`);
    
    console.log('📝 اختبار SET...');
    await client.set('diagnostic_test', 'success');
    console.log('✅ SET نجح');
    
    console.log('📖 اختبار GET...');
    const value = await client.get('diagnostic_test');
    console.log(`✅ GET نجح: ${value}`);
    
    console.log('🧹 تنظيف...');
    await client.del('diagnostic_test');
    console.log('✅ تم التنظيف');
    
    console.log('');
    console.log('🎉 جميع الاختبارات نجحت!');
    console.log('✅ Redis يعمل بشكل صحيح');
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    console.error('🔍 تفاصيل الخطأ:', error.stack);
  } finally {
    if (client) {
      try {
        console.log('🔌 إغلاق الاتصال...');
        await client.quit();
        console.log('✅ تم إغلاق الاتصال');
      } catch (error) {
        console.error('❌ خطأ في إغلاق الاتصال:', error.message);
      }
    }
  }
  
  console.log('🏁 انتهى الاختبار التشخيصي');
}

// تشغيل الاختبار
diagnosticTest();