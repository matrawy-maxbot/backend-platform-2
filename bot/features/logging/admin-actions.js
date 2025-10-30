/**
 * Admin Actions Logger
 * Handles logging of administrative actions
 */

const { EmbedBuilder } = require('discord.js');

class AdminActionsLogger {
  /**
   * Log general administrative actions
   */
  static async logAdminAction(guild, action, target, executor, reason = null, data = {}) {
    try {
      // Get logging settings
      const settings = await this.getLoggingSettings(guild.id);
      if (!settings?.enabled || !settings.categories?.adminActions?.enabled) {
        return;
      }

      const logChannelId = settings.categories.adminActions.channelId || settings.channelId;
      const logChannel = guild.channels.cache.get(logChannelId);
      if (!logChannel || !logChannel.isTextBased()) {
        return;
      }

      // Action configurations
      const actionConfigs = {
        'ban': { title: '🔨 Admin Action: Ban', color: '#ff0000', emoji: '🔨' },
        'unban': { title: '✅ Admin Action: Unban', color: '#00ff00', emoji: '✅' },
        'kick': { title: '👢 Admin Action: Kick', color: '#ff9900', emoji: '👢' },
        'timeout': { title: '⏰ Admin Action: Timeout', color: '#ff9900', emoji: '⏰' },
        'timeout_remove': { title: '⏰ Admin Action: Remove Timeout', color: '#00ff00', emoji: '⏰' },
        'voice_mute': { title: '🔇 Admin Action: Voice Mute', color: '#ff9900', emoji: '🔇' },
        'voice_unmute': { title: '🔊 Admin Action: Voice Unmute', color: '#00ff00', emoji: '🔊' },
        'voice_deafen': { title: '🔇 Admin Action: Voice Deafen', color: '#ff9900', emoji: '🔇' },
        'voice_undeafen': { title: '🔊 Admin Action: Voice Undeafen', color: '#00ff00', emoji: '🔊' },
        'role_add': { title: '➕ Admin Action: Add Role', color: '#00ff00', emoji: '➕' },
        'role_remove': { title: '➖ Admin Action: Remove Role', color: '#ff0000', emoji: '➖' },
        'nickname_change': { title: '📝 Admin Action: Nickname Change', color: '#0099ff', emoji: '📝' }
      };

      const config = actionConfigs[action] || {
        title: `⚠️ Admin Action: ${action}`,
        color: '#ffff00',
        emoji: '⚠️'
      };

      const embed = new EmbedBuilder()
        .setTitle(config.title)
        .setColor(config.color)
        .setTimestamp()
        .setFooter({ text: 'Admin Actions Log' })
        .addFields([
          { name: '🎯 Target', value: this.formatTarget(target), inline: true },
          { name: '👮 Executor', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true },
          { name: '🏠 Server', value: `${guild.name}`, inline: true }
        ]);

      // Add reason if available
      if (reason) {
        embed.addFields([
          { name: '📝 Reason', value: reason, inline: false }
        ]);
      }

      // Add additional data based on action type
      this.addActionSpecificFields(embed, action, data);

      // Add target image if available
      if (target?.displayAvatarURL) {
        embed.setThumbnail(target.displayAvatarURL({ dynamic: true }));
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Admin Action Log (${action}) in ${guild.name}`);

    } catch (error) {
      console.error('❌ Error logging admin action:', error);
    }
  }

  /**
   * Log permission updates
   */
  static async logPermissionChange(guild, target, executor, oldPermissions, newPermissions) {
    try {
      // Get logging settings
      const settings = await this.getLoggingSettings(guild.id);
      if (!settings?.enabled || !settings.categories?.adminActions?.enabled) {
        return;
      }

      const logChannelId = settings.categories.adminActions.channelId || settings.channelId;
      const logChannel = guild.channels.cache.get(logChannelId);
      if (!logChannel || !logChannel.isTextBased()) {
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('🔐 Admin Action: Permission Change')
        .setColor('#3498db')
        .setTimestamp()
        .setFooter({ text: 'Admin Actions Log' })
        .addFields([
          { name: '🎯 Target', value: this.formatTarget(target), inline: true },
          { name: '👮 Executor', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true },
          { name: '🏠 Server', value: `${guild.name}`, inline: true }
        ]);

      // Compare permissions
      const added = newPermissions.missing(oldPermissions);
      const removed = oldPermissions.missing(newPermissions);

      if (added.length > 0) {
        const addedList = added.map(perm => `• ${this.translatePermission(perm)}`).join('\n');
        embed.addFields([
          { name: '➕ Added Permissions', value: addedList, inline: false }
        ]);
      }

      if (removed.length > 0) {
        const removedList = removed.map(perm => `• ${this.translatePermission(perm)}`).join('\n');
        embed.addFields([
          { name: '➖ Removed Permissions', value: removedList, inline: false }
        ]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Admin Action Log (permission change) in ${guild.name}`);

    } catch (error) {
      console.error('❌ Error logging permission change:', error);
    }
  }

