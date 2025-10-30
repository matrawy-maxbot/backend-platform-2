require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
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
const autoLogSystem = new AutoLogSystem(client);

// معرف السيرفر المستهدف
const TARGET_GUILD_ID = '358950338046459905';

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  
  // العثور على السيرفر المستهدف
  const guild = client.guilds.cache.get(TARGET_GUILD_ID);
  if (!guild) {
    console.log(`❌ Guild ${TARGET_GUILD_ID} not found`);
    return;
  }
  
  console.log(`🎯 Found guild: ${guild.name} (${guild.id})`);
  
  // التحقق من حالة Auto Log
  const autoLogEnabled = await autoLogSystem.isEnabled(guild.id);
  console.log(`🤖 Auto Log enabled: ${autoLogEnabled}`);
  
  if (autoLogEnabled) {
    const settings = await autoLogSystem.getServerSettings(guild.id);
    console.log(`⚙️ Auto Log settings:`, JSON.stringify(settings, null, 2));
    
    // التحقق من وجود قناة الدخول والخروج
    const joinLeaveChannel = guild.channels.cache.get(settings.channels.joinLeave);
    if (joinLeaveChannel) {
      console.log(`✅ Join/Leave channel found: ${joinLeaveChannel.name}`);
    } else {
      console.log(`❌ Join/Leave channel not found: ${settings.channels.joinLeave}`);
    }
  }
  
  console.log('\n🔍 Monitoring for join/leave events...');
  console.log('📌 To test: Have someone join or leave the server');
});

// مراقبة أحداث دخول الأعضاء
client.on(Events.GuildMemberAdd, async (member) => {
  if (member.guild.id !== TARGET_GUILD_ID) return;
  
  console.log(`\n📥 JOIN EVENT DETECTED:`);
  console.log(`   User: ${member.user.tag} (${member.user.id})`);
  console.log(`   Server: ${member.guild.name} (${member.guild.id})`);
  
  try {
    const autoLogEnabled = await autoLogSystem.isEnabled(member.guild.id);
    console.log(`   Auto Log enabled: ${autoLogEnabled}`);
    
    if (autoLogEnabled) {
      console.log('\n🤖 Calling Auto Log system for join...');
      await autoLogSystem.logJoinLeave(member, 'join');
      console.log('✅ Auto Log join event processed');
    } else {
      console.log('⚠️ Auto Log is disabled for this server');
    }
  } catch (error) {
    console.error('❌ Error handling join event:', error);
  }
});

// مراقبة أحداث خروج الأعضاء
client.on(Events.GuildMemberRemove, async (member) => {
  if (member.guild.id !== TARGET_GUILD_ID) return;
  
  console.log(`\n📤 LEAVE EVENT DETECTED:`);
  console.log(`   User: ${member.user.tag} (${member.user.id})`);
  console.log(`   Server: ${member.guild.name} (${member.guild.id})`);
  
  try {
    const autoLogEnabled = await autoLogSystem.isEnabled(member.guild.id);
    console.log(`   Auto Log enabled: ${autoLogEnabled}`);
    
    if (autoLogEnabled) {
      console.log('\n🤖 Calling Auto Log system for leave...');
      await autoLogSystem.logJoinLeave(member, 'leave');
      console.log('✅ Auto Log leave event processed');
    } else {
      console.log('⚠️ Auto Log is disabled for this server');
    }
  } catch (error) {
    console.error('❌ Error handling leave event:', error);
  }
});

// تسجيل الدخول
client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
  console.log('🚀 Join/Leave test bot started successfully...');
}).catch(error => {
  console.error('❌ Failed to start bot:', error);
});