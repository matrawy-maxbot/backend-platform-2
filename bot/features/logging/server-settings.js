const { EmbedBuilder } = require('discord.js');

class ServerSettingsLogger {
  constructor(client, settingsManager) {
    this.client = client;
    this.settingsManager = settingsManager;
  }

  /**
   * Log server changes (name and icon)
   */
  async logServerChange(oldGuild, newGuild, executor = null) {
    try {
      console.log(`🔍 [SERVER-SETTINGS] ========== SERVER CHANGE DETECTED ==========`);
      console.log(`🔍 [SERVER-SETTINGS] Guild: ${newGuild.name} (${newGuild.id})`);
      console.log(`🔍 [SERVER-SETTINGS] Old name: "${oldGuild.name}"`);
      console.log(`🔍 [SERVER-SETTINGS] New name: "${newGuild.name}"`);
      console.log(`🔍 [SERVER-SETTINGS] Old icon: ${oldGuild.iconURL() || 'null'}`);
      console.log(`🔍 [SERVER-SETTINGS] New icon: ${newGuild.iconURL() || 'null'}`);
      console.log(`🔍 [SERVER-SETTINGS] Executor: ${executor ? executor.tag : 'null'}`);
      
      // Check if there are actual changes
      const nameChanged = oldGuild.name !== newGuild.name;
      const iconChanged = oldGuild.iconURL() !== newGuild.iconURL();
      console.log(`🔍 [SERVER-SETTINGS] Name changed: ${nameChanged}`);
      console.log(`🔍 [SERVER-SETTINGS] Icon changed: ${iconChanged}`);
      
      if (!nameChanged && !iconChanged) {
        console.log(`❌ [SERVER-SETTINGS] No actual changes detected, skipping log`);
        return;
      }
      
      // Load manual log settings from the correct file
       console.log(`🔍 [SERVER-SETTINGS] Loading manual log settings from manual-log-settings.json...`);
       const fs = require('fs').promises;
       const path = require('path');
       
       let manualLogSettings = {};
       try {
         const settingsPath = path.join(__dirname, '../../data/manual-log-settings.json');
         console.log(`🔍 [SERVER-SETTINGS] Settings path: ${settingsPath}`);
         const settingsData = await fs.readFile(settingsPath, 'utf8');
         manualLogSettings = JSON.parse(settingsData);
         console.log(`🔍 [SERVER-SETTINGS] Manual log settings loaded successfully`);
       } catch (error) {
         console.log(`❌ [SERVER-SETTINGS] Error loading manual log settings:`, error.message);
         return;
       }
      
      const serverSettings = manualLogSettings[newGuild.id];
      console.log(`🔍 [SERVER-SETTINGS] Server settings for ${newGuild.id}:`, JSON.stringify(serverSettings, null, 2));
      
      if (!serverSettings) {
        console.log(`❌ [SERVER-SETTINGS] No manual log settings found for guild ${newGuild.id}`);
        return;
      }
      
      if (!serverSettings.enabled) {
        console.log(`❌ [SERVER-SETTINGS] Manual logging disabled for guild ${newGuild.id}`);
        return;
      }
      
      if (!serverSettings.categories?.serverSettings?.enabled) {
        console.log(`❌ [SERVER-SETTINGS] Server settings category disabled for guild ${newGuild.id}`);
        return;
      }

      const channelId = serverSettings.categories.serverSettings.channelId;
      console.log(`🔍 [SERVER-SETTINGS] Target channel ID: ${channelId}`);
      
      if (!channelId) {
        console.log(`❌ [SERVER-SETTINGS] No channel ID configured for server settings`);
        return;
      }

      console.log(`🔍 [SERVER-SETTINGS] Fetching log channel from cache...`);
      const logChannel = this.client.channels.cache.get(channelId);
      console.log(`🔍 [SERVER-SETTINGS] Log channel:`, logChannel ? `${logChannel.name} (${logChannel.id}) in ${logChannel.guild.name}` : 'NOT FOUND');
      
      if (!logChannel) {
        console.log(`❌ [SERVER-SETTINGS] Log channel ${channelId} not found in bot's cache`);
        console.log(`🔍 [SERVER-SETTINGS] Available channels in cache:`, this.client.channels.cache.size);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('🏠 Server Settings Updated')
        .setColor('#0099ff')
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' });

      let description = '';
      let hasChanges = false;

      // Check name change
      if (oldGuild.name !== newGuild.name) {
        description += `**📝 Server Name Changed:**\n`;
        description += `**Old:** ${oldGuild.name}\n`;
        description += `**New:** ${newGuild.name}\n\n`;
        hasChanges = true;
      }

      // Check icon change
      if (oldGuild.iconURL() !== newGuild.iconURL()) {
        description += `**🖼️ Server Icon Changed**\n\n`;
        hasChanges = true;
        
        if (newGuild.iconURL()) {
          // Use setImage for larger, clearer display of server icon
          embed.setImage(newGuild.iconURL({ dynamic: true, size: 512 }));
          
          // Also add old icon as thumbnail for comparison if it exists
          if (oldGuild.iconURL()) {
            embed.setThumbnail(oldGuild.iconURL({ dynamic: true, size: 256 }));
            description += `**Old Icon:** [View Old Icon](${oldGuild.iconURL({ dynamic: true, size: 512 })})\n`;
            description += `**New Icon:** [View New Icon](${newGuild.iconURL({ dynamic: true, size: 512 })})\n\n`;
          }
        }
      }

      if (!hasChanges) return;

      embed.setDescription(description);
      embed.addFields([
        { name: '🏠 Server', value: `${newGuild.name} (${newGuild.id})`, inline: false },
        { name: '👤 Changed By', value: executor ? `${executor.tag} (${executor.id})` : 'Unknown', inline: false },
        { name: '🕐 Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
      ]);

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ [SERVER-SETTINGS] Successfully sent server change log to ${logChannel.name}`);

    } catch (error) {
      console.error('❌ [SERVER-SETTINGS] Error logging server change:', error);
    }
  }

  /**
   * Log channel changes
   */
  async logChannelChange(channel, action, executor = null, changes = null) {
    try {
      const serverSettings = await this.settingsManager.getServerSettings(channel.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.serverSettings?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.serverSettings.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const actionMap = {
        'create': { title: '➕ New Channel Created', color: '#00ff00', description: `Channel **${channel.name}** was created` },
        'delete': { title: '🗑️ Channel Deleted', color: '#ff0000', description: `Channel **${channel.name}** was deleted` },
        'update': { title: '✏️ Channel Updated', color: '#0099ff', description: `Channel **${channel.name}** was updated` }
      };

      const actionInfo = actionMap[action] || actionMap['update'];

      const embed = new EmbedBuilder()
        .setTitle(actionInfo.title)
        .setDescription(actionInfo.description)
        .setColor(actionInfo.color)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '📝 Channel', value: action === 'delete' ? channel.name : `<#${channel.id}>`, inline: true },
          { name: '📂 Type', value: this.getChannelTypeText(channel.type), inline: true },
          { name: '👮 Changed By', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
        ]);

      // Add changes if available
      if (changes && Object.keys(changes).length > 0) {
        Object.entries(changes).forEach(([key, change]) => {
          let fieldName = key;
          if (key === 'name') fieldName = '📝 Name';
          else if (key === 'topic') fieldName = '📋 Topic';
          else if (key === 'position') fieldName = '📍 Position';
          else if (key === 'nsfw') fieldName = '🔞 NSFW';

          embed.addFields({
            name: fieldName,
            value: `**Before:** ${change.old || 'None'}\n**After:** ${change.new || 'None'}`,
            inline: false
          });
        });
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Manual Log (channel ${action}) for channel ${channel.name} in ${channel.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging channel change:', error);
    }
  }

  /**
   * Log role changes
   */
  async logRoleChange(role, action, executor = null, changes = null) {
    try {
      const serverSettings = await this.settingsManager.getServerSettings(role.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.roles?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.roles.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const actionMap = {
        'create': { title: '➕ New Role Created', color: '#00ff00', description: `Role **${role.name}** was created` },
        'delete': { title: '🗑️ Role Deleted', color: '#ff0000', description: `Role **${role.name}** was deleted` },
        'update': { title: '✏️ Role Updated', color: '#0099ff', description: `Role **${role.name}** was updated` }
      };

      const actionInfo = actionMap[action] || actionMap['update'];

      const embed = new EmbedBuilder()
        .setTitle(actionInfo.title)
        .setDescription(actionInfo.description)
        .setColor(actionInfo.color)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '🎭 Role', value: action === 'delete' ? role.name : `<@&${role.id}>`, inline: true },
          { name: '🎨 Color', value: role.hexColor || '#000000', inline: true },
          { name: '👮 Changed By', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
        ]);

      // Add changes if available
      if (changes && Object.keys(changes).length > 0) {
        Object.entries(changes).forEach(([key, change]) => {
          let fieldName = key;
          if (key === 'name') fieldName = '📝 Name';
          else if (key === 'color') fieldName = '🎨 Color';
          else if (key === 'permissions') fieldName = '🔐 Permissions';
          else if (key === 'mentionable') fieldName = '📢 Mentionable';
          else if (key === 'hoist') fieldName = '📌 Display Separately';

          let oldValue = change.old;
          let newValue = change.new;

          // Special handling for permissions
          if (key === 'permissions') {
            oldValue = this.formatPermissions(change.old);
            newValue = this.formatPermissions(change.new);
          }

          embed.addFields({
            name: fieldName,
            value: `**Before:** ${oldValue || 'None'}\n**After:** ${newValue || 'None'}`,
            inline: false
          });
        });
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Sent Manual Log (role ${action}) for role ${role.name} in ${role.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging role change:', error);
    }
  }

  /**
   * Get channel type text
   */
  getChannelTypeText(type) {
    const channelTypes = {
      0: 'Text Channel',
      1: 'Direct Message',
      2: 'Voice Channel',
      3: 'Group DM',
      4: 'Category',
      5: 'Announcement Channel',
      10: 'Announcement Thread',
      11: 'Public Thread',
      12: 'Private Thread',
      13: 'Stage Channel',
      15: 'Forum'
    };
    
    return channelTypes[type] || `Unknown Type (${type})`;
  }

  /**
   * Format permissions for display
   */
  formatPermissions(permissions) {
    if (!permissions || permissions.length === 0) {
      return 'No permissions';
    }

    const permissionNames = permissions.map(perm => this.translatePermission(perm)).join(', ');
    return permissionNames.length > 100 ? permissionNames.substring(0, 100) + '...' : permissionNames;
  }

  /**
   * Translate permissions to English
   */
  translatePermission(permission) {
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
}

module.exports = ServerSettingsLogger;