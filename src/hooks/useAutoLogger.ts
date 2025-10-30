"use client"

import { useCallback, useRef } from 'react'
import { autoLogger } from '@/lib/auto-logger'

export function useAutoLogger() {
  const serverIdRef = useRef<string | null>(null)

  const setServerId = useCallback((serverId: string) => {
    serverIdRef.current = serverId
    autoLogger.setServerId(serverId)
  }, [])

  const logPageVisit = useCallback((page: string, user: any) => {
    autoLogger.logPageVisit(page, user)
  }, [])

  const logUserAction = useCallback((action: string, user: any, details?: string) => {
    autoLogger.logUserAction(action, user, details)
  }, [])

  const logDataUpdate = useCallback((type: string, action: string, user: any, details?: string) => {
    autoLogger.logDataUpdate(type, action, user, details)
  }, [])

  const logSystemEvent = useCallback((event: string, details?: string) => {
    autoLogger.logSystemEvent(event, details)
  }, [])

  const logError = useCallback((error: string, details?: string) => {
    autoLogger.logError(error, details)
  }, [])

  const logAuthEvent = useCallback((event: string, user: any, details?: string) => {
    autoLogger.logAuthEvent(event, user, details)
  }, [])

  const logConfigChange = useCallback((setting: string, user: any, oldValue?: any, newValue?: any) => {
    autoLogger.logConfigChange(setting, user, oldValue, newValue)
  }, [])

  const logSecurityEvent = useCallback((event: string, user: any, details?: string) => {
    autoLogger.logSecurityEvent(event, user, details)
  }, [])

  const logAdminAction = useCallback((action: string, user: any, targetUser?: any, details?: string) => {
    autoLogger.logAdminAction(action, user, targetUser, details)
  }, [])

  return {
    setServerId,
    logPageVisit,
    logUserAction,
    logDataUpdate,
    logSystemEvent,
    logError,
    logAuthEvent,
    logConfigChange,
    logSecurityEvent,
    logAdminAction
  }
}