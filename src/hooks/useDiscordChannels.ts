'use client'

import { useState, useEffect } from 'react'
import { useSelectedServer } from '@/contexts/selected-server-context'

export interface DiscordChannel {
  id: string
  name: string
  type: number
  position: number
  parent_id: string | null
  topic: string | null
  nsfw: boolean
  permission_overwrites: any[]
}

export function useDiscordChannels() {
  const { selectedServer } = useSelectedServer()
  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChannels = async (serverId?: string) => {
    const targetServerId = serverId || selectedServer?.id
    if (!targetServerId) {
      setChannels([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/discord/${targetServerId}/channels`)
      const data = await response.json()
      
      if (response.ok) {
        setChannels(data)
      } else {
        setError(data.error || 'Failed to fetch channels')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch channels')
      setChannels([])
    } finally {
      setLoading(false)
    }
  }

  const refreshChannels = () => {
    if (selectedServer?.id) {
      fetchChannels(selectedServer.id)
    }
  }

  useEffect(() => {
    if (selectedServer?.id) {
      fetchChannels()
    } else {
      setChannels([])
      setError(null)
    }
  }, [selectedServer?.id])

  // فلترة القنوات حسب النوع
  const textChannels = channels.filter(channel => channel.type === 0)
  const voiceChannels = channels.filter(channel => channel.type === 2)
  const categoryChannels = channels.filter(channel => channel.type === 4)

  // تجميع القنوات حسب الفئة
  const channelsByCategory = channels.reduce((acc, channel) => {
    const categoryId = channel.parent_id || 'uncategorized'
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    acc[categoryId].push(channel)
    return acc
  }, {} as Record<string, DiscordChannel[]>)

  return {
    channels,
    textChannels,
    voiceChannels,
    categoryChannels,
    channelsByCategory,
    loading,
    error,
    refreshChannels,
    hasChannels: channels.length > 0
  }
}

// Hook مخصص للحصول على قناة محددة
export function useDiscordChannel(channelId: string | null) {
  const { channels } = useDiscordChannels()
  
  const channel = channels.find(c => c.id === channelId) || null
  
  return {
    channel,
    isValid: !!channel,
    isTextChannel: channel?.type === 0,
    isVoiceChannel: channel?.type === 2,
    isCategoryChannel: channel?.type === 4
  }
}

// Hook للحصول على قائمة القنوات المناسبة لكل قسم
export function useChannelsForSection(section: 'welcome' | 'auto-reply' | 'ads' | 'events' | 'moderation' | 'general' | 'protection') {
  const { textChannels, loading, error, refreshChannels } = useDiscordChannels()
  
  // فلترة القنوات المناسبة لكل قسم
  const getChannelsForSection = (sectionType: string) => {
    switch (sectionType) {
      case 'welcome':
        return textChannels.filter(channel => 
          channel.name.includes('welcome') || 
          channel.name.includes('general') ||
          channel.name.includes('lobby')
        )
      case 'auto-reply':
        return textChannels // جميع القنوات النصية
      case 'ads':
        return textChannels // جميع القنوات النصية للإعلانات
      case 'events':
        return textChannels.filter(channel => 
          channel.name.includes('event') || 
          channel.name.includes('announce') ||
          channel.name.includes('general')
        )
      case 'moderation':
        return textChannels // جميع القنوات النصية للمراقبة
      default:
        return textChannels
    }
  }
  
  const suitableChannels = getChannelsForSection(section)
  
  return {
    channels: suitableChannels,
    allChannels: textChannels,
    loading,
    error,
    refreshChannels,
    hasChannels: suitableChannels.length > 0
  }
}