import '../../../../config/index.js'

import { RedisPoolManager } from '../config/redis.config.js';
import '../../../../config/index.js'; // تحميل متغيرات البيئة

console.log('🧪 Testing Simplified Redis Pool Manager...');

async function testSimplifiedRedis() {
  let poolManager;
  
  try {
    // إنشاء مدير المجموعة مع إعدادات بسيطة
    poolManager = new RedisPoolManager({
      poolSize: 3 // عدد قليل من الاتصالات للاختبار
    });
    
    console.log('⏳ Waiting for pool initialization...');
    
    // انتظار قصير للتأكد من تهيئة الاتصالات
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n📊 Initial Stats:');
    console.log(poolManager.getStats());
    
    // اختبار أوامر بسيطة
    console.log('\n🔧 Testing basic commands...');
    
    // اختبار SET
    await poolManager.executeCommand('set', ['test:key', 'Hello World']);
    console.log('✅ SET command successful');
    
    // اختبار GET
    const value = await poolManager.executeCommand('get', ['test:key']);
    console.log(`✅ GET command successful: ${value}`);
    
    // اختبار PING
    const pingResult = await poolManager.executeCommand('ping');
    console.log(`✅ PING command successful: ${pingResult}`);
    
    // اختبار Pipeline
    console.log('\n🔧 Testing pipeline...');
    const pipelineCommands = [
      ['set', 'test:key1', 'value1'],
      ['set', 'test:key2', 'value2'],
      ['get', 'test:key1'],
      ['get', 'test:key2']
    ];
    
    const pipelineResults = await poolManager.executePipeline(pipelineCommands);
    console.log('✅ Pipeline commands successful:', pipelineResults.length, 'results');
    
    // تنظيف البيانات التجريبية
    await poolManager.executeCommand('del', ['test:key', 'test:key1', 'test:key2']);
    console.log('✅ Cleanup successful');
    
    console.log('\n📊 Final Stats:');
    console.log(poolManager.getStats());
    
    console.log('\n🎉 All tests passed! Simplified Redis Pool Manager is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    if (poolManager) {
      await poolManager.shutdown();
    }
  }
}

// تشغيل الاختبار
testSimplifiedRedis();