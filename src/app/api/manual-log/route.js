import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'bot', 'data', 'manual-log-settings.json');

// التأكد من وجود مجلد البيانات
function ensureDataDirectory() {
  const dataDir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// قراءة إعدادات Manual Log
function readSettings() {
  ensureDataDirectory();
  
  if (!fs.existsSync(SETTINGS_FILE)) {
    return {};
  }
  
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('خطأ في قراءة إعدادات Manual Log:', error);
    return {};
  }
}

// كتابة إعدادات Manual Log
function writeSettings(settings) {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('خطأ في كتابة إعدادات Manual Log:', error);
    return false;
  }
}

// GET - استرجاع إعدادات Manual Log لخادم معين
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('serverId');
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'معرف الخادم مطلوب' },
        { status: 400 }
      );
    }
    
    const allSettings = readSettings();
    const serverSettings = allSettings[serverId] || {
      serverId,
      enabled: false,
      channelId: null,
      categories: {
        joinLeave: { enabled: false, channelId: null },
        kickBan: { enabled: false, channelId: null },
        members: { enabled: false, channelId: null },
        serverSettings: { enabled: false, channelId: null },
        roles: { enabled: false, channelId: null },
        channels: { enabled: false, channelId: null },
        messages: { enabled: false, channelId: null },
        adminActions: { enabled: false, channelId: null }
      }
    };
    
    return NextResponse.json({
      success: true,
      data: serverSettings
    });
    
  } catch (error) {
    console.error('خطأ في استرجاع إعدادات Manual Log:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    );
  }
}

// POST - حفظ إعدادات Manual Log لخادم معين
export async function POST(request) {
  try {
    const body = await request.json();
    const { serverId, settings } = body;
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'معرف الخادم مطلوب' },
        { status: 400 }
      );
    }
    
    if (!settings) {
      return NextResponse.json(
        { error: 'الإعدادات مطلوبة' },
        { status: 400 }
      );
    }
    
    // قراءة الإعدادات الحالية
    const allSettings = readSettings();
    
    // تحديث إعدادات الخادم
    allSettings[serverId] = {
      serverId,
      enabled: settings.enabled || false,
      channelId: settings.channelId || null,
      categories: {
        joinLeave: {
          enabled: settings.categories?.joinLeave?.enabled || false,
          channelId: settings.categories?.joinLeave?.channelId || null
        },
        kickBan: {
          enabled: settings.categories?.kickBan?.enabled || false,
          channelId: settings.categories?.kickBan?.channelId || null
        },
        members: {
          enabled: settings.categories?.members?.enabled || false,
          channelId: settings.categories?.members?.channelId || null
        },
        serverSettings: {
          enabled: settings.categories?.serverSettings?.enabled || false,
          channelId: settings.categories?.serverSettings?.channelId || null
        },
        roles: {
          enabled: settings.categories?.roles?.enabled || false,
          channelId: settings.categories?.roles?.channelId || null
        },
        channels: {
          enabled: settings.categories?.channels?.enabled || false,
          channelId: settings.categories?.channels?.channelId || null
        },
        messages: {
          enabled: settings.categories?.messages?.enabled || false,
          channelId: settings.categories?.messages?.channelId || null
        },
        adminActions: {
          enabled: settings.categories?.adminActions?.enabled || false,
          channelId: settings.categories?.adminActions?.channelId || null
        }
      },
      updatedAt: new Date().toISOString()
    };
    
    // حفظ الإعدادات
    const success = writeSettings(allSettings);
    
    if (!success) {
      return NextResponse.json(
        { error: 'فشل في حفظ الإعدادات' },
        { status: 500 }
      );
    }
    
    // إشعار البوت بالتحديث (إذا كان متاحاً)
    try {
      const response = await fetch(`http://localhost:${process.env.BOT_API_PORT || 3001}/api/manual-log/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverId,
          settings: allSettings[serverId]
        })
      });
      
      if (!response.ok) {
        console.warn('تحذير: فشل في إشعار البوت بتحديث إعدادات Manual Log');
      }
    } catch (error) {
      console.warn('تحذير: لا يمكن الاتصال بالبوت لتحديث إعدادات Manual Log:', error.message);
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات Manual Log بنجاح',
      data: allSettings[serverId]
    });
    
  } catch (error) {
    console.error('خطأ في حفظ إعدادات Manual Log:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    );
  }
}

// PUT - تحديث إعدادات Manual Log لخادم معين
export async function PUT(request) {
  return POST(request); // استخدام نفس منطق POST للتحديث
}

// DELETE - حذف إعدادات Manual Log لخادم معين
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('serverId');
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'معرف الخادم مطلوب' },
        { status: 400 }
      );
    }
    
    const allSettings = readSettings();
    
    if (allSettings[serverId]) {
      delete allSettings[serverId];
      const success = writeSettings(allSettings);
      
      if (!success) {
        return NextResponse.json(
          { error: 'فشل في حذف الإعدادات' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'تم حذف إعدادات Manual Log بنجاح'
      });
    } else {
      return NextResponse.json(
        { error: 'إعدادات الخادم غير موجودة' },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('خطأ في حذف إعدادات Manual Log:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    );
  }
}