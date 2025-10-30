const { applyPunishment } = require('../applyPunishment');

/**
 * فحص مكافحة السبام
 * Check anti-spam
 * @param {Message} message - الرسالة
 * @param {Object} antiSpamSettings - إعدادات مكافحة السبام
 */
async function checkAntiSpam(message, antiSpamSettings) {
  try {
    const userId = message.author.id;
    const guildId = message.guild.id;
    const userKey = `${guildId}-${userId}`;
    
    // التحقق من وجود مرفقات صور
    const hasImageAttachments = message.attachments.some(attachment => 
      attachment.contentType && attachment.contentType.startsWith('image/')
    );
    
    // تجاهل الرسائل التي تحتوي على صور من فحص السبام
    if (hasImageAttachments) {
      console.log(`🖼️ [PROTECTION] Skipping anti-spam check for message with image attachments`);
      return { success: true };
    }
    
    // الحصول على تاريخ الرسائل للمستخدم (النصية فقط)
    let userMessages = messageHistory.get(userKey) || [];
    const now = Date.now();
    const timeWindow = 60000; // دقيقة واحدة
    
    // تنظيف الرسائل القديمة
    userMessages = userMessages.filter(msg => now - msg.timestamp < timeWindow);
    
    // إضافة الرسالة الحالية (فقط إذا كانت تحتوي على نص)
    if (message.content.trim().length > 0) {
      userMessages.push({
        content: message.content,
        timestamp: now,
        messageId: message.id
      });
    }
    
    messageHistory.set(userKey, userMessages);
    
    // فحص حد الرسائل النصية فقط
    const messageLimit = antiSpamSettings.messageLimit || 5;
    if (userMessages.length > messageLimit) {
      console.log(`📢 [PROTECTION] Text spam detected from ${message.author.tag}: ${userMessages.length} text messages in 1 minute`);
      
      // حذف الرسائل الزائدة
      const excessMessages = userMessages.slice(messageLimit);
      for (const excessMsg of excessMessages) {
        try {
          const msgToDelete = await message.channel.messages.fetch(excessMsg.messageId);
          await msgToDelete.delete();
        } catch (error) {
          console.error(`❌ [PROTECTION] Failed to delete spam message:`, error);
        }
      }
      
      // تطبيق العقوبة
      const punishment = antiSpamSettings.action || 'mute';
      
      // فحص القنوات المسموحة لعقوبات الطرد والباند
      if ((punishment === 'kick' || punishment === 'ban') && antiSpamSettings.whitelistChannels && antiSpamSettings.whitelistChannels.length > 0) {
        const currentChannelId = message.channel.id;
        if (antiSpamSettings.whitelistChannels.includes(currentChannelId)) {
          console.log(`✅ [PROTECTION] Channel "${message.channel.name}" is whitelisted for ${punishment}, skipping punishment`);
          return { success: true, reason: `Channel whitelisted for ${punishment}` };
        }
      }
      
      const actionResult = await applyPunishment(message, punishment, 'Text spam detected');
      
      return { 
        success: false, 
        reason: `Text spam detected: ${userMessages.length} messages in 1 minute`, 
        action: punishment,
        details: actionResult
      };
    }
    
    return { success: true };
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error in anti-spam check:`, error);
    return { success: true }; // لا نوقف المعالجة بسبب خطأ في فحص السبام
  }
}

module.exports = {checkAntiSpam};