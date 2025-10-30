const { Client, GatewayIntentBits } = require('discord.js');
const ManualLogSystem = require('./features/logging/manual-log');

// Load environment variables
require('dotenv').config({ path: '../.env.local' });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', async () => {
    console.log('🔍 Starting manual log system debug...');
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    
    const manualLogSystem = new ManualLogSystem(client);
    
    // اختبار السيرفر الذي يحتوي على إعدادات تسجيل مفعلة
    const testGuildId = '1124131035349790880'; // السيرفر الذي رأيناه في الإعدادات
    const guild = client.guilds.cache.get(testGuildId);
    
    if (!guild) {
        console.log(`❌ Guild ${testGuildId} not found`);
        return;
    }
    
    console.log(`✅ Guild found: ${guild.name}`);
    
    // اختبار دالة logMemberRoleChange مباشرة
    console.log('\n🧪 Testing logMemberRoleChange function...');
    
    try {
        // إنشاء عضو وهمي للاختبار
        const testMember = guild.members.cache.first();
        if (!testMember) {
            console.log('❌ No members found in guild');
            return;
        }
        
        console.log(`📝 Testing with member: ${testMember.user.tag}`);
        
        // محاولة استدعاء دالة التسجيل مباشرة
        const result = await manualLogSystem.logMemberRoleChange(testMember, testMember, null);
        console.log(`📊 logMemberRoleChange result:`, result);
        
    } catch (error) {
        console.error('❌ Error testing logMemberRoleChange:', error);
        console.error('Stack trace:', error.stack);
    }
    
    // اختبار دالة logChannelChange مباشرة
    console.log('\n🧪 Testing logChannelChange function...');
    
    try {
        const testChannel = guild.channels.cache.first();
        if (!testChannel) {
            console.log('❌ No channels found in guild');
            return;
        }
        
        console.log(`📝 Testing with channel: ${testChannel.name}`);
        
        const result = await manualLogSystem.logChannelChange('create', testChannel, null);
        console.log(`📊 logChannelChange result:`, result);
        
    } catch (error) {
        console.error('❌ Error testing logChannelChange:', error);
        console.error('Stack trace:', error.stack);
    }
    
    // اختبار تحميل الإعدادات مباشرة
    console.log('\n🧪 Testing settings loading...');
    
    try {
        // الوصول إلى دالة تحميل الإعدادات الداخلية
        const ManualLogClass = require('./features/logging/manual-log');
        const testInstance = new ManualLogClass(client);
        
        // محاولة تحميل الإعدادات
        console.log('📂 Attempting to load settings...');
        
        // قراءة ملف الإعدادات مباشرة
        const fs = require('fs');
        const path = require('path');
        const settingsPath = path.join(__dirname, 'data', 'manual-log-settings.json');
        
        if (fs.existsSync(settingsPath)) {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            console.log(`📋 Settings for guild ${testGuildId}:`, JSON.stringify(settings[testGuildId], null, 2));
            
            if (settings[testGuildId] && settings[testGuildId].enabled) {
                console.log('✅ Logging is enabled for this guild');
                
                // فحص إعدادات الفئات
                const categories = settings[testGuildId].categories;
                for (const [categoryName, categorySettings] of Object.entries(categories)) {
                    if (categorySettings.enabled) {
                        console.log(`✅ ${categoryName} logging enabled - Channel: ${categorySettings.channelId}`);
                        
                        // التحقق من وجود القناة
                        const channel = guild.channels.cache.get(categorySettings.channelId);
                        if (channel) {
                            console.log(`   ✅ Channel exists: #${channel.name}`);
                            
                            // اختبار إرسال رسالة
                            try {
                                await channel.send({
                                    embeds: [{
                                        title: '🧪 Manual Log Test',
                                        description: `Testing ${categoryName} logging functionality`,
                                        color: 0x00ff00,
                                        timestamp: new Date(),
                                        footer: { text: 'Debug Test' }
                                    }]
                                });
                                console.log(`   ✅ Test message sent to ${categoryName} channel`);
                            } catch (sendError) {
                                console.log(`   ❌ Failed to send test message: ${sendError.message}`);
                            }
                        } else {
                            console.log(`   ❌ Channel not found: ${categorySettings.channelId}`);
                        }
                    } else {
                        console.log(`❌ ${categoryName} logging disabled`);
                    }
                }
            } else {
                console.log('❌ Logging is disabled for this guild');
            }
        } else {
            console.log('❌ Settings file not found');
        }
        
    } catch (error) {
        console.error('❌ Error testing settings:', error);
        console.error('Stack trace:', error.stack);
    }
    
    console.log('\n🏁 Manual log system debug completed');
});

if (!process.env.DISCORD_BOT_TOKEN) {
    console.error('❌ Error: DISCORD_BOT_TOKEN not found in .env.local file');
    process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN);