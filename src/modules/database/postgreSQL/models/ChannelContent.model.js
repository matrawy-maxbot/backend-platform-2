/**
 * نموذج محتوى القنوات - ChannelContent Model
 * يدير إعدادات حظر المحتوى في قنوات الديسكورد
 * Manages content blocking settings for Discord channels
 * 
 * @fileoverview نموذج قاعدة البيانات لإدارة إعدادات حظر المحتوى في القنوات
 * @author Your Name
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج محتوى القنوات
 * Channel Content Model
 * 
 * يحتوي على إعدادات حظر أنواع مختلفة من المحتوى في قنوات الديسكورد
 * Contains settings for blocking different types of content in Discord channels
 */
const ChannelContent = sequelize.define('ChannelContent', {
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
   * قائمة القنوات المحظور فيها الصور
   * Array of channel IDs where images are blocked
   */
  block_images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'قائمة معرفات القنوات المحظور فيها الصور - Array of channel IDs where images are blocked'
  },

  /**
   * قائمة القنوات المحظور فيها الرسائل النصية
   * Array of channel IDs where text messages are blocked
   */
  block_text_messages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'قائمة معرفات القنوات المحظور فيها الرسائل النصية - Array of channel IDs where text messages are blocked'
  },

  /**
   * قائمة القنوات المحظور فيها مرفقات الملفات
   * Array of channel IDs where file attachments are blocked
   */
  block_file_attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'قائمة معرفات القنوات المحظور فيها مرفقات الملفات - Array of channel IDs where file attachments are blocked'
  },

  /**
   * قائمة القنوات المحظور فيها أوامر البوت
   * Array of channel IDs where bot commands are blocked
   */
  block_bot_commands: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'قائمة معرفات القنوات المحظور فيها أوامر البوت - Array of channel IDs where bot commands are blocked'
  },

}, {
  // إعدادات الجدول - Table Settings
  tableName: 'channels_content',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,

  // الفهارس - Indexes
  indexes: [
    {
      name: 'idx_channels_content_id',
      fields: ['id'],
      comment: 'فهرس لتحسين البحث بمعرف السجل - Index for optimizing record_id searches'
    },
    {
      name: 'idx_channels_content_server_id_unique',
      unique: true,
      fields: ['server_id'],
      comment: 'فهرس فريد لضمان خادم واحد لكل سجل - Unique index to ensure one record per server'
    }
  ],

  // تعليق الجدول - Table Comment
  comment: 'جدول إعدادات حظر المحتوى في قنوات الديسكورد - Discord channels content blocking settings table'
});

/**
 * تصدير النموذج
 * Export the model
 */
export default ChannelContent;