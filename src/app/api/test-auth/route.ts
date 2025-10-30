import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmins } from '../servers/[serverId]/current-admins/data-store'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const serverId = url.searchParams.get('serverId') || '423067123225722891'
    const discordId = url.searchParams.get('discordId') || '420285977940983808'
    
    // محاكاة بيانات المستخدم من الـ session
    const mockUser = {
      id: discordId,
      username: 'shytnbsly.',
      discriminator: '0',
      avatar: 'https://cdn.discordapp.com/avatars/420285977940983808/cffa1556a7a1af34f1a4658a0d5c0beb.png',
      verified: true
    }
    
    // الحصول على قائمة الأدمن
    const admins = getCurrentAdmins(serverId)
    
    // التحقق من كون المستخدم أدمن
    const isCurrentAdmin = admins.some(admin => admin.discordId === discordId)
    
    // التحقق من كون المستخدم مالك السيرفر (مثال)
    const isOwner = discordId === '359907771224817664' // مالك السيرفر الافتراضي
    
    return NextResponse.json({
      user: mockUser,
      serverId,
      admins: admins.map(admin => ({
        discordId: admin.discordId,
        username: admin.username,
        permissions: admin.permissions
      })),
      verification: {
        isCurrentAdmin,
        isOwner,
        hasAccess: isCurrentAdmin || isOwner
      }
    })
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json(
      { error: 'Failed to test auth' },
      { status: 500 }
    )
  }
}