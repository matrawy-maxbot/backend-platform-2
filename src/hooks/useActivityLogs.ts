import { useState, useEffect, useCallback } from 'react'
import { getActivityStats, logActivity } from '@/lib/activity-logger'

export interface ActivityLog {
  id: string
  timestamp: string
  user: string
  userId: string
  avatar?: string
  action: string
  section: string
  details: string
  type: 'create' | 'update' | 'delete' | 'system' | 'error'
  severity: 'info' | 'success' | 'warning' | 'error'
  serverId?: string
  metadata?: Record<string, any>
}

export interface ActivityStats {
  total: number
  today: number
  errors: number
  system: number
  user: number
}

export interface UseActivityLogsOptions {
  serverId?: string
  type?: string
  section?: string
  limit?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useActivityLogs(options: UseActivityLogsOptions = {}) {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [stats, setStats] = useState<ActivityStats>({ total: 0, today: 0, errors: 0, system: 0, user: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFilters] = useState<{
    search?: string
    type?: string
    section?: string
    date?: string
  }>({})

  const {
    serverId,
    type = 'all',
    section = 'all',
    limit = 100,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options

  console.log('🔍 HOOK: useActivityLogs called with serverId:', serverId)

  const fetchLogs = useCallback(async (offset = 0, append = false) => {
    console.log('🔍 HOOK: fetchLogs called with serverId:', serverId, 'offset:', offset, 'append:', append)
    try {
      if (!append) setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      })

      if (serverId && typeof serverId === 'string') {
        params.append('serverId', serverId)
      }
      if (type !== 'all') params.append('type', type)
      if (section !== 'all') params.append('section', section)
      
      // Note: Local filtering is now handled in the component

      console.log('🔍 HOOK: Making request to:', `/api/logs?${params.toString()}`)
      const response = await fetch(`/api/logs?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('🔍 HOOK: Received', data.logs?.length, 'logs from API')
      
      if (append) {
        console.log('🔍 HOOK: APPEND mode - received', data.logs.length, 'logs')
        setLogs(prev => {
          console.log('🔍 HOOK: APPEND - prev count:', prev.length, 'adding:', data.logs.length)
          return [...prev, ...data.logs]
        })
      } else {
        console.log('🔍 HOOK: REPLACE mode - received', data.logs.length, 'logs, first log:', data.logs[0]?.action || 'none')
        console.log('🔍 HOOK: REPLACE - setting logs to:', data.logs.length, 'items')
        setLogs(data.logs)
      }
      
      setHasMore(data.hasMore)
      if (data.stats) {
        setStats(data.stats)
      }
      
      console.log('🔍 HOOK: fetchLogs completed successfully')
    } catch (err) {
      console.error('🔍 HOOK ERROR: Error fetching logs:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [serverId, type, section, limit, filters])

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getActivityStats(serverId)
      setStats(statsData)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }, [serverId])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      // Use a ref or state to track current length without causing re-renders
      setLogs(currentLogs => {
        fetchLogs(currentLogs.length, true)
        return currentLogs // Don't change the logs here, fetchLogs will handle it
      })
    }
  }, [fetchLogs, loading, hasMore])

  const refresh = useCallback(() => {
    fetchLogs()
    fetchStats()
  }, [fetchLogs, fetchStats])



  // Note: Filtering is now handled locally in components

  // Initial load
  useEffect(() => {
    console.log('🔍 EFFECT: useEffect triggered with serverId:', serverId)
    console.log('🔍 EFFECT: Current logs count:', logs.length)
    fetchLogs()
    fetchStats()
  }, [fetchLogs, fetchStats, serverId])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refresh()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refresh])

  // Generate sample data for testing
  const generateSampleData = useCallback(async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/logs/sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverId: serverId
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate sample data')
      }
      
      const result = await response.json()
      
      // Refresh the logs list
      await fetchLogs()
      
      // Update stats
      await fetchStats()
      
      // Log this important activity
      await logActivity({
        user: 'Admin',
        userId: 'admin',
        action: 'إنشاء بيانات تجريبية',
        section: 'System',
        details: 'تم إنشاء بيانات تجريبية لسجل الأنشطة',
        type: 'create',
        severity: 'info',
        serverId: serverId || undefined
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate sample data')
    } finally {
      setLoading(false)
    }
  }, [serverId, fetchLogs, fetchStats])

  // Export logs to CSV or JSON
  const exportLogs = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    try {
      const params = new URLSearchParams()
      if (serverId && typeof serverId === 'string') params.append('serverId', serverId)
      if (type !== 'all') params.append('type', type)
      if (section !== 'all') params.append('section', section)
      params.append('format', format)

      const response = await fetch(`/api/logs/export?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to export logs')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      const extension = format === 'csv' ? 'csv' : 'json'
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.${extension}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Log this important activity
      await logActivity({
        user: 'Admin',
        userId: 'admin',
        action: 'تصدير سجل الأنشطة',
        section: 'System',
        details: `تم تصدير سجل الأنشطة بصيغة ${format.toUpperCase()}`,
        type: 'system',
        severity: 'info',
        serverId: serverId || undefined
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export logs')
    }
  }, [serverId, type, section])

  // Clear all logs
  const clearLogs = useCallback(async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/logs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirm: true })
      })
      
      if (!response.ok) {
        throw new Error('Failed to clear logs')
      }
      
      // Refresh the activities list
      await fetchLogs()
      
      // Update stats
      await fetchStats()
      
      // Log this important activity
      await logActivity({
        user: 'Admin',
        userId: 'admin',
        action: 'مسح سجل الأنشطة',
        section: 'System',
        details: 'تم مسح جميع سجلات الأنشطة',
        type: 'delete',
        severity: 'warning',
        serverId: serverId || undefined
      })
      
    } catch (error) {
      console.error('Error clearing logs:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchLogs, fetchStats])

  // Update filters
  const updateFilters = useCallback((newFilters: {
    search?: string
    type?: string
    section?: string
    date?: string
  }) => {
    setFilters(newFilters)
  }, [])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  return {
    activities: logs,
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
  }
}

// Hook for real-time activity monitoring
export function useActivityMonitor(serverId?: string) {
  const [recentActivity, setRecentActivity] = useState<ActivityLog | null>(null)
  const [activityCount, setActivityCount] = useState(0)
  const [lastCheckTime, setLastCheckTime] = useState<number>(Date.now())

  const checkForNewActivity = useCallback(async () => {
    try {
      // Avoid making API calls too frequently to prevent overlap
      const now = Date.now()
      if (now - lastCheckTime < 8000) { // Minimum 8 seconds between calls
        return
      }
      
      setLastCheckTime(now)

      const params = new URLSearchParams({
        limit: '1',
        offset: '0'
      })

      if (serverId && typeof serverId === 'string') params.append('serverId', serverId)

      const response = await fetch(`/api/logs?${params.toString()}`)
      
      if (!response.ok) return

      const data = await response.json()
      
      if (data.logs.length > 0) {
        const latestLog = data.logs[0]
        
        // Check if this is a new activity
        if (!recentActivity || latestLog.id !== recentActivity.id) {
          setRecentActivity(latestLog)
          setActivityCount(prev => prev + 1)
        }
      }
    } catch (err) {
      console.error('Error checking for new activity:', err)
    }
  }, [serverId, recentActivity, lastCheckTime])

  useEffect(() => {
    // Check for new activity every 15 seconds (increased from 10 to reduce overlap)
    const interval = setInterval(checkForNewActivity, 15000)
    
    // Initial check with delay to avoid immediate overlap
    const timeout = setTimeout(checkForNewActivity, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [checkForNewActivity])

  const clearActivityCount = useCallback(() => {
    setActivityCount(0)
  }, [])

  return {
    recentActivity,
    activityCount,
    clearActivityCount
  }
}