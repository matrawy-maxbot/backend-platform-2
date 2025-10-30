require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const ManualLogSystem = require('./features/logging/manual-log.js');
const AutoLogSystem = require('./features/logging/auto-log.js');

// إنشاء client جديد للبوت
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

// إنشاء أنظمة التسجيل
const manualLogSystem = new ManualLogSystem(client);
const autoLogSystem = new AutoLogSystem(client);

// When bot is ready
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
  console.log(`🔗 Bot connected to ${readyClient.guilds.cache.size} servers`);
  
  console.log('📋 Connected servers list:');
  readyClient.guilds.cache.forEach(guild => {
    console.log(`  - ${guild.name} (ID: ${guild.id})`);
  });
  
  // البحث عن سيرفر للاختبار
  const targetGuild = readyClient.guilds.cache.first();
  if (targetGuild) {
    console.log(`🎯 Using server "${targetGuild.name}" for testing`);
    console.log(`📊 Server has ${targetGuild.memberCount} members`);
    
    // التحقق من حالة أنظمة التسجيل
    const manualLogSettings = await manualLogSystem.loadServerSettings(targetGuild.id);
    const autoLogEnabled = await autoLogSystem.isEnabled(targetGuild.id);
    
    const manualLogEnabled = manualLogSettings && manualLogSettings.enabled === true;
    
    console.log(`📝 Manual Log System: ${manualLogEnabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`🤖 Auto Log System: ${autoLogEnabled ? '✅ Enabled' : '❌ Disabled'}`);
    
    if (!manualLogEnabled && !autoLogEnabled) {
      console.log('⚠️ Warning: No logging systems are enabled for this server');
    }
  } else {
    console.log('❌ No servers found for testing');
  }
  
  console.log('\n🔍 Monitoring for kick and ban events...');
  console.log('📌 To test: Use Discord commands to kick or ban a member');
});

// تتبع عمليات الحظر
client.on(Events.GuildBanAdd, async (ban) => {
  console.log(`\n🔨 BAN EVENT DETECTED:`);
  console.log(`   User: ${ban.user.tag} (${ban.user.id})`);
  console.log(`   Server: ${ban.guild.name} (${ban.guild.id})`);
  
  try {
    // التحقق من سجل التدقيق لمعرفة من قام بالحظر
    const auditLogs = await ban.guild.fetchAuditLogs({
      type: 22, // MEMBER_BAN_ADD
      limit: 1
    });
    
    const banLog = auditLogs.entries.first();
    if (banLog && banLog.target.id === ban.user.id && Date.now() - banLog.createdTimestamp < 5000) {
      const executor = banLog.executor;
      console.log(`   Executor: ${executor.tag} (${executor.id})`);
      console.log(`   Reason: ${banLog.reason || 'No reason provided'}`);
      
      // التحقق من أي نظام تسجيل مفعل
      const manualLogSettings = await manualLogSystem.loadServerSettings(ban.guild.id);
      const autoLogEnabled = await autoLogSystem.isEnabled(ban.guild.id);
      
      const manualLogEnabled = manualLogSettings && manualLogSettings.enabled === true;
      
      console.log(`\n📊 Logging Systems Status:`);
      console.log(`   Manual Log: ${manualLogEnabled ? '✅ Enabled' : '❌ Disabled'}`);
      console.log(`   Auto Log: ${autoLogEnabled ? '✅ Enabled' : '❌ Disabled'}`);
      
      if (manualLogEnabled) {
        console.log('\n📝 Calling Manual Log system for ban...');
        await manualLogSystem.logKickBan(ban.user, 'ban', executor, banLog.reason);
        console.log('✅ Manual Log system called successfully');
      }
      
      if (autoLogEnabled) {
        console.log('\n🤖 Calling Auto Log system for ban...');
        await autoLogSystem.logKickBan(ban.user, 'ban', executor, banLog.reason, guild);
        console.log('✅ Auto Log system called successfully');
      }
      
      if (!manualLogEnabled && !autoLogEnabled) {
        console.log('\n⚠️ No logging systems enabled - no embeds will be sent');
      }
    } else {
      console.log('   ❌ Could not find audit log entry for this ban');
    }
    
  } catch (error) {
    console.error('❌ Error handling ban event:', error);
  }
});

// تتبع عمليات الطرد
client.on(Events.GuildAuditLogEntryCreate, async (auditLogEntry, guild) => {
  try {
    // التحقق من نوع الحدث
    if (auditLogEntry.action === 20) { // MEMBER_KICK
      const target = auditLogEntry.target;
      const executor = auditLogEntry.executor;
      const reason = auditLogEntry.reason;
      
      console.log(`\n👢 KICK EVENT DETECTED:`);
      
      // التحقق من وجود البيانات المطلوبة
      if (!target) {
        console.log(`❌ Error: Target user is null - attempting to fetch from targetId`);
        console.log(`   Target ID: ${auditLogEntry.targetId || 'Not available'}`);
        console.log(`   Executor ID: ${auditLogEntry.executorId || 'Not available'}`);
        
        // محاولة إنشاء كائن مستخدم مؤقت باستخدام targetId
        if (auditLogEntry.targetId) {
          const targetUser = {
            id: auditLogEntry.targetId,
            tag: 'Unknown User',
            username: 'Unknown User',
            displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png' // صورة افتراضية
          };
          
          const executorUser = auditLogEntry.executor || {
            id: auditLogEntry.executorId || 'Unknown',
            tag: 'Unknown Executor',
            username: 'Unknown Executor',
            guild: guild // إضافة مرجع للسيرفر
          };
          
          console.log(`🔄 Using fallback user data:`);
          console.log(`   User: ${targetUser.tag} (${targetUser.id})`);
          console.log(`   Executor: ${executorUser.tag} (${executorUser.id})`);
          
          // متابعة المعالجة مع البيانات المؤقتة
          const manualLogSettings = await manualLogSystem.loadServerSettings(guild.id);
          const autoLogEnabled = await autoLogSystem.isEnabled(guild.id);
          
          const manualLogEnabled = manualLogSettings && manualLogSettings.enabled === true;
          
          console.log(`\n📊 Logging Systems Status:`);
          console.log(`   Manual Log: ${manualLogEnabled ? '✅ Enabled' : '❌ Disabled'}`);
          console.log(`   Auto Log: ${autoLogEnabled ? '✅ Enabled' : '❌ Disabled'}`);
          
          if (manualLogEnabled) {
            console.log('\n📝 Calling Manual Log system for kick (with fallback data)...');
            await manualLogSystem.logKickBan(targetUser, 'kick', executorUser, reason);
            console.log('✅ Manual Log system called successfully');
          }
          
          if (autoLogEnabled) {
            console.log('\n🤖 Calling Auto Log system for kick (with fallback data)...');
            await autoLogSystem.logKickBan(targetUser, 'kick', executorUser, reason, guild);
            console.log('✅ Auto Log system called successfully');
          }
          
          return;
        } else {
          console.log(`❌ Cannot process kick event - no target information available`);
          return;
        }
      }
      
      if (!executor) {
        console.log(`❌ Error: Executor is null`);
        return;
      }
      
      console.log(`   User: ${target.tag || target.username || 'Unknown'} (${target.id})`);
      console.log(`   Server: ${guild.name} (${guild.id})`);
      console.log(`   Executor: ${executor.tag || executor.username || 'Unknown'} (${executor.id})`);
      console.log(`   Reason: ${reason || 'No reason provided'}`);
      
      // التحقق من أي نظام تسجيل مفعل
      const manualLogSettings = await manualLogSystem.loadServerSettings(guild.id);
      const autoLogEnabled = await autoLogSystem.isEnabled(guild.id);
      
      const manualLogEnabled = manualLogSettings && manualLogSettings.enabled === true;
      
      console.log(`\n📊 Logging Systems Status:`);
      console.log(`   Manual Log: ${manualLogEnabled ? '✅ Enabled' : '❌ Disabled'}`);
      console.log(`   Auto Log: ${autoLogEnabled ? '✅ Enabled' : '❌ Disabled'}`);
      
      if (manualLogEnabled) {
        console.log('\n📝 Calling Manual Log system for kick...');
        await manualLogSystem.logKickBan(target, 'kick', executor, reason);
        console.log('✅ Manual Log system called successfully');
      }
      
      if (autoLogEnabled) {
        console.log('\n🤖 Calling Auto Log system for kick...');
        await autoLogSystem.logKickBan(target, 'kick', executor, reason, guild);
        console.log('✅ Auto Log system called successfully');
      }
      
      if (!manualLogEnabled && !autoLogEnabled) {
        console.log('\n⚠️ No logging systems enabled - no embeds will be sent');
      }
    }
    
  } catch (error) {
    console.error('❌ Error handling audit log entry:', error);
  }
});

// Error handling
client.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

client.on('warn', (warning) => {
  console.log('⚠️ Warning:', warning);
});

// تسجيل الدخول
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('🚀 Kick/Ban test bot started successfully...');
  })
  .catch((error) => {
    console.error('❌ Failed to login:', error);
    process.exit(1);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down test bot...');
  client.destroy();
  process.exit(0);
});