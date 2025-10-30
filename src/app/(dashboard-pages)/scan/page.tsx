"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSecurityScan } from "@/hooks/useSecurityScan"
import { useSelectedServer } from "@/contexts/selected-server-context"
import { ProtectedRoute } from "@/components/protected-route"
import { useActivityTracker } from '@/components/ActivityTracker'
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Bot, 
  Crown, 
  Hash, 
  Search, 
  Filter,
  Play,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw
} from "lucide-react"

interface ScanResult {
  id: string
  name: string
  type: 'member' | 'bot' | 'role' | 'channel'
  riskLevel: 'high' | 'medium' | 'low'
  permissions: string[]
  lastActive?: string
  userId?: string
  avatar?: string
}

// Mock data has been replaced with real data from Discord API


function ScanPage() {
  const { trackScanUpdate, logActivity } = useActivityTracker()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'member' | 'bot' | 'role' | 'channel'>('all')
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  
  // Use context to get the currently selected server
  const { selectedServer } = useSelectedServer()
  
  // Use new hook to get real data
  const { 
    scanResults, 
    scanSummary,
    isScanning, 
    error, 
    startScan, 
    resetScan
  } = useSecurityScan()

  // Reset results when server changes
  useEffect(() => {
    if (selectedServer?.id) {
      resetScan()
    }
  }, [selectedServer?.id, resetScan])

  // Function to log security level to console/storage
  const logSecurityLevel = (protectionRate: number, riskLevel: string, scanData: any) => {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      protectionRate,
      riskLevel,
      totalItems: scanData.length,
      highRiskItems: scanData.filter((r: any) => r.riskLevel === 'high').length,
      mediumRiskItems: scanData.filter((r: any) => r.riskLevel === 'medium').length,
      lowRiskItems: scanData.filter((r: any) => r.riskLevel === 'low').length,
      breakdown: {
        members: scanData.filter((r: any) => r.type === 'member').length,
        bots: scanData.filter((r: any) => r.type === 'bot').length,
        roles: scanData.filter((r: any) => r.type === 'role').length,
        channels: scanData.filter((r: any) => r.type === 'channel').length
      }
    }
    
    // Log to console
    console.log('🛡️ Server Security Scan Completed:', logEntry)
    
    // Store in localStorage for persistence
    try {
      const existingLogs = JSON.parse(localStorage.getItem('securityScanLogs') || '[]')
      existingLogs.push(logEntry)
      // Keep only last 50 logs
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50)
      }
      localStorage.setItem('securityScanLogs', JSON.stringify(existingLogs))
    } catch (error) {
      console.error('Failed to save security log:', error)
    }
    
    return logEntry
  }



  // Function to calculate protection rate and log results
  const calculateAndLogResults = (results: ScanResult[]) => {
    if (results.length === 0) return
    
    // Calculate protection rate based on risk distribution
    const totalItems = results.length
    const highRiskItems = results.filter(r => r.riskLevel === 'high').length
    const mediumRiskItems = results.filter(r => r.riskLevel === 'medium').length
    const lowRiskItems = results.filter(r => r.riskLevel === 'low').length
    
    // Calculate protection rate: 100% - (weighted risk percentage)
    // High risk: -30 points, Medium risk: -15 points, Low risk: -5 points
    const riskScore = (highRiskItems * 30 + mediumRiskItems * 15 + lowRiskItems * 5)
    const maxPossibleRisk = totalItems * 30 // If all items were high risk
    const protectionRate = Math.max(0, Math.round(100 - (riskScore / maxPossibleRisk) * 100))
    
    const riskLevel = protectionRate >= 80 ? 'Excellent' : 
                     protectionRate >= 60 ? 'Good' : 
                     protectionRate >= 40 ? 'Average' : 'Needs Improvement'
    
    // Log the security level
    const logEntry = logSecurityLevel(protectionRate, riskLevel, results)
    
    return logEntry
  }

  // Calculate results when scan is complete
  useEffect(() => {
    if (!isScanning && scanResults.length > 0) {
      calculateAndLogResults(scanResults)
    }
  }, [isScanning, scanResults])

  const filteredResults = scanResults.filter(result => {
    const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || result.type === filterType
    const matchesRisk = filterRisk === 'all' || result.riskLevel === filterRisk
    return matchesSearch && matchesType && matchesRisk
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'member': return <Users className="h-4 w-4" />
      case 'bot': return <Bot className="h-4 w-4" />
      case 'role': return <Crown className="h-4 w-4" />
      case 'channel': return <Hash className="h-4 w-4" />
      default: return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'member': return 'Member'
      case 'bot': return 'Bot'
      case 'role': return 'Role'
      case 'channel': return 'Channel'
      default: return type
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return 'High'
      case 'medium': return 'Medium'
      case 'low': return 'Low'
      default: return risk
    }
  }

  const riskPercentage = scanResults.length > 0 
    ? Math.round((scanResults.filter(r => r.riskLevel === 'high').length / scanResults.length) * 100)
    : 0

  // Display message if no server is selected
  if (!selectedServer) {
    return (
      <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative space-y-6 custom-scroll">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Server Selected</h2>
            <p className="text-gray-400">Please select a server from the servers page first</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative space-y-6 custom-scroll">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-500" />
          Security Scan
        </h1>
        <p className="text-gray-400">Comprehensive scan for permissions and security risks in the server</p>
      </div>

      {error && (
        <Card className="bg-red-900/20 border-red-500/40 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="h-5 w-5" />
              <span>Error loading data: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Card className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-amber-500/40 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-full">
              <Info className="h-5 w-5 text-amber-400 flex-shrink-0" />
            </div>
            <div>
                <h3 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                  💡 Important Tip
                </h3>
                <p className="text-amber-100/90 text-sm leading-relaxed">
                  If you completely trust the people or bots that have dangerous permissions, this does not pose a risk to the server. 
                  This scan is designed to make you aware of the sensitive permissions present in your server.
                </p>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Control */}
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Scan Control
                  </CardTitle>
                  <CardDescription className="text-gray-300 mt-1">
                    Comprehensive server scan to detect security risks
                  </CardDescription>
                </div>
            </div>
            {!isScanning && scanResults.length > 0 && (
                <div className="text-right">
                  <div className="text-sm text-green-400 font-medium">✓ Completed</div>
                  <div className="text-xs text-gray-400">Last scan</div>
                </div>
              )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Server Info */}
          {selectedServer && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedServer.icon ? `https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png` : '/defaults/avatar.svg'}
                  alt={selectedServer.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-white font-medium">{selectedServer.name}</h3>
                  <p className="text-gray-400 text-sm">This server will be scanned</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Scan Button */}
          <div className="text-center">
            <Button 
              onClick={() => selectedServer?.id && startScan(selectedServer.id)} 
              disabled={isScanning || !selectedServer?.id}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-3" />
                    Start Security Scan
                  </>
                )}
            </Button>
          </div>
          
          {/* Progress Section */}
          {isScanning && (
            <div className="bg-gray-900/50 rounded-lg p-4 space-y-3 border border-gray-700">
              <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Scan Progress</span>
                  <span className="text-white font-bold text-lg">Processing...</span>
                </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 shadow-sm animate-pulse"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-300 font-medium">Analyzing server security...</p>
              </div>
            </div>
          )}
          
          {/* Quick Info */}
          {!isScanning && scanResults.length === 0 && (
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-1 rounded">
                  <Shield className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-blue-300 font-medium mb-1">What will be scanned?</h4>
                  <ul className="text-sm text-blue-100/80 space-y-1">
                    <li>• Members and dangerous permissions</li>
                    <li>• Bots and applications</li>
                    <li>• Roles and positions</li>
                    <li>• Channels and chats</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {!isScanning && scanResults.length > 0 && (
        <div className="space-y-6">
          {/* Security Score */}
          <Card className="bg-gradient-to-br from-blue-900/60 to-purple-900/60 border-blue-600 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-full hover:bg-blue-500/30 transition-colors cursor-pointer">
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Server Protection Rate</h3>
                    <p className="text-blue-200">Comprehensive security level assessment after scan</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="text-xs bg-blue-500/20 px-2 py-1 rounded text-blue-300">
                        {scanResults.length} items scanned
                      </div>
                      <div className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-300">
                        {scanResults.filter(r => r.riskLevel === 'high').length} high risks
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative group">
                    <div className="text-6xl font-black text-transparent bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text mb-2 animate-pulse group-hover:scale-110 transition-transform duration-300">
                      {(() => {
                        const totalItems = scanResults.length;
                        const highRisk = scanResults.filter(r => r.riskLevel === 'high').length;
                        const mediumRisk = scanResults.filter(r => r.riskLevel === 'medium').length;
                        const lowRisk = scanResults.filter(r => r.riskLevel === 'low').length;
                        const riskScore = (highRisk * 30) + (mediumRisk * 15) + (lowRisk * 5);
                        const maxPossibleRisk = totalItems * 30;
                        return Math.round(100 - (riskScore / maxPossibleRisk) * 100);
                      })()}%
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                      ✓ Updated
                    </div>
                    {/* Circular Progress Ring */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90 opacity-20">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-blue-300"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - (() => {
                            const totalItems = scanResults.length;
                            const highRisk = scanResults.filter(r => r.riskLevel === 'high').length;
                            const mediumRisk = scanResults.filter(r => r.riskLevel === 'medium').length;
                            const lowRisk = scanResults.filter(r => r.riskLevel === 'low').length;
                            const riskScore = (highRisk * 30) + (mediumRisk * 15) + (lowRisk * 5);
                            const maxPossibleRisk = totalItems * 30;
                            return Math.round(100 - (riskScore / maxPossibleRisk) * 100);
                          })() / 100)}`}
                          className="text-green-400 transition-all duration-1000"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${(() => {
                      const totalItems = scanResults.length;
                      const highRisk = scanResults.filter(r => r.riskLevel === 'high').length;
                      const mediumRisk = scanResults.filter(r => r.riskLevel === 'medium').length;
                      const lowRisk = scanResults.filter(r => r.riskLevel === 'low').length;
                      const riskScore = (highRisk * 30) + (mediumRisk * 15) + (lowRisk * 5);
                      const maxPossibleRisk = totalItems * 30;
                      const protectionRate = Math.round(100 - (riskScore / maxPossibleRisk) * 100);
                      return protectionRate >= 50 ? 'bg-green-400' : 'bg-red-400';
                    })()}`}></div>
                    <span className="text-sm text-blue-200 font-medium">
                      Current Protection Level
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-200 font-medium">Security Assessment</span>
                  <span className="text-sm text-white font-bold">
                    {(() => {
                      const totalItems = scanResults.length;
                      const highRisk = scanResults.filter(r => r.riskLevel === 'high').length;
                      const mediumRisk = scanResults.filter(r => r.riskLevel === 'medium').length;
                      const lowRisk = scanResults.filter(r => r.riskLevel === 'low').length;
                      const riskScore = (highRisk * 30) + (mediumRisk * 15) + (lowRisk * 5);
                      const maxPossibleRisk = totalItems * 30;
                      const protectionRate = Math.round(100 - (riskScore / maxPossibleRisk) * 100);
                      return protectionRate >= 80 ? 'Excellent 🛡️' : 
                             protectionRate >= 60 ? 'Good ✅' : 
                             protectionRate >= 40 ? 'Average ⚠️' : 'Needs Improvement ⚡';
                    })()}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner relative">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 shadow-lg relative ${(() => {
                      const totalItems = scanResults.length;
                      const highRisk = scanResults.filter(r => r.riskLevel === 'high').length;
                      const mediumRisk = scanResults.filter(r => r.riskLevel === 'medium').length;
                      const lowRisk = scanResults.filter(r => r.riskLevel === 'low').length;
                      const riskScore = (highRisk * 30) + (mediumRisk * 15) + (lowRisk * 5);
                      const maxPossibleRisk = totalItems * 30;
                      const protectionRate = Math.round(100 - (riskScore / maxPossibleRisk) * 100);
                      return protectionRate >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                             protectionRate >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                             protectionRate >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                             'bg-gradient-to-r from-red-500 to-pink-400';
                    })()}`}
                    style={{width: `${(() => {
                      const totalItems = scanResults.length;
                      const highRisk = scanResults.filter(r => r.riskLevel === 'high').length;
                      const mediumRisk = scanResults.filter(r => r.riskLevel === 'medium').length;
                      const lowRisk = scanResults.filter(r => r.riskLevel === 'low').length;
                      const riskScore = (highRisk * 30) + (mediumRisk * 15) + (lowRisk * 5);
                      const maxPossibleRisk = totalItems * 30;
                      return Math.round(100 - (riskScore / maxPossibleRisk) * 100);
                    })()}%`}}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-blue-200">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              


            </CardContent>
          </Card>
          
          {/* Risk Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">{scanResults.filter(r => r.type === 'member').length}</p>
                <p className="text-gray-400 text-sm">Members</p>
                <p className="text-xs text-red-400">{scanResults.filter(r => r.type === 'member' && r.riskLevel === 'high').length} high risk</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
              <Bot className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-white font-medium">{scanResults.filter(r => r.type === 'bot').length}</p>
                <p className="text-gray-400 text-sm">Bots</p>
                <p className="text-xs text-red-400">{scanResults.filter(r => r.type === 'bot' && r.riskLevel === 'high').length} high risk</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
              <Crown className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">{scanResults.filter(r => r.type === 'role').length}</p>
                <p className="text-gray-400 text-sm">Roles</p>
                <p className="text-xs text-red-400">{scanResults.filter(r => r.type === 'role' && r.riskLevel === 'high').length} high risk</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
              <Hash className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-white font-medium">{scanResults.filter(r => r.type === 'channel').length}</p>
                <p className="text-gray-400 text-sm">Channels</p>
                <p className="text-xs text-red-400">{scanResults.filter(r => r.type === 'channel' && r.riskLevel === 'high').length} high risk</p>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-blue-500" />
                Detailed Scan Results
              </CardTitle>
              <CardDescription className="text-gray-400">
                Detailed view of scanned items and risk levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search in results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
                <Select value={filterType} onValueChange={(value: any) => {
                  const scrollElement = document.querySelector('.overflow-y-auto');
                  const scrollTop = scrollElement?.scrollTop || 0;
                  setFilterType(value);
                  setTimeout(() => {
                    if (scrollElement) scrollElement.scrollTop = scrollTop;
                  }, 0);
                }}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue placeholder="Item Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/50 border-gray-700">
                    <SelectItem value="all" className="text-white hover:bg-gray-700">All Types</SelectItem>
                    <SelectItem value="member" className="text-white hover:bg-gray-700">Members</SelectItem>
                    <SelectItem value="bot" className="text-white hover:bg-gray-700">Bots</SelectItem>
                    <SelectItem value="role" className="text-white hover:bg-gray-700">Roles</SelectItem>
                    <SelectItem value="channel" className="text-white hover:bg-gray-700">Channels</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRisk} onValueChange={(value: any) => {
                  const scrollElement = document.querySelector('.overflow-y-auto');
                  const scrollTop = scrollElement?.scrollTop || 0;
                  setFilterRisk(value);
                  setTimeout(() => {
                    if (scrollElement) scrollElement.scrollTop = scrollTop;
                  }, 0);
                }}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/50 border-gray-700">
                    <SelectItem value="all" className="text-white hover:bg-gray-700">All Levels</SelectItem>
                    <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                    <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-900/50">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">Overview</TabsTrigger>
                  <TabsTrigger value="members" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">Members</TabsTrigger>
                  <TabsTrigger value="bots" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">Bots</TabsTrigger>
                  <TabsTrigger value="roles" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">Roles</TabsTrigger>
                  <TabsTrigger value="channels" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">Channels</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  {filteredResults.map((result) => (
                    <div key={result.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Avatar/Icon */}
                          <div className="relative">
                            {result.avatar && (result.type === 'member' || result.type === 'bot') ? (
                              <img 
                                src={result.avatar} 
                                alt={result.name}
                                className="w-12 h-12 rounded-full border-2 border-gray-600"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name)}&background=${result.type === 'bot' ? '7c3aed' : '6366f1'}&color=ffffff&size=48`
                                }}
                              />
                            ) : (
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-gray-600 ${
                                result.type === 'member' ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                                result.type === 'bot' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' :
                                result.type === 'role' ? 'bg-gradient-to-br from-green-500 to-teal-600' :
                                'bg-gradient-to-br from-orange-500 to-red-600'
                              }`}>
                                {result.type === 'bot' ? <Bot className="h-6 w-6" /> :
                                 result.type === 'role' ? <Shield className="h-6 w-6" /> :
                                 result.type === 'channel' ? <Hash className="h-6 w-6" /> :
                                 result.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {/* Risk indicator on avatar */}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                              result.riskLevel === 'high' ? 'bg-red-500' : 
                              result.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-white text-lg">{result.name}</h3>
                              <div className="text-gray-400">
                                {getTypeIcon(result.type)}
                              </div>
                            </div>
                            
                            {/* ID Display */}
                            {result.userId && (result.type === 'member' || result.type === 'bot') && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">
                                  {result.type === 'bot' ? 'Bot ID:' : 'ID:'}
                                </span>
                                <code className="text-xs bg-gray-900/50 px-2 py-1 rounded text-gray-300 font-mono border border-gray-700">
                                  {result.userId}
                                </code>
                                <button 
                                  onClick={() => navigator.clipboard.writeText(result.userId || '')}
                                  className={`text-xs transition-colors ${
                                    result.type === 'bot' ? 'text-purple-400 hover:text-purple-300' : 'text-blue-400 hover:text-blue-300'
                                  }`}
                                  title={`Copy ${result.type === 'bot' ? 'Bot' : 'User'} ID`}
                                >
                                  📋
                                </button>
                              </div>
                            )}
                            
                            <p className="text-sm text-gray-400">{getTypeLabel(result.type)} • {result.lastActive}</p>
                            
                            {/* Permissions */}
                            <div className="mt-3">
                              <p className="text-sm text-gray-400 mb-2">
                                {result.type === 'bot' ? 'Bot Permissions:' : 
                                 result.type === 'role' ? 'Role Permissions:' : 
                                 result.type === 'channel' ? 'Channel Permissions:' : 'Dangerous Permissions:'}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {result.permissions.map((permission, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className={`text-xs border-gray-700 ${
                                        ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'MANAGE_WEBHOOKS'].includes(permission)
                                          ? 'text-red-300 border-red-700 bg-red-900/20'
                                          : 'text-gray-300'
                                      }`}
                                  >
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getRiskColor(result.riskLevel)}>
                            {getRiskLabel(result.riskLevel)}
                          </Badge>
                          {result.riskLevel === 'high' && (
                            <div className="flex items-center gap-1 text-xs text-red-400">
                              <AlertTriangle className="h-3 w-3" />
                              <span>High Risk {result.type === 'bot' ? 'Bot' : result.type === 'role' ? 'Role' : result.type === 'channel' ? 'Channel' : 'User'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="members">
                  <div className="space-y-4">
                    {filteredResults.filter(r => r.type === 'member').map((result) => (
                      <div key={result.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* User Avatar */}
                            <div className="relative">
                              {result.avatar ? (
                                <img 
                                  src={result.avatar} 
                                  alt={result.name}
                                  className="w-12 h-12 rounded-full border-2 border-gray-600"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name)}&background=6366f1&color=ffffff&size=48`
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-600">
                                  {result.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              {/* Risk indicator on avatar */}
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                                result.riskLevel === 'high' ? 'bg-red-500' : 
                                result.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-white text-lg">{result.name}</h3>
                                <Users className="h-4 w-4 text-gray-400" />
                              </div>
                              
                              {/* User ID */}
                              {result.userId && (
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs text-gray-500">ID:</span>
                                  <code className="text-xs bg-gray-900/50 px-2 py-1 rounded text-gray-300 font-mono border border-gray-700">
                                    {result.userId}
                                  </code>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(result.userId || '')}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                    title="Copy User ID"
                                  >
                                    📋
                                  </button>
                                </div>
                              )}
                              
                              <p className="text-sm text-gray-400">Member • {result.lastActive}</p>
                              
                              {/* Permissions */}
                              <div className="mt-3">
                                <p className="text-sm text-gray-400 mb-2">Dangerous Permissions:</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.permissions.map((permission, index) => (
                                    <Badge 
                                      key={index} 
                                      variant="outline" 
                                      className={`text-xs border-gray-700 ${
                                          ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'MANAGE_WEBHOOKS'].includes(permission)
                                            ? 'text-red-300 border-red-700 bg-red-900/20'
                                            : 'text-gray-300'
                                        }`}
                                    >
                                      {permission}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getRiskColor(result.riskLevel)}>
                              {getRiskLabel(result.riskLevel)}
                            </Badge>
                            {result.riskLevel === 'high' && (
                              <div className="flex items-center gap-1 text-xs text-red-400">
                                <AlertTriangle className="h-3 w-3" />
                                <span>High Risk User</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="bots">
                  <div className="space-y-4">
                    {filteredResults.filter(r => r.type === 'bot').map((result) => (
                      <div key={result.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Bot Avatar */}
                            <div className="relative">
                              {result.avatar ? (
                                <img 
                                  src={result.avatar} 
                                  alt={result.name}
                                  className="w-12 h-12 rounded-full border-2 border-gray-600"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name)}&background=7c3aed&color=ffffff&size=48`
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-600">
                                  <Bot className="h-6 w-6" />
                                </div>
                              )}
                              {/* Risk indicator on avatar */}
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                                result.riskLevel === 'high' ? 'bg-red-500' : 
                                result.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-white text-lg">{result.name}</h3>
                                <Bot className="h-4 w-4 text-purple-400" />
                              </div>
                              
                              {/* Bot ID */}
                              {result.userId && (
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs text-gray-500">Bot ID:</span>
                                  <code className="text-xs bg-gray-900/50 px-2 py-1 rounded text-gray-300 font-mono border border-gray-700">
                                    {result.userId}
                                  </code>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(result.userId || '')}
                                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                    title="Copy Bot ID"
                                  >
                                    📋
                                  </button>
                                </div>
                              )}
                              
                              <p className="text-sm text-gray-400">Bot Application • {result.lastActive}</p>
                              
                              {/* Permissions */}
                              <div className="mt-3">
                                <p className="text-sm text-gray-400 mb-2">Bot Permissions:</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.permissions.map((permission, index) => (
                                    <Badge 
                                      key={index} 
                                      variant="outline" 
                                      className={`text-xs border-gray-700 ${
                                          ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'MANAGE_WEBHOOKS'].includes(permission)
                                            ? 'text-red-300 border-red-700 bg-red-900/20'
                                            : 'text-gray-300'
                                        }`}
                                    >
                                      {permission}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getRiskColor(result.riskLevel)}>
                              {getRiskLabel(result.riskLevel)}
                            </Badge>
                            {result.riskLevel === 'high' && (
                              <div className="flex items-center gap-1 text-xs text-red-400">
                                <AlertTriangle className="h-3 w-3" />
                                <span>High Risk Bot</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="roles">
                  <div className="space-y-4">
                    {filteredResults.filter(r => r.type === 'role').map((result) => (
                      <div key={result.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Role Icon */}
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-600">
                                <Shield className="h-6 w-6" />
                              </div>
                              {/* Risk indicator on icon */}
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                                result.riskLevel === 'high' ? 'bg-red-500' : 
                                result.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-white text-lg">{result.name}</h3>
                                <Crown className="h-4 w-4 text-green-400" />
                              </div>
                              
                              <p className="text-sm text-gray-400">Server Role • {result.lastActive}</p>
                              
                              {/* Permissions */}
                              <div className="mt-3">
                                <p className="text-sm text-gray-400 mb-2">Role Permissions:</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.permissions.map((permission, index) => (
                                    <Badge 
                                      key={index} 
                                      variant="outline" 
                                      className={`text-xs border-gray-700 ${
                                        ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'MANAGE_WEBHOOKS'].includes(permission)
                                          ? 'text-red-300 border-red-700 bg-red-900/20'
                                          : 'text-gray-300'
                                      }`}
                                    >
                                      {permission}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getRiskColor(result.riskLevel)}>
                              {getRiskLabel(result.riskLevel)}
                            </Badge>
                            {result.riskLevel === 'high' && (
                              <div className="flex items-center gap-1 text-xs text-red-400">
                                <AlertTriangle className="h-3 w-3" />
                                <span>High Risk Role</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="channels">
                  <div className="space-y-4">
                    {filteredResults.filter(r => r.type === 'channel').map((result) => (
                      <div key={result.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Channel Icon */}
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-600">
                                <Hash className="h-6 w-6" />
                              </div>
                              {/* Risk indicator on icon */}
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                                result.riskLevel === 'high' ? 'bg-red-500' : 
                                result.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-white text-lg">{result.name}</h3>
                                <Hash className="h-4 w-4 text-orange-400" />
                              </div>
                              
                              <p className="text-sm text-gray-400">Discord Channel • {result.lastActive}</p>
                              
                              {/* Permissions */}
                              <div className="mt-3">
                                <p className="text-sm text-gray-400 mb-2">Channel Permissions:</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.permissions.map((permission, index) => (
                                    <Badge 
                                      key={index} 
                                      variant="outline" 
                                      className={`text-xs border-gray-700 ${
                                          ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'MANAGE_WEBHOOKS'].includes(permission)
                                            ? 'text-red-300 border-red-700 bg-red-900/20'
                                            : 'text-gray-300'
                                        }`}
                                    >
                                      {permission}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getRiskColor(result.riskLevel)}>
                              {getRiskLabel(result.riskLevel)}
                            </Badge>
                            {result.riskLevel === 'high' && (
                              <div className="flex items-center gap-1 text-xs text-red-400">
                                <AlertTriangle className="h-3 w-3" />
                                <span>High Risk Channel</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!isScanning && scanResults.length === 0 && !error && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Security Risks Found</h3>
            <p className="text-gray-400">The server has been scanned and no security risks were found.</p>
          </CardContent>
        </Card>
      )}


    </div>
  )
}

// تغليف الصفحة بـ ProtectedRoute
function WrappedScanPage() {
  return (
    <ProtectedRoute>
      <ScanPage />
    </ProtectedRoute>
  )
}

export { WrappedScanPage as default }