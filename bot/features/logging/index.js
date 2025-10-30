/**
 * Main Logging System
 * Centralized logging system for Discord bot events
 */

const SettingsManager = require('./settings-manager');
const MembersLogger = require('./members');
const MemberUpdatesLogger = require('./member-updates');
const AdminActionsLogger = require('./admin-actions');
const MessagesLogger = require('./messages');
const ChannelsLogger = require('./channels');
const ServerSettingsLogger = require('./server-settings');

class LoggingSystem {
  constructor(client) {
    this.client = client;
    
    // Create settings manager with client
    this.settingsManager = new SettingsManager(client);
    
    // Create specialized logging systems
    this.membersLogger = new MembersLogger(client, this.settingsManager);
    this.memberUpdatesLogger = new MemberUpdatesLogger(client, this.settingsManager);
    this.adminActionsLogger = new AdminActionsLogger(client, this.settingsManager);
    this.messagesLogger = new MessagesLogger(client, this.settingsManager);
    this.channelsLogger = new ChannelsLogger(client, this.settingsManager);
    this.serverSettingsLogger = new ServerSettingsLogger(client, this.settingsManager);
  }

  // ==================== Settings Management ====================

  /**
   * Get settings for a specific server
   */
  async getServerSettings(guildId) {
    return await this.settingsManager.getServerSettings(guildId);
  }

  /**
   * Update settings for a specific server
   */
  async updateServerSettings(guildId, settings) {
    return await this.settingsManager.updateServerSettings(guildId, settings);
  }

  /**
   * Enable/disable a specific category
   */
  async toggleCategory(guildId, category, enabled) {
    return await this.settingsManager.toggleCategory(guildId, category, enabled);
  }

  /**
   * Update channel for a specific category
   */
  async updateCategoryChannel(guildId, category, channelId) {
    return await this.settingsManager.updateCategoryChannel(guildId, category, channelId);
  }

  // ==================== Member Events Logging ====================

  /**
   * Log member join/leave events
   */
  async logMemberJoinLeave(member, action) {
    return await this.membersLogger.logMemberJoinLeave(member, action);
  }

  /**
   * Log member kick/ban events
   */
  async logMemberKickBan(guild, user, action, executor, reason) {
    return await this.membersLogger.logMemberKickBan(guild, user, action, executor, reason);
  }

  /**
   * Log member updates
   */
  async logMemberUpdate(oldMember, newMember) {
    return await this.memberUpdatesLogger.logMemberUpdate(oldMember, newMember);
  }

  /**
   * Log member mute events
   */
  async logMemberMute(member, action, executor, reason) {
    return await this.memberUpdatesLogger.logMemberMute(member, action, executor, reason);
  }

  /**
   * Log member move events
   */
  async logMemberMove(member, oldChannel, newChannel) {
    return await this.memberUpdatesLogger.logMemberMove(member, oldChannel, newChannel);
  }

  /**
   * Log voice state updates
   */
  async logVoiceStateUpdate(oldState, newState) {
    return await this.memberUpdatesLogger.logVoiceStateUpdate(oldState, newState);
  }

  // ==================== Role Events Logging ====================

  /**
   * Log role changes
   */
  async logRoleChange(role, action, executor) {
    // Can add RoleLogger later if needed
  }

  /**
   * Log member role changes
   */
  async logMemberRoleChange(member, addedRoles, removedRoles, executor) {
    return await this.memberUpdatesLogger.logMemberRoleChange(member, addedRoles, removedRoles, executor);
  }

  // ==================== Channel Events Logging ====================

  /**
   * Log channel changes
   */
  async logChannelChange(channel, action, executor, changes) {
    return await this.channelsLogger.logChannelChange(channel, action, executor, changes);
  }

  /**
   * Log channel permission changes
   */
  async logChannelPermissionChange(channel, target, executor, oldPermissions, newPermissions) {
    return await this.channelsLogger.logChannelPermissionChange(channel, target, executor, oldPermissions, newPermissions);
  }

  // ==================== Server Events Logging ====================

  /**
   * Log server changes (name, icon, etc.)
   */
  async logServerChange(oldGuild, newGuild, executor) {
    return await this.serverSettingsLogger.logServerChange(oldGuild, newGuild, executor);
  }

  // ==================== Message Events Logging ====================

  /**
   * Log message deletion
   */
  async logMessageDelete(message) {
    return await this.messagesLogger.logMessageDelete(message);
  }

