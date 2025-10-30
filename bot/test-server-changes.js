const { Client, GatewayIntentBits, Events, AuditLogEvent } = require('discord.js');
const AutoLogSystem = require('./features/logging/auto-log');
const ManualLogSystem = require('./features/logging/index');

// تحميل متغيرات البيئة
require('dotenv').config();

// إنشاء client جديد
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration
  ]
});

// تهيئة أنظمة التسجيل
let autoLogSystem;
let manualLogSystem;

client.once(Events.ClientReady, async () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
  console.log(`🌐 Connected to ${client.guilds.cache.size} servers`);
  
  // تهيئة Auto Log System
  try {
    autoLogSystem = new AutoLogSystem(client);
    console.log('✅ Auto Log System initialized');
  } catch (error) {
    console.error('❌ Error initializing Auto Log System:', error);
  }
  
  // تهيئة Manual Log System
  try {
    manualLogSystem = new ManualLogSystem(client);
    console.log('✅ Manual Log System initialized');
  } catch (error) {
    console.error('❌ Error initializing Manual Log System:', error);
  }
  
  // البحث عن السيرفر المستهدف
  const targetGuild = client.guilds.cache.find(guild => guild.name.includes('R7 بالقمة'));
  if (targetGuild) {
    console.log(`🎯 Found target guild: ${targetGuild.name} (${targetGuild.id})`);
    
    // فحص إعدادات Auto Log
    try {
      const autoSettings = await autoLogSystem.getServerSettings(targetGuild.id);
      console.log(`📋 Auto Log enabled: ${autoSettings?.enabled || false}`);
      if (autoSettings?.channels?.serverSettings) {
        console.log(`📺 Auto Log server settings channel: ${autoSettings.channels.serverSettings}`);
      }
    } catch (error) {
      console.log('⚠️ Could not check Auto Log settings');
    }
    
    console.log('\n🔍 ===== SERVER CHANGE TEST READY =====');
    console.log('📝 Monitoring for server name and icon changes...');
    console.log('🧪 Please change the server name or icon to test the functionality');
  } else {
    console.log('❌ Target guild not found');
  }
});

// مراقبة تغييرات السيرفر
client.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
  try {
    console.log(`\n🏠 ===== GUILD UPDATE EVENT DETECTED =====`);
    console.log(`🏠 Server: ${newGuild.name} (${newGuild.id})`);
    console.log(`📝 Old name: "${oldGuild.name}"`);
    console.log(`📝 New name: "${newGuild.name}"`);
    console.log(`🖼️ Old icon: ${oldGuild.iconURL() || 'No icon'}`);
    console.log(`🖼️ New icon: ${newGuild.iconURL() || 'No icon'}`);
    
    const changes = [];
    let hasChanges = false;
    
    // فحص تغيير الاسم
    if (oldGuild.name !== newGuild.name) {
      changes.push({
        name: '📝 Server Name',
        value: `**Before:** ${oldGuild.name}\n**After:** ${newGuild.name}`,
        inline: false
      });
      hasChanges = true;
      console.log(`✅ Server name change detected: ${oldGuild.name} → ${newGuild.name}`);
    }
    
    // فحص تغيير الأيقونة
    if (oldGuild.icon !== newGuild.icon) {
      const oldIcon = oldGuild.iconURL({ dynamic: true }) || 'No icon';
      const newIcon = newGuild.iconURL({ dynamic: true }) || 'No icon';
      changes.push({
        name: '🖼️ Server Icon',
        value: `**Before:** ${oldIcon === 'No icon' ? 'No icon' : '[Previous Icon](' + oldIcon + ')'}\n**After:** ${newIcon === 'No icon' ? 'No icon' : '[New Icon](' + newIcon + ')'}`,
        inline: false
      });
      hasChanges = true;
      console.log(`✅ Server icon change detected`);
    }
    
    if (hasChanges) {
      // الحصول على المنفذ من سجلات التدقيق
      let executor = null;
      try {
        const auditLogs = await newGuild.fetchAuditLogs({
          type: AuditLogEvent.GuildUpdate,
          limit: 1
        });
        const auditEntry = auditLogs.entries.first();
        executor = auditEntry ? auditEntry.executor : null;
        console.log(`👮 Executor: ${executor ? executor.tag : 'Unknown'}`);
      } catch (auditError) {
        console.log('⚠️ Could not fetch audit logs for guild update');
      }
      
      // تسجيل باستخدام Manual Log System
      if (manualLogSystem) {
        try {
          console.log(`🔄 Calling Manual Log System...`);
          await manualLogSystem.logServerChange(oldGuild, newGuild, executor);
          console.log(`✅ Manual Log: Server changes logged successfully`);
        } catch (error) {
          console.error('❌ Error in Manual Log server change:', error);
        }
      }
      
      // تسجيل باستخدام Auto Log System
      if (autoLogSystem) {
        try {
          console.log(`🔄 Calling Auto Log System...`);
          await autoLogSystem.logServerChange(newGuild, 'serverUpdate', changes, executor);
          console.log(`✅ Auto Log: Server changes logged successfully`);
        } catch (error) {
          console.error('❌ Error in Auto Log server change:', error);
        }
      }
    } else {
      console.log(`ℹ️ No actual changes detected`);
    }
    
    console.log(`🏁 ===== GUILD UPDATE EVENT COMPLETED =====\n`);
  } catch (error) {
    console.error('❌ Error handling GuildUpdate event:', error);
  }
});

// تسجيل الدخول
client.login(process.env.DISCORD_BOT_TOKEN);