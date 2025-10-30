'use client'

import { useState, useEffect } from 'react'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { useServerSettings } from './useServerSettings'
import { useActivityTracker } from '@/components/ActivityTracker'

export interface WelcomeSettings {
  enabled: boolean
  message: string
  channel: string
}

export interface LeaveSettings {
  enabled: boolean
  message: string
  channel: string
}

export interface AutoRoleSettings {
  enabled: boolean
  roleId: string
}

export interface MemberSettings {
  welcomeMessage: WelcomeSettings
  leaveMessage: LeaveSettings
  autoRole: AutoRoleSettings
}

export function useWelcomeSettings() {
  const { selectedServer } = useSelectedServer()
  const { settings, loading: settingsLoading, updateSection } = useServerSettings()
  const { trackMemberUpdate, logActivity } = useActivityTracker()
  
  const [localSettings, setLocalSettings] = useState<MemberSettings>({
    welcomeMessage: {
      enabled: true,
      message: 'Welcome {user}! Welcome to {server}',
      channel: ''
    },
    leaveMessage: {
      enabled: false,
      message: 'Goodbye {user}, hope to see you soon!',
      channel: ''
    },
    autoRole: {
      enabled: false,
      roleId: ''
    }
  })
  
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Load settings from server when available
  useEffect(() => {
    if (settings?.members) {
      const newSettings = {
        welcomeMessage: {
          enabled: settings.members.welcomeMessage?.enabled ?? true,
          message: settings.members.welcomeMessage?.message ?? 'Welcome {user}! Welcome to {server}',
          channel: settings.members.welcomeMessage?.channel ?? ''
        },
        leaveMessage: {
          enabled: settings.members.leaveMessage?.enabled ?? false,
          message: settings.members.leaveMessage?.message ?? 'Goodbye {user}, hope to see you soon!',
          channel: settings.members.leaveMessage?.channel ?? ''
        },
        autoRole: {
          enabled: settings.members.autoRole?.enabled ?? false,
          roleId: settings.members.autoRole?.roleId ?? ''
        }
      }
      
      setLocalSettings(newSettings)
      // Only reset unsaved changes on initial load
      if (isInitialLoad) {
        setHasUnsavedChanges(false)
        setIsInitialLoad(false)
      }
    }
  }, [settings])

  // Update welcome message settings
  const updateWelcomeSettings = (updates: Partial<WelcomeSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      welcomeMessage: { ...prev.welcomeMessage, ...updates }
    }))
    setHasUnsavedChanges(true)
  }

  // Update leave message settings
  const updateLeaveSettings = (updates: Partial<LeaveSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      leaveMessage: { ...prev.leaveMessage, ...updates }
    }))
    setHasUnsavedChanges(true)
  }

  // Update auto role settings
  const updateAutoRoleSettings = (updates: Partial<AutoRoleSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      autoRole: { ...prev.autoRole, ...updates }
    }))
    setHasUnsavedChanges(true)
  }

  // Save settings to server
  const saveSettings = async () => {
    if (!selectedServer || saving) return false

    try {
      setSaving(true)
      
      const result = await updateSection('members', localSettings)
      
      if (result && result.success === true) {
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        
        // تسجيل النشاط
        await trackMemberUpdate('إعدادات الأعضاء', 'تم حفظ إعدادات الترحيب والمغادرة والرتب التلقائية')
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error saving welcome settings:', error)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Auto-save when settings change (with debounce)
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timeoutId = setTimeout(() => {
      saveSettings()
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [localSettings, hasUnsavedChanges])

  // Send welcome message
  const sendWelcomeMessage = async (user: any, server: any) => {
    if (!selectedServer || !localSettings.welcomeMessage.enabled) {
      return { success: false, message: 'Welcome messages are disabled' }
    }

    try {
      const response = await fetch(`/api/discord/${selectedServer.id}/welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'welcome',
          user,
          server
        })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error sending welcome message:', error)
      return { success: false, message: 'Failed to send welcome message' }
    }
  }

  // Send leave message
  const sendLeaveMessage = async (user: any, server: any) => {
    if (!selectedServer || !localSettings.leaveMessage.enabled) {
      return { success: false, message: 'Leave messages are disabled' }
    }

    try {
      const response = await fetch(`/api/discord/${selectedServer.id}/welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'leave',
          user,
          server
        })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error sending leave message:', error)
      return { success: false, message: 'Failed to send leave message' }
    }
  }

  // Get message preview
  const getMessagePreview = async (type: 'welcome' | 'leave') => {
    if (!selectedServer) return null

    try {
      const response = await fetch(`/api/discord/${selectedServer.id}/welcome?type=${type}`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error getting message preview:', error)
      return null
    }
  }

  return {
    // Settings
    welcomeSettings: localSettings.welcomeMessage,
    leaveSettings: localSettings.leaveMessage,
    autoRoleSettings: localSettings.autoRole,
    
    // Update functions
    updateWelcomeSettings,
    updateLeaveSettings,
    updateAutoRoleSettings,
    
    // Save functions
    saveSettings,
    
    // Message functions
    sendWelcomeMessage,
    sendLeaveMessage,
    getMessagePreview,
    
    // State
    loading: settingsLoading,
    saving,
    hasUnsavedChanges,
    lastSaved,
    
    // Server info
    selectedServer,
    hasSelectedServer: !!selectedServer
  }
}