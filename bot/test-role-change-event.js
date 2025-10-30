const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const ManualLogSystem = require('./features/logging/manual-log');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration
  ]
});

const manualLogSystem = new ManualLogSystem();

client.once('ready', async () => {
  console.log('✅ Bot connected as:', client.user.tag);
  console.log('🔍 Waiting for role change events...');
  console.log('💡 Try changing a role for any member in the server to test');
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  console.log('\n🔔 GuildMemberUpdate event triggered!');
  console.log(`👤 Member: ${newMember.user.tag} (${newMember.user.id})`);
  console.log(`🏰 Guild: ${newMember.guild.name} (${newMember.guild.id})`);
  
  // Check for role changes
  const oldRoles = oldMember.roles.cache;
  const newRoles = newMember.roles.cache;
  
  const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
  const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
  
  console.log(`🔄 Role changes detected:`);
  console.log(`  - Added roles: ${addedRoles.size} (${addedRoles.map(r => r.name).join(', ')})`);
  console.log(`  - Removed roles: ${removedRoles.size} (${removedRoles.map(r => r.name).join(', ')})`);
  
  if (addedRoles.size > 0 || removedRoles.size > 0) {
    console.log('📤 Calling manualLogSystem.logMemberRoleChange...');
    
    // Get executor from audit logs
    let executor = null;
    try {
      const auditLogs = await newMember.guild.fetchAuditLogs({
        type: 25, // MEMBER_ROLE_UPDATE
        limit: 1
      });
      
      const auditEntry = auditLogs.entries.first();
      if (auditEntry && auditEntry.target.id === newMember.user.id) {
        executor = auditEntry.executor;
        console.log(`👮 Executor found: ${executor.tag} (${executor.id})`);
      } else {
        console.log('👮 No executor found in audit logs');
      }
    } catch (error) {
      console.error('❌ Error fetching audit logs:', error.message);
    }
    
    // Call the manual log system
    await manualLogSystem.logMemberRoleChange(oldMember, newMember, executor);
  } else {
    console.log('ℹ️ No role changes detected, skipping log');
  }
});

client.on('error', (error) => {
  console.error('❌ Client error:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);