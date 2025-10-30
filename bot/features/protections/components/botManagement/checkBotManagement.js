// تخزين تاريخ الرسائل للمستخدمين
const messageHistory = new Map();

/**
 * فحص إدارة البوتات
 * Check bot management
 * @param {Message} message - الرسالة
 * @param {Object} botSettings - إعدادات البوتات
 */
async function checkBotManagement(message, botSettings) {
  try {
    // فحص منع دخول البوتات
    if (botSettings.disallowBots && message.author.bot) {
      console.log(`🤖 [PROTECTION] Bot detected: ${message.author.tag}`);
      
      // فحص القنوات المسموحة لطرد البوتات
      if (botSettings.whitelistChannels && botSettings.whitelistChannels.length > 0) {
        const currentChannelId = message.channel.id;
        if (botSettings.whitelistChannels.includes(currentChannelId)) {
          console.log(`✅ [PROTECTION] Channel "${message.channel.name}" is whitelisted for bot kicks, allowing bot`);
          return { success: true, reason: 'Channel whitelisted for bot kicks' };
        }
      }
      
      // طرد البوت إذا كان مسموح
      if (message.guild.members.me.permissions.has('KICK_MEMBERS')) {
        try {
          await message.member.kick('Bot not allowed by protection system');
          console.log(`👢 [PROTECTION] Kicked bot: ${message.author.tag}`);
          return { success: false, reason: 'Bot kicked from server', action: 'kick' };
        } catch (error) {
          console.error(`❌ [PROTECTION] Failed to kick bot:`, error);
        }
      }
      
      return { success: false, reason: 'Bot message blocked', action: 'block' };
    }
    
    // فحص الرسائل المكررة
    if (botSettings.deleteRepeatedMessages) {
      // تجاهل الرسائل التي تحتوي على مرفقات صور
      const hasImageAttachments = message.attachments.some(attachment => 
        attachment.contentType && attachment.contentType.startsWith('image/')
      );
      
      if (!hasImageAttachments) {
        const messageKey = `${message.guild.id}-${message.author.id}`;
        const userHistory = messageHistory.get(messageKey) || [];
        
        // إضافة الرسالة الحالية للتاريخ
        userHistory.push({
          content: message.content,
          timestamp: Date.now()
        });
        
        // الاحتفاظ بآخر 10 رسائل فقط
        if (userHistory.length > 10) {
          userHistory.shift();
        }
        
        messageHistory.set(messageKey, userHistory);
        
        // فحص التكرار (فقط للرسائل النصية)
        const recentMessages = userHistory.filter(msg => 
          Date.now() - msg.timestamp < 60000 && // آخر دقيقة
          msg.content === message.content &&
          msg.content.trim().length > 0 // تجاهل الرسائل الفارغة
        );
        
        if (recentMessages.length > 2) {
          console.log(`🔄 [PROTECTION] Repeated text message detected from ${message.author.tag}`);
          
          try {
            await message.delete();
            console.log(`🗑️ [PROTECTION] Deleted repeated text message`);
            return { success: false, reason: 'Repeated message deleted', action: 'delete' };
          } catch (error) {
            console.error(`❌ [PROTECTION] Failed to delete repeated message:`, error);
          }
        }
      } else {
        console.log(`🖼️ [PROTECTION] Skipping duplicate check for message with image attachments`);
      }
    }
    
    return { success: true };
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error in bot management:`, error);
    return { success: true }; // لا نوقف المعالجة بسبب خطأ في فحص البوتات
  }
}

module.exports = {checkBotManagement};