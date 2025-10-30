const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config({ path: '../.env.local' });

console.log('🔍 Testing Discord bot connection...');
console.log('Bot token exists:', !!process.env.DISCORD_BOT_TOKEN);
console.log('Bot token length:', process.env.DISCORD_BOT_TOKEN?.length || 0);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
  console.log(`🔗 Bot connected to ${readyClient.guilds.cache.size} servers`);
  
  console.log('📋 Connected servers:');
  readyClient.guilds.cache.forEach(guild => {
    console.log(`  - ${guild.name} (ID: ${guild.id}) - ${guild.memberCount} members`);
  });
  
  console.log('\n🔍 Bot user details:');
  console.log(`  ID: ${readyClient.user.id}`);
  console.log(`  Username: ${readyClient.user.username}`);
  console.log(`  Discriminator: ${readyClient.user.discriminator}`);
  console.log(`  Bot: ${readyClient.user.bot}`);
  console.log(`  Verified: ${readyClient.user.verified}`);
  
  // Test fetching guilds directly
  console.log('\n🧪 Testing direct guild fetch...');
  try {
    const guilds = await readyClient.guilds.fetch();
    console.log(`Direct fetch found ${guilds.size} guilds`);
    guilds.forEach(guild => {
      console.log(`  - ${guild.name} (ID: ${guild.id})`);
    });
  } catch (error) {
    console.error('❌ Direct guild fetch failed:', error);
  }
  
  process.exit(0);
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.on('warn', (warning) => {
  console.warn('⚠️ Discord client warning:', warning);
});

console.log('🚀 Attempting to login...');
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('✅ Login successful');
  })
  .catch((error) => {
    console.error('❌ Login failed:', error);
    process.exit(1);
  });

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Test timeout - exiting');
  process.exit(1);
}, 10000);