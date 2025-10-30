// نظام الحماية للبوت
// Protection System for Discord Bot

// Cache للـ cooldowns والإحصائيات
const protectionCache = new Map();
const violationCache = new Map();
const messageHistory = new Map();

const { checkBotManagement } = require('./components/botManagement/checkBotManagement');
const { checkBadWords } = require('./components/badWords/checkBadWords');
const { checkLinks } = require('./components/links/checkLinks');
const { checkImageAttachments } = require('./components/images/checkImageAttachments');
const { applyBotPunishment } = require('./components/botManagement/applyBotPunishment');
const { checkModeration } = require('./components/moderation/checkModeration');
const { checkAntiSpam } = require('./components/botManagement/checkAntiSpam');
const { checkChannelContent } = require('./components/channelContent/checkChannelContent');

/**
 * معالجة نظام الحماية للرسائل
 * Process protection system for messages
 * @param {Message} message - الرسالة الواردة
 * @param {Object} settings - إعدادات السيرفر
 */
async function processProtection(message, settings) {
  try {
    console.log(`🛡️ [PROTECTION] ===== STARTING PROTECTION PROCESSING =====`);
    console.log(`🛡️ [PROTECTION] Processing message from ${message.author.tag} in ${message.guild.name}...`);
    console.log(`🛡️ [PROTECTION] Message content: "${message.content}"`);
    console.log(`📋 [PROTECTION] Settings received:`, JSON.stringify(settings?.protection, null, 2));
    
    const protectionSettings = settings.protection;
    
    if (!protectionSettings) {
      console.log(`⚠️ [PROTECTION] No protection settings found for server ${message.guild.name}`);
      return { success: true, reason: 'No protection settings' };
    }

    console.log(`🛡️ [PROTECTION] Protection system processing for server ${message.guild.name}`);
    
    const userId = message.author.id;
    const guildId = message.guild.id;
    const messageContent = message.content.toLowerCase();

    console.log("\n\n|------------------------------------------|\n\n", "protectionSettings.channels : \n\n", protectionSettings.channels , "\n\n|------------------------------------------|\n\n");
    
    // فحص إدارة البوتات
    if (protectionSettings.botManagement?.enabled) {
      const botResult = await checkBotManagement(message, protectionSettings.botManagement);
      if (!botResult.success) {
        return botResult;
      }
    }
    
    // فحص الكلمات السيئة
    if (protectionSettings.badWords?.enabled) {
      const badWordsResult = await checkBadWords(message, protectionSettings.badWords);
      if (!badWordsResult.success) {
        return badWordsResult;
      }
    }
    
    // فحص الروابط
    if (protectionSettings.links?.enabled) {
      const linksResult = await checkLinks(message, protectionSettings.links);
      if (!linksResult.success) {
        return linksResult;
      }
    }
    
    // فحص الإشراف والعقوبات
    if (protectionSettings.moderation?.enabled) {
      const moderationResult = await checkModeration(message, protectionSettings.moderation);
      if (!moderationResult.success) {
        return moderationResult;
      }
    }
    
    // فحص الرسائل المكررة والسبام
    if (protectionSettings.antiSpam?.enabled) {
      const spamResult = await checkAntiSpam(message, protectionSettings.antiSpam);
      if (!spamResult.success) {
        return spamResult;
      }
    }
    
    // فحص الصور والمرفقات
    if (protectionSettings.images?.enabled === true) {
      console.log(`🖼️ [PROTECTION] Image protection is ENABLED, checking attachments...`);
      const imageResult = await checkImageAttachments(message, protectionSettings.images);
      if (!imageResult.success) {
        return imageResult;
      }
    } else {
      console.log(`🖼️ [PROTECTION] Image protection is DISABLED, skipping image checks`);
    }
    
    // فحص محتوى القنوات
    if (protectionSettings.channels?.enabled) {
      console.log(`📋 [PROTECTION] Channel content protection is ENABLED, checking content...`);
      const channelResult = await checkChannelContent(message, protectionSettings.channels, message.guild);
      if (!channelResult.success) {
        return channelResult;
      }
    } else {
      console.log(`📋 [PROTECTION] Channel content protection is DISABLED, skipping channel checks`);
    }
    
    console.log(`✅ [PROTECTION] Message passed all protection checks`);
    return { success: true, reason: 'Message passed all checks' };
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error processing protection:`, error.message);
    console.error(`❌ [PROTECTION] Error details:`, error);
    return { success: false, reason: `Error: ${error.message}` };
  }
}

/**
 * تنظيف الذاكرة المؤقتة
 * Clean up cache
 */
function cleanupProtectionCache() {
  try {
    const now = Date.now();
    const maxAge = 3600000; // ساعة واحدة
    
    // تنظيف تاريخ الرسائل
    for (const [key, messages] of messageHistory.entries()) {
      const filteredMessages = messages.filter(msg => now - msg.timestamp < maxAge);
      if (filteredMessages.length === 0) {
        messageHistory.delete(key);
      } else {
        messageHistory.set(key, filteredMessages);
      }
    }
    
    // تنظيف cache الانتهاكات
    for (const [key, violation] of violationCache.entries()) {
      if (now - violation.timestamp > maxAge) {
        violationCache.delete(key);
      }
    }
    
    console.log(`🧹 [PROTECTION] Cache cleanup completed`);
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error during cache cleanup:`, error);
  }
}

