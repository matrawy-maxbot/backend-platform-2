const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// متغير لتخزين مرجع للبوت الرئيسي
let botInstance = null;

// دالة لتعيين مرجع البوت
function setBotInstance(bot) {
  botInstance = bot;
}

// دالة لمعالجة تحديثات الأقسام المختلفة
async function handleSectionUpdate(serverId, section, data, botInstance) {
  try {
    logger.logSync('webhook', serverId, section, 'started');
    
    switch (section) {
      case 'autoReply':
        if (botInstance.updateAutoReplySettings) {
          botInstance.updateAutoReplySettings(serverId, data);
          console.log(`✅ Auto-reply settings updated for server: ${serverId}`);
        }
        break;
        
      case 'ads':
        if (botInstance.updateAdsSettings) {
          await botInstance.updateAdsSettings(serverId, data);
          console.log(`✅ Ads settings updated for server: ${serverId}`);
        }
        break;
        
      case 'protection':
        if (botInstance.updateProtectionSettings) {
          // Map dashboard field names to bot field names
          const mappedData = { ...data };
          if (mappedData.images && mappedData.images.channels) {
            mappedData.images.pictureChannels = mappedData.images.channels;
            delete mappedData.images.channels;
          }
          
          botInstance.updateProtectionSettings(serverId, mappedData);
          console.log(`✅ Protection settings updated for server: ${serverId}`);
          console.log(`📋 Mapped data:`, JSON.stringify(mappedData, null, 2));
        }
        break;
        
      case 'members':
        if (botInstance.updateMembersSettings) {
          botInstance.updateMembersSettings(serverId, data);
          console.log(`✅ Members settings updated for server: ${serverId}`);
        }
        break;
        
      case 'backup':
        if (botInstance.updateBackupSettings) {
          botInstance.updateBackupSettings(serverId, data);
          console.log(`✅ Backup settings updated for server: ${serverId}`);
        }
        break;
        
      case 'welcome':
        if (botInstance.updateWelcomeSettings) {
          botInstance.updateWelcomeSettings(serverId, data);
          console.log(`✅ Welcome settings updated for server: ${serverId}`);
        }
        break;
        
      default:
          logger.warn(`Unknown section type: ${section} for server ${serverId}`);
          // حتى لو كان القسم غير معروف، نقوم بمسح cache
          if (botInstance.clearServerCache) {
            botInstance.clearServerCache(serverId);
          }
      }
      
      logger.logSync('webhook', serverId, section, 'success');
      
    } catch (error) {
      logger.logSync('webhook', serverId, section, 'failed', { error: error.message });
      throw error;
    }
  }

// API endpoint لاستقبال إشعارات تحديث الإعدادات
router.post('/settings-update', async (req, res) => {
  try {
    const { serverId, section, data, timestamp } = req.body;
    
    // التحقق من وجود البيانات المطلوبة
    if (!serverId || !section || !data) {
      logger.warn('Settings update request missing required fields', { serverId, section, data });
      return res.status(400).json({ 
        error: 'Missing required fields: serverId, section, data' 
      });
    }
    
    // التحقق من وجود البوت
    if (!botInstance) {
      logger.error('Bot instance not available for settings update');
      return res.status(503).json({ 
        success: false, 
        error: 'Bot instance not available' 
      });
    }
    
    logger.info(`Received settings update notification:`, {
      serverId,
      section,
      timestamp: new Date(timestamp).toISOString()
    });
    
    // تحديث cache الإعدادات في البوت
    if (botInstance && botInstance.clearServerCache) {
      botInstance.clearServerCache(serverId);
      logger.success(`Cache cleared for server: ${serverId}`);
    }
    
    // إعادة تحميل الإعدادات الجديدة
    if (botInstance && botInstance.getServerSettings) {
      try {
        const newSettings = await botInstance.getServerSettings(serverId);
        logger.success(`New settings loaded for server: ${serverId}`);
        
        // معالجة التحديثات حسب نوع القسم
        await handleSectionUpdate(serverId, section, data, botInstance);
        
        logger.success(`Section '${section}' updated successfully for server: ${serverId}`);
      } catch (error) {
        logger.error(`Error reloading settings for server ${serverId}`, error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to reload server settings' 
        });
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Settings updated successfully',
      serverId,
      section,
      timestamp
    });
    
  } catch (error) {
    logger.error('Error handling settings update', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// API endpoint للتحقق من حالة النظام
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: Date.now(),
    botConnected: !!botInstance
  });
});

module.exports = { router, setBotInstance };