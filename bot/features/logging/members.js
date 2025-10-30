const { EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

class MembersLogger {
  constructor(client, settingsManager) {
    this.client = client;
    this.settingsManager = settingsManager;
  }

  /**
   * Load server settings from manual-log-settings.json
   */
  async loadServerSettings(guildId) {
    try {
      const settingsPath = path.join(__dirname, '../../data/manual-log-settings.json');
      const data = await fs.readFile(settingsPath, 'utf8');
      const allSettings = JSON.parse(data);
      return allSettings[guildId] || null;
    } catch (error) {
      console.error('❌ Error loading manual log settings:', error);
      return null;
    }
  }

  /**
   * Log member join and leave events
   */
  async logJoinLeave(member, action) {
    try {
      const serverSettings = await this.loadServerSettings(member.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.members?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.members.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const isJoin = action === 'join';
      const embed = new EmbedBuilder()
        .setTitle(isJoin ? '📥 New Member Joined' : '📤 Member Left Server')
        .setDescription(`**${member.user.tag}** ${isJoin ? 'joined' : 'left'} the server`)
        .setColor(isJoin ? '#00ff00' : '#ff0000')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields([
          { name: '👤 Member', value: `<@${member.user.id}>`, inline: true },
          { name: '🆔 Member ID', value: member.user.id, inline: true },
          { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`, inline: false }
        ])
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' });

      if (isJoin) {
        embed.addFields([
          { name: '👥 Total Members', value: member.guild.memberCount.toString(), inline: true }
        ]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Manual Log (${action}) for member ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging join/leave:', error);
    }
  }

  /**
   * Log kick and ban events
   */
  async logKickBan(member, action, executor = null, reason = null) {
    try {
      const serverSettings = await this.loadServerSettings(member.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.members?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.members.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const actionMap = {
        'kick': { title: '👢 Member Kicked', color: '#ff9900', emoji: '👢' },
        'ban': { title: '🔨 Member Banned', color: '#ff0000', emoji: '🔨' },
        'unban': { title: '✅ Member Unbanned', color: '#00ff00', emoji: '✅' }
      };

      const actionInfo = actionMap[action] || actionMap['kick'];

      const embed = new EmbedBuilder()
        .setTitle(actionInfo.title)
        .setDescription(`**${member.user ? member.user.tag : member.tag}** was ${action === 'kick' ? 'kicked' : action === 'ban' ? 'banned' : 'unbanned'}`)
        .setColor(actionInfo.color)
        .setThumbnail(member.user ? member.user.displayAvatarURL({ dynamic: true }) : member.displayAvatarURL({ dynamic: true }))
        .addFields([
          { name: '👤 Member', value: `<@${member.user ? member.user.id : member.id}>`, inline: true },
          { name: '🆔 Member ID', value: member.user ? member.user.id : member.id, inline: true },
          { name: '👮 Executor', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
        ])
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' });

      if (reason) {
        embed.addFields([
          { name: '📝 Reason', value: reason, inline: false }
        ]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Manual Log (${action}) for member ${member.user ? member.user.tag : member.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging kick/ban:', error);
    }
  }

  /**
   * Log member role changes
   */
  async logMemberRoleChange(member, action, role, executor = null) {
    try {
      const serverSettings = await this.loadServerSettings(member.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.members?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.members.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const isAdd = action === 'add';
      const embed = new EmbedBuilder()
        .setTitle(isAdd ? '➕ Role Added' : '➖ Role Removed')
        .setDescription(`Role **${role.name}** was ${isAdd ? 'added to' : 'removed from'} **${member.user.tag}**`)
        .setColor(isAdd ? '#00ff00' : '#ff0000')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields([
          { name: '👤 Member', value: `<@${member.user.id}>`, inline: true },
          { name: '🎭 Role', value: `<@&${role.id}>`, inline: true },
          { name: '👮 Executor', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
        ])
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' });

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Manual Log (role ${action}) for member ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging member role change:', error);
    }
  }

  /**
   * Log member mute (voice and text)
   */
  async logMemberMute(member, muteType, action, executor = null, reason = null, duration = null) {
    try {
      const serverSettings = await this.loadServerSettings(member.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.members?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.members.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const muteTypeMap = {
        'text': { name: 'Text Mute', emoji: '💬' },
        'voice': { name: 'Voice Mute', emoji: '🔇' },
        'deafen': { name: 'Voice Deafen', emoji: '🔇' }
      };

      const muteInfo = muteTypeMap[muteType] || muteTypeMap['text'];
      const isAdd = action === 'add';

      const embed = new EmbedBuilder()
        .setTitle(`${muteInfo.emoji} ${muteInfo.name} ${isAdd ? 'Applied' : 'Removed'}`)
        .setDescription(`**${member.user.tag}** was ${isAdd ? '' : 'un'}${muteInfo.name.toLowerCase()}`)
        .setColor(isAdd ? '#ff9900' : '#00ff00')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields([
          { name: '👤 Member', value: `<@${member.user.id}>`, inline: true },
          { name: '📝 Type', value: muteInfo.name, inline: true },
          { name: '👮 Executor', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
        ])
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' });

      if (reason) {
        embed.addFields([
          { name: '📝 Reason', value: reason, inline: false }
        ]);
      }

      if (duration && isAdd) {
        embed.addFields([
          { name: '⏰ Duration', value: duration, inline: true }
        ]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Manual Log (${muteType} ${action}) for member ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging member mute:', error);
    }
  }

  /**
   * Log nickname changes
   */
  async logNicknameChange(member, oldNickname, newNickname, executor = null) {
    try {
      const serverSettings = await this.loadServerSettings(member.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.members?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.members.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle('📝 Nickname Changed')
        .setDescription(`**${member.user.tag}**'s nickname was changed`)
        .setColor('#0099ff')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields([
          { name: '👤 Member', value: `<@${member.user.id}>`, inline: true },
          { name: '📝 Old Nickname', value: oldNickname || 'None', inline: true },
          { name: '📝 New Nickname', value: newNickname || 'None', inline: true },
          { name: '👮 Executor', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
        ])
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' });

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Manual Log (nickname change) for member ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging nickname change:', error);
    }
  }

  /**
   * Log member server avatar changes
   */
  async logMemberAvatarChange(member, oldAvatar, newAvatar) {
    try {
      const serverSettings = await this.loadServerSettings(member.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.members?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.members.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle('🖼️ Server Avatar Changed')
        .setDescription(`**${member.user.tag}**'s server avatar was changed`)
        .setColor('#0099ff')
        .setThumbnail(newAvatar || member.user.displayAvatarURL({ dynamic: true }))
        .addFields([
          { name: '👤 Member', value: `<@${member.user.id}>`, inline: true }
        ])
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' });

      if (oldAvatar) {
        embed.addFields([
          { name: '🖼️ Old Avatar', value: `[Image Link](${oldAvatar})`, inline: true }
        ]);
      }

      if (newAvatar) {
        embed.addFields([
          { name: '🖼️ New Avatar', value: `[Image Link](${newAvatar})`, inline: true }
        ]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Manual Log (avatar change) for member ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging avatar change:', error);
    }
  }

  /**
   * Log general member updates
   */
  async logMemberUpdate(oldMember, newMember, executor = null) {
    try {
      // Check nickname changes
      if (oldMember.nickname !== newMember.nickname) {
        await this.logNicknameChange(newMember, oldMember.nickname, newMember.nickname, executor);
      }

      // Check server avatar changes
      if (oldMember.avatar !== newMember.avatar) {
        const oldAvatar = oldMember.avatar ? oldMember.avatarURL({ dynamic: true }) : null;
        const newAvatar = newMember.avatar ? newMember.avatarURL({ dynamic: true }) : null;
        await this.logMemberAvatarChange(newMember, oldAvatar, newAvatar);
      }

      // Check text mute status changes (timeout)
      if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
        const action = newMember.communicationDisabledUntil ? 'add' : 'remove';
        const duration = newMember.communicationDisabledUntil ? 
          `<t:${Math.floor(newMember.communicationDisabledUntil.getTime() / 1000)}:R>` : null;
        
        await this.logMemberMute(newMember, 'text', action, executor, 'Timeout status changed', duration);
      }

    } catch (error) {
      console.error('❌ Error logging member update:', error);
    }
  }

  /**
   * Handle member updates with executor lookup
   */
  async handleMemberUpdate(oldMember, newMember) {
    try {
      // Search for executor in audit logs
      const auditLogs = await newMember.guild.fetchAuditLogs({
        limit: 10,
        type: 24 // MEMBER_UPDATE
      });

      let executor = null;
      const recentLog = auditLogs.entries.find(log => 
        log.target && log.target.id === newMember.user.id && 
        Date.now() - log.createdTimestamp < 10000
      );

      if (recentLog) {
        executor = recentLog.executor;
      }

      // Check voice mute changes
      if (oldMember.voice.serverMute !== newMember.voice.serverMute) {
        const action = newMember.voice.serverMute ? 'add' : 'remove';
        await this.logMemberMute(newMember, 'voice', action, executor, 'Voice mute status changed');
      }

      // Check voice deafen changes
      if (oldMember.voice.serverDeaf !== newMember.voice.serverDeaf) {
        const action = newMember.voice.serverDeaf ? 'add' : 'remove';
        await this.logMemberMute(newMember, 'deafen', action, executor, 'Voice deafen status changed');
      }

      // Handle other updates
      await this.logMemberUpdate(oldMember, newMember, executor);

    } catch (error) {
      console.error('❌ Error handling member update:', error);
    }
  }
}

module.exports = MembersLogger;