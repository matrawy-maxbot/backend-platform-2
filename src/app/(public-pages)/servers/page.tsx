"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBotGuilds } from "@/hooks/useBotGuilds"
import { useAuth } from "@/hooks/useAuth"
import { useSelectedServer } from "@/contexts/selected-server-context"
import {
  Users,
  Crown,
  Shield,
  User,
  Settings,
  Search,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Globe,
  Loader2,
  Plus,
  RefreshCw
} from "lucide-react"

// البيانات الوهمية تم إزالتها لاستخدام البيانات الحقيقية من الـ API

const getBotStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-green-500"
    case "idle":
      return "bg-yellow-500"
    case "dnd":
      return "bg-red-500"
    case "offline":
      return "bg-gray-500"
    default:
      return "bg-gray-500"
  }
}

const getBotStatusIcon = (status: string) => {
  switch (status) {
    case "online":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "idle":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "dnd":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "offline":
      return <XCircle className="h-4 w-4 text-gray-500" />
    default:
      return <XCircle className="h-4 w-4 text-gray-500" />
  }
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "owner":
      return <Crown className="h-4 w-4 text-yellow-500" />
    case "admin":
      return <Shield className="h-4 w-4 text-blue-500" />
    case "moderator":
      return <Shield className="h-4 w-4 text-green-500" />
    default:
      return <User className="h-4 w-4 text-gray-500" />
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "owner":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "admin":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "moderator":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function ServersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { guilds, loading, error, refetch } = useBotGuilds()
  const { discordData } = useAuth()
  const { setSelectedServer, switchServer } = useSelectedServer()

  // تحويل بيانات Discord إلى الشكل المطلوب
  const realDiscordServers = guilds.map(guild => ({
    id: guild.id,
    name: guild.name,
    description: `Discord Server • ${guild.features?.includes('VERIFIED') ? 'Verified' : 'Community'} Server`,
    memberCount: Math.floor(Math.random() * 10000) + 1000, // سيتم استبدالها بـ API call منفصل
    onlineMembers: Math.floor(Math.random() * 1000) + 100,
    botStatus: "online" as const, // السيرفرات التي يتواجد فيها البوت
    userRole: guild.owner ? "owner" as const : "admin" as const,
    joinedAt: "2023-01-15",
    category: "general" as const,
    verified: guild.features?.includes('VERIFIED') || false,
    premium: guild.features?.includes('PREMIUM_TIER_3') || false,
    growth: "+5%",
    icon: guild.icon
  }))

  // استخدام البيانات الحقيقية
  const discordServers = realDiscordServers

  const handleControlPanelClick = (server: any) => {
    // استخدام switchServer للبحث عن السيرفر في guilds المحملة من Discord
    switchServer(server.id)
    
    // التحقق من دور المستخدم وتوجيهه للصفحة المناسبة
    if (server.userRole === 'owner') {
      // مالك الخادم يدخل مباشرة إلى لوحة التحكم
      router.push('/dashboard')
    } else if (server.userRole === 'admin') {
      // المديرين يحتاجون للتحقق أولاً
      router.push(`/admin-verification?serverId=${server.id}`)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // إعادة تحميل البيانات مع تجاهل الـ cache
      await fetch('/api/discord/bot-guilds?refresh=true')
      
      // إعادة تحميل البيانات في الـ hook
      if (refetch) {
        await refetch()
      }
      
      // إعادة تحميل الصفحة كحل بديل
      window.location.reload()
    } catch (error) {
      console.error('خطأ في إعادة التحميل:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const filteredServers = discordServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || server.botStatus === statusFilter
    const matchesRole = roleFilter === "all" || server.userRole === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const onlineServers = discordServers.filter(s => s.botStatus === 'online').length
  const totalMembers = discordServers.reduce((sum, s) => sum + s.memberCount, 0)
  const ownedServers = discordServers.filter(s => s.userRole === 'owner').length
  const adminServers = discordServers.filter(s => s.userRole === 'admin' || s.userRole === 'owner').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 -mt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">جاري تحميل السيرفرات التي يوجد بها البوت...</p>
        </div>
      </div>
    )
  }

  if (error) {
    const isRateLimit = error.includes('تجاوز حد الطلبات') || error.includes('Rate limit')
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 -mt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className={`h-8 w-8 mx-auto mb-4 ${isRateLimit ? 'text-yellow-500' : 'text-red-500'}`} />
          <p className="text-white text-lg mb-2">
            {isRateLimit ? 'Discord API محدود مؤقتاً' : 'خطأ في تحميل سيرفرات البوت'}
          </p>
          <p className="text-gray-400 mb-4">{error}</p>
          {isRateLimit && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 text-sm">
                💡 نصيحة: Discord يحد من عدد الطلبات لحماية خوادمه. البيانات المحفوظة مسبقاً ستظهر إن وجدت.
              </p>
            </div>
          )}
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 -mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold text-white">Discord Servers</h1>
                  <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'جاري التحديث...' : 'تحديث القائمة'}
                  </Button>
                </div>
               <p className="text-gray-400">إدارة ومراقبة سيرفرات Discord التي يوجد بها البوت الخاص بك</p>
              </div>
            </div>
            <Button 
              onClick={() => {
                const botId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '691025642078208092'
                const permissions = '8' // Administrator permissions
                const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${botId}&permissions=${permissions}&scope=bot%20applications.commands`
                window.open(inviteUrl, '_blank')
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              إضافة البوت لسيرفر
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">البوت نشط</p>
                    <p className="text-2xl font-bold text-green-400">{onlineServers}/{discordServers.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Members</p>
                    <p className="text-2xl font-bold text-blue-400">{totalMembers.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Owned Servers</p>
                    <p className="text-2xl font-bold text-yellow-400">{ownedServers}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Crown className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Admin Permissions</p>
                    <p className="text-2xl font-bold text-purple-400">{adminServers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search Discord servers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-800 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-gray-800 text-white">
                 <Activity className="h-4 w-4 mr-2" />
                 <SelectValue placeholder="Bot Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Statuses</SelectItem>
                 <SelectItem value="online">Online</SelectItem>
                 <SelectItem value="idle">Idle</SelectItem>
                 <SelectItem value="dnd">Do Not Disturb</SelectItem>
                 <SelectItem value="offline">Offline</SelectItem>
               </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-gray-800 text-white">
                 <Shield className="h-4 w-4 mr-2" />
                 <SelectValue placeholder="Your Role" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Roles</SelectItem>
                 <SelectItem value="owner">Owner</SelectItem>
                 <SelectItem value="admin">Admin</SelectItem>
                 <SelectItem value="moderator">Moderator</SelectItem>
                 <SelectItem value="member">Member</SelectItem>
               </SelectContent>
            </Select>
          </div>
        </div>

        {/* Servers Grid */}
        {filteredServers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-16 w-16 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Servers Found</h3>
             <p className="text-gray-400 mb-6 max-w-md mx-auto">No servers found matching the specified search criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setRoleFilter("all")
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServers.map((server) => (
              <Card key={server.id} className="group relative overflow-hidden bg-gradient-to-r from-gray-900/95 via-gray-800/90 to-gray-900/95 border border-gray-700/50 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-[1.02] cursor-pointer backdrop-blur-sm">
                {/* Luxury Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500 opacity-60"></div>
                
                <CardContent className="relative p-6">
                  {/* Main Content Row */}
                  <div className="flex items-center gap-6 mb-4">
                    {/* Server Avatar with Luxury Design */}
                    <div className="relative flex-shrink-0">
                      {/* Outer Glow Ring */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 scale-110"></div>
                      
                      {/* Main Avatar */}
                      <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800 rounded-3xl flex items-center justify-center text-2xl font-bold text-white shadow-2xl border border-purple-500/30 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
                        {server.icon ? (
                          <img 
                            src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=128`}
                            alt={server.name}
                            className="w-full h-full object-cover rounded-3xl relative z-10"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <span className={`relative z-10 ${server.icon ? 'hidden' : ''}`}>{server.name.split(' ')[0]}</span>
                      </div>
                        
                      {/* Status Indicator with Pulse */}
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-gray-900 ${getBotStatusColor(server.botStatus)} shadow-xl`}>
                        <div className={`absolute inset-0 rounded-full ${getBotStatusColor(server.botStatus)} animate-ping opacity-30`}></div>
                      </div>
                    </div>
                    
                    {/* Server Info - Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Server Name with Status Badges */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-white text-xl font-bold group-hover:text-purple-300 transition-colors duration-300 tracking-wide">
                          {server.name}
                        </h3>
                        
                        {/* Status Badges Group */}
                        <div className="flex items-center gap-2">
                          {server.verified && (
                            <div className="flex items-center justify-center w-6 h-6 bg-blue-500/20 border border-blue-400/30 rounded-full backdrop-blur-sm">
                              <CheckCircle className="h-3 w-3 text-blue-400" />
                            </div>
                          )}
                          
                          {server.premium && (
                            <div className="flex items-center justify-center w-6 h-6 bg-yellow-500/20 border border-yellow-400/30 rounded-full backdrop-blur-sm">
                              <Crown className="h-3 w-3 text-yellow-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Server Description */}
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{server.description}</p>
                      
                      {/* Info Group - Member Count and Role */}
                      <div className="flex items-center gap-4">
                        {/* Member Count with Icon */}
                        <div className="flex items-center gap-2 text-gray-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/30">
                          <Users className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium">{server.memberCount.toLocaleString()} عضو</span>
                        </div>
                        
                        {/* Role Badge with Premium Design */}
                        <Badge className={`px-3 py-1.5 text-sm font-semibold ${getRoleColor(server.userRole)} shadow-lg border border-white/10 backdrop-blur-sm`}>
                          {getRoleIcon(server.userRole)}
                          <span className="mr-1.5 rtl:ml-1.5">
                            {server.userRole === 'owner' ? 'مالك' :
                              server.userRole === 'admin' ? 'مدير' :
                              server.userRole === 'moderator' ? 'مشرف' : 'عضو'}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Control Panel Button Row - Always Visible */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center justify-between">
                      {/* Additional Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getBotStatusColor(server.botStatus)}`}></div>
                          <span>البوت {server.botStatus === 'online' ? 'متصل' : server.botStatus === 'idle' ? 'خامل' : server.botStatus === 'dnd' ? 'مشغول' : 'غير متصل'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          <span>{server.onlineMembers.toLocaleString()} متصل</span>
                        </div>
                      </div>
                      
                      {/* Control Panel Button */}
                      <Button 
                        onClick={() => handleControlPanelClick(server)}
                        disabled={server.userRole === 'member' || server.userRole === 'moderator'}
                        className={`${server.userRole === 'member' || server.userRole === 'moderator' 
                          ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                          : 'bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-700 hover:via-violet-700 hover:to-purple-700 hover:scale-105'
                        } text-white font-semibold py-2.5 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-500/30 backdrop-blur-sm`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span className="text-sm">
                            {server.userRole === 'owner' ? 'Control Panel' :
                             server.userRole === 'admin' ? 'Protected Login' :
                             'Not Available'}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}


      </div>
    </div>
  )
}