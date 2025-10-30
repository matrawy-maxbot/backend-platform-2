const { Client, GatewayIntentBits, Events } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config({ path: '../.env.local' });

// استيراد نظام قاعدة البيانات
const { 
  initializeDatabase, 
  getServerData, 
  saveServerData, 
  updateServerSection
} = require('./utils/database.js');

// استيراد نظام الرتبة التلقائية
const { assignAutoRole } = require('./features/auto-role/auto-role.js');

// استيراد نظام الرد التلقائي
const { processAutoReply } = require('./features/auto-reply/auto-reply.js');

// استيراد نظام الإعلانات
const AdsSystem = require('./features/ads/ads.js');

// استيراد نظام الحماية
const { processProtection, applyBotPunishment } = require('./features/protections/protections.js');

// استيراد أوامر الصور
const { handleImageCommands } = require('./features/images/image-commands.js');

// استيراد نظام التزامن المحسن
const SyncSystem = require('./utils/sync-system.js');

// استيراد نظام Manual Log
const ManualLogSystem = require('./features/logging/manual-log');
const AutoLogSystem = require('./features/logging/auto-log');

// استيراد Express server للـ API
const express = require('express');
const { router: settingsUpdateRouter, setBotInstance } = require('./api/settings-update.js');
const { router: manualLogRouter, setManualLogSystem } = require('./features/logging/manual-log-update.js');
const { router: backupRouter, setBotInstance: setBackupBotInstance } = require('./api/backup.js');
const { router: createChannelsRouter, setBotInstance: setCreateChannelsBotInstance } = require('./api/create-log-channels.js');

// Cache system for settings to improve performance
const settingsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// تهيئة نظام الإعلانات
let adsSystem = null;

// تهيئة نظام التزامن
let syncSystem = null;

