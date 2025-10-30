const fs = require('fs').promises;
const path = require('path');

class SettingsManager {
  constructor(client) {
    this.client = client;
    this.settingsPath = path.join(__dirname, '../../data/manual-log-settings.json');
    this.settings = new Map();
    this.loadSettings();
  }

  /**
   * Load settings from file
   */
  async loadSettings() {
    try {
      const data = await fs.readFile(this.settingsPath, 'utf8');
      const settings = JSON.parse(data);
      
      for (const [guildId, config] of Object.entries(settings)) {
        this.settings.set(guildId, config);
      }
      
      console.log(`✅ Loaded manual log settings for ${this.settings.size} servers`);
      return this.settings.size;
    } catch (error) {
      console.error('❌ Error loading manual log settings:', error);
      return 0;
    }
  }

  /**
   * Save settings to file
   */
  async saveSettingsToFile() {
    try {
      const settingsObject = {};
      for (const [guildId, config] of this.settings.entries()) {
        settingsObject[guildId] = config;
      }
      
      await fs.writeFile(this.settingsPath, JSON.stringify(settingsObject, null, 2), 'utf8');
      console.log(`✅ Saved manual log settings for ${this.settings.size} servers`);
      return true;
    } catch (error) {
      console.error('❌ Error saving manual log settings:', error);
      return false;
    }
  }

  /**
   * Get settings for a specific server
   */
  async getServerSettings(guildId) {
    let serverSettings = this.settings.get(guildId);
    
    if (!serverSettings) {
      console.log(`⚠️ No settings found for guild ${guildId}, creating default settings...`);
      serverSettings = await this.createDefaultSettings(guildId);
    }
    
    return serverSettings;
  }

  /**
   * Update settings for a specific server
   */
  async updateServerSettings(guildId, newSettings) {
    try {
      const currentSettings = await this.getServerSettings(guildId);
      const updatedSettings = { ...currentSettings, ...newSettings, updatedAt: new Date().toISOString() };
      
      this.settings.set(guildId, updatedSettings);
      await this.saveSettingsToFile();
      
      console.log(`✅ Updated settings for guild ${guildId}`);
      return updatedSettings;
    } catch (error) {
      console.error(`❌ Error updating settings for guild ${guildId}:`, error);
      return null;
    }
  }

  /**
   * Create default settings for a new server
   */
  async createDefaultSettings(guildId) {
    try {
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) {
        console.log(`❌ Guild ${guildId} not found in cache`);
        return null;
      }

      console.log(`🔍 Creating default settings for guild: ${guild.name} (${guildId})`);

      // Search for a suitable log channel
      let defaultChannelId = null;
      
      // Search for channels containing keywords
      const logKeywords = ['log', 'logs', 'audit', 'moderation', 'mod', 'admin'];
      const logChannels = guild.channels.cache.filter(channel => 
        channel.type === 0 && // TEXT_CHANNEL
        logKeywords.some(keyword => channel.name.toLowerCase().includes(keyword))
      );

      if (logChannels.size > 0) {
        defaultChannelId = logChannels.first().id;
        console.log(`📍 Found log channel: ${logChannels.first().name} (${defaultChannelId})`);
      } else {
        // If no log channel found, use the first available text channel
        const textChannels = guild.channels.cache.filter(channel => channel.type === 0);
        if (textChannels.size > 0) {
          defaultChannelId = textChannels.first().id;
          console.log(`📍 Using first available text channel: ${textChannels.first().name} (${defaultChannelId})`);
        }
      }

      // Create default settings
      const defaultSettings = {
        serverId: guildId,
        enabled: true, // Enable system by default
        channelId: null,
        categories: {
          joinLeave: {
            enabled: true,
            channelId: defaultChannelId
          },
          kickBan: {
            enabled: true,
            channelId: defaultChannelId
          },
          members: {
            enabled: true,
            channelId: defaultChannelId
          },
          serverSettings: {
            enabled: true,
            channelId: defaultChannelId
          },
          roles: {
            enabled: true,
            channelId: defaultChannelId
          },
          messages: {
            enabled: true,
            channelId: defaultChannelId
          },
          adminActions: {
            enabled: false,
            channelId: null
          }
        },
        updatedAt: new Date().toISOString()
      };

      // Save settings to memory
      this.settings.set(guildId, defaultSettings);

      // Save settings to file
      await this.saveSettingsToFile();

      console.log(`✅ Created default settings for guild ${guildId} with channel ${defaultChannelId}`);
      return defaultSettings;

    } catch (error) {
      console.error(`❌ Error creating default settings for guild ${guildId}:`, error);
      return null;
    }
  }

  /**
   * Enable/disable a specific category
   */
  async toggleCategory(guildId, categoryName, enabled) {
    try {
      const serverSettings = await this.getServerSettings(guildId);
      if (!serverSettings) return false;

      if (!serverSettings.categories[categoryName]) {
        console.log(`❌ Category ${categoryName} not found for guild ${guildId}`);
        return false;
      }

      serverSettings.categories[categoryName].enabled = enabled;
      serverSettings.updatedAt = new Date().toISOString();

      this.settings.set(guildId, serverSettings);
      await this.saveSettingsToFile();

      console.log(`✅ ${enabled ? 'Enabled' : 'Disabled'} category ${categoryName} for guild ${guildId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error toggling category ${categoryName} for guild ${guildId}:`, error);
      return false;
    }
  }

  /**
   * Update channel for a specific category
   */
  async updateCategoryChannel(guildId, categoryName, channelId) {
    try {
      const serverSettings = await this.getServerSettings(guildId);
      if (!serverSettings) return false;

      if (!serverSettings.categories[categoryName]) {
        console.log(`❌ Category ${categoryName} not found for guild ${guildId}`);
        return false;
      }

      serverSettings.categories[categoryName].channelId = channelId;
      serverSettings.updatedAt = new Date().toISOString();

      this.settings.set(guildId, serverSettings);
      await this.saveSettingsToFile();

      console.log(`✅ Updated channel for category ${categoryName} in guild ${guildId} to ${channelId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error updating channel for category ${categoryName} in guild ${guildId}:`, error);
      return false;
    }
  }

  /**
   * Get all settings
   */
  getAllSettings() {
    return this.settings;
  }

  /**
   * Delete settings for a specific server
   */
  async deleteServerSettings(guildId) {
    try {
      this.settings.delete(guildId);
      await this.saveSettingsToFile();
      
      console.log(`✅ Deleted settings for guild ${guildId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting settings for guild ${guildId}:`, error);
      return false;
    }
  }

  /**
   * Reload settings from file
   */
  async reloadSettings() {
    this.settings.clear();
    return await this.loadSettings();
  }

  /**
   * Validate settings
   */
  validateSettings(settings) {
    const requiredFields = ['serverId', 'enabled', 'categories'];
    const requiredCategories = ['joinLeave', 'kickBan', 'members', 'serverSettings', 'roles', 'messages', 'adminActions'];

    // Check required fields
    for (const field of requiredFields) {
      if (!(field in settings)) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    // Check required categories
    if (!settings.categories || typeof settings.categories !== 'object') {
      return { valid: false, error: 'Categories must be an object' };
    }

    for (const category of requiredCategories) {
      if (!(category in settings.categories)) {
        return { valid: false, error: `Missing required category: ${category}` };
      }

      const categorySettings = settings.categories[category];
      if (typeof categorySettings.enabled !== 'boolean') {
        return { valid: false, error: `Category ${category} enabled must be boolean` };
      }
    }

    return { valid: true };
  }
}

module.exports = SettingsManager;