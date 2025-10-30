const { EmbedBuilder } = require('discord.js');

class MemberUpdatesLogger {
  constructor(client, settingsManager) {
    this.client = client;
    this.settingsManager = settingsManager;
    
    console.log('✅ Member Updates Logger initialized');
  }

  /**
   * Log member updates (nickname changes, roles, etc.)
   */
  async logMemberUpdate(oldMember, newMember, executor = null) {
    try {
      const settings = await this.settingsManager.getServerSettings(newMember.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.members.enabled) {
        return;
      }

      const logChannel = newMember.guild.channels.cache.get(settings.categories.members.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for member updates in ${newMember.guild.name}`);
        return;
      }

      const changes = [];

      // Nickname change
      if (oldMember.nickname !== newMember.nickname) {
        const oldNick = oldMember.nickname || oldMember.user.username;
        const newNick = newMember.nickname || newMember.user.username;
        
        changes.push({
          name: '📝 Nickname',
          value: `**Before:** \`${oldNick}\`\n**After:** \`${newNick}\``,
          inline: true
        });
      }

      // Role changes
      const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
      const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

      if (addedRoles.size > 0) {
        changes.push({
          name: '➕ Roles Added',
          value: addedRoles.map(role => `${role.toString()}`).join(', ').substring(0, 1024),
          inline: false
        });
      }

      if (removedRoles.size > 0) {
        changes.push({
          name: '➖ Roles Removed',
          value: removedRoles.map(role => `\`${role.name}\``).join(', ').substring(0, 1024),
          inline: false
        });
      }

      // Avatar change
      if (oldMember.user.avatar !== newMember.user.avatar) {
        changes.push({
          name: '🖼️ Avatar',
          value: 'Avatar was changed',
          inline: true
        });
      }

      // Username change
      if (oldMember.user.username !== newMember.user.username) {
        changes.push({
          name: '👤 Username',
          value: `**Before:** \`${oldMember.user.username}\`\n**After:** \`${newMember.user.username}\``,
          inline: true
        });
      }

      // Discriminator change - for legacy accounts
      if (oldMember.user.discriminator !== newMember.user.discriminator) {
        changes.push({
          name: '🔢 Discriminator',
          value: `**Before:** \`#${oldMember.user.discriminator}\`\n**After:** \`#${newMember.user.discriminator}\``,
          inline: true
        });
      }

      if (changes.length === 0) {
        return; // No important changes
      }

