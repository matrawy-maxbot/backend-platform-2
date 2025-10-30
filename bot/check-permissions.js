const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// إعداد البوت
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration
  ]
});

// قراءة إعدادات التسجيل
const settingsPath = path.join(__dirname, '../data/manual-log-settings.json');

async function checkBotPermissions() {
  try {
    console.log('🔍 جاري التحقق من أذونات البوت...');
    
    // قراءة إعدادات التسجيل
    const settingsData = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(settingsData);
    
    // التحقق من كل سيرفر في الإعدادات
    for (const serverId in settings) {
      const serverSettings = settings[serverId];
      console.log(`\n📊 فحص السيرفر: ${serverId}`);
      
      try {
        const guild = await client.guilds.fetch(serverId);
        console.log(`✅ تم العثور على السيرفر: ${guild.name}`);
        
        // التحقق من قناة الأعضاء (members) - التي تتضمن الميوت
        if (serverSettings.categories?.members?.enabled && serverSettings.categories.members.channelId) {
          const channelId = serverSettings.categories.members.channelId;
          console.log(`🔍 فحص قناة الأعضاء: ${channelId}`);
          
          try {
            const channel = await guild.channels.fetch(channelId);
            if (channel) {
              console.log(`✅ تم العثور على القناة: ${channel.name} (${channel.type})`);
              
              // التحقق من أذونات البوت
              const botMember = guild.members.me;
              const permissions = channel.permissionsFor(botMember);
              
              console.log(`📋 أذونات البوت في القناة ${channel.name}:`);
              console.log(`   - إرسال الرسائل: ${permissions.has('SendMessages') ? '✅' : '❌'}`);
              console.log(`   - إرسال الإمبد: ${permissions.has('EmbedLinks') ? '✅' : '❌'}`);
              console.log(`   - عرض القناة: ${permissions.has('ViewChannel') ? '✅' : '❌'}`);
              console.log(`   - قراءة تاريخ الرسائل: ${permissions.has('ReadMessageHistory') ? '✅' : '❌'}`);
              
              // التحقق من الأذونات المطلوبة
              const requiredPermissions = ['SendMessages', 'EmbedLinks', 'ViewChannel'];
              const missingPermissions = requiredPermissions.filter(perm => !permissions.has(perm));
              
              if (missingPermissions.length === 0) {
                console.log(`✅ جميع الأذونات المطلوبة متوفرة في القناة ${channel.name}`);
              } else {
                console.log(`❌ أذونات مفقودة في القناة ${channel.name}: ${missingPermissions.join(', ')}`);
              }
              
            } else {
              console.log(`❌ لم يتم العثور على القناة: ${channelId}`);
            }
          } catch (error) {
            console.log(`❌ خطأ في الوصول للقناة ${channelId}: ${error.message}`);
          }
        } else {
          console.log(`⚠️ قناة الأعضاء غير مفعلة أو غير محددة`);
        }
        
      } catch (error) {
        console.log(`❌ خطأ في الوصول للسيرفر ${serverId}: ${error.message}`);
      }
    }
    
    console.log('\n✅ انتهى فحص الأذونات');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ خطأ في فحص الأذونات:', error);
    process.exit(1);
  }
}

client.once('ready', () => {
  console.log(`🤖 البوت متصل: ${client.user.tag}`);
  checkBotPermissions();
});

// تسجيل الدخول
require('dotenv').config({ path: '../.env.local' });
const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  console.error('❌ خطأ: DISCORD_BOT_TOKEN غير موجود في ملف .env.local');
  process.exit(1);
}

client.login(token);