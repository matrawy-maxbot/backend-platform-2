import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج تفاعلات الخوادم
 * يحتوي على معلومات تفاعل المستخدمين في الخوادم المختلفة
 */
const ServersInteractions = sequelize.define('ServersInteractions', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    comment: 'معرف التفاعل'
  },
  user_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'معرف المستخدم'
  },
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'معرف الخادم/الجيلد'
  },
  chat_points: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'نقاط الدردشة'
  },
  voice_points: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'نقاط الصوت'
  },
  chat_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
    comment: 'مستوى الدردشة'
  },
  voice_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
    comment: 'مستوى الصوت'
  }
}, {
  tableName: 'servers_interactions',
  timestamps: true, // إضافة createdAt و updatedAt
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['guild_id']
    },
    {
      fields: ['user_id', 'guild_id'] // فهرس مركب فريد
    }
  ]
});

export default ServersInteractions;