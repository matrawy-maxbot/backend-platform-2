const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const cron = require('node-cron');

class AdsSystem {
  constructor(client) {
    this.client = client;
    this.serverSettings = new Map();
    this.cooldowns = new Map(); // serverId -> lastAdTime
    this.scheduledAds = new Map(); // adId -> cronJob
    this.adStats = new Map(); // adId -> { views, clicks }
    this.publishedAds = new Map(); // serverId -> Set of published ad IDs
    this.sentMessages = new Map(); // serverId -> Map(adId -> messageIds[])
    this.messageHashes = new Map(); // serverId -> Map(contentHash -> messageId)
    
    console.log('🎯 Ads system initialized successfully');
    
    // إضافة نظام مراقبة للإعلانات المجدولة
    this.scheduledAdsLog = new Map(); // سجل الإعلانات المجدولة
    this.debugMode = process.env.ADS_DEBUG === 'true' || false;
    
    // Run statistics cleanup task every hour
    cron.schedule('0 * * * *', () => {
      this.cleanupOldStats();
    });
    
    // Run expired ads cleanup task every hour
    cron.schedule('0 * * * *', () => {
      this.cleanupExpiredAds();
    });
    
    // Run frequent expired ads cleanup every 10 minutes for better responsiveness
    cron.schedule('*/10 * * * *', () => {
      this.cleanupExpiredAds();
      console.log('🔄 Quick cleanup of expired ads has been executed');
    });
    
    // Clean up old message hashes every 6 hours
    cron.schedule('0 */6 * * *', () => {
      this.cleanupOldMessageHashes();
      console.log('🧹 Old message data has been cleaned up');
    });
    
    // Process immediate ads every minute
    cron.schedule('* * * * *', async () => {
      console.log('🔄 Running scheduled ad processing...');
      await this.processAllServersAds();
    });
  }

  // Process ads for all servers
  async processAllServersAds() {
    try {
      console.log('🎯 Starting processAllServersAds...');
      const guilds = this.client.guilds.cache;
      console.log(`📊 Found ${guilds.size} guilds to process`);
      
      for (const [guildId, guild] of guilds) {
        try {
          console.log(`🔍 Processing server: ${guildId}`);
          // Get fresh settings from database
          const { getServerData } = require('./database.js');
          const serverData = await getServerData(guildId);
          
          if (serverData) {
            console.log(`📋 Server data found for ${guildId}:`, {
              hasAds: !!serverData.ads,
              adsEnabled: serverData.ads?.enabled,
              adsCount: serverData.ads?.ads?.length || 0
            });
          } else {
            console.log(`❌ No server data found for ${guildId}`);
          }
          
          if (serverData && serverData.ads && serverData.ads.enabled) {
            console.log(`✅ Ads enabled for server ${guildId}, processing...`);
            // Update local settings cache
            this.updateServerSettings(guildId, serverData);
            await this.processAdsUpdate(guildId, serverData.ads);
          } else {
            console.log(`⚠️ Ads disabled or no data for server ${guildId}`);
          }
        } catch (error) {
          console.error(`❌ Error processing ads for server ${guildId}:`, error.message);
        }
      }
      console.log('✅ Finished processAllServersAds');
    } catch (error) {
      console.error('❌ Error in processAllServersAds:', error.message);
    }
  }

  // Update server settings
  updateServerSettings(serverId, settings) {
    this.serverSettings.set(serverId, {
      ...settings,
      lastUpdated: Date.now()
    });
    
    console.log(`🔄 Ads settings updated for server: ${serverId}`);
    
    // Reschedule delayed ads
    this.rescheduleAds(serverId, settings.ads || []);
  }

  // Get server settings
  getServerSettings(serverId) {
    return this.serverSettings.get(serverId) || {
      enabled: false,
      ads: [],
      dailyLimit: 5,
      cooldownMinutes: 30,
      allowedChannels: [],
      allowedRoles: []
    };
  }

  // Check if ad can be sent
  canSendAd(serverId) {
    const settings = this.getServerSettings(serverId);
    
    if (!settings.enabled) {
      return { canSend: false, reason: 'Ads system is disabled' };
    }

    const now = Date.now();
    const lastAdTime = this.cooldowns.get(serverId) || 0;
    const cooldownMs = (settings.cooldownMinutes || 30) * 60 * 1000;
    
    if (now - lastAdTime < cooldownMs) {
      const remainingTime = Math.ceil((cooldownMs - (now - lastAdTime)) / 60000);
      return { 
        canSend: false, 
        reason: `Must wait ${remainingTime} minutes before next ad` 
      };
    }

    // Check daily limit
    const todayAds = this.getTodayAdsCount(serverId);
    if (todayAds >= (settings.dailyLimit || 5)) {
      return { 
        canSend: false, 
        reason: `Daily limit reached (${settings.dailyLimit} ads)` 
      };
    }

    return { canSend: true };
  }

  // Get today's ads count
  getTodayAdsCount(serverId) {
    const today = new Date().toDateString();
    const serverCooldowns = this.cooldowns.get(`${serverId}_daily`) || {};
    return serverCooldowns[today] || 0;
  }

  // Record sent ad
  recordAdSent(serverId) {
    const now = Date.now();
    const today = new Date().toDateString();
    
    // Update last ad time
    this.cooldowns.set(serverId, now);
    
    // Update daily counter
    const dailyKey = `${serverId}_daily`;
    const dailyCount = this.cooldowns.get(dailyKey) || {};
    dailyCount[today] = (dailyCount[today] || 0) + 1;
    this.cooldowns.set(dailyKey, dailyCount);
  }

  // Send immediate ad with restrictions check
  async sendImmediateAd(serverId, ad) {
    try {
      // فحص تاريخ انتهاء الصلاحية أولاً - فحص مضاعف للأمان
      if (ad.expiryDate) {
        const expiryDate = new Date(ad.expiryDate);
        const now = new Date();
        if (now >= expiryDate) {
          console.log(`⚠️ Cannot send ad - expired: ${ad.title} - expired at ${expiryDate.toLocaleString('en-US')}`);
          // إزالة الإعلان من قائمة المنشورة إذا كان موجوداً
          if (this.publishedAds.has(serverId)) {
            this.publishedAds.get(serverId).delete(ad.id);
          }
          return false;
        }
      }
      
      // فحص إضافي للتأكد من scheduledTime إذا كان موجوداً
      if (ad.scheduledTime && new Date(ad.scheduledTime) < new Date()) {
        console.log(`⚠️ Ignored expired ad (scheduledTime): ${ad.title}`);
        return false;
      }
      
      // فحص إضافي: التأكد من أن الإعلان لم يتم إرساله مسبقاً لتجنب التكرار
      if (this.isAdPublished(serverId, ad.id)) {
        console.log(`⚠️ Ad already sent: ${ad.title}`);
        return false;
      }
      
      const guild = this.client.guilds.cache.get(serverId);
      if (!guild) {
        console.log(`⚠️ Cannot find server: ${serverId}`);
        return false;
      }

      // الإعلانات الفورية لا تخضع لقيود cooldown أو الحد اليومي
      // فقط نتحقق من أن النظام مفعل
      const settings = this.getServerSettings(serverId);
      if (!settings.enabled) {
        console.log(`⚠️ Cannot send immediate ad: Ads system is disabled`);
        return false;
      }
      
      console.log(`🚀 Sending immediate ad without cooldown restrictions: ${ad.title}`);

      const success = await this.sendAdToChannels(guild, ad);
      if (success) {
        // لا نسجل cooldown للإعلانات الفورية
        // this.recordAdSent(serverId, adType);
        this.updateAdStats(ad.id, 'view');
        
        // تسجيل الإعلان كمنشور
        if (!this.publishedAds.has(serverId)) {
          this.publishedAds.set(serverId, new Set());
        }
        this.publishedAds.get(serverId).add(ad.id);
        
        // عدم تعطيل الإعلانات الفورية تلقائياً
        // await this.disableAdAfterPublish(serverId, ad.id, 'immediate');
        
        console.log(`✅ Ad sent successfully: ${ad.title}`);
      }
      
      return success;
    } catch (error) {
      console.error('❌ Error sending immediate ad:', error);
      return false;
    }
  }

  // Send immediate ad directly without restrictions
  async sendImmediateAdDirect(serverId, ad) {
    try {
      console.log(`🔍 [DEBUG] Starting sendImmediateAdDirect for ad: ${ad.title} (ID: ${ad.id})`);
      console.log(`🔍 [DEBUG] Server ID: ${serverId}`);
      console.log(`🔍 [DEBUG] Ad details:`, JSON.stringify(ad, null, 2));
      
      // فحص تاريخ انتهاء الصلاحية أولاً - فحص مضاعف للأمان
      if (ad.expiryDate) {
        const expiryDate = new Date(ad.expiryDate);
        const now = new Date();
        console.log(`🔍 [DEBUG] Checking expiry: now=${now.toISOString()}, expiry=${expiryDate.toISOString()}`);
        if (now >= expiryDate) {
          console.log(`⚠️ Cannot send immediate ad - expired: ${ad.title} - expired at ${expiryDate.toLocaleString('en-US')}`);
          // إزالة الإعلان من قائمة المنشورة إذا كان موجوداً
          if (this.publishedAds.has(serverId)) {
            this.publishedAds.get(serverId).delete(ad.id);
          }
          return false;
        }
      }
      
      // فحص إضافي: التأكد من أن الإعلان لم يتم إرساله مسبقاً لتجنب التكرار
      const isPublished = this.isAdPublished(serverId, ad.id);
      console.log(`🔍 [DEBUG] Is ad already published: ${isPublished}`);
      if (isPublished) {
        console.log(`⚠️ Immediate ad already sent: ${ad.title}`);
        return false;
      }
      
      // التأكد من أن نظام الإعلانات مفعل
      const settings = this.getServerSettings(serverId);
      console.log(`🔍 [DEBUG] Server settings:`, JSON.stringify(settings, null, 2));
      if (!settings.enabled) {
        console.log(`⚠️ Cannot send immediate ad direct: Ads system is disabled`);
        return false;
      }
      
      const guild = this.client.guilds.cache.get(serverId);
      console.log(`🔍 [DEBUG] Guild found:`, guild ? `Yes (${guild.name})` : 'No');
      if (!guild) {
        console.log(`⚠️ Cannot find server: ${serverId}`);
        return false;
      }
      
      console.log(`🚀 Sending immediate ad direct: ${ad.title}`);

      const success = await this.sendAdToChannels(guild, ad);
      console.log(`🔍 [DEBUG] sendAdToChannels result:`, success);
      if (success) {
        this.updateAdStats(ad.id, 'view');
        
        // تسجيل الإعلان كمنشور
        if (!this.publishedAds.has(serverId)) {
          this.publishedAds.set(serverId, new Set());
        }
        this.publishedAds.get(serverId).add(ad.id);
        console.log(`✅ [DEBUG] Ad marked as published: ${ad.id}`);
        
        // عدم تعطيل الإعلانات الفورية تلقائياً
        // await this.disableAdAfterPublish(serverId, ad.id, 'immediate');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Error sending direct immediate ad:', error);
      return false;
    }
  }

  // Send ad to specified channels
  async sendAdToChannels(guild, ad) {
    try {
      let targetChannels = ad.targetChannels || [];
      
      // إذا لم يتم تحديد قنوات، استخدم القنوات الافتراضية
      if (targetChannels.length === 0) {
        console.log('🔍 No channels specified, searching for suitable channels...');
        
        // ترتيب أولوية القنوات: announcements > general > chat > أي قناة نصية
        const channelPriorities = [
          ['announcements', 'announcement', 'إعلانات'],
          ['general', 'عام'],
          ['chat', 'main', 'lobby'],
          ['welcome', 'welcomes', 'ترحيب']
        ];
        
        let defaultChannel = null;
        
        // البحث عن قناة مناسبة حسب الأولوية
        for (const priority of channelPriorities) {
          defaultChannel = guild.channels.cache.find(channel => 
            channel.isTextBased() && 
            channel.permissionsFor(guild.members.me)?.has('SendMessages') &&
            priority.some(name => channel.name.toLowerCase().includes(name.toLowerCase()))
          );
          
          if (defaultChannel) {
            console.log(`✅ Found ${priority[0]} channel: ${defaultChannel.name}`);
            break;
          }
        }
        
        // إذا لم يتم العثور على قناة مناسبة، استخدم أول قناة نصية متاحة
        if (!defaultChannel) {
          defaultChannel = guild.channels.cache.find(channel => 
            channel.isTextBased() && 
            channel.permissionsFor(guild.members.me)?.has('SendMessages')
          );
          
          if (defaultChannel) {
            console.log(`✅ Using first available text channel: ${defaultChannel.name}`);
          }
        }
        
        if (defaultChannel) {
          targetChannels = [defaultChannel.id];
        } else {
          console.log('❌ No available text channels to send ad');
          return false;
        }
      }
      
      let sentCount = 0;

      // إنشاء مجموعة للقنوات المرسل إليها لتجنب التكرار
      const sentChannels = new Set();
      
      // إنشاء مفتاح فريد لهذا الإعلان لمنع التكرار المتزامن
      const adProcessingKey = `processing_${ad.id}_${Date.now()}`;
      if (!this.processingAds) {
        this.processingAds = new Set();
      }
      
      // التحقق من أن هذا الإعلان ليس قيد المعالجة حالياً
      const isCurrentlyProcessing = Array.from(this.processingAds).some(key => key.startsWith(`processing_${ad.id}_`));
      if (isCurrentlyProcessing) {
        console.log(`⚠️ Ad ${ad.id} is already being processed, skipping duplicate execution...`);
        return false;
      }
      
      // إضافة الإعلان إلى قائمة المعالجة
      this.processingAds.add(adProcessingKey);
      
      for (const channelId of targetChannels) {
        // تجنب إرسال الإعلان لنفس القناة أكثر من مرة في نفس الجلسة
        if (sentChannels.has(channelId)) {
          console.log(`⚠️ Ignored duplicate channel in current session: ${channelId}`);
          continue;
        }
        
        const channel = guild.channels.cache.get(channelId);
        if (!channel || !channel.isTextBased()) {
          console.log(`⚠️ Channel not found or invalid: ${channelId}`);
          continue;
        }

        try {
          // فحص التكرار قبل الإرسال
          const contentHash = this.createContentHash(ad);
          const serverId = guild.id;
          
          // Initialize maps if they don't exist
          if (!this.messageHashes.has(serverId)) {
            this.messageHashes.set(serverId, new Map());
          }
          
          const serverHashes = this.messageHashes.get(serverId);
          const channelContentKey = `${channelId}_${contentHash}`;
          const channelAdKey = `${channelId}_ad_${ad.id}`; // مفتاح إضافي لتتبع الإعلان بمعرفه
          
          // التحقق من وجود نفس الإعلان في هذه القناة بناءً على معرف الإعلان
          if (serverHashes.has(channelAdKey)) {
            const existingMessageId = serverHashes.get(channelAdKey);
            console.log(`🔍 Checking existing ad ${ad.id} in channel ${channel.name} (Message ID: ${existingMessageId})`);
            
            try {
              const existingMessage = await channel.messages.fetch(existingMessageId).catch(() => null);
              if (existingMessage && existingMessage.author.id === guild.members.me.id) {
                // التحقق من عمر الرسالة - إذا كانت أقدم من ساعة، اسمح بإعادة الإرسال
                const messageAge = Date.now() - existingMessage.createdTimestamp;
                const oneHour = 60 * 60 * 1000;
                
                if (messageAge < oneHour) {
                  console.log(`⚠️ Ad ID ${ad.id} already exists in channel ${channel.name} (sent ${Math.round(messageAge/60000)} minutes ago), skipping...`);
                  continue;
                } else {
                  console.log(`🔄 Ad ID ${ad.id} exists but is old (${Math.round(messageAge/60000)} minutes), allowing resend...`);
                  serverHashes.delete(channelAdKey);
                }
              } else {
                console.log(`🗑️ Message ${existingMessageId} not found or not from bot, removing hash...`);
                serverHashes.delete(channelAdKey);
              }
            } catch (fetchError) {
              console.log(`❌ Error fetching message ${existingMessageId}, removing hash:`, fetchError.message);
              serverHashes.delete(channelAdKey);
            }
          }
          
          // التحقق من وجود نفس المحتوى في هذه القناة
          if (serverHashes.has(channelContentKey)) {
            const existingMessageId = serverHashes.get(channelContentKey);
            console.log(`🔍 Checking similar content in channel ${channel.name} (Message ID: ${existingMessageId})`);
            
            try {
              const existingMessage = await channel.messages.fetch(existingMessageId).catch(() => null);
              if (existingMessage && existingMessage.author.id === guild.members.me.id) {
                // التحقق من عمر الرسالة - إذا كانت أقدم من ساعة، اسمح بإعادة الإرسال
                const messageAge = Date.now() - existingMessage.createdTimestamp;
                const oneHour = 60 * 60 * 1000;
                
                if (messageAge < oneHour) {
                  console.log(`⚠️ Similar content already exists in channel ${channel.name} (sent ${Math.round(messageAge/60000)} minutes ago), skipping...`);
                  continue;
                } else {
                  console.log(`🔄 Similar content exists but is old (${Math.round(messageAge/60000)} minutes), allowing resend...`);
                  serverHashes.delete(channelContentKey);
                }
              } else {
                console.log(`🗑️ Message ${existingMessageId} not found or not from bot, removing content hash...`);
                serverHashes.delete(channelContentKey);
              }
            } catch (fetchError) {
              console.log(`❌ Error fetching message ${existingMessageId}, removing content hash:`, fetchError.message);
              serverHashes.delete(channelContentKey);
            }
          }
          
          const embed = this.createAdEmbed(ad);
          const components = (ad.linkUrl && this.isValidUrl(ad.linkUrl)) ? [this.createAdButtons(ad)] : [];
          
          // إنشاء منشن للرتب المحددة
          let roleMentions = '';
          if (ad.targetRoles && ad.targetRoles.length > 0) {
            const validRoles = ad.targetRoles
              .map(roleId => {
                const role = guild.roles.cache.get(roleId);
                return role ? `<@&${roleId}>` : null;
              })
              .filter(mention => mention !== null);
            
            if (validRoles.length > 0) {
              roleMentions = validRoles.join(' ');
            }
          }
          
          const messageContent = roleMentions ? { content: roleMentions } : {};
          
          const sentMessage = await channel.send({ 
            ...messageContent,
            embeds: [embed],
            components 
          });
          
          // حفظ معرف الرسالة مع معرف القناة
          this.storeSentMessage(guild.id, ad.id, sentMessage.id, channelId);
          
          // حفظ hash المحتوى ومعرف الإعلان لمنع التكرار في المستقبل
          serverHashes.set(channelContentKey, sentMessage.id);
          serverHashes.set(channelAdKey, sentMessage.id);
          
          console.log(`💾 Saved hashes for ad ${ad.id} in channel ${channel.name}:`);
          console.log(`   📝 Content key: ${channelContentKey}`);
          console.log(`   🆔 Ad key: ${channelAdKey}`);
          console.log(`   📨 Message ID: ${sentMessage.id}`);
          console.log(`   📊 Total hashes for server: ${serverHashes.size}`);
          
          // حفظ معرف الرسالة في قائمة الرسائل المرسلة
          if (!this.sentMessages.has(serverId)) {
            this.sentMessages.set(serverId, new Map());
          }
          const serverMessages = this.sentMessages.get(serverId);
          if (!serverMessages.has(ad.id)) {
            serverMessages.set(ad.id, []);
          }
          serverMessages.get(ad.id).push({
            messageId: sentMessage.id,
            channelId: channelId,
            timestamp: Date.now()
          });
          
          sentChannels.add(channelId);
          sentCount++;
          console.log(`✅ Ad sent successfully to channel: ${channel.name}`);
          
          // Add small delay between messages to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (channelError) {
          console.error(`❌ Failed to send ad to channel ${channel.name}:`, channelError);
        }
      }

      return sentCount > 0;
    } catch (error) {
      console.error('❌ Error sending ad to channels:', error);
      return false;
    } finally {
      // إزالة الإعلان من قائمة المعالجة
      if (this.processingAds && this.processingAds.has(adProcessingKey)) {
        this.processingAds.delete(adProcessingKey);
      }
      
      // تنظيف قائمة المعالجة من المفاتيح القديمة (أكثر من 5 دقائق)
      if (this.processingAds) {
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        for (const key of this.processingAds) {
          const timestamp = parseInt(key.split('_').pop());
          if (timestamp < fiveMinutesAgo) {
            this.processingAds.delete(key);
          }
        }
      }
    }
  }

  // Create ad embed
  createAdEmbed(ad) {
    const embed = new EmbedBuilder()
      .setTitle(ad.title || 'Advertisement')
      .setDescription(ad.content || 'No content')
      .setColor('#3498db')
      .setTimestamp()
      .setFooter({ text: 'Commercial Advertisement' });

    // Only add image if it's a valid URL
    if (ad.imageUrl && this.isValidUrl(ad.imageUrl)) {
      embed.setImage(ad.imageUrl);
    }

    return embed;
  }

  // Create ad buttons
  createAdButtons(ad) {
    const row = new ActionRowBuilder();
    
    if (ad.linkUrl && this.isValidUrl(ad.linkUrl)) {
      row.addComponents(
        new ButtonBuilder()
          .setLabel('Visit Link')
          .setStyle(ButtonStyle.Link)
          .setURL(ad.linkUrl)
          .setEmoji('🔗')
      );
    }

    return row;
  }

  // Validate URL
  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  // Schedule delayed ad
  scheduleAd(serverId, ad) {
    try {
      // فحص أن الإعلان من نوع scheduled فقط
      if (ad.publishType !== 'scheduled') {
        console.log(`⚠️ Ignored non-scheduled ad in scheduleAd: ${ad.title} (type: ${ad.publishType})`);
        return false;
      }
      
      // فحص أن الإعلان مفعل قبل الجدولة
      if (!ad.enabled) {
        console.log(`⚠️ Ignored scheduling disabled ad: ${ad.title}`);
        return false;
      }
      
      if (!ad.scheduledTime) {
        console.log('⚠️ No scheduled time specified for scheduled ad');
        return false;
      }

      // فحص تاريخ انتهاء الصلاحية
      if (ad.expiryDate) {
        const expiryDate = new Date(ad.expiryDate);
        const now = new Date();
        if (now > expiryDate) {
          console.log(`⚠️ Ad expired: ${ad.title} - expired at ${expiryDate.toLocaleString('en-US')}`);
          return false;
        }
      }

      const scheduledDate = new Date(ad.scheduledTime);
      const now = new Date();
      
      if (scheduledDate <= now) {
        console.log('⚠️ Scheduled ad time is in the past, will be sent immediately');
        // إرسال الإعلان فوراً إذا كان الوقت المحدد في الماضي
        setTimeout(async () => {
          await this.sendImmediateAd(serverId, ad);
          // تعطيل الإعلان بعد الإرسال
          await this.disableAdAfterPublish(serverId, ad.id, 'scheduled');
        }, 1000); // تأخير بسيط لضمان المعالجة السليمة
        return true;
      }

      // التحقق من نوع الجدولة
      if (ad.scheduleType === 'recurring') {
        return this.scheduleRecurringAd(serverId, ad);
      }

      // إنشاء مهمة cron للإعلان المؤجل لمرة واحدة
      const cronExpression = this.dateToCron(scheduledDate);
      
      if (!cronExpression) {
        console.log(`❌ Cannot schedule ad: ${ad.title} - invalid time`);
        return false;
      }
      
      console.log(`📋 Scheduling ad: ${ad.title}`);
      console.log(`📅 Scheduled time: ${scheduledDate.toLocaleString('en-US')}`);
      console.log(`🕐 Current time: ${now.toLocaleString('en-US')}`);
      console.log(`⚙️ Cron expression: ${cronExpression}`);
      
      const job = cron.schedule(cronExpression, async () => {
        const executionTime = new Date();
        console.log(`⏰ Time to send delayed ad: ${ad.title}`);
        console.log(`🕐 Actual execution time: ${executionTime.toLocaleString('en-US')}`);
        console.log(`📅 Scheduled time: ${scheduledDate.toLocaleString('en-US')}`);
        
        // فحص أن الإعلان ما زال مفعلاً عند وقت التنفيذ
        if (!ad.enabled) {
          console.log(`⚠️ Scheduled ad cancelled because it's disabled: ${ad.title}`);
          this.scheduledAds.delete(ad.id);
          job.destroy();
          return;
        }
        
        // التحقق من أن الإعلان لم يتم نشره مسبقاً
        if (!this.publishedAds.has(serverId)) {
          this.publishedAds.set(serverId, new Set());
        }
        const publishedAdsSet = this.publishedAds.get(serverId);
        
        if (publishedAdsSet.has(ad.id)) {
          console.log(`ℹ️ Ad already published: ${ad.title}`);
          this.scheduledAds.delete(ad.id);
          job.destroy();
          return;
        }
        
        // التحقق من cooldown قبل الإرسال
        const canSend = this.canSendAd(serverId);
        if (!canSend.canSend) {
          console.log(`⚠️ Cannot send ad: ${canSend.reason}`);
          // إعادة جدولة الإعلان بعد انتهاء cooldown
          this.rescheduleAfterCooldown(serverId, ad);
          return;
        }

        await this.sendImmediateAd(serverId, ad);
        
        // تعطيل الإعلان تلقائياً بعد النشر للإعلانات المجدولة
        await this.disableAdAfterPublish(serverId, ad.id, 'scheduled');
        
        // تسجيل الإعلان كمنشور
        publishedAdsSet.add(ad.id);
        
        // تعطيل الإعلان تلقائياً بعد النشر لمنع التكرار
        await this.disableAdAfterPublish(serverId, ad.id, 'scheduled');
        
        // إزالة المهمة بعد التنفيذ
        this.scheduledAds.delete(ad.id);
        job.destroy();
        
        console.log(`✅ Scheduled ad sent and automatically disabled: ${ad.title}`);
      }, {
        scheduled: false
      });

      job.start();
      
      // حفظ المهمة المجدولة مع معلومات إضافية
      this.scheduledAds.set(ad.id, {
        job: job,
        scheduledTime: scheduledDate,
        adTitle: ad.title,
        serverId: serverId,
        cronExpression: cronExpression,
        createdAt: new Date()
      });
      
      // تسجيل معلومات الإعلان المجدول
      this.logScheduledAd(serverId, ad, scheduledDate, cronExpression);
      
      console.log(`✅ Ad scheduled successfully: ${ad.title}`);
      console.log(`📅 Will be sent at: ${scheduledDate.toLocaleString('en-US')}`);
      console.log(`🆔 Ad ID: ${ad.id}`);
      return true;
    } catch (error) {
      console.error('❌ Error scheduling ad:', error);
      return false;
    }
  }

  // Schedule recurring ad
  scheduleRecurringAd(serverId, ad) {
    try {
      // فحص أن الإعلان مفعل قبل الجدولة
      if (!ad.enabled) {
        console.log(`⚠️ Ignored scheduling disabled recurring ad: ${ad.title}`);
        return false;
      }
      
      let cronExpression;
      
      switch (ad.recurringType) {
        case 'daily':
          const dailyTime = new Date(ad.scheduledTime);
          cronExpression = `${dailyTime.getMinutes()} ${dailyTime.getHours()} * * *`;
          break;
        case 'weekly':
          const weeklyTime = new Date(ad.scheduledTime);
          const dayOfWeek = weeklyTime.getDay();
          cronExpression = `${weeklyTime.getMinutes()} ${weeklyTime.getHours()} * * ${dayOfWeek}`;
          break;
        case 'monthly':
          const monthlyTime = new Date(ad.scheduledTime);
          cronExpression = `${monthlyTime.getMinutes()} ${monthlyTime.getHours()} ${monthlyTime.getDate()} * *`;
          break;
        case 'custom':
          cronExpression = ad.customCron || '0 12 * * *'; // افتراضي: يومياً في الظهر
          break;
        default:
          console.log('⚠️ Unsupported recurring type');
          return false;
      }

      const job = cron.schedule(cronExpression, async () => {
        console.log(`🔄 Time to send recurring ad: ${ad.title}`);
        
        // فحص أن الإعلان ما زال مفعلاً عند وقت التنفيذ
        if (!ad.enabled) {
          console.log(`⚠️ Recurring ad stopped because it's disabled: ${ad.title}`);
          job.destroy();
          this.scheduledAds.delete(`${ad.id}_recurring`);
          return;
        }
        
        // فحص تاريخ انتهاء الصلاحية - فحص مضاعف للأمان
        if (ad.expiryDate) {
          const expiryDate = new Date(ad.expiryDate);
          const now = new Date();
          if (now >= expiryDate) {
            console.log(`⚠️ Recurring ad expired: ${ad.title} - expired at ${expiryDate.toLocaleString('en-US')}`);
            // إيقاف المهمة المتكررة
            job.destroy();
            this.scheduledAds.delete(`${ad.id}_recurring`);
            // إزالة من قائمة المنشورة
            if (this.publishedAds.has(serverId)) {
              this.publishedAds.get(serverId).delete(ad.id);
            }
            console.log(`🗑️ Expired recurring ad stopped and cleaned up: ${ad.title}`);
            return;
          }
        }
        
        // التحقق من cooldown قبل الإرسال
        const canSend = this.canSendAd(serverId);
        if (!canSend.canSend) {
          console.log(`⚠️ Cannot send recurring ad: ${canSend.reason}`);
          return;
        }

        await this.sendImmediateAd(serverId, ad);
        
        // تعطيل الإعلان تلقائياً بعد النشر للإعلانات المتكررة أيضاً
        await this.disableAdAfterPublish(serverId, ad.id);
      }, {
        scheduled: false
      });

      job.start();
      
      // حفظ المهمة المتكررة مع معلومات إضافية
      this.scheduledAds.set(`${ad.id}_recurring`, {
        job: job,
        scheduledTime: new Date(ad.scheduledTime),
        adTitle: ad.title,
        serverId: serverId,
        cronExpression: cronExpression,
        recurringType: ad.recurringType,
        createdAt: new Date()
      });
      
      console.log(`🔄 Recurring ad scheduled successfully: ${ad.title}`);
      console.log(`📅 Recurring type: ${ad.recurringType}`);
      console.log(`🆔 Ad ID: ${ad.id}`);
      return true;
    } catch (error) {
      console.error('❌ Error scheduling recurring ad:', error);
      return false;
    }
  }

  // Reschedule ad after cooldown period
  rescheduleAfterCooldown(serverId, ad) {
    const settings = this.getServerSettings(serverId);
    const cooldownMs = (settings.cooldownMinutes || 30) * 60 * 1000;
    const newScheduledTime = new Date(Date.now() + cooldownMs + 60000); // إضافة دقيقة إضافية للأمان
    
    const updatedAd = { ...ad, scheduledTime: newScheduledTime.toISOString() };
    
    setTimeout(() => {
      this.scheduleAd(serverId, updatedAd);
    }, cooldownMs + 60000);
    
    console.log(`⏰ Ad rescheduled after cooldown: ${newScheduledTime.toLocaleString('ar-SA')}`);
  }

  // Convert date to cron expression - FIXED VERSION
  dateToCron(date) {
    const minute = date.getMinutes();
    const hour = date.getHours();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const now = new Date();
    const timeDiff = date.getTime() - now.getTime();
    
    // فحص أن الوقت في المستقبل
    if (timeDiff <= 0) {
      console.log(`⚠️ Cannot schedule ad in the past: ${date.toLocaleString('en-US')} (current: ${now.toLocaleString('en-US')})`);
      return null;
    }
    
    // إنشاء تعبير cron للأوقات المستقبلية (إزالة قيد 24 ساعة)
    const cronExpression = `${minute} ${hour} ${day} ${month} *`;
    console.log(`📅 Created cron expression: ${cronExpression} for date: ${date.toLocaleString('en-US')}`);
    console.log(`⏰ Time difference: ${Math.round(timeDiff / (1000 * 60))} minutes from now`);
    
    return cronExpression;
  }

  // Reschedule all ads
  rescheduleAds(serverId, ads) {
    // إلغاء الإعلانات المجدولة السابقة لهذا السيرفر
    for (const [adId, jobData] of this.scheduledAds.entries()) {
      if (adId.startsWith(serverId) || adId.includes(`_${serverId}_`) || 
          (jobData.serverId && jobData.serverId === serverId)) {
        try {
          if (jobData && jobData.job && typeof jobData.job.destroy === 'function') {
            jobData.job.destroy();
          } else if (jobData && jobData.job && typeof jobData.job.cancel === 'function') {
            jobData.job.cancel();
          } else if (jobData && typeof jobData.destroy === 'function') {
            jobData.destroy();
          }
        } catch (error) {
          console.warn(`⚠️ Error cancelling scheduled job ${adId}:`, error.message);
        }
        this.scheduledAds.delete(adId);
        console.log(`🗑️ Scheduled ad cancelled: ${jobData?.adTitle || adId}`);
      }
    }

    // جدولة الإعلانات الجديدة
    ads.forEach(ad => {
      if (ad.publishType === 'scheduled' && (ad.status === 'scheduled' || ad.status === 'pending') && ad.enabled) {
        // فحص تاريخ انتهاء الصلاحية قبل الجدولة
        if (ad.expiryDate) {
          const expiryDate = new Date(ad.expiryDate);
          const now = new Date();
          if (now > expiryDate) {
            console.log(`⚠️ Ignored rescheduling expired ad: ${ad.title} - expired at ${expiryDate.toLocaleString('en-US')}`);
            return;
          }
        }
        
        // فحص إضافي للتأكد من أن الإعلان مفعل
        if (!ad.enabled) {
          console.log(`⚠️ Ignored scheduling disabled ad: ${ad.title}`);
          return;
        }
        
        this.scheduleAd(serverId, ad);
      } else if (ad.publishType === 'scheduled' && !ad.enabled) {
        console.log(`⚠️ Ignored disabled scheduled ad: ${ad.title}`);
      }
    });

    console.log(`🔄 Rescheduled ${ads.filter(ad => ad.publishType === 'scheduled').length} ads for server: ${serverId}`);
  }

  // Enhanced cooldown system with advanced settings
  canSendAd(serverId, adType = 'normal') {
    const settings = this.getServerSettings(serverId);
    
    if (!settings.enabled) {
      return { canSend: false, reason: 'Ads system is disabled' };
    }

    const now = Date.now();
    const lastAdTime = this.cooldowns.get(serverId) || 0;
    
    // Different cooldown based on ad type
    let cooldownMinutes = settings.cooldownMinutes || 30;
    if (adType === 'recurring') {
      cooldownMinutes = Math.max(cooldownMinutes / 2, 5); // Lower cooldown for recurring ads
    } else if (adType === 'priority') {
      cooldownMinutes = Math.max(cooldownMinutes / 3, 2); // Lower cooldown for priority ads
    }
    
    const cooldownMs = cooldownMinutes * 60 * 1000;
    
    if (now - lastAdTime < cooldownMs) {
      const remainingTime = Math.ceil((cooldownMs - (now - lastAdTime)) / 60000);
      return { 
        canSend: false, 
        reason: `Must wait ${remainingTime} minutes before next ad`,
        remainingTime: remainingTime
      };
    }

    // Check daily limit with exceptions for priority ads
    const todayAds = this.getTodayAdsCount(serverId);
    const dailyLimit = settings.dailyLimit || 5;
    
    if (adType !== 'priority' && todayAds >= dailyLimit) {
      return { 
        canSend: false, 
        reason: `Daily limit reached (${dailyLimit} ads)`,
        dailyCount: todayAds,
        dailyLimit: dailyLimit
      };
    }

    // Check weekly limit for recurring ads
    if (adType === 'recurring') {
      const weeklyAds = this.getWeeklyAdsCount(serverId);
      const weeklyLimit = settings.weeklyLimit || 20;
      
      if (weeklyAds >= weeklyLimit) {
        return {
          canSend: false,
          reason: `Weekly recurring ads limit reached (${weeklyLimit} ads)`,
          weeklyCount: weeklyAds,
          weeklyLimit: weeklyLimit
        };
      }
    }

    return { canSend: true };
  }

  // Get weekly ads count
  getWeeklyAdsCount(serverId) {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weeklyKey = `${serverId}_weekly`;
    const weeklyData = this.cooldowns.get(weeklyKey) || [];
    
    // Clean old data
    const recentAds = weeklyData.filter(timestamp => timestamp > oneWeekAgo);
    this.cooldowns.set(weeklyKey, recentAds);
    
    return recentAds.length;
  }

  // Record sent ad with enhancements
  recordAdSent(serverId, adType = 'normal') {
    const now = Date.now();
    const today = new Date().toDateString();
    
    // Update last ad time
    this.cooldowns.set(serverId, now);
    
    // Update daily counter
    const dailyKey = `${serverId}_daily`;
    const dailyCount = this.cooldowns.get(dailyKey) || {};
    dailyCount[today] = (dailyCount[today] || 0) + 1;
    this.cooldowns.set(dailyKey, dailyCount);
    
    // Update weekly counter for recurring ads
    if (adType === 'recurring') {
      const weeklyKey = `${serverId}_weekly`;
      const weeklyData = this.cooldowns.get(weeklyKey) || [];
      weeklyData.push(now);
      this.cooldowns.set(weeklyKey, weeklyData);
    }
    
    console.log(`📊 Recorded ${adType} ad for server: ${serverId}`);
  }

  // Update ad statistics
  updateAdStats(adId, type) {
    const stats = this.adStats.get(adId) || { views: 0, clicks: 0, lastUpdated: Date.now() };
    
    if (type === 'view') {
      stats.views++;
    } else if (type === 'click') {
      stats.clicks++;
    }
    
    stats.lastUpdated = Date.now();
    this.adStats.set(adId, stats);
  }

  // Clean old statistics
  cleanupOldStats() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const [adId, stats] of this.adStats.entries()) {
      if (stats.lastUpdated && stats.lastUpdated < oneWeekAgo) {
        this.adStats.delete(adId);
      }
    }
    
