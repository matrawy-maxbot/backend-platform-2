import fs from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// مسار قاعدة البيانات
const DB_PATH = path.join(process.cwd(), 'data')
const SERVERS_DB = path.join(DB_PATH, 'servers.json')
const BACKUP_PATH = path.join(DB_PATH, 'backups')
const LOGS_PATH = path.join(DB_PATH, 'logs')

// واجهة بيانات السيرفر
export interface ServerData {
  id: string
  autoReply: {
    enabled: boolean
    smartReply: boolean
    defaultCooldown: number
    maxResponsesPerHour: number
    replies: any[]
  }
  ads: {
    enabled: boolean
    ads: any[]
  }
  members: {
    welcomeMessage: {
      enabled: boolean
      message: string
      channel: string
    }
    leaveMessage: {
      enabled: boolean
      message: string
      channel: string
    }
    autoRole: {
      enabled: boolean
      roleId: string
    }
  }
  protection: {
    spamProtection: boolean
    raidProtection: boolean
    autoModeration: boolean
    images?: {
      enabled: boolean
      mode: 'allow_all' | 'block_all' | 'channel_specific'
      channels: string[]
    }
    botManagement?: {
      enabled: boolean
      allowedBots: string[]
      blockUnknownBots: boolean
      disallowBots: boolean
    }
    moderation?: {
      enabled: boolean
      autoDelete: boolean
      warnUser: boolean
      logChannel: string
      maxKickBan: number
      memberPunishment: 'kick' | 'ban' | 'remove roles'
    }
    badWords?: {
      enabled: boolean
      words: string[]
      action: 'delete' | 'warn' | 'timeout'
      punishment: 'Warn message' | 'none' | 'Mute chat' | 'kick'
      customMessage: string
      pictureChannels: string[]
      botCommandChannels: string[]
    }
    links?: {
      enabled: boolean
      allowDiscordInvites: boolean
      allowedDomains: string[]
      blockAll: boolean
      whitelistChannels: string[]
      blockedLinks: Array<{
        content: string
        action: 'delete' | 'warn' | 'timeout'
        channels: string[]
      }>
    }
    antiSpam?: {
      enabled: boolean
      maxMessages: number
      timeWindow: number
      action: 'delete' | 'warn' | 'timeout' | 'kick'
    }
  }
  backup: {
    autoBackup: boolean
    backupInterval: number
  }
  createdAt: string
  updatedAt: string
  updatedBy: string
}

// واجهة سجل التغييرات
export interface ChangeLog {
  id: string
  serverId: string
  section: string
  action: 'create' | 'update' | 'delete'
  oldData?: any
  newData: any
  userId: string
  timestamp: string
  ip?: string
}

// إنشاء المجلدات المطلوبة
export async function initializeDatabase() {
  try {
    // إنشاء مجلد البيانات
    if (!existsSync(DB_PATH)) {
      await fs.mkdir(DB_PATH, { recursive: true })
    }
    
    // إنشاء مجلد النسخ الاحتياطية
    if (!existsSync(BACKUP_PATH)) {
      await fs.mkdir(BACKUP_PATH, { recursive: true })
    }
    
    // إنشاء مجلد السجلات
    if (!existsSync(LOGS_PATH)) {
      await fs.mkdir(LOGS_PATH, { recursive: true })
    }
    
    // إنشاء ملف قاعدة البيانات إذا لم يكن موجوداً
    if (!existsSync(SERVERS_DB)) {
      await fs.writeFile(SERVERS_DB, JSON.stringify({}, null, 2))
    }
    
    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    throw error
  }
}

