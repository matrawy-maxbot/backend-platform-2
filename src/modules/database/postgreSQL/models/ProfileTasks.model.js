import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const ProfileTasks = sequelize.define('ProfileTasks', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    index: true
  },
  profile_ch_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  tasks_ch_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  profile_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  bot_dur: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  s_members: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  s_online: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  s_boosts: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  s_votes: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  s_chat: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  bd_shard: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  sm_shard: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  so_shard: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  sb_shard: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  sv_shard: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  si_shard: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
}, {
  tableName: 'profile_tasks',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['guild_id']
    },
    {
      fields: ['profile_id']
    }
  ]
});

export default ProfileTasks;