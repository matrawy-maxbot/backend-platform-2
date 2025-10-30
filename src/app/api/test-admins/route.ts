import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmins } from '../servers/[serverId]/current-admins/data-store'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const serverId = url.searchParams.get('serverId') || '423067123225722891'
    
    const admins = getCurrentAdmins(serverId)
    
    return NextResponse.json({
      serverId,
      admins,
      count: admins.length
    })
  } catch (error) {
    console.error('Test admins error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    )
  }
}