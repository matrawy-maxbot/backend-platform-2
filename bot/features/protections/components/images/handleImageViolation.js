/**
 * معالجة انتهاك قواعد الصور
 * Handle image violation
 * @param {Message} message - الرسالة
 * @param {string} reason - سبب الانتهاك
 * @param {Array} pictureChannels - قائمة القنوات المسموحة
 */
async function handleImageViolation(message, reason, pictureChannels) {
  try {
    console.log(`🚫 [PROTECTION] ${reason} in channel "${message.channel.name}", deleting message with attachments`);
    
    // حذف الرسالة التي تحتوي على مرفقات
    await message.delete();
    console.log(`🗑️ [PROTECTION] Deleted message with attachments from ${message.author.tag}`);
    
    // إرسال رسالة تحذيرية في نفس القناة كـ embed
    try {
      const { EmbedBuilder } = require('discord.js');
      
      // تحديد نوع الوضع المستخدم
      let modeDescription = '';
      if (reason.includes('Text is required')) {
        modeDescription = 'وضع النص المطلوب - Text Required Mode';
      } else if (reason.includes('only allowed in specified channels')) {
        modeDescription = 'وضع القنوات المحددة - Whitelist Mode';
      } else if (reason.includes('text whitelist')) {
        modeDescription = 'وضع النص في القنوات المحددة - Text Whitelist Mode';
      } else if (reason.includes('blocked list for Allow All mode')) {
        modeDescription = 'وضع السماح للجميع - Allow All Mode (Images blocked in specified channels only)';
      } else if (reason.includes('allowed list for Block All mode')) {
        modeDescription = 'وضع حظر الجميع - Block All Mode (Images allowed in specified channels only)';
      } else {
        modeDescription = 'وضع الحماية النشط - Protection Mode Active';
      }
      
      const warningEmbed = new EmbedBuilder()
        .setColor('#FF6B6B') // لون أحمر للتحذير
        .setTitle('🚫 تم حذف الصورة - Image Deleted')
        .setDescription(`**${message.author}، تم حذف رسالتك التي تحتوي على صور/مرفقات**\n**${message.author}, your message containing images/attachments has been deleted**`)
        .addFields(
          { 
            name: '📋 السبب - Reason', 
            value: `\`\`\`${reason}\`\`\``, 
            inline: false 
          },
          { 
            name: '⚙️ الوضع المستخدم - Current Mode', 
            value: modeDescription, 
            inline: false 
          },
          { 
            name: '📍 القناة الحالية - Current Channel', 
            value: `#${message.channel.name}`, 
            inline: true 
          }
        );
      
      // إضافة معلومات القنوات حسب نوع الوضع
      if (pictureChannels.length > 0) {
        const channelsList = pictureChannels.map(channel => {
          // التحقق من كون القناة ID أم اسم
          if (channel.match(/^\d+$/)) {
            // إذا كان ID، محاولة الحصول على القناة
            const channelObj = message.guild.channels.cache.get(channel);
            return channelObj ? `#${channelObj.name}` : `<#${channel}>`;
          } else {
            // إذا كان اسم القناة
            return `#${channel}`;
          }
        }).join('\n');
        
        // تحديد عنوان القائمة حسب نوع الرسالة
        let channelListTitle = '';
        if (reason.includes('blocked list for Allow All mode')) {
          channelListTitle = '🚫 القنوات المحظورة للصور - Blocked Channels for Images';
        } else if (reason.includes('allowed list for Block All mode')) {
          channelListTitle = '✅ القنوات المسموحة للصور - Allowed Channels for Images';
        } else {
          channelListTitle = '✅ القنوات المسموحة للصور - Allowed Channels for Images';
        }
        
        warningEmbed.addFields({
          name: channelListTitle,
          value: channelsList,
          inline: false
        });
      }
      
      warningEmbed
        .setFooter({ 
          text: 'نظام الحماية التلقائي • Auto Protection System • ' + message.guild.name,
          iconURL: message.client.user.displayAvatarURL()
        })
        .setTimestamp();
      
      // إرسال الرسالة في نفس القناة وحذفها بعد 15 ثانية
      const warningMessage = await message.channel.send({ embeds: [warningEmbed] });
      setTimeout(() => {
        warningMessage.delete().catch(console.error);
      }, 15000);
      
      console.log(`⚠️ [PROTECTION] Image protection warning sent in channel for ${message.author.tag}`);
    } catch (embedError) {
      console.error(`❌ [PROTECTION] Failed to send image protection embed:`, embedError);
    }
    
    return { 
      success: false, 
      reason: reason, 
      action: 'delete'
    };
  } catch (deleteError) {
    console.error(`❌ [PROTECTION] Failed to delete message with attachments:`, deleteError);
    return { success: true }; // لا نوقف المعالجة إذا فشل الحذف
  }
}
module.exports = {handleImageViolation};