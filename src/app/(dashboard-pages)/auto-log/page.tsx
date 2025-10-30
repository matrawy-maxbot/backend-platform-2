'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { UserPlus, UserMinus, Shield, Users, Settings, Crown, Hash, MessageSquare, Save, Loader2 } from 'lucide-react'
import { useDiscordChannels } from '@/hooks/useDiscordChannels'
import { DiscordDataLoader } from '@/components/discord-data-loader'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { useActivityTracker } from '@/components/ActivityTracker'
import { toast } from 'sonner'

export default function AutoLogPage() {
  const { trackAutoLogUpdate, logActivity } = useActivityTracker()
  const [logMode, setLogMode] = useState<'none' | 'auto' | 'manual'>('none')
  const [joinLeaveEnabled, setJoinLeaveEnabled] = useState(false)
  const [kickBanEnabled, setKickBanEnabled] = useState(false)
  const [membersEnabled, setMembersEnabled] = useState(false)
  const [serverSettingsEnabled, setServerSettingsEnabled] = useState(false)
  const [rolesEnabled, setRolesEnabled] = useState(false)
  const [channelsEnabled, setChannelsEnabled] = useState(false)
  const [messagesEnabled, setMessagesEnabled] = useState(false)

  const [joinLeaveChannel, setJoinLeaveChannel] = useState<string | undefined>(undefined)
  const [kickBanChannel, setKickBanChannel] = useState<string | undefined>(undefined)
  const [membersChannel, setMembersChannel] = useState<string | undefined>(undefined)
  const [serverSettingsChannel, setServerSettingsChannel] = useState<string | undefined>(undefined)
  const [rolesChannel, setRolesChannel] = useState<string | undefined>(undefined)
  const [channelsChannel, setChannelsChannel] = useState<string | undefined>(undefined)
  const [messagesChannel, setMessagesChannel] = useState<string | undefined>(undefined)

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingChannels, setIsCreatingChannels] = useState(false)

  // جلب القنوات من السيرفر المحدد
  const { textChannels, loading, error, hasChannels } = useDiscordChannels()
  const { selectedServer } = useSelectedServer()
  
  // التحقق من وجود سيرفر محدد
  const hasSelectedServer = !!selectedServer

  // تحميل الإعدادات الحالية
  useEffect(() => {
    if (selectedServer?.id) {
      loadManualLogSettings()
    }
  }, [selectedServer?.id])

  const loadManualLogSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/manual-log?serverId=${selectedServer?.id}`)
      
      if (response.ok) {
        const data = await response.json()
        const settings = data.data
        
        if (settings) {
          setLogMode(settings.enabled ? 'manual' : 'none')
          setJoinLeaveEnabled(settings.categories?.joinLeave?.enabled || false)
          setKickBanEnabled(settings.categories?.kickBan?.enabled || false)
          setMembersEnabled(settings.categories?.members?.enabled || false)
          setServerSettingsEnabled(settings.categories?.serverSettings?.enabled || false)
          setRolesEnabled(settings.categories?.roles?.enabled || false)
          setChannelsEnabled(settings.categories?.channels?.enabled || false)
          setMessagesEnabled(settings.categories?.messages?.enabled || false)
          
          setJoinLeaveChannel(settings.categories?.joinLeave?.channelId)
          setKickBanChannel(settings.categories?.kickBan?.channelId)
          setMembersChannel(settings.categories?.members?.channelId)
          setServerSettingsChannel(settings.categories?.serverSettings?.channelId)
          setRolesChannel(settings.categories?.roles?.channelId)
          setChannelsChannel(settings.categories?.channels?.channelId)
          setMessagesChannel(settings.categories?.messages?.channelId)
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل إعدادات Manual Log:', error)
      toast.error('فشل في تحميل الإعدادات')
    } finally {
      setIsLoading(false)
    }
  }

  const saveManualLogSettings = async () => {
    if (!selectedServer?.id) {
      toast.error('يرجى اختيار خادم أولاً')
      return
    }

    try {
      setIsSaving(true)
      
      const settings = {
        enabled: logMode === 'manual',
        channelId: null, // يمكن استخدامه لاحقاً للقناة العامة
        categories: {
          joinLeave: {
            enabled: joinLeaveEnabled,
            channelId: joinLeaveChannel || null
          },
          kickBan: {
            enabled: kickBanEnabled,
            channelId: kickBanChannel || null
          },
          members: {
            enabled: membersEnabled,
            channelId: membersChannel || null
          },
          serverSettings: {
            enabled: serverSettingsEnabled,
            channelId: serverSettingsChannel || null
          },
          roles: {
            enabled: rolesEnabled,
            channelId: rolesChannel || null
          },
          channels: {
            enabled: channelsEnabled,
            channelId: channelsChannel || null
          },
          messages: {
            enabled: messagesEnabled,
            channelId: messagesChannel || null
          },
          adminActions: {
            enabled: false,
            channelId: null
          }
        }
      }

      const response = await fetch('/api/manual-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverId: selectedServer.id,
          settings
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('تم حفظ إعدادات Manual Log بنجاح!')
        console.log('تم حفظ الإعدادات بنجاح:', result)
        
        // تتبع نشاط حفظ إعدادات Manual Log
        await logActivity({
          user: 'المستخدم',
          userId: 'user-id',
          avatar: null,
          action: 'حفظ إعدادات السجل اليدوي',
          section: 'Manual Log',
          details: `تم حفظ إعدادات السجل اليدوي - الحالة: ${logMode === 'manual' ? 'مفعل' : 'معطل'}`,
          type: 'update',
          severity: 'success',
          serverId: selectedServer?.id
        })
        
        trackAutoLogUpdate('تم حفظ إعدادات السجل اليدوي بنجاح')
      } else {
        const errorData = await response.json().catch(() => ({ error: 'خطأ غير معروف' }))
        console.error('خطأ في الاستجابة:', response.status, errorData)
        toast.error(errorData.error || `فشل في حفظ الإعدادات (${response.status})`)
      }
    } catch (error) {
      console.error('خطأ في حفظ إعدادات Manual Log:', error)
      toast.error('حدث خطأ أثناء حفظ الإعدادات')
    } finally {
      setIsSaving(false)
    }
  }

  const saveAutoLogSettings = async () => {
    if (!selectedServer?.id) {
      toast.error('يرجى اختيار خادم أولاً')
      return
    }

    try {
      setIsSaving(true)
      
      const settings = {
        enabled: logMode === 'auto',
        channelId: null, // يمكن استخدامه لاحقاً للقناة العامة
        categories: {
          joinLeave: {
            enabled: joinLeaveEnabled,
            channelId: joinLeaveChannel || null
          },
          kickBan: {
            enabled: kickBanEnabled,
            channelId: kickBanChannel || null
          },
          members: {
            enabled: membersEnabled,
            channelId: membersChannel || null
          },
          serverSettings: {
            enabled: serverSettingsEnabled,
            channelId: serverSettingsChannel || null
          },
          roles: {
            enabled: rolesEnabled,
            channelId: rolesChannel || null
          },
          channels: {
            enabled: channelsEnabled,
            channelId: channelsChannel || null
          },
          messages: {
            enabled: messagesEnabled,
            channelId: messagesChannel || null
          },
          adminActions: {
            enabled: false,
            channelId: null
          }
        }
      }

      const response = await fetch('/api/auto-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverId: selectedServer.id,
          settings
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('تم حفظ إعدادات Auto Log بنجاح!')
        console.log('تم حفظ الإعدادات بنجاح:', result)
        
        // تتبع نشاط حفظ إعدادات Auto Log
        await logActivity({
          user: 'المستخدم',
          userId: 'user-id',
          avatar: null,
          action: 'حفظ إعدادات السجل التلقائي',
          section: 'Auto Log',
          details: `تم حفظ إعدادات السجل التلقائي - الحالة: ${logMode === 'auto' ? 'مفعل' : 'معطل'}`,
          type: 'update',
          severity: 'success',
          serverId: selectedServer?.id
        })
        
        trackAutoLogUpdate('تم حفظ إعدادات السجل التلقائي بنجاح')
      } else {
        const errorData = await response.json().catch(() => ({ error: 'خطأ غير معروف' }))
        console.error('خطأ في الاستجابة:', response.status, errorData)
        toast.error(errorData.error || `فشل في حفظ الإعدادات (${response.status})`)
      }
    } catch (error) {
      console.error('خطأ في حفظ إعدادات Auto Log:', error)
      toast.error('حدث خطأ أثناء حفظ الإعدادات')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCategoryToggle = async (category: string, enabled: boolean) => {
    const categoryNames: { [key: string]: string } = {
      'joinLeave': 'الانضمام والمغادرة',
      'kickBan': 'الطرد والحظر',
      'members': 'الأعضاء',
      'serverSettings': 'إعدادات الخادم',
      'roles': 'الأدوار',
      'channels': 'القنوات',
      'messages': 'الرسائل'
    }

    switch (category) {
      case 'joinLeave':
        setJoinLeaveEnabled(enabled)
        break
      case 'kickBan':
        setKickBanEnabled(enabled)
        break
      case 'members':
        setMembersEnabled(enabled)
        break
      case 'serverSettings':
        setServerSettingsEnabled(enabled)
        break
      case 'roles':
        setRolesEnabled(enabled)
        break
      case 'channels':
        setChannelsEnabled(enabled)
        break
      case 'messages':
        setMessagesEnabled(enabled)
        break
    }

    // تتبع نشاط تغيير إعدادات الفئة
    await logActivity({
      user: 'المستخدم',
      userId: 'user-id',
      avatar: null,
      action: `${enabled ? 'تفعيل' : 'إلغاء تفعيل'} فئة ${categoryNames[category]}`,
      section: 'Manual Log',
      details: `تم ${enabled ? 'تفعيل' : 'إلغاء تفعيل'} فئة ${categoryNames[category]} في السجل اليدوي`,
      type: 'update',
      severity: 'info',
      serverId: selectedServer?.id
    })

    // إذا تم تفعيل أي فئة، قم بتفعيل Manual Log
    if (enabled) {
      setLogMode('manual')
    } else {
      // إذا تم إلغاء تفعيل جميع الفئات، قم بإلغاء تفعيل Manual Log
      const allDisabled = !joinLeaveEnabled && !kickBanEnabled && !membersEnabled && 
                         !serverSettingsEnabled && !rolesEnabled && !channelsEnabled && !messagesEnabled
      if (allDisabled && category === 'joinLeave' && !enabled) {
        setLogMode('none')
      }
    }
  }

  const createAutoLogChannels = async () => {
    if (!selectedServer?.id) {
      toast.error('يرجى اختيار خادم أولاً')
      return
    }

    try {
      setIsCreatingChannels(true)
      
      const response = await fetch('/api/create-log-channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverId: selectedServer.id
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('تم إنشاء قنوات Log بنجاح!')
        
        // تحديث الإعدادات بالقنوات الجديدة
        if (result.data?.channels) {
          const channels = result.data.channels
          setJoinLeaveChannel(channels.joinLeave)
          setKickBanChannel(channels.kickBan)
          setMembersChannel(channels.members)
          setServerSettingsChannel(channels.serverSettings)
          setRolesChannel(channels.roles)
          setChannelsChannel(channels.channels)
          setMessagesChannel(channels.messages)
          
          // تفعيل جميع الفئات
          setJoinLeaveEnabled(true)
          setKickBanEnabled(true)
          setMembersEnabled(true)
          setServerSettingsEnabled(true)
          setRolesEnabled(true)
          setChannelsEnabled(true)
          setMessagesEnabled(true)
          
          // الحفاظ على وضع Auto Log - لا نغير الوضع
          
          // حفظ الإعدادات في نظام Auto Log
          await saveAutoLogSettings()
          
          // تتبع نشاط إنشاء قنوات Auto Log
          await logActivity({
            user: 'المستخدم',
            userId: 'user-id',
            avatar: null,
            action: 'إنشاء قنوات السجل التلقائي',
            section: 'Auto Log',
            details: `تم إنشاء ${Object.keys(channels).length} قنوات للسجل التلقائي وتفعيل جميع الفئات`,
            type: 'create',
            severity: 'success',
            serverId: selectedServer?.id
          })
        }
        
        console.log('تم إنشاء القنوات بنجاح:', result)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'خطأ غير معروف' }))
        console.error('خطأ في الاستجابة:', response.status, errorData)
        toast.error(errorData.error || `فشل في إنشاء القنوات (${response.status})`)
      }
    } catch (error) {
      console.error('خطأ في إنشاء قنوات Log:', error)
      toast.error('حدث خطأ أثناء إنشاء القنوات')
    } finally {
      setIsCreatingChannels(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen text-white p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">جاري تحميل الإعدادات...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Auto Log</h1>
        <Button 
          onClick={logMode === 'auto' ? saveAutoLogSettings : saveManualLogSettings}
          disabled={isSaving || !hasSelectedServer}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>

      {/* عرض حالة تحميل البيانات */}
      <DiscordDataLoader 
        loading={loading}
        error={error}
        hasSelectedServer={hasSelectedServer}
        showServerInfo={true}
      >

      <div className="space-y-6">
        {/* Auto log Card - الصف الأول */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl font-semibold">Auto log</CardTitle>
              <Switch 
                checked={logMode === 'auto'} 
                onCheckedChange={(checked) => setLogMode(checked ? 'auto' : 'none')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </CardHeader>
          {logMode === 'auto' && (
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <p className="text-gray-300 text-sm">
                  عند تفعيل Auto log، يمكنك إنشاء القنوات المطلوبة تلقائياً
                </p>
                <Button 
                  onClick={createAutoLogChannels}
                  disabled={!hasSelectedServer || isCreatingChannels}
                  className="bg-green-600 hover:bg-green-700 text-white w-fit"
                >
                  {isCreatingChannels ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      <Hash className="w-4 h-4 mr-2" />
                      إنشاء قنوات Log تلقائياً
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Manual log Card - الصف الثاني */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl font-semibold">Manual log</CardTitle>
              <Switch 
                checked={logMode === 'manual'} 
                onCheckedChange={(checked) => setLogMode(checked ? 'manual' : 'none')}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </CardHeader>
          <CardContent className={`p-6 transition-opacity duration-300 ${logMode !== 'manual' ? 'opacity-40' : 'opacity-100'}`}>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {/* Join & leave */}
               <div className="flex flex-col space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                 <div className="flex items-center space-x-3 mb-2">
                   <div className="flex items-center space-x-2">
                     <UserPlus className="w-5 h-5 text-green-400" />
                     <Label className="text-white font-medium text-sm">Join & Leave</Label>
                   </div>
                   <Switch 
                     checked={logMode === 'manual' && joinLeaveEnabled} 
                     onCheckedChange={(checked) => handleCategoryToggle('joinLeave', checked)}
                     disabled={logMode !== 'manual'}
                     className="data-[state=checked]:bg-blue-600"
                   />
                 </div>
                 <div className="text-xs text-gray-400 mb-3">
                   Log member joins and leaves from the server
                 </div>
                 <Select 
                   value={joinLeaveChannel} 
                   onValueChange={setJoinLeaveChannel}
                   disabled={logMode !== 'manual' || !joinLeaveEnabled}
                 >
                   <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-xs h-8">
                     <SelectValue placeholder="Choose Channel" />
                   </SelectTrigger>
                   <SelectContent className="bg-gray-800 border-gray-700">
                     {textChannels.map((channel) => (
                       <SelectItem key={channel.id} value={channel.id} className="text-white hover:bg-gray-700">
                         #{channel.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               {/* Kick & Ban */}
                <div className="flex flex-col space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      <Label className="text-white font-medium text-sm">Kick & Ban</Label>
                    </div>
                    <Switch 
                      checked={logMode === 'manual' && kickBanEnabled} 
                      onCheckedChange={(checked) => handleCategoryToggle('kickBan', checked)}
                      disabled={logMode !== 'manual'}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    Log member kicks and bans
                  </div>
                  <Select 
                    value={kickBanChannel} 
                    onValueChange={setKickBanChannel}
                    disabled={logMode !== 'manual' || !kickBanEnabled}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-xs h-8">
                      <SelectValue placeholder="Choose Channel" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {textChannels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id} className="text-white hover:bg-gray-700">
                          #{channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

               {/* Members */}
               <div className="flex flex-col space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                 <div className="flex items-center space-x-3 mb-2">
                   <div className="flex items-center space-x-2">
                     <Users className="w-5 h-5 text-blue-400" />
                     <Label className="text-white font-medium text-sm">Members</Label>
                   </div>
                   <Switch 
                     checked={logMode === 'manual' && membersEnabled} 
                     onCheckedChange={(checked) => handleCategoryToggle('members', checked)}
                     disabled={logMode !== 'manual'}
                     className="data-[state=checked]:bg-blue-600"
                   />
                 </div>
                 <div className="text-xs text-gray-400 mb-3">
                   Log member data changes
                 </div>
                 <Select 
                   value={membersChannel} 
                   onValueChange={setMembersChannel}
                   disabled={logMode !== 'manual' || !membersEnabled}
                 >
                   <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-xs h-8">
                     <SelectValue placeholder="Choose Channel" />
                   </SelectTrigger>
                   <SelectContent className="bg-gray-800 border-gray-700">
                     {textChannels.map((channel) => (
                       <SelectItem key={channel.id} value={channel.id} className="text-white hover:bg-gray-700">
                         #{channel.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               {/* Server Settings */}
               <div className="flex flex-col space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                 <div className="flex items-center space-x-3 mb-2">
                   <div className="flex items-center space-x-2">
                     <Settings className="w-5 h-5 text-purple-400" />
                     <Label className="text-white font-medium text-sm">Server Settings</Label>
                   </div>
                   <Switch 
                     checked={logMode === 'manual' && serverSettingsEnabled} 
                     onCheckedChange={(checked) => handleCategoryToggle('serverSettings', checked)}
                     disabled={logMode !== 'manual'}
                     className="data-[state=checked]:bg-blue-600"
                   />
                 </div>
                 <div className="text-xs text-gray-400 mb-3">
                   Log server settings changes
                 </div>
                 <Select 
                   value={serverSettingsChannel} 
                   onValueChange={setServerSettingsChannel}
                   disabled={logMode !== 'manual' || !serverSettingsEnabled}
                 >
                   <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-xs h-8">
                     <SelectValue placeholder="Choose Channel" />
                   </SelectTrigger>
                   <SelectContent className="bg-gray-800 border-gray-700">
                     {textChannels.map((channel) => (
                       <SelectItem key={channel.id} value={channel.id} className="text-white hover:bg-gray-700">
                         #{channel.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               {/* Roles */}
               <div className="flex flex-col space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                 <div className="flex items-center space-x-3 mb-2">
                   <div className="flex items-center space-x-2">
                     <Crown className="w-5 h-5 text-yellow-400" />
                     <Label className="text-white font-medium text-sm">Roles</Label>
                   </div>
                   <Switch 
                     checked={logMode === 'manual' && rolesEnabled} 
                     onCheckedChange={(checked) => handleCategoryToggle('roles', checked)}
                     disabled={logMode !== 'manual'}
                     className="data-[state=checked]:bg-blue-600"
                   />
                 </div>
                 <div className="text-xs text-gray-400 mb-3">
                   Log member role changes
                 </div>
                 <Select 
                   value={rolesChannel} 
                   onValueChange={setRolesChannel}
                   disabled={logMode !== 'manual' || !rolesEnabled}
                 >
                   <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-xs h-8">
                     <SelectValue placeholder="Choose Channel" />
                   </SelectTrigger>
                   <SelectContent className="bg-gray-800 border-gray-700">
                     {textChannels.map((channel) => (
                       <SelectItem key={channel.id} value={channel.id} className="text-white hover:bg-gray-700">
                         #{channel.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               {/* Channels */}
               <div className="flex flex-col space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                 <div className="flex items-center space-x-3 mb-2">
                   <div className="flex items-center space-x-2">
                     <Hash className="w-5 h-5 text-cyan-400" />
                     <Label className="text-white font-medium text-sm">Channels</Label>
                   </div>
                   <Switch 
                     checked={logMode === 'manual' && channelsEnabled} 
                     onCheckedChange={(checked) => handleCategoryToggle('channels', checked)}
                     disabled={logMode !== 'manual'}
                     className="data-[state=checked]:bg-blue-600"
                   />
                 </div>
                 <div className="text-xs text-gray-400 mb-3">
                   Log channel creation, deletion and modifications
                 </div>
                 <Select 
                   value={channelsChannel} 
                   onValueChange={setChannelsChannel}
                   disabled={logMode !== 'manual' || !channelsEnabled}
                 >
                   <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-xs h-8">
                     <SelectValue placeholder="Choose Channel" />
                   </SelectTrigger>
                   <SelectContent className="bg-gray-800 border-gray-700">
                     {textChannels.map((channel) => (
                       <SelectItem key={channel.id} value={channel.id} className="text-white hover:bg-gray-700">
                         #{channel.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               {/* Messages */}
               <div className="flex flex-col space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                 <div className="flex items-center space-x-3 mb-2">
                   <div className="flex items-center space-x-2">
                     <MessageSquare className="w-5 h-5 text-orange-400" />
                     <Label className="text-white font-medium text-sm">Messages</Label>
                   </div>
                   <Switch 
                     checked={logMode === 'manual' && messagesEnabled} 
                     onCheckedChange={(checked) => handleCategoryToggle('messages', checked)}
                     disabled={logMode !== 'manual'}
                     className="data-[state=checked]:bg-blue-600"
                   />
                 </div>
                 <div className="text-xs text-gray-400 mb-3">
                   Log message deletions and edits
                 </div>
                 <Select 
                   value={messagesChannel} 
                   onValueChange={setMessagesChannel}
                   disabled={logMode !== 'manual' || !messagesEnabled}
                 >
                   <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-xs h-8">
                     <SelectValue placeholder="Choose Channel" />
                   </SelectTrigger>
                   <SelectContent className="bg-gray-800 border-gray-700">
                     {textChannels.map((channel) => (
                       <SelectItem key={channel.id} value={channel.id} className="text-white hover:bg-gray-700">
                         #{channel.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {logMode === 'manual' && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveManualLogSettings}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </div>
        )}
      </div>
      </DiscordDataLoader>
     </div>
   )
 }