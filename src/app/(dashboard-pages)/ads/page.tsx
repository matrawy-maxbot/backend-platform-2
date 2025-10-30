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
import { useServerSettings } from '@/hooks/useServerSettings'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { useDiscordDataForSection } from '@/hooks/useDiscordData'
import { DiscordDataLoader } from '@/components/discord-data-loader'
import { useActivityTracker } from '@/components/ActivityTracker'
import { 
  Megaphone, 
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
  Hash,
  Shield,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Calendar,
  Send,
  Timer,
  Target,
  Image,
  Link,
  Server,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import AdPreview from "@/components/ad-preview"

interface Advertisement {
  id: string
  title: string
  content: string
  imageUrl?: string
  linkUrl?: string
  targetChannels: string[]
  targetRoles: string[]
  scheduledTime?: string
  publishType: 'immediate' | 'scheduled'
  scheduleType?: 'once' | 'recurring'
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'custom'
  customCron?: string
  scheduleMode?: 'specific' | 'delay' // نوع الجدولة: وقت محدد أو تأخير
  delayAmount?: number // مقدار التأخير
  delayUnit?: 'minutes' | 'hours' | 'days' // وحدة التأخير
  priority?: 'low' | 'normal' | 'high'
  status: 'draft' | 'scheduled' | 'published' | 'expired'
  createdAt: string
  publishedAt?: string
  views: number
  clicks: number
  enabled: boolean
  permanentlyDisabled?: boolean // علامة التعطيل النهائي
  disabledAt?: string // تاريخ التعطيل
  disableReason?: string // سبب التعطيل
}

export default function AdsPage() {
  const { settings, loading: settingsLoading, updateSection, refetch } = useServerSettings()
  const { selectedServer } = useSelectedServer()
  const { trackAdCreation, trackAdUpdate, trackAdDeletion, logActivity } = useActivityTracker()
  
  // Local storage states
  const [localAdsEnabled, setLocalAdsEnabled] = useState(true)
  const [localAdvertisements, setLocalAdvertisements] = useState<Advertisement[]>([])
  
  // استخدام الإعدادات من السيرفر المحدد أو local storage
  const adsEnabled = settings?.ads?.enabled ?? localAdsEnabled
  const advertisements = settings?.ads?.ads?.length > 0 ? settings.ads.ads : localAdvertisements
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [previewAd, setPreviewAd] = useState<Advertisement | null>(null)
  const [collapsedAds, setCollapsedAds] = useState<Set<string>>(new Set())
  
  // جعل الإعلانات المرسلة والمنتهية الصلاحية مطوية من الأساس
  useEffect(() => {
    const sentAds = advertisements.filter(ad => ad.publishType === 'immediate' && ad.status === 'published')
    const expiredAds = advertisements.filter(ad => ad.status === 'expired')
    const collapsibleAds = [...sentAds, ...expiredAds]
    const collapsibleAdIds = new Set(collapsibleAds.map(ad => ad.id))
    setCollapsedAds(collapsibleAdIds)
  }, [advertisements])
  
  // دالة للتحكم في طي وتوسيع جميع الإعلانات
  const toggleAdCollapse = (adId: string) => {
    setCollapsedAds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(adId)) {
        newSet.delete(adId)
      } else {
        newSet.add(adId)
      }
      return newSet
    })
  }

  // دالة لحساب الوقت المتبقي للإعلانات المجدولة مع فحص expiryDate
  const getTimeRemaining = (scheduledTime: string, expiryDate?: string) => {
    const now = new Date().getTime()
    
    // فحص تاريخ انتهاء الصلاحية أولاً
    if (expiryDate) {
      const expiry = new Date(expiryDate).getTime()
      if (now >= expiry) {
        return { expired: true, text: 'Expired (Past expiry date)' }
      }
    }
    
    const scheduled = new Date(scheduledTime).getTime()
    const difference = scheduled - now

    if (difference <= 0) {
      return { expired: true, text: 'Expired' }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return { expired: false, text: `${days}d ${hours}h remaining` }
    } else if (hours > 0) {
      return { expired: false, text: `${hours}h ${minutes}m remaining` }
    } else {
      return { expired: false, text: `${minutes}m remaining` }
    }
  }

  // دالة للتحقق من إمكانية تعديل الإعلان
  const canEditAd = (ad: Advertisement) => {
    // يمكن تعديل الإعلانات المسودة دائماً
    if (ad.status === 'draft') return true
    
    // يمكن تعديل الإعلانات المجدولة التي لم يحن وقت نشرها بعد
    if (ad.status === 'scheduled' && ad.scheduledTime) {
      const now = new Date().getTime()
      const scheduled = new Date(ad.scheduledTime).getTime()
      return scheduled > now // يمكن التعديل إذا كان الوقت المجدول في المستقبل
    }
    
    // لا يمكن تعديل الإعلانات المنشورة أو المنتهية الصلاحية
    return false
  }

  // تحديث الوقت المتبقي كل دقيقة وتحديث حالة الإعلانات المنتهية الصلاحية
  const [currentTime, setCurrentTime] = useState(Date.now())
  useEffect(() => {
    // تحديد فترة التحديث بناءً على وجود إعلانات مجدولة قريبة
    const hasNearScheduledAds = advertisements.some(ad => {
      if (ad.publishType === 'scheduled' && ad.status === 'scheduled' && ad.scheduledTime) {
        const scheduledTime = new Date(ad.scheduledTime).getTime()
        const now = Date.now()
        return scheduledTime > now && scheduledTime - now < 300000 // خلال 5 دقائق
      }
      return false
    })
    
    const updateInterval = hasNearScheduledAds ? 1000 : 5000 // كل ثانية إذا كان هناك إعلانات قريبة، وإلا كل 5 ثواني
    
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
      
      // تحديث حالة الإعلانات المجدولة المنتهية الصلاحية مع فحص expiryDate
      const now = Date.now()
      const updatedAds = advertisements.map(ad => {
        let shouldDisable = false
        
        // فحص تاريخ انتهاء الصلاحية (expiryDate)
        if ((ad as any).expiryDate) {
          const expiryDate = new Date((ad as any).expiryDate).getTime()
          if (now >= expiryDate) {
            shouldDisable = true
          }
        }
        
        // فحص الإعلانات المجدولة
        if (ad.publishType === 'scheduled' && ad.status === 'scheduled' && ad.scheduledTime) {
          const scheduledTime = new Date(ad.scheduledTime).getTime()
          if (scheduledTime <= now) {
            shouldDisable = true
            // تحديث فوري للحالة عند انتهاء الإعلان المجدول
            console.log(`📅 Scheduled ad expired: ${ad.title}`)
          }
        }
        
        // إيقاف الإعلانات المنشورة تلقائياً
        if (ad.status === 'published') {
          shouldDisable = true
        }
        
        if (shouldDisable && ad.enabled) {
          const newStatus = ad.status === 'scheduled' ? 'expired' as const : ad.status
          console.log(`⚡ Immediately disabling ad: ${ad.title} (${ad.status} → ${newStatus})`)
          return { ...ad, enabled: false, status: newStatus, permanentlyDisabled: true }
        }
        
        return ad
      })
      
      // تحديث الإعلانات إذا تغيرت
      const hasExpiredAds = updatedAds.some((ad, index) => ad.status !== advertisements[index].status || ad.enabled !== advertisements[index].enabled)
      if (hasExpiredAds) {
        console.log('🔄 Detected expired ads, updating immediately...')
        if (selectedServer?.id && settings?.ads) {
          updateSection('ads', { ...settings.ads, ads: updatedAds })
          // إعادة تحميل البيانات من الخادم للتأكد من التحديث
          setTimeout(() => {
            refetch()
          }, 2000)
        } else {
          setLocalAdvertisements(updatedAds)
        }
      }
    }, updateInterval) // تحديث ديناميكي: كل ثانية للإعلانات القريبة، كل 5 ثواني للباقي

    return () => clearInterval(interval)
  }, [advertisements, selectedServer?.id, settings?.ads, updateSection])

  // تحديث سريع للإعلانات المنشورة حديثاً (كل 5 ثوانِ)
  useEffect(() => {
    const recentlyPublishedAds = advertisements.filter(ad => 
      ad.publishType === 'immediate' && 
      ad.status === 'published' && 
      ad.enabled && 
      ad.publishedAt && 
      (Date.now() - new Date(ad.publishedAt).getTime()) < 60000 // آخر دقيقة
    )
    
    if (recentlyPublishedAds.length > 0) {
      const quickInterval = setInterval(() => {
        refetch()
      }, 5000) // تحديث كل 5 ثوانِ للإعلانات المنشورة حديثاً
      
      // إيقاف التحديث السريع بعد دقيقتين
      const timeout = setTimeout(() => {
        clearInterval(quickInterval)
      }, 120000)
      
      return () => {
        clearInterval(quickInterval)
        clearTimeout(timeout)
      }
    }
  }, [advertisements, refetch])
  
  // دوال التخزين المحلي مع معرف السيرفر
  const saveAdsToLocalStorage = (serverId: string, adsData: Advertisement[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ads_${serverId}`, JSON.stringify(adsData))
    }
  }

  const loadAdsFromLocalStorage = (serverId: string): Advertisement[] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`ads_${serverId}`)
      return saved ? JSON.parse(saved) : []
    }
    return []
  }

  const saveAdsEnabledToLocalStorage = (serverId: string, enabled: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ads_enabled_${serverId}`, JSON.stringify(enabled))
    }
  }

  const loadAdsEnabledFromLocalStorage = (serverId: string): boolean => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`ads_enabled_${serverId}`)
      return saved ? JSON.parse(saved) : true
    }
    return true
  }

  // دالة لحذف جميع الإعلانات من Local Storage
  const clearAllAdsFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      // البحث عن جميع مفاتيح الإعلانات في Local Storage
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('ads_') || key.startsWith('advertisements_')) {
          localStorage.removeItem(key)
        }
      })
      
      // إعادة تعيين الحالات المحلية
      setLocalAdvertisements([])
      setLocalAdsEnabled(true)
      
      console.log('تم حذف جميع الإعلانات من Local Storage')
    }
  }

  // دوال لتحديث إعدادات الإعلانات
  const updateAdsSettings = async (newAdsData: any) => {
    await updateSection('ads', newAdsData)
    // تحديث فوري للواجهة بعد تحديث الإعدادات
    setTimeout(() => {
      refetch()
    }, 1000)
  }

  const setAdsEnabled = async (enabled: boolean) => {
    setLocalAdsEnabled(enabled)
    
    // Update settings in database and bot
    await updateAdsSettings({
      enabled,
      ads: advertisements
    })
    
    // تسجيل النشاط
    await logActivity({
      type: 'ads',
      action: enabled ? 'enabled' : 'disabled',
      details: `Ads system ${enabled ? 'enabled' : 'disabled'}`,
      metadata: {
        previousState: !enabled,
        newState: enabled,
        totalAds: advertisements.length
      }
    })
  }
  
  const [newAd, setNewAd] = useState({
    title: "",
    content: "",
    imageUrl: "",
    linkUrl: "",
    targetChannels: [] as string[],
    targetRoles: [] as string[],
    publishType: 'immediate' as 'immediate' | 'scheduled',
    scheduledTime: "",
    scheduleType: 'once' as 'once' | 'recurring',
    recurringType: 'daily' as 'daily' | 'weekly' | 'monthly' | 'custom',
    customCron: "",
    scheduleMode: 'specific' as 'specific' | 'delay',
    delayAmount: 30,
    delayUnit: 'minutes' as 'minutes' | 'hours' | 'days',
    priority: 'normal' as 'low' | 'normal' | 'high'
  })

  
  // جلب القنوات والرتب من Discord API
  const { 
    availableChannels, 
    availableRoles, 
    getRoleColor, 
    loading: discordDataLoading,
    hasSelectedServer,
    error: discordDataError,
    refreshData 
  } = useDiscordDataForSection('ads')

  // تحميل البيانات من الخادم أولاً ثم Local Storage
  useEffect(() => {
    if (!selectedServer?.id || settingsLoading) return

    // تحميل البيانات من الخادم أولاً إذا كانت متوفرة
    if (settings?.ads?.ads && settings.ads.ads.length > 0) {
      setLocalAdvertisements(settings.ads.ads)
      setLocalAdsEnabled(settings.ads.enabled || false)
    } else {
      // استخدام Local Storage كنسخة احتياطية
      const localAds = loadAdsFromLocalStorage(selectedServer.id)
      const localEnabled = loadAdsEnabledFromLocalStorage(selectedServer.id)
      setLocalAdvertisements(localAds)
      setLocalAdsEnabled(localEnabled)
    }
  }, [selectedServer?.id, settings?.ads, settingsLoading])

  // تم تعطيل المزامنة التلقائية لضمان عدم تأثير الإعلانات على السيرفرات الأخرى
  // useEffect(() => {
  //   if (!selectedServer?.id || settingsLoading) return
  //   
  //   // إذا كان الخادم فارغاً وLocal Storage يحتوي على بيانات، قم بالمزامنة
  //   if ((!settings?.ads?.ads || settings.ads.ads.length === 0) && localAdvertisements.length > 0) {
  //     const syncWithAPI = async () => {
  //       try {
  //         await updateSection('ads', {
  //           enabled: localAdsEnabled,
  //           ads: localAdvertisements
  //         })
  //       } catch (error) {
  //         console.error('Failed to sync ads data:', error)
  //       }
  //     }
  //     syncWithAPI()
  //   }
  // }, [selectedServer?.id, settings?.ads, localAdvertisements, localAdsEnabled, settingsLoading])

  const handleCreateAd = async () => {
    // حساب الوقت المجدول بناءً على نوع الجدولة
    let calculatedScheduledTime = newAd.scheduledTime;
    
    if (newAd.publishType === 'scheduled' && newAd.scheduleMode === 'delay') {
      const delayInMs = newAd.delayAmount * (
        newAd.delayUnit === 'minutes' ? 60000 :
        newAd.delayUnit === 'hours' ? 3600000 :
        86400000 // days
      );
      calculatedScheduledTime = new Date(Date.now() + delayInMs).toISOString();
    }
    
    const ad: Advertisement = {
      id: Date.now().toString(),
      title: newAd.title,
      content: newAd.content,
      imageUrl: newAd.imageUrl || undefined,
      linkUrl: newAd.linkUrl || undefined,
      targetChannels: newAd.targetChannels,
      targetRoles: newAd.targetRoles,
      publishType: newAd.publishType,
      scheduledTime: newAd.publishType === 'scheduled' ? calculatedScheduledTime : undefined,
      scheduleMode: newAd.publishType === 'scheduled' ? newAd.scheduleMode : undefined,
      delayAmount: newAd.publishType === 'scheduled' && newAd.scheduleMode === 'delay' ? newAd.delayAmount : undefined,
      delayUnit: newAd.publishType === 'scheduled' && newAd.scheduleMode === 'delay' ? newAd.delayUnit : undefined,
      status: newAd.publishType === 'immediate' ? 'published' : 'scheduled',
      createdAt: new Date().toISOString(),
      publishedAt: newAd.publishType === 'immediate' ? new Date().toISOString() : undefined,
      views: 0,
      clicks: 0,
      enabled: true
    }
    
    const updatedAds = [...advertisements, ad]
    setLocalAdvertisements(updatedAds)
    
    // Update settings in database and bot
    await updateAdsSettings({
      enabled: adsEnabled,
      ads: updatedAds
    })
    
    // تسجيل النشاط
    // الحصول على أسماء القنوات المستهدفة
    const channelNames = ad.targetChannels.map(channelId => {
      const channel = availableChannels.find(ch => ch.id === channelId)
      return channel ? channel.name : channelId
    }).join(', ') || 'جميع القنوات'
    
    await trackAdCreation(ad.title, channelNames)
    
    setNewAd({ 
      title: "", 
      content: "", 
      imageUrl: "", 
      linkUrl: "", 
      targetChannels: [], 
      targetRoles: [], 
      publishType: 'immediate',
      scheduledTime: "",
      scheduleMode: 'specific',
      delayAmount: 30,
      delayUnit: 'minutes'
    })
    setShowCreateModal(false)
  }

  const handleChannelToggle = (channelId: string) => {
    if (editingAd) {
      const currentChannels = editingAd.targetChannels
      const newChannels = currentChannels.includes(channelId)
        ? currentChannels.filter(id => id !== channelId)
        : [...currentChannels, channelId]
      setEditingAd({
        ...editingAd,
        targetChannels: newChannels
      })
    } else {
      const currentChannels = newAd.targetChannels
      const newChannels = currentChannels.includes(channelId)
        ? currentChannels.filter(id => id !== channelId)
        : [...currentChannels, channelId]
      setNewAd({
        ...newAd,
        targetChannels: newChannels
      })
    }
  }

  const handleRoleToggle = (roleId: string) => {
    if (editingAd) {
      const currentRoles = editingAd.targetRoles
      const newRoles = currentRoles.includes(roleId)
        ? currentRoles.filter(id => id !== roleId)
        : [...currentRoles, roleId]
      setEditingAd({
        ...editingAd,
        targetRoles: newRoles
      })
    } else {
      const currentRoles = newAd.targetRoles
      const newRoles = currentRoles.includes(roleId)
        ? currentRoles.filter(id => id !== roleId)
        : [...currentRoles, roleId]
      setNewAd({
        ...newAd,
        targetRoles: newRoles
      })
    }
  }

  const handleDeleteAd = async (id: string) => {
    const adToDelete = advertisements.find(ad => ad.id === id)
    const updatedAds = advertisements.filter(ad => ad.id !== id)
    setLocalAdvertisements(updatedAds)
    
    // Update settings in database and bot
    await updateAdsSettings({
      enabled: adsEnabled,
      ads: updatedAds
    })
    
    // تسجيل النشاط
    if (adToDelete) {
      await trackAdDeletion(adToDelete.title)
    }
  }

  // دالة للتحقق من انتهاء صلاحية الإعلان مع فحص expiryDate والتعطيل النهائي
  const isAdExpired = (ad: Advertisement) => {
    // فحص التعطيل النهائي أولاً
    if (ad.permanentlyDisabled) return true
    
    // فحص الإعلانات المنتهية
    if (ad.status === 'expired') return true
    
    // فحص الإعلانات المرسلة - يجب تعطيلها نهائياً
    if (ad.status === 'published') return true
    
    // فحص تاريخ انتهاء الصلاحية (expiryDate)
    if ((ad as any).expiryDate) {
      const expiryDate = new Date((ad as any).expiryDate).getTime()
      const now = Date.now()
      if (now >= expiryDate) {
        return true
      }
    }
    
    // فحص الإعلانات المجدولة
    if (ad.publishType === 'scheduled' && ad.scheduledTime) {
      const scheduledTime = new Date(ad.scheduledTime).getTime()
      const now = Date.now()
      return scheduledTime <= now
    }
    
    return false
  }

  const handleToggleAd = async (id: string) => {
    const targetAd = advertisements.find(ad => ad.id === id)
    
    // منع تفعيل الإعلانات المنتهية أو المرسلة
    if (targetAd && !targetAd.enabled && isAdExpired(targetAd)) {
      if (targetAd.permanentlyDisabled) {
        alert('لا يمكن تفعيل هذا الإعلان - تم تعطيله نهائياً بعد النشر')
      } else if (targetAd.status === 'published') {
        alert('لا يمكن تفعيل الإعلانات المرسلة - يتم تعطيلها نهائياً بعد الإرسال')
      } else if (targetAd.status === 'expired') {
        alert('لا يمكن تفعيل إعلان منتهي الصلاحية')
      } else {
        alert('لا يمكن تفعيل هذا الإعلان')
      }
      return
    }
    
    const updatedAds = advertisements.map(ad => 
      ad.id === id ? { ...ad, enabled: !ad.enabled } : ad
    )
    setLocalAdvertisements(updatedAds)
    
    // تحديث الإعدادات في قاعدة البيانات والبوت
    await updateAdsSettings({
      enabled: adsEnabled,
      ads: updatedAds
    })
  }

  const filteredAds = advertisements
    .filter(ad => 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4" />
      case 'scheduled': return <Clock className="h-4 w-4" />
      case 'draft': return <Edit className="h-4 w-4" />
      case 'expired': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  // Show message if no server is selected
  if (!selectedServer) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8 min-h-screen relative">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Server className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Server Selected</h2>
            <p className="text-gray-400">Please select a server from the servers page first</p>
          </div>
        </div>
      </div>
    )
  }

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
              <p className="text-sm text-gray-400">Advertisement Settings</p>
            </div>
            {settingsLoading && (
              <div className="ml-auto">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-purple-500" />
Advertisement Management
          </h1>
          <p className="text-gray-400">Create and manage advertisements for Discord servers</p>
        </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Status</p>
                <p className={`text-2xl font-bold ${adsEnabled ? 'text-green-400' : 'text-red-400'}`}>
                  {adsEnabled ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                adsEnabled ? 'bg-green-400/20' : 'bg-red-400/20'
              }`}>
                <Megaphone className={`h-6 w-6 ${adsEnabled ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Ads</p>
                <p className="text-2xl font-bold text-blue-400">
                  {advertisements.filter(ad => ad.status === 'published').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {advertisements.reduce((sum, ad) => sum + ad.views, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Click Rate</p>
                <p className="text-2xl font-bold text-green-400">7.1%</p>
              </div>
              <div className="h-12 w-12 bg-green-400/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ads" className="space-y-6">
        <TabsList className="bg-[#25293e]/60 border-[#2d3142]">
          <TabsTrigger value="ads" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Advertisements
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ads" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search advertisements..."
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
            <div className="flex gap-2">
              <Button 
                onClick={clearAllAdsFromLocalStorage}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
Delete All Ads
              </Button>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Ad
              </Button>
            </div>
          </div>

          {/* Advertisements List */}
          <div className="space-y-4">
            {filteredAds.map((ad) => {
              const isSent = ad.publishType === 'immediate' && ad.status === 'published';
              const isExpired = ad.status === 'expired';
              const isCollapsed = collapsedAds.has(ad.id);
              return (
              <Card key={ad.id} className={`transition-all duration-300 ${
                isExpired
                  ? 'bg-red-900/30 border-red-600/50 hover:bg-red-900/40'
                  : isSent 
                    ? 'bg-blue-900/30 border-blue-600/50 hover:bg-blue-900/40' 
                    : 'bg-gray-900/50 border-gray-700'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAdCollapse(ad.id)}
                          className={`p-1 h-6 w-6 ${
                            isExpired 
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                              : isSent
                                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/20'
                          }`}
                        >
                          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                        </Button>
                        <h3 className="text-lg font-semibold text-white truncate max-w-md" title={ad.title}>{ad.title}</h3>
                        <Badge 
                          variant="outline"
                          className={getStatusColor(ad.status)}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(ad.status)}
                            {ad.status === 'published' ? 'Published' : 
                             ad.status === 'scheduled' ? (
                               ad.scheduledTime ? (
                                 getTimeRemaining(ad.scheduledTime, (ad as any).expiryDate).expired ? 'Expired' : 
                                 `Scheduled (${getTimeRemaining(ad.scheduledTime, (ad as any).expiryDate).text})`
                               ) : 'Scheduled'
                             ) :
                             ad.status === 'draft' ? 'Draft' : 'Expired'}
                          </div>
                        </Badge>
                        
                        {ad.publishType === 'immediate' && ad.status === 'published' && (
                          <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-400/10">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Sent
                            </div>
                          </Badge>
                        )}
                        
                        {ad.priority && ad.priority !== 'normal' && (
                          <Badge 
                            variant="outline" 
                            className={ad.priority === 'high' ? 'text-red-400 border-red-400/30 bg-red-400/10' : 'text-green-400 border-green-400/30 bg-green-400/10'}
                          >
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {ad.priority === 'high' ? 'High Priority' : 'Low Priority'}
                            </div>
                          </Badge>
                        )}
                        
                        {ad.scheduleType === 'recurring' && (
                          <Badge variant="outline" className="text-purple-400 border-purple-400/30 bg-purple-400/10">
                            <div className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              {ad.recurringType === 'daily' ? 'Daily' :
                               ad.recurringType === 'weekly' ? 'Weekly' :
                               ad.recurringType === 'monthly' ? 'Monthly' : 'Custom'}
                            </div>
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className="text-xs">
                          {ad.views} views
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ad.clicks} clicks
                        </Badge>
                      </div>
                      
                      {!isCollapsed && (
                      <div className="space-y-2">
                        <div>
                          <p className="text-white text-sm leading-relaxed break-words">
                            {ad.content}
                          </p>
                        </div>
                        
                        {ad.imageUrl && (
                          <div>
                            <Label className="text-sm text-gray-400">Image:</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Image className="h-4 w-4 text-blue-400" />
                              <span className="text-blue-400 text-sm truncate max-w-xs" title={ad.imageUrl}>{ad.imageUrl}</span>
                            </div>
                          </div>
                        )}
                        
                        {ad.linkUrl && (
                          <div>
                            <Label className="text-sm text-gray-400">Link:</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Link className="h-4 w-4 text-green-400" />
                              <span className="text-green-400 text-sm truncate max-w-xs" title={ad.linkUrl}>{ad.linkUrl}</span>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <Label className="text-sm text-gray-400">Target Channels ({ad.targetChannels.length}):</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {ad.targetChannels.length > 0 ? (
                              ad.targetChannels.map((channelId, index) => {
                                const channel = availableChannels.find(ch => ch.id === channelId)
                                return (
                                  <Badge key={index} variant="secondary" className="text-xs bg-blue-400/20 text-blue-300 border-blue-400/30">
                                    <Hash className="h-3 w-3 mr-1" />
                                    {channel ? channel.name.replace('#', '') : channelId}
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
                        
                        <div>
                          <Label className="text-sm text-gray-400">Target Roles ({ad.targetRoles.length}):</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {ad.targetRoles.length > 0 ? (
                              ad.targetRoles.map((roleId, index) => {
                                const role = availableRoles.find(r => r.id === roleId)
                                return (
                                  <Badge key={index} variant="secondary" className="text-xs bg-purple-400/20 text-purple-300 border-purple-400/30">
                                    <Users className="h-3 w-3 mr-1" />
                                    {role ? role.name : roleId}
                                  </Badge>
                                )
                              })
                            ) : (
                              <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                                All Members
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>Created: {new Date(ad.createdAt).toLocaleDateString('en-US')}</span>
                          {ad.publishedAt && (
                            <span>Published: {new Date(ad.publishedAt).toLocaleDateString('en-US')}</span>
                          )}
                          {ad.scheduledTime && (
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Scheduled for: {new Date(ad.scheduledTime).toLocaleDateString('en-US')} at {new Date(ad.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {ad.status === 'scheduled' && (
                                <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                  getTimeRemaining(ad.scheduledTime, (ad as any).expiryDate).expired 
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                }`}>
                                  <Timer className="h-3 w-3" />
                                  {getTimeRemaining(ad.scheduledTime, (ad as any).expiryDate).text}
                                </span>
                              )}
                            </div>
                          )}
                          {ad.scheduleType === 'recurring' && ad.recurringType && (
                            <span className="flex items-center gap-1 text-purple-400">
                              <Timer className="h-3 w-3" />
                              Repeats {ad.recurringType}
                              {ad.recurringType === 'custom' && ad.customCron && ` (${ad.customCron})`}
                            </span>
                          )}
                        </div>
                      </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={ad.enabled && !isAdExpired(ad)}
                        onCheckedChange={() => handleToggleAd(ad.id)}
                        disabled={isAdExpired(ad)}
                        className={isAdExpired(ad) ? 'opacity-50 cursor-not-allowed' : ''}
                        title={
                          ad.permanentlyDisabled ? 'هذا الإعلان معطل نهائياً بعد النشر' : 
                          ad.status === 'published' ? 'الإعلانات المرسلة معطلة نهائياً ولا يمكن تفعيلها مرة أخرى' :
                          isAdExpired(ad) ? 'إعلان منتهي الصلاحية' : 
                          'تفعيل/إلغاء تفعيل الإعلان'
                        }
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => {
                          setPreviewAd(ad)
                          setShowPreview(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${
                          canEditAd(ad) 
                            ? 'text-gray-400 hover:text-white cursor-pointer' 
                            : 'text-gray-600 cursor-not-allowed opacity-50'
                        }`}
                        onClick={() => canEditAd(ad) && setEditingAd(ad)}
                        disabled={!canEditAd(ad)}
                        title={canEditAd(ad) ? 'تعديل الإعلان' : 'لا يمكن تعديل هذا الإعلان'}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                        onClick={() => handleDeleteAd(ad.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )})
          }
          </div>
        </TabsContent>



        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Performance Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Advertisements</span>
                    <span className="text-white font-semibold">{advertisements.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Published Ads</span>
                    <span className="text-green-400 font-semibold">{advertisements.filter(ad => ad.status === 'published').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Scheduled Ads</span>
                    <span className="text-blue-400 font-semibold">{advertisements.filter(ad => ad.status === 'scheduled').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Recurring Ads</span>
                    <span className="text-purple-400 font-semibold">{advertisements.filter(ad => ad.scheduleType === 'recurring').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">High Priority</span>
                    <span className="text-red-400 font-semibold">{advertisements.filter(ad => ad.priority === 'high').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Drafts</span>
                    <span className="text-gray-400 font-semibold">{advertisements.filter(ad => ad.status === 'draft').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  Engagement Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Views</span>
                    <span className="text-yellow-400 font-semibold">{advertisements.reduce((sum, ad) => sum + ad.views, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Clicks</span>
                    <span className="text-green-400 font-semibold">{advertisements.reduce((sum, ad) => sum + ad.clicks, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Click Rate (CTR)</span>
                    <span className="text-blue-400 font-semibold">
                      {advertisements.reduce((sum, ad) => sum + ad.views, 0) > 0 
                        ? ((advertisements.reduce((sum, ad) => sum + ad.clicks, 0) / advertisements.reduce((sum, ad) => sum + ad.views, 0)) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Views</span>
                    <span className="text-purple-400 font-semibold">
                      {advertisements.length > 0 
                        ? Math.round(advertisements.reduce((sum, ad) => sum + ad.views, 0) / advertisements.length)
                        : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Advertisement system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Enable Advertisement System</Label>
                    <p className="text-sm text-gray-400 mt-1">Turn on/off the entire advertisement system</p>
                  </div>
                  <Switch
                    checked={adsEnabled}
                    onCheckedChange={setAdsEnabled}
                  />
                </div>
                
                <div>
                  <Label className="text-white mb-3 block">Daily Ad Limit</Label>
                  <Input 
                    type="number"
                    defaultValue="5"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-white mb-3 block">Cooldown Between Ads (minutes)</Label>
                  <Input 
                    type="number"
                    defaultValue="30"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Advanced Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced advertisement settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white mb-3 block">Default Advertisement Channel</Label>
                  <Select defaultValue="announcements">
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {availableChannels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id} className="text-white hover:bg-gray-700">
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-white mb-3 block">Default Advertisement Role</Label>
                  <Select defaultValue="everyone">
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {availableRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id} className="text-white hover:bg-gray-700">
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Click Tracking</Label>
                    <p className="text-sm text-gray-400 mt-1">Track clicks on advertisement links</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      {showPreview && previewAd && (
        <AdPreview
          ad={{
            title: previewAd.title,
            content: previewAd.content,
            imageUrl: previewAd.imageUrl,
            linkUrl: previewAd.linkUrl
          }}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateModal || !!editingAd} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModal(false)
          setEditingAd(null)
        }
      }}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-7xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingAd ? 'Edit advertisement details' : 'Create a new advertisement for your Discord server'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Content & Settings */}
              <div className="space-y-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <Label className="text-white mb-3 block font-semibold">Advertisement Content</Label>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white mb-2 block">Title *</Label>
                      <Input 
                        placeholder="Enter advertisement title"
                        value={editingAd ? editingAd.title : newAd.title}
                        onChange={(e) => {
                          if (editingAd) {
                            setEditingAd({...editingAd, title: e.target.value})
                          } else {
                            setNewAd({...newAd, title: e.target.value})
                          }
                        }}
                        className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white mb-2 block">Content *</Label>
                      <Textarea 
                        placeholder="Enter advertisement content"
                        value={editingAd ? editingAd.content : newAd.content}
                        onChange={(e) => {
                          if (editingAd) {
                            setEditingAd({...editingAd, content: e.target.value})
                          } else {
                            setNewAd({...newAd, content: e.target.value})
                          }
                        }}
                        className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <Label className="text-white mb-3 block font-semibold">Media & Links</Label>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white mb-2 block">Image URL (optional)</Label>
                      <Input 
                        placeholder="https://example.com/image.jpg"
                        value={editingAd ? (editingAd.imageUrl || '') : newAd.imageUrl}
                        onChange={(e) => {
                          if (editingAd) {
                            setEditingAd({...editingAd, imageUrl: e.target.value})
                          } else {
                            setNewAd({...newAd, imageUrl: e.target.value})
                          }
                        }}
                        className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white mb-2 block">Link URL (optional)</Label>
                      <Input 
                        placeholder="https://example.com"
                        value={editingAd ? (editingAd.linkUrl || '') : newAd.linkUrl}
                        onChange={(e) => {
                          if (editingAd) {
                            setEditingAd({...editingAd, linkUrl: e.target.value})
                          } else {
                            setNewAd({...newAd, linkUrl: e.target.value})
                          }
                        }}
                        className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Settings & Targeting Section */}
                 {(!editingAd || (editingAd && canEditAd(editingAd))) && (
                   <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                     <Label className="text-white mb-3 block font-semibold">Publish Settings</Label>
                     
                     <div className="space-y-4">
                       <div>
                         <Label className="text-white mb-2 block">Publish Type</Label>
                         <Select value={editingAd ? editingAd.publishType : newAd.publishType} onValueChange={(value: 'immediate' | 'scheduled') => {
                           if (editingAd) {
                             setEditingAd({...editingAd, publishType: value});
                           } else {
                             setNewAd({...newAd, publishType: value});
                           }
                         }}>
                           <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-gray-800 border-gray-600">
                             <SelectItem value="immediate" className="text-white hover:bg-gray-700">
                               <div className="flex items-center gap-2">
                                 <Send className="h-4 w-4" />
                                 Publish Immediately
                               </div>
                             </SelectItem>
                             <SelectItem value="scheduled" className="text-white hover:bg-gray-700">
                               <div className="flex items-center gap-2">
                                 <Timer className="h-4 w-4" />
                                 Scheduled Publish
                               </div>
                             </SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       
                       {(editingAd ? editingAd.publishType : newAd.publishType) === 'scheduled' && (
                         <div className="space-y-4">
                           <div>
                             <Label className="text-white mb-2 block">Schedule Mode</Label>
                             <Select value={editingAd ? editingAd.scheduleMode : newAd.scheduleMode} onValueChange={(value: 'specific' | 'delay') => {
                               if (editingAd) {
                                 setEditingAd({...editingAd, scheduleMode: value});
                               } else {
                                 setNewAd({...newAd, scheduleMode: value});
                               }
                             }}>
                               <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="bg-gray-800 border-gray-600">
                                 <SelectItem value="specific" className="text-white hover:bg-gray-700">
                                   <div className="flex items-center gap-2">
                                     <Calendar className="h-4 w-4" />
                                     Specific Date & Time
                                   </div>
                                 </SelectItem>
                                 <SelectItem value="delay" className="text-white hover:bg-gray-700">
                                   <div className="flex items-center gap-2">
                                     <Timer className="h-4 w-4" />
                                     Delay from Now
                                   </div>
                                 </SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                           
                           {(editingAd ? editingAd.scheduleMode : newAd.scheduleMode) === 'specific' && (
                             <div>
                               <Label className="text-white mb-2 block">Scheduled Time</Label>
                               <Input 
                                 type="datetime-local"
                                 value={editingAd ? editingAd.scheduledTime : newAd.scheduledTime}
                                 onChange={(e) => {
                                   if (editingAd) {
                                     setEditingAd({...editingAd, scheduledTime: e.target.value});
                                   } else {
                                     setNewAd({...newAd, scheduledTime: e.target.value});
                                   }
                                 }}
                                 className="bg-gray-900 border-gray-600 text-white"
                               />
                             </div>
                           )}
                           
                           {(editingAd ? editingAd.scheduleMode : newAd.scheduleMode) === 'delay' && (
                             <div className="grid grid-cols-2 gap-4">
                               <div>
                                 <Label className="text-white mb-2 block">Delay Amount</Label>
                                 <Input 
                                   type="number"
                                   min="1"
                                   value={editingAd ? editingAd.delayAmount : newAd.delayAmount}
                                   onChange={(e) => {
                                     const value = parseInt(e.target.value) || 1;
                                     if (editingAd) {
                                       setEditingAd({...editingAd, delayAmount: value});
                                     } else {
                                       setNewAd({...newAd, delayAmount: value});
                                     }
                                   }}
                                   className="bg-gray-900 border-gray-600 text-white"
                                   placeholder="30"
                                 />
                               </div>
                               <div>
                                 <Label className="text-white mb-2 block">Time Unit</Label>
                                 <Select value={editingAd ? editingAd.delayUnit : newAd.delayUnit} onValueChange={(value: 'minutes' | 'hours' | 'days') => {
                                   if (editingAd) {
                                     setEditingAd({...editingAd, delayUnit: value});
                                   } else {
                                     setNewAd({...newAd, delayUnit: value});
                                   }
                                 }}>
                                   <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                                     <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent className="bg-gray-800 border-gray-600">
                                     <SelectItem value="minutes" className="text-white hover:bg-gray-700">
                                       <div className="flex items-center gap-2">
                                         <Clock className="h-4 w-4" />
                                         Minutes
                                       </div>
                                     </SelectItem>
                                     <SelectItem value="hours" className="text-white hover:bg-gray-700">
                                       <div className="flex items-center gap-2">
                                         <Clock className="h-4 w-4" />
                                         Hours
                                       </div>
                                     </SelectItem>
                                     <SelectItem value="days" className="text-white hover:bg-gray-700">
                                       <div className="flex items-center gap-2">
                                         <Calendar className="h-4 w-4" />
                                         Days
                                       </div>
                                     </SelectItem>
                                   </SelectContent>
                                 </Select>
                               </div>
                             </div>
                           )}
                           
                           {newAd.scheduleMode === 'delay' && (
                             <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                               <div className="flex items-center gap-2 text-blue-300 text-sm">
                                 <Timer className="h-4 w-4" />
                                 <span>
                                   Will be published in {newAd.delayAmount} {newAd.delayUnit}
                                   {newAd.delayAmount && newAd.delayUnit && (
                                     <span className="ml-2 text-blue-400">
                                       ({new Date(Date.now() + (newAd.delayAmount * (
                                         newAd.delayUnit === 'minutes' ? 60000 :
                                         newAd.delayUnit === 'hours' ? 3600000 :
                                         86400000
                                       ))).toLocaleString()})
                                     </span>
                                   )}
                                 </span>
                               </div>
                             </div>
                           )}
                           
                           <div>
                             <Label className="text-white mb-2 block">Schedule Type</Label>
                             <Select value={newAd.scheduleType} onValueChange={(value: 'once' | 'recurring') => {
                               setNewAd({...newAd, scheduleType: value});
                             }}>
                               <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="bg-gray-800 border-gray-600">
                                 <SelectItem value="once" className="text-white hover:bg-gray-700">
                                   <div className="flex items-center gap-2">
                                     <Calendar className="h-4 w-4" />
                                     One Time
                                   </div>
                                 </SelectItem>
                                 <SelectItem value="recurring" className="text-white hover:bg-gray-700">
                                   <div className="flex items-center gap-2">
                                     <Timer className="h-4 w-4" />
                                     Recurring
                                   </div>
                                 </SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                           
                           {newAd.scheduleType === 'recurring' && (
                             <div>
                               <Label className="text-white mb-2 block">Recurring Type</Label>
                               <Select value={newAd.recurringType} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'custom') => {
                                 setNewAd({...newAd, recurringType: value});
                               }}>
                                 <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="bg-gray-800 border-gray-600">
                                   <SelectItem value="daily" className="text-white hover:bg-gray-700">
                                     <div className="flex items-center gap-2">
                                       <Clock className="h-4 w-4" />
                                       Daily
                                     </div>
                                   </SelectItem>
                                   <SelectItem value="weekly" className="text-white hover:bg-gray-700">
                                     <div className="flex items-center gap-2">
                                       <Calendar className="h-4 w-4" />
                                       Weekly
                                     </div>
                                   </SelectItem>
                                   <SelectItem value="monthly" className="text-white hover:bg-gray-700">
                                     <div className="flex items-center gap-2">
                                       <Calendar className="h-4 w-4" />
                                       Monthly
                                     </div>
                                   </SelectItem>
                                   <SelectItem value="custom" className="text-white hover:bg-gray-700">
                                     <div className="flex items-center gap-2">
                                       <Settings className="h-4 w-4" />
                                       Custom Cron
                                     </div>
                                   </SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>
                           )}
                           
                           {newAd.scheduleType === 'recurring' && newAd.recurringType === 'custom' && (
                             <div>
                               <Label className="text-white mb-2 block">Custom Cron Expression</Label>
                               <Input 
                                 placeholder="0 12 * * * (Daily at 12:00 PM)"
                                 value={newAd.customCron}
                                 onChange={(e) => setNewAd({...newAd, customCron: e.target.value})}
                                 className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                               />
                               <p className="text-xs text-gray-400 mt-1">
                                 Format: minute hour day month dayOfWeek
                               </p>
                             </div>
                           )}
                         </div>
                       )}
                       
                       <div>
                         <Label className="text-white mb-2 block">Priority Level</Label>
                         <Select value={newAd.priority} onValueChange={(value: 'low' | 'normal' | 'high') => {
                           setNewAd({...newAd, priority: value});
                         }}>
                           <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-gray-800 border-gray-600">
                             <SelectItem value="low" className="text-white hover:bg-gray-700">
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                 Low Priority
                               </div>
                             </SelectItem>
                             <SelectItem value="normal" className="text-white hover:bg-gray-700">
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                 Normal Priority
                               </div>
                             </SelectItem>
                             <SelectItem value="high" className="text-white hover:bg-gray-700">
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                 High Priority
                               </div>
                             </SelectItem>
                           </SelectContent>
                         </Select>
                         <p className="text-xs text-gray-400 mt-1">
                           High priority ads bypass some cooldown restrictions
                         </p>
                       </div>
                     </div>
                   </div>
                 )}
                 
                 <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-blue-600/20 rounded-lg">
                       <Users className="h-5 w-5 text-blue-400" />
                     </div>
                     <div>
                       <Label className="text-white text-lg font-semibold block">Target Audience</Label>
                       <p className="text-gray-400 text-sm">Select target channels and roles for the advertisement</p>
                     </div>
                   </div>
                   
                   {/* Demo data warning */}
                   <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border border-yellow-600/40 rounded-xl p-4 mb-6">
                     <div className="flex items-start gap-3">
                       <div className="p-1 bg-yellow-500/20 rounded-lg flex-shrink-0">
                         <AlertTriangle className="h-4 w-4 text-yellow-400" />
                       </div>
                       <div className="text-sm">
                         <p className="font-semibold text-yellow-200 mb-2">Demo Data Displayed</p>
                         <p className="text-yellow-300/90 leading-relaxed">
                           The channels and roles shown below are demo data. To display real channels and roles from your server, 
                           please configure the Discord Bot Token in system settings.
                         </p>
                       </div>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {/* Channels Section */}
                     <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Hash className="h-4 w-4 text-blue-400" />
                           <Label className="text-white font-medium">Text Channels</Label>
                         </div>
                         <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                           {availableChannels.length} available
                         </Badge>
                       </div>
                       
                       <div className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 max-h-48 overflow-y-auto custom-scrollbar">
                         <div className="space-y-3">
                           {availableChannels.map((channel) => (
                             <div key={channel.id} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                               <input
                                 type="checkbox"
                                 id={`modal-channel-${channel.id}`}
                                 checked={editingAd ? editingAd.targetChannels.includes(channel.id) : newAd.targetChannels.includes(channel.id)}
                                 onChange={() => handleChannelToggle(channel.id)}
                                 className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-2"
                               />
                               <Label htmlFor={`modal-channel-${channel.id}`} className="flex-1 text-sm text-white cursor-pointer flex items-center gap-2">
                                 <span className="text-gray-400 font-mono">#</span>
                                 <span className="group-hover:text-blue-300 transition-colors">{channel.name}</span>
                                 {channel.nsfw && (
                                   <Badge variant="destructive" className="text-xs px-2 py-0.5 bg-red-600/20 text-red-400 border-red-600/30">
                                     NSFW
                                   </Badge>
                                 )}
                               </Label>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                     
                     {/* Roles Section */}
                     <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Shield className="h-4 w-4 text-purple-400" />
                           <Label className="text-white font-medium">Server Roles</Label>
                         </div>
                         <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                           {availableRoles.length} available
                         </Badge>
                       </div>
                       
                       <div className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 max-h-48 overflow-y-auto custom-scrollbar">
                         <div className="space-y-3">
                           {availableRoles.map((role) => (
                             <div key={role.id} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                               <input
                                 type="checkbox"
                                 id={`modal-role-${role.id}`}
                                 checked={editingAd ? editingAd.targetRoles.includes(role.id) : newAd.targetRoles.includes(role.id)}
                                 onChange={() => handleRoleToggle(role.id)}
                                 className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-2"
                               />
                               <Label htmlFor={`modal-role-${role.id}`} className="flex-1 text-sm text-white cursor-pointer flex items-center gap-2">
                                 {getRoleColor && getRoleColor(role.color) !== '#000000' && (
                                   <div 
                                     className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-gray-600" 
                                     style={{ backgroundColor: getRoleColor(role.color) }}
                                   />
                                 )}
                                 <span className="group-hover:text-purple-300 transition-colors">{role.name}</span>
                                 {role.managed && (
                                   <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 border-blue-600/30">
                                     BOT
                                   </Badge>
                                 )}
                               </Label>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
              
              {/* Right Column - Live Preview */}
              <div className="space-y-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <Label className="text-white mb-3 block font-semibold">Live Preview</Label>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                    {(editingAd?.title || newAd.title) ? (
                      <div className="space-y-3">
                        {/* Discord-style message preview */}
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            B
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-semibold text-sm">Bot</span>
                              <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">BOT</span>
                              <span className="text-gray-400 text-xs">Today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            
                            {/* Embed preview */}
                            <div className="bg-gray-800 border-l-4 border-blue-500 rounded p-3 max-w-md">
                              <div className="text-white font-semibold text-sm mb-1">
                                {editingAd?.title || newAd.title}
                              </div>
                              {(editingAd?.content || newAd.content) && (
                                <div className="text-gray-300 text-sm mb-2">
                                  {editingAd?.content || newAd.content}
                                </div>
                              )}
                              {(editingAd?.imageUrl || newAd.imageUrl) && (
                                <div className="mb-2">
                                  <img 
                                    src={editingAd?.imageUrl || newAd.imageUrl} 
                                    alt="Preview" 
                                    className="rounded max-w-full h-auto max-h-48 object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                </div>
                              )}
                              {(editingAd?.linkUrl || newAd.linkUrl) && (
                                <div className="text-blue-400 text-sm hover:underline cursor-pointer">
                                  {editingAd?.linkUrl || newAd.linkUrl}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Enter title and content to see preview</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Target Info */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <Label className="text-white mb-3 block font-semibold">Target Summary</Label>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-300">
                      <span className="text-gray-400">Channels:</span> 
                      {(editingAd?.targetChannels || newAd.targetChannels).length > 0 
                        ? `${(editingAd?.targetChannels || newAd.targetChannels).length} selected`
                        : 'None selected'
                      }
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Roles:</span> 
                      {(editingAd?.targetRoles || newAd.targetRoles).length > 0 
                        ? `${(editingAd?.targetRoles || newAd.targetRoles).length} selected`
                        : 'None selected'
                      }
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Publish:</span> 
                      {(editingAd ? editingAd.publishType : newAd.publishType) === 'immediate' ? 'Immediately' : 'Scheduled'}
                      {(editingAd ? editingAd.publishType : newAd.publishType) === 'scheduled' && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({(editingAd ? editingAd.scheduleMode : newAd.scheduleMode) === 'specific' ? 'Specific Time' : 'Delayed'})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={() => {
                  if (editingAd) {
                    const updatedAds = advertisements.map(ad => 
                      ad.id === editingAd.id ? editingAd : ad
                    )
                    setLocalAdvertisements(updatedAds)
                    
                    // Update settings in database and bot
                    updateAdsSettings({
                      enabled: adsEnabled,
                      ads: updatedAds
                    })
                    
                    setEditingAd(null)
                  } else {
                    handleCreateAd()
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={editingAd ? (!editingAd.title || !editingAd.content) : (!newAd.title || !newAd.content)}
              >
                {editingAd ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  newAd.publishType === 'immediate' ? (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publish Now
                    </>
                  ) : (
                    <>
                      <Timer className="h-4 w-4 mr-2" />
                      Schedule Publish
                    </>
                  )
                )}
              </Button>

            </div>
          </div>
        </DialogContent>
      </Dialog>
      </DiscordDataLoader>
    </div>
  )
}