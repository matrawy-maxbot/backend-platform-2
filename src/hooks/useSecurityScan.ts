'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useActivityTracker } from '@/components/ActivityTracker'

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

interface ScanSummary {
  totalItems: number
  highRisk: number
  mediumRisk: number
  lowRisk: number
  breakdown: {
    members: number
    bots: number
    roles: number
    channels: number
  }
}

interface SecurityScanResponse {
  results: ScanResult[]
  summary: ScanSummary
}

interface UseSecurityScanReturn {
  scanResults: ScanResult[]
  scanSummary: ScanSummary | null
  isScanning: boolean
  error: string | null
  startScan: (serverId: string) => Promise<void>
  resetScan: () => void
}

export function useSecurityScan(): UseSecurityScanReturn {
  const { session } = useAuth()
  const { trackScanUpdate } = useActivityTracker()
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [scanSummary, setScanSummary] = useState<ScanSummary | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startScan = useCallback(async (serverId: string) => {
    if (!session?.accessToken) {
      setError('يجب تسجيل الدخول أولاً')
      return
    }

    setIsScanning(true)
    setError(null)
    setScanResults([])
    setScanSummary(null)

    try {
      const response = await fetch(`/api/discord/${serverId}/scan`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'فشل في تنفيذ الفحص الأمني')
      }

      const data: SecurityScanResponse = await response.json()
      setScanResults(data.results)
      setScanSummary(data.summary)
      trackScanUpdate(`تم إجراء فحص أمني للخادم - تم العثور على ${data.results.length} عنصر`)
    } catch (err) {
      console.error('خطأ في الفحص الأمني:', err)
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setIsScanning(false)
    }
  }, [session])

  const resetScan = useCallback(() => {
    setScanResults([])
    setScanSummary(null)
    setError(null)
    setIsScanning(false)
  }, [])

  return {
    scanResults,
    scanSummary,
    isScanning,
    error,
    startScan,
    resetScan
  }
}

// Hook للإحصائيات
export function useScanStatistics(results: ScanResult[]) {
  const totalItems = results.length
  const highRiskItems = results.filter(r => r.riskLevel === 'high').length
  const mediumRiskItems = results.filter(r => r.riskLevel === 'medium').length
  const lowRiskItems = results.filter(r => r.riskLevel === 'low').length
  
  const riskPercentage = totalItems > 0 ? Math.round((highRiskItems / totalItems) * 100) : 0
  const protectionRate = 100 - riskPercentage
  
  const mostCommonPermissions = getMostCommonPermissions(results)
  const overallRiskScore = calculateRiskScore(results)
  
  return {
    totalItems,
    highRiskItems,
    mediumRiskItems,
    lowRiskItems,
    riskPercentage,
    protectionRate,
    mostCommonPermissions,
    overallRiskScore
  }
}

// دالة مساعدة لحساب أكثر الصلاحيات شيوعاً
function getMostCommonPermissions(results: ScanResult[]): Array<{ permission: string; count: number }> {
  const permissionCounts: { [key: string]: number } = {}
  
  results.forEach(result => {
    result.permissions.forEach(permission => {
      permissionCounts[permission] = (permissionCounts[permission] || 0) + 1
    })
  })
  
  return Object.entries(permissionCounts)
    .map(([permission, count]) => ({ permission, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

// دالة مساعدة لحساب نقاط المخاطر الإجمالية
function calculateRiskScore(results: ScanResult[]): number {
  const weights = { high: 3, medium: 2, low: 1 }
  const totalScore = results.reduce((sum, result) => sum + weights[result.riskLevel], 0)
  const maxPossibleScore = results.length * 3
  return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0
}

// Hook للفلترة والبحث
export function useFilteredScanResults(results: ScanResult[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')

  const filteredResults = results.filter(result => {
    const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || result.type === typeFilter
    const matchesRisk = riskFilter === 'all' || result.riskLevel === riskFilter
    
    return matchesSearch && matchesType && matchesRisk
  })

  return {
    filteredResults,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    riskFilter,
    setRiskFilter
  }
}