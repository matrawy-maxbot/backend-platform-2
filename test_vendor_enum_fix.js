import { VendorService } from './src/modules/database/postgreSQL/index.js';

/**
 * اختبار تحديث vendor مع enum status لاختبار الحل
 */
async function testVendorEnumUpdate() {
  try {
    console.log('🧪 اختبار تحديث vendor مع enum status...');
    
    // محاولة تحديث vendor بـ status جديد و approved_at
    const vendorId = 4; // استخدام نفس الـ ID من الخطأ
    const updateData = {
      status: 'active',
      verification_status: 'verified',
      business_name: 'متجر محدث',
      approved_by: '1',
      approved_at: new Date() // اختبار timestamp
    };
    
    console.log(`📝 محاولة تحديث vendor ${vendorId} مع البيانات:`, updateData);
    
    const result = await VendorService.updateVendor(vendorId, updateData);
    
    console.log('✅ تم تحديث vendor بنجاح!');
    console.log('📊 النتيجة:', result);
    
  } catch (error) {
    console.error('❌ خطأ في اختبار تحديث vendor:', error.message);
    console.error('📋 تفاصيل الخطأ:', error);
  }
}

// تشغيل الاختبار
testVendorEnumUpdate()
  .then(() => {
    console.log('🏁 انتهى الاختبار');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 فشل الاختبار:', error);
    process.exit(1);
  });