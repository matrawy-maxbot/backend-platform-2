import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const KB = sequelize.define('KB', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  kb_length: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'k_b',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    { fields: ['guild_id'] },
    { fields: ['userId'] },
  ],
});

export default KB;