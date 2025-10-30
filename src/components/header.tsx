"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "@/contexts/theme-context"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { useMobileSidebar } from "@/contexts/mobile-sidebar-context"
import {
  Bell,
  Crown,
  Palette,
  Sun,
  Moon,
  MessageCircle,
  Check,
  X,
  Settings,
  User,
  Mail,
  Search,
  Command,
  Zap,
  Shield,
  Activity,
  Menu
} from "lucide-react"

interface HeaderProps {
  className?: string
}

// Theme configurations
const themes = [
  {
    id: 'blue-yellow',
    name: 'Blue & Gold',
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-yellow-500 to-yellow-600',
    primaryColor: 'text-blue-400',
    secondaryColor: 'text-yellow-400',
    primaryBg: 'bg-blue-500/10',
    secondaryBg: 'bg-yellow-500/10',
    primaryBorder: 'border-blue-500/30',
    secondaryBorder: 'border-yellow-500/30'
  },
  {
    id: 'red-orange',
    name: 'Red & Orange',
    primary: 'from-red-500 to-red-600',
    secondary: 'from-orange-500 to-orange-600',
    primaryColor: 'text-red-400',
    secondaryColor: 'text-orange-400',
    primaryBg: 'bg-red-500/10',
    secondaryBg: 'bg-orange-500/10',
    primaryBorder: 'border-red-500/30',
    secondaryBorder: 'border-orange-500/30'
  },
  {
    id: 'green-emerald',
    name: 'Green & Emerald',
    primary: 'from-green-500 to-green-600',
    secondary: 'from-emerald-500 to-emerald-600',
    primaryColor: 'text-green-400',
    secondaryColor: 'text-emerald-400',
    primaryBg: 'bg-green-500/10',
    secondaryBg: 'bg-emerald-500/10',
    primaryBorder: 'border-green-500/30',
    secondaryBorder: 'border-emerald-500/30'
  },
  {
    id: 'purple-pink',
    name: 'Purple & Pink',
    primary: 'from-purple-500 to-purple-600',
    secondary: 'from-pink-500 to-pink-600',
    primaryColor: 'text-purple-400',
    secondaryColor: 'text-pink-400',
    primaryBg: 'bg-purple-500/10',
    secondaryBg: 'bg-pink-500/10',
    primaryBorder: 'border-purple-500/30',
    secondaryBorder: 'border-pink-500/30'
  },
  {
    id: 'cyan-teal',
    name: 'Cyan & Teal',
    primary: 'from-cyan-500 to-cyan-600',
    secondary: 'from-teal-500 to-teal-600',
    primaryColor: 'text-cyan-400',
    secondaryColor: 'text-teal-400',
    primaryBg: 'bg-cyan-500/10',
    secondaryBg: 'bg-teal-500/10',
    primaryBorder: 'border-cyan-500/30',
    secondaryBorder: 'border-teal-500/30'
  },
  {
    id: 'indigo-violet',
    name: 'Indigo & Violet',
    primary: 'from-indigo-500 to-indigo-600',
    secondary: 'from-violet-500 to-violet-600',
    primaryColor: 'text-indigo-400',
    secondaryColor: 'text-violet-400',
    primaryBg: 'bg-indigo-500/10',
    secondaryBg: 'bg-violet-500/10',
    primaryBorder: 'border-indigo-500/30',
    secondaryBorder: 'border-violet-500/30'
  }
];

// Sample notifications data
const notificationsData = [
  {
    id: 1,
    title: "New Message",
    message: "You have received a new message from John Doe",
    time: "2 minutes ago",
    type: "message",
    read: false
  },
  {
    id: 2,
    title: "System Update",
    message: "Your dashboard has been updated to version 2.1.0",
    time: "1 hour ago",
    type: "system",
    read: false
  },
  {
    id: 3,
    title: "Account Settings",
    message: "Please review your account security settings",
    time: "3 hours ago",
    type: "settings",
    read: true
  },
  {
    id: 4,
    title: "Welcome!",
    message: "Welcome to your new dashboard experience",
    time: "1 day ago",
    type: "welcome",
    read: true
  }
];

