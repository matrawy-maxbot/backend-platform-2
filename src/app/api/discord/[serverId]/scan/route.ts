import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface ScanResult {
  id: string
  name: string
  type: 'member' | 'bot' | 'role' | 'channel'
  riskLevel: 'high' | 'medium' | 'low'
  permissions: string[]
  lastActive?: string
  userId?: string
  avatar?: string
}

interface ScanSummary {
  totalItems: number
  highRisk: number
  mediumRisk: number
  lowRisk: number
  breakdown: {
    members: number
    bots: number
    roles: number
    channels: number
  }
}

// تحديد مستوى المخاطر بناءً على الصلاحيات
function calculateRiskLevel(permissions: string[]): 'high' | 'medium' | 'low' {
  const highRiskPermissions = [
    'ADMINISTRATOR',
    'MANAGE_GUILD',
    'MANAGE_ROLES',
    'MANAGE_CHANNELS',
    'MANAGE_WEBHOOKS',
    'BAN_MEMBERS',
    'KICK_MEMBERS',
    'MANAGE_MESSAGES',
    'MENTION_EVERYONE'
  ]
  
  const mediumRiskPermissions = [
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'MANAGE_NICKNAMES',
    'VIEW_AUDIT_LOG'
  ]
  
  const hasHighRisk = permissions.some(perm => highRiskPermissions.includes(perm))
  const hasMediumRisk = permissions.some(perm => mediumRiskPermissions.includes(perm))
  
  if (hasHighRisk) return 'high'
  if (hasMediumRisk) return 'medium'
  return 'low'
}

