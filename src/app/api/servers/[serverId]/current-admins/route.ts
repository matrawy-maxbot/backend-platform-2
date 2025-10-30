import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getCurrentAdmins, addCurrentAdmin } from './data-store'

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

    // In a real application, you would verify that the user has permission to access this server
    // and get the data from the database
    
    // Return the current admins list for the server
    const currentAdmins = getCurrentAdmins(serverId)
    
    return NextResponse.json(currentAdmins)
    
  } catch (error) {
    console.error('Error fetching current admins:', error)
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
    
    // Verify that the user is the server owner
    // In a real application, you would check the database
    
    const { discordId, username, discriminator, avatar, permissions } = body
    
    if (!discordId || !username) {
      return NextResponse.json(
        { error: 'User data is required' },
        { status: 400 }
      )
    }

    // Add the new admin
    const newAdmin = {
      id: Date.now().toString(),
      discordId,
      username,
      discriminator,
      avatar,
      addedAt: new Date().toISOString(),
      addedBy: session.user.discordId,
      permissions: permissions || [],
      status: 'active'
    }

    // Add the new admin
    const added = addCurrentAdmin(serverId, newAdmin)
    
    if (!added) {
      return NextResponse.json(
        { error: 'Admin already exists in the server' },
        { status: 409 } // Conflict
      )
    }
    
    return NextResponse.json(newAdmin, { status: 201 })
    
  } catch (error) {
    console.error('Error adding admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    
    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    // Verify that the user is the server owner
    // In a real application, you would check the database
    
    // Delete the admin
    if (mockCurrentAdmins[serverId]) {
      mockCurrentAdmins[serverId] = mockCurrentAdmins[serverId].filter(
        admin => admin.id !== adminId
      )
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error removing admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}