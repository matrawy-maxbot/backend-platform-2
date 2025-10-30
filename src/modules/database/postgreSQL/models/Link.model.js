/**
 * نموذج الروابط - Link Model
 * يدير قواعد حظر أو السماح بالروابط والكلمات المفتاحية في خوادم الديسكورد
 * Manages link and keyword blocking/allowing rules for Discord servers
 * 
 * @fileoverview نموذج قاعدة البيانات لإدارة قواعد الروابط والكلمات المفتاحية
 * @author Your Name
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج الروابط
 * Link Model
 * 
 * يحتوي على قواعد حظر أو السماح بالروابط والكلمات المفتاحية مع تحديد الإجراءات المناسبة
 * Contains rules for blocking or allowing links and keywords with appropriate actions
 */
const Link = sequelize.define('Link', {
  /**
   * معرف فريد للسجل
   * Unique record identifier
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف فريد للسجل - Unique record identifier'
  },

  /**
   * معرف خادم الديسكورد
   * Discord Server ID
   */
  server_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'معرف خادم الديسكورد - Discord Server ID'
  },

  /**
   * الرابط أو الكلمة المفتاحية المراد حظرها أو السماح بها
   * Link or keyword to block or allow
   */
  link_or_keyword: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'الرابط أو الكلمة المفتاحية المراد حظرها أو السماح بها - Link or keyword to block or allow'
  },

  /**
   * نوع الإجراء المتخذ عند اكتشاف الرابط أو الكلمة المفتاحية
   * Action type to take when link or keyword is detected
   * 
   * القيم المتاحة - Available values:
   * - allow: السماح - Allow
   * - delete: حذف الرسالة - Delete message
   * - kick: طرد العضو - Kick member
   * - ban: حظر العضو - Ban member
   */
  action_type: {
    type: DataTypes.ENUM('allow', 'delete', 'kick', 'ban'),
    defaultValue: 'delete',
    comment: 'نوع الإجراء المتخذ عند اكتشاف الرابط - Action type when link is detected'
  },

  /**
   * قائمة القنوات التي تطبق عليها القاعدة
   * Array of channel IDs where rule applies
   * 
   * إذا كانت فارغة، فإن القاعدة تطبق على جميع القنوات
   * If empty, rule applies to all channels
   */
  channels: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'قائمة معرفات القنوات التي تطبق عليها القاعدة (فارغة = جميع القنوات) - Array of channel IDs where rule applies (empty = all channels)'
  },
}, {
  // إعدادات الجدول - Table Settings
  tableName: 'links',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,

  // الفهارس - Indexes
  indexes: [
    {
      name: 'idx_links_server_id',
      fields: ['server_id'],
      comment: 'فهرس لتحسين البحث بمعرف الخادم - Index for optimizing server_id searches'
    },
    {
      name: 'idx_links_action_type',
      fields: ['action_type'],
      comment: 'فهرس لتحسين البحث بنوع الإجراء - Index for optimizing action_type searches'
    },
  ],

  // تعليق الجدول - Table Comment
  comment: 'جدول قواعد الروابط والكلمات المفتاحية في خوادم الديسكورد - Discord servers link and keyword rules table'
});

/**
 * تصدير النموذج
 * Export the model
 */
export default Link;