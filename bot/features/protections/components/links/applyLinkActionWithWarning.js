const { applyPunishment } = require('../applyPunishment');

/**
 * تطبيق إجراء الرابط مع عرض عدد التحذيرات
 * Apply link action with warning count display
 * @param {Message} message - الرسالة
 * @param {string} action - الإجراء (delete, warn, timeout)
 * @param {string} linkContent - محتوى الرابط
 * @param {number} warningCount - عدد التحذيرات
 */
async function applyLinkActionWithWarning(message, action, linkContent, warningCount) {
  try {
    const reason = `Blocked link detected: ${linkContent} (repeated violation)`;
    
    switch (action) {
      case 'delete':
        try {
          await message.delete();
          
          // إرسال رسالة تحذير في نفس القناة
          const { EmbedBuilder } = require('discord.js');
          
          const warningEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🚫 Link Blocked')
            .setDescription(`**${message.author}, your message was deleted for containing a blocked link**`)
            .addFields(
              { 
                name: '🔗 Blocked Link', 
                value: `\`${linkContent}\``, 
                inline: false 
              },
              { 
                name: '📋 Reason', 
                value: '```This link is blocked in this server (repeated violation)```', 
                inline: false 
              },
              { 
                name: '⚠️ Warning', 
                value: `Warning count: ${warningCount}`, 
                inline: false 
              }
            )
            .setFooter({ 
              text: 'Auto Protection System • ' + message.guild.name,
              iconURL: message.client.user.displayAvatarURL()
            })
            .setTimestamp();
          
          // إرسال الرسالة في نفس القناة وحذفها بعد 10 ثوان
          const warningMessage = await message.channel.send({ embeds: [warningEmbed] });
          setTimeout(() => {
            warningMessage.delete().catch(console.error);
          }, 10000);
          
          console.log(`🗑️ [PROTECTION] Deleted message with blocked link: ${linkContent} from ${message.author.tag}`);
          return { success: true, action: 'delete', reason };
        } catch (error) {
          console.error(`❌ [PROTECTION] Failed to delete message:`, error);
          return { success: false, action: 'delete', reason, error: error.message };
        }
        
      case 'kick':
        try {
          // إرسال رسالة تحذير قبل الطرد
          const { EmbedBuilder } = require('discord.js');
          
          const warningEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🚫 Link Blocked')
            .setDescription(`**${message.author}, you will be kicked for posting a blocked link**`)
            .addFields(
              { 
                name: '🔗 Blocked Link', 
                value: `\`${linkContent}\``, 
                inline: false 
              },
              { 
                name: '📋 Reason', 
                value: '```This link is blocked in this server (repeated violation)```', 
                inline: false 
              },
              { 
                name: '⚠️ Warning', 
                value: `Warning count: ${warningCount}`, 
                inline: false 
              }
            )
            .setFooter({ 
              text: 'Auto Protection System • ' + message.guild.name,
              iconURL: message.client.user.displayAvatarURL()
            })
            .setTimestamp();
          
          // إرسال الرسالة في نفس القناة وحذفها بعد 10 ثوان
          const warningMessage = await message.channel.send({ embeds: [warningEmbed] });
          setTimeout(() => {
            warningMessage.delete().catch(console.error);
          }, 10000);
          
          // تطبيق الطرد
          return await applyPunishment(message, 'kick', reason);
        } catch (error) {
          console.error(`❌ [PROTECTION] Failed to kick user:`, error);
          return { success: false, action: 'kick', reason, error: error.message };
        }
        
      case 'ban':
        try {
          // إرسال رسالة تحذير قبل الحظر
          const { EmbedBuilder } = require('discord.js');
          
          const warningEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🚫 Link Blocked')
            .setDescription(`**${message.author}, you will be banned for posting a blocked link**`)
            .addFields(
              { 
                name: '🔗 Blocked Link', 
                value: `\`${linkContent}\``, 
                inline: false 
              },
              { 
                name: '📋 Reason', 
                value: '```This link is blocked in this server (repeated violation)```', 
                inline: false 
              },
              { 
                name: '⚠️ Warning', 
                value: `Warning count: ${warningCount}`, 
                inline: false 
              }
            )
            .setFooter({ 
              text: 'Auto Protection System • ' + message.guild.name,
              iconURL: message.client.user.displayAvatarURL()
            })
            .setTimestamp();
          
          // إرسال الرسالة في نفس القناة وحذفها بعد 10 ثوان
          const warningMessage = await message.channel.send({ embeds: [warningEmbed] });
          setTimeout(() => {
            warningMessage.delete().catch(console.error);
          }, 10000);
          
          // تطبيق الحظر
          return await applyPunishment(message, 'ban', reason);
        } catch (error) {
          console.error(`❌ [PROTECTION] Failed to ban user:`, error);
          return { success: false, action: 'ban', reason, error: error.message };
        }
        
      case 'warn':
        return await applyPunishment(message, 'warn', reason);
        
      case 'timeout':
        return await applyPunishment(message, 'timeout', reason);
        
      default:
        console.log(`⚠️ [PROTECTION] Unknown action: ${action}`);
        return { success: false, action, reason: `Unknown action: ${action}` };
    }
  } catch (error) {
    console.error(`❌ [PROTECTION] Error applying link action:`, error);
    return { success: false, action, reason, error: error.message };
  }
}

module.exports = {applyLinkActionWithWarning};