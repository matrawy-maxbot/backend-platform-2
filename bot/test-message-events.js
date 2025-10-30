const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config({ path: '../.env.local' });

const AutoLogSystem = require('./features/logging/auto-log');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const autoLogSystem = new AutoLogSystem(client);

client.once(Events.ClientReady, async (readyClient) => {
  console.log('✅ Message Events Test Bot started successfully');
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
      console.log('✅ Auto Log system is enabled and ready to monitor message events');
      console.log('\n🔍 Monitoring for:');
      console.log('   🗑️ Message deletion');
      console.log('   ✏️ Message editing');
      console.log('\n💡 Try deleting or editing a message in the server to test!');
    } else {
      console.log('❌ Auto Log system is disabled for this guild');
    }
  } else {
    console.log(`❌ Guild not found: ${targetGuildId}`);
  }
});

// تتبع حذف الرسائل
client.on(Events.MessageDelete, async (message) => {
  // تجاهل رسائل البوتات والرسائل الفارغة
  if (!message.author || message.author.bot) {
    console.log('🤖 Ignoring bot message deletion');
    return;
  }
  
  console.log(`\n🗑️ MESSAGE DELETE EVENT DETECTED:`);
  console.log(`   Author: ${message.author.tag} (${message.author.id})`);
  console.log(`   Channel: ${message.channel.name} (${message.channel.id})`);
  console.log(`   Guild: ${message.guild.name}`);
  console.log(`   Content: "${message.content || 'No content'}"`);
  console.log(`   Message ID: ${message.id}`);
  
  try {
    console.log('🔄 Calling autoLogSystem.logMessageEvent...');
    await autoLogSystem.logMessageEvent(message, 'delete');
    console.log('✅ Message deletion logged successfully');
  } catch (error) {
    console.error('❌ Error logging message deletion:', error);
  }
});

// تتبع تعديل الرسائل
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  // تجاهل رسائل البوتات والرسائل التي لم تتغير
  if (!newMessage.author || newMessage.author.bot) {
    console.log('🤖 Ignoring bot message edit');
    return;
  }
  
  if (oldMessage.content === newMessage.content) {
    console.log('📝 Message content unchanged, ignoring');
    return;
  }
  
  console.log(`\n✏️ MESSAGE EDIT EVENT DETECTED:`);
  console.log(`   Author: ${newMessage.author.tag} (${newMessage.author.id})`);
  console.log(`   Channel: ${newMessage.channel.name} (${newMessage.channel.id})`);
  console.log(`   Guild: ${newMessage.guild.name}`);
  console.log(`   Old Content: "${oldMessage.content || 'No content'}"`);
  console.log(`   New Content: "${newMessage.content || 'No content'}"`);
  console.log(`   Message ID: ${newMessage.id}`);
  
  try {
    console.log('🔄 Calling autoLogSystem.logMessageEvent...');
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