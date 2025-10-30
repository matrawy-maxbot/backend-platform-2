import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      )
    }

    const { serverId } = params
    const botToken = process.env.DISCORD_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json(
        { error: 'رمز البوت غير متوفر' },
        { status: 500 }
      )
    }

    // جلب الأعضاء من Discord API
    const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members?limit=1000`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'فشل في جلب بيانات الأعضاء' },
        { status: response.status }
      )
    }

    const members = await response.json()
    
    // تنسيق البيانات
    const formattedMembers = members.map((member: any) => ({
      id: member.user.id,
      username: member.user.username,
      globalName: member.user.global_name,
      nickname: member.nick,
      avatar: member.user.avatar 
        ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
        : null,
      isBot: member.user.bot || false,
      roles: member.roles,
      joinedAt: member.joined_at,
      premiumSince: member.premium_since
    }))

    return NextResponse.json(formattedMembers)

  } catch (error) {
    console.error('خطأ في جلب الأعضاء:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الأعضاء' },
      { status: 500 }
    )
  }
}