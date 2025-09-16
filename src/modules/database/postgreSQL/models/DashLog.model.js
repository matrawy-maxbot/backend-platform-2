import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج DashLog - يمثل جدول سجل لوحة التحكم في قاعدة البيانات
 * DashLog Model - Represents the dashboard log table in the database
 */
const DashLog = sequelize.define('DashLog', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    comment: 'معرف'
  },
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'معرف الخادم - Server/Guild ID'
  },
  userID: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'معرف المستخدم - User ID'
  },
  pageName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'اسم الصفحة - Page name'
  },
  EventTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'وقت الحدث - Event timestamp'
  }
}, {
  tableName: 'dash_log',
  timestamps: false, // نستخدم EventTime المخصص بدلاً من createdAt/updatedAt الافتراضية
  indexes: [
    {
      fields: ['guild_id'],
      name: 'idx_dash_log_guild_id'
    },
    {
      fields: ['userID'],
      name: 'idx_dash_log_user_id'
    },
    {
      fields: ['pageName'],
      name: 'idx_dash_log_page_name'
    },
    {
      fields: ['EventTime'],
      name: 'idx_dash_log_event_time'
    },
    {
      fields: ['guild_id', 'userID'],
      name: 'idx_dash_log_guild_user'
    },
    {
      fields: ['guild_id', 'EventTime'],
      name: 'idx_dash_log_guild_time'
    }
  ],
  hooks: {
    beforeUpdate: (instance) => {
      // تحديث EventTime عند التعديل (محاكاة ON UPDATE CURRENT_TIMESTAMP)
      instance.EventTime = new Date();
    }
  }
});

export default DashLog;