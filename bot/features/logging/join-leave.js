const { EmbedBuilder } = require('discord.js');

class JoinLeaveLogger {
  constructor(client, settingsManager) {
    this.client = client;
    this.settingsManager = settingsManager;
    
    console.log('✅ Join/Leave Logger initialized');
  }

  /**
   * Log join and leave events
   */
  async logJoinLeave(member, action) {
    try {
      const settings = await this.settingsManager.getServerSettings(member.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.join_leave.enabled) {
        return;
      }

      const logChannel = member.guild.channels.cache.get(settings.categories.joinLeave.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for join/leave in ${member.guild.name}`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: `ID: ${member.id}` });

      if (action === 'join') {
        embed
          .setTitle('📥 New Member Joined')
          .setDescription(`**${member.user.tag}** joined the server`)
          .setColor('#00ff00')
          .addFields([
            {
              name: '👤 Member',
              value: `<@${member.id}>\n\`${member.user.tag}\``,
              inline: true
            },
            {
              name: '📅 Account Created',
              value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`,
              inline: true
            },
            {
              name: '📊 Total Members',
              value: `${member.guild.memberCount}`,
              inline: true
            }
          ]);

        if (member.user.avatar) {
          embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }));
        }

      } else if (action === 'leave') {
        embed
          .setTitle('📤 Member Left Server')
          .setDescription(`**${member.user.tag}** left the server`)
          .setColor('#ff0000')
          .addFields([
            {
              name: '👤 Member',
              value: `\`${member.user.tag}\`\nID: \`${member.id}\``,
              inline: true
            },
            {
              name: '⏰ Time in Server',
              value: member.joinedAt ? 
                `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 
                'Unknown',
              inline: true
            },
            {
              name: '📊 Total Members',
              value: `${member.guild.memberCount}`,
              inline: true
            }
          ]);

        if (member.user.avatar) {
          embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }));
        }

        // Add roles the member had
        if (member.roles.cache.size > 1) {
          const roles = member.roles.cache
            .filter(role => role.id !== member.guild.id)
            .map(role => role.toString())
            .slice(0, 10);
          
          if (roles.length > 0) {
            embed.addFields([{
              name: '🎭 Roles They Had',
              value: roles.join(', ') + (member.roles.cache.size > 11 ? '...' : ''),
              inline: false
            }]);
          }
        }
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged ${action} for ${member.user.tag} in ${member.guild.name}`);

    } catch (error) {
      console.error(`❌ Error logging ${action}:`, error);
    }
  }

  /**
   * Log kick and ban events
   */
  async logKickBan(target, action, executor = null, reason = null) {
    try {
      const settings = await this.settingsManager.getServerSettings(target.guild.id);
      
      if (!settings || !settings.enabled || !settings.categories.join_leave.enabled) {
        return;
      }

      const logChannel = target.guild.channels.cache.get(settings.categories.kickBan.channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found for kick/ban in ${target.guild.name}`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: `ID: ${target.id}` });

      if (action === 'kick') {
        embed
          .setTitle('👢 Member Kicked')
          .setDescription(`**${target.tag}** was kicked from the server`)
          .setColor('#ff9900');
      } else if (action === 'ban') {
        embed
          .setTitle('🔨 Member Banned')
          .setDescription(`**${target.tag}** was banned from the server`)
          .setColor('#ff0000');
      } else if (action === 'unban') {
        embed
          .setTitle('🔓 Member Unbanned')
          .setDescription(`**${target.tag}** was unbanned`)
          .setColor('#00ff00');
      }

      embed.addFields([
        {
          name: '👤 Member',
          value: `\`${target.tag}\`\nID: \`${target.id}\``,
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

      if (reason) {
        embed.addFields([{
          name: '📝 Reason',
          value: reason.length > 1024 ? reason.substring(0, 1021) + '...' : reason,
          inline: false
        }]);
      }

      if (target.avatar) {
        embed.setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }));
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged ${action} for ${target.tag} in ${target.guild.name}`);

    } catch (error) {
      console.error(`❌ Error logging ${action}:`, error);
    }
  }
}

module.exports = JoinLeaveLogger;