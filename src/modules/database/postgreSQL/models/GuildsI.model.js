import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const GuildsI = sequelize.define('GuildsI', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'guilds_i',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['id'],
    },
  ],
});

export default GuildsI;