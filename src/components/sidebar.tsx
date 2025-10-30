"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useSelectedServer } from "@/contexts/selected-server-context"
import { useDiscordGuilds } from "@/hooks/useDiscordGuilds"
import { cn } from "@/lib/utils"
import { useMobileSidebar } from "@/contexts/mobile-sidebar-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  Mail,
  Bell,
  Search,
  Plus,
  LogOut,
  User,
  Shield,
  Database,
  Zap,
  TrendingUp,
  Activity,
  MessageSquare,
  MoreHorizontal,
  Crown,
  X,
  PanelLeftOpen,
  ChevronsUpDown,
  Bot,
  Megaphone,
  UserCog,
  ScanLine
} from "lucide-react"
import AvatarCrown from "@/components/ui/avatar-crown"
import { UserMenuDropdownHeader, UserMenuDropdownBody } from "@/components/ui/user-menu-dropdown"

interface SidebarProps {
  className?: string
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    badge: null,
    active: true,
    color: "text-blue-400"
  },
  {
    title: "Members",
    icon: Users,
    href: "/members",
    badge: null,
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Protection",
    icon: Shield,
    href: "/protection",
    badge: null,
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Scan",
    icon: ScanLine,
    href: "/scan",
    badge: "NEW",
    badgeType: "new",
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Smart Auto Reply",
    icon: Bot,
    href: "/auto-reply",
    badge: "NEW",
    badgeType: "new",
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Advertising",
    icon: Megaphone,
    href: "/ads",
    badge: "NEW",
    badgeType: "new",
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Admins",
    icon: UserCog,
    href: "/admins",
    badge: null,
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Activity Logs",
    icon: FileText,
    href: "/auto-log",
    badge: "NEW",
    badgeType: "new",
    active: false,
    color: "text-gray-400"
  },
  {
    title: "System Logs",
    icon: Activity,
    href: "/dashboard-log",
    badge: "NEW",
    badgeType: "new",
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Data Backup",
    icon: Database,
    href: "/backup",
    badge: "NEW",
    badgeType: "new",
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Analytics Overview",
    icon: BarChart3,
    href: "/overview",
    badge: "NEW",
    badgeType: "new",
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Chat",
    icon: MessageSquare,
    href: "/chat",
    badge: "3",
    badgeType: "notification",
    active: false,
    color: "text-gray-400"
  },
  {
    title: "Team",
    icon: Users,
    href: "/team",
    badge: null,
    active: false,
    color: "text-gray-400"
  }
]

const shortcuts = [
  {
    title: "Task Management",
    icon: FileText,
    href: "/tasks",
    color: "text-gray-400"
  },
  {
    title: "Advanced Reports",
    icon: BarChart3,
    href: "/reporting",
    badge: "5",
    badgeType: "notification",
    color: "text-gray-400"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-400"
  }
]

