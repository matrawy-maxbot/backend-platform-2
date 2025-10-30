import { promises as fs } from 'fs'
import path from 'path'

// مسار مجلد النسخ الاحتياطي
const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups')
const ADMINS_FILE = path.join(process.cwd(), 'data', 'admins.json')

// واجهة بيانات الأدمن
export interface AdminData {
  id: string
  discordId: string
  username: string
  discriminator: string
  avatar: string
  addedAt: string
  addedBy: string
  permissions: string[]
  status: 'active' | 'inactive'
  lastActivity?: string
}

// واجهة بيانات السيرفر
export interface ServerAdminData {
  serverId: string
  admins: AdminData[]
  settings: {
    maxAdmins: number
    autoRemoveInactive: boolean
    inactivityDays: number
    requireTwoFactorAuth: boolean
  }
  createdAt: string
  updatedAt: string
  updatedBy: string
}

// واجهة النسخة الاحتياطية
export interface BackupData {
  serverId: string
  action: string
  adminId?: string
  timestamp: string
  data: ServerAdminData
}

// إنشاء مجلد النسخ الاحتياطي إذا لم يكن موجوداً
async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR)
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true })
  }
}

// قراءة بيانات الأدمن للسيرفر
export async function getServerAdmins(serverId: string): Promise<ServerAdminData> {
  try {
    const content = await fs.readFile(ADMINS_FILE, 'utf-8')
    const data = JSON.parse(content)
    
    return data[serverId] || {
      serverId,
      admins: [],
      settings: {
        maxAdmins: 10,
        autoRemoveInactive: false,
        inactivityDays: 30,
        requireTwoFactorAuth: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'system'
    }
  } catch (error) {
    // إذا لم يكن الملف موجوداً، إنشاء بيانات افتراضية
    return {
      serverId,
      admins: [],
      settings: {
        maxAdmins: 10,
        autoRemoveInactive: false,
        inactivityDays: 30,
        requireTwoFactorAuth: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'system'
    }
  }
}

// حفظ بيانات الأدمن للسيرفر
export async function saveServerAdmins(serverId: string, serverData: ServerAdminData): Promise<void> {
  try {
    let allData = {}
    
    try {
      const content = await fs.readFile(ADMINS_FILE, 'utf-8')
      allData = JSON.parse(content)
    } catch {
      // الملف غير موجود، سيتم إنشاؤه
    }
    
    allData[serverId] = serverData
    
    // إنشاء مجلد البيانات إذا لم يكن موجوداً
    const dataDir = path.dirname(ADMINS_FILE)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }
    
    await fs.writeFile(ADMINS_FILE, JSON.stringify(allData, null, 2))
  } catch (error) {
    console.error('❌ Failed to save server admins:', error)
    throw error
  }
}

// إنشاء نسخة احتياطية
export async function createBackup(serverId: string, action: string, adminId?: string): Promise<string> {
  try {
    await ensureBackupDir()
    
    // قراءة البيانات الحالية
    const currentData = await getServerAdmins(serverId)
    
    // إنشاء النسخة الاحتياطية
    const backup: BackupData = {
      serverId,
      action,
      adminId,
      timestamp: new Date().toISOString(),
      data: currentData
    }
    
    // إنشاء اسم الملف
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `admins_${serverId}_${action}_${timestamp}.json`
    const filepath = path.join(BACKUP_DIR, filename)
    
    // حفظ النسخة الاحتياطية
    await fs.writeFile(filepath, JSON.stringify(backup, null, 2))
    
    console.log(`✅ Backup created: ${filename}`)
    return filename
  } catch (error) {
    console.error('❌ Failed to create backup:', error)
    throw error
  }
}

// استعادة من نسخة احتياطية
export async function restoreFromBackup(filename: string): Promise<boolean> {
  try {
    const filepath = path.join(BACKUP_DIR, filename)
    const backupContent = await fs.readFile(filepath, 'utf-8')
    const backup: BackupData = JSON.parse(backupContent)
    
    // استعادة البيانات
    await saveServerAdmins(backup.serverId, backup.data)
    
    console.log(`✅ Restored from backup: ${filename}`)
    return true
  } catch (error) {
    console.error('❌ Failed to restore from backup:', error)
    return false
  }
}

// الحصول على قائمة النسخ الاحتياطية
export async function getBackupsList(): Promise<Array<{
  filename: string
  serverId: string
  action: string
  timestamp: string
  size: number
}>> {
  try {
    await ensureBackupDir()
    const files = await fs.readdir(BACKUP_DIR)
    const backups = []
    
    for (const file of files) {
      if (file.endsWith('.json') && file.startsWith('admins_')) {
        try {
          const filepath = path.join(BACKUP_DIR, file)
          const stats = await fs.stat(filepath)
          const content = await fs.readFile(filepath, 'utf-8')
          const backup: BackupData = JSON.parse(content)
          
          backups.push({
            filename: file,
            serverId: backup.serverId,
            action: backup.action,
            timestamp: backup.timestamp,
            size: stats.size
          })
        } catch (error) {
          console.error(`Error reading backup file ${file}:`, error)
        }
      }
    }
    
    // ترتيب حسب التاريخ (الأحدث أولاً)
    return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error('❌ Failed to get backups list:', error)
    return []
  }
}

// تنظيف النسخ الاحتياطية القديمة
export async function cleanupOldBackups(maxAge: number = 30): Promise<number> {
  try {
    await ensureBackupDir()
    const files = await fs.readdir(BACKUP_DIR)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - maxAge)
    
    let deletedCount = 0
    
    for (const file of files) {
      if (file.endsWith('.json') && file.startsWith('admins_')) {
        try {
          const filepath = path.join(BACKUP_DIR, file)
          const stats = await fs.stat(filepath)
          
          if (stats.mtime < cutoffDate) {
            await fs.unlink(filepath)
            deletedCount++
            console.log(`🗑️ Deleted old backup: ${file}`)
          }
        } catch (error) {
          console.error(`Error processing backup file ${file}:`, error)
        }
      }
    }
    
    console.log(`✅ Cleanup completed. Deleted ${deletedCount} old backups.`)
    return deletedCount
  } catch (error) {
    console.error('❌ Failed to cleanup old backups:', error)
    return 0
  }
}

