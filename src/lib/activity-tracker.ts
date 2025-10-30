import { logActivity } from './activity-logger'

// Activity tracking configuration
interface ActivityConfig {
  enabled: boolean
  trackUserActions: boolean
  trackSystemEvents: boolean
  trackErrors: boolean
  trackPageViews: boolean
  trackApiCalls: boolean
}

// Default configuration
const defaultConfig: ActivityConfig = {
  enabled: true,
  trackUserActions: false, // تعطيل تتبع النقرات العادية
  trackSystemEvents: true,
  trackErrors: true,
  trackPageViews: false, // تعطيل تتبع زيارات الصفحات
  trackApiCalls: false // تعطيل تتبع استدعاءات API العادية
}

// Global activity tracker instance
class ActivityTracker {
  private config: ActivityConfig
  private userId: string | null = null
  private userName: string | null = null
  private serverId: string | null = null

  constructor(config: ActivityConfig = defaultConfig) {
    this.config = config
    this.initializeTracker()
  }

  // Initialize the tracker
  private initializeTracker() {
    if (typeof window !== 'undefined' && this.config.enabled) {
      // Track page views
      if (this.config.trackPageViews) {
        this.trackPageView()
        window.addEventListener('popstate', () => this.trackPageView())
      }

      // Track errors
      if (this.config.trackErrors) {
        window.addEventListener('error', (event) => {
          this.trackError(event.error, event.filename, event.lineno)
        })

        window.addEventListener('unhandledrejection', (event) => {
          this.trackError(event.reason, 'Promise rejection')
        })
      }

      // Track user interactions
      if (this.config.trackUserActions) {
        this.setupUserActionTracking()
      }
    }
  }

  // Set user information
  setUser(userId: string, userName: string, serverId?: string) {
    this.userId = userId
    this.userName = userName
    this.serverId = serverId || null
  }

  // Track page views
  private trackPageView() {
    const path = window.location.pathname
    const pageName = this.getPageName(path)
    
    if (pageName) {
      this.logActivity({
        action: `زيارة صفحة ${pageName}`,
        section: 'Navigation',
        details: `تم الوصول إلى صفحة ${pageName} (${path})`,
        type: 'system',
        severity: 'info'
      })
    }
  }

