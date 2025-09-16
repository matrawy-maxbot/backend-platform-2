import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول كتم الدردشة (MuteChat)
 * يحتوي على معلومات المستخدمين المكتومين في الدردشة
 */
const MuteChat = sequelize.define('MuteChat', {
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
    comment: 'بيانات الكتم'
  }
}, {
  tableName: 'mute_chat',
  timestamps: true, // إضافة createdAt و updatedAt تلقائياً
  indexes: [
    {
      unique: true,
      fields: ['id'] // فهرس فريد على المعرف
    }
  ],
  comment: 'جدول كتم الدردشة - يحتوي على معلومات المستخدمين المكتومين في الدردشة'
});

export default MuteChat;