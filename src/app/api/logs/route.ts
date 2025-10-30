import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Define the structure for activity logs
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

// GET - Retrieve logs with filtering (no authentication required for reading)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const section = searchParams.get('section')
    const serverId = searchParams.get('serverId')
    const search = searchParams.get('search')
    const date = searchParams.get('date')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    console.log('🔍 API: GET /api/logs called with params:', { type, section, serverId, limit, offset })

    let logs = readLogs()

    // Apply filters
    if (type && type !== 'all') {
      logs = logs.filter(log => log.type === type)
    }
    if (section && section !== 'all') {
      logs = logs.filter(log => log.section === section)
    }
    if (serverId) {
      logs = logs.filter(log => log.serverId === serverId)
    }
    if (search) {
      const searchLower = search.toLowerCase()
      logs = logs.filter(log => 
        log.user.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower) ||
        log.section.toLowerCase().includes(searchLower)
      )
    }
    if (date) {
      const filterDate = new Date(date)
      const nextDay = new Date(filterDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      logs = logs.filter(log => {
        const logDate = new Date(log.timestamp)
        return logDate >= filterDate && logDate < nextDay
      })
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply pagination
    const paginatedLogs = logs.slice(offset, offset + limit)
    
    console.log('🔍 API: Returning', paginatedLogs.length, 'logs out of', logs.length, 'total')

    return NextResponse.json({
      logs: paginatedLogs,
      total: logs.length,
      hasMore: offset + limit < logs.length
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

// POST - Add new log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newLog: ActivityLog = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      user: body.user || 'Unknown',
      userId: body.userId || 'unknown',
      avatar: body.avatar,
      action: body.action,
      section: body.section,
      details: body.details,
      type: body.type || 'system',
      severity: body.severity || 'info',
      serverId: body.serverId,
      metadata: body.metadata
    }

    const logs = readLogs()
    logs.unshift(newLog) // Add to beginning for newest first

    // Keep only last 1000 logs to prevent file from growing too large
    if (logs.length > 1000) {
      logs.splice(1000)
    }

    writeLogs(logs)

    return NextResponse.json({ success: true, log: newLog })
  } catch (error) {
    console.error('Error adding log:', error)
    return NextResponse.json({ error: 'Failed to add log' }, { status: 500 })
  }
}

// DELETE - Clear logs (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const confirm = searchParams.get('confirm')
    
    if (confirm !== 'true') {
      return NextResponse.json({ error: 'Confirmation required' }, { status: 400 })
    }

    writeLogs([])
    
    return NextResponse.json({ success: true, message: 'All logs cleared' })
  } catch (error) {
    console.error('Error clearing logs:', error)
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 })
  }
}