'use client'

import { useState, useEffect } from 'react'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { useServerSettings } from '@/hooks/useServerSettings'
import { useActivityTracker } from '@/components/ActivityTracker'

export interface channelsContentSettings {
  enabled: boolean
  mode: 'allow_all' | 'block_all' | 'whitelist' | 'blacklist' | 'text_required' | 'text_whitelist'
  channels: string[]
}

export interface BotManagementSettings {
  enabled: boolean
  allowedBots: string[]
  blockUnknownBots: boolean
  disallowBots: boolean
  deleteRepeatedMessages: boolean
}

export interface ModerationSettings {
  enabled: boolean
  autoDelete: boolean
  warnUser: boolean
  logChannel: string
  maxKickBan: number
  memberPunishment: 'kick' | 'ban' | 'remove roles'
}

export interface BadWordsSettings {
  enabled: boolean
  words: string[]
  action: 'delete' | 'warn' | 'timeout'
  punishment: 'Warn message' | 'none' | 'Mute chat' | 'kick'
  customMessage: string
  pictureChannels: string[]
  botCommandChannels: string[]
}

export interface LinksSettings {
  enabled: boolean
  allowDiscordInvites: boolean
  allowedDomains: string[]
  blockAll: boolean
  whitelistChannels: string[]
  blockedLinks: Array<{
    content: string
    action: 'delete' | 'warn' | 'timeout'
    channels: string[]
  }>
}

export interface AntiSpamSettings {
  enabled: boolean
  maxMessages: number
  timeWindow: number
  action: 'delete' | 'warn' | 'timeout' | 'kick'
}

export interface ProtectionSettings {
  channels: channelsContentSettings
  botManagement: BotManagementSettings
  moderation: ModerationSettings
  badWords: BadWordsSettings
  links: LinksSettings
  antiSpam: AntiSpamSettings
}