    console.log('🧹 Old ad statistics cleaned up');
  }

  // Clean up expired ads and their scheduled jobs
  cleanupExpiredAds() {
    const now = new Date();
    let cleanedCount = 0;
    
    // Clean up scheduled jobs for expired ads
    for (const [adId, jobData] of this.scheduledAds.entries()) {
      const job = jobData.job || jobData;
      // Extract server settings to check for expired ads
      for (const [serverId, settings] of this.serverSettings.entries()) {
        if (settings.ads) {
          const expiredAd = settings.ads.find(ad => {
            if (ad.id && adId.includes(ad.id)) {
              // Check expiryDate
              if (ad.expiryDate) {
                const expiryDate = new Date(ad.expiryDate);
                if (now > expiryDate) return true;
              }
              // Check scheduledTime for scheduled ads
              if (ad.status === 'scheduled' && ad.scheduledTime) {
                const scheduledTime = new Date(ad.scheduledTime);
                if (now > scheduledTime) return true;
              }
              // Check published ads that should be disabled
              if (ad.status === 'published' && ad.enabled) {
                return true;
              }
            }
            return false;
          });
          
          if (expiredAd) {
            console.log(`🗑️ Stopping scheduled task for expired ad: ${expiredAd.title}`);
            if (job && typeof job.destroy === 'function') {
              job.destroy();
            }
            this.scheduledAds.delete(adId);
            cleanedCount++;
            break;
          }
        }
      }
    }
    
    // Additional cleanup: Remove expired ads from published ads tracking
    for (const [serverId, publishedAdsSet] of this.publishedAds.entries()) {
      const settings = this.serverSettings.get(serverId);
      if (settings && settings.ads) {
        const expiredAdIds = settings.ads
          .filter(ad => {
            // Check expiryDate
            if (ad.expiryDate) {
              const expiryDate = new Date(ad.expiryDate);
              if (now > expiryDate) return true;
            }
            // Check scheduledTime for scheduled ads
            if (ad.status === 'scheduled' && ad.scheduledTime) {
              const scheduledTime = new Date(ad.scheduledTime);
              if (now > scheduledTime) return true;
            }
            // Check published ads that should be disabled
            if (ad.status === 'published' && ad.enabled) {
              return true;
            }
            return false;
          })
          .map(ad => ad.id);
        
        expiredAdIds.forEach(adId => {
          if (publishedAdsSet.has(adId)) {
            publishedAdsSet.delete(adId);
            console.log(`🗑️ Removing expired ad from published list: ${adId}`);
          }
        });
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} scheduled tasks for expired ads`);
    }
  }

  // Process ads when updating settings
  async processAdsUpdate(serverId, adsData) {
    try {
      console.log(`🎯 Processing ads update for server: ${serverId}`);
      
      if (!adsData || !adsData.ads) {
        console.log('⚠️ No ads data to process');
        return;
      }

      const { enabled, ads } = adsData;
      
      // Update settings
      this.updateServerSettings(serverId, adsData);
      
      if (!enabled) {
        console.log('📴 Ads system disabled for this server');
        return;
      }

      // Get or create published ads set for this server
      if (!this.publishedAds.has(serverId)) {
        this.publishedAds.set(serverId, new Set());
      }
      const publishedAdsSet = this.publishedAds.get(serverId);

      // فصل معالجة الإعلانات الفورية والمجدولة لمنع التداخل
      await this.processImmediateAds(serverId, ads, publishedAdsSet);
      await this.processScheduledAds(serverId, ads);
      
    } catch (error) {
      console.error('❌ Error processing ads update:', error);
    }
  }
  
  // معالجة الإعلانات الفورية منفصلة
  async processImmediateAds(serverId, ads, publishedAdsSet) {
    try {
      console.log(`⚡ Processing immediate ads for server: ${serverId}`);
      
      // Process immediate ads directly - send all new enabled ads
      const immediateAds = ads.filter(ad => {
        // فحص الشروط الأساسية
        if (ad.publishType !== 'immediate' || 
            (ad.status !== 'published' && ad.status !== 'pending') ||
            !ad.enabled) {
          console.log(`⚠️ Ignored immediate ad: ${ad.title} - Reason: publishType=${ad.publishType}, status=${ad.status}, enabled=${ad.enabled}`);
          return false;
        }
        
        // تجاهل الإعلانات التي تم نشرها بالفعل
        if (publishedAdsSet.has(ad.id)) {
          console.log(`⚠️ Ignored already published ad: ${ad.title}`);
          return false;
        }
        
        // فحص تاريخ انتهاء الصلاحية
        if (ad.expiryDate) {
          const expiryDate = new Date(ad.expiryDate);
          const now = new Date();
          if (now >= expiryDate) {
            console.log(`⚠️ Ignored expired immediate ad: ${ad.title} - expired at ${expiryDate.toLocaleString('en-US')}`);
            return false;
          }
        }
        
        console.log(`✅ New immediate ad ready for publishing: ${ad.title}`);
        return true;
      });

      // Sort by creation time and send all new ads
      const sortedImmediateAds = immediateAds
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      if (sortedImmediateAds.length > 0) {
        console.log(`🚀 Sending ${sortedImmediateAds.length} immediate ads`);
        
        for (const ad of sortedImmediateAds) {
          console.log(`📤 Sending immediate ad: ${ad.title}`);
          const success = await this.sendImmediateAdDirect(serverId, ad);
          if (success) {
            // Mark ad as published
            publishedAdsSet.add(ad.id);
            
            // Update ad status from pending to published if needed
            if (ad.status === 'pending') {
              await this.updateAdStatusToPublished(serverId, ad.id);
            }
            
            console.log(`✅ Successfully sent immediate ad: ${ad.title}`);
            
            // تأخير بسيط بين الإعلانات لتجنب مشاكل المعدل
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } else {
        console.log(`ℹ️ No new immediate ads to send`);
      }
    } catch (error) {
      console.error('❌ Error processing immediate ads:', error);
    }
  }
  
  // معالجة الإعلانات المجدولة منفصلة
  async processScheduledAds(serverId, ads) {
    try {
      console.log(`📅 Processing scheduled ads for server: ${serverId}`);
      
      // إعادة جدولة الإعلانات المجدولة فقط
      const scheduledAds = ads.filter(ad => ad.publishType === 'scheduled');
      
      if (scheduledAds.length > 0) {
        console.log(`🔄 Rescheduling ${scheduledAds.length} scheduled ads`);
        this.rescheduleAds(serverId, scheduledAds);
      } else {
        console.log(`ℹ️ No scheduled ads to process`);
      }
    } catch (error) {
      console.error('❌ Error processing scheduled ads:', error);
    }
  }

  // Get ad statistics
  getAdStats(adId) {
    return this.adStats.get(adId) || { views: 0, clicks: 0 };
  }

  // Get all statistics
  getAllStats() {
    const stats = {};
    for (const [adId, data] of this.adStats.entries()) {
      stats[adId] = data;
    }
    return stats;
  }

  // Clear published ad status (when ad is deleted or modified)
  clearPublishedStatus(serverId, adId) {
    if (this.publishedAds.has(serverId)) {
      this.publishedAds.get(serverId).delete(adId);
      console.log(`🗑️ Cleared published status for ad: ${adId}`);
    }
  }

  // Check if ad is already published
  isAdPublished(serverId, adId) {
    if (!this.publishedAds.has(serverId)) {
      return false;
    }
    return this.publishedAds.get(serverId).has(adId);
  }

  // Get published ads for a server
  getPublishedAds(serverId) {
    if (!this.publishedAds.has(serverId)) {
      return [];
    }
    return Array.from(this.publishedAds.get(serverId));
  }

  // Clean up old message hashes and records
  cleanupOldMessageHashes() {
    try {
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      const now = Date.now();
      
      let cleanedCount = 0;
      
      // Clean up old message records based on timestamp
      for (const [serverId, serverMessages] of this.sentMessages.entries()) {
        for (const [adId, messages] of serverMessages.entries()) {
          if (Array.isArray(messages)) {
            // Filter out old messages
            const filteredMessages = messages.filter(msg => {
              if (typeof msg === 'object' && msg.timestamp) {
                return (now - msg.timestamp) < maxAge;
              }
              // Keep old format messages for compatibility
              return true;
            });
            
            if (filteredMessages.length !== messages.length) {
              serverMessages.set(adId, filteredMessages);
              cleanedCount += messages.length - filteredMessages.length;
            }
          }
        }
      }
      
      // Clean up message hashes based on message age, not count
      for (const [serverId, serverHashes] of this.messageHashes.entries()) {
        const hashesToDelete = [];
        
        for (const [hashKey, messageId] of serverHashes.entries()) {
          try {
            // البحث عن الرسالة في سجل الرسائل المرسلة
            const serverMessages = this.sentMessages.get(serverId);
            if (serverMessages) {
              let messageFound = false;
              for (const [adId, messages] of serverMessages.entries()) {
                if (Array.isArray(messages)) {
                  const messageRecord = messages.find(msg => msg.messageId === messageId);
                  if (messageRecord && messageRecord.timestamp) {
                    // إذا كانت الرسالة أقدم من 24 ساعة، احذف المفتاح
                    if ((now - messageRecord.timestamp) >= maxAge) {
                      hashesToDelete.push(hashKey);
                    }
                    messageFound = true;
                    break;
                  }
                }
              }
              // إذا لم نجد الرسالة في السجل، احذف المفتاح
              if (!messageFound) {
                hashesToDelete.push(hashKey);
              }
            } else {
              // إذا لم يكن هناك سجل للسيرفر، احذف المفتاح
              hashesToDelete.push(hashKey);
            }
          } catch (error) {
            // في حالة حدوث خطأ، احذف المفتاح
            hashesToDelete.push(hashKey);
          }
        }
        
        // حذف المفاتيح القديمة
        hashesToDelete.forEach(key => serverHashes.delete(key));
        
        if (hashesToDelete.length > 0) {
          console.log(`🧹 Cleaned up ${hashesToDelete.length} old hashes for server ${serverId}`);
          cleanedCount += hashesToDelete.length;
        }
      }
      
      console.log(`🧹 Cleaned up ${cleanedCount} old messages from memory`);
    } catch (error) {
      console.error('❌ Error cleaning message data:', error);
    }
  }

  // Create content hash for duplicate detection
  createContentHash(ad) {
    const crypto = require('crypto');
    const content = `${ad.title || ''}|${ad.content || ''}|${ad.linkUrl || ''}`;
    return crypto.createHash('md5').update(content).digest('hex');
  }

  // حذف جميع الرسائل المكررة لإعلان معين من جميع القنوات
  async removeAllDuplicatesForAd(guild, ad) {
    try {
      const serverId = guild.id;
      const contentHash = this.createContentHash(ad);
      
      if (!this.messageHashes.has(serverId)) {
        return;
      }
      
      const serverHashes = this.messageHashes.get(serverId);
      const messagesToDelete = [];
      
      // البحث عن جميع الرسائل المكررة في جميع القنوات
      for (const [key, messageId] of serverHashes.entries()) {
        if (key.includes(contentHash)) {
          const channelId = key.split('_')[0];
          messagesToDelete.push({ channelId, messageId, key });
        }
      }
      
      // حذف الرسائل المكررة
      for (const { channelId, messageId, key } of messagesToDelete) {
        try {
          const channel = guild.channels.cache.get(channelId);
          if (channel && channel.isTextBased()) {
            const message = await channel.messages.fetch(messageId).catch(() => null);
            if (message && message.author.id === guild.members.me.id) {
              await message.delete();
              console.log(`🗑️ Removed duplicate ad from channel ${channel.name}`);
              // إزالة المفتاح من الذاكرة
              serverHashes.delete(key);
            }
          }
        } catch (deleteError) {
          console.log(`⚠️ Could not delete duplicate in channel ${channelId}: ${deleteError.message}`);
        }
      }
      
      console.log(`✅ Cleaned up ${messagesToDelete.length} duplicate messages for ad: ${ad.title}`);
    } catch (error) {
      console.error('❌ Error removing duplicates for ad:', error);
    }
  }

  // Check and delete duplicate messages per channel
  async deleteDuplicateMessages(guild, ad, newMessageId, currentChannelId) {
    try {
      const serverId = guild.id;
      const contentHash = this.createContentHash(ad);
      
      // Initialize maps if they don't exist
      if (!this.messageHashes.has(serverId)) {
        this.messageHashes.set(serverId, new Map());
      }
      if (!this.sentMessages.has(serverId)) {
        this.sentMessages.set(serverId, new Map());
      }
      
      const serverHashes = this.messageHashes.get(serverId);
      const serverMessages = this.sentMessages.get(serverId);
      
      // Create unique key for content + channel combination
      const channelContentKey = `${currentChannelId}_${contentHash}`;
      
      // Check if this content was already sent in THIS specific channel
      if (serverHashes.has(channelContentKey)) {
        const existingMessageId = serverHashes.get(channelContentKey);
        
        // Try to find and delete the old message in the current channel only
        const currentChannel = guild.channels.cache.get(currentChannelId);
        if (currentChannel && currentChannel.isTextBased()) {
          try {
            const existingMessage = await currentChannel.messages.fetch(existingMessageId).catch(() => null);
            if (existingMessage) {
              await existingMessage.delete();
              console.log(`🗑️ Deleted duplicate message: ${existingMessageId} in channel ${currentChannel.name}`);
            }
          } catch (error) {
            console.log(`⚠️ Cannot delete duplicate message in channel ${currentChannel.name}: ${error.message}`);
          }
        }
      }
      
      // Store the new message hash and ID with channel-specific key
      serverHashes.set(channelContentKey, newMessageId);
      
      // Store message ID for this ad
      if (!serverMessages.has(ad.id)) {
        serverMessages.set(ad.id, []);
      }
      serverMessages.get(ad.id).push({
        messageId: newMessageId,
        channelId: currentChannelId,
        timestamp: Date.now()
      });
      
      // Clean up old message records (keep only last 20 messages per ad)
      const adMessages = serverMessages.get(ad.id);
      if (adMessages.length > 20) {
        adMessages.splice(0, adMessages.length - 20);
      }
      
    } catch (error) {
      console.error('❌ Error checking and deleting duplicate messages:', error);
    }
  }

  // Disable ad automatically after publishing and collapse buttons
  async disableAdAfterPublish(serverId, adId, adType = 'scheduled') {
    try {
      // فقط تعطيل الإعلانات المجدولة تلقائياً، وليس الفورية
      if (adType === 'immediate') {
        console.log(`ℹ️ Skipping auto-disable for immediate ad: ${adId}`);
        return true;
      }
      
      const fetch = require('node-fetch');
      
      // إرسال طلب لتعطيل الإعلان عبر API الموقع
      const apiUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/ads/disable`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bot-request': 'true'
        },
        body: JSON.stringify({
          serverId: serverId,
          adId: adId
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Ad automatically disabled after publishing: ${adId}`);
        
        // طي الكروت (تعطيل الأزرار) في جميع الرسائل المرسلة لهذا الإعلان
        await this.collapseAdButtons(serverId, adId);
        
        return true;
      } else {
        const errorText = await response.text();
        console.log(`⚠️ Failed to disable ad via API: ${errorText}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error automatically disabling ad:', error);
      return false;
    }
  }

  // Store sent message for later button collapse
  storeSentMessage(serverId, adId, messageId, channelId) {
    try {
      if (!this.sentMessages.has(serverId)) {
        this.sentMessages.set(serverId, new Map());
      }
      
      const serverMessages = this.sentMessages.get(serverId);
      if (!serverMessages.has(adId)) {
        serverMessages.set(adId, []);
      }
      
      const adMessages = serverMessages.get(adId);
      adMessages.push({
        messageId: messageId,
        channelId: channelId,
        timestamp: Date.now()
      });
      
      console.log(`💾 Saved message ID ${messageId} for ad ${adId} in channel ${channelId}`);
    } catch (error) {
      console.error('❌ Error saving message ID:', error);
    }
  }

  // Collapse ad buttons after publishing
  async collapseAdButtons(serverId, adId) {
    try {
      const guild = this.client.guilds.cache.get(serverId);
      if (!guild) {
        console.log(`⚠️ Cannot find server for collapsing cards: ${serverId}`);
        return false;
      }

      // البحث عن الرسائل المرسلة لهذا الإعلان
      if (!this.sentMessages.has(serverId)) {
        console.log(`ℹ️ No sent messages to collapse cards in server: ${serverId}`);
        return false;
      }

      const serverMessages = this.sentMessages.get(serverId);
      if (!serverMessages.has(adId)) {
        console.log(`ℹ️ No sent messages to collapse cards for ad: ${adId}`);
        return false;
      }

      const adMessages = serverMessages.get(adId);
      let collapsedCount = 0;

      for (const messageData of adMessages) {
        try {
          const messageId = typeof messageData === 'object' ? messageData.messageId : messageData;
          const channelId = typeof messageData === 'object' ? messageData.channelId : null;
          
          if (!messageId) continue;

          // البحث عن القناة والرسالة
          let channel = null;
          let message = null;

          if (channelId) {
            channel = guild.channels.cache.get(channelId);
            if (channel && channel.isTextBased()) {
              try {
                message = await channel.messages.fetch(messageId);
              } catch (fetchError) {
                console.log(`⚠️ Cannot find message ${messageId} in channel ${channelId}`);
                continue;
              }
            }
          } else {
            // البحث في جميع القنوات النصية إذا لم يكن معرف القناة متوفراً
            for (const [, guildChannel] of guild.channels.cache) {
              if (guildChannel.isTextBased()) {
                try {
                  message = await guildChannel.messages.fetch(messageId);
                  channel = guildChannel;
                  break;
                } catch (fetchError) {
                  // تجاهل الأخطاء والمتابعة للقناة التالية
                  continue;
                }
              }
            }
          }

          if (message && message.author.id === this.client.user.id) {
            // إنشاء كروت معطلة (بدون أزرار)
            const disabledComponents = [];
            
            // تحديث الرسالة لإزالة الأزرار
            await message.edit({
              embeds: message.embeds,
              components: disabledComponents
            });
            
            collapsedCount++;
            console.log(`✅ Collapsed cards for message ${messageId} in channel ${channel.name}`);
          }
        } catch (messageError) {
          console.error(`❌ Error collapsing message cards:`, messageError);
        }
      }

      if (collapsedCount > 0) {
        console.log(`✅ Collapsed cards for ${collapsedCount} messages for ad: ${adId}`);
      } else {
        console.log(`ℹ️ No messages found to collapse cards for ad: ${adId}`);
      }

      return collapsedCount > 0;
    } catch (error) {
      console.error('❌ Error collapsing ad cards:', error);
      return false;
    }
  }

  // Update ad status from pending to published
  async updateAdStatusToPublished(serverId, adId) {
    try {
      const { saveServerData, getServerData } = require('./database.js');
      
      // Get current server data
      const serverData = await getServerData(serverId);
      if (!serverData || !serverData.ads || !serverData.ads.ads) {
        console.error(`❌ No server data found for ${serverId}`);
        return false;
      }
      
      // Find and update the ad
      const adIndex = serverData.ads.ads.findIndex(ad => ad.id === adId);
      if (adIndex === -1) {
        console.error(`❌ Ad ${adId} not found in server ${serverId}`);
        return false;
      }
      
      // Update ad status and publishedAt timestamp
      serverData.ads.ads[adIndex].status = 'published';
      serverData.ads.ads[adIndex].publishedAt = new Date().toISOString();
      
      // Save updated data
      await saveServerData(serverId, serverData, 'bot-system');
      console.log(`✅ Updated ad ${adId} status to published for server ${serverId}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Error updating ad status:`, error);
      return false;
    }
  }

  // دوال المراقبة والتسجيل المفصلة
  logScheduledAd(serverId, ad, scheduledDate, cronExpression) {
    const logEntry = {
      serverId,
      adId: ad.id,
      adTitle: ad.title,
      scheduledDate: scheduledDate.toISOString(),
      cronExpression,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };
    
    this.scheduledAdsLog.set(ad.id, logEntry);
    
    if (this.debugMode) {
      console.log('📋 Scheduled Ad Log Entry:', JSON.stringify(logEntry, null, 2));
    }
  }

  // الحصول على سجل الإعلانات المجدولة
  getScheduledAdsLog(serverId = null) {
    if (!serverId) {
      return Array.from(this.scheduledAdsLog.values());
    }
    
    return Array.from(this.scheduledAdsLog.values())
      .filter(log => log.serverId === serverId);
  }

  // الحصول على معلومات الإعلانات المجدولة النشطة
  getActiveScheduledAds() {
    const activeAds = [];
    
    for (const [adId, jobData] of this.scheduledAds.entries()) {
      const logEntry = this.scheduledAdsLog.get(adId);
      activeAds.push({
        adId,
        serverId: jobData.serverId,
        adTitle: jobData.adTitle,
        scheduledTime: jobData.scheduledTime,
        cronExpression: jobData.cronExpression,
        createdAt: jobData.createdAt,
        logEntry
      });
    }
    
    return activeAds;
  }

  // طباعة تقرير مفصل عن الإعلانات المجدولة
  printScheduledAdsReport(serverId = null) {
    console.log('\n📊 ===== تقرير الإعلانات المجدولة =====');
    
    const activeAds = this.getActiveScheduledAds();
    const filteredAds = serverId ? activeAds.filter(ad => ad.serverId === serverId) : activeAds;
    
    if (filteredAds.length === 0) {
      console.log('ℹ️ لا توجد إعلانات مجدولة نشطة');
      return;
    }
    
    filteredAds.forEach((ad, index) => {
      console.log(`\n${index + 1}. ${ad.adTitle}`);
      console.log(`   🆔 Ad ID: ${ad.adId}`);
      console.log(`   🏠 Server ID: ${ad.serverId}`);
      console.log(`   📅 Scheduled Time: ${ad.scheduledTime?.toLocaleString('en-US')}`);
      console.log(`   ⚙️ Cron Expression: ${ad.cronExpression}`);
      console.log(`   🕐 Created At: ${ad.createdAt?.toLocaleString('en-US')}`);
    });
    
    console.log(`\n📈 إجمالي الإعلانات المجدولة النشطة: ${filteredAds.length}`);
    console.log('=======================================\n');
  }

  // آلية تنظيف الإعلانات المنتهية الصلاحية
  cleanupExpiredScheduledAds() {
    const now = new Date();
    let cleanedCount = 0;
    
    // تنظيف الإعلانات المجدولة المنتهية الصلاحية
    for (const [adId, jobData] of this.scheduledAds.entries()) {
      if (jobData.scheduledTime && jobData.scheduledTime < now) {
        // التحقق من أن الإعلان لم يتم نشره بعد
        const logEntry = this.scheduledAdsLog.get(adId);
        if (logEntry && logEntry.status !== 'published') {
          // إلغاء المهمة المجدولة
          if (jobData.job) {
            jobData.job.destroy();
          }
          
          // حذف الإعلان من الذاكرة
          this.scheduledAds.delete(adId);
          this.scheduledAdsLog.delete(adId);
          
          cleanedCount++;
          
          if (this.debugMode) {
            console.log(`🗑️ تم حذف إعلان منتهي الصلاحية: ${adId} من السيرفر ${jobData.serverId}`);
          }
        }
      }
    }
    
    // تنظيف سجلات الإعلانات القديمة (أكثر من 30 يوم)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    let logsCleaned = 0;
    
    for (const [adId, logEntry] of this.scheduledAdsLog.entries()) {
      if (new Date(logEntry.createdAt) < thirtyDaysAgo) {
        this.scheduledAdsLog.delete(adId);
        logsCleaned++;
      }
    }
    
    if (cleanedCount > 0 || logsCleaned > 0) {
      console.log(`🧹 تنظيف تلقائي: تم حذف ${cleanedCount} إعلان منتهي الصلاحية و ${logsCleaned} سجل قديم`);
    }
    
    return { adsRemoved: cleanedCount, logsRemoved: logsCleaned };
  }

  // بدء آلية التنظيف التلقائي
  startAutoCleanup() {
    // تنظيف كل 6 ساعات
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredScheduledAds();
    }, 6 * 60 * 60 * 1000);
    
    // تنظيف فوري عند البدء
    this.cleanupExpiredScheduledAds();
    
    console.log('🔄 تم تفعيل آلية التنظيف التلقائي للإعلانات المنتهية الصلاحية');
  }

  // إيقاف آلية التنظيف التلقائي
  stopAutoCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('⏹️ تم إيقاف آلية التنظيف التلقائي');
    }
  }
}

module.exports = AdsSystem;