// قراءة جميع بيانات السيرفرات
export async function readServersData(): Promise<Record<string, ServerData>> {
  try {
    await initializeDatabase()
    const data = await fs.readFile(SERVERS_DB, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('❌ Failed to read servers data:', error)
    return {}
  }
}

// كتابة جميع بيانات السيرفرات
export async function writeServersData(data: Record<string, ServerData>): Promise<void> {
  try {
    await initializeDatabase()
    await fs.writeFile(SERVERS_DB, JSON.stringify(data, null, 2))
    console.log('✅ Servers data saved successfully')
  } catch (error) {
    console.error('❌ Failed to write servers data:', error)
    throw error
  }
}

// الحصول على بيانات سيرفر محدد
export async function getServerData(serverId: string): Promise<ServerData | null> {
  try {
    const allData = await readServersData()
    return allData[serverId] || null
  } catch (error) {
    console.error(`❌ Failed to get server data for ${serverId}:`, error)
    return null
  }
}

// حفظ بيانات سيرفر محدد
export async function saveServerData(serverId: string, data: Partial<ServerData>, userId: string): Promise<ServerData> {
  try {
    const allData = await readServersData()
    const existingData = allData[serverId]
    
    // إنشاء البيانات الجديدة
    const newData: ServerData = {
      id: serverId,
      autoReply: {
        enabled: true,
        smartReply: false,
        defaultCooldown: 30,
        maxResponsesPerHour: 10,
        replies: []
      },
      ads: {
        enabled: false,
        ads: []
      },
      members: {
        welcomeMessage: {
          enabled: true,
          message: 'Welcome {user} to {server}! 🎉',
          channel: ''
        },
        leaveMessage: {
          enabled: true,
          message: 'Goodbye {user}, hope to see you soon! 👋',
          channel: ''
        },
        autoRole: {
          enabled: false,
          roleId: ''
        }
      },
      protection: {
        spamProtection: true,
        raidProtection: false,
        autoModeration: true
      },
      backup: {
        autoBackup: true,
        backupInterval: 24
      },
      createdAt: existingData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
      ...existingData,
      ...data
    }
    
    // حفظ سجل التغييرات
    await logChange({
      id: generateId(),
      serverId,
      section: 'full',
      action: existingData ? 'update' : 'create',
      oldData: existingData,
      newData,
      userId,
      timestamp: new Date().toISOString()
    })
    
    // حفظ البيانات
    allData[serverId] = newData
    await writeServersData(allData)
    
    // إنشاء نسخة احتياطية تلقائية
    if (newData.backup.autoBackup) {
      await createBackup(serverId)
    }
    
    return newData
  } catch (error) {
    console.error(`❌ Failed to save server data for ${serverId}:`, error)
    throw error
  }
}

// تحديث قسم معين من بيانات السيرفر
export async function updateServerSection(
  serverId: string, 
  section: keyof Omit<ServerData, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>, 
  data: any, 
  userId: string
): Promise<any> {
  try {
    const allData = await readServersData()
    const existingData = allData[serverId]
    
    if (!existingData) {
      throw new Error(`Server ${serverId} not found`)
    }
    
    // التأكد من وجود القسم أو إنشاؤه
    if (!existingData[section]) {
      existingData[section] = {}
    }
    
    const oldSectionData = existingData[section]
    const newSectionData = { ...oldSectionData, ...data }
    
    // تحديث القسم
    existingData[section] = newSectionData
    existingData.updatedAt = new Date().toISOString()
    existingData.updatedBy = userId
    
    // التأكد من وجود قسم backup قبل الوصول إليه
    if (!existingData.backup) {
      existingData.backup = {
        autoBackup: false,
        backupInterval: 24
      }
    }
    
    // حفظ سجل التغييرات
    await logChange({
      id: generateId(),
      serverId,
      section,
      action: 'update',
      oldData: oldSectionData,
      newData: newSectionData,
      userId,
      timestamp: new Date().toISOString()
    })
    
    // حفظ البيانات
    allData[serverId] = existingData
    await writeServersData(allData)
    
    // إنشاء نسخة احتياطية تلقائية
    if (existingData.backup && existingData.backup.autoBackup) {
      await createBackup(serverId)
    }
    
    return newSectionData
  } catch (error) {
    console.error(`❌ Failed to update server section ${section} for ${serverId}:`, error)
    throw error
  }
}

// إنشاء نسخة احتياطية
export async function createBackup(serverId?: string): Promise<string> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFileName = serverId 
      ? `server-${serverId}-${timestamp}.json`
      : `all-servers-${timestamp}.json`
    const backupFilePath = path.join(BACKUP_PATH, backupFileName)
    
    const data = serverId 
      ? { [serverId]: await getServerData(serverId) }
      : await readServersData()
    
    await fs.writeFile(backupFilePath, JSON.stringify(data, null, 2))
    
    console.log(`✅ Backup created: ${backupFileName}`)
    return backupFilePath
  } catch (error) {
    console.error('❌ Failed to create backup:', error)
    throw error
  }
}

