import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getCurrentAdmins, removeCurrentAdmin } from '../data-store'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string; adminId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const { serverId, adminId } = await params
    
    console.log('DELETE request received:', { serverId, adminId })
    
    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    // Verify that the user is the server owner
    // In a real application, you would check the database
    
    // Delete the admin
    const currentAdmins = getCurrentAdmins(serverId)
    console.log('Before deletion:', currentAdmins)
    
    if (currentAdmins.length === 0) {
      console.log('No admins found for server:', serverId)
      return NextResponse.json(
        { error: 'No admins found in this server' },
        { status: 404 }
      )
    }
    
    const deleted = removeCurrentAdmin(serverId, adminId)
    
    const updatedAdmins = getCurrentAdmins(serverId)
    console.log('After deletion:', updatedAdmins)
    
    if (deleted) {
      console.log('Admin deleted successfully')
      return NextResponse.json({ success: true })
    } else {
      console.log('Admin not found for deletion')
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }
    
  } catch (error) {
    console.error('Error removing admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}