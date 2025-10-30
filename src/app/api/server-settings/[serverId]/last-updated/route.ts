import { NextRequest, NextResponse } from 'next/server';
import { readServersData } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      );
    }
    
    // قراءة بيانات السيرفرات
    const serversData = await readServersData();
    const serverData = serversData[serverId];
    
    if (!serverData) {
      return NextResponse.json(
        { error: 'Server not found' },
        { status: 404 }
      );
    }
    
    // الحصول على آخر تحديث من updatedAt أو إنشاء timestamp افتراضي
    const lastUpdated = serverData.updatedAt 
      ? new Date(serverData.updatedAt).getTime()
      : Date.now();
    
    // تحديد الأقسام المتاحة
    const sections = {
      autoReply: !!serverData.autoReply,
      ads: !!serverData.ads,
      members: !!serverData.members,
      protection: !!serverData.protection,
      backup: !!serverData.backup
    };
    
    return NextResponse.json({
      serverId,
      lastUpdated,
      sections,
      serverTime: Date.now()
    });
    
  } catch (error) {
    console.error('❌ Error getting server last updated:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}