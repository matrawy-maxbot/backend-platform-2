import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { 
  getServerData, 
  saveServerData, 
  updateServerSection,
  initializeDatabase 
} from '@/lib/database'

// تهيئة قاعدة البيانات عند بدء التشغيل
initializeDatabase().catch(console.error)

// دالة لإشعار البوت بتحديث الإعدادات
async function notifyBotSettingsUpdate(serverId: string, section: string, data: any) {
  try {
    // إرسال طلب POST للبوت لتحديث cache الإعدادات
    const botNotifyUrl = process.env.BOT_NOTIFY_URL || 'http://localhost:3003/api/settings-update'
    
    const response = await fetch(botNotifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOT_API_SECRET || 'default-secret'}`
      },
      body: JSON.stringify({
        serverId,
        section,
        data,
        timestamp: Date.now()
      })
    })
    
    if (response.ok) {
      console.log('✅ Bot notified successfully of settings update')
    } else {
      console.warn('⚠️ Bot notification failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ Error notifying bot:', error)
    throw error
  }
}

function getDefaultSettings(serverId: string) {
  return {
    autoReply: {
      enabled: true,
      smartReply: false,
      defaultCooldown: 30,
      maxResponsesPerHour: 10,
      replies: []
    },
    ads: {
      enabled: false,
      ads: []
    },
    members: {
      welcomeMessage: {
        enabled: true,
        message: 'Welcome {user} to {server}! 🎉',
        channel: ''
      },
      leaveMessage: {
        enabled: true,
        message: 'Goodbye {user}, hope to see you soon! 👋',
        channel: ''
      }
    },
    protection: {
      spamProtection: true,
      raidProtection: false,
      autoModeration: true,
      images: {
        enabled: false,
        mode: 'allow_all',
        channels: []
      },
      botManagement: {
        enabled: false,
        allowedBots: [],
        blockUnknownBots: false,
        disallowBots: false,
        deleteRepeatedMessages: false
      },
      moderation: {
        enabled: false,
        autoDelete: false,
        warnUser: false,
        logChannel: '',
        maxKickBan: 5,
        memberPunishment: 'kick'
      },
      badWords: {
        enabled: false,
        words: [],
        action: 'delete',
        punishment: 'none',
        customMessage: '',
        pictureChannels: [],
        botCommandChannels: []
      },
      links: {
        enabled: false,
        allowDiscordInvites: false,
        allowedDomains: [],
        blockAll: false,
        whitelistChannels: [],
        blockedLinks: []
      },
      antiSpam: {
        enabled: false,
        maxMessages: 5,
        timeWindow: 10,
        action: 'delete'
      }
    },
    backup: {
      autoBackup: false,
      backupInterval: 24
    }
  }
}

export async function GET(request: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    // التحقق من User-Agent للسماح للبوت بالوصول
    const userAgent = request.headers.get('user-agent') || ''
    const isBot = userAgent.includes('node') || request.headers.get('x-bot-request') === 'true'
    
    if (!isBot) {
      const session = await getServerSession(authOptions)
      
      if (!session?.user?.discordId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const { serverId } = await params
    
    // التحقق من أن المستخدم له صلاحية في هذا السيرفر
    // في التطبيق الحقيقي، تحقق من قاعدة البيانات أو Discord API
    
    let settings = await getServerData(serverId)
    if (!settings) {
      settings = await saveServerData(serverId, getDefaultSettings(serverId), isBot ? 'bot' : 'user')
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching server settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch server settings' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serverId } = await params
    
    // التحقق من أن المستخدم له صلاحية في هذا السيرفر
    // في التطبيق الحقيقي، تحقق من قاعدة البيانات أو Discord API
    
    // حذف بيانات السيرفر من قاعدة البيانات
    const allData = await import('@/lib/database').then(db => db.readServersData())
    delete allData[serverId]
    await import('@/lib/database').then(db => db.writeServersData(allData))

    return NextResponse.json({ message: 'Server settings deleted successfully' })
  } catch (error) {
    console.error('Error deleting server settings:', error)
    return NextResponse.json(
      { error: 'Failed to delete server settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    console.log('🔄 PUT request received for server settings update')
    
    const session = await getServerSession(authOptions)
    console.log('👤 Session check:', { hasSession: !!session, userId: session?.user?.discordId })
    
    if (!session?.user?.discordId) {
      console.log('❌ Unauthorized: No session or discordId')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serverId } = await params
    const body = await request.json()
    const { section, data } = body
    
    console.log('📝 Request details:', { serverId, section, data })
    
    // التحقق من أن المستخدم له صلاحية في هذا السيرفر
    
    // تحديث قسم معين من الإعدادات في قاعدة البيانات
    console.log('🔄 Calling updateServerSection...')
    const updatedSection = await updateServerSection(
      serverId, 
      section, 
      data, 
      session.user.discordId
    )
    
    console.log('✅ Update successful:', updatedSection)

    // إشعار البوت بتحديث الإعدادات
    try {
      await notifyBotSettingsUpdate(serverId, section, updatedSection)
    } catch (notifyError) {
      console.warn('⚠️ Failed to notify bot of settings update:', notifyError)
      // لا نفشل الطلب إذا فشل الإشعار
    }

    return NextResponse.json({ 
      success: true, 
      section,
      data: updatedSection 
    })
  } catch (error) {
    console.error('❌ Error updating server section:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    return NextResponse.json(
      { 
        error: 'Failed to update server section',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}