export function Header({ className }: HeaderProps) {
  const [notifications] = useState(notificationsData.filter(n => !n.read).length)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [showThemeDropdown, setShowThemeDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const themeDropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const { currentTheme, predefinedThemes, setTheme } = useTheme()
  const { toggleMobileSidebar } = useMobileSidebar()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setShowThemeDropdown(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    // Here you would implement actual theme switching logic
  }

  const selectTheme = (theme: typeof themes[0]) => {
    setSelectedTheme(theme)
    // Removed setShowThemeDropdown(false) to keep dropdown open for theme testing
    // Here you would implement actual theme application logic
  }

  return (
    <header className={cn(
      "h-20 border-b border-gray-800/50 bg-gray-950/95 backdrop-blur-xl sticky top-0 z-50",
      "shadow-xl shadow-black/20 border-b border-gradient-to-r from-blue-500/30 via-transparent to-yellow-500/30",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/5 before:via-transparent before:to-yellow-500/5",
      className
    )}>
      <div className="relative flex h-full items-center justify-between px-6 lg:px-8">

        {/* Left Section - Mobile Menu & Logo & Brand */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 text-gray-400 hover:text-white hover:bg-gray-800/50"
            onClick={() => toggleMobileSidebar()}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <img className="max-w-[80%]" src="/logo.svg" alt="GeniusBot logo" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Zap className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                GeniusBot
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Control Panel</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4 ml-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Activity className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs font-medium text-green-400">Online</span>
            </div>
            <div className="text-xs text-gray-400">
              <span className="text-white font-medium">1,247</span> members
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search commands, settings, or members..."
              className={cn(
                "w-full h-10 pl-10 pr-4 bg-gray-900/50 border border-gray-700/50 rounded-xl",
                "text-sm text-gray-200 placeholder-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                "transition-all duration-200 hover:border-gray-600/50"
              )}
              onFocus={() => setShowSearch(true)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-0.5 text-xs text-gray-400 bg-gray-800/50 border border-gray-600/30 rounded">
                <Command className="h-3 w-3 inline mr-1" />
                K
              </kbd>
            </div>
          </div>

          {/* Search Dropdown */}
          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3">
                <div className="text-xs text-gray-400 mb-2">Quick Actions</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
                    <Settings className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-200">Server Settings</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
                    <User className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-200">Member Management</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
                    <Shield className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-200">Moderation Tools</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Support Server Button */}
          <Button 
            variant="outline"
            size="sm"
            className={cn(
              "hidden md:flex h-9 px-4 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50",
              "transition-all duration-200"
            )}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Support
          </Button>
          
          {/* Pro Subscription Button */}
          <Button 
            className={cn(
              "hidden sm:flex h-9 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
              "text-white font-medium shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40",
              "transition-all duration-200 hover:scale-105"
            )}
            size="sm"
          >
            <Crown className="h-4 w-4 mr-2" />
            Pro
          </Button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "relative h-10 w-10 p-0 hover:bg-gray-800/50 rounded-lg",
                  "transition-all duration-200 group",
                  showNotifications && "bg-gray-800/50 ring-1 ring-blue-500/30"
                )}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className={cn(
                  "h-4 w-4 transition-colors",
                  showNotifications ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400"
                )} />
                {notifications > 0 && (
                  <>
                    <Badge 
                      className={cn(
                        "absolute -top-1 -right-1 h-5 w-5 p-0 text-xs font-bold",
                        "bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-gray-950",
                        "flex items-center justify-center shadow-lg shadow-red-500/30"
                      )}
                    >
                      {notifications}
                    </Badge>
                  </>
                )}
              </Button>

            {/* Notifications Dropdown */}
             {showNotifications && (
               <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl shadow-black/25 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                 {/* Header */}
                 <div className="p-4 border-b border-gray-700/50">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <Bell className="h-4 w-4 text-blue-400" />
                       <h3 className="text-sm font-semibold text-white">Notifications</h3>
                       {notifications > 0 && (
                         <Badge className="h-5 px-2 text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                           {notifications}
                         </Badge>
                       )}
                     </div>
                     <Button
                       variant="ghost"
                       size="sm"
                       className="h-7 w-7 p-0 hover:bg-gray-800/50 rounded-md"
                       onClick={() => setShowNotifications(false)}
                     >
                       <X className="h-3.5 w-3.5 text-gray-400" />
                     </Button>
                   </div>
                 </div>

                {/* Notifications List */}
                <div className="p-2">
                  <ScrollArea className="h-72">
                    <div className="space-y-1 px-2">
                      {notificationsData.map((notification) => {
                        const getIcon = () => {
                          switch (notification.type) {
                            case 'message': return <Mail className="h-4 w-4 text-blue-400" />;
                            case 'system': return <Settings className="h-4 w-4 text-green-400" />;
                            case 'settings': return <User className="h-4 w-4 text-yellow-400" />;
                            default: return <Bell className="h-4 w-4 text-purple-400" />;
                          }
                        };

                        return (
                          <div
                            key={notification.id}
                            className={cn(
                              "group relative p-3 rounded-lg transition-all duration-200 cursor-pointer",
                              "hover:bg-gray-800/50",
                              notification.read 
                                ? "bg-transparent" 
                                : "bg-blue-500/5 border border-blue-500/20"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getIcon()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className={cn(
                                    "text-sm font-medium truncate",
                                    notification.read ? "text-gray-300" : "text-white"
                                  )}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 ml-2" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-700/50">
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-400 hover:text-blue-400 h-8 px-3"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-400 hover:text-blue-400 h-8 px-3"
                    >
                      View all
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* Theme Color Changer */}
            <div className="relative" ref={themeDropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 hover:bg-gray-800/50 rounded-lg",
                  "transition-all duration-200 group",
                  showThemeDropdown && "bg-gray-800/50 ring-1 ring-blue-500/30"
                )}
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              >
                <Palette className={cn(
                  "h-4 w-4 transition-colors",
                  showThemeDropdown ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400"
                )} />
              </Button>

             {/* Theme Dropdown */}
               {showThemeDropdown && (
                 <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl shadow-black/25 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                   {/* Header */}
                   <div className="p-4 border-b border-gray-700/50">
                     <div className="flex items-center gap-2">
                       <Palette className="h-4 w-4 text-blue-400" />
                       <h3 className="text-sm font-semibold text-white">Color Themes</h3>
                     </div>
                   </div>
                  
                    {/* Themes Grid */}
                    <div className="p-3">
                      <div className="grid grid-cols-3 gap-2">
                        {predefinedThemes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setTheme(theme)
                              setShowThemeDropdown(false)
                            }}
                            className={cn(
                              "group relative flex flex-col items-center p-2.5 rounded-lg transition-all duration-200",
                              "hover:bg-gray-800/50",
                              currentTheme.id === theme.id 
                                ? "bg-gray-800/50 ring-1 ring-blue-500/30" 
                                : "hover:bg-gray-800/30"
                            )}
                          >
                            {/* Theme Color Preview */}
                            <div className="relative mb-2">
                              <div 
                                className="w-8 h-8 rounded-md shadow-md"
                                style={{
                                  background: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.secondary})`
                                }}
                              />
                              
                              {/* Selection Indicator */}
                              {currentTheme.id === theme.id && (
                                <div className="absolute -top-1 -right-1">
                                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Theme Name */}
                            <p className={cn(
                              "text-xs font-medium text-center",
                              currentTheme.id === theme.id ? "text-white" : "text-gray-300"
                            )}>
                              {theme.name}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  
                    {/* Advanced Settings Button */}
                    <div className="p-3 border-t border-gray-700/50">
                      <Button
                        onClick={() => {
                          setShowThemeCustomizer(true)
                          setShowThemeDropdown(false)
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Settings
                      </Button>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <div 
                          className="w-4 h-4 rounded-sm"
                          style={{
                            background: `linear-gradient(to bottom right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                          }}
                        />
                        <p className="text-xs text-gray-300">
                          Active: <span className="text-white font-medium">{currentTheme.name}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Dark/Light Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-10 p-0 hover:bg-gray-800/50 rounded-lg",
                "transition-all duration-200 group"
              )}
              onClick={toggleTheme}
            >
              {isDarkTheme ? (
                <Sun className="h-4 w-4 text-gray-400 group-hover:text-yellow-400 transition-colors" />
              ) : (
                <Moon className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Theme Customizer Modal */}
      <ThemeCustomizer 
        isOpen={showThemeCustomizer} 
        onClose={() => setShowThemeCustomizer(false)} 
      />
    </header>
  )
}