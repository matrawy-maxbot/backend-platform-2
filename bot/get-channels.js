require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TARGET_GUILD_ID = '423067123225722891';

client.once('ready', async () => {
    console.log(`✅ Bot connected as ${client.user.tag}`);
    
    try {
        const guild = client.guilds.cache.get(TARGET_GUILD_ID);
        if (!guild) {
            console.log('❌ Guild not found');
            return;
        }
        
        console.log(`\n🏰 Guild: ${guild.name}`);
        console.log(`📊 Total Channels: ${guild.channels.cache.size}`);
        console.log('\n📋 Channel List:');
        console.log('================');
        
        guild.channels.cache.forEach(channel => {
            const type = channel.type === 0 ? 'TEXT' : 
                        channel.type === 2 ? 'VOICE' : 
                        channel.type === 4 ? 'CATEGORY' : 
                        channel.type === 5 ? 'NEWS' : 
                        channel.type === 13 ? 'STAGE' : 
                        channel.type === 15 ? 'FORUM' : 'OTHER';
            
            console.log(`${type.padEnd(8)} | ${channel.id} | #${channel.name}`);
        });
        
        // Check for the specific channel ID we're trying to use
        const targetChannel = guild.channels.cache.get('1408396573739503679');
        if (targetChannel) {
            console.log(`\n✅ Target channel found: #${targetChannel.name}`);
        } else {
            console.log(`\n❌ Target channel (1408396573739503679) not found in this guild`);
            console.log('🔍 Suggesting alternative channels for logging:');
            
            const textChannels = guild.channels.cache.filter(ch => ch.type === 0);
            textChannels.forEach(channel => {
                console.log(`   - ${channel.id} | #${channel.name}`);
            });
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);