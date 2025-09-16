import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج المهام
 * يحتوي على معلومات المهام والمكافآت للمستخدمين
 */
const Missions = sequelize.define('Missions', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
    comment: 'معرف المهمة'
  },
  chat_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'نقاط الدردشة المطلوبة'
  },
  voice_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'نقاط الصوت المطلوبة'
  },
  passed_missions: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'المهام المكتملة (JSON أو نص)'
  },
  active_mission: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'المهمة النشطة الحالية'
  },
  crown_rewards: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'مكافآت التاج'
  },
  diamond_rewards: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'مكافآت الماس'
  },
  star_rewards: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'مكافآت النجمة'
  },
  support_rewards: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'مكافآت الدعم'
  },
  programmer_rewards: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'مكافآت المبرمج'
  },
  youtube_rewards: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'مكافآت يوتيوب'
  }
}, {
  tableName: 'missions',
  timestamps: true, // إضافة createdAt و updatedAt
  indexes: [
    {
      unique: true,
      fields: ['id']
    }
  ]
});

export default Missions;