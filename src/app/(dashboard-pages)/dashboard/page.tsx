"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { signIn } from "next-auth/react"
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Shield, 
  Settings, 
  Activity,
  TrendingUp,
  Crown,
  Bot,
  Megaphone,
  Database,
  Scan,
  UserPlus,
  ArrowUpRight,
  Sparkles,
  Zap,
  LogIn
} from "lucide-react"
import Link from "next/link"

const dashboardCards = [
  {
    title: "Members Management",
    description: "Design welcome messages and manage member settings",
    icon: Users,
    href: "/members",
    gradient: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    category: "Management"
  },
  {
    title: "Protection",
    description: "Server protection and security settings",
    icon: Shield,
    href: "/protection",
    gradient: "from-green-500/20 to-emerald-600/20",
    iconColor: "text-green-400",
    borderColor: "border-green-500/30",
    category: "Security"
  },
  {
    title: "Advertisements",
    description: "Create and manage advertisements",
    icon: Megaphone,
    href: "/ads",
    gradient: "from-purple-500/20 to-violet-600/20",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    category: "Marketing"
  },
  {
    title: "Auto Reply",
    description: "Set up automatic message responses",
    icon: Bot,
    href: "/auto-reply",
    gradient: "from-yellow-500/20 to-amber-600/20",
    iconColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    category: "Automation"
  },
  {
    title: "Auto Log",
    description: "Automatically log activities",
    icon: Activity,
    href: "/auto-log",
    gradient: "from-orange-500/20 to-red-600/20",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/30",
    category: "Monitoring"
  },
  {
    title: "Backup",
    description: "Create and restore backups",
    icon: Database,
    href: "/backup",
    gradient: "from-cyan-500/20 to-teal-600/20",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    category: "Data"
  },
  {
    title: "Server Scan",
    description: "Security and risk scanning",
    icon: Scan,
    href: "/scan",
    gradient: "from-red-500/20 to-rose-600/20",
    iconColor: "text-red-400",
    borderColor: "border-red-500/30",
    category: "Security"
  },
  {
    title: "Admin Management",
    description: "Add and remove administrators",
    icon: Crown,
    href: "/admins",
    gradient: "from-amber-500/20 to-yellow-600/20",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    category: "Management"
  },
  {
    title: "Dashboard Log",
    description: "View activity logs",
    icon: BarChart3,
    href: "/dashboard-log",
    gradient: "from-indigo-500/20 to-blue-600/20",
    iconColor: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    category: "Analytics"
  }
]

export default function DashboardPage() {
  const { discordData, user, isLoading, isAuthenticated } = useAuth()

  // إذا كان المستخدم غير مسجل دخول
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-center space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mx-auto w-fit">
            <LogIn className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">مرحباً بك في GeniusBot</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            يجب تسجيل الدخول باستخدام Discord للوصول إلى لوحة التحكم
          </p>
          <Button 
            onClick={() => signIn('discord')}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 text-lg font-semibold"
          >
            <LogIn className="h-5 w-5 mr-2" />
            تسجيل الدخول بـ Discord
          </Button>
        </div>
      </div>
    )
  }

  // إذا كان في حالة تحميل
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Section with User Info */}
        {discordData && (
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={discordData.avatarUrl}
                  alt={discordData.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/defaults/avatar.svg';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">مرحباً، {discordData.username}!</h2>
                <p className="text-gray-400">مرحباً بك في لوحة التحكم الخاصة بك</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-gray-300 text-xl font-medium">Manage your Discord server with style</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <div className="h-1 w-6 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full"></div>
              <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Total Members</p>
                  <p className="text-3xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">1,234</p>
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-green-400 font-medium">+12% this week</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-xl shadow-2xl hover:shadow-green-500/10 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Messages Today</p>
                  <p className="text-3xl font-bold text-white group-hover:text-green-100 transition-colors duration-300">567</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Zap className="h-3 w-3 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Very Active</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-10 w-10 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-xl shadow-2xl hover:shadow-green-500/10 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Protection Status</p>
                  <p className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">Active</p>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">All systems secure</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Cards */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Dashboard Tools</h2>
              <p className="text-gray-400 mt-2">Powerful tools to manage your Discord server</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                {dashboardCards.length} Tools Available
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dashboardCards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <Link key={index} href={card.href}>
                  <Card className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 ${card.borderColor} backdrop-blur-xl hover:bg-gradient-to-br hover:from-gray-800/90 hover:to-gray-700/90 transition-all duration-500 cursor-pointer group h-40 flex items-center shadow-2xl hover:shadow-xl hover:scale-[1.02] relative overflow-hidden`}>
                    {/* Background gradient effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <Badge variant="outline" className={`${card.borderColor} ${card.iconColor} bg-black/20 text-xs font-medium backdrop-blur-sm`}>
                        {card.category}
                      </Badge>
                    </div>
                    
                    <CardHeader className="p-6 w-full relative z-10">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.gradient} ${card.borderColor} border group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                          <IconComponent className={`h-8 w-8 ${card.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className={`text-white group-hover:${card.iconColor} transition-colors duration-300 text-xl font-bold truncate`}>
                              {card.title}
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                          </div>
                          <CardDescription className="text-gray-400 group-hover:text-gray-300 text-sm leading-relaxed line-clamp-2 transition-colors duration-300">
                            {card.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}