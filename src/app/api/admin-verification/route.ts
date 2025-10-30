import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmins } from '../servers/[serverId]/current-admins/data-store'

export async function POST(request: NextRequest) {
  try {
    const { discordId, serverId } = await request.json()

    if (!discordId || !serverId) {
      return NextResponse.json(
        { error: 'Discord ID and Server ID are required' },
        { status: 400 }
      )
    }

    // Get current admins for the server
    const admins = getCurrentAdmins(serverId)
    
    // Check if the user is an admin
    const isAdmin = admins.some(admin => admin.discordId === discordId)

    if (isAdmin) {
      return NextResponse.json({
        success: true,
        isAdmin: true,
        message: 'Admin verification successful'
      })
    } else {
      return NextResponse.json({
        success: false,
        isAdmin: false,
        message: 'User is not an admin for this server'
      }, { status: 403 })
    }

  } catch (error) {
    console.error('Admin verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}