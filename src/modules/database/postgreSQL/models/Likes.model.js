import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج الإعجابات - Likes Model
 * يحتوي على معرف المستخدم/العنصر والإعجابات المرتبطة به
 */
const Likes = sequelize.define('Likes', {
  // معرف المستخدم أو العنصر
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
    comment: 'معرف المستخدم'
  },
  
  // بيانات الإعجابات (JSON أو نص)
  likes: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'بيانات الإعجابات المخزنة'
  }
}, {
  tableName: 'likes',
  timestamps: true, // إضافة createdAt و updatedAt
  indexes: [
    {
      fields: ['id'],
      unique: true
    }
  ],
  comment: 'جدول الإعجابات'
});

export default Likes;