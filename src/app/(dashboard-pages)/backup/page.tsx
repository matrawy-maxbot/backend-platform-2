"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect, useCallback } from "react"
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Calendar, 
  Clock, 
  Users, 
  Hash, 
  MessageSquare, 
  Volume2,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  X,
  Trash2,
  Eye,
  Archive,
  History,
  FileText
} from "lucide-react"
import { toast } from "sonner"
import { useAllDiscordData } from "@/hooks/useDiscordData"
import { useSelectedServer } from "@/contexts/selected-server-context"
import { useActivityTracker } from '@/components/ActivityTracker'

interface ServerStats {
  categories: number
  textChannels: number
  voiceChannels: number
  stageChannels: number
  announcementChannels: number
  roles: number
}

interface BackupInfo {
  exists: boolean
  createdAt?: string
  channels: number
  roles: number
  settings: any
}

interface BackupListItem {
  id: string
  createdAt: string
  size: number
  channels: number
  roles: number
  categories: number
}

interface RestoreResult {
  success: boolean
  restored: {
    categories: { created: number, updated: number, skipped: number }
    channels: { created: number, updated: number, skipped: number }
    roles: { created: number, updated: number, skipped: number }
    permissions: { restored: number, failed: number }
    errors: string[]
    warnings: string[]
  }
  summary: {
    totalRestored: number
    totalErrors: number
    totalWarnings: number
  }
}

