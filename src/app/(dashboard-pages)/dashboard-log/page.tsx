"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useActivityLogs, useActivityMonitor } from "@/hooks/useActivityLogs"
import { useSelectedServer } from "@/contexts/selected-server-context"
import {
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Shield,
  Settings,
  Users,
  MessageSquare,
  Megaphone,
  Bot,
  Crown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  RefreshCw,
  Loader2,
  Eye,
  FileText,
  Plus,
  ArrowUp,
  Star,
  X,
  Trash2,
  Edit,
  MoreHorizontal,
  Tag,
  Copy,
  Globe
} from "lucide-react"

// Icon mapping for different sections
const sectionIcons = {
  "Ads": Megaphone,
  "Protection": Shield,
  "Admins": Crown,
  "Members": Users,
  "Auto Reply": Bot,
  "System": Settings,
  "default": Activity
}

const activityTypes = [
  { value: "all", label: "جميع الأنشطة" },
  { value: "create", label: "إنشاء" },
  { value: "update", label: "تحديث" },
  { value: "delete", label: "حذف" },
  { value: "login", label: "تسجيل دخول" },
  { value: "logout", label: "تسجيل خروج" }
]

const sections = [
  { value: "all", label: "جميع الأقسام" },
  { value: "Ads", label: "الإعلانات" },
  { value: "Protection", label: "الحماية" },
  { value: "Admins", label: "المشرفين" },
  { value: "Members", label: "الأعضاء" },
  { value: "Auto Reply", label: "الرد التلقائي" },
  { value: "System", label: "النظام" }
]

// Add custom styles for animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