  /**
   * Log message edit
   */
  async logMessageEdit(oldMessage, newMessage) {
    return await this.messagesLogger.logMessageEdit(oldMessage, newMessage);
  }

  /**
   * Log bulk message deletion
   */
  async logBulkMessageDelete(messages, channel) {
    return await this.messagesLogger.logBulkMessageDelete(messages, channel);
  }

  /**
   * Log message pin/unpin
   */
  async logMessagePin(message, action, executor) {
    return await this.messagesLogger.logMessagePin(message, action);
  }

  // ==================== Administrative Actions Logging ====================

  /**
   * Log administrative actions
   */
  async logAdminAction(guild, action, target, executor, reason, data) {
    return await this.adminActionsLogger.logAdminAction(guild, action, target, executor, reason, data);
  }

  /**
   * Log permission changes
   */
  async logPermissionChange(guild, target, executor, oldPermissions, newPermissions) {
    return await this.adminActionsLogger.logPermissionChange(guild, target, executor, oldPermissions, newPermissions);
  }

  /**
   * Log administrative server settings changes
   */
  async logServerSettingsChange(guild, executor, changes) {
    return await this.adminActionsLogger.logServerSettingsChange(guild, executor, changes);
  }

  // ==================== Helper Functions ====================

  /**
   * Create default settings for a new server
   */
  async createDefaultSettings(guildId) {
    return await this.settingsManager.createDefaultSettings(guildId);
  }

  /**
   * Reload settings
   */
  async reloadSettings() {
    return await this.settingsManager.reloadSettings();
  }

  /**
   * Get all settings
   */
  async getAllSettings() {
    return await this.settingsManager.getAllSettings();
  }

  /**
   * Delete settings for a specific server
   */
  async deleteServerSettings(guildId) {
    return await this.settingsManager.deleteServerSettings(guildId);
  }

  // ==================== Legacy System Compatibility Functions ====================

  /**
   * Legacy compatibility function - log member actions
   */
  async logMemberAction(guild, user, action, executor, reason, additionalData = {}) {
    // Determine action type and route to appropriate function
    switch (action) {
      case 'join':
        return await this.logMemberJoinLeave({ user, guild }, 'join');
      
      case 'leave':
        return await this.logMemberJoinLeave({ user, guild }, 'leave');
      
      case 'kick':
        return await this.logMemberKickBan(guild, user, 'kick', executor, reason);
      
      case 'ban':
        return await this.logMemberKickBan(guild, user, 'ban', executor, reason);
      
      case 'unban':
        return await this.logMemberKickBan(guild, user, 'unban', executor, reason);
      
      case 'timeout':
      case 'timeout_remove':
      case 'voice_mute':
      case 'voice_unmute':
      case 'voice_deafen':
      case 'voice_undeafen':
        return await this.logAdminAction(guild, action, user, executor, reason, additionalData);
      
      case 'role_add':
      case 'role_remove':
        if (additionalData.role) {
          const roles = action === 'role_add' ? [additionalData.role] : [];
          const removedRoles = action === 'role_remove' ? [additionalData.role] : [];
          return await this.logMemberRoleChange({ user, guild }, roles, removedRoles, executor);
        }
        break;
      
      case 'nickname_change':
        return await this.logAdminAction(guild, action, user, executor, reason, additionalData);
      
      default:
        console.log(`Unknown member action: ${action}`);
    }
  }

  /**
   * Legacy compatibility function - log message changes
   */
  async logMessageChange(message, action, oldContent = null) {
    switch (action) {
      case 'delete':
        return await this.logMessageDelete(message);
      
      case 'edit':
        if (oldContent) {
          const oldMessage = { ...message, content: oldContent };
          return await this.logMessageEdit(oldMessage, message);
        }
        break;
      
      default:
        console.log(`Unknown message action: ${action}`);
    }
  }

  /**
   * Handle member updates (nickname, mute, deafen, timeout changes)
   */
  async handleMemberUpdate(oldMember, newMember) {
    return await this.membersLogger.handleMemberUpdate(oldMember, newMember);
  }

  /**
   * Legacy compatibility function - log member updates
   */
  async logMemberUpdates(oldMember, newMember) {
    return await this.logMemberUpdate(oldMember, newMember);
  }

  /**
   * Legacy compatibility function - log bot changes
   */
  async logBotChange(guild, changes) {
    // Bot changes can be handled as admin action or special event
  }
}

module.exports = LoggingSystem;