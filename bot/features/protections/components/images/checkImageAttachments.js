const { handleImageViolation } = require('./handleImageViolation');

/**
 * فحص الصور والمرفقات
 * Check image attachments
 * @param {Message} message - الرسالة
 * @param {Object} imageSettings - إعدادات الصور
 */
async function checkImageAttachments(message, imageSettings) {
  try {
    // التحقق من وجود مرفقات في الرسالة
    if (message.attachments.size === 0) {
      return { success: true }; // لا توجد مرفقات
    }

    const currentChannelId = message.channel.id;
    const currentChannelName = message.channel.name;
    
    // الحصول على الإعدادات مع القيم الافتراضية
    const imageMode = imageSettings.mode || 'allow_all'; // allow_all is the default mode
    const pictureChannels = imageSettings.channels || imageSettings.pictureChannels || [];
    const requireText = imageSettings.requireText || false;
    
    console.log(`🖼️ [PROTECTION] Checking image attachments in channel "${currentChannelName}" (${currentChannelId})`);
    console.log(`🔧 [PROTECTION] Image mode: ${imageMode}, Require text: ${requireText}`);
    console.log(`📋 [PROTECTION] Picture channels list:`, pictureChannels);
    console.log(`🔍 [PROTECTION] Full image settings:`, JSON.stringify(imageSettings, null, 2));

    // تم دمج التحقق من النص المطلوب في الأنماط المختلفة أدناه

    // التحقق حسب نمط الإعدادات
    let shouldBlock = false;
    let reason = '';
    
    switch (imageMode) {
      case 'whitelist':
        // Whitelist: يسمح بالصور في القنوات المحددة فقط، يحظرها في الأخرى
        if (pictureChannels.length > 0) {
          const isInWhitelist = pictureChannels.includes(currentChannelId) || pictureChannels.includes(currentChannelName);
          console.log(`🔍 [PROTECTION] Whitelist check - Channel ID: ${currentChannelId}, Channel Name: ${currentChannelName}`);
          console.log(`🔍 [PROTECTION] Is in whitelist: ${isInWhitelist}, Channels count: ${pictureChannels.length}`);
          
          if (!isInWhitelist) {
            shouldBlock = true;
            reason = `Images only allowed in specified channels. Current channel "${currentChannelName}" is not in the whitelist.`;
          }
        } else {
          // إذا لم يتم تحديد أي قنوات، نحظر الصور في جميع القنوات
          shouldBlock = true;
          reason = 'Images are blocked in all channels (no whitelisted channels specified)';
          console.log(`🔍 [PROTECTION] Whitelist mode with no channels specified - blocking all images`);
        }
        break;
        
      case 'blacklist':
        // Blacklist: يحظر الصور في القنوات المحددة، يسمح بها في الأخرى
        if (pictureChannels.length > 0) {
          const isInBlacklist = pictureChannels.includes(currentChannelId) || pictureChannels.includes(currentChannelName);
          console.log(`🔍 [PROTECTION] Blacklist check - Channel ID: ${currentChannelId}, Channel Name: ${currentChannelName}`);
          console.log(`🔍 [PROTECTION] Is in blacklist: ${isInBlacklist}, Channels count: ${pictureChannels.length}`);
          
          if (isInBlacklist) {
            shouldBlock = true;
            reason = `Images are blocked in channel "${currentChannelName}".`;
          }
        } else {
          // إذا لم يتم تحديد أي قنوات، نسمح بالصور في جميع القنوات
          console.log(`🔍 [PROTECTION] Blacklist mode with no channels specified - allowing all images`);
        }
        break;
        
      case 'text_required':
        // Text Required: يتطلب نص مع الصور في القنوات المحددة فقط
        if (pictureChannels.length > 0) {
          const isInTextRequiredChannels = pictureChannels.includes(currentChannelId) || pictureChannels.includes(currentChannelName);
          console.log(`🔍 [PROTECTION] Text required check - Channel ID: ${currentChannelId}, Channel Name: ${currentChannelName}`);
          console.log(`🔍 [PROTECTION] Is in text required channels: ${isInTextRequiredChannels}, Channels count: ${pictureChannels.length}`);
          
          if (isInTextRequiredChannels) {
            // التحقق من وجود نص مع الصورة في القنوات المحددة فقط
            if (!message.content || message.content.trim().length === 0) {
              shouldBlock = true;
              reason = `Text is required with images in channel "${currentChannelName}".`;
            }
          }
          // إذا لم تكن القناة في القائمة المحددة، نسمح بالصور بدون نص
        } else {
          // إذا لم يتم تحديد أي قنوات، نسمح بالصور بدون نص في جميع القنوات
          console.log(`🔍 [PROTECTION] Text required mode with no channels specified - allowing all images`);
        }
        break;
        
      case 'text_whitelist':
        // Text Whitelist: يتطلب نص مع الصور في القنوات المحددة فقط
        if (pictureChannels.length > 0) {
          const isInTextWhitelist = pictureChannels.includes(currentChannelId) || pictureChannels.includes(currentChannelName);
          console.log(`🔍 [PROTECTION] Text whitelist check - Channel ID: ${currentChannelId}, Channel Name: ${currentChannelName}`);
          console.log(`🔍 [PROTECTION] Is in text whitelist: ${isInTextWhitelist}, Channels count: ${pictureChannels.length}`);
          
          if (isInTextWhitelist) {
            // في القنوات المحددة، يتطلب نص مع الصور
            if (!message.content || message.content.trim().length === 0) {
              shouldBlock = true;
              reason = `Text is required with images in channel "${currentChannelName}".`;
            }
          }
          // في القنوات غير المحددة، نسمح بالصور بدون نص
        } else {
          // إذا لم يتم تحديد أي قنوات، نسمح بالصور بدون نص في جميع القنوات
          console.log(`🔍 [PROTECTION] Text whitelist mode with no channels specified - allowing all images`);
        }
        break;
        
      case 'allow_all':
        // Allow All: يسمح بالصور في جميع القنوات ما عدا القنوات المحددة (يحظرها في القنوات المحددة فقط)
        if (pictureChannels.length > 0) {
          const isInBlockedChannels = pictureChannels.includes(currentChannelId) || pictureChannels.includes(currentChannelName);
          console.log(`🔍 [PROTECTION] Allow all check - Channel ID: ${currentChannelId}, Channel Name: ${currentChannelName}`);
          console.log(`🔍 [PROTECTION] Is in blocked channels: ${isInBlockedChannels}, Channels count: ${pictureChannels.length}`);
          
          if (isInBlockedChannels) {
            shouldBlock = true;
            reason = `Images are blocked in channel "${currentChannelName}". This channel is in the blocked list for Allow All mode.`;
          }
        } else {
          // إذا لم يتم تحديد أي قنوات، نسمح بالصور في جميع القنوات
          console.log(`🔍 [PROTECTION] Allow all mode with no channels specified - allowing all images`);
        }
        break;
        
      case 'block_all':
        // Block All: يحظر الصور في جميع القنوات ما عدا القنوات المحددة (يسمح بها في القنوات المحددة فقط)
        if (pictureChannels.length > 0) {
          const isInAllowedChannels = pictureChannels.includes(currentChannelId) || pictureChannels.includes(currentChannelName);
          console.log(`🔍 [PROTECTION] Block all check - Channel ID: ${currentChannelId}, Channel Name: ${currentChannelName}`);
          console.log(`🔍 [PROTECTION] Is in allowed channels: ${isInAllowedChannels}, Channels count: ${pictureChannels.length}`);
          console.log(`🔍 [PROTECTION] Picture channels list:`, pictureChannels);
          
          if (!isInAllowedChannels) {
            shouldBlock = true;
            reason = `Images are blocked in all channels except allowed list for Block All mode. Current channel "${currentChannelName}" is not in the allowed list.`;
            console.log(`🚫 [PROTECTION] Block all mode - blocking image in channel "${currentChannelName}"`);
          } else {
            console.log(`✅ [PROTECTION] Block all mode - allowing image in allowed channel "${currentChannelName}"`);
          }
        } else {
          // إذا لم يتم تحديد أي قنوات، نحظر الصور في جميع القنوات
          shouldBlock = true;
          reason = 'Images are blocked in all channels (no allowed channels specified for Block All mode)';
          console.log(`🚫 [PROTECTION] Block all mode with no channels specified - blocking all images`);
        }
        break;
        
      default:
        // النمط الافتراضي هو allow_all
        console.log(`⚠️ [PROTECTION] Unknown image mode: ${imageMode}, defaulting to allow_all`);
        break;
    }

    if (shouldBlock) {
      return await handleImageViolation(message, reason, pictureChannels);
    }

    console.log(`✅ [PROTECTION] Images allowed in channel "${currentChannelName}"`);
    return { success: true };
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error in image attachments check:`, error);
    return { success: true }; // لا نوقف المعالجة بسبب خطأ في فحص الصور
  }
}

module.exports = {checkImageAttachments};