  // Get readable page name from path
  private getPageName(path: string): string {
    const pageMap: Record<string, string> = {
      '/dashboard': 'الداشبورد الرئيسي',
      '/dashboard-log': 'سجل الأنشطة',
      '/ads': 'إدارة الإعلانات',
      '/protection': 'إعدادات الحماية',
      '/admins': 'إدارة المشرفين',
      '/members': 'إدارة الأعضاء',
      '/auto-reply': 'الردود التلقائية',
      '/backup': 'النسخ الاحتياطية',
      '/settings': 'الإعدادات',
      '/welcome': 'رسائل الترحيب',
      '/roles': 'إدارة الأدوار',
      '/channels': 'إدارة القنوات'
    }

    // Check for exact matches first
    if (pageMap[path]) {
      return pageMap[path]
    }

    // Check for partial matches (for dynamic routes)
    for (const [route, name] of Object.entries(pageMap)) {
      if (path.startsWith(route)) {
        return name
      }
    }

    return path.replace(/^\//, '').replace(/-/g, ' ') || 'صفحة غير معروفة'
  }

  // Setup user action tracking
  private setupUserActionTracking() {
    // Track button clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button')
        const buttonText = button?.textContent?.trim() || 'زر غير معروف'
        const section = this.getCurrentSection()
        
        this.logActivity({
          action: `نقر على زر "${buttonText}"`,
          section,
          details: `تم النقر على الزر "${buttonText}" في قسم ${section}`,
          type: 'create',
          severity: 'info'
        })
      }
    })

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      const formName = form.getAttribute('name') || form.id || 'نموذج غير معروف'
      const section = this.getCurrentSection()
      
      this.logActivity({
        action: `إرسال نموذج "${formName}"`,
        section,
        details: `تم إرسال النموذج "${formName}" في قسم ${section}`,
        type: 'update',
        severity: 'success'
      })
    })
  }

  // Get current section based on URL
  private getCurrentSection(): string {
    const path = window.location.pathname
    
    if (path.includes('ads')) return 'Ads'
    if (path.includes('protection')) return 'Protection'
    if (path.includes('admins')) return 'Admins'
    if (path.includes('members')) return 'Members'
    if (path.includes('auto-reply')) return 'Auto Reply'
    if (path.includes('backup')) return 'Backup'
    if (path.includes('welcome')) return 'Welcome'
    if (path.includes('roles')) return 'Roles'
    if (path.includes('channels')) return 'Channels'
    if (path.includes('dashboard-log')) return 'Logs'
    if (path.includes('dashboard')) return 'Dashboard'
    
    return 'System'
  }

  // Track specific activities
  trackUserLogin(userId: string, userName: string) {
    this.setUser(userId, userName)
    this.logActivity({
      action: 'تسجيل دخول المستخدم',
      section: 'Authentication',
      details: `قام المستخدم ${userName} بتسجيل الدخول بنجاح`,
      type: 'system',
      severity: 'success'
    })
  }

  trackUserLogout() {
    this.logActivity({
      action: 'تسجيل خروج المستخدم',
      section: 'Authentication',
      details: `قام المستخدم ${this.userName} بتسجيل الخروج`,
      type: 'system',
      severity: 'info'
    })
  }

  trackAdCreation(adTitle: string, channelName: string) {
    this.logActivity({
      action: 'إنشاء إعلان جديد',
      section: 'Ads',
      details: `تم إنشاء إعلان جديد بعنوان "${adTitle}" في قناة ${channelName}`,
      type: 'create',
      severity: 'success'
    })
  }

  trackAdUpdate(adTitle: string) {
    this.logActivity({
      action: 'تحديث إعلان',
      section: 'Ads',
      details: `تم تحديث الإعلان "${adTitle}"`,
      type: 'update',
      severity: 'info'
    })
  }

  trackAdDeletion(adTitle: string) {
    this.logActivity({
      action: 'حذف إعلان',
      section: 'Ads',
      details: `تم حذف الإعلان "${adTitle}"`,
      type: 'delete',
      severity: 'warning'
    })
  }

  trackProtectionUpdate(setting: string, value: any) {
    this.logActivity({
      action: 'تحديث إعدادات الحماية',
      section: 'Protection',
      details: `تم تحديث إعداد "${setting}" إلى "${value}"`,
      type: 'update',
      severity: 'warning'
    })
  }

  trackAdminAdded(adminName: string) {
    this.logActivity({
      action: 'إضافة مشرف جديد',
      section: 'Admins',
      details: `تم إضافة ${adminName} كمشرف جديد`,
      type: 'create',
      severity: 'warning'
    })
  }

  trackAdminRemoved(adminName: string) {
    this.logActivity({
      action: 'إزالة مشرف',
      section: 'Admins',
      details: `تم إزالة صلاحيات الإشراف من ${adminName}`,
      type: 'delete',
      severity: 'warning'
    })
  }

  trackMemberUpdate(memberName: string, action: string) {
    this.logActivity({
      action: `تحديث عضو: ${action}`,
      section: 'Members',
      details: `تم ${action} للعضو ${memberName}`,
      type: 'update',
      severity: 'info'
    })
  }

  trackAutoReplyCreated(keyword: string) {
    this.logActivity({
      action: 'إنشاء رد تلقائي',
      section: 'Auto Reply',
      details: `تم إنشاء رد تلقائي للكلمة المفتاحية "${keyword}"`,
      type: 'create',
      severity: 'success'
    })
  }

  trackAutoReplyUpdate(details: string) {
    this.logActivity({
      action: 'تحديث إعدادات الرد التلقائي',
      section: 'Auto Reply',
      details,
      type: 'update',
      severity: 'success'
    })
  }

  trackAutoLogUpdate(action: string, details: string) {
    this.logActivity({
      action: action || 'تحديث إعدادات Auto Log',
      section: 'Auto Log',
      details: details || 'تم تحديث إعدادات Auto Log',
      type: 'update',
      severity: 'success'
    })
  }

  trackBackupCreated() {
    this.logActivity({
      action: 'إنشاء نسخة احتياطية',
      section: 'Backup',
      details: 'تم إنشاء نسخة احتياطية جديدة من إعدادات السيرفر',
      type: 'system',
      severity: 'success'
    })
  }

  trackBackupUpdate(details: string) {
    this.logActivity({
      action: 'تحديث النسخة الاحتياطية',
      section: 'Backup',
      details: details || 'تم تحديث النسخة الاحتياطية',
      type: 'update',
      severity: 'success'
    })
  }

  trackError(error: any, context?: string, line?: number) {
    const errorMessage = error?.message || error?.toString() || 'خطأ غير معروف'
    const details = context 
      ? `حدث خطأ في ${context}${line ? ` (السطر ${line})` : ''}: ${errorMessage}`
      : `حدث خطأ: ${errorMessage}`

    this.logActivity({
      action: 'خطأ في النظام',
      section: 'System',
      details,
      type: 'error',
      severity: 'error'
    })
  }

  trackApiCall(endpoint: string, method: string, success: boolean) {
    if (!this.config.trackApiCalls) return

    this.logActivity({
      action: `استدعاء API: ${method} ${endpoint}`,
      section: 'System',
      details: `تم استدعاء ${method} ${endpoint} - ${success ? 'نجح' : 'فشل'}`,
      type: success ? 'system' : 'error',
      severity: success ? 'info' : 'error'
    })
  }

  // Generic activity logging
  logActivity(data: {
    action: string
    section: string
    details: string
    type: 'create' | 'update' | 'delete' | 'system' | 'error'
    severity: 'info' | 'success' | 'warning' | 'error'
  }) {
    if (!this.config.enabled) return

    logActivity({
      user: this.userName || 'مستخدم غير معروف',
      userId: this.userId || 'unknown',
      serverId: this.serverId,
      ...data
    })
  }

  // Update configuration
  updateConfig(newConfig: Partial<ActivityConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  // Get current configuration
  getConfig(): ActivityConfig {
    return { ...this.config }
  }
}

// Create global instance
export const activityTracker = new ActivityTracker()

// Export types and functions
export type { ActivityConfig }
export { ActivityTracker }