const { Client, GatewayIntentBits, Events, AuditLogEvent } = require('discord.js');
require('dotenv').config({ path: '../.env.local' });

// استيراد Manual Log System الجديد المنظم
const ManualLogSystem = require('./features/logging/index');

// إنشاء عميل Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// إنشاء نظام Manual Log الجديد
const manualLogSystem = new ManualLogSystem(client);

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
  console.log(`🔗 Connected to ${readyClient.guilds.cache.size} servers`);
  
  // تحميل إعدادات Manual Log
  await manualLogSystem.reloadSettings();
  console.log(`📋 Manual Log settings loaded successfully`);
  
  // إنشاء إعدادات افتراضية للسيرفرات التي لا تملك إعدادات
  let newSettingsCount = 0;
  for (const guild of readyClient.guilds.cache.values()) {
    const settings = await manualLogSystem.getServerSettings(guild.id);
    if (!settings) {
      const defaultSettings = await manualLogSystem.createDefaultSettings(guild.id);
      if (defaultSettings) {
        newSettingsCount++;
      }
    }
  }
  
  if (newSettingsCount > 0) {
    console.log(`✨ Created default settings for ${newSettingsCount} new servers`);
  }
  
  console.log(`🚀 Manual Log System is ready for all ${readyClient.guilds.cache.size} servers!`);
});

// Handle message deletion events
client.on(Events.MessageDelete, async (message) => {
  try {
    if (!message.guild || message.author?.bot) return;
    
    console.log(`🗑️ [MESSAGE DELETE] Message deleted in ${message.guild.name}`);
    console.log(`   Author: ${message.author?.tag || 'Unknown'}`);
    console.log(`   Channel: ${message.channel.name}`);
    console.log(`   Content: ${message.content || 'No content'}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logMessageDelete(message);
    }
  } catch (error) {
    console.error('❌ Error handling MessageDelete:', error);
  }
});

// Handle message edit events
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  try {
    if (!newMessage.guild || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;
    
    console.log(`✏️ [MESSAGE UPDATE] Message edited in ${newMessage.guild.name}`);
    console.log(`   Author: ${newMessage.author?.tag || 'Unknown'}`);
    console.log(`   Channel: ${newMessage.channel.name}`);
    console.log(`   Old: ${oldMessage.content || 'No content'}`);
    console.log(`   New: ${newMessage.content || 'No content'}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logMessageEdit(oldMessage, newMessage);
    }
  } catch (error) {
    console.error('❌ Error handling MessageUpdate:', error);
  }
});

// Handle member join events
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    console.log(`👋 [MEMBER JOIN] ${member.user.tag} joined ${member.guild.name}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logJoinLeave(member, 'join');
    }
  } catch (error) {
    console.error('❌ Error handling GuildMemberAdd:', error);
  }
});

// Handle member leave events
client.on(Events.GuildMemberRemove, async (member) => {
  try {
    console.log(`👋 [MEMBER LEAVE] ${member.user.tag} left ${member.guild.name}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logJoinLeave(member, 'leave');
    }
  } catch (error) {
    console.error('❌ Error handling GuildMemberRemove:', error);
  }
});

// Guild Member Update event is handled later in the file

// Handle user update events (bot profile or username changes)
client.on(Events.UserUpdate, async (oldUser, newUser) => {
  try {
    if (newUser.id !== client.user.id) return;
    
    console.log(`🤖 [BOT UPDATE] Bot profile updated`);
    console.log(`   Old: ${oldUser.tag}`);
    console.log(`   New: ${newUser.tag}`);
    
    let changeType = '';
    if (oldUser.username !== newUser.username) {
      changeType = 'username';
    }
    if (oldUser.avatar !== newUser.avatar) {
      changeType = changeType ? 'username_avatar' : 'avatar';
    }
    
    if (changeType && manualLogSystem) {
      client.guilds.cache.forEach(async (guild) => {
        try {
          await manualLogSystem.logBotProfileChange(oldUser, newUser, changeType, guild);
        } catch (error) {
          console.error(`❌ Error logging bot profile change for guild ${guild.name}:`, error);
        }
      });
    }
  } catch (error) {
    console.error('❌ Error handling UserUpdate:', error);
  }
});

// Handle ban events
client.on(Events.GuildBanAdd, async (ban) => {
  try {
    console.log(`🔨 [BAN ADD] ${ban.user.tag} was banned from ${ban.guild.name}`);
    console.log(`   Reason: ${ban.reason || 'No reason provided'}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logKickBan(ban.guild, ban.user, 'ban', null, ban.reason);
    }
  } catch (error) {
    console.error('❌ Error handling GuildBanAdd:', error);
  }
});

// Handle unban events
client.on(Events.GuildBanRemove, async (ban) => {
  try {
    console.log(`🔓 [BAN REMOVE] ${ban.user.tag} was unbanned from ${ban.guild.name}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logKickBan(ban.guild, ban.user, 'unban', null, null);
    }
  } catch (error) {
    console.error('❌ Error handling GuildBanRemove:', error);
  }
});