// دالة للحصول على إعدادات السيرفر من API الموقع
async function getServerSettings(guildId) {
  const cacheKey = guildId;
  const cached = settingsCache.get(cacheKey);
  
  // Check if cache is valid
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`📦 Using cache for server ${guildId}`);
    return cached.data;
  }
  
  try {
    // محاولة الحصول على البيانات من API الموقع أولاً
    console.log(`🌐 Fetching settings from website API for server ${guildId}...`);
    const apiUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/server-settings/${guildId}`;
    console.log(`📡 API URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'x-bot-request': 'true',
        'User-Agent': 'Discord-Bot/1.0'
      }
    });
    
    console.log(`📊 API Response status: ${response.status}`);
    
    if (response.ok) {
      const settings = await response.json();
      console.log(`✅ Successfully fetched settings from website API for server ${guildId}:`, JSON.stringify(settings, null, 2));
      
      // Save to cache
      settingsCache.set(cacheKey, {
        data: settings,
        timestamp: Date.now()
      });
      
      return settings;
    } else {
      const errorText = await response.text();
      console.log(`⚠️ Failed to fetch from API (${response.status}): ${errorText}`);
      console.log(`🔄 Falling back to local database`);
    }
    
    // Fallback: محاولة الحصول على البيانات من قاعدة البيانات المحلية
    let settings = await getServerData(guildId);
    
    if (!settings) {
      // إذا لم توجد البيانات محلياً، إنشاء إعدادات افتراضية
      const defaultSettings = {
        autoReply: {
          enabled: true,
          smartReply: false,
          defaultCooldown: 30,
          maxResponsesPerHour: 10,
          replies: []
        },
        ads: {
          enabled: false,
          ads: []
        },
        members: {
          welcomeMessage: {
            enabled: true,
            message: 'Welcome {user} to {server}! 🎉',
            channel: ''
          },
          leaveMessage: {
            enabled: true,
            message: 'Goodbye {user}, hope to see you soon! 👋',
            channel: ''
          },
          autoRole: {
            enabled: false,
            roleId: ''
          }
        },
        protection: {
          spamProtection: true,
          raidProtection: false,
          autoModeration: true
        }
      };
      
      settings = await saveServerData(guildId, defaultSettings, 'bot');
      console.log(`✅ Created default settings for server ${guildId}`);
    }
    
    // Save to cache
    settingsCache.set(cacheKey, {
      data: settings,
      timestamp: Date.now()
    });
    
    return settings;
  } catch (error) {
    console.error(`❌ Error fetching settings for server ${guildId}:`, error.message);
    console.log(`🔄 Falling back to local database`);
    
    // في حالة الفشل، محاولة الحصول على البيانات من API
    try {
      console.log(`🔍 Fallback: Fetching server settings from API for ${guildId}...`);
      const fallbackApiUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/server-settings/${guildId}`;
      console.log(`📡 Fallback API URL: ${fallbackApiUrl}`);
      
      const response = await fetch(fallbackApiUrl, {
        headers: {
          'x-bot-request': 'true',
          'User-Agent': 'Discord-Bot/1.0'
        }
      });
      
      console.log(`📊 Fallback API Response status: ${response.status}`);
      
      if (response.ok) {
        const settings = await response.json();
        console.log(`✅ Fallback API success for server ${guildId}:`, JSON.stringify(settings, null, 2));
        
        // Save to cache
        settingsCache.set(cacheKey, {
          data: settings,
          timestamp: Date.now()
        });
        
        return settings;
      } else {
        const fallbackErrorText = await response.text();
        console.error(`❌ Fallback API Error (${response.status}): ${fallbackErrorText}`);
        return null;
      }
    } catch (apiError) {
      console.error(`❌ API fallback also failed for server ${guildId}:`, apiError.message);
      return null;
    }
  }
}

// Function to clear cache for specific server
function clearServerCache(guildId) {
  settingsCache.delete(guildId);
  console.log(`🗑️ Cache cleared for server ${guildId}`);
}

// Clear all cache
function clearAllCache() {
  settingsCache.clear();
  console.log(`🗑️ All cache cleared`);
}

// إنشاء client جديد للبوت
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildIntegrations
  ]
});

// إنشاء أنظمة التسجيل
const manualLogSystem = new ManualLogSystem(client);
const autoLogSystem = new AutoLogSystem(client);

// تتبع عمليات الطرد والحظر
const moderationActions = new Map(); // guildId -> { userId -> { kicks: number, bans: number, lastAction: timestamp } }

// تهيئة قاعدة البيانات عند بدء التشغيل
initializeDatabase().then(() => {
    console.log('✅ Database initialized successfully');
}).catch(error => {
    console.error('❌ Failed to initialize database:', error);
});

// When bot is ready
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
  console.log(`🔗 Bot connected to ${readyClient.guilds.cache.size} servers`);
  
  console.log('📋 Connected servers list:');
  if (readyClient.guilds.cache.size === 0) {
    console.log('⚠️ No servers found! This could mean:');
    console.log('  1. Bot is not invited to any servers');
    console.log('  2. Bot token is invalid or expired');
    console.log('  3. Bot lacks proper permissions');
    console.log('  4. Discord API connection issues');
    console.log('🔍 Bot user info:', {
      id: readyClient.user.id,
      username: readyClient.user.username,
      discriminator: readyClient.user.discriminator,
      verified: readyClient.user.verified,
      bot: readyClient.user.bot
    });
  } else {
    readyClient.guilds.cache.forEach(guild => {
      console.log(`  - ${guild.name} (ID: ${guild.id}) - ${guild.memberCount} members`);
    });
  }
  
  // تهيئة نظام الإعلانات
  console.log('🚀 Initializing Ads System...');
  adsSystem = new AdsSystem(readyClient);
  console.log('✅ Ads System initialized successfully');
  
  // Start auto cleanup for expired scheduled ads
  adsSystem.startAutoCleanup();
  
  // Test API connection on startup
  console.log('\n🧪 Testing API connection on startup...');
  try {
    const testSettings = await getServerSettings('423067123225722891');
    console.log('✅ API test successful! Settings retrieved:', JSON.stringify(testSettings, null, 2));
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
  
  // Set bot activity
  client.user.setActivity('Monitoring servers', { type: 'WATCHING' });
});

// When bot joins a new server
client.on(Events.GuildCreate, (guild) => {
  console.log(`✅ Bot joined new server: ${guild.name} (ID: ${guild.id})`);
  console.log(`👥 Member count: ${guild.memberCount}`);
  
  // Send welcome message in general channel
  const defaultChannel = guild.channels.cache.find(channel => 
    channel.type === 0 && // TEXT_CHANNEL
    channel.permissionsFor(guild.members.me).has('SendMessages')
  );
  
  if (defaultChannel) {
    defaultChannel.send({
      embeds: [{
        title: '🎉 Welcome!',
        description: 'Thank you for adding the bot to your server!\n\nYou can now use the dashboard to manage your server.',
        color: 0x5865F2,
        footer: {
          text: 'Discord Dashboard Bot'
        },
        timestamp: new Date().toISOString()
      }]
    }).catch(console.error);
  }
});

// When bot leaves a server
client.on(Events.GuildDelete, (guild) => {
  console.log(`❌ Bot removed from server: ${guild.name} (ID: ${guild.id})`);
  // Clear server settings from cache
  clearServerCache(guild.id);
});

// معالجة الأخطاء
client.on(Events.Error, (error) => {
  console.error('❌ Bot error:', error);
});

// معالجة انقطاء الاتصال
client.on(Events.Disconnect, () => {
  console.log('⚠️ Disconnected from Discord');
});

// إعادة الاتصال
client.on(Events.Reconnecting, () => {
  console.log('🔄 Reconnecting...');
});

// When a new member joins the server
client.on(Events.GuildMemberAdd, async (member) => {
  console.log(`👋 New member joined: ${member.user.tag} in server ${member.guild.name}`);
  console.log(`🔍 Server ID: ${member.guild.id}`);
  
  // التحقق من أولوية أنظمة التسجيل
  const manualLogEnabled = await manualLogSystem.isEnabled(member.guild.id);
  const autoLogEnabled = await autoLogSystem.isEnabled(member.guild.id);
  
  if (manualLogEnabled) {
    console.log('📝 Using Manual Log system for join (priority over Auto Log)');
    await manualLogSystem.logJoinLeave(member, 'join');
  } else if (autoLogEnabled) {
    console.log('🤖 Using Auto Log system for join');
    await autoLogSystem.logJoinLeave(member, 'join');
  } else {
    console.log('⚠️ No logging system enabled for this server');
  }
  
  try {
    // Fetch server settings using cache
    console.log(`🔍 Fetching server settings for member join event...`);
    const settings = await getServerSettings(member.guild.id);
    console.log(`📋 Full server settings for ${member.guild.name}:`, JSON.stringify(settings, null, 2));
    
    // حماية من البوتات
    if (member.user.bot && settings?.protection?.botManagement?.enabled && settings.protection.botManagement.disallowBots) {
      console.log(`🛡️ [Protection] منع البوت ${member.user.tag} من دخول السيرفر ${member.guild.name}`);
      try {
        const reason = 'Bot protection: Disallowed bots are not permitted';
        
        // تطبيق العقوبة حسب إعدادات الإشراف
        if (settings?.protection?.moderation?.enabled) {
          console.log(`🛡️ [Protection] تطبيق عقوبة الإشراف على البوت ${member.user.tag}`);
          const punishmentResult = await applyBotPunishment(member, settings.protection.moderation, reason);
          console.log(`📋 [Protection] نتيجة العقوبة:`, punishmentResult);
        } else {
          // إذا لم تكن إعدادات الإشراف مفعلة، اطرد البوت فقط
          await member.kick(reason);
          console.log(`✅ [Protection] تم طرد البوت ${member.user.tag} بنجاح`);
        }
        
        return; // إنهاء المعالجة هنا
      } catch (kickError) {
        console.error(`❌ [Protection] فشل في معالجة البوت ${member.user.tag}:`, kickError);
      }
    }
    
    if (settings) {
      console.log(`⚙️ Server settings:`, JSON.stringify(settings.members?.welcomeMessage, null, 2));
      const welcomeSettings = settings.members?.welcomeMessage;
      
      if (welcomeSettings?.enabled) {
        let targetChannel = null;
        
        // Search for the specified channel first
        if (welcomeSettings.channel) {
          console.log(`🔍 Searching for specified channel: ${welcomeSettings.channel}`);
          targetChannel = member.guild.channels.cache.get(welcomeSettings.channel);
          
          if (targetChannel && targetChannel.isTextBased()) {
            console.log(`✅ Found specified channel: ${targetChannel.name}`);
          } else {
            console.log(`❌ Specified channel not found or not a text channel: ${welcomeSettings.channel}`);
            targetChannel = null;
          }
        }
        
        // If no specified channel or invalid, search for appropriate channel
        if (!targetChannel) {
          console.log(`🔍 Searching for appropriate channel...`);
          
          // Priority order: welcome > general > chat > any text channel
          const channelPriorities = [
            ['welcome', 'welcomes', 'ترحيب'],
            ['general', 'عام'],
            ['chat', 'main', 'lobby'],
            ['announcements', 'news']
          ];
          
          for (const priority of channelPriorities) {
            targetChannel = member.guild.channels.cache.find(channel => 
              channel.isTextBased() && 
              channel.permissionsFor(member.guild.members.me)?.has('SendMessages') &&
              priority.some(name => channel.name.toLowerCase().includes(name.toLowerCase()))
            );
            
            if (targetChannel) {
              console.log(`✅ Found ${priority[0]} channel: ${targetChannel.name}`);
              break;
            }
          }
          
          // If still no channel found, use first available text channel
          if (!targetChannel) {
            targetChannel = member.guild.channels.cache.find(channel => 
              channel.isTextBased() && 
              channel.permissionsFor(member.guild.members.me)?.has('SendMessages')
            );
            
            if (targetChannel) {
              console.log(`✅ Using first available text channel: ${targetChannel.name}`);
            }
          }
        }
        
        if (targetChannel) {
          // Replace placeholders in message
          let message = welcomeSettings.message || 'Welcome {user}! Welcome to {server}';
          message = message.replace('{user}', `<@${member.user.id}>`);
          message = message.replace('{server}', member.guild.name);
          message = message.replace('{memberCount}', member.guild.memberCount.toString());
          
          console.log(`📤 Sending welcome message to ${targetChannel.name}: ${message}`);
          
          try {
            await targetChannel.send({
              embeds: [{
                title: '🎉 New Member!',
                description: message,
                color: 0x00ff00,
                thumbnail: {
                  url: member.user.displayAvatarURL()
                },
                footer: {
                  text: `Member #${member.guild.memberCount}`
                },
                timestamp: new Date().toISOString()
              }]
            });
            
            console.log(`✅ Welcome message sent successfully to ${member.user.tag} in ${member.guild.name} (#${targetChannel.name})`);
            
            // Auto-save working channel if none was specified
            if (!welcomeSettings.channel) {
              console.log(`💾 Auto-detected working channel: ${targetChannel.name} (${targetChannel.id})`);
            }
            
            // تعيين الرتبة التلقائية
            // Auto Role Assignment
            await assignAutoRole(member, settings);
            
          } catch (error) {
            console.error(`❌ Failed to send welcome message to ${member.user.tag} in ${member.guild.name}:`, error.message);
            console.error(`   Channel: ${targetChannel.name} (${targetChannel.id})`);
            console.error(`   Permissions: Send Messages = ${targetChannel.permissionsFor(member.guild.members.me)?.has('SendMessages')}`);
          }
        } else {
          console.log(`❌ No available text channel to send welcome message in server ${member.guild.name}`);
          console.log(`   Available channels: ${member.guild.channels.cache.filter(ch => ch.isTextBased()).map(ch => ch.name).join(', ')}`);
        }
      } else {
        console.log(`⚠️ Welcome messages disabled in server ${member.guild.name}`);
        
        // تحقق من تعيين الرتبة التلقائية حتى لو كانت رسائل الترحيب معطلة
        // Check for auto role assignment even if welcome messages are disabled
        await assignAutoRole(member, settings);
      }
    } else {
      console.log(`❌ Failed to fetch server settings`);
    }
  } catch (error) {
    console.error('❌ Error sending welcome message:', error);
  }
});

