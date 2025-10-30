const { EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

class AutoLogSystem {
  constructor(client) {
    this.client = client;
    this.settingsPath = path.join(__dirname, '../../data/auto-log-settings.json');
    console.log('✅ Auto Log System initialized');
  }

  /**
   * Load auto log settings from file
   */
  async loadSettings() {
    try {
      const data = await fs.readFile(this.settingsPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading auto log settings:', error);
      return {};
    }
  }

  /**
   * Save auto log settings to file
   */
  async saveSettings(settings) {
    try {
      await fs.writeFile(this.settingsPath, JSON.stringify(settings, null, 2));
      console.log('✅ Auto log settings saved successfully');
    } catch (error) {
      console.error('❌ Error saving auto log settings:', error);
    }
  }

  /**
   * Get server auto log settings
   */
  async getServerSettings(guildId) {
    const allSettings = await this.loadSettings();
    return allSettings[guildId] || null;
  }

  /**
   * Check if auto log is enabled for a server
   */
  async isEnabled(guildId) {
    const settings = await this.getServerSettings(guildId);
    return settings && settings.enabled === true;
  }

  /**
   * Log member join/leave events
   */
  async logJoinLeave(member, action) {
    try {
      const settings = await this.getServerSettings(member.guild.id);
      if (!settings || !settings.enabled || !settings.channels.joinLeave) {
        return;
      }

      const channel = member.guild.channels.cache.get(settings.channels.joinLeave);
      if (!channel) {
        console.log(`❌ Auto Log: Join/Leave channel not found for ${member.guild.name}`);
        return;
      }

      const isJoin = action === 'join';
      const embed = new EmbedBuilder()
        .setTitle(isJoin ? '📥 Member Joined' : '📤 Member Left')
        .setDescription(`${member.toString()} ${isJoin ? 'joined' : 'left'} the server`)
        .setColor(isJoin ? '#00ff00' : '#ff0000')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `User ID: ${member.user.id}` })
        .addFields([
          {
            name: '👤 User',
            value: `${member.user.tag}\n<@${member.user.id}>`,
            inline: true
          },
          {
            name: '📅 Account Created',
            value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
            inline: true
          },
          {
            name: '👥 Member Count',
            value: `${member.guild.memberCount}`,
            inline: true
          }
        ]);

      await channel.send({ embeds: [embed] });
      console.log(`✅ Auto Log: ${action} logged for ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error in Auto Log join/leave:', error);
    }
  }

  /**
   * Log kick/ban events
   */
  async logKickBan(user, action, executor, reason, guild = null) {
    try {
      // Get guild from parameter first, then try user/executor as fallback
      const targetGuild = guild || user.guild || executor.guild;
      if (!targetGuild) {
        console.log('❌ Auto Log: No guild found for kick/ban event');
        return;
      }
      
      const settings = await this.getServerSettings(targetGuild.id);
      if (!settings || !settings.enabled || !settings.channels.kickBan) {
        return;
      }

      const channel = targetGuild.channels.cache.get(settings.channels.kickBan);
      if (!channel) {
        console.log(`❌ Auto Log: Kick/Ban channel not found for ${targetGuild.name}`);
        return;
      }

      const isKick = action === 'kick';
      const embed = new EmbedBuilder()
        .setTitle(isKick ? '👢 Member Kicked' : '🔨 Member Banned')
        .setDescription(`${user.tag} was ${action}ed from the server`)
        .setColor('#ff0000')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `User ID: ${user.id}` })
        .addFields([
          {
            name: '👤 User',
            value: `${user.tag}\n<@${user.id}>`,
            inline: true
          },
          {
            name: '👮 Executor',
            value: `${executor.tag}\n<@${executor.id}>`,
            inline: true
          }
        ]);

      if (reason) {
        embed.addFields([{
          name: '📝 Reason',
          value: reason,
          inline: false
        }]);
      }

      await channel.send({ embeds: [embed] });
      console.log(`✅ Auto Log: ${action} logged for ${user.tag} in ${targetGuild.name}`);

    } catch (error) {
      console.error('❌ Error in Auto Log kick/ban:', error);
    }
  }

  /**
   * Log member updates (nickname, roles, etc.)
   */
  async logMemberUpdate(oldMember, newMember, executor = null) {
    try {
      const settings = await this.getServerSettings(newMember.guild.id);
      if (!settings || !settings.enabled || !settings.channels.members) {
        return;
      }

      const channel = newMember.guild.channels.cache.get(settings.channels.members);
      if (!channel) {
        console.log(`❌ Auto Log: Members channel not found for ${newMember.guild.name}`);
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

      await channel.send({ embeds: [embed] });
      console.log(`✅ Auto Log: Member update logged for ${newMember.user.tag} in ${newMember.guild.name}`);

    } catch (error) {
      console.error('❌ Error in Auto Log member update:', error);
    }
  }

  /**
   * Log role changes
   */
  async logRoleChange(role, action, executor = null) {
    try {
      const settings = await this.getServerSettings(role.guild.id);
      if (!settings || !settings.enabled || !settings.channels.roles) {
        return;
      }

      const channel = role.guild.channels.cache.get(settings.channels.roles);
      if (!channel) {
        console.log(`❌ Auto Log: Roles channel not found for ${role.guild.name}`);
        return;
      }

      let title, color, description;
      switch (action) {
        case 'create':
          title = '➕ Role Created';
          color = '#00ff00';
          description = `Role **${role.name}** was created`;
          break;
        case 'delete':
          title = '➖ Role Deleted';
          color = '#ff0000';
          description = `Role **${role.name}** was deleted`;
          break;
        case 'update':
          title = '✏️ Role Updated';
          color = '#ffff00';
          description = `Role **${role.name}** was updated`;
          break;
        default:
          return;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: `Role ID: ${role.id}` })
        .addFields([
          {
            name: '🎭 Role',
            value: `${role.toString()}\n\`${role.name}\``,
            inline: true
          },
          {
            name: '🎨 Color',
            value: role.hexColor || '#000000',
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

      await channel.send({ embeds: [embed] });
      console.log(`✅ Auto Log: Role ${action} logged for ${role.name} in ${role.guild.name}`);

    } catch (error) {
      console.error('❌ Error in Auto Log role change:', error);
    }
  }

  /**
   * Log message events
   */
  async logMessageEvent(message, action, executor = null, oldContent = null) {
    try {
      const settings = await this.getServerSettings(message.guild.id);
      if (!settings || !settings.enabled || !settings.channels.messages) {
        return;
      }

      const channel = message.guild.channels.cache.get(settings.channels.messages);
      if (!channel) {
        console.log(`❌ Auto Log: Messages channel not found for ${message.guild.name}`);
        return;
      }

      let title, color, description;
      switch (action) {
        case 'delete':
          title = '🗑️ Message Deleted';
          color = '#ff0000';
          description = `Message by ${message.author.tag} was deleted`;
          break;
        case 'edit':
          title = '✏️ Message Edited';
          color = '#ffff00';
          description = `Message by ${message.author.tag} was edited`;
          break;
        default:
          return;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `Message ID: ${message.id}` })
        .addFields([
          {
            name: '👤 Author',
            value: `${message.author.tag}\n<@${message.author.id}>`,
            inline: true
          },
          {
            name: '📍 Channel',
            value: `<#${message.channel.id}>`,
            inline: true
          }
        ]);

      // For message edits, show both old and new content
      if (action === 'edit' && oldContent) {
        if (oldContent.length > 0) {
          embed.addFields([{
            name: '📝 Old Content',
            value: oldContent.substring(0, 1024),
            inline: false
          }]);
        }
        if (message.content && message.content.length > 0) {
          embed.addFields([{
            name: '✏️ New Content',
            value: message.content.substring(0, 1024),
            inline: false
          }]);
        }
      } else if (message.content && message.content.length > 0) {
        embed.addFields([{
          name: '💬 Content',
          value: message.content.substring(0, 1024),
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

      await channel.send({ embeds: [embed] });
      console.log(`✅ Auto Log: Message ${action} logged in ${message.guild.name}`);

    } catch (error) {
      console.error('❌ Error in Auto Log message event:', error);
    }
  }

  /**
   * Log server settings changes
   */
  async logServerChange(guild, action, changes = [], executor = null) {
    try {
      const settings = await this.getServerSettings(guild.id);
      if (!settings || !settings.enabled || !settings.channels.serverSettings) {
        return;
      }

      const channel = guild.channels.cache.get(settings.channels.serverSettings);
      if (!channel) {
        console.log(`❌ Auto Log: Server Settings channel not found for ${guild.name}`);
        return;
      }

      let title, color, description;
      switch (action) {
        case 'channelCreate':
          title = '🆕 Channel Created';
          color = '#00ff00';
          description = 'A new channel was created';
          break;
        case 'channelDelete':
          title = '🗑️ Channel Deleted';
          color = '#ff0000';
          description = 'A channel was deleted';
          break;
        case 'serverUpdate':
          title = '🏠 Server Updated';
          color = '#ffa500';
          description = 'Server settings were changed';
          break;
        default:
          title = '⚙️ Server Updated';
          color = '#0099ff';
          description = 'Server settings were changed';
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `Server ID: ${guild.id}` });

      if (changes.length > 0) {
        embed.addFields(changes);
      }

      if (executor) {
        embed.addFields([{
          name: '👮 Executor',
          value: `<@${executor.id}>\n\`${executor.tag}\``,
          inline: true
        }]);
      }

      await channel.send({ embeds: [embed] });
      console.log(`✅ Auto Log: Server change logged in ${guild.name}`);

    } catch (error) {
      console.error('❌ Error in Auto Log server change:', error);
    }
  }
}

module.exports = AutoLogSystem;