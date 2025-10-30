const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration
  ]
});

const TARGET_GUILD_ID = '1124131035349790880';
const TARGET_USER_ID = '1124131035349790880'; // استبدل بـ ID المستخدم المراد اختباره

client.once('ready', async () => {
  console.log('✅ Bot logged in successfully');
  
  try {
    const guild = client.guilds.cache.get(TARGET_GUILD_ID);
    if (!guild) {
      console.log('❌ Guild not found');
      return;
    }
    
    console.log(`✅ Guild found: ${guild.name}`);
    
    // البحث عن عضو للاختبار
    const member = guild.members.cache.get(TARGET_USER_ID) || guild.members.cache.find(m => !m.user.bot);
    if (!member) {
      console.log('❌ No suitable member found for testing');
      return;
    }
    
    console.log(`✅ Test member found: ${member.user.tag}`);
    
    // البحث عن رتبة للاختبار
    const testRole = guild.roles.cache.find(role => 
      role.name !== '@everyone' && 
      !role.managed && 
      role.position < guild.members.me.roles.highest.position
    );
    
    if (!testRole) {
      console.log('❌ No suitable role found for testing');
      return;
    }
    
    console.log(`✅ Test role found: ${testRole.name}`);
    
    // اختبار تعيين الرتبة
    console.log('\n🔄 Testing role assignment...');
    if (!member.roles.cache.has(testRole.id)) {
      await member.roles.add(testRole, 'Test role assignment');
      console.log('✅ Role assigned successfully');
      
      // انتظار قليل ثم إزالة الرتبة
      setTimeout(async () => {
        console.log('\n🔄 Testing role removal...');
        await member.roles.remove(testRole, 'Test role removal');
        console.log('✅ Role removed successfully');
        
        setTimeout(() => {
          console.log('\n✅ Role assignment/removal test completed');
          process.exit(0);
        }, 2000);
      }, 3000);
    } else {
      // إذا كان العضو يملك الرتبة، قم بإزالتها أولاً
      await member.roles.remove(testRole, 'Test role removal');
      console.log('✅ Role removed successfully');
      
      setTimeout(async () => {
        console.log('\n🔄 Testing role assignment...');
        await member.roles.add(testRole, 'Test role assignment');
        console.log('✅ Role assigned successfully');
        
        setTimeout(() => {
          console.log('\n✅ Role assignment/removal test completed');
          process.exit(0);
        }, 2000);
      }, 3000);
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    process.exit(1);
  }
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);