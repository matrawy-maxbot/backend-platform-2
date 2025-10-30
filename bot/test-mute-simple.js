const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config({ path: '../.env.local' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Test Bot Ready! Logged in as ${readyClient.user.tag}`);
  console.log(`🔗 Connected to ${readyClient.guilds.cache.size} servers`);
  
  readyClient.guilds.cache.forEach(guild => {
    console.log(`  - ${guild.name} (ID: ${guild.id})`);
  });
});

// تتبع جميع أحداث GuildMemberUpdate
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  console.log('\n🔥 GuildMemberUpdate Event Detected!');
  console.log(`👤 User: ${newMember.user.tag} (${newMember.user.id})`);
  console.log(`🏠 Guild: ${newMember.guild.name} (${newMember.guild.id})`);
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  
  // فحص تغييرات Voice Mute
  if (oldMember.voice.serverMute !== newMember.voice.serverMute) {
    console.log(`🔇 Voice Mute Changed:`);
    console.log(`   Old: ${oldMember.voice.serverMute}`);
    console.log(`   New: ${newMember.voice.serverMute}`);
    console.log(`   Action: ${newMember.voice.serverMute ? 'MUTED' : 'UNMUTED'}`);
  }
  
  // فحص تغييرات Timeout
  if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
    console.log(`⏱️ Timeout Changed:`);
    console.log(`   Old: ${oldMember.communicationDisabledUntil}`);
    console.log(`   New: ${newMember.communicationDisabledUntil}`);
    
    if (newMember.communicationDisabledUntil) {
      console.log(`   Action: TIMEOUT APPLIED until ${newMember.communicationDisabledUntil}`);
    } else {
      console.log(`   Action: TIMEOUT REMOVED`);
    }
  }
  
  // فحص تغييرات الأدوار
  const oldRoles = oldMember.roles.cache.map(r => r.name).join(', ');
  const newRoles = newMember.roles.cache.map(r => r.name).join(', ');
  
  if (oldRoles !== newRoles) {
    console.log(`🎭 Roles Changed:`);
    console.log(`   Old: ${oldRoles || 'None'}`);
    console.log(`   New: ${newRoles || 'None'}`);
  }
  
  // فحص تغييرات الكنية
  if (oldMember.nickname !== newMember.nickname) {
    console.log(`📝 Nickname Changed:`);
    console.log(`   Old: ${oldMember.nickname || 'None'}`);
    console.log(`   New: ${newMember.nickname || 'None'}`);
  }
  
  console.log('─'.repeat(50));
});

// تتبع أحداث Voice State Update أيضاً
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
  if (oldState.serverMute !== newState.serverMute) {
    console.log('\n🎤 VoiceStateUpdate - Server Mute Changed!');
    console.log(`👤 User: ${newState.member.user.tag}`);
    console.log(`🏠 Guild: ${newState.guild.name}`);
    console.log(`🔇 Server Mute: ${oldState.serverMute} → ${newState.serverMute}`);
    console.log('─'.repeat(50));
  }
});

// تسجيل الدخول
if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('❌ DISCORD_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('🚀 Test bot started successfully...');
  })
  .catch((error) => {
    console.error('❌ Failed to login:', error);
    process.exit(1);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down test bot...');
  client.destroy();
  process.exit(0);
});