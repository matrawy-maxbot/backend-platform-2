const fs = require('fs').promises;
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

class ManualLogSystem {
  constructor() {
    this.settingsPath = path.join(__dirname, '../../data/manual-log-settings.json');
  }

  /**
   * تحميل إعدادات السيرفر
   */
  async loadServerSettings(guildId) {
    console.log(`🔍 loadServerSettings called for guild: ${guildId}`);
    console.log(`📁 Settings path: ${this.settingsPath}`);
    
    try {
      console.log(`📖 Attempting to read settings file...`);
      const data = await fs.readFile(this.settingsPath, 'utf8');
      console.log(`✅ File read successfully, parsing JSON...`);
      
      const allSettings = JSON.parse(data);
      console.log(`📊 All settings keys:`, Object.keys(allSettings));
      
      const guildSettings = allSettings[guildId] || null;
      console.log(`⚙️ Guild settings for ${guildId}:`, guildSettings ? 'Found' : 'Not found');
      
      return guildSettings;
    } catch (error) {
      console.log(`❌ Error in loadServerSettings:`, error.message);
      console.log(`❌ Error code:`, error.code);
      
      if (error.code === 'ENOENT') {
        console.log(`📂 Settings file does not exist at: ${this.settingsPath}`);
        return null;
      }
      logger.error('Error loading Manual Log settings:', error);
      return null;
    }
  }

  /**
   * Check if manual log is enabled for a server
   */
  async isEnabled(guildId) {
    const settings = await this.loadServerSettings(guildId);
    if (!settings) return false;
    
    // Only return true if the global setting is explicitly enabled
    // This allows Auto Log to work when Manual Log global setting is disabled
    return settings.enabled === true;
  }

  /**
   * Check if a specific category is enabled for manual log
   */
  async isCategoryEnabled(guildId, categoryName) {
    const settings = await this.loadServerSettings(guildId);
    if (!settings) return false;
    
    // Manual Log must be globally enabled for any category to work
    if (settings.enabled !== true) return false;
    
    // Check if the specific category is enabled
    if (settings.categories && settings.categories[categoryName]) {
      return settings.categories[categoryName].enabled === true;
    }
    
    return false;
  }

