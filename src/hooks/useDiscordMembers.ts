'use client'

import { useState, useEffect } from 'react'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { useAuth } from '@/hooks/useAuth'

export interface DiscordMember {
  id: string
  username: string
  globalName?: string
  nickname?: string
  avatar?: string
  isBot: boolean
  roles: string[]
  joinedAt: string
  premiumSince?: string
  pending?: boolean
  communicationDisabledUntil?: string
}

export function useDiscordMembers() {
  const [members, setMembers] = useState<DiscordMember[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { selectedServer } = useSelectedServer()
  const { isAuthenticated } = useAuth()

  const fetchMembers = async () => {
    if (!selectedServer?.id || !isAuthenticated) {
      setMembers([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/discord/${selectedServer.id}/members`)
      
      if (response.status === 401) {
        setError('غير مصرح لك بالوصول')
        return
      }

      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الأعضاء')
      }

      const data = await response.json()
      setMembers(data || [])
    } catch (err) {
      console.error('Error fetching Discord members:', err)
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [selectedServer?.id, isAuthenticated])

  const refreshMembers = () => {
    fetchMembers()
  }

  // Filter functions
  const getHumanMembers = () => members.filter(member => !member.isBot)
  const getBotMembers = () => members.filter(member => member.isBot)
  const getOnlineMembers = () => members.filter(member => !member.communicationDisabledUntil)
  const getPendingMembers = () => members.filter(member => member.pending)
  const getPremiumMembers = () => members.filter(member => member.premiumSince)

  return {
    members,
    humanMembers: getHumanMembers(),
    botMembers: getBotMembers(),
    onlineMembers: getOnlineMembers(),
    pendingMembers: getPendingMembers(),
    premiumMembers: getPremiumMembers(),
    loading,
    error,
    hasMembers: members.length > 0,
    totalMembers: members.length,
    totalHumans: getHumanMembers().length,
    totalBots: getBotMembers().length,
    refreshMembers
  }
}

// Hook للحصول على عضو محدد
export function useDiscordMember(memberId: string | null) {
  const { members } = useDiscordMembers()
  
  const member = members.find(m => m.id === memberId) || null
  
  return {
    member,
    isValid: !!member,
    isBot: member?.isBot || false,
    isPending: member?.pending || false,
    isPremium: !!member?.premiumSince,
    isMuted: !!member?.communicationDisabledUntil
  }
}

// Hook للبحث في الأعضاء
export function useSearchMembers(searchTerm: string = '') {
  const { members, loading, error } = useDiscordMembers()
  
  const filteredMembers = members.filter(member => {
    if (!searchTerm) return true
    
    const term = searchTerm.toLowerCase()
    return (
      member.username.toLowerCase().includes(term) ||
      member.globalName?.toLowerCase().includes(term) ||
      member.nickname?.toLowerCase().includes(term)
    )
  })
  
  return {
    members: filteredMembers,
    loading,
    error,
    hasResults: filteredMembers.length > 0,
    totalResults: filteredMembers.length
  }
}