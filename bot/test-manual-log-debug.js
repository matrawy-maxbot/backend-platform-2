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
  
  // Test server ID from settings
  const testServerId = '423067123225722891';
  const testChannelId = '727083989361229876';
  
  console.log('\n🔍 Testing Manual Log System...');
  
  try {
    // Test 1: Check if manual log is enabled
    console.log('\n📋 Test 1: Checking if Manual Log is enabled...');
    const isEnabled = await manualLogSystem.isEnabled(testServerId);
    console.log(`Manual Log enabled for server ${testServerId}: ${isEnabled}`);
    
    // Test 2: Load server settings
    console.log('\n📋 Test 2: Loading server settings...');
    const settings = await manualLogSystem.loadServerSettings(testServerId);
    console.log('Server settings:', JSON.stringify(settings, null, 2));
    
    // Test 3: Check channel access
    console.log('\n📋 Test 3: Checking channel access...');
    const guild = client.guilds.cache.get(testServerId);
    if (guild) {
      console.log(`✅ Guild found: ${guild.name}`);
      
      const channel = guild.channels.cache.get(testChannelId);
      if (channel) {
        console.log(`✅ Channel found: ${channel.name} (${channel.type})`);
        console.log(`Channel is text-based: ${channel.isTextBased()}`);
        
        // Test permissions
        const botMember = guild.members.cache.get(client.user.id);
        if (botMember) {
          const permissions = channel.permissionsFor(botMember);
          console.log('Bot permissions in channel:');
          console.log(`- Send Messages: ${permissions.has('SendMessages')}`);
          console.log(`- Embed Links: ${permissions.has('EmbedLinks')}`);
          console.log(`- View Channel: ${permissions.has('ViewChannel')}`);
        }
        
        // Test 4: Send a test embed
        console.log('\n📋 Test 4: Sending test embed...');
        try {
          const testEmbed = new EmbedBuilder()
            .setTitle('🧪 Manual Log Test')
            .setDescription('This is a test embed to verify Manual Log functionality')
            .setColor(0x00ff00)
            .setTimestamp()
            .setFooter({ text: 'Manual Log System Test' });
          
          await channel.send({ embeds: [testEmbed] });
          console.log('✅ Test embed sent successfully!');
        } catch (embedError) {
          console.error('❌ Failed to send test embed:', embedError.message);
        }
        
      } else {
        console.log(`❌ Channel not found: ${testChannelId}`);
      }
    } else {
      console.log(`❌ Guild not found: ${testServerId}`);
    }
    
    // Test 5: Test message categories
    console.log('\n📋 Test 5: Testing message categories...');
    if (settings && settings.categories) {
      Object.entries(settings.categories).forEach(([category, config]) => {
        console.log(`${category}: enabled=${config.enabled}, channelId=${config.channelId}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
  
  console.log('\n🏁 Testing completed. Check the results above.');
  process.exit(0);
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);