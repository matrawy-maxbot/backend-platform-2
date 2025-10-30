require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
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
  
  console.log('\n🔍 Testing Manual Log Server Events...');
  
  try {
    const guild = client.guilds.cache.get(testServerId);
    if (!guild) {
      console.log('❌ Guild not found');
      process.exit(1);
    }
    
    console.log(`✅ Testing in guild: ${guild.name}`);
    
    // Create mock old and new guild objects for testing
    const oldGuild = {
      id: guild.id,
      name: 'Old Server Name',
      iconURL: () => 'https://example.com/old-icon.png'
    };
    
    const newGuild = {
      id: guild.id,
      name: guild.name,
      iconURL: () => guild.iconURL(),
      channels: guild.channels
    };
    
    // Test 1: Test server name change logging
    console.log('\n📋 Test 1: Testing server name change logging...');
    try {
      await manualLogSystem.logServerUpdate(oldGuild, newGuild, null);
      console.log('✅ Server name change log sent successfully');
    } catch (error) {
      console.error('❌ Error sending server name change log:', error.message);
    }
    
    // Test 2: Test server icon change logging
    console.log('\n📋 Test 2: Testing server icon change logging...');
    const oldGuildIcon = {
      id: guild.id,
      name: guild.name,
      iconURL: () => 'https://example.com/old-icon.png'
    };
    
    const newGuildIcon = {
      id: guild.id,
      name: guild.name,
      iconURL: () => guild.iconURL() || 'https://example.com/new-icon.png',
      channels: guild.channels
    };
    
    try {
      await manualLogSystem.logServerUpdate(oldGuildIcon, newGuildIcon, null);
      console.log('✅ Server icon change log sent successfully');
    } catch (error) {
      console.error('❌ Error sending server icon change log:', error.message);
    }
    
    // Test 3: Test both name and icon change
    console.log('\n📋 Test 3: Testing both name and icon change logging...');
    const oldGuildBoth = {
      id: guild.id,
      name: 'Old Server Name',
      iconURL: () => 'https://example.com/old-icon.png'
    };
    
    const newGuildBoth = {
      id: guild.id,
      name: 'New Server Name',
      iconURL: () => 'https://example.com/new-icon.png',
      channels: guild.channels
    };
    
    try {
      await manualLogSystem.logServerUpdate(oldGuildBoth, newGuildBoth, null);
      console.log('✅ Server name and icon change log sent successfully');
    } catch (error) {
      console.error('❌ Error sending server name and icon change log:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
  
  console.log('\n🏁 Server events testing completed.');
  process.exit(0);
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);