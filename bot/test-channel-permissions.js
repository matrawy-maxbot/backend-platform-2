const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load settings
function loadSettings() {
    try {
        const settingsPath = path.join(__dirname, 'data', 'manual-log-settings.json');
        const data = fs.readFileSync(settingsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error loading settings:', error);
        return {};
    }
}

client.once('ready', async () => {
    console.log('🔍 Starting channel permissions test...');
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    
    const settings = loadSettings();
    
    for (const [guildId, guildSettings] of Object.entries(settings)) {
        if (!guildSettings.enabled) continue;
        
        console.log(`\n🏠 Checking guild: ${guildId}`);
        
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.log(`❌ Guild not found or bot not in guild`);
            continue;
        }
        
        console.log(`✅ Guild found: ${guild.name}`);
        
        // Check each category's channel
        for (const [categoryName, categorySettings] of Object.entries(guildSettings.categories)) {
            if (!categorySettings.enabled || !categorySettings.channelId) continue;
            
            console.log(`\n📝 Checking ${categoryName} channel: ${categorySettings.channelId}`);
            
            const channel = guild.channels.cache.get(categorySettings.channelId);
            if (!channel) {
                console.log(`❌ Channel not found`);
                continue;
            }
            
            console.log(`✅ Channel found: #${channel.name}`);
            
            // Check permissions
            const botMember = guild.members.cache.get(client.user.id);
            if (!botMember) {
                console.log(`❌ Bot member not found in guild`);
                continue;
            }
            
            const permissions = channel.permissionsFor(botMember);
            const canSend = permissions.has(PermissionsBitField.Flags.SendMessages);
            const canEmbed = permissions.has(PermissionsBitField.Flags.EmbedLinks);
            const canView = permissions.has(PermissionsBitField.Flags.ViewChannel);
            
            console.log(`   📋 Permissions:`);
            console.log(`   - View Channel: ${canView ? '✅' : '❌'}`);
            console.log(`   - Send Messages: ${canSend ? '✅' : '❌'}`);
            console.log(`   - Embed Links: ${canEmbed ? '✅' : '❌'}`);
            
            if (canView && canSend && canEmbed) {
                console.log(`   🎉 All permissions OK for ${categoryName}`);
                
                // Try to send a test message
                try {
                    await channel.send({
                        embeds: [{
                            title: '🧪 Test Message',
                            description: `Testing logging permissions for ${categoryName}`,
                            color: 0x00ff00,
                            timestamp: new Date(),
                            footer: { text: 'Permission Test' }
                        }]
                    });
                    console.log(`   ✅ Test message sent successfully`);
                } catch (error) {
                    console.log(`   ❌ Failed to send test message: ${error.message}`);
                }
            } else {
                console.log(`   ❌ Missing permissions for ${categoryName}`);
            }
        }
    }
    
    console.log('\n🏁 Channel permissions test completed');
});

// Load environment variables
require('dotenv').config({ path: '../.env.local' });

if (!process.env.DISCORD_BOT_TOKEN) {
    console.error('❌ Error: DISCORD_BOT_TOKEN not found in .env.local file');
    process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN);