'use client'

import { useState, useEffect } from 'react'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { useDiscordChannels, useChannelsForSection } from './useDiscordChannels'
import { useDiscordRoles, useRolesForSection } from './useDiscordRoles'

// Hook شامل لجلب جميع البيانات المطلوبة لكل قسم
export function useDiscordDataForSection(section: 'welcome' | 'auto-reply' | 'ads' | 'events' | 'moderation' | 'general' | 'protection') {
  const { selectedServer } = useSelectedServer()
  const { 
    channels, 
    loading: channelsLoading, 
    error: channelsError,
    refreshChannels 
  } = useChannelsForSection(section)
  
  const { 
    roles, 
    loading: rolesLoading, 
    error: rolesError,
    getRoleColor,
    refreshRoles 
  } = useRolesForSection(section)

  const loading = channelsLoading || rolesLoading
  const error = channelsError || rolesError
  const hasData = channels.length > 0 || roles.length > 0

  const refreshData = () => {
    refreshChannels()
    refreshRoles()
  }

  return {
    // Server info
    selectedServer,
    hasSelectedServer: !!selectedServer,
    
    // Channels data
    channels,
    availableChannels: channels,
    channelsLoading,
    channelsError,
    hasChannels: channels.length > 0,
    
    // Roles data
    roles,
    availableRoles: roles,
    rolesLoading,
    rolesError,
    getRoleColor,
    hasRoles: roles.length > 0,
    
    // Combined state
    loading,
    error,
    hasData,
    refreshData,
    
    // Helper functions
    getChannelById: (id: string) => channels.find(c => c.id === id),
    getRoleById: (id: string) => roles.find(r => r.id === id),
    
    // Formatted data for UI components
    channelOptions: channels.map(channel => ({
      value: channel.id,
      label: `#${channel.name}`,
      description: channel.topic || 'No description'
    })),
    
    roleOptions: roles.map(role => ({
      value: role.id,
      label: role.name,
      color: getRoleColor(role.color),
      description: role.managed ? 'Managed by bot' : 'User role'
    }))
  }
}

// Hook مبسط للحصول على جميع القنوات والرتب
export function useAllDiscordData() {
  const { selectedServer } = useSelectedServer()
  const { 
    channels, 
    textChannels,
    voiceChannels,
    categoryChannels,
    loading: channelsLoading, 
    error: channelsError,
    refreshChannels 
  } = useDiscordChannels()
  
  const { 
    roles,
    userRoles,
    adminRoles,
    moderatorRoles,
    managedRoles,
    loading: rolesLoading, 
    error: rolesError,
    getRoleColor,
    refreshRoles 
  } = useDiscordRoles()

  const loading = channelsLoading || rolesLoading
  const error = channelsError || rolesError

  const refreshAll = () => {
    refreshChannels()
    refreshRoles()
  }

  return {
    // Server info
    selectedServer,
    hasSelectedServer: !!selectedServer,
    
    // All channels
    allChannels: channels,
    textChannels,
    voiceChannels,
    categoryChannels,
    
    // All roles
    allRoles: roles,
    userRoles,
    adminRoles,
    moderatorRoles,
    managedRoles,
    getRoleColor,
    
    // State
    loading,
    error,
    hasData: channels.length > 0 || roles.length > 0,
    refreshAll
  }
}

// Hook للحصول على إحصائيات سريعة
export function useDiscordStats() {
  const { 
    allChannels, 
    textChannels, 
    voiceChannels, 
    allRoles, 
    userRoles, 
    adminRoles,
    loading 
  } = useAllDiscordData()

  return {
    stats: {
      totalChannels: allChannels.length,
      textChannels: textChannels.length,
      voiceChannels: voiceChannels.length,
      totalRoles: allRoles.length,
      userRoles: userRoles.length,
      adminRoles: adminRoles.length
    },
    loading,
    hasStats: allChannels.length > 0 || allRoles.length > 0
  }
}