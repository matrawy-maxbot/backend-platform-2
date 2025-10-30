const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config({ path: '../.env.local' });

const AutoLogSystem = require('./features/logging/auto-log');

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

const autoLogSystem = new AutoLogSystem(client);

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot logged in as ${readyClient.user.tag}`);
  console.log(`🔗 Connected to ${readyClient.guilds.cache.size} servers`);
  
  // البحث عن السيرفر المحدد
  const targetGuildId = '423067123225722891';
  const guild = client.guilds.cache.get(targetGuildId);
  
  if (guild) {
    console.log(`🏠 Found guild: ${guild.name} (${guild.id})`);
    
    // التحقق من إعدادات Auto Log
    const isEnabled = await autoLogSystem.isEnabled(targetGuildId);
    console.log(`🤖 Auto Log enabled: ${isEnabled}`);
    
    if (isEnabled) {
      console.log('✅ Auto Log system is enabled and ready to monitor events');
    } else {
      console.log('⚠️ Auto Log system is disabled');
    }
  } else {
    console.log(`❌ Guild ${targetGuildId} not found`);
  }
  
  console.log('\n🔍 Monitoring for member updates...');
});

// مراقبة تحديثات الأعضاء
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  try {
    console.log('\n🔄 ===== AUTO LOG TEST - GUILD MEMBER UPDATE =====');
    console.log(`👤 Member: ${newMember.user.tag} (${newMember.user.id})`);
    console.log(`🏠 Guild: ${newMember.guild.name} (${newMember.guild.id})`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // التحقق من تفعيل Auto Log
    const isEnabled = await autoLogSystem.isEnabled(newMember.guild.id);
    console.log(`🤖 Auto Log enabled: ${isEnabled}`);
    
    if (!isEnabled) {
      console.log('⚠️ Auto Log is disabled, skipping...');
      return;
    }
    
    // البحث عن المشرف الذي قام بالتغيير
    const auditLogs = await newMember.guild.fetchAuditLogs({
      limit: 10
    });
    
    let executor = null;
    const recentLog = auditLogs.entries.find(log => 
      log.target && log.target.id === newMember.user.id && 
      Date.now() - log.createdTimestamp < 10000
    );
    
    if (recentLog) {
      executor = recentLog.executor;
      console.log(`👮 Executor found: ${executor.tag} (Action: ${recentLog.action})`);
    } else {
      console.log(`❌ No executor found in audit logs`);
    }

    // تتبع تغيير الكنية
    if (oldMember.nickname !== newMember.nickname) {
      console.log('\n📝 NICKNAME CHANGE DETECTED:');
      console.log(`   Old nickname: ${oldMember.nickname || 'None'}`);
      console.log(`   New nickname: ${newMember.nickname || 'None'}`);
      
      console.log('📤 Sending to Auto Log system...');
      await autoLogSystem.logMemberUpdate(oldMember, newMember, executor);
      console.log('✅ Nickname change logged via Auto Log');
    }

    // تتبع تغييرات الأدوار
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    
    if (oldRoles.size !== newRoles.size || !oldRoles.equals(newRoles)) {
      console.log('\n📝 ROLE CHANGES DETECTED:');
      
      const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
      const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
      
      if (addedRoles.size > 0) {
        console.log('➕ Added roles:');
        addedRoles.forEach(role => {
          console.log(`   - ${role.name} (${role.id})`);
        });
      }
      
      if (removedRoles.size > 0) {
        console.log('➖ Removed roles:');
        removedRoles.forEach(role => {
          console.log(`   - ${role.name} (${role.id})`);
        });
      }
      
      console.log('📤 Sending to Auto Log system...');
      await autoLogSystem.logMemberUpdate(oldMember, newMember, executor);
      console.log('✅ Role changes logged via Auto Log');
    }

    // تتبع تغيير الأفاتار
    if (oldMember.avatar !== newMember.avatar) {
      console.log('\n🖼️ AVATAR CHANGE DETECTED:');
      console.log(`   Old avatar: ${oldMember.avatar || 'None'}`);
      console.log(`   New avatar: ${newMember.avatar || 'None'}`);
      
      console.log('📤 Sending to Auto Log system...');
      await autoLogSystem.logMemberUpdate(oldMember, newMember, executor);
      console.log('✅ Avatar change logged via Auto Log');
    }
    
    console.log('================================================\n');
    
  } catch (error) {
    console.error('❌ Error in Auto Log test:', error);
  }
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.on('warn', (warning) => {
  console.warn('⚠️ Discord client warning:', warning);
});

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('❌ Error: DISCORD_BOT_TOKEN not found in .env.local file');
  process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('🚀 Auto Log test bot started successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to login:', error);
    process.exit(1);
  });

process.on('SIGINT', () => {
  console.log('\n👋 Auto Log test bot shutting down...');
  client.destroy();
  process.exit(0);
});