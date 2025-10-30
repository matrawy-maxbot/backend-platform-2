import cron from 'node-cron'
import { readServersData } from './database'

// متغير لتتبع حالة المجدول
let schedulerInitialized = false

// تهيئة المجدول
export function initializeScheduler() {
  if (schedulerInitialized) {
    console.log('⚠️ Scheduler already initialized')
    return
  }

  try {


    // فحص صحة البيانات كل 6 ساعات
    cron.schedule('0 */6 * * *', async () => {
      try {
        console.log('🔍 Starting data health check...')
        await performDataHealthCheck()
        console.log('✅ Data health check completed')
      } catch (error) {
        console.error('❌ Data health check failed:', error)
      }
    }, {
      scheduled: true,
      timezone: 'UTC'
    })

    schedulerInitialized = true
    console.log('✅ Scheduler initialized successfully')
    console.log('📅 Scheduled tasks:')
    console.log('   - Health check: Every 6 hours')

  } catch (error) {
    console.error('❌ Failed to initialize scheduler:', error)
  }
}

// إيقاف المجدول
export function stopScheduler() {
  try {
    cron.getTasks().forEach((task, name) => {
      task.stop()
      console.log(`🛑 Stopped task: ${name}`)
    })
    
    schedulerInitialized = false
    console.log('✅ Scheduler stopped successfully')
  } catch (error) {
    console.error('❌ Failed to stop scheduler:', error)
  }
}

// الحصول على حالة المجدول
export function getSchedulerStatus() {
  const tasks = cron.getTasks()
  const taskStatus = Array.from(tasks.entries()).map(([name, task]) => ({
    name,
    running: task.running,
    scheduled: task.scheduled
  }))

  return {
    initialized: schedulerInitialized,
    totalTasks: tasks.size,
    tasks: taskStatus
  }
}

// فحص صحة البيانات
async function performDataHealthCheck() {
  try {
    const allServers = await readServersData()
    const serverCount = Object.keys(allServers).length
    
    console.log(`📊 Health Check Results:`)
    console.log(`   - Total servers: ${serverCount}`)
    
    // فحص كل سيرفر
    let healthyServers = 0
    let corruptedServers = 0
    
    for (const [serverId, serverData] of Object.entries(allServers)) {
      try {
        // فحص البنية الأساسية للبيانات
        if (
          serverData &&
          typeof serverData === 'object' &&
          serverData.id === serverId &&
          serverData.autoReply &&
          serverData.members &&
          serverData.protection
        ) {
          healthyServers++
        } else {
          console.warn(`⚠️ Server ${serverId} has corrupted data structure`)
          corruptedServers++
        }
      } catch (error) {
        console.error(`❌ Error checking server ${serverId}:`, error)
        corruptedServers++
      }
    }
    
    console.log(`   - Healthy servers: ${healthyServers}`)
    console.log(`   - Corrupted servers: ${corruptedServers}`)
    
    if (corruptedServers > 0) {
      console.warn(`⚠️ Found ${corruptedServers} servers with data issues`)
      // يمكن إضافة آلية إصلاح تلقائي هنا
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error)
    throw error
  }
}

// تشغيل فحص صحة فوري
export async function runImmediateHealthCheck() {
  try {
    console.log('🔍 Running immediate health check...')
    await performDataHealthCheck()
    console.log('✅ Immediate health check completed')
  } catch (error) {
    console.error('❌ Immediate health check failed:', error)
    throw error
  }
}