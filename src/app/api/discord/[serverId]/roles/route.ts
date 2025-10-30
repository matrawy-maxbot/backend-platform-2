import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serverId } = await params

    // جلب الأدوار من Discord API
    const botToken = process.env.DISCORD_BOT_TOKEN
    console.log('Roles API - Bot Token exists:', !!botToken)
    console.log('Roles API - Bot Token length:', botToken?.length || 0)
    
    const response = await fetch(`https://discord.com/api/guilds/${serverId}/roles`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Roles API - Discord API Response Status:', response.status)
    console.log('Roles API - Discord API Response OK:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Roles API - Discord API Error:', errorText)
      console.warn('Discord Bot Token not available or invalid, returning mock roles')
      const mockRoles = [
        {
          id: 'everyone',
          name: '@everyone',
          color: 0,
          hoist: false,
          position: 0,
          permissions: '104324673',
          managed: false,
          mentionable: false,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'admin',
          name: 'Admin',
          color: 15158332, // Red color
          hoist: true,
          position: 10,
          permissions: '8',
          managed: false,
          mentionable: true,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'moderator',
          name: 'Moderator',
          color: 3447003, // Blue color
          hoist: true,
          position: 9,
          permissions: '268435462',
          managed: false,
          mentionable: true,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'vip',
          name: 'VIP',
          color: 15844367, // Gold color
          hoist: true,
          position: 8,
          permissions: '104324673',
          managed: false,
          mentionable: true,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'member',
          name: 'Member',
          color: 5763719, // Green color
          hoist: false,
          position: 7,
          permissions: '104324673',
          managed: false,
          mentionable: false,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'new-member',
          name: 'New Member',
          color: 10181046, // Purple color
          hoist: false,
          position: 6,
          permissions: '104320577',
          managed: false,
          mentionable: false,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'bot',
          name: 'Bot',
          color: 7506394, // Gray color
          hoist: true,
          position: 5,
          permissions: '104324673',
          managed: true,
          mentionable: false,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'verified',
          name: 'Verified',
          color: 5763719, // Green color
          hoist: false,
          position: 4,
          permissions: '104324673',
          managed: false,
          mentionable: false,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'streamer',
          name: 'Streamer',
          color: 9442302, // Pink color
          hoist: true,
          position: 3,
          permissions: '104324673',
          managed: false,
          mentionable: true,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'artist',
          name: 'Artist',
          color: 16776960, // Yellow color
          hoist: true,
          position: 2,
          permissions: '104324673',
          managed: false,
          mentionable: true,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'developer',
          name: 'Developer',
          color: 65535, // Cyan color
          hoist: true,
          position: 1,
          permissions: '104324673',
          managed: false,
          mentionable: true,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'gamer',
          name: 'Gamer',
          color: 8388736, // Dark green color
          hoist: false,
          position: 0,
          permissions: '104324673',
          managed: false,
          mentionable: false,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'music-lover',
          name: 'Music Lover',
          color: 16711935, // Magenta color
          hoist: false,
          position: -1,
          permissions: '104324673',
          managed: false,
          mentionable: false,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'tech-enthusiast',
          name: 'Tech Enthusiast',
          color: 255, // Blue color
          hoist: false,
          position: -2,
          permissions: '104324673',
          managed: false,
          mentionable: false,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'content-creator',
          name: 'Content Creator',
          color: 16753920, // Orange color
          hoist: true,
          position: -3,
          permissions: '104324673',
          managed: false,
          mentionable: true,
          icon: null,
          unicode_emoji: null
        },
        {
          id: 'supporter',
          name: 'Supporter',
          color: 16711680, // Red color
          hoist: false,
          position: -4,
          permissions: '104324673',
          managed: false,
          mentionable: false,
          icon: null,
          unicode_emoji: null
        }
      ]
      
      return NextResponse.json(mockRoles)
    }

    const roles = await response.json()
    
    // تنسيق البيانات وترتيب الرتب حسب الموقع
    const formattedRoles = roles
      .map((role: any) => ({
        id: role.id,
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions,
        managed: role.managed,
        mentionable: role.mentionable,
        icon: role.icon,
        unicode_emoji: role.unicode_emoji
      }))
      .sort((a: any, b: any) => b.position - a.position) // ترتيب تنازلي حسب الموقع

    return NextResponse.json(formattedRoles)
  } catch (error) {
    console.error('Error fetching Discord roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Discord roles' },
      { status: 500 }
    )
  }
}