import { NextRequest, NextResponse } from 'next/server';
import { readServersData, writeServersData } from '@/lib/database';

// دالة لإشعار البوت بتحديث الإعدادات
async function notifyBotSettingsUpdate(serverId: string, section: string, data: any) {
  try {
    // إرسال طلب POST للبوت لتحديث cache الإعدادات
    const botNotifyUrl = process.env.BOT_NOTIFY_URL || 'http://localhost:3003/api/settings-update'
    
    const response = await fetch(botNotifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOT_API_SECRET || 'default-secret'}`
      },
      body: JSON.stringify({
        serverId,
        section,
        data,
        timestamp: Date.now()
      })
    })
    
    if (response.ok) {
      console.log('✅ Bot notified successfully of ad disable')
    } else {
      console.warn('⚠️ Bot notification failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ Error notifying bot:', error)
    // لا نرمي الخطأ هنا لأن تعطيل الإعلان نجح، فقط الإشعار فشل
  }
}

export async function POST(request: NextRequest) {
  try {
    const { serverId, adId } = await request.json();
    
    if (!serverId || !adId) {
      return NextResponse.json(
        { error: 'Server ID and Ad ID are required' },
        { status: 400 }
      );
    }
    
    // قراءة البيانات الحالية
    const allData = await readServersData();
    const serverData = allData[serverId];
    
    if (!serverData || !serverData.ads || !serverData.ads.ads) {
      return NextResponse.json(
        { error: 'No ads data found for server' },
        { status: 404 }
      );
    }
    
    // البحث عن الإعلان وتعطيله
    const adIndex = serverData.ads.ads.findIndex((ad: any) => ad.id === adId);
    if (adIndex !== -1) {
      serverData.ads.ads[adIndex].enabled = false;
      // إضافة علامة التعطيل النهائي للإعلانات المنشورة
      serverData.ads.ads[adIndex].permanentlyDisabled = true;
      serverData.ads.ads[adIndex].disabledAt = new Date().toISOString();
      serverData.ads.ads[adIndex].disableReason = 'Published and automatically disabled';
      serverData.updatedAt = new Date().toISOString();
      
      // حفظ البيانات المحدثة
      allData[serverId] = serverData;
      await writeServersData(allData);
      
      // إشعار البوت بتحديث إعدادات الإعلانات
      try {
        await notifyBotSettingsUpdate(serverId, 'ads', serverData.ads);
      } catch (notifyError) {
        console.error('❌ Failed to notify bot, but ad was disabled successfully:', notifyError);
      }
      
      return NextResponse.json({
        success: true,
        message: 'Ad disabled successfully',
        adTitle: serverData.ads.ads[adIndex].title
      });
    } else {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error disabling ad:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}