function BackupPage() {
  console.log('🚀 BackupPage component loaded')
  
  const { selectedServer } = useSelectedServer()
  const { trackBackupUpdate, logActivity } = useActivityTracker()
  const { 
    allChannels, 
    textChannels, 
    voiceChannels, 
    categoryChannels,
    allRoles,
    loading: discordLoading,
    error: discordError,
    hasData
  } = useAllDiscordData()
  
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [backupInfo, setBackupInfo] = useState<BackupInfo>({ exists: false, channels: 0, roles: 0, settings: null })
  
  console.log('🚀 Initial backupInfo state:', backupInfo)
  const [serverStats, setServerStats] = useState<ServerStats>({
    categories: 0,
    textChannels: 0,
    voiceChannels: 0,
    stageChannels: 0,
    announcementChannels: 0,
    roles: 0
  })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showUpdateConfirmDialog, setShowUpdateConfirmDialog] = useState(false)
  const [showCreateConfirmDialog, setShowCreateConfirmDialog] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [currentBackupStep, setCurrentBackupStep] = useState("")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [successType, setSuccessType] = useState<'install' | 'update' | 'create'>('install')
  const [serverId, setServerId] = useState<string>("")

  // New states for backup management
  const [backupList, setBackupList] = useState<BackupListItem[]>([])
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showBackupDetails, setShowBackupDetails] = useState(false)
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(null)
  const [showRestoreResult, setShowRestoreResult] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // تحديث إحصائيات السيرفر من البيانات الحقيقية
  useEffect(() => {
    if (allChannels && allRoles) {
      const categories = allChannels.filter(c => c.type === 4)
      const textChs = allChannels.filter(c => c.type === 0)
      const voiceChs = allChannels.filter(c => c.type === 2)
      
      const stats = {
        categories: categories.length,
        textChannels: textChs.length,
        voiceChannels: voiceChs.length,
        stageChannels: allChannels.filter(c => c.type === 13).length,
        announcementChannels: allChannels.filter(c => c.type === 5).length,
        roles: allRoles.length
      }
      
      setServerStats(stats)
    }
  }, [allChannels, allRoles])

  const fetchBackupInfo = useCallback(async () => {
    if (!selectedServer?.id) {
      console.log('❌ No selectedServer or selectedServer.id:', selectedServer)
      return
    }
    
    console.log('🔍 Fetching backup info for server:', selectedServer.id, 'Server name:', selectedServer.name)
    
    try {
      const response = await fetch(`http://localhost:3001/api/info/${selectedServer.id}`, {
      headers: {
        'Authorization': `Bearer dashboard-bot-secret-2024`
      }
    })
      if (response.ok) {
        const info = await response.json()
        console.log('📦 Backup info response:', info)
        console.log('📦 info.hasBackup:', info.hasBackup)
        console.log('📦 info.backup:', info.backup)
        console.log('📦 info.stats:', info.stats)
        
        // تحويل hasBackup إلى exists للتوافق مع الواجهة الأمامية
        const backupInfo = {
          exists: info.hasBackup || false,
          createdAt: info.backup?.createdAt || info.backup?.timestamp,
          channels: info.stats?.channels || 0,
          roles: info.stats?.roles || 0,
          settings: info.backup || null
        }
        
        console.log('✅ Setting backup info:', backupInfo)
        console.log('✅ backupInfo.exists:', backupInfo.exists)
        setBackupInfo(backupInfo)
        console.log('✅ setBackupInfo called successfully')
      } else {
        console.error('❌ Failed to fetch backup info:', response.status, response.statusText)
        // Set backup info to not exist if API call fails
        setBackupInfo({ exists: false, channels: 0, roles: 0, settings: null })
      }
    } catch (error) {
      console.error('❌ Error fetching backup info:', error)
      toast.error('Failed to fetch backup information')
      // Set backup info to not exist if there's an error
      setBackupInfo({ exists: false, channels: 0, roles: 0, settings: null })
    }
  }, [selectedServer?.id])

  // New function to fetch backup list
  const fetchBackupList = useCallback(async () => {
    if (!selectedServer?.id) return
    
    try {
      const response = await fetch(`http://localhost:3001/api/list/${selectedServer.id}`, {
      headers: {
        'Authorization': `Bearer dashboard-bot-secret-2024`
      }
    })
      if (response.ok) {
        const list = await response.json()
        setBackupList(list.backups || [])
      }
    } catch (error) {
      console.error('Error fetching backup list:', error)
      toast.error('Failed to fetch backup list')
    }
  }, [selectedServer?.id])

  // جلب بيانات النسخة الاحتياطية
  useEffect(() => {
    console.log('🔄 useEffect triggered - selectedServer?.id:', selectedServer?.id)
    if (selectedServer?.id) {
      console.log('✅ Calling fetchBackupInfo and fetchBackupList')
      fetchBackupInfo()
      fetchBackupList()
    } else {
      console.log('❌ No selectedServer.id available')
    }
  }, [selectedServer?.id, fetchBackupInfo, fetchBackupList])

  // Debug: Log backupInfo state changes
  useEffect(() => {
    console.log('🔍 backupInfo state changed:', backupInfo)
    console.log('🔍 backupInfo.exists:', backupInfo.exists)
  }, [backupInfo])

  // Delete backup function
  const deleteBackup = async (backupId: string) => {
    if (!selectedServer?.id) return
    
    try {
      const response = await fetch(`http://localhost:3001/api/delete/${selectedServer.id}/${backupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer dashboard-bot-secret-2024`
        }
      })
      
      if (response.ok) {
        setBackupList(prev => prev.filter(backup => backup.id !== backupId))
        setSelectedBackup(null)
        setShowDeleteDialog(false)
        // Refresh backup info if deleted backup was the latest
        fetchBackupInfo()
        toast.success('Backup deleted successfully')
        trackBackupUpdate(`تم حذف النسخة الاحتياطية: ${backupId}`)
      } else {
        throw new Error('Failed to delete backup')
      }
    } catch (error) {
      console.error('Error deleting backup:', error)
      toast.error('Failed to delete backup')
    }
  }

  // Restore specific backup function
  const restoreSpecificBackup = async (backupId: string) => {
    if (!selectedServer?.id) return
    
    setIsRestoring(true)
    try {
      const response = await fetch(`http://localhost:3001/api/restore/${selectedServer.id}/${backupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer dashboard-bot-secret-2024`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setRestoreResult(result)
        setShowRestoreResult(true)
        setShowRestoreDialog(false)
        toast.success('Backup restored successfully')
      } else {
        throw new Error('Failed to restore backup')
      }
    } catch (error) {
      console.error('Error restoring backup:', error)
      toast.error('Failed to restore backup')
    } finally {
      setIsRestoring(false)
    }
  }

  const handleCreateBackup = () => {
    if (backupInfo.exists) {
      setShowUpdateConfirmDialog(true)
    } else {
      setShowCreateConfirmDialog(true)
    }
  }

  const performBackup = async (showSuccessAfter = false) => {
    if (!selectedServer?.id) {
      toast.error('No server selected')
      return
    }
    
    setIsBackingUp(true)
    setBackupProgress(0)
    setCompletedSteps([])
    
    try {
      // خطوة 1: بدء عملية النسخ الاحتياطي
      setCurrentBackupStep("Initializing backup process...")
      setBackupProgress(5)
      await new Promise(resolve => setTimeout(resolve, 500))

      // خطوة 2: فحص القنوات النصية
      setCurrentBackupStep(`Scanning ${textChannels.length} text channels...`)
      setBackupProgress(15)
      await new Promise(resolve => setTimeout(resolve, 800))

      // خطوة 3: فحص القنوات الصوتية
      setCurrentBackupStep(`Scanning ${voiceChannels.length} voice channels...`)
      setBackupProgress(25)
      await new Promise(resolve => setTimeout(resolve, 600))

      // خطوة 4: فحص الفئات
      setCurrentBackupStep(`Scanning ${categoryChannels.length} categories...`)
      setBackupProgress(35)
      await new Promise(resolve => setTimeout(resolve, 500))

      // خطوة 5: فحص الأدوار
      setCurrentBackupStep(`Scanning ${allRoles.length} roles...`)
      setBackupProgress(45)
      await new Promise(resolve => setTimeout(resolve, 700))

      // خطوة 6: إنشاء النسخة الاحتياطية
        setCurrentBackupStep("Creating backup file...")
        setBackupProgress(60)
        
        const response = await fetch(`http://localhost:3001/api/create/${selectedServer.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer dashboard-bot-secret-2024`
          }
        })

        if (response.ok) {
          const result = await response.json()
          
          // خطوة 7: حفظ القنوات والفئات
          setCurrentBackupStep("Saving Channels & Categories")
          setBackupProgress(70)
          await new Promise(resolve => setTimeout(resolve, 800))
          setCompletedSteps(prev => [...prev, "channels"])
          
          // خطوة 8: حفظ الأدوار والصلاحيات
          setCurrentBackupStep("Saving Roles & Permissions")
          setBackupProgress(80)
          await new Promise(resolve => setTimeout(resolve, 600))
          setCompletedSteps(prev => [...prev, "roles"])
          
          // خطوة 9: حفظ إعدادات السيرفر
          setCurrentBackupStep("Saving Server Settings")
          setBackupProgress(90)
          await new Promise(resolve => setTimeout(resolve, 700))
          setCompletedSteps(prev => [...prev, "settings"])
          
          // خطوة 10: حفظ النسخة الاحتياطية
          setCurrentBackupStep("Saving Backup File")
          setBackupProgress(95)
          await new Promise(resolve => setTimeout(resolve, 500))
          setCompletedSteps(prev => [...prev, "permissions"])
          
          setBackupProgress(100)
          setCurrentBackupStep("Backup Saved Successfully")
          
          setTimeout(async () => {
            setIsBackingUp(false)
            setCurrentBackupStep("")
            setBackupProgress(0)
            setCompletedSteps([])
            
            // حفظ الحالة السابقة لتحديد نوع الرسالة
            const wasExisting = backupInfo.exists
            
            // تحديث معلومات النسخة الاحتياطية
            console.log('🔄 Calling fetchBackupInfo and fetchBackupList after backup creation')
            await fetchBackupInfo()
            await fetchBackupList()
            console.log('✅ Finished calling fetchBackupInfo and fetchBackupList')
            
            if (showSuccessAfter) {
              toast.success(wasExisting ? 'Backup updated successfully' : 'Backup created successfully')
              trackBackupUpdate(wasExisting ? 'تم تحديث النسخة الاحتياطية بنجاح' : 'تم إنشاء نسخة احتياطية جديدة بنجاح')
            }
            
            if (showSuccessAfter) {
              setShowSuccessModal(true)
              setShowConfetti(true)
              
              setTimeout(() => {
                setShowConfetti(false)
              }, 4000)
              
              setTimeout(() => {
                setShowSuccessModal(false)
              }, 6000)
            }
          }, 1000)
      } else {
        throw new Error('Failed to create backup')
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      toast.error('Failed to create backup')
      setIsBackingUp(false)
      setCurrentBackupStep("")
      setBackupProgress(0)
      setCompletedSteps([])
    }
  }

  const handleInstallBackup = () => {
    setShowConfirmDialog(true)
  }

  const confirmInstall = async () => {
    if (!selectedServer?.id) {
      toast.error('No server selected')
      return
    }
    
    setShowConfirmDialog(false)
    setIsRestoring(true)
    setSuccessType('install')
    
    try {
      const response = await fetch(`http://localhost:3001/api/restore/${selectedServer.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer dashboard-bot-secret-2024`
        }
      })

      if (response.ok) {
        const result = await response.json()
        
        setTimeout(() => {
          setIsRestoring(false)
          setShowSuccessModal(true)
          setShowConfetti(true)
          
          setTimeout(() => {
            setShowConfetti(false)
          }, 4000)
          
          setTimeout(() => {
            setShowSuccessModal(false)
          }, 6000)
          
          toast.success('Backup installed successfully')
          trackBackupUpdate('تم استعادة النسخة الاحتياطية بنجاح')
        }, 3000)
      } else {
        throw new Error('Failed to restore backup')
      }
    } catch (error) {
      console.error('Error restoring backup:', error)
      toast.error('Failed to install backup')
      setIsRestoring(false)
    }
  }

  const confirmUpdate = async () => {
    setShowUpdateConfirmDialog(false)
    setSuccessType('update')
    performBackup(true)
  }

  const confirmCreate = async () => {
    setShowCreateConfirmDialog(false)
    setSuccessType('create')
    performBackup(true)
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8 min-h-screen relative">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Backup for {selectedServer?.name || 'server'}
            </h1>
            <p className="text-gray-400">Manage backup copies of server settings, channels and roles</p>
          </div>
          {backupInfo.exists ? (
            <div className="flex gap-3">
              <Button 
                onClick={handleCreateBackup}
                disabled={isBackingUp || !selectedServer?.id || discordLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isBackingUp ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {isBackingUp ? "Updating..." : "Update Backup"}
              </Button>
              <Button 
                onClick={handleInstallBackup}
                disabled={isRestoring}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRestoring ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isRestoring ? "Installing..." : "Install Backup"}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleCreateBackup}
              disabled={isBackingUp || !selectedServer?.id || discordLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isBackingUp ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              {isBackingUp ? "Creating..." : "Create Backup"}
            </Button>
          )}
        </div>

        {/* عرض تقدم النسخ الاحتياطي */}
        {isBackingUp && (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                Creating Backup
              </CardTitle>
              <CardDescription>
                Please wait while we backup your server data...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{currentBackupStep}</span>
                  <span className="text-white">{Math.round(backupProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${backupProgress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* عرض الخطوات المكتملة */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { key: 'channels', label: 'Channels', icon: Hash },
                  { key: 'roles', label: 'Roles', icon: Shield },
                  { key: 'settings', label: 'Settings', icon: Users },
                  { key: 'permissions', label: 'Permissions', icon: Shield }
                ].map(({ key, label, icon: Icon }) => (
                  <div 
                    key={key}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      completedSteps.includes(key) 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-gray-800/50 text-gray-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                    {completedSteps.includes(key) && (
                      <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different backup views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <Archive className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-blue-600">
              <History className="h-4 w-4 mr-2" />
              Manage Backups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Last Backup Info */}
            {backupInfo.exists ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">
                      {backupInfo.createdAt ? new Date(backupInfo.createdAt).toLocaleDateString('en-GB') : 'Unknown'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {backupInfo.createdAt ? 
                        `${Math.floor((Date.now() - new Date(backupInfo.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago` : 
                        'Unknown date'
                      }
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Last backup
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">No backup available</p>
                    <p className="text-gray-400 text-sm">Create a backup to protect server settings</p>
                  </div>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Unprotected
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Backup Management Interface */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Backup History
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View, restore, or delete your backup copies
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {backupList.length > 0 ? (
                  <div className="space-y-3">
                    {backupList.map((backup) => (
                      <div 
                        key={backup.id}
                        className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <Archive className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {new Date(backup.createdAt).toLocaleDateString('en-GB')} at {new Date(backup.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {backup.channels} channels • {backup.roles} roles • {backup.categories} categories
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBackup(backup.id)
                              setShowBackupDetails(true)
                            }}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedBackup(backup.id)
                              setShowRestoreDialog(true)
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isRestoring}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBackup(backup.id)
                              setShowDeleteDialog(true)
                            }}
                            className="border-red-600 text-red-400 hover:bg-red-600/10"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Archive className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">No backups found</p>
                    <p className="text-gray-500 text-sm">Create your first backup to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <Trash2 className="h-5 w-5 text-red-400 mr-2" />
                Delete Backup
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Are you sure you want to delete this backup? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => selectedBackup && deleteBackup(selectedBackup)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Backup
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Restore Confirmation Dialog */}
        <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <Download className="h-5 w-5 text-blue-400 mr-2" />
                Restore Backup
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Are you sure you want to restore this backup? All current settings will be replaced with the backup data.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowRestoreDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => selectedBackup && restoreSpecificBackup(selectedBackup)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isRestoring}
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  "Restore Backup"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Backup Details Dialog */}
        <Dialog open={showBackupDetails} onOpenChange={setShowBackupDetails}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <Eye className="h-5 w-5 text-blue-400 mr-2" />
                Backup Details
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                View detailed information about this backup
              </DialogDescription>
            </DialogHeader>
            
            {selectedBackup && backupList.find(b => b.id === selectedBackup) && (
              <div className="space-y-6">
                {(() => {
                  const backup = backupList.find(b => b.id === selectedBackup)!
                  return (
                    <>
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">
                              <span className="font-medium">Created:</span> {new Date(backup.createdAt).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">
                              <span className="font-medium">File Size:</span> {backup.size}
                            </p>
                            <p className="text-sm text-gray-400">
                              <span className="font-medium">Backup ID:</span> {backup.id}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white">Content Summary</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-800/50 p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-blue-400" />
                                <span className="text-sm text-gray-300">Channels</span>
                              </div>
                              <p className="text-xl font-bold text-white">{backup.channels}</p>
                            </div>
                            <div className="bg-gray-800/50 p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-purple-400" />
                                <span className="text-sm text-gray-300">Roles</span>
                              </div>
                              <p className="text-xl font-bold text-white">{backup.roles}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gray-700" />

                      {/* Detailed Content */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Backup Contents</h3>
                        
                        <Tabs defaultValue="channels" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                            <TabsTrigger value="channels">Channels</TabsTrigger>
                            <TabsTrigger value="roles">Roles</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="channels" className="space-y-3">
                            <div className="bg-gray-800/30 p-4 rounded-lg">
                              <h4 className="font-medium text-white mb-2">Channel Information</h4>
                              <p className="text-sm text-gray-400 mb-3">
                                This backup contains {backup.channels} channels including categories, text channels, voice channels, and their permissions.
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Hash className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Text Channels</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Volume2 className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Voice Channels</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Archive className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Categories</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Shield className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Permissions</span>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="roles" className="space-y-3">
                            <div className="bg-gray-800/30 p-4 rounded-lg">
                              <h4 className="font-medium text-white mb-2">Role Information</h4>
                              <p className="text-sm text-gray-400 mb-3">
                                This backup contains {backup.roles} roles with their permissions, colors, and hierarchy.
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Shield className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Role Permissions</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Role Hierarchy</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Settings className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Role Settings</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Role Colors</span>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="settings" className="space-y-3">
                            <div className="bg-gray-800/30 p-4 rounded-lg">
                              <h4 className="font-medium text-white mb-2">Server Settings</h4>
                              <p className="text-sm text-gray-400 mb-3">
                                This backup includes server configuration, moderation settings, and other server preferences.
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Settings className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Server Configuration</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Shield className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Moderation Settings</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Member Settings</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-300">Bot Configuration</span>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      <Separator className="bg-gray-700" />

                      {/* Actions */}
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          <Info className="h-4 w-4 inline mr-1" />
                          This backup can be restored to replace current server settings
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowBackupDetails(false)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Close
                          </Button>
                          <Button
                            onClick={() => {
                              setShowBackupDetails(false)
                              setShowRestoreDialog(true)
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Restore This Backup
                          </Button>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Restore Result Dialog */}
        <Dialog open={showRestoreResult} onOpenChange={setShowRestoreResult}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                Restore Complete
              </DialogTitle>
            </DialogHeader>
            {restoreResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-2xl font-bold text-green-400">{restoreResult.summary.totalRestored}</p>
                    <p className="text-sm text-gray-400">Items Restored</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="text-2xl font-bold text-yellow-400">{restoreResult.summary.totalWarnings}</p>
                    <p className="text-sm text-gray-400">Warnings</p>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-2xl font-bold text-red-400">{restoreResult.summary.totalErrors}</p>
                    <p className="text-sm text-gray-400">Errors</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Categories</h4>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-400">Created: {restoreResult.restored.categories.created}</span>
                      <span className="text-blue-400">Updated: {restoreResult.restored.categories.updated}</span>
                      <span className="text-gray-400">Skipped: {restoreResult.restored.categories.skipped}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Channels</h4>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-400">Created: {restoreResult.restored.channels.created}</span>
                      <span className="text-blue-400">Updated: {restoreResult.restored.channels.updated}</span>
                      <span className="text-gray-400">Skipped: {restoreResult.restored.channels.skipped}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Roles</h4>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-400">Created: {restoreResult.restored.roles.created}</span>
                      <span className="text-blue-400">Updated: {restoreResult.restored.roles.updated}</span>
                      <span className="text-gray-400">Skipped: {restoreResult.restored.roles.skipped}</span>
                    </div>
                  </div>
                </div>
                
                {restoreResult.restored.errors.length > 0 && (
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h4 className="text-red-400 font-medium mb-2">Errors</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      {restoreResult.restored.errors.map((error, index) => (
                        <p key={index}>• {error}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => setShowRestoreResult(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Last Backup Info Card */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">Last Backup Info</CardTitle>
                <CardDescription className="text-gray-400">Current server backup status</CardDescription>
              </div>
              {backupInfo.exists && (
                <Button 
                  onClick={handleCreateBackup}
                  disabled={isBackingUp}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 relative overflow-hidden"
                >
                  {isBackingUp && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 transition-all duration-300"
                      style={{ width: `${backupProgress}%` }}
                    />
                  )}
                  <div className="relative z-10 flex items-center">
                    {isBackingUp ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isBackingUp ? currentBackupStep || "Updating..." : "Update backup"}
                  </div>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Server Stats Grid */}
            {discordLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg animate-pulse">
                    <div className="h-5 w-5 bg-gray-700 rounded"></div>
                    <div>
                      <div className="h-4 w-8 bg-gray-700 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
                  <Hash className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{serverStats.categories}</p>
                    <p className="text-gray-400 text-sm">category channels</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">{serverStats.announcementChannels}</p>
                    <p className="text-gray-400 text-sm">announcement channels</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">{serverStats.textChannels}</p>
                    <p className="text-gray-400 text-sm">text channels</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">{serverStats.stageChannels}</p>
                    <p className="text-gray-400 text-sm">stage channels</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
                  <Volume2 className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-white font-medium">{serverStats.voiceChannels}</p>
                    <p className="text-gray-400 text-sm">voice channels</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="text-white font-medium">{serverStats.roles}</p>
                    <p className="text-gray-400 text-sm">roles</p>
                  </div>
                </div>
              </div>
            )}

            <Separator className="bg-gray-700" />

            {/* Backup Status */}
            <div className="space-y-3">
              <h3 className="text-white font-medium flex items-center">
                <Database className="h-4 w-4 mr-2 text-blue-400" />
                Backup Status
              </h3>
              
              <div className="grid gap-3">
                <div className={`flex items-center justify-between p-3 bg-gray-900/30 rounded-lg transition-all duration-500 ${
                  isBackingUp && currentBackupStep === "Channels & Categories" ? "ring-2 ring-blue-400 bg-blue-500/10" : 
                  completedSteps.includes("channels") ? "ring-2 ring-green-400 bg-green-500/10" : ""
                }`}>
                  <div className="flex items-center space-x-3">
                    {isBackingUp && currentBackupStep === "Channels & Categories" ? (
                      <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
                    ) : backupInfo.exists || completedSteps.includes("channels") ? (
                      <CheckCircle className="h-4 w-4 text-green-400 animate-pulse" />
                    ) : (
                      <X className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-gray-300">Channels & Categories</span>
                  </div>
                  <Badge className={
                    isBackingUp && currentBackupStep === "Channels & Categories" ? "bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs animate-pulse" :
                    backupInfo.exists || completedSteps.includes("channels") ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs" : 
                    "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                  }>
                    {isBackingUp && currentBackupStep === "Channels & Categories" ? "Backing up..." :
                     backupInfo.exists || completedSteps.includes("channels") ? "Saved" : "Not saved"}
                  </Badge>
                </div>
                
                <div className={`flex items-center justify-between p-3 bg-gray-900/30 rounded-lg transition-all duration-500 ${
                  isBackingUp && currentBackupStep === "Roles & Permissions" ? "ring-2 ring-blue-400 bg-blue-500/10" : 
                  completedSteps.includes("roles") ? "ring-2 ring-green-400 bg-green-500/10" : ""
                }`}>
                  <div className="flex items-center space-x-3">
                    {isBackingUp && currentBackupStep === "Roles & Permissions" ? (
                      <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
                    ) : backupInfo.exists || completedSteps.includes("roles") ? (
                      <CheckCircle className="h-4 w-4 text-green-400 animate-pulse" />
                    ) : (
                      <X className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-gray-300">Roles & Permissions</span>
                  </div>
                  <Badge className={
                    isBackingUp && currentBackupStep === "Roles & Permissions" ? "bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs animate-pulse" :
                    backupInfo.exists || completedSteps.includes("roles") ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs" : 
                    "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                  }>
                    {isBackingUp && currentBackupStep === "Roles & Permissions" ? "Backing up..." :
                     backupInfo.exists || completedSteps.includes("roles") ? "Saved" : "Not saved"}
                  </Badge>
                </div>
                
                <div className={`flex items-center justify-between p-3 bg-gray-900/30 rounded-lg transition-all duration-500 ${
                  isBackingUp && currentBackupStep === "Server Settings" ? "ring-2 ring-blue-400 bg-blue-500/10" : 
                  completedSteps.includes("settings") ? "ring-2 ring-green-400 bg-green-500/10" : ""
                }`}>
                  <div className="flex items-center space-x-3">
                    {isBackingUp && currentBackupStep === "Server Settings" ? (
                      <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
                    ) : backupInfo.exists || completedSteps.includes("settings") ? (
                      <CheckCircle className="h-4 w-4 text-green-400 animate-pulse" />
                    ) : (
                      <X className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-gray-300">Server Settings</span>
                  </div>
                  <Badge className={
                    isBackingUp && currentBackupStep === "Server Settings" ? "bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs animate-pulse" :
                    backupInfo.exists || completedSteps.includes("settings") ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs" : 
                    "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                  }>
                    {isBackingUp && currentBackupStep === "Server Settings" ? "Backing up..." :
                     backupInfo.exists || completedSteps.includes("settings") ? "Saved" : "Not saved"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            {backupInfo.exists && (
              <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium">Important Warning</p>
                  <p className="text-gray-300 text-sm mt-1">
                    The restore process will delete all current settings and replace them with the backup. Make sure this is what you want before proceeding.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                Confirm Backup Installation
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Are you sure you want to install the backup? All current settings will be deleted and replaced with the backup.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmInstall}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Install Backup
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Confirmation Dialog */}
        <Dialog open={showUpdateConfirmDialog} onOpenChange={setShowUpdateConfirmDialog}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <Upload className="h-5 w-5 text-blue-400 mr-2" />
                Confirm Backup Update
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Are you sure you want to update the backup? This will create a new backup with current server settings and replace the existing one.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUpdateConfirmDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Yes, Update Backup
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Confirmation Dialog */}
        <Dialog open={showCreateConfirmDialog} onOpenChange={setShowCreateConfirmDialog}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <Database className="h-5 w-5 text-green-400 mr-2" />
                Confirm Backup Creation
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Are you sure you want to create a backup? This will save all current server settings, channels, roles, and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateConfirmDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmCreate}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Yes, Create Backup
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Modal with Confetti */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 border-green-500/30 max-w-md mx-auto relative overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <DialogHeader className="sr-only">
              <DialogTitle>
                {successType === 'install' ? 'Backup Installed Successfully' : 
                 successType === 'update' ? 'Backup Updated Successfully' : 
                 'Backup Created Successfully'}
              </DialogTitle>
            </DialogHeader>
            {/* Confetti Animation */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full animate-bounce`}
                    style={{
                      backgroundColor: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#FBBF24', '#F59E0B'][i % 6],
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  />
                ))}
                {[...Array(30)].map((_, i) => (
                  <div
                    key={`star-${i}`}
                    className="absolute text-yellow-400 animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      fontSize: `${8 + Math.random() * 8}px`
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>
            )}
            
            {/* Success Content */}
            <div className="relative z-10 text-center py-6">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <CheckCircle className="h-12 w-12 text-white animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 animate-fade-in">
                  🎉 Success! 🎉
                </h2>
                <p className="text-green-100 text-lg animate-fade-in-delay">
                  {successType === 'install' ? 'Backup installed successfully' : 
                   successType === 'update' ? 'Backup updated successfully' : 
                   'Backup created successfully'}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2 text-green-200 animate-slide-in">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>{successType === 'install' ? 'Channels & Categories restored' : 'Channels & Categories backed up'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-200 animate-slide-in-delay-1">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>{successType === 'install' ? 'Roles & Permissions restored' : 'Roles & Permissions backed up'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-200 animate-slide-in-delay-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>{successType === 'install' ? 'Server Settings restored' : 'Server Settings backed up'}</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-green-300 text-sm mb-4 animate-fade-in-delay-2">
                  {successType === 'install' ? 'Server is now ready to use with restored settings' : 
                   successType === 'update' ? 'Your server backup has been updated successfully' : 
                   'Your server backup has been created successfully'}
                </p>
                <Button 
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 animate-bounce-slow"
                >
                  Awesome! 🚀
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out 0.8s both;
        }
        
        .animate-slide-in-delay-1 {
          animation: slide-in 0.6s ease-out 1.1s both;
        }
        
        .animate-slide-in-delay-2 {
          animation: slide-in 0.6s ease-out 1.4s both;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  )
}

// تغليف الصفحة بـ ProtectedRoute
function WrappedBackupPage() {
  return (
    <ProtectedRoute>
      <BackupPage />
    </ProtectedRoute>
  )
}

export { WrappedBackupPage as default }