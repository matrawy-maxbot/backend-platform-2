const { applyPunishment } = require('../applyPunishment');

/**
 * فحص الكلمات السيئة
 * Check bad words
 * @param {Message} message - الرسالة
 * @param {Object} badWordsSettings - إعدادات الكلمات السيئة
 */
async function checkBadWords(message, badWordsSettings) {
  try {
    // التحقق من وجود قائمة الكلمات المحظورة
    const wordsList = badWordsSettings.words || badWordsSettings.wordsList || badWordsSettings.badWordsList || [];
    if (!wordsList || wordsList.length === 0) {
      console.log(`ℹ️ [PROTECTION] No bad words list found for ${message.guild.name}`);
      return { success: true };
    }

    // فحص قيود القنوات - إذا كانت هناك قنوات محددة، تحقق منها
    const pictureChannels = badWordsSettings.pictureChannels || [];
    const botCommandChannels = badWordsSettings.botCommandChannels || [];
    const currentChannelId = message.channel.id;
    const currentChannelName = message.channel.name;

    // إذا كانت هناك قنوات محددة، تحقق من أن القناة الحالية مشمولة
    const hasChannelRestrictions = pictureChannels.length > 0 || botCommandChannels.length > 0;
    
    if (hasChannelRestrictions) {
      const isInPictureChannels = pictureChannels.includes(currentChannelId) || pictureChannels.includes(currentChannelName);
      const isInBotCommandChannels = botCommandChannels.includes(currentChannelId) || botCommandChannels.includes(currentChannelName);
      
      if (!isInPictureChannels && !isInBotCommandChannels) {
        console.log(`ℹ️ [PROTECTION] Channel "${currentChannelName}" not in restricted channels list, skipping bad words check`);
        return { success: true };
      }
      
      console.log(`🎯 [PROTECTION] Channel "${currentChannelName}" is in restricted channels, proceeding with bad words check`);
    } else {
      console.log(`🌐 [PROTECTION] No channel restrictions set, checking bad words in all channels`);
    }
    
    const messageContent = message.content.toLowerCase();
    const foundBadWords = [];
    
    console.log(`🔍 [PROTECTION] Checking message "${message.content}" against ${wordsList.length} bad words in channel "${currentChannelName}"`);
    
    // البحث عن الكلمات السيئة
    for (const badWord of wordsList) {
      if (messageContent.includes(badWord.toLowerCase())) {
        foundBadWords.push(badWord);
      }
    }
    
    if (foundBadWords.length > 0) {
      console.log(`🚫 [PROTECTION] Bad words detected: ${foundBadWords.join(', ')} from ${message.author.tag} in channel "${currentChannelName}"`);
      
      // تطبيق العقوبة - تحويل القيم من الواجهة إلى القيم المتوقعة
      let punishment = badWordsSettings.punishment || badWordsSettings.badWordPunishment || 'none';
      
      // تحويل القيم من الواجهة إلى القيم المتوقعة في الكود
      const punishmentMap = {
        'Warn message': 'warn',
        'Delete message': 'delete',
        'Mute': 'mute',
        'Kick user': 'kick',
        'Ban user': 'ban',
        'No action': 'none'
      };
      
      punishment = punishmentMap[punishment] || punishment.toLowerCase();
      
      // فحص القنوات المسموحة لعقوبات الطرد والباند
      if ((punishment === 'kick' || punishment === 'ban') && badWordsSettings.whitelistChannels && badWordsSettings.whitelistChannels.length > 0) {
        const currentChannelId = message.channel.id;
        if (badWordsSettings.whitelistChannels.includes(currentChannelId)) {
          console.log(`✅ [PROTECTION] Channel "${currentChannelName}" is whitelisted for ${punishment}, skipping punishment`);
          return { success: true, reason: `Channel whitelisted for ${punishment}` };
        }
      }
      
      console.log(`⚖️ [PROTECTION] Applying punishment: ${punishment}`);
      
      const actionResult = await applyPunishment(message, punishment, 'Bad words detected');
      
      return { 
        success: false, 
        reason: `Bad words detected: ${foundBadWords.join(', ')}`, 
        action: punishment,
        details: actionResult
      };
    }
    
    console.log(`✅ [PROTECTION] No bad words found in message from channel "${currentChannelName}"`);
    return { success: true };
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error in bad words check:`, error);
    return { success: true }; // لا نوقف المعالجة بسبب خطأ في فحص الكلمات
  }
}

module.exports = {checkBadWords};