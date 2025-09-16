import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول الروابط - Links Model
 * يحتوي على معلومات الروابط والدردشات لكل خادم
 */
const Links = sequelize.define('Links', {
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
    comment: 'معرف الخادم - Guild ID'
  },
  link: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
    comment: 'الرابط - Link URL'
  },
  chats: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'بيانات الدردشات - Chat data'
  },
  select_d: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
    comment: 'البيانات المحددة - Selected data'
  }
}, {
  tableName: 'links',
  timestamps: true, // إضافة createdAt و updatedAt
  indexes: [
    {
      unique: true,
      fields: ['guild_id']
    }
  ],
  comment: 'جدول الروابط والدردشات للخوادم'
});

export default Links;