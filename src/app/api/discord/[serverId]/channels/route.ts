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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serverId } = await params

    // جلب قنوات السيرفر من Discord API
    const botToken = process.env.DISCORD_BOT_TOKEN
    console.log('Bot Token exists:', !!botToken)
    console.log('Bot Token length:', botToken?.length || 0)
    
    const response = await fetch(`https://discord.com/api/guilds/${serverId}/channels`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Discord API Response Status:', response.status)
    console.log('Discord API Response OK:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Discord API Error:', errorText)
      console.warn('Discord Bot Token not available or invalid, returning mock channels')
      const mockChannels = [
        {
          id: 'general',
          name: 'general',
          type: 0, // TEXT_CHANNEL
          position: 0,
          parent_id: null,
          topic: 'General discussion',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'announcements',
          name: 'announcements',
          type: 0,
          position: 1,
          parent_id: null,
          topic: 'Server announcements',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'welcome',
          name: 'welcome',
          type: 0,
          position: 2,
          parent_id: null,
          topic: 'Welcome new members',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'help',
          name: 'help',
          type: 0,
          position: 3,
          parent_id: null,
          topic: 'Help and support',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'rules',
          name: 'rules',
          type: 0,
          position: 4,
          parent_id: null,
          topic: 'Server rules',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'promotions',
          name: 'promotions',
          type: 0,
          position: 5,
          parent_id: null,
          topic: 'Promotions and ads',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'events',
          name: 'events',
          type: 0,
          position: 6,
          parent_id: null,
          topic: 'Server events',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'community',
          name: 'community',
          type: 0,
          position: 7,
          parent_id: null,
          topic: 'Community discussions',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'gaming',
          name: 'gaming',
          type: 0,
          position: 8,
          parent_id: null,
          topic: 'Gaming discussions',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'memes',
          name: 'memes',
          type: 0,
          position: 9,
          parent_id: null,
          topic: 'Share your memes',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'music',
          name: 'music',
          type: 0,
          position: 10,
          parent_id: null,
          topic: 'Music sharing and discussion',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'art',
          name: 'art',
          type: 0,
          position: 11,
          parent_id: null,
          topic: 'Share your artwork',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'tech-talk',
          name: 'tech-talk',
          type: 0,
          position: 12,
          parent_id: null,
          topic: 'Technology discussions',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'off-topic',
          name: 'off-topic',
          type: 0,
          position: 13,
          parent_id: null,
          topic: 'Random discussions',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'feedback',
          name: 'feedback',
          type: 0,
          position: 14,
          parent_id: null,
          topic: 'Server feedback and suggestions',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'bot-commands',
          name: 'bot-commands',
          type: 0,
          position: 15,
          parent_id: null,
          topic: 'Bot commands channel',
          nsfw: false,
          permission_overwrites: []
        },
        {
          id: 'marketplace',
          name: 'marketplace',
          type: 0,
          position: 16,
          parent_id: null,
          topic: 'Buy and sell items',
          nsfw: false,
          permission_overwrites: []
        }
      ]
      
      return NextResponse.json(mockChannels)
    }

    const channels = await response.json()
    
    // تنسيق البيانات وفلترة القنوات النصية فقط
    const formattedChannels = channels
      .filter((channel: any) => channel.type === 0) // TEXT_CHANNEL only
      .map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        position: channel.position,
        parent_id: channel.parent_id,
        topic: channel.topic,
        nsfw: channel.nsfw,
        permission_overwrites: channel.permission_overwrites || []
      }))
      .sort((a: any, b: any) => a.position - b.position)

    return NextResponse.json(formattedChannels)
  } catch (error) {
    console.error('Error fetching Discord channels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Discord channels' },
      { status: 500 }
    )
  }
}