export default function DashboardLogPage() {
  const { selectedServer } = useSelectedServer()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSection, setSelectedSection] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [showFAB, setShowFAB] = useState(false)
  const [fabExpanded, setFabExpanded] = useState(false)

  const {
    activities,
    stats,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    filters,
    updateFilters,
    clearFilters,
    generateSampleData,
    exportLogs,
    clearLogs
  } = useActivityLogs({
    serverId: selectedServer?.id || null, // Allow null to fetch all activities
    autoRefresh: true,
    refreshInterval: 30000,
    limit: 50 // Show more logs per page
  })

  const { activityCount: newActivitiesCount, clearActivityCount } = useActivityMonitor(selectedServer?.id)



  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Note: Filtering is now handled locally with useMemo



  // Apply local filters to activities
  const filteredActivities = useMemo(() => {
    let filtered = activities || []
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(activity => 
        activity.user.toLowerCase().includes(searchLower) ||
        activity.action.toLowerCase().includes(searchLower) ||
        activity.details.toLowerCase().includes(searchLower) ||
        activity.section.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedType)
    }
    
    // Apply section filter
    if (selectedSection !== 'all') {
      filtered = filtered.filter(activity => activity.section === selectedSection)
    }
    
    // Apply date filter
    if (selectedDate) {
      const filterDate = new Date(selectedDate)
      const nextDay = new Date(filterDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp)
        return activityDate >= filterDate && activityDate < nextDay
      })
    }
    
    return filtered
  }, [activities, searchTerm, selectedType, selectedSection, selectedDate])

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show/hide FAB based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowFAB(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedType("all")
    setSelectedSection("all")
    setSelectedDate("")
    clearFilters()
  }

  // Get active filters count
  const activeFiltersCount = [
    searchTerm,
    selectedType !== "all" ? selectedType : null,
    selectedSection !== "all" ? selectedSection : null,
    selectedDate
  ].filter(Boolean).length

  return (
    <>
      {/* Global CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#1a1d29] via-[#1e2139] to-[#252841] p-6 animate-fadeInUp">
        {/* Header Section */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#1a1d29]/95 via-[#1e2139]/95 to-[#252841]/95 backdrop-blur-md border-b border-[#2d3142] p-4 mb-8 rounded-lg animate-slideInRight">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                سجل الأنشطة
              </h1>
              <p className="text-gray-400 mt-1">
                تتبع جميع الأنشطة والأحداث في الخادم
              </p>
            </div>
            
            {/* Real-time indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">مباشر</span>
              </div>
              {newActivitiesCount > 0 && (
                <Badge 
                  className="bg-red-500 text-white animate-bounce-in cursor-pointer hover:bg-red-600 transition-colors"
                  onClick={clearActivityCount}
                  title="انقر لإخفاء العداد"
                >
                  {newActivitiesCount} جديد
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Server Status Warning */}
        {!selectedServer && (
          <div className="mb-6 animate-bounce-in">
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-600/10 border border-yellow-500/20 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 text-sm font-medium">تحذير: لا يوجد خادم محدد</p>
                  <p className="text-gray-400 text-xs mt-1">يتم عرض جميع الأنشطة من كافة الخوادم. قد يكون هذا بسبب مشكلة في المصادقة.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 animate-bounce-in">
            <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-400 text-sm">خطأ في تحميل الأنشطة: {error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group bg-gradient-to-br from-[#25293e]/80 to-[#2d3142]/60 border-[#3d4152] backdrop-blur-sm hover:from-blue-500/10 hover:to-blue-600/10 transition-all duration-300 animate-bounce-in hover:animate-shimmer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 group-hover:text-blue-300 transition-colors">إجمالي الأنشطة</p>
                  <p className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{stats.total}</p>
                </div>
                <div className="h-14 w-14 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300 group-hover:animate-pulse-glow">
                  <Activity className="h-7 w-7 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-[#25293e]/80 to-[#2d3142]/60 border-[#3d4152] backdrop-blur-sm hover:from-green-500/10 hover:to-green-600/10 transition-all duration-300 animate-bounce-in hover:animate-shimmer" style={{animationDelay: '0.1s'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 group-hover:text-green-300 transition-colors">أنشطة اليوم</p>
                  <p className="text-3xl font-bold text-green-500 group-hover:text-green-400 transition-colors">{stats.today}</p>
                </div>
                <div className="h-14 w-14 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-300 group-hover:animate-pulse-glow">
                  <Clock className="h-7 w-7 text-green-500 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-[#25293e]/80 to-[#2d3142]/60 border-[#3d4152] backdrop-blur-sm hover:from-purple-500/10 hover:to-purple-600/10 transition-all duration-300 animate-bounce-in hover:animate-shimmer" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors">أنشطة النظام</p>
                  <p className="text-3xl font-bold text-purple-500 group-hover:text-purple-400 transition-colors">{stats.system}</p>
                </div>
                <div className="h-14 w-14 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300 group-hover:animate-pulse-glow">
                  <Settings className="h-7 w-7 text-purple-500 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-[#25293e]/80 to-[#2d3142]/60 border-[#3d4152] backdrop-blur-sm hover:from-orange-500/10 hover:to-orange-600/10 transition-all duration-300 animate-bounce-in hover:animate-shimmer" style={{animationDelay: '0.3s'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 group-hover:text-orange-300 transition-colors">أنشطة المستخدمين</p>
                  <p className="text-3xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">{stats.user}</p>
                </div>
                <div className="h-14 w-14 bg-orange-500/20 rounded-full flex items-center justify-center group-hover:bg-orange-500/30 transition-all duration-300 group-hover:animate-pulse-glow">
                  <Users className="h-7 w-7 text-orange-500 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 bg-gradient-to-br from-[#25293e]/80 to-[#2d3142]/60 border-[#3d4152] backdrop-blur-sm animate-slideInRight">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-500" />
                  تصفية الأنشطة
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  استخدم المرشحات أدناه للعثور على أنشطة محددة
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={generateSampleData}
                  variant="outline"
                  size="sm"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
                >
                  <Star className="h-4 w-4 mr-2" />
                  إضافة بيانات تجريبية
                </Button>
                
                <Button
                  onClick={exportLogs}
                  variant="outline"
                  size="sm"
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  تصدير السجل
                </Button>

                {activeFiltersCount > 0 && (
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    مسح الكل ({activeFiltersCount})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Enhanced Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="البحث في الأنشطة (المستخدم، الإجراء، التفاصيل، القسم)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-[#1a1d29]/50 border-[#3d4152] text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-300 rounded-lg text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Activity Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">نوع النشاط</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-[#1a1d29]/50 border-[#3d4152] text-white hover:bg-[#1a1d29]/70 transition-colors focus:border-blue-500/50 focus:ring-blue-500/20">
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1d29] border-[#3d4152]">
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-[#25293e]">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              type.value === 'all' ? 'bg-gray-400' :
                              type.value === 'create' ? 'bg-green-400' :
                              type.value === 'update' ? 'bg-blue-400' :
                              type.value === 'delete' ? 'bg-red-400' :
                              type.value === 'login' ? 'bg-purple-400' :
                              type.value === 'logout' ? 'bg-orange-400' : 'bg-gray-400'
                            }`}></div>
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Section Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">القسم</label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="bg-[#1a1d29]/50 border-[#3d4152] text-white hover:bg-[#1a1d29]/70 transition-colors focus:border-blue-500/50 focus:ring-blue-500/20">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1d29] border-[#3d4152]">
                      {sections.map((section) => (
                        <SelectItem key={section.value} value={section.value} className="text-white hover:bg-[#25293e]">
                          {section.value === 'all' ? section.label :
                           section.value === 'Ads' ? '📢 ' + section.label :
                           section.value === 'Protection' ? '🛡️ ' + section.label :
                           section.value === 'Admins' ? '👑 ' + section.label :
                           section.value === 'Members' ? '👥 ' + section.label :
                           section.value === 'Auto Reply' ? '🤖 ' + section.label :
                           section.value === 'System' ? '⚙️ ' + section.label :
                           section.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">التاريخ</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-10 bg-[#1a1d29]/50 border-[#3d4152] text-white hover:bg-[#1a1d29]/70 transition-colors focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">إجراءات سريعة</label>
                  <div className="flex gap-2">
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-[#1a1d29]/50 border-[#3d4152] text-gray-300 hover:bg-[#25293e] hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      مسح
                    </Button>
                    <Button
                      onClick={refresh}
                      variant="outline"
                      size="sm"
                      className="bg-[#1a1d29]/50 border-[#3d4152] text-gray-300 hover:bg-[#25293e] hover:text-white transition-colors"
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#3d4152]">
                <span className="text-sm text-gray-400 mr-2">المرشحات النشطة:</span>
                
                {searchTerm && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 flex items-center gap-1">
                    البحث: {searchTerm}
                    <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-blue-100">
                      <XCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {selectedType !== "all" && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 flex items-center gap-1">
                    النوع: {activityTypes.find(t => t.value === selectedType)?.label}
                    <button onClick={() => setSelectedType("all")} className="ml-1 hover:text-green-100">
                      <XCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {selectedSection !== "all" && (
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1">
                    القسم: {sections.find(s => s.value === selectedSection)?.label}
                    <button onClick={() => setSelectedSection("all")} className="ml-1 hover:text-purple-100">
                      <XCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {selectedDate && (
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30 flex items-center gap-1">
                    التاريخ: {selectedDate}
                    <button onClick={() => setSelectedDate("")} className="ml-1 hover:text-orange-100">
                      <XCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card className="bg-gradient-to-br from-[#25293e]/80 to-[#2d3142]/60 border-[#3d4152] backdrop-blur-sm animate-fadeInUp">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl text-white">قائمة الأنشطة</CardTitle>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-sm">تحديث مباشر</span>
                </div>
              </div>
              
              <Button
                onClick={refresh}
                variant="outline"
                size="sm"
                className="border-[#3d4152] text-white hover:bg-[#3d4152] transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                تحديث
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading && (!activities || activities.length === 0) ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-blue-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-lg">جاري تحميل الأنشطة...</span>
                </div>
              </div>
            ) : (
              <>
            {/* Results Summary */}
            {filteredActivities.length > 0 && (
              <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                <span>عرض {filteredActivities.length} نشاط</span>
                {(searchTerm || selectedType !== 'all' || selectedSection !== 'all' || selectedDate) && (
                  <span>من أصل {activities?.length || 0} نشاط</span>
                )}
              </div>
            )}

              <div className="space-y-4">
                {filteredActivities.map((activity, index) => {
                  const SectionIcon = sectionIcons[activity.section as keyof typeof sectionIcons] || sectionIcons.default
                  
                  return (
                    <div
                      key={activity.id}
                      className="group relative p-4 bg-gradient-to-r from-[#1a1d29]/50 to-[#25293e]/30 border border-[#3d4152] rounded-lg hover:from-[#25293e]/60 hover:to-[#2d3142]/50 hover:border-blue-500/30 transition-all duration-300 animate-slideInRight"
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
                      {/* Quick Actions (visible on hover) */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-400"
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-green-500/20 hover:text-green-400"
                          title="نسخ المعرف"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-purple-500/20 hover:text-purple-400"
                          title="المزيد من الخيارات"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-start gap-4">
                        {/* Activity Icon */}
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30 group-hover:border-blue-500/50 transition-all duration-300">
                          <SectionIcon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                        </div>
                        
                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-white font-medium group-hover:text-blue-300 transition-colors">
                                {activity.action}
                              </h3>
                              <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors">
                                {activity.details}
                              </p>
                              
                              {/* Activity Metadata */}
                              <div className="flex flex-wrap items-center gap-4 mt-3">
                                <Badge 
                                  variant="secondary" 
                                  className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"
                                >
                                  {activity.section}
                                </Badge>
                                
                                <Badge 
                                  variant="outline" 
                                  className="border-gray-600 text-gray-400 text-xs"
                                >
                                  {activity.type}
                                </Badge>
                                
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimestamp(activity.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* User Information */}
                          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#3d4152]">
                            {activity.avatar ? (
                              <Avatar className="h-8 w-8 border-2 border-gray-600 group-hover:border-blue-500/50 transition-all duration-300">
                                <AvatarImage src={activity.avatar} alt={typeof activity.user === 'string' ? activity.user : 'مستخدم'} />
                                <AvatarFallback className="text-sm bg-gray-700 text-gray-300">
                                  {typeof activity.user === 'string' ? activity.user.charAt(0) : 'U'}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center border-2 border-gray-600 group-hover:border-blue-500/50 transition-all duration-300">
                                <User className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="font-medium group-hover:text-gray-300 transition-colors">{typeof activity.user === 'string' ? activity.user : 'مستخدم غير معروف'}</span>
                              <span>•</span>
                              <span>المعرف: {typeof activity.userId === 'string' ? activity.userId : 'غير متوفر'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center pt-6">
                    <Button 
                      onClick={loadMore}
                      variant="outline"
                      className="border-[#3d4152] text-white hover:bg-[#3d4152] hover:border-blue-500/50 transition-all duration-300 px-8 py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      تحميل المزيد من الأنشطة
                    </Button>
                  </div>
                )}
                
                {/* Enhanced No Activities Found */}
                {filteredActivities.length === 0 && !loading && (
                  <div className="text-center py-20 animate-bounce-in">
                    <div className="relative mx-auto w-32 h-32 mb-8">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                      <div className="absolute inset-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <Activity className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-200 mb-3">لم يتم العثور على أنشطة</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                      {(!activities || activities.length === 0)
                        ? "لم يتم تسجيل أي أنشطة بعد. ابدأ باستخدام الداشبورد لرؤية الأنشطة هنا." 
                        : "لا توجد أنشطة تطابق معايير البحث الحالية. جرب تعديل الفلاتر أو البحث بكلمات مختلفة."
                      }
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      {(!activities || activities.length === 0) && (
                        <Button
                          onClick={generateSampleData}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                        >
                          <Star className="h-5 w-5 mr-2" />
                          إنشاء بيانات تجريبية
                        </Button>
                      )}
                      
                      {(searchTerm || selectedType !== 'all' || selectedSection !== 'all' || selectedDate) && (
                        <Button
                          onClick={clearAllFilters}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                        >
                          <X className="h-5 w-5 mr-2" />
                          مسح جميع الفلاتر
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Floating Action Button */}
        {showFAB && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="relative">
              {/* FAB Menu Items */}
              {fabExpanded && (
                <div className="absolute bottom-16 right-0 flex flex-col gap-3 animate-bounce-in">
                  <Button
                    onClick={refresh}
                    size="sm"
                    className="bg-blue-500/90 hover:bg-blue-500 text-white shadow-lg backdrop-blur-sm border border-blue-400/30 transition-all duration-300 hover:scale-105"
                    title="تحديث"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    تحديث
                  </Button>
                  
                  <Button
                    onClick={generateSampleData}
                    size="sm"
                    className="bg-green-500/90 hover:bg-green-500 text-white shadow-lg backdrop-blur-sm border border-green-400/30 transition-all duration-300 hover:scale-105"
                    title="بيانات تجريبية"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    بيانات تجريبية
                  </Button>
                  
                  <Button
                    onClick={exportLogs}
                    size="sm"
                    className="bg-purple-500/90 hover:bg-purple-500 text-white shadow-lg backdrop-blur-sm border border-purple-400/30 transition-all duration-300 hover:scale-105"
                    title="تصدير"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    تصدير
                  </Button>
                  
                  <Button
                    onClick={clearAllFilters}
                    size="sm"
                    className="bg-red-500/90 hover:bg-red-500 text-white shadow-lg backdrop-blur-sm border border-red-400/30 transition-all duration-300 hover:scale-105"
                    title="مسح المرشحات"
                  >
                    <X className="h-4 w-4 mr-2" />
                    مسح المرشحات
                  </Button>
                </div>
              )}
              
              {/* Main FAB */}
              <Button
                onClick={() => fabExpanded ? setFabExpanded(false) : scrollToTop()}
                onMouseEnter={() => setFabExpanded(true)}
                onMouseLeave={() => setFabExpanded(false)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl border border-blue-400/30 transition-all duration-300 hover:scale-110 animate-float"
              >
                {fabExpanded ? (
                  <Plus className="h-6 w-6 rotate-45 transition-transform duration-300" />
                ) : (
                  <ArrowUp className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}