const express = require('express');
const { ChannelType, PermissionFlagsBits } = require('discord.js');
const router = express.Router();

let botInstance = null;

// Set bot instance
function setBotInstance(bot) {
  botInstance = bot;
}

// POST /api/create-log-channels - إنشاء قنوات Log تلقائياً
router.post('/create-log-channels', async (req, res) => {
  try {
    const { serverId, channels } = req.body;
    
    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: 'Server ID is required'
      });
    }
    
    if (!channels || !Array.isArray(channels)) {
      return res.status(400).json({
        success: false,
        error: 'Channels array is required'
      });
    }
    
    if (!botInstance) {
      return res.status(503).json({
        success: false,
        error: 'Bot is not available'
      });
    }
    
    // الحصول على السيرفر
    const guild = botInstance.guilds.cache.get(serverId);
    if (!guild) {
      return res.status(404).json({
        success: false,
        error: 'Server not found or bot is not in this server'
      });
    }
    
    // التحقق من صلاحيات البوت
    const botMember = guild.members.cache.get(botInstance.user.id);
    if (!botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return res.status(403).json({
        success: false,
        error: 'Bot does not have permission to manage channels'
      });
    }
    
    const createdChannels = {};
    const errors = [];
    
    // إنشاء أو العثور على فئة Log
    let logCategory = guild.channels.cache.find(
      channel => channel.type === ChannelType.GuildCategory && 
      (channel.name === 'Log Channels' || channel.name === 'قنوات السجلات')
    );
    
    if (!logCategory) {
      try {
        logCategory = await guild.channels.create({
          name: 'Log Channels',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel]
            },
            {
              id: botInstance.user.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.EmbedLinks
              ]
            }
          ]
        });
        console.log(`✅ تم إنشاء فئة Log Channels في السيرفر ${guild.name}`);
      } catch (error) {
        console.error('❌ خطأ في إنشاء فئة Log:', error);
        return res.status(500).json({
          success: false,
          error: 'فشل في إنشاء فئة Log Channels'
        });
      }
    }
    
    // إنشاء القنوات
    for (const channelInfo of channels) {
      try {
        // التحقق من وجود القناة مسبقاً
        const existingChannel = guild.channels.cache.find(
          channel => channel.name === channelInfo.name && channel.type === ChannelType.GuildText
        );
        
        if (existingChannel) {
          createdChannels[channelInfo.key] = existingChannel.id;
          console.log(`⚠️ القناة ${channelInfo.name} موجودة مسبقاً في السيرفر ${guild.name}`);
          continue;
        }
        
        // إنشاء القناة الجديدة
        const newChannel = await guild.channels.create({
          name: channelInfo.name,
          type: ChannelType.GuildText,
          parent: logCategory.id,
          topic: channelInfo.topic,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages
              ]
            },
            {
              id: botInstance.user.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.AttachFiles
              ]
            }
          ]
        });
        
        createdChannels[channelInfo.key] = newChannel.id;
        console.log(`✅ تم إنشاء قناة ${channelInfo.name} في السيرفر ${guild.name}`);
        
        // إرسال رسالة ترحيب في القناة
        await newChannel.send({
          embeds: [{
            title: `📋 ${channelInfo.name}`,
            description: channelInfo.topic,
            color: 0x00ff00,
            timestamp: new Date(),
            footer: {
              text: 'Auto Log System'
            }
          }]
        });
        
      } catch (error) {
        console.error(`❌ خطأ في إنشاء قناة ${channelInfo.name}:`, error);
        errors.push({
          channel: channelInfo.name,
          error: error.message
        });
      }
    }
    
    // إعداد الاستجابة
    const response = {
      success: Object.keys(createdChannels).length > 0,
      message: `تم إنشاء ${Object.keys(createdChannels).length} قناة من أصل ${channels.length}`,
      data: {
        serverId,
        categoryId: logCategory.id,
        channels: createdChannels,
        errors: errors.length > 0 ? errors : undefined
      }
    };
    
    if (errors.length > 0) {
      response.warning = `حدثت أخطاء في إنشاء ${errors.length} قناة`;
    }
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء قنوات Log:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ داخلي في الخادم'
    });
  }
});

module.exports = { router, setBotInstance };