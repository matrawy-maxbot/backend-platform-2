require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration
    ]
});

const TARGET_GUILD_ID = '423067123225722891';
const TARGET_CHANNEL_ID = '1424729014785802242'; // 🌐server-logs

client.once('ready', async () => {
    console.log(`✅ Bot connected as ${client.user.tag}`);
    
    try {
        // Test 1: Check guild
        const guild = client.guilds.cache.get(TARGET_GUILD_ID);
        if (!guild) {
            console.log('❌ Guild not found');
            return;
        }
        console.log(`✅ Guild found: ${guild.name}`);
        
        // Test 2: Check channel
        const channel = guild.channels.cache.get(TARGET_CHANNEL_ID);
        if (!channel) {
            console.log('❌ Channel not found');
            return;
        }
        console.log(`✅ Channel found: ${channel.name}`);
        
        // Test 3: Check Manual Log settings
        const fs = require('fs');
        const settingsPath = './data/manual-log-settings.json';
        
        if (fs.existsSync(settingsPath)) {
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            const guildSettings = settings[TARGET_GUILD_ID];
            
            if (guildSettings) {
                console.log(`✅ Manual Log Settings Found:`);
                console.log(`   - Enabled: ${guildSettings.enabled}`);
                console.log(`   - Channel ID: ${guildSettings.channelId}`);
                console.log(`   - Members Category: ${guildSettings.categories.members.enabled}`);
                console.log(`   - Messages Category: ${guildSettings.categories.messages.enabled}`);
                console.log(`   - Roles Category: ${guildSettings.categories.roles.enabled}`);
            } else {
                console.log('❌ No settings found for this guild');
            }
        }
        
        // Test 4: Send test embed
        const testEmbed = new EmbedBuilder()
            .setTitle('🔧 Manual Log Test')
            .setDescription('هذا اختبار للتأكد من عمل نظام Manual Log بعد التفعيل')
            .setColor('#00ff00')
            .addFields(
                { name: 'الحالة', value: 'تم تفعيل النظام بنجاح', inline: true },
                { name: 'القناة', value: `<#${TARGET_CHANNEL_ID}>`, inline: true }
            )
            .setTimestamp();
            
        await channel.send({ embeds: [testEmbed] });
        console.log('✅ Test embed sent successfully!');
        
        console.log('\n🎯 Manual Log is now active and ready!');
        console.log('📝 Try changing a member\'s role to test the logging system.');
        
    } catch (error) {
        console.error('❌ Error during testing:', error);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);