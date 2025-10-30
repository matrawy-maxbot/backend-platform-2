/**
 * نموذج الكلمات السيئة - BadWord Model
 * يدير قائمة الكلمات المحظورة وأنواع العقوبات في خوادم الديسكورد
 * Manages bad words list and punishment types for Discord servers
 * 
 * @fileoverview نموذج قاعدة البيانات لإدارة الكلمات المحظورة والعقوبات
 * @author Your Name
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج الكلمات السيئة
 * BadWord Model
 * 
 * يحتوي على قائمة الكلمات المحظورة مع تحديد نوع العقوبة المناسبة لكل خادم
 * Contains bad words list with appropriate punishment type for each server
 */
const BadWord = sequelize.define('BadWord', {
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
   * قائمة الكلمات المحظورة
   * Array of bad words to block
   */
  words: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'قائمة الكلمات المحظورة - Array of bad words to block'
  },

  /**
   * نوع العقوبة عند استخدام كلمة محظورة
   * Type of punishment when bad word is used
   * 
   * القيم المتاحة - Available values:
   * - warn: تحذير - Warning
   * - none: لا شيء - No action
   * - mute: كتم - Mute user
   * - kick: طرد - Kick user
   * - ban: حظر - Ban user
   */
  punishment_type: {
    type: DataTypes.ENUM('warn', 'none', 'mute', 'kick', 'ban'),
    defaultValue: 'warn',
    comment: 'نوع العقوبة عند استخدام كلمة محظورة - Type of punishment when bad word is used'
  },
}, {
  // إعدادات الجدول - Table Settings
  tableName: 'bad_words',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,

  // الفهارس - Indexes
  indexes: [
    {
      name: 'idx_bad_words_id',
      fields: ['id'],
      comment: 'فهرس لتحسين البحث بمعرف السجل - Index for optimizing id searches'
    },
    {
      name: 'idx_bad_words_server_id_unique',
      unique: true,
      fields: ['server_id'],
      comment: 'فهرس فريد لضمان خادم واحد لكل سجل - Unique index to ensure one record per server'
    },
    {
      name: 'idx_bad_words_punishment_type',
      fields: ['punishment_type'],
      comment: 'فهرس لتحسين البحث بنوع العقوبة - Index for optimizing punishment_type searches'
    },
  ],

  // تعليق الجدول - Table Comment
  comment: 'جدول الكلمات المحظورة وأنواع العقوبات في خوادم الديسكورد - Discord servers bad words and punishment types table'
});

/**
 * تصدير النموذج
 * Export the model
 */
export default BadWord;