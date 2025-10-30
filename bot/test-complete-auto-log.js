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
  console.log('✅ Complete Auto Log test bot started successfully');
  console.log(`✅ Bot logged in as ${readyClient.user.tag}`);
  console.log(`🔗 Connected to ${readyClient.guilds.cache.size} servers`);
  
  // البحث عن السيرفر المحدد
  const targetGuildId = '423067123225722891';
  const guild = readyClient.guilds.cache.get(targetGuildId);
  
  if (guild) {
    console.log(`🏠 Found guild: ${guild.name} (${guild.id})`);
    
    // التحقق من تفعيل Auto Log
    const isEnabled = await autoLogSystem.isEnabled(guild.id);
    console.log(`🤖 Auto Log enabled: ${isEnabled}`);
    
    if (isEnabled) {
      console.log('✅ Auto Log system is enabled and ready to monitor all events');
      console.log('\n🔍 Monitoring for:');
      console.log('   📝 Nickname changes');
      console.log('   👑 Role changes');
      console.log('   🖼️ Avatar changes');
      console.log('   🆕 Channel creation');
      console.log('   🗑️ Channel deletion');
      console.log('   💬 Message deletion');
      console.log('   ✏️ Message editing');
    } else {
      console.log('❌ Auto Log system is disabled for this guild');
    }
  } else {
    console.log(`❌ Guild not found: ${targetGuildId}`);
  }
});

// تتبع تحديثات الأعضاء (الكنية، الأدوار، الأفاتار)
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  console.log(`\n🔔 GuildMemberUpdate event detected!`);
  console.log(`   User: ${newMember.user.tag}`);
  console.log(`   Guild: ${newMember.guild.name}`);
  
  // فحص تغيير الكنية
  if (oldMember.nickname !== newMember.nickname) {
    console.log(`📝 NICKNAME CHANGE:`);
    console.log(`   Old: "${oldMember.nickname || 'None'}"`);
    console.log(`   New: "${newMember.nickname || 'None'}"`);
    
    try {
      await autoLogSystem.logMemberUpdate(oldMember, newMember);
      console.log('✅ Nickname change logged successfully');
    } catch (error) {
      console.error('❌ Error logging nickname change:', error);
    }
  }
  
  // فحص تغيير الأدوار
  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
  
  if (addedRoles.size > 0 || removedRoles.size > 0) {
    console.log(`👑 ROLE CHANGE:`);
    if (addedRoles.size > 0) {
      console.log(`   Added: ${addedRoles.map(r => r.name).join(', ')}`);
    }
    if (removedRoles.size > 0) {
      console.log(`   Removed: ${removedRoles.map(r => r.name).join(', ')}`);
    }
    
    try {
      await autoLogSystem.logMemberUpdate(oldMember, newMember);
      console.log('✅ Role change logged successfully');
    } catch (error) {
      console.error('❌ Error logging role change:', error);
    }
  }
  
  // فحص تغيير الأفاتار
  if (oldMember.avatar !== newMember.avatar) {
    console.log(`🖼️ AVATAR CHANGE:`);
    console.log(`   Old: ${oldMember.avatar || 'None'}`);
    console.log(`   New: ${newMember.avatar || 'None'}`);
    
    try {
      await autoLogSystem.logMemberUpdate(oldMember, newMember);
      console.log('✅ Avatar change logged successfully');
    } catch (error) {
      console.error('❌ Error logging avatar change:', error);
    }
  }
});

// تتبع إنشاء القنوات
client.on(Events.ChannelCreate, async (channel) => {
  console.log(`\n🆕 CHANNEL CREATE:`);
  console.log(`   Channel: ${channel.name} (${channel.id})`);
  console.log(`   Type: ${channel.type}`);
  console.log(`   Guild: ${channel.guild.name}`);
  
  try {
    await autoLogSystem.logServerChange(channel.guild, 'channelCreate', [
      { name: 'Channel Created', value: `${channel.toString()} (${channel.name})` }
    ]);
    console.log('✅ Channel creation logged successfully');
  } catch (error) {
    console.error('❌ Error logging channel creation:', error);
  }
});

// تتبع حذف القنوات
client.on(Events.ChannelDelete, async (channel) => {
  console.log(`\n🗑️ CHANNEL DELETE:`);
  console.log(`   Channel: ${channel.name} (${channel.id})`);
  console.log(`   Type: ${channel.type}`);
  console.log(`   Guild: ${channel.guild.name}`);
  
  try {
    await autoLogSystem.logServerChange(channel.guild, 'channelDelete', [
      { name: 'Channel Deleted', value: `\`${channel.name}\` (${channel.id})` }
    ]);
    console.log('✅ Channel deletion logged successfully');
  } catch (error) {
    console.error('❌ Error logging channel deletion:', error);
  }
});

// تتبع حذف الرسائل
client.on(Events.MessageDelete, async (message) => {
  if (!message.author || message.author.bot) return;
  
  console.log(`\n🗑️ MESSAGE DELETE:`);
  console.log(`   Author: ${message.author.tag}`);
  console.log(`   Channel: ${message.channel.name}`);
  console.log(`   Content: "${message.content}"`);
  
  try {
    await autoLogSystem.logMessageEvent(message, 'delete');
    console.log('✅ Message deletion logged successfully');
  } catch (error) {
    console.error('❌ Error logging message deletion:', error);
  }
});

// تتبع تعديل الرسائل
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  if (!newMessage.author || newMessage.author.bot || oldMessage.content === newMessage.content) return;
  
  console.log(`\n✏️ MESSAGE EDIT:`);
  console.log(`   Author: ${newMessage.author.tag}`);
  console.log(`   Channel: ${newMessage.channel.name}`);
  console.log(`   Old: "${oldMessage.content}"`);
  console.log(`   New: "${newMessage.content}"`);
  
  try {
    await autoLogSystem.logMessageEvent(newMessage, 'edit', null, oldMessage.content);
    console.log('✅ Message edit logged successfully');
  } catch (error) {
    console.error('❌ Error logging message edit:', error);
  }
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('🔐 Bot authentication successful');
  })
  .catch((error) => {
    console.error('❌ Bot authentication failed:', error);
    process.exit(1);
  });