// Handle server update events (name and icon)
client.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
  try {
    console.log(`🏠 [GUILD UPDATE] Server ${newGuild.name} was updated`);
    
    const changes = {};
    if (oldGuild.name !== newGuild.name) {
      changes.name = { old: oldGuild.name, new: newGuild.name };
      console.log(`📝 Server name changed: ${oldGuild.name} → ${newGuild.name}`);
    }
    if (oldGuild.icon !== newGuild.icon) {
      changes.icon = { old: oldGuild.iconURL(), new: newGuild.iconURL() };
      console.log(`🖼️ Server icon changed`);
    }
    
    if (Object.keys(changes).length > 0) {
      console.log(`🔄 Calling logServerChange for server changes`);
      
      // Use the manual log system to log server changes
      if (manualLogSystem) {
        await manualLogSystem.logServerChange(oldGuild, newGuild, null);
      }
    }
  } catch (error) {
    console.error('❌ Error handling GuildUpdate:', error);
  }
});

// Handle role events
client.on(Events.GuildRoleCreate, async (role) => {
  try {
    console.log(`🎭 [ROLE CREATE] Role ${role.name} created in ${role.guild.name}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logRoleChange(role, 'create');
    }
  } catch (error) {
    console.error('❌ Error handling GuildRoleCreate:', error);
  }
});

client.on(Events.GuildRoleDelete, async (role) => {
  try {
    console.log(`🎭 [ROLE DELETE] Role ${role.name} deleted from ${role.guild.name}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logRoleChange(role, 'delete');
    }
  } catch (error) {
    console.error('❌ Error handling GuildRoleDelete:', error);
  }
});

client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
  try {
    console.log(`🎭 [ROLE UPDATE] Role ${newRole.name} updated in ${newRole.guild.name}`);
    
    const changes = {};
    if (oldRole.name !== newRole.name) {
      changes.name = { old: oldRole.name, new: newRole.name };
    }
    if (oldRole.color !== newRole.color) {
      changes.color = { old: oldRole.hexColor, new: newRole.hexColor };
    }
    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      changes.permissions = { old: oldRole.permissions.toArray(), new: newRole.permissions.toArray() };
    }
    if (oldRole.position !== newRole.position) {
      changes.position = { old: oldRole.position, new: newRole.position };
    }
    if (oldRole.mentionable !== newRole.mentionable) {
      changes.mentionable = { old: oldRole.mentionable, new: newRole.mentionable };
    }
    if (oldRole.hoist !== newRole.hoist) {
      changes.hoist = { old: oldRole.hoist, new: newRole.hoist };
    }
    
    if (Object.keys(changes).length > 0 && manualLogSystem) {
      await manualLogSystem.logRoleChange(newRole, 'update', null, changes);
    }
  } catch (error) {
    console.error('❌ Error handling GuildRoleUpdate:', error);
  }
});

// Handle member update events
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  try {
    console.log(`🔍 [FIXED BOT] GuildMemberUpdate event for ${newMember.user.tag} in ${newMember.guild.name}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logMemberUpdate(oldMember, newMember);
    }
  } catch (error) {
    console.error('❌ Error handling GuildMemberUpdate:', error);
  }
});

// Handle Voice State Update events
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    if (manualLogSystem) {
      await manualLogSystem.logVoiceStateUpdate(oldState, newState);
    }
  } catch (error) {
    console.error('❌ Error handling VoiceStateUpdate:', error);
  }
});

// Role events are handled above

// Handle channel events (Channel Events)
client.on(Events.ChannelCreate, async (channel) => {
  try {
    if (!channel.guild) return;
    
    console.log(`📺 [FIXED BOT] Channel Created: ${channel.name} in ${channel.guild.name}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logChannelChange(channel, 'create');
    }
  } catch (error) {
    console.error('❌ Error handling ChannelCreate:', error);
  }
});

client.on(Events.ChannelDelete, async (channel) => {
  try {
    if (!channel.guild) return;
    
    console.log(`📺 [FIXED BOT] Channel Deleted: ${channel.name} in ${channel.guild.name}`);
    
    if (manualLogSystem) {
      await manualLogSystem.logChannelChange(channel, 'delete');
    }
  } catch (error) {
    console.error('❌ Error handling ChannelDelete:', error);
  }
});

client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
  try {
    if (!newChannel.guild) return;
    
    console.log(`📺 [CHANNEL UPDATE] Channel ${newChannel.name} updated in ${newChannel.guild.name}`);
    
    const changes = {};
    if (oldChannel.name !== newChannel.name) {
      changes.name = { old: oldChannel.name, new: newChannel.name };
    }
    if (oldChannel.topic !== newChannel.topic) {
      changes.topic = { old: oldChannel.topic, new: newChannel.topic };
    }
    if (oldChannel.position !== newChannel.position) {
      changes.position = { old: oldChannel.position, new: newChannel.position };
    }
    if (oldChannel.nsfw !== newChannel.nsfw) {
      changes.nsfw = { old: oldChannel.nsfw, new: newChannel.nsfw };
    }
    
    if (Object.keys(changes).length > 0 && manualLogSystem) {
      await manualLogSystem.logChannelChange(newChannel, 'update', null, changes);
    }
  } catch (error) {
    console.error('❌ Error handling ChannelUpdate:', error);
  }
});

// تسجيل الدخول
if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('❌ DISCORD_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('🚀 Fixed bot started successfully...');
  })
  .catch((error) => {
    console.error('❌ Failed to login:', error);
    process.exit(1);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down fixed bot...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down fixed bot...');
  client.destroy();
  process.exit(0);
});