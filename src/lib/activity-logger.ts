// Activity Logger Utility
// This utility provides easy-to-use functions for logging activities throughout the application

export interface ActivityLogData {
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

// Main logging function
export async function logActivity(data: ActivityLogData): Promise<boolean> {
  try {
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error('Failed to log activity:', response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('Error logging activity:', error)
    return false
  }
}

// Convenience functions for different types of activities

export async function logAdActivity(
  user: string,
  userId: string,
  action: string,
  details: string,
  type: 'create' | 'update' | 'delete',
  serverId?: string,
  avatar?: string
) {
  return logActivity({
    user,
    userId,
    avatar,
    action,
    section: 'Ads',
    details,
    type,
    severity: type === 'delete' ? 'warning' : type === 'create' ? 'success' : 'info',
    serverId,
  })
}

export async function logProtectionActivity(
  user: string,
  userId: string,
  action: string,
  details: string,
  type: 'update' | 'system',
  serverId?: string,
  avatar?: string
) {
  return logActivity({
    user,
    userId,
    avatar,
    action,
    section: 'Protection',
    details,
    type,
    severity: 'success',
    serverId,
  })
}

export async function logAdminActivity(
  user: string,
  userId: string,
  action: string,
  details: string,
  type: 'create' | 'update' | 'delete',
  serverId?: string,
  avatar?: string
) {
  return logActivity({
    user,
    userId,
    avatar,
    action,
    section: 'Admins',
    details,
    type,
    severity: type === 'delete' ? 'warning' : 'warning', // Admin changes are always important
    serverId,
  })
}

export async function logMemberActivity(
  user: string,
  userId: string,
  action: string,
  details: string,
  type: 'create' | 'update' | 'delete' | 'system',
  serverId?: string,
  avatar?: string
) {
  return logActivity({
    user,
    userId,
    avatar,
    action,
    section: 'Members',
    details,
    type,
    severity: 'info',
    serverId,
  })
}

export async function logAutoReplyActivity(
  user: string,
  userId: string,
  action: string,
  details: string,
  type: 'create' | 'update' | 'delete',
  serverId?: string,
  avatar?: string
) {
  return logActivity({
    user,
    userId,
    avatar,
    action,
    section: 'Auto Reply',
    details,
    type,
    severity: 'success',
    serverId,
  })
}

export async function logBackupActivity(
  user: string,
  userId: string,
  action: string,
  details: string,
  type: 'create' | 'restore' | 'delete' | 'system',
  serverId?: string,
  avatar?: string
) {
  return logActivity({
    user,
    userId,
    avatar,
    action,
    section: 'Backup',
    details,
    type,
    severity: type === 'delete' ? 'warning' : 'success',
    serverId,
  })
}

export async function logSystemActivity(
  action: string,
  details: string,
  severity: 'info' | 'success' | 'warning' | 'error' = 'info',
  serverId?: string,
  metadata?: Record<string, any>
) {
  return logActivity({
    user: 'System',
    userId: 'system',
    action,
    section: 'System',
    details,
    type: 'system',
    severity,
    serverId,
    metadata,
  })
}

export async function logErrorActivity(
  action: string,
  details: string,
  serverId?: string,
  metadata?: Record<string, any>
) {
  return logActivity({
    user: 'System',
    userId: 'system',
    action,
    section: 'System',
    details,
    type: 'error',
    severity: 'error',
    serverId,
    metadata,
  })
}

// Function to get activity statistics
export async function getActivityStats(serverId?: string) {
  try {
    const params = new URLSearchParams()
    if (serverId) params.append('serverId', serverId)
    
    const response = await fetch(`/api/logs?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch activity stats')
    }

    const data = await response.json()
    const logs = data.logs

    const today = new Date().toDateString()
    const todayActivities = logs.filter((log: any) => 
      new Date(log.timestamp).toDateString() === today
    ).length

    const errors = logs.filter((log: any) => log.type === 'error').length
    const systemActivities = logs.filter((log: any) => log.user === 'System').length
    const userActivities = logs.filter((log: any) => log.user !== 'System').length

    return {
      total: data.total,
      today: todayActivities,
      errors,
      system: systemActivities,
      user: userActivities
    }
  } catch (error) {
    console.error('Error fetching activity stats:', error)
    return {
      total: 0,
      today: 0,
      errors: 0,
      system: 0,
      user: 0
    }
  }
}