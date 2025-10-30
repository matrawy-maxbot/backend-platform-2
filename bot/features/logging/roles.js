const { EmbedBuilder } = require('discord.js');

class RolesLogger {
  constructor(client, settingsManager) {
    this.client = client;
    this.settingsManager = settingsManager;
    
    console.log('✅ Roles Logger initialized');
  }

  /**
   * Log role changes (create, delete, update)
   */
  async logRoleChange(role, action, executor = null, changes = null) {
    try {
      const settings = await this.settingsManager.getServerSettings(role.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.roles.enabled) {
        return;
      }

      const logChannel = role.guild.channels.cache.get(settings.categories.roles.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for role changes in ${role.guild.name}`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: `Role ID: ${role.id}` });

      if (action === 'create') {
        embed
          .setTitle('🎭 New Role Created')
          .setDescription(`Role **${role.name}** has been created`)
          .setColor('#00ff00')
          .addFields([
            {
              name: '🎭 Role Name',
              value: `${role.toString()}\n\`${role.name}\``,
              inline: true
            },
            {
              name: '🎨 Color',
              value: role.hexColor || '#000000',
              inline: true
            },
            {
              name: '📍 Position',
              value: `${role.position}`,
              inline: true
            },
            {
              name: '🔒 Permissions',
              value: this.formatPermissions(role.permissions.toArray()).substring(0, 1024),
              inline: false
            }
          ]);

      } else if (action === 'delete') {
        embed
          .setTitle('🗑️ Role Deleted')
          .setDescription(`Role **${role.name}** has been deleted`)
          .setColor('#ff0000')
          .addFields([
            {
              name: '🎭 Role Name',
              value: `\`${role.name}\``,
              inline: true
            },
            {
              name: '🎨 Color',
              value: role.hexColor || '#000000',
              inline: true
            },
            {
              name: '📍 Position',
              value: `${role.position}`,
              inline: true
            }
          ]);

      } else if (action === 'update' && changes) {
        embed
          .setTitle('✏️ Role Updated')
          .setDescription(`Role **${role.name}** has been updated`)
          .setColor('#ffff00');

        const changeFields = [];

        if (changes.name !== role.name) {
          changeFields.push({
            name: '📝 Name',
            value: `**Before:** \`${changes.name}\`\n**After:** \`${role.name}\``,
            inline: true
          });
        }

        if (changes.hexColor !== role.hexColor) {
          changeFields.push({
            name: '🎨 Color',
            value: `**Before:** ${changes.hexColor || '#000000'}\n**After:** ${role.hexColor || '#000000'}`,
            inline: true
          });
        }

        if (changes.position !== role.position) {
          changeFields.push({
            name: '📍 Position',
            value: `**Before:** ${changes.position}\n**After:** ${role.position}`,
            inline: true
          });
        }

        if (changes.hoist !== role.hoist) {
          changeFields.push({
            name: '📌 Display Separately',
            value: `**Before:** ${changes.hoist ? 'Yes' : 'No'}\n**After:** ${role.hoist ? 'Yes' : 'No'}`,
            inline: true
          });
        }

        if (changes.mentionable !== role.mentionable) {
          changeFields.push({
            name: '📢 Mentionable',
            value: `**Before:** ${changes.mentionable ? 'Yes' : 'No'}\n**After:** ${role.mentionable ? 'Yes' : 'No'}`,
            inline: true
          });
        }

        // Compare permissions
        const oldPerms = changes.permissions ? changes.permissions.toArray() : [];
        const newPerms = role.permissions.toArray();
        
        const addedPerms = newPerms.filter(perm => !oldPerms.includes(perm));
        const removedPerms = oldPerms.filter(perm => !newPerms.includes(perm));

        if (addedPerms.length > 0) {
          changeFields.push({
            name: '✅ Added Permissions',
            value: addedPerms.map(perm => this.translatePermission(perm)).join(', ').substring(0, 1024),
            inline: false
          });
        }

        if (removedPerms.length > 0) {
          changeFields.push({
            name: '❌ Removed Permissions',
            value: removedPerms.map(perm => this.translatePermission(perm)).join(', ').substring(0, 1024),
            inline: false
          });
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
      console.log(`✅ Logged role ${action} for ${role.name} in ${role.guild.name}`);

    } catch (error) {
      console.error(`❌ Error logging role ${action}:`, error);
    }
  }

  /**
   * Log member role changes
   */
  async logMemberRoleChange(member, action, role, executor = null) {
    try {
      const settings = await this.settingsManager.getServerSettings(member.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.member_updates.enabled) {
        return;
      }

      const logChannel = member.guild.channels.cache.get(settings.categories.roles.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for member role changes in ${member.guild.name}`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: `Member ID: ${member.id}` })
        .addFields([
          {
            name: '👤 Member',
            value: `<@${member.id}>\n\`${member.user.tag}\``,
            inline: true
          },
          {
            name: '🎭 Role',
            value: `${role.toString()}\n\`${role.name}\``,
            inline: true
          }
        ]);

      if (action === 'add') {
        embed
          .setTitle('➕ Role Added to Member')
          .setDescription(`Role **${role.name}** has been added to **${member.user.tag}**`)
          .setColor('#00ff00');
      } else if (action === 'remove') {
        embed
          .setTitle('➖ Role Removed from Member')
          .setDescription(`Role **${role.name}** has been removed from **${member.user.tag}**`)
          .setColor('#ff0000');
      }

      if (executor) {
        embed.addFields([{
          name: '👮 Executor',
          value: `<@${executor.id}>\n\`${executor.tag}\``,
          inline: true
        }]);
      }

      if (member.user.avatar) {
        embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }));
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged member role ${action} for ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error(`❌ Error logging member role ${action}:`, error);
    }
  }

  /**
   * Format permissions
   */
  formatPermissions(permissions) {
    if (!permissions || permissions.length === 0) {
      return 'No special permissions';
    }

    return permissions
      .map(perm => this.translatePermission(perm))
      .join(', ');
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

module.exports = RolesLogger;