      const embed = new EmbedBuilder()
        .setTitle('✏️ Member Updated')
        .setDescription(`${newMember.toString()}'s information was updated`)
        .setColor('#ffff00')
        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `User ID: ${newMember.user.id}` })
        .addFields([
          {
            name: '👤 Member',
            value: `${newMember.toString()}\n\`${newMember.user.tag}\``,
            inline: true
          }
        ])
        .addFields(changes);

      if (executor) {
        embed.addFields([{
          name: '👮 Executor',
          value: `<@${executor.id}>\n\`${executor.tag}\``,
          inline: true
        }]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged member update for ${newMember.user.tag} in ${newMember.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging member update:', error);
    }
  }

  /**
   * Log member mute/unmute actions
   */
  async logMemberMute(member, action, executor = null, reason = null, duration = null) {
    try {
      const settings = await this.settingsManager.getServerSettings(member.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.members.enabled) {
        return;
      }

      const logChannel = member.guild.channels.cache.get(settings.categories.members.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for member mute in ${member.guild.name}`);
        return;
      }

      const embed = new EmbedBuilder()
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `User ID: ${member.user.id}` })
        .addFields([
          {
            name: '👤 Member',
            value: `${member.toString()}\n\`${member.user.tag}\``,
            inline: true
          }
        ]);

      if (action === 'mute') {
        embed
          .setTitle('🔇 Member Muted')
          .setDescription(`${member.toString()} was muted`)
          .setColor('#ff6600');

        if (duration) {
          embed.addFields([{
            name: '⏱️ Duration',
            value: duration,
            inline: true
          }]);
        }
      } else if (action === 'unmute') {
        embed
          .setTitle('🔊 Member Unmuted')
          .setDescription(`${member.toString()} was unmuted`)
          .setColor('#00ff00');
      } else if (action === 'voice_mute') {
        embed
          .setTitle('🎤 Voice Muted')
          .setDescription(`${member.toString()}'s microphone was muted`)
          .setColor('#ff6600');
      } else if (action === 'voice_unmute') {
        embed
          .setTitle('🎤 Voice Unmuted')
          .setDescription(`${member.toString()}'s microphone was unmuted`)
          .setColor('#00ff00');
      } else if (action === 'voice_deafen') {
        embed
          .setTitle('🔇 Member Deafened')
          .setDescription(`${member.toString()} was deafened`)
          .setColor('#ff6600');
      } else if (action === 'voice_undeafen') {
        embed
          .setTitle('🔊 Member Undeafened')
          .setDescription(`${member.toString()} was undeafened`)
          .setColor('#00ff00');
      }

      if (reason) {
        embed.addFields([{
          name: '📝 Reason',
          value: reason.substring(0, 1024),
          inline: false
        }]);
      }

      if (executor) {
        embed.addFields([{
          name: '👮 Executor',
          value: `<@${executor.id}>\n\`${executor.tag}\``,
          inline: true
        }]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged member ${action} for ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error(`❌ Error logging member ${action}:`, error);
    }
  }

  /**
   * Log member moves between voice channels
   */
  async logMemberMove(member, oldChannel, newChannel, executor = null) {
    try {
      const settings = await this.settingsManager.getServerSettings(member.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.members.enabled) {
        return;
      }

      const logChannel = member.guild.channels.cache.get(settings.categories.members.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for member move in ${member.guild.name}`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('🔄 Member Moved')
        .setDescription(`${member.toString()} was moved between voice channels`)
        .setColor('#0099ff')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `User ID: ${member.user.id}` })
        .addFields([
          {
            name: '👤 Member',
            value: `${member.toString()}\n\`${member.user.tag}\``,
            inline: true
          },
          {
            name: '📤 From Channel',
            value: oldChannel ? `${oldChannel.toString()}\n\`${oldChannel.name}\`` : 'Not specified',
            inline: true
          },
          {
            name: '📥 To Channel',
            value: newChannel ? `${newChannel.toString()}\n\`${newChannel.name}\`` : 'Not specified',
            inline: true
          }
        ]);

      if (executor) {
        embed.addFields([{
          name: '👮 Executor',
          value: `<@${executor.id}>\n\`${executor.tag}\``,
          inline: true
        }]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged member move for ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging member move:', error);
    }
  }

  /**
   * Log voice state updates
   */
  async logVoiceStateUpdate(oldState, newState, executor = null) {
    try {
      const member = newState.member || oldState.member;
      if (!member) return;

      const settings = await this.settingsManager.getServerSettings(member.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.members.enabled) {
        return;
      }

      const logChannel = member.guild.channels.cache.get(settings.categories.members.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for voice state update in ${member.guild.name}`);
        return;
      }

      let action = '';
      let color = '#0099ff';
      let description = '';

      // Determine type of change
      if (!oldState.channel && newState.channel) {
        action = 'Joined Voice Channel';
        color = '#00ff00';
        description = `${member.toString()} joined ${newState.channel.toString()}`;
      } else if (oldState.channel && !newState.channel) {
        action = 'Left Voice Channel';
        color = '#ff0000';
        description = `${member.toString()} left ${oldState.channel.toString()}`;
      } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        action = 'Moved Between Voice Channels';
        color = '#0099ff';
        description = `${member.toString()} moved from ${oldState.channel.toString()} to ${newState.channel.toString()}`;
      } else {
        // Other voice state changes
        const changes = [];

        if (oldState.mute !== newState.mute) {
          changes.push(`Mute: ${newState.mute ? 'Muted' : 'Unmuted'}`);
        }

        if (oldState.deaf !== newState.deaf) {
          changes.push(`Deafen: ${newState.deaf ? 'Deafened' : 'Undeafened'}`);
        }

        if (oldState.selfMute !== newState.selfMute) {
          changes.push(`Self Mute: ${newState.selfMute ? 'Muted' : 'Unmuted'}`);
        }

        if (oldState.selfDeaf !== newState.selfDeaf) {
          changes.push(`Self Deafen: ${newState.selfDeaf ? 'Deafened' : 'Undeafened'}`);
        }

        if (oldState.streaming !== newState.streaming) {
          changes.push(`Streaming: ${newState.streaming ? 'Started' : 'Stopped'}`);
        }

        if (oldState.selfVideo !== newState.selfVideo) {
          changes.push(`Camera: ${newState.selfVideo ? 'Enabled' : 'Disabled'}`);
        }

        if (changes.length === 0) {
          return; // No important changes
        }

        action = 'Voice State Changed';
        description = `${member.toString()}'s voice state changed: ${changes.join(', ')}`;
      }

      const embed = new EmbedBuilder()
        .setTitle(`🎵 ${action}`)
        .setDescription(description)
        .setColor(color)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `User ID: ${member.user.id}` })
        .addFields([
          {
            name: '👤 Member',
            value: `${member.toString()}\n\`${member.user.tag}\``,
            inline: true
          }
        ]);

      if (executor) {
        embed.addFields([{
          name: '👮 Executor',
          value: `<@${executor.id}>\n\`${executor.tag}\``,
          inline: true
        }]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged voice state update for ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging voice state update:', error);
    }
  }

  /**
   * Log presence updates
   */
  async logPresenceUpdate(oldPresence, newPresence) {
    try {
      const member = newPresence.member || oldPresence?.member;
      if (!member) return;

      const settings = await this.settingsManager.getServerSettings(member.guild.id);
      
      // Check presence logging settings (if enabled)
      if (!settings || !settings.enabled || !settings.categories.members.enabled || !settings.categories.members.log_presence) {
        return;
      }

      const logChannel = member.guild.channels.cache.get(settings.categories.members.channelId);
      if (!logChannel) {
        return;
      }

      const changes = [];

      // Status change
      if (oldPresence?.status !== newPresence.status) {
        const statusText = {
          'online': 'Online',
          'idle': 'Idle',
          'dnd': 'Do Not Disturb',
          'offline': 'Offline'
        };

        changes.push({
          name: '🟢 Status',
          value: `**Before:** ${statusText[oldPresence?.status] || 'Unknown'}\n**After:** ${statusText[newPresence.status]}`,
          inline: true
        });
      }

      // Activity change
      const oldActivity = oldPresence?.activities?.[0];
      const newActivity = newPresence.activities?.[0];

      if (oldActivity?.name !== newActivity?.name) {
        changes.push({
          name: '🎮 Activity',
          value: `**Before:** ${oldActivity?.name || 'None'}\n**After:** ${newActivity?.name || 'None'}`,
          inline: true
        });
      }

      if (changes.length === 0) {
        return; // No important changes
      }

      const embed = new EmbedBuilder()
        .setTitle('👁️ Presence Update')
        .setDescription(`${member.toString()}'s presence changed`)
        .setColor('#9932cc')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `User ID: ${member.user.id}` })
        .addFields([
          {
            name: '👤 Member',
            value: `${member.toString()}\n\`${member.user.tag}\``,
            inline: true
          }
        ])
        .addFields(changes);

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged presence update for ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging presence update:', error);
    }
  }
}

module.exports = MemberUpdatesLogger;