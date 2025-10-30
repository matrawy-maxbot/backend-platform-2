const fetch = require('node-fetch');
const logger = require('./logger');

class SyncSystem {
  constructor(botInstance) {
    this.botInstance = botInstance;
    this.pollingInterval = null;
    this.heartbeatInterval = null;
    this.updateQueue = [];
    this.isProcessingQueue = false;
    this.lastSyncTimestamp = {}; // تتبع آخر تزامن لكل سيرفر
    this.connectionStatus = 'disconnected';
    
    // إعدادات التزامن
    this.config = {
      pollingIntervalMs: 60000, // دقيقة واحدة
      heartbeatIntervalMs: 30000, // 30 ثانية
      maxRetries: 3,
      retryDelayMs: 5000,
      queueProcessDelayMs: 1000
    };
    
    console.log('🔄 Sync System initialized');
  }
  
  // بدء نظام التزامن
  start() {
    logger.info('Starting Sync System...');
    
    // بدء نظام polling
    this.startPolling();
    
    // بدء نظام heartbeat
    this.startHeartbeat();
    
    // بدء معالج queue
    this.startQueueProcessor();
    
    logger.success('Sync System started successfully');
  }
  
  // إيقاف نظام التزامن
  stop() {
    console.log('🛑 Stopping Sync System...');
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    this.isProcessingQueue = false;
    console.log('✅ Sync System stopped');
  }
  
  // بدء نظام polling للتحقق من التحديثات
  startPolling() {
    this.pollingInterval = setInterval(async () => {
      try {
        await this.checkForUpdates();
      } catch (error) {
        logger.error('Polling error occurred', error);
      }
    }, this.config.pollingIntervalMs);
    
    logger.info(`Polling started - checking every ${this.config.pollingIntervalMs / 1000} seconds`);
  }
  