// Return Discord permissions as they are from the server
function formatPermissions(permissions: string[]): string[] {
  // Return permissions as they are without translation
  return permissions
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions)
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      )
    }

    const { serverId } = await params
    const botToken = process.env.DISCORD_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json(
        { error: 'رمز البوت غير متوفر' },
        { status: 500 }
      )
    }

    // جلب بيانات الخادم
    const guildResponse = await fetch(`https://discord.com/api/v10/guilds/${serverId}`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!guildResponse.ok) {
      return NextResponse.json(
        { error: 'فشل في جلب بيانات الخادم' },
        { status: guildResponse.status }
      )
    }

    // جلب الأعضاء
    const membersResponse = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members?limit=1000`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    // جلب الأدوار
    const rolesResponse = await fetch(`https://discord.com/api/v10/guilds/${serverId}/roles`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    // جلب القنوات
    const channelsResponse = await fetch(`https://discord.com/api/v10/guilds/${serverId}/channels`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    const members = membersResponse.ok ? await membersResponse.json() : []
    const roles = rolesResponse.ok ? await rolesResponse.json() : []
    const channels = channelsResponse.ok ? await channelsResponse.json() : []

    const scanResults: ScanResult[] = []

    // معالجة الأعضاء
    members.forEach((member: any) => {
      const memberPermissions: string[] = []
      
      // جمع الصلاحيات من الأدوار
      member.roles.forEach((roleId: string) => {
        const role = roles.find((r: any) => r.id === roleId)
        if (role && role.permissions) {
          const permissions = parseInt(role.permissions)
          // تحويل الصلاحيات من رقم إلى مصفوفة
          if (permissions & 0x8) memberPermissions.push('ADMINISTRATOR')
          if (permissions & 0x20) memberPermissions.push('MANAGE_GUILD')
          if (permissions & 0x10000000) memberPermissions.push('MANAGE_ROLES')
          if (permissions & 0x10) memberPermissions.push('MANAGE_CHANNELS')
          if (permissions & 0x20000000) memberPermissions.push('MANAGE_WEBHOOKS')
          if (permissions & 0x4) memberPermissions.push('BAN_MEMBERS')
          if (permissions & 0x2) memberPermissions.push('KICK_MEMBERS')
          if (permissions & 0x2000) memberPermissions.push('MANAGE_MESSAGES')
          if (permissions & 0x20000) memberPermissions.push('MENTION_EVERYONE')
          if (permissions & 0x400000) memberPermissions.push('MUTE_MEMBERS')
          if (permissions & 0x800000) memberPermissions.push('DEAFEN_MEMBERS')
          if (permissions & 0x1000000) memberPermissions.push('MOVE_MEMBERS')
          if (permissions & 0x8000000) memberPermissions.push('MANAGE_NICKNAMES')
          if (permissions & 0x80) memberPermissions.push('VIEW_AUDIT_LOG')
        }
      })

      const uniquePermissions = [...new Set(memberPermissions)]
      const riskLevel = calculateRiskLevel(uniquePermissions)
      
      scanResults.push({
        id: member.user.id,
        name: member.nick || member.user.global_name || member.user.username,
        type: member.user.bot ? 'bot' : 'member',
        riskLevel,
        permissions: formatPermissions(uniquePermissions),
        lastActive: 'غير متوفر',
        userId: member.user.id,
        avatar: member.user.avatar 
          ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
          : null
      })
    })

    // معالجة الأدوار
    roles.forEach((role: any) => {
      if (role.name === '@everyone') return // تجاهل دور الجميع
      
      const rolePermissions: string[] = []
      const permissions = parseInt(role.permissions)
      
      if (permissions & 0x8) rolePermissions.push('ADMINISTRATOR')
      if (permissions & 0x20) rolePermissions.push('MANAGE_GUILD')
      if (permissions & 0x10000000) rolePermissions.push('MANAGE_ROLES')
      if (permissions & 0x10) rolePermissions.push('MANAGE_CHANNELS')
      if (permissions & 0x20000000) rolePermissions.push('MANAGE_WEBHOOKS')
      if (permissions & 0x4) rolePermissions.push('BAN_MEMBERS')
      if (permissions & 0x2) rolePermissions.push('KICK_MEMBERS')
      if (permissions & 0x2000) rolePermissions.push('MANAGE_MESSAGES')
      if (permissions & 0x20000) rolePermissions.push('MENTION_EVERYONE')
      
      const riskLevel = calculateRiskLevel(rolePermissions)
      
      scanResults.push({
        id: role.id,
        name: role.name,
        type: 'role',
        riskLevel,
        permissions: formatPermissions(rolePermissions)
      })
    })

    // معالجة القنوات
    channels.forEach((channel: any) => {
      const channelPermissions: string[] = []
      
      // فحص إعدادات الصلاحيات للقناة
      if (channel.permission_overwrites) {
        channel.permission_overwrites.forEach((overwrite: any) => {
          const allow = parseInt(overwrite.allow)
          if (allow & 0x2000) channelPermissions.push('MANAGE_MESSAGES')
          if (allow & 0x20000) channelPermissions.push('MENTION_EVERYONE')
          if (allow & 0x10) channelPermissions.push('MANAGE_CHANNELS')
          if (allow & 0x20000000) channelPermissions.push('MANAGE_WEBHOOKS')
        })
      }
      
      const riskLevel = calculateRiskLevel(channelPermissions)
      
      scanResults.push({
        id: channel.id,
        name: channel.name,
        type: 'channel',
        riskLevel,
        permissions: formatPermissions(channelPermissions)
      })
    })

    // حساب الإحصائيات
    const summary: ScanSummary = {
      totalItems: scanResults.length,
      highRisk: scanResults.filter(r => r.riskLevel === 'high').length,
      mediumRisk: scanResults.filter(r => r.riskLevel === 'medium').length,
      lowRisk: scanResults.filter(r => r.riskLevel === 'low').length,
      breakdown: {
        members: scanResults.filter(r => r.type === 'member').length,
        bots: scanResults.filter(r => r.type === 'bot').length,
        roles: scanResults.filter(r => r.type === 'role').length,
        channels: scanResults.filter(r => r.type === 'channel').length
      }
    }

    return NextResponse.json({
      results: scanResults,
      summary
    })

  } catch (error) {
    console.error('خطأ في فحص الأمان:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء فحص الأمان' },
      { status: 500 }
    )
  }
}