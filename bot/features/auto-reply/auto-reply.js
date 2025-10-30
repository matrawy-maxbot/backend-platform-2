// نظام الرد التلقائي للبوت
// Auto Reply System for Discord Bot

// Cache للـ cooldowns لتجنب الإزعاج
const cooldownCache = new Map();
const userUsageCache = new Map();

/**
 * معالجة الرد التلقائي على الرسائل
 * Process auto reply for messages
 * @param {Message} message - الرسالة الواردة
 * @param {Object} settings - إعدادات السيرفر
 */
async function processAutoReply(message, settings) {
  try {
    console.log(`🔍 [AUTO-REPLY] Processing message from ${message.author.tag} in ${message.guild.name}...`);
    console.log(`📋 [AUTO-REPLY] Settings received:`, JSON.stringify(settings?.autoReply, null, 2));
    
    const autoReplySettings = settings.autoReply;
    
    if (!autoReplySettings?.enabled || !autoReplySettings.replies || autoReplySettings.replies.length === 0) {
      console.log(`⚠️ [AUTO-REPLY] Auto reply disabled or no replies configured for server ${message.guild.name}`);
      return { success: false, reason: 'Auto reply disabled or no replies configured' };
    }

    console.log(`🤖 [AUTO-REPLY] Auto reply enabled for server ${message.guild.name}`);
    console.log(`📝 [AUTO-REPLY] Found ${autoReplySettings.replies.length} configured replies`);
    
    const messageContent = message.content.toLowerCase();
    const userId = message.author.id;
    const guildId = message.guild.id;
    
    // البحث عن رد مطابق
    for (const reply of autoReplySettings.replies) {
      if (!reply.enabled) {
        console.log(`⏭️ [AUTO-REPLY] Skipping disabled reply: ${reply.name}`);
        continue;
      }
      
      console.log(`🔍 [AUTO-REPLY] Checking reply: ${reply.name}`);
      
      // فحص المحفزات (triggers)
      const matchedTrigger = reply.triggers.find(trigger => {
        const triggerLower = trigger.toLowerCase().trim(); // إزالة المسافات الإضافية
        return messageContent.includes(triggerLower);
      });
      
      if (!matchedTrigger) {
        console.log(`❌ [AUTO-REPLY] No trigger match for reply: ${reply.name}`);
        continue;
      }
      
      console.log(`✅ [AUTO-REPLY] Trigger matched: "${matchedTrigger}" for reply: ${reply.name}`);
      
      // فحص الشروط
      const conditionsResult = await checkReplyConditions(message, reply);
      if (!conditionsResult.valid) {
        console.log(`❌ [AUTO-REPLY] Conditions not met for reply ${reply.name}: ${conditionsResult.reason}`);
        continue;
      }
      
      // فحص الـ cooldown
      const cooldownResult = checkCooldown(reply, userId, guildId);
      if (!cooldownResult.valid) {
        console.log(`⏰ [AUTO-REPLY] Cooldown active for reply ${reply.name}: ${cooldownResult.reason}`);
        continue;
      }
      
      // فحص حد الاستخدام في الساعة
      const usageResult = checkUsageLimit(reply, userId, guildId, autoReplySettings.maxResponsesPerHour || 10);
      if (!usageResult.valid) {
        console.log(`📊 [AUTO-REPLY] Usage limit reached for reply ${reply.name}: ${usageResult.reason}`);
        continue;
      }
      
      // إرسال الرد
      const sendResult = await sendAutoReply(message, reply);
      if (sendResult.success) {
        // تحديث الـ cooldown والإحصائيات
        updateCooldown(reply, userId, guildId);
        updateUsageCount(reply, userId, guildId);
        
        console.log(`✅ [AUTO-REPLY] Successfully sent reply: ${reply.name}`);
        return { success: true, replyName: reply.name, response: sendResult.response };
      } else {
        console.log(`❌ [AUTO-REPLY] Failed to send reply: ${sendResult.reason}`);
      }
    }
    
    console.log(`ℹ️ [AUTO-REPLY] No matching replies found for message from ${message.author.tag}`);
    return { success: false, reason: 'No matching replies found' };
    
  } catch (error) {
    console.error(`❌ [AUTO-REPLY] Error processing auto reply:`, error.message);
    console.error(`❌ [AUTO-REPLY] Error details:`, error);
    return { success: false, reason: `Error: ${error.message}` };
  }
}

