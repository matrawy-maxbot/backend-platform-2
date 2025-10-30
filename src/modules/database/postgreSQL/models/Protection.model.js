import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج الحماية - Protection Model
 * يدير إعدادات الحماية والأمان لخوادم الديسكورد
 * Manages protection and security settings for Discord servers
 * 
 * @param {Object} sequelize - مثيل Sequelize / Sequelize instance
 * @returns {Object} نموذج Protection / Protection model
 */
const Protection = sequelize.define('Protection', {
  // المعرف الفريد - Unique identifier
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف فريد للسجل - Unique record identifier'
  },

  // معرف خادم الديسكورد - Discord Server ID
  server_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'معرف خادم الديسكورد - Discord Server ID'
  },
  
  // قسم إدارة البوتات - Bot Management Section
  bot_management_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'تفعيل/إلغاء تفعيل ميزات إدارة البوتات - Enable/disable bot management features'
  },
  disallow_bots: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'منع البوتات الجديدة من الانضمام للخادم - Prevent new bots from joining the server'
  },
  delete_repeated_messages: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'حذف الرسائل المكررة تلقائياً - Automatically remove duplicate messages'
  },
  
  // قسم ضوابط الإشراف - Moderation Controls Section
  moderation_controls_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'تفعيل/إلغاء تفعيل ضوابط الإشراف - Enable/disable moderation controls'
  },
  max_punishment_type: {
    type: DataTypes.ENUM('kick', 'remove_roles', 'ban'),
    defaultValue: 'kick',
    allowNull: false,
    comment: 'اختيار نوع عقوبة العضو - Select the member\'s punishment type'
  },
  max_kick_ban_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 1,
      max: 100
    },
    comment: 'الحد الأقصى للطرد والحظر المسموح (1-100) - Maximum kicks and bans allowed (1-100)'
  },
  
  // مفاتيح تصفية المحتوى - Content Filtering Toggles
  bad_words: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'تفعيل/إلغاء تفعيل فلتر الكلمات السيئة - Enable/disable bad words filter'
  },
  links: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'تفعيل/إلغاء تفعيل فلتر الروابط - Enable/disable links filter'
  },
  channels_content: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'تفعيل/إلغاء تفعيل فلتر محتوى القنوات - Enable/disable channels content filter'
  }
}, {
  // إعدادات الجدول - Table settings
  tableName: 'protections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  
  // الفهارس - Indexes
  indexes: [
    {
      fields: ['id'],
      name: 'protections_id_unique',
      comment: 'فهرس فريد لضمان خادم واحد لكل سجل - Unique index to ensure one record per server'
    },
    {
      unique: true,
      fields: ['server_id'],
      name: 'protections_server_id_unique',
      comment: 'فهرس فريد لضمان خادم واحد لكل سجل - Unique index to ensure one record per server'
    },
    {
      fields: ['bot_management_enabled'],
      name: 'protections_bot_management_enabled_idx',
      comment: 'فهرس لتحسين البحث بتفعيل إدارة البوتات - Index for optimizing bot management enabled searches'
    },
    {
      fields: ['moderation_controls_enabled'],
      name: 'protections_moderation_controls_enabled_idx',
      comment: 'فهرس لتحسين البحث بتفعيل ضوابط الإشراف - Index for optimizing moderation controls enabled searches'
    },
    {
      fields: ['max_punishment_type'],
      name: 'protections_max_punishment_type_idx',
      comment: 'فهرس لتحسين البحث بنوع العقوبة - Index for optimizing max_punishment_type searches'
    },
    {
      fields: ['bad_words', 'links', 'channels_content'],
      name: 'protections_content_filters_idx',
      comment: 'فهرس لتحسين البحث بمفاتيح تصفية المحتوى - Index for optimizing content filters searches'
    }
  ]
});

export default Protection;