const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');

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
    console.log('🔍 Starting role events test...');
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    
    // اختبار السيرفر الذي يحتوي على إعدادات تسجيل مفعلة
    const testGuildId = '1124131035349790880';
    const guild = client.guilds.cache.get(testGuildId);
    
    if (!guild) {
        console.log(`❌ Guild ${testGuildId} not found`);
        return;
    }
    
    console.log(`✅ Guild found: ${guild.name}`);
    
    // التحقق من صلاحيات البوت
    const botMember = guild.members.cache.get(client.user.id);
    if (!botMember) {
        console.log('❌ Bot member not found in guild');
        return;
    }
    
    const hasManageRoles = botMember.permissions.has(PermissionFlagsBits.ManageRoles);
    console.log(`🔐 Bot has Manage Roles permission: ${hasManageRoles}`);
    
    if (!hasManageRoles) {
        console.log('❌ Bot needs Manage Roles permission to test role events');
        return;
    }
    
    // إنشاء دور اختبار
    console.log('\n🧪 Creating test role...');
    
    try {
        const testRole = await guild.roles.create({
            name: 'Test-Role-' + Date.now(),
            color: '#ff0000',
            reason: 'Testing manual log system'
        });
        
        console.log(`✅ Test role created: ${testRole.name} (${testRole.id})`);
        
        // انتظار قليل للسماح للنظام بمعالجة الحدث
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // تعديل الدور
        console.log('\n🧪 Updating test role...');
        await testRole.edit({
            name: 'Updated-Test-Role-' + Date.now(),
            color: '#00ff00',
            reason: 'Testing role update logging'
        });
        
        console.log(`✅ Test role updated: ${testRole.name}`);
        
        // انتظار قليل
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // حذف الدور
        console.log('\n🧪 Deleting test role...');
        await testRole.delete('Testing role deletion logging');
        
        console.log(`✅ Test role deleted`);
        
        console.log('\n🏁 Role events test completed');
        console.log('📋 Check the log channel to see if the events were logged');
        
    } catch (error) {
        console.error('❌ Error during role testing:', error);
    }
});

// مراقبة أحداث الأدوار
client.on('roleCreate', (role) => {
    console.log(`📝 Role created event detected: ${role.name} in ${role.guild.name}`);
});

client.on('roleDelete', (role) => {
    console.log(`🗑️ Role deleted event detected: ${role.name} in ${role.guild.name}`);
});

client.on('roleUpdate', (oldRole, newRole) => {
    console.log(`✏️ Role updated event detected: ${oldRole.name} -> ${newRole.name} in ${newRole.guild.name}`);
});

// مراقبة أحداث تغيير أدوار الأعضاء
client.on('guildMemberUpdate', (oldMember, newMember) => {
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    
    const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
    const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
    
    if (addedRoles.size > 0 || removedRoles.size > 0) {
        console.log(`👤 Member role change detected: ${newMember.user.tag} in ${newMember.guild.name}`);
        if (addedRoles.size > 0) {
            console.log(`   ➕ Added roles: ${addedRoles.map(r => r.name).join(', ')}`);
        }
        if (removedRoles.size > 0) {
            console.log(`   ➖ Removed roles: ${removedRoles.map(r => r.name).join(', ')}`);
        }
    }
});

if (!process.env.DISCORD_BOT_TOKEN) {
    console.error('❌ Error: DISCORD_BOT_TOKEN not found in .env.local file');
    process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN);