import { useState, useEffect } from 'react'
import { useSelectedServer } from '@/contexts/selected-server-context'

interface ServerSettings {
  autoReply: {
    enabled: boolean
    smartReply: boolean
    defaultCooldown: number
    maxResponsesPerHour: number
    replies: any[]
  }
  ads: {
    enabled: boolean
    ads: any[]
  }
  members: {
    welcomeMessage: {
      enabled: boolean
      message: string
    }
  }
  protection: {
    spamProtection: boolean
    raidProtection: boolean
    autoModeration: boolean
  }
  backup: {
    autoBackup: boolean
    backupInterval: number
  }
}

export function useServerSettings() {
  const { selectedServer } = useSelectedServer()
  const [settings, setSettings] = useState<ServerSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // جلب إعدادات السيرفر المحدد
  const fetchSettings = async (serverId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/server-settings/${serverId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch server settings')
      }
      
      const data = await response.json()
      setSettings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Error fetching server settings:', err)
    } finally {
      setLoading(false)
    }
  }

  // تحديث إعدادات السيرفر
  const updateSettings = async (newSettings: Partial<ServerSettings>) => {
    if (!selectedServer?.id) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/server-settings/${selectedServer.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update server settings')
      }
      
      const data = await response.json()
      setSettings(data.settings)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Error updating server settings:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // تحديث قسم معين من الإعدادات
  const updateSection = async (section: keyof ServerSettings, data: any) => {
    if (!selectedServer?.id) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/server-settings/${selectedServer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ section, data })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update server section')
      }
      
      const result = await response.json()
      
      // تحديث الإعدادات المحلية
      setSettings(prev => prev ? {
        ...prev,
        [section]: result.data
      } : null)
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Error updating server section:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // جلب الإعدادات عند تغيير السيرفر المحدد
  useEffect(() => {
    if (selectedServer?.id) {
      fetchSettings(selectedServer.id)
    } else {
      setSettings(null)
    }
  }, [selectedServer?.id])

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateSection,
    refetch: () => selectedServer?.id && fetchSettings(selectedServer.id)
  }
}