/**
 * فحص شروط الرد التلقائي
 * Check auto reply conditions
 * @param {Message} message - الرسالة
 * @param {Object} reply - إعدادات الرد
 */
async function checkReplyConditions(message, reply) {
  try {
    // فحص القنوات المحددة
    if (reply.channels && reply.channels.length > 0) {
      if (!reply.channels.includes(message.channel.id)) {
        return { valid: false, reason: `Channel ${message.channel.name} not in allowed channels` };
      }
    }
    
    // فحص الرتب المطلوبة
    if (reply.roles && reply.roles.length > 0) {
      const memberRoles = message.member.roles.cache.map(role => role.id);
      const hasRequiredRole = reply.roles.some(roleId => memberRoles.includes(roleId));
      
      if (!hasRequiredRole) {
        return { valid: false, reason: 'User does not have required roles' };
      }
    }
    
    // فحص الشروط الإضافية (يمكن توسيعها لاحقاً)
    if (reply.conditions && reply.conditions.length > 0) {
      for (const condition of reply.conditions) {
        // يمكن إضافة شروط مخصصة هنا
        console.log(`🔍 [AUTO-REPLY] Checking condition: ${condition}`);
      }
    }
    
    return { valid: true };
    
  } catch (error) {
    console.error(`❌ [AUTO-REPLY] Error checking conditions:`, error);
    return { valid: false, reason: `Condition check error: ${error.message}` };
  }
}

/**
 * فحص الـ cooldown
 * Check cooldown for reply
 * @param {Object} reply - إعدادات الرد
 * @param {string} userId - معرف المستخدم
 * @param {string} guildId - معرف السيرفر
 */
function checkCooldown(reply, userId, guildId) {
  // إذا كان الـ cooldown = 0، فلا يوجد cooldown
  const cooldownSeconds = reply.cooldown !== undefined ? reply.cooldown : 5;
  if (cooldownSeconds === 0) {
    return { valid: true };
  }
  
  const cooldownKey = `${guildId}-${reply.id}-${userId}`;
  const lastUsed = cooldownCache.get(cooldownKey);
  
  if (!lastUsed) {
    return { valid: true };
  }
  
  const cooldownMs = cooldownSeconds * 1000; // تحويل إلى ميلي ثانية
  const timeSinceLastUse = Date.now() - lastUsed;
  
  if (timeSinceLastUse < cooldownMs) {
    const remainingTime = Math.ceil((cooldownMs - timeSinceLastUse) / 1000);
    return { valid: false, reason: `Cooldown active, ${remainingTime} seconds remaining` };
  }
  
  return { valid: true };
}

/**
 * فحص حد الاستخدام في الساعة
 * Check usage limit per hour
 * @param {Object} reply - إعدادات الرد
 * @param {string} userId - معرف المستخدم
 * @param {string} guildId - معرف السيرفر
 * @param {number} maxPerHour - الحد الأقصى في الساعة
 */
function checkUsageLimit(reply, userId, guildId, maxPerHour) {
  const usageKey = `${guildId}-${userId}`;
  const userUsage = userUsageCache.get(usageKey) || { count: 0, resetTime: Date.now() + 3600000 }; // ساعة واحدة
  
  // إعادة تعيين العداد إذا انتهت الساعة
  if (Date.now() > userUsage.resetTime) {
    userUsage.count = 0;
    userUsage.resetTime = Date.now() + 3600000;
  }
  
  if (userUsage.count >= maxPerHour) {
    const resetIn = Math.ceil((userUsage.resetTime - Date.now()) / 60000); // بالدقائق
    return { valid: false, reason: `Usage limit reached (${maxPerHour}/hour), resets in ${resetIn} minutes` };
  }
  
  return { valid: true };
}

/**
 * إرسال الرد التلقائي
 * Send auto reply
 * @param {Message} message - الرسالة الأصلية
 * @param {Object} reply - إعدادات الرد
 */
