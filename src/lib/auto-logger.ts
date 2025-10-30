import { logActivity } from './activity-logger'

export interface UserData {
  id?: string
  name?: string
  username?: string
  email?: string
  image?: string
  avatar?: string
}

class AutoLogger {
  private static instance: AutoLogger
  private isEnabled: boolean = true
  private serverId: string | null = null

  private constructor() {}

  static getInstance(): AutoLogger {
    if (!AutoLogger.instance) {
      AutoLogger.instance = new AutoLogger()
    }
    return AutoLogger.instance
  }

  // Set server ID for all logging operations
  setServerId(serverId: string | null) {
    this.serverId = serverId
  }

  // Get current server ID
  getServerId(): string | null {
    return this.serverId
  }

  // Enable/disable logging
  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }

  isLoggingEnabled(): boolean {
    return this.isEnabled
  }

  // Helper function to get user info
  private getUserInfo(user?: UserData | null) {
    if (!user) {
      return {
        userId: 'anonymous',
        userName: 'Anonymous User',
        avatar: undefined
      }
    }

    return {
      userId: user.id || user.username || 'unknown',
      userName: user.name || user.username || 'Unknown User',
      avatar: user.image || user.avatar
    }
  }

  // Log page visits
  async logPageVisit(pageName: string, user?: UserData | null) {
    if (!this.isEnabled) return

    const { userId, userName, avatar } = this.getUserInfo(user)

    await logActivity({
      user: userName,
      userId,
      avatar,
      action: `Visited ${pageName} page`,
      section: 'Navigation',
      details: `User navigated to ${pageName}`,
      type: 'system',
      severity: 'info',
      serverId: this.serverId || undefined
    })
  }

  // Log data updates
  async logDataUpdate(dataType: string, action: 'create' | 'update' | 'delete', user?: UserData | null, details?: string) {
    if (!this.isEnabled) return

    const actionText = {
      create: 'Created',
      update: 'Updated', 
      delete: 'Deleted'
    }[action]

    const { userId, userName, avatar } = this.getUserInfo(user)

    await logActivity({
      user: userName,
      userId,
      avatar,
      action: `${actionText} ${dataType}`,
      section: this.getSectionFromDataType(dataType),
      details: details || `${actionText} ${dataType} successfully`,
      type: action,
      severity: action === 'delete' ? 'warning' : 'success',
      serverId: this.serverId || undefined
    })
  }

  // Log errors
  async logError(error: string, context?: string, user?: UserData | null) {
    if (!this.isEnabled) return

    const { userId, userName, avatar } = this.getUserInfo(user)

    await logActivity({
      user: userName || 'System',
      userId: userId || 'system',
      avatar,
      action: 'Error occurred',
      section: context || 'System',
      details: error,
      type: 'error',
      severity: 'error',
      serverId: this.serverId || undefined
    })
  }

  // Log user actions
  async logUserAction(action: string, section: string, user?: UserData | null, details?: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') {
    if (!this.isEnabled) return

    const { userId, userName, avatar } = this.getUserInfo(user)

    await logActivity({
      user: userName,
      userId,
      avatar,
      action,
      section,
      details: details || action,
      type: 'system',
      severity,
      serverId: this.serverId || undefined
    })
  }

  // Log system events
  async logSystemEvent(event: string, details?: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') {
    if (!this.isEnabled) return

    await logActivity({
      user: 'System',
      userId: 'system',
      action: event,
      section: 'System',
      details: details || event,
      type: 'system',
      severity,
      serverId: this.serverId || undefined
    })
  }

  // Log authentication events
  async logAuthEvent(event: 'login' | 'logout', user?: UserData | null, details?: string) {
    if (!this.isEnabled) return

    const { userId, userName, avatar } = this.getUserInfo(user)

    await logActivity({
      user: userName,
      userId,
      avatar,
      action: event === 'login' ? 'User logged in' : 'User logged out',
      section: 'Authentication',
      details: details || `User ${event}`,
      type: event,
      severity: 'info',
      serverId: this.serverId || undefined
    })
  }

  // Log configuration changes
  async logConfigChange(setting: string, oldValue: any, newValue: any, user?: UserData | null, section: string = 'Configuration') {
    if (!this.isEnabled) return

    const { userId, userName, avatar } = this.getUserInfo(user)

    await logActivity({
      user: userName,
      userId,
      avatar,
      action: `Updated ${setting}`,
      section,
      details: `${setting}: ${oldValue} → ${newValue}`,
      type: 'update',
      severity: 'success',
      serverId: this.serverId || undefined
    })
  }

  // Log security events
  async logSecurityEvent(event: string, user?: UserData | null, details?: string, severity: 'warning' | 'error' = 'warning') {
    if (!this.isEnabled) return

    const { userId, userName, avatar } = this.getUserInfo(user)

    await logActivity({
      user: userName || 'System',
      userId: userId || 'system',
      avatar,
      action: event,
      section: 'Security',
      details: details || event,
      type: 'system',
      severity,
      serverId: this.serverId || undefined
    })
  }

  // Helper function to determine section from data type
  private getSectionFromDataType(dataType: string): string {
    const sectionMap: Record<string, string> = {
      'advertisement': 'Ads',
      'protection': 'Protection',
      'admin': 'Admins',
      'member': 'Members',
      'welcome': 'Members',
      'autoreply': 'Auto Reply',
      'backup': 'System'
    }

    return sectionMap[dataType.toLowerCase()] || 'System'
  }
}

// Export singleton instance
export const autoLogger = AutoLogger.getInstance()

// React hook for easy usage in components
export function useAutoLogger() {
  return autoLogger
}