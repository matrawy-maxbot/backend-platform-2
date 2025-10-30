/**
 * تطبيق العقوبة على البوت المطرود
 * Apply punishment to kicked bot
 * @param {GuildMember} member - العضو البوت
 * @param {Object} moderationSettings - إعدادات الإشراف
 * @param {string} reason - سبب الطرد
 */
async function applyBotPunishment(member, moderationSettings, reason) {
  try {
    if (!moderationSettings?.enabled) {
      console.log(`ℹ️ [BOT_PUNISHMENT] Moderation not enabled for ${member.guild.name}`);
      return { success: true, action: 'Moderation disabled' };
    }

    const punishment = moderationSettings.memberPunishment || 'kick';
    const maxKickBan = moderationSettings.maxKickBan || 5;
    
    console.log(`🛡️ [BOT_PUNISHMENT] Applying ${punishment} punishment to bot ${member.user.tag} (max: ${maxKickBan})`);
    
    // تطبيق العقوبة حسب النوع
    switch (punishment) {
      case 'kick':
        // البوت تم طرده بالفعل، لا حاجة لإجراء إضافي
        console.log(`👢 [BOT_PUNISHMENT] Bot ${member.user.tag} already kicked`);
        return { success: true, action: 'Bot kicked' };
        
      case 'ban':
        if (member.guild.members.me.permissions.has('BAN_MEMBERS')) {
          try {
            await member.ban({ reason: `${reason} - Bot punishment: ban` });
            console.log(`🔨 [BOT_PUNISHMENT] Banned bot ${member.user.tag}`);
            return { success: true, action: 'Bot banned' };
          } catch (error) {
            console.error(`❌ [BOT_PUNISHMENT] Failed to ban bot:`, error);
            return { success: false, action: 'Failed to ban bot' };
          }
        } else {
          console.log(`⚠️ [BOT_PUNISHMENT] No ban permissions for ${member.guild.name}`);
          return { success: false, action: 'No ban permissions' };
        }
        
      case 'remove roles':
        try {
          await member.roles.set([], `${reason} - Bot punishment: remove roles`);
          console.log(`🎭 [BOT_PUNISHMENT] Removed all roles from bot ${member.user.tag}`);
          return { success: true, action: 'Bot roles removed' };
        } catch (error) {
          console.error(`❌ [BOT_PUNISHMENT] Failed to remove roles:`, error);
          return { success: false, action: 'Failed to remove roles' };
        }
        
      default:
        console.log(`ℹ️ [BOT_PUNISHMENT] Unknown punishment type: ${punishment}`);
        return { success: true, action: 'Unknown punishment type' };
    }
    
  } catch (error) {
    console.error(`❌ [BOT_PUNISHMENT] Error applying bot punishment:`, error);
    return { success: false, action: `Error: ${error.message}` };
  }
}

module.exports = {applyBotPunishment};