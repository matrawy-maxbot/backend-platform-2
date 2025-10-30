'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useParams } from 'next/navigation'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { activityTracker } from '@/lib/activity-tracker'

interface ActivityTrackerProps {
  children: React.ReactNode
}

export default function ActivityTracker({ children }: ActivityTrackerProps) {
  const { session } = useAuth()
  const params = useParams()
  const { selectedServer } = useSelectedServer()

  useEffect(() => {
    // Set user information when session is available
    if (session?.user) {
      const userId = session.user.id || session.user.email || 'unknown'
      const userName = session.user.name || session.user.email || 'مستخدم غير معروف'
      // Use selectedServer from context first, then fall back to URL params
      const serverId = selectedServer?.id || (params?.serverId as string) || undefined

      activityTracker.setUser(userId, userName, serverId)
    }
  }, [session, params, selectedServer])

  // تعطيل تتبع تسجيل الدخول العادي - ليس من الأحداث المهمة
  // Disable normal login tracking - not an important event
  /*
  useEffect(() => {
    // Track user login
    if (session?.user) {
      const userId = session.user.id || session.user.email || 'unknown'
      const userName = session.user.name || session.user.email || 'مستخدم غير معروف'
      
      activityTracker.trackUserLogin(userId, userName)
    }
  }, [session])
  */

  // تعطيل تتبع استدعاءات API - لا نريد تسجيل كل استدعاء API
  // Disable API call tracking - we don't want to log every API call
  /*
  useEffect(() => {
    // Intercept fetch requests to track API calls
    const originalFetch = window.fetch
    
    window.fetch = async (...args) => {
      const [resource, config] = args
      const url = typeof resource === 'string' ? resource : resource.url
      const method = config?.method || 'GET'
      
      try {
        const response = await originalFetch(...args)
        
        // Only track API calls to our own endpoints, but exclude logs endpoint to prevent infinite loop
        if (url.startsWith('/api/') && !url.includes('/api/logs')) {
          activityTracker.trackApiCall(url, method, response.ok)
        }
        
        return response
      } catch (error) {
        // Track failed API calls, but exclude logs endpoint to prevent infinite loop
        if (url.startsWith('/api/') && !url.includes('/api/logs')) {
          activityTracker.trackApiCall(url, method, false)
        }
        throw error
      }
    }

    // Cleanup on unmount
    return () => {
      window.fetch = originalFetch
    }
  }, [])
  */

  return <>{children}</>
}

// Hook for manual activity tracking
export function useActivityTracker() {
  const { session } = useAuth()
  const params = useParams()
  const { selectedServer } = useSelectedServer()

  const trackActivity = (data: {
    action: string
    section: string
    details: string
    type: 'create' | 'update' | 'delete' | 'system' | 'error'
    severity: 'info' | 'success' | 'warning' | 'error'
  }) => {
    if (session?.user) {
      const userId = session.user.id || session.user.email || 'unknown'
      const userName = session.user.name || session.user.email || 'مستخدم غير معروف'
      // Use selectedServer from context first, then fall back to URL params
      const serverId = selectedServer?.id || (params?.serverId as string) || undefined

      activityTracker.setUser(userId, userName, serverId)
    }

    // Use the activity tracker methods based on the action type
    switch (data.section) {
      case 'Ads':
        if (data.type === 'create') {
          activityTracker.trackAdCreation(data.action, data.details)
        } else if (data.type === 'update') {
          activityTracker.trackAdUpdate(data.action)
        } else if (data.type === 'delete') {
          activityTracker.trackAdDeletion(data.action)
        }
        break
      
      case 'Protection':
        activityTracker.trackProtectionUpdate(data.action, data.details)
        break
      
      case 'Admins':
        if (data.type === 'create') {
          activityTracker.trackAdminAdded(data.details)
        } else if (data.type === 'delete') {
          activityTracker.trackAdminRemoved(data.details)
        }
        break
      
      case 'Members':
        activityTracker.trackMemberUpdate(data.details, data.action)
        break
      
      case 'Auto Reply':
        activityTracker.trackAutoReplyCreated(data.details)
        break
      
      case 'Auto Log':
        activityTracker.trackAutoLogUpdate(data.action, data.details)
        break
      
      case 'Backup':
        activityTracker.trackBackupCreated()
        break
      
      default:
        // For custom activities, use the generic logging
        activityTracker['logActivity'](data)
        break
    }
  }

  return {
    trackActivity,
    trackAdCreation: activityTracker.trackAdCreation.bind(activityTracker),
    trackAdUpdate: activityTracker.trackAdUpdate.bind(activityTracker),
    trackAdDeletion: activityTracker.trackAdDeletion.bind(activityTracker),
    trackProtectionUpdate: activityTracker.trackProtectionUpdate.bind(activityTracker),
    trackAdminAdded: activityTracker.trackAdminAdded.bind(activityTracker),
    trackAdminRemoved: activityTracker.trackAdminRemoved.bind(activityTracker),
    trackMemberUpdate: activityTracker.trackMemberUpdate.bind(activityTracker),
    trackAutoReplyCreated: activityTracker.trackAutoReplyCreated.bind(activityTracker),
    trackAutoReplyUpdate: activityTracker.trackAutoReplyUpdate.bind(activityTracker),
    trackAutoLogUpdate: activityTracker.trackAutoLogUpdate.bind(activityTracker),
    trackBackupCreated: activityTracker.trackBackupCreated.bind(activityTracker),
    trackBackupUpdate: activityTracker.trackBackupUpdate.bind(activityTracker),
    trackError: activityTracker.trackError.bind(activityTracker),
    logActivity: activityTracker.logActivity.bind(activityTracker)
  }
}