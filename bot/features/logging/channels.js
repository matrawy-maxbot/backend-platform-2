const { EmbedBuilder, ChannelType } = require('discord.js');

class ChannelsLogger {
  constructor(client, settingsManager) {
    this.client = client;
    this.settingsManager = settingsManager;
    
    console.log('✅ Channels Logger initialized');
  }

  /**
   * Log channel changes (create, delete, update)
   */
  async logChannelChange(channel, action, executor = null, changes = null) {
    try {
      const settings = await this.settingsManager.getServerSettings(channel.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.channels.enabled) {
        return;
      }

      const logChannel = channel.guild.channels.cache.get(settings.categories.channels.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for channel changes in ${channel.guild.name}`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: `Channel ID: ${channel.id}` });

      const channelTypeText = this.getChannelTypeText(channel.type);

      if (action === 'create') {
        embed
          .setTitle('📺 New Channel Created')
          .setDescription(`Created ${channelTypeText} **${channel.name}**`)
          .setColor('#00ff00')
          .addFields([
            {
              name: '📺 Channel Name',
              value: `${channel.toString()}\n\`${channel.name}\``,
              inline: true
            },
            {
              name: '📂 Type',
              value: channelTypeText,
              inline: true
            },
            {
              name: '📍 Position',
              value: `${channel.position || 0}`,
              inline: true
            }
          ]);

        if (channel.parent) {
          embed.addFields([{
            name: '📁 Category',
            value: `${channel.parent.toString()}\n\`${channel.parent.name}\``,
            inline: true
          }]);
        }