// When a member leaves the server
client.on(Events.GuildMemberRemove, async (member) => {
  console.log(`👋 Member left: ${member.user.tag} from server ${member.guild.name}`);
  
  // التحقق من أولوية أنظمة التسجيل
  const manualLogEnabled = await manualLogSystem.isEnabled(member.guild.id);
  const autoLogEnabled = await autoLogSystem.isEnabled(member.guild.id);
  
  if (manualLogEnabled) {
    console.log('📝 Using Manual Log system for leave (priority over Auto Log)');
    await manualLogSystem.logJoinLeave(member, 'leave');
  } else if (autoLogEnabled) {
    console.log('🤖 Using Auto Log system for leave');
    await autoLogSystem.logJoinLeave(member, 'leave');
  } else {
    console.log('⚠️ No logging system enabled for this server');
  }
  
  try {
    // Fetch leave settings using cache
    console.log(`🔍 Fetching server settings for member leave event...`);
    const settings = await getServerSettings(member.guild.id);
    
    if (settings) {
      console.log(`⚙️ Leave settings:`, JSON.stringify(settings.members?.leaveMessage, null, 2));
      const leaveSettings = settings.members?.leaveMessage;
      
      if (leaveSettings?.enabled) {
        console.log(`✅ Leave messages enabled for server ${member.guild.name}`);
        let channel = null;
        
        let targetChannel = null;
        
        // Search for the specified channel first
        if (leaveSettings.channel) {
          console.log(`🔍 Searching for specified leave channel: ${leaveSettings.channel}`);
          targetChannel = member.guild.channels.cache.get(leaveSettings.channel);
          
          if (targetChannel && targetChannel.isTextBased()) {
            console.log(`✅ Found specified leave channel: ${targetChannel.name}`);
          } else {
            console.log(`❌ Specified leave channel not found or not a text channel: ${leaveSettings.channel}`);
            targetChannel = null;
          }
        }
        
        // If no specified channel or invalid, search for appropriate channel
        if (!targetChannel) {
          console.log(`🔍 Searching for appropriate channel for leave message...`);
          
          // Priority order: welcome > general > chat > any text channel
          const channelPriorities = [
            ['welcome', 'welcomes', 'ترحيب'],
            ['general', 'عام'],
            ['chat', 'main', 'lobby'],
            ['announcements', 'news']
          ];
          
          for (const priority of channelPriorities) {
            targetChannel = member.guild.channels.cache.find(channel => 
              channel.isTextBased() && 
              channel.permissionsFor(member.guild.members.me)?.has('SendMessages') &&
              priority.some(name => channel.name.toLowerCase().includes(name.toLowerCase()))
            );
            
            if (targetChannel) {
              console.log(`✅ Found ${priority[0]} channel for leave message: ${targetChannel.name}`);
              break;
            }
          }
          
          // If still no channel found, use first available text channel
          if (!targetChannel) {
            targetChannel = member.guild.channels.cache.find(channel => 
              channel.isTextBased() && 
              channel.permissionsFor(member.guild.members.me)?.has('SendMessages')
            );
            
            if (targetChannel) {
              console.log(`✅ Using first available text channel for leave message: ${targetChannel.name}`);
            }
          }
        }
        
        if (targetChannel && targetChannel.isTextBased()) {
          // Replace placeholders in message
          let message = leaveSettings.message || 'Goodbye {user}, hope to see you soon!';
          message = message.replace('{user}', member.user.tag);
          message = message.replace('{server}', member.guild.name);
          message = message.replace('{memberCount}', member.guild.memberCount.toString());
          
          console.log(`📤 Sending leave message to ${targetChannel.name}: ${message}`);
          
          try {
            await targetChannel.send({
              embeds: [{
                title: '👋 Member Left',
                description: message,
                color: 0xff6b6b,
                thumbnail: {
                  url: member.user.displayAvatarURL()
                },
                footer: {
                  text: `Members remaining: ${member.guild.memberCount}`
                },
                timestamp: new Date().toISOString()
              }]
            });
            
            console.log(`✅ Leave message sent successfully for ${member.user.tag} in ${member.guild.name} (#${targetChannel.name})`);
            
            // Auto-save working channel if none was specified
            if (!leaveSettings.channel) {
              console.log(`💾 Auto-detected working channel for leave messages: ${targetChannel.name} (${targetChannel.id})`);
            }
            
          } catch (error) {
            console.error(`❌ Failed to send leave message for ${member.user.tag} in ${member.guild.name}:`, error.message);
            console.error(`   Channel: ${targetChannel.name} (${targetChannel.id})`);
            console.error(`   Permissions: Send Messages = ${targetChannel.permissionsFor(member.guild.members.me)?.has('SendMessages')}`);
          }
        } else {
          console.log(`❌ No available text channel to send leave message in server ${member.guild.name}`);
          console.log(`   Available channels: ${member.guild.channels.cache.filter(ch => ch.isTextBased()).map(ch => ch.name).join(', ')}`);
        }
      } else {
        console.log(`⚠️ Leave messages not enabled for server ${member.guild.name}`);
        console.log(`📊 Settings status: enabled=${leaveSettings?.enabled}, channel=${leaveSettings?.channel}`);
      }
    }
  } catch (error) {
    console.error('❌ Error sending leave message:', error);
  }
});

