import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Areply = sequelize.define('Areply', {
  div_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    comment: 'معرف القسم - Division ID'
  },
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'معرف الخادم - Guild ID'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'الرسالة - Message'
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'الرد - Reply'
  }
}, {
  tableName: 'areply',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['guild_id'],
    },
    {
      fields: ['div_id'],
    }
  ],
});

export default Areply;