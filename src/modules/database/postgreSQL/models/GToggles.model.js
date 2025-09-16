import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const GToggles = sequelize.define('GToggles', {
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
  },
  welcome_image: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  wi_channel: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  welcome_message: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  wm_channel: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  wm_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  departure_message: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  dm_channel: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  dm_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  auto_role: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  ar_role: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  activate_members: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  auto_log: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  manual_log: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  ml_jl: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  ml_kb: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  ml_members: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  ml_message: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  ml_ss: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  ml_channels: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  ml_roles: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  drm: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  ab: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  kick_ban: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  kb_max: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
  },
  kb_punish: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  bad_words: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  bw_words: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bw_punish: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
  },
  servers_links: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  pic_channels: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bot_commands_chs: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'g_toggles',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    { fields: ['guild_id'] },
    { fields: ['wi_channel'] },
    { fields: ['wm_channel'] },
    { fields: ['dm_channel'] },
  ],
});

export default GToggles;