const tools = [
  {
    title: "Calendar",
    icon: Calendar,
    href: "/calendar",
    color: "text-gray-400"
  },
  {
    title: "Email Center",
    icon: Mail,
    href: "/mail",
    badge: "PRO",
    badgeType: "pro",
    color: "text-gray-400"
  },
  {
    title: "Global Search",
    icon: Search,
    href: "/search",
    badge: "PRO",
    badgeType: "pro",
    color: "text-gray-400"
  },
  {
    title: "Database Manager",
    icon: Database,
    href: "/database",
    color: "text-gray-400"
  }
]

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter()
  const { session } = useAuth()
  const { selectedServer, switchServer, isLoading } = useSelectedServer()
  const { guilds, loading } = useDiscordGuilds()
  const { isMobileSidebarOpen, closeMobileSidebar } = useMobileSidebar()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showUpgradeCard, setShowUpgradeCard] = useState(true)
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const [showUserSettings, setShowUserSettings] = useState(false)
  const [showCollapsedSwitcher, setShowCollapsedSwitcher] = useState(false)
  const [showCollapsedUserMenu, setShowCollapsedUserMenu] = useState(false)
  const accountSwitcherRef = useRef<HTMLDivElement>(null)
  const userSettingsRef = useRef<HTMLDivElement>(null)
  const showCollapsedSwitcherRef = useRef<HTMLDivElement>(null)
  const showcollapsedUserMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountSwitcherRef.current && !accountSwitcherRef.current.contains(event.target as Node)) {
        setShowAccountSwitcher(false)
      }
      if (userSettingsRef.current && !userSettingsRef.current.contains(event.target as Node)) {
        setShowUserSettings(false)
      }
      if (showCollapsedSwitcherRef.current && !showCollapsedSwitcherRef.current.contains(event.target as Node)) {
        setShowCollapsedSwitcher(false)
      }
      if (showcollapsedUserMenuRef.current && !showcollapsedUserMenuRef.current.contains(event.target as Node)) {
        setShowCollapsedUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  const [showShortcuts, setShowShortcuts] = useState(true)
  const [showTools, setShowTools] = useState(true)

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "relative flex h-screen flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-gray-800 transition-all duration-300",
          "lg:relative lg:translate-x-0", // Desktop: always visible
          "fixed inset-y-0 left-0 z-50 lg:z-auto", // Mobile: fixed positioning
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0", // Mobile: slide in/out
          isCollapsed ? "w-16" : "w-70",
          className
        )}
      >
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <div className="flex h-16 items-center justify-between px-4">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                <Home className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold text-white">Dashboard</span>
            </div>
          )}
          <Button 
             variant="ghost" 
             size="icon" 
             className="h-8 w-8 text-gray-400 hover:text-white"
             onClick={() => setIsCollapsed(!isCollapsed)}
           >
             {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
           </Button>
        </div>

        {/* Selected Server Section */}
        {!isCollapsed && (
          <div className="px-4 mb-6">
            <div className="relative" ref={accountSwitcherRef}>
               <button 
                 className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors w-full text-left"
                 onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
               >
                <div className="relative">
                  <Avatar className="h-8 w-8 rounded-[0.6rem]">
                    <AvatarImage 
                      src={selectedServer?.icon ? `https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png?size=64` : '/defaults/avatar.svg'}
                      alt={selectedServer?.name || 'Server'}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/defaults/avatar.svg';
                      }}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-yellow-500 text-white text-xs rounded-[0.6rem]">
                      {selectedServer?.name?.slice(0, 2).toUpperCase() || 'SV'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{selectedServer?.name || 'Select Server'}</p>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs mt-1">
                    {selectedServer?.owner ? 'Owner' : 'Admin'}
                  </Badge>
                </div>
                <ChevronsUpDown className="h-3 w-3 text-gray-400" />
              </button>
              
              {/* Account Switcher Dropdown for Header */}
               {showAccountSwitcher && (
                 <div className="absolute top-full left-0 mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <ScrollArea className={cn("h-[10rem] w-full")}>
                   {/* Current Server Header */}
                   <div className="p-4 py-2 border-b border-gray-800 bg-[#3d44522e]">
                     <div className="flex items-center space-x-3">
                       <div className="relative">
                         <Avatar className="h-10 w-10 rounded-[0.6rem]">
                           <AvatarImage 
                              src={selectedServer?.icon ? `https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png?size=64` : '/defaults/avatar.svg'}
                              alt={selectedServer?.name || 'Server'}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/defaults/avatar.svg';
                              }}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-yellow-500 text-white text-xs rounded-[0.6rem]">
                              {selectedServer?.name?.slice(0, 2).toUpperCase() || 'SV'}
                            </AvatarFallback>
                         </Avatar>
                       </div>
                       <div className="flex-1">
                         <p className="text-white font-medium">{selectedServer?.name || 'Select Server'}</p>
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs mt-1">
                            {selectedServer?.owner ? 'Owner' : 'Admin'}
                          </Badge>
                       </div>
                     </div>
                   </div>
                   
                   {/* Other Servers */}
                     <div>
                     {isLoading ? (
                        <div className="p-4 text-center text-gray-400">
                          <p className="text-sm">جاري التحميل...</p>
                        </div>
                      ) : guilds.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          <p className="text-sm mb-2">لا توجد سيرفرات متاحة</p>
                          <p className="text-xs text-gray-500 mb-3">تأكد من تسجيل الدخول بـ Discord</p>
                          <Button 
                            onClick={() => router.push('/auth/signin')}
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            تسجيل الدخول
                          </Button>
                        </div>
                      ) : (
                        guilds.filter(guild => guild.id !== selectedServer?.id).map((guild, index) => (
                          <button 
                            key={guild.id} 
                            onClick={() => switchServer(guild.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                           <div className="relative mr-3">
                             <Avatar className="h-10 w-10 rounded-[0.6rem]">
                               <AvatarImage 
                                 src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64` : '/defaults/avatar.svg'}
                                 alt={guild.name}
                                 onError={(e) => {
                                   const target = e.target as HTMLImageElement;
                                   target.src = '/defaults/avatar.svg';
                                 }}
                               />
                               <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs rounded-[0.6rem]">
                                 {guild.name.slice(0, 2).toUpperCase()}
                               </AvatarFallback>
                             </Avatar>
                             {guild.features.includes('VERIFIED') && (
                               <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 h-3 w-3" style={{ left: '4%', bottom: '100%', top: 'unset', transform: 'rotate(-34deg)', width: '20px', zIndex: 1 }}>
                                 {/* <AvatarCrownBlue /> */}
                               </div>
                             )}
                           </div>
                           <div className="flex-1 text-left">
                             <p className="font-medium truncate">{guild.name}</p>
                             <Badge className={`text-xs mt-1 ${
                               guild.owner 
                                 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                 : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                             }`}>
                               {guild.owner ? 'Owner' : 'Admin'}
                             </Badge>
                           </div>
                         </button>
                       ))
                     )}
                     
                     <div className="border-t border-gray-800"></div>
                     
                     </div>
                   
                </ScrollArea>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className={cn("h-full", isCollapsed ? "px-2" : "px-4")}>
          {/* Avatar in collapsed mode */}
          {isCollapsed && (
            <div className="flex justify-center mb-4 pt-2">
              <div className="relative" ref={showCollapsedSwitcherRef}>
                <button 
                  className="relative hover:opacity-80 transition-opacity cursor-pointer select-none"
                  onClick={() => setShowCollapsedSwitcher(!showCollapsedSwitcher)}
                >
                  <Avatar className="h-8 w-8 rounded-[0.6rem]">
                    <AvatarImage 
                      src={session?.user?.image || (session?.user?.discordId && session?.user?.avatar ? 
                        `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png` : 
                        '/defaults/avatar.svg')}
                      alt={session?.user?.name || "User"}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/defaults/avatar.svg';
                      }}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-yellow-500 text-white text-xs rounded-[0.6rem]">
                      {session?.user?.username?.slice(0, 2).toUpperCase() || session?.user?.name?.slice(0, 2).toUpperCase() || 'JW'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            </div>
          )}       
      
          
          <div className="space-y-1">
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-9 px-3 py-3 text-sm font-medium transition-all duration-200 relative",
                    item.active
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-gray-400",
                    isCollapsed && "justify-center px-0"
                  )}
                  onClick={() => {
                    router.push(item.href)
                    // Close mobile sidebar when item is clicked
                    if (window.innerWidth < 1024) {
                      closeMobileSidebar()
                    }
                  }}
                >
                  <div className="relative">
                    <Icon className={cn("h-4 w-4", item.color, !isCollapsed && "mr-3")} />
                     {isCollapsed && item.badge && item.badgeType !== 'pro' && (
                       <div className={cn(
                         "absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full",
                         item.badgeType === 'new' ? "bg-yellow-400" : "bg-red-500"
                       )}></div>
                     )}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        item.badgeType === 'pro' ? (
                          <Crown className="ml-2 h-4 w-4 text-yellow-400" />
                        ) : (
                          <Badge
                            variant="secondary"
                            className={`ml-2 h-5 px-2 text-xs border-0 ${
                              item.badgeType === 'new' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )
                      )}
                    </>
                  )}
                </Button>
              )
            })}
          </div>

          <Separator className="my-4 bg-gray-800" />

          {/* Shortcuts */}
          <div className="space-y-3">
            {!isCollapsed && (
              <button
                 className="flex items-center justify-between w-full px-3 py-1 mb-2 rounded-md transition-colors group"
                 onClick={() => setShowShortcuts(!showShortcuts)}
               >
                 <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider transition-colors">SHORTCUTS</h3>
                 <ChevronRight className={cn(
                   "h-3 w-3 text-gray-400 transition-all duration-200 ease-in-out",
                   showShortcuts && "rotate-90"
                 )} />
               </button>
            )}
            <div className={cn(
               "overflow-hidden transition-all duration-300 ease-in-out",
               (showShortcuts || isCollapsed) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
             )}>
               <div className="space-y-1">
                 {shortcuts.map((shortcut, index) => {
                   const Icon = shortcut.icon
                   return (
                     <Button
                       key={index}
                       variant="ghost"
                       className={cn(
                         "w-full h-9 text-sm font-medium text-gray-400 transition-all duration-200 relative",
                         isCollapsed ? "justify-center px-0" : "justify-start px-3"
                       )}
                       onClick={() => {
                         router.push(shortcut.href)
                         // Close mobile sidebar when item is clicked
                         if (window.innerWidth < 1024) {
                           closeMobileSidebar()
                         }
                       }}
                     >
                       <div className="relative">
                          <Icon className={cn("h-4 w-4 transition-colors", shortcut.color, !isCollapsed && "mr-3")} />
                           {isCollapsed && shortcut.badge && (
                             <div className={cn(
                               "absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full",
                               shortcut.badgeType === 'pro' ? "bg-yellow-400" : "bg-red-500"
                             )}></div>
                           )}
                        </div>
                       {!isCollapsed && (
                         <>
                           <span className="flex-1 text-left">{shortcut.title}</span>
                           {shortcut.badge && (
                             shortcut.badgeType === 'pro' ? (
                               <Crown className="ml-2 h-4 w-4 text-yellow-400" />
                             ) : (
                               <Badge
                                 variant="secondary"
                                 className={`ml-2 h-5 px-2 text-xs border-0 ${
                                   shortcut.badgeType === 'new' ? 'bg-yellow-500/20 text-yellow-400' :
                                   'bg-red-500/20 text-red-400'
                                 }`}
                               >
                                 {shortcut.badge}
                               </Badge>
                             )
                           )}
                         </>
                       )}
                     </Button>
                   )
                 })}
               </div>
             </div>
          </div>

          <Separator className="my-4 bg-gray-800" />

          {/* Tools */}
          <div className="space-y-3 pb-4">
            {!isCollapsed && (
              <button
                 className="flex items-center justify-between w-full px-3 py-1 mb-2 rounded-md transition-colors group"
                 onClick={() => setShowTools(!showTools)}
               >
                 <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider transition-colors">TOOLS</h3>
                 <ChevronRight className={cn(
                   "h-3 w-3 text-gray-400 transition-all duration-200 ease-in-out",
                   showTools && "rotate-90"
                 )} />
               </button>
            )}
            <div className={cn(
               "overflow-hidden transition-all duration-300 ease-in-out",
               (showTools || isCollapsed) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
             )}>
               <div className="space-y-1">
                 {tools.map((tool, index) => {
                   const Icon = tool.icon
                   return (
                     <Button
                       key={index}
                       variant="ghost"
                       className={cn(
                         "w-full h-9 text-sm font-medium text-gray-400 transition-all duration-200 relative",
                         isCollapsed ? "justify-center px-0" : "justify-start px-3"
                       )}
                       onClick={() => {
                         router.push(tool.href)
                         // Close mobile sidebar when item is clicked
                         if (window.innerWidth < 1024) {
                           closeMobileSidebar()
                         }
                       }}
                     >
                       <div className="relative">
                          <Icon className={cn("h-4 w-4 transition-colors", tool.color, !isCollapsed && "mr-3")} />
                           {isCollapsed && tool.badge && (
                             <div className={cn(
                               "absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full",
                               tool.badgeType === 'pro' ? "bg-yellow-400" : "bg-red-500"
                             )}></div>
                           )}
                        </div>
                       {!isCollapsed && (
                         <>
                           <span className="flex-1 text-left">{tool.title}</span>
                           {tool.badge && (
                             tool.badgeType === 'pro' ? (
                               <Crown className="ml-2 h-4 w-4 text-yellow-400" />
                             ) : (
                               <Badge
                                 variant="secondary"
                                 className={`ml-2 h-5 px-2 text-xs border-0 ${
                                   tool.badgeType === 'new' ? 'bg-yellow-500/20 text-yellow-400' :
                                   'bg-red-500/20 text-red-400'
                                 }`}
                               >
                                 {tool.badge}
                               </Badge>
                             )
                           )}
                         </>
                       )}
                     </Button>
                   )
                 })}
               </div>
             </div>
          </div>
        </ScrollArea>
      </div>

      {/* Collapsed User Menu Dropdown - Outside ScrollArea */}
        {isCollapsed && showCollapsedSwitcher && (
          <div className="absolute top-0 left-[calc(100%_+_1rem)] w-[13rem] top-[4rem] mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-auto">
                  <ScrollArea className={cn("h-[10rem] w-full")}>
                   {/* Current Server Header */}
                   <div className="p-4 py-2 border-b border-gray-800 bg-[#3d44522e]">
                     <div className="flex items-center space-x-3">
                       <div className="relative">
                         <Avatar className="h-10 w-10 rounded-[0.6rem]">
                           <AvatarImage 
                              src={selectedServer?.icon ? `https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png?size=64` : '/defaults/avatar.svg'}
                              alt={selectedServer?.name || 'Server'}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/defaults/avatar.svg';
                              }}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-yellow-500 text-white text-xs rounded-[0.6rem]">
                              {selectedServer?.name?.slice(0, 2).toUpperCase() || 'SV'}
                            </AvatarFallback>
                         </Avatar>
                       </div>
                       <div className="flex-1">
                         <p className="text-white font-medium">{selectedServer?.name || 'Select Server'}</p>
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs mt-1">
                            {selectedServer?.owner ? 'Owner' : 'Admin'}
                          </Badge>
                       </div>
                     </div>
                   </div>
                   
                   {/* Other Servers */}
                     <div>
                     {isLoading ? (
                       <div className="p-4 text-center text-gray-400">
                         <p className="text-sm">جاري التحميل...</p>
                       </div>
                     ) : guilds.length === 0 ? (
                       <div className="p-4 text-center text-gray-400">
                          <p className="text-sm mb-2">لا توجد سيرفرات متاحة</p>
                          <p className="text-xs text-gray-500 mb-3">تأكد من تسجيل الدخول بـ Discord</p>
                          <Button 
                            onClick={() => router.push('/auth/signin')}
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            تسجيل الدخول
                          </Button>
                        </div>
                     ) : (
                       guilds.filter(guild => guild.id !== selectedServer?.id).map((guild, index) => (
                         <button 
                           key={guild.id} 
                           onClick={() => switchServer(guild.id)}
                           className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                           <div className="relative mr-3">
                             <Avatar className="h-10 w-10 rounded-[0.6rem]">
                               <AvatarImage 
                                 src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64` : '/defaults/avatar.svg'}
                                 alt={guild.name}
                                 onError={(e) => {
                                   const target = e.target as HTMLImageElement;
                                   target.src = '/defaults/avatar.svg';
                                 }}
                               />
                               <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs rounded-[0.6rem]">
                                 {guild.name.slice(0, 2).toUpperCase()}
                               </AvatarFallback>
                             </Avatar>
                             {guild.features.includes('VERIFIED') && (
                               <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 h-3 w-3" style={{ left: '4%', bottom: '100%', top: 'unset', transform: 'rotate(-34deg)', width: '20px', zIndex: 1 }}>
                                 {/* <AvatarCrownBlue /> */}
                               </div>
                             )}
                           </div>
                           <div className="flex-1 text-left">
                             <p className="font-medium truncate">{guild.name}</p>
                             <Badge className={`text-xs mt-1 ${
                               guild.owner 
                                 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                 : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                             }`}>
                               {guild.owner ? 'Owner' : 'Admin'}
                             </Badge>
                           </div>
                         </button>
                       ))
                     )}
                     
                     <div className="border-t border-gray-800"></div>
                     
                     </div>
                   
                </ScrollArea>
                </div>
        )}

      {/* Fixed Footer */}
      <div className={cn("flex-shrink-0 border-t border-gray-800/50 space-y-4", isCollapsed ? "p-2" : "p-4")}>
        {isCollapsed ? (
          <div ref={showcollapsedUserMenuRef}>
            <div className="flex justify-center m-0">
              <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity cursor-pointer select-none" onClick={() => setShowCollapsedUserMenu(!showCollapsedUserMenu)}>
                <AvatarImage 
                  src={session?.user?.image || (session?.user?.discordId && session?.user?.avatar ? 
                    `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png` : 
                    '/defaults/avatar.svg')}
                  alt={session?.user?.name || "User"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/defaults/avatar.svg';
                  }}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-yellow-500 text-white text-xs">
                  {session?.user?.username?.slice(0, 2).toUpperCase() || session?.user?.name?.slice(0, 2).toUpperCase() || 'JW'}
                </AvatarFallback>
              </Avatar>
            </div>

            {isCollapsed && showCollapsedUserMenu && (
              <div className="absolute bottom-0 left-[calc(100%_+_1rem)] mb-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                {/* User Info Header */}
                <UserMenuDropdownHeader />
                
                {/* Menu Items */}
                <UserMenuDropdownBody />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Premium Upgrade */}
            {showUpgradeCard && (
             <div className="bg-gradient-to-br from-blue-500/10 to-yellow-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3 relative">
               <button 
                 className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded transition-colors"
                 onClick={() => setShowUpgradeCard(false)}
               >
                 <X className="h-3 w-3 text-gray-400 hover:text-white" />
               </button>
               <div className="flex items-center space-x-2">
                 <div className="relative transform h-6 w-6">
                   <AvatarCrown />
                 </div>
                 <span className="text-sm font-medium text-white">Upgrade to Pro</span>
               </div>
               <p className="text-xs text-gray-400 leading-relaxed">
                 Unlock advanced features and get unlimited access to all premium tools.
               </p>
               <Button className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium">
                 Upgrade Now
               </Button>
             </div>
            )}
            
            {/* User Profile */}
            <div className="relative" ref={userSettingsRef}>
              <button 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/30 transition-colors w-full text-left"
                onClick={() => setShowUserSettings(!showUserSettings)}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8 z-2">
                    <AvatarImage 
                      src={session?.user?.image || (session?.user?.discordId && session?.user?.avatar ? 
                        `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png` : 
                        '/defaults/avatar.svg')}
                      alt={session?.user?.name || "User"}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/defaults/avatar.svg';
                      }}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-yellow-500 text-white text-xs">
                      {session?.user?.username?.slice(0, 2).toUpperCase() || session?.user?.name?.slice(0, 2).toUpperCase() || 'JW'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 h-3 w-3 z-1" style={{ left: '4%', bottom: '100%', top: 'unset', transform: 'rotate(-34deg)', width: '24px', zIndex: 1 }}>
                     <AvatarCrown />
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-white truncate">{session?.user?.username || session?.user?.name || 'User'}</p>
                  <p className="text-xs text-gray-400">#{session?.user?.discordId?.slice(-4) || '3554'}</p>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-gray-400" />
              </button>
              
              {/* User Menu Dropdown */}
              {showUserSettings && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                  {/* User Info Header */}
                  <UserMenuDropdownHeader />
                  
                  {/* Menu Items */}
                  <UserMenuDropdownBody />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
    </>
  )
}