  /**
   * Log administrative server settings updates
   */
  static async logServerSettingsChange(guild, executor, changes) {
    try {
      // Get logging settings
      const settings = await this.getLoggingSettings(guild.id);
      if (!settings?.enabled || !settings.categories?.adminActions?.enabled) {
        return;
      }

      const logChannelId = settings.categories.adminActions.channelId || settings.channelId;
      const logChannel = guild.channels.cache.get(logChannelId);
      if (!logChannel || !logChannel.isTextBased()) {
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('⚙️ Admin Action: Server Settings Change')
        .setColor('#9b59b6')
        .setTimestamp()
        .setFooter({ text: 'Admin Actions Log' })
        .addFields([
          { name: '👮 Executor', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true },
          { name: '🏠 Server', value: `${guild.name}`, inline: true }
        ]);

      // Add changes
      Object.entries(changes).forEach(([key, change]) => {
        embed.addFields([{
          name: `⚙️ ${this.translateSettingKey(key)}`,
          value: `**Before:** ${change.old || 'None'}\n**After:** ${change.new || 'None'}`,
          inline: false
        }]);
      });

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Admin Action Log (server settings change) in ${guild.name}`);

    } catch (error) {
      console.error('❌ Error logging server settings change:', error);
    }
  }

  /**
   * Add action-specific fields
   */
  static addActionSpecificFields(embed, action, data) {
    switch (action) {
      case 'timeout':
        if (data.duration) {
          embed.addFields([{ name: '⏰ Duration', value: data.duration, inline: true }]);
        }
        break;

      case 'role_add':
      case 'role_remove':
        if (data.role) {
          embed.addFields([{ name: '🎭 Role', value: `<@&${data.role.id}>`, inline: true }]);
        }
        break;

      case 'nickname_change':
        if (data.oldNickname !== undefined || data.newNickname !== undefined) {
          embed.addFields([
            { name: '📝 Old Nickname', value: data.oldNickname || 'None', inline: true },
            { name: '📝 New Nickname', value: data.newNickname || 'None', inline: true }
          ]);
        }
        break;

      case 'ban':
        if (data.deleteMessageDays) {
          embed.addFields([{ name: '🗑️ Delete Messages', value: `${data.deleteMessageDays} days`, inline: true }]);
        }
        break;
    }
  }

  /**
   * Format target for display
   */
  static formatTarget(target) {
    if (!target) return 'Unknown';

    // If it's a member
    if (target.user) {
      return `<@${target.user.id}>`;
    }
    // If it's a user or other object
    if (target.id) {
      return `<@${target.id}>`;
    }
    // If it's a role or channel
    if (target.name) {
      return target.name;
    }

    return 'Unknown';
  }

  /**
   * Translate setting keys
   */
  static translateSettingKey(key) {
    const translations = {
      'name': '📝 Server Name',
      'icon': '🖼️ Server Icon',
      'banner': '🖼️ Server Banner',
      'description': '📋 Server Description',
      'verificationLevel': '🔒 Verification Level',
      'defaultMessageNotifications': '🔔 Default Message Notifications',
      'explicitContentFilter': '🔞 Explicit Content Filter',
      'afkChannel': '💤 AFK Channel',
      'afkTimeout': '💤 AFK Timeout',
      'systemChannel': '📢 System Channel',
      'rulesChannel': '📋 Rules Channel',
      'publicUpdatesChannel': '📢 Public Updates Channel'
    };

    return translations[key] || key;
  }

  /**
   * Translate permissions to English
   */
  static translatePermission(permission) {
    const translations = {
      'ADMINISTRATOR': 'Administrator',
      'CREATE_INSTANT_INVITE': 'Create Instant Invite',
      'KICK_MEMBERS': 'Kick Members',
      'BAN_MEMBERS': 'Ban Members',
      'MANAGE_CHANNELS': 'Manage Channels',
      'MANAGE_GUILD': 'Manage Server',
      'ADD_REACTIONS': 'Add Reactions',
      'VIEW_AUDIT_LOG': 'View Audit Log',
      'PRIORITY_SPEAKER': 'Priority Speaker',
      'STREAM': 'Stream',
      'VIEW_CHANNEL': 'View Channel',
      'SEND_MESSAGES': 'Send Messages',
      'SEND_TTS_MESSAGES': 'Send TTS Messages',
      'MANAGE_MESSAGES': 'Manage Messages',
      'EMBED_LINKS': 'Embed Links',
      'ATTACH_FILES': 'Attach Files',
      'READ_MESSAGE_HISTORY': 'Read Message History',
      'MENTION_EVERYONE': 'Mention Everyone',
      'USE_EXTERNAL_EMOJIS': 'Use External Emojis',
      'VIEW_GUILD_INSIGHTS': 'View Server Insights',
      'CONNECT': 'Connect',
      'SPEAK': 'Speak',
      'MUTE_MEMBERS': 'Mute Members',
      'DEAFEN_MEMBERS': 'Deafen Members',
      'MOVE_MEMBERS': 'Move Members',
      'USE_VAD': 'Use Voice Activity',
      'CHANGE_NICKNAME': 'Change Nickname',
      'MANAGE_NICKNAMES': 'Manage Nicknames',
      'MANAGE_ROLES': 'Manage Roles',
      'MANAGE_WEBHOOKS': 'Manage Webhooks',
      'MANAGE_EMOJIS_AND_STICKERS': 'Manage Emojis and Stickers'
    };

    return translations[permission] || permission;
  }

  /**
   * Get logging settings (placeholder - should be implemented based on your settings system)
   */
  static async getLoggingSettings(guildId) {
    // This should be implemented to get settings from your settings manager
    // For now, returning a basic structure
    return {
      enabled: true,
      categories: {
        adminActions: {
          enabled: true,
          channelId: null
        }
      },
      channelId: null
    };
  }
}

module.exports = AdminActionsLogger;