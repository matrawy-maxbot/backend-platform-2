/**
 * نظام الإعدادات الافتراضية لإدارة الصور
 * Image Presets Management System
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * الإعدادات الافتراضية المتاحة
 * Available image presets
 */
const IMAGE_PRESETS = {
  allow_all: {
    description: 'السماح بالصور في جميع القنوات',
    description_en: 'Allow images in all channels',
    mode: 'allow_all',
    requireText: false,
    pictureChannels: []
  },
  
  block_all: {
    description: 'حظر الصور في جميع القنوات',
    description_en: 'Block images in all channels',
    mode: 'block_all',
    requireText: false,
    pictureChannels: []
  },
  
  whitelist_only: {
    description: 'السماح بالصور في القنوات المحددة فقط',
    description_en: 'Allow images only in specified channels',
    mode: 'whitelist',
    requireText: false,
    pictureChannels: ['general', 'images', 'art']
  },
  
  blacklist_mode: {
    description: 'حظر الصور في القنوات المحددة فقط',
    description_en: 'Block images only in specified channels',
    mode: 'blacklist',
    requireText: false,
    pictureChannels: ['announcements', 'rules']
  },
  
  text_required: {
    description: 'السماح بالصور مع النصوص فقط',
    description_en: 'Allow images with text only',
    mode: 'allow_all',
    requireText: true,
    pictureChannels: []
  },
  
  text_whitelist: {
    description: 'السماح بالصور مع النصوص في القنوات المحددة',
    description_en: 'Allow images with text in specified channels',
    mode: 'whitelist',
    requireText: true,
    pictureChannels: ['general', 'chat']
  }
};

/**
 * تطبيق إعداد افتراضي على سيرفر
 * Apply preset to server
 * @param {string} serverId - معرف السيرفر
 * @param {string} presetName - اسم الإعداد الافتراضي
 * @param {Array} customChannels - قنوات مخصصة (اختيارية)
 * @returns {Promise<Object>} - نتيجة التطبيق
 */
async function applyImagePreset(serverId, presetName, customChannels = null) {
  try {
    if (!IMAGE_PRESETS[presetName]) {
      throw new Error(`Unknown preset: ${presetName}`);
    }
    
    const preset = { ...IMAGE_PRESETS[presetName] };
    
    // استخدام القنوات المخصصة إذا تم توفيرها
    if (customChannels && Array.isArray(customChannels)) {
      preset.pictureChannels = customChannels;
    }
    
    // قراءة ملف الإعدادات الحالي
    const serversPath = path.join(__dirname, 'data', 'servers.json');
    const serversData = JSON.parse(await fs.readFile(serversPath, 'utf8'));
    
    if (!serversData[serverId]) {
      throw new Error(`Server ${serverId} not found`);
    }
    
    // تحديث إعدادات الصور
    if (!serversData[serverId].protection) {
      serversData[serverId].protection = {};
    }
    
    if (!serversData[serverId].protection.images) {
      serversData[serverId].protection.images = { enabled: true };
    }
    
    // تطبيق الإعداد الافتراضي
    serversData[serverId].protection.images = {
      ...serversData[serverId].protection.images,
      mode: preset.mode,
      requireText: preset.requireText,
      pictureChannels: preset.pictureChannels,
      appliedPreset: presetName,
      lastUpdated: new Date().toISOString()
    };
    
    // حفظ التغييرات
    await fs.writeFile(serversPath, JSON.stringify(serversData, null, 2));
    
    console.log(`✅ [PRESETS] Applied preset "${presetName}" to server ${serverId}`);
    
    return {
      success: true,
      preset: presetName,
      settings: serversData[serverId].protection.images
    };
    
  } catch (error) {
    console.error(`❌ [PRESETS] Failed to apply preset:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * الحصول على جميع الإعدادات الافتراضية المتاحة
 * Get all available presets
 * @returns {Object} - قائمة الإعدادات الافتراضية
 */
function getAvailablePresets() {
  return IMAGE_PRESETS;
}

/**
 * إنشاء إعداد مخصص
 * Create custom preset
 * @param {string} name - اسم الإعداد
 * @param {Object} config - إعدادات الصور
 * @returns {Object} - الإعداد المخصص
 */
function createCustomPreset(name, config) {
  const customPreset = {
    description: config.description || 'إعداد مخصص',
    description_en: config.description_en || 'Custom preset',
    mode: config.mode || 'whitelist',
    requireText: config.requireText || false,
    pictureChannels: config.pictureChannels || []
  };
  
  return customPreset;
}

/**
 * التحقق من صحة إعدادات الصور
 * Validate image settings
 * @param {Object} settings - إعدادات الصور
 * @returns {Object} - نتيجة التحقق
 */
function validateImageSettings(settings) {
  const validModes = ['allow_all', 'block_all', 'whitelist', 'blacklist'];
  
  if (!settings.mode || !validModes.includes(settings.mode)) {
    return {
      valid: false,
      error: 'Invalid mode. Must be one of: ' + validModes.join(', ')
    };
  }
  
  if (typeof settings.requireText !== 'boolean') {
    return {
      valid: false,
      error: 'requireText must be a boolean'
    };
  }
  
  if (!Array.isArray(settings.pictureChannels)) {
    return {
      valid: false,
      error: 'pictureChannels must be an array'
    };
  }
  
  return { valid: true };
}

module.exports = {
  IMAGE_PRESETS,
  applyImagePreset,
  getAvailablePresets,
  createCustomPreset,
  validateImageSettings
};