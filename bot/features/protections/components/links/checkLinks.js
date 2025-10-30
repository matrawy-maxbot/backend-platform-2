const { applyLinkActionWithWarning } = require('./applyLinkActionWithWarning');
const { getWarningMessage } = require('../getWarningMessage');

/**
 * فحص الروابط
 * Check links
 * @param {Message} message - الرسالة
 * @param {Object} linksSettings - إعدادات الروابط
 */
async function checkLinks(message, linksSettings) {
  try {
    const messageContent = message.content.toLowerCase();
    const { getUserWarnings, addUserWarning, countUserWarnings } = require('../../utils/warnings');
    
    // فحص روابط الديسكورد
    if (!linksSettings.allowDiscordInvites) {
      const discordInviteRegex = /(discord\.gg\/|discordapp\.com\/invite\/|discord\.com\/invite\/)/i;
      if (discordInviteRegex.test(messageContent)) {
        console.log(`🔗 [PROTECTION] Discord invite blocked (setting disabled) from ${message.author.tag}`);
        
        // فحص عدد التحذيرات السابقة
        const warningCount = await countUserWarnings(message.guild.id, message.author.id, 'discord_invites');
        
        if (warningCount === 0) {
          // المرة الأولى - إرسال تحذير فقط
          try {
            // إضافة التحذير إلى قاعدة البيانات
            await addUserWarning(message.guild.id, message.author.id, 'discord_invites', {
              reason: 'Discord server invite shared',
              content: message.content,
              channelId: message.channel.id,
              channelName: message.channel.name
            });
            
            // إرسال رسالة تحذير في نفس القناة
            const { EmbedBuilder } = require('discord.js');
            
            const warningEmbed = new EmbedBuilder()
              .setColor('#FFA500') // لون برتقالي للتحذير
              .setTitle('⚠️ تحذير - Warning')
              .setDescription(`**${message.author}، تم اكتشاف رابط دعوة ديسكورد في رسالتك**\n**${message.author}, Discord server invite detected in your message**`)
              .addFields(
                { 
                  name: '📋 السبب - Reason', 
                  value: '```مشاركة روابط دعوة الديسكورد غير مسموحة\nSharing Discord server invites is not permitted```', 
                  inline: false 
                },
                { 
                  name: '🔔 تحذير أول - First Warning', 
                  value: 'هذا تحذيرك الأول. في المرة القادمة سيتم تطبيق العقوبة\nThis is your first warning. Next time the penalty will be applied', 
                  inline: false 
                }
              )
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
            
            console.log(`⚠️ [PROTECTION] First warning sent for Discord invite from ${message.author.tag}`);
            return { success: true, reason: 'First warning sent for Discord invite' };
            
          } catch (error) {
            console.error(`❌ [PROTECTION] Failed to send Discord invite warning:`, error);
          }
        } else {
          // المرة الثانية أو أكثر - تطبيق العقوبة
          try {
            await message.delete();
            
            // إضافة التحذير إلى قاعدة البيانات
            await addUserWarning(message.guild.id, message.author.id, 'discord_invites', {
              reason: 'Discord server invite shared (repeated violation)',
              content: message.content,
              channelId: message.channel.id,
              channelName: message.channel.name,
              action: 'delete'
            });
            
            // إرسال رسالة تحذير في نفس القناة
            const { EmbedBuilder } = require('discord.js');
            
            const warningEmbed = new EmbedBuilder()
              .setColor('#FF0000')
              .setTitle('🚫 رابط محظور - Link Blocked')
              .setDescription(`**${message.author}، تم حذف رسالتك لاحتوائها على رابط دعوة ديسكورد**\n**${message.author}, your message was deleted for containing a Discord server invite**`)
              .addFields(
                { 
                  name: '📋 السبب - Reason', 
                  value: '```مشاركة روابط دعوة الديسكورد غير مسموحة (مخالفة متكررة)\nSharing Discord server invites is not permitted (repeated violation)```', 
                  inline: false 
                },
                { 
                  name: '⚠️ تحذير - Warning', 
                  value: `عدد التحذيرات: ${warningCount + 1}\nWarning count: ${warningCount + 1}`, 
                  inline: false 
                }
              )
              .setFooter({ 
                text: 'نظام الحماية التلقائي • Auto Protection System • ' + message.guild.name,
                iconURL: message.client.user.displayAvatarURL()
              })
              .setTimestamp();
            
            // إرسال الرسالة في نفس القناة وحذفها بعد 10 ثوان
            const warningMessage = await message.channel.send({ embeds: [warningEmbed] });
            setTimeout(() => {
              warningMessage.delete().catch(console.error);
            }, 10000);
            
            console.log(`🗑️ [PROTECTION] Deleted Discord invite (repeated violation) from ${message.author.tag}`);
            return { success: false, reason: 'Discord invite deleted (repeated violation)', action: 'delete' };
          } catch (error) {
            console.error(`❌ [PROTECTION] Failed to delete Discord invite:`, error);
          }
        }
      }
    }
    
    // فحص الروابط المحظورة
    if (linksSettings.blockedLinks && linksSettings.blockedLinks.length > 0) {
      for (const blockedLink of linksSettings.blockedLinks) {
        if (messageContent.includes(blockedLink.content.toLowerCase())) {
          console.log(`🚫 [PROTECTION] Blocked link detected: ${blockedLink.content} from ${message.author.tag}`);
          
          // فحص القنوات المحددة للإجراء
          if (blockedLink.channels && blockedLink.channels.length > 0) {
            // إذا كان الإجراء "allow" - السماح فقط في القنوات المحددة
            if (blockedLink.action === 'allow') {
              if (blockedLink.channels.includes(message.channel.id)) {
                console.log(`✅ [PROTECTION] Link allowed in specified channel: ${message.channel.name} (${message.channel.id})`);
                continue; // السماح بالرابط في القناة المحددة
              }
              // إذا لم تكن القناة محددة للسماح، نتابع لتطبيق العقوبة
              console.log(`🚫 [PROTECTION] Link not allowed in this channel: ${message.channel.name} (${message.channel.id})`);
            } else {
              // للإجراءات الأخرى (delete, kick, ban) - تطبيق الإجراء فقط في القنوات المحددة
              if (!blockedLink.channels.includes(message.channel.id)) {
                console.log(`✅ [PROTECTION] Link ignored in non-specified channel: ${message.channel.name} (${message.channel.id})`);
                continue; // تجاهل الرابط في القنوات غير المحددة
              }
              console.log(`🎯 [PROTECTION] Applying action in specified channel: ${message.channel.name} (${message.channel.id})`);
            }
          }
          
          // فحص عدد التحذيرات السابقة
          const warningCount = await countUserWarnings(message.guild.id, message.author.id, 'blocked_links');
          
          // حذف الرسالة الأصلية أولاً
          try {
            await message.delete();
            console.log(`🗑️ [PROTECTION] Deleted message with blocked link: ${blockedLink.content} from ${message.author.tag}`);
          } catch (deleteError) {
            console.error(`❌ [PROTECTION] Failed to delete message:`, deleteError);
          }
          
          if (warningCount === 0) {
            // المرة الأولى - إرسال تحذير فقط (بدون عقوبة)
            try {
              // إرسال رسالة تحذير في نفس القناة
              const { EmbedBuilder } = require('discord.js');
              
              const warningEmbed = new EmbedBuilder()
                .setColor('#FFA500') // لون برتقالي للتحذير
                .setTitle('⚠️ Warning')
                .setDescription(`**${message.author}, blocked link detected in your message**`)
                .addFields(
                  { 
                    name: '🔗 Blocked Link', 
                    value: `\`${blockedLink.content}\``, 
                    inline: false 
                  },
                  { 
                    name: '📋 Reason', 
                    value: '```This link is blocked in this server```', 
                    inline: false 
                  },
                  { 
                    name: '🔔 First Warning', 
                    value: getWarningMessage(blockedLink.action), 
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
              
              // إضافة التحذير إلى قاعدة البيانات بعد إرسال الرسالة
              await addUserWarning(message.guild.id, message.author.id, 'blocked_links', {
                reason: 'Blocked link shared (first warning)',
                content: blockedLink.content,
                fullMessage: message.content,
                channelId: message.channel.id,
                channelName: message.channel.name,
                warningOnly: true // علامة للإشارة أن هذا تحذير فقط
              });
              
              console.log(`⚠️ [PROTECTION] First warning sent for blocked link: ${blockedLink.content} from ${message.author.tag} (no punishment)`);
              
              return { success: false, reason: `First warning sent for blocked link: ${blockedLink.content}`, action: 'warning_only' };
              
            } catch (error) {
              console.error(`❌ [PROTECTION] Failed to send blocked link warning:`, error);
              return { success: false, reason: 'Failed to send warning', action: 'error' };
            }
          } else if (warningCount === 1) {
            // المرة الثانية - تطبيق العقوبة
            try {
              // إضافة التحذير إلى قاعدة البيانات
              await addUserWarning(message.guild.id, message.author.id, 'blocked_links', {
                reason: 'Blocked link shared (second violation - punishment applied)',
                content: blockedLink.content,
                fullMessage: message.content,
                channelId: message.channel.id,
                channelName: message.channel.name,
                action: blockedLink.action,
                punishmentApplied: true
              });
              
              // تطبيق الإجراء
              const actionResult = await applyLinkActionWithWarning(message, blockedLink.action, blockedLink.content, warningCount + 1);
              
              console.log(`🚨 [PROTECTION] Punishment applied for repeated blocked link violation: ${blockedLink.content} from ${message.author.tag}`);
              
              return { 
                success: false, 
                reason: `Blocked link detected: ${blockedLink.content} (second violation - punishment applied)`, 
                action: blockedLink.action,
                details: actionResult
              };
            } catch (error) {
              console.error(`❌ [PROTECTION] Failed to apply punishment:`, error);
              return { success: false, reason: 'Failed to apply punishment', action: 'error' };
            }
          } else {
            // المرة الثالثة أو أكثر - تطبيق عقوبة أشد
            try {
              // إضافة التحذير إلى قاعدة البيانات
              await addUserWarning(message.guild.id, message.author.id, 'blocked_links', {
                reason: 'Blocked link shared (repeated violation - severe punishment)',
                content: blockedLink.content,
                fullMessage: message.content,
                channelId: message.channel.id,
                channelName: message.channel.name,
                action: 'kick', // عقوبة أشد للمخالفات المتكررة
                punishmentApplied: true
              });
              
              // تطبيق عقوبة الطرد للمخالفات المتكررة
              const actionResult = await applyLinkActionWithWarning(message, 'kick', blockedLink.content, warningCount + 1);
              
              console.log(`🚨 [PROTECTION] Severe punishment (kick) applied for repeated blocked link violations: ${blockedLink.content} from ${message.author.tag}`);
              
              return { 
                success: false, 
                reason: `Blocked link detected: ${blockedLink.content} (repeated violation - severe punishment)`, 
                action: 'kick',
                details: actionResult
              };
            } catch (error) {
              console.error(`❌ [PROTECTION] Failed to apply severe punishment:`, error);
              return { success: false, reason: 'Failed to apply severe punishment', action: 'error' };
            }
          }
        }
      }
    }
    
    return { success: true };
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error in links check:`, error);
    return { success: true }; // لا نوقف المعالجة بسبب خطأ في فحص الروابط
  }
}

module.exports = {checkLinks};