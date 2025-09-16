import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Backup = sequelize.define('Backup', {
  guild_id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
    comment: 'معرف الخادم - Guild ID'
  },
  server_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
    comment: 'اسم الخادم - Server Name'
  },
  inactive_ch: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
    comment: 'قناة عدم النشاط - Inactive Channel'
  },
  inactive_Timeout: {
    type: DataTypes.STRING(5),
    allowNull: true,
    defaultValue: null,
    comment: 'مهلة عدم النشاط - Inactive Timeout'
  },
  system_messages: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
    comment: 'رسائل النظام - System Messages'
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'الفئات - Categories'
  },
  chat: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'قنوات الدردشة - Chat Channels'
  },
  voice: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'قنوات الصوت - Voice Channels'
  },
  announcement: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'قنوات الإعلانات - Announcement Channels'
  },
  stage: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'قنوات المنصة - Stage Channels'
  },
  roles: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'الأدوار - Roles'
  },
  TimeStamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'الطابع الزمني - Timestamp'
  }
}, {
  tableName: 'backup',
  timestamps: false, // نستخدم TimeStamp المخصص بدلاً من createdAt/updatedAt
  indexes: [
    {
      fields: ['guild_id'],
    },
    {
      fields: ['server_name'],
    },
    {
      fields: ['TimeStamp'],
    }
  ],
  hooks: {
    beforeUpdate: (instance) => {
      instance.TimeStamp = new Date();
    }
  }
});

export default Backup;