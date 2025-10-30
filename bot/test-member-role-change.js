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
    console.log('🔍 Starting member role change test...');
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
    
    // البحث عن عضو للاختبار (غير البوت)
    const testMember = guild.members.cache.find(member => 
        !member.user.bot && 
        member.id !== client.user.id
    );
    
    if (!testMember) {
        console.log('❌ No suitable test member found');
        console.log('📋 Available members:');
        guild.members.cache.forEach(member => {
            console.log(`   - ${member.user.tag} (Bot: ${member.user.bot})`);
        });
        return;
    }
    
    console.log(`👤 Test member: ${testMember.user.tag}`);
    
    // إنشاء دور اختبار
    console.log('\n🧪 Creating test role...');
    
    try {
        const testRole = await guild.roles.create({
            name: 'Test-Member-Role-' + Date.now(),
            color: 0x00ff00,
            reason: 'Testing member role change logging'
        });
        
        console.log(`✅ Test role created: ${testRole.name} (${testRole.id})`);
        
        // انتظار قليل للسماح للنظام بمعالجة الحدث
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // إضافة الدور للعضو
        console.log('\n🧪 Adding role to member...');
        await testMember.roles.add(testRole, 'Testing role addition logging');
        
        console.log(`✅ Role added to ${testMember.user.tag}`);
        
        // انتظار قليل
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // إزالة الدور من العضو
        console.log('\n🧪 Removing role from member...');
        await testMember.roles.remove(testRole, 'Testing role removal logging');
        
        console.log(`✅ Role removed from ${testMember.user.tag}`);
        
        // انتظار قليل
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // حذف الدور
        console.log('\n🧪 Deleting test role...');
        await testRole.delete('Cleaning up test role');
        
        console.log(`✅ Test role deleted`);
        
        console.log('\n🏁 Member role change test completed');
        console.log('📋 Check the log channel to see if the member role changes were logged');
        
    } catch (error) {
        console.error('❌ Error during member role testing:', error);
    }
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