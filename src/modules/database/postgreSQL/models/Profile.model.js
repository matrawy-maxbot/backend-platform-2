import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
  },
  credits: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  xp: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  country: {
    type: DataTypes.STRING(30),
    allowNull: true,
    defaultValue: null,
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null,
  },
  backgrounds: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]', // JSON array as string
  },
  active_background: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'profiles',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['id'],
    },
    {
      fields: ['city'],
    },
  ],
});

export default Profile;