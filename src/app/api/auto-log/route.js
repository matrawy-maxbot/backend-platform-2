import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'bot', 'data', 'auto-log-settings.json');

// التأكد من وجود مجلد البيانات
function ensureDataDirectory() {
  const dataDir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// قراءة إعدادات Auto Log
function readSettings() {
  ensureDataDirectory();
  
  if (!fs.existsSync(SETTINGS_FILE)) {
    return {};
  }
  
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('خطأ في قراءة إعدادات Auto Log:', error);
    return {};
  }
}

// كتابة إعدادات Auto Log
function writeSettings(settings) {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('خطأ في كتابة إعدادات Auto Log:', error);
    return false;
  }
}

// GET - استرجاع إعدادات Auto Log لخادم معين
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
      settings: serverSettings
    });

  } catch (error) {
    console.error('خطأ في استرجاع إعدادات Auto Log:', error);
    return NextResponse.json(
      { error: 'خطأ في استرجاع الإعدادات' },
      { status: 500 }
    );
  }
}

// POST - حفظ إعدادات Auto Log لخادم معين
export async function POST(request) {
  try {
    const { serverId, settings } = await request.json();
    
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
      ...settings,
      lastUpdated: new Date().toISOString()
    };

    // حفظ الإعدادات
    const success = writeSettings(allSettings);
    
    if (!success) {
      return NextResponse.json(
        { error: 'فشل في حفظ الإعدادات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات Auto Log بنجاح',
      settings: allSettings[serverId]
    });

  } catch (error) {
    console.error('خطأ في حفظ إعدادات Auto Log:', error);
    return NextResponse.json(
      { error: 'خطأ في حفظ الإعدادات' },
      { status: 500 }
    );
  }
}

// PUT - تحديث إعدادات Auto Log لخادم معين
export async function PUT(request) {
  return POST(request); // نفس منطق POST
}

// DELETE - حذف إعدادات Auto Log لخادم معين
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
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف إعدادات Auto Log بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف إعدادات Auto Log:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف الإعدادات' },
      { status: 500 }
    );
  }
}