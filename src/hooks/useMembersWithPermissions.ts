"use client"

import { useState, useEffect } from 'react'
import { useSelectedServer } from '@/contexts/selected-server-context'

interface MemberWithPermissions {
  id: string
  username: string
  globalName?: string
  discriminator: string
  avatar: string
  nickname?: string
  roles: string[]
  permissions: string[]
  joinedAt: string
  isOnline: boolean
}

export function useMembersWithPermissions() {
  const [members, setMembers] = useState<MemberWithPermissions[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { selectedServer } = useSelectedServer()

  const fetchMembers = async () => {
    if (!selectedServer?.id) {
      setMembers([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/discord/${selectedServer.id}/members-with-permissions`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 401) {
          throw new Error('غير مصرح لك بالوصول إلى هذا الخادم. تأكد من تسجيل الدخول وأن لديك الصلاحيات المناسبة.')
        }
        throw new Error(errorData.error || 'فشل في جلب بيانات الأعضاء')
      }
      
      const data = await response.json()
      setMembers(data || [])
    } catch (err) {
      console.error('Error fetching members with permissions:', err)
      if (err instanceof Error && err.message.includes('401')) {
        setError('غير مصرح لك بالوصول إلى هذا الخادم. تأكد من تسجيل الدخول وأن لديك الصلاحيات المناسبة.')
      } else {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [selectedServer?.id])

  return {
    members,
    loading,
    error,
    refetch: fetchMembers
  }
}