export function useProtectionSettings() {
  const { selectedServer } = useSelectedServer()
  const { settings, loading: settingsLoading, updateSection } = useServerSettings()
  const { trackProtectionUpdate } = useActivityTracker()
  
  const [localSettings, setLocalSettings] = useState<ProtectionSettings>({
    channels: {
      enabled: false,
      mode: 'allow_all',
      channels: []
    },
    botManagement: {
      enabled: false,
      allowedBots: [],
      blockUnknownBots: false,
      disallowBots: false,
      deleteRepeatedMessages: false
    },
    moderation: {
      enabled: false,
      autoDelete: false,
      warnUser: false,
      logChannel: '',
      maxKickBan: 5,
      memberPunishment: 'kick'
    },
    badWords: {
      enabled: false,
      words: [],
      action: 'delete',
      customMessage: '',
      pictureChannels: [],
      botCommandChannels: [],
      punishment: 'Warn message'
      
    },
    links: {
      enabled: false,
      allowDiscordInvites: false,
      allowedDomains: [],
      blockAll: false,
      whitelistChannels: [],
      blockedLinks: []
    },
    antiSpam: {
      enabled: false,
      maxMessages: 5,
      timeWindow: 10,
      action: 'delete'
    }
  })
  
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [justSaved, setJustSaved] = useState(false)

  // Load settings from server when available
  useEffect(() => {
    if (settings?.protection && !justSaved && !hasUnsavedChanges && !saving) {
      console.log('🔄 Loading protection settings from server:', settings.protection)
      
      // Only update settings on initial load or if there are no local changes
      if (isInitialLoad) {
        // تحديث الإعدادات المحلية مع البيانات من السيرفر في التحميل الأولي فقط
        setLocalSettings(prevSettings => ({
          channels: {
            ...prevSettings.channels,
            ...(settings.protection.channels || {})
          },
          botManagement: {
            ...prevSettings.botManagement,
            ...(settings.protection.botManagement || {})
          },
          moderation: {
            ...prevSettings.moderation,
            ...(settings.protection.moderation || {})
          },
          badWords: {
            ...prevSettings.badWords,
            ...(settings.protection.badWords || {})
          },
          links: {
            ...prevSettings.links,
            ...(settings.protection.links || {})
          },
          antiSpam: {
            ...prevSettings.antiSpam,
            ...(settings.protection.antiSpam || {})
          }
        }))
        
        setIsInitialLoad(false)
        console.log('✅ Initial protection settings loaded from server')
      } else {
        console.log('⚠️ Skipping server settings reload to preserve user changes')
      }
    }
  }, [settings?.protection, justSaved, hasUnsavedChanges, saving, isInitialLoad])

  // Separate effect to handle justSaved reset
  useEffect(() => {
    if (justSaved) {
      const timer = setTimeout(() => {
        console.log('⏰ Resetting justSaved flag after 5 seconds')
        setJustSaved(false)
      }, 5000) // Reduced from 10 to 5 seconds
      
      return () => clearTimeout(timer)
    }
  }, [justSaved])

  // Update channels settings
  const updateChannelsContentSettings = (updates: Partial<channelsContentSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      channels: { ...prev.channels, ...updates }
    }))
    setHasUnsavedChanges(true)
    
    // Track the specific changes
    Object.keys(updates).forEach(key => {
      trackProtectionUpdate(`إعدادات القنوات - ${key}`, `تم تحديث إعداد ${key} في قسم إعدادات القنوات`)
    })
  }

  // Update specific channels setting with immediate save for mode changes
  const updatechannelsContentSetting = async (key: keyof channelsContentSettings, value: any) => {
    console.log(`🔄 Updating channels setting: ${key} = ${value}`)
    
    const newChannelsContentSettings = { ...localSettings.channels, [key]: value }
    const newSettings = { ...localSettings, channels: newChannelsContentSettings }
    
    setLocalSettings(newSettings)
    setHasUnsavedChanges(true)
    
    // Immediate save for mode changes to ensure persistence
    if (key === 'mode') {
      console.log('🚀 Mode change detected - triggering immediate save')
      
      // Small delay to ensure state update is processed
      await new Promise(resolve => setTimeout(resolve, 100))
      
      try {
        await saveSettings()
        console.log('✅ Mode change saved immediately')
      } catch (error) {
        console.error('❌ Failed to save mode change immediately:', error)
      }
    }
  }

  // Update bot management settings
  const updateBotManagementSettings = (updates: Partial<BotManagementSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      botManagement: { ...prev.botManagement, ...updates }
    }))
    setHasUnsavedChanges(true)
    
    // Track the specific changes
    Object.keys(updates).forEach(key => {
      trackProtectionUpdate(`إدارة البوتات - ${key}`, `تم تحديث إعداد ${key} في قسم إدارة البوتات`)
    })
  }

  // Update moderation settings
  const updateModerationSettings = (updates: Partial<ModerationSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      moderation: { ...prev.moderation, ...updates }
    }))
    setHasUnsavedChanges(true)
    
    // Track the specific changes
    Object.keys(updates).forEach(key => {
      trackProtectionUpdate(`الإشراف - ${key}`, `تم تحديث إعداد ${key} في قسم الإشراف`)
    })
  }

  // Update bad words settings
  const updateBadWordsSettings = (updates: Partial<BadWordsSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      badWords: { ...prev.badWords, ...updates }
    }))
    setHasUnsavedChanges(true)
    
    // Track the specific changes
    Object.keys(updates).forEach(key => {
      trackProtectionUpdate(`الكلمات المحظورة - ${key}`, `تم تحديث إعداد ${key} في قسم الكلمات المحظورة`)
    })
  }

  // Update links settings
  const updateLinksSettings = (updates: Partial<LinksSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      links: { ...prev.links, ...updates }
    }))
    setHasUnsavedChanges(true)
    
    // Track the specific changes
    Object.keys(updates).forEach(key => {
      trackProtectionUpdate(`الروابط - ${key}`, `تم تحديث إعداد ${key} في قسم الروابط`)
    })
  }

  // Update anti-spam settings
  const updateAntiSpamSettings = (updates: Partial<AntiSpamSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      antiSpam: { ...prev.antiSpam, ...updates }
    }))
    setHasUnsavedChanges(true)
    
    // Track the specific changes
    Object.keys(updates).forEach(key => {
      trackProtectionUpdate(`مكافحة السبام - ${key}`, `تم تحديث إعداد ${key} في قسم مكافحة السبام`)
    })
  }

  // Save settings function with enhanced persistence
  const saveSettings = async () => {
    if (!selectedServer?.id || saving) return
    
    try {
      setSaving(true)
      console.log('💾 Saving protection settings to server...', localSettings)
      
      const result = await updateSection('protection', localSettings)
      
      if (result?.success) {
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        setJustSaved(true)
        console.log('✅ Protection settings saved successfully')
        
        // Track protection settings update
        trackProtectionUpdate('إعدادات الحماية', 'تم حفظ جميع إعدادات الحماية بنجاح')
        
        // Force a longer delay to ensure server persistence
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        return result
      } else {
        throw new Error('Save operation failed')
      }
    } catch (error) {
      console.error('❌ Failed to save protection settings:', error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  // Auto-save effect with debouncing
  useEffect(() => {
    if (localSettings && hasUnsavedChanges && !isInitialLoad && !saving && !justSaved) {
      console.log('⏰ Auto-save triggered - debouncing for 5 seconds')
      
      const timer = setTimeout(async () => {
        try {
          console.log('💾 Auto-saving protection settings...')
          await saveSettings()
        } catch (error) {
          console.error('❌ Auto-save failed:', error)
        }
      }, 5000) // 5 seconds debounce
      
      return () => clearTimeout(timer)
    }
  }, [localSettings, hasUnsavedChanges, isInitialLoad, saving, justSaved])

  return {
    // Settings
    channelsContentSettings: localSettings.channels,
    botManagementSettings: localSettings.botManagement,
    moderationSettings: localSettings.moderation,
    badWordsSettings: localSettings.badWords,
    linksSettings: localSettings.links,
    antiSpamSettings: localSettings.antiSpam,
    
    // Update functions
    updateChannelsContentSettings,
    updatechannelsContentSetting,
    updateBotManagementSettings,
    updateModerationSettings,
    updateBadWordsSettings,
    updateLinksSettings,
    updateAntiSpamSettings,
    
    // Save functions
    saveSettings,
    
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