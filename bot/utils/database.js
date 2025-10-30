const fs = require('fs').promises;
const path = require('path');
const { existsSync } = require('fs');
const cron = require('node-cron');

// مسار قاعدة البيانات
const DB_PATH = path.join(process.cwd(), 'data');
const SERVERS_DB = path.join(DB_PATH, 'servers.json');

const LOGS_PATH = path.join(DB_PATH, 'logs');

// متغير لتتبع حالة المجدول
let schedulerInitialized = false;

// إنشاء المجلدات المطلوبة
async function initializeDatabase() {
  try {
    // إنشاء مجلد البيانات
    if (!existsSync(DB_PATH)) {
      await fs.mkdir(DB_PATH, { recursive: true });
    }
    

    // إنشاء مجلد السجلات
    if (!existsSync(LOGS_PATH)) {
      await fs.mkdir(LOGS_PATH, { recursive: true });
    }
    
    // إنشاء ملف قاعدة البيانات إذا لم يكن موجوداً
    if (!existsSync(SERVERS_DB)) {
      await fs.writeFile(SERVERS_DB, JSON.stringify({}, null, 2));
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

// قراءة جميع بيانات السيرفرات
async function readServersData() {
  try {
    await initializeDatabase();
    const data = await fs.readFile(SERVERS_DB, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to read servers data:', error);
    return {};
  }
}

// كتابة جميع بيانات السيرفرات
async function writeServersData(data) {
  try {
    await initializeDatabase();
    await fs.writeFile(SERVERS_DB, JSON.stringify(data, null, 2));
    console.log('✅ Servers data saved successfully');
  } catch (error) {
    console.error('❌ Failed to write servers data:', error);
    throw error;
  }
}

// الحصول على بيانات سيرفر محدد
async function getServerData(serverId) {
  try {
    console.log(`🔍 Getting server data for: ${serverId}`);
    console.log(`📁 Database path: ${SERVERS_DB}`);
    const allData = await readServersData();
    console.log(`📊 Total servers in database: ${Object.keys(allData).length}`);
    console.log(`🔑 Available server IDs: ${Object.keys(allData).slice(0, 5).join(', ')}...`);
    const serverData = allData[serverId];
    console.log(`📋 Server ${serverId} found: ${!!serverData}`);
    return serverData || null;
  } catch (error) {
    console.error(`❌ Failed to get server data for ${serverId}:`, error);
    return null;
  }
}

// حفظ بيانات سيرفر محدد
async function saveServerData(serverId, data, userId) {
  try {
    const allData = await readServersData();
    const existingData = allData[serverId];
    
    // إنشاء البيانات الجديدة
    const newData = {
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
        botManagement: {
          enabled: false,
          disallowBots: false,
          deleteRepeatedMessages: false,
          whitelistChannels: []
        },
        antiSpam: {
          enabled: false,
          maxMessages: 5,
          timeWindow: 60,
          action: 'mute'
        },
        badWords: {
          enabled: false,
          words: [],
          action: 'delete'
        },
        links: {
          enabled: false,
          allowedDomains: [],
          action: 'delete'
        },
        moderation: {
          enabled: false,
          autoMute: false,
          autoKick: false,
          autoBan: false
        },
        images: {
          enabled: false,
          maxSize: 8,
          allowedTypes: ['png', 'jpg', 'jpeg', 'gif']
        },
        spamProtection: true,
        raidProtection: false,
        autoModeration: true
      },

      createdAt: existingData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
      ...existingData,
      ...data
    };
    
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
    });
    
    // حفظ البيانات
    allData[serverId] = newData;
    await writeServersData(allData);
    

    return newData;
  } catch (error) {
    console.error(`❌ Failed to save server data for ${serverId}:`, error);
    throw error;
  }
}

// تحديث قسم معين من بيانات السيرفر
async function updateServerSection(serverId, section, data, userId) {
  try {
    const allData = await readServersData();
    const existingData = allData[serverId];
    
    if (!existingData) {
      throw new Error(`Server ${serverId} not found`);
    }
    
    const oldSectionData = existingData[section];
    const newSectionData = { ...oldSectionData, ...data };
    
    // تحديث القسم
    existingData[section] = newSectionData;
    existingData.updatedAt = new Date().toISOString();
    existingData.updatedBy = userId;
    
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
    });
    
    // حفظ البيانات
    allData[serverId] = existingData;
    await writeServersData(allData);
    

    return newSectionData;
  } catch (error) {
    console.error(`❌ Failed to update server section ${section} for ${serverId}:`, error);
    throw error;
  }
}



// تسجيل التغييرات
async function logChange(changeLog) {
  try {
    const logFileName = `changes-${new Date().toISOString().split('T')[0]}.json`;
    const logFilePath = path.join(LOGS_PATH, logFileName);
    
    let logs = [];
    
    if (existsSync(logFilePath)) {
      const existingLogs = await fs.readFile(logFilePath, 'utf-8');
      logs = JSON.parse(existingLogs);
    }
    
    logs.push(changeLog);
    
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));
    
    console.log(`📝 Change logged: ${changeLog.action} ${changeLog.section} for server ${changeLog.serverId}`);
  } catch (error) {
    console.error('❌ Failed to log change:', error);
  }
}

// الحصول على سجلات التغييرات
async function getChangeLogs(serverId, date) {
  try {
    const logFileName = date 
      ? `changes-${date}.json`
      : `changes-${new Date().toISOString().split('T')[0]}.json`;
    const logFilePath = path.join(LOGS_PATH, logFileName);
    
    if (!existsSync(logFilePath)) {
      return [];
    }
    
    const logs = await fs.readFile(logFilePath, 'utf-8');
    const allLogs = JSON.parse(logs);
    
    return serverId 
      ? allLogs.filter(log => log.serverId === serverId)
      : allLogs;
  } catch (error) {
    console.error('❌ Failed to get change logs:', error);
    return [];
  }
}

// توليد معرف فريد
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}





// فحص صحة البيانات
async function performDataHealthCheck() {
  try {
    const allServers = await readServersData();
    const serverCount = Object.keys(allServers).length;
    
    console.log(`📊 Health Check Results:`);
    console.log(`   - Total servers: ${serverCount}`);
    
    // فحص كل سيرفر
    let healthyServers = 0;
    let corruptedServers = 0;
    
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
          healthyServers++;
        } else {
          console.warn(`⚠️ Server ${serverId} has corrupted data structure`);
          corruptedServers++;
        }
      } catch (error) {
        console.error(`❌ Error checking server ${serverId}:`, error);
        corruptedServers++;
      }
    }
    
    console.log(`   - Healthy servers: ${healthyServers}`);
    console.log(`   - Corrupted servers: ${corruptedServers}`);
    
    if (corruptedServers > 0) {
      console.warn(`⚠️ Found ${corruptedServers} servers with data issues`);
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
  readServersData,
  writeServersData,
  getServerData,
  saveServerData,
  updateServerSection,

  logChange,
  getChangeLogs,

  performDataHealthCheck
};