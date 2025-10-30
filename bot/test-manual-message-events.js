require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const ManualLogSystem = require('./features/logging/manual-log');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const manualLogSystem = new ManualLogSystem();

client.once('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  
  const testServerId = '423067123225722891';
  const testChannelId = '727083989361229876';
  
  console.log('\n🔍 Testing Manual Log Message Events...');
  
  try {
    const guild = client.guilds.cache.get(testServerId);
    if (!guild) {
      console.log('❌ Guild not found');
      process.exit(1);
    }
    
    const channel = guild.channels.cache.get(testChannelId);
    if (!channel) {
      console.log('❌ Channel not found');
      process.exit(1);
    }
    
    console.log(`✅ Testing in guild: ${guild.name}`);
    console.log(`✅ Testing in channel: ${channel.name}`);
    
    // Test 1: Create a test message
    console.log('\n📋 Test 1: Creating test message...');
    const testMessage = await channel.send('This is a test message for Manual Log testing');
    console.log(`✅ Test message created: ${testMessage.id}`);
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Test message deletion logging
    console.log('\n📋 Test 2: Testing message deletion logging...');
    try {
      await manualLogSystem.logMessageChange(testMessage, 'delete', null);
      console.log('✅ Message deletion log sent successfully');
    } catch (error) {
      console.error('❌ Error sending message deletion log:', error.message);
    }
    
    // Test 3: Create another test message for edit test
    console.log('\n📋 Test 3: Creating another test message for edit test...');
    const editTestMessage = await channel.send('This message will be edited');
    console.log(`✅ Edit test message created: ${editTestMessage.id}`);
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 4: Test message edit logging
    console.log('\n📋 Test 4: Testing message edit logging...');
    try {
      await manualLogSystem.logMessageChange(editTestMessage, 'edit', null, 'This message has been edited');
      console.log('✅ Message edit log sent successfully');
    } catch (error) {
      console.error('❌ Error sending message edit log:', error.message);
    }
    
    // Clean up test messages
    console.log('\n🧹 Cleaning up test messages...');
    try {
      await testMessage.delete();
      await editTestMessage.delete();
      console.log('✅ Test messages cleaned up');
    } catch (error) {
      console.log('⚠️ Could not clean up test messages:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
  
  console.log('\n🏁 Message events testing completed.');
  process.exit(0);
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);