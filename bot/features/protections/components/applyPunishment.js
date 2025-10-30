/**
 * تطبيق العقوبة
 * Apply punishment
 * @param {Message} message - الرسالة
 * @param {string} punishment - نوع العقوبة
 * @param {string} reason - سبب العقوبة
 */
async function applyPunishment(message, punishment, reason) {
  try {
    switch (punishment) {
      case 'delete':
        await message.delete();
        
        // إرسال embed للروابط المحظورة
        if (reason.includes('Blocked link detected:')) {
          try {
            const blockedLink = reason.replace('Blocked link detected: ', '');
            
            const linkBlockedEmbed = {
              color: 0xFF4444, // Red color for blocked link
              title: '🚫 Blocked Link Detected',
              description: `${message.author}, your message containing a blocked link has been removed.`,
              fields: [
                {
                  name: '🔗 Blocked Content',
                  value: `\`${blockedLink}\``,
                  inline: false
                },
                {
                  name: '📍 Channel',
                  value: `#${message.channel.name}`,
                  inline: true
                },
                {
                  name: '⏰ Time',
                  value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
                  inline: true
                }
              ],
              footer: {
                text: 'Please follow server rules • This message will be deleted in 10 seconds',
                icon_url: message.guild.iconURL() || undefined
              },
              timestamp: new Date().toISOString()
            };
            
            // إرسال رسالة التنبيه كـ embed
            const alertMessage = await message.channel.send({ embeds: [linkBlockedEmbed] });
            
            // حذف رسالة التنبيه بعد 10 ثوانٍ
            setTimeout(async () => {
              try {
                await alertMessage.delete();
              } catch (deleteError) {
                console.error(`❌ [PROTECTION] Failed to delete link blocked alert:`, deleteError);
              }
            }, 10000);
            
            console.log(`🚫 [PROTECTION] Sent blocked link alert for ${message.author.tag} in channel ${message.channel.name}`);
          } catch (embedError) {
            console.error(`❌ [PROTECTION] Failed to send blocked link embed:`, embedError);
          }
        }
        
        console.log(`🗑️ [PROTECTION] Deleted message from ${message.author.tag}: ${reason}`);
        return { success: true, action: 'Message deleted with embed notification' };
        
      case 'warn':
        try {
          // حذف الرسالة أولاً
          await message.delete();
          
          // Create warning embed
          const warningEmbed = {
            color: 0xFFB000, // Orange color for warning
            title: '⚠️ Protection System Warning',
            description: `${message.author}, your message has been deleted for containing prohibited words.`,
            fields: [
              {
                name: '📋 Reason',
                value: reason,
                inline: true
              },
              {
                name: '📍 Channel',
                value: `#${message.channel.name}`,
                inline: true
              },
              {
                name: '⏰ Time',
                value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
                inline: true
              }
            ],
            footer: {
              text: 'Please follow server rules • This message will be deleted in 10 seconds',
              icon_url: message.guild.iconURL() || undefined
            },
            timestamp: new Date().toISOString()
          };
          
          // إرسال رسالة التحذير كـ embed
          const warningMessage = await message.channel.send({ embeds: [warningEmbed] });
          
          // حذف رسالة التحذير بعد 10 ثوانٍ
          setTimeout(async () => {
            try {
              await warningMessage.delete();
            } catch (deleteError) {
              console.error(`❌ [PROTECTION] Failed to delete warning message:`, deleteError);
            }
          }, 10000);
          
          console.log(`⚠️ [PROTECTION] Warned ${message.author.tag} in channel: ${reason}`);
        } catch (error) {
          console.error(`❌ [PROTECTION] Failed to send warning message:`, error);
        }
        return { success: true, action: 'Warning embed sent in channel and message deleted' };
        
      case 'mute':
        if (message.guild.members.me.permissions.has('ModerateMembers')) {
          try {
            // حذف الرسالة أولاً
            await message.delete();
            
            // تطبيق timeout لمدة 10 دقائق (600000 مللي ثانية)
            const timeoutDuration = 10 * 60 * 1000; // 10 minutes
            await message.member.timeout(timeoutDuration, reason);
            
            // إرسال رسالة تأكيد في القناة
            const muteEmbed = {
              color: 0xFF6B6B, // Red color for mute
              title: '🔇 User Muted',
              description: `${message.author} has been muted for 10 minutes.`,
              fields: [
                {
                  name: '📋 Reason',
                  value: reason,
                  inline: true
                },
                {
                  name: '⏰ Duration',
                  value: '10 minutes',
                  inline: true
                },
                {
                  name: '📍 Channel',
                  value: `#${message.channel.name}`,
                  inline: true
                }
              ],
              footer: {
                text: 'Protection System • User will be unmuted automatically',
                icon_url: message.guild.iconURL() || undefined
              },
              timestamp: new Date().toISOString()
            };
            
            const muteMessage = await message.channel.send({ embeds: [muteEmbed] });
            
            // حذف رسالة التأكيد بعد 10 ثوانٍ
            setTimeout(async () => {
              try {
                await muteMessage.delete();
              } catch (deleteError) {
                console.error(`❌ [PROTECTION] Failed to delete mute confirmation:`, deleteError);
              }
            }, 10000);
            
            console.log(`🔇 [PROTECTION] Successfully muted ${message.author.tag} for 10 minutes: ${reason}`);
            console.log(`🔇 [PROTECTION] Mute applied to user ID: ${message.author.id} in guild: ${message.guild.name}`);
            return { success: true, action: 'User muted for 10 minutes' };
          } catch (error) {
            console.error(`❌ [PROTECTION] Failed to mute user ${message.author.tag}:`, error.message);
            console.error(`❌ [PROTECTION] Error details:`, error);
            try {
              await message.delete(); // حذف الرسالة حتى لو فشل الميوت
            } catch (deleteError) {
              console.error(`❌ [PROTECTION] Failed to delete message:`, deleteError.message);
            }
            return { success: false, action: `Failed to mute user: ${error.message}` };
          }
        } else {
          console.log(`❌ [PROTECTION] Bot lacks ModerateMembers permission in ${message.guild.name}`);
          console.log(`❌ [PROTECTION] Current bot permissions:`, message.guild.members.me.permissions.toArray());
          try {
            await message.delete(); // حذف الرسالة حتى لو لم تكن هناك صلاحيات
          } catch (deleteError) {
            console.error(`❌ [PROTECTION] Failed to delete message:`, deleteError.message);
          }
          return { success: false, action: 'Bot lacks ModerateMembers permission, message deleted' };
        }
        break;
        
      case 'kick':
        if (message.guild.members.me.permissions.has('KICK_MEMBERS')) {
          try {
            await message.member.kick(reason);
            console.log(`👢 [PROTECTION] Kicked ${message.author.tag}: ${reason}`);
            return { success: true, action: 'User kicked' };
          } catch (error) {
            console.error(`❌ [PROTECTION] Failed to kick user:`, error);
            return { success: false, action: 'Failed to kick user' };
          }
        }
        break;
        
      case 'ban':
        if (message.guild.members.me.permissions.has('BAN_MEMBERS')) {
          try {
            await message.member.ban({ reason });
            console.log(`🔨 [PROTECTION] Banned ${message.author.tag}: ${reason}`);
            return { success: true, action: 'User banned' };
          } catch (error) {
            console.error(`❌ [PROTECTION] Failed to ban user:`, error);
            return { success: false, action: 'Failed to ban user' };
          }
        }
        break;
        
      default:
        console.log(`ℹ️ [PROTECTION] No action taken for ${message.author.tag}: ${reason}`);
        return { success: true, action: 'No action taken' };
    }
    
  } catch (error) {
    console.error(`❌ [PROTECTION] Error applying punishment:`, error);
    return { success: false, action: `Error: ${error.message}` };
  }
}

module.exports = {applyPunishment};