async function sendAutoReply(message, reply) {
  try {
    if (!reply.responses || reply.responses.length === 0) {
      return { success: false, reason: 'No responses configured' };
    }
    
    // اختيار رد عشوائي من القائمة
    const randomResponse = reply.responses[Math.floor(Math.random() * reply.responses.length)];
    
    // معالجة المتغيرات في الرد
    let processedResponse = randomResponse
      .replace(/{user}/g, `<@${message.author.id}>`)
      .replace(/{server}/g, message.guild.name)
      .replace(/{channel}/g, `<#${message.channel.id}>`)
      .replace(/{memberCount}/g, message.guild.memberCount.toString());
    
    // إرسال الرد
    const sentMessage = await message.reply(processedResponse);
    
    console.log(`📤 [AUTO-REPLY] Sent response: "${processedResponse}"`);
    
    return { success: true, response: processedResponse, messageId: sentMessage.id };
    
  } catch (error) {
    console.error(`❌ [AUTO-REPLY] Error sending reply:`, error);
    return { success: false, reason: `Send error: ${error.message}` };
  }
}

/**
 * تحديث الـ cooldown
 * Update cooldown cache
 * @param {Object} reply - إعدادات الرد
 * @param {string} userId - معرف المستخدم
 * @param {string} guildId - معرف السيرفر
 */
function updateCooldown(reply, userId, guildId) {
  const cooldownKey = `${guildId}-${reply.id}-${userId}`;
  cooldownCache.set(cooldownKey, Date.now());
}

/**
 * تحديث عداد الاستخدام
 * Update usage count
 * @param {Object} reply - إعدادات الرد
 * @param {string} userId - معرف المستخدم
 * @param {string} guildId - معرف السيرفر
 */
function updateUsageCount(reply, userId, guildId) {
  const usageKey = `${guildId}-${userId}`;
  const userUsage = userUsageCache.get(usageKey) || { count: 0, resetTime: Date.now() + 3600000 };
  
  userUsage.count++;
  userUsageCache.set(usageKey, userUsage);
}

/**
 * التحقق من صحة إعدادات الرد التلقائي
 * Validate auto reply settings
 * @param {Guild} guild - السيرفر
 * @param {Object} replySettings - إعدادات الرد
 */
function validateAutoReplySettings(guild, replySettings) {
  const result = {
    valid: false,
    errors: [],
    warnings: []
  };

  if (!replySettings) {
    result.errors.push('No auto reply settings provided');
    return result;
  }

  if (!replySettings.replies || !Array.isArray(replySettings.replies)) {
    result.errors.push('No replies array found');
    return result;
  }

  // فحص كل رد
  replySettings.replies.forEach((reply, index) => {
    if (!reply.triggers || reply.triggers.length === 0) {
      result.warnings.push(`Reply ${index + 1}: No triggers defined`);
    }
    
    if (!reply.responses || reply.responses.length === 0) {
      result.warnings.push(`Reply ${index + 1}: No responses defined`);
    }
    
    // فحص القنوات المحددة
    if (reply.channels && reply.channels.length > 0) {
      reply.channels.forEach(channelId => {
        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
          result.warnings.push(`Reply ${index + 1}: Channel ${channelId} not found`);
        }
      });
    }
    
    // فحص الرتب المحددة
    if (reply.roles && reply.roles.length > 0) {
      reply.roles.forEach(roleId => {
        const role = guild.roles.cache.get(roleId);
        if (!role) {
          result.warnings.push(`Reply ${index + 1}: Role ${roleId} not found`);
        }
      });
    }
  });

  if (result.errors.length === 0) {
    result.valid = true;
  }

  return result;
}

/**
 * تنظيف الـ cache القديم
 * Clean old cache entries
 */
function cleanupCache() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 ساعة
  
  // تنظيف cooldown cache
  for (const [key, timestamp] of cooldownCache.entries()) {
    if (now - timestamp > maxAge) {
      cooldownCache.delete(key);
    }
  }
  
  // تنظيف usage cache
  for (const [key, usage] of userUsageCache.entries()) {
    if (now > usage.resetTime + maxAge) {
      userUsageCache.delete(key);
    }
  }
  
  console.log(`🧹 [AUTO-REPLY] Cache cleanup completed`);
}

// تشغيل تنظيف الـ cache كل ساعة
setInterval(cleanupCache, 60 * 60 * 1000);

module.exports = {
  processAutoReply,
  validateAutoReplySettings,
  cleanupCache
};