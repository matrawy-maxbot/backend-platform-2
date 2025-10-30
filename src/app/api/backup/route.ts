import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { 
  createBackup, 
  getBackupsList, 
  restoreFromBackup,
  getChangeLogs,
  cleanupOldBackups
} from '@/lib/database'
import { 
  getSchedulerStatus, 
  createImmediateBackup, 
  runImmediateHealthCheck,
  getBackupStats 
} from '@/lib/scheduler'

// GET - الحصول على قائمة النسخ الاحتياطية والإحصائيات
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const serverId = searchParams.get('serverId')
    const date = searchParams.get('date')

    switch (action) {
      case 'list':
        const backups = await getBackupsList()
        return NextResponse.json({ backups })

      case 'stats':
        const stats = await getBackupStats()
        return NextResponse.json({ stats })

      case 'scheduler-status':
        const schedulerStatus = getSchedulerStatus()
        return NextResponse.json({ scheduler: schedulerStatus })

      case 'logs':
        const logs = await getChangeLogs(serverId || undefined, date || undefined)
        return NextResponse.json({ logs })

      default:
        // إرجاع معلومات شاملة
        const [backupsList, backupStats, scheduler, changeLogs] = await Promise.all([
          getBackupsList(),
          getBackupStats(),
          getSchedulerStatus(),
          getChangeLogs()
        ])

        return NextResponse.json({
          backups: backupsList,
          stats: backupStats,
          scheduler,
          recentLogs: changeLogs.slice(0, 10)
        })
    }
  } catch (error) {
    console.error('Error in backup GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - إنشاء نسخة احتياطية أو تشغيل عمليات أخرى
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, serverId, backupFileName } = body

    switch (action) {
      case 'create-backup':
        const backupPath = await createImmediateBackup(serverId)
        return NextResponse.json({ 
          success: true, 
          message: 'Backup created successfully',
          backupPath 
        })

      case 'restore-backup':
        if (!backupFileName) {
          return NextResponse.json(
            { error: 'Backup filename is required' },
            { status: 400 }
          )
        }
        await restoreFromBackup(backupFileName)
        return NextResponse.json({ 
          success: true, 
          message: 'Data restored successfully' 
        })

      case 'health-check':
        await runImmediateHealthCheck()
        return NextResponse.json({ 
          success: true, 
          message: 'Health check completed' 
        })

      case 'cleanup':
        await cleanupOldBackups()
        return NextResponse.json({ 
          success: true, 
          message: 'Old backups cleaned up successfully' 
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in backup POST:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - حذف نسخة احتياطية
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const backupFileName = searchParams.get('backup')

    if (!backupFileName) {
      return NextResponse.json(
        { error: 'Backup filename is required' },
        { status: 400 }
      )
    }

    // حذف ملف النسخة الاحتياطية
    const fs = await import('fs/promises')
    const path = await import('path')
    const backupPath = path.join(process.cwd(), 'data', 'backups', backupFileName)
    
    await fs.unlink(backupPath)

    return NextResponse.json({ 
      success: true, 
      message: 'Backup deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting backup:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}