"use client"

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface BotGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
  features: string[]
  hasBotAccess: boolean
}

export function useBotGuilds() {
  const [guilds, setGuilds] = useState<BotGuild[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const fetchBotGuilds = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/discord/bot-guilds')
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          
          if (response.status === 429) {
            setError(errorData.error || 'تم تجاوز حد الطلبات من Discord. يرجى المحاولة مرة أخرى بعد دقيقة.')
            return
          }
          
          if (response.status === 401) {
            setError('يجب تسجيل الدخول أولاً للوصول إلى السيرفرات')
            return
          }
          
          setError(errorData.error || 'فشل في جلب بيانات السيرفرات')
          return
        }
        
        const data = await response.json()
        setGuilds(data || [])
      } catch (err) {
        console.error('Error fetching bot guilds:', err)
        setError('حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.')
      } finally {
        setLoading(false)
      }
    }

    fetchBotGuilds()
  }, [isAuthenticated])

  return {
    guilds,
    loading,
    error,
    refetch: () => {
      if (isAuthenticated) {
        const fetchBotGuilds = async () => {
          try {
            setLoading(true)
            setError(null)
            
            const response = await fetch('/api/discord/bot-guilds')
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))
              
              if (response.status === 429) {
                setError(errorData.error || 'تم تجاوز حد الطلبات من Discord. يرجى المحاولة مرة أخرى بعد دقيقة.')
                return
              }
              
              if (response.status === 401) {
                setError('يجب تسجيل الدخول أولاً للوصول إلى السيرفرات')
                return
              }
              
              setError(errorData.error || 'فشل في جلب بيانات السيرفرات')
              return
            }
            
            const data = await response.json()
            setGuilds(data || [])
          } catch (err) {
            console.error('Error fetching bot guilds:', err)
            setError('حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.')
          } finally {
            setLoading(false)
          }
        }
        fetchBotGuilds()
      }
    }
  }
}