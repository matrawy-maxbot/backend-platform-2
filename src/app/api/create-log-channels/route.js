import { NextResponse } from 'next/server'

// قائمة القنوات المطلوبة مع أسمائها ووصفها
const LOG_CHANNELS = [
  {
    key: 'joinLeave',
    name: 'join-leave-log',
    topic: 'سجلات انضمام ومغادرة الأعضاء من السيرفر'
  },
  {
    key: 'kickBan', 
    name: 'kick-ban-log',
    topic: 'سجلات طرد وحظر الأعضاء'
  },
  {
    key: 'members',
    name: 'members-log', 
    topic: 'سجلات تغييرات بيانات الأعضاء'
  },
  {
    key: 'serverSettings',
    name: 'server-settings-log',
    topic: 'سجلات تغييرات إعدادات السيرفر'
  },
  {
    key: 'roles',
    name: 'roles-log',
    topic: 'سجلات تغييرات الرتب'
  },
  {
    key: 'channels',
    name: 'channels-log', 
    topic: 'سجلات إنشاء وحذف وتعديل القنوات'
  },
  {
    key: 'messages',
    name: 'messages-log',
    topic: 'سجلات حذف وتعديل الرسائل'
  }
]

export async function POST(request) {
  try {
    const { serverId } = await request.json()
    
    if (!serverId) {
      return NextResponse.json({
        success: false,
        error: 'Server ID is required'
      }, { status: 400 })
    }

    // إرسال طلب إلى البوت لإنشاء القنوات
    const botResponse = await fetch('http://localhost:3001/api/create-log-channels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOT_API_SECRET || 'default-secret'}`
      },
      body: JSON.stringify({
        serverId,
        channels: LOG_CHANNELS
      })
    })

    if (!botResponse.ok) {
      const errorData = await botResponse.json().catch(() => ({ error: 'خطأ في الاتصال مع البوت' }))
      return NextResponse.json({
        success: false,
        error: errorData.error || 'فشل في إنشاء القنوات'
      }, { status: botResponse.status })
    }

    const result = await botResponse.json()
    
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء قنوات Log بنجاح',
      data: result.data
    })

  } catch (error) {
    console.error('خطأ في إنشاء قنوات Log:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ داخلي في الخادم'
    }, { status: 500 })
  }
}