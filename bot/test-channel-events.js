require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder, ChannelType } = require('discord.js');

// إنشاء العميل
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});

// تحميل أنظمة التسجيل
const ManualLogSystem = require('./features/logging/manual-log');
const AutoLogSystem = require('./features/logging/auto-log');

const manualLogSystem = new ManualLogSystem();
const autoLogSystem = new AutoLogSystem();

// معرف الخادم المستهدف للاختبار
const TARGET_GUILD_ID = '358950338046459905';

client.once(Events.ClientReady, async () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
  console.log(`🔍 Looking for test guild: ${TARGET_GUILD_ID}`);
  
  const guild = client.guilds.cache.get(TARGET_GUILD_ID);
  if (!guild) {
    console.log('❌ Test guild not found!');
    return;
  }
  
  console.log(`✅ Found test guild: ${guild.name}`);
  
  // التحقق من إعدادات التسجيل
  const manualLogSettings = await manualLogSystem.loadServerSettings(TARGET_GUILD_ID);
  const autoLogEnabled = await autoLogSystem.isEnabled(TARGET_GUILD_ID);
  
  console.log(`\n📊 Logging Systems Status:`);
  console.log(`   Manual Log: ${manualLogSettings?.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   Manual Log Channels Category: ${manualLogSettings?.categories?.channels?.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   Auto Log: ${autoLogEnabled ? '✅ Enabled' : '❌ Disabled'}`);
  
  if (manualLogSettings?.categories?.channels?.enabled) {
    console.log(`   Manual Log Channel ID: ${manualLogSettings.categories.channels.channelId}`);
  }
  
  console.log(`\n🎯 Ready to test channel events!`);
  console.log(`📝 Create or delete a channel in the Discord server to test logging.`);
});

// تتبع إنشاء القنوات
client.on(Events.ChannelCreate, async (channel) => {
  console.log(`\n🆕 CHANNEL CREATED:`);
  console.log(`   Name: ${channel.name}`);
  console.log(`   ID: ${channel.id}`);
  console.log(`   Type: ${channel.type}`);
  console.log(`   Guild: ${channel.guild.name}`);
  
  if (channel.guild.id !== TARGET_GUILD_ID) {
    console.log(`   ⚠️ Skipping - not target guild`);
    return;
  }
  
  try {
    // التحقق من أنظمة التسجيل
    const manualLogEnabled = await manualLogSystem.isEnabled(channel.guild.id);
    const autoLogEnabled = await autoLogSystem.isEnabled(channel.guild.id);
    
    console.log(`\n📊 Logging Systems Check:`);
    console.log(`   Manual Log Enabled: ${manualLogEnabled ? 'Yes' : 'No'}`);
    console.log(`   Auto Log Enabled: ${autoLogEnabled ? 'Yes' : 'No'}`);
    
    if (manualLogEnabled) {
      console.log(`\n📝 Calling Manual Log system...`);
      await manualLogSystem.logChannelChange('create', channel, null);
      console.log(`✅ Manual Log called successfully`);
    }
    
    if (autoLogEnabled) {
      console.log(`\n🤖 Calling Auto Log system...`);
      await autoLogSystem.logServerChange(channel.guild, 'channelCreate', [
        { name: 'Channel Created', value: `${channel.toString()} (${channel.name})` }
      ], null);
      console.log(`✅ Auto Log called successfully`);
    }
    
    if (!manualLogEnabled && !autoLogEnabled) {
      console.log(`\n⚠️ No logging systems enabled`);
    }
    
  } catch (error) {
    console.error(`❌ Error handling channel create:`, error);
  }
});

// تتبع حذف القنوات
client.on(Events.ChannelDelete, async (channel) => {
  console.log(`\n🗑️ CHANNEL DELETED:`);
  console.log(`   Name: ${channel.name}`);
  console.log(`   ID: ${channel.id}`);
  console.log(`   Type: ${channel.type}`);
  console.log(`   Guild: ${channel.guild.name}`);
  
  if (channel.guild.id !== TARGET_GUILD_ID) {
    console.log(`   ⚠️ Skipping - not target guild`);
    return;
  }
  
  try {
    // التحقق من أنظمة التسجيل
    const manualLogEnabled = await manualLogSystem.isEnabled(channel.guild.id);
    const autoLogEnabled = await autoLogSystem.isEnabled(channel.guild.id);
    
    console.log(`\n📊 Logging Systems Check:`);
    console.log(`   Manual Log Enabled: ${manualLogEnabled ? 'Yes' : 'No'}`);
    console.log(`   Auto Log Enabled: ${autoLogEnabled ? 'Yes' : 'No'}`);
    
    if (manualLogEnabled) {
      console.log(`\n📝 Calling Manual Log system...`);
      await manualLogSystem.logChannelChange('delete', channel, null);
      console.log(`✅ Manual Log called successfully`);
    }
    
    if (autoLogEnabled) {
      console.log(`\n🤖 Calling Auto Log system...`);
      await autoLogSystem.logServerChange(channel.guild, 'channelDelete', [
        { name: 'Channel Deleted', value: `\`${channel.name}\` (${channel.id})` }
      ], null);
      console.log(`✅ Auto Log called successfully`);
    }
    
    if (!manualLogEnabled && !autoLogEnabled) {
      console.log(`\n⚠️ No logging systems enabled`);
    }
    
  } catch (error) {
    console.error(`❌ Error handling channel delete:`, error);
  }
});

// تسجيل الدخول
client.login(process.env.DISCORD_BOT_TOKEN);