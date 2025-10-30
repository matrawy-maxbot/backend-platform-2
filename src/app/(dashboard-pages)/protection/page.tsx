"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { useProtectionSettings } from "@/hooks/useProtectionSettings"
import { useSelectedServer } from "@/contexts/selected-server-context"
import { useDiscordDataForSection } from '@/hooks/useDiscordData'
import { DiscordDataLoader } from '@/components/discord-data-loader'
import { useActivityTracker } from '@/components/ActivityTracker'

import { 
  Shield, 
  Ban, 
  AlertTriangle, 
  Bot,
  Link,
  Crown,
  Filter,
  Image,
  Check,
  Clock,
  MessageSquare
} from "lucide-react"

import BotManagementTabsContent from "@/app/(dashboard-pages)/protection/components/botManagement"
import ModerationControlsTabsContent from "@/app/(dashboard-pages)/protection/components/moderationControls"
import BadWordsTabsContent from "@/app/(dashboard-pages)/protection/components/badWords"
import LinksTabsContent from "@/app/(dashboard-pages)/protection/components/links"
import ChannelContentTabsContent from "@/app/(dashboard-pages)/protection/components/channelContent"

function ProtectionPage() {
  const { selectedServer } = useSelectedServer()
  const {
    channelsContentSettings,
    botManagementSettings,
    moderationSettings,
    badWordsSettings,
    linksSettings,
    antiSpamSettings,
    updateChannelsContentSettings,
    updateBotManagementSettings,
    updateModerationSettings,
    updateBadWordsSettings,
    updateLinksSettings,
    updateAntiSpamSettings,
    saveSettings,
    loading,
    saving,
    hasUnsavedChanges,
    lastSaved
  } = useProtectionSettings()
  
  const { trackProtectionUpdate, logActivity } = useActivityTracker()
  
  // جلب القنوات من Discord API
  const { 
    availableChannels, 
    loading: discordDataLoading,
    hasSelectedServer,
    error: discordDataError,
    refreshData 
  } = useDiscordDataForSection('protection')
  
  // Active Tab State
  const [activeTab, setActiveTab] = useState("bot-management")
  
  const [newBadWord, setNewBadWord] = useState("")
  
  // Function to get user-friendly mode names
  
  // Combine all settings into localProtectionSettings
  const localProtectionSettings = {
    botManagement: botManagementSettings,
    antiSpam: antiSpamSettings,
    moderation: moderationSettings,
    badWords: badWordsSettings,
    links: linksSettings,
    channels: channelsContentSettings
  }
  
  // Generic function to update protection settings
  const updateProtectionSetting = async (section: string, key: string, value: any, customMessage?: string) => {
    switch (section) {
      case 'botManagement':
        updateBotManagementSettings({ [key]: value })
        break
      case 'antiSpam':
        updateAntiSpamSettings({ [key]: value })
        break
      case 'moderation':
        updateModerationSettings({ [key]: value })
        break
      case 'badWords':
        updateBadWordsSettings({ [key]: value })
        break
      case 'links':
        updateLinksSettings({ [key]: value })
        break
      case 'channels':
        updateChannelsContentSettings({ [key]: value })
        break
      default:
        console.warn(`Unknown protection section: ${section}`)
    }
    
    // تسجيل النشاط
    let logMessage = customMessage
    if (!logMessage) {
      // Convert value to readable string
      let valueText = value
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          valueText = value.length > 0 ? value.join(', ') : 'empty list'
        } else {
          valueText = JSON.stringify(value)
        }
      } else if (typeof value === 'boolean') {
        valueText = value ? 'enabled' : 'disabled'
      }
      logMessage = `تم تحديث إعداد ${key} في قسم ${section} إلى: ${valueText}`
    }
    
    await trackProtectionUpdate(`${section} - ${key}`, logMessage)
  }
  
  // Handle channel selection for picture channels
  const handlePictureChannelToggle = (channelId: string) => {
    const currentChannels = badWordsSettings.pictureChannels || []
    const newChannels = currentChannels.includes(channelId)
      ? currentChannels.filter(id => id !== channelId)
      : [...currentChannels, channelId]
    updateBadWordsSettings({ pictureChannels: newChannels })
  }

  // Auto-save status component
  const AutoSaveStatus = () => {
    if (saving) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 animate-spin" />
          <span>جاري الحفظ...</span>
        </div>
      )
    }
    
    if (hasUnsavedChanges) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>تغييرات غير محفوظة</span>
        </div>
      )
    }
    
    if (lastSaved) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          <span>تم الحفظ تلقائياً في {lastSaved.toLocaleTimeString('ar-SA')}</span>
        </div>
      )
    }
    
    return null
  }

  const addBadWord = async () => {
    if (newBadWord.trim() && !localProtectionSettings.badWords.words.includes(newBadWord.trim())) {
      const newWordsList = [...localProtectionSettings.badWords.words, newBadWord.trim()]
      await updateProtectionSetting('badWords', 'words', newWordsList)
      setNewBadWord("")
    }
  }

  const removeBadWord = async (word) => {
    const newWordsList = localProtectionSettings.badWords.words.filter(w => w !== word)
    await updateProtectionSetting('badWords', 'words', newWordsList)
  }

  const addBlockedLink = async () => {
    const newBlockedLinks = [{ content: "", action: "delete", channels: [] }, ...localProtectionSettings.links.blockedLinks]
    await updateProtectionSetting('links', 'blockedLinks', newBlockedLinks)
  }

  const removeBlockedLink = async (index: number) => {
    const newBlockedLinks = localProtectionSettings.links.blockedLinks.filter((_, i) => i !== index)
    await updateProtectionSetting('links', 'blockedLinks', newBlockedLinks)
  }

  const updateBlockedLinkContent = async (index: number, field: string, value: any) => {
    const newBlockedLinks = [...localProtectionSettings.links.blockedLinks]
    newBlockedLinks[index] = { ...newBlockedLinks[index], [field]: value }
    await updateProtectionSetting('links', 'blockedLinks', newBlockedLinks)
  }

  const updateBlockedLinkAction = async (index: number, action: string) => {
    const newBlockedLinks = [...localProtectionSettings.links.blockedLinks]
    newBlockedLinks[index] = { ...newBlockedLinks[index], action }
    await updateProtectionSetting('links', 'blockedLinks', newBlockedLinks)
  }

  const toggleChannelForBlockedLink = async (linkIndex: number, channelId: string) => {
    const newBlockedLinks = [...localProtectionSettings.links.blockedLinks]
    const link = newBlockedLinks[linkIndex]
    const channels = link.channels.includes(channelId)
      ? link.channels.filter(id => id !== channelId)
      : [...link.channels, channelId]
    newBlockedLinks[linkIndex] = { ...link, channels }
    await updateProtectionSetting('links', 'blockedLinks', newBlockedLinks)
  }

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative space-y-6 custom-scroll">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-500" />
              Server Protection
            </h1>
            <p className="text-gray-400">Comprehensive protection settings for your Discord server with advanced moderation controls</p>
          </div>
          <AutoSaveStatus />
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Protection Status</p>
                <p className="text-2xl font-bold text-green-500">Active</p>
              </div>
              <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Blocked Threats</p>
                <p className="text-2xl font-bold text-blue-500">247</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Ban className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Security Level</p>
                <p className="text-2xl font-bold text-yellow-500">High</p>
              </div>
              <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Protection Sections */}
      <Tabs defaultValue="bot-management" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 relative overflow-hidden p-1">
          <TabsTrigger value="bot-management" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/40 data-[state=active]:animate-pulse transition-all duration-700 ease-out hover:bg-blue-600/30 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 transform relative z-10 rounded-lg">
            <Bot className="h-4 w-4 mr-2 transition-all duration-700 data-[state=active]:rotate-[360deg] data-[state=active]:scale-125 hover:rotate-12 hover:scale-110" />
            <span className="transition-all duration-500 data-[state=active]:font-bold data-[state=active]:tracking-wide">Bot Management</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-red-500/40 data-[state=active]:animate-pulse transition-all duration-700 ease-out hover:bg-red-600/30 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 transform relative z-10 rounded-lg">
            <Crown className="h-4 w-4 mr-2 transition-all duration-700 data-[state=active]:rotate-[360deg] data-[state=active]:scale-125 hover:rotate-12 hover:scale-110" />
            <span className="transition-all duration-500 data-[state=active]:font-bold data-[state=active]:tracking-wide">Moderation Controls</span>
          </TabsTrigger>
          <TabsTrigger value="bad-words" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-yellow-500/40 data-[state=active]:animate-pulse transition-all duration-700 ease-out hover:bg-yellow-600/30 hover:scale-110 hover:shadow-lg hover:shadow-yellow-500/30 transform relative z-10 rounded-lg">
            <Filter className="h-4 w-4 mr-2 transition-all duration-700 data-[state=active]:rotate-[360deg] data-[state=active]:scale-125 hover:rotate-12 hover:scale-110" />
            <span className="transition-all duration-500 data-[state=active]:font-bold data-[state=active]:tracking-wide">Bad Words</span>
          </TabsTrigger>
          <TabsTrigger value="links" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-green-500/40 data-[state=active]:animate-pulse transition-all duration-700 ease-out hover:bg-green-600/30 hover:scale-110 hover:shadow-lg hover:shadow-green-500/30 transform relative z-10 rounded-lg">
            <Link className="h-4 w-4 mr-2 transition-all duration-700 data-[state=active]:rotate-[360deg] data-[state=active]:scale-125 hover:rotate-12 hover:scale-110" />
            <span className="transition-all duration-500 data-[state=active]:font-bold data-[state=active]:tracking-wide">Links</span>
          </TabsTrigger>
          <TabsTrigger value="channels" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/40 data-[state=active]:animate-pulse transition-all duration-700 ease-out hover:bg-purple-600/30 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30 transform relative z-10 rounded-lg">
            <MessageSquare className="h-4 w-4 mr-2 transition-all duration-700 data-[state=active]:rotate-[360deg] data-[state=active]:scale-125 hover:rotate-12 hover:scale-110" />
            <span className="transition-all duration-500 data-[state=active]:font-bold data-[state=active]:tracking-wide">Channels Content</span>
          </TabsTrigger>
        </TabsList>

        {/* Bot Management Tab */}
        <BotManagementTabsContent localProtectionSettings={localProtectionSettings} updateProtectionSetting={updateProtectionSetting} />

        {/* Moderation Controls Tab */}
        <ModerationControlsTabsContent localProtectionSettings={localProtectionSettings} updateProtectionSetting={updateProtectionSetting} />

        {/* Bad Words Tab */}
        <BadWordsTabsContent localProtectionSettings={localProtectionSettings} updateProtectionSetting={updateProtectionSetting} availableChannels={availableChannels} addBadWord={addBadWord} removeBadWord={removeBadWord} newBadWord={newBadWord} setNewBadWord={setNewBadWord} handlePictureChannelToggle={handlePictureChannelToggle} />

        {/* Links Tab */}
        <LinksTabsContent localProtectionSettings={localProtectionSettings} updateProtectionSetting={updateProtectionSetting} availableChannels={availableChannels} addBlockedLink={addBlockedLink} removeBlockedLink={removeBlockedLink} updateBlockedLinkContent={updateBlockedLinkContent} updateBlockedLinkAction={updateBlockedLinkAction} toggleChannelForBlockedLink={toggleChannelForBlockedLink} />

        {/* channels Tab */}
        <ChannelContentTabsContent localProtectionSettings={localProtectionSettings} updateProtectionSetting={updateProtectionSetting} availableChannels={availableChannels} />
      </Tabs>

      {/* Recent Activity */}
      <Card className="bg-[#25293e]/60 border-[#2d3142] backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Latest protection-related events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                <span className="text-white text-sm">Blocked raid attempt from 15 accounts</span>
              </div>
              <Badge variant="destructive">5 minutes ago</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span className="text-white text-sm">Member muted for spam violation</span>
              </div>
              <Badge variant="secondary">12 minutes ago</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-white text-sm">Protection settings updated successfully</span>
              </div>
              <Badge variant="outline">1 hour ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// تغليف الصفحة بـ ProtectedRoute
function WrappedProtectionPage() {
  const discordData = useDiscordDataForSection('protection')
  
  return (
    <ProtectedRoute>
      <DiscordDataLoader 
        loading={discordData.loading}
        error={discordData.error}
        hasSelectedServer={discordData.hasSelectedServer}
        selectedServer={discordData.selectedServer}
        onRefresh={discordData.refreshData}
      >
        <ProtectionPage />
      </DiscordDataLoader>
    </ProtectedRoute>
  )
}

export { WrappedProtectionPage as default }