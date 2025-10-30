"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { 
  MessageSquare, 
  Bot, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings, 
  Activity, 
  Clock, 
  Users, 
  TrendingUp,
  Zap,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Server,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import DiscordPreview from "@/components/discord-preview"
import { useServerSettings } from "@/hooks/useServerSettings"
import { useActivityTracker } from '@/components/ActivityTracker'

import { useDiscordDataForSection } from '@/hooks/useDiscordData'
import { DiscordDataLoader } from '@/components/discord-data-loader'

interface AutoReply {
  id: string
  name: string
  triggers: string[]
  responses: string[]
  enabled: boolean
  conditions: string[]
  channels: string[]
  roles: string[]
  cooldown: number
  usageCount: number
  lastUsed: string
}

export default function AutoReplyPage() {
  const { settings, loading: settingsLoading, updateSection } = useServerSettings()
  const { trackAutoReplyUpdate, logActivity } = useActivityTracker()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingReply, setEditingReply] = useState<AutoReply | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [previewReply, setPreviewReply] = useState<AutoReply | null>(null)
  const [collapsedReplies, setCollapsedReplies] = useState<Set<string>>(new Set())
  
  // Local storage states
  const [localAutoReplies, setLocalAutoReplies] = useState<AutoReply[]>([])
  const [localAutoReplyEnabled, setLocalAutoReplyEnabled] = useState(true)
  const [localSmartReplyEnabled, setLocalSmartReplyEnabled] = useState(false)
  
  // استخدام الإعدادات من السيرفر المحدد أو local storage
  const autoReplyEnabled = localAutoReplyEnabled
  const smartReplyEnabled = localSmartReplyEnabled
  const autoReplies = localAutoReplies

  // يمكن للمستخدم طي أي كرت حسب الحاجة

  // دالة للتحكم في طي وتوسيع الردود
  const toggleReplyCollapse = (replyId: string) => {
    setCollapsedReplies(prev => {
      const newSet = new Set(prev)
      if (newSet.has(replyId)) {
        newSet.delete(replyId)
      } else {
        newSet.add(replyId)
      }
      return newSet
    })
  }
  
  const [newReply, setNewReply] = useState({
    name: "",
    triggers: [""] as string[],
    responses: [""] as string[],
    conditions: [] as string[],
    channels: [] as string[],
    roles: [] as string[],
    cooldown: 0
  })
  
  // جلب القنوات والرتب من Discord API
  const { 
    availableChannels, 
    availableRoles, 
    getRoleColor, 
    loading: discordDataLoading,
    hasSelectedServer,
    selectedServer,
    error: discordDataError,
    refreshData 
  } = useDiscordDataForSection('auto-reply')
  
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0)
  const [currentTriggerIndex, setCurrentTriggerIndex] = useState(0)

  // Local Storage Functions
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      if (typeof window !== 'undefined' && selectedServer?.id) {
        const serverKey = `${selectedServer.id}_${key}`
        localStorage.setItem(serverKey, JSON.stringify(data))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
    try {
      if (typeof window !== 'undefined' && selectedServer?.id) {
        const serverKey = `${selectedServer.id}_${key}`
        const saved = localStorage.getItem(serverKey)
        return saved ? JSON.parse(saved) : defaultValue
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
    return defaultValue
  }

  // دالة لحفظ جميع بيانات السيرفر
  const saveServerData = (serverId: string, data: {
    autoReplies: AutoReply[],
    autoReplyEnabled: boolean,
    smartReplyEnabled: boolean
  }) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${serverId}_autoReplies`, JSON.stringify(data.autoReplies))
        localStorage.setItem(`${serverId}_autoReplyEnabled`, JSON.stringify(data.autoReplyEnabled))
        localStorage.setItem(`${serverId}_smartReplyEnabled`, JSON.stringify(data.smartReplyEnabled))
      }
    } catch (error) {
      console.error('Error saving server data:', error)
    }
  }

  // دالة لتحميل جميع بيانات السيرفر
  const loadServerData = (serverId: string) => {
    try {
      if (typeof window !== 'undefined') {
        const autoReplies = JSON.parse(localStorage.getItem(`${serverId}_autoReplies`) || '[]')
        const autoReplyEnabled = JSON.parse(localStorage.getItem(`${serverId}_autoReplyEnabled`) || 'true')
        const smartReplyEnabled = JSON.parse(localStorage.getItem(`${serverId}_smartReplyEnabled`) || 'false')
        
        return { autoReplies, autoReplyEnabled, smartReplyEnabled }
      }
    } catch (error) {
      console.error('Error loading server data:', error)
    }
    return { autoReplies: [], autoReplyEnabled: true, smartReplyEnabled: false }
  }

  // دالة مزامنة مع API
  const syncWithAPI = async (data: any) => {
    try {
      await updateAutoReplySettings(data)
      console.log('تم مزامنة البيانات مع الخادم بنجاح')
    } catch (error) {
      console.error('خطأ في مزامنة البيانات مع الخادم:', error)
      // يمكن إضافة نظام إعادة المحاولة هنا
    }
  }

  // Load data from server first, then fallback to localStorage
  useEffect(() => {
    if (selectedServer?.id && settings?.autoReply) {
      // تحميل البيانات من الخادم أولاً
      setLocalAutoReplies(settings.autoReply.replies || [])
      setLocalAutoReplyEnabled(settings.autoReply.enabled ?? true)
      setLocalSmartReplyEnabled(settings.autoReply.smartReplyEnabled ?? false)
    } else if (selectedServer?.id) {
      // إذا لم تكن هناك بيانات في الخادم، استخدم local storage
      const serverData = loadServerData(selectedServer.id)
      
      setLocalAutoReplies(serverData.autoReplies)
      setLocalAutoReplyEnabled(serverData.autoReplyEnabled)
      setLocalSmartReplyEnabled(serverData.smartReplyEnabled)
    } else {
      // إعادة تعيين البيانات عند عدم وجود سيرفر محدد
      setLocalAutoReplies([])
      setLocalAutoReplyEnabled(true)
      setLocalSmartReplyEnabled(false)
    }
  }, [selectedServer?.id, settings?.autoReply])

  // Sync localStorage data to server if server has no data
  useEffect(() => {
    if (selectedServer?.id && !settingsLoading && (!settings?.autoReply || !settings.autoReply.replies)) {
      const serverData = loadServerData(selectedServer.id)
      if (serverData.autoReplies.length > 0) {
        // مزامنة البيانات من local storage إلى الخادم
        syncWithAPI({
          replies: serverData.autoReplies,
          enabled: serverData.autoReplyEnabled,
          smartReplyEnabled: serverData.smartReplyEnabled
        })
      }
    }
  }, [selectedServer?.id, settings?.autoReply, settingsLoading])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (selectedServer?.id) {
      saveServerData(selectedServer.id, {
        autoReplies: localAutoReplies,
        autoReplyEnabled: localAutoReplyEnabled,
        smartReplyEnabled: localSmartReplyEnabled
      })
    }
  }, [localAutoReplies, localAutoReplyEnabled, localSmartReplyEnabled, selectedServer?.id])

  // دوال تحديث الإعدادات
  const updateAutoReplySettings = async (newSettings: any) => {
    try {
      await updateSection('autoReply', newSettings)
    } catch (error) {
      console.error('Error updating auto reply settings:', error)
    }
  }
  
  const setAutoReplyEnabled = async (enabled: boolean) => {
    setLocalAutoReplyEnabled(enabled)
    await syncWithAPI({
      ...settings?.autoReply,
      enabled
    })
    trackAutoReplyUpdate(`تم ${enabled ? 'تفعيل' : 'إلغاء تفعيل'} نظام الردود التلقائية`)
  }
  
  const setSmartReplyEnabled = async (enabled: boolean) => {
    setLocalSmartReplyEnabled(enabled)
    await syncWithAPI({
      ...settings?.autoReply,
      smartReplyEnabled: enabled
    })
    trackAutoReplyUpdate(`تم ${enabled ? 'تفعيل' : 'إلغاء تفعيل'} نظام الردود الذكية`)
  }

  const handleCreateReply = async () => {
    const reply: AutoReply = {
      id: Date.now().toString(),
      name: newReply.name,
      triggers: newReply.triggers.filter(t => t.trim() !== ""),
      responses: newReply.responses.filter(r => r.trim() !== ""),
      enabled: true,
      conditions: newReply.conditions,
      channels: newReply.channels,
      roles: newReply.roles,
      cooldown: newReply.cooldown,
      usageCount: 0,
      lastUsed: "Never"
    }
    
    const updatedReplies = [reply, ...localAutoReplies]
    setLocalAutoReplies(updatedReplies)
    await syncWithAPI({
      ...settings?.autoReply,
      replies: updatedReplies
    })
    
    setNewReply({ name: "", triggers: [""], responses: [""], conditions: [], channels: [], roles: [], cooldown: 0 })
    setCurrentResponseIndex(0)
    setCurrentTriggerIndex(0)
    setShowCreateModal(false)
    trackAutoReplyUpdate(`تم إنشاء رد تلقائي جديد: ${reply.name}`)
  }
  
  const handleAddResponse = () => {
    if (editingReply) {
      setEditingReply({
        ...editingReply,
        responses: [...editingReply.responses, ""]
      })
    } else {
      setNewReply({
        ...newReply,
        responses: [...newReply.responses, ""]
      })
    }
  }
  
  const handleRemoveResponse = (index: number) => {
    if (editingReply) {
      const newResponses = editingReply.responses.filter((_, i) => i !== index)
      setEditingReply({
        ...editingReply,
        responses: newResponses.length > 0 ? newResponses : [""]
      })
    } else {
      const newResponses = newReply.responses.filter((_, i) => i !== index)
      setNewReply({
        ...newReply,
        responses: newResponses.length > 0 ? newResponses : [""]
      })
    }
  }
  
  const handleResponseChange = (index: number, value: string) => {
    if (editingReply) {
      const newResponses = [...editingReply.responses]
      newResponses[index] = value
      setEditingReply({
        ...editingReply,
        responses: newResponses
      })
    } else {
      const newResponses = [...newReply.responses]
      newResponses[index] = value
      setNewReply({
        ...newReply,
        responses: newResponses
      })
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent, index: number, type: 'trigger' | 'response') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const currentItems = type === 'trigger' 
        ? (editingReply ? editingReply.triggers : newReply.triggers)
        : (editingReply ? editingReply.responses : newReply.responses)
      
      // If this is the last item and it's not empty, add a new one
      if (index === currentItems.length - 1 && currentItems[index].trim() !== '') {
        if (type === 'trigger') {
          handleAddTrigger()
        } else {
          handleAddResponse()
        }
        // Focus will be set to the new input after state update
        setTimeout(() => {
          const nextInput = document.querySelector(`[data-${type}-index="${index + 1}"]`) as HTMLInputElement | HTMLTextAreaElement
          if (nextInput) {
            nextInput.focus()
          }
        }, 0)
      } else if (index < currentItems.length - 1) {
        // Move to next existing item
        const nextInput = document.querySelector(`[data-${type}-index="${index + 1}"]`) as HTMLInputElement | HTMLTextAreaElement
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }
  
  const handleAddTrigger = () => {
    if (editingReply) {
      setEditingReply({
        ...editingReply,
        triggers: [...editingReply.triggers, ""]
      })
    } else {
      setNewReply({
        ...newReply,
        triggers: [...newReply.triggers, ""]
      })
    }
  }
  
  const handleRemoveTrigger = (index: number) => {
    if (editingReply) {
      const newTriggers = editingReply.triggers.filter((_, i) => i !== index)
      setEditingReply({
        ...editingReply,
        triggers: newTriggers.length > 0 ? newTriggers : [""]
      })
    } else {
      const newTriggers = newReply.triggers.filter((_, i) => i !== index)
      setNewReply({
        ...newReply,
        triggers: newTriggers.length > 0 ? newTriggers : [""]
      })
    }
  }
  
  const handleTriggerChange = (index: number, value: string) => {
    if (editingReply) {
      const newTriggers = [...editingReply.triggers]
      newTriggers[index] = value
      setEditingReply({
        ...editingReply,
        triggers: newTriggers
      })
    } else {
      const newTriggers = [...newReply.triggers]
      newTriggers[index] = value
      setNewReply({
        ...newReply,
        triggers: newTriggers
      })
    }
  }
  
  const handleChannelToggle = (channelId: string) => {
    if (editingReply) {
      const currentChannels = editingReply.channels
      const newChannels = currentChannels.includes(channelId)
        ? currentChannels.filter(id => id !== channelId)
        : [...currentChannels, channelId]
      setEditingReply({
        ...editingReply,
        channels: newChannels
      })
    } else {
      const currentChannels = newReply.channels
      const newChannels = currentChannels.includes(channelId)
        ? currentChannels.filter(id => id !== channelId)
        : [...currentChannels, channelId]
      setNewReply({
        ...newReply,
        channels: newChannels
      })
    }
  }

  const handleDeleteReply = async (id: string) => {
    const replyToDelete = localAutoReplies.find(reply => reply.id === id)
    const updatedReplies = localAutoReplies.filter(reply => reply.id !== id)
    setLocalAutoReplies(updatedReplies)
    await syncWithAPI({
      ...settings?.autoReply,
      replies: updatedReplies
    })
    if (replyToDelete) {
      trackAutoReplyUpdate(`تم حذف الرد التلقائي: ${replyToDelete.name}`)
    }
  }

  const handleToggleReply = async (id: string) => {
    const replyToToggle = localAutoReplies.find(reply => reply.id === id)
    const updatedReplies = localAutoReplies.map(reply => 
      reply.id === id ? { ...reply, enabled: !reply.enabled } : reply
    )
    setLocalAutoReplies(updatedReplies)
    await syncWithAPI({
      ...settings?.autoReply,
      replies: updatedReplies
    })
    if (replyToToggle) {
      trackAutoReplyUpdate(`تم ${!replyToToggle.enabled ? 'تفعيل' : 'إلغاء تفعيل'} الرد التلقائي: ${replyToToggle.name}`)
    }
  }

  const filteredReplies = autoReplies.filter(reply => 
    reply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reply.triggers.some(trigger => trigger.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8 min-h-screen relative">
      <DiscordDataLoader
        loading={discordDataLoading}
        error={discordDataError}
        hasSelectedServer={hasSelectedServer}
        selectedServer={selectedServer}
        onRefresh={refreshData}
        showServerInfo={false}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={selectedServer?.icon ? `https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png` : '/defaults/avatar.svg'}
              alt={selectedServer?.name || 'Server'}
              className="w-10 h-10 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/defaults/avatar.svg';
            }}
          />
          <div>
            <h2 className="text-lg font-semibold text-white">{selectedServer?.name}</h2>
            <p className="text-sm text-gray-400">إعدادات الرد التلقائي</p>
          </div>
          {settingsLoading && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Bot className="h-8 w-8 text-purple-500" />
          Auto Reply System
        </h1>
        <p className="text-gray-400">إدارة الردود التلقائية لسيرفر Discord الخاص بك</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Status</p>
                <p className={`text-2xl font-bold ${autoReplyEnabled ? 'text-green-400' : 'text-red-400'}`}>
                  {autoReplyEnabled ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                autoReplyEnabled ? 'bg-green-400/20' : 'bg-red-400/20'
              }`}>
                <Bot className={`h-6 w-6 ${autoReplyEnabled ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Replies</p>
                <p className="text-2xl font-bold text-blue-400">
                  {autoReplies.filter(r => r.enabled).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Responses</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {autoReplies.reduce((sum, reply) => sum + reply.usageCount, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">98.5%</p>
              </div>
              <div className="h-12 w-12 bg-green-400/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="replies" className="space-y-6">
        <TabsList className="bg-[#25293e]/60 border-[#2d3142]">
          <TabsTrigger value="replies" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Auto Replies
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Settings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="replies" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search auto replies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 w-64"
                />
              </div>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Auto Reply
            </Button>
          </div>

          {/* Auto Replies List */}
          <div className="space-y-4">
            {filteredReplies.map((reply) => {
              const isInactive = !reply.enabled;
              const isCollapsed = collapsedReplies.has(reply.id);
              return (
                <Card key={reply.id} className={`transition-all duration-300 ${
                  isInactive
                    ? 'bg-gray-900/30 border-gray-600/50 hover:bg-gray-900/40'
                    : 'bg-gray-900/50 border-gray-700'
                }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReplyCollapse(reply.id)}
                          className="p-1 h-6 w-6 text-gray-400 hover:text-gray-300 hover:bg-gray-800/20"
                        >
                          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                        </Button>
                        <h3 className="text-lg font-semibold text-white truncate max-w-md" title={reply.name}>{reply.name}</h3>
                        <Badge 
                          variant={reply.enabled ? "default" : "secondary"}
                          className={reply.enabled ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                        >
                          {reply.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {reply.usageCount} uses
                        </Badge>
                      </div>
                      
                      {!isCollapsed && (
                        <div className="space-y-2">
                          <div>
                            <Label className="text-sm text-gray-400">Trigger Keywords ({reply.triggers.length}):</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {reply.triggers.map((trigger, index) => (
                                <Badge key={index} variant="outline" className="text-xs font-mono bg-gray-800 border-gray-600">
                                  {trigger}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-gray-400">Responses ({reply.responses.length}):</Label>
                            <div className="space-y-2 mt-1">
                              {reply.responses.map((response, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <Badge variant="outline" className="text-xs mt-1 min-w-[24px] justify-center">
                                    {index + 1}
                                  </Badge>
                                  <p className="text-white text-sm leading-relaxed flex-1">
                                    {response}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-gray-400">Target Channels ({reply.channels.length}):</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {reply.channels.length > 0 ? (
                                reply.channels.map((channelId, index) => {
                                  const channel = availableChannels.find(ch => ch.id === channelId)
                                  return (
                                    <Badge key={index} variant="secondary" className="text-xs bg-blue-400/20 text-blue-300 border-blue-400/30">
                                      {channel ? channel.name : `#${channelId}`}
                                    </Badge>
                                  )
                                })
                              ) : (
                                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                                  All Channels
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>Cooldown: {reply.cooldown}s</span>
                            <span>Last used: {reply.lastUsed}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={reply.enabled}
                        onCheckedChange={() => handleToggleReply(reply.id)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => {
                          setPreviewReply(reply)
                          setShowPreview(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => setEditingReply(reply)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                        onClick={() => handleDeleteReply(reply.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure global auto reply settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Enable Auto Reply System</Label>
                    <p className="text-sm text-gray-400 mt-1">Turn on/off the entire auto reply system</p>
                  </div>
                  <Switch
                    checked={autoReplyEnabled}
                    onCheckedChange={setAutoReplyEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Smart Reply (AI)</Label>
                    <p className="text-sm text-gray-400 mt-1">Use AI to generate contextual responses</p>
                  </div>
                  <Switch
                    checked={smartReplyEnabled}
                    onCheckedChange={setSmartReplyEnabled}
                  />
                </div>
                
                <div>
                  <Label className="text-white mb-3 block">Default Cooldown (seconds)</Label>
                  <Input 
                    type="number"
                    defaultValue="30"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-white mb-3 block">Max Responses per User/Hour</Label>
                  <Input 
                    type="number"
                    defaultValue="10"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Discord Integration */}
            <Card className="bg-[#25293e]/60 border-[#2d3142] backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Discord Integration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Connect and configure Discord bot settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Bot Connected</p>
                      <p className="text-sm text-gray-400">AutoReply Bot#1234</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Online
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-white mb-3 block">Bot Token</Label>
                  <Input 
                    type="password"
                    placeholder="Enter your Discord bot token"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <Label className="text-white mb-3 block">Server ID</Label>
                  <Input 
                    placeholder="Enter your Discord server ID"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white">
                  Test Connection
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#25293e]/60 border-[#2d3142] backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500 mb-2">98.5%</div>
                <p className="text-sm text-gray-400">+2.3% from last week</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#25293e]/60 border-[#2d3142] backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500 mb-2">0.8s</div>
                <p className="text-sm text-gray-400">-0.2s from last week</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#25293e]/60 border-[#2d3142] backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Most Active Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-yellow-500 mb-2">Welcome Message</div>
                <p className="text-sm text-gray-400">247 uses this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-[#25293e]/60 border-[#2d3142] backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Latest auto reply responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#2d3142]/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">Welcome Message triggered by @newuser</span>
                  </div>
                  <Badge variant="outline">2 minutes ago</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#2d3142]/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white text-sm">FAQ Response sent to @helpseeker</span>
                  </div>
                  <Badge variant="outline">5 minutes ago</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#2d3142]/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-white text-sm">Custom reply created: "Server Info"</span>
                  </div>
                  <Badge variant="outline">1 hour ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingReply) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] bg-gray-900/95 border-gray-700 shadow-2xl">
            <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
              <CardHeader className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-10">
                <CardTitle className="text-white text-xl">
                  {editingReply ? 'Edit Auto Reply' : 'Create New Auto Reply'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
              <div>
                <Label className="text-white mb-2 block">Reply Name</Label>
                <Input 
                  value={editingReply ? editingReply.name : newReply.name}
                  onChange={(e) => editingReply ? 
                    setEditingReply({...editingReply, name: e.target.value}) :
                    setNewReply({...newReply, name: e.target.value})
                  }
                  placeholder="Enter reply name"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white">Trigger Keywords</Label>
                  <Button 
                    type="button"
                    onClick={handleAddTrigger}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Trigger
                  </Button>
                </div>
                <div className="space-y-3">
                  {(editingReply ? editingReply.triggers : newReply.triggers).map((trigger, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs min-w-[24px] justify-center">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <Input 
                          data-trigger-index={index}
                          value={trigger}
                          onChange={(e) => handleTriggerChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'trigger')}
                          placeholder={`Enter trigger keyword ${index + 1} (Press Enter to add next trigger)`}
                          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                      {(editingReply ? editingReply.triggers : newReply.triggers).length > 1 && (
                        <Button 
                          type="button"
                          onClick={() => handleRemoveTrigger(index)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 h-auto"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Tip: Press Enter to automatically move to the next trigger field.
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white">Response Messages</Label>
                  <Button 
                    type="button"
                    onClick={handleAddResponse}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Response
                  </Button>
                </div>
                <div className="space-y-3">
                  {(editingReply ? editingReply.responses : newReply.responses).map((response, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs mt-2 min-w-[24px] justify-center">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <Textarea 
                          data-response-index={index}
                          value={response}
                          onChange={(e) => handleResponseChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'response')}
                          placeholder={`Enter response message ${index + 1} (Press Enter to add next response)`}
                          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-[80px] resize-none"
                        />
                      </div>
                      {(editingReply ? editingReply.responses : newReply.responses).length > 1 && (
                        <Button 
                          type="button"
                          onClick={() => handleRemoveResponse(index)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 mt-2 h-auto"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Tip: Press Enter to automatically move to the next response field. Use Shift+Enter for new lines.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Cooldown (seconds)</Label>
                  <Input 
                    type="number"
                    value={editingReply ? editingReply.cooldown : newReply.cooldown}
                    onChange={(e) => editingReply ? 
                      setEditingReply({...editingReply, cooldown: parseInt(e.target.value) || 0}) :
                      setNewReply({...newReply, cooldown: parseInt(e.target.value) || 0})
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-white mb-2 block">Target Channels</Label>
                  <div className="bg-gray-800/50 border border-gray-600 rounded-md p-3 max-h-48 overflow-y-auto custom-scrollbar backdrop-blur-sm">
                    <div className="space-y-2">
                      {availableChannels.map((channel) => {
                        const isSelected = (editingReply ? editingReply.channels : newReply.channels).includes(channel.id)
                        return (
                          <div key={channel.id} className="flex items-center space-x-3 hover:bg-gray-700/50 p-2 rounded-md transition-all duration-200 group">
                            <input
                              type="checkbox"
                              id={`channel-${channel.id}`}
                              checked={isSelected}
                              onChange={() => handleChannelToggle(channel.id)}
                              className="w-4 h-4 text-blue-500 bg-gray-900 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                            />
                            <label htmlFor={`channel-${channel.id}`} className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <span className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors duration-200">{channel.name}</span>
                                <span className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors duration-200">{channel.description}</span>
                              </div>
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">
                      💡 Select one or more channels where this auto-reply will be active. Leave empty for all channels.
                    </p>
                    {(editingReply ? editingReply.channels : newReply.channels).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-gray-400">Selected:</span>
                        {(editingReply ? editingReply.channels : newReply.channels).map((channelId) => {
                          const channel = availableChannels.find(ch => ch.id === channelId)
                          return (
                            <Badge key={channelId} variant="secondary" className="text-xs bg-blue-400/20 text-blue-300 border-blue-400/30">
                              {channel ? channel.name : `#${channelId}`}
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-700/50 mt-6">
                <Button 
                  onClick={editingReply ? async () => {
                    // Update existing reply
                    const updatedReplies = localAutoReplies.map(reply => 
                      reply.id === editingReply.id ? {
                        ...editingReply,
                        triggers: editingReply.triggers.filter(t => t.trim() !== ""),
                        responses: editingReply.responses.filter(r => r.trim() !== "")
                      } : reply
                    )
                    setLocalAutoReplies(updatedReplies)
                    
                    await syncWithAPI({
                      ...settings?.autoReply,
                      replies: updatedReplies
                    })
                    
                    setEditingReply(null)
                    setCurrentResponseIndex(0)
                    setCurrentTriggerIndex(0)
                  } : handleCreateReply}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  {editingReply ? 'Update Reply' : 'Create Reply'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const currentReply = editingReply || {
                      id: 'preview',
                      name: newReply.name || 'Preview Reply',
                      triggers: newReply.triggers.filter(t => t.trim() !== ''),
                      responses: newReply.responses.filter(r => r.trim() !== ''),
                      enabled: true,
                      conditions: newReply.conditions,
                      channels: newReply.channels,
                      roles: newReply.roles,
                      cooldown: newReply.cooldown,
                      usageCount: 0,
                      lastUsed: 'Never'
                    }
                    setPreviewReply(currentReply)
                    setShowPreview(true)
                  }}
                  className="border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingReply(null)
                    setCurrentResponseIndex(0)
                    setCurrentTriggerIndex(0)
                    setNewReply({ name: "", triggers: [""], responses: [""], conditions: [], channels: [], roles: [], cooldown: 0 })
                  }}
                  className="border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
            </div>
          </Card>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewReply && (
        <DiscordPreview
          reply={previewReply}
          onClose={() => {
            setShowPreview(false)
            setPreviewReply(null)
          }}
        />
      )}
      </DiscordDataLoader>
    </div>
  )
}