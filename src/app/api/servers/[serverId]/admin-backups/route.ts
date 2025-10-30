import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getBackupsList, restoreFromBackup, cleanupOldBackups, createBackup } from '@/lib/admin-database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const { serverId } = await params
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      )
    }

    // Get list of backups for the server
    const allBackups = await getBackupsList()
    // Filter backups for this specific server
    const serverBackups = allBackups.filter(backup => backup.serverId === serverId)
    
    return NextResponse.json({ backups: serverBackups })
    
  } catch (error) {
    console.error('Error fetching backups list:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const { serverId } = await params
    const body = await request.json()
    const { action, backupFileName } = body
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'create':
        await createBackup(serverId, 'manual_backup')
        return NextResponse.json({ success: true, message: 'Backup created successfully' })
      
      case 'restore':
        if (!backupFileName) {
          return NextResponse.json(
            { error: 'Backup file name is required for restore' },
            { status: 400 }
          )
        }
        const restored = await restoreFromBackup(backupFileName)
        if (restored) {
          return NextResponse.json({ success: true, message: 'Backup restored successfully' })
        } else {
          return NextResponse.json(
            { error: 'Failed to restore backup' },
            { status: 500 }
          )
        }
      
      case 'cleanup':
        const deletedCount = await cleanupOldBackups(30) // Keep backups for 30 days
        return NextResponse.json({ 
          success: true, 
          message: `Cleaned up ${deletedCount} old backups successfully` 
        })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: create, restore, cleanup' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('Error handling backup operation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}