import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج اليومي - Daily Model
 * يحتوي على معرف المستخدم وطابع زمني للنشاط اليومي
 */
const Daily = sequelize.define('Daily', {
  // معرف المستخدم
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
    comment: 'معرف المستخدم'
  },
  
  // الطابع الزمني للنشاط اليومي
  daily: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'الطابع الزمني للنشاط اليومي'
  }
}, {
  tableName: 'daily',
  timestamps: false, // نستخدم حقل daily بدلاً من timestamps التلقائية
  indexes: [
    {
      fields: ['id'],
      unique: true
    },
    {
      fields: ['daily']
    }
  ],
  comment: 'جدول النشاط اليومي',
  hooks: {
    // تحديث الطابع الزمني عند التحديث (مثل ON UPDATE CURRENT_TIMESTAMP)
    beforeUpdate: (instance) => {
      instance.daily = new Date();
    }
  }
});

export default Daily;