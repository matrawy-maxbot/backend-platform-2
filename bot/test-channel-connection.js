const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

client.once('ready', async () => {
  console.log('✅ Bot connected as:', client.user.tag);
  
  const guildId = '1124131035349790880';
  const channelId = '1124131035349790883';
  
  console.log('🔍 Looking for guild:', guildId);
  const guild = client.guilds.cache.get(guildId);
  console.log('🏰 Guild found:', guild ? `${guild.name} (${guild.id})` : 'NOT FOUND');
  
  if (guild) {
    console.log('🔍 Looking for channel:', channelId);
    const channel = guild.channels.cache.get(channelId);
    console.log('📺 Channel found:', channel ? `${channel.name} (${channel.id})` : 'NOT FOUND');
    console.log('📺 Channel type:', channel ? channel.type : 'N/A');
    console.log('📺 Is text-based:', channel ? channel.isTextBased() : 'N/A');
    
    if (channel && channel.isTextBased()) {
      try {
        // Test simple message
        console.log('📤 Sending simple test message...');
        await channel.send('🧪 Simple test message from diagnostic script');
        console.log('✅ Simple message sent successfully!');
        
        // Test embed message
        console.log('📤 Sending embed test message...');
        const embed = new EmbedBuilder()
          .setTitle('🧪 Test Embed')
          .setDescription('This is a test embed from diagnostic script')
          .setColor(0x00ff00)
          .setTimestamp()
          .setFooter({ text: 'Test Footer' });
          
        await channel.send({ embeds: [embed] });
        console.log('✅ Embed message sent successfully!');
        
      } catch (error) {
        console.error('❌ Failed to send message:', error.message);
        console.error('❌ Full error:', error);
      }
    } else {
      console.log('❌ Channel not found or not text-based');
    }
    
    // List all channels in guild
    console.log('\n📋 All channels in guild:');
    guild.channels.cache.forEach(ch => {
      console.log(`  - ${ch.name} (${ch.id}) - Type: ${ch.type}`);
    });
    
  } else {
    console.log('❌ Guild not found');
    console.log('\n📋 Available guilds:');
    client.guilds.cache.forEach(g => {
      console.log(`  - ${g.name} (${g.id})`);
    });
  }
  
  setTimeout(() => {
    process.exit(0);
  }, 2000);
});

client.login(process.env.DISCORD_BOT_TOKEN);