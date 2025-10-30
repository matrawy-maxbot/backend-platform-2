'use client'

import { useState, useEffect } from 'react'
import { useSelectedServer } from '@/contexts/selected-server-context'

export interface DiscordRole {
  id: string
  name: string
  color: number
  hoist: boolean
  position: number
  permissions: string
  managed: boolean
  mentionable: boolean
  icon: string | null
  unicode_emoji: string | null
}

export function useDiscordRoles() {
  const { selectedServer } = useSelectedServer()
  const [roles, setRoles] = useState<DiscordRole[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = async (serverId: string) => {
    if (!serverId) {
      setRoles([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/discord/${serverId}/roles`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.statusText}`)
      }

      const data = await response.json()
      setRoles(data)
    } catch (err) {
      console.error('Error fetching Discord roles:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch roles')
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  const refreshRoles = () => {
    if (selectedServer?.id) {
      fetchRoles(selectedServer.id)
    }
  }

  useEffect(() => {
    if (selectedServer?.id) {
      fetchRoles(selectedServer.id)
    } else {
      setRoles([])
      setError(null)
    }
  }, [selectedServer?.id])

  // فلترة الرتب حسب النوع
  const managedRoles = roles.filter(role => role.managed)
  const userRoles = roles.filter(role => !role.managed && role.name !== '@everyone')
  const everyoneRole = roles.find(role => role.name === '@everyone')
  const hoistedRoles = roles.filter(role => role.hoist)
  const mentionableRoles = roles.filter(role => role.mentionable)

  // تحويل لون الرتبة إلى hex
  const getRoleColor = (color: number) => {
    if (color === 0) return '#99AAB5' // اللون الافتراضي
    return `#${color.toString(16).padStart(6, '0')}`
  }

  // فلترة الرتب حسب الصلاحيات
  const adminRoles = roles.filter(role => {
    const permissions = BigInt(role.permissions)
    return (permissions & BigInt('0x8')) !== BigInt(0) // ADMINISTRATOR permission
  })

  const moderatorRoles = roles.filter(role => {
    const permissions = BigInt(role.permissions)
    return (
      (permissions & BigInt('0x10000000')) !== BigInt(0) || // MANAGE_MESSAGES
      (permissions & BigInt('0x10000')) !== BigInt(0) || // KICK_MEMBERS
      (permissions & BigInt('0x4')) !== BigInt(0) // BAN_MEMBERS
    ) && (permissions & BigInt('0x8')) === BigInt(0) // Not admin
  })

  return {
    roles,
    managedRoles,
    userRoles,
    everyoneRole,
    hoistedRoles,
    mentionableRoles,
    adminRoles,
    moderatorRoles,
    loading,
    error,
    refreshRoles,
    getRoleColor,
    hasRoles: roles.length > 0
  }
}

// Hook مخصص للحصول على رتبة محددة
export function useDiscordRole(roleId: string | null) {
  const { roles, getRoleColor } = useDiscordRoles()
  
  const role = roles.find(r => r.id === roleId) || null
  
  return {
    role,
    isValid: !!role,
    color: role ? getRoleColor(role.color) : null,
    isManaged: role?.managed || false,
    isHoisted: role?.hoist || false,
    isMentionable: role?.mentionable || false,
    isEveryone: role?.name === '@everyone'
  }
}

// Hook للحصول على قائمة الرتب المناسبة لكل قسم
export function useRolesForSection(section: 'welcome' | 'auto-reply' | 'ads' | 'events' | 'moderation' | 'general' | 'protection') {
  const { roles, userRoles, adminRoles, moderatorRoles, loading, error, getRoleColor, refreshRoles } = useDiscordRoles()
  
  // فلترة الرتب المناسبة لكل قسم
  const getRolesForSection = (sectionType: string) => {
    switch (sectionType) {
      case 'welcome':
        return userRoles // رتب المستخدمين فقط للترحيب
      case 'auto-reply':
        return roles.filter(role => role.name !== '@everyone') // جميع الرتب عدا everyone
      case 'ads':
        return roles.filter(role => role.name !== '@everyone') // جميع الرتب عدا everyone للإعلانات
      case 'events':
        return [...adminRoles, ...moderatorRoles] // رتب الإدارة والمشرفين للأحداث
      case 'moderation':
        return [...adminRoles, ...moderatorRoles] // رتب الإدارة والمشرفين للمراقبة
      default:
        return roles
    }
  }
  
  const suitableRoles = getRolesForSection(section)
  
  return {
    roles: suitableRoles,
    allRoles: roles,
    userRoles,
    adminRoles,
    moderatorRoles,
    loading,
    error,
    getRoleColor,
    refreshRoles,
    hasRoles: suitableRoles.length > 0
  }
}

// Hook للتحقق من صلاحيات الرتبة
export function useRolePermissions(roleId: string | null) {
  const { role } = useDiscordRole(roleId)
  
  if (!role) {
    return {
      hasPermission: () => false,
      isAdmin: false,
      canManageMessages: false,
      canKickMembers: false,
      canBanMembers: false,
      canManageRoles: false,
      canManageChannels: false
    }
  }
  
  const permissions = BigInt(role.permissions)
  
  const hasPermission = (permission: string) => {
    return (permissions & BigInt(permission)) !== BigInt(0)
  }
  
  return {
    hasPermission,
    isAdmin: hasPermission('0x8'),
    canManageMessages: hasPermission('0x10000000'),
    canKickMembers: hasPermission('0x10000'),
    canBanMembers: hasPermission('0x4'),
    canManageRoles: hasPermission('0x10000000000'),
    canManageChannels: hasPermission('0x1000')
  }
}