// Message handling (for auto-reply and protection)
client.on(Events.MessageCreate, async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;
  
  console.log(`📨 [MESSAGE] Received message from ${message.author.tag} in ${message.guild?.name || 'DM'}: "${message.content}"`);
  
  let settings = null;
  try {
    console.log(`🔍 Fetching server settings for message processing...`);
    settings = await getServerSettings(message.guild.id);
    console.log(`📋 Message processing settings:`, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('❌ Error fetching server settings:', error);
    settings = null;
  }
  
  // Only proceed with settings-dependent features if settings were successfully retrieved
  if (settings) {
    try {
      // تطبيق نظام الحماية الجديد
      if (settings.protection) {
        console.log(`🛡️ [Protection] Processing protection for message from ${message.author.tag}`);
        const protectionResult = await processProtection(message, settings);
        
        if (!protectionResult.success) {
          console.log(`🛡️ [Protection] Message blocked: ${protectionResult.reason}`);
          return; // إيقاف معالجة الرسالة إذا تم حظرها
        }
      }
      
      // النظام القديم للكلمات المحظورة (للتوافق مع الإعدادات القديمة)
      if (settings.automod_enabled) {
        // Check banned words
        const bannedWords = settings.banned_words || [];
        const messageContent = message.content.toLowerCase();
        
        for (const word of bannedWords) {
          if (messageContent.includes(word.toLowerCase())) {
            await message.delete();
            console.log(`🚫 Deleted message containing banned word from ${message.author.tag}`);
            
            // Send warning to member
            const warningEmbed = {
              title: '⚠️ Warning',
              description: 'Your message was deleted for containing inappropriate content.',
              color: 0xFF0000,
              footer: {
                text: 'Discord Dashboard Bot'
              }
            };
            
            await message.channel.send({ embeds: [warningEmbed] });
            break;
          }
        }
      }
    } catch (error) {
      console.error('❌ Error processing message with settings:', error);
    }
  }
  
  // Clear cache command
  if (message.content === '!clear-cache') {
    clearAllCache();
    await message.reply('✅ Cache cleared! Bot will fetch fresh settings from website.');
    return;
  }
  
  // Test welcome message command for specific server
  if (message.content.startsWith('!test-welcome')) {
    const args = message.content.split(' ');
    const serverId = args[1] || message.guild.id; // Use specified server ID or current server
    
    console.log(`🧪 Testing welcome message for server: ${serverId}...`);
    
    // Check if server exists in connected servers list
    const targetGuild = client.guilds.cache.get(serverId);
    if (!targetGuild) {
      await message.reply(`❌ Server ${serverId} not found or bot not connected to it`);
      return;
    }
    // Simulate new member join event
    const fakeEvent = {
      user: message.author,
      guild: targetGuild
    };
    
    // Call same code used in GuildMemberAdd
    try {
      console.log(`🔍 Fetching server settings for test welcome in ${fakeEvent.guild.id}...`);
      const testApiUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/server-settings/${fakeEvent.guild.id}`;
      console.log(`📡 Test API URL: ${testApiUrl}`);
      
      const response = await fetch(testApiUrl, {
        headers: {
          'x-bot-request': 'true',
          'User-Agent': 'Discord-Bot/1.0'
        }
      });
      
      console.log(`📊 Test API Response status: ${response.status}`);
      
      if (response.ok) {
        const settings = await response.json();
        console.log(`⚙️ Server settings:`, JSON.stringify(settings.members?.welcomeMessage, null, 2));
        const welcomeSettings = settings.members?.welcomeMessage;
        
        if (welcomeSettings?.enabled && welcomeSettings.channel) {
          console.log(`🔍 Searching for channel: ${welcomeSettings.channel}`);
          const channel = fakeEvent.guild.channels.cache.get(welcomeSettings.channel);
          
          if (channel && channel.isTextBased()) {
            console.log(`✅ Found channel: ${channel.name}`);
            
            let testMessage = welcomeSettings.message || 'Welcome {user}! Welcome to {server}';
            testMessage = testMessage.replace('{user}', `<@${fakeEvent.user.id}>`);
            testMessage = testMessage.replace('{server}', fakeEvent.guild.name);
            testMessage = testMessage.replace('{memberCount}', fakeEvent.guild.memberCount.toString());
            
            await channel.send({
              embeds: [{
                title: '🧪 Welcome Message Test',
                description: testMessage,
                color: 0x00ff00,
                thumbnail: {
                  url: fakeEvent.user.displayAvatarURL()
                },
                footer: {
                  text: `Test - Member #${fakeEvent.guild.memberCount}`
                },
                timestamp: new Date().toISOString()
              }]
            });
            
            console.log(`✅ Test welcome message sent`);
            await message.reply('✅ Test welcome message sent!');
          } else {
            console.log(`❌ Channel not found or not a text channel: ${welcomeSettings.channel}`);
            await message.reply(`❌ Channel not found or not a text channel: ${welcomeSettings.channel}`);
          }
        } else {
          console.log(`⚠️ Welcome messages disabled or no channel specified. enabled: ${welcomeSettings?.enabled}, channel: ${welcomeSettings?.channel}`);
          await message.reply(`⚠️ Welcome messages disabled or no channel specified`);
        }
      } else {
        console.log(`❌ Failed to fetch server settings: ${response.status}`);
        await message.reply(`❌ Failed to fetch server settings: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error testing welcome message:', error);
      await message.reply('❌ Error occurred while testing welcome message');
    }
    return;
   }
   
   // Command to display available servers list
   if (message.content === '!servers') {
     console.log('📋 Displaying servers list...');
     
     let serverList = '**📋 Connected Servers List:**\n';
     client.guilds.cache.forEach(guild => {
       serverList += `• **${guild.name}** - ID: \`${guild.id}\` - ${guild.memberCount} members\n`;
     });
     
     serverList += '\n**💡 To test welcome:** \`!test-welcome [SERVER_ID]\`';
     
     await message.reply(serverList);
     return;
   }
   
   // Command to list channels for debugging
  if (message.content === '!channels' && message.guild.id === '486630940542763009') {
    const channels = message.guild.channels.cache
      .filter(channel => channel.isTextBased())
      .map(channel => `${channel.name} (ID: ${channel.id})`)
      .join('\n');
    
    message.reply(`📋 Text Channels in ${message.guild.name}:\n\`\`\`\n${channels}\n\`\`\``);
    return;
  }
  
  // Command to clear cache and reload settings
  if (message.content === '!reload' && message.member?.permissions.has('Administrator')) {
    clearServerCache(message.guild.id);
    message.reply('🔄 Server settings cache cleared! New settings will be loaded on next event.');
    return;
  }
  
  // Command to test auto role assignment
  if (message.content.startsWith('!test-autorole')) {
    console.log(`🧪 Testing auto role assignment for server: ${message.guild.name}...`);
    
    try {
      // Get server settings
      console.log(`🔍 Fetching server settings for auto role test...`);
      const settings = await getServerSettings(message.guild.id);
      console.log(`📋 Auto role settings for ${message.guild.name}:`, JSON.stringify(settings.members?.autoRole, null, 2));
      
      if (settings && settings.members?.autoRole?.enabled) {
        // Simulate auto role assignment for the message author
        await assignAutoRole(message.member, settings);
        await message.reply('✅ Auto role test completed! Check console for details.');
      } else {
        await message.reply('❌ Auto role is disabled or not configured for this server.');
      }
    } catch (error) {
      console.error('❌ Error testing auto role:', error);
      await message.reply('❌ Error occurred during auto role test. Check console for details.');
    }
    return;
  }
  
  // Command to test auto reply system
  if (message.content.startsWith('!test-autoreply')) {
    console.log(`🧪 Testing auto reply system for server: ${message.guild.name}...`);
    
    try {
      // Get server settings
      console.log(`🔍 Fetching server settings for auto reply test...`);
      const settings = await getServerSettings(message.guild.id);
      console.log(`📋 Auto reply settings for ${message.guild.name}:`, JSON.stringify(settings.autoReply, null, 2));
      
      if (settings && settings.autoReply?.enabled && settings.autoReply.replies?.length > 0) {
        await message.reply('✅ Auto reply system is configured and enabled! Try sending a message with configured triggers.');
        
        // عرض المحفزات المتاحة
        const triggers = settings.autoReply.replies
          .filter(reply => reply.enabled)
          .map(reply => reply.triggers)
          .flat()
          .slice(0, 5); // أول 5 محفزات
        
        if (triggers.length > 0) {
          await message.reply(`💡 Available triggers: ${triggers.map(t => `\`${t}\``).join(', ')}`);
        }
      } else {
        await message.reply('❌ Auto reply is disabled or not configured for this server.');
      }
    } catch (error) {
      console.error('❌ Error testing auto reply:', error);
      await message.reply('❌ Error occurred during auto reply test. Check console for details.');
    }
    return;
  }
   
  // معالجة أوامر الصور
  // Process image commands
  if (message.content.startsWith('!images') || message.content.startsWith('!صور')) {
    try {
      const args = message.content.split(' ').slice(1);
      await handleImageCommands(message, args);
      return; // إيقاف معالجة الرسالة بعد معالجة أمر الصورة
    } catch (error) {
      console.error('❌ [BOT] Error in image command processing:', error);
      await message.reply('❌ حدث خطأ أثناء معالجة أمر الصور.');
    }
  }

  // معالجة الرد التلقائي المتقدم
  // Process advanced auto reply
  if (settings) {
    try {
      const autoReplyResult = await processAutoReply(message, settings);
      if (autoReplyResult.success) {
        console.log(`✅ [BOT] Auto reply sent: ${autoReplyResult.replyName}`);
        return; // إيقاف معالجة الرسالة بعد إرسال الرد
      }
    } catch (error) {
      console.error('❌ [BOT] Error in auto reply processing:', error);
    }
  } else {
    console.log(`⚠️ [AUTO-REPLY] Skipping auto reply - no settings available for server ${message.guild.name}`);
  }
});

// Error handling
client.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

client.on('warn', (warning) => {
  console.log('⚠️ Warning:', warning);
});

// تتبع عمليات الحظر
client.on(Events.GuildBanAdd, async (ban) => {
  console.log(`🔨 ${ban.user.tag} was banned from ${ban.guild.name}`);
  
  try {
    // التحقق من سجل التدقيق لمعرفة من قام بالحظر
    const auditLogs = await ban.guild.fetchAuditLogs({
      type: 22, // MEMBER_BAN_ADD
      limit: 1
    });
    
    const banLog = auditLogs.entries.first();
    if (banLog && banLog.target.id === ban.user.id && Date.now() - banLog.createdTimestamp < 5000) {
      const executor = banLog.executor;
      console.log(`🔨 ${ban.user.tag} was banned by ${executor.tag}`);
      
      // تطبيق نظام العقوبات على المستخدم الذي قام بالحظر
      await handleModerationAction(ban.guild, executor, 'ban');
      
      // التحقق من أي نظام تسجيل مفعل - إعطاء الأولوية للـ Manual Log
      const manualLogEnabled = await manualLogSystem.isEnabled(ban.guild.id);
      const autoLogEnabled = await autoLogSystem.isEnabled(ban.guild.id);
      
      if (manualLogEnabled) {
        console.log('📝 Using Manual Log system for ban');
        await manualLogSystem.logKickBan(ban.user, 'ban', executor, banLog.reason);
      } else if (autoLogEnabled) {
        console.log('🤖 Using Auto Log system for ban');
        await autoLogSystem.logKickBan(ban.user, 'ban', executor, banLog.reason, ban.guild);
      } else {
        console.log('⚠️ No logging system enabled for ban');
      }
    }
    
  } catch (error) {
    console.error('❌ Error handling ban add:', error);
  }
});

// إضافة event listener للكيك
client.on(Events.GuildAuditLogEntryCreate, async (auditLogEntry, guild) => {
  try {
    // التحقق من نوع الحدث
    if (auditLogEntry.action === 20) { // MEMBER_KICK
      const target = auditLogEntry.target;
      const executor = auditLogEntry.executor;
      const reason = auditLogEntry.reason;
      
      console.log(`👢 ${target.tag} was kicked from ${guild.name} by ${executor.tag}`);
      
      // تطبيق نظام العقوبات على المستخدم الذي قام بالكيك
      await handleModerationAction(guild, executor, 'kick');
      
      // التحقق من أي نظام تسجيل مفعل - إعطاء الأولوية للـ Manual Log
      const manualLogEnabled = await manualLogSystem.isEnabled(guild.id);
      const autoLogEnabled = await autoLogSystem.isEnabled(guild.id);
      
      if (manualLogEnabled) {
        console.log('📝 Using Manual Log system for kick');
        await manualLogSystem.logKickBan(target, 'kick', executor, reason);
      } else if (autoLogEnabled) {
        console.log('🤖 Using Auto Log system for kick');
        await autoLogSystem.logKickBan(target, 'kick', executor, reason, guild);
      } else {
        console.log('⚠️ No logging system enabled for kick');
      }
    }
    
    // التحقق من أحداث الميوت الكتابي (من خلال تحديث الأدوار)
    if (auditLogEntry.action === 25) { // MEMBER_ROLE_UPDATE
      const target = auditLogEntry.target;
      const executor = auditLogEntry.executor;
      const changes = auditLogEntry.changes;
      
      // البحث عن تغييرات في الأدوار التي تتعلق بالميوت
      const roleChanges = changes.find(change => change.key === '$add' || change.key === '$remove');
      if (roleChanges && roleChanges.new) {
        const roles = Array.isArray(roleChanges.new) ? roleChanges.new : [roleChanges.new];
        
        // البحث عن أدوار الميوت (عادة ما تحتوي على "mute" في الاسم)
        const muteRole = roles.find(role => 
          role.name && role.name.toLowerCase().includes('mute')
        );
        
        if (muteRole) {
          const member = guild.members.cache.get(target.id);
          if (member) {
            const action = roleChanges.key === '$add' ? 'mute' : 'unmute';
            await manualLogSystem.logMemberMute(member, 'text', action, executor, 'Text mute role updated');
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error handling audit log entry:', error);
  }
});

// إضافة أحداث Manual Log الإضافية
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  try {
    console.log('\n🔄 ===== GUILD MEMBER UPDATE EVENT =====');
    console.log(`👤 Member: ${newMember.user.tag} (${newMember.user.id})`);
    console.log(`🏠 Guild: ${newMember.guild.name} (${newMember.guild.id})`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // البحث عن المشرف الذي قام بالتغيير
    const auditLogs = await newMember.guild.fetchAuditLogs({
      limit: 10
    });
    
    let executor = null;
    const recentLog = auditLogs.entries.find(log => 
      log.target && log.target.id === newMember.user.id && 
      Date.now() - log.createdTimestamp < 10000 // زيادة الوقت إلى 10 ثواني
    );
    
    if (recentLog) {
      executor = recentLog.executor;
      console.log(`👮 Executor found: ${executor.tag} (Action: ${recentLog.action})`);
    } else {
      console.log(`❌ No executor found in audit logs`);
      // طباعة آخر 3 أحداث للتشخيص
      console.log(`🔍 Recent audit log entries:`);
      auditLogs.entries.first(3).forEach((entry, index) => {
        console.log(`   ${index + 1}. Action: ${entry.action}, Target: ${entry.target?.tag || entry.target?.id}, Executor: ${entry.executor?.tag}, Time: ${new Date(entry.createdTimestamp).toISOString()}`);
      });
    }

    // تتبع تغييرات الأدوار
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    
    if (oldRoles.size !== newRoles.size || !oldRoles.equals(newRoles)) {
      console.log('\n📝 ROLE CHANGES DETECTED:');
      
      const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
      const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
      
      if (addedRoles.size > 0) {
        console.log('➕ Added roles:');
        addedRoles.forEach(role => {
          console.log(`   - ${role.name} (${role.id}) - Color: ${role.hexColor}`);
        });
      }
      
      if (removedRoles.size > 0) {
        console.log('➖ Removed roles:');
        removedRoles.forEach(role => {
          console.log(`   - ${role.name} (${role.id}) - Color: ${role.hexColor}`);
        });
      }
      
      console.log('📤 Sending role changes to logging system...');
      
      // التحقق من أي نظام تسجيل مفعل
      const manualLogEnabled = await manualLogSystem.isEnabled(newMember.guild.id);
      const autoLogEnabled = await autoLogSystem.isEnabled(newMember.guild.id);
      
      if (manualLogEnabled) {
        console.log('📝 Using Manual Log system for role changes');
        await manualLogSystem.logMemberRoleChange(oldMember, newMember, executor);
      } else if (autoLogEnabled) {
        console.log('🤖 Using Auto Log system for role changes');
        await autoLogSystem.logMemberUpdate(oldMember, newMember, executor);
      } else {
        console.log('⚠️ No logging system enabled for role changes');
      }
      
      console.log('✅ Role changes logged successfully');
    }

    // تتبع تغيير الكنية
    if (oldMember.nickname !== newMember.nickname) {
      console.log('\n📝 NICKNAME CHANGE DETECTED:');
      console.log(`   Old nickname: ${oldMember.nickname || 'None'}`);
      console.log(`   New nickname: ${newMember.nickname || 'None'}`);
      console.log(`   User: ${newMember.user.tag}`);
      console.log(`   Guild: ${newMember.guild.name}`);
      console.log(`   Executor: ${executor ? executor.tag : 'Unknown'}`);
      
      console.log('📤 Sending nickname change to logging system...');
      
      // التحقق من أي نظام تسجيل مفعل
      const manualLogEnabled = await manualLogSystem.isEnabled(newMember.guild.id);
      const autoLogEnabled = await autoLogSystem.isEnabled(newMember.guild.id);
      
      if (manualLogEnabled) {
        console.log('📝 Using Manual Log system for nickname change');
        await manualLogSystem.logMemberNicknameChange(oldMember, newMember, executor);
      } else if (autoLogEnabled) {
        console.log('🤖 Using Auto Log system for nickname change');
        await autoLogSystem.logMemberUpdate(oldMember, newMember, executor);
      } else {
        console.log('⚠️ No logging system enabled for nickname change');
      }
      
      console.log('✅ Nickname change logged successfully');
    }

    // تتبع تغيير الأفاتار الخاص بالسيرفر
    if (oldMember.avatar !== newMember.avatar) {
      console.log('\n🖼️ AVATAR CHANGE DETECTED:');
      console.log(`   Old avatar: ${oldMember.avatar || 'None'}`);
      console.log(`   New avatar: ${newMember.avatar || 'None'}`);
      
      console.log('📤 Sending avatar change to logging system...');
      
      // التحقق من أي نظام تسجيل مفعل
      const manualLogEnabled = await manualLogSystem.isEnabled(newMember.guild.id);
      const autoLogEnabled = await autoLogSystem.isEnabled(newMember.guild.id);
      
      if (manualLogEnabled) {
        console.log('📝 Using Manual Log system for avatar change');
        await manualLogSystem.logMemberAvatarChange(oldMember, newMember, executor);
      } else if (autoLogEnabled) {
        console.log('🤖 Using Auto Log system for avatar change');
        await autoLogSystem.logMemberUpdate(oldMember, newMember, executor);
      } else {
        console.log('⚠️ No logging system enabled for avatar change');
      }
      
      console.log('✅ Avatar change logged successfully');
    }
    
    // تتبع تغييرات الميوت والتايم أوت
    if (oldMember.voice.serverMute !== newMember.voice.serverMute) {
      console.log('\n🔇 VOICE MUTE CHANGE DETECTED:');
      console.log(`   Old mute status: ${oldMember.voice.serverMute}`);
      console.log(`   New mute status: ${newMember.voice.serverMute}`);
    }
    
    if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
      console.log('\n⏰ TIMEOUT CHANGE DETECTED:');
      console.log(`   Old timeout: ${oldMember.communicationDisabledUntil}`);
      console.log(`   New timeout: ${newMember.communicationDisabledUntil}`);
    }
    
    console.log('========================================\n');
    
  } catch (error) {
    console.error('❌ Error in GuildMemberUpdate event:', error);
  }
});

client.on(Events.ChannelCreate, async (channel) => {
  try {
    console.log(`\n🆕 CHANNEL CREATE DETECTED:`);
    console.log(`   Channel: ${channel.name} (${channel.id})`);
    console.log(`   Type: ${channel.type}`);
    console.log(`   Guild: ${channel.guild.name}`);
    
    const auditLogs = await channel.guild.fetchAuditLogs({
      type: 10, // CHANNEL_CREATE
      limit: 1
    });
    
    const channelLog = auditLogs.entries.first();
    let executor = null;
    
    if (channelLog && channelLog.target.id === channel.id && Date.now() - channelLog.createdTimestamp < 5000) {
      executor = channelLog.executor;
      console.log(`   Executor: ${executor.tag}`);
    }
    
    console.log('📤 Sending channel create to logging system...');
    
    // التحقق من أي نظام تسجيل مفعل
    const manualLogEnabled = await manualLogSystem.isEnabled(channel.guild.id);
    const autoLogEnabled = await autoLogSystem.isEnabled(channel.guild.id);
    
    if (manualLogEnabled) {
      console.log('📝 Using Manual Log system for channel create');
      await manualLogSystem.logChannelChange('create', channel, executor);
    } else if (autoLogEnabled) {
      console.log('🤖 Using Auto Log system for channel create');
      await autoLogSystem.logServerChange(channel.guild, 'channelCreate', [
        { name: 'Channel Created', value: `${channel.toString()} (${channel.name})` }
      ], executor);
    } else {
      console.log('⚠️ No logging system enabled for channel create');
    }
    
    console.log('✅ Channel create logged successfully');
  } catch (error) {
    console.error('❌ Error handling channel create:', error);
  }
});

client.on(Events.ChannelDelete, async (channel) => {
  try {
    console.log(`\n🗑️ CHANNEL DELETE DETECTED:`);
    console.log(`   Channel: ${channel.name} (${channel.id})`);
    console.log(`   Type: ${channel.type}`);
    console.log(`   Guild: ${channel.guild.name}`);
    
    const auditLogs = await channel.guild.fetchAuditLogs({
      type: 12, // CHANNEL_DELETE
      limit: 1
    });
    
    const channelLog = auditLogs.entries.first();
    let executor = null;
    
    if (channelLog && channelLog.target.id === channel.id && Date.now() - channelLog.createdTimestamp < 5000) {
      executor = channelLog.executor;
      console.log(`   Executor: ${executor.tag}`);
    }
    
    console.log('📤 Sending channel delete to logging system...');
    
    // التحقق من أي نظام تسجيل مفعل
    const manualLogEnabled = await manualLogSystem.isEnabled(channel.guild.id);
    const autoLogEnabled = await autoLogSystem.isEnabled(channel.guild.id);
    
    if (manualLogEnabled) {
      console.log('📝 Using Manual Log system for channel delete');
      await manualLogSystem.logChannelChange('delete', channel, executor);
    } else if (autoLogEnabled) {
      console.log('🤖 Using Auto Log system for channel delete');
      await autoLogSystem.logServerChange(channel.guild, 'channelDelete', [
        { name: 'Channel Deleted', value: `\`${channel.name}\` (${channel.id})` }
      ], executor);
    } else {
      console.log('⚠️ No logging system enabled for channel delete');
    }
    
    console.log('✅ Channel delete logged successfully');
  } catch (error) {
    console.error('❌ Error handling channel delete:', error);
  }
});

