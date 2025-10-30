import { NextRequest, NextResponse } from 'next/server';

// متغير لتخزين آخر heartbeat من البوت
let lastBotHeartbeat = {
  timestamp: 0,
  status: 'offline',
  guildsCount: 0
};

// POST - استقبال heartbeat من البوت
export async function POST(request: NextRequest) {
  try {
    // التحقق من authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.BOT_API_SECRET || 'default-secret';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { timestamp, status, guildsCount } = body;
    
    // تحديث معلومات heartbeat
    lastBotHeartbeat = {
      timestamp: timestamp || Date.now(),
      status: status || 'online',
      guildsCount: guildsCount || 0
    };
    
    console.log('💓 Bot heartbeat received:', lastBotHeartbeat);
    
    return NextResponse.json({
      success: true,
      message: 'Heartbeat received',
      serverTime: Date.now()
    });
    
  } catch (error) {
    console.error('❌ Error handling bot heartbeat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - الحصول على حالة البوت
export async function GET() {
  try {
    const now = Date.now();
    const timeSinceLastHeartbeat = now - lastBotHeartbeat.timestamp;
    const isOnline = timeSinceLastHeartbeat < 60000; // أقل من دقيقة
    
    return NextResponse.json({
      botStatus: {
        isOnline,
        lastHeartbeat: lastBotHeartbeat.timestamp,
        timeSinceLastHeartbeat,
        status: isOnline ? lastBotHeartbeat.status : 'offline',
        guildsCount: lastBotHeartbeat.guildsCount
      },
      serverTime: now
    });
    
  } catch (error) {
    console.error('❌ Error getting bot status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}