// تنظيف الذاكرة كل ساعة
setInterval(cleanupProtectionCache, 3600000);

/**
 * تنظيف cache الانتهاكات لمستخدم معين
 * Clean violation cache for specific user
 * @param {string} userId - معرف المستخدم
 * @param {string} guildId - معرف السيرفر
 */
function cleanupUserViolationCache(userId, guildId) {
  try {
    let cleanedCount = 0;
    
    // تنظيف violation cache للمستخدم
    for (const [key, violation] of violationCache.entries()) {
      if (key.includes(userId) && key.includes(guildId)) {
        violationCache.delete(key);
        cleanedCount++;
      }
    }
    
    // تنظيف message history للمستخدم
    for (const [key, messages] of messageHistory.entries()) {
      if (key.includes(userId) && key.includes(guildId)) {
        messageHistory.delete(key);
        cleanedCount++;
      }
    }
    
    // تنظيف protection cache للمستخدم
    for (const [key, data] of protectionCache.entries()) {
      if (key.includes(userId) && key.includes(guildId)) {
        protectionCache.delete(key);
        cleanedCount++;
      }
    }
    
    console.log(`🧹 [PROTECTION] Cleaned ${cleanedCount} cache entries for user ${userId} in server ${guildId}`);
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error cleaning user violation cache:`, error);
  }
}

/**
 * الحصول على إحصائيات الحماية
 * Get protection statistics
 * @param {string} guildId - معرف السيرفر
 */
function getProtectionStats(guildId) {
  try {
    const stats = {
      totalViolations: 0,
      recentViolations: 0,
      blockedMessages: 0,
      kickedUsers: 0,
      bannedUsers: 0
    };
    
    const now = Date.now();
    const recentTime = 24 * 60 * 60 * 1000; // 24 ساعة
    
    for (const [key, violation] of violationCache.entries()) {
      if (key.startsWith(guildId)) {
        stats.totalViolations++;
        if (now - violation.timestamp < recentTime) {
          stats.recentViolations++;
        }
        
        switch (violation.action) {
          case 'delete':
            stats.blockedMessages++;
            break;
          case 'kick':
            stats.kickedUsers++;
            break;
          case 'ban':
            stats.bannedUsers++;
            break;
        }
      }
    }
    
    return stats;
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error getting protection stats:`, error);
    return null;
  }
}

// تصدير الدوال
module.exports = {
  processProtection,
  cleanupProtectionCache,
  cleanupUserViolationCache,
  getProtectionStats,
  applyBotPunishment
};