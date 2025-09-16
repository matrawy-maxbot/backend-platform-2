import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج Codes - يمثل جدول الرموز في قاعدة البيانات
 * Codes Model - Represents the codes table in the database
 */
const Codes = sequelize.define('Codes', {
  code: {
    type: DataTypes.STRING(8),
    primaryKey: true,
    allowNull: false,
    comment: 'رمز فريد - Unique code'
  },
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'معرف الخادم - Server/Guild ID'
  },
  users: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'بيانات المستخدمين - Users data'
  },
  dur: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'المدة - Duration'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'وقت الإنشاء - Creation timestamp'
  }
}, {
  tableName: 'codes',
  timestamps: false, // نستخدم timestamp المخصص بدلاً من createdAt/updatedAt الافتراضية
  indexes: [
    {
      fields: ['code'],
      name: 'idx_codes_code'
    },
    {
      fields: ['guild_id'],
      name: 'idx_codes_guild_id'
    },
    {
      fields: ['timestamp'],
      name: 'idx_codes_timestamp'
    },
    {
      fields: ['guild_id', 'code'],
      name: 'idx_codes_guild_code'
    }
  ],
  hooks: {
    beforeUpdate: (instance) => {
      // تحديث timestamp عند التعديل (محاكاة ON UPDATE CURRENT_TIMESTAMP)
      instance.timestamp = new Date();
    }
  }
});

export default Codes;