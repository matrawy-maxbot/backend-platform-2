const { Client, GatewayIntentBits, Events, ChannelType } = require('discord.js');
const AutoLogSystem = require('./features/logging/auto-log');

// إنشاء عميل Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// إنشاء نظام Auto Log
const autoLogSystem = new AutoLogSystem();

// معرف الخادم المستهدف
const TARGET_GUILD_ID = '358950338046459905';

client.once(Events.ClientReady, async () => {
  console.log('🤖 Auto Log Test Bot is ready!');
  console.log(`📊 Logged in as ${client.user.tag}`);
  
  try {
    // العثور على الخادم المستهدف
    const guild = client.guilds.cache.get(TARGET_GUILD_ID);
    if (!guild) {
      console.error(`❌ Guild with ID ${TARGET_GUILD_ID} not found`);
      return;
    }
    
    console.log(`🏠 Found guild: ${guild.name}`);
    
    // التحقق من حالة Auto Log
    const isEnabled = await autoLogSystem.isEnabled(TARGET_GUILD_ID);
    console.log(`📝 Auto Log Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}`);
    
    if (isEnabled) {
      // تحميل إعدادات الخادم
      const settings = await autoLogSystem.getServerSettings(TARGET_GUILD_ID);
      console.log('⚙️ Auto Log Settings:', JSON.stringify(settings, null, 2));
      
      // التحقق من قناة serverSettings
      if (settings.channels?.serverSettings) {
        const logChannel = guild.channels.cache.get(settings.channels.serverSettings);
        if (logChannel) {
          console.log(`📢 Log Channel: ${logChannel.name} (${logChannel.id})`);
        } else {
          console.log(`❌ Log channel not found: ${settings.channels.serverSettings}`);
        }
      }
    }
    
    console.log('\n🔍 Monitoring channel events...');
    console.log('💡 Create or delete a channel to test the logging system');
    
  } catch (error) {
    console.error('❌ Error during initialization:', error);
  }
});

// معالج إنشاء القنوات
client.on(Events.ChannelCreate, async (channel) => {
  try {
    if (channel.guild.id !== TARGET_GUILD_ID) return;
    
    console.log(`\n🆕 CHANNEL CREATE DETECTED:`);
    console.log(`   Channel: ${channel.name} (${channel.id})`);
    console.log(`   Type: ${channel.type}`);
    console.log(`   Guild: ${channel.guild.name}`);
    
    // جلب سجلات التدقيق
    const auditLogs = await channel.guild.fetchAuditLogs({
      type: 10, // CHANNEL_CREATE
      limit: 1
    });
    
    const channelLog = auditLogs.entries.first();
    let executor = null;
    
    if (channelLog && channelLog.target.id === channel.id && Date.now() - channelLog.createdTimestamp < 5000) {
      executor = channelLog.executor;
      console.log(`   Executor: ${executor.tag}`);
    }
    
    // التحقق من تفعيل Auto Log
    const isEnabled = await autoLogSystem.isEnabled(channel.guild.id);
    console.log(`📝 Auto Log Enabled: ${isEnabled}`);
    
    if (isEnabled) {
      console.log('🤖 Calling Auto Log system for channel create...');
      
      // استدعاء نظام Auto Log
      await autoLogSystem.logServerChange(channel.guild, 'channelCreate', [
        { name: 'Channel Created', value: `${channel.toString()} (${channel.name})` }
      ], executor);
      
      console.log('✅ Auto Log called successfully for channel create');
    } else {
      console.log('⚠️ Auto Log is disabled for this guild');
    }
    
  } catch (error) {
    console.error('❌ Error handling channel create:', error);
  }
});

// معالج حذف القنوات
client.on(Events.ChannelDelete, async (channel) => {
  try {
    if (channel.guild.id !== TARGET_GUILD_ID) return;
    
    console.log(`\n🗑️ CHANNEL DELETE DETECTED:`);
    console.log(`   Channel: ${channel.name} (${channel.id})`);
    console.log(`   Type: ${channel.type}`);
    console.log(`   Guild: ${channel.guild.name}`);
    
    // جلب سجلات التدقيق
    const auditLogs = await channel.guild.fetchAuditLogs({
      type: 12, // CHANNEL_DELETE
      limit: 1
    });
    
    const channelLog = auditLogs.entries.first();
    let executor = null;
    
    if (channelLog && channelLog.target.id === channel.id && Date.now() - channelLog.createdTimestamp < 5000) {
      executor = channelLog.executor;
      console.log(`   Executor: ${executor.tag}`);
    }
    
    // التحقق من تفعيل Auto Log
    const isEnabled = await autoLogSystem.isEnabled(channel.guild.id);
    console.log(`📝 Auto Log Enabled: ${isEnabled}`);
    
    if (isEnabled) {
      console.log('🤖 Calling Auto Log system for channel delete...');
      
      // استدعاء نظام Auto Log
      await autoLogSystem.logServerChange(channel.guild, 'channelDelete', [
        { name: 'Channel Deleted', value: `\`${channel.name}\` (${channel.id})` }
      ], executor);
      
      console.log('✅ Auto Log called successfully for channel delete');
    } else {
      console.log('⚠️ Auto Log is disabled for this guild');
    }
    
  } catch (error) {
    console.error('❌ Error handling channel delete:', error);
  }
});

// تسجيل الدخول
client.login(process.env.DISCORD_BOT_TOKEN);

// معالج الأخطاء
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});