  /**
   * Save server settings
   */
  async saveServerSettings(guildId, settings) {
    try {
      let allSettings = {};
      try {
        const data = await fs.readFile(this.settingsPath, 'utf8');
        allSettings = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      allSettings[guildId] = settings;

      const dir = path.dirname(this.settingsPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.settingsPath, JSON.stringify(allSettings, null, 2));
      
      logger.info(`Manual Log settings saved for server ${guildId}`);
      return true;
    } catch (error) {
      logger.error('Error saving Manual Log settings:', error);
      return false;
    }
  }

  /**
   * إرسال log للانضمام والمغادرة
   */
  async logJoinLeave(member, action) {
    try {
      const isEnabled = await this.isCategoryEnabled(member.guild.id, 'joinLeave');
      if (!isEnabled) {
        return;
      }

      const settings = await this.loadServerSettings(member.guild.id);

      const logChannelId = settings.categories?.joinLeave?.channelId || settings.channelId;
      const channel = member.guild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      let embed;
      
      if (action === 'join') {
        const accountAge = Math.floor((Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24));
        
        embed = new EmbedBuilder()
          .setTitle('📥 Member Joined')
          .setDescription(`**${member.user.tag}** joined the server`)
          .setColor(0x2ecc71)
          .setTimestamp()
          .setFooter({ text: 'Manual Log System' })
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
          .addFields([
            { name: '👤 Member', value: `<@${member.user.id}>`, inline: true },
            { name: '🆔 User ID', value: member.user.id, inline: true },
            { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`, inline: false },
            { name: '⏰ Account Age', value: `${accountAge} days`, inline: true },
            { name: '👥 Member Count', value: member.guild.memberCount.toString(), inline: true }
          ]);
      } else {
        const timeInServer = member.joinedTimestamp ? 
          Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24)) : 'Unknown';
        
        embed = new EmbedBuilder()
          .setTitle('📤 Member Left')
          .setDescription(`**${member.user.tag}** left the server`)
          .setColor(0xe74c3c)
          .setTimestamp()
          .setFooter({ text: 'Manual Log System' })
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
          .addFields([
            { name: '👤 Member', value: `${member.user.tag}`, inline: true },
            { name: '🆔 User ID', value: member.user.id, inline: true },
            { name: '📅 Joined Server', value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : 'Unknown', inline: false },
            { name: '⏰ Time in Server', value: timeInServer !== 'Unknown' ? `${timeInServer} days` : 'Unknown', inline: true },
            { name: '👥 Member Count', value: member.guild.memberCount.toString(), inline: true }
          ]);
      }

      await channel.send({ embeds: [embed] });
      logger.info(`Manual Log (nickname change) sent for member ${newMember.user.tag} in ${newMember.guild.name}`);

    } catch (error) {
      console.log(`❌ Error in logMemberNicknameChange:`, error);
      logger.error('Error sending Manual Log (nickname change):', error);
    }
  }

  /**
   * إرسال log للطرد والحظر
   */
  async logKickBan(member, action, executor, reason) {
    try {
      const settings = await this.loadServerSettings(member.guild.id);
      
      if (!settings?.enabled || !settings.categories?.members?.enabled) {
        return;
      }

      const logChannelId = settings.categories.members.channelId || settings.channelId;
      const channel = member.guild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      let title, color, icon;
      
      if (action === 'kick') {
        title = '👢 Member Kicked';
        color = 0xf39c12;
        icon = '👢';
      } else {
        title = '🔨 Member Banned';
        color = 0xe74c3c;
        icon = '🔨';
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(`**${member.user.tag}** was ${action}ed`)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields([
          { name: '👤 Member', value: `${member.user.tag}`, inline: true },
          { name: '🆔 User ID', value: member.user.id, inline: true },
          { name: '👮 Moderator', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true },
          { name: '📝 Reason', value: reason || 'No reason provided', inline: false }
        ]);

      await channel.send({ embeds: [embed] });
      logger.info(`Manual Log (${action}) sent for member ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      logger.error(`Error sending Manual Log (${action}):`, error);
    }
  }

  /**
   * إرسال log لتغيير الأدوار
   */
  async logRoleChange(role, action, executor, changes = null) {
    try {
      const settings = await this.loadServerSettings(role.guild.id);
      
      if (!settings?.enabled || !settings.categories?.serverSettings?.enabled) {
        return;
      }

      const logChannelId = settings.categories.serverSettings.channelId || settings.channelId;
      const channel = role.guild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      let title, color, description;
      
      if (action === 'create') {
        title = '➕ Role Created';
        color = 0x2ecc71;
        description = `Role **${role.name}** was created`;
      } else if (action === 'delete') {
        title = '➖ Role Deleted';
        color = 0xe74c3c;
        description = `Role **${role.name}** was deleted`;
      } else {
        title = '✏️ Role Updated';
        color = 0x3498db;
        description = `Role **${role.name}** was updated`;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '🎭 Role', value: action === 'delete' ? role.name : `<@&${role.id}>`, inline: true },
          { name: '👮 Changed By', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
        ]);

      if (changes && Object.keys(changes).length > 0) {
        Object.entries(changes).forEach(([key, change]) => {
          let fieldName = key;
          if (key === 'name') fieldName = '📝 Name';
          else if (key === 'color') fieldName = '🎨 Color';
          else if (key === 'permissions') fieldName = '🔐 Permissions';
          else if (key === 'position') fieldName = '📍 Position';
          else if (key === 'mentionable') fieldName = '📢 Mentionable';
          else if (key === 'hoist') fieldName = '📌 Display Separately';

          embed.addFields({
            name: fieldName,
            value: `**Before:** ${change.old}\n**After:** ${change.new}`,
            inline: false
          });
        });
      }

      await channel.send({ embeds: [embed] });
      logger.info(`Manual Log (role ${action}) sent for role ${role.name} in ${role.guild.name}`);

    } catch (error) {
      logger.error(`Error sending Manual Log (role ${action}):`, error);
    }
  }

  /**
   * إرسال log لتغيير أدوار العضو
   */
  async logMemberRoleChange(oldMember, newMember, executor) {
    try {
      console.log(`🔍 [logMemberRoleChange] Starting for ${newMember.user.tag} in ${newMember.guild.name}`);
      
      const settings = await this.loadServerSettings(newMember.guild.id);
      console.log(`📋 [logMemberRoleChange] Settings loaded:`, {
        enabled: settings?.enabled,
        membersEnabled: settings?.categories?.members?.enabled,
        channelId: settings?.categories?.members?.channelId || settings?.channelId
      });
      
      if (!settings?.enabled || !settings.categories?.members?.enabled) {
        console.log(`❌ [logMemberRoleChange] Manual log disabled for guild ${newMember.guild.name}`);
        return;
      }

      const logChannelId = settings.categories.members.channelId || settings.channelId;
      console.log(`🔍 [logMemberRoleChange] Looking for channel ID: ${logChannelId}`);
      
      const channel = newMember.guild.channels.cache.get(logChannelId);
      console.log(`📺 [logMemberRoleChange] Channel found:`, {
        exists: !!channel,
        name: channel?.name,
        type: channel?.type,
        isTextBased: channel?.isTextBased()
      });
      
      if (!channel || !channel.isTextBased()) {
        console.log(`❌ [logMemberRoleChange] Channel not found or not text-based`);
        return;
      }

      const oldRoles = oldMember.roles.cache;
      const newRoles = newMember.roles.cache;

      const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
      const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

      console.log(`🔄 [logMemberRoleChange] Role changes:`, {
        addedCount: addedRoles.size,
        removedCount: removedRoles.size,
        addedRoles: addedRoles.map(r => r.name),
        removedRoles: removedRoles.map(r => r.name)
      });

      if (addedRoles.size === 0 && removedRoles.size === 0) {
        console.log(`ℹ️ [logMemberRoleChange] No role changes detected`);
        return;
      }

      let title, color, description;
      
      if (addedRoles.size > 0 && removedRoles.size === 0) {
        title = '➕ Role Added';
        color = 0x2ecc71;
        description = `**${newMember.user.tag}** was given role(s)`;
      } else if (removedRoles.size > 0 && addedRoles.size === 0) {
        title = '➖ Role Removed';
        color = 0xe74c3c;
        description = `**${newMember.user.tag}** had role(s) removed`;
      } else {
        title = '🔄 Roles Changed';
        color = 0x3498db;
        description = `**${newMember.user.tag}**'s roles were updated`;
      }

      console.log(`📝 [logMemberRoleChange] Creating embed with title: ${title}`);

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields([
          { name: '👤 Member', value: `<@${newMember.user.id}>`, inline: true },
          { name: '👮 Changed By', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
        ]);

      if (addedRoles.size > 0) {
        embed.addFields({
          name: '➕ Added Roles',
          value: addedRoles.map(role => `<@&${role.id}>`).join(', '),
          inline: false
        });
      }

      if (removedRoles.size > 0) {
        embed.addFields({
          name: '➖ Removed Roles',
          value: removedRoles.map(role => `<@&${role.id}>`).join(', '),
          inline: false
        });
      }

      console.log(`📤 [logMemberRoleChange] Sending embed to channel ${channel.name}`);
      await channel.send({ embeds: [embed] });
      console.log(`✅ [logMemberRoleChange] Embed sent successfully!`);
      
      logger.info(`Manual Log (role change) sent for member ${newMember.user.tag} in ${newMember.guild.name}`);

    } catch (error) {
      console.error(`❌ [logMemberRoleChange] Error:`, error);
      logger.error('Error sending Manual Log (role change):', error);
    }
  }

  /**
   * إرسال log لتغيير القنوات
   */
  async logChannelChange(action, channel, executor, changes = null) {
    try {
      const settings = await this.loadServerSettings(channel.guild.id);
      
      if (!settings?.enabled || !settings.categories?.channels?.enabled) {
        return;
      }

      const logChannelId = settings.categories.channels.channelId || settings.channelId;
      const logChannel = channel.guild.channels.cache.get(logChannelId);
      if (!logChannel || !logChannel.isTextBased()) {
        return;
      }

      let title, color, description;
      
      if (action === 'create') {
        title = '📝 Channel Created';
        color = 0x2ecc71;
        description = `Channel **${channel.name}** was created`;
      } else if (action === 'delete') {
        title = '🗑️ Channel Deleted';
        color = 0xe74c3c;
        description = `Channel **${channel.name}** was deleted`;
      } else {
        title = '✏️ Channel Updated';
        color = 0x3498db;
        description = `Channel **${channel.name}** was updated`;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '📝 Channel', value: action === 'delete' ? channel.name : `<#${channel.id}>`, inline: true },
          { name: '📂 Type', value: channel.type.toString(), inline: true },
          { name: '👮 Changed By', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
        ]);

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
      logger.info(`Manual Log (channel ${action}) sent for channel ${channel.name} in ${channel.guild.name}`);

    } catch (error) {
      logger.error(`Error sending Manual Log (channel ${action}):`, error);
    }
  }

  /**
   * إرسال log لحذف وتعديل الرسائل
   */
  async logMessageChange(message, action, executor = null, newContent = null) {
    try {
      const settings = await this.loadServerSettings(message.guild.id);
      
      if (!settings?.enabled || !settings.categories?.messages?.enabled) {
        return;
      }

      const logChannelId = settings.categories.messages.channelId || settings.channelId;
      const channel = message.guild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      let title, color, description;
      
      if (action === 'delete') {
        title = '🗑️ Message Deleted';
        color = 0xe74c3c;
        description = `Message by **${message.author.tag}** was deleted`;
      } else {
        title = '✏️ Message Edited';
        color = 0x3498db;
        description = `Message by **${message.author.tag}** was edited`;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields([
          { name: '👤 Author', value: `<@${message.author.id}>`, inline: true },
          { name: '📝 Channel', value: `<#${message.channel.id}>`, inline: true },
          { name: '🆔 Message ID', value: message.id, inline: true }
        ]);

      if (action === 'delete') {
        embed.addFields({
          name: '📄 Content',
          value: message.content ? (message.content.length > 1000 ? message.content.substring(0, 1000) + '...' : message.content) : '*No text content*',
          inline: false
        });
      } else {
        embed.addFields([
          {
            name: '📄 Before',
            value: message.content ? (message.content.length > 500 ? message.content.substring(0, 500) + '...' : message.content) : '*No text content*',
            inline: false
          },
          {
            name: '📄 After',
            value: newContent ? (newContent.length > 500 ? newContent.substring(0, 500) + '...' : newContent) : '*No text content*',
            inline: false
          }
        ]);
      }

      if (executor) {
        embed.addFields({ name: '👮 Deleted By', value: `<@${executor.id}>`, inline: true });
      }

      await channel.send({ embeds: [embed] });
      logger.info(`Manual Log (message ${action}) sent for message from ${message.author.tag} in ${message.guild.name}`);

    } catch (error) {
      logger.error(`Error sending Manual Log (message ${action}):`, error);
    }
  }

  /**
   * إرسال log لتغيير الكنية
   */
  async logMemberNicknameChange(oldMember, newMember, executor) {
    try {
      const settings = await this.loadServerSettings(newMember.guild.id);
      
      if (!settings?.enabled || !settings.categories?.members?.enabled) {
        return;
      }

      const logChannelId = settings.categories.members.channelId || settings.channelId;
      const channel = newMember.guild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      const oldNickname = oldMember.nickname || oldMember.user.username;
      const newNickname = newMember.nickname || newMember.user.username;
      console.log(`📝 Nicknames - Old: "${oldNickname}", New: "${newNickname}"`);

      if (oldNickname === newNickname) {
        console.log(`❌ Nicknames are the same, skipping`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('📝 Nickname Changed')
        .setDescription(`**${newMember.user.tag}**'s nickname was updated`)
        .setColor(0x3498db)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields([
          { name: '👤 Member', value: `<@${newMember.user.id}>`, inline: true },
          { name: '👮 Changed By', value: executor ? `<@${executor.id}>` : 'Member themselves', inline: true },
          { name: '📝 Previous Nickname', value: `\`${oldNickname}\``, inline: false },
          { name: '📝 New Nickname', value: `\`${newNickname}\``, inline: false }
        ]);

      console.log(`📤 Attempting to send embed to channel ${channel.name}`);
      await channel.send({ embeds: [embed] });
      console.log(`✅ Embed sent successfully to ${channel.name}`);
      
      logger.info(`Manual Log (nickname change) sent for member ${newMember.user.tag} in ${newMember.guild.name}`);

    } catch (error) {
      console.log(`❌ Error in logMemberNicknameChange:`, error);
      logger.error('Error sending Manual Log (nickname change):', error);
    }
  }

  /**
   * Send log for text and voice mute
   */
  async logMemberMute(member, muteType, action, executor, reason, duration = null) {
    try {
      const settings = await this.loadServerSettings(member.guild.id);
      
      if (!settings?.enabled || !settings.categories?.members?.enabled) {
        return;
      }

      const logChannelId = settings.categories.members.channelId || settings.channelId;
      const channel = member.guild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      let title, description, color;
      
      if (muteType === 'text') {
        if (action === 'mute') {
          title = '🔇 Text Muted';
          description = `**${member.user.tag}** was text muted`;
          color = 0xe74c3c;
        } else {
          title = '🔊 Text Unmuted';
          description = `**${member.user.tag}** was text unmuted`;
          color = 0x2ecc71;
        }
      } else if (muteType === 'voice') {
        if (action === 'mute') {
          title = '🔇 Voice Muted';
          description = `**${member.user.tag}** was voice muted`;
          color = 0xe74c3c;
        } else {
          title = '🔊 Voice Unmuted';
          description = `**${member.user.tag}** was voice unmuted`;
          color = 0x2ecc71;
        }
      }

      console.log(`🎨 Embed details - Title: ${title}, Color: ${color}`);

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields([
          { name: '👤 Member', value: `<@${member.user.id}>`, inline: true },
          { name: '👮 Moderator', value: executor ? `<@${executor.id}>` : 'Automatic System', inline: true },
          { name: '📝 Reason', value: reason || 'No reason provided', inline: false }
        ]);

      if (duration && action === 'mute') {
        embed.addFields({ name: '⏱️ Duration', value: duration, inline: true });
      }

      console.log(`📤 Attempting to send embed to channel ${channel.name}`);
      await channel.send({ embeds: [embed] });
      console.log(`✅ Embed sent successfully!`);
      logger.info(`Manual Log (${muteType} ${action}) sent for member ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error(`❌ Error in logMemberMute:`, error);
      logger.error(`Error sending Manual Log (${muteType} ${action}):`, error);
    }
  }

  /**
   * Send log for timeout (temporary punishment)
   */
  async logMemberTimeout(member, action, executor, reason, duration = null, endsAt = null) {
    try {
      const settings = await this.loadServerSettings(member.guild.id);
      
      if (!settings?.enabled || !settings.categories?.members?.enabled) {
        return;
      }

      const logChannelId = settings.categories.members.channelId || settings.channelId;
      const channel = member.guild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      let title, description, color;
      
      if (action === 'timeout') {
        title = '⏰ Member Timed Out';
        description = `**${member.user.tag}** was given a timeout`;
        color = 0xf39c12;
      } else {
        title = '✅ Timeout Removed';
        description = `**${member.user.tag}**'s timeout was removed`;
        color = 0x2ecc71;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields([
          { name: '👤 Member', value: `<@${member.user.id}>`, inline: true },
          { name: '👮 Moderator', value: executor ? `<@${executor.id}>` : 'Automatic System', inline: true },
          { name: '📝 Reason', value: reason || 'No reason provided', inline: false }
        ]);

      if (duration && action === 'timeout') {
        embed.addFields({ name: '⏱️ Duration', value: duration, inline: true });
      }

      if (endsAt && action === 'timeout') {
        embed.addFields({ name: '🕐 Ends At', value: `<t:${Math.floor(endsAt.getTime() / 1000)}:F>`, inline: true });
      }

      await channel.send({ embeds: [embed] });
      logger.info(`Manual Log (${action}) sent for member ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      logger.error(`Error sending Manual Log (${action}):`, error);
    }
  }

  /**
   * Send log for server avatar change
   */
  async logMemberAvatarChange(oldMember, newMember, executor) {
    try {
      const settings = await this.loadServerSettings(newMember.guild.id);
      
      if (!settings?.enabled || !settings.categories?.members?.enabled) {
        return;
      }

      const logChannelId = settings.categories.members.channelId || settings.channelId;
      const channel = newMember.guild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      const oldAvatar = oldMember.avatar;
      const newAvatar = newMember.avatar;

      if (oldAvatar === newAvatar) {
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('🖼️ Server Avatar Changed')
        .setDescription(`**${newMember.user.tag}** changed their server avatar`)
        .setColor(0x9b59b6)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '👤 Member', value: `<@${newMember.user.id}>`, inline: true },
          { name: '👮 Changed By', value: executor ? `<@${executor.id}>` : 'Member themselves', inline: true }
        ]);

      if (oldAvatar) {
        embed.addFields({ name: '🖼️ Previous Avatar', value: `[View Previous Avatar](${oldMember.displayAvatarURL({ dynamic: true, size: 512 })})`, inline: false });
      }

      if (newAvatar) {
        embed.addFields({ name: '🖼️ New Avatar', value: `[View New Avatar](${newMember.displayAvatarURL({ dynamic: true, size: 512 })})`, inline: false });
        embed.setThumbnail(newMember.displayAvatarURL({ dynamic: true, size: 256 }));
      }

      await channel.send({ embeds: [embed] });
      logger.info(`Manual Log (avatar change) sent for member ${newMember.user.tag} in ${newMember.guild.name}`);

    } catch (error) {
      logger.error('Error sending Manual Log (avatar change):', error);
    }
  }

  /**
   * Send log for general member information updates
   */
  async logMemberUpdate(oldMember, newMember, executor) {
    try {
      const settings = await this.loadServerSettings(newMember.guild.id);
      
      if (!settings?.enabled || !settings.categories?.members?.enabled) {
        return;
      }

      const logChannelId = settings.categories.members.channelId || settings.channelId;
      const channel = newMember.guild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      const changes = [];

      // Check nickname change
      if (oldMember.nickname !== newMember.nickname) {
        changes.push({
          field: 'Nickname',
          old: oldMember.nickname || 'None',
          new: newMember.nickname || 'None'
        });
      }

      // Check server avatar change
      if (oldMember.avatar !== newMember.avatar) {
        changes.push({
          field: 'Server Avatar',
          old: oldMember.avatar ? 'Had custom avatar' : 'No custom avatar',
          new: newMember.avatar ? 'Has custom avatar' : 'No custom avatar'
        });
      }

      // Check timeout change
      if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
        const oldTimeout = oldMember.communicationDisabledUntil;
        const newTimeout = newMember.communicationDisabledUntil;
        
        changes.push({
          field: 'Timeout Status',
          old: oldTimeout ? `Until <t:${Math.floor(oldTimeout.getTime() / 1000)}:F>` : 'No timeout',
          new: newTimeout ? `Until <t:${Math.floor(newTimeout.getTime() / 1000)}:F>` : 'No timeout'
        });
      }

      if (changes.length === 0) {
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('👤 Member Updated')
        .setDescription(`**${newMember.user.tag}** was updated`)
        .setColor(0x3498db)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields([
          { name: '👤 Member', value: `<@${newMember.user.id}>`, inline: true },
          { name: '👮 Updated By', value: executor ? `<@${executor.id}>` : 'System/Member', inline: true }
        ]);

      // Add changes
      changes.forEach(change => {
        embed.addFields({
          name: `📝 ${change.field}`,
          value: `**Before:** ${change.old}\n**After:** ${change.new}`,
          inline: false
        });
      });

      await channel.send({ embeds: [embed] });
      logger.info(`Manual Log (member update) sent for member ${newMember.user.tag} in ${newMember.guild.name}`);

    } catch (error) {
      logger.error('Error sending Manual Log (member update):', error);
    }
  }

  /**
   * إرسال log لتحديثات السيرفر (اسم وصورة)
   */
  async logServerUpdate(oldGuild, newGuild, executor = null) {
    try {
      const settings = await this.loadServerSettings(newGuild.id);
      
      if (!settings?.enabled || !settings.categories?.serverSettings?.enabled) {
        return;
      }

      const logChannelId = settings.categories.serverSettings.channelId || settings.channelId;
      const channel = newGuild.channels.cache.get(logChannelId);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      // Check if there are actual changes
      const nameChanged = oldGuild.name !== newGuild.name;
      const iconChanged = oldGuild.iconURL() !== newGuild.iconURL();
      
      if (!nameChanged && !iconChanged) {
        return;
      }

      let description = '';
      let hasChanges = false;

      if (nameChanged) {
        description += `**Server Name Changed**\n`;
        description += `**Before:** \`${oldGuild.name}\`\n`;
        description += `**After:** \`${newGuild.name}\`\n\n`;
        hasChanges = true;
      }

      if (iconChanged) {
        description += `**Server Icon Changed**\n`;
        if (oldGuild.iconURL()) {
          description += `**Old Icon:** [View Old Icon](${oldGuild.iconURL({ dynamic: true, size: 512 })})\n`;
        }
        if (newGuild.iconURL()) {
          description += `**New Icon:** [View New Icon](${newGuild.iconURL({ dynamic: true, size: 512 })})\n\n`;
        }
        hasChanges = true;
      }

      if (!hasChanges) return;

      const embed = new EmbedBuilder()
        .setTitle('🏠 Server Updated')
        .setDescription(description)
        .setColor(0xffa500)
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '🏠 Server', value: `${newGuild.name} (${newGuild.id})`, inline: false },
          { name: '👤 Changed By', value: executor ? `<@${executor.id}>` : 'Unknown', inline: false }
        ]);

      // Set thumbnail to new icon if available
      if (newGuild.iconURL()) {
        embed.setThumbnail(newGuild.iconURL({ dynamic: true, size: 256 }));
      }

      await channel.send({ embeds: [embed] });
      logger.info(`Manual Log (server update) sent for ${newGuild.name}`);

    } catch (error) {
      logger.error('Error sending Manual Log (server update):', error);
    }
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

module.exports = ManualLogSystem;