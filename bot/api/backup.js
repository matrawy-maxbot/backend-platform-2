const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// استيراد نظام قاعدة البيانات
const { 
  initializeDatabase, 
  getServerData, 
  saveServerData, 
  updateServerSection
} = require('../utils/database.js');

// متغير لتخزين مرجع للبوت الرئيسي
let botInstance = null;

// دالة لتعيين مرجع البوت
function setBotInstance(bot) {
  botInstance = bot;
}

// مجلد النسخ الاحتياطية
const BACKUP_DIR = path.join(__dirname, '../data/backups');

// التأكد من وجود مجلد النسخ الاحتياطية
async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch (error) {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

// دالة لجمع بيانات الخادم من Discord
async function collectServerData(guildId) {
  if (!botInstance || !botInstance.guilds) {
    throw new Error('Bot instance not available');
  }

  const guild = botInstance.guilds.cache.get(guildId);
  if (!guild) {
    throw new Error('Guild not found');
  }

  console.log(`📊 Collecting backup data for guild: ${guild.name} (${guildId})`);

  // جمع بيانات القنوات
  const channels = [];
  const categories = [];
  
  guild.channels.cache.forEach(channel => {
    const channelData = {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      position: channel.position,
      parentId: channel.parentId,
      topic: channel.topic,
      nsfw: channel.nsfw,
      rateLimitPerUser: channel.rateLimitPerUser,
      bitrate: channel.bitrate,
      userLimit: channel.userLimit,
      permissionOverwrites: []
    };

    // جمع أذونات القناة
    if (channel.permissionOverwrites) {
      channel.permissionOverwrites.cache.forEach(overwrite => {
        channelData.permissionOverwrites.push({
          id: overwrite.id,
          type: overwrite.type,
          allow: overwrite.allow.bitfield.toString(),
          deny: overwrite.deny.bitfield.toString()
        });
      });
    }

    if (channel.type === 4) { // Category
      categories.push(channelData);
    } else {
      channels.push(channelData);
    }
  });

  // جمع بيانات الرتب
  const roles = [];
  guild.roles.cache.forEach(role => {
    if (role.id !== guild.id) { // تجاهل @everyone role
      roles.push({
        id: role.id,
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions.bitfield.toString(),
        mentionable: role.mentionable,
        managed: role.managed,
        icon: role.icon,
        unicodeEmoji: role.unicodeEmoji
      });
    }
  });

  // جمع إعدادات الخادم
  const serverSettings = {
    name: guild.name,
    description: guild.description,
    icon: guild.icon,
    banner: guild.banner,
    splash: guild.splash,
    discoverySplash: guild.discoverySplash,
    afkChannelId: guild.afkChannelId,
    afkTimeout: guild.afkTimeout,
    systemChannelId: guild.systemChannelId,
    systemChannelFlags: guild.systemChannelFlags,
    rulesChannelId: guild.rulesChannelId,
    publicUpdatesChannelId: guild.publicUpdatesChannelId,
    preferredLocale: guild.preferredLocale,
    features: guild.features,
    verificationLevel: guild.verificationLevel,
    explicitContentFilter: guild.explicitContentFilter,
    mfaLevel: guild.mfaLevel,
    defaultMessageNotifications: guild.defaultMessageNotifications,
    vanityURLCode: guild.vanityURLCode,
    premiumTier: guild.premiumTier,
    premiumSubscriptionCount: guild.premiumSubscriptionCount,
    nsfwLevel: guild.nsfwLevel
  };

  return {
    guildId,
    guildName: guild.name,
    memberCount: guild.memberCount,
    categories,
    channels,
    roles,
    serverSettings,
    createdAt: new Date().toISOString()
  };
}

// دالة لحفظ النسخة الاحتياطية
async function saveBackup(guildId, backupData) {
  await ensureBackupDir();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup_${guildId}_${timestamp}.json`;
  const filepath = path.join(BACKUP_DIR, filename);
  
  // حفظ النسخة الاحتياطية في ملف JSON
  await fs.writeFile(filepath, JSON.stringify(backupData, null, 2));
  
  // حفظ مرجع للنسخة الاحتياطية الأخيرة
  const latestBackupPath = path.join(BACKUP_DIR, `latest_${guildId}.json`);
  await fs.writeFile(latestBackupPath, JSON.stringify({
    filename,
    filepath,
    timestamp: backupData.createdAt,
    guildId,
    guildName: backupData.guildName
  }, null, 2));
  
  // حفظ معلومات النسخة الاحتياطية في قاعدة البيانات
  try {
    await initializeDatabase();
    
    // الحصول على بيانات السيرفر الحالية
    let serverData = await getServerData(guildId);
    
    if (!serverData) {
      // إنشاء بيانات افتراضية للسيرفر إذا لم تكن موجودة
      serverData = {
        id: guildId,
        autoReply: { enabled: true, replies: [] },
        ads: { enabled: false, ads: [] },
        members: { 
          welcomeMessage: { enabled: true, message: 'Welcome {user}!', channel: '' },
          autoRole: { enabled: false, roleId: '' }
        },
        protection: { spamProtection: true, raidProtection: false },
        backup: {
          enabled: true,
          backups: []
        }
      };
    }
    
    // إضافة قسم backup إذا لم يكن موجوداً
    if (!serverData.backup) {
      serverData.backup = {
        enabled: true,
        backups: []
      };
    }
    
    // إضافة معلومات النسخة الاحتياطية الجديدة
    const backupInfo = {
      id: generateBackupId(),
      filename,
      filepath,
      timestamp: backupData.createdAt,
      guildName: backupData.guildName,
      memberCount: backupData.memberCount,
      channelsCount: backupData.channels.length + backupData.categories.length,
      rolesCount: backupData.roles.length,
      size: JSON.stringify(backupData).length,
      createdAt: new Date().toISOString()
    };
    
    // الاحتفاظ بآخر 10 نسخ احتياطية فقط
    serverData.backup.backups.unshift(backupInfo);
    if (serverData.backup.backups.length > 10) {
      const oldBackups = serverData.backup.backups.splice(10);
      // حذف الملفات القديمة
      for (const oldBackup of oldBackups) {
        try {
          await fs.unlink(oldBackup.filepath);
          console.log(`🗑️ Deleted old backup file: ${oldBackup.filename}`);
        } catch (error) {
          console.warn(`⚠️ Could not delete old backup file: ${oldBackup.filename}`);
        }
      }
    }
    
    // حفظ البيانات المحدثة
    if (!await getServerData(guildId)) {
      // إنشاء السيرفر في قاعدة البيانات إذا لم يكن موجوداً
      await saveServerData(guildId, serverData, 'backup-system');
    } else {
      // تحديث قسم backup فقط
      await updateServerSection(guildId, 'backup', serverData.backup, 'backup-system');
    }
    
    console.log(`✅ Backup saved to database: ${filename}`);
  } catch (error) {
    console.error('❌ Error saving backup to database:', error);
    // لا نرمي الخطأ هنا لأن النسخة الاحتياطية تم حفظها في الملف بنجاح
  }
  
  console.log(`✅ Backup saved: ${filename}`);
  return { filename, filepath, timestamp: backupData.createdAt };
}

// دالة لتوليد معرف فريد للنسخة الاحتياطية
function generateBackupId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// دالة للحصول على آخر نسخة احتياطية
async function getLatestBackup(guildId) {
  try {
    // محاولة الحصول على البيانات من قاعدة البيانات أولاً
    const serverData = await getServerData(guildId);
    if (serverData && serverData.backup && serverData.backup.backups && serverData.backup.backups.length > 0) {
      return serverData.backup.backups[0]; // أحدث نسخة احتياطية
    }
    
    // Fallback: محاولة قراءة الملف المحلي
    const latestBackupPath = path.join(BACKUP_DIR, `latest_${guildId}.json`);
    const latestBackupData = await fs.readFile(latestBackupPath, 'utf8');
    return JSON.parse(latestBackupData);
  } catch (error) {
    console.log(`ℹ️ No backup found for guild ${guildId}`);
    return null;
  }
}

// دالة لتحميل النسخة الاحتياطية
async function loadBackup(guildId) {
  const latestBackup = await getLatestBackup(guildId);
  if (!latestBackup) {
    return null;
  }
  
  try {
    const backupData = await fs.readFile(latestBackup.filepath, 'utf8');
    return JSON.parse(backupData);
  } catch (error) {
    console.error('Error loading backup:', error);
    return null;
  }
}

// API endpoint لإنشاء نسخة احتياطية
router.post('/create/:guildId', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    if (!botInstance) {
      return res.status(503).json({ 
        success: false, 
        error: 'Bot instance not available' 
      });
    }

    console.log(`🔄 Creating backup for guild: ${guildId}`);
    
    // جمع بيانات الخادم
    const backupData = await collectServerData(guildId);
    
    // حفظ النسخة الاحتياطية
    const backupInfo = await saveBackup(guildId, backupData);
    
    res.json({
      success: true,
      message: 'Backup created successfully',
      backup: backupInfo,
      stats: {
        categories: backupData.categories.length,
        channels: backupData.channels.length,
        roles: backupData.roles.length,
        memberCount: backupData.memberCount
      }
    });
    
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create backup',
      details: error.message
    });
  }
});

// API endpoint للحصول على معلومات النسخة الاحتياطية
router.get('/info/:guildId', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    const latestBackup = await getLatestBackup(guildId);
    
    if (!latestBackup) {
      return res.json({
        success: true,
        hasBackup: false,
        message: 'No backup found'
      });
    }
    
    // تحميل بيانات النسخة الاحتياطية للحصول على الإحصائيات
    const backupData = await loadBackup(guildId);
    
    res.json({
      success: true,
      hasBackup: true,
      backup: latestBackup,
      stats: backupData ? {
        categories: backupData.categories?.length || 0,
        channels: backupData.channels?.length || 0,
        roles: backupData.roles?.length || 0,
        memberCount: backupData.memberCount || 0
      } : null
    });
    
  } catch (error) {
    console.error('Error getting backup info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get backup info',
      details: error.message
    });
  }
});

// API endpoint لاستعادة النسخة الاحتياطية مع النظام الذكي
router.post('/restore/:guildId', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    if (!botInstance) {
      return res.status(503).json({ 
        success: false, 
        error: 'Bot instance not available' 
      });
    }

    const guild = botInstance.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({
        success: false,
        error: 'Guild not found'
      });
    }

    // تحميل النسخة الاحتياطية
    const backupData = await loadBackup(guildId);
    if (!backupData) {
      return res.status(404).json({
        success: false,
        error: 'No backup found'
      });
    }

    console.log(`🔄 Starting smart restore for guild: ${guild.name} (${guildId})`);
    
    const restoredItems = {
      categories: { created: 0, updated: 0, skipped: 0 },
      channels: { created: 0, updated: 0, skipped: 0 },
      roles: { created: 0, updated: 0, skipped: 0 },
      permissions: { restored: 0, failed: 0 },
      errors: [],
      warnings: []
    };

    // الخطوة 1: تحليل الاختلافات وإنشاء خطة الاستعادة
    console.log(`📊 Analyzing differences between backup and current state...`);
    
    const currentState = await collectServerData(guildId);
    const restorePlan = await createRestorePlan(backupData, currentState);
    
    console.log(`📋 Restore plan created:`, {
      categoriesToCreate: restorePlan.categories.create.length,
      categoriesToUpdate: restorePlan.categories.update.length,
      channelsToCreate: restorePlan.channels.create.length,
      channelsToUpdate: restorePlan.channels.update.length,
      rolesToCreate: restorePlan.roles.create.length,
      rolesToUpdate: restorePlan.roles.update.length
    });

    // الخطوة 2: استعادة الفئات أولاً
    console.log(`📁 Restoring categories...`);
    for (const categoryData of restorePlan.categories.create) {
      try {
        await guild.channels.create({
          name: categoryData.name,
          type: categoryData.type,
          position: categoryData.position
        });
        restoredItems.categories.created++;
        console.log(`✅ Created category: ${categoryData.name}`);
      } catch (error) {
        restoredItems.errors.push(`Category ${categoryData.name}: ${error.message}`);
        console.error(`❌ Failed to create category ${categoryData.name}:`, error.message);
      }
    }

    // تحديث الفئات الموجودة
    for (const updateData of restorePlan.categories.update) {
      try {
        const existingCategory = guild.channels.cache.get(updateData.current.id);
        if (existingCategory && existingCategory.name !== updateData.backup.name) {
          await existingCategory.setName(updateData.backup.name);
          restoredItems.categories.updated++;
          console.log(`🔄 Updated category: ${updateData.backup.name}`);
        } else {
          restoredItems.categories.skipped++;
        }
      } catch (error) {
        restoredItems.errors.push(`Category update ${updateData.backup.name}: ${error.message}`);
      }
    }

    // الخطوة 3: استعادة الرتب
    console.log(`👑 Restoring roles...`);
    for (const roleData of restorePlan.roles.create) {
      try {
        if (!roleData.managed) { // تجاهل الرتب المُدارة بواسطة البوتات
          await guild.roles.create({
            name: roleData.name,
            color: roleData.color,
            hoist: roleData.hoist,
            permissions: roleData.permissions,
            mentionable: roleData.mentionable,
            position: Math.min(roleData.position, guild.roles.cache.size)
          });
          restoredItems.roles.created++;
          console.log(`✅ Created role: ${roleData.name}`);
        } else {
          restoredItems.warnings.push(`Skipped managed role: ${roleData.name}`);
        }
      } catch (error) {
        restoredItems.errors.push(`Role ${roleData.name}: ${error.message}`);
        console.error(`❌ Failed to create role ${roleData.name}:`, error.message);
      }
    }

    // تحديث الرتب الموجودة
    for (const updateData of restorePlan.roles.update) {
      try {
        const existingRole = guild.roles.cache.get(updateData.current.id);
        if (existingRole && !existingRole.managed) {
          let updated = false;
          
          if (existingRole.name !== updateData.backup.name) {
            await existingRole.setName(updateData.backup.name);
            updated = true;
          }
          
          if (existingRole.color !== updateData.backup.color) {
            await existingRole.setColor(updateData.backup.color);
            updated = true;
          }
          
          if (existingRole.permissions.bitfield.toString() !== updateData.backup.permissions) {
            await existingRole.setPermissions(updateData.backup.permissions);
            updated = true;
          }
          
          if (updated) {
            restoredItems.roles.updated++;
            console.log(`🔄 Updated role: ${updateData.backup.name}`);
          } else {
            restoredItems.roles.skipped++;
          }
        }
      } catch (error) {
        restoredItems.errors.push(`Role update ${updateData.backup.name}: ${error.message}`);
      }
    }

    // الخطوة 4: استعادة القنوات
    console.log(`💬 Restoring channels...`);
    
    // إنشاء خريطة للفئات الجديدة
    const categoryMap = new Map();
    guild.channels.cache.forEach(channel => {
      if (channel.type === 4) { // Category
        const backupCategory = backupData.categories.find(cat => cat.name === channel.name);
        if (backupCategory) {
          categoryMap.set(backupCategory.id, channel.id);
        }
      }
    });

    for (const channelData of restorePlan.channels.create) {
      try {
        const channelOptions = {
          name: channelData.name,
          type: channelData.type,
          position: channelData.position
        };

        // تحديد الفئة الأب
        if (channelData.parentId && categoryMap.has(channelData.parentId)) {
          channelOptions.parent = categoryMap.get(channelData.parentId);
        }

        // إضافة الخصائص الإضافية حسب نوع القناة
        if (channelData.topic) channelOptions.topic = channelData.topic;
        if (channelData.nsfw !== undefined) channelOptions.nsfw = channelData.nsfw;
        if (channelData.rateLimitPerUser) channelOptions.rateLimitPerUser = channelData.rateLimitPerUser;
        if (channelData.bitrate) channelOptions.bitrate = channelData.bitrate;
        if (channelData.userLimit) channelOptions.userLimit = channelData.userLimit;

        const newChannel = await guild.channels.create(channelOptions);
        restoredItems.channels.created++;
        console.log(`✅ Created channel: ${channelData.name}`);

        // استعادة أذونات القناة
        if (channelData.permissionOverwrites && channelData.permissionOverwrites.length > 0) {
          await restoreChannelPermissions(newChannel, channelData.permissionOverwrites, guild, restoredItems);
        }

      } catch (error) {
        restoredItems.errors.push(`Channel ${channelData.name}: ${error.message}`);
        console.error(`❌ Failed to create channel ${channelData.name}:`, error.message);
      }
    }

    // تحديث القنوات الموجودة
    for (const updateData of restorePlan.channels.update) {
      try {
        const existingChannel = guild.channels.cache.get(updateData.current.id);
        if (existingChannel) {
          let updated = false;
          
          if (existingChannel.name !== updateData.backup.name) {
            await existingChannel.setName(updateData.backup.name);
            updated = true;
          }
          
          if (existingChannel.topic !== updateData.backup.topic && updateData.backup.topic !== undefined) {
            await existingChannel.setTopic(updateData.backup.topic);
            updated = true;
          }
          
          if (updated) {
            restoredItems.channels.updated++;
            console.log(`🔄 Updated channel: ${updateData.backup.name}`);
          } else {
            restoredItems.channels.skipped++;
          }
        }
      } catch (error) {
        restoredItems.errors.push(`Channel update ${updateData.backup.name}: ${error.message}`);
      }
    }

    // الخطوة 5: تسجيل النتائج
    const totalRestored = restoredItems.categories.created + restoredItems.categories.updated +
                         restoredItems.channels.created + restoredItems.channels.updated +
                         restoredItems.roles.created + restoredItems.roles.updated;

    console.log(`✅ Smart restore completed for ${guild.name}:`);
    console.log(`   📁 Categories: ${restoredItems.categories.created} created, ${restoredItems.categories.updated} updated`);
    console.log(`   💬 Channels: ${restoredItems.channels.created} created, ${restoredItems.channels.updated} updated`);
    console.log(`   👑 Roles: ${restoredItems.roles.created} created, ${restoredItems.roles.updated} updated`);
    console.log(`   🔐 Permissions: ${restoredItems.permissions.restored} restored`);
    console.log(`   ⚠️ Errors: ${restoredItems.errors.length}`);
    console.log(`   📋 Warnings: ${restoredItems.warnings.length}`);

    res.json({
      success: true,
      message: 'Smart backup restore completed successfully',
      restored: restoredItems,
      summary: {
        totalRestored,
        totalErrors: restoredItems.errors.length,
        totalWarnings: restoredItems.warnings.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error during smart restore:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore backup',
      details: error.message
    });
  }
});

// دالة لإنشاء خطة الاستعادة الذكية
async function createRestorePlan(backupData, currentState) {
  const plan = {
    categories: { create: [], update: [] },
    channels: { create: [], update: [] },
    roles: { create: [], update: [] }
  };

  // تحليل الفئات
  const currentCategories = new Map(currentState.categories.map(cat => [cat.name, cat]));
  for (const backupCategory of backupData.categories) {
    const currentCategory = currentCategories.get(backupCategory.name);
    if (!currentCategory) {
      plan.categories.create.push(backupCategory);
    } else if (needsUpdate(backupCategory, currentCategory, ['name', 'position'])) {
      plan.categories.update.push({ backup: backupCategory, current: currentCategory });
    }
  }

  // تحليل القنوات
  const currentChannels = new Map(currentState.channels.map(ch => [ch.name, ch]));
  for (const backupChannel of backupData.channels) {
    const currentChannel = currentChannels.get(backupChannel.name);
    if (!currentChannel) {
      plan.channels.create.push(backupChannel);
    } else if (needsUpdate(backupChannel, currentChannel, ['name', 'topic', 'nsfw', 'rateLimitPerUser'])) {
      plan.channels.update.push({ backup: backupChannel, current: currentChannel });
    }
  }

  // تحليل الرتب
  const currentRoles = new Map(currentState.roles.map(role => [role.name, role]));
  for (const backupRole of backupData.roles) {
    if (backupRole.name === '@everyone') continue; // تجاهل رتبة @everyone
    
    const currentRole = currentRoles.get(backupRole.name);
    if (!currentRole) {
      plan.roles.create.push(backupRole);
    } else if (needsUpdate(backupRole, currentRole, ['name', 'color', 'permissions', 'hoist', 'mentionable'])) {
      plan.roles.update.push({ backup: backupRole, current: currentRole });
    }
  }

  return plan;
}

// دالة للتحقق من الحاجة للتحديث
function needsUpdate(backupItem, currentItem, fieldsToCheck) {
  for (const field of fieldsToCheck) {
    if (backupItem[field] !== currentItem[field]) {
      return true;
    }
  }
  return false;
}

// دالة لاستعادة أذونات القناة
async function restoreChannelPermissions(channel, permissionOverwrites, guild, restoredItems) {
  for (const overwrite of permissionOverwrites) {
    try {
      let target;
      
      if (overwrite.type === 0) { // Role
        target = guild.roles.cache.get(overwrite.id) || guild.roles.cache.find(role => role.name === overwrite.name);
      } else if (overwrite.type === 1) { // Member
        target = guild.members.cache.get(overwrite.id);
      }
      
      if (target) {
        await channel.permissionOverwrites.create(target, {
          allow: BigInt(overwrite.allow),
          deny: BigInt(overwrite.deny)
        });
        restoredItems.permissions.restored++;
      }
    } catch (error) {
      restoredItems.permissions.failed++;
      console.warn(`⚠️ Failed to restore permission for ${overwrite.id}:`, error.message);
    }
  }
}

// API endpoint للحصول على إحصائيات الخادم الحالية
router.get('/current-stats/:guildId', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    if (!botInstance) {
      return res.status(503).json({ 
        success: false, 
        error: 'Bot instance not available' 
      });
    }

    const guild = botInstance.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({
        success: false,
        error: 'Guild not found'
      });
    }

    const stats = {
      name: guild.name,
      memberCount: guild.memberCount,
      categories: guild.channels.cache.filter(c => c.type === 4).size,
      textChannels: guild.channels.cache.filter(c => c.type === 0).size,
      voiceChannels: guild.channels.cache.filter(c => c.type === 2).size,
      roles: guild.roles.cache.size - 1, // exclude @everyone
      totalChannels: guild.channels.cache.size
    };

    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Error getting current stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get current stats',
      details: error.message
    });
  }
});

// Get list of all backups for a guild
router.get('/list/:guildId', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Initialize database
    await initializeDatabase();
    
    // Get server data from database
    const serverData = await getServerData(guildId);
    
    if (!serverData || !serverData.backup || !serverData.backup.backups || serverData.backup.backups.length === 0) {
      return res.json({ backups: [] });
    }
    
    // Sort backups by creation date (newest first)
    const sortedBackups = serverData.backup.backups.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Format backup list for frontend
    const backupList = sortedBackups.map(backup => ({
      id: backup.id,
      filename: backup.filename,
      createdAt: backup.createdAt,
      size: backup.size || 0,
      channelsCount: backup.channelsCount || 0,
      rolesCount: backup.rolesCount || 0,
      guildName: backup.guildName,
      memberCount: backup.memberCount || 0
    }));
    
    res.json({ success: true, backups: backupList });
  } catch (error) {
    console.error('Error getting backup list:', error);
    res.status(500).json({ success: false, error: 'Failed to get backup list' });
  }
});

// Delete a specific backup
router.delete('/delete/:guildId/:backupId', async (req, res) => {
  try {
    const { guildId, backupId } = req.params;
    
    // Initialize database
    await initializeDatabase();
    
    // Get server data from database
    const serverData = await getServerData(guildId);
    
    if (!serverData || !serverData.backup || !serverData.backup.backups) {
      return res.status(404).json({ success: false, error: 'No backups found' });
    }
    
    // Find the backup to delete
    const backupIndex = serverData.backup.backups.findIndex(backup => backup.id === backupId);
    
    if (backupIndex === -1) {
      return res.status(404).json({ success: false, error: 'Backup not found' });
    }
    
    const backupToDelete = serverData.backup.backups[backupIndex];
    
    // Delete the backup file if it exists
    if (backupToDelete.filepath) {
      try {
        await fs.unlink(backupToDelete.filepath);
        console.log(`🗑️ Deleted backup file: ${backupToDelete.filename}`);
      } catch (fileError) {
        console.warn(`⚠️ Could not delete backup file: ${backupToDelete.filename}`);
      }
    }
    
    // Remove backup from database
    serverData.backup.backups.splice(backupIndex, 1);
    
    // Update database
    await updateServerSection(guildId, 'backup', serverData.backup, 'backup-system');
    
    console.log(`✅ Backup ${backupId} deleted for guild ${guildId}`);
    res.json({ success: true, message: 'Backup deleted successfully' });
  } catch (error) {
    console.error('Error deleting backup:', error);
    res.status(500).json({ success: false, error: 'Failed to delete backup' });
  }
});

// Restore a specific backup by ID
router.post('/restore/:guildId/:backupId', async (req, res) => {
  try {
    const { guildId, backupId } = req.params;
    
    if (!botInstance) {
      return res.status(503).json({ success: false, error: 'Bot instance not available' });
    }
    
    const guild = botInstance.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ success: false, error: 'Guild not found' });
    }
    
    // Initialize database
    await initializeDatabase();
    
    // Get server data from database
    const serverData = await getServerData(guildId);
    
    if (!serverData || !serverData.backup || !serverData.backup.backups) {
      return res.status(404).json({ success: false, error: 'No backups found' });
    }
    
    // Find the specific backup
    const backup = serverData.backup.backups.find(b => b.id === backupId);
    
    if (!backup) {
      return res.status(404).json({ success: false, error: 'Backup not found' });
    }
    
    let backupData;
    
    // Load backup data from file
    if (backup.filepath) {
      try {
        const fileContent = await fs.readFile(backup.filepath, 'utf8');
        backupData = JSON.parse(fileContent);
      } catch (fileError) {
        return res.status(404).json({ success: false, error: 'Backup file not found or corrupted' });
      }
    } else {
      return res.status(404).json({ success: false, error: 'Backup data not found' });
    }
    
    console.log(`🔄 Starting restore of backup ${backupId} for guild: ${guild.name}`);
    
    const restoredItems = {
      categories: { created: 0, updated: 0, skipped: 0 },
      channels: { created: 0, updated: 0, skipped: 0 },
      roles: { created: 0, updated: 0, skipped: 0 },
      permissions: { restored: 0, failed: 0 },
      errors: [],
      warnings: []
    };

    // Create restore plan
    const currentState = await collectServerData(guildId);
    const restorePlan = await createRestorePlan(backupData, currentState);
    
    console.log(`📋 Restore plan created for backup ${backupId}:`, {
      categoriesToCreate: restorePlan.categories.create.length,
      categoriesToUpdate: restorePlan.categories.update.length,
      channelsToCreate: restorePlan.channels.create.length,
      channelsToUpdate: restorePlan.channels.update.length,
      rolesToCreate: restorePlan.roles.create.length,
      rolesToUpdate: restorePlan.roles.update.length
    });

    // Restore categories
    console.log(`📁 Restoring categories...`);
    for (const categoryData of restorePlan.categories.create) {
      try {
        await guild.channels.create({
          name: categoryData.name,
          type: categoryData.type,
          position: categoryData.position
        });
        restoredItems.categories.created++;
        console.log(`✅ Created category: ${categoryData.name}`);
      } catch (error) {
        restoredItems.errors.push(`Category ${categoryData.name}: ${error.message}`);
        console.error(`❌ Failed to create category ${categoryData.name}:`, error.message);
      }
    }

    // Update existing categories
    for (const updateData of restorePlan.categories.update) {
      try {
        const existingCategory = guild.channels.cache.get(updateData.current.id);
        if (existingCategory && existingCategory.name !== updateData.backup.name) {
          await existingCategory.setName(updateData.backup.name);
          restoredItems.categories.updated++;
          console.log(`🔄 Updated category: ${updateData.backup.name}`);
        } else {
          restoredItems.categories.skipped++;
        }
      } catch (error) {
        restoredItems.errors.push(`Category update ${updateData.backup.name}: ${error.message}`);
      }
    }

    // Restore roles
    console.log(`👑 Restoring roles...`);
    for (const roleData of restorePlan.roles.create) {
      try {
        if (!roleData.managed) {
          await guild.roles.create({
            name: roleData.name,
            color: roleData.color,
            hoist: roleData.hoist,
            permissions: roleData.permissions,
            mentionable: roleData.mentionable,
            position: Math.min(roleData.position, guild.roles.cache.size)
          });
          restoredItems.roles.created++;
          console.log(`✅ Created role: ${roleData.name}`);
        } else {
          restoredItems.warnings.push(`Skipped managed role: ${roleData.name}`);
        }
      } catch (error) {
        restoredItems.errors.push(`Role ${roleData.name}: ${error.message}`);
        console.error(`❌ Failed to create role ${roleData.name}:`, error.message);
      }
    }

    // Update existing roles
    for (const updateData of restorePlan.roles.update) {
      try {
        const existingRole = guild.roles.cache.get(updateData.current.id);
        if (existingRole && !existingRole.managed) {
          let updated = false;
          
          if (existingRole.name !== updateData.backup.name) {
            await existingRole.setName(updateData.backup.name);
            updated = true;
          }
          
          if (existingRole.color !== updateData.backup.color) {
            await existingRole.setColor(updateData.backup.color);
            updated = true;
          }
          
          if (existingRole.permissions.bitfield.toString() !== updateData.backup.permissions) {
            await existingRole.setPermissions(updateData.backup.permissions);
            updated = true;
          }
          
          if (updated) {
            restoredItems.roles.updated++;
            console.log(`🔄 Updated role: ${updateData.backup.name}`);
          } else {
            restoredItems.roles.skipped++;
          }
        }
      } catch (error) {
        restoredItems.errors.push(`Role update ${updateData.backup.name}: ${error.message}`);
      }
    }

    // Restore channels
    console.log(`💬 Restoring channels...`);
    
    // Create category map
    const categoryMap = new Map();
    guild.channels.cache.forEach(channel => {
      if (channel.type === 4) {
        const backupCategory = backupData.categories.find(cat => cat.name === channel.name);
        if (backupCategory) {
          categoryMap.set(backupCategory.id, channel.id);
        }
      }
    });

    for (const channelData of restorePlan.channels.create) {
      try {
        const channelOptions = {
          name: channelData.name,
          type: channelData.type,
          position: channelData.position
        };

        // Set parent category
        if (channelData.parentId && categoryMap.has(channelData.parentId)) {
          channelOptions.parent = categoryMap.get(channelData.parentId);
        }

        // Add additional properties based on channel type
        if (channelData.topic) channelOptions.topic = channelData.topic;
        if (channelData.nsfw !== undefined) channelOptions.nsfw = channelData.nsfw;
        if (channelData.rateLimitPerUser) channelOptions.rateLimitPerUser = channelData.rateLimitPerUser;
        if (channelData.bitrate) channelOptions.bitrate = channelData.bitrate;
        if (channelData.userLimit) channelOptions.userLimit = channelData.userLimit;

        const newChannel = await guild.channels.create(channelOptions);
        restoredItems.channels.created++;
        console.log(`✅ Created channel: ${channelData.name}`);

        // Restore channel permissions
        if (channelData.permissionOverwrites && channelData.permissionOverwrites.length > 0) {
          await restoreChannelPermissions(newChannel, channelData.permissionOverwrites, guild, restoredItems);
        }

      } catch (error) {
        restoredItems.errors.push(`Channel ${channelData.name}: ${error.message}`);
        console.error(`❌ Failed to create channel ${channelData.name}:`, error.message);
      }
    }

    // Update existing channels
    for (const updateData of restorePlan.channels.update) {
      try {
        const existingChannel = guild.channels.cache.get(updateData.current.id);
        if (existingChannel) {
          let updated = false;
          
          if (existingChannel.name !== updateData.backup.name) {
            await existingChannel.setName(updateData.backup.name);
            updated = true;
          }
          
          if (existingChannel.topic !== updateData.backup.topic && updateData.backup.topic !== undefined) {
            await existingChannel.setTopic(updateData.backup.topic);
            updated = true;
          }
          
          if (updated) {
            restoredItems.channels.updated++;
            console.log(`🔄 Updated channel: ${updateData.backup.name}`);
          } else {
            restoredItems.channels.skipped++;
          }
        }
      } catch (error) {
        restoredItems.errors.push(`Channel update ${updateData.backup.name}: ${error.message}`);
      }
    }

    // Calculate summary
    const totalRestored = restoredItems.categories.created + restoredItems.categories.updated +
                         restoredItems.channels.created + restoredItems.channels.updated +
                         restoredItems.roles.created + restoredItems.roles.updated;

    console.log(`✅ Restore completed for backup ${backupId}:`);
    console.log(`   📁 Categories: ${restoredItems.categories.created} created, ${restoredItems.categories.updated} updated`);
    console.log(`   💬 Channels: ${restoredItems.channels.created} created, ${restoredItems.channels.updated} updated`);
    console.log(`   👑 Roles: ${restoredItems.roles.created} created, ${restoredItems.roles.updated} updated`);
    console.log(`   🔐 Permissions: ${restoredItems.permissions.restored} restored`);
    console.log(`   ⚠️ Errors: ${restoredItems.errors.length}`);
    console.log(`   📋 Warnings: ${restoredItems.warnings.length}`);

    res.json({
      success: true,
      message: `Backup ${backupId} restored successfully`,
      restored: restoredItems,
      summary: {
        totalRestored,
        totalErrors: restoredItems.errors.length,
        totalWarnings: restoredItems.warnings.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error restoring specific backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore backup',
      details: error.message
    });
  }
});

// API endpoint لتحميل ملف النسخة الاحتياطية
router.get('/download/:guildId', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Initialize database
    await initializeDatabase();
    
    // Get server data from database
    const serverData = await getServerData(guildId);
    
    if (!serverData || !serverData.backup || !serverData.backup.backups || serverData.backup.backups.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No backup found for this server'
      });
    }
    
    // Get the latest backup
    const latestBackup = serverData.backup.backups
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    
    if (!latestBackup || !latestBackup.filepath) {
      return res.status(404).json({
        success: false,
        error: 'Backup file not found'
      });
    }
    
    // Check if file exists
    if (!fsSync.existsSync(latestBackup.filepath)) {
      return res.status(404).json({
        success: false,
        error: 'Backup file does not exist on disk'
      });
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${latestBackup.filename}"`);
    res.setHeader('Content-Type', 'application/json');
    
    // Stream the file
    const fileStream = fsSync.createReadStream(latestBackup.filepath);
    fileStream.pipe(res);
    
    console.log(`📥 Downloaded backup file: ${latestBackup.filename} for guild ${guildId}`);
    
  } catch (error) {
    console.error('Error downloading backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download backup',
      details: error.message
    });
  }
});

module.exports = { router, setBotInstance };