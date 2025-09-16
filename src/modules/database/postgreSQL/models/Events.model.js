import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Events = sequelize.define('Events', {
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  event_id: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
  },
  event_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  event_channel: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  event_city: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  event_prizes: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  duration: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
  },
  h: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
  },
  m: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
  },
  apm: {
    type: DataTypes.STRING(5),
    allowNull: true,
    defaultValue: null,
  },
  days: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
  },
  TimeStamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'events',
  timestamps: false, // نستخدم TimeStamp المخصص بدلاً من createdAt/updatedAt
  indexes: [
    {
      fields: ['guild_id'],
    },
    {
      fields: ['event_id'],
    },
    {
      fields: ['event_channel'],
    },
    {
      fields: ['TimeStamp'],
    },
  ],
});

export default Events;