client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
  try {
    const auditLogs = await newChannel.guild.fetchAuditLogs({
      type: 11, // CHANNEL_UPDATE
      limit: 1
    });
    
    const channelLog = auditLogs.entries.first();
    let executor = null;
    
    if (channelLog && channelLog.target.id === newChannel.id && Date.now() - channelLog.createdTimestamp < 5000) {
      executor = channelLog.executor;
    }
    
    await manualLogSystem.logChannelChange('update', newChannel, executor, oldChannel);
  } catch (error) {
    console.error('❌ Error handling channel update:', error);
  }
});

client.on(Events.MessageDelete, async (message) => {
  console.log(`🗑️ [DEBUG] MessageDelete event triggered - ID: ${message.id}, Guild: ${message.guild?.name || 'DM'}, Channel: ${message.channel?.name} (${message.channel?.id})`);
  
  if (message.partial) {
    console.log(`⚠️ [DEBUG] Message is partial, fetching...`);
    try {
      await message.fetch();
      console.log(`✅ [DEBUG] Message fetched successfully`);
    } catch (error) {
      console.error('❌ [DEBUG] Error fetching partial message:', error);
      return;
    }
  }
  
  console.log(`👤 [DEBUG] Author: ${message.author?.tag}, Bot: ${message.author?.bot}`);
  console.log(`📺 [DEBUG] Channel: ${message.channel?.name} (${message.channel?.id})`);
  console.log(`🏠 [DEBUG] Guild: ${message.guild?.name} (${message.guild?.id})`);
  
  if (message.author && !message.author.bot) {
    console.log(`🔄 [DEBUG] Processing message deletion...`);
    
    // التحقق من أي نظام تسجيل مفعل
    const manualLogEnabled = await manualLogSystem.isEnabled(message.guild.id);
    const autoLogEnabled = await autoLogSystem.isEnabled(message.guild.id);
    
    try {
      if (manualLogEnabled) {
        console.log('📝 Using Manual Log system for message delete');
        await manualLogSystem.logMessageChange(message, 'delete', null, null);
      } else if (autoLogEnabled) {
        console.log('🤖 Using Auto Log system for message delete');
        await autoLogSystem.logMessageEvent(message, 'delete');
      } else {
        console.log('⚠️ No logging system enabled for message delete');
      }
      console.log(`✅ [DEBUG] Message deletion logged successfully`);
    } catch (error) {
      console.error('❌ [DEBUG] Error logging message deletion:', error);
    }
  } else {
    console.log(`⏭️ [DEBUG] Skipping message deletion - conditions not met`);
  }
});

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  console.log(`✏️ [DEBUG] MessageUpdate event triggered - ID: ${newMessage.id}, Guild: ${newMessage.guild?.name || 'DM'}, Channel: ${newMessage.channel?.name} (${newMessage.channel?.id})`);
  
  if (oldMessage.partial) {
    console.log(`⚠️ [DEBUG] Old message is partial, fetching...`);
    try {
      await oldMessage.fetch();
      console.log(`✅ [DEBUG] Old message fetched successfully`);
    } catch (error) {
      console.error('❌ [DEBUG] Error fetching partial old message:', error);
      return;
    }
  }
  
  if (newMessage.partial) {
    console.log(`⚠️ [DEBUG] New message is partial, fetching...`);
    try {
      await newMessage.fetch();
      console.log(`✅ [DEBUG] New message fetched successfully`);
    } catch (error) {
      console.error('❌ [DEBUG] Error fetching partial new message:', error);
      return;
    }
  }
  
  console.log(`👤 [DEBUG] Author: ${newMessage.author?.tag}, Bot: ${newMessage.author?.bot}`);
  console.log(`📺 [DEBUG] Channel: ${newMessage.channel?.name} (${newMessage.channel?.id})`);
  console.log(`🏠 [DEBUG] Guild: ${newMessage.guild?.name} (${newMessage.guild?.id})`);
  console.log(`📝 [DEBUG] Content changed: ${oldMessage.content !== newMessage.content}`);
  console.log(`📄 [DEBUG] Old content: "${oldMessage.content}"`);
  console.log(`📄 [DEBUG] New content: "${newMessage.content}"`);
  
  if (newMessage.author && !newMessage.author.bot && oldMessage.content !== newMessage.content) {
    console.log(`🔄 [DEBUG] Processing message edit...`);
    
    // التحقق من أي نظام تسجيل مفعل
    const manualLogEnabled = await manualLogSystem.isEnabled(newMessage.guild.id);
    const autoLogEnabled = await autoLogSystem.isEnabled(newMessage.guild.id);
    
    try {
      if (manualLogEnabled) {
        console.log('📝 Using Manual Log system for message edit');
        await manualLogSystem.logMessageChange(oldMessage, 'edit', null, newMessage.content);
      } else if (autoLogEnabled) {
        console.log('🤖 Using Auto Log system for message edit');
        await autoLogSystem.logMessageEvent(newMessage, 'edit', null, oldMessage.content);
      } else {
        console.log('⚠️ No logging system enabled for message edit');
      }
      console.log(`✅ [DEBUG] Message edit logged successfully`);
    } catch (error) {
      console.error('❌ [DEBUG] Error logging message edit:', error);
    }
  } else {
    console.log(`⏭️ [DEBUG] Skipping message edit - conditions not met`);
  }
});

