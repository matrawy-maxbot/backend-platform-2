const { Client, GatewayIntentBits, Collection } = require('discord.js');
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
    console.log('🔍 Starting role logging debug...');
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    
    const manualLogSystem = new ManualLogSystem(client);
    
    // اختبار السيرفر الذي يحتوي على إعدادات تسجيل مفعلة
    const testGuildId = '1124131035349790880';
    const guild = client.guilds.cache.get(testGuildId);
    
    if (!guild) {
        console.log(`❌ Guild ${testGuildId} not found`);
        return;
    }
    
    console.log(`✅ Guild found: ${guild.name}`);
    
    // تحميل إعدادات السيرفر
    console.log('\n📋 Loading server settings...');
    
    try {
        const fs = require('fs');
        const path = require('path');
        const settingsPath = path.join(__dirname, 'data', 'manual-log-settings.json');
        
        if (fs.existsSync(settingsPath)) {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            
            console.log(`📋 Settings for guild ${testGuildId}:`, JSON.stringify(settings[testGuildId], null, 2));
            
            if (settings[testGuildId] && settings[testGuildId].enabled) {
                console.log('✅ Logging is enabled for this guild');
                
                // فحص إعدادات فئة الأعضاء
                const membersCategory = settings[testGuildId].categories.members;
                if (membersCategory && membersCategory.enabled) {
                    console.log(`✅ Members logging enabled - Channel: ${membersCategory.channelId}`);
                    
                    // التحقق من وجود القناة
                    const logChannel = guild.channels.cache.get(membersCategory.channelId);
                    if (logChannel) {
                        console.log(`✅ Log channel exists: #${logChannel.name}`);
                        
                        // إنشاء أعضاء وهميين للاختبار
                        console.log('\n🧪 Creating mock members for testing...');
                        
                        // محاكاة عضو قديم وجديد
                        const mockOldMember = {
                            user: { tag: 'TestUser#1234', id: '123456789', displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png' },
                            guild: guild,
                            roles: {
                                cache: new Collection([
                                    ['role1', { id: 'role1', name: 'Member' }]
                                ])
                            }
                        };
                        
                        const mockNewMember = {
                            user: { tag: 'TestUser#1234', id: '123456789', displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png' },
                            guild: guild,
                            roles: {
                                cache: new Collection([
                                    ['role1', { id: 'role1', name: 'Member' }],
                                    ['role2', { id: 'role2', name: 'VIP' }]
                                ])
                            }
                        };
                        
                        console.log('📝 Testing logMemberRoleChange function...');
                        
                        // اختبار دالة logMemberRoleChange مباشرة
                        const result = await manualLogSystem.logMemberRoleChange(mockOldMember, mockNewMember, null);
                        console.log(`📊 logMemberRoleChange result:`, result);
                        
                        // اختبار إرسال رسالة مباشرة للقناة
                        console.log('\n🧪 Testing direct message send to log channel...');
                        
                        try {
                            await logChannel.send({
                                embeds: [{
                                    title: '🧪 Direct Test Message',
                                    description: 'Testing direct message send to log channel',
                                    color: 0x00ff00,
                                    timestamp: new Date(),
                                    footer: { text: 'Debug Test' }
                                }]
                            });
                            console.log('✅ Direct message sent successfully');
                        } catch (sendError) {
                            console.log(`❌ Failed to send direct message: ${sendError.message}`);
                        }
                        
                    } else {
                        console.log(`❌ Log channel not found: ${membersCategory.channelId}`);
                    }
                } else {
                    console.log('❌ Members logging is disabled');
                }
            } else {
                console.log('❌ Logging is disabled for this guild');
            }
        } else {
            console.log('❌ Settings file not found');
        }
        
    } catch (error) {
        console.error('❌ Error during testing:', error);
        console.error('Stack trace:', error.stack);
    }
    
    console.log('\n🏁 Role logging debug completed');
});

// مراقبة أحداث تغيير أدوار الأعضاء
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    
    const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
    const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
    
    if (addedRoles.size > 0 || removedRoles.size > 0) {
        console.log(`\n👤 REAL Member role change detected: ${newMember.user.tag} in ${newMember.guild.name}`);
        if (addedRoles.size > 0) {
            console.log(`   ➕ Added roles: ${addedRoles.map(r => r.name).join(', ')}`);
        }
        if (removedRoles.size > 0) {
            console.log(`   ➖ Removed roles: ${removedRoles.map(r => r.name).join(', ')}`);
        }
        
        // محاولة استدعاء دالة التسجيل مباشرة
        console.log('🔍 Calling manualLogSystem.logMemberRoleChange...');
        
        try {
            const manualLogSystem = new ManualLogSystem(client);
            const result = await manualLogSystem.logMemberRoleChange(oldMember, newMember, null);
            console.log(`📊 Manual log result: ${result}`);
        } catch (error) {
            console.error('❌ Error calling manual log:', error);
        }
    }
});

if (!process.env.DISCORD_BOT_TOKEN) {
    console.error('❌ Error: DISCORD_BOT_TOKEN not found in .env.local file');
    process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN);