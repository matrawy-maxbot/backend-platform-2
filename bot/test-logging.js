const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config({ path: '../.env.local' });

const ManualLogSystem = require('./features/logging/manual-log');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildIntegrations
  ]
});

const manualLogSystem = new ManualLogSystem(client);

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`🤖 Test Bot logged in as ${readyClient.user.tag}`);
  console.log(`📊 Connected to ${readyClient.guilds.cache.size} servers`);
  
  // عرض معلومات الخوادم
  readyClient.guilds.cache.forEach(async (guild) => {
    console.log(`\n🏠 Server: ${guild.name} (ID: ${guild.id})`);
    
    // تحقق من إعدادات التسجيل
    const settings = await manualLogSystem.loadServerSettings(guild.id);
    if (settings && settings.enabled) {
      console.log(`  ✅ Logging enabled`);
      console.log(`  📝 Categories enabled:`);
      Object.entries(settings.categories).forEach(([category, config]) => {
        if (config.enabled) {
          console.log(`    - ${category}: Channel ${config.channelId}`);
        }
      });
    } else {
      console.log(`  ❌ Logging disabled or not configured`);
    }
  });
});

// تتبع أحداث الأدوار
client.on(Events.GuildRoleCreate, async (role) => {
  console.log(`\n🆕 ROLE CREATED: ${role.name} in ${role.guild.name}`);
  console.log(`   ID: ${role.id}`);
  console.log(`   Color: ${role.hexColor}`);
  
  try {
    const settings = await manualLogSystem.loadServerSettings(role.guild.id);
    console.log(`   Logging enabled: ${settings?.enabled ? 'Yes' : 'No'}`);
    console.log(`   Roles category enabled: ${settings?.categories?.roles?.enabled ? 'Yes' : 'No'}`);
    
    if (settings?.enabled && settings?.categories?.roles?.enabled) {
      console.log(`   📤 Attempting to log role creation...`);
      await manualLogSystem.logRoleChange(role.guild, null, role, null, 'create');
      console.log(`   ✅ Role creation logged successfully`);
    } else {
      console.log(`   ⚠️ Role logging is disabled`);
    }
  } catch (error) {
    console.error(`   ❌ Error logging role creation:`, error);
  }
});

client.on(Events.GuildRoleDelete, async (role) => {
  console.log(`\n🗑️ ROLE DELETED: ${role.name} in ${role.guild.name}`);
  console.log(`   ID: ${role.id}`);
  
  try {
    const settings = await manualLogSystem.loadServerSettings(role.guild.id);
    console.log(`   Logging enabled: ${settings?.enabled ? 'Yes' : 'No'}`);
    console.log(`   Roles category enabled: ${settings?.categories?.roles?.enabled ? 'Yes' : 'No'}`);
    
    if (settings?.enabled && settings?.categories?.roles?.enabled) {
      console.log(`   📤 Attempting to log role deletion...`);
      await manualLogSystem.logRoleChange(role.guild, role, null, null, 'delete');
      console.log(`   ✅ Role deletion logged successfully`);
    } else {
      console.log(`   ⚠️ Role logging is disabled`);
    }
  } catch (error) {
    console.error(`   ❌ Error logging role deletion:`, error);
  }
});

// تتبع تغييرات أدوار الأعضاء
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  // تحقق من تغيير الأدوار فقط
  if (oldMember.roles.cache.size !== newMember.roles.cache.size || 
      !oldMember.roles.cache.equals(newMember.roles.cache)) {
    
    console.log(`\n👤 MEMBER ROLE CHANGE: ${newMember.user.tag} in ${newMember.guild.name}`);
    
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    
    if (addedRoles.size > 0) {
      console.log(`   ➕ Added roles: ${addedRoles.map(r => r.name).join(', ')}`);
    }
    if (removedRoles.size > 0) {
      console.log(`   ➖ Removed roles: ${removedRoles.map(r => r.name).join(', ')}`);
    }
    
    try {
      const settings = await manualLogSystem.loadServerSettings(newMember.guild.id);
      console.log(`   Logging enabled: ${settings?.enabled ? 'Yes' : 'No'}`);
      console.log(`   Members category enabled: ${settings?.categories?.members?.enabled ? 'Yes' : 'No'}`);
      
      if (settings?.enabled && settings?.categories?.members?.enabled) {
        console.log(`   📤 Attempting to log member role change...`);
        await manualLogSystem.logMemberRoleChange(oldMember, newMember, null);
        console.log(`   ✅ Member role change logged successfully`);
      } else {
        console.log(`   ⚠️ Member logging is disabled`);
      }
    } catch (error) {
      console.error(`   ❌ Error logging member role change:`, error);
    }
  }
});

// تتبع إنشاء القنوات
client.on(Events.ChannelCreate, async (channel) => {
  console.log(`\n📝 CHANNEL CREATED: ${channel.name} in ${channel.guild.name}`);
  console.log(`   ID: ${channel.id}`);
  console.log(`   Type: ${channel.type}`);
  
  try {
    const settings = await manualLogSystem.loadServerSettings(channel.guild.id);
    console.log(`   Logging enabled: ${settings?.enabled ? 'Yes' : 'No'}`);
    console.log(`   Server settings category enabled: ${settings?.categories?.serverSettings?.enabled ? 'Yes' : 'No'}`);
    
    if (settings?.enabled && settings?.categories?.serverSettings?.enabled) {
      console.log(`   📤 Attempting to log channel creation...`);
      await manualLogSystem.logChannelChange(channel, 'create', null);
      console.log(`   ✅ Channel creation logged successfully`);
    } else {
      console.log(`   ⚠️ Channel logging is disabled`);
    }
  } catch (error) {
    console.error(`   ❌ Error logging channel creation:`, error);
  }
});

// تتبع حذف القنوات
client.on(Events.ChannelDelete, async (channel) => {
  console.log(`\n🗑️ CHANNEL DELETED: ${channel.name} in ${channel.guild.name}`);
  console.log(`   ID: ${channel.id}`);
  console.log(`   Type: ${channel.type}`);
  
  try {
    const settings = await manualLogSystem.loadServerSettings(channel.guild.id);
    console.log(`   Logging enabled: ${settings?.enabled ? 'Yes' : 'No'}`);
    console.log(`   Server settings category enabled: ${settings?.categories?.serverSettings?.enabled ? 'Yes' : 'No'}`);
    
    if (settings?.enabled && settings?.categories?.serverSettings?.enabled) {
      console.log(`   📤 Attempting to log channel deletion...`);
      await manualLogSystem.logChannelChange(channel, 'delete', null);
      console.log(`   ✅ Channel deletion logged successfully`);
    } else {
      console.log(`   ⚠️ Channel logging is disabled`);
    }
  } catch (error) {
    console.error(`   ❌ Error logging channel deletion:`, error);
  }
});

console.log('🔍 Starting logging test bot...');
console.log('This bot will monitor and report all logging events.');
console.log('Try creating/deleting roles or channels, or changing member roles to test.');

client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('✅ Test bot started successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to start test bot:', error);
    process.exit(1);
  });

// إيقاف البوت عند الضغط على Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping test bot...');
  client.destroy();
  process.exit(0);
});