// Role Create Event
client.on(Events.GuildRoleCreate, async (role) => {
  try {
    const auditLogs = await role.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleCreate,
      limit: 1
    });
    
    const auditEntry = auditLogs.entries.first();
    const executor = auditEntry ? auditEntry.executor : null;
    
    await manualLogSystem.logRoleChange(role, 'create', executor);
  } catch (error) {
    console.error('❌ Error in GuildRoleCreate event:', error);
  }
});

// Role Delete Event
client.on(Events.GuildRoleDelete, async (role) => {
  try {
    const auditLogs = await role.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleDelete,
      limit: 1
    });
    
    const auditEntry = auditLogs.entries.first();
    const executor = auditEntry ? auditEntry.executor : null;
    
    await manualLogSystem.logRoleChange(role, 'delete', executor);
  } catch (error) {
    console.error('❌ Error in GuildRoleDelete event:', error);
  }
});

// Role Update Event
client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
  try {
    const auditLogs = await newRole.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleUpdate,
      limit: 1
    });
    
    const auditEntry = auditLogs.entries.first();
    const executor = auditEntry ? auditEntry.executor : null;
    
    await manualLogSystem.logRoleChange(newRole, 'update', executor);
  } catch (error) {
    console.error('❌ Error in GuildRoleUpdate event:', error);
  }
});

