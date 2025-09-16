import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج مدة التحقق - Verify Duration Model
 * يحتوي على معرف المستخدم ومعرف الخادم ومدة التحقق والطابع الزمني
 */
const VerifyDur = sequelize.define('VerifyDur', {
  // معرف
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    comment: 'معرف'
  },
  
  // معرف المستخدم
  userId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'معرف المستخدم'
  },
  
  // معرف الخادم/الجيلد
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'معرف الخادم/الجيلد'
  },
  
  // مدة التحقق
  duration: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: '1h',
    comment: 'مدة التحقق'
  },
  
  // الطابع الزمني
  TimeStamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'الطابع الزمني'
  }
}, {
  tableName: 'verify_dur',
  timestamps: false, // نستخدم حقل TimeStamp المخصص
  indexes: [
    {
      fields: ['userId', 'guild_id'],
      unique: true // فهرس مركب فريد
    },
    {
      fields: ['userId']
    },
    {
      fields: ['guild_id']
    },
    {
      fields: ['TimeStamp']
    }
  ],
  comment: 'جدول مدة التحقق',
  hooks: {
    // تحديث الطابع الزمني عند التحديث (مثل ON UPDATE CURRENT_TIMESTAMP)
    beforeUpdate: (instance) => {
      instance.TimeStamp = new Date();
    }
  }
});

export default VerifyDur;