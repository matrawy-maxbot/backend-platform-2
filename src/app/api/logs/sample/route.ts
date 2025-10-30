import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ActivityLog {
  id: string
  timestamp: string
  user: string
  userId: string
  avatar?: string
  action: string
  section: string
  details: string
  type: 'create' | 'update' | 'delete' | 'system' | 'error'
  severity: 'info' | 'success' | 'warning' | 'error'
  serverId?: string
  metadata?: Record<string, any>
}

const LOGS_FILE_PATH = path.join(process.cwd(), 'data', 'logs', 'activity-logs.json')

// Ensure logs directory exists
function ensureLogsDirectory() {
  const logsDir = path.dirname(LOGS_FILE_PATH)
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }
}

// Read logs from file
function readLogs(): ActivityLog[] {
  ensureLogsDirectory()
  try {
    if (fs.existsSync(LOGS_FILE_PATH)) {
      const data = fs.readFileSync(LOGS_FILE_PATH, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading logs:', error)
    return []
  }
}

// Write logs to file
function writeLogs(logs: ActivityLog[]) {
  ensureLogsDirectory()
  try {
    fs.writeFileSync(LOGS_FILE_PATH, JSON.stringify(logs, null, 2))
  } catch (error) {
    console.error('Error writing logs:', error)
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Sample data templates
const sampleActivities = [
  {
    user: 'أحمد محمد',
    userId: '123456789012345678',
    action: 'إنشاء إعلان جديد',
    section: 'Ads',
    details: 'تم إنشاء إعلان جديد بعنوان "عرض خاص" في قناة #الإعلانات',
    type: 'create' as const,
    severity: 'success' as const,
  },
  {
    user: 'سارة أحمد',
    userId: '987654321098765432',
    action: 'تحديث إعدادات الحماية',
    section: 'Protection',
    details: 'تم تفعيل حماية ضد الرسائل المكررة مع حد أقصى 3 رسائل',
    type: 'update' as const,
    severity: 'warning' as const,
  },
  {
    user: 'محمد علي',
    userId: '456789123456789123',
    action: 'إضافة مشرف جديد',
    section: 'Admins',
    details: 'تم إضافة المستخدم @newadmin كمشرف في السيرفر',
    type: 'create' as const,
    severity: 'warning' as const,
  },
  {
    user: 'فاطمة حسن',
    userId: '789123456789123456',
    action: 'تحديث رسالة الترحيب',
    section: 'Members',
    details: 'تم تحديث رسالة الترحيب لتشمل قوانين السيرفر الجديدة',
    type: 'update' as const,
    severity: 'info' as const,
  },
  {
    user: 'عبدالله خالد',
    userId: '321654987321654987',
    action: 'إنشاء رد تلقائي',
    section: 'Auto Reply',
    details: 'تم إنشاء رد تلقائي للكلمة المفتاحية "مرحبا"',
    type: 'create' as const,
    severity: 'success' as const,
  },
  {
    user: 'System',
    userId: 'system',
    action: 'نسخة احتياطية تلقائية',
    section: 'System',
    details: 'تم إنشاء نسخة احتياطية تلقائية لإعدادات السيرفر',
    type: 'system' as const,
    severity: 'info' as const,
  },
  {
    user: 'نور الدين',
    userId: '654321987654321987',
    action: 'حذف إعلان منتهي الصلاحية',
    section: 'Ads',
    details: 'تم حذف إعلان "عرض الصيف" بسبب انتهاء صلاحيته',
    type: 'delete' as const,
    severity: 'warning' as const,
  },
  {
    user: 'System',
    userId: 'system',
    action: 'خطأ في الاتصال',
    section: 'System',
    details: 'فشل في الاتصال بخادم Discord API - سيتم إعادة المحاولة',
    type: 'error' as const,
    severity: 'error' as const,
  },
  {
    user: 'ليلى أحمد',
    userId: '147258369147258369',
    action: 'تحديث أدوار الأعضاء',
    section: 'Members',
    details: 'تم تحديث نظام الأدوار التلقائية للأعضاء الجدد',
    type: 'update' as const,
    severity: 'success' as const,
  },
  {
    user: 'يوسف محمد',
    userId: '963852741963852741',
    action: 'إزالة مشرف',
    section: 'Admins',
    details: 'تم إزالة صلاحيات الإشراف من المستخدم @oldadmin',
    type: 'delete' as const,
    severity: 'warning' as const,
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serverId } = body

    const logs = readLogs()
    const newLogs: ActivityLog[] = []

    // Generate 20 sample activities with random timestamps over the last 7 days
    for (let i = 0; i < 20; i++) {
      const template = sampleActivities[Math.floor(Math.random() * sampleActivities.length)]
      const randomDaysAgo = Math.floor(Math.random() * 7)
      const randomHoursAgo = Math.floor(Math.random() * 24)
      const randomMinutesAgo = Math.floor(Math.random() * 60)
      
      const timestamp = new Date()
      timestamp.setDate(timestamp.getDate() - randomDaysAgo)
      timestamp.setHours(timestamp.getHours() - randomHoursAgo)
      timestamp.setMinutes(timestamp.getMinutes() - randomMinutesAgo)

      const newLog: ActivityLog = {
        id: generateId(),
        timestamp: timestamp.toISOString(),
        ...template,
        serverId: serverId || undefined,
        avatar: `https://cdn.discordapp.com/avatars/${template.userId}/avatar_${Math.floor(Math.random() * 5)}.png`,
        metadata: {
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Dashboard Web Interface',
          sessionId: generateId().substring(0, 8)
        }
      }

      newLogs.push(newLog)
    }

    // Add new logs to the beginning
    const allLogs = [...newLogs, ...logs]

    // Keep only last 1000 logs
    if (allLogs.length > 1000) {
      allLogs.splice(1000)
    }

    writeLogs(allLogs)

    return NextResponse.json({ 
      success: true, 
      message: `تم إنشاء ${newLogs.length} نشاط تجريبي بنجاح`,
      count: newLogs.length 
    })
  } catch (error) {
    console.error('Error generating sample data:', error)
    return NextResponse.json({ error: 'Failed to generate sample data' }, { status: 500 })
  }
}