  // بدء نظام heartbeat
  startHeartbeat() {
    logger.info('Starting heartbeat system...');
    
    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.sendHeartbeat();
      } catch (error) {
        logger.error('Heartbeat error occurred', error);
      }
    }, this.config.heartbeatIntervalMs);
    
    logger.info(`Heartbeat started - every ${this.config.heartbeatIntervalMs / 1000} seconds`);
  }
  
  // التحقق من التحديثات لجميع السيرفرات
  async checkForUpdates() {
    try {
      console.log('🔍 Checking for updates...');
      
      // الحصول على قائمة السيرفرات المتصل بها البوت
      const guilds = this.botInstance.client?.guilds?.cache;
      if (!guilds) {
        console.log('⚠️ No guilds found or bot not ready');
        return;
      }
      
      logger.logSync('polling', 'all-servers', 'all', 'started', { serverCount: guilds.size });
      
      // التحقق من التحديثات لكل سيرفر
      for (const [guildId, guild] of guilds) {
        await this.checkServerUpdates(guildId);
      }
      
      logger.logSync('polling', 'all-servers', 'all', 'success', { serverCount: guilds.size });
      
    } catch (error) {
      logger.logSync('polling', 'all-servers', 'all', 'failed', { error: error.message });
      console.error('❌ Error during polling check:', error);
    }
  }
  
  // التحقق من تحديثات سيرفر محدد
  async checkServerUpdates(guildId) {
    try {
      logger.logSync('polling', guildId, 'all', 'started');
      
      const apiUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/server-settings/${guildId}/last-updated`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'x-bot-request': 'true',
          'User-Agent': 'Discord-Bot-Sync/1.0'
        }
      });
      
      if (response.ok) {
        const { lastUpdated, sections } = await response.json();
        const lastSync = this.lastSyncTimestamp[guildId] || 0;
        
        // إذا كان هناك تحديث جديد
        if (lastUpdated > lastSync) {
          logger.logSync('polling', guildId, 'all', 'success', { 
            newUpdates: true, 
            sections: sections,
            lastUpdate: lastUpdated 
          });
          
          // إضافة التحديث إلى queue
          this.addToQueue({
            type: 'full_sync',
            guildId,
            timestamp: Date.now(),
            sections
          });
          
          // تحديث timestamp آخر تزامن
          this.lastSyncTimestamp[guildId] = lastUpdated;
        } else {
          logger.logSync('polling', guildId, 'all', 'skipped', { reason: 'no-new-updates' });
        }
      }
      
    } catch (error) {
      logger.logSync('polling', guildId, 'all', 'failed', { error: error.message });
      console.error(`❌ Error checking updates for server ${guildId}:`, error);
    }
  }
  
  // إرسال heartbeat للموقع
  async sendHeartbeat() {
    try {
      logger.logSync('heartbeat', 'bot', 'status', 'started');
      
      const apiUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/bot-heartbeat`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bot-request': 'true',
          'Authorization': `Bearer ${process.env.BOT_API_SECRET || 'default-secret'}`
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          status: 'online',
          guildsCount: this.botInstance.client?.guilds?.cache?.size || 0
        })
      });
      
      if (response.ok) {
        this.connectionStatus = 'connected';
        logger.logSync('heartbeat', 'bot', 'status', 'success', { 
          serverCount: this.botInstance.client?.guilds?.cache?.size || 0 
        });
        console.log('💓 Heartbeat sent successfully');
      } else {
        this.connectionStatus = 'error';
        logger.logSync('heartbeat', 'bot', 'status', 'failed', { 
          httpStatus: response.status 
        });
        console.warn('⚠️ Heartbeat failed:', response.status);
      }
      
    } catch (error) {
      this.connectionStatus = 'disconnected';
      logger.logSync('heartbeat', 'bot', 'status', 'failed', { 
        error: error.message 
      });
      console.error('❌ Heartbeat error:', error);
    }
  }
  
  // إضافة تحديث إلى queue
  addToQueue(update) {
    this.updateQueue.push(update);
    console.log(`📥 Added update to queue: ${update.type} for server ${update.guildId}`);
  }
  
  // بدء معالج queue
  startQueueProcessor() {
    const processQueue = async () => {
      if (this.isProcessingQueue || this.updateQueue.length === 0) {
        setTimeout(processQueue, this.config.queueProcessDelayMs);
        return;
      }
      
      this.isProcessingQueue = true;
      
      try {
        const update = this.updateQueue.shift();
        logger.logSync('queue', update.guildId, update.type, 'started');
        await this.processUpdate(update);
        logger.logSync('queue', update.guildId, update.type, 'success');
      } catch (error) {
        logger.error('Error processing queue update', error);
        if (update) {
          logger.logSync('queue', update.guildId, update.type, 'failed', { error: error.message });
        }
      }
      
      this.isProcessingQueue = false;
      setTimeout(processQueue, this.config.queueProcessDelayMs);
    };
    
    processQueue();
    logger.info('Queue processor started');
  }
  
  // معالجة تحديث واحد
  async processUpdate(update) {
    console.log(`⚙️ Processing update: ${update.type} for server ${update.guildId}`);
    
    try {
      switch (update.type) {
        case 'full_sync':
          await this.performFullSync(update.guildId);
          break;
        case 'section_update':
          await this.performSectionUpdate(update.guildId, update.section, update.data);
          break;
        default:
          console.warn(`⚠️ Unknown update type: ${update.type}`);
      }
      
      console.log(`✅ Update processed successfully: ${update.type} for server ${update.guildId}`);
      
    } catch (error) {
      console.error(`❌ Error processing update ${update.type} for server ${update.guildId}:`, error);
    }
  }
  
  // تنفيذ تزامن كامل لسيرفر
  async performFullSync(guildId) {
    console.log(`🔄 Performing full sync for server ${guildId}`);
    
    // مسح cache
    if (this.botInstance.clearServerCache) {
      this.botInstance.clearServerCache(guildId);
    }
    
    // إعادة تحميل الإعدادات
    if (this.botInstance.getServerSettings) {
      const newSettings = await this.botInstance.getServerSettings(guildId);
      console.log(`✅ Settings reloaded for server ${guildId}`);
      
      // تحديث أنظمة فرعية
      await this.updateSubsystems(guildId, newSettings);
    }
  }
  
  // تنفيذ تحديث قسم محدد
  async performSectionUpdate(guildId, section, data) {
    console.log(`🔄 Updating section ${section} for server ${guildId}`);
    
    // مسح cache
    if (this.botInstance.clearServerCache) {
      this.botInstance.clearServerCache(guildId);
    }
    
    // تحديث القسم المحدد
    switch (section) {
      case 'autoReply':
        if (this.botInstance.updateAutoReplySettings) {
          this.botInstance.updateAutoReplySettings(guildId, data);
        }
        break;
      case 'ads':
        if (this.botInstance.updateAdsSettings) {
          await this.botInstance.updateAdsSettings(guildId, data);
        }
        break;
      case 'protection':
        if (this.botInstance.updateProtectionSettings) {
          this.botInstance.updateProtectionSettings(guildId, data);
        }
        break;
      case 'members':
        if (this.botInstance.updateMembersSettings) {
          this.botInstance.updateMembersSettings(guildId, data);
        }
        break;
      default:
        console.log(`⚠️ Unknown section: ${section}`);
    }
  }
  
  // تحديث الأنظمة الفرعية
  async updateSubsystems(guildId, settings) {
    try {
      // تحديث نظام الردود التلقائية
      if (settings.autoReply && this.botInstance.updateAutoReplySettings) {
        this.botInstance.updateAutoReplySettings(guildId, settings.autoReply);
      }
      
      // تحديث نظام الإعلانات
      if (settings.ads && this.botInstance.updateAdsSettings) {
        await this.botInstance.updateAdsSettings(guildId, settings.ads);
      }
      
      // تحديث نظام الحماية
      if (settings.protection && this.botInstance.updateProtectionSettings) {
        this.botInstance.updateProtectionSettings(guildId, settings.protection);
      }
      
      // تحديث إعدادات الأعضاء
      if (settings.members && this.botInstance.updateMembersSettings) {
        this.botInstance.updateMembersSettings(guildId, settings.members);
      }
      
      console.log(`✅ All subsystems updated for server ${guildId}`);
      
    } catch (error) {
      console.error(`❌ Error updating subsystems for server ${guildId}:`, error);
    }
  }
  
  // الحصول على حالة النظام
  getStatus() {
    return {
      connectionStatus: this.connectionStatus,
      queueLength: this.updateQueue.length,
      isProcessingQueue: this.isProcessingQueue,
      lastSyncTimestamps: this.lastSyncTimestamp,
      pollingActive: !!this.pollingInterval,
      heartbeatActive: !!this.heartbeatInterval
    };
  }
}

module.exports = SyncSystem;