// استرداد من نسخة احتياطية
export async function restoreFromBackup(backupFileName: string): Promise<void> {
  try {
    const backupFilePath = path.join(BACKUP_PATH, backupFileName)
    
    if (!existsSync(backupFilePath)) {
      throw new Error(`Backup file not found: ${backupFileName}`)
    }
    
    const backupData = await fs.readFile(backupFilePath, 'utf-8')
    const data = JSON.parse(backupData)
    
    await writeServersData(data)
    
    console.log(`✅ Data restored from backup: ${backupFileName}`)
  } catch (error) {
    console.error('❌ Failed to restore from backup:', error)
    throw error
  }
}

// الحصول على قائمة النسخ الاحتياطية
export async function getBackupsList(): Promise<string[]> {
  try {
    const files = await fs.readdir(BACKUP_PATH)
    return files.filter(file => file.endsWith('.json')).sort().reverse()
  } catch (error) {
    console.error('❌ Failed to get backups list:', error)
    return []
  }
}

// تسجيل التغييرات
export async function logChange(changeLog: ChangeLog): Promise<void> {
  try {
    const logFileName = `changes-${new Date().toISOString().split('T')[0]}.json`
    const logFilePath = path.join(LOGS_PATH, logFileName)
    
    let logs: ChangeLog[] = []
    
    if (existsSync(logFilePath)) {
      const existingLogs = await fs.readFile(logFilePath, 'utf-8')
      logs = JSON.parse(existingLogs)
    }
    
    logs.push(changeLog)
    
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2))
    
    console.log(`📝 Change logged: ${changeLog.action} ${changeLog.section} for server ${changeLog.serverId}`)
  } catch (error) {
    console.error('❌ Failed to log change:', error)
  }
}

// الحصول على سجلات التغييرات
export async function getChangeLogs(serverId?: string, date?: string): Promise<ChangeLog[]> {
  try {
    const logFileName = date 
      ? `changes-${date}.json`
      : `changes-${new Date().toISOString().split('T')[0]}.json`
    const logFilePath = path.join(LOGS_PATH, logFileName)
    
    if (!existsSync(logFilePath)) {
      return []
    }
    
    const logs = await fs.readFile(logFilePath, 'utf-8')
    const allLogs: ChangeLog[] = JSON.parse(logs)
    
    return serverId 
      ? allLogs.filter(log => log.serverId === serverId)
      : allLogs
  } catch (error) {
    console.error('❌ Failed to get change logs:', error)
    return []
  }
}

// توليد معرف فريد
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// تنظيف النسخ الاحتياطية القديمة (الاحتفاظ بآخر 30 نسخة)
export async function cleanupOldBackups(): Promise<void> {
  try {
    const backups = await getBackupsList()
    
    if (backups.length > 30) {
      const oldBackups = backups.slice(30)
      
      for (const backup of oldBackups) {
        const backupPath = path.join(BACKUP_PATH, backup)
        await fs.unlink(backupPath)
        console.log(`🗑️ Deleted old backup: ${backup}`)
      }
    }
  } catch (error) {
    console.error('❌ Failed to cleanup old backups:', error)
  }
}

// تشفير البيانات الحساسة
export function encryptSensitiveData(data: any): any {
  // يمكن إضافة تشفير حقيقي هنا باستخدام crypto
  // هذا مثال بسيط للتوضيح
  if (typeof data === 'string' && data.includes('token')) {
    return Buffer.from(data).toString('base64')
  }
  return data
}

// فك تشفير البيانات الحساسة
export function decryptSensitiveData(data: any): any {
  // فك التشفير المقابل
  if (typeof data === 'string' && data.length > 20) {
    try {
      return Buffer.from(data, 'base64').toString('utf-8')
    } catch {
      return data
    }
  }
  return data
}