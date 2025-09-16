import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Giveaway = sequelize.define('Giveaway', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
  },
  channel: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  number: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prizes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'giveaway',
  timestamps: false, // نستخدم timestamp المخصص بدلاً من createdAt/updatedAt
  indexes: [
    {
      fields: ['id'],
    },
    {
      fields: ['channel'],
    },
    {
      fields: ['timestamp'],
    },
    {
      fields: ['time'],
    },
  ],
});

export default Giveaway;