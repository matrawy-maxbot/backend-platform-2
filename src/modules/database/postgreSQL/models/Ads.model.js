import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Ads = sequelize.define('Ads', {
  ad_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
    comment: 'معرف الإعلان - Advertisement ID'
  },
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'معرف الخادم - Guild ID'
  },
  ad_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    comment: 'اسم الإعلان - Advertisement Name'
  },
  ad_channel: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
    comment: 'قناة الإعلان - Advertisement Channel'
  },
  ad_timezone: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'المنطقة الزمنية للإعلان - Advertisement Timezone'
  },
  ad_city: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
    comment: 'مدينة الإعلان - Advertisement City'
  },
  ad_text: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'نص الإعلان - Advertisement Text'
  },
  ad_time_dir: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
    comment: 'اتجاه وقت الإعلان - Advertisement Time Direction'
  },
  d: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
    comment: 'اليوم - Day'
  },
  h: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
    comment: 'الساعة - Hour'
  },
  m: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
    comment: 'الدقيقة - Minute'
  },
  apm: {
    type: DataTypes.STRING(5),
    allowNull: true,
    defaultValue: null,
    comment: 'صباحاً/مساءً - AM/PM'
  },
  repeat: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
    comment: 'التكرار - Repeat'
  },
  days: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
    comment: 'الأيام - Days'
  },
  TimeStamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'الطابع الزمني - Timestamp'
  }
}, {
  tableName: 'ads',
  timestamps: true,
  createdAt: 'updatedAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['ad_id'],
    },
    {
      fields: ['guild_id'],
    },
    {
      fields: ['ad_channel'],
    },
    {
      fields: ['TimeStamp'],
    }
  ],
});

export default Ads;