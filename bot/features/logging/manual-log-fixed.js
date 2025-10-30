const { EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

class FixedManualLogSystem {
  constructor(client) {
    this.client = client;
    this.settingsPath = path.join(__dirname, '../../data/manual-log-settings.json');
    this.settings = new Map();
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const data = await fs.readFile(this.settingsPath, 'utf8');
      const settings = JSON.parse(data);
      
      for (const [guildId, config] of Object.entries(settings)) {
        this.settings.set(guildId, config);
      }
      
      console.log(`✅ Loaded manual log settings for ${this.settings.size} servers`);
      return this.settings.size;
    } catch (error) {
      console.error('❌ Error loading manual log settings:', error);
      return 0;
    }
  }

  /**
   * تحميل إعدادات سيرفر محدد
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
      console.error('خطأ في تحميل إعدادات Manual Log:', error);
      return null;
    }
  }

  /**
   * إنشاء إعدادات افتراضية لسيرفر جديد
   */
  async createDefaultSettings(guildId) {
    try {
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) {
        console.log(`❌ Guild not found: ${guildId}`);
        return null;
      }

      // البحث عن قناة عامة مناسبة للوج
      let defaultChannelId = null;
      
      // البحث عن قناة تحتوي على كلمات مثل "log", "logs", "audit", "general"
      const logChannels = guild.channels.cache.filter(channel => 
        channel.type === 0 && // TEXT_CHANNEL
        (channel.name.includes('log') || 
         channel.name.includes('audit') || 
         channel.name.includes('general') ||
         channel.name.includes('عام')) &&
        channel.permissionsFor(guild.members.me)?.has(['SendMessages', 'EmbedLinks'])
      );

      if (logChannels.size > 0) {
        // اختيار أول قناة مناسبة
        defaultChannelId = logChannels.first().id;
        console.log(`📍 Found suitable log channel: ${logChannels.first().name} (${defaultChannelId})`);
      } else {
        // البحث عن أي قناة نصية يمكن للبوت الكتابة فيها
        const textChannels = guild.channels.cache.filter(channel => 
          channel.type === 0 && // TEXT_CHANNEL
          channel.permissionsFor(guild.members.me)?.has(['SendMessages', 'EmbedLinks'])
        );

        if (textChannels.size > 0) {
          defaultChannelId = textChannels.first().id;
          console.log(`📍 Using first available text channel: ${textChannels.first().name} (${defaultChannelId})`);
        }
      }

      // إنشاء الإعدادات الافتراضية
      const defaultSettings = {
        serverId: guildId,
        enabled: true, // تفعيل النظام افتراضياً
        channelId: null,
        categories: {
          joinLeave: {
            enabled: true,
            channelId: defaultChannelId
          },
          kickBan: {
            enabled: true,
            channelId: defaultChannelId
          },
          members: {
            enabled: true,
            channelId: defaultChannelId
          },
          serverSettings: {
            enabled: true,
            channelId: defaultChannelId
          },
          roles: {
            enabled: true,
            channelId: defaultChannelId
          },
          messages: {
            enabled: true,
            channelId: defaultChannelId
          },
          messages: {
            enabled: true,
            channelId: defaultChannelId
          },
          adminActions: {
            enabled: false,
            channelId: null
          }
        },
        updatedAt: new Date().toISOString()
      };

      // حفظ الإعدادات في الذاكرة
      this.settings.set(guildId, defaultSettings);

      // حفظ الإعدادات في الملف
      await this.saveSettingsToFile();

      console.log(`✅ Created default settings for guild ${guildId} with channel ${defaultChannelId}`);
      return defaultSettings;

    } catch (error) {
      console.error(`❌ Error creating default settings for guild ${guildId}:`, error);
      return null;
    }
  }

  /**
   * حفظ الإعدادات في الملف
   */
  async saveSettingsToFile() {
    try {
      const settingsObject = {};
      for (const [guildId, settings] of this.settings.entries()) {
        settingsObject[guildId] = settings;
      }

      await fs.writeFile(this.settingsPath, JSON.stringify(settingsObject, null, 2));
      console.log(`💾 Settings saved to file`);
      return true;
    } catch (error) {
      console.error('❌ Error saving settings to file:', error);
      return false;
    }
  }

  async logMemberAction(action, guild, data = {}) {
    try {
      // الحصول على إعدادات السيرفر أو إنشاء إعدادات افتراضية
      let serverSettings = this.settings.get(guild.id);
      
      if (!serverSettings) {
        console.log(`⚠️ No settings found for guild ${guild.id}, creating default settings...`);
        serverSettings = await this.createDefaultSettings(guild.id);
        
        if (!serverSettings) {
          console.log(`❌ Failed to create default settings for guild ${guild.id}`);
          return;
        }
      }

      // التحقق من تفعيل النظام
      if (!serverSettings.enabled) {
        return;
      }

      // تحديد الفئة المناسبة حسب نوع الإجراء
      let categoryKey = 'members';
      if (['message_delete', 'message_edit'].includes(action)) {
        categoryKey = 'messages';
      } else if (['join', 'leave'].includes(action)) {
        categoryKey = 'joinLeave';
      } else if (['kick', 'ban'].includes(action)) {
        categoryKey = 'kickBan';
      } else if (['role_add', 'role_remove'].includes(action)) {
        categoryKey = 'roles';
      }

      // التحقق من تفعيل الفئة
      if (!serverSettings.categories?.[categoryKey]?.enabled) {
        return;
      }

      // الحصول على معرف القناة
      const channelId = serverSettings.categories[categoryKey].channelId;
      if (!channelId) {
        console.log(`⚠️ No channel configured for ${categoryKey} category in guild ${guild.id}`);
        return;
      }

      // الحصول على القناة
      const channel = guild.channels.cache.get(channelId);
      if (!channel) {
        console.log(`❌ Channel ${channelId} not found in guild ${guild.id}`);
        return;
      }

      // التحقق من صلاحيات البوت
      const botMember = guild.members.me;
      if (!botMember || !channel.permissionsFor(botMember).has(['SendMessages', 'EmbedLinks'])) {
        console.log(`❌ Bot lacks permissions in channel ${channel.name} (${channelId})`);
        return;
      }

      // إنشاء الـ embed حسب نوع الإجراء
      const embed = this.createActionEmbed(action, data);
      
      if (embed) {
        await channel.send({ embeds: [embed] });
        console.log(`✅ Logged ${action} for ${data.user?.tag || 'Unknown'} in ${guild.name}`);
      }

    } catch (error) {
      console.error(`❌ Error logging member action in guild ${guild.id}:`, error);
    }
  }

  /**
   * إنشاء embed للأحداث المختلفة
   */
  createActionEmbed(action, data) {
    const embed = new EmbedBuilder()
      .setTimestamp()
      .setFooter({ text: 'Manual Log System' });

    switch (action) {
      case 'join':
        embed
          .setTitle('🟢 عضو جديد انضم')
          .setColor('#00ff00')
          .setDescription(`**${data.user.tag}** انضم إلى السيرفر`)
          .addFields(
            { name: '👤 العضو', value: `<@${data.user.id}>`, inline: true },
            { name: '🆔 المعرف', value: data.user.id, inline: true },
            { name: '📅 تاريخ إنشاء الحساب', value: `<t:${Math.floor(data.user.createdTimestamp / 1000)}:F>`, inline: false }
          );
        if (data.user.avatar) {
          embed.setThumbnail(data.user.displayAvatarURL({ dynamic: true }));
        }
        break;

      case 'leave':
        embed
          .setTitle('🔴 عضو غادر السيرفر')
          .setColor('#ff0000')
          .setDescription(`**${data.user.tag}** غادر السيرفر`)
          .addFields(
            { name: '👤 العضو', value: `${data.user.tag}`, inline: true },
            { name: '🆔 المعرف', value: data.user.id, inline: true }
          );
        if (data.user.avatar) {
          embed.setThumbnail(data.user.displayAvatarURL({ dynamic: true }));
        }
        break;

      case 'message_delete':
        embed
          .setTitle('🗑️ رسالة محذوفة')
          .setColor('#ff6b6b')
          .setDescription(`تم حذف رسالة من **${data.user?.tag || 'مجهول'}**`)
          .addFields(
            { name: '👤 المؤلف', value: data.user ? `<@${data.user.id}>` : 'مجهول', inline: true },
            { name: '📍 القناة', value: `<#${data.channel.id}>`, inline: true },
            { name: '📎 المرفقات', value: data.attachments > 0 ? `${data.attachments} ملف` : 'لا يوجد', inline: true }
          );
        
        if (data.content && data.content.length > 0) {
          embed.addFields({
            name: '💬 محتوى الرسالة',
            value: data.content.length > 1024 ? data.content.substring(0, 1021) + '...' : data.content,
            inline: false
          });
        }
        break;

      case 'message_edit':
        embed
          .setTitle('✏️ رسالة معدلة')
          .setColor('#ffa500')
          .setDescription(`تم تعديل رسالة من **${data.user?.tag || 'مجهول'}**`)
          .addFields(
            { name: '👤 المؤلف', value: data.user ? `<@${data.user.id}>` : 'مجهول', inline: true },
            { name: '📍 القناة', value: `<#${data.channel.id}>`, inline: true }
          );
        
        if (data.oldContent) {
          embed.addFields({
            name: '📝 المحتوى القديم',
            value: data.oldContent.length > 512 ? data.oldContent.substring(0, 509) + '...' : data.oldContent,
            inline: false
          });
        }
        
        if (data.newContent) {
          embed.addFields({
            name: '📝 المحتوى الجديد',
            value: data.newContent.length > 512 ? data.newContent.substring(0, 509) + '...' : data.newContent,
            inline: false
          });
        }
        break;

      case 'nickname_change':
        embed
          .setTitle('📝 تغيير الكنية')
          .setColor('#4169e1')
          .setDescription(`تم تغيير كنية **${data.user.tag}**`)
          .addFields(
            { name: '👤 العضو', value: `<@${data.user.id}>`, inline: true },
            { name: '📝 الكنية القديمة', value: data.oldNickname || 'لا يوجد', inline: true },
            { name: '📝 الكنية الجديدة', value: data.newNickname || 'لا يوجد', inline: true }
          );
        if (data.executor) {
          embed.addFields({ name: '👮 المنفذ', value: `<@${data.executor.id}>`, inline: true });
        }
        break;

      case 'role_add':
        embed
          .setTitle('➕ إضافة رتبة')
          .setColor('#00ff00')
          .setDescription(`تم منح رتبة لـ **${data.user.tag}**`)
          .addFields(
            { name: '👤 العضو', value: `<@${data.user.id}>`, inline: true },
            { name: '🏷️ الرتبة', value: `<@&${data.role.id}>`, inline: true }
          );
        if (data.executor) {
          embed.addFields({ name: '👮 المنفذ', value: `<@${data.executor.id}>`, inline: true });
        }
        break;

      case 'role_remove':
        embed
          .setTitle('➖ إزالة رتبة')
          .setColor('#ff0000')
          .setDescription(`تم إزالة رتبة من **${data.user.tag}**`)
          .addFields(
            { name: '👤 العضو', value: `<@${data.user.id}>`, inline: true },
            { name: '🏷️ الرتبة', value: `<@&${data.role.id}>`, inline: true }
          );
        if (data.executor) {
          embed.addFields({ name: '👮 المنفذ', value: `<@${data.executor.id}>`, inline: true });
        }
        break;

      default:
        return null;
    }

    return embed;
  }

  // دالة لتتبع تغييرات البوت (صورة واسم)
  async logBotProfileChange(oldUser, newUser, changeType, guild) {
    try {
      console.log(`\n🤖 [FIXED LOG] Bot Profile Change Detected:`);
      console.log(`   Bot: ${newUser.tag} (${newUser.id})`);
      console.log(`   Guild: ${guild.name} (${guild.id})`);
      console.log(`   Change Type: ${changeType}`);

      // الحصول على إعدادات السيرفر
      const guildSettings = this.settings.get(guild.id);
      if (!guildSettings) {
        console.log(`❌ No settings found for guild ${guild.id}`);
        return;
      }

      // التحقق من تفعيل فئة members
      if (!guildSettings.categories?.members?.enabled) {
        console.log(`❌ Members category is disabled for guild ${guild.id}`);
        return;
      }

      // الحصول على قناة اللوج
      const channelId = guildSettings.categories.members.channelId;
      if (!channelId) {
        console.log(`❌ No channel ID set for members category`);
        return;
      }

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) {
        console.log(`❌ Log channel not found: ${channelId}`);
        return;
      }

      // التحقق من صلاحيات البوت
      const permissions = logChannel.permissionsFor(this.client.user);
      if (!permissions.has(['SendMessages', 'EmbedLinks'])) {
        console.log(`❌ Bot lacks permissions in channel ${channelId}`);
        return;
      }

      // إنشاء الإمبد للبوت
      let embed;
      
      if (changeType === 'bot_avatar') {
        const oldAvatar = oldUser.displayAvatarURL({ dynamic: true, size: 256 });
        const newAvatar = newUser.displayAvatarURL({ dynamic: true, size: 256 });
        
        embed = new EmbedBuilder()
          .setTitle(`🖼️ Bot Avatar Changed`)
          .setColor(0x5865F2)
          .addFields([
            {
              name: '🤖 Bot',
              value: `${newUser.tag}\n\`${newUser.id}\``,
              inline: true
            },
            {
              name: '🔧 Change',
              value: 'Avatar Updated',
              inline: true
            },
            {
              name: '🏠 Server',
              value: guild.name,
              inline: true
            }
          ])
          .setThumbnail(newAvatar)
          .setImage(newAvatar)
          .setTimestamp()
          .setFooter({
            text: `${guild.name} • Bot Profile Update`,
            iconURL: guild.iconURL({ dynamic: true })
          });

        // إضافة الصورة القديمة إذا كانت مختلفة
        if (oldAvatar !== newAvatar) {
          embed.addFields([
            {
              name: '📸 Previous Avatar',
              value: `[View Old Avatar](${oldAvatar})`,
              inline: false
            }
          ]);
        }
        
      } else if (changeType === 'bot_username') {
        embed = new EmbedBuilder()
          .setTitle(`📝 Bot Username Changed`)
          .setColor(0x5865F2)
          .addFields([
            {
              name: '🤖 Bot',
              value: `${newUser.tag}\n\`${newUser.id}\``,
              inline: true
            },
            {
              name: '🔧 Change',
              value: 'Username Updated',
              inline: true
            },
            {
              name: '🏠 Server',
              value: guild.name,
              inline: true
            },
            {
              name: '📝 Old Username',
              value: oldUser.username,
              inline: true
            },
            {
              name: '✨ New Username',
              value: newUser.username,
              inline: true
            },
            {
              name: '🏷️ Display Name Change',
              value: oldUser.displayName !== newUser.displayName ? 
                `${oldUser.displayName} → ${newUser.displayName}` : 
                'No change',
              inline: true
            }
          ])
          .setThumbnail(newUser.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setFooter({
            text: `${guild.name} • Bot Profile Update`,
            iconURL: guild.iconURL({ dynamic: true })
          });
      }

      if (embed) {
        const message = await logChannel.send({ embeds: [embed] });
        console.log(`✅ Successfully sent bot profile change embed (ID: ${message.id})`);
        return message;
      }

    } catch (error) {
      console.error(`❌ Error in logBotProfileChange:`, error);
      console.error(`   Stack:`, error.stack);
    }
  }

  // Function to check for mute and deafen changes
  async handleMemberUpdate(oldMember, newMember) {
    try {
      // Search for moderator in audit logs
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

      // Check Voice Mute changes
      if (oldMember.voice.serverMute !== newMember.voice.serverMute) {
        const action = newMember.voice.serverMute ? 'add' : 'remove';
        await this.logMemberAction(newMember, 'voice_mute', action, executor, 'Voice mute status changed');
      }

      // Check Voice Deafen changes
      if (oldMember.voice.serverDeaf !== newMember.voice.serverDeaf) {
        const action = newMember.voice.serverDeaf ? 'add' : 'remove';
        await this.logMemberAction(newMember, 'voice_deafen', action, executor, 'Voice deafen status changed');
      }

      // Check Timeout (Text Mute) changes
      if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
        const action = newMember.communicationDisabledUntil ? 'add' : 'remove';
        
        // Additional details for text mute
        let reason = 'Communication timeout changed';
        if (newMember.communicationDisabledUntil) {
          const timeoutEnd = new Date(newMember.communicationDisabledUntil);
          const duration = Math.round((timeoutEnd - Date.now()) / (1000 * 60)); // in minutes
          reason = `Timeout applied until ${timeoutEnd.toLocaleString()} (${duration} minutes remaining)`;
        } else {
          reason = 'Timeout removed';
        }
        
        console.log(`\n⏱️ [MANUAL LOG] Text Timeout Changed:`);
        console.log(`   Member: ${newMember.user.tag}`);
        console.log(`   Old Timeout: ${oldMember.communicationDisabledUntil || 'None'}`);
        console.log(`   New Timeout: ${newMember.communicationDisabledUntil || 'None'}`);
        console.log(`   Action: ${action}`);
        console.log(`   Reason: ${reason}`);
        
        await this.logMemberAction(newMember, 'text_mute', action, executor, reason);
      }

      // Check nickname changes
      if (oldMember.nickname !== newMember.nickname) {
        const oldNickname = oldMember.nickname || oldMember.user.username;
        const newNickname = newMember.nickname || newMember.user.username;
        
        console.log(`\n📝 [MANUAL LOG] Nickname Changed:`);
        console.log(`   Member: ${newMember.user.tag}`);
        console.log(`   Old Nickname: ${oldNickname}`);
        console.log(`   New Nickname: ${newNickname}`);
        console.log(`   Executor: ${executor ? executor.tag : 'Member themselves'}`);
        
        await this.logNicknameChange(oldMember, newMember, executor);
      }

    } catch (error) {
      console.error('❌ Error in handleMemberUpdate:', error);
    }
  }

  /**
   * Create embed for different member actions
   */
  createMemberActionEmbed(action, member, executor = null, reason = null, oldMember = null) {
    try {
      const getActionEmoji = (action) => {
        switch(action) {
          case 'join': return '📥';
          case 'leave': return '📤';
          case 'kick': return '👢';
          case 'ban': return '🔨';
          case 'unban': return '🔓';
          case 'timeout': return '⏱️';
          case 'timeout_remove': return '⏰';
          case 'voice_mute': return '🔇';
          case 'voice_unmute': return '🔊';
          case 'voice_deafen': return '🔕';
          case 'voice_undeafen': return '🔉';
          case 'nickname_change': return '📝';
          case 'role_add': return '➕';
          case 'role_remove': return '➖';
          default: return '🔧';
        }
      };

      const getActionTitle = (action) => {
        const actionMap = {
          'join': 'Member Joined',
          'leave': 'Member Left',
          'kick': 'Member Kicked',
          'ban': 'Member Banned',
          'unban': 'Member Unbanned',
          'timeout': 'Member Timed Out',
          'timeout_remove': 'Timeout Removed',
          'voice_mute': 'Voice Muted',
          'voice_unmute': 'Voice Unmuted',
          'voice_deafen': 'Voice Deafened',
          'voice_undeafen': 'Voice Undeafened',
          'nickname_change': 'Nickname Changed',
          'role_add': 'Role Added',
          'role_remove': 'Role Removed'
        };
        return actionMap[action] || 'Member Updated';
      };

      const getActionColor = (action) => {
        const colorMap = {
          'join': 0x00FF00,      // Green
          'leave': 0xFF6B6B,     // Light red
          'kick': 0xFF4444,      // Red
          'ban': 0x8B0000,       // Dark red
          'unban': 0x32CD32,     // Light green
          'timeout': 0xFFA500,   // Orange
          'timeout_remove': 0x90EE90, // Light green
          'voice_mute': 0xFF6B6B,
          'voice_unmute': 0x51CF66,
          'voice_deafen': 0xFF4444,
          'voice_undeafen': 0x51CF66,
          'nickname_change': 0x3498DB,
          'role_add': 0x00FF00,
          'role_remove': 0xFF6B6B
        };
        return colorMap[action] || 0x7289DA;
      };

      const embed = new EmbedBuilder()
        .setTitle(`${getActionEmoji(action)} ${getActionTitle(action)}`)
        .setColor(getActionColor(action))
        .setTimestamp();

      // Add member information
      embed.addFields([
        {
          name: '👤 Member',
          value: `${member.user.tag}\n\`${member.user.id}\``,
          inline: true
        }
      ]);

      // Add executor information if available
      if (executor) {
        embed.addFields([
          {
            name: '👮 Moderator',
            value: `${executor.tag}\n\`${executor.id}\``,
            inline: true
          }
        ]);
      }

      // Add reason if available
      if (reason) {
        embed.addFields([
          {
            name: '📝 Reason',
            value: reason,
            inline: false
          }
        ]);
      }

      // Add additional information based on action type
      if (action === 'nickname_change' && oldMember) {
        const oldNick = oldMember.nickname || oldMember.user.username;
        const newNick = member.nickname || member.user.username;
        
        embed.addFields([
          {
            name: '📝 Old Nickname',
            value: oldNick,
            inline: true
          },
          {
            name: '📝 New Nickname',
            value: newNick,
            inline: true
          }
        ]);
      }

      // Add member and server images
      embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
      
      if (member.guild) {
        embed.setFooter({
          text: `${member.guild.name} • Manual Log System`,
          iconURL: member.guild.iconURL({ dynamic: true })
        });
      }

      return embed;

    } catch (error) {
      console.error('❌ Error creating member action embed:', error);
      return null;
    }
  }

  /**
   * Log nickname changes
   */
  async logNicknameChange(oldMember, newMember, executor) {
    try {
      // Check if there's an actual nickname change
      if (oldMember.nickname === newMember.nickname) {
        return;
      }

      await this.logMemberAction(
        newMember.guild,
        newMember,
        'nickname_change',
        executor,
        null,
        oldMember
      );

    } catch (error) {
      console.error('❌ Error logging nickname change:', error);
    }
  }

  /**
   * Log server changes (name and icon)
   */
  async logServerChange(oldGuild, newGuild, changeType, executor) {
    try {
      // Check if there's an actual change
      if (oldGuild.name === newGuild.name && oldGuild.iconURL() === newGuild.iconURL()) {
        return;
      }

      // Get server settings or create default settings
      let serverSettings = this.settings.get(newGuild.id);
      
      if (!serverSettings) {
        console.log(`⚠️ No settings found for guild ${newGuild.id}, creating default settings...`);
        serverSettings = await this.createDefaultSettings(newGuild.id);
        
        if (!serverSettings) {
          console.log(`❌ Failed to create default settings for guild ${newGuild.id}`);
          return;
        }
      }

      // Check if system is enabled
      if (!serverSettings.enabled) {
        return;
      }

      // Check if server settings category is enabled
      if (!serverSettings.categories?.serverSettings?.enabled) {
        return;
      }

      // Get channel ID
      const channelId = serverSettings.categories.serverSettings.channelId;
      if (!channelId) {
        console.log(`⚠️ No channel configured for server settings category in guild ${newGuild.id}`);
        return;
      }

      // Get channel
      const channel = newGuild.channels.cache.get(channelId);
      if (!channel) {
        console.log(`❌ Channel ${channelId} not found in guild ${newGuild.id}`);
        return;
      }

      // Check bot permissions
      const botMember = newGuild.members.me;
      if (!botMember || !channel.permissionsFor(botMember).has(['SendMessages', 'EmbedLinks'])) {
        console.log(`❌ Bot lacks permissions in channel ${channel.name} (${channelId})`);
        return;
      }

      // Create embed based on change type
      let embed;
      
      if (changeType === 'server_name') {
        embed = new EmbedBuilder()
          .setTitle(`🏷️ Server Name Changed`)
          .setColor(0x3498DB)
          .addFields([
            { name: '📝 Old Name', value: oldGuild.name || 'Unknown', inline: true },
            { name: '📝 New Name', value: newGuild.name || 'Unknown', inline: true },
            { name: '👤 Changed By', value: executor ? `${executor.tag} (${executor.id})` : 'Unknown', inline: false },
            { name: '🕐 Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
          ])
          .setThumbnail(newGuild.iconURL({ dynamic: true, size: 256 }) || null)
          .setTimestamp();

      } else if (changeType === 'server_icon') {
        embed = new EmbedBuilder()
          .setTitle(`🖼️ Server Icon Changed`)
          .setColor(0x9B59B6)
          .addFields([
            { name: '🏠 Server', value: `${newGuild.name} (${newGuild.id})`, inline: false },
            { name: '👤 Changed By', value: executor ? `${executor.tag} (${executor.id})` : 'Unknown', inline: false },
            { name: '🕐 Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
          ])
          .setTimestamp();

        // Add new image as thumbnail and large image
        if (newGuild.iconURL({ dynamic: true, size: 512 })) {
          embed.setThumbnail(newGuild.iconURL({ dynamic: true, size: 256 }));
          embed.setImage(newGuild.iconURL({ dynamic: true, size: 512 }));
        }

        // Add link to old image if available
        if (oldGuild.iconURL({ dynamic: true, size: 512 })) {
          embed.addFields([
            { name: '🔗 Old Icon', value: `[View Old Icon](${oldGuild.iconURL({ dynamic: true, size: 512 })})`, inline: true }
          ]);
        }
      } else {
        // For general changes
        embed = new EmbedBuilder()
          .setTitle('🏷️ Server Updated')
          .setColor(0x3498DB)
          .setTimestamp()
          .setFooter({
            text: `${newGuild.name} • Manual Log System`,
            iconURL: newGuild.iconURL({ dynamic: true })
          });

        // Add changes
        if (oldGuild.name !== newGuild.name) {
          embed.addFields([
            {
              name: '📝 Name Changed',
              value: `**Before:** ${oldGuild.name}\n**After:** ${newGuild.name}`,
              inline: false
            }
          ]);
        }

        if (oldGuild.iconURL() !== newGuild.iconURL()) {
          embed.addFields([
            {
              name: '🖼️ Icon Changed',
              value: 'Server icon has been updated',
              inline: false
            }
          ]);
          
          if (newGuild.iconURL()) {
            embed.setThumbnail(newGuild.iconURL({ dynamic: true }));
          }
        }
      }

      await channel.send({ embeds: [embed] });
      console.log(`✅ Logged server changes for ${newGuild.name}`);

    } catch (error) {
      console.error(`❌ Error logging server changes for guild ${newGuild?.id}:`, error);
    }
  }

  /**
   * Log channel changes (create, delete, update)
   */
  async logChannelChange(channel, action, executor, changes = null) {
    try {
      const settings = await this.loadServerSettings(channel.guild.id);
      
      if (!settings?.enabled || !settings.categories?.serverSettings?.enabled) {
        return;
      }

      const logChannelId = settings.categories.serverSettings.channelId || settings.channelId;
      const logChannel = channel.guild.channels.cache.get(logChannelId);
      if (!logChannel || !logChannel.isTextBased()) {
        return;
      }

      // Check bot permissions
      const botMember = channel.guild.members.me;
      if (!botMember || !logChannel.permissionsFor(botMember).has(['SendMessages', 'EmbedLinks'])) {
        console.log(`❌ Bot lacks permissions in channel ${logChannel.name}`);
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
          { name: '📂 Type', value: this.getChannelTypeText(channel.type), inline: true },
          { name: '👮 By', value: executor ? `<@${executor.id}>` : 'Unknown', inline: true }
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
      console.log(`✅ Sent Manual Log (channel ${action}) for channel ${channel.name} in ${channel.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging channel change:', error);
    }
  }

  /**
   * Get channel type text
   */
  getChannelTypeText(channelType) {
    const types = {
      0: 'Text',
      2: 'Voice',
      4: 'Category',
      5: 'Announcement',
      10: 'News',
      11: 'Public',
      12: 'Private',
      13: 'Stage',
      15: 'Forum'
    };
    return types[channelType] || `Type ${channelType}`;
  }
}

module.exports = FixedManualLogSystem;