        if (channel.topic) {
          embed.addFields([{
            name: '📝 Description',
            value: channel.topic.substring(0, 1024),
            inline: false
          }]);
        }

      } else if (action === 'delete') {
        embed
          .setTitle('🗑️ Channel Deleted')
          .setDescription(`Deleted ${channelTypeText} **${channel.name}**`)
          .setColor('#ff0000')
          .addFields([
            {
              name: '📺 Channel Name',
              value: `\`${channel.name}\``,
              inline: true
            },
            {
              name: '📂 Type',
              value: channelTypeText,
              inline: true
            },
            {
              name: '📍 Position',
              value: `${channel.position || 0}`,
              inline: true
            }
          ]);

        if (channel.parent) {
          embed.addFields([{
            name: '📁 Category',
            value: `\`${channel.parent.name}\``,
            inline: true
          }]);
        }

      } else if (action === 'update' && changes) {
        embed
          .setTitle('✏️ Channel Updated')
          .setDescription(`Updated ${channelTypeText} **${channel.name}**`)
          .setColor('#ffff00');

        const changeFields = [];

        if (changes.name !== channel.name) {
          changeFields.push({
            name: '📝 Name',
            value: `**Before:** \`${changes.name}\`\n**After:** \`${channel.name}\``,
            inline: true
          });
        }

        if (changes.topic !== channel.topic) {
          const oldTopic = changes.topic || 'None';
          const newTopic = channel.topic || 'None';
          changeFields.push({
            name: '📝 Description',
            value: `**Before:** ${oldTopic.substring(0, 500)}\n**After:** ${newTopic.substring(0, 500)}`,
            inline: false
          });
        }

        if (changes.position !== channel.position) {
          changeFields.push({
            name: '📍 Position',
            value: `**Before:** ${changes.position || 0}\n**After:** ${channel.position || 0}`,
            inline: true
          });
        }

        if (changes.parentId !== channel.parentId) {
          const oldParent = changes.parentId ? 
            channel.guild.channels.cache.get(changes.parentId)?.name || 'Deleted Channel' : 
            'No Category';
          const newParent = channel.parent?.name || 'No Category';
          
          changeFields.push({
            name: '📁 Category',
            value: `**Before:** \`${oldParent}\`\n**After:** \`${newParent}\``,
            inline: true
          });
        }

        // Voice channel specific changes
        if (channel.type === ChannelType.GuildVoice) {
          if (changes.bitrate !== channel.bitrate) {
            changeFields.push({
              name: '🎵 Audio Quality',
              value: `**Before:** ${changes.bitrate || 64}kbps\n**After:** ${channel.bitrate}kbps`,
              inline: true
            });
          }

          if (changes.userLimit !== channel.userLimit) {
            const oldLimit = changes.userLimit === 0 ? 'Unlimited' : changes.userLimit;
            const newLimit = channel.userLimit === 0 ? 'Unlimited' : channel.userLimit;
            changeFields.push({
              name: '👥 User Limit',
              value: `**Before:** ${oldLimit}\n**After:** ${newLimit}`,
              inline: true
            });
          }
        }

        // Text channel specific changes
        if (channel.type === ChannelType.GuildText) {
          if (changes.nsfw !== channel.nsfw) {
            changeFields.push({
              name: '🔞 NSFW Content',
              value: `**Before:** ${changes.nsfw ? 'Yes' : 'No'}\n**After:** ${channel.nsfw ? 'Yes' : 'No'}`,
              inline: true
            });
          }

          if (changes.rateLimitPerUser !== channel.rateLimitPerUser) {
            const oldLimit = changes.rateLimitPerUser === 0 ? 'Unlimited' : `${changes.rateLimitPerUser}s`;
            const newLimit = channel.rateLimitPerUser === 0 ? 'Unlimited' : `${channel.rateLimitPerUser}s`;
            changeFields.push({
              name: '⏱️ Slowmode',
              value: `**Before:** ${oldLimit}\n**After:** ${newLimit}`,
              inline: true
            });
          }
        }

        if (changeFields.length > 0) {
          embed.addFields(changeFields);
        }
      }

      if (executor) {
        embed.addFields([{
          name: '👮 Executor',
          value: `<@${executor.id}>\n\`${executor.tag}\``,
          inline: true
        }]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged channel ${action} for ${channel.name} in ${channel.guild.name}`);

    } catch (error) {
      console.error(`❌ Error logging channel ${action}:`, error);
    }
  }

  /**
   * Log channel permission changes
   */
  async logChannelPermissionChange(channel, target, permissions, action, executor = null) {
    try {
      const settings = await this.settingsManager.getServerSettings(channel.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.channels.enabled) {
        return;
      }

      const logChannel = channel.guild.channels.cache.get(settings.categories.channels.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for channel permission changes in ${channel.guild.name}`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('🔐 Channel Permissions Changed')
        .setDescription(`${action === 'allow' ? 'Allowed' : action === 'deny' ? 'Denied' : 'Removed'} permissions in ${channel.toString()}`)
        .setColor(action === 'allow' ? '#00ff00' : action === 'deny' ? '#ff0000' : '#ffff00')
        .setTimestamp()
        .setFooter({ text: `Channel ID: ${channel.id}` })
        .addFields([
          {
            name: '📺 Channel',
            value: `${channel.toString()}\n\`${channel.name}\``,
            inline: true
          },
          {
            name: target.user ? '👤 Member' : '🎭 Role',
            value: target.user ? 
              `<@${target.id}>\n\`${target.user.tag}\`` : 
              `${target.toString()}\n\`${target.name}\``,
            inline: true
          }
        ]);

      if (permissions && permissions.length > 0) {
        embed.addFields([{
          name: '🔒 Permissions',
          value: permissions.map(perm => this.translatePermission(perm)).join(', ').substring(0, 1024),
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
      console.log(`✅ Logged channel permission ${action} in ${channel.guild.name}`);

    } catch (error) {
      console.error(`❌ Error logging channel permission ${action}:`, error);
    }
  }

  /**
   * Get channel type text
   */
  getChannelTypeText(channelType) {
    const types = {
      [ChannelType.GuildText]: 'Text Channel',
      [ChannelType.GuildVoice]: 'Voice Channel',
      [ChannelType.GuildCategory]: 'Category',
      [ChannelType.GuildAnnouncement]: 'Announcement Channel',
      [ChannelType.AnnouncementThread]: 'Announcement Thread',
      [ChannelType.PublicThread]: 'Public Thread',
      [ChannelType.PrivateThread]: 'Private Thread',
      [ChannelType.GuildStageVoice]: 'Stage Channel',
      [ChannelType.GuildForum]: 'Forum',
      [ChannelType.GuildMedia]: 'Media Channel'
    };

    return types[channelType] || 'Unknown Type';
  }

  /**
   * Translate permissions
   */
  translatePermission(permission) {
    const translations = {
      'CreateInstantInvite': 'Create Invites',
      'KickMembers': 'Kick Members',
      'BanMembers': 'Ban Members',
      'Administrator': 'Administrator',
      'ManageChannels': 'Manage Channels',
      'ManageGuild': 'Manage Server',
      'AddReactions': 'Add Reactions',
      'ViewAuditLog': 'View Audit Log',
      'PrioritySpeaker': 'Priority Speaker',
      'Stream': 'Stream',
      'ViewChannel': 'View Channel',
      'SendMessages': 'Send Messages',
      'SendTTSMessages': 'Send TTS Messages',
      'ManageMessages': 'Manage Messages',
      'EmbedLinks': 'Embed Links',
      'AttachFiles': 'Attach Files',
      'ReadMessageHistory': 'Read Message History',
      'MentionEveryone': 'Mention Everyone',
      'UseExternalEmojis': 'Use External Emojis',
      'ViewGuildInsights': 'View Server Insights',
      'Connect': 'Connect',
      'Speak': 'Speak',
      'MuteMembers': 'Mute Members',
      'DeafenMembers': 'Deafen Members',
      'MoveMembers': 'Move Members',
      'UseVAD': 'Use Voice Activity',
      'ChangeNickname': 'Change Nickname',
      'ManageNicknames': 'Manage Nicknames',
      'ManageRoles': 'Manage Roles',
      'ManageWebhooks': 'Manage Webhooks',
      'ManageEmojisAndStickers': 'Manage Emojis and Stickers',
      'UseApplicationCommands': 'Use Application Commands',
      'RequestToSpeak': 'Request to Speak',
      'ManageEvents': 'Manage Events',
      'ManageThreads': 'Manage Threads',
      'CreatePublicThreads': 'Create Public Threads',
      'CreatePrivateThreads': 'Create Private Threads',
      'UseExternalStickers': 'Use External Stickers',
      'SendMessagesInThreads': 'Send Messages in Threads',
      'UseEmbeddedActivities': 'Use Embedded Activities',
      'ModerateMembers': 'Moderate Members'
    };

    return translations[permission] || permission;
  }
}

module.exports = ChannelsLogger;