// Guild Update Event (Server Name and Icon Changes)
client.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
  try {
    console.log(`🏠 [GUILD UPDATE] Server ${newGuild.name} was updated`);
    
    const changes = [];
    let hasChanges = false;
    
    // Check for name change
    if (oldGuild.name !== newGuild.name) {
      changes.push({
        name: '📝 Server Name',
        value: `**Before:** ${oldGuild.name}\n**After:** ${newGuild.name}`,
        inline: false
      });
      hasChanges = true;
      console.log(`📝 Server name changed: ${oldGuild.name} → ${newGuild.name}`);
    }
    
    // Check for icon change
    if (oldGuild.icon !== newGuild.icon) {
      const oldIcon = oldGuild.iconURL({ dynamic: true }) || 'No icon';
      const newIcon = newGuild.iconURL({ dynamic: true }) || 'No icon';
      changes.push({
        name: '🖼️ Server Icon',
        value: `**Before:** ${oldIcon === 'No icon' ? 'No icon' : '[Previous Icon](' + oldIcon + ')'}\n**After:** ${newIcon === 'No icon' ? 'No icon' : '[New Icon](' + newIcon + ')'}`,
        inline: false
      });
      hasChanges = true;
      console.log(`🖼️ Server icon changed`);
    }
    
    if (hasChanges) {
      // Get executor from audit logs
      let executor = null;
      try {
        const auditLogs = await newGuild.fetchAuditLogs({
          type: AuditLogEvent.GuildUpdate,
          limit: 1
        });
        const auditEntry = auditLogs.entries.first();
        executor = auditEntry ? auditEntry.executor : null;
      } catch (auditError) {
        console.log('⚠️ Could not fetch audit logs for guild update');
      }
      
      console.log(`🔄 Logging server changes for ${newGuild.name}`);
      
      // Check if manual log is enabled first
      const manualLogEnabled = await manualLogSystem.isEnabled(newGuild.id);
      
      if (manualLogEnabled) {
        try {
          await manualLogSystem.logServerUpdate(oldGuild, newGuild, executor);
          console.log(`✅ Manual Log: Server changes logged for ${newGuild.name}`);
        } catch (error) {
          console.error('❌ Error in Manual Log server update:', error);
        }
      } else {
        // Use Auto Log System if manual log is not enabled
        const autoLogEnabled = await autoLogSystem.isEnabled(newGuild.id);
        
        if (autoLogEnabled) {
          try {
            await autoLogSystem.logServerChange(newGuild, 'serverUpdate', changes, executor);
            console.log(`✅ Auto Log: Server changes logged for ${newGuild.name}`);
          } catch (error) {
            console.error('❌ Error in Auto Log server change:', error);
          }
        } else {
          console.log(`ℹ️ No logging system enabled for server ${newGuild.name}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error handling GuildUpdate:', error);
  }
});

// دالة معالجة أعمال الإشراف
async function handleModerationAction(guild, executor, actionType) {
  try {
    // تجاهل البوتات
    if (executor.bot) {
      console.log(`🤖 Ignoring bot action by ${executor.tag}`);
      return;
    }
    
    const settings = await getServerSettings(guild.id);
    if (!settings?.protection?.moderation?.enabled) {
      console.log(`ℹ️ Moderation protection not enabled for ${guild.name}`);
      return;
    }
    
    const moderationSettings = settings.protection.moderation;
    const maxKickBan = moderationSettings.maxKickBan || 5;
    const punishment = moderationSettings.memberPunishment || 'kick';
    
    // تهيئة تتبع الأعمال للسيرفر
    if (!moderationActions.has(guild.id)) {
      moderationActions.set(guild.id, new Map());
    }
    
    const guildActions = moderationActions.get(guild.id);
    
    // تهيئة تتبع المستخدم
    if (!guildActions.has(executor.id)) {
      guildActions.set(executor.id, { kicks: 0, bans: 0, lastAction: Date.now() });
    }
    
    const userActions = guildActions.get(executor.id);
    
    // إضافة العمل الجديد
    if (actionType === 'kick') {
      userActions.kicks++;
    } else if (actionType === 'ban') {
      userActions.bans++;
    }
    
    userActions.lastAction = Date.now();
    
    const totalActions = userActions.kicks + userActions.bans;
    console.log(`📊 ${executor.tag} has performed ${totalActions} moderation actions (kicks: ${userActions.kicks}, bans: ${userActions.bans})`);
    
    // تطبيق العقوبة إذا تجاوز الحد المسموح
    if (totalActions >= maxKickBan) {
      console.log(`⚠️ ${executor.tag} exceeded moderation limit (${totalActions}/${maxKickBan}). Applying punishment: ${punishment}`);
      
      // فحص القنوات المسموحة لعقوبات الطرد والباند
      if ((punishment === 'kick' || punishment === 'ban') && moderationSettings.whitelistChannels && moderationSettings.whitelistChannels.length > 0) {
        // نحتاج للحصول على آخر قناة تم فيها العمل الإشرافي
        // لكن هذا معقد، لذا سنطبق النظام على مستوى السيرفر
        console.log(`ℹ️ [MODERATION] Whitelist channels configured for ${punishment}, but moderation actions are server-wide`);
      }
      
      const member = await guild.members.fetch(executor.id).catch(() => null);
      if (member) {
        await applyModerationPunishment(member, punishment, `Exceeded moderation limit: ${totalActions} actions`);
        
        // إعادة تعيين العداد بعد تطبيق العقوبة
        userActions.kicks = 0;
        userActions.bans = 0;
      }
    }
    
  } catch (error) {
    console.error('❌ Error handling moderation action:', error);
  }
}

// دالة تطبيق العقوبة على المشرف المخالف
async function applyModerationPunishment(member, punishment, reason) {
  try {
    switch (punishment) {
      case 'kick':
        if (member.guild.members.me.permissions.has('KICK_MEMBERS') && member.kickable) {
          await member.kick(reason);
          console.log(`👢 [MODERATION] Kicked ${member.user.tag}: ${reason}`);
        } else {
          console.log(`⚠️ [MODERATION] Cannot kick ${member.user.tag}: insufficient permissions`);
        }
        break;
        
      case 'ban':
        if (member.guild.members.me.permissions.has('BAN_MEMBERS') && member.bannable) {
          await member.ban({ reason });
          console.log(`🔨 [MODERATION] Banned ${member.user.tag}: ${reason}`);
        } else {
          console.log(`⚠️ [MODERATION] Cannot ban ${member.user.tag}: insufficient permissions`);
        }
        break;
        
      case 'remove roles':
        if (member.guild.members.me.permissions.has('MANAGE_ROLES')) {
          await member.roles.set([], reason);
          console.log(`🎭 [MODERATION] Removed all roles from ${member.user.tag}: ${reason}`);
        } else {
          console.log(`⚠️ [MODERATION] Cannot remove roles from ${member.user.tag}: insufficient permissions`);
        }
        break;
        
      default:
        console.log(`ℹ️ [MODERATION] Unknown punishment type: ${punishment}`);
    }
  } catch (error) {
    console.error(`❌ [MODERATION] Error applying punishment to ${member.user.tag}:`, error);
  }
}

// تنظيف البيانات القديمة كل ساعة
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // ساعة واحدة بالميلي ثانية
  
  for (const [guildId, guildActions] of moderationActions.entries()) {
    for (const [userId, userActions] of guildActions.entries()) {
      // إزالة البيانات الأقدم من ساعة واحدة
      if (now - userActions.lastAction > oneHour) {
        guildActions.delete(userId);
        console.log(`🧹 Cleaned old moderation data for user ${userId} in guild ${guildId}`);
      }
    }
    
    // إزالة السيرفرات الفارغة
    if (guildActions.size === 0) {
      moderationActions.delete(guildId);
      console.log(`🧹 Cleaned empty guild data for ${guildId}`);
    }
  }
}, 60 * 60 * 1000); // كل ساعة



// Login
// إعداد Express server للـ API
const app = express();
app.use(express.json());

// إضافة CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3002');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// إضافة middleware للتحقق من الـ authorization
app.use('/api', (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.BOT_API_SECRET || 'default-secret';
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
});

// إضافة routes
app.use('/api', settingsUpdateRouter);
app.use('/api', manualLogRouter);
app.use('/api', backupRouter);
app.use('/api', createChannelsRouter);

// بدء Express server
const PORT = process.env.BOT_API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Bot API server running on port ${PORT}`);
});

// تعيين مرجع البوت للـ API
const botAPI = {
  clearServerCache,
  getServerSettings,
  updateAutoReplySettings: (serverId, data) => {
    console.log(`🔄 Auto-reply settings updated for server ${serverId}`);
    // يمكن إضافة منطق إضافي هنا إذا لزم الأمر
  },
  updateProtectionSettings: (serverId, data) => {
    console.log(`🛡️ Protection settings updated for server ${serverId}`);
    console.log(`📋 Received data:`, JSON.stringify(data, null, 2));
    
    // Clear cache first
    clearServerCache(serverId);
    
    // Update bot's local data file
    const { updateServerSection } = require('./utils/database.js');
    updateServerSection(serverId, 'protection', data, 'bot-sync')
      .then(() => {
        console.log(`✅ Bot local data updated for server ${serverId}`);
      })
      .catch(error => {
        console.error(`❌ Error updating bot local data for server ${serverId}:`, error);
      });
  },
  updateAdsSettings: async (serverId, data) => {
    console.log(`📢 [DEBUG] updateAdsSettings called for server ${serverId}`);
    console.log(`📋 [DEBUG] Received data:`, JSON.stringify(data, null, 2));
    console.log(`🔧 [DEBUG] adsSystem initialized:`, !!adsSystem);
    console.log(`📊 [DEBUG] data provided:`, !!data);
    
    if (adsSystem && data) {
      try {
        console.log(`🧹 [DEBUG] Clearing cache for server ${serverId}`);
        // مسح ذاكرة التخزين المؤقت أولاً
        clearServerCache(serverId);
        
        if (data.ads && Array.isArray(data.ads)) {
          const immediateAds = data.ads.filter(ad => ad.publishType === 'immediate').length;
          const scheduledAds = data.ads.filter(ad => ad.publishType === 'scheduled').length;
          console.log(`📊 [DEBUG] Found ${immediateAds} immediate ads and ${scheduledAds} scheduled ads`);
          console.log(`📋 [DEBUG] All ads:`, data.ads.map(ad => ({ id: ad.id, title: ad.title, publishType: ad.publishType, status: ad.status, enabled: ad.enabled })));
          
          // تحديث إعدادات السيرفر أولاً
          console.log(`⚙️ [DEBUG] Updating server settings...`);
          adsSystem.updateServerSettings(serverId, data);
          
          // معالجة الإعلانات بشكل فوري
          console.log(`⚡ [DEBUG] Starting processAdsUpdate...`);
          await adsSystem.processAdsUpdate(serverId, data);
          console.log(`✅ [DEBUG] processAdsUpdate completed`);
          
          console.log(`✅ Ads settings updated successfully for server ${serverId}`);
        } else {
          console.log(`⚠️ No ads data found or invalid format for server ${serverId}`);
          console.log(`📋 [DEBUG] data.ads:`, data.ads);
          console.log(`📋 [DEBUG] Array.isArray(data.ads):`, Array.isArray(data.ads));
          // تحديث الإعدادات حتى لو لم توجد إعلانات
          adsSystem.updateServerSettings(serverId, data);
        }
      } catch (error) {
        console.error(`❌ Error updating ads settings for server ${serverId}:`, error);
        console.error(`❌ [DEBUG] Error stack:`, error.stack);
      }
    } else {
      console.log(`⚠️ Ads system not initialized or no data provided for server ${serverId}`);
      console.log(`🔧 [DEBUG] adsSystem:`, !!adsSystem);
      console.log(`📊 [DEBUG] data:`, !!data);
    }
  }
};
setBotInstance(botAPI);

// تعيين Manual Log System instance
setManualLogSystem(manualLogSystem);

// تعيين Backup System instance
setBackupBotInstance(client);

// تعيين Create Log Channels System instance
setCreateChannelsBotInstance(client);

// Initialize sync system
syncSystem = new SyncSystem(botAPI);
syncSystem.start();
console.log('✅ Enhanced Sync System initialized and started');

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('❌ Error: DISCORD_BOT_TOKEN not found in .env.local file');
  console.log('Please add DISCORD_BOT_TOKEN to .env.local file');
  process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('🚀 Bot started successfully...');
  })
  .catch((error) => {
    console.error('❌ Failed to login:', error);
    console.log('Make sure DISCORD_BOT_TOKEN is correct in .env.local file');
    process.exit(1);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down bot...');
  if (adsSystem) {
    adsSystem.stopAutoCleanup();
  }
  if (syncSystem) {
    syncSystem.stop();
  }
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down bot...');
  if (adsSystem) {
    adsSystem.stopAutoCleanup();
  }
  if (syncSystem) {
    syncSystem.stop();
  }
  client.destroy();
  process.exit(0);
});