// إضافة أدمن جديد
export async function addServerAdmin(serverId: string, admin: AdminData, addedBy: string): Promise<boolean> {
  try {
    // إنشاء نسخة احتياطية قبل التعديل
    await createBackup(serverId, 'admin_added', admin.discordId)
    
    const serverData = await getServerAdmins(serverId)
    
    // التحقق من عدم وجود الأدمن مسبقاً
    const existingAdmin = serverData.admins.find(a => a.discordId === admin.discordId)
    if (existingAdmin) {
      return false
    }
    
    // إضافة الأدمن الجديد
    serverData.admins.push(admin)
    serverData.updatedAt = new Date().toISOString()
    serverData.updatedBy = addedBy
    
    await saveServerAdmins(serverId, serverData)
    
    console.log(`✅ Admin added: ${admin.username} (${admin.discordId})`)
    return true
  } catch (error) {
    console.error('❌ Failed to add admin:', error)
    return false
  }
}

// حذف أدمن
export async function removeServerAdmin(serverId: string, adminId: string, removedBy: string): Promise<boolean> {
  try {
    // إنشاء نسخة احتياطية قبل التعديل
    await createBackup(serverId, 'admin_removed', adminId)
    
    const serverData = await getServerAdmins(serverId)
    const initialLength = serverData.admins.length
    
    // حذف الأدمن
    serverData.admins = serverData.admins.filter(admin => 
      admin.id !== adminId && admin.discordId !== adminId
    )
    
    if (serverData.admins.length < initialLength) {
      serverData.updatedAt = new Date().toISOString()
      serverData.updatedBy = removedBy
      
      await saveServerAdmins(serverId, serverData)
      
      console.log(`✅ Admin removed: ${adminId}`)
      return true
    }
    
    return false
  } catch (error) {
    console.error('❌ Failed to remove admin:', error)
    return false
  }
}

// الحصول على إحصائيات الأدمن
export async function getAdminStats(serverId: string): Promise<{
  totalAdmins: number
  activeAdmins: number
  recentlyAdded: number
  availableBackups: number
}> {
  try {
    const serverData = await getServerAdmins(serverId)
    const backups = await getBackupsList()
    
    // حساب الأدمن المضافين مؤخراً (آخر 7 أيام)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const recentlyAdded = serverData.admins.filter(admin => 
      new Date(admin.addedAt) > weekAgo
    ).length
    
    return {
      totalAdmins: serverData.admins.length,
      activeAdmins: serverData.admins.filter(admin => admin.status === 'active').length,
      recentlyAdded,
      availableBackups: backups.filter(backup => backup.serverId === serverId).length
    }
  } catch (error) {
    console.error('❌ Failed to get admin stats:', error)
    return {
      totalAdmins: 0,
      activeAdmins: 0,
      recentlyAdded: 0,
      availableBackups: 0
    }
  }
}