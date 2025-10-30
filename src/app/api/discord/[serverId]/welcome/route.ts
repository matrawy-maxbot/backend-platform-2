import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Function to get server settings from the main API
async function getServerSettings(serverId: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/server-settings/${serverId}`, {
      headers: {
        'x-bot-request': 'true',
        'User-Agent': 'Discord-Bot/1.0'
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    console.error('Failed to fetch server settings:', response.status);
    return null;
  } catch (error) {
    console.error('Error fetching server settings:', error);
    return null;
  }
}

// Function to send welcome/leave message to Discord channel
async function sendDiscordMessage(channelId: string, message: string, botToken?: string) {
  try {
    // في التطبيق الحقيقي، استخدم Discord Bot Token
    const token = botToken || process.env.DISCORD_BOT_TOKEN
    
    if (!token) {
      console.error('Discord bot token not found')
      return false
    }

    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: message
      })
    })

    if (!response.ok) {
      console.error('Failed to send Discord message:', await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending Discord message:', error)
    return false
  }
}

// Function to process message placeholders
function processMessage(message: string, user: any, server: any) {
  return message
    .replace(/{user}/g, user.username || user.displayName || 'Unknown User')
    .replace(/{server}/g, server.name || 'Unknown Server')
    .replace(/{memberCount}/g, server.memberCount?.toString() || '0')
}

// POST endpoint for sending welcome messages
export async function POST(request: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serverId } = await params
    const body = await request.json()
    const { type, user, server } = body // type: 'welcome' | 'leave'
    
    // Get server settings from the main API
    const settings = await getServerSettings(serverId)
    if (!settings?.members) {
      return NextResponse.json({ error: 'Server settings not found' }, { status: 404 })
    }

    const messageSettings = type === 'welcome' 
      ? settings.members.welcomeMessage 
      : settings.members.leaveMessage

    if (!messageSettings?.enabled || !messageSettings.channel) {
      return NextResponse.json({ 
        success: false, 
        message: `${type} messages are disabled or no channel selected` 
      })
    }

    // Process message with placeholders
    const processedMessage = processMessage(messageSettings.message, user, server)
    
    // Send message to Discord
    const success = await sendDiscordMessage(messageSettings.channel, processedMessage)
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `${type} message sent successfully`,
        processedMessage 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `Failed to send ${type} message` 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in welcome endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing message preview
export async function GET(request: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serverId } = await params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'welcome' | 'leave'
    
    // Get server settings from the main API
    const settings = await getServerSettings(serverId)
    if (!settings?.members) {
      return NextResponse.json({ error: 'Server settings not found' }, { status: 404 })
    }

    const messageSettings = type === 'welcome' 
      ? settings.members.welcomeMessage 
      : settings.members.leaveMessage

    if (!messageSettings) {
      return NextResponse.json({ error: 'Message settings not found' }, { status: 404 })
    }

    // Mock user and server data for preview
    const mockUser = { username: 'TestUser', displayName: 'Test User' }
    const mockServer = { name: 'Test Server', memberCount: 1234 }
    
    const processedMessage = processMessage(messageSettings.message, mockUser, mockServer)
    
    return NextResponse.json({
      enabled: messageSettings.enabled,
      channel: messageSettings.channel,
      originalMessage: messageSettings.message,
      processedMessage
    })

  } catch (error) {
    console.error('Error in welcome preview endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}