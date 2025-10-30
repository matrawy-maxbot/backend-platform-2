import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const { serverId } = await params
    const botToken = process.env.DISCORD_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json(
        { error: 'Bot token not available' },
        { status: 500 }
      )
    }

    // Fetch members from Discord API
    const membersResponse = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members?limit=1000`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    // Fetch roles from Discord API
    const rolesResponse = await fetch(`https://discord.com/api/v10/guilds/${serverId}/roles`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!membersResponse.ok || !rolesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch members or roles data' },
        { status: 500 }
      )
    }

    const members = await membersResponse.json()
    const roles = await rolesResponse.json()

    // Filter members who have important administrative permissions
    const membersWithPermissions = members.filter((member: any) => {
      // Ignore bots
      if (member.user.bot) return false
      
      let hasAdminPermissions = false
      
      // Check permissions for each role of the member
      member.roles.forEach((roleId: string) => {
        const role = roles.find((r: any) => r.id === roleId)
        if (role && role.permissions) {
          const permissions = BigInt(role.permissions)
          
          // Check important administrative permissions
          if (
            (permissions & BigInt(0x8)) !== BigInt(0) ||      // ADMINISTRATOR
            (permissions & BigInt(0x2)) !== BigInt(0) ||      // KICK_MEMBERS
            (permissions & BigInt(0x4)) !== BigInt(0) ||      // BAN_MEMBERS
            (permissions & BigInt(0x20)) !== BigInt(0) ||     // MANAGE_GUILD
            (permissions & BigInt(0x10)) !== BigInt(0) ||     // MANAGE_CHANNELS
            (permissions & BigInt(0x10000000)) !== BigInt(0) || // MANAGE_ROLES
            (permissions & BigInt(0x2000)) !== BigInt(0) ||   // MANAGE_MESSAGES
            (permissions & BigInt(0x20000000)) !== BigInt(0) || // MANAGE_WEBHOOKS
            (permissions & BigInt(0x40000000)) !== BigInt(0) || // MANAGE_EMOJIS_AND_STICKERS
            (permissions & BigInt(0x100000000)) !== BigInt(0) || // MODERATE_MEMBERS
            (permissions & BigInt(0x8000000000)) !== BigInt(0)   // MANAGE_EVENTS
          ) {
            hasAdminPermissions = true
          }
        }
      })
      
      return hasAdminPermissions
    })

    // Format data for sending
    const formattedMembers = membersWithPermissions.map((member: any) => {
      // Collect role names
      const memberRoles = member.roles
        .map((roleId: string) => {
          const role = roles.find((r: any) => r.id === roleId)
          return role ? role.name : null
        })
        .filter(Boolean)
      
      // Determine specific permissions
      const permissions: string[] = []
      member.roles.forEach((roleId: string) => {
        const role = roles.find((r: any) => r.id === roleId)
        if (role && role.permissions) {
          const rolePermissions = BigInt(role.permissions)
          
          if ((rolePermissions & BigInt(0x8)) !== BigInt(0)) {
            permissions.push('ADMINISTRATOR')
          } else {
            if ((rolePermissions & BigInt(0x2)) !== BigInt(0)) {
              permissions.push('KICK_MEMBERS')
            }
            if ((rolePermissions & BigInt(0x4)) !== BigInt(0)) {
              permissions.push('BAN_MEMBERS')
            }
            if ((rolePermissions & BigInt(0x20)) !== BigInt(0)) {
              permissions.push('MANAGE_GUILD')
            }
            if ((rolePermissions & BigInt(0x10)) !== BigInt(0)) {
              permissions.push('MANAGE_CHANNELS')
            }
            if ((rolePermissions & BigInt(0x10000000)) !== BigInt(0)) {
              permissions.push('MANAGE_ROLES')
            }
            if ((rolePermissions & BigInt(0x2000)) !== BigInt(0)) {
              permissions.push('MANAGE_MESSAGES')
            }
            if ((rolePermissions & BigInt(0x20000000)) !== BigInt(0)) {
              permissions.push('MANAGE_WEBHOOKS')
            }
            if ((rolePermissions & BigInt(0x40000000)) !== BigInt(0)) {
              permissions.push('MANAGE_EMOJIS_AND_STICKERS')
            }
            if ((rolePermissions & BigInt(0x100000000)) !== BigInt(0)) {
              permissions.push('MODERATE_MEMBERS')
            }
            if ((rolePermissions & BigInt(0x8000000000)) !== BigInt(0)) {
              permissions.push('MANAGE_EVENTS')
            }
          }
        }
      })
      
      return {
        id: member.user.id,
        username: member.user.username,
        globalName: member.user.global_name,
        discriminator: member.user.discriminator || member.user.username,
        avatar: member.user.avatar 
          ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
          : '/defaults/avatar.svg',
        nickname: member.nick,
        roles: memberRoles,
        permissions: [...new Set(permissions)], // Remove duplicates
        joinedAt: member.joined_at,
        isOnline: Math.random() > 0.5 // Random online status (can be improved later)
      }
    })

    return NextResponse.json(formattedMembers)
    
  } catch (error) {
    console.error('Error fetching members with permissions:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching members data' },
      { status: 500 }
    )
  }
}