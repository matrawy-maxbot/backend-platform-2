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

// Read logs from file
function readLogs(): ActivityLog[] {
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

// Convert logs to CSV format
function convertToCSV(logs: ActivityLog[]): string {
  const headers = [
    'ID',
    'التاريخ والوقت',
    'المستخدم',
    'معرف المستخدم',
    'الإجراء',
    'القسم',
    'التفاصيل',
    'النوع',
    'الأهمية',
    'معرف السيرفر'
  ]

  const csvRows = [headers.join(',')]

  logs.forEach(log => {
    const row = [
      `"${log.id}"`,
      `"${new Date(log.timestamp).toLocaleString('ar-SA')}"`,
      `"${log.user}"`,
      `"${log.userId}"`,
      `"${log.action}"`,
      `"${log.section}"`,
      `"${log.details.replace(/"/g, '""')}"`,
      `"${log.type}"`,
      `"${log.severity}"`,
      `"${log.serverId || ''}"`
    ]
    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const serverId = searchParams.get('serverId')
    const type = searchParams.get('type')
    const section = searchParams.get('section')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let logs = readLogs()

    // Apply filters
    if (serverId) {
      logs = logs.filter(log => log.serverId === serverId)
    }

    if (type) {
      logs = logs.filter(log => log.type === type)
    }

    if (section) {
      logs = logs.filter(log => log.section === section)
    }

    if (startDate) {
      const start = new Date(startDate)
      logs = logs.filter(log => new Date(log.timestamp) >= start)
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // End of day
      logs = logs.filter(log => new Date(log.timestamp) <= end)
    }

    if (format === 'csv') {
      const csv = convertToCSV(logs)
      const filename = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache'
        }
      })
    } else if (format === 'json') {
      const filename = `activity-logs-${new Date().toISOString().split('T')[0]}.json`
      
      return new NextResponse(JSON.stringify(logs, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache'
        }
      })
    } else {
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error exporting logs:', error)
    return NextResponse.json({ error: 'Failed to export logs' }, { status: 500 })
  }
}