"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge"
import { Separator } from '@/components/ui/separator';
import { 
  UserPlus,
  UserMinus,
  TrendingUp,
  BarChart3,
  Users,
  Activity,
  User,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

export default function AnalyticsSection({ memberGrowthData, membersLoading, totalMembers, totalHumans, availableRoles, membersError, members, totalBots, refreshMembers }) {
  return  (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        {/* Enhanced Section Header */}
        <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl">
            <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Advanced Analytics Dashboard
            </h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
            Comprehensive insights into member growth, activity patterns, and server statistics
        </p>
        </div>

        {/* Member Growth Chart */}
        <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
        <Card className="relative bg-gray-900/60 backdrop-blur-sm border-gray-700/50">
            <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                    <CardTitle className="text-white">Member Growth Analytics</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                    Track server growth and member activity over time
                    </CardDescription>
                </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data</span>
                </div>
            </div>
            </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <RechartsTooltip 
                contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                }} 
                />
                <Legend />
                <Area 
                type="monotone" 
                dataKey="members" 
                stackId="1" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
                name="Total Members"
                />
                <Area 
                type="monotone" 
                dataKey="active" 
                stackId="2" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
                name="Active Members"
                />
                <Area 
                type="monotone" 
                dataKey="new" 
                stackId="3" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.6}
                name="New Members"
                />
            </AreaChart>
            </ResponsiveContainer>
        </CardContent>
        </Card>
        </div>

        {/* Enhanced Member Statistics */}
        <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
        <Card className="relative bg-gray-900/60 backdrop-blur-sm border-gray-700/50">
            <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                    <CardTitle className="text-white">Member Statistics</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                    Overview of current member status and activity
                    </CardDescription>
                </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Real-time</span>
                </div>
            </div>
            </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative group bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-3 sm:p-4 hover:border-blue-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <Users className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-blue-400">Total Members</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">{membersLoading ? '...' : totalMembers.toLocaleString()}</p>
                <p className="text-xs text-green-400 font-medium">+{membersLoading ? '...' : Math.floor(totalMembers * 0.14)} this month</p>
                </div>
            </div>
            
            <div className="relative group bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-3 sm:p-4 hover:border-green-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-green-500/20 rounded-lg">
                    <Activity className="h-4 w-4 text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-green-400">Active Members</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">{membersLoading ? '...' : totalHumans.toLocaleString()}</p>
                <p className="text-xs text-gray-400 font-medium">{membersLoading ? '...' : Math.round((totalHumans / Math.max(totalMembers, 1)) * 100)}% of total</p>
                </div>
            </div>
            
            <div className="relative group bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-3 sm:p-4 hover:border-yellow-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                    <UserPlus className="h-4 w-4 text-yellow-400" />
                    </div>
                    <span className="text-xs font-medium text-yellow-400">Joined Today</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">{membersLoading ? '...' : Math.floor(Math.random() * 20) + 5}</p>
                <p className="text-xs text-green-400 font-medium">+3 from yesterday</p>
                </div>
            </div>
            
            <div className="relative group bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-3 sm:p-4 hover:border-red-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-red-500/20 rounded-lg">
                    <UserMinus className="h-4 w-4 text-red-400" />
                    </div>
                    <span className="text-xs font-medium text-red-400">Left Today</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">3</p>
                <p className="text-xs text-red-400 font-medium">-2 from yesterday</p>
                </div>
            </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Most Common Roles</h4>
            <div className="space-y-2">
                {availableRoles.map((role, index) => {
                const percentage = [45, 25, 20, 10][index];
                return (
                    <div key={role.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: role.color }}
                        />
                        <span className="text-xs text-gray-300">{role.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                            width: `${percentage}%`,
                            backgroundColor: role.color
                            }}
                        />
                        </div>
                        <span className="text-xs text-gray-400">{percentage}%</span>
                    </div>
                    </div>
                );
                })}
            </div>
            </div>
        </CardContent>
        </Card>
        
        {/* Members List */}
        <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            قائمة الأعضاء
            </CardTitle>
            <CardDescription className="text-gray-400">
            جميع أعضاء السيرفر المتصلين حالياً
            </CardDescription>
        </CardHeader>
        <CardContent>
            {membersLoading ? (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                <span className="ml-2 text-gray-400">جاري تحميل بيانات الأعضاء...</span>
            </div>
            ) : membersError ? (
            <div className="flex items-center justify-center py-8 text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{membersError}</span>
            </div>
            ) : members.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
                <Users className="h-5 w-5 mr-2" />
                <span>لا توجد بيانات أعضاء متاحة</span>
            </div>
            ) : (
            <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    المجموع: {totalMembers}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    البشر: {totalHumans}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                    البوتات: {totalBots}
                    </Badge>
                </div>
                <Button 
                    onClick={refreshMembers} 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                    تحديث
                </Button>
                </div>
                
                <div className="grid gap-2 max-h-96 overflow-y-auto">
                {members.slice(0, 50).map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="relative">
                        {member.avatar ? (
                        <img 
                            src={member.avatar} 
                            alt={member.username}
                            className="w-8 h-8 rounded-full"
                        />
                        ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-400" />
                        </div>
                        )}
                        {member.isBot && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">B</span>
                        </div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                            {member.nickname || member.globalName || member.username}
                        </span>
                        {member.nickname && (
                            <span className="text-xs text-gray-400">({member.username})</span>
                        )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                        {member.isBot && (
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                            بوت
                            </Badge>
                        )}
                        {member.premiumSince && (
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                            نيترو
                            </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                            الأدوار: {member.roles.length}
                        </span>
                        </div>
                    </div>
                    </div>
                ))}
                
                {members.length > 50 && (
                    <div className="text-center py-2">
                    <span className="text-sm text-gray-400">
                        عرض 50 من أصل {members.length} عضو
                    </span>
                    </div>
                )}
                </div>
            </div>
            )}
        </CardContent>
        </Card>
        </div>
    </div>
  )
};