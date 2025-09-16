import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول كتم الصوت (MuteVoice)
 * يحتوي على معلومات المستخدمين المكتومين في الصوت
 */
const MuteVoice = sequelize.define('MuteVoice', {
  id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
    comment: 'معرف المستخدم أو الخادم'
  },
  mutes: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'بيانات الكتم الصوتي'
  }
}, {
  tableName: 'mute_voice',
  timestamps: true, // إضافة createdAt و updatedAt تلقائياً
  indexes: [
    {
      unique: true,
      fields: ['id'] // فهرس فريد على المعرف
    }
  ],
  comment: 'جدول كتم الصوت - يحتوي على معلومات المستخدمين المكتومين في الصوت'
});

export default MuteVoice;