/**
 * أوامر إدارة إعدادات الصور
 * Image Settings Commands
 */

const { applyImagePreset, getAvailablePresets, validateImageSettings } = require('./image-presets');
const fs = require('fs').promises;
const path = require('path');

/**
 * معالجة أوامر إعدادات الصور
 * Handle image settings commands
 * @param {Message} message - رسالة Discord
 * @param {Array} args - معاملات الأمر
 */
async function handleImageCommands(message, args) {
  if (!message.member.permissions.has('MANAGE_GUILD')) {
    return message.reply('❌ تحتاج إلى صلاحية إدارة السيرفر لاستخدام هذا الأمر.');
  }

  const subCommand = args[0]?.toLowerCase();
  const serverId = message.guild.id;

  switch (subCommand) {
    case 'presets':
    case 'قوالب':
      await showAvailablePresets(message);
      break;
      
    case 'apply':
    case 'تطبيق':
      await applyPresetCommand(message, args.slice(1), serverId);
      break;
      
    case 'status':
    case 'حالة':
      await showCurrentSettings(message, serverId);
      break;
      
    case 'custom':
    case 'مخصص':
      await handleCustomSettings(message, args.slice(1), serverId);
      break;
      
    case 'help':
    case 'مساعدة':
    default:
      await showImageHelp(message);
      break;
  }
}

/**
 * عرض الإعدادات الافتراضية المتاحة
 * Show available presets
 */
async function showAvailablePresets(message) {
  const presets = getAvailablePresets();
  
  let embed = {
    title: '🖼️ الإعدادات الافتراضية للصور',
    description: 'اختر من الإعدادات الافتراضية التالية:',
    color: 0x3498db,
    fields: [],
    footer: {
      text: 'استخدم !images apply <اسم_الإعداد> لتطبيق إعداد معين'
    }
  };
  
  Object.entries(presets).forEach(([key, preset]) => {
    embed.fields.push({
      name: `📋 ${key}`,
      value: `**الوصف:** ${preset.description}\n**النمط:** ${preset.mode}\n**يتطلب نص:** ${preset.requireText ? 'نعم' : 'لا'}`,
      inline: true
    });
  });
  
  await message.reply({ embeds: [embed] });
}

/**
 * تطبيق إعداد افتراضي
 * Apply preset command
 */
async function applyPresetCommand(message, args, serverId) {
  const presetName = args[0];
  
  if (!presetName) {
    return message.reply('❌ يرجى تحديد اسم الإعداد الافتراضي. استخدم `!images presets` لرؤية القائمة.');
  }
  
  // قنوات مخصصة (اختيارية)
  const customChannels = args.slice(1);
  
  const result = await applyImagePreset(serverId, presetName, customChannels.length > 0 ? customChannels : null);
  
  if (result.success) {
    let embed = {
      title: '✅ تم تطبيق الإعداد بنجاح',
      description: `تم تطبيق الإعداد الافتراضي **${presetName}** على السيرفر.`,
      color: 0x27ae60,
      fields: [
        {
          name: '🔧 النمط المطبق',
          value: result.settings.mode,
          inline: true
        },
        {
          name: '📝 يتطلب نص',
          value: result.settings.requireText ? 'نعم' : 'لا',
          inline: true
        },
        {
          name: '📋 القنوات المحددة',
          value: result.settings.pictureChannels.length > 0 ? result.settings.pictureChannels.join(', ') : 'لا توجد',
          inline: false
        }
      ]
    };
    
    await message.reply({ embeds: [embed] });
  } else {
    await message.reply(`❌ فشل في تطبيق الإعداد: ${result.error}`);
  }
}

/**
 * عرض الإعدادات الحالية
 * Show current settings
 */
async function showCurrentSettings(message, serverId) {
  try {
    const serversPath = path.join(__dirname, 'data', 'servers.json');
    const serversData = JSON.parse(await fs.readFile(serversPath, 'utf8'));
    
    const serverSettings = serversData[serverId];
    if (!serverSettings || !serverSettings.protection || !serverSettings.protection.images) {
      return message.reply('❌ لم يتم العثور على إعدادات الصور لهذا السيرفر.');
    }
    
    const imageSettings = serverSettings.protection.images;
    
    let embed = {
      title: '🖼️ إعدادات الصور الحالية',
      color: 0x3498db,
      fields: [
        {
          name: '🔧 النمط الحالي',
          value: imageSettings.mode || 'whitelist',
          inline: true
        },
        {
          name: '📝 يتطلب نص',
          value: imageSettings.requireText ? 'نعم' : 'لا',
          inline: true
        },
        {
          name: '✅ مفعل',
          value: imageSettings.enabled ? 'نعم' : 'لا',
          inline: true
        },
        {
          name: '📋 القنوات المحددة',
          value: imageSettings.pictureChannels && imageSettings.pictureChannels.length > 0 
            ? imageSettings.pictureChannels.join(', ') 
            : 'لا توجد قنوات محددة',
          inline: false
        }
      ]
    };
    
    if (imageSettings.appliedPreset) {
      embed.fields.push({
        name: '🎯 الإعداد المطبق',
        value: imageSettings.appliedPreset,
        inline: true
      });
    }
    
    if (imageSettings.lastUpdated) {
      embed.fields.push({
        name: '🕒 آخر تحديث',
        value: new Date(imageSettings.lastUpdated).toLocaleString('ar-SA'),
        inline: true
      });
    }
    
    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error showing current settings:', error);
    await message.reply('❌ حدث خطأ أثناء عرض الإعدادات الحالية.');
  }
}

/**
 * معالجة الإعدادات المخصصة
 * Handle custom settings
 */
async function handleCustomSettings(message, args, serverId) {
  if (args.length < 2) {
    return message.reply('❌ الاستخدام: `!images custom <النمط> <يتطلب_نص> [قناة1] [قناة2] ...`\n\nالأنماط المتاحة: allow_all, block_all, whitelist, blacklist');
  }
  
  const mode = args[0];
  const requireText = args[1].toLowerCase() === 'true' || args[1].toLowerCase() === 'نعم';
  const channels = args.slice(2);
  
  const customSettings = {
    mode: mode,
    requireText: requireText,
    pictureChannels: channels
  };
  
  const validation = validateImageSettings(customSettings);
  if (!validation.valid) {
    return message.reply(`❌ إعدادات غير صحيحة: ${validation.error}`);
  }
  
  try {
    const serversPath = path.join(__dirname, 'data', 'servers.json');
    const serversData = JSON.parse(await fs.readFile(serversPath, 'utf8'));
    
    if (!serversData[serverId]) {
      return message.reply('❌ السيرفر غير موجود في قاعدة البيانات.');
    }
    
    // تحديث الإعدادات
    if (!serversData[serverId].protection) {
      serversData[serverId].protection = {};
    }
    
    if (!serversData[serverId].protection.images) {
      serversData[serverId].protection.images = { enabled: true };
    }
    
    serversData[serverId].protection.images = {
      ...serversData[serverId].protection.images,
      ...customSettings,
      appliedPreset: 'custom',
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(serversPath, JSON.stringify(serversData, null, 2));
    
    let embed = {
      title: '✅ تم تطبيق الإعدادات المخصصة',
      color: 0x27ae60,
      fields: [
        {
          name: '🔧 النمط',
          value: mode,
          inline: true
        },
        {
          name: '📝 يتطلب نص',
          value: requireText ? 'نعم' : 'لا',
          inline: true
        },
        {
          name: '📋 القنوات',
          value: channels.length > 0 ? channels.join(', ') : 'لا توجد',
          inline: false
        }
      ]
    };
    
    await message.reply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error applying custom settings:', error);
    await message.reply('❌ حدث خطأ أثناء تطبيق الإعدادات المخصصة.');
  }
}

/**
 * عرض مساعدة أوامر الصور
 * Show image commands help
 */
async function showImageHelp(message) {
  let embed = {
    title: '🖼️ مساعدة أوامر إعدادات الصور',
    description: 'إدارة إعدادات الصور في السيرفر',
    color: 0x3498db,
    fields: [
      {
        name: '📋 `!images presets`',
        value: 'عرض جميع الإعدادات الافتراضية المتاحة',
        inline: false
      },
      {
        name: '✅ `!images apply <اسم_الإعداد>`',
        value: 'تطبيق إعداد افتراضي معين',
        inline: false
      },
      {
        name: '📊 `!images status`',
        value: 'عرض الإعدادات الحالية للسيرفر',
        inline: false
      },
      {
        name: '🔧 `!images custom <النمط> <يتطلب_نص> [قنوات]`',
        value: 'تطبيق إعدادات مخصصة',
        inline: false
      }
    ],
    footer: {
      text: 'الأنماط المتاحة: allow_all, block_all, whitelist, blacklist'
    }
  };
  
  await message.reply({ embeds: [embed] });
}

module.exports = {
  handleImageCommands
};