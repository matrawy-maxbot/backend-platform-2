const fs = require('fs');
const path = require('path');

// إنشاء مجلد logs إذا لم يكن موجوداً
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
    this.syncLogFile = path.join(logsDir, `sync-${new Date().toISOString().split('T')[0]}.log`);
  }

  // دالة لكتابة log عام
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };

    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}${data ? ' | Data: ' + JSON.stringify(data) : ''}\n`;
    
    // كتابة في الملف
    fs.appendFileSync(this.logFile, logLine);
    
    // طباعة في console حسب المستوى
    switch (level) {
      case 'error':
        console.error(`❌ ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`⚠️ ${message}`, data || '');
        break;
      case 'info':
        console.log(`ℹ️ ${message}`, data || '');
        break;
      case 'success':
        console.log(`✅ ${message}`, data || '');
        break;
      default:
        console.log(`📝 ${message}`, data || '');
    }
  }

  // دالة خاصة لتسجيل أحداث التزامن
  logSync(action, serverId, section, status, details = null) {
    const timestamp = new Date().toISOString();
    const syncEntry = {
      timestamp,
      action, // 'polling', 'webhook', 'heartbeat', 'update'
      serverId,
      section,
      status, // 'started', 'success', 'failed', 'skipped'
      details
    };

    const syncLine = `[${timestamp}] [SYNC] ${action.toUpperCase()} | Server: ${serverId} | Section: ${section} | Status: ${status.toUpperCase()}${details ? ' | Details: ' + JSON.stringify(details) : ''}\n`;
    
    // كتابة في ملف التزامن المخصص
    fs.appendFileSync(this.syncLogFile, syncLine);
    
    // طباعة في console
    const emoji = status === 'success' ? '✅' : status === 'failed' ? '❌' : status === 'started' ? '🔄' : '⏭️';
    console.log(`${emoji} [SYNC] ${action}: ${serverId}/${section} - ${status}`);
  }

  // دوال مساعدة للمستويات المختلفة
  info(message, data) {
    this.log('info', message, data);
  }

  success(message, data) {
    this.log('success', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  // دالة لتنظيف الملفات القديمة (الاحتفاظ بآخر 7 أيام)
  cleanOldLogs() {
    try {
      const files = fs.readdirSync(logsDir);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < sevenDaysAgo) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      console.error('❌ Error cleaning old logs:', error);
    }
  }

  // دالة لقراءة آخر logs
  getRecentLogs(lines = 50) {
    try {
      const data = fs.readFileSync(this.logFile, 'utf8');
      const logLines = data.trim().split('\n');
      return logLines.slice(-lines);
    } catch (error) {
      return [];
    }
  }

  // دالة لقراءة آخر sync logs
  getRecentSyncLogs(lines = 50) {
    try {
      const data = fs.readFileSync(this.syncLogFile, 'utf8');
      const logLines = data.trim().split('\n');
      return logLines.slice(-lines);
    } catch (error) {
      return [];
    }
  }
}

// إنشاء instance واحد للاستخدام في جميع أنحاء التطبيق
const logger = new Logger();

// تنظيف الملفات القديمة عند بدء التشغيل
logger.cleanOldLogs();

module.exports = logger;