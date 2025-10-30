const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config({ path: '../.env.local' });

const ManualLogSystem = require('./features/logging/manual-log');

const TARGET_GUILD_ID = '423067123225722891';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});

const manualLogSystem = new ManualLogSystem(client);

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot connected as ${readyClient.user.tag}`);
  
  const guild = client.guilds.cache.get(TARGET_GUILD_ID);
  if (guild) {
    console.log(`🏠 Guild found: ${guild.name}`);
    console.log(`👥 Member count: ${guild.memberCount}`);
  } else {
    console.log(`❌ Guild not found: ${TARGET_GUILD_ID}`);
    return;
  }

  // Load and display manual log settings
  try {
    const settings = await manualLogSystem.loadServerSettings(TARGET_GUILD_ID);
    console.log('\n📋 Manual Log Settings:');
    console.log(`   Enabled: ${settings?.enabled}`);
    console.log(`   Main Channel ID: ${settings?.channelId}`);
    console.log(`   Members Category Enabled: ${settings?.categories?.members?.enabled}`);
    console.log(`   Members Channel ID: ${settings?.categories?.members?.channelId}`);
    
    const logChannelId = settings?.categories?.members?.channelId || settings?.channelId;
    if (logChannelId) {
      const channel = guild.channels.cache.get(logChannelId);
      console.log(`   Log Channel: ${channel ? `#${channel.name}` : 'Not found'}`);
    }
  } catch (error) {
    console.error('❌ Error loading settings:', error);
  }

  console.log('\n🔍 Monitoring nickname changes...');
  console.log('Please change a member\'s nickname to test the system.');
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  if (newMember.guild.id !== TARGET_GUILD_ID) return;

  console.log('\n🔔 GuildMemberUpdate event triggered!');
  console.log(`   User: ${newMember.user.tag}`);
  console.log(`   Guild: ${newMember.guild.name}`);

  // Check for nickname changes
  if (oldMember.nickname !== newMember.nickname) {
    console.log('\n📝 NICKNAME CHANGE DETECTED:');
    console.log(`   Old nickname: "${oldMember.nickname || 'None'}"`);
    console.log(`   New nickname: "${newMember.nickname || 'None'}"`);
    console.log(`   User: ${newMember.user.tag}`);
    console.log(`   Guild: ${newMember.guild.name}`);
    
    try {
      console.log('\n📤 Calling logMemberNicknameChange...');
      await manualLogSystem.logMemberNicknameChange(oldMember, newMember, null);
      console.log('✅ logMemberNicknameChange completed successfully');
    } catch (error) {
      console.error('❌ Error in logMemberNicknameChange:', error);
    }
  } else {
    console.log('ℹ️ No nickname change detected');
  }

  // Check for role changes
  const oldRoles = oldMember.roles.cache;
  const newRoles = newMember.roles.cache;
  const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
  const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

  if (addedRoles.size > 0 || removedRoles.size > 0) {
    console.log('\n🎭 ROLE CHANGE DETECTED:');
    console.log(`   Added roles: ${addedRoles.map(r => r.name).join(', ') || 'None'}`);
    console.log(`   Removed roles: ${removedRoles.map(r => r.name).join(', ') || 'None'}`);
  }

  // Check for avatar changes
  if (oldMember.avatar !== newMember.avatar) {
    console.log('\n🖼️ AVATAR CHANGE DETECTED:');
    console.log(`   Old avatar: ${oldMember.avatar || 'None'}`);
    console.log(`   New avatar: ${newMember.avatar || 'None'}`);
  }

  console.log('========================================');
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.on('warn', (warning) => {
  console.warn('⚠️ Discord client warning:', warning);
});

console.log('🚀 Starting nickname change test bot...');
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => console.log('✅ Bot login successful'))
  .catch((error) => {
    console.error('❌ Bot login failed:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down bot